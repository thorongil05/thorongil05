import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFantacalcion } from './context/FantacalcionContext';

const selectCls = 'w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50';
const labelCls = 'text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1';

function ModalFields({ isGK, teamOptions, selectedTeam, onTeamChange, playerOptions, selectedPlayerId, onPlayerChange, requiredRole }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <p className={labelCls}>1. Squadra</p>
        <select value={selectedTeam} onChange={onTeamChange} className={selectCls}>
          <option value="">Nessuna</option>
          {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <p className="text-slate-600 text-xs mt-1">Solo squadre non ancora utilizzate</p>
      </div>
      {!isGK && (
        <div>
          <p className={labelCls}>2. Giocatore</p>
          <select value={selectedPlayerId} onChange={onPlayerChange} disabled={!selectedTeam} className={selectCls}>
            <option value="">Nessuno</option>
            {playerOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {selectedTeam && playerOptions.length === 0 && <p className="text-red-400 text-xs mt-1">Nessun {requiredRole} trovato</p>}
        </div>
      )}
      {isGK && selectedTeam && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
          <p className="text-blue-300 text-sm font-bold">Blocco Portieri: {selectedTeam}</p>
        </div>
      )}
    </div>
  );
}

export default function PlayerSelectionModal({ open, onClose, slotId, requiredRole }) {
  const { players, availableTeams, deployPlayer, deployed, removeDeployedSlot } = useFantacalcion();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const isGK = requiredRole === 'POR';

  useEffect(() => {
    if (open) {
      const current = deployed[slotId];
      setSelectedTeam(current ? current.team_name : '');
      setSelectedPlayerId(current && !isGK ? current.id : '');
    }
  }, [open, slotId, deployed, isGK]);

  const teamOptions = useMemo(() => {
    const current = deployed[slotId];
    const list = [...availableTeams];
    if (current && !list.includes(current.team_name)) list.push(current.team_name);
    return list.sort();
  }, [availableTeams, deployed, slotId]);

  const playerOptions = useMemo(() => {
    if (!selectedTeam || isGK) return [];
    return players.filter(p => p.team_name === selectedTeam && p.role === requiredRole).sort((a, b) => a.name.localeCompare(b.name));
  }, [players, selectedTeam, requiredRole, isGK]);

  const handleSave = () => {
    if (isGK) {
      if (!selectedTeam) removeDeployedSlot(slotId);
      else deployPlayer(slotId, { id: `gk-${selectedTeam}`, name: `${selectedTeam} (Blocco)`, role: 'POR', team_name: selectedTeam });
    } else {
      if (!selectedPlayerId) removeDeployedSlot(slotId);
      else { const player = players.find(p => p.id === selectedPlayerId); if (player) deployPlayer(slotId, player); }
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xs shadow-xl">
        <div className="px-4 pt-4 pb-3 border-b border-slate-800 text-center">
          <h3 className="text-white font-bold">Seleziona {isGK ? 'Portiere' : 'Giocatore'}</h3>
          <p className="text-blue-400 text-xs mt-0.5">{requiredRole}</p>
        </div>
        <ModalFields isGK={isGK} teamOptions={teamOptions} selectedTeam={selectedTeam} onTeamChange={e => { setSelectedTeam(e.target.value); setSelectedPlayerId(''); }} playerOptions={playerOptions} selectedPlayerId={selectedPlayerId} onPlayerChange={e => setSelectedPlayerId(e.target.value)} requiredRole={requiredRole} />
        <div className="px-4 pb-4 pt-2 border-t border-slate-800 flex items-center justify-between">
          <button onClick={() => { removeDeployedSlot(slotId); onClose(); }} className="text-red-400 hover:text-red-300 text-sm transition-colors">Rimuovi</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg transition-colors">Annulla</button>
            <button onClick={handleSave} disabled={isGK ? !selectedTeam : !selectedPlayerId} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-semibold">
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

PlayerSelectionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  slotId: PropTypes.string,
  requiredRole: PropTypes.string,
};

ModalFields.propTypes = {
  isGK: PropTypes.bool.isRequired,
  teamOptions: PropTypes.array.isRequired,
  selectedTeam: PropTypes.string.isRequired,
  onTeamChange: PropTypes.func.isRequired,
  playerOptions: PropTypes.array.isRequired,
  selectedPlayerId: PropTypes.string.isRequired,
  onPlayerChange: PropTypes.func.isRequired,
  requiredRole: PropTypes.string,
};
