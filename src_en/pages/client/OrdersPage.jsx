```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

function useAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAppointments() {
      if (!user || !user.userId) {
        setError("User details are not available");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const res = await API.get("/appointments/appointments-by-user", {
          headers,
          withCredentials: true,
        });

        if (isMounted) {
          setAppointments(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Error loading appointments");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { appointments, loading, error };
}

export default function OrdersPage() {
  const { appointments, loading, error } = useAppointments();
  const navigate = useNavigate();

  if (loading) return <div>Loading appointments...</div>;

  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );

  if (appointments.length === 0)
    return <div>You have no scheduled appointments at the moment.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 My Appointments</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {appointments.map((appt) => (
          <li
            key={appt._id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/business/${appt.business}/appointments/${appt._id}`)}
            title={`Click for details of the appointment on ${appt.date} at ${appt.time}`}
          >
            <strong>{appt.serviceName || "Unknown service"}</strong>
            <p>Date: {appt.date} | Time: {appt.time}</p>
            <p>Duration: {Math.floor(appt.duration / 60)} hours {appt.duration % 60} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```