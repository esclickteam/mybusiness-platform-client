import React, { useState, useEffect } from "react";
import "./CRMServicesTab.css";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const CRMServicesTab = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    imageFile: null,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/business/my/services");
        const servicesArray =
          res.data.services ||
          res.data.data ||
          (Array.isArray(res.data) ? res.data : []);
        setServices(servicesArray);
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddService = async () => {
    if (!newService.name || !newService.duration || !newService.price) {
      alert("נא למלא שם שירות, משך וזמן");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("description", newService.description);
      formData.append("duration", newService.duration);
      formData.append("price", newService.price);
      if (newService.imageFile) {
        formData.append("image", newService.imageFile);
      }

      const res = await API.post("/business/my/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.services) {
        setServices(res.data.services);
      }

      setShowAddForm(false);
      setNewService({
        name: "",
        description: "",
        duration: "",
        price: "",
        imageFile: null,
      });
    } catch (error) {
      alert("שגיאה בהוספת השירות");
      console.error(error);
    }
  };

  return (
    <div className="crm-services-tab" dir="rtl">
      <h2>🛠️ שירותים</h2>
      <div className="services-header">
        <input
          type="text"
          placeholder="חפש לפי שם השירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="services-search-input"
          autoComplete="off"
        />
        <button
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "בטל" : "הוסף שירות"}
        </button>
      </div>

      {showAddForm && (
        <form
          className="add-service-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddService();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label>
            שם שירות
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              required
            />
          </label>

          <label>
            תיאור
            <input
              type="text"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />
          </label>

          <label>
            משך (דקות)
            <input
              type="number"
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
              required
              min="0"
            />
          </label>

          <label>
            מחיר (ש"ח)
            <input
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              required
              min="0"
            />
          </label>

          <label>
            תמונת שירות (לא חובה)
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewService({ ...newService, imageFile: e.target.files[0] })
              }
            />
          </label>

          <button type="submit" className="add-btn">
            שמור שירות
          </button>
        </form>
      )}

      <table className="services-table">
        <thead>
          <tr>
            <th>שם + תמונה + תיאור</th>
            <th>משך (דקות)</th>
            <th>מחיר (ש"ח)</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                לא נמצאו שירותים
              </td>
            </tr>
          ) : (
            filteredServices.map((service) => (
              <tr key={service._id}>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    direction: "rtl",
                    padding: "8px",
                  }}
                >
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div style={{ textAlign: "right" }}>
                    <div
                      className="service-name"
                      style={{ fontWeight: "bold" }}
                    >
                      {service.name}
                    </div>
                    <div
                      className="service-description"
                      style={{ fontSize: "12px", color: "#666" }}
                    >
                      {service.description || "-"}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {service.duration}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {service.price}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMServicesTab;
