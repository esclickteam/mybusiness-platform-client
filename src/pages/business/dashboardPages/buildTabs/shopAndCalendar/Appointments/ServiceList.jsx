import React, { useState, useEffect } from 'react';
import API from '@api'; // ודא ש־API.baseURL = '/api'
import './ServiceList.css';

const ServiceList = ({
  services,
  setServices,
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

  const formatDuration = minutes => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, '0')} שעות`;
  };

  const handleAddService = async () => {
    const duration =
      parseInt(newService.hours, 10) * 60 +
      parseInt(newService.minutes, 10);
    if (!newService.name || duration === 0) return;

    setLoading(true);
    try {
      let res;
      if (newService.image) {
        const formData = new FormData();
        formData.append('name', newService.name);
        formData.append('duration', duration);
        formData.append('price', newService.price);
        formData.append('description', newService.description);
        formData.append('appointmentType', newService.appointmentType);
        formData.append('image', newService.image);

        res = await API.post(
          '/business/my/services',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        res = await API.post('/business/my/services', {
          name: newService.name,
          duration,
          price: newService.price,
          description: newService.description,
          appointmentType: newService.appointmentType
        });
      }

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
      console.error('Error adding service:', err);
      alert('שגיאה בהוספת שירות');
    } finally {
      setLoading(false);
    }
  };

  // פונקציה למחיקת שירות לפי ID
  const handleDelete = async (serviceId) => {
    if (!window.confirm('למחוק את השירות?')) return;

    try {
      await API.delete(`/business/my/services/${serviceId}`);
      // אחרי מחיקה, טען שוב את רשימת השירותים מהשרת
      const res = await API.get('/business/my/services');
      setServices(res.data.services || []);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('שגיאה במחיקת שירות');
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setNewService({
        ...newService,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
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
        onChange={e => setNewService({ ...newService, name: e.target.value })}
      />

      <label>משך השירות:</label>
      <div className="time-row">
        <select
          value={newService.hours}
          onChange={e => setNewService({ ...newService, hours: e.target.value })}
        >
          {[...Array(13).keys()].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span>שעות</span>
        <select
          value={newService.minutes}
          onChange={e => setNewService({ ...newService, minutes: e.target.value })}
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
        onChange={e => setNewService({ ...newService, price: e.target.value })}
      />

      <label>תיאור השירות (לא חובה):</label>
      <textarea
        placeholder="פירוט על השירות..."
        value={newService.description}
        onChange={e => setNewService({ ...newService, description: e.target.value })}
      />

      <label>העלאת תמונה לשירות (לא חובה):</label>
      <input type="file" onChange={handleImageChange} />
      {newService.imagePreview && (
        <img src={newService.imagePreview} alt="תצוגה" className="preview-img" />
      )}

      <button
        type="button"
        onClick={handleAddService}
        disabled={loading}
      >
        {loading ? 'שומר...' : '➕ הוספת שירות'}
      </button>

      <hr />

      <h3>השירותים שהוגדרו:</h3>
      <div className="services-grid">
        {services.map((srv, i) => (
          <div key={srv._id || i} className="service-card">
            {srv.imageUrl && (
              <img src={srv.imageUrl} alt={srv.name} className="card-img" />
            )}
            <div className="card-content">
              <h4>{srv.name}</h4>
              {srv.description && <p className="description">{srv.description}</p>}
              {srv.price && <p className="price">{srv.price} ₪</p>}
              <span>{formatDuration(srv.duration)}</span>
              <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                סוג: {srv.appointmentType === 'on_site' ? 'שירות עד הבית' : 'תיאום בעסק'}
              </p>
            </div>
            <button
              type="button"
              className="delete-btn"
              onClick={() => handleDelete(srv._id)} // <-- מחיקת שירות לפי ID
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
