import React, { useState, useEffect } from 'react';
import API from '@api'; // Make sure API.baseURL = '/api'
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
    return `${h}:${m.toString().padStart(2, '0')} hours`;
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
      alert('Error adding service');
    } finally {
      setLoading(false);
    }
  };

  // Delete service by ID
  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;

    try {
      await API.delete(`/business/my/services/${serviceId}`);
      // Reload the updated list after deletion
      const res = await API.get('/business/my/services');
      setServices(res.data.services || []);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Error deleting service');
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
      <h3 className="section-title">Add a Service</h3>

      <label>Service Type:</label>
      <div className="appointment-type-selector">
        <button
          type="button"
          className={newService.appointmentType === 'at_business' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'at_business' })}
        >
          🏢 Appointment at Business
        </button>
        <button
          type="button"
          className={newService.appointmentType === 'on_site' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'on_site' })}
        >
          🚗 On-Site Service
        </button>
      </div>

      <label>Service Name:</label>
      <input
        placeholder="e.g., Facial Treatment"
        value={newService.name}
        onChange={e => setNewService({ ...newService, name: e.target.value })}
      />

      <label>Service Duration:</label>
      <div className="time-row">
        <select
          value={newService.hours}
          onChange={e => setNewService({ ...newService, hours: e.target.value })}
        >
          {[...Array(13).keys()].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span>hours</span>
        <select
          value={newService.minutes}
          onChange={e => setNewService({ ...newService, minutes: e.target.value })}
        >
          {['0', '15', '30', '45'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <span>minutes</span>
      </div>

      <label>Service Price:</label>
      <input
        type="number"
        placeholder="e.g., 250"
        value={newService.price}
        onChange={e => setNewService({ ...newService, price: e.target.value })}
      />

      <label>Service Description (optional):</label>
      <textarea
        placeholder="Details about the service..."
        value={newService.description}
        onChange={e => setNewService({ ...newService, description: e.target.value })}
      />

      <label>Upload Service Image (optional):</label>
      <input type="file" onChange={handleImageChange} />
      {newService.imagePreview && (
        <img src={newService.imagePreview} alt="Preview" className="preview-img" />
      )}

      <button
        type="button"
        onClick={handleAddService}
        disabled={loading}
      >
        {loading ? 'Saving...' : '➕ Add Service'}
      </button>

      <hr />

      <h3>Defined Services:</h3>
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
                Type: {srv.appointmentType === 'on_site' ? 'On-Site Service' : 'In-Business Appointment'}
              </p>
            </div>
            <button
              type="button"
              className="delete-btn"
              onClick={() => handleDelete(srv._id)} // Delete by ID
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
