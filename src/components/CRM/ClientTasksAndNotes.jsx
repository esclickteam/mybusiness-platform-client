import React, { useState, useEffect } from "react";
import API from "@api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./ClientTasksAndNotes.css";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

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

  const [showAdvanced, setShowAdvanced] = useState(false);

  /* =========================
     LABELS
  ========================= */
  const statusLabels = {
    todo: { text: "To Do" },
    in_progress: { text: "In Progress" },
    waiting: { text: "Waiting" },
    completed: { text: "Completed" },
    cancelled: { text: "Cancelled" },
  };

  const priorityLabels = {
    low: { text: "Low" },
    normal: { text: "Normal" },
    high: { text: "High" },
    critical: { text: "Critical" },
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
        showToast("Note updated");
      } else {
        const res = await API.post("/crm-extras/notes", {
          clientId,
          businessId,
          text: newNote,
        });

        setNotes((prev) => [...prev, res.data]);
        showToast("Note added");
      }

      setNewNote("");
    } catch {
      showToast("Error saving note");
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
      showToast("Note deleted");
    } catch {
      showToast("Error deleting note");
    }
  };

  /* =========================
     SAVE TASK
  ========================= */
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime) {
      showToast("Please fill title, date and time");
      return;
    }

    const parsed = dayjs(
      `${newTask.dueDate} ${newTask.dueTime}`,
      "YYYY-MM-DD HH:mm",
      true
    );

    if (!parsed.isValid()) {
      showToast("Invalid date or time");
      return;
    }

    const dueAt = parsed.toDate();

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
        showToast("Task updated");
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
        showToast("Task added");
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
      setShowAdvanced(false);
    } catch {
      showToast("Error saving task");
    }
  };

  const handleEditTask = (task) => {
    const d = dayjs(task.dueDate).tz(dayjs.tz.guess());

    setEditTaskId(task._id);
    setNewTask({
      title: task.title || "",
      description: task.description || "",
      dueDate: d.isValid() ? d.format("YYYY-MM-DD") : "",
      dueTime: d.isValid() ? d.format("HH:mm") : "",
      status: task.status || "todo",
      priority: task.priority || "normal",
      reminderMinutes: task.reminderMinutes ?? 30,
    });
    setShowAdvanced(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast("Task deleted");
    } catch {
      showToast("Error deleting task");
    }
  };

  const isTaskValid = newTask.title && newTask.dueDate && newTask.dueTime;

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
          <p className="empty-text">
            Keep important details about this client here
          </p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                <div className="note-text">{note.text}</div>
                <small>
                  {dayjs(note.createdAt)
                    .tz(dayjs.tz.guess())
                    .format("DD/MM/YYYY HH:mm")}
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
          placeholder="Write a quick note and press Enter…"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSaveNote();
            }
          }}
        />

        <button className="btn-primary ghost" onClick={handleSaveNote}>
          {editNoteId ? "Update Note" : "Save Note"}
        </button>
      </div>

      {/* TASKS */}
      <div className="tasks-section">
        <h3>✅ Tasks</h3>

        {tasks.length === 0 ? (
          <p className="empty-text">
            Create tasks to follow up, call back or prepare meetings
          </p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => {
              const d = dayjs(task.dueDate).tz(dayjs.tz.guess());
              return (
                <li key={task._id} className={`task-item ${task.status}`}>
                  <strong>{task.title}</strong>

                  {task.description && (
                    <div className="task-description">
                      {task.description}
                    </div>
                  )}

                  {d.isValid() && (
                    <div className="task-meta">
                      📅 {d.format("DD/MM/YYYY")} &nbsp; 🕒 {d.format("HH:mm")}
                    </div>
                  )}

                  <div className="task-meta-row">
                    <span>
                      Status: {statusLabels[task.status]?.text}
                    </span>
                    <span>
                      Priority: {priorityLabels[task.priority]?.text}
                    </span>
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

        {/* FORM */}
        <div className="task-form">
          <input
            placeholder="What needs to be done?"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
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

          <button
            className="link-btn"
            onClick={() => setShowAdvanced((s) => !s)}
          >
            {showAdvanced ? "Hide advanced options" : "Advanced options"}
          </button>

          {showAdvanced && (
            <>
              <textarea
                placeholder="Additional details (optional)"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value,
                  })
                }
              />

              <div className="task-row">
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value,
                    })
                  }
                >
                  {Object.keys(statusLabels).map((k) => (
                    <option key={k} value={k}>
                      {statusLabels[k].text}
                    </option>
                  ))}
                </select>

                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value,
                    })
                  }
                >
                  {Object.keys(priorityLabels).map((k) => (
                    <option key={k} value={k}>
                      {priorityLabels[k].text}
                    </option>
                  ))}
                </select>
              </div>

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
            </>
          )}

          <button
            className="btn-primary"
            onClick={handleSaveTask}
            disabled={!isTaskValid}
          >
            {editTaskId ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
