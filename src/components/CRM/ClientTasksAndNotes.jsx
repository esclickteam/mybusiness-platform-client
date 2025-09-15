import React, { useState, useEffect } from "react";
import API from "@api";
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
    } catch (err) {
      console.error("שגיאה בהוספת תיעוד", err);
    }
  };

  // === הוספת משימה חדשה ===
  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.dueTime) return;

    const isoDateTime = new Date(
      `${newTask.dueDate}T${newTask.dueTime}:00`
    ).toISOString();

    try {
      const res = await API.post("/crm-extras/tasks", {
        clientId,
        businessId,
        title: newTask.title,
        description: newTask.description,
        dueDate: isoDateTime,
        status: newTask.status,
        priority: newTask.priority,
        reminder: newTask.reminder || null,
      });
      setTasks((prev) => [...prev, res.data]);
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
      console.error("שגיאה בהוספת משימה", err);
    }
  };

  return (
    <div className="client-extras">
      {/* === תיעודים === */}
      <div className="notes-section">
        <h3>📝 תיעודים</h3>
        {notes.length === 0 ? (
          <p className="empty-text">אין תיעודים ללקוח</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note._id}>
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
        <button onClick={handleAddNote}>➕ שמור תיעוד</button>
      </div>

      {/* === משימות === */}
      <div className="tasks-section">
        <h3>✅ משימות</h3>
        {tasks.length === 0 ? (
          <p className="empty-text">אין משימות</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <span>
                  <strong>{task.title}</strong> –{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("he-IL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""}{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                  {" | "}
                  <em>{task.status}</em> | <b>{task.priority}</b>
                </span>
                <small>
                  {task.isCompleted ? "✔️ בוצע" : "⏳ ממתין"}
                </small>
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          placeholder="כותרת משימה"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="תיאור משימה"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />

        {/* מועד לביצוע */}
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
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">לביצוע</option>
          <option value="in_progress">בתהליך</option>
          <option value="waiting">ממתין</option>
          <option value="completed">הושלם</option>
          <option value="cancelled">בוטל</option>
        </select>

        <label>🏷 עדיפות:</label>
        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value })
          }
        >
          <option value="low">נמוכה</option>
          <option value="normal">רגילה</option>
          <option value="high">גבוהה</option>
          <option value="critical">קריטית</option>
        </select>

        {/* תזכורת */}
        <div className="task-reminder">
          <label>⏰ תזכורת (לא חובה):</label>
          <input
            type="datetime-local"
            value={newTask.reminder}
            onChange={(e) =>
              setNewTask({ ...newTask, reminder: e.target.value })
            }
          />
        </div>

        <button onClick={handleAddTask}>➕ צור משימה</button>
      </div>
    </div>
  );
}
