import { Box, Paper, Typography, Container, Breadcrumbs, Link, IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CompetitionForm from "./CompetitionForm";
import { apiGet } from "../../../utils/api";

function CompetitionManagementPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(!!id);

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
        }
    }, [id]);

    const handleSuccess = () => {
        navigate("/football-archive");
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
                        <CompetitionForm
                            competitionToEdit={competition}
                            onSubmitSuccess={handleSuccess}
                            onCancel={handleCancel}
                        />
                    )}
                </Paper>
            </Stack>
        </Container>
    );
}

export default CompetitionManagementPage;
