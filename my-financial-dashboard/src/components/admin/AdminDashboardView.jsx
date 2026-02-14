import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserEditDialog from "./UserEditDialog";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../utils/api";

function AdminDashboardView() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { token, user: currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const fetchActivities = useCallback(async () => {
    try {
      const data = await apiGet("/api/user-activity");
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      alert(t("admin.cannot_delete_self", "You cannot delete yourself"));
      return;
    }

    if (!window.confirm(t("admin.confirm_delete_user", "Are you sure you want to delete this user?"))) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("admin.dashboard", "Admin Dashboard")}
      </Typography>
      <Typography variant="h6" gutterBottom color="text.secondary">
        {t("admin.user_management", "User Management")}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
        <Table aria-label="user table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.username", "Username")}</TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.email", "Email")}</TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.role", "Role")}</TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.joined_at", "Joined At")}</TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">{t("common.actions", "Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                {!isMobile && <TableCell>{user.email}</TableCell>}
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: user.role === "admin" ? "error.light" : "info.light",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.80rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role.toUpperCase()}
                  </Box>
                </TableCell>
                {!isMobile && <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>}
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title={user.id === currentUser?.id ? t("admin.cannot_edit_self", "You cannot edit your own role") : t("common.edit", "Edit")}>
                      <Box component="span">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEdit(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Tooltip title={t("common.delete", "Delete")}>
                      <Box component="span">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Activity Statistics */}
      <Typography variant="h6" gutterBottom color="text.secondary" sx={{ mt: 4 }}>
        {t("admin.user_activity", "User Activity Statistics")}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
        <Table aria-label="activity table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "secondary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.username", "Username")}</TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.email", "Email")}</TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">{t("admin.sessions", "Sessions")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">{t("admin.matches_added", "Matches +")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">{t("admin.matches_updated", "Matches ~")}</TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">{t("admin.teams_added", "Teams +")}</TableCell>
              )}
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("admin.last_activity", "Last Activity")}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {activitiesLoading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 7} align="center">
                  {t("admin.no_activity", "No activity data available")}
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.user_id}>
                  <TableCell>{activity.username}</TableCell>
                  {!isMobile && <TableCell>{activity.email}</TableCell>}
                  <TableCell align="center">{activity.session_count || 0}</TableCell>
                  <TableCell align="center">{activity.total_statistics?.matches_added || 0}</TableCell>
                  <TableCell align="center">{activity.total_statistics?.matches_updated || 0}</TableCell>
                  {!isMobile && (
                    <TableCell align="center">{activity.total_statistics?.teams_added || 0}</TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      {activity.last_activity
                        ? new Date(activity.last_activity).toLocaleString()
                        : t("admin.no_activity_yet", "No activity yet")}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUpdate={fetchUsers}
        user={userToEdit}
        token={token}
      />
    </Box>
  );
}

export default AdminDashboardView;
