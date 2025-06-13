import React, { useEffect, useState, useRef } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

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

  const [newApptId, setNewApptId] = useState(null);
  const saveTimeoutRef = useRef(null);

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

  // סינון לפי חיפוש
  const filteredAppointments = appointments.filter((appt) => {
    const searchLower = search.toLowerCase();
    return (
      appt.clientName?.toLowerCase().includes(searchLower) ||
      appt.clientPhone?.toLowerCase().includes(searchLower)
    );
  });

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

  const saveFieldEdit = async (field, value) => {
    if (!editId) return;
    try {
      const updatedData = { [field]: value };
      if (field === "serviceId") {
        const service = services.find((s) => s._id === value);
        if (service) updatedData.serviceName = service.name;
      }
      const res = await API.patch(`/appointments/${editId}`, updatedData);
      const updatedAppt = res.data.appt;
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    } catch (err) {
      alert("❌ שגיאה בשמירת השינוי");
    }
  };

  const startEdit = (appt) => {
    setEditId(appt._id);
    setEditData({
      clientName: appt.clientName || "",
      clientPhone: appt.clientPhone || "",
      address: appt.address || "",
      email: appt.email || "",
      note: appt.note || "",
      serviceId: appt.serviceId || "",
      serviceName: appt.serviceName || "",
      date: appt.date || "",
      time: appt.time || "",
    });
  };

  const saveEdit = () => {
    setEditId(null);
  };

  // debounce לשמירת טיוטה אוטומטית
  useEffect(() => {
    if (
      !businessId ||
      !newAppointment.clientName.trim() ||
      !newAppointment.clientPhone.trim() ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId
    ) {
      // לא שולחים בקשה אם שדות חיוניים חסרים
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
  try {
    if (newApptId) {
      // עדכון תיאום קיים
      const res = await API.patch(`/appointments/${newApptId}`, {
        name: newAppointment.clientName,
        phone: newAppointment.clientPhone,
        address: newAppointment.address,
        email: newAppointment.email,
        note: newAppointment.note,
        serviceId: newAppointment.serviceId,
        date: newAppointment.date,
        time: newAppointment.time,
        serviceName: newAppointment.serviceName,
      });
      const updatedAppt = res.data.appt;
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    } else {
      // יצירת תיאום חדש
      const res = await API.post("/appointments", {
        businessId: businessId,
        name: newAppointment.clientName,
        phone: newAppointment.clientPhone,
        address: newAppointment.address,
        email: newAppointment.email,
        note: newAppointment.note,
        serviceId: newAppointment.serviceId,
        date: newAppointment.date,
        time: newAppointment.time,
        serviceName: newAppointment.serviceName,
        duration: 0,
      });

      const createdAppt = res.data.appt || res.data;
      setNewApptId(createdAppt._id);
      // לא מוסיפים את createdAppt ל-appointments כאן כדי למנוע כפילות
    }
  } catch (err) {
    console.error("Error saving preliminary appointment:", err);
  }
}, 1500);


    return () => clearTimeout(saveTimeoutRef.current);
  }, [
    newAppointment.clientName,
    newAppointment.clientPhone,
    newAppointment.address,
    newAppointment.email,
    newAppointment.note,
    newAppointment.serviceId,
    newAppointment.date,
    newAppointment.time,
    newAppointment.serviceName,
    newApptId,
    businessId,
  ]);

  const handleInputChange = (field, value) => {
    setNewAppointment((prev) => {
      let newState = { ...prev, [field]: value };
      if (field === "serviceId") {
        const service = services.find((s) => s._id === value);
        newState.serviceName = service ? service.name : "";
        newState.time = "";
      }
      return newState;
    });
  };

  // הפונקציה החדשה לאישור תיאום
  const handleConfirmAppointment = async () => {
    if (
      !newAppointment.clientName.trim() ||
      !newAppointment.clientPhone.trim() ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId
    ) {
      alert("אנא מלא שם, טלפון, שירות, תאריך ושעה");
      return;
    }

    if (!newApptId) {
      try {
        const res = await API.post("/appointments", {
          businessId: businessId,
          name: newAppointment.clientName,
          phone: newAppointment.clientPhone,
          address: newAppointment.address,
          email: newAppointment.email,
          note: newAppointment.note,
          serviceId: newAppointment.serviceId,
          date: newAppointment.date,
          time: newAppointment.time,
          serviceName: newAppointment.serviceName,
          duration: 0,
        });
        const createdAppt = res.data.appt || res.data;
        setNewApptId(createdAppt._id);
        setAppointments((prev) => [...prev, createdAppt]);
      } catch (error) {
        alert("שגיאה בשמירת התיאום, נסה שנית");
        return;
      }
    }

    // סגירת הטופס וניקוי השדות
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
    setNewApptId(null);
    setShowAddForm(false);
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
        <button
          className="add-btn"
          onClick={() => {
            setShowAddForm((show) => !show);
            setNewApptId(null);
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
          }}
        >
          ➕ הוסף תיאום
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={newAppointment.clientName}
            onChange={(e) => handleInputChange("clientName", e.target.value)}
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newAppointment.clientPhone}
            onChange={(e) => handleInputChange("clientPhone", e.target.value)}
          />
          <input
            type="text"
            placeholder="כתובת"
            value={newAppointment.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          <input
            type="email"
            placeholder="אימייל (לשליחת אישור)"
            value={newAppointment.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <textarea
            className="full-width"
            placeholder="הערה (לא חובה)"
            value={newAppointment.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
          />
          <select
            value={newAppointment.serviceId}
            onChange={(e) => handleInputChange("serviceId", e.target.value)}
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
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={(time) => handleInputChange("time", time)}
            businessId={businessId}
            serviceId={newAppointment.serviceId}
          />
          <button onClick={handleConfirmAppointment}>📅 קבע פגישה</button>
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
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="9">לא נמצאו תיאומים</td>
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
