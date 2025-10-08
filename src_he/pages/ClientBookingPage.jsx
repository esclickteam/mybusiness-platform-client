// src/pages/ClientBookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ServicesSelector from "../components/ServicesSelector";
import ClientCalendar from "./business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";
import API from "../api";

// Function that converts any format to a map by day of the week
function normalizeWorkHours(data) {
  let map = {};
  if (Array.isArray(data?.workHours)) {
    data.workHours.forEach(item => {
      if (item?.day !== undefined) map[Number(item.day)] = item;
    });
  } else if (
    data?.workHours && typeof data.workHours === "object" && !Array.isArray(data.workHours)
  ) {
    map = data.workHours;
  } else if (Array.isArray(data)) {
    data.forEach(item => {
      if (item?.day !== undefined) map[Number(item.day)] = item;
    });
  }
  return map;
}

export default function ClientBookingPage() {
  const { businessId } = useParams(); // <-- Getting the businessId from the URL
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [workHours, setWorkHours] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [svcRes, catRes, hoursRes] = await Promise.all([
          API.get(`/business/${businessId}/services`),
          API.get("/services/categories"),
          API.get(`/appointments/get-work-hours?businessId=${businessId}`),
        ]);
        setServices(svcRes.data.services || svcRes.data || []);
        setCategories(catRes.data || []);
        setWorkHours(normalizeWorkHours(hoursRes.data)); // ← always normalize!
      } catch (err) {
        console.error("Error loading booking data:", err);
      }
    }
    if (businessId) {
      fetchData();
    }
  }, [businessId]);

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
          <h2>Select Service</h2>
          <ServicesSelector
            services={services}
            categories={categories}
            onSelect={handleServiceSelect}
          />
        </>
      ) : (
        <>
          <h2>To schedule an appointment: {selectedService.name}</h2>
          <button className="back-to-list" onClick={handleBackToList}>
            ← Select another service
          </button>
          <ClientCalendar
            workHours={workHours}
            selectedService={selectedService}
            onBackToList={handleBackToList}
            businessId={businessId}  // <-- Here I passed the businessId
          />
        </>
      )}
    </div>
  );
}
