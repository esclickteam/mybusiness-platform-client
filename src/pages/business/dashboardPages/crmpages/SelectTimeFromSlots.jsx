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

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setAvailableSlots([]);
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

  if (loading) return <p>טוען זמני פגישה...</p>;
  if (!date) return <p>יש לבחור תאריך תחילה</p>;
  if (availableSlots.length === 0) return <p>אין משבצות זמינות בתאריך זה</p>;

  return (
    <div className="time-select-wrapper">
      <label>שעה:</label>
      <select
        value={selectedTime}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">בחר שעה</option>
        {availableSlots.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTimeFromSlots;
