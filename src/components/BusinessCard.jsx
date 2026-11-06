import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaPhoneAlt, FaTags, FaInfoCircle } from "react-icons/fa";
import { translateBusinessCategory } from "../i18n/businessCategoryLabels";
import "./BusinessCard.css";

export default function BusinessCard({ business = {}, onClick }) {
  const { t } = useTranslation();
  const {
    _id,
    logo = "/images/placeholder.jpg",
    description = "",
    category = "",
    phone = "",
    address = {},
  } = business;
  const businessName = business.businessName || t("common.businessCard.defaultName");
  const { city = "" } = address;
  const navigate = useNavigate();
  const categoryLabel = translateBusinessCategory(category, t);

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
          src={logo || "/images/placeholder.jpg"}
          alt={t("common.businessCard.logoAlt", { name: businessName })}
          loading="lazy"
          className="business-card__img"
        />
      </div>

      <h2 className="business-card__title">{businessName}</h2>

      {category && (
        <p className="business-card__info">
          <FaTags /> <strong>{t("common.businessCard.category")}:</strong> {categoryLabel}
        </p>
      )}

      {description && (
        <p className="business-card__info">
          <FaInfoCircle /> <strong>{t("common.businessCard.description")}:</strong> {description}
        </p>
      )}

      {phone && (
        <p className="business-card__info">
          <FaPhoneAlt /> <strong>{t("common.businessCard.phone")}:</strong> {phone}
        </p>
      )}

      {city && (
        <p className="business-card__info">
          <FaMapMarkerAlt /> <strong>{t("common.businessCard.city")}:</strong> {city}
        </p>
      )}

      <button
        className="business-card__btn"
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        {t("common.businessCard.viewProfile")}
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
    address: PropTypes.shape({ city: PropTypes.string }),
  }),
  onClick: PropTypes.func,
};
