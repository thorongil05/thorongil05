import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import { useTranslation } from "react-i18next";

export function useTeamActions({ onTeamAdded }) {
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const handleEditOpen = (team) => { setSelectedTeam(team); setEditOpen(true); };

  const handleDelete = async (teamId) => {
    const msg = t("football.confirm_delete_team", "Sei sicuro? Tutte le partite associate verranno eliminate.");
    if (!window.confirm(msg)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/teams/${teamId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete team");
      onTeamAdded?.();
    } catch (err) {
      console.error(err);
      alert(t("football.error_deleting_team", { defaultValue: "Errore: {{message}}", message: err.message }));
    }
  };

  return {
    open, setOpen,
    editOpen, setEditOpen,
    selectedTeam,
    canManage,
    handleEditOpen,
    handleDelete,
    onInserted: () => onTeamAdded?.(),
  };
}
