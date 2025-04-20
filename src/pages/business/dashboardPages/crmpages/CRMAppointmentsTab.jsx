import React, { useState, useEffect } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";

const initialAppointments = [
  {
    id: 1,
    name: "דנה כהן",
    phone: "050-1234567",
    service: "ייעוץ עסקי",
    date: "2025-04-09",
    time: "10:00",
    status: "חדש",
  },
  {
    id: 2,
    name: "יוסי לוי",
    phone: "052-9876543",
    service: "בניית אתר",
    date: "2025-04-10",
    time: "11:30",
    status: "בטיפול",
  },
  {
    id: 3,
    name: "עדי נעמן",
    phone: "053-4567890",
    service: "שיחת טלפון",
    date: "2025-04-11",
    time: "13:00",
    status: "הושלם",
  },
];

const statusCycle = ["חדש", "בטיפול", "הושלם"];

const CRMAppointmentsTab = () => {
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState(initialAppointments);

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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
    if (saved.length) setAppointments(saved);
  }, []);

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.name.includes(search) || appt.phone.includes(search)
  );

  const cycleStatus = (id) => {
    const updated = appointments.map((appt) => {
      if (appt.id === id) {
        const currentIndex = statusCycle.indexOf(appt.status);
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
        return { ...appt, status: nextStatus };
      }
      return appt;
    });
    setAppointments(updated);
    localStorage.setItem("demoAppointments", JSON.stringify(updated));
  };

  const handleAddAppointment = () => {
    if (!newAppointment.name || !newAppointment.phone || !newAppointment.date || !newAppointment.time) {
      alert("יש למלא שם, טלפון, תאריך ושעה");
      return;
    }

    const newAppt = {
      ...newAppointment,
      id: Date.now(),
      status: "חדש",
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem("demoAppointments", JSON.stringify(updated));

    setNewAppointment({ name: "", phone: "", service: "", date: "", time: "" });
    setShowAddForm(false);
  };

  const startEdit = (appt) => {
    setEditId(appt.id);
    setEditData({ ...appt });
  };

  const saveEdit = () => {
    const updated = appointments.map((appt) =>
      appt.id === editId ? { ...appt, ...editData } : appt
    );
    setAppointments(updated);
    localStorage.setItem("demoAppointments", JSON.stringify(updated));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("האם למחוק את התיאום?")) {
      const updated = appointments.filter((appt) => appt.id !== id);
      setAppointments(updated);
      localStorage.setItem("demoAppointments", JSON.stringify(updated));
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
                <td>{editId === appt.id ? <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /> : appt.name}</td>
                <td>{editId === appt.id ? <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} /> : appt.phone}</td>
                <td>{editId === appt.id ? <input value={editData.service} onChange={(e) => setEditData({ ...editData, service: e.target.value })} /> : appt.service}</td>
                <td>{editId === appt.id ? <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /> : appt.date}</td>
                <td>{editId === appt.id ? <input value={editData.time} onChange={(e) => setEditData({ ...editData, time: e.target.value })} /> : appt.time}</td>
                <td>
                  <button className={`status-btn status-${appt.status}`} onClick={() => cycleStatus(appt.id)}>
                    {appt.status}
                  </button>
                </td>
                <td className="actions-cell">
                  {editId === appt.id ? (
                    <>
                      <button className="action-btn action-edit" onClick={saveEdit}>💾 שמור</button>
                      <button className="action-btn action-cancel" onClick={() => handleDelete(appt.id)}>❌ בטל</button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn action-edit" onClick={() => startEdit(appt)}>✏️ ערוך</button>
                      <button className="action-btn action-cancel" onClick={() => handleDelete(appt.id)}>❌ בטל</button>
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
