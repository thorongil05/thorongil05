import {
    Box, Paper, Typography, Container, Breadcrumbs, Link,
    IconButton, Stack, Divider, Tooltip, Button, Tabs, Tab,
    Grid, Card, CardActionArea, TextField, Chip, CircularProgress, Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CompetitionForm from "./CompetitionForm";
import EditionEditor from "./EditionEditor";
import { apiGet, apiPost, apiDelete } from "../../../utils/api";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import LayersIcon from "@mui/icons-material/Layers";

function CompetitionManagementPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [competition, setCompetition] = useState(null);
    const [editions, setEditions] = useState([]);
    const [loading, setLoading] = useState(!!id);
    const [selectedEditionId, setSelectedEditionId] = useState(null);
    const [isAddingEdition, setIsAddingEdition] = useState(false);
    const [newEditionName, setNewEditionName] = useState("");

    const fetchEditions = () => {
        if (id) {
            apiGet(`/api/competitions/${id}/editions`)
                .then(data => {
                    setEditions(data);
                    if (data.length > 0 && !selectedEditionId) {
                        setSelectedEditionId(data[0].id);
                    }
                })
                .catch(err => console.error("Error fetching editions:", err));
        }
    };

    useEffect(() => {
        if (id) {
            apiGet(`/api/competitions`)
                .then((data) => {
                    const comp = data.find(c => c.id === parseInt(id));
                    if (comp) setCompetition(comp);
                })
                .catch((err) => console.error("Error fetching competition:", err))
                .finally(() => setLoading(false));

            fetchEditions();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleAddEdition = async () => {
        if (!newEditionName) return;
        try {
            const result = await apiPost(`/api/competitions/${id}/editions`, {
                name: newEditionName,
                metadata: { competitionFormat: 'LEAGUE', phasesCount: 1 }
            });
            setNewEditionName("");
            setIsAddingEdition(false);
            fetchEditions();
            setSelectedEditionId(result.id);
        } catch (err) {
            console.error("Error creating edition:", err);
        }
    };

    const handleDeleteEdition = async (editionId) => {
        if (window.confirm("Sei sicuro di voler eliminare questa edizione? Tutte le partite associate andranno perse.")) {
            try {
                await apiDelete(`/api/competitions/editions/${editionId}`);
                if (selectedEditionId === editionId) setSelectedEditionId(null);
                fetchEditions();
            } catch (err) {
                console.error("Error deleting edition:", err);
            }
        }
    };

    const handleCancel = () => {
        navigate("/football-archive");
    };

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack spacing={4}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton onClick={handleCancel} color="primary" sx={{ bgcolor: 'action.hover' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); navigate("/football-archive"); }}
                                >
                                    Football Archive
                                </Link>
                                <Typography color="text.primary">Manage</Typography>
                            </Breadcrumbs>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {competition ? competition.name : "Nuova Competizione"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Dashboard Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="competition dashboard tabs">
                        <Tab icon={<InfoIcon />} iconPosition="start" label="Dati Competizione" />
                        <Tab icon={<LayersIcon />} iconPosition="start" label="Edizioni e Struttura" disabled={!id} />
                    </Tabs>
                </Box>

                {/* Tab 1: Competition Setup */}
                {tab === 0 && (
                    <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%', mt: 2 }}>
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CompetitionForm
                                competitionToEdit={competition}
                                onSubmitSuccess={() => id ? null : navigate(`/football-archive/competition/edit/${id}`)}
                                onCancel={handleCancel}
                            />
                        </Paper>
                    </Box>
                )}

                {/* Tab 2: Editions Dashboard */}
                {tab === 1 && (
                    <Grid container spacing={3}>
                        {/* Master: Edition Sidebar */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default', height: '100%', minHeight: '600px' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                        STAGIONI ({editions.length})
                                    </Typography>
                                    {!isAddingEdition && (
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => setIsAddingEdition(true)}
                                            variant="text"
                                        >
                                            Nuova
                                        </Button>
                                    )}
                                </Stack>

                                <Stack spacing={1}>
                                    {isAddingEdition && (
                                        <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'primary.main', bgcolor: 'primary.light', bgopacity: 0.1 }}>
                                            <Stack spacing={2}>
                                                <TextField
                                                    size="small"
                                                    label="E.g. 2024/25"
                                                    autoFocus
                                                    fullWidth
                                                    value={newEditionName}
                                                    onChange={(e) => setNewEditionName(e.target.value)}
                                                    sx={{ bgcolor: 'background.paper' }}
                                                />
                                                <Stack direction="row" spacing={1}>
                                                    <Button fullWidth size="small" variant="contained" onClick={handleAddEdition}>Aggiungi</Button>
                                                    <Button fullWidth size="small" onClick={() => setIsAddingEdition(false)}>Annulla</Button>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    )}

                                    {editions.map(edition => (
                                        <Card
                                            key={edition.id}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 2,
                                                borderColor: selectedEditionId === edition.id ? 'primary.main' : 'divider',
                                                bgcolor: selectedEditionId === edition.id ? 'primary.light' : 'background.paper',
                                                bgopacity: 0.05,
                                                transition: 'all 0.2s',
                                                '&:hover': { borderColor: 'primary.main' }
                                            }}
                                        >
                                            <CardActionArea
                                                onClick={() => setSelectedEditionId(edition.id)}
                                                sx={{ p: 2 }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{edition.name}</Typography>
                                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                    <Chip
                                                        label={edition.metadata?.totalMatches || 0}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ height: 16, fontSize: '0.6rem' }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">Partite</Typography>
                                                </Stack>
                                            </CardActionArea>
                                        </Card>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Detail: Technical Config */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, bgcolor: 'background.paper', height: '100%' }}>
                                <EditionEditor
                                    editionId={selectedEditionId}
                                    onUpdate={fetchEditions}
                                    onDelete={handleDeleteEdition}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Stack>
        </Container>
    );
}

export default CompetitionManagementPage;
