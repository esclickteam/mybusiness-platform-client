import React, { useState, useEffect } from 'react';
import API from '@api';
import ServiceList from './ServiceList';
import ClientServiceCard from './ClientServiceCard';
import CalendarSetup from './CalendarSetup';
import './AppointmentsMain.css';

const AppointmentsMain = ({
  isPreview = false,
  services = [],
  setServices,
  onNext,
  workHours = {},
  setWorkHours,
}) => {
  const [showCalendarSetup, setShowCalendarSetup] = useState(false);

  // --- Fetch services ---
  useEffect(() => {
    if (!isPreview && setServices) {
      API.get('/business/my/services')
        .then(res => setServices(res.data.services || []))
        .catch(() => {
          const demo = JSON.parse(localStorage.getItem('demoServices_calendar') || '[]');
          setServices(demo);
        });
    }
    // eslint-disable-next-line
  }, []);

  // --- Delete service ---
  const handleDelete = index => {
    const srv = services[index];
    if (srv && srv._id) {
      API.delete(`/business/my/services/${srv._id}`)
        .then(res => setServices(res.data.services || []))
        .catch(err => alert(err.message));
    } else {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
      localStorage.setItem('demoServices_calendar', JSON.stringify(updated));
    }
  };

  // --- Format duration ---
  const formatDuration = minutes => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')} שעות` : `${m} דקות`;
  };

  // --- Preview mode ---
  if (isPreview) {
    return (
      <div className="services-page-wrapper">
        <div className="services-preview services-form-box">
          <h2 className="services-form-title">📋 רשימת השירותים</h2>
          {!services.length ? (
            <div className="empty-preview">
              <div className="no-services-card">
                <p style={{ textAlign: 'center', fontWeight: 500 }}>📝 לא הוגדרו שירותים עדיין.</p>
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

  // --- Calendar setup mode ---
  if (showCalendarSetup) {
    return (
      <CalendarSetup
        initialHours={workHours}
        onSave={async newHours => {
          // Build array of all 7 days, defaulting missing to empty strings
          const hoursArray = Object.entries(newHours).map(([day, item]) => ({
            day,
            start: item?.start || '',
            end:   item?.end   || ''
          }));

          console.log('🚀 Sending workHours:', hoursArray);
          try {
            const res = await API.post('/appointments/update-work-hours', { workHours: hoursArray });
            console.log('✅ Server response:', res.data);

            // Reflect back into state map
            const updatedMap = hoursArray.reduce(
              (acc, { day, start, end }) => ({ ...acc, [day]: { start, end } }),
              {}
            );
            setWorkHours(updatedMap);
            setShowCalendarSetup(false);
            alert('שעות הפעילות נשמרו בהצלחה!');
          } catch (error) {
            console.error('❌ Error saving hours:', error?.response?.data || error);
            alert('שגיאה בשמירת שעות הפעילות');
          }
        }}
        onCancel={() => setShowCalendarSetup(false)}
      />
    );
  }

  // --- Default: list + button ---
  return (
    <div className="services-page-wrapper">
      <div className="services-form-box">
        <ServiceList
          services={services}
          setServices={setServices}
          handleDelete={handleDelete}
        />
        {services.length > 0 && (
          <button className="go-to-calendar-btn" onClick={() => setShowCalendarSetup(true)}>
            📅 מעבר להגדרת יומן
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentsMain;
