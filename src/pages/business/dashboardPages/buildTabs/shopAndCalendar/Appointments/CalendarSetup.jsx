import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, getTextDirection } from "../../../../../../i18n/localeUtils";
import "./CalendarSetup.css";

const WEEKDAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];

function weekdayLabel(index, language) {
  const date = new Date(Date.UTC(2023, 0, 1 + index));
  return new Intl.DateTimeFormat(getIntlLocale(language), {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);
}

const defaultWeeklyHours = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: { start: "09:00", end: "18:00" },
};

export default function CalendarSetup({
  initialHours = defaultWeeklyHours,
  onSave,
  onCancel,
}) {
  const { t, i18n } = useTranslation();
  const [weeklyHours, setWeeklyHours] = useState(initialHours);

  useEffect(() => {
    setWeeklyHours(initialHours);
  }, [initialHours]);

  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [dayIdx]: prev[dayIdx]
        ? { ...prev[dayIdx], [field]: value }
        : { start: "", end: "" },
    }));
  };

  const handleToggleClosed = (dayIdx) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [dayIdx]: prev[dayIdx] ? null : { start: "", end: "" },
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(weeklyHours);
    } else {
      alert(t("leftover.hours.saved"));
    }
  };

  return (
    <div
      className="calendar-setup-container"
      dir={getTextDirection(i18n.language)}
    >
      <h2 className="calendar-title">🗓️ {t("leftover.hours.setupTitle")}</h2>

      <div className="weekly-hours-table">
        <table>
          <thead>
            <tr>
              <th>{t("leftover.hours.colDay")}</th>
              <th>{t("leftover.hours.colStart")}</th>
              <th>{t("leftover.hours.colEnd")}</th>
              <th>{t("leftover.hours.colClosed")}</th>
            </tr>
          </thead>
          <tbody>
            {WEEKDAY_INDEXES.map((i) => {
              const name = weekdayLabel(i, i18n.language);
              return (
                <tr key={i}>
                  <td className="day-cell">{name}</td>
                  <td>
                    <input
                      type="time"
                      className="time-input"
                      value={weeklyHours[i]?.start || ""}
                      onChange={(e) => handleChange(i, "start", e.target.value)}
                      disabled={weeklyHours[i] === null}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="time-input"
                      value={weeklyHours[i]?.end || ""}
                      onChange={(e) => handleChange(i, "end", e.target.value)}
                      disabled={weeklyHours[i] === null}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="close-checkbox"
                      checked={weeklyHours[i] === null}
                      onChange={() => handleToggleClosed(i)}
                      aria-label={t("leftover.hours.closedAria", { day: name })}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button className="save-all-btn styled" onClick={handleSave}>
          💾 {t("leftover.hours.saveWeekly")}
        </button>
        {onCancel && (
          <button className="cancel-btn styled" onClick={onCancel}>
            {t("common.back")}
          </button>
        )}
      </div>

      <div className="summary">
        <strong>🗓️ {t("leftover.hours.summary")}</strong>
        <ul>
          {WEEKDAY_INDEXES.map((i) => {
            const name = weekdayLabel(i, i18n.language);
            return (
              <li key={i} className="summary-item">
                <span className="day-label">{name}:</span>
                {weeklyHours[i] === null ? (
                  <span className="closed-label">{t("leftover.hours.closed")}</span>
                ) : weeklyHours[i]?.start && weeklyHours[i]?.end ? (
                  <span className="hours-label">
                    {weeklyHours[i].start} – {weeklyHours[i].end}
                  </span>
                ) : (
                  <span className="hours-label">{t("leftover.hours.notSet")}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
