import React, { useState, useEffect } from "react";
import API from "@api";
import KanbanBoard from "./KanbanBoard"; // ⬅️ ייבוא רכיב הקאנבן
import "./ClientTasksAndNotes.css";

export default function ClientTasksAndNotes({ clientId, businessId }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "todo",
    priority: "normal",
    reminder: "",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [message, setMessage] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" | "kanban"

  // מיפוי סטטוסים וקדימויות לטקסט קריא + צבעים
  const statusLabels = {
    todo: { text: "לביצוע", color: "gray" },
    in_progress: { text: "בתהליך", color: "orange" },
    waiting: { text: "ממתין", color: "purple" },
    completed: { text: "הושלם", color: "green" },
    cancelled: { text: "בוטל", color: "red" },
  };

  const priorityLabels = {
    low: { text: "נמוכה", color: "blue" },
    normal: { text: "רגילה", color: "gray" },
    high: { text: "גבוהה", color: "orange" },
    critical: { text: "קריטית", color: "red" },
  };

  // === שליפת תיעודים ===
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("שגיאה בשליפת תיעודים", err));
  }, [clientId, businessId]);

  // === שליפת משימות ===
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("שגיאה בשליפת משימות", err));
  }, [clientId, businessId]);

  // === הוספת תיעוד חדש ===
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await API.post("/crm-extras/notes", {
        clientId,
        businessId,
        text: newNote,
      });
      setNotes((prev) => [...prev, res.data]);
      setNewNote("");
      setMessage("✅ התיעוד נשמר בהצלחה");
    } catch (err) {
      console.error("שגיאה בהוספת תיעוד", err);
      setMessage("❌ שגיאה בהוספת תיעוד");
    }
  };

  // === הוספת/עדכון משימה ===
  const handleSaveTask = async () => {
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.dueTime) {
      setMessage("⚠️ יש למלא כותרת ותאריך/שעה");
      return;
    }

    const isoDateTime = new Date(
      `${newTask.dueDate}T${newTask.dueTime}:00`
    ).toISOString();

    try {
      if (editTaskId) {
        const res = await API.patch(`/crm-extras/tasks/${editTaskId}`, {
          ...newTask,
          dueDate: isoDateTime,
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === editTaskId ? res.data : t))
        );
        setEditTaskId(null);
        setMessage("✅ המשימה עודכנה בהצלחה");
      } else {
        const res = await API.post("/crm-extras/tasks", {
          clientId,
          businessId,
          ...newTask,
          dueDate: isoDateTime,
        });
        setTasks((prev) => [...prev, res.data]);
        setMessage("✅ המשימה נוספה בהצלחה");
      }

      // איפוס טופס
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        status: "todo",
        priority: "normal",
        reminder: "",
      });
    } catch (err) {
      console.error("שגיאה בשמירת משימה", err);
      setMessage("❌ שגיאה בשמירת משימה");
    }
  };

  // === עריכת משימה קיימת ===
  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      dueTime: task.dueDate
        ? new Date(task.dueDate).toLocaleTimeString("he-IL", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "",
      status: task.status,
      priority: task.priority,
      reminder: task.reminder
        ? new Date(task.reminder).toISOString().slice(0, 16)
        : "",
    });
  };

  // === מחיקת משימה ===
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("האם למחוק את המשימה?")) return;
    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setMessage("🗑️ המשימה נמחקה");
    } catch (err) {
      console.error("שגיאה במחיקת משימה", err);
      setMessage("❌ שגיאה במחיקת משימה");
    }
  };

  return (
    <div className="client-extras">
      {message && <div className="feedback-msg">{message}</div>}

      {/* === תיעודים === */}
      <div className="notes-section">
        <h3>📝 תיעודים</h3>
        {notes.length === 0 ? (
          <p className="empty-text">אין תיעודים ללקוח</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                <span>{note.text}</span>
                <small>
                  {new Date(note.createdAt).toLocaleString("he-IL")}
                </small>
              </li>
            ))}
          </ul>
        )}

        <textarea
          placeholder="הוסף תיעוד..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button className="btn-primary" onClick={handleAddNote}>
          ➕ שמור תיעוד
        </button>
      </div>

      {/* === משימות === */}
      <div className="tasks-section">
        <h3>✅ משימות</h3>

        {/* כפתורי מעבר בין רשימה ל-Kanban */}
        <div className="view-toggle">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            📋 רשימה
          </button>
          <button
            className={viewMode === "kanban" ? "active" : ""}
            onClick={() => setViewMode("kanban")}
          >
            🗂️ Kanban
          </button>
        </div>

        {viewMode === "list" ? (
          <>
            {tasks.length === 0 ? (
              <p className="empty-text">אין משימות</p>
            ) : (
              <ul className="tasks-list">
                {tasks.map((task) => (
                  <li key={task._id} className={`task-item ${task.status}`}>
                    <div className="task-header">
                      <strong>{task.title}</strong>
                      <span
                        className={`badge ${statusLabels[task.status].color}`}
                      >
                        {statusLabels[task.status].text}
                      </span>
                      <span
                        className={`badge ${priorityLabels[task.priority].color}`}
                      >
                        {priorityLabels[task.priority].text}
                      </span>
                    </div>

                    <div className="task-meta">
                      {task.dueDate &&
                        new Date(task.dueDate).toLocaleString("he-IL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>

                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}

                    <div className="task-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditTask(task)}
                      >
                        ✏️ ערוך
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        🗑 מחק
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* === טופס יצירה/עריכה === */}
            <div className="task-form">
              <input
                type="text"
                placeholder="כותרת משימה"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <textarea
                placeholder="תיאור משימה"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />

              <div className="task-datetime">
                <label>🗓 מועד לביצוע:</label>
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
              </div>

              <label>⚡ סטטוס:</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                {Object.entries(statusLabels).map(([key, { text }]) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>

              <label>🏷 עדיפות:</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                {Object.entries(priorityLabels).map(([key, { text }]) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>

              <button className="btn-primary" onClick={handleSaveTask}>
                {editTaskId ? "💾 עדכן משימה" : "➕ הוסף משימה"}
              </button>
            </div>
          </>
        ) : (
          <KanbanBoard clientId={clientId} businessId={businessId} />
        )}
      </div>
    </div>
  );
}
