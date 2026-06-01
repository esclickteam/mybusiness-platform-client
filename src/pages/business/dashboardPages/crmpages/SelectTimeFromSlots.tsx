import React, { useEffect, useMemo, useState } from "react";
import API from "@api";

type ScheduleDay = {
  day: number | string;
  start?: string;
  end?: string;
  closed?: boolean;
  isOpen?: boolean;
  [key: string]: any;
};

type SelectTimeFromSlotsProps = {
  date: string;
  selectedTime: string;
  onChange: (time: string) => void;
  businessId: string;
  serviceId: string;
  schedule?: ScheduleDay[];
  duration?: number;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function SelectTimeFromSlots({
  date,
  selectedTime,
  onChange,
  businessId,
  serviceId,
  schedule = [],
  duration = 30,
}: SelectTimeFromSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || "");
  const [error, setError] = useState("");

  const selectedDaySchedule = useMemo(() => {
    if (!date || !Array.isArray(schedule) || schedule.length === 0) {
      return null;
    }

    const dayOfWeek = new Date(date).getDay();

    return (
      schedule.find((item) => Number(item.day) === dayOfWeek) ||
      schedule[dayOfWeek] ||
      null
    );
  }, [schedule, date]);

  const isDayValid = useMemo(() => {
    if (!date) return false;
    if (!selectedDaySchedule) return false;
    if (selectedDaySchedule.closed === true) return false;
    if (selectedDaySchedule.isOpen === false) return false;
    if (!selectedDaySchedule.start || !selectedDaySchedule.end) return false;

    return true;
  }, [date, selectedDaySchedule]);

  useEffect(() => {
    setLocalSelectedTime(selectedTime || "");
  }, [selectedTime]);

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setAvailableSlots([]);
      setLocalSelectedTime("");
      setError("");
      return;
    }

    if (!isDayValid) {
      setAvailableSlots([]);
      setLocalSelectedTime("");
      setError("");
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/appointments/slots", {
          params: {
            businessId,
            serviceId,
            date,
            duration,
          },
        });

        const slots = Array.isArray(res.data?.slots) ? res.data.slots : [];

        setAvailableSlots(slots);

        if (localSelectedTime && !slots.includes(localSelectedTime)) {
          setLocalSelectedTime("");
          onChange("");
        }
      } catch (err) {
        const apiErr = err as ApiError;

        console.error("Error fetching slots:", apiErr);

        setAvailableSlots([]);
        setLocalSelectedTime("");
        setError(
          apiErr?.response?.data?.message ||
            apiErr.message ||
            "Unable to load available times"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, serviceId, date, duration, isDayValid]);

  const handleSelectTime = (time: string) => {
    setLocalSelectedTime(time);
    onChange(time);
  };

  const handleClearTime = () => {
    setLocalSelectedTime("");
    onChange("");
  };

  if (!date) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-500">
        Please select a date first
      </div>
    );
  }

  if (!isDayValid) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-bold text-amber-700">
        This day is closed
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4 text-sm font-bold text-violet-700">
        Loading available times...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-bold text-red-700">
        {error}
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-500">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localSelectedTime ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
              Selected time
            </p>
            <p className="mt-1 text-lg font-black text-emerald-800">
              {localSelectedTime}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearTime}
            className="rounded-xl bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-100"
          >
            Change time
          </button>
        </div>
      ) : (
        <div>
          <select
            value={localSelectedTime}
            onChange={(event) => handleSelectTime(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Select a time</option>

            {availableSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {availableSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleSelectTime(time)}
                className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-black text-violet-700 transition hover:border-violet-300 hover:bg-violet-600 hover:text-white"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}