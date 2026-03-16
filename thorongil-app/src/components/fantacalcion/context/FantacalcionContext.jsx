import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/api';

const FantacalcionContext = createContext();

export function FantacalcionProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selected Formation string (e.g. 4-4-2)
  const [formationStr, setFormationStr] = useState('4-4-2');

  // The deployed lineup (map from slot ID -> player object)
  const [deployed, setDeployed] = useState(() => {
    const saved = localStorage.getItem('fantacalcion_lineup');
    return saved ? JSON.parse(saved) : {};
  });

  const fetchTeams = useCallback(async () => {
    try {
      const data = await apiGet('/api/fantacalcion/teams');
      setTeams(data);
    } catch (err) {
      console.error('Error fetching fantacalcion teams:', err);
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    try {
      const data = await apiGet('/api/fantacalcion/players');
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching fantacalcion players:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchPlayers()]);
      setLoading(false);
    };
    loadData();
  }, [fetchTeams, fetchPlayers]);

  // Persist lineup (the selection itself, players/teams come from DB)
  useEffect(() => {
    localStorage.setItem('fantacalcion_lineup', JSON.stringify(deployed));
  }, [deployed]);

  // Enforce Max 1 Player Per Team Rule
  const getUsedTeams = useMemo(() => {
    const used = new Set();
    Object.values(deployed).forEach(player => {
      if (player && player.team_name) used.add(player.team_name);
    });
    return Array.from(used);
  }, [deployed]);

  const availableTeams = useMemo(() => {
    const teamNames = teams.map(t => t.name);
    return teamNames.filter(name => !getUsedTeams.includes(name));
  }, [teams, getUsedTeams]);

  // Derived: Filtered players that can be selected
  const getAvailablePlayersForRole = (role) => {
    return players.filter(p => p.role === role && (!getUsedTeams.includes(p.team_name)));
  };

  const addPlayerToArchive = async (player) => {
    try {
      // Find team_id from team_name
      const team = teams.find(t => t.name === player.team);
      if (!team) throw new Error("Team not found");

      const newPlayer = await apiPost('/api/fantacalcion/players', {
        name: player.name,
        role: player.role,
        team_id: team.id
      });
      await fetchPlayers();
      return newPlayer;
    } catch (err) {
      console.error('Error adding player:', err);
      throw err;
    }
  };

  const updatePlayerInArchive = async (updatedPlayer) => {
    try {
      const team = teams.find(t => t.name === updatedPlayer.team);
      if (!team) throw new Error("Team not found");

      await apiPut(`/api/fantacalcion/players/${updatedPlayer.id}`, {
        name: updatedPlayer.name,
        role: updatedPlayer.role,
        team_id: team.id
      });
      await fetchPlayers();
    } catch (err) {
      console.error('Error updating player:', err);
      throw err;
    }
  };

  const removePlayerFromArchive = async (id) => {
    try {
      await apiDelete(`/api/fantacalcion/players/${id}`);
      await fetchPlayers();
      // If deleted player was deployed, remove them from pitch
      setDeployed(prev => {
        const next = { ...prev };
        let changed = false;
        for (const slotId in next) {
          if (next[slotId]?.id === id) {
            delete next[slotId];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    } catch (err) {
      console.error('Error removing player:', err);
      throw err;
    }
  };

  // Team management (optional but requested "poter aggiungere le squadre")
  const addTeamToArchive = async (name) => {
    try {
      await apiPost('/api/fantacalcion/teams', { name });
      await fetchTeams();
    } catch (err) {
      console.error('Error adding team:', err);
      throw err;
    }
  };

  const deployPlayer = (slotId, player) => {
    setDeployed(prev => ({ ...prev, [slotId]: player }));
  };

  const removeDeployedSlot = (slotId) => {
    setDeployed(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const value = {
    players,
    teams,
    loading,
    formationStr,
    setFormationStr,
    deployed,
    getUsedTeams,
    availableTeams,
    getAvailablePlayersForRole,
    addPlayerToArchive,
    updatePlayerInArchive,
    removePlayerFromArchive,
    addTeamToArchive,
    deployPlayer,
    removeDeployedSlot
  };

  return (
    <FantacalcionContext.Provider value={value}>
      {children}
    </FantacalcionContext.Provider>
  );
}

export const ROLES = ['DIF', 'CEN', 'ATT'];

export function useFantacalcion() {
  return useContext(FantacalcionContext);
}
