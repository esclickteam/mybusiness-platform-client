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

const AppointmentsMain = ({
  isPreview = false,
  services = [],
  setServices,
  workHours = {},
  setWorkHours,
  setBusinessDetails
}) => {
  const { currentUser, socket } = useAuth();

  const [showCalendarSetup, setShowCalendarSetup] = useState(false);
  const [selectedService, setSelectedService]     = useState(null);
  const [selectedDate, setSelectedDate]           = useState(null);
  const [availableSlots, setAvailableSlots]       = useState([]);
  const [selectedSlot, setSelectedSlot]           = useState(null);

  const [refreshCounter, setRefreshCounter] = useState(0);

  // --- Fetch services ---
  useEffect(() => {
    if (!isPreview && setServices) {
      console.log("[AppointmentsMain] Fetching services...");
      API.get('/business/my/services')
        .then(res => {
          console.log("[AppointmentsMain] Services received:", res.data.services);
          setServices(res.data.services || []);
        })
        .catch(() => {
          const demo = JSON.parse(localStorage.getItem('demoServices_calendar') || '[]');
          console.log("[AppointmentsMain] Using demo services:", demo);
          setServices(demo);
        });
    }
  }, [isPreview, setServices]);

  // --- Fetch & normalize workHours ---
  useEffect(() => {
    if (!isPreview && setWorkHours && currentUser) {
      console.log("[AppointmentsMain] Fetching work hours for business:", currentUser.businessId);
      API.get('/appointments/get-work-hours', {
        params: { businessId: currentUser?.businessId || "" }
      })
      .then(res => {
        console.log("[AppointmentsMain] Work hours received:", res.data);
        setWorkHours(normalizeWorkHours(res.data));
      })
      .catch(() => {
        console.error("[AppointmentsMain] Failed to fetch work hours");
        setWorkHours({});
      });
    }
  }, [isPreview, setWorkHours, currentUser]);

  // --- Fetch booked slots from API ---
  const fetchBookedSlots = async (businessId, dateStr) => {
    try {
      console.log(`[AppointmentsMain] Fetching booked slots for business ${businessId} on date ${dateStr}`);
      const res = await API.get('/appointments/by-date', { params: { businessId, date: dateStr } });
      console.log("[AppointmentsMain] Booked slots received:", res.data);
      return res.data || [];
    } catch (err) {
      console.error("[AppointmentsMain] Error fetching booked slots:", err);
      return [];
    }
  };

  // --- Compute slots when date or service changes or refreshCounter changes ---
  useEffect(() => {
    console.log("[AppointmentsMain] Computing available slots", {
      selectedDate,
      selectedService,
      refreshCounter
    });
    if (selectedDate && selectedService && currentUser) {
      const dayIdx = selectedDate.getDay();
      const hours  = workHours[dayIdx];
      if (!hours) {
        console.warn("[AppointmentsMain] No work hours found for day:", dayIdx);
        setAvailableSlots([]);
        return;
      }
      const duration = selectedService.duration;
      const dateStr  = format(selectedDate, 'yyyy-MM-dd');
      const startDT  = parse(`${dateStr} ${hours.start}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDT    = parse(`${dateStr} ${hours.end}`,   'yyyy-MM-dd HH:mm', new Date());
      const totalMin = differenceInMinutes(endDT, startDT);

      const generateAllSlots = () => {
        const slots = [];
        for (let offset = 0; offset + duration <= totalMin; offset += duration) {
          const slotDT = addMinutes(startDT, offset);
          slots.push(format(slotDT, 'HH:mm'));
        }
        return slots;
      };

      fetchBookedSlots(currentUser.businessId, dateStr).then(bookedSlots => {
        console.log("[AppointmentsMain] Filtering slots...");
        const allSlots = generateAllSlots();
        console.log("[AppointmentsMain] All slots:", allSlots);
        const freeSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        console.log("[AppointmentsMain] Available (free) slots:", freeSlots);
        setAvailableSlots(freeSlots);
      });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedService, workHours, currentUser, refreshCounter]);

  // --- Sync real-time updates with Socket.IO ---
  useEffect(() => {
    if (!socket) {
      console.warn("[AppointmentsMain] Socket is not connected");
      return;
    }

    const updateSlots = () => {
      console.log('[Socket] appointment event received - incrementing refreshCounter');
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

  // --- Book appointment ---
  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      console.warn("[AppointmentsMain] Missing data for booking");
      return;
    }
    try {
      console.log("[AppointmentsMain] Booking appointment...", {
        serviceId: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedSlot
      });
      await API.post('/appointments/create', {
        serviceId: selectedService._id,
        date:      format(selectedDate, 'yyyy-MM-dd'),
        time:      selectedSlot
      });
      alert(`✅ התור נקבע ל־${format(selectedDate, 'dd.MM.yyyy')} בשעה ${selectedSlot}`);
      setSelectedDate(null);
      setSelectedSlot(null);
      setSelectedService(null);
    } catch (err) {
      console.error("[AppointmentsMain] Booking failed:", err);
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
            end:   item?.end   || ''
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
