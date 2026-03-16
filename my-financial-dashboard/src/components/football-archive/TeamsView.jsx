import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AddTeamDialog from "./AddTeamDialog";
import EditTeamDialog from "./EditTeamDialog";
import { useTeamActions } from "./hooks/useTeamActions";

const getInitials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3);

export default function TeamsView({ teams, loading, onTeamAdded, editionId }) {
  const { t } = useTranslation();
  const { open, setOpen, editOpen, setEditOpen, selectedTeam, canManage, handleEditOpen, handleDelete, onInserted } = useTeamActions({ onTeamAdded });

  return (
    <div className="text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{t("football.teams", "Partecipanti")}</h2>
          <p className="text-xs text-slate-500">{teams.length} squadre</p>
        </div>
        {canManage && (
          <button onClick={() => setOpen(true)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl transition-all font-semibold">
            + Aggiungi
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-slate-500 text-center py-8">{t("football.loading_teams", "Caricamento...")}</p>}

      {!loading && teams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-3">{t("football.no_teams", "Nessuna squadra presente")}</p>
          {canManage && (
            <button onClick={() => setOpen(true)} className="px-4 py-2 border border-slate-700 rounded-xl text-sm text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-all">
              Aggiungi la prima squadra
            </button>
          )}
        </div>
      )}

      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 rounded-xl p-3 transition-all group">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                {getInitials(team.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{team.name}</p>
                <p className="text-xs text-slate-400 truncate">{team.city}</p>
              </div>
              {canManage && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleEditOpen(team)} className="text-slate-500 hover:text-blue-400 transition-colors text-xs leading-none">✎</button>
                  <button onClick={() => handleDelete(team.id)} className="text-slate-500 hover:text-red-400 transition-colors text-xs leading-none">✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddTeamDialog open={open} onClose={() => setOpen(false)} onInsert={onInserted} editionId={editionId} />
      <EditTeamDialog open={editOpen} onClose={() => setEditOpen(false)} onUpdate={onInserted} team={selectedTeam} />
    </div>
  );
}

TeamsView.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired, city: PropTypes.string.isRequired })).isRequired,
  loading: PropTypes.bool.isRequired,
  onTeamAdded: PropTypes.func,
  editionId: PropTypes.number,
};
