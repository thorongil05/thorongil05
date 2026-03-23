import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiGet } from "../../utils/api";

const STATS = [
  { key: "bestAttack",   label: "Miglior attacco",  color: "text-green-400"  },
  { key: "bestDefense",  label: "Miglior difesa",   color: "text-blue-400"   },
  { key: "worstAttack",  label: "Peggior attacco",  color: "text-red-400"    },
  { key: "worstDefense", label: "Peggior difesa",   color: "text-orange-400" },
];

function StatCard({ label, color, stat }) {
  return (
    <div className="snap-start shrink-0 w-[calc(50%-4px)] sm:flex-1 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex flex-col gap-1 min-w-0">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      {stat ? (
        <>
          <span className={`text-sm font-bold ${color} truncate`}>{stat.teamName}</span>
          <span className="text-xs text-slate-500">{stat.value} gol</span>
        </>
      ) : (
        <span className="text-xs text-slate-600">—</span>
      )}
    </div>
  );
}
StatCard.propTypes = { label: PropTypes.string.isRequired, color: PropTypes.string.isRequired, stat: PropTypes.object };

export default function StatsCarousel({ selectedEdition, selectedPhaseId, selectedGroupId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!selectedEdition) { setStats(null); return; }
    const params = new URLSearchParams({ editionId: selectedEdition.id });
    if (selectedPhaseId) params.append("phaseId", selectedPhaseId);
    if (selectedGroupId) params.append("groupId", selectedGroupId);
    apiGet(`/api/matches/stats?${params}`)
      .then(setStats)
      .catch(() => setStats(null));
  }, [selectedEdition, selectedPhaseId, selectedGroupId]);

  if (!stats) return null;

  return (
    <div className="border-t border-slate-800 px-3 pt-3 pb-3">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Statistiche</p>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STATS.map(({ key, label, color }) => (
          <StatCard key={key} label={label} color={color} stat={stats[key]} />
        ))}
      </div>
    </div>
  );
}

StatsCarousel.propTypes = {
  selectedEdition: PropTypes.object,
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
};
