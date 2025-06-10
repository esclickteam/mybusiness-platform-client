import React, { useState, useEffect } from 'react';
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

// פונקציה להמרת זמן slot לאזור זמן ישראל להצגה
function formatSlotTime(date, timeStr) {
  if (!date || !timeStr) return timeStr || "";
  const utcDate = new Date(`${format(date, 'yyyy-MM-dd')}T${timeStr}:00Z`);
  return utcDate.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem',
  });
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

  const [showCalendarSetup, setShowCalendarSetup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(initialBusinessId);
  const [refreshCounter, setRefreshCounter] = useState(0);

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

  const fetchBookedSlots = async (businessId, dateStr) => {
    if (!businessId || !dateStr) return [];
    try {
      console.log(`[AppointmentsMain] Fetching booked slots for businessId=${businessId} date=${dateStr}`);
      const res = await API.get('/appointments/by-date', { params: { businessId, date: dateStr } });
      console.log("[AppointmentsMain] Booked slots received from API:", res.data);
      return res.data || [];
    } catch (err) {
      console.error("[AppointmentsMain] Error fetching booked slots:", err);
      return [];
    }
  };

  const normalizeTime = (t) => {
    if (!t) return "";
    const parts = t.trim().split(":");
    if (parts.length < 2) return t;
    const h = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    return `${h}:${m}`;
  };

  useEffect(() => {
    if (selectedDate && selectedService && selectedBusinessId) {
      const dayIdx = selectedDate.getDay();
      const hours = workHours[dayIdx];
      if (!hours) {
        setAvailableSlots([]);
        return;
      }
      const duration = selectedService.duration;
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const startDT = parse(`${dateStr} ${hours.start}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDT = parse(`${dateStr} ${hours.end}`, 'yyyy-MM-dd HH:mm', new Date());
      const totalMin = differenceInMinutes(endDT, startDT);

      const generateAllSlots = () => {
        const slots = [];
        for (let offset = 0; offset + duration <= totalMin; offset += duration) {
          const slotDT = addMinutes(startDT, offset);
          slots.push(format(slotDT, 'HH:mm'));
        }
        return slots;
      };

      fetchBookedSlots(selectedBusinessId, dateStr).then(bookedSlots => {
        const allSlots = generateAllSlots();
        const cleanedBookedSlots = bookedSlots.map(normalizeTime);
        const cleanedAllSlots = allSlots.map(normalizeTime);
        const freeSlots = cleanedAllSlots.filter(slot => !cleanedBookedSlots.includes(slot));
        setAvailableSlots(freeSlots);
      });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedService, workHours, selectedBusinessId, refreshCounter]);

  useEffect(() => {
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0]);
    } else {
      setSelectedSlot(null);
    }
  }, [availableSlots]);

  useEffect(() => {
    if (!socket) return;

    const updateSlots = () => {
      setRefreshCounter(c => c + 1);
    };

    socket.on('appointmentCreated', updateSlots);
    socket.on('appointmentUpdated', updateSlots);
    socket.on('appointmentDeleted', updateSlots);

    return () => {
      socket.off('appointmentCreated', updateSlots);
      socket.off('appointmentUpdated', updateSlots);
      socket.off('appointmentDeleted', updateSlots);
    };
  }, [socket]);

  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedSlot || !selectedBusinessId) return;

    try {
      await API.post('/appointments/create', {
        businessId: selectedBusinessId,
        serviceId: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedSlot
      });
      alert(`✅ התור נקבע ל־${format(selectedDate, 'dd.MM.yyyy')} בשעה ${formatSlotTime(selectedDate, selectedSlot)}`);
      setSelectedDate(null);
      setSelectedSlot(null);
      setSelectedService(null);
    } catch (err) {
      alert('❌ לא הצלחנו לקבוע את התור, נסה שוב');
    }
  };

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

  if (showCalendarSetup) {
    return (
      <CalendarSetup
        initialHours={workHours}
        onSave={async newHours => {
          const hoursArray = Object.entries(newHours).map(([day, item]) => ({
            day,
            start: item?.start || '',
            end: item?.end || ''
          }));
          try {
            await API.post('/appointments/update-work-hours', { workHours: hoursArray });
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
                  {formatSlotTime(selectedDate, slot)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. כפתור קביעת התור */}
        {selectedSlot && (
          <div className="book-action">
            <button onClick={handleBook}>
              📅 קבע תור ל־{format(selectedDate, 'dd.MM.yyyy')} בשעה {formatSlotTime(selectedDate, selectedSlot)}
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
