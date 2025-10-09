import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api';

registerLocale('he', he);

export default function AppointmentBooking({ businessId, serviceId }) {
  const [date, setDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slot, setSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  // Reset state when service or business changes
  useEffect(() => {
    setDate(null);
    setAvailableSlots([]);
    setSlot('');
    setError('');
  }, [businessId, serviceId]);

  // Request available appointment slots
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSlot('');
    setError('');

    api.get('/appointments/slots', {
      params: {
        businessId,
        serviceId,
        date: date.toISOString().slice(0,10)
      }
    })
    .then(res => {
      const slots = res.data.slots || [];
      if (slots.length === 0) {
        setError('No available appointments for this date');
      }
      setAvailableSlots(slots);
    })
    .catch(() => {
      setError('Error fetching availability');
    })
    .finally(() => setLoadingSlots(false));
  }, [date, businessId, serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) {
      setError('Please select a date and time');
      return;
    }
    setBooking(true);
    setError('');
    try {
      await api.post('/appointments', {
        businessId,
        serviceId,
        date: date.toISOString().slice(0,10),
        time: slot
      });
      alert('✅ Appointment booked successfully!');
      // Reset after booking
      setDate(null);
      setAvailableSlots([]);
      setSlot('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setBooking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="calendar-setup-container">
      <div className="calendar-container">
        <DatePicker
          locale="he"
          selected={date}
          onChange={setDate}
          inline
          minDate={new Date()}
          placeholderText="Select a date"
          dateFormat="dd.MM.yyyy"
        />
      </div>

      {loadingSlots && <p>Loading available slots…</p>}

      {!loadingSlots && date && availableSlots.length > 0 && (
        <div className="inputs">
          <label>Select time:</label>
          <select
            value={slot}
            onChange={e => {
              setSlot(e.target.value);
              setError('');
            }}
          >
            <option value="">--</option>
            {availableSlots.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      <button
        type="submit"
        disabled={booking || !date || !slot}
        className="save-all-btn styled"
        style={{ marginTop: 16 }}
      >
        {booking ? 'Saving…' : 'Book appointment'}
      </button>
    </form>
  );
}
