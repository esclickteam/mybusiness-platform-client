import React, { useState } from 'react';
import API from '@api'; // ודא ש־API.baseURL = '/api/business'
import './ServiceList.css';

const ServiceList = ({
  services,
  setServices,
  handleDelete = () => {},
  onNext = () => {}
}) => {
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
  const [loading, setLoading] = useState(false);

  const handleAddService = async () => {
    const duration = parseInt(newService.hours, 10) * 60 + parseInt(newService.minutes, 10);
    if (!newService.name || duration === 0) return;

    setLoading(true);

    const serviceToAdd = {
      name: newService.name,
      duration,
      price: newService.price,
      description: newService.description,
      appointmentType: newService.appointmentType
    };

    try {
      // שולח אל POST /api/business/my/services
       const res = await API.post('/business/my/services', serviceToAdd);
      // מצפה לקבל { success: true, services: [...] }
      setServices(res.data.services || []);
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
    } catch (err) {
      // fallback לדמו
      const updated = [...services, { ...serviceToAdd, ...newService }];
      setServices(updated);
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
    } finally {
      setLoading(false);
    }
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
          {[...Array(13).keys()].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span>שעות</span>
        <select
          value={newService.minutes}
          onChange={(e) => setNewService({ ...newService, minutes: e.target.value })}
        >
          {['0', '15', '30', '45'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
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

      <button onClick={handleAddService} disabled={loading}>
        {loading ? "שומר..." : "➕ הוספת שירות"}
      </button>

      <hr />

      <h3>השירותים שהוגדרו:</h3>
      <div className="services-grid">
        {services.map((srv, i) => (
          <div key={srv._id || i} className="service-card">
            {srv.imagePreview && <img src={srv.imagePreview} alt={srv.name} />}
            <div className="card-content">
              <h4>{srv.name}</h4>
              <p className="description">{srv.description}</p>
              {srv.price && <p className="price">{srv.price} ₪</p>}
              <span>{formatDuration(srv.duration)}</span>
              <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
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
