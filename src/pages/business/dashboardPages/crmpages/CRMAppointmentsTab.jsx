import React, { useEffect, useState } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api"; // תקן לנתיב הנכון
import { useAuth } from "../../../../context/AuthContext";

const statusCycle = ["new", "pending", "completed"];

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
    address: "",
    email: "",
    note: "",
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    clientName: "",
    clientPhone: "",
    address: "",
    email: "",
    note: "",
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
      setAppointments((prev) => {
        if (prev.some((a) => a._id === appt._id)) return prev;
        return [...prev, appt];
      });
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
    await API.post("/appointments", {
      businessId,
      serviceId: newAppointment.serviceId,
      date: newAppointment.date,
      time: newAppointment.time,
      name: newAppointment.clientName,
      phone: newAppointment.clientPhone,
      address: newAppointment.address,
      email: newAppointment.email,
      note: newAppointment.note,
      duration,
      status: statusEnum,
    });

    // לא מוסיפים את התיאום פה כדי למנוע כפילויות
    setShowAddForm(false);
    setNewAppointment({
      clientName: "",
      clientPhone: "",
      address: "",
      email: "",
      note: "",
      serviceId: "",
      serviceName: "",
      date: "",
      time: "",
    });
  } catch {
    alert("❌ שגיאה ביצירת התיאום");
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
          <input
            type="text"
            placeholder="כתובת"
            value={newAppointment.address}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, address: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="אימייל (לשליחת אישור)"
            value={newAppointment.email}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, email: e.target.value })
            }
          />
          <textarea
            className="full-width"
            placeholder="הערה (לא חובה)"
            value={newAppointment.note}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, note: e.target.value })
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
            serviceId={newAppointment.serviceId}
          />
          <button onClick={handleAddAppointment}>📩 שמור תיאום</button>
        </div>
      )}

      <table className="appointments-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>אימייל</th>
            <th>הערה</th>
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
              <td colSpan="10">לא נמצאו תיאומים</td>
            </tr>
          ) : (
            filteredAppointments.map((appt) => (
              <tr key={appt._id} className={editId === appt._id ? "editing" : ""}>
                <td>
                  {editId === appt._id ? (
                    <input
                      value={editData.clientName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, clientName: val }));
                        saveFieldEdit("clientName", val);
                      }}
                    />
                  ) : (
                    appt.clientName
                  )}
                </td>
                <td className="phone-cell">
                  {editId === appt._id ? (
                    <input
                      value={editData.clientPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, clientPhone: val }));
                        saveFieldEdit("clientPhone", val);
                      }}
                    />
                  ) : (
                    appt.clientPhone
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <input
                      value={editData.address}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, address: val }));
                        saveFieldEdit("address", val);
                      }}
                    />
                  ) : (
                    appt.address
                  )}
                </td>
                <td className="email-cell">
                  {editId === appt._id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, email: val }));
                        saveFieldEdit("email", val);
                      }}
                    />
                  ) : (
                    appt.email
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <textarea
                      value={editData.note}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, note: val }));
                        saveFieldEdit("note", val);
                      }}
                    />
                  ) : (
                    appt.note
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <select
                      value={editData.serviceId}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleServiceChange(val, true);
                        saveFieldEdit("serviceId", val);
                      }}
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditData((prev) => ({ ...prev, date: val }));
                        saveFieldEdit("date", val);
                      }}
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
                      onChange={(time) => {
                        setEditData((prev) => ({ ...prev, time }));
                        saveFieldEdit("time", time);
                      }}
                      businessId={businessId}
                      serviceId={editData.serviceId}
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
