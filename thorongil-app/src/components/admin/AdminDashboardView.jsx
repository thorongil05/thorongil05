import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import UserEditDialog from "./UserEditDialog";
import { useAdminData } from "./useAdminData";

const ROLE_CLS = {
  [UserRoles.ADMIN]:  "bg-red-500/20 text-red-400 border-red-500/30",
  [UserRoles.EDITOR]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [UserRoles.VIEWER]: "bg-slate-700 text-slate-400 border-slate-600",
};

const thCls = "px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest";
const tdCls = "px-4 py-3 text-sm text-slate-200";

function RoleChip({ role }) {
  const cls = ROLE_CLS[role] ?? "bg-slate-700 text-slate-400 border-slate-600";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>{role}</span>;
}
RoleChip.propTypes = { role: PropTypes.string };

function Section({ title, children }) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
Section.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node };

function UsersTable({ users, currentUser, onEdit, onDelete }) {
  return (
    <table className="w-full whitespace-nowrap">
      <thead>
        <tr className="bg-slate-800/50">
          <th className={thCls}>Username</th>
          <th className={`${thCls} hidden md:table-cell`}>Email</th>
          <th className={thCls}>Ruolo</th>
          <th className={`${thCls} hidden md:table-cell`}>Iscritto il</th>
          <th className={`${thCls} text-right`}>Azioni</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-blue-500/5 transition-colors">
            <td className={tdCls}>{user.username}</td>
            <td className={`${tdCls} hidden md:table-cell text-slate-400`}>{user.email}</td>
            <td className={tdCls}><RoleChip role={user.role} /></td>
            <td className={`${tdCls} hidden md:table-cell text-slate-400`}>{new Date(user.created_at).toLocaleDateString()}</td>
            <td className={`${tdCls} text-right`}>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => onEdit(user)} disabled={user.id === currentUser?.id} className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">✏️ Modifica</button>
                <button onClick={() => onDelete(user)} disabled={user.id === currentUser?.id} className="text-xs text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">🗑️ Elimina</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
UsersTable.propTypes = { users: PropTypes.array.isRequired, currentUser: PropTypes.object, onEdit: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired };

function ActivitiesTable({ activities, loading }) {
  if (loading) return <p className="px-4 py-8 text-sm text-slate-500 text-center">Caricamento...</p>;
  if (!activities.length) return <p className="px-4 py-8 text-sm text-slate-500 text-center">Nessuna attività disponibile.</p>;
  return (
    <table className="w-full whitespace-nowrap">
      <thead>
        <tr className="bg-slate-800/50">
          <th className={thCls}>Username</th>
          <th className={`${thCls} hidden md:table-cell`}>Email</th>
          <th className={`${thCls} text-center`}>Sessioni</th>
          <th className={`${thCls} text-center`}>Partite +</th>
          <th className={`${thCls} text-center`}>Partite ~</th>
          <th className={`${thCls} hidden md:table-cell text-center`}>Squadre +</th>
          <th className={`${thCls} hidden md:table-cell`}>Ultima attività</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {activities.map((a) => (
          <tr key={a.user_id} className="hover:bg-blue-500/5 transition-colors">
            <td className={tdCls}>{a.username}</td>
            <td className={`${tdCls} hidden md:table-cell text-slate-400`}>{a.email}</td>
            <td className={`${tdCls} text-center`}>{a.session_count || 0}</td>
            <td className={`${tdCls} text-center`}>{a.total_statistics?.matches_added || 0}</td>
            <td className={`${tdCls} text-center`}>{a.total_statistics?.matches_updated || 0}</td>
            <td className={`${tdCls} hidden md:table-cell text-center`}>{a.total_statistics?.teams_added || 0}</td>
            <td className={`${tdCls} hidden md:table-cell text-slate-400`}>{a.last_activity ? new Date(a.last_activity).toLocaleString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
ActivitiesTable.propTypes = { activities: PropTypes.array.isRequired, loading: PropTypes.bool };

function AdminDashboardView() {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { users, loading, error, activities, activitiesLoading, fetchUsers } = useAdminData();

  const handleEdit = (user) => { setUserToEdit(user); setEditDialogOpen(true); };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) { alert("Non puoi eliminare te stesso"); return; }
    if (!window.confirm("Eliminare questo utente?")) return;
    try {
      const r = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${user.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error("Eliminazione fallita");
      fetchUsers();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[200px]"><span className="text-slate-400 text-sm">Caricamento...</span></div>;
  if (error) return <div className="m-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-sm text-slate-400 hover:text-white transition-colors">← Home</button>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>
      <Section title="Utenti">
        <UsersTable users={users} currentUser={currentUser} onEdit={handleEdit} onDelete={handleDelete} />
      </Section>
      <Section title="Attività utenti">
        <ActivitiesTable activities={activities} loading={activitiesLoading} />
      </Section>
      <UserEditDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} onUpdate={fetchUsers} user={userToEdit} token={token} />
    </div>
  );
}

export default AdminDashboardView;
