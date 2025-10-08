import React, { useEffect, useState } from "react";
import API from "@api";
import "./CRMCustomerProfile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CRMCustomerFile({ client, businessId }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    type: "call",
    title: "",
    date: "",
    notes: "",
  });

  // ✅ טעינת פגישות ואירועים מהשרת כשהתיק נפתח
  useEffect(() => {
    const fetchData = async () => {
      try {
        // === שליפת פגישות לפי crmClientId ===
        const apptRes = await API.get(`/appointments/by-client/${client._id}`, {
          params: { businessId },
        });

        const appointments = apptRes.data.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "פגישה",
          date: `${appt.date} ${appt.time}`,
          notes: appt.note || "",
          readonly: true, // פגישות אי אפשר למחוק/לערוך כאן
        }));

        // === שליפת אירועי CRM נוספים ===
        const eventsRes = await API.get(`/crm-events/${client._id}`);
        const crmEvents = eventsRes.data.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
        }));

        // מיזוג הכל יחד
        setEvents([...appointments, ...crmEvents].sort((a, b) =>
          (b.date || "").localeCompare(a.date || "")
        ));
      } catch (err) {
        console.error("❌ שגיאה בטעינת נתונים:", err);
        toast.error("❌ שגיאה בטעינת נתונים");
      }
    };

    if (client?._id) fetchData();
  }, [client?._id, businessId]);

  // ✅ הוספת אירוע CRM חדש
  const addEvent = async () => {
    if (!newEvent.title) {
      toast.error("❌ חייבים למלא כותרת");
      return;
    }

    try {
      const res = await API.post("/crm-events", {
        ...newEvent,
        clientId: client._id,
        businessId,
      });

      setEvents([
        {
          id: res.data._id,
          type: res.data.type,
          title: res.data.title,
          date: res.data.date,
          notes: res.data.notes,
        },
        ...events,
      ]);

      setNewEvent({ type: "call", title: "", date: "", notes: "" });

      if (res.data.type === "task" && res.data.date) {
        toast.info(`✅ נוספה משימה ל-${res.data.date}: ${res.data.title}`);
      }
    } catch (err) {
      console.error("❌ שגיאה בהוספת אירוע:", err);
      toast.error("❌ שגיאה בהוספת אירוע");
    }
  };

  // ✅ מחיקת אירוע
  const deleteEvent = async (id) => {
    try {
      await API.delete(`/crm-events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      toast.success("🗑️ האירוע נמחק בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה במחיקת אירוע:", err);
      toast.error("❌ שגיאה במחיקת אירוע");
    }
  };

  // ✅ עדכון אירוע (כותרת/הערות)
  const updateEvent = async (id, field, value) => {
    try {
      const res = await API.put(`/crm-events/${id}`, { [field]: value });
      setEvents(events.map((e) => (e.id === id ? { ...e, ...res.data } : e)));
      toast.success("✏️ האירוע עודכן בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה בעדכון אירוע:", err);
      toast.error("❌ שגיאה בעדכון אירוע");
    }
  };

  const typeLabels = {
    call: "📞 שיחה",
    message: "💬 הודעה",
    meeting: "📅 פגישה",
    task: "✅ משימה",
    file: "📄 תוכן",
  };

  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email}
      </p>

      {/* טופס הוספת אירוע */}
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
      </div>

      {/* Timeline */}
      <ul className="event-timeline">
        {events.length === 0 ? (
          <li>אין אירועים ללקוח זה</li>
        ) : (
          events.map((e) => (
            <li key={e.id}>
              <span>{typeLabels[e.type]}</span>
              <strong
                contentEditable={!e.readonly}
                suppressContentEditableWarning
                onBlur={(ev) =>
                  !e.readonly && updateEvent(e.id, "title", ev.target.innerText)
                }
              >
                {e.title}
              </strong>{" "}
              – {e.date || "ללא תאריך"}
              <p
                contentEditable={!e.readonly}
                suppressContentEditableWarning
                onBlur={(ev) =>
                  !e.readonly && updateEvent(e.id, "notes", ev.target.innerText)
                }
              >
                {e.notes}
              </p>
              {!e.readonly && (
                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(e.id)}
                >
                  🗑️ מחק
                </button>
              )}
            </li>
          ))
        )}
      </ul>

      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
}
