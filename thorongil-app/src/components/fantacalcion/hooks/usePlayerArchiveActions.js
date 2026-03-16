import { useState } from 'react';

export function usePlayerArchiveActions({ addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, form, setMobileOpen }) {
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return false;
    try {
      if (editingId) {
        await updatePlayerInArchive({ id: editingId, name: form.name, role: form.role, team: form.team });
        showToast('Giocatore aggiornato');
        setEditingId(null);
      } else {
        await addPlayerToArchive({ name: form.name, role: form.role, team: form.team });
        showToast(`${form.name} aggiunto!`);
      }
      form.setName('');
      return true;
    } catch (err) { showToast(`Errore: ${err.message}`); return false; }
  };

  const startEdit = (p) => {
    setEditingId(p.id); form.setName(p.name); form.setRole(p.role); form.setTeam(p.team_name);
    if (window.innerWidth < 640) setMobileOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Rimuovere questo giocatore?')) return;
    try { await removePlayerFromArchive(id); showToast('Giocatore rimosso'); } catch (err) { showToast(`Errore: ${err.message}`); }
  };

  const handleAddTeam = async (newTeamName, setNewTeamName) => {
    if (!newTeamName.trim()) return;
    try { await addTeamToArchive(newTeamName); showToast('Squadra aggiunta'); setNewTeamName(''); } catch (err) { showToast(`Errore: ${err.message}`); }
  };

  const cancelEdit = () => { setEditingId(null); form.setName(''); };

  return { editingId, toast, handleSubmit, startEdit, handleDelete, handleAddTeam, cancelEdit };
}
