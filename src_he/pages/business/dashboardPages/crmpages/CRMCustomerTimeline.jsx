import React, { useEffect, useState } from "react";
import API from "@api";
import "./CRMCustomerTimeline.css";

export default function CRMCustomerTimeline({ client, businessId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Consolidated call to the server
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });

        const { appointments = [], events: crmEvents = [] } = res.data;

        // ✅ Mapping appointments
        const mappedAppointments = appointments.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "Meeting",
          date: appt.date && appt.time ? new Date(`${appt.date}T${appt.time}`) : null,
          notes: appt.note || "",
        }));

        // ✅ Mapping CRM events
        const mappedEvents = crmEvents.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date ? new Date(ev.date) : null,
          notes: ev.notes,
        }));

        // ✅ Combining everything + sorting by date
        const combined = [...mappedAppointments, ...mappedEvents].sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date - a.date;
        });

        setEvents(combined);
      } catch (err) {
        console.error("❌ Error loading Timeline:", err);
      }
    };

    if (client?._id && businessId) {
      fetchData();
    }
  }, [client?._id, businessId]);

  const typeLabels = {
    call: "📞 Call",
    message: "💬 Message",
    meeting: "📅 Meeting",
    task: "✅ Task",
    file: "📄 Content",
  };

  return (
    <div className="timeline-container">
      <h3>📌 Timeline of {client.fullName}</h3>

      {events.length === 0 ? (
        <p className="no-events">No events for this client</p>
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
                  {e.date ? e.date.toLocaleString("he-IL") : "No date"}
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
