// src/pages/ProfileEdit.jsx
import React, { useState } from 'react';
import './BusinessList.css'; // לשמירה על עיצוב אחיד

export default function ProfileEdit() {
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן את יכולה לבצע שליחה לשרת / עדכון פרופיל
    console.log({ name, email, phone, city });
    alert('Profile saved successfully ✅');
  };

  return (
    <div className="profile-page">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>Edit Profile</h2>

        <label htmlFor="name-input">Business Name:</label>
        <input
          id="name-input"
          type="text"
          className="filter-input"
          placeholder="Enter business name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label htmlFor="email-input">Email:</label>
        <input
          id="email-input"
          type="email"
          className="filter-input"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="phone-input">Phone:</label>
        <input
          id="phone-input"
          type="tel"
          className="filter-input"
          placeholder="Enter phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <label htmlFor="city-input">
          City: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="city-input"
          type="text"
          className="filter-input"
          placeholder="Enter city (e.g. New York)"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
