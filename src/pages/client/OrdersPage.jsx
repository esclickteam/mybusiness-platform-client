import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./OrdersPage.css";

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

      try {
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const res = await API.get("/appointments/appointments-by-user", {
          headers,
          withCredentials: true,
        });

        if (isMounted) setAppointments(res.data || []);
      } catch (err) {
        if (isMounted) setError("Error loading appointments");
      } finally {
        if (isMounted) setLoading(false);
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

  if (loading) {
    return <div className="orders-loading">Loading appointments…</div>;
  }

  if (error) {
    return (
      <div className="orders-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="orders-empty">
        <h3>No appointments yet</h3>
        <p>Your upcoming appointments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">📄 My Appointments</h2>

      <ul className="orders-list">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="order-card"
            onClick={() =>
              navigate(`/business/${appt.business}/appointments/${appt._id}`)
            }
          >
            <div className="order-card__header">
              <strong>{appt.serviceName || "Unknown Service"}</strong>
            </div>

            <div className="order-card__meta">
              <span>📅 {appt.date}</span>
              <span>⏰ {appt.time}</span>
            </div>

            <div className="order-card__duration">
              ⏳ {Math.floor(appt.duration / 60)}h {appt.duration % 60}m
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
