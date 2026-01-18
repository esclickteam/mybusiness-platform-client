import React, { useState, useEffect } from "react";
import API from "@api";
import "./WorkHoursTab.css";


const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function WorkHoursTab() {
  const [weeklyHours, setWeeklyHours] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchWorkHours() {
      try {
        const res = await API.get("/appointments/get-work-hours");
        setWeeklyHours(res.data.workHours || {});
      } catch (e) {
        console.error("Error loading work hours:", e);
      }
    }
    fetchWorkHours();
  }, []);

  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: {
        ...(prev[dayIdx] ?? { start: "", end: "" }),
        [field]: value,
      },
    }));
  };

  const toggleDay = dayIdx => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]:
        prev[dayIdx] === null
          ? { start: "", end: "" }
          : null,
    }));
  };

  const applyToAllDays = () => {
    const sourceDay = weeklyHours[0];
    if (!sourceDay || sourceDay === null) return;

    const updated = {};
    weekdays.forEach((_, i) => {
      updated[i] = { ...sourceDay };
    });
    setWeeklyHours(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      await API.post("/appointments/update-work-hours", {
        workHours: weeklyHours,
      });
      setSaved(true);
    } catch (e) {
      console.error("Error saving work hours:", e);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="calendar-setup-container" style={{ direction: "ltr" }}>
      <h2 className="calendar-title">🗓️ Business Working Hours</h2>

      <div className="week-grid">
        {weekdays.map((day, i) => {
          const isClosed = weeklyHours[i] === null;

          return (
            <div key={i} className={`day-card ${isClosed ? "closed" : ""}`}>
              <div className="day-header">
                <span className="day-name">{day}</span>

                <button
                  type="button"
                  className={`day-toggle ${isClosed ? "off" : "on"}`}
                  onClick={() => toggleDay(i)}
                >
                  {isClosed ? "Closed" : "Open"}
                </button>
              </div>

              {!isClosed && (
                <div className="time-row">
                  <input
                    type="time"
                    value={weeklyHours[i]?.start || ""}
                    onChange={e =>
                      handleChange(i, "start", e.target.value)
                    }
                  />
                  <span className="dash">–</span>
                  <input
                    type="time"
                    value={weeklyHours[i]?.end || ""}
                    onChange={e =>
                      handleChange(i, "end", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="actions-row">
        <button
          type="button"
          className="secondary-btn"
          onClick={applyToAllDays}
        >
          📋 Apply Sunday to all days
        </button>

        <button
          type="button"
          className="primary-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {saved && <div className="save-indicator">✅ Saved</div>}
    </div>
  );
}
