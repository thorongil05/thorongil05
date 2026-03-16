import { useState, useEffect, useMemo } from 'react';
import { useFantacalcion, ROLES } from './context/FantacalcionContext';
import PlayerForm from './PlayerForm';
import PlayerTable from './PlayerTable';
import MobilePlayerDialog from './MobilePlayerDialog';
import { usePlayerArchiveActions } from './hooks/usePlayerArchiveActions';

const PAGE_SIZE = 10;
const selectCls = 'bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500';

const filterPlayers = (players, name, role, team) =>
  players.filter(p => {
    if (name && !p.name.toLowerCase().includes(name.toLowerCase())) return false;
    if (role && p.role !== role) return false;
    if (team && p.team_name !== team) return false;
    return true;
  });

export default function PlayerArchive() {
  const { players, teams, addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, loading } = useFantacalcion();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [page, setPage] = useState(0);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('DIF');
  const [formTeam, setFormTeam] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => { if (teams.length > 0 && !formTeam) setFormTeam(teams[0].name); }, [teams, formTeam]);

  const form = { name: formName, setName: setFormName, role: formRole, setRole: setFormRole, team: formTeam, setTeam: setFormTeam };
  const { editingId, toast, handleSubmit, startEdit, handleDelete, handleAddTeam, cancelEdit } = usePlayerArchiveActions({ addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, form, setMobileOpen });

  const filtered = useMemo(() => filterPlayers(players, filterName, filterRole, filterTeam), [players, filterName, filterRole, filterTeam]);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const closeMobile = () => { setMobileOpen(false); form.setName(''); };

  if (loading) return <div className="p-6 text-center text-slate-400">Caricamento...</div>;

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto bg-slate-950 min-h-full overflow-y-auto flex-1">
      <h1 className="text-white text-xl font-bold mb-6">Archivio Giocatori</h1>
      <div className="hidden sm:block">
        <PlayerForm editingId={editingId} form={form} teams={teams} onSubmit={handleSubmit} onCancel={cancelEdit} />
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input value={filterName} onChange={e => { setFilterName(e.target.value); setPage(0); }} placeholder="Cerca nome" className={`${selectCls} flex-1 min-w-[120px]`} />
        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(0); }} className={selectCls}>
          <option value="">Tutti i ruoli</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterTeam} onChange={e => { setFilterTeam(e.target.value); setPage(0); }} className={selectCls}>
          <option value="">Tutte le squadre</option>
          {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
      </div>
      <PlayerTable players={paginated} page={page} pageSize={PAGE_SIZE} totalCount={filtered.length} onPageChange={setPage} onEdit={startEdit} onDelete={handleDelete} />
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Gestione Squadre</h2>
        <form onSubmit={e => { e.preventDefault(); handleAddTeam(newTeamName, setNewTeamName); }} className="flex gap-2">
          <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Nuova Squadra" className={`${selectCls} flex-1`} />
          <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">Aggiungi</button>
        </form>
      </div>
      <button
        onClick={() => { form.setName(''); setMobileOpen(true); }}
        className="sm:hidden fixed bottom-16 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-2xl shadow-lg transition-colors flex items-center justify-center z-40"
      >
        +
      </button>
      <MobilePlayerDialog open={mobileOpen} editingId={editingId} form={form} teams={teams} onSubmit={handleSubmit} onClose={closeMobile} />
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
