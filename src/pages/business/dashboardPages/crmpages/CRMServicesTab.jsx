import React, { useState, useEffect } from "react";
import "./CRMServicesTab.css";

const initialServices = [
  { id: 1, name: "ייעוץ עסקי", price: "₪200" },
  { id: 2, name: "בניית אתר", price: "₪1200" },
];

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "" });

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("demoServices") || "[]");
    const fallback = JSON.parse(localStorage.getItem("demoServices_calendar") || "[]");

    // טוען מ־CRM או מהיומן אם אין
    if (local.length > 0) {
      setServices(local);
    } else if (fallback.length > 0) {
      setServices(fallback);
    } else {
      setServices(initialServices);
    }
  }, []);

  const saveToStorage = (updated) => {
    setServices(updated);
    localStorage.setItem("demoServices", JSON.stringify(updated));
    localStorage.setItem("demoServices_calendar", JSON.stringify(updated));
  };

  const addService = () => {
    if (!newService.name || !newService.price) {
      alert("יש למלא שם ומחיר");
      return;
    }
    const updated = [...services, { ...newService, id: Date.now() }];
    saveToStorage(updated);
    setNewService({ name: "", price: "" });
  };

  const deleteService = (id) => {
    if (window.confirm("האם למחוק את השירות?")) {
      const updated = services.filter((s) => s.id !== id);
      saveToStorage(updated);
    }
  };

  const startEdit = (service) => {
    setEditServiceId(service.id);
    setEditData({ name: service.name, price: service.price });
  };

  const saveEdit = () => {
    const updated = services.map((s) =>
      s.id === editServiceId ? { ...s, ...editData } : s
    );
    saveToStorage(updated);
    setEditServiceId(null);
  };

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
            <tr key={service.id}>
              <td>
                {editServiceId === service.id ? (
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
                {editServiceId === service.id ? (
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
                {editServiceId === service.id ? (
                  <button onClick={saveEdit}>💾 שמור</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(service)}>✏️ ערוך</button>
                    <button onClick={() => deleteService(service.id)}>🗑️ מחק</button>
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
