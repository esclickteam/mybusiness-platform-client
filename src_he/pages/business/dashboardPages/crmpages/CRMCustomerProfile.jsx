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

  // ✅ Loading meetings and events from the server when the file is opened
  useEffect(() => {
    const fetchData = async () => {
      try {
        // === Fetching meetings by crmClientId ===
        const apptRes = await API.get(`/appointments/by-client/${client._id}`, {
          params: { businessId },
        });

        const appointments = apptRes.data.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "Meeting",
          date: `${appt.date} ${appt.time}`,
          notes: appt.note || "",
          readonly: true, // Meetings cannot be deleted/edited here
        }));

        // === Fetching additional CRM events ===
        const eventsRes = await API.get(`/crm-events/${client._id}`);
        const crmEvents = eventsRes.data.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
        }));

        // Merging everything together
        setEvents([...appointments, ...crmEvents].sort((a, b) =>
          (b.date || "").localeCompare(a.date || "")
        ));
      } catch (err) {
        console.error("❌ Error loading data:", err);
        toast.error("❌ Error loading data");
      }
    };

    if (client?._id) fetchData();
  }, [client?._id, businessId]);

  // ✅ Adding a new CRM event
  const addEvent = async () => {
    if (!newEvent.title) {
      toast.error("❌ Title is required");
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
        toast.info(`✅ Task added for ${res.data.date}: ${res.data.title}`);
      }
    } catch (err) {
      console.error("❌ Error adding event:", err);
      toast.error("❌ Error adding event");
    }
  };

  // ✅ Deleting an event
  const deleteEvent = async (id) => {
    try {
      await API.delete(`/crm-events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      toast.success("🗑️ Event deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting event:", err);
      toast.error("❌ Error deleting event");
    }
  };

  // ✅ Updating an event (title/notes)
  const updateEvent = async (id, field, value) => {
    try {
      const res = await API.put(`/crm-events/${id}`, { [field]: value });
      setEvents(events.map((e) => (e.id === id ? { ...e, ...res.data } : e)));
      toast.success("✏️ Event updated successfully");
    } catch (err) {
      console.error("❌ Error updating event:", err);
      toast.error("❌ Error updating event");
    }
  };

  const typeLabels = {
    call: "📞 Call",
    message: "💬 Message",
    meeting: "📅 Meeting",
    task: "✅ Task",
    file: "📄 Content",
  };

  return (
    <div className="crm-customer-profile">
      <h2>Customer File – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email}
      </p>

      {/* Add event form */}
      <div className="add-event-form">
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        >
          <option value="call">Call</option>
          <option value="message">Message</option>
          <option value="meeting">Meeting</option>
          <option value="task">Task</option>
          <option value="file">Content</option>
        </select>

        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />

        <textarea
          placeholder="Notes"
          value={newEvent.notes}
          onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
        />

        <button onClick={addEvent}>➕ Add</button>
      </div>

      {/* Timeline */}
      <ul className="event-timeline">
        {events.length === 0 ? (
          <li>No events for this client</li>
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
              – {e.date || "No date"}
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
                  🗑️ Delete
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
