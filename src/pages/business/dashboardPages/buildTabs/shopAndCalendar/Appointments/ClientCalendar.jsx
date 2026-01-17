import React, { useState, useEffect } from "react";
import API from "../../../../../../api";
import "./ClientCalendar.css";
import MonthCalendar from "../../../../../../components/MonthCalendar";
import { useAuth } from "../../../../../../context/AuthContext";

export default function ClientCalendar({
  workHours = [],
  selectedService,
  onBackToList,
  businessId,
}) {
  const { socket, token } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mode, setMode] = useState("slots");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selectedDate]);

  const dayIdx = selectedDate.getDay();
  const config = workHours[dayIdx];
  const isClosedDay = !config || !config.start || !config.end;


  const serviceDuration = selectedService?.duration || 30;

  const loadBookedSlots = () => {
    if (!businessId) {
      console.warn("loadBookedSlots: No businessId provided");
      return;
    }
    const dateStr = selectedDate.toLocaleDateString("en-CA");

    setLoadingSlots(true);
    console.log(`Loading booked slots for businessId=${businessId}, date=${dateStr}`);

    API.get("/appointments/by-date", {
      params: { businessId, date: dateStr },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("API response status:", res.status);
        console.log("Booked slots from API:", res.data);
        setBookedSlots(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching booked slots:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
        setError("Error loading availability.");
      })
      .finally(() => {
        console.log("Finished loading booked slots");
        setLoadingSlots(false);
      });
  };

  useEffect(() => {
    console.log("useEffect triggered: loadBookedSlots");
    console.log("Current businessId:", businessId);
    console.log("SelectedDate:", selectedDate);
    loadBookedSlots();
  }, [selectedDate, businessId]);

  useEffect(() => {
    if (!socket) return;

    const fetchAndSetBookedSlots = () => {
      loadBookedSlots();
    };

    const onAppointmentCreated = (appt) => {
      if (appt.business !== businessId) return;
      const apptDateStr = appt.date?.slice(0, 10);
      const selectedDateStr = selectedDate?.toISOString().slice(0, 10);
      if (apptDateStr === selectedDateStr) {
        fetchAndSetBookedSlots();
      }
    };

    const onAppointmentDeleted = ({ id }) => {
      fetchAndSetBookedSlots();
    };

    const onAppointmentUpdated = (appt) => {
      if (appt.business !== businessId) return;
      const apptDateStr = appt.date?.slice(0, 10);
      const selectedDateStr = selectedDate?.toISOString().slice(0, 10);
      if (apptDateStr === selectedDateStr) {
        fetchAndSetBookedSlots();
      }
    };

    socket.on("appointmentCreated", onAppointmentCreated);
    socket.on("appointmentDeleted", onAppointmentDeleted);
    socket.on("appointmentUpdated", onAppointmentUpdated);

    return () => {
      socket.off("appointmentCreated", onAppointmentCreated);
      socket.off("appointmentDeleted", onAppointmentDeleted);
      socket.off("appointmentUpdated", onAppointmentUpdated);
    };
  }, [socket, businessId, selectedDate]);

  useEffect(() => {
    setSelectedSlot(null);
    setMode("slots");
    setBookingSuccess(false);
  }, [selectedDate, config]);

  const generateTimeSlots = (startTime, endTime, breaks = "") => {
    const toMin = (t) => {
      const [h, m = "00"] = t.trim().split(":");
      return +h * 60 + +m;
    };
    const fromMin = (m) => {
      const h = Math.floor(m / 60),
        mm = m % 60;
      return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
    };

    const start = toMin(startTime),
      end = toMin(endTime);
    const breaksArr = breaks
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((b) => {
        const [f, t] = b.replace(/\s/g, "").split("-");
        return f && t ? [toMin(f), toMin(t)] : null;
      })
      .filter(Boolean);

    const slots = [];
    for (let t = start; t + serviceDuration <= end; t += serviceDuration) {
      const inBreak = breaksArr.some(([f, to]) => t < to && t + serviceDuration > f);
      if (!inBreak) slots.push(fromMin(t));
    }
    return slots;
  };

  useEffect(() => {
    if (config?.start && config?.end) {
      const allSlots = generateTimeSlots(config.start, config.end, config.breaks);

      const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const occupiedSlots = new Set();

      bookedSlots.forEach(({ time, duration }) => {
        const startMin = toMinutes(time);
        const dur = duration || serviceDuration;
        for (let i = 0; i < dur; i += serviceDuration) {
          const slotMin = startMin + i;
          const hh = String(Math.floor(slotMin / 60)).padStart(2, "0");
          const mm = String(slotMin % 60).padStart(2, "0");
          occupiedSlots.add(`${hh}:${mm}`);
        }
      });

      console.log("Occupied slots:", Array.from(occupiedSlots));

      const freeSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

      console.log("Free slots:", freeSlots);

      setAvailableSlots(freeSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [config, bookedSlots]);

  const handleSelectSlot = (time) => {
    setSelectedSlot({
      time,
      date: selectedDate.toLocaleDateString("en-CA"),
      rawDate: selectedDate,
      duration: selectedService.duration,
      price: selectedService.price,
      name: selectedService.name,
      serviceId: selectedService._id,
    });
    setMode("summary");
  };

  const handleSubmitBooking = async () => {
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim()) {
      alert("Please fill in all required details.");
      return;
    }
    if (!selectedSlot) {
      alert("No time slot selected.");
      return;
    }
    if (!businessId) {
      alert("Missing business ID. Please refresh the page and try again.");
      return;
    }

    try {
      await API.post(
        "/appointments",
        {
          businessId,
          serviceId: selectedSlot.serviceId,
          date: selectedSlot.date,
          time: selectedSlot.time,
          name: clientName,
          phone: clientPhone,
          address: clientAddress,
          note: clientNote,
          email: clientEmail,
          price: selectedSlot.price,
          duration: selectedSlot.duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedSlot(null);
      setBookingSuccess(true);
    } catch (err) {
      alert("Error submitting booking: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="client-calendar-wrapper">
      {mode === "slots" && (
        <>
          <h3>📅 Choose a date to see available times</h3>
          {selectedService && (
            <div className="month-overview">
              <div className="calendar-nav">
                <button
                  onClick={() => {
                    if (month === 0) {
                      setMonth(11);
                      setYear((y) => y - 1);
                    } else {
                      setMonth((m) => m - 1);
                    }
                  }}
                  className="month-nav-btn"
                  type="button"
                >
                  ← Previous Month
                </button>
                <button
                  onClick={() => {
                    if (month === 11) {
                      setMonth(0);
                      setYear((y) => y + 1);
                    } else {
                      setMonth((m) => m + 1);
                    }
                  }}
                  className="month-nav-btn"
                  type="button"
                >
                  Next Month →
                </button>
              </div>
              <MonthCalendar
                year={year}
                month={month}
                selectedDate={selectedDate}
                onDateClick={(date) => {
                  setSelectedDate(date);
                }}
              />
            </div>
          )}

          <div className="selected-date-info">
  <h4>📆 {selectedDate.toLocaleDateString("en-GB")}</h4>

  {loadingSlots && (
    <div className="info-box muted">
      ⏳ Checking availability…
    </div>
  )}

  {!loadingSlots && error && (
    <div className="info-box error">
      ⚠️ Unable to load availability. Please try again.
    </div>
  )}

  {!loadingSlots && !error && isClosedDay && (
    <div className="info-box closed">
      🔒 This business is closed on this day  
      <br />
      <span>Please choose another date</span>
    </div>
  )}

  {!loadingSlots && !error && !isClosedDay && (
    <>
      <p className="hours">
        🕓 Working Hours: {config.start} – {config.end}
      </p>

      {config.breaks && (
        <p className="breaks">⏸️ Breaks: {config.breaks}</p>
      )}

      {availableSlots.length > 0 ? (
        <>
          <h5>🕒 Available Slots</h5>
          <div className="slot-list">
            {availableSlots.map((t) => (
              <button
                key={t}
                className="slot-btn"
                onClick={() => handleSelectSlot(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="info-box full">
          ⏳ All slots are booked for this day  
          <br />
          <span>Try another date</span>
        </div>
      )}
    </>
  )}
</div>


        </>
      )}

      {mode === "summary" && selectedSlot && (
        <div className="summary-box">
          {!bookingSuccess ? (
            <>

              <div className="booking-summary-card">
  <h4 className="summary-title">Booking Summary</h4>

  <ul className="summary-list">
    <li><span>Service</span><strong>{selectedSlot.name}</strong></li>
    <li><span>Date</span><strong>{selectedSlot.date}</strong></li>
    <li><span>Time</span><strong>{selectedSlot.time}</strong></li>
    <li>
      <span>Duration</span>
      <strong>
        {Math.floor(selectedSlot.duration / 60)}h{" "}
        {selectedSlot.duration % 60}m
      </strong>
    </li>
    <li className="price">
      <span>Price</span>
      <strong>${selectedSlot.price}</strong>
    </li>
  </ul>
</div>


              <div className="booking-form-card">
  <div className="booking-form">
    <label>Full Name:</label>
    <input
      value={clientName}
      onChange={(e) => setClientName(e.target.value)}
      placeholder="Enter full name"
    />

    <label>Phone:</label>
    <input
      value={clientPhone}
      onChange={(e) => setClientPhone(e.target.value)}
      placeholder="Enter phone number"
    />

    <label>Address:</label>
    <input
      value={clientAddress}
      onChange={(e) => setClientAddress(e.target.value)}
      placeholder="Enter address"
    />

   
    <label>Note (optional):</label>
    <textarea
      value={clientNote}
      onChange={(e) => setClientNote(e.target.value)}
      placeholder="Additional note"
    />
  </div>
</div>


              <button className="confirm-slot-btn" onClick={handleSubmitBooking}>
                📅 Confirm Booking
              </button>
              <button className="back-button" onClick={() => setMode("slots")}>
                🔙 Back to Time Slots
              </button>
            </>
          ) : (
            <div>
              <h4 className="success-message">🎉 Booking Submitted Successfully!</h4>
              <p>
  {clientEmail
    ? "A confirmation email has been sent to your email address."
    : "Your booking is confirmed."}
</p>

              <button className="back-button" onClick={onBackToList}>
                🔙 Back to List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
