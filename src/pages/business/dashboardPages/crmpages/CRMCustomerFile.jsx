import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CRMCustomerProfile.css"; // אפשר להשתמש באותו CSS כמו קודם

export default function CRMCustomerFile({ client, isNew = false, onClose }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    type: "call", // call, message, meeting, task, file
    title: "",
    date: "",
    notes: ""
  });

  const addEvent = () => {
    if (!newEvent.title) return;
    const event = { id: Date.now(), ...newEvent };
    setEvents([event, ...events]);
    setNewEvent({ type: "call", title: "", date: "", notes: "" });

    // תזכורת למשימות/פגישות
    if ((event.type === "task" || event.type === "meeting") && event.date) {
      toast.info(`📌 נוספה ${event.type === "task" ? "משימה" : "פגישה"} ל-${event.date}: ${event.title}`);
    }
  };

  const typeLabels = {
    call: "📞 שיחה",
    message: "💬 הודעה",
    meeting: "📅 פגישה",
    task: "✅ משימה",
    file: "📄 תוכן"
  };

  return (
    <div className="crm-customer-profile">
      <h2>{isNew ? "➕ לקוח חדש" : `תיק לקוח – ${client?.fullName}`}</h2>
      <p>
        📞 {client?.phone || "-"} | ✉️ {client?.email || "-"} | 📍 {client?.address || "-"}
      </p>

      {/* טופס להוספת אירוע */}
      <div className="add-event-form">
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        >
          <option value="call">שיחה</option>
          <option value="message">הודעה</option>
          <option value="meeting">פגישה</option>
          <option value="task">משימה</option>
          <option value="file">תוכן</option>
        </select>

        <input
          type="text"
          placeholder="כותרת"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />

        <textarea
          placeholder="הערות"
          value={newEvent.notes}
          onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
        />

        <button onClick={addEvent}>➕ הוסף</button>
        <button onClick={onClose} style={{ marginRight: "10px" }}>⬅ חזרה</button>
      </div>

      {/* Timeline */}
      <ul className="event-timeline">
        {events.map((e) => (
          <li key={e.id} data-type={e.type}>
            <span>{typeLabels[e.type]}</span>
            <strong>{e.title}</strong> – {e.date || "ללא תאריך"}
            <p>{e.notes}</p>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}
