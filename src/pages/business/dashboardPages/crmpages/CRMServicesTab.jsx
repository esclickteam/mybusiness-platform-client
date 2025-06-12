import React, { useState, useEffect } from "react";
import "./CRMServicesTab.css";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const CRMServicesTab = () => {
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
    <div className="crm-services-tab">
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
      </div>

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
