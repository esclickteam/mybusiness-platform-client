import React, { useState } from 'react';
import './ServiceList.css';

const ServiceList = ({ services, setServices, handleDelete }) => {
  const [newService, setNewService] = useState({
    name: '',
    hours: '0',
    minutes: '30',
    price: '',
    description: '',
    image: null,
    imagePreview: '',
    appointmentType: 'at_business'
  });

  const handleAddService = () => {
    const duration = parseInt(newService.hours) * 60 + parseInt(newService.minutes);
    if (!newService.name || duration === 0) return;

    const serviceToAdd = {
      ...newService,
      duration,
    };

    const updated = [...services, serviceToAdd];
    setServices(updated);

    // ✅ שמירה גם לצד היומן
    localStorage.setItem("demoServices_calendar", JSON.stringify(updated));

    setNewService({
      name: '',
      hours: '0',
      minutes: '30',
      price: '',
      description: '',
      image: null,
      imagePreview: '',
      appointmentType: 'at_business'
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewService({
        ...newService,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, '0')} שעות`;
  };

  return (
    <div className="service-list">
      <h3 className="section-title">הוספת שירות</h3>

      {/* סוג שירות */}
      <label>סוג השירות:</label>
      <div className="appointment-type-selector">
        <button
          type="button"
          className={newService.appointmentType === 'at_business' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'at_business' })}
        >
          🏢 תיאום תור בעסק
        </button>
        <button
          type="button"
          className={newService.appointmentType === 'on_site' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'on_site' })}
        >
          🚗 שירות עד הבית
        </button>
      </div>

      <label>שם השירות:</label>
      <input
        placeholder="לדוגמה: טיפול פנים"
        value={newService.name}
        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
      />

      <label>משך השירות:</label>
      <div className="time-row">
        <select
          value={newService.hours}
          onChange={(e) => setNewService({ ...newService, hours: e.target.value })}
        >
          {[...Array(13).keys()].map(h => <option key={h}>{h}</option>)}
        </select>
        <span>שעות</span>
        <select
          value={newService.minutes}
          onChange={(e) => setNewService({ ...newService, minutes: e.target.value })}
        >
          {['0','15','30','45'].map(m => <option key={m}>{m}</option>)}
        </select>
        <span>דקות</span>
      </div>

      <label>מחיר השירות:</label>
      <input
        type="number"
        placeholder="לדוגמה: 250"
        value={newService.price}
        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
      />

      <label>תיאור השירות (לא חובה):</label>
      <textarea
        placeholder="פירוט על השירות..."
        value={newService.description}
        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
      />

      <label>העלאת תמונה לשירות (לא חובה):</label>
      <input type="file" onChange={handleImageChange} />
      {newService.imagePreview && (
        <img src={newService.imagePreview} alt="תצוגה" className="preview-img" />
      )}

      <button onClick={handleAddService}>➕ הוספת שירות</button>

      <hr />

      <h3>השירותים שהוגדרו:</h3>
      <div className="services-grid">
        {services.map((srv, i) => (
          <div key={i} className="service-card">
            {srv.imagePreview && <img src={srv.imagePreview} alt={srv.name} />}
            <div className="card-content">
              <h4>{srv.name}</h4>
              <p className="description">{srv.description}</p>
              {srv.price && <p className="price">{srv.price} ₪</p>}
              <span>{formatDuration(srv.duration)}</span>
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                סוג: {srv.appointmentType === 'on_site' ? 'שירות עד הבית' : 'תיאום בעסק'}
              </p>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(i)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
