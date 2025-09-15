import React, { useState, useEffect } from "react";
import API from "@api";
import "./ClientTasksAndNotes.css";

export default function ClientTasksAndNotes({ clientId, businessId }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    dueTime: "",
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

    // מחבר תאריך ושעה ל־ISO string
    const isoDateTime = new Date(
      `${newTask.dueDate}T${newTask.dueTime}:00`
    ).toISOString();

    try {
      const res = await API.post("/crm-extras/tasks", {
        clientId,
        businessId,
        title: newTask.title,
        dueDate: isoDateTime,
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask({ title: "", dueDate: "", dueTime: "" });
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
                    : ""}
                  {" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
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
        <div className="task-datetime">
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
        <button onClick={handleAddTask}>➕ צור משימה</button>
      </div>
    </div>
  );
}
