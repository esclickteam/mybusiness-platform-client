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
  // מאגר תורים תפוסים בתאריך הנבחר, מנוהל בזמן אמת
  const [bookedSlots, setBookedSlots] = useState([]);

  // Sync initial businessId
  useEffect(() => {
    if (initialBusinessId) setSelectedBusinessId(initialBusinessId);
  }, [initialBusinessId]);

  // טעינת שירותים לעסק
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

  // טעינת שעות עבודה מעודכנות
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

  // נירמול פורמט זמן HH:mm
  const normalizeTime = (t) => {
    if (!t) return "";
    const parts = t.trim().split(":");
    if (parts.length < 2) return t;
    const h = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    return `${h}:${m}`;
  };

  // טען תורים תפוסים מתאריך מסוים, שמור בזיכרון מקומי לתיעוד עדכונים בזמן אמת
  const fetchBookedSlots = async (businessId, dateStr) => {
    if (!businessId || !dateStr) return [];
    try {
      const res = await API.get('/appointments/by-date', { params: { businessId, date: dateStr } });
      return res.data || [];
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      return [];
    }
  };

  // חשב זמינות - כל הזמנים בנויים לפי שעות עבודה - מפחיתים את הזמנים התפוסים (bookedSlots)
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

    // הפחת את הזמנים התפוסים מהרשימה המלאה
    return allSlots.filter(slot => !cleanedBooked.includes(slot));
  };

  // טען את התורים התפוסים בכל פעם שהתאריך/עסק משתנים או שקיבלנו אירוע ריענון
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

  // חישוב זמינות עם עדכון כל שינוי
  useEffect(() => {
    const freeSlots = computeAvailableSlots();
    setAvailableSlots(freeSlots);
  }, [bookedSlots, selectedDate, selectedService, workHours]);

  // ברירת מחדל לשעה נבחרת
  useEffect(() => {
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0]);
    } else {
      setSelectedSlot(null);
    }
  }, [availableSlots]);

  // מאזין לאירועים מ-WebSocket ומעדכן תורים תפוסים ו/או זמינות בהתאם
  useEffect(() => {
    if (!socket) return;

    const handleAppointmentCreated = (appt) => {
      // אם התור שנוצר הוא בתאריך ובעסק שלנו - עדכן bookedSlots
      const apptDateStr = appt.date?.slice(0,10);
      const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      if (appt.business === selectedBusinessId && apptDateStr === selectedDateStr) {
        setBookedSlots(prev => [...prev, appt.time]);
      }
    };

    const handleAppointmentUpdated = (appt) => {
      const apptDateStr = appt.date?.slice(0,10);
      const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      if (appt.business === selectedBusinessId && apptDateStr === selectedDateStr) {
        setBookedSlots(prev => {
          // עדכן: הסר את הזמן הישן אם שונה והוסף את החדש
          // כאן יש צורך בניהול מצב מלא אם שינינו זמן או תאריך - לצורך פשטות, נטען הכל מחדש:
          // לכן ניתן פשוט לרענן עם refreshCounter:
          setRefreshCounter(c => c + 1);
          return prev;
        });
      }
    };

    const handleAppointmentDeleted = ({ id }) => {
      // מאחר ואין פרטי התור - נטען מחדש את הזמנים כדי לוודא דיוק
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

  // טיפול בקביעת תור
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
      // אפס בחירת תור ותאריך ושירות, והכי חשוב - גם bookedSlots יתעדכנו בזכות האירועים
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
