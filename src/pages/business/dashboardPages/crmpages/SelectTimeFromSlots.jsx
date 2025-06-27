import React, { useEffect, useState } from "react";
import API from "@api";

const SelectTimeFromSlots = ({
  date,
  selectedTime,
  onChange,
  businessId,
  serviceId,
  schedule = [], // לוח זמנים עובר כפרופ
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || "");

  // פונקציה לבדיקת תקינות לוח הזמנים ליום המבוקש
  const isDayValid = (schedule, date) => {
    if (!schedule || schedule.length === 0) return false;
    const dayOfWeek = new Date(date).getDay(); // 0=ראשון, 6=שבת
    const daySchedule = schedule.find(s => Number(s.day) === dayOfWeek);
    return daySchedule && daySchedule.start && daySchedule.end;
  };

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setAvailableSlots([]);
      setLocalSelectedTime("");
      return;
    }

    if (!isDayValid(schedule, date)) {
      // אם אין לוח זמנים תקף ליום זה, לא נטען משבצות
      setAvailableSlots([]);
      setLocalSelectedTime("");
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await API.get("/appointments/slots", {
          params: { businessId, serviceId, date },
        });
        setAvailableSlots(res.data.slots || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [businessId, serviceId, date, schedule]);

  // סנכרון שינוי selectedTime חיצוני עם מצב מקומי
  useEffect(() => {
    setLocalSelectedTime(selectedTime || "");
  }, [selectedTime]);

  if (loading) return <p>טוען זמני פגישה...</p>;
  if (!date) return <p>יש לבחור תאריך תחילה</p>;
  if (availableSlots.length === 0) return <p>אין משבצות זמינות בתאריך זה</p>;

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    onChange(time);
  };

  const handleChangeTime = () => {
    setLocalSelectedTime("");
    onChange("");
  };

  return (
    <div className="time-select-wrapper">
      <label>שעה:</label>
      {localSelectedTime ? (
        <div>
          <span>השעה שנבחרה: {localSelectedTime}</span>
          <button onClick={handleChangeTime} style={{ marginLeft: "10px" }}>
            שנה שעה
          </button>
        </div>
      ) : (
        <select
          value={localSelectedTime}
          onChange={(e) => handleTimeSelect(e.target.value)}
        >
          <option value="">בחר שעה</option>
          {availableSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SelectTimeFromSlots;
