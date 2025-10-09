import React, { useEffect, useState } from "react";
import API from "@api";

const SelectTimeFromSlots = ({
  date,
  selectedTime,
  onChange,
  businessId,
  serviceId,
  schedule = [], // Schedule passed as a prop
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || "");

  // Check if the selected date has a valid schedule
  const isDayValid = (schedule, date) => {
    if (!schedule || schedule.length === 0) return false;
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
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
      // If there's no valid schedule for this day, don't load slots
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

  // Sync external selectedTime with local state
  useEffect(() => {
    setLocalSelectedTime(selectedTime || "");
  }, [selectedTime]);

  if (loading) return <p>Loading available times...</p>;
  if (!date) return <p>Please select a date first</p>;
  if (availableSlots.length === 0) return <p>No available slots for this date</p>;

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
      <label>Time:</label>
      {localSelectedTime ? (
        <div>
          <span>Selected time: {localSelectedTime}</span>
          <button onClick={handleChangeTime} style={{ marginLeft: "10px" }}>
            Change time
          </button>
        </div>
      ) : (
        <select
          value={localSelectedTime}
          onChange={(e) => handleTimeSelect(e.target.value)}
        >
          <option value="">Select a time</option>
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
