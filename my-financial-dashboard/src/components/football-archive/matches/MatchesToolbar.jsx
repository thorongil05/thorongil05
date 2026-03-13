import { Stack, Typography, Chip, FormControl, InputLabel, Select, MenuItem, Tooltip, Box, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import PropTypes from "prop-types";

function TopControls({
  isMobile,
  loading,
  matchesCount,
  selectedRound,
  setSelectedRound,
  selectedEdition,
  rounds,
  user,
  setBuilderOpen
}) {
  const { t } = useTranslation();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
          {t("football.matches")}
        </Typography>
        {!loading && (
          <Chip
            label={matchesCount}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold", borderColor: "divider", color: "text.secondary" }}
          />
        )}
        {!isMobile && (
          <FormControl size="small" sx={{ minWidth: 140, ml: 1 }}>
            <InputLabel id="round-select-label">{t("football.round", "Round")}</InputLabel>
            <Select
              labelId="round-select-label"
              value={selectedRound}
              label={t("football.round", "Round")}
              onChange={(e) => setSelectedRound(e.target.value)}
              disabled={!selectedEdition}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">{t("football.all_rounds", "All Rounds")}</MenuItem>
              {rounds && rounds.map((round) => (
                <MenuItem key={round} value={round}>{round}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && !isMobile && (
          <Tooltip title={t("football.add_match", "Add Match")}>
            <Box component="span">
              <IconButton
                size="small"
                onClick={() => setBuilderOpen(true)}
                disabled={!selectedEdition}
                sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }, width: 32, height: 32 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
}

TopControls.propTypes = {
  isMobile: PropTypes.bool,
  loading: PropTypes.bool,
  matchesCount: PropTypes.number,
  selectedRound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedRound: PropTypes.func,
  selectedEdition: PropTypes.object,
  rounds: PropTypes.array,
  user: PropTypes.object,
  setBuilderOpen: PropTypes.func
};

function BottomControls({
  isMobile,
  selectedRound,
  setSelectedRound,
  selectedEdition,
  rounds,
  selectedTeamId,
  setSelectedTeamId,
  teams,
  sortBy,
  handleResetFilters,
  user,
  setBuilderOpen
}) {
  const { t } = useTranslation();
  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={1.5} alignItems={isMobile ? "stretch" : "center"} sx={{ width: "100%" }}>
      {isMobile && (
        <FormControl size="small" sx={{ minWidth: "100%" }}>
          <InputLabel id="round-select-label-mob">{t("football.round", "Round")}</InputLabel>
          <Select
            labelId="round-select-label-mob"
            value={selectedRound}
            label={t("football.round", "Round")}
            onChange={(e) => setSelectedRound(e.target.value)}
            disabled={!selectedEdition}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="All">{t("football.all_rounds", "All Rounds")}</MenuItem>
            {rounds && rounds.map((round) => (
              <MenuItem key={round} value={round}>{round}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 200, flexGrow: isMobile ? 0 : 1 }}>
        <InputLabel id="team-select-label" sx={{ color: selectedTeamId !== "All" ? "secondary.main" : "inherit" }}>
          {t("football.team", "Team")}
        </InputLabel>
        <Select
          labelId="team-select-label"
          value={selectedTeamId}
          label={t("football.team", "Team")}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={!selectedEdition}
          sx={{ borderRadius: 2 }}
        >
          <MenuItem value="All">{t("football.all_teams", "All Teams")}</MenuItem>
          {teams && teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} justifyContent={isMobile ? "stretch" : "flex-end"}>
        <Tooltip title={t("common.reset", "Reset Filters")}>
          <Box component="span">
            <IconButton
              size="small"
              onClick={handleResetFilters}
              disabled={selectedRound === "All" && selectedTeamId === "All" && sortBy === "match_date"}
              sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>

        {isMobile && (user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setBuilderOpen(true)}
            disabled={!selectedEdition}
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            Crea Giornata
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

BottomControls.propTypes = {
  isMobile: PropTypes.bool,
  selectedRound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedRound: PropTypes.func,
  selectedEdition: PropTypes.object,
  rounds: PropTypes.array,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedTeamId: PropTypes.func,
  teams: PropTypes.array,
  sortBy: PropTypes.string,
  handleResetFilters: PropTypes.func,
  user: PropTypes.object,
  setBuilderOpen: PropTypes.func
};

export default function MatchesToolbar(props) {
  const { isMobile } = props;
  return (
    <Stack
      sx={{
        p: isMobile ? 1.5 : 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        minWidth: isMobile ? "fit-content" : "auto"
      }}
      spacing={2}
    >
      <TopControls {...props} />
      <BottomControls {...props} />
    </Stack>
  );
}

MatchesToolbar.propTypes = {
  isMobile: PropTypes.bool,
  loading: PropTypes.bool,
  matchesCount: PropTypes.number,
  selectedRound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedRound: PropTypes.func,
  selectedEdition: PropTypes.object,
  rounds: PropTypes.array,
  user: PropTypes.object,
  setBuilderOpen: PropTypes.func,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedTeamId: PropTypes.func,
  teams: PropTypes.array,
  sortBy: PropTypes.string,
  handleResetFilters: PropTypes.func
};
