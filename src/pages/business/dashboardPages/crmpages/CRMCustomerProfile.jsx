import React, { useEffect, useState } from "react";
import API from "@api";
import "./CRMCustomerProfile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CRMCustomerFile({ client, businessId }) {
  const [events, setEvents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [newEvent, setNewEvent] = useState({
    type: "call",
    title: "",
    date: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    notes: "",
  });

  /* =====================================================
     Load events (appointments + CRM events)
  ===================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await API.get(
          `/appointments/by-client/${client._id}`,
          { params: { businessId } }
        );

        const appointments = apptRes.data.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "Meeting",
          date: `${appt.date} ${appt.time}`,
          notes: appt.note || "",
          readonly: true,
        }));

        const eventsRes = await API.get(`/crm-events/${client._id}`);
        const crmEvents = eventsRes.data.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
          readonly: false,
        }));

        setEvents(
          [...appointments, ...crmEvents].sort((a, b) =>
            (b.date || "").localeCompare(a.date || "")
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load customer data");
      }
    };

    if (client?._id) fetchData();
  }, [client?._id, businessId]);

  /* =====================================================
     Add Event
  ===================================================== */
  const addEvent = async () => {
    if (!newEvent.title) {
      toast.error("Title is required");
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
          readonly: false,
        },
        ...events,
      ]);

      setNewEvent({ type: "call", title: "", date: "", notes: "" });
      setShowAdd(false);
      toast.success("✅ Event added");
    } catch {
      toast.error("❌ Failed to add event");
    }
  };

  /* =====================================================
     Edit Event
  ===================================================== */
  const startEdit = (e) => {
    setEditingId(e.id);
    setEditDraft({ title: e.title, notes: e.notes });
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/crm-events/${id}`, editDraft);
      setEvents(events.map((e) => (e.id === id ? { ...e, ...res.data } : e)));
      setEditingId(null);
      toast.success("✏️ Event updated");
    } catch {
      toast.error("❌ Failed to update");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", notes: "" });
  };

  /* =====================================================
     Delete Event
  ===================================================== */
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/crm-events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      toast.success("🗑️ Event deleted");
    } catch {
      toast.error("❌ Failed to delete");
    }
  };

  const typeLabels = {
    call: "📞 Call",
    message: "💬 Message",
    meeting: "📅 Meeting",
    task: "✅ Task",
    file: "📄 File",
  };

  return (
    <div className="crm-customer-profile">
      {/* ================= HEADER ================= */}
      <div className="customer-header">
        <div>
          <h2>{client?.fullName}</h2>
          <p className="customer-meta">
            📞 {client?.phone || "-"} &nbsp;|&nbsp; ✉️ {client?.email || "-"}
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShowAdd((s) => !s)}
        >
          ➕ Add Event
        </button>
      </div>

      {/* ================= ADD EVENT ================= */}
      {showAdd && (
        <div className="add-event-card">
          <select
            value={newEvent.type}
            onChange={(e) =>
              setNewEvent({ ...newEvent, type: e.target.value })
            }
          >
            <option value="call">Call</option>
            <option value="message">Message</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="file">File</option>
          </select>

          <input
            placeholder="Title *"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
          />

          <textarea
            placeholder="Notes"
            value={newEvent.notes}
            onChange={(e) =>
              setNewEvent({ ...newEvent, notes: e.target.value })
            }
          />

          <div className="actions">
            <button onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="primary" onClick={addEvent}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* ================= TIMELINE ================= */}
      <ul className="event-timeline">
        {events.length === 0 ? (
          <li className="empty">No activity yet</li>
        ) : (
          events.map((e) => (
            <li key={e.id} className="event-item">
              <div className="event-header">
                <span>{typeLabels[e.type]}</span>
                <span className="event-date">
                  {e.date || "No date"}
                </span>
              </div>

              {editingId === e.id ? (
                <>
                  <input
                    value={editDraft.title}
                    onChange={(ev) =>
                      setEditDraft({
                        ...editDraft,
                        title: ev.target.value,
                      })
                    }
                  />
                  <textarea
                    value={editDraft.notes}
                    onChange={(ev) =>
                      setEditDraft({
                        ...editDraft,
                        notes: ev.target.value,
                      })
                    }
                  />

                  <div className="actions">
                    <button onClick={cancelEdit}>Cancel</button>
                    <button
                      className="primary"
                      onClick={() => saveEdit(e.id)}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong>{e.title}</strong>
                  {e.notes && <p>{e.notes}</p>}

                  {!e.readonly && (
                    <div className="event-actions">
                      <button onClick={() => startEdit(e)}>✏️ Edit</button>
                      <button
                        className="danger"
                        onClick={() => deleteEvent(e.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))
        )}
      </ul>

      <ToastContainer position="top-center" autoClose={3500} />
    </div>
  );
}
