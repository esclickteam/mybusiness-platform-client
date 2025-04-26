import React, { useEffect, useState } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import API from '@api';
import './BusinessProfilePage.css';
import PublicBusinessTabs from '../components/PublicBusinessTabs';

const BusinessProfilePage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const { data } = await API.get(`/business/${businessId}`);
        setBusinessData(data);
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  if (!businessData) return <div>טוען...</div>;

  const {
    name,
    description,
    phone,
    email,
    logo,
    address,
    gallery,
    openingHours
  } = businessData;

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        {/* כפתור חזרה */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← חזור
        </button>

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

        {/* רצועת טאבים ציבורית */}
        <PublicBusinessTabs />

        {/* כאן נטען תוכן הטאב שנבחר */}
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;