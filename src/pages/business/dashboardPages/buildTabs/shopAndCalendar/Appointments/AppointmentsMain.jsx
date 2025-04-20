import React, { useState, useEffect } from 'react';
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
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    if (!services || services.length === 0) {
      const fromCalendar = JSON.parse(localStorage.getItem("demoServices_calendar") || "[]");
      if (fromCalendar.length > 0) {
        setServices(fromCalendar);
      }
    }
  }, [services, setServices]);

  const handleDelete = (indexToDelete) => {
    const updated = services.filter((_, i) => i !== indexToDelete);
    setServices(updated);
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, '0')} שעות`;
  };

  if (isPreview) {
    return (
      <div className="services-preview">
        <h2 className="edit-title">📋 רשימת השירותים</h2>
        {(!services || services.length === 0) ? (
          <div className="empty-preview">
            <div className="no-services-card">
              <p style={{ textAlign: 'center', fontWeight: '500' }}>📝 לא הוגדרו שירותים עדיין.</p>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
                השירותים שתזין יופיעו כאן בתצוגה חיה
              </p>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px' }}>
                <strong>⏰ שעות פעילות:</strong><br />
                ימים א׳–ה׳ | 09:00–17:00<br />
                הפסקות: 12:30–13:00
              </div>
            </div>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((srv, i) => (
              <ClientServiceCard key={i} service={srv} workHours={workHours} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="form-column">
      <h2 className="edit-title">🎨 עיצוב הכרטיס</h2>
      <ServiceList
        services={services}
        setServices={setServices}
        handleDelete={handleDelete}
        onNext={onNext}
      />
      {services.length > 0 && (
        <button className="next-btn" onClick={onNext}>
          מעבר להגדרת יומן 📅
        </button>
      )}
    </div>
  );
};

export default AppointmentsMain;
