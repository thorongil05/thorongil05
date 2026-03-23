import { Dialog, useMediaQuery } from "@mui/material";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import PropTypes from "prop-types";
import { useMatchdayBuilder } from "./hooks/useMatchdayBuilder";
import { AvailableTeamsArea, DraggableTeam } from "./matchday/MatchdayDnd";
import MatchSlot from "./matchday/MatchSlot";

function MatchdayBuilder({ open, onClose, onMatchesCreated, teams, selectedEdition, selectedPhaseId, selectedGroupId, defaultRound }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { round, setRound, availableTeams, matches, activeTeam, isSubmitting, error, sensors, handleDragStart, handleDragEnd, addTeamToFirstSlot, removeFromSlot, resetBuilder, handleSave } =
    useMatchdayBuilder({ open, teams, defaultRound, selectedEdition, selectedPhaseId, selectedGroupId, onMatchesCreated, onClose });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={isMobile}
      PaperProps={{ sx: { bgcolor: "#0f172a", color: "white", backgroundImage: "none", display: "flex", flexDirection: "column" } }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none mr-1">←</button>
            )}
            <span className="text-white font-semibold text-base">Crea Giornata</span>
          </div>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                Annulla
              </button>
            )}
            <button onClick={handleSave} disabled={isSubmitting}
              className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors">
              {isSubmitting ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs text-slate-400 shrink-0">Giornata</label>
              <input value={round} onChange={(e) => setRound(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:border-blue-500"
                placeholder="es. 1" />
            </div>
            <p className="text-xs text-slate-500 flex-1">Clicca o trascina le squadre negli slot per formare le partite.</p>
            <button onClick={resetBuilder} className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors shrink-0">
              Reset
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-2.5">{error}</div>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Squadre disponibili</p>
            <AvailableTeamsArea teams={availableTeams} onTeamClick={addTeamToFirstSlot} />
          </div>

          <div className="border-t border-slate-700/50" />

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Accoppiamenti</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matches.map((match, index) => (
                <MatchSlot key={match.id} index={index} match={match} onRemove={(slot) => removeFromSlot(match.id, slot)} />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeTeam ? <DraggableTeam team={activeTeam} disabled /> : null}
        </DragOverlay>
      </DndContext>
    </Dialog>
  );
}

MatchdayBuilder.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMatchesCreated: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  selectedEdition: PropTypes.object,
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  defaultRound: PropTypes.string,
};

export default MatchdayBuilder;
