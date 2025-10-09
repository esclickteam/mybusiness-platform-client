import React, { useEffect, useState } from 'react';
import API from '@api';
import ServiceList from './ServiceList';
import CalendarSetup from './CalendarSetup';
import './AppointmentsMain.css';
import { format, parse, differenceInMinutes, addMinutes } from 'date-fns';
import { useAuth } from '../../../../../../context/AuthContext';

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

const AppointmentsMain = ({
  isPreview = false,
  services = [],
  setServices,
  workHours = {},
  setWorkHours,
  setBusinessDetails,
  initialBusinessId = null,
}) => {
  const { currentUser, socket } = useAuth();

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showCalendarSetup, setShowCalendarSetup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(initialBusinessId);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (initialBusinessId) setSelectedBusinessId(initialBusinessId);
  }, [initialBusinessId]);

  useEffect(() => {
    if (!isPreview && setServices && selectedBusinessId) {
      API.get('/business/my/services', { params: { businessId: selectedBusinessId } })
        .then(res => {
          setServices(res.data.services || []);
        })
        .catch(() => {
          const demo = JSON.parse(localStorage.getItem('demoServices_calendar') || '[]');
          setServices(demo);
        });
    }
  }, [isPreview, setServices, selectedBusinessId]);

  useEffect(() => {
    if (!isPreview && setWorkHours && selectedBusinessId) {
      API.get('/appointments/get-work-hours', {
        params: { businessId: selectedBusinessId }
      })
      .then(res => {
        setWorkHours(normalizeWorkHours(res.data));
      })
      .catch(() => {
        setWorkHours({});
      });
    }
  }, [isPreview, setWorkHours, selectedBusinessId]);

  // ...

  if (showCalendarSetup) {
    return (
      <CalendarSetup
        initialHours={workHours}
        onSave={async newHours => {
          // newHours הוא אובייקט Map של ימים
          // מסננים ימים בהם start ו-end ריקים
          const filteredHours = {};
          Object.entries(newHours).forEach(([day, item]) => {
            if (item?.start?.trim() !== '' && item?.end?.trim() !== '') {
              filteredHours[day] = { start: item.start.trim(), end: item.end.trim() };
            }
          });

          try {
            await API.post('/appointments/update-work-hours', { workHours: filteredHours });
            setWorkHours(filteredHours);
            setBusinessDetails(prev => ({ ...prev, workHours: filteredHours }));
            setShowCalendarSetup(false);
            alert('שעות הפעילות נשמרו בהצלחה!');
          } catch {
            alert('שגיאה בשמירת שעות הפעילות');
          }
        }}
        onCancel={() => setShowCalendarSetup(false)}
      />
    );
  }

  return (
    <div className="services-page-wrapper">
      <div className="services-form-box">
        <h2 className="services-form-title">📅 קביעת תור</h2>

        <div className="defined-services-section">
          <h3 className="defined-services-title">בחר שירות</h3>
          <ServiceList
            services={services}
            setServices={setServices}
            onSelect={srv => {
              setSelectedService(srv);
              setSelectedDate(null);
              setAvailableSlots([]);
              setSelectedSlot(null);
            }}
          />
        </div>

        {selectedService && (
          <div className="date-picker">
            <h3>בחר תאריך</h3>
            <input
              type="date"
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        )}

        {selectedDate && availableSlots.length > 0 && (
          <div className="slots-list">
            <h3>שעות פנויים</h3>
            <div className="slots-grid">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  className={`slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className="book-action">
            <button onClick={handleBook}>
              📅 קבע תור ל־{format(selectedDate, 'dd.MM.yyyy')} בשעה {selectedSlot}
            </button>
          </div>
        )}

        <button
          className="go-to-calendar-btn"
          onClick={() => setShowCalendarSetup(true)}
        >
          📅 הגדר יומן
        </button>
      </div>
    </div>
  );
};

export default AppointmentsMain;
