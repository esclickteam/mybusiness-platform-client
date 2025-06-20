import React, { useState, useEffect } from "react";
import "./CRMServicesTab.css";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const CRMServicesTab = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);

  // מצב לטופס הוספת שירות חדש
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    imageUrl: "",
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
        imageUrl: "",
        imageFile: null,
      });
    } catch (error) {
      alert("שגיאה בהוספת השירות");
      console.error(error);
    }
  };

  return (
    <div className="crm-services-tab" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>🛠️ שירותים</h2>
      <div
        className="services-header"
        style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}
      >
        <input
          type="text"
          placeholder="חפש לפי שם השירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="services-search-input"
          autoComplete="off"
          style={{
            flexGrow: 1,
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          className="add-service-button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #777",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showAddForm ? "בטל" : "הוסף שירות"}
        </button>
      </div>

      {showAddForm && (
        <form
          className="add-service-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "6px",
            backgroundColor: "#fafafa",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddService();
          }}
        >
          <label>
            שם שירות
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
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
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
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
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
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
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
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
              style={{ marginTop: "4px" }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #777",
              background: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            שמור שירות
          </button>
        </form>
      )}

      <table
        className="services-table"
        style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ textAlign: "right", padding: "8px" }}>שם + תמונה + תיאור</th>
            <th style={{ textAlign: "center", padding: "8px" }}>משך (דקות)</th>
            <th style={{ textAlign: "center", padding: "8px" }}>מחיר (ש"ח)</th>
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
              <tr key={service._id} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    direction: "rtl",
                  }}
                >
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="service-image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div style={{ textAlign: "right" }}>
                    <div className="service-name" style={{ fontWeight: "bold" }}>
                      {service.name}
                    </div>
                    <div className="service-description" style={{ fontSize: "12px", color: "#666" }}>
                      {service.description || "-"}
                    </div>
                  </div>
                </td>
                <td className="service-duration" style={{ textAlign: "center", padding: "8px" }}>
                  {service.duration}
                </td>
                <td className="service-price" style={{ textAlign: "center", padding: "8px" }}>
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
