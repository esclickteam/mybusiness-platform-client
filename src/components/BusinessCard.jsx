import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaTags, FaInfoCircle } from "react-icons/fa";
import "./BusinessCard.css";

export default function BusinessCard({ business = {}, onClick }) {
  const {
    _id,
    businessName = "שם העסק",
    logo = "/images/placeholder.jpg",
    description = "",
    category = "",
    phone = "",
    address = {}
  } = business;
  const { city = "" } = address;
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(_id);
    } else {
      navigate(`/business/${_id}`);
    }
  };

  return (
    <div className="business-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="business-card__media">
        <img
          src={logo}
          alt={`${businessName} logo`}
          loading="lazy"
          className="business-card__img"
        />
      </div>

      <h2 className="business-card__title">{businessName}</h2>

      {category && (
        <p className="business-card__info">
          <FaTags /> <strong>קטגוריה:</strong> {category}
        </p>
      )}

      {description && (
        <p className="business-card__info">
          <FaInfoCircle /> <strong>תיאור:</strong> {description}
        </p>
      )}

      {phone && (
        <p className="business-card__info">
          <FaPhoneAlt /> <strong>טלפון:</strong> {phone}
        </p>
      )}

      {city && (
        <p className="business-card__info">
          <FaMapMarkerAlt /> <strong>עיר:</strong> {city}
        </p>
      )}

      <button
        className="business-card__btn"
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        צפה בפרופיל
      </button>
    </div>
  );
}

BusinessCard.propTypes = {
  business: PropTypes.shape({
    _id: PropTypes.string,
    businessName: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({ city: PropTypes.string })
  }),
  onClick: PropTypes.func
};
