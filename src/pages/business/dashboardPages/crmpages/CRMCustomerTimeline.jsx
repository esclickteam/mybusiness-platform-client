import React, { useEffect, useState } from "react";
import API from "@api";
import "./CRMCustomerTimeline.css";

export default function CRMCustomerTimeline({ client, businessId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ פגישות
        const apptRes = await API.get(`/crm-clients/${client._id}/appointments`);
        const appointments = apptRes.data.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "פגישה",
          date: `${appt.date} ${appt.time}`,
          notes: appt.note || "",
        }));

        // ✅ אירועי CRM
        const eventsRes = await API.get(`/crm-events/${client._id}`);
        const crmEvents = eventsRes.data.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
        }));

        // ✅ שילוב הכל
        setEvents([...appointments, ...crmEvents].sort((a, b) =>
          (b.date || "").localeCompare(a.date || "")
        ));
      } catch (err) {
        console.error("❌ שגיאה בטעינת Timeline:", err);
      }
    };

    if (client?._id) {
      fetchData();
    }
  }, [client?._id]);

  const typeLabels = {
    call: "📞 שיחה",
    message: "💬 הודעה",
    meeting: "📅 פגישה",
    task: "✅ משימה",
    file: "📄 תוכן",
  };

  return (
    <div className="timeline-container">
      <h3>📌 Timeline של {client.fullName}</h3>

      {events.length === 0 ? (
        <p className="no-events">אין אירועים ללקוח זה</p>
      ) : (
        <div className="timeline-list">
          {events.map((e) => (
            <div key={e.id} className="event-card" data-type={e.type}>
              <div className="event-header">
                <span className="event-icon">{typeLabels[e.type]}</span>
                <strong>{e.title}</strong>
              </div>
              <div className="event-meta">
                <span>{e.date || "ללא תאריך"}</span>
              </div>
              {e.notes && <p className="event-notes">{e.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
