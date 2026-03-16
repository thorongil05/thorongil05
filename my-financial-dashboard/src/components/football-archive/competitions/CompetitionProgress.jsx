import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../../utils/api";
import PropTypes from "prop-types";

function CompetitionProgress({ edition, refreshTrigger }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const total = edition?.metadata?.totalMatches;

  const fetchCount = useCallback(() => {
    if (!edition?.id) return;
    apiGet(`/api/matches?editionId=${edition.id}`)
      .then((res) => setCount(res.metadata?.count ?? res.data?.length ?? res.length ?? 0))
      .catch(() => {});
  }, [edition?.id]);

  useEffect(() => { fetchCount(); }, [fetchCount, refreshTrigger]);

  if (!total) return null;

  const pct = Math.min(100, Math.round((count / total) * 100));

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {t("football.competition_progress", "Progresso")}
        </p>
        <span className="text-xs text-blue-400 font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-full bg-blue-500 rounded-full transition-all duration-500" />
      </div>
      <p className="text-xs text-slate-600 mt-1.5 text-right">{count} / {total} partite</p>
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
  refreshTrigger: PropTypes.number,
};

export default CompetitionProgress;
