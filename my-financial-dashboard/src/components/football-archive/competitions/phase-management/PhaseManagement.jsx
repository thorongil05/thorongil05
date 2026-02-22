import { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { apiGet } from "../../../../utils/api";
import DesktopPhaseManagement from "./DesktopPhaseManagement";
import MobilePhaseManagement from "./MobilePhaseManagement";

function PhaseManagement({ editionId }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPhaseId, setSelectedPhaseId] = useState(null);

    const fetchPhases = () => {
        if (!editionId) return;
        setLoading(true);
        apiGet(`/api/competitions/editions/${editionId}/phases`)
            .then(data => {
                setPhases(data);
                // Select first phase by default on desktop if none selected
                if (!isMobile && data.length > 0 && !selectedPhaseId) {
                    setSelectedPhaseId(data[0].id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching phases:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPhases();
    }, [editionId]);

    const handlePhaseAdded = (newPhaseId) => {
        apiGet(`/api/competitions/editions/${editionId}/phases`)
            .then(data => {
                setPhases(data);
                setSelectedPhaseId(newPhaseId);
            });
    };

    if (loading && phases.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    const props = {
        phases,
        editionId,
        selectedPhaseId,
        setSelectedPhaseId,
        onPhasesUpdate: fetchPhases,
        onPhaseAdded: handlePhaseAdded
    };

    return (
        <Box sx={{ width: '100%' }}>
            {isMobile ? (
                <MobilePhaseManagement {...props} />
            ) : (
                <DesktopPhaseManagement {...props} />
            )}
        </Box>
    );
}

PhaseManagement.propTypes = {
    editionId: PropTypes.number
};

export default PhaseManagement;
