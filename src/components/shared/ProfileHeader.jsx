```javascript
import React from "react";
import PropTypes from 'prop-types';
import "./ProfileHeader.css";

const ProfileHeader = ({ businessDetails }) => {
  if (!businessDetails) return null;

  const getImageUrl = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  const { businessName, logo, reviews = [], category, area, about } = businessDetails;

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="profile-header">
      <div className="profile-header__logo">
        <img
          src={getImageUrl(logo) || "/images/placeholder.jpg"}
          alt={businessName ? `${businessName} Logo` : "Business Logo"}
          className="profile-header__img"
        />
      </div>
      <div className="profile-header__info">
        <h1 className="profile-header__name">
          {businessName || "Business Name"}
        </h1>

        {averageRating && (
          <div className="profile-header__rating">
            <span>⭐</span> <span>{averageRating} / 5</span>
          </div>
        )}

        {(category || area) && (
          <p className="profile-header__meta">
            {category || ""}{area && ` | ${area}`}
          </p>
        )}

        {about && (
          <p className="profile-header__about">
            {about.length > 100 ? about.slice(0, 100) + "..." : about}
          </p>
        )}
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  businessDetails: PropTypes.shape({
    businessName: PropTypes.string,
    logo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string, preview: PropTypes.string })
    ]),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({ rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })
    ),
    category: PropTypes.string,
    area: PropTypes.string,
    about: PropTypes.string
  })
};

export default ProfileHeader;
```