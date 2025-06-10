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

  const normalizeTime = (t) => {
    if (!t) return "";
    const parts = t.trim().split(":");
    if (parts.length < 2) return t;
    const h = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    return `${h}:${m}`;
  };

  const fetchBookedSlots = async (businessId, dateStr) => {
  if (!businessId || !dateStr) return [];
  try {
    const res = await API.get('/appointments/by-date', { params: { businessId, date: dateStr } });
    // מניחים שקיבלנו מערך של אובייקטים עם זמן ומשך
    // נרחיב כל פגישה לזמנים תפוסים לפי משך
    const slots = [];
    res.data.forEach(appt => {
      const startParts = appt.time.split(':').map(Number);
      let startMinutes = startParts[0] * 60 + startParts[1];
      const duration = appt.duration || 30;
      const increments = duration / 30; // נניח שכל פרק זמן הוא 30 דק'

      for (let i = 0; i < increments; i++) {
        const h = Math.floor(startMinutes / 60).toString().padStart(2, '0');
        const m = (startMinutes % 60).toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        startMinutes += 30;
      }
    });
    // הסר כפילויות
    return [...new Set(slots)];
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    return [];
  }
};


  const computeAvailableSlots = () => {
    if (!selectedDate || !selectedService || !selectedBusinessId) return [];

    const dayIdx = selectedDate.getDay();
    const hours = workHours[dayIdx];
    if (!hours || !hours.start || !hours.end) return [];

    const duration = selectedService.duration || 30;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const startDT = parse(`${dateStr} ${hours.start}`, 'yyyy-MM-dd HH:mm', new Date());
    const endDT = parse(`${dateStr} ${hours.end}`, 'yyyy-MM-dd HH:mm', new Date());
    const totalMin = differenceInMinutes(endDT, startDT);

    const allSlots = [];
    for (let offset = 0; offset + duration <= totalMin; offset += duration) {
      const slotDT = addMinutes(startDT, offset);
      allSlots.push(format(slotDT, 'HH:mm'));
    }

    const cleanedBooked = bookedSlots.map(normalizeTime);

    return allSlots.filter(slot => {
      const normSlot = normalizeTime(slot);
      return !cleanedBooked.includes(normSlot);
    });
  };

  useEffect(() => {
    if (!selectedDate || !selectedBusinessId) {
      setBookedSlots([]);
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    fetchBookedSlots(selectedBusinessId, dateStr).then(slots => {
      setBookedSlots(slots);
    });
  }, [selectedDate, selectedBusinessId, refreshCounter]);

  useEffect(() => {
    const freeSlots = computeAvailableSlots();
    setAvailableSlots(freeSlots);
  }, [bookedSlots, selectedDate, selectedService, workHours]);

  useEffect(() => {
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0]);
    } else {
      setSelectedSlot(null);
    }
  }, [availableSlots]);

  useEffect(() => {
    if (!socket) return;

    const handleAppointmentCreated = (appt) => {
      const apptDateStr = appt.date?.slice(0,10);
      const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      if (appt.business === selectedBusinessId && apptDateStr === selectedDateStr) {
        setBookedSlots(prev => {
          const normTime = normalizeTime(appt.time);
          const prevNormalized = prev.map(normalizeTime);
          if (prevNormalized.includes(normTime)) return prev;
          return [...prev, normTime];
        });
      }
    };

    const handleAppointmentUpdated = (appt) => {
      const apptDateStr = appt.date?.slice(0,10);
      const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      if (appt.business === selectedBusinessId && apptDateStr === selectedDateStr) {
        setRefreshCounter(c => c + 1);
      }
    };

    const handleAppointmentDeleted = ({ id }) => {
      setRefreshCounter(c => c + 1);
    };

    socket.on('appointmentCreated', handleAppointmentCreated);
    socket.on('appointmentUpdated', handleAppointmentUpdated);
    socket.on('appointmentDeleted', handleAppointmentDeleted);

    return () => {
      socket.off('appointmentCreated', handleAppointmentCreated);
      socket.off('appointmentUpdated', handleAppointmentUpdated);
      socket.off('appointmentDeleted', handleAppointmentDeleted);
    };
  }, [socket, selectedBusinessId, selectedDate]);

  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedSlot || !selectedBusinessId) return;

    try {
      await API.post('/appointments/create', {
        businessId: selectedBusinessId,
        serviceId: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedSlot
      });
      alert(`✅ התור נקבע ל־${format(selectedDate, 'dd.MM.yyyy')} בשעה ${selectedSlot}`);
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
