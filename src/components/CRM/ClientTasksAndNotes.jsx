import React, { useState, useEffect } from "react";
import API from "@api";
import dayjs from "dayjs";
import "./ClientTasksAndNotes.css";

export default function ClientTasksAndNotes({ clientId, businessId }) {
  /* =========================
     STATE
  ========================= */
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "todo",
    priority: "normal",
    reminderMinutes: 30,
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const [toast, setToast] = useState(null);

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
     TOAST
  ========================= */
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  };

  /* =========================
     FETCH NOTES
  ========================= */
  useEffect(() => {
    if (!clientId) return;

    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNotes([]));
  }, [clientId, businessId]);

  /* =========================
     FETCH TASKS
  ========================= */
  useEffect(() => {
    if (!clientId) return;

    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTasks([]));
  }, [clientId, businessId]);

  /* =========================
     SAVE NOTE
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
        setEditNoteId(null);
        showToast("✅ Note updated");
      } else {
        const res = await API.post("/crm-extras/notes", {
          clientId,
          businessId,
          text: newNote,
        });

        setNotes((prev) => [...prev, res.data]);
        showToast("✅ Note added");
      }

      setNewNote("");
    } catch {
      showToast("❌ Error saving note");
    }
  };

  const handleEditNote = (note) => {
    setEditNoteId(note._id);
    setNewNote(note.text);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await API.delete(`/crm-extras/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      showToast("🗑 Note deleted");
    } catch {
      showToast("❌ Error deleting note");
    }
  };

  /* =========================
     SAVE TASK
  ========================= */
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime) {
      showToast("⚠️ Please fill title, date and time");
      return;
    }

    const dueAt = dayjs(
      `${newTask.dueDate} ${newTask.dueTime}`,
      "YYYY-MM-DD HH:mm"
    ).toDate();

    try {
      if (editTaskId) {
        const res = await API.patch(`/crm-extras/tasks/${editTaskId}`, {
          title: newTask.title,
          description: newTask.description,
          dueDate: dueAt,
          status: newTask.status,
          priority: newTask.priority,
          reminderMinutes: newTask.reminderMinutes,
        });

        setTasks((prev) =>
          prev.map((t) => (t._id === editTaskId ? res.data : t))
        );
        setEditTaskId(null);
        showToast("✅ Task updated");
      } else {
        const res = await API.post("/crm-extras/tasks", {
          clientId,
          businessId,
          title: newTask.title,
          description: newTask.description,
          dueDate: dueAt,
          status: newTask.status,
          priority: newTask.priority,
          reminderMinutes: newTask.reminderMinutes,
        });

        setTasks((prev) => [...prev, res.data]);
        showToast("✅ Task added");
      }

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        status: "todo",
        priority: "normal",
        reminderMinutes: 30,
      });
    } catch {
      showToast("❌ Error saving task");
    }
  };

  const handleEditTask = (task) => {
    const d = dayjs(task.dueDate);

    setEditTaskId(task._id);
    setNewTask({
      title: task.title || "",
      description: task.description || "",
      dueDate: d.isValid() ? d.local().format("YYYY-MM-DD") : "",
      dueTime: d.isValid() ? d.local().format("HH:mm") : "",
      status: task.status || "todo",
      priority: task.priority || "normal",
      reminderMinutes: task.reminderMinutes ?? 30,
    });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast("🗑 Task deleted");
    } catch {
      showToast("❌ Error deleting task");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="client-extras">
      {toast && <div className="toast-message">{toast}</div>}

      {/* NOTES */}
      <div className="notes-section">
        <h3>📝 Notes</h3>

        {notes.length === 0 ? (
          <p className="empty-text">No notes yet</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                <div className="note-text">{note.text}</div>
                <small>
                  {dayjs(note.createdAt).local().format("DD/MM/YYYY HH:mm")}
                </small>
                <div className="note-actions">
                  <button onClick={() => handleEditNote(note)}>✏️</button>
                  <button onClick={() => handleDeleteNote(note._id)}>🗑</button>
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

      {/* TASKS */}
      <div className="tasks-section">
        <h3>✅ Tasks</h3>

        {tasks.length === 0 ? (
          <p className="empty-text">No tasks yet</p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => {
              const d = dayjs(task.dueDate);

              return (
                <li key={task._id} className={`task-item ${task.status}`}>
                  <strong>{task.title}</strong>

                  <div className="task-meta">
                    {d.isValid()
                      ? d.local().format("DD/MM/YYYY · HH:mm")
                      : "—"}
                  </div>

                  <div className="task-actions">
                    <button onClick={() => handleEditTask(task)}>✏️</button>
                    <button onClick={() => handleDeleteTask(task._id)}>🗑</button>
                  </div>
                </li>
              );
            })}
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

          <select
            value={newTask.reminderMinutes}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                reminderMinutes: Number(e.target.value),
              })
            }
          >
            <option value={0}>No reminder</option>
            <option value={5}>5 minutes before</option>
            <option value={15}>15 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
            <option value={1440}>1 day before</option>
          </select>

          <button className="btn-primary" onClick={handleSaveTask}>
            {editTaskId ? "💾 Update Task" : "➕ Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
