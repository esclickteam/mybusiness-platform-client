import React, { useEffect, useState } from "react";
import API from "@api";

const SelectTimeFromSlots = ({
  date,
  selectedTime,
  onChange,
  businessId,
  serviceId,
  schedule = [],
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || "");

  /**
   * Validate if selected date has working hours
   */
  const isDayValid = (schedule, date) => {
    if (!schedule || schedule.length === 0 || !date) return false;

    const dayOfWeek = new Date(date).getDay(); // 0=Sun..6=Sat
    const daySchedule = schedule.find((s) => Number(s.day) === dayOfWeek);

    if (!daySchedule) return false;
    if (daySchedule.closed === true) return false;

    // Start/end must exist
    if (!daySchedule.start || !daySchedule.end) return false;

    return true;
  };

  /**
   * Load available slots
   */
  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setAvailableSlots([]);
      setLocalSelectedTime("");
      return;
    }

    // If the business is closed this day — no API request
    if (!isDayValid(schedule, date)) {
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

  /**
   * Sync external selected time
   */
  useEffect(() => {
    setLocalSelectedTime(selectedTime || "");
  }, [selectedTime]);

  /**
   * View
   */
  if (!date) return <p>Please select a date first</p>;
  if (!isDayValid(schedule, date)) return <p>This day is closed</p>;

  if (loading) return <p>Loading available times...</p>;
  if (availableSlots.length === 0)
    return <p>No available slots for this date</p>;

  return (
    <div className="time-select-wrapper">
      <label>Time:</label>

      {localSelectedTime ? (
        <div>
          <span>Selected time: {localSelectedTime}</span>
          <button onClick={() => onChange("")} style={{ marginLeft: "10px" }}>
            Change time
          </button>
        </div>
      ) : (
        <select
          value={localSelectedTime}
          onChange={(e) => {
            setLocalSelectedTime(e.target.value);
            onChange(e.target.value);
          }}
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
