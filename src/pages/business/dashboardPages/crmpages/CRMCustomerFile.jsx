import React, { useState, useEffect } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

// ✨ קומפוננטה פנימית לניהול תיעודים ומשימות
function ClientTasksAndNotes({ clientId, businessId }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", dueTime: "" });

  // שליפת תיעודים
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/notes/${clientId}`, { params: { businessId } })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("שגיאה בשליפת תיעודים", err));
  }, [clientId, businessId]);

  // שליפת משימות
  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("שגיאה בשליפת משימות", err));
  }, [clientId, businessId]);

  // הוספת תיעוד
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

  // הוספת משימה
  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.dueTime) return;
    try {
      const res = await API.post("/crm-extras/tasks", {
        clientId,
        businessId,
        ...newTask,
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask({ title: "", dueDate: "", dueTime: "" });
    } catch (err) {
      console.error("שגיאה בהוספת משימה", err);
    }
  };

  return (
    <div className="client-extras">
      {/* תיעודים */}
      <div className="notes-section">
        <h3>📝 תיעודים</h3>
        <ul>
          {notes.length === 0 ? (
            <p>אין תיעודים ללקוח</p>
          ) : (
            notes.map((note) => (
              <li key={note._id}>
                <span>{note.text}</span>
                <small>{new Date(note.createdAt).toLocaleString("he-IL")}</small>
              </li>
            ))
          )}
        </ul>
        <textarea
          placeholder="הוסף תיעוד..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={handleAddNote}>➕ שמור תיעוד</button>
      </div>

      {/* משימות */}
      <div className="tasks-section">
        <h3>✅ משימות</h3>
        <ul>
          {tasks.length === 0 ? (
            <p>אין משימות</p>
          ) : (
            tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> –{" "}
                {new Date(task.dueDate).toLocaleDateString("he-IL")} {task.dueTime}
                {task.isCompleted ? " ✔️" : " ⏳"}
              </li>
            ))
          )}
        </ul>

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
        <input
          type="time"
          value={newTask.dueTime}
          onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
        />
        <button onClick={handleAddTask}>➕ צור משימה</button>
      </div>
    </div>
  );
}

export default function CRMCustomerFile({
  client,
  isNew = false,
  onClose,
  businessId,
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("appointments");
  const [customerData, setCustomerData] = useState(null);

  const [newClient, setNewClient] = useState(
    isNew
      ? { fullName: "", phone: "", email: "", address: "" }
      : {
          fullName: client?.fullName || "",
          phone: client?.phone || "",
          email: client?.email || "",
          address: client?.address || "",
        }
  );

  // === שמירה לשרת ===
  const handleSave = async () => {
    if (!newClient.fullName.trim() || !newClient.phone.trim()) {
      alert("❌ שם מלא וטלפון הם שדות חובה");
      return;
    }
    try {
      await API.post(`/crm-clients`, { ...newClient, businessId });
      queryClient.invalidateQueries(["clients", businessId]);
      alert("✅ הלקוח נשמר בהצלחה!");
      onClose();
    } catch (err) {
      console.error("❌ שגיאה בשמירת לקוח:", err);
      alert("❌ שמירת הלקוח נכשלה");
    }
  };

  // === שליפת תיק לקוח מלא ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });
        setCustomerData(res.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת תיק לקוח:", err);
      }
    };
    if (client?._id && businessId && !isNew) fetchData();
  }, [client?._id, businessId, isNew]);

  // ✨ תיק לקוח קיים עם טאבים
  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email || "-"} | 📍 {client?.address || "-"}
      </p>

      {/* כפתורי טאבים */}
      <div className="tabs-header">
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          📅 פגישות
        </button>
        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          📝 אירועים
        </button>
        <button
          className={activeTab === "invoices" ? "active" : ""}
          onClick={() => setActiveTab("invoices")}
        >
          💰 חשבוניות
        </button>
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => setActiveTab("files")}
        >
          📄 קבצים
        </button>
        <button
          className={activeTab === "extras" ? "active" : ""}
          onClick={() => setActiveTab("extras")}
        >
          🗂 תיעודים & משימות
        </button>
      </div>

      {/* תוכן טאב */}
      <div className="tab-content">
        {!customerData ? (
          <p>⏳ טוען נתונים...</p>
        ) : (
          <>
            {activeTab === "appointments" && (
              <div>
                {customerData.appointments?.length === 0 ? (
                  <p>אין פגישות ללקוח זה</p>
                ) : (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>שירות</th>
                        <th>תאריך</th>
                        <th>שעה</th>
                        <th>הערה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td>{appt.serviceName}</td>
                          <td>{appt.date}</td>
                          <td>{appt.time}</td>
                          <td>{appt.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div className="timeline">
                {customerData.events?.length === 0 ? (
                  <p>אין אירועים ללקוח זה</p>
                ) : (
                  customerData.events.map((e) => (
                    <div key={e._id} className="timeline-item">
                      <span>
                        {e.type === "call" && "📞"}
                        {e.type === "message" && "💬"}
                        {e.type === "meeting" && "📅"}
                        {e.type === "task" && "✅"}
                        {e.type === "file" && "📄"}
                      </span>{" "}
                      <strong>{e.title}</strong> – {e.date || "ללא תאריך"}
                      {e.notes && <p>{e.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                {customerData.invoices?.length === 0 ? (
                  <p>אין חשבוניות ללקוח זה</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>מספר</th>
                        <th>תאריך</th>
                        <th>סכום</th>
                        <th>סטטוס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.invoices.map((inv) => (
                        <tr key={inv._id}>
                          <td>{inv.number}</td>
                          <td>{inv.date}</td>
                          <td>{inv.amount} ₪</td>
                          <td>{inv.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "files" && (
              <div>
                {customerData.files?.length === 0 ? (
                  <p>אין קבצים ללקוח זה</p>
                ) : (
                  <ul className="file-list">
                    {customerData.files.map((f) => (
                      <li key={f._id}>
                        <a href={f.url} target="_blank" rel="noopener noreferrer">
                          📄 {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "extras" && (
              <ClientTasksAndNotes clientId={client._id} businessId={businessId} />
            )}
          </>
        )}
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>
          ↩ חזרה
        </button>
      </div>
    </div>
  );
}
