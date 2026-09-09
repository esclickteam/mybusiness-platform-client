import React from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  DEFAULT_TIMEZONE,
  MIN_INTERVAL_MINUTES,
  normalizeScheduleConfig,
  type AutomationScheduleConfig,
  type ScheduleFrequency,
} from "./automationSchedule";

const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6] as const;

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
  const { t, i18n } = useTranslation();
  const config = ensureConfig(value);
  const activeEnabled = Boolean(config.activeHours);
  const weekdayDefaults = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayLabels = WEEKDAY_VALUES.map((day) =>
    t(`automations.schedule.day${day}`, weekdayDefaults[day])
  );

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
    <div className="af-schedule" dir={getTextDirection(i18n.language)}>
      <label>
        {t("automations.schedule.frequency", "Frequency")}
        <select
          value={config.frequency}
          disabled={disabled}
          onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
        >
          <option value="every_minutes">
            {t("automations.schedule.everyMinutes", "Every X minutes")}
          </option>
          <option value="every_hours">
            {t("automations.schedule.everyHours", "Every X hours")}
          </option>
          <option value="daily">{t("automations.schedule.daily", "Daily")}</option>
          <option value="weekly">{t("automations.schedule.weekly", "Weekly")}</option>
        </select>
      </label>

      {config.frequency === "every_minutes" ? (
        <label>
          {t("automations.schedule.everyNMinutes", "Every how many minutes")}
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
            {t("automations.schedule.minMinutes", {
              count: MIN_INTERVAL_MINUTES,
              defaultValue: "Minimum {{count}} minutes",
            })}
          </span>
        </label>
      ) : null}

      {config.frequency === "every_hours" ? (
        <label>
          {t("automations.schedule.everyNHours", "Every how many hours")}
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
          {t("automations.schedule.timeOfDay", "Run time")}
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
            {config.frequency === "weekly"
              ? t("automations.schedule.weekdays", "Days of the week")
              : t(
                  "automations.schedule.activeDaysOptional",
                  "Active days (optional)"
                )}
          </span>
          <div className="af-schedule__weekday-row">
            {WEEKDAY_VALUES.map((day) => {
              const active =
                config.weekdays.length === 0
                  ? config.frequency !== "weekly"
                  : config.weekdays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`af-schedule__day${active ? " af-schedule__day--active" : ""}`}
                  disabled={disabled}
                  aria-pressed={active}
                  onClick={() => {
                    if (config.frequency === "weekly") {
                      toggleWeekday(day);
                      return;
                    }
                    const set = new Set(config.weekdays);
                    if (set.size === 0) {
                      WEEKDAY_VALUES.forEach((d) => set.add(d));
                    }
                    if (set.has(day)) set.delete(day);
                    else set.add(day);
                    const weekdays = [...set].sort((a, b) => a - b);
                    patch({
                      weekdays:
                        weekdays.length === 7 || weekdays.length === 0
                          ? []
                          : weekdays,
                    });
                  }}
                >
                  {weekdayLabels[day]}
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
          {t("automations.schedule.limitHours", "Limit active hours")}
        </label>
        {activeEnabled && config.activeHours ? (
          <div className="af-schedule__active-row">
            <label>
              {t("automations.schedule.from", "From")}
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
              {t("automations.schedule.until", "Until")}
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
        {t("automations.schedule.timezone", "Time zone")}
        <select
          value={config.timezone || DEFAULT_TIMEZONE}
          disabled={disabled}
          onChange={(e) =>
            patch({ timezone: e.target.value || DEFAULT_TIMEZONE })
          }
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz} value={tz}>
              {tz === "Asia/Jerusalem"
                ? t(
                    "automations.schedule.timezoneIsrael",
                    "Asia/Jerusalem (Israel)"
                  )
                : tz}
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
