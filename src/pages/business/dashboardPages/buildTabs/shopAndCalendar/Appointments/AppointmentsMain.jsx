import React, { useState, useEffect } from 'react';
import API from '@api';
import ServiceList from './ServiceList';
import ClientServiceCard from './ClientServiceCard';
import CalendarSetup from './CalendarSetup';
import './AppointmentsMain.css';
import { format, parse, differenceInMinutes, addMinutes } from 'date-fns';
import { useAuth } from '../../../context/AuthContext'; // עדכן את הנתיב לפי הפרויקט שלך

// === Normalize work hours to {0: {...}, 1: {...}, ...} ===
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
  setBusinessDetails
}) => {
  const { currentUser } = useAuth();

  const [showCalendarSetup, setShowCalendarSetup] = useState(false);
  const [selectedService, setSelectedService]     = useState(null);
  const [selectedDate, setSelectedDate]           = useState(null);
  const [availableSlots, setAvailableSlots]       = useState([]);
  const [selectedSlot, setSelectedSlot]           = useState(null);

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
  }, [isPreview, setServices]);

  // --- Fetch & normalize workHours ---
  useEffect(() => {
    if (!isPreview && setWorkHours && currentUser) {
      API.get('/appointments/get-work-hours', {
        params: { businessId: currentUser?.businessId || "" }
      })
      .then(res => {
        setWorkHours(normalizeWorkHours(res.data));
      })
      .catch(() => setWorkHours({}));
    }
  }, [isPreview, setWorkHours, currentUser]);

  // --- Compute slots when date or service changes ---
  useEffect(() => {
    if (selectedDate && selectedService) {
      const dayIdx = selectedDate.getDay();
      const hours  = workHours[dayIdx];
      if (!hours) {
        setAvailableSlots([]);
        return;
      }
      const duration = selectedService.duration;
      const dateStr  = format(selectedDate, 'yyyy-MM-dd');
      const startDT  = parse(`${dateStr} ${hours.start}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDT    = parse(`${dateStr} ${hours.end}`,   'yyyy-MM-dd HH:mm', new Date());
      const totalMin = differenceInMinutes(endDT, startDT);

      const slots = [];
      for (let offset = 0; offset + duration <= totalMin; offset += duration) {
        const slotDT = addMinutes(startDT, offset);
        slots.push(format(slotDT, 'HH:mm'));
      }
      setAvailableSlots(slots);
    }
  }, [selectedDate, selectedService, workHours]);

  // --- Book appointment ---
  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) return;
    try {
      await API.post('/appointments/create', {
        serviceId: selectedService._id,
        date:      format(selectedDate, 'yyyy-MM-dd'),
        time:      selectedSlot
      });
      alert(`✅ התור נקבע ל־${format(selectedDate, 'dd.MM.yyyy')} בשעה ${selectedSlot}`);
    } catch {
      alert('❌ לא הצלחנו לקבוע את התור, נסה שוב');
    }
  };

  // --- Preview mode ---
  if (isPreview) {
    return (
      <div className="services-page-wrapper">
        <div className="services-form-box">
          <h2 className="services-form-title">📋 רשימת השירותים</h2>
          {/* … */}
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
          const hoursArray = Object.entries(newHours).map(([day, item]) => ({
            day,
            start: item?.start || '',
            end:   item?.end   || ''
          }));
          try {
            await API.post('/appointments/update-work-hours', { workHours: hoursArray });
            // תמיד נרמל למבנה של map לפי יום
            const updatedMap = {};
            hoursArray.forEach(({ day, start, end }) => {
              updatedMap[Number(day)] = { start, end };
            });
            setWorkHours(updatedMap);
            setBusinessDetails(prev => ({ ...prev, workHours: updatedMap }));
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

        {/* 1. בחירת שירות */}
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

        {/* 2. בחירת תאריך */}
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

        {/* 3. הצגת חלונות זמן */}
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

        {/* 4. כפתור קביעת התור */}
        {selectedSlot && (
          <div className="book-action">
            <button onClick={handleBook}>
              📅 קבע תור ל־{format(selectedDate, 'dd.MM.yyyy')} בשעה {selectedSlot}
            </button>
          </div>
        )}

        {/* כפתור מעבר להגדרת יומן */}
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
