// CRMServicesTab.jsx
import React, { useState, useEffect } from "react";
import API from "@api"; // עדכן לנתיב הנכון
import { io } from "socket.io-client";
import "./CRMServicesTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    hours: "0",
    minutes: "30",
    description: "",
    appointmentType: "at_business",
    imageFile: null,
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    hours: "0",
    minutes: "30",
    description: "",
    appointmentType: "at_business",
    imageFile: null,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  // חיבור ל-socket לשמירת סנכרון בזמן אמת
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await API.get("/business/my/services");
        setServices(res.data.services || []);
      } catch (err) {
        alert("❌ שגיאה בטעינת השירותים");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      // הוסף auth אם צריך לפי המערכת שלך
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to socket in CRMServicesTab");
    });

    socket.on("servicesUpdated", (updatedServices) => {
      console.log("🔄 servicesUpdated received from socket", updatedServices);
      setServices(updatedServices);
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

  const calcDurationInMinutes = (hours, minutes) =>
    parseInt(hours, 10) * 60 + parseInt(minutes, 10);

  const addService = async () => {
    if (
      !newService.name ||
      !newService.price ||
      calcDurationInMinutes(newService.hours, newService.minutes) === 0
    ) {
      alert("יש למלא שם, מחיר ומשך תקין");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("price", newService.price);
      formData.append(
        "duration",
        calcDurationInMinutes(newService.hours, newService.minutes)
      );
      formData.append("description", newService.description);
      formData.append("appointmentType", newService.appointmentType);
      if (newService.imageFile) {
        formData.append("image", newService.imageFile);
      }

      const res = await API.post("/business/my/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServices(res.data.services || []);
      setNewService({
        name: "",
        price: "",
        hours: "0",
        minutes: "30",
        description: "",
        appointmentType: "at_business",
        imageFile: null,
      });
    } catch {
      alert("❌ שגיאה ביצירת השירות");
    }
  };

  const startEdit = (service) => {
    const hours = Math.floor(service.duration / 60).toString();
    const minutes = (service.duration % 60).toString();
    setEditServiceId(service._id);
    setEditData({
      name: service.name,
      price: service.price,
      hours,
      minutes,
      description: service.description || "",
      appointmentType: service.appointmentType || "at_business",
      imageFile: null,
      imageUrl: service.imageUrl || "",
    });
  };

  const saveEdit = async () => {
    if (
      !editData.name ||
      !editData.price ||
      calcDurationInMinutes(editData.hours, editData.minutes) === 0
    ) {
      alert("יש למלא שם, מחיר ומשך תקין לעדכון");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("price", editData.price);
      formData.append(
        "duration",
        calcDurationInMinutes(editData.hours, editData.minutes)
      );
      formData.append("description", editData.description);
      formData.append("appointmentType", editData.appointmentType);
      if (editData.imageFile) {
        formData.append("image", editData.imageFile);
      }

      await API.put(`/business/my/services/${editServiceId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // עדכון השירותים אחרי שמירת עריכה (מומלץ לרענן מהר מהשרת)
      const res = await API.get("/business/my/services");
      setServices(res.data.services || []);

      setEditServiceId(null);
      setEditData({
        name: "",
        price: "",
        hours: "0",
        minutes: "30",
        description: "",
        appointmentType: "at_business",
        imageFile: null,
        imageUrl: "",
      });
    } catch {
      alert("❌ שגיאה בעדכון השירות");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("האם למחוק את השירות?")) return;
    try {
      await API.delete(`/business/my/services/${id}`);

      // עדכון רשימת השירותים לאחר מחיקה (לסנכרן מיידית)
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("❌ שגיאה במחיקת השירות");
    }
  };

  if (loading) return <p>טוען שירותים...</p>;

  return (
    <div className="crm-tab-content">
      <h2>🛠️ שירותים</h2>

      <div className="form-wrapper">
        <div className="add-service-form">
          <div className="appointment-type-selector">
            <button
              type="button"
              className={newService.appointmentType === "at_business" ? "active" : ""}
              onClick={() => setNewService({ ...newService, appointmentType: "at_business" })}
            >
              🏢 תיאום תור בעסק
            </button>
            <button
              type="button"
              className={newService.appointmentType === "on_site" ? "active" : ""}
              onClick={() => setNewService({ ...newService, appointmentType: "on_site" })}
            >
              🚗 שירות עד הבית
            </button>
          </div>

          <input
            type="text"
            placeholder="שם השירות"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="מחיר (₪)"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <div className="time-row">
            <select
              value={newService.hours}
              onChange={(e) => setNewService({ ...newService, hours: e.target.value })}
            >
              {[...Array(13).keys()].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>שעות</span>
            <select
              value={newService.minutes}
              onChange={(e) => setNewService({ ...newService, minutes: e.target.value })}
            >
              {["0", "15", "30", "45"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span>דקות</span>
          </div>

          <textarea
            placeholder="תיאור השירות (לא חובה)"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewService({ ...newService, imageFile: e.target.files[0] })}
          />
          {newService.imageFile && (
            <img
              src={URL.createObjectURL(newService.imageFile)}
              alt="preview"
              style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }}
            />
          )}

          <button onClick={addService}>➕ הוסף</button>
        </div>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>סוג שירות</th>
            <th>שם</th>
            <th>מחיר</th>
            <th>משך (שעות ודקות)</th>
            <th>תיאור</th>
            <th>תמונה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => {
            const hours = Math.floor(service.duration / 60);
            const minutes = service.duration % 60;

            return (
              <tr key={service._id}>
                <td>
                  {editServiceId === service._id ? (
                    <div className="appointment-type-selector">
                      <button
                        type="button"
                        className={editData.appointmentType === "at_business" ? "active" : ""}
                        onClick={() =>
                          setEditData({ ...editData, appointmentType: "at_business" })
                        }
                      >
                        🏢 תיאום תור בעסק
                      </button>
                      <button
                        type="button"
                        className={editData.appointmentType === "on_site" ? "active" : ""}
                        onClick={() =>
                          setEditData({ ...editData, appointmentType: "on_site" })
                        }
                      >
                        🚗 שירות עד הבית
                      </button>
                    </div>
                  ) : service.appointmentType === "on_site" ? (
                    "שירות עד הבית"
                  ) : (
                    "תיאום תור בעסק"
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    service.name
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <input
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    />
                  ) : (
                    service.price
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <>
                      <select
                        value={editData.hours}
                        onChange={(e) => setEditData({ ...editData, hours: e.target.value })}
                      >
                        {[...Array(13).keys()].map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span>שעות</span>
                      <select
                        value={editData.minutes}
                        onChange={(e) => setEditData({ ...editData, minutes: e.target.value })}
                      >
                        {["0", "15", "30", "45"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <span>דקות</span>
                    </>
                  ) : (
                    `${hours} שעות ו-${minutes} דקות`
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  ) : (
                    service.description || "-"
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditData({ ...editData, imageFile: e.target.files[0] })
                        }
                      />
                      {editData.imageFile ? (
                        <img
                          src={URL.createObjectURL(editData.imageFile)}
                          alt="preview"
                          style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }}
                        />
                      ) : editData.imageUrl ? (
                        <img
                          src={editData.imageUrl}
                          alt="current"
                          style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }}
                        />
                      ) : (
                        <em>אין תמונה</em>
                      )}
                    </>
                  ) : service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      style={{ maxWidth: "80px", maxHeight: "80px" }}
                    />
                  ) : (
                    <em>אין תמונה</em>
                  )}
                </td>
                <td>
                  {editServiceId === service._id ? (
                    <button onClick={saveEdit}>💾 שמור</button>
                  ) : (
                    <>
                      <button onClick={() => startEdit(service)}>✏️ ערוך</button>
                      <button onClick={() => deleteService(service._id)}>🗑️ מחק</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CRMServicesTab;
