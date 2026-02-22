import { Box, Paper, Typography, Container, Breadcrumbs, Link, IconButton, Stack, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CompetitionForm from "./CompetitionForm";
import EditionFormDialog from "./EditionFormDialog";
import { apiGet } from "../../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListIcon from "@mui/icons-material/List";
import { Button } from "@mui/material";

function CompetitionManagementPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [editions, setEditions] = useState([]);
    const [loading, setLoading] = useState(!!id);
    const [editionDialogOpen, setEditionDialogOpen] = useState(false);
    const [editionToEdit, setEditionToEdit] = useState(null);

    const fetchEditions = () => {
        if (id) {
            apiGet(`/api/competitions/${id}/editions`)
                .then(setEditions)
                .catch(err => console.error("Error fetching editions:", err));
        }
    };

    useEffect(() => {
        if (id) {
            apiGet(`/api/competitions`)
                .then((data) => {
                    const comp = data.find(c => c.id === parseInt(id));
                    if (comp) {
                        setCompetition(comp);
                    }
                })
                .catch((err) => console.error("Error fetching competition:", err))
                .finally(() => setLoading(false));

            fetchEditions();
        }
    }, [id]);

    const handleSuccess = () => {
        navigate("/football-archive");
    };

    const handleDeleteEdition = async (editionId) => {
        if (window.confirm("Sei sicuro di voler eliminare questa edizione? Tutte le partite associate andranno perse.")) {
            try {
                // Assuming we add a delete endpoint or handle it via competition DAO
                // For now, let's assume we logic it out or just provide UI
                // await apiDelete(`/api/competitions/editions/${editionId}`);
                // fetchEditions();
            } catch (err) {
                console.error("Error deleting edition:", err);
            }
        }
    };

    const handleCancel = () => {
        navigate("/football-archive");
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={handleCancel} color="primary" sx={{ mr: 1 }}>
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
                            <Typography color="text.primary">
                                {id ? "Modifica Competizione" : "Nuova Competizione"}
                            </Typography>
                        </Breadcrumbs>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {id ? t("football.edit_competition", "Modifica Competizione") : t("football.add_competition", "Crea Nuova Competizione")}
                        </Typography>
                    </Box>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                >
                    {loading ? (
                        <Typography align="center">Caricamento...</Typography>
                    ) : (
                        <Stack spacing={4}>
                            <CompetitionForm
                                competitionToEdit={competition}
                                onSubmitSuccess={handleSuccess}
                                onCancel={handleCancel}
                            />

                            {id && (
                                <Box>
                                    <Divider sx={{ my: 4 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <ListIcon color="primary" />
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Edizioni / Stagioni
                                            </Typography>
                                        </Stack>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                setEditionToEdit(null);
                                                setEditionDialogOpen(true);
                                            }}
                                            size="small"
                                        >
                                            Aggiungi Edizione
                                        </Button>
                                    </Stack>

                                    {editions.length === 0 ? (
                                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover' }}>
                                            <Typography color="text.secondary">
                                                Nessuna edizione configurata. Aggiungi la prima per iniziare a inserire partite.
                                            </Typography>
                                        </Paper>
                                    ) : (
                                        <Stack spacing={2}>
                                            {editions.map((edition) => (
                                                <Paper
                                                    key={edition.id}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        '&:hover': { bgcolor: 'action.hover' }
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                            {edition.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {edition.metadata?.totalMatches || 0} partite • {edition.metadata?.maxParticipants || 'N/A'} partecipanti
                                                        </Typography>
                                                    </Box>
                                                    <Stack direction="row" spacing={1}>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => {
                                                                setEditionToEdit(edition);
                                                                setEditionDialogOpen(true);
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteEdition(edition.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    )}
                </Paper>

                <EditionFormDialog
                    open={editionDialogOpen}
                    onClose={() => setEditionDialogOpen(false)}
                    editionToEdit={editionToEdit}
                    competitionId={parseInt(id)}
                    onSuccess={fetchEditions}
                />
            </Stack>
        </Container>
    );
}

export default CompetitionManagementPage;
