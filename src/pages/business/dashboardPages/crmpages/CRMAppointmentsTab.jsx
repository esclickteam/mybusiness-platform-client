// CRMAppointmentsTab.jsx
import React, { useState, useEffect } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api"; // עדכן לנתיב הנכון
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const statusCycle = ["חדש", "בטיפול", "הושלם"];

const CRMAppointmentsTab = () => {
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  // טען תיאומים מהשרת (או מ-localStorage אם נדרש)
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await API.get("/business/my/appointments");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        // fallback ל-localStorage במידה ויש צורך
        const saved = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
        if (saved.length) setAppointments(saved);
      }
    }
    fetchAppointments();

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      // הוסף auth אם צריך
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to socket in CRMAppointmentsTab");
    });

    // אירוע עדכון תיאומים בזמן אמת
    socket.on("appointmentsUpdated", (updatedAppointments) => {
      console.log("🔄 appointmentsUpdated received from socket", updatedAppointments);
      setAppointments(updatedAppointments);
      localStorage.setItem("demoAppointments", JSON.stringify(updatedAppointments));
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from socket");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.name.includes(search) || appt.phone.includes(search)
  );

  const cycleStatus = async (id) => {
    const apptToUpdate = appointments.find((appt) => appt.id === id);
    if (!apptToUpdate) return;

    const currentIndex = statusCycle.indexOf(apptToUpdate.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      // עדכון סטטוס בשרת
      await API.put(`/business/my/appointments/${id}/status`, { status: nextStatus });

      // עדכון מקומי (יעודכן גם בזמן אמת ע"י socket)
      const updated = appointments.map((appt) =>
        appt.id === id ? { ...appt, status: nextStatus } : appt
      );
      setAppointments(updated);
      localStorage.setItem("demoAppointments", JSON.stringify(updated));
    } catch (err) {
      alert("❌ שגיאה בעדכון סטטוס התיאום");
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.name || !newAppointment.phone || !newAppointment.date || !newAppointment.time) {
      alert("יש למלא שם, טלפון, תאריך ושעה");
      return;
    }

    try {
      const res = await API.post("/business/my/appointments", {
        ...newAppointment,
        status: "חדש",
      });
      setAppointments(res.data.appointments || []);

      setNewAppointment({ name: "", phone: "", service: "", date: "", time: "" });
      setShowAddForm(false);
    } catch (err) {
      alert("❌ שגיאה ביצירת התיאום");
    }
  };

  const startEdit = (appt) => {
    setEditId(appt.id);
    setEditData({ ...appt });
  };

  const saveEdit = async () => {
    if (
      !editData.name ||
      !editData.phone ||
      !editData.date ||
      !editData.time
    ) {
      alert("יש למלא שם, טלפון, תאריך ושעה לעדכון");
      return;
    }

    try {
      await API.put(`/business/my/appointments/${editId}`, editData);

      const res = await API.get("/business/my/appointments");
      setAppointments(res.data.appointments || []);

      setEditId(null);
    } catch (err) {
      alert("❌ שגיאה בעדכון התיאום");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את התיאום?")) {
      try {
        await API.delete(`/business/my/appointments/${id}`);

        const updated = appointments.filter((appt) => appt.id !== id);
        setAppointments(updated);
        localStorage.setItem("demoAppointments", JSON.stringify(updated));
      } catch (err) {
        alert("❌ שגיאה במחיקת התיאום");
      }
    }
  };

  return (
    <div className="crm-appointments-tab">
      <h2>📆 תיאומים / הזמנות</h2>

      <div className="appointments-header">
        <input
          type="text"
          placeholder="חפש לפי שם או טלפון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          ➕ הוסף תיאום
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={newAppointment.name}
            onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newAppointment.phone}
            onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="שירות"
            value={newAppointment.service}
            onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
          />
          <input
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          />
          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={(time) => setNewAppointment({ ...newAppointment, time })}
          />
          <button onClick={handleAddAppointment}>📩 שמור תיאום</button>
        </div>
      )}

      <table className="appointments-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>שירות</th>
            <th>תאריך</th>
            <th>שעה</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="7">לא נמצאו תיאומים</td>
            </tr>
          ) : (
            filteredAppointments.map((appt) => (
              <tr key={appt.id} className={editId === appt.id ? "editing" : ""}>
                <td>
                  {editId === appt.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    appt.name
                  )}
                </td>
                <td>
                  {editId === appt.id ? (
                    <input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    appt.phone
                  )}
                </td>
                <td>
                  {editId === appt.id ? (
                    <input
                      value={editData.service}
                      onChange={(e) => setEditData({ ...editData, service: e.target.value })}
                    />
                  ) : (
                    appt.service
                  )}
                </td>
                <td>
                  {editId === appt.id ? (
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                  ) : (
                    appt.date
                  )}
                </td>
                <td>
                  {editId === appt.id ? (
                    <input
                      value={editData.time}
                      onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                    />
                  ) : (
                    appt.time
                  )}
                </td>
                <td>
                  <button
                    className={`status-btn status-${appt.status}`}
                    onClick={() => cycleStatus(appt.id)}
                  >
                    {appt.status}
                  </button>
                </td>
                <td className="actions-cell">
                  {editId === appt.id ? (
                    <>
                      <button className="action-btn action-edit" onClick={saveEdit}>
                        💾 שמור
                      </button>
                      <button className="action-btn action-cancel" onClick={() => setEditId(null)}>
                        ❌ בטל
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn action-edit" onClick={() => startEdit(appt)}>
                        ✏️ ערוך
                      </button>
                      <button className="action-btn action-cancel" onClick={() => handleDelete(appt.id)}>
                        ❌ בטל
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMAppointmentsTab;
