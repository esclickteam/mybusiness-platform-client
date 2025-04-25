// src/components/BusinessProfileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/BusinessProfilePage.css'; // משמש גם לעיצוב הכרטיס

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
    <Link to={`/business/${_id}`} className="business-card-link">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {logo && (
            <img
              src={logo}
              alt={name}
              className="business-profile__logo"
            />
          )}

          <h1 className="business-profile__name">{name}</h1>

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
                  <img
                    key={idx}
                    src={url}
                    alt={`${name} תמונה ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BusinessProfileCard;
