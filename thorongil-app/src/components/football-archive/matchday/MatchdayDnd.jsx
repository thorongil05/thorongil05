import { useDraggable, useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";

export function DraggableTeam({ team, disabled, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `team-${team.id}`,
    data: { team },
    disabled,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick ? () => onClick(team.id) : undefined}
      style={style}
      className={`flex items-center bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 text-sm rounded-full px-3 py-1.5 cursor-pointer active:cursor-grabbing touch-none select-none transition-colors ${isDragging ? "opacity-40" : ""}`}
    >
      {team.name}
    </div>
  );
}
DraggableTeam.propTypes = { team: PropTypes.object.isRequired, disabled: PropTypes.bool, onClick: PropTypes.func };

export function DropZone({ id, team, label, onRemove }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-0 h-11 flex items-center rounded-xl border-2 border-dashed transition-all px-2 ${isOver ? "border-blue-400 bg-blue-500/10" : "border-slate-700 bg-slate-800/50"}`}
    >
      {team ? (
        <div className="flex items-center gap-1 w-full min-w-0">
          <span className="text-sm text-white flex-1 truncate">{team.name}</span>
          <button onClick={onRemove} className="text-slate-500 hover:text-red-400 shrink-0 text-xs ml-1 leading-none">✕</button>
        </div>
      ) : (
        <span className="text-xs text-slate-600 w-full text-center">{label}</span>
      )}
    </div>
  );
}
DropZone.propTypes = {
  id: PropTypes.string.isRequired,
  team: PropTypes.object,
  label: PropTypes.string,
  onRemove: PropTypes.func,
};

export function AvailableTeamsArea({ teams, onTeamClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: "available-area" });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-16 flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed transition-all ${isOver ? "border-blue-400 bg-blue-500/5" : "border-slate-700 bg-slate-800/30"}`}
    >
      {teams.length === 0 ? (
        <span className="text-xs text-slate-600 w-full text-center py-2">Tutte le squadre sono state assegnate</span>
      ) : (
        teams.map((t) => <DraggableTeam key={t.id} team={t} onClick={onTeamClick} />)
      )}
    </div>
  );
}
AvailableTeamsArea.propTypes = { teams: PropTypes.array.isRequired, onTeamClick: PropTypes.func };
