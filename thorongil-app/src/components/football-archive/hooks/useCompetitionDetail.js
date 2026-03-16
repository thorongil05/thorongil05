import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../../../utils/api";

export function useCompetitionDetail(id) {
  const [competition, setCompetition] = useState(null);
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompetition = useCallback(() =>
    apiGet(`/api/competitions`)
      .then((data) => setCompetition(data.find((c) => c.id === id) ?? null))
      .catch(() => {}),
    [id]
  );

  const loadEditions = useCallback(() =>
    apiGet(`/api/competitions/${id}/editions`)
      .then((eds) =>
        Promise.all(
          eds.map((e) =>
            apiGet(`/api/competitions/editions/${e.id}/phases`)
              .then((phases) => ({ ...e, phases }))
              .catch(() => ({ ...e, phases: [] }))
          )
        )
      )
      .then(setEditions)
      .catch(() => {}),
    [id]
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([loadCompetition(), loadEditions()]).finally(() => setLoading(false));
  }, [id, loadCompetition, loadEditions]);

  return { competition, editions, loading, loadCompetition, loadEditions };
}
