import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '@api'; // Make sure API.baseURL = '/api'
import './ServiceList.css';

const ServiceList = ({
  services,
  setServices,
  onNext = () => {}
}) => {
  const { t } = useTranslation();
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
      alert(t('leftover.services.addError'));
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
      alert(t('leftover.services.deleteError'));
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
      <h3 className="section-title">{t('leftover.servicesChrome.addService')}</h3>

      <label>{t('leftover.servicesChrome.serviceType')}</label>
      <div className="appointment-type-selector">
        <button
          type="button"
          className={newService.appointmentType === 'at_business' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'at_business' })}
        >
          🏢 {t('leftover.servicesChrome.atBusiness')}
        </button>
        <button
          type="button"
          className={newService.appointmentType === 'on_site' ? 'active' : ''}
          onClick={() => setNewService({ ...newService, appointmentType: 'on_site' })}
        >
          🚗 {t('leftover.servicesChrome.onSite')}
        </button>
      </div>

      <label>{t('leftover.servicesChrome.serviceName')}</label>
      <input
        placeholder={t('leftover.servicesChrome.serviceNamePh')}
        value={newService.name}
        onChange={e => setNewService({ ...newService, name: e.target.value })}
      />

      <label>{t('leftover.servicesChrome.duration')}</label>
      <div className="time-row">
        <select
          value={newService.hours}
          onChange={e => setNewService({ ...newService, hours: e.target.value })}
        >
          {[...Array(13).keys()].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span>{t('leftover.servicesChrome.hours')}</span>
        <select
          value={newService.minutes}
          onChange={e => setNewService({ ...newService, minutes: e.target.value })}
        >
          {['0', '15', '30', '45'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <span>{t('leftover.servicesChrome.minutes')}</span>
      </div>

      <label>{t('leftover.servicesChrome.price')}</label>
      <input
        type="number"
        placeholder={t('leftover.servicesChrome.pricePh')}
        value={newService.price}
        onChange={e => setNewService({ ...newService, price: e.target.value })}
      />

      <label>{t('leftover.servicesChrome.description')}</label>
      <textarea
        placeholder={t('leftover.servicesChrome.descriptionPh')}
        value={newService.description}
        onChange={e => setNewService({ ...newService, description: e.target.value })}
      />

      <label>{t('leftover.servicesChrome.uploadImage')}</label>
      <input type="file" onChange={handleImageChange} />
      {newService.imagePreview && (
        <img src={newService.imagePreview} alt={t('leftover.servicesChrome.previewAlt')} className="preview-img" />
      )}

      <button
        type="button"
        onClick={handleAddService}
        disabled={loading}
      >
        {loading ? t('leftover.servicesChrome.saving') : `➕ ${t('leftover.servicesChrome.addServiceBtn')}`}
      </button>

      <hr />

      <h3>{t('leftover.servicesChrome.definedServices')}</h3>
      <div className="services-grid">
        {services.map((srv, i) => (
          <div key={srv._id || i} className="service-card">
            {srv.imageUrl && (
              <img src={srv.imageUrl} alt={srv.name} className="card-img" />
            )}
            <div className="card-content">
              <h4>{srv.name}</h4>
              {srv.description && <p className="description">{srv.description}</p>}
              {srv.price && <p className="price">{srv.price} $</p>}
              <span>{formatDuration(srv.duration)}</span>
              <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                {t('leftover.servicesChrome.typeLabel')} {srv.appointmentType === 'on_site' ? t('leftover.servicesChrome.onSite') : t('leftover.servicesChrome.atBusiness')}
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
