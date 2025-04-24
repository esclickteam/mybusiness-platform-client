// src/components/shared/ProfileHeader.jsx
import React from "react";
import "./ProfileHeader.css";

export default function ProfileHeader({ business }) {
  if (!business) return null;

  const { logo, name, about = "", reviews = [] } = business;
  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="profile-header">
      <div className="profile-header__logo">
        <img
          src={logo || "/images/placeholder.jpg"}
          alt="לוגו העסק"
        />
      </div>
      <h1 className="profile-header__name">{name || "שם העסק"}</h1>
      {avg && (
        <div className="profile-header__rating">
          ⭐ {avg} / 5
        </div>
      )}
      {about && (
        <p className="profile-header__about">{about}</p>
      )}
    </div>
  );
}
