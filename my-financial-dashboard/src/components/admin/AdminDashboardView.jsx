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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminDashboardView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
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
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom color="text.secondary">
        User Management
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Joined At</TableCell>
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
                <TableCell>{user.email}</TableCell>
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
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminDashboardView;
