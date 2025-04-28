// src/pages/business/dashboardPages/build/buildTabs/MainTab.jsx
import React, { useRef } from "react";
import '../build/Build.css';
import "./MainTab.css";

const MainTab = ({ businessDetails, setBusinessDetails }) => {
  const inputRef = useRef(null);

  // מייצר URL לתצוגה מקומית של ה־File או מחזיר URL קיים
  const getImageUrl = (item) => {
    if (!item) return "";
    if (item instanceof File) return URL.createObjectURL(item);
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  // placeholder “פלוס” כשאין תמונה
  const renderPlaceholder = () => (
    <div
      className="gallery-item-wrapper placeholder"
      onClick={() => inputRef.current.click()}
    >
      <div className="gallery-item plus-icon">+</div>
    </div>
  );

  // שמירת הקובץ ב־state
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusinessDetails((prev) => ({
      ...prev,
      mainImages: [file],
    }));
  };

  return (
    <>
      {/* תיאור וטלפון */}
      <div className="maintab-details" style={{ textAlign: "right", padding: "0 1rem" }}>
        {businessDetails.description && (
          <p className="maintab-description">
            {businessDetails.description}
          </p>
        )}
        {businessDetails.phone && (
          <p className="maintab-phone">
            📞 {businessDetails.phone}
          </p>
        )}
      </div>

      {/* הקלט המוסתר */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileChange}
      />

      {/* תצוגת הפלוס או התמונה */}
      <div className="gallery-preview no-actions">
        {(!businessDetails.mainImages || businessDetails.mainImages.length === 0)
          ? renderPlaceholder()
          : businessDetails.mainImages.map((file, i) => (
              <div key={i} className="gallery-item-wrapper">
                <div className="gallery-item">
                  <img
                    src={getImageUrl(file) || "/images/placeholder.jpg"}
                    alt={`main-${i}`}
                    className="gallery-img"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))
        }
      </div>

      {/* ביקורות (לא השתנה) */}
      {businessDetails.reviews?.length > 0 && (
        <div className="reviews">
          <h3>⭐ ביקורות אחרונות</h3>
          {businessDetails.reviews.slice(0, 2).map((r, i) => (
            <div key={i} className="review-card improved">
              <div className="review-header">
                <span className="review-user">{r.user}</span>
                <span className="star-text">★ {r.rating} / 5</span>
              </div>
              <p className="review-text">{r.comment || r.text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MainTab;
