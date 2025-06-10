import React, { useEffect, useState } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api"; // תקן לנתיב הנכון
import { useAuth } from "../../../../context/AuthContext";

const statusCycle = ["new", "pending", "completed"]; // ערכי סטטוס באנגלית לפי backend

const CRMAppointmentsTab = () => {
  const { user, socket } = useAuth();
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

  useEffect(() => {
    async function fetchAppointmentsAndServices() {
      try {
        const [appointmentsRes, servicesRes] = await Promise.all([
          API.get("/appointments/all-with-services"),
          API.get("/business/my/services"),
        ]);
        setAppointments(appointmentsRes.data || []);
        setServices(servicesRes.data.services || []);
      } catch (err) {
        console.error("Error loading appointments or services", err);
      }
    }
    fetchAppointmentsAndServices();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onCreated = (appt) => {
      setAppointments((prev) => [...prev, appt]);
    };
    const onUpdated = (updatedAppt) => {
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    };
    const onDeleted = ({ id }) => {
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    };

    socket.on("appointmentCreated", onCreated);
    socket.on("appointmentUpdated", onUpdated);
    socket.on("appointmentDeleted", onDeleted);

    return () => {
      socket.off("appointmentCreated", onCreated);
      socket.off("appointmentUpdated", onUpdated);
      socket.off("appointmentDeleted", onDeleted);
    };
  }, [socket]);

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
      await API.put(`/appointments/${id}/status`, { status: nextStatus });
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status: nextStatus } : appt))
      );
    } catch {
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
          time: "",
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: service._id,
          serviceName: service.name,
          time: "",
        }));
      }
    } else {
      if (isEdit) {
        setEditData((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
          time: "",
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
          time: "",
        }));
      }
    }
  };

  useEffect(() => {
    if (editId) {
      setEditData((prev) => ({
        ...prev,
        time: "",
      }));
    }
  }, [editData.date, editId]);

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

    const service = services.find((s) => s._id === newAppointment.serviceId);
    const duration = service?.duration || 30;
    const statusEnum = "new";

    try {
      const res = await API.post("/appointments", {
        businessId,
        serviceId: newAppointment.serviceId,
        date: newAppointment.date,
        time: newAppointment.time,
        name: newAppointment.clientName,
        phone: newAppointment.clientPhone,
        duration,
        status: statusEnum,
      });
      setAppointments(res.data.appointments || []);
      setShowAddForm(false);
      setNewAppointment({
        clientName: "",
        clientPhone: "",
        serviceId: "",
        serviceName: "",
        date: "",
        time: "",
      });
    } catch {
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

    const service = services.find((s) => s._id === editData.serviceId);
    const duration = service?.duration || 30;
    const statusEnum = editData.status || "new";

    try {
      await API.put(`/appointments/${editId}`, {
        serviceId: editData.serviceId,
        date: editData.date,
        time: editData.time,
        name: editData.clientName,
        phone: editData.clientPhone,
        duration,
        status: statusEnum,
      });
      const res = await API.get("/appointments");
      setAppointments(res.data.appointments || []);
      setEditId(null);
    } catch {
      alert("❌ שגיאה בעדכון התיאום");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את התיאום?")) {
      try {
        await API.delete(`/appointments/${id}`);
        setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      } catch {
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
            businessId={businessId}
            serviceDuration={
              services.find((s) => s._id === newAppointment.serviceId)?.duration || 30
            }
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
                    <SelectTimeFromSlots
                      date={editData.date}
                      selectedTime={editData.time}
                      onChange={(time) => setEditData({ ...editData, time })}
                      businessId={businessId}
                      serviceDuration={
                        services.find((s) => s._id === editData.serviceId)?.duration || 30
                      }
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
