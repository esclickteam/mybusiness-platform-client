// src/pages/ClientBookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ServicesSelector from "../components/ServicesSelector";
import ClientCalendar from "./business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";
import API from "../api";
import { getPublicBookingServices } from "../api/publicBookingApi";

/** Convert get-work-hours payload into the array ClientCalendar expects. */
function toWorkHoursArray(data) {
  const schedule = data?.workHours || data?.schedule || data || {};
  if (Array.isArray(schedule)) return schedule;

  return Object.keys(schedule).map((day) => {
    const item = schedule[day];
    if (!item) {
      return { day: Number(day), isOpen: false, start: "", end: "", breaks: "" };
    }
    return {
      day: Number(day),
      isOpen: true,
      start: item.start || "",
      end: item.end || "",
      breaks: item.breaks || "",
      ...item,
    };
  });
}

function categoriesFromServices(services) {
  const set = new Set();
  for (const service of services || []) {
    const cat = String(service?.category || "").trim();
    if (cat) set.add(cat);
  }
  return Array.from(set);
}

export default function ClientBookingPage() {
  const { businessId } = useParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [workHours, setWorkHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!businessId) return;
      setLoading(true);
      setError("");
      try {
        const [servicesList, hoursRes] = await Promise.all([
          getPublicBookingServices(businessId),
          API.get(`/appointments/get-work-hours?businessId=${businessId}`),
        ]);
        const list = Array.isArray(servicesList) ? servicesList : [];
        setServices(list);
        setCategories(categoriesFromServices(list));
        setWorkHours(toWorkHoursArray(hoursRes.data));
        if (!list.length) {
          setError("");
        }
      } catch (err) {
        console.error("Error loading booking data:", err);
        setServices([]);
        setCategories([]);
        setWorkHours([]);
        const status = err?.response?.status;
        setError(
          status === 404
            ? "Business not found"
            : "Error loading services"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
          <h2>Select a Service</h2>
          {loading && <p>Loading services…</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <ServicesSelector
              services={services}
              categories={categories}
              onSelect={handleServiceSelect}
            />
          )}
        </>
      ) : (
        <>
          <h2>Book an Appointment: {selectedService.name}</h2>
          <button className="back-to-list" onClick={handleBackToList}>
            ← Choose another service
          </button>
          <ClientCalendar
            workHours={workHours}
            selectedService={selectedService}
            onBackToList={handleBackToList}
            businessId={businessId}
          />
        </>
      )}
    </div>
  );
}
