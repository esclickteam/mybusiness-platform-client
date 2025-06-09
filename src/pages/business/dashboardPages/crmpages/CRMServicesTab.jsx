import React, { useState, useEffect } from "react";
import API from "@api"; // עדכן לנתיב הנכון
import "./CRMServicesTab.css";

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", duration: "", imageFile: null, imageUrl: "" });
  const [loading, setLoading] = useState(true);

  // טעינת שירותים מהשרת בהתחלה
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await API.get("/my/services");
        setServices(res.data.services || []);
      } catch (err) {
        alert("❌ שגיאה בטעינת השירותים");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // הוספת שירות חדש
  const addService = async () => {
    if (!newService.name || !newService.price || !newService.duration) {
      alert("יש למלא שם, מחיר ומשך");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("price", newService.price);
      formData.append("duration", newService.duration);
      if (newService.imageFile) {
        formData.append("image", newService.imageFile);
      }

      const res = await API.post("/my/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServices(res.data.services || []);
      setNewService({ name: "", price: "", duration: "", imageFile: null });
    } catch {
      alert("❌ שגיאה ביצירת השירות");
    }
  };

  // התחלת עריכה
  const startEdit = (service) => {
    setEditServiceId(service._id);
    setEditData({
      name: service.name,
      price: service.price,
      duration: service.duration,
      imageFile: null,
      imageUrl: service.imageUrl || ""
    });
  };

  // שמירת עריכה
  const saveEdit = async () => {
    if (!editData.name || !editData.price || !editData.duration) {
      alert("יש למלא שם, מחיר ומשך לעדכון");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("price", editData.price);
      formData.append("duration", editData.duration);
      if (editData.imageFile) {
        formData.append("image", editData.imageFile);
      }

      await API.put(`/my/services/${editServiceId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // טען מחדש שירותים מהשרת אחרי העריכה
      const res = await API.get("/my/services");
      setServices(res.data.services || []);

      setEditServiceId(null);
      setEditData({ name: "", price: "", duration: "", imageFile: null, imageUrl: "" });
    } catch {
      alert("❌ שגיאה בעדכון השירות");
    }
  };

  // מחיקת שירות
  const deleteService = async (id) => {
    if (!window.confirm("האם למחוק את השירות?")) return;
    try {
      await API.delete(`/my/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("❌ שגיאה במחיקת השירות");
    }
  };

  if (loading) return <p>טוען שירותים...</p>;

  return (
    <div className="crm-tab-content">
      <h2>🛠️ שירותים</h2>

      <div className="add-service-form">
        <input
          type="text"
          placeholder="שם השירות"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="מחיר (₪)"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="משך (בדקות)"
          value={newService.duration}
          onChange={(e) =>
            setNewService({ ...newService, duration: e.target.value })
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewService({ ...newService, imageFile: e.target.files[0] })
          }
        />
        <button onClick={addService}>➕ הוסף</button>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>מחיר</th>
            <th>משך (בדקות)</th>
            <th>תמונה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>
                {editServiceId === service._id ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  service.name
                )}
              </td>
              <td>
                {editServiceId === service._id ? (
                  <input
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                  />
                ) : (
                  service.price
                )}
              </td>
              <td>
                {editServiceId === service._id ? (
                  <input
                    type="number"
                    value={editData.duration}
                    onChange={(e) =>
                      setEditData({ ...editData, duration: e.target.value })
                    }
                  />
                ) : (
                  service.duration
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRMServicesTab;
