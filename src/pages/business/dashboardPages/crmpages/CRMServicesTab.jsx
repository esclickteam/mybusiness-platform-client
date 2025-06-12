import React, { useState, useEffect } from "react";
import "./CRMServicesTab.css";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const CRMAppointmentsTab = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);

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

  return (
    <div className="crm-appointments-tab">
      <h2>🛠️ שירותים</h2>
      <div className="appointments-header">
        <input
          type="text"
          placeholder="חפש לפי שם השירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="appointments-table">
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
                <td>
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="service-image"
                    />
                  )}
                  <div className="service-name-desc">
                    <div className="name">{service.name}</div>
                    <div className="description">
                      {service.description || "-"}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {service.duration}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
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

export default CRMAppointmentsTab;
