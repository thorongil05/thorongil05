import { useState, useEffect } from "react";
import { CircularProgress, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { useCompetitionDetail } from "../hooks/useCompetitionDetail";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import CompetitionForm from "./CompetitionForm";
import EditionSidebar from "./EditionSidebar";
import EditionDetail from "./EditionDetail";
import EditionFormDialog from "./EditionFormDialog";

const TYPE_LABELS = { LEAGUE: "Campionato", CUP: "Coppa", FRIENDLY: "Amichevole / Torneo" };

export default function CompetitionDetailPage({ id, onBack }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const { competition, editions, loading, loadCompetition, loadEditions } = useCompetitionDetail(id);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [editingComp, setEditingComp] = useState(false);
  const [addEditionOpen, setAddEditionOpen] = useState(false);

  useEffect(() => {
    if (!editions.length) return;
    setSelectedEdition((prev) => {
      if (prev) return editions.find((e) => e.id === prev.id) ?? editions[0];
      return editions.find((e) => e.status === "CURRENT") ?? editions[0];
    });
  }, [editions]);

  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);
    setMobileView("detail");
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900 shrink-0">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-xl leading-none shrink-0">←</button>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Football Archive</p>
          <h1 className="text-base font-bold text-white truncate">{competition?.name ?? "Competizione"}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {competition && (
            <span className="hidden sm:block text-xs text-slate-500">
              {TYPE_LABELS[competition.type] ?? competition.type}
            </span>
          )}
          {canManage && !editingComp && (
            <button
              onClick={() => setEditingComp(true)}
              className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✏️
            </button>
          )}
        </div>
      </header>

      {editingComp && competition && (
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 shrink-0">
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <CompetitionForm
              competitionToEdit={competition}
              onSubmitSuccess={() => { loadCompetition(); setEditingComp(false); }}
              onCancel={() => setEditingComp(false)}
            />
          </Paper>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <aside className={`w-full md:w-72 shrink-0 border-r border-slate-800 flex-col ${mobileView === "detail" ? "hidden md:flex" : "flex"}`}>
          <EditionSidebar
            editions={editions}
            selectedId={selectedEdition?.id}
            onSelect={handleSelectEdition}
            onAdd={() => setAddEditionOpen(true)}
            canManage={canManage}
          />
        </aside>

        <main className={`flex-1 overflow-hidden flex-col ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
          <EditionDetail
            edition={selectedEdition}
            competitionId={id}
            canManage={canManage}
            onUpdate={loadEditions}
            onBack={() => setMobileView("list")}
          />
        </main>
      </div>

      {canManage && (
        <EditionFormDialog
          open={addEditionOpen}
          onClose={() => setAddEditionOpen(false)}
          competitionId={id}
          onSuccess={loadEditions}
        />
      )}
    </div>
  );
}

CompetitionDetailPage.propTypes = {
  id: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};
