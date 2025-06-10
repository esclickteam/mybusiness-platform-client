import React, { useEffect, useState } from "react";
import API from "@api";

const SelectTimeFromSlots = ({
  date,
  selectedTime,
  onChange,
  businessId,
  serviceId,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || "");

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
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
  }, [businessId, serviceId, date]);

  // Sync external selectedTime prop changes with local state
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
