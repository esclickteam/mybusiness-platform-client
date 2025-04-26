// src/pages/BusinessProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import API from '@api';
import './BusinessProfilePage.css';

const TABS = [
  { path: '', label: 'ראשי' },
  { path: 'gallery', label: 'גלריה' },
  { path: 'reviews', label: 'ביקורות' },
  { path: 'faq', label: 'שאלות ותשובות' },
  { path: 'chat', label: "צ'אט עם העסק" },
  { path: 'shop', label: 'חנות / יומן' },
];

const BusinessProfilePage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusinessData(res.data.business || res.data);
      } catch (err) {
        console.error('Error fetching business data:', err);
      }
    };
    fetchData();
  }, [businessId]);

  if (!businessData) return <div>טוען...</div>;

  const {
    name,
    description,
    category,
    phone,
    email,
    address,
    openingHours,
  } = businessData;

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        {/* כפתור חזור */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← חזור
        </button>

        <div className="profile-inner">
          {businessData.logo && (
            <img
              src={businessData.logo}
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

          {category && (
            <p className="business-profile__category">
              <strong>קטגוריה:</strong> {category}
            </p>
          )}

          <div className="business-profile__contact">
            {phone && <p><strong>טלפון:</strong> {phone}</p>}
            {email && <p><strong>אימייל:</strong> {email}</p>}
            {address && (
              <p><strong>כתובת:</strong> {address.street}, {address.city}</p>
            )}
            {openingHours && (
              <p><strong>שעות פתיחה:</strong> {openingHours}</p>
            )}
          </div>
        </div>

        {/* רצועת טאבים ציבורית ב-3 עמודות */}
        <nav
          className="profile-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap-sm)'
          }}
        >
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ''}
              className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {/* כאן נטען תוכן הטאב */}
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
