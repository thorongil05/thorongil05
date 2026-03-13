import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Serie A Teams 2024/2025 (approximate for logic)
export const SERIE_A_TEAMS = [
  'Atalanta', 'Bologna', 'Cagliari', 'Como', 'Empoli', 
  'Fiorentina', 'Genoa', 'Inter', 'Juventus', 'Lazio', 
  'Lecce', 'Milan', 'Monza', 'Napoli', 'Parma', 
  'Roma', 'Torino', 'Udinese', 'Venezia', 'Verona'
];

export const ROLES = ['POR', 'DIF', 'CEN', 'ATT'];

const FantacalcionContext = createContext();

export function FantacalcionProvider({ children }) {
  // All available players in the archive (persisted)
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('fantacalcion_players');
    if (saved) return JSON.parse(saved);
    // Mock initial data
    return [
      { id: '1', name: 'Inter (Blocco)', role: 'POR', team: 'Inter' },
      { id: '2', name: 'Bastoni', role: 'DIF', team: 'Inter' },
      { id: '3', name: 'Bremer', role: 'DIF', team: 'Juventus' },
      { id: '4', name: 'Kvaratskhelia', role: 'ATT', team: 'Napoli' },
      { id: '5', name: 'Dybala', role: 'ATT', team: 'Roma' },
      { id: '6', name: 'Barella', role: 'CEN', team: 'Inter' },
      { id: '7', name: 'Koopmeiners', role: 'CEN', team: 'Juventus' },
      { id: '8', name: 'Buongiorno', role: 'DIF', team: 'Napoli' },
      { id: '9', name: 'Leao', role: 'ATT', team: 'Milan' },
    ];
  });

  // Selected Formation string (e.g. 4-4-2)
  const [formationStr, setFormationStr] = useState('4-4-2');

  // The deployed lineup (map from slot ID -> player object)
  const [deployed, setDeployed] = useState({}); // { slot_id: player_obj }

  // Persist players archive
  useEffect(() => {
    localStorage.setItem('fantacalcion_players', JSON.stringify(players));
  }, [players]);

  // Enforce Max 1 Player Per Team Rule
  const getUsedTeams = useMemo(() => {
    const used = new Set();
    Object.values(deployed).forEach(player => {
      if (player && player.team) used.add(player.team);
    });
    return Array.from(used);
  }, [deployed]);

  const availableTeams = useMemo(() => 
    SERIE_A_TEAMS.filter(t => !getUsedTeams.includes(t)),
  [getUsedTeams]);

  // Derived: Filtered players that can be selected
  const getAvailablePlayersForRole = (role) => {
    return players.filter(p => p.role === role && (!getUsedTeams.includes(p.team)));
  };

  const addPlayerToArchive = (player) => {
    setPlayers(prev => [...prev, { ...player, id: Date.now().toString() }]);
  };

  const updatePlayerInArchive = (updatedPlayer) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const removePlayerFromArchive = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    // If deleted player was deployed, remove them from pitch
    setDeployed(prev => {
      const next = { ...prev };
      for (const slotId in next) {
        if (next[slotId]?.id === id) {
          delete next[slotId];
        }
      }
      return next;
    });
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
    formationStr,
    setFormationStr,
    deployed,
    getUsedTeams,
    availableTeams,
    getAvailablePlayersForRole,
    addPlayerToArchive,
    updatePlayerInArchive,
    removePlayerFromArchive,
    deployPlayer,
    removeDeployedSlot
  };

  return (
    <FantacalcionContext.Provider value={value}>
      {children}
    </FantacalcionContext.Provider>
  );
}

export function useFantacalcion() {
  return useContext(FantacalcionContext);
}
