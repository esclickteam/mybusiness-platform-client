// src/pages/client/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !user.businessId) {
        setError("פרטי העסק לא זמינים");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = {
          businessId: user.businessId,
          // לפי מה שיש בשרת, אפשר לשלוח אימייל או טלפון של הלקוח
          email: user.email || undefined,
          phone: user.phone || undefined,
        };

        const res = await API.get("/appointments/appointments-by-client", {
          params,
          withCredentials: true,
        });

        setAppointments(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הפגישות");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  if (loading) return <div>טוען פגישות...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (appointments.length === 0)
    return <div>אין פגישות פעילות כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 הפגישות שלי</h2>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {appointments.map((appt) => (
          <li
            key={appt._id}
            style={{
              marginBottom: 15,
              padding: 15,
              border: "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#fafafa",
            }}
          >
            <strong>שירות:</strong> {appt.serviceName || "לא זמין"} <br />
            <strong>תאריך:</strong> {appt.date} <br />
            <strong>שעה:</strong> {appt.time} <br />
            <strong>משך:</strong>{" "}
            {Math.floor(appt.duration / 60)}:{(appt.duration % 60)
              .toString()
              .padStart(2, "0")} דקות <br />
            <strong>כתובת:</strong> {appt.address || "לא זמין"} <br />
            <strong>הערה:</strong> {appt.note || "אין"} <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
