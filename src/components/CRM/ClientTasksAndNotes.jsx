import React, { useState, useEffect } from "react";
import API from "@api";
import "./ClientTasksAndNotes.css";

export default function ClientTasksAndNotes({ clientId, businessId }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  /* ===== NOTES STATE ===== */
  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);

  /* ===== TASKS STATE ===== */
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "todo",
    priority: "normal",
  });
  const [editTaskId, setEditTaskId] = useState(null);

  const [message, setMessage] = useState(null);

  /* =========================
     LABELS
  ========================= */
  const statusLabels = {
    todo: { text: "To Do", color: "gray" },
    in_progress: { text: "In Progress", color: "orange" },
    waiting: { text: "Waiting", color: "purple" },
    completed: { text: "Completed", color: "green" },
    cancelled: { text: "Cancelled", color: "red" },
  };

  const priorityLabels = {
    low: { text: "Low", color: "blue" },
    normal: { text: "Normal", color: "gray" },
    high: { text: "High", color: "orange" },
    critical: { text: "Critical", color: "red" },
  };

  /* =========================
     FETCH NOTES
  ========================= */
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(res.data))
      .catch(console.error);
  }, [clientId, businessId]);

  /* =========================
     FETCH TASKS
  ========================= */
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(res.data))
      .catch(console.error);
  }, [clientId, businessId]);

  /* =========================
     ADD / UPDATE NOTE
  ========================= */
  const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    try {
      if (editNoteId) {
        const res = await API.patch(`/crm-extras/notes/${editNoteId}`, {
          text: newNote,
        });
        setNotes((prev) =>
          prev.map((n) => (n._id === editNoteId ? res.data : n))
        );
        setMessage("✅ Note updated");
        setEditNoteId(null);
      } else {
        const res = await API.post("/crm-extras/notes", {
          clientId,
          businessId,
          text: newNote,
        });
        setNotes((prev) => [...prev, res.data]);
        setMessage("✅ Note added");
      }
      setNewNote("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving note");
    }
  };

  /* =========================
     EDIT NOTE
  ========================= */
  const handleEditNote = (note) => {
    setEditNoteId(note._id);
    setNewNote(note.text);
  };

  /* =========================
     DELETE NOTE
  ========================= */
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/crm-extras/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      setMessage("🗑 Note deleted");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting note");
    }
  };

  /* =========================
     TASK HANDLERS (unchanged)
  ========================= */
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime) return;

    const iso = new Date(
      `${newTask.dueDate}T${newTask.dueTime}:00`
    ).toISOString();

    try {
      if (editTaskId) {
        const res = await API.patch(`/crm-extras/tasks/${editTaskId}`, {
          ...newTask,
          dueDate: iso,
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === editTaskId ? res.data : t))
        );
        setEditTaskId(null);
      } else {
        const res = await API.post("/crm-extras/tasks", {
          clientId,
          businessId,
          ...newTask,
          dueDate: iso,
        });
        setTasks((prev) => [...prev, res.data]);
      }

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        status: "todo",
        priority: "normal",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="client-extras">
      {message && <div className="feedback-msg">{message}</div>}

      {/* ================= NOTES ================= */}
      <div className="notes-section">
        <h3>📝 Notes</h3>
        <small className="section-hint">
          Notes are for summaries and context. Create tasks for actions.
        </small>

        {notes.length === 0 ? (
          <p className="empty-text">No notes</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                <div className="note-text">{note.text}</div>
                <small>
                  {new Date(note.createdAt).toLocaleString("en-GB")}
                </small>

                <div className="note-actions">
                  <button onClick={() => handleEditNote(note)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteNote(note._id)}>
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />

        <button className="btn-primary" onClick={handleSaveNote}>
          {editNoteId ? "💾 Update Note" : "➕ Save Note"}
        </button>
      </div>

      {/* ================= TASKS ================= */}
      <div className="tasks-section">
        <h3>✅ Tasks</h3>

        {tasks.length === 0 ? (
          <p className="empty-text">No tasks</p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li key={task._id} className={`task-item ${task.status}`}>
                <strong>{task.title}</strong>
              </li>
            ))}
          </ul>
        )}

        <div className="task-form">
          <input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />
          <input
            type="time"
            value={newTask.dueTime}
            onChange={(e) =>
              setNewTask({ ...newTask, dueTime: e.target.value })
            }
          />
          <button className="btn-primary" onClick={handleSaveTask}>
            {editTaskId ? "💾 Update Task" : "➕ Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
