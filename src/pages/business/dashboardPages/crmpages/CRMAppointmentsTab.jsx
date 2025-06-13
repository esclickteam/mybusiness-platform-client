import React, { useEffect, useState, useRef } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const statusCycle = ['pending', 'not_completed', 'matched', 'completed'];
const statusMap = {
  pending: 'מאושר',
  matched: 'תואם',
  not_completed: 'לא הושלם',
  completed: 'הושלם',
};

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

  // שמירת ID של התיאום הראשוני (אם נוצר)
  const [newApptId, setNewApptId] = useState(null);

  // debounce ref לשמירת תיאום ראשוני
  const saveTimeoutRef = useRef(null);

  // טעינת תיאומים ושירותים
  useEffect(() => {
  async function fetchAppointmentsAndServices() {
    try {
      const [appointmentsRes, servicesRes] = await Promise.all([
        API.get("/appointments/all-with-services"),
        API.get("/business/my/services"),
      ]);
      console.log("Appointments loaded:", appointmentsRes.data); // הוספת הדפסה
      setAppointments(appointmentsRes.data || []);
      setServices(servicesRes.data.services || []);
    } catch (err) {
      console.error("Error loading appointments or services", err);
    }
  }
  fetchAppointmentsAndServices();
}, []);


  // מאזין לאירועי socket
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

  // עדכון אוטומטי של סטטוס ל"הושלם" אחרי שעבר זמן הפגישה
  useEffect(() => {
    async function updateCompletedStatuses() {
      const now = new Date();

      for (const appt of appointments) {
        const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);

        if (appt.status !== "completed" && now > apptDateTime) {
          try {
            const res = await API.patch(`/appointments/${appt._id}/status`, {
              status: "completed",
            });
            const updatedAppt = res.data.appt;
            setAppointments((prev) =>
              prev.map((a) => (a._id === updatedAppt._id ? updatedAppt : a))
            );
          } catch (err) {
            console.error("Error updating appointment status to completed", err);
          }
        }
      }
    }

    if (appointments.length > 0) {
      updateCompletedStatuses();
    }
  }, [appointments]);

  // סינון תיאומים לפי חיפוש
  const filteredAppointments = appointments.filter((appt) => {
    const searchLower = search.toLowerCase();
    return (
      appt.clientName?.toLowerCase().includes(searchLower) ||
      appt.clientPhone?.toLowerCase().includes(searchLower)
    );
  });

  // מחזור סטטוס בלחיצה
  const cycleStatus = async (id) => {
    const apptToUpdate = appointments.find((appt) => appt._id === id);
    if (!apptToUpdate) return;

    const currentIndex = statusCycle.indexOf(apptToUpdate.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      const res = await API.patch(`/appointments/${id}/status`, { status: nextStatus });
      const updatedAppt = res.data.appt;

      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? updatedAppt : appt))
      );
    } catch {
      alert("❌ שגיאה בעדכון סטטוס התיאום");
    }
  };

  // שינוי שירות בטופס (הוספה או עריכה)
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

  // איפוס זמן כשמשנים תאריך בעריכה
  useEffect(() => {
    if (editId) {
      setEditData((prev) => ({
        ...prev,
        time: "",
      }));
    }
  }, [editData.date, editId]);

  // שמירת תיאום חדש רגיל (כבר לא בשימוש, אפשר להחליף בלחיצה על "קבע פגישה")
  const handleAddAppointment = async () => {
    alert('אנא השתמש בכפתור "קבע פגישה" לשמירת התיאום.');
  };

  // מחיקת תיאום
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

  // שמירת שדה ערוך - צריך לממש פונקציה שמעדכנת בשרת
  const saveFieldEdit = async (field, value) => {
    if (!editId) return;
    try {
      const updatedData = { [field]: value };
      if (field === "serviceId") {
        const service = services.find((s) => s._id === value);
        if (service) {
          updatedData.serviceName = service.name;
        }
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

  // התחלת עריכה
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

  // שמירת כל העריכה (אפשר לממש לפי הצורך)
  const saveEdit = () => {
    setEditId(null);
    // במידה ויש צורך, אפשר לקרוא API לעדכון מלא כאן
  };

  // הצגת סטטוס (לפי תאריך וסטטוס)
  const getStatusLabel = (appt) => {
    const now = new Date();
    const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
    if (now > apptDateTime) {
      return statusMap["completed"];
    }
    return statusMap[appt.status] || appt.status;
  };

  // debounce לשמירת תיאום ראשוני אוטומטית
  useEffect(() => {
  console.log('useEffect triggered: saving draft appointment', newAppointment, newApptId);

  if (!newAppointment.clientName.trim() || !newAppointment.clientPhone.trim()) {
    console.log('Missing clientName or clientPhone, skipping save');
    return;
  }

  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

  saveTimeoutRef.current = setTimeout(async () => {
    try {
      if (newApptId) {
        console.log('Updating appointment id:', newApptId);
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
          status: "not_completed",
        });
        const updatedAppt = res.data.appt;
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
        );
      } else {
        console.log('Creating new appointment draft');
        const res = await API.post("/appointments", {
          businessId,
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
          status: "not_completed",
        });
        const createdAppt = res.data.appt || res.data;
        setNewApptId(createdAppt._id);
        setAppointments((prev) => [...prev, createdAppt]);
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



  // לחיצה על "קבע פגישה" - עדכון סטטוס ל-pending (מאושר)
  const handleConfirmAppointment = async () => {
    if (!newApptId) {
      alert("אנא מלא לפחות שם וטלפון כדי לשמור תיאום ראשוני");
      return;
    }
    if (
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId
    ) {
      alert("אנא מלא שירות, תאריך ושעה");
      return;
    }

    try {
      const res = await API.patch(`/appointments/${newApptId}/status`, {
        status: "pending",
      });
      const updatedAppt = res.data.appt;

      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );

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
    } catch (err) {
      alert("❌ שגיאה בקביעת התיאום");
      console.error(err);
    }
  };

  // טיפול בשינוי שדות בטופס
  const handleInputChange = (field, value) => {
  console.log(`handleInputChange called: ${field} = ${value}`);
  setNewAppointment((prev) => {
    let newState = { ...prev, [field]: value };

    if (field === "serviceId") {
      const service = services.find((s) => s._id === value);
      newState.serviceName = service ? service.name : "";
      newState.time = "";
    }

    console.log('newAppointment state after change:', newState);
    return newState;
  });
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
                    {getStatusLabel(appt)}
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
