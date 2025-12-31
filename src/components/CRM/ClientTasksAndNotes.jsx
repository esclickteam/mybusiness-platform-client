import React, { useState, useEffect } from "react";
import API from "@api";
import "./ClientTasksAndNotes.css";

/* ✅ IMPORT קומפוננטות */
import Toast from "../UI/Toast";
import TaskAlertsBanner from "./TaskAlertsBanner";

export default function ClientTasksAndNotes({ clientId, businessId }) {
  /* =========================
     STATE
  ========================= */
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  

  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [tabAlertShown, setTabAlertShown] = useState(false);


  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "todo",
    priority: "normal",
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
     TOAST HELPER
  ========================= */
  const showToast = (text, type = "success") => {
    setToast({ text, type });
  };

  /* =========================
   ON TAB ENTER (ON MOUNT)
========================= */
useEffect(() => {
  if (tabAlertShown) return;
  if (!tasks || tasks.length === 0) return;

  const openTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "cancelled"
  );

  if (openTasks.length > 0) {
    showToast(
      `⚠️ This client has ${openTasks.length} open task${
        openTasks.length > 1 ? "s" : ""
      }`,
      "warning"
    );
  } else {
    showToast("📝 Notes & Tasks loaded", "info");
  }

  setTabAlertShown(true); // ✅ חשוב
}, [tasks, tabAlertShown]);

  /* =========================
     FETCH NOTES
  ========================= */
  useEffect(() => {
    if (!clientId) return;

    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching notes", err);
        setNotes([]);
      });
  }, [clientId, businessId]);

  /* =========================
     FETCH TASKS
  ========================= */
  useEffect(() => {
    if (!clientId) return;

    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching tasks", err);
        setTasks([]);
      });
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
      document.activeElement?.blur();
    } catch (err) {
      console.error("Error saving note", err);
      showToast("Error saving note", "error");
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
    } catch (err) {
      console.error("Error deleting note", err);
      showToast("Error deleting note", "error");
    }
  };

  /* =========================
     ADD / UPDATE TASK
  ========================= */
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime) {
      showToast("Please fill title, date and time", "warning");
      return;
    }

    try {
      if (editTaskId) {
        const res = await API.patch(`/crm-extras/tasks/${editTaskId}`, {
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          dueTime: newTask.dueTime,
          status: newTask.status,
          priority: newTask.priority,
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
          dueDate: newTask.dueDate,
          dueTime: newTask.dueTime,
          status: newTask.status,
          priority: newTask.priority,
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
      });
      document.activeElement?.blur();
    } catch (err) {
      console.error("Error saving task", err);
      showToast("Error saving task", "error");
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setNewTask({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate || "",
      dueTime: task.dueTime || "",
      status: task.status || "todo",
      priority: task.priority || "normal",
    });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast("Task deleted");
    } catch (err) {
      console.error("Error deleting task", err);
      showToast("Error deleting task", "error");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="client-extras">
      {/* ✅ TOAST */}
      {toast && (
        <Toast
          text={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ✅ ALERT BANNER – בכניסה לטאב */}
      <TaskAlertsBanner tasks={tasks} />

      {/* ================= NOTES ================= */}
      <div className="notes-section">
        <h3>📝 Notes</h3>
        <small className="section-hint">
          Notes are for summaries and context. Tasks are for actions.
        </small>

        {notes.length === 0 ? (
          <p className="empty-text">No notes yet</p>
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
          <p className="empty-text">No tasks yet</p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li key={task._id} className={`task-item ${task.status}`}>
                <div className="task-header">
                  <strong>{task.title}</strong>
                  <span className={`badge ${statusLabels[task.status].color}`}>
                    {statusLabels[task.status].text}
                  </span>
                  <span
                    className={`badge ${priorityLabels[task.priority].color}`}
                  >
                    {priorityLabels[task.priority].text}
                  </span>
                </div>

                <div className="task-meta">
                  {task.dueDate}
                  {task.dueTime && ` · ${task.dueTime}`}
                </div>

                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}

                <div className="task-actions">
                  <button onClick={() => handleEditTask(task)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)}>
                    🗑 Delete
                  </button>
                </div>
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
