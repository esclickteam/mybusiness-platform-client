import React, { useState, useEffect } from "react";
import "./CRMCustomerProfile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CRMCustomerProfile({ client }) {
  const [activeTab, setActiveTab] = useState("details");

  // רשימת משימות ללקוח
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    notes: ""
  });

  // הוספת משימה
  const addTask = () => {
    if (!newTask.title) return;
    const task = {
      id: Date.now(),
      ...newTask,
      status: "open",
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", dueDate: "", notes: "" });
  };

  // סימון משימה כהושלמה
  const completeTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: "done" } : t));
  };

  // 📌 בדיקת תאריכי משימות כל דקה
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      tasks.forEach(task => {
        if (task.status === "open" && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            toast.info(`🔔 המשימה "${task.title}" היא להיום!`);
          } else if (diffDays === 1) {
            toast.warn(`⏰ זכור: המשימה "${task.title}" מחר!`);
          }
        }
      });
    }, 60000); // בדיקה כל דקה

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="crm-customer-profile">
      {/* כותרת */}
      <h2>כרטיס לקוח – {client?.name}</h2>

      {/* ניווט טאבים */}
      <div className="tabs">
        <button onClick={() => setActiveTab("details")} className={activeTab === "details" ? "active" : ""}>פרטים</button>
        <button onClick={() => setActiveTab("appointments")} className={activeTab === "appointments" ? "active" : ""}>תורים</button>
        <button onClick={() => setActiveTab("notes")} className={activeTab === "notes" ? "active" : ""}>שיחות / תיעוד</button>
        <button onClick={() => setActiveTab("tasks")} className={activeTab === "tasks" ? "active" : ""}>משימות</button>
      </div>

      {/* תוכן הטאב */}
      <div className="tab-content">
        {/* פרטי לקוח */}
        {activeTab === "details" && (
          <div className="client-info">
            <p><strong>שם:</strong> {client?.name}</p>
            <p><strong>טלפון:</strong> {client?.phone}</p>
            <p><strong>אימייל:</strong> {client?.email}</p>
            <p><strong>הערות:</strong> {client?.notes || "אין הערות"}</p>
          </div>
        )}

        {/* תורים */}
        {activeTab === "appointments" && (
          <div className="client-appointments">
            <h3>📅 היסטוריית תורים</h3>
            {client?.appointments?.length ? (
              <ul>
                {client.appointments.map((a, i) => (
                  <li key={i}>{a.date} – {a.service}</li>
                ))}
              </ul>
            ) : (
              <p>אין תורים רשומים</p>
            )}
          </div>
        )}

        {/* שיחות / תיעוד */}
        {activeTab === "notes" && (
          <div className="client-notes">
            <h3>💬 שיחות / תיעוד</h3>
            {client?.notesHistory?.length ? (
              <ul>
                {client.notesHistory.map((n, i) => (
                  <li key={i}>{n.date}: {n.text}</li>
                ))}
              </ul>
            ) : (
              <p>אין תיעוד שיחות</p>
            )}
          </div>
        )}

        {/* משימות */}
        {activeTab === "tasks" && (
          <div className="client-tasks">
            <h3>✅ משימות ללקוח</h3>
            <div className="task-form">
              <input
                type="text"
                placeholder="כותרת משימה"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <textarea
                placeholder="הערות"
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              />
              <button onClick={addTask}>➕ הוסף משימה</button>
            </div>

            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={task.status}>
                  <div>
                    <strong>{task.title}</strong> – {task.dueDate}
                    <p>{task.notes}</p>
                  </div>
                  {task.status === "open" && (
                    <button onClick={() => completeTask(task.id)}>סמן כהושלם</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* רכיב התזכורות */}
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}
