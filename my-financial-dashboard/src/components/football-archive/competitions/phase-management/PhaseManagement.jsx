import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { apiGet } from "../../../../utils/api";
import PhaseList from "./PhaseList";

export default function PhaseManagement({ editionId }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPhases = useCallback(() => {
    if (!editionId) return;
    setLoading(true);
    apiGet(`/api/competitions/editions/${editionId}/phases`)
      .then((data) => { setPhases(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [editionId]);

  useEffect(() => { fetchPhases(); }, [fetchPhases]);

  if (loading && phases.length === 0) {
    return <p className="text-sm text-slate-500 py-4 text-center">Caricamento...</p>;
  }

  return <PhaseList editionId={editionId} phases={phases} onUpdate={fetchPhases} />;
}

PhaseManagement.propTypes = { editionId: PropTypes.number };
