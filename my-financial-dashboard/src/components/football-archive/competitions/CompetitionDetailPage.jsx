import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { Paper } from "@mui/material";
import PropTypes from "prop-types";
import { useCompetitionDetail } from "../hooks/useCompetitionDetail";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import CompetitionForm from "./CompetitionForm";
import EditionsList from "./EditionsList";

const TYPE_LABELS = { LEAGUE: "Campionato", CUP: "Coppa", FRIENDLY: "Amichevole / Torneo" };

export default function CompetitionDetailPage({ id, onBack }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const { competition, editions, loading, loadCompetition, loadEditions } = useCompetitionDetail(id);
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onBack} className="text-slate-400 hover:text-white text-xl leading-none shrink-0">←</button>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Football Archive</p>
                <h1 className="text-xl font-bold text-white truncate">{competition?.name ?? "Competizione"}</h1>
              </div>
            </div>
            {canManage && !editing && (
              <button onClick={() => setEditing(true)} className="shrink-0 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors">
                ✏️ Modifica
              </button>
            )}
          </div>

          {!editing && competition && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-4">
              {competition.country && (
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Paese</p><p className="text-sm text-slate-200 mt-0.5">{competition.country}</p></div>
              )}
              <div><p className="text-xs text-slate-500 uppercase tracking-wider">Tipo</p><p className="text-sm text-slate-200 mt-0.5">{TYPE_LABELS[competition.type] ?? competition.type}</p></div>
            </div>
          )}

          {editing && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <CompetitionForm
                  competitionToEdit={competition}
                  onSubmitSuccess={() => { loadCompetition(); setEditing(false); }}
                  onCancel={() => setEditing(false)}
                />
              </Paper>
            </div>
          )}
        </div>

        {competition && (
          <EditionsList competitionId={id} editions={editions} onUpdate={loadEditions} />
        )}
      </div>
    </div>
  );
}

CompetitionDetailPage.propTypes = {
  id: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};
