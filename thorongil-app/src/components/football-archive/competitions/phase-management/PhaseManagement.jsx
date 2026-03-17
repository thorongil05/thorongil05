import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { apiGet } from "../../../../utils/api";
import PhaseSidebar from "./PhaseSidebar";
import PhaseDetail from "./PhaseDetail";

export default function PhaseManagement({ editionId }) {
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const fetchPhases = useCallback(() => {
    if (!editionId) return;
    apiGet(`/api/competitions/editions/${editionId}/phases`)
      .then((data) => setPhases(data))
      .catch(() => {});
  }, [editionId]);

  useEffect(() => { fetchPhases(); }, [fetchPhases]);

  useEffect(() => {
    if (!phases.length) return;
    setSelectedPhase((prev) => {
      if (prev) return phases.find((p) => p.id === prev.id) ?? phases[0];
      return phases[0];
    });
  }, [phases]);

  const handleSelect = (phase) => {
    setSelectedPhase(phase);
    setMobileView("detail");
  };

  return (
    <div className="flex h-full border border-slate-700/50 rounded-xl overflow-hidden">
      <aside className={`w-full md:w-56 shrink-0 border-r border-slate-800 flex-col bg-slate-900/40 ${mobileView === "detail" ? "hidden md:flex" : "flex"}`}>
        <PhaseSidebar
          editionId={editionId}
          phases={phases}
          selectedId={selectedPhase?.id}
          onSelect={handleSelect}
          onUpdate={fetchPhases}
        />
      </aside>

      <main className={`flex-1 overflow-hidden flex-col min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
        <PhaseDetail
          phase={selectedPhase}
          onUpdate={fetchPhases}
          onBack={() => setMobileView("list")}
        />
      </main>
    </div>
  );
}

PhaseManagement.propTypes = { editionId: PropTypes.number };
