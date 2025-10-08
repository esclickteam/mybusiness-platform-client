import React, { useState } from "react";
import "./MyTasks.css";
import { Link } from "react-router-dom";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleAddTask = () => {
    if (!description || !date) return;
    const newTask = {
      id: Date.now(),
      description,
      details,
      phone,
      date,
      time,
      status: "Pending",
      completed: false,
      attempts
    };
    setTasks([...tasks, newTask]);
    setDescription("");
    setDetails("");
    setPhone("");
    setDate("");
    setTime("");
    setAttempts(0);
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleIncreaseAttempts = (id) => {
    setTasks(tasks.map(task =>
      task.id === id && task.attempts < 4 ? { ...task, attempts: task.attempts + 1 } : task
    ));
  };

  const handleDecreaseAttempts = (id) => {
    setTasks(tasks.map(task =>
      task.id === id && task.attempts > 0 ? { ...task, attempts: task.attempts - 1 } : task
    ));
  };

  return (
    <div className="my-tasks">
      <h1>📋 Personal Tasks</h1>

      <Link to="/staff/dashboard" className="back-dashboard">🔙 Back to Dashboard</Link>

      <div className="task-form">
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          placeholder="Additional Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>
        <input
          type="tel"
          placeholder="Phone for Callback (Optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleAddTask}>➕ Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <p><strong>{task.description}</strong></p>
            {task.details && <p>📝 {task.details}</p>}
            {task.phone && <p>📞 {task.phone}</p>}
            <p>📅 {task.date} {task.time && `⏰ ${task.time}`}</p>
            <p>Status: {task.completed ? "Completed" : task.status}</p>
            <p>🔁 Attempts: {task.attempts}</p>

            <div className="task-actions">
              <button onClick={() => handleToggleComplete(task.id)}>
                {task.completed ? "↩️ Undo Completion" : "✔️ Mark as Completed"}
              </button>
              <button onClick={() => handleIncreaseAttempts(task.id)}>➕ Attempt</button>
              <button onClick={() => handleDecreaseAttempts(task.id)}>➖</button>
              {!task.phone && (
                <button onClick={() => handleDeleteTask(task.id)} className="delete">🗑️ Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyTasks;
