```javascript
import React, { useState, useEffect } from "react";
import API from "@api";
import KanbanBoard from "./KanbanBoard"; // ⬅️ Importing the Kanban component
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

  // Mapping statuses and priorities to readable text + colors
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

  // === Fetching notes ===
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes", err));
  }, [clientId, businessId]);

  // === Fetching tasks ===
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks", err));
  }, [clientId, businessId]);

  // === Adding a new note ===
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
      setMessage("✅ The note was saved successfully");
    } catch (err) {
      console.error("Error adding note", err);
      setMessage("❌ Error adding note");
    }
  };

  // === Adding/updating a task ===
  const handleSaveTask = async () => {
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.dueTime) {
      setMessage("⚠️ Please fill in the title and date/time");
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
        setMessage("✅ The task was updated successfully");
      } else {
        const res = await API.post("/crm-extras/tasks", {
          clientId,
          businessId,
          ...newTask,
          dueDate: isoDateTime,
        });
        setTasks((prev) => [...prev, res.data]);
        setMessage("✅ The task was added successfully");
      }

      // Reset form
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
      console.error("Error saving task", err);
      setMessage("❌ Error saving task");
    }
  };

  // === Editing an existing task ===
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

  // === Deleting a task ===
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete the task?")) return;
    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setMessage("🗑️ The task was deleted");
    } catch (err) {
      console.error("Error deleting task", err);
      setMessage("❌ Error deleting task");
    }
  };

  return (
    <div className="client-extras">
      {message && <div className="feedback-msg">{message}</div>}

      {/* === Notes === */}
      <div className="notes-section">
        <h3>📝 Notes</h3>
        {notes.length === 0 ? (
          <p className="empty-text">No notes for the client</p>
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
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button className="btn-primary" onClick={handleAddNote}>
          ➕ Save Note
        </button>
      </div>

      {/* === Tasks === */}
      <div className="tasks-section">
        <h3>✅ Tasks</h3>

        {/* Buttons to switch between list and Kanban */}
        <div className="view-toggle">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            📋 List
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
              <p className="empty-text">No tasks</p>
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
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* === Create/Edit form === */}
            <div className="task-form">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />

              <div className="task-datetime">
                <label>🗓 Due Date:</label>
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

              <label>⚡ Status:</label>
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

              <label>🏷 Priority:</label>
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
                {editTaskId ? "💾 Update Task" : "➕ Add Task"}
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
```