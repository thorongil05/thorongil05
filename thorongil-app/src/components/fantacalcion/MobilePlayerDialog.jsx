import { useState } from 'react';
import PropTypes from 'prop-types';
import { ROLES } from './context/FantacalcionContext';

const filterTeams = (teams, search) =>
  teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

export default function MobilePlayerDialog({ open, editingId, form, teams, onSubmit, onClose }) {
  const { name, setName, role, setRole, team, setTeam } = form;
  const [teamSearch, setTeamSearch] = useState('');
  const filteredTeams = filterTeams(teams, teamSearch);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-lg leading-none">✕</button>
        <h2 className="text-white font-bold text-sm">{editingId ? 'Modifica Giocatore' : 'Inserimento Rapido'}</h2>
        <button
          onClick={async () => { const ok = await onSubmit(); if (ok) onClose(); }}
          className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
        >
          Salva
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">1. Ruolo</p>
          <div className="grid grid-cols-4 gap-1">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-2.5 rounded-lg text-sm font-bold transition-colors ${role === r ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">2. Nome Giocatore</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Inserisci Nome"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col min-h-0">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">3. Squadra</p>
          <input
            value={teamSearch}
            onChange={e => setTeamSearch(e.target.value)}
            placeholder="Cerca squadra..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-blue-500"
          />
          <div className="border border-slate-800 rounded-xl overflow-y-auto max-h-[35vh] bg-slate-900">
            {filteredTeams.map(t => (
              <button
                key={t.id}
                onClick={() => setTeam(t.name)}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-slate-800 last:border-0 transition-colors ${
                  team === t.name ? 'bg-blue-500/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {t.name}
              </button>
            ))}
            {filteredTeams.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Nessuna squadra trovata</p>}
          </div>
        </div>
        <button
          onClick={async () => { const ok = await onSubmit(); if (ok && editingId) onClose(); }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
        >
          {editingId ? 'AGGIORNA' : 'AGGIUNGI E CONTINUA'}
        </button>
      </div>
    </div>
  );
}

MobilePlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  editingId: PropTypes.number,
  form: PropTypes.shape({
    name: PropTypes.string.isRequired, setName: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired, setRole: PropTypes.func.isRequired,
    team: PropTypes.string.isRequired, setTeam: PropTypes.func.isRequired,
  }).isRequired,
  teams: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
