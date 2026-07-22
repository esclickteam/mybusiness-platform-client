import React, { useEffect, useMemo, useState } from "react";
import API from "../../../../../../api";
import MonthCalendar from "../../../../../../components/MonthCalendar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type AnyObject = Record<string, any>;

type ClientCalendarProps = {
  workHours?: any[];
  selectedService: any;
  onBackToList?: () => void;
  businessId: string;
};

type AppointmentSlot = {
  _id?: string;
  time?: string;
  duration?: number;
  date?: string;
  business?: string;
  serviceId?: string;
  [key: string]: any;
};

type SelectedSlot = {
  time: string;
  date: string;
  rawDate: Date;
  duration: number;
  price: number;
  name: string;
  serviceId: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function ClientCalendar({
  workHours = [],
  selectedService,
  onBackToList,
  businessId,
}: ClientCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const [mode, setMode] = useState<"slots" | "summary">("slots");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayIdx = selectedDate.getDay();

  const normalizedWorkHours = useMemo<AnyObject[]>(() => {
    if (!Array.isArray(workHours)) return [];

    return workHours
      .filter(Boolean)
      .map((item, index) => ({
        day: item?.day ?? index,
        isOpen: item?.isOpen ?? Boolean(item?.start && item?.end),
        start: item?.start || "",
        end: item?.end || "",
        breaks: item?.breaks || "",
        ...item,
      }));
  }, [workHours]);

  const config = useMemo<AnyObject | null>(() => {
    return (
      normalizedWorkHours.find((item) => Number(item.day) === dayIdx) ||
      normalizedWorkHours[dayIdx] ||
      null
    );
  }, [normalizedWorkHours, dayIdx]);

  const isClosedDay =
    !config ||
    config.isOpen === false ||
    !String(config.start || "").trim() ||
    !String(config.end || "").trim();

  const serviceDuration = Number(selectedService?.duration) || 30;
  const servicePrice = Number(selectedService?.price) || 0;
  const serviceName =
    selectedService?.name || selectedService?.title || "Selected service";

  const dateStr = useMemo(() => {
    return selectedDate.toLocaleDateString("en-CA");
  }, [selectedDate]);

  useEffect(() => {
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selectedDate]);

  useEffect(() => {
    setSelectedSlot(null);
    setMode("slots");
    setBookingSuccess(false);
  }, [selectedDate, selectedService?._id]);

  const normalizeBreaks = (breaks?: string | string[] | null) => {
    if (!breaks) return "";

    if (Array.isArray(breaks)) {
      return breaks.join(",");
    }

    return String(breaks);
  };

  const loadBookedSlots = async () => {
    if (!businessId) {
      setError("Missing business ID.");
      return;
    }

    setLoadingSlots(true);
    setError(null);

    try {
      const res = await API.get("/appointments/by-date", {
        params: {
          businessId,
          date: dateStr,
        },
      });

      setBookedSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookedSlots([]);
      setError("Unable to load availability. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadBookedSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, dateStr]);

  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    breaks?: string | string[] | null
  ) => {
    const toMin = (time: string) => {
      const [hours, minutes = "00"] = time.trim().split(":");
      return Number(hours) * 60 + Number(minutes);
    };

    const fromMin = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
    };

    const start = toMin(startTime);
    const end = toMin(endTime);

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return [];
    }

    const breaksText = normalizeBreaks(breaks);

    const breaksArr = breaksText
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [from, to] = item.replace(/\s/g, "").split("-");
        if (!from || !to) return null;

        const fromMinutes = toMin(from);
        const toMinutes = toMin(to);

        if (Number.isNaN(fromMinutes) || Number.isNaN(toMinutes)) return null;

        return [fromMinutes, toMinutes] as [number, number];
      })
      .filter(Boolean) as [number, number][];

    const slots: string[] = [];

    for (
      let time = start;
      time + serviceDuration <= end;
      time += serviceDuration
    ) {
      const inBreak = breaksArr.some(
        ([from, to]) => time < to && time + serviceDuration > from
      );

      if (!inBreak) {
        slots.push(fromMin(time));
      }
    }

    return slots;
  };

  useEffect(() => {
    if (!config?.start || !config?.end) {
      setAvailableSlots([]);
      return;
    }

    const allSlots = generateTimeSlots(config.start, config.end, config.breaks);

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const occupiedSlots = new Set<string>();

    bookedSlots.forEach((appointment) => {
      if (!appointment.time) return;

      const startMin = toMinutes(appointment.time);
      const duration = Number(appointment.duration) || serviceDuration;

      for (let minutes = 0; minutes < duration; minutes += serviceDuration) {
        const slotMin = startMin + minutes;
        const hours = String(Math.floor(slotMin / 60)).padStart(2, "0");
        const mins = String(slotMin % 60).padStart(2, "0");

        occupiedSlots.add(`${hours}:${mins}`);
      }
    });

    const freeSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));
    setAvailableSlots(freeSlots);
  }, [config, bookedSlots, serviceDuration]);

  const handleSelectSlot = (time: string) => {
    setSelectedSlot({
      time,
      date: dateStr,
      rawDate: selectedDate,
      duration: serviceDuration,
      price: servicePrice,
      name: serviceName,
      serviceId: selectedService?._id,
    });

    setMode("summary");
    setBookingSuccess(false);
  };

  const validateBookingForm = () => {
    if (!clientName.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!clientPhone.trim()) {
      alert("Please enter your phone number.");
      return false;
    }

    if (!clientAddress.trim()) {
      alert("Please enter your address.");
      return false;
    }

    if (!selectedSlot) {
      alert("No time slot selected.");
      return false;
    }

    if (!businessId) {
      alert("Missing business ID. Please refresh the page and try again.");
      return false;
    }

    if (!selectedService?._id) {
      alert("Missing service. Please choose a service again.");
      return false;
    }

    return true;
  };

  const handleSubmitBooking = async () => {
    if (!validateBookingForm() || !selectedSlot) return;

    setSubmittingBooking(true);

    try {
      await API.post("/appointments/public", {
        businessId,
        serviceId: selectedSlot.serviceId,
        date: selectedSlot.date,
        time: selectedSlot.time,

        guestName: clientName.trim(),
        guestPhone: clientPhone.trim(),
        guestEmail: clientEmail.trim(),
        guestAddress: clientAddress.trim(),
        guestNote: clientNote.trim(),

        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim(),
        address: clientAddress.trim(),
        note: clientNote.trim(),

        price: selectedSlot.price,
        duration: selectedSlot.duration,
      });

      setBookingSuccess(true);
      setSelectedSlot(null);

      await loadBookedSlots();
    } catch (err) {
      const apiErr = err as ApiError;

      alert(
        "Error submitting booking: " +
          (apiErr?.response?.data?.message || apiErr.message || "Unknown error")
      );
    } finally {
      setSubmittingBooking(false);
    }
  };

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
      return;
    }

    setMonth((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
      return;
    }

    setMonth((prev) => prev + 1);
  };

  return (
    <div className="w-full rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-6">
      {mode === "slots" && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
              Appointment booking
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-800">
              Choose a date to see available times
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select a service date and choose one of the available appointment
              slots.
            </p>
          </div>

          {selectedService && (
            <div className="rounded-[1.75rem] border border-violet-100 bg-violet-50/40 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
                  type="button"
                >
                  ← Previous Month
                </button>

                <button
                  onClick={goToNextMonth}
                  className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
                  type="button"
                >
                  Next Month →
                </button>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm">
                <MonthCalendar
                  year={year}
                  month={month}
                  selectedDate={selectedDate}
                  onDateClick={(date: Date) => setSelectedDate(date)}
                  onPrevMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                />
              </div>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Selected date
                </p>

                <h4 className="mt-1 text-2xl font-black text-slate-800">
                  {selectedDate.toLocaleDateString("en-GB")}
                </h4>
              </div>

              <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">
                {serviceName}
              </div>
            </div>

            {loadingSlots && (
              <InfoBox
                variant="muted"
                title="Checking availability…"
                text="Please wait while we load available time slots."
              />
            )}

            {!loadingSlots && error && (
              <InfoBox
                variant="error"
                title="Unable to load availability"
                text="Please try again in a few moments."
              />
            )}

            {!loadingSlots && !error && isClosedDay && (
              <InfoBox
                variant="closed"
                title="This business is closed on this day"
                text="Please choose another date."
              />
            )}

            {!loadingSlots && !error && !isClosedDay && config && (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Working hours
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-800">
                      {config.start} – {config.end}
                    </p>
                  </div>

                  {config.breaks && (
                    <div className="rounded-2xl bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-500">
                        Breaks
                      </p>

                      <p className="mt-1 text-sm font-bold text-amber-700">
                        {normalizeBreaks(config.breaks)}
                      </p>
                    </div>
                  )}
                </div>

                {availableSlots.length > 0 ? (
                  <div>
                    <h5 className="mb-3 text-sm font-black text-slate-800">
                      Available Slots
                    </h5>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 hover:text-white"
                          onClick={() => handleSelectSlot(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <InfoBox
                    variant="full"
                    title="All slots are booked for this day"
                    text="Try another date."
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "summary" && selectedSlot && (
        <div className="mx-auto max-w-3xl space-y-5">
          {!bookingSuccess ? (
            <>
              <div className="rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 p-5 text-slate-800 shadow-xl shadow-violet-100">
                <p className="text-sm font-bold text-violet-100">
                  Booking Summary
                </p>

                <h4 className="mt-2 text-2xl font-black">
                  Confirm your appointment
                </h4>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <SummaryItem label="Service" value={selectedSlot.name} />
                  <SummaryItem label="Date" value={selectedSlot.date} />
                  <SummaryItem label="Time" value={selectedSlot.time} />
                  <SummaryItem
                    label="Duration"
                    value={`${Math.floor(selectedSlot.duration / 60)}h ${
                      selectedSlot.duration % 60
                    }m`}
                  />
                  <SummaryItem label="Price" value={`$${selectedSlot.price}`} />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                    Your details
                  </p>

                  <h4 className="mt-1 text-xl font-black text-slate-800">
                    Fill in your contact information
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    No account is required to book this appointment.
                  </p>
                </div>

                <div className="grid gap-4">
                  <FormField label="Full Name" required>
                    <input
                      value={clientName}
                      onChange={(event) => setClientName(event.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>

                  <FormField label="Phone" required>
                    <PhoneInput
                      country="us"
                      enableSearch
                      value={clientPhone}
                      onChange={(phone) => setClientPhone(phone)}
                      inputProps={{
                        required: true,
                      }}
                      containerClass="!w-full"
                      inputClass="!w-full !h-[48px] !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !text-sm !font-semibold !text-slate-900 !outline-none"
                      buttonClass="!rounded-l-2xl !border-slate-200"
                    />
                  </FormField>

                  <FormField label="Email">
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(event) => setClientEmail(event.target.value)}
                      placeholder="Enter email for confirmation"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>

                  <FormField label="Address" required>
                    <input
                      value={clientAddress}
                      onChange={(event) => setClientAddress(event.target.value)}
                      placeholder="Enter address"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>

                  <FormField label="Note">
                    <textarea
                      value={clientNote}
                      onChange={(event) => setClientNote(event.target.value)}
                      placeholder="Additional note"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-5 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSubmitBooking}
                  disabled={submittingBooking}
                >
                  {submittingBooking ? "Submitting…" : "Confirm Booking"}
                </button>

                <button
                  type="button"
                  className="rounded-2xl bg-slate-100 px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                  onClick={() => setMode("slots")}
                  disabled={submittingBooking}
                >
                  Back to Time Slots
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                🎉
              </div>

              <h4 className="text-2xl font-black text-emerald-800">
                Booking Submitted Successfully!
              </h4>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-700">
                {clientEmail
                  ? "A confirmation email has been sent to your email address."
                  : "Your booking is confirmed."}
              </p>

              <button
                type="button"
                className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                onClick={onBackToList}
              >
                Back to List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBox({
  title,
  text,
  variant,
}: {
  title: string;
  text: string;
  variant: "muted" | "error" | "closed" | "full";
}) {
  const styles: Record<string, string> = {
    muted: "border-slate-100 bg-slate-50 text-slate-700",
    error: "border-red-100 bg-red-50 text-red-700",
    closed: "border-amber-100 bg-amber-50 text-amber-700",
    full: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <div className={`mt-6 rounded-2xl border p-5 ${styles[variant]}`}>
      <h5 className="text-sm font-black">{title}</h5>
      <p className="mt-1 text-sm leading-6 opacity-80">{text}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
        {label}
      </p>
      <p className="mt-1 text-base font-black text-white">{value}</p>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}