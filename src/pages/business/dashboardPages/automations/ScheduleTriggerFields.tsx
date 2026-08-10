import React from "react";
import {
  DEFAULT_TIMEZONE,
  MIN_INTERVAL_MINUTES,
  normalizeScheduleConfig,
  type AutomationScheduleConfig,
  type ScheduleFrequency,
} from "./automationSchedule";

const WEEKDAY_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: "א׳" },
  { value: 1, label: "ב׳" },
  { value: 2, label: "ג׳" },
  { value: 3, label: "ד׳" },
  { value: 4, label: "ה׳" },
  { value: 5, label: "ו׳" },
  { value: 6, label: "ש׳" },
];

const TIMEZONE_OPTIONS = [
  "Asia/Jerusalem",
  "UTC",
  "Europe/London",
  "America/New_York",
] as const;

type Props = {
  value: Partial<AutomationScheduleConfig> | null | undefined;
  disabled?: boolean;
  onChange: (next: AutomationScheduleConfig) => void;
};

function ensureConfig(
  value: Partial<AutomationScheduleConfig> | null | undefined
): AutomationScheduleConfig {
  return (
    normalizeScheduleConfig(value || {}) ||
    normalizeScheduleConfig({
      frequency: "every_minutes",
      interval: 15,
      timeOfDay: "09:00",
      weekdays: [],
      activeHours: null,
      timezone: DEFAULT_TIMEZONE,
    })!
  );
}

export default function ScheduleTriggerFields({
  value,
  disabled,
  onChange,
}: Props) {
  const config = ensureConfig(value);
  const activeEnabled = Boolean(config.activeHours);

  const patch = (partial: Partial<AutomationScheduleConfig>) => {
    const next = normalizeScheduleConfig({ ...config, ...partial });
    if (next) onChange(next);
  };

  const setFrequency = (frequency: ScheduleFrequency) => {
    const interval =
      frequency === "every_minutes"
        ? Math.max(MIN_INTERVAL_MINUTES, Number(config.interval) || 15)
        : frequency === "every_hours"
          ? Math.max(1, Number(config.interval) || 1)
          : config.interval;
    patch({
      frequency,
      interval,
      weekdays:
        frequency === "weekly"
          ? config.weekdays.length
            ? config.weekdays
            : [1, 2, 3, 4, 5]
          : config.weekdays,
    });
  };

  const toggleWeekday = (day: number) => {
    const set = new Set(config.weekdays);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    const weekdays = [...set].sort((a, b) => a - b);
    patch({ weekdays: weekdays.length ? weekdays : [day] });
  };

  return (
    <div className="af-schedule" dir="rtl">
      <label>
        תדירות
        <select
          value={config.frequency}
          disabled={disabled}
          onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
        >
          <option value="every_minutes">כל X דקות</option>
          <option value="every_hours">כל X שעות</option>
          <option value="daily">יומי</option>
          <option value="weekly">שבועי</option>
        </select>
      </label>

      {config.frequency === "every_minutes" ? (
        <label>
          כל כמה דקות
          <input
            type="number"
            min={MIN_INTERVAL_MINUTES}
            max={24 * 60}
            value={config.interval}
            disabled={disabled}
            onChange={(e) =>
              patch({
                interval: Math.max(
                  MIN_INTERVAL_MINUTES,
                  Number(e.target.value) || MIN_INTERVAL_MINUTES
                ),
              })
            }
          />
          <span className="af-schedule__hint">
            מינימום {MIN_INTERVAL_MINUTES} דקות
          </span>
        </label>
      ) : null}

      {config.frequency === "every_hours" ? (
        <label>
          כל כמה שעות
          <input
            type="number"
            min={1}
            max={24}
            value={config.interval}
            disabled={disabled}
            onChange={(e) =>
              patch({
                interval: Math.max(1, Math.min(24, Number(e.target.value) || 1)),
              })
            }
          />
        </label>
      ) : null}

      {config.frequency === "daily" || config.frequency === "weekly" ? (
        <label>
          שעת הפעלה
          <input
            type="time"
            value={config.timeOfDay || "09:00"}
            disabled={disabled}
            onChange={(e) => patch({ timeOfDay: e.target.value || "09:00" })}
          />
        </label>
      ) : null}

      {config.frequency === "weekly" ||
      config.frequency === "every_minutes" ||
      config.frequency === "every_hours" ? (
        <div className="af-schedule__weekdays">
          <span className="af-schedule__label">
            {config.frequency === "weekly" ? "ימים בשבוע" : "ימי פעילות (אופציונלי)"}
          </span>
          <div className="af-schedule__weekday-row">
            {WEEKDAY_OPTIONS.map((day) => {
              const active =
                config.weekdays.length === 0
                  ? config.frequency !== "weekly"
                  : config.weekdays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  className={`af-schedule__day${active ? " af-schedule__day--active" : ""}`}
                  disabled={disabled}
                  aria-pressed={active}
                  onClick={() => {
                    if (config.frequency === "weekly") {
                      toggleWeekday(day.value);
                      return;
                    }
                    const set = new Set(config.weekdays);
                    if (set.size === 0) {
                      WEEKDAY_OPTIONS.forEach((d) => set.add(d.value));
                    }
                    if (set.has(day.value)) set.delete(day.value);
                    else set.add(day.value);
                    const weekdays = [...set].sort((a, b) => a - b);
                    patch({
                      weekdays:
                        weekdays.length === 7 || weekdays.length === 0
                          ? []
                          : weekdays,
                    });
                  }}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="af-schedule__active-hours">
        <label className="af-schedule__checkbox">
          <input
            type="checkbox"
            checked={activeEnabled}
            disabled={disabled}
            onChange={(e) =>
              patch({
                activeHours: e.target.checked
                  ? { start: "08:00", end: "20:00" }
                  : null,
              })
            }
          />
          הגבלת שעות פעילות
        </label>
        {activeEnabled && config.activeHours ? (
          <div className="af-schedule__active-row">
            <label>
              מ־
              <input
                type="time"
                value={config.activeHours.start}
                disabled={disabled}
                onChange={(e) =>
                  patch({
                    activeHours: {
                      start: e.target.value || "08:00",
                      end: config.activeHours?.end || "20:00",
                    },
                  })
                }
              />
            </label>
            <label>
              עד
              <input
                type="time"
                value={config.activeHours.end}
                disabled={disabled}
                onChange={(e) =>
                  patch({
                    activeHours: {
                      start: config.activeHours?.start || "08:00",
                      end: e.target.value || "20:00",
                    },
                  })
                }
              />
            </label>
          </div>
        ) : null}
      </div>

      <label>
        אזור זמן
        <select
          value={config.timezone || DEFAULT_TIMEZONE}
          disabled={disabled}
          onChange={(e) =>
            patch({ timezone: e.target.value || DEFAULT_TIMEZONE })
          }
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz} value={tz}>
              {tz === "Asia/Jerusalem" ? "Asia/Jerusalem (ישראל)" : tz}
            </option>
          ))}
          {!TIMEZONE_OPTIONS.includes(
            (config.timezone || "") as (typeof TIMEZONE_OPTIONS)[number]
          ) && config.timezone ? (
            <option value={config.timezone}>{config.timezone}</option>
          ) : null}
        </select>
      </label>
    </div>
  );
}
