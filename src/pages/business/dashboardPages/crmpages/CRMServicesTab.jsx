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
    imageFile: null, // שדה לקובץ תמונה
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
    <div className="crm-services-tab">
      <h2>🛠️ שירותים</h2>
      <div
        className="services-header"
        style={{ display: "flex", gap: "10px", alignItems: "center" }}
      >
        <input
          type="text"
          placeholder="חפש לפי שם השירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="services-search-input"
          autoComplete="off"
        />
        <button
          className="add-service-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "בטל" : "הוסף שירות"}
        </button>
      </div>

      {showAddForm && (
        <div
          className="add-service-form"
          style={{
            marginTop: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxWidth: "400px",
          }}
        >
          <input
            type="text"
            placeholder="שם שירות"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="תיאור"
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="משך (דקות)"
            value={newService.duration}
            onChange={(e) =>
              setNewService({ ...newService, duration: e.target.value })
            }
          />
          <input
            type="number"
            placeholder='מחיר (ש"ח)'
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewService({ ...newService, imageFile: e.target.files[0] })
            }
          />
          <button onClick={handleAddService}>שמור שירות</button>
        </div>
      )}

      <table className="services-table" style={{ marginTop: "20px" }}>
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
              <td colSpan="3">לא נמצאו שירותים</td>
            </tr>
          ) : (
            filteredServices.map((service) => (
              <tr key={service._id}>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
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
                  <div>
                    <div className="service-name">{service.name}</div>
                    <div className="service-description">
                      {service.description || "-"}
                    </div>
                  </div>
                </td>
                <td className="service-duration">{service.duration}</td>
                <td className="service-price">{service.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMServicesTab;
