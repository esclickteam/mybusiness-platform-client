import React, { useState, useEffect } from "react";
import API from "@api"; // עדכן נתיב ל-API שלך
import "./CRMServicesTab.css";

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(true);

  // טען שירותים מהשרת בהתחלה
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
  }, []);

  // הוספת שירות חדש
  const addService = async () => {
    if (!newService.name || !newService.price) {
      alert("יש למלא שם ומחיר");
      return;
    }
    try {
      const res = await API.post("/business/my/services", newService);
      // API מחזיר את כל השירותים המעודכנים
      setServices(res.data.services);
      setNewService({ name: "", price: "" });
    } catch {
      alert("❌ שגיאה ביצירת השירות");
    }
  };

  // התחלת עריכה
  const startEdit = (service) => {
    setEditServiceId(service._id);
    setEditData({ name: service.name, price: service.price });
  };

  // שמירת עריכה
  const saveEdit = async () => {
    if (!editData.name || !editData.price) {
      alert("יש למלא שם ומחיר לעדכון");
      return;
    }
    try {
      await API.put(`/business/my/services/${editServiceId}`, editData);
      setServices((prev) =>
        prev.map((s) =>
          s._id === editServiceId ? { ...s, ...editData } : s
        )
      );
      setEditServiceId(null);
    } catch {
      alert("❌ שגיאה בעדכון השירות");
    }
  };

  // מחיקת שירות
  const deleteService = async (id) => {
    if (!window.confirm("האם למחוק את השירות?")) return;
    try {
      await API.delete(`/business/my/services/${id}`);
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
        <button onClick={addService}>➕ הוסף</button>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>מחיר</th>
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
