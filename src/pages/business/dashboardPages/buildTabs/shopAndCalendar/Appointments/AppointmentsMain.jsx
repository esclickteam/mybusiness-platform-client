import React, { useState, useEffect } from 'react';
import API from '@api'; // ודא ש־API.baseURL = '/api'
import ServiceList from './ServiceList';
import ClientServiceCard from './ClientServiceCard';
import './AppointmentsMain.css';

const AppointmentsMain = ({
  isPreview = false,
  services = [],
  setServices,
  onNext,
  workHours = {},
}) => {
  // --- שליפה מהשרת ---
  useEffect(() => {
    if (!isPreview && setServices) {
      API.get('/business/my/services')
        .then(res => {
          // השרת מחזיר { services: [...] }
          setServices(res.data.services || []);
        })
        .catch(() => {
          // אם אין שירותים בשרת - נטען דמו מהמקומי
          const fromCalendar = JSON.parse(localStorage.getItem("demoServices_calendar") || "[]");
          setServices(fromCalendar);
        });
    }
    // eslint-disable-next-line
  }, []);

  // --- מחיקה מהשרת ---
  const handleDelete = (serviceIndex) => {
    const srv = services[serviceIndex];
    if (srv && srv._id) {
      API.delete(`/business/my/services/${srv._id}`)
        .then(res => {
          // מחזיר { success: true, services: [...] }
          setServices(res.data.services || []);
        })
        .catch(err => alert(err.message));
    } else {
      // דמו בלבד
      const updated = services.filter((_, i) => i !== serviceIndex);
      setServices(updated);
      localStorage.setItem("demoServices_calendar", JSON.stringify(updated));
    }
  };

  // עיצוב משך זמן
  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')} שעות` : `${m} דקות`;
  };

  // --- תצוגה ללקוח (preview) ---
  if (isPreview) {
    return (
      <div className="services-page-wrapper">
        <div className="services-preview services-form-box">
          <h2 className="services-form-title">📋 רשימת השירותים</h2>
          {(!services || services.length === 0) ? (
            <div className="empty-preview">
              <div className="no-services-card">
                <p style={{ textAlign: 'center', fontWeight: '500' }}>
                  📝 לא הוגדרו שירותים עדיין.
                </p>
                <p style={{ textAlign: 'center', fontSize: '0.95em', color: '#888' }}>
                  השירותים שתזין יופיעו כאן בתצוגה חיה
                </p>
                <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '15px' }}>
                  <strong>⏰ שעות פעילות:</strong><br />
                  ימים א׳–ה׳ | 09:00–17:00<br />
                  הפסקות: 12:30–13:00
                </div>
              </div>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((srv, i) => (
                <ClientServiceCard
                  key={srv._id || i}
                  service={srv}
                  workHours={workHours}
                  formatDuration={formatDuration}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- מצב עריכה/הוספה ---
  return (
    <div className="services-page-wrapper">
      <div className="services-form-box">
        <ServiceList
          services={services}
          setServices={setServices}
          handleDelete={handleDelete}
        />

        {/* מעבר ליומן */}
        {services.length > 0 && (
          <button className="go-to-calendar-btn" onClick={onNext}>
            <span role="img" aria-label="calendar">📅</span>
            מעבר להגדרת יומן
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentsMain;
