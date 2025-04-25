// src/components/BusinessProfileCard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../pages/BusinessProfilePage.css'; // משמש גם לעיצוב הכרטיס
import PublicBusinessTabs from './PublicBusinessTabs';

const BusinessProfileCard = ({ business }) => {
  const {
    _id,
    name,
    description,
    phone,
    email,
    logo,
    address,
    openingHours,
    gallery
  } = business;

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {/* כפתור לניווט לפרופיל מלא */}
          <Link to={`/business/${_id}`} className="business-profile__name-link">
            {logo && <img src={logo} alt={name} className="business-profile__logo" />}
            <h1 className="business-profile__name">{name}</h1>
          </Link>

          {description && (
            <p className="business-profile__description">
              <strong>תיאור:</strong> {description}
            </p>
          )}

          <div className="business-profile__contact">
            {phone && <p><strong>טלפון:</strong> {phone}</p>}
            {email && <p><strong>אימייל:</strong> {email}</p>}
          </div>

          {address && (
            <p className="business-profile__address">
              <strong>כתובת:</strong> {address.street}, {address.city}
            </p>
          )}

          {openingHours && (
            <p className="business-profile__hours">
              <strong>שעות פתיחה:</strong> {openingHours}
            </p>
          )}

          {gallery && gallery.length > 0 && (
            <div className="business-profile__gallery">
              <h2>גלריה</h2>
              <div className="gallery-images">
                {gallery.map((url, idx) => (
                  <img key={idx} src={url} alt={`${name} תמונה ${idx + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* רצועת הטאבים הציבוריים */}
        <PublicBusinessTabs />

        {/* Outlet להצגת תוכן הטאב הנבחר */}
        <Outlet />
      </div>
    </div>
  );
};

export default BusinessProfileCard;
