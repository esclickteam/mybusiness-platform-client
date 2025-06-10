import React, { useState, useEffect, useRef } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api"; // תקן לנתיב הנכון
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext"; // דוגמה - עדכן לפי מיקום אמיתי

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const statusCycle = ["חדש", "בטיפול", "הושלם"];

const CRMAppointmentsTab = () => {
  const { user } = useAuth();
  const businessId = user?.businessId || user?.business?._id || null;

  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    clientPhone: "",
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    clientName: "",
    clientPhone: "",
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
  });

  const socketRef = useRef(null);

  useEffect(() => {
    async function fetchAppointmentsAndServices() {
      try {
        const [appointmentsRes, servicesRes] = await Promise.all([
          API.get("/appointments/all-with-services"),
          API.get("/business/my/services"),
        ]);
        setAppointments(appointmentsRes.data || []);
        setServices(servicesRes.data.services || []);
        localStorage.setItem("demoAppointments", JSON.stringify(appointmentsRes.data || []));
      } catch (err) {
        const savedAppointments = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
        if (savedAppointments.length) setAppointments(savedAppointments);
      }
    }
    fetchAppointmentsAndServices();

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      // הוסף auth אם צריך
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to socket in CRMAppointmentsTab");
    });

    socket.on("appointmentCreated", (appt) => {
      setAppointments((prev) => {
        const updated = [...prev, appt];
        localStorage.setItem("demoAppointments", JSON.stringify(updated));
        return updated;
      });
    });

    socket.on("appointmentUpdated", (updatedAppt) => {
      setAppointments((prev) => {
        const updated = prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt));
        localStorage.setItem("demoAppointments", JSON.stringify(updated));
        return updated;
      });
    });

    socket.on("appointmentDeleted", ({ id }) => {
      setAppointments((prev) => {
        const updated = prev.filter((appt) => appt._id !== id);
        localStorage.setItem("demoAppointments", JSON.stringify(updated));
        return updated;
      });
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

  // חיפוש case-insensitive
  const filteredAppointments = appointments.filter((appt) => {
    const searchLower = search.toLowerCase();
    return (
      appt.clientName?.toLowerCase().includes(searchLower) ||
      appt.clientPhone?.toLowerCase().includes(searchLower)
    );
  });

  const cycleStatus = async (id) => {
    const apptToUpdate = appointments.find((appt) => appt._id === id);
    if (!apptToUpdate) return;

    const currentIndex = statusCycle.indexOf(apptToUpdate.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      await API.put(`/business/my/appointments/${id}/status`, { status: nextStatus });

      const updated = appointments.map((appt) =>
        appt._id === id ? { ...appt, status: nextStatus } : appt
      );
      setAppointments(updated);
      localStorage.setItem("demoAppointments", JSON.stringify(updated));
    } catch (err) {
      alert("❌ שגיאה בעדכון סטטוס התיאום");
    }
  };

  const handleServiceChange = (serviceId, isEdit = false) => {
    const service = services.find((s) => s._id === serviceId);
    if (service) {
      if (isEdit) {
        setEditData((prev) => ({
          ...prev,
          serviceId: service._id,
          serviceName: service.name,
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: service._id,
          serviceName: service.name,
        }));
      }
    } else {
      if (isEdit) {
        setEditData((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
        }));
      }
    }
  };

  const handleAddAppointment = async () => {
    if (
      !newAppointment.clientName ||
      !newAppointment.clientPhone ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId
    ) {
      alert("יש למלא שם, טלפון, שירות, תאריך ושעה");
      return;
    }

    try {
      const res = await API.post("/business/my/appointments", {
        ...newAppointment,
        status: "חדש",
      });
      setAppointments(res.data.appointments || []);

      setNewAppointment({
        clientName: "",
        clientPhone: "",
        serviceId: "",
        serviceName: "",
        date: "",
        time: "",
      });
      setShowAddForm(false);
      localStorage.setItem("demoAppointments", JSON.stringify(res.data.appointments || []));
    } catch (err) {
      alert("❌ שגיאה ביצירת התיאום");
    }
  };

  const startEdit = (appt) => {
    setEditId(appt._id);
    setEditData({ ...appt });
  };

  const saveEdit = async () => {
    if (
      !editData.clientName ||
      !editData.clientPhone ||
      !editData.date ||
      !editData.time ||
      !editData.serviceId
    ) {
      alert("יש למלא שם, טלפון, שירות, תאריך ושעה לעדכון");
      return;
    }

    try {
      await API.put(`/business/my/appointments/${editId}`, editData);

      const res = await API.get("/business/my/appointments");
      setAppointments(res.data.appointments || []);
      localStorage.setItem("demoAppointments", JSON.stringify(res.data.appointments || []));

      setEditId(null);
    } catch (err) {
      alert("❌ שגיאה בעדכון התיאום");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את התיאום?")) {
      try {
        await API.delete(`/business/my/appointments/${id}`);

        const updated = appointments.filter((appt) => appt._id !== id);
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
            value={newAppointment.clientName}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, clientName: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newAppointment.clientPhone}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, clientPhone: e.target.value })
            }
          />
          <select
            value={newAppointment.serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
          >
            <option value="">בחר שירות</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          />
          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={(time) => setNewAppointment({ ...newAppointment, time })}
            businessId={businessId} // העברת businessId כאן
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
              <tr key={appt._id} className={editId === appt._id ? "editing" : ""}>
                <td>
                  {editId === appt._id ? (
                    <input
                      value={editData.clientName}
                      onChange={(e) =>
                        setEditData({ ...editData, clientName: e.target.value })
                      }
                    />
                  ) : (
                    appt.clientName
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <input
                      value={editData.clientPhone}
                      onChange={(e) =>
                        setEditData({ ...editData, clientPhone: e.target.value })
                      }
                    />
                  ) : (
                    appt.clientPhone
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <select
                      value={editData.serviceId}
                      onChange={(e) => handleServiceChange(e.target.value, true)}
                    >
                      <option value="">בחר שירות</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    appt.serviceName || appt.service
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
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
                  {editId === appt._id ? (
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
                    onClick={() => cycleStatus(appt._id)}
                  >
                    {appt.status}
                  </button>
                </td>
                <td className="actions-cell">
                  {editId === appt._id ? (
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
                      <button className="action-btn action-cancel" onClick={() => handleDelete(appt._id)}>
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
