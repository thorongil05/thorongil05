import PropTypes from 'prop-types';
import { ROLES } from './context/FantacalcionContext';

const inputCls = 'bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-full';
const selectCls = `${inputCls}`;

export default function PlayerForm({ editingId, form, teams, onSubmit, onCancel }) {
  const { name, setName, role, setRole, team, setTeam } = form;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
        {editingId ? 'Modifica Giocatore' : 'Aggiungi Nuovo Giocatore'}
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
        <div className="flex-[2] min-w-[200px]">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Es. Lautaro Martinez"
            className={inputCls}
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <select value={role} onChange={e => setRole(e.target.value)} className={selectCls}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <select value={team} onChange={e => setTeam(e.target.value)} className={selectCls}>
            {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            {editingId ? 'Aggiorna' : 'Aggiungi'}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

PlayerForm.propTypes = {
  editingId: PropTypes.number,
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    setRole: PropTypes.func.isRequired,
    team: PropTypes.string.isRequired,
    setTeam: PropTypes.func.isRequired,
  }).isRequired,
  teams: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
