import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api";

export function useAdminData() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchActivities = useCallback(async () => {
    try {
      setActivities(await apiGet("/api/user-activity"));
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useEffect(() => { if (token) fetchUsers(); }, [token, fetchUsers]);
  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  return { users, loading, error, activities, activitiesLoading, fetchUsers };
}
