import { useEffect, useState, useCallback } from "react";
import { apiGet } from "../../../utils/api";
import PropTypes from "prop-types";

function ProgressBar({ label, count, total, labelCls, fillCls, trackCls }) {
  const pct = total ? Math.min(100, Math.round((count / total) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-xs font-semibold tabular-nums ${labelCls}`}>{count} / {total}</span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${trackCls}`}>
        <div style={{ width: `${pct}%` }} className={`h-full rounded-full transition-all duration-500 ${fillCls}`} />
      </div>
    </div>
  );
}

export default function CompetitionProgress({ edition, group, refreshTrigger }) {
  const [progress, setProgress] = useState({ inserted: 0, completed: 0 });

  const total = group
    ? Number(group.metadata?.totalMatches) || 0
    : Number(edition?.metadata?.totalMatches) || 0;

  const fetchProgress = useCallback(() => {
    if (!edition?.id) return;
    const params = new URLSearchParams({ editionId: edition.id });
    if (group?.id) params.set("groupId", group.id);
    apiGet(`/api/matches/progress?${params}`)
      .then(setProgress)
      .catch(() => {});
  }, [edition?.id, group?.id]);

  useEffect(() => { fetchProgress(); }, [fetchProgress, refreshTrigger]);

  if (!total) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progresso</p>
      <ProgressBar
        label="Inserite"
        count={progress.inserted}
        total={total}
        labelCls="text-blue-400"
        fillCls="bg-blue-400"
        trackCls="bg-slate-700"
      />
      <ProgressBar
        label="Completate"
        count={progress.completed}
        total={total}
        labelCls="text-green-400"
        fillCls="bg-green-400"
        trackCls="bg-slate-700/60"
      />
    </div>
  );
}

CompetitionProgress.propTypes = {
  edition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    metadata: PropTypes.shape({
      totalMatches: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    metadata: PropTypes.shape({
      totalMatches: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  refreshTrigger: PropTypes.number,
};

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  labelCls: PropTypes.string.isRequired,
  fillCls: PropTypes.string.isRequired,
  trackCls: PropTypes.string.isRequired,
};
