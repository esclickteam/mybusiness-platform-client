import React, { useState, useEffect } from "react";
import "./CRMAppointmentsTab.css";
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
          placeholder="חפש לפי שם או טלפון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {/* כאן תוכל להוסיף כפתור הוספת שירות אם תרצה */}
      </div>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>משך (דקות)</th>
            <th>מחיר (ש"ח)</th>
            <th>תיאור</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 ? (
            <tr>
              <td colSpan="4">לא נמצאו שירותים</td>
            </tr>
          ) : (
            filteredServices.map((service) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.duration}</td>
                <td>{service.price}</td>
                <td>{service.description || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMAppointmentsTab;
