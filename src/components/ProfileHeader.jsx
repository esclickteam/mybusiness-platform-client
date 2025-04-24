// src/components/shared/ProfileHeader.jsx
import React from "react";
import "./ProfileHeader.css";

export default function ProfileHeader({ businessDetails }) {
  if (!businessDetails) return null;

  const { logo, name, reviews = [], category, area } = businessDetails;
  const getImageUrl = (item) =>
    !item ? "" : typeof item === "string" ? item : item.url || item.preview || "";

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="profile-header">
      <div className="profile-header__logo">
        <img
          src={getImageUrl(logo) || "/images/placeholder.jpg"}
          alt="לוגו העסק"
        />
      </div>
      <h1 className="profile-header__name">{name || "שם העסק"}</h1>
      {averageRating && (
        <div className="profile-header__rating">
          <span>⭐</span> <span>{averageRating} / 5</span>
        </div>
      )}
      {(category || area) && (
        <p className="profile-header__meta">
          {category || ""} {area ? `| ${area}` : ""}
        </p>
      )}
    </div>
  );
}
