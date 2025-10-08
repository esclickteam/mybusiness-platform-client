import React, { useEffect, useState } from "react";
import API from "@api";
import "./CRMCustomerTimeline.css";

export default function CRMCustomerTimeline({ client, businessId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ קריאה מרוכזת לשרת
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });

        const { appointments = [], events: crmEvents = [] } = res.data;

        // ✅ מיפוי פגישות
        const mappedAppointments = appointments.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "פגישה",
          date: appt.date && appt.time ? new Date(`${appt.date}T${appt.time}`) : null,
          notes: appt.note || "",
        }));

        // ✅ מיפוי אירועי CRM
        const mappedEvents = crmEvents.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date ? new Date(ev.date) : null,
          notes: ev.notes,
        }));

        // ✅ שילוב הכל + מיון לפי תאריך
        const combined = [...mappedAppointments, ...mappedEvents].sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date - a.date;
        });

        setEvents(combined);
      } catch (err) {
        console.error("❌ שגיאה בטעינת Timeline:", err);
      }
    };

    if (client?._id && businessId) {
      fetchData();
    }
  }, [client?._id, businessId]);

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
                <span>
                  {e.date ? e.date.toLocaleString("he-IL") : "ללא תאריך"}
                </span>
              </div>
              {e.notes && <p className="event-notes">{e.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
