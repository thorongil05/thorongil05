import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../../utils/api";
import PropTypes from "prop-types";

function CompetitionProgress({ competition, refreshTrigger }) {
    const { t } = useTranslation();
    const [matchesCount, setMatchesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const totalMatches = competition?.metadata?.totalMatches;

    const fetchMatchCount = useCallback(() => {
        if (!competition?.id) return;

        setLoading(true);
        apiGet(`/api/matches?competitionId=${competition.id}`)
            .then((response) => {
                const count = response.metadata?.count ?? (response.data?.length || response.length || 0);
                setMatchesCount(count);
            })
            .catch((error) => {
                console.error("Error fetching match count:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [competition?.id]);

    useEffect(() => {
        fetchMatchCount();
    }, [fetchMatchCount, refreshTrigger]);

    if (!totalMatches) return null;

    const progressPercentage = Math.min(100, Math.round((matchesCount / totalMatches) * 100));

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                        {t("football.competition_progress", "Progresso Competizione")}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {progressPercentage}%
                    </Typography>
                </Stack>
                <Box sx={{ width: '100%', position: 'relative' }}>
                    <Box
                        sx={{
                            height: 10,
                            width: '100%',
                            bgcolor: 'action.hover',
                            borderRadius: 5,
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${progressPercentage}%`,
                                bgcolor: 'primary.main',
                                transition: 'width 0.5s ease-in-out',
                                borderRadius: 5,
                                boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)'
                            }}
                        />
                    </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" align="right">
                    {t("football.progress_detail", {
                        defaultValue: "{{count}} di {{total}} partite registrate",
                        count: matchesCount,
                        total: totalMatches
                    })}
                </Typography>
            </Stack>
        </Paper>
    );
}

CompetitionProgress.propTypes = {
    competition: PropTypes.shape({
        id: PropTypes.number.isRequired,
        metadata: PropTypes.shape({
            totalMatches: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
    }),
    refreshTrigger: PropTypes.number,
};

export default CompetitionProgress;
