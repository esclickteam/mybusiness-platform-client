// src/pages/ProfileEdit.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BusinessList.css'; // to maintain consistent styling

export default function ProfileEdit() {
  const { t } = useTranslation();
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // here you can send to the server / update the profile
    console.log({ name, email, phone, city });
    alert(t('leftover.profileEdit.savedOk'));
  };

  return (
    <div className="profile-page">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>{t('leftover.profileEdit.title')}</h2>

        <label htmlFor="name-input">{t('leftover.profileEdit.businessName')}</label>
        <input
          id="name-input"
          type="text"
          className="filter-input"
          placeholder={t('leftover.profileEdit.businessNamePh')}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label htmlFor="email-input">{t('leftover.profileEdit.email')}</label>
        <input
          id="email-input"
          type="email"
          className="filter-input"
          placeholder={t('leftover.profileEdit.emailPh')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="phone-input">{t('leftover.profileEdit.phone')}</label>
        <input
          id="phone-input"
          type="tel"
          className="filter-input"
          placeholder={t('leftover.profileEdit.phonePh')}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <label htmlFor="city-input">
          {t('leftover.profileEdit.city')} <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="city-input"
          type="text"
          className="filter-input"
          placeholder={t('leftover.profileEdit.cityPh')}
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">
          {t('leftover.profileEdit.save')}
        </button>
      </form>
    </div>
  );
}
