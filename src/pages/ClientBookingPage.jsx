// src/pages/ClientBookingPage.jsx
import React, { useState, useEffect } from "react";
import ServicesSelector from "../components/ServicesSelector";
import ClientCalendar from "./business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";
import API from "../api"; // axios instance

export default function ClientBookingPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [workHours, setWorkHours] = useState({});

  // טען שירותים + קטגוריות + שעות עבודה
  useEffect(() => {
    async function fetchData() {
      const [svcRes, catRes, hoursRes] = await Promise.all([
        API.get("/services"),
        API.get("/services/categories"),
        API.get("/business/work-hours"),
      ]);
      setServices(svcRes.data);
      setCategories(catRes.data);
      setWorkHours(hoursRes.data); // מבנה: { "Mon Apr 14 2025": { start, end, breaks }, … }
    }
    fetchData();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleBackToList = () => {
    setSelectedService(null);
  };

  return (
    <div className="client-booking-page">
      {!selectedService ? (
        <>
          <h2>בחר שירות</h2>
          <ServicesSelector
            services={services}
            categories={categories}
            onSelect={handleServiceSelect}
          />
        </>
      ) : (
        <>
          <h2>לתיאום תור: {selectedService.name}</h2>
          <button className="back-to-list" onClick={handleBackToList}>
            ← בחר שירות אחר
          </button>
          <ClientCalendar
            workHours={workHours}
            selectedService={selectedService}
            onBackToList={handleBackToList}
          />
        </>
      )}
    </div>
  );
}
