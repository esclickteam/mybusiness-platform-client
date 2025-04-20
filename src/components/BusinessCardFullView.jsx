import React, { useState } from "react";
import "./BusinessCardFullView.css";

const TABS = ["ראשי", "גלריה", "ביקורות", "חנות / יומן", "שאלות ותשובות"];

const BusinessCardFullView = ({ business }) => {
  const [activeTab, setActiveTab] = useState("ראשי");

  if (!business) return <div>לא נמצאו נתונים</div>;

  const {
    name,
    description,
    phone,
    category,
    story,
    logo,
    gallery = [],
    reviews = [],
  } = business;

  return (
    <div className="business-full-card">
      <div className="header">
        {logo && (
          <img
            src={typeof logo === "string" ? logo : logo.url || logo.preview}
            alt="לוגו"
            className="logo"
          />
        )}
        <h2 className="name">{name}</h2>
        <p className="category">קטגוריה: {category || "לא צוין"}</p>
        <p className="phone">📞 {phone || "לא צוין"}</p>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "ראשי" && (
          <>
            <h4>📝 אודות:</h4>
            <p>{description || "לא נכתב טקסט אודות"}</p>
            {story && (
              <>
                <h4>📌 סטורי:</h4>
                <p>{story}</p>
              </>
            )}
          </>
        )}

        {activeTab === "גלריה" && (
          <>
            <h4>🖼️ גלריה</h4>
            {gallery.length > 0 ? (
              <div className="gallery">
                {gallery.map((img, i) => (
                  <img
                    key={i}
                    src={typeof img === "string" ? img : img.url || img.preview}
                    alt={`gallery-${i}`}
                  />
                ))}
              </div>
            ) : (
              <p>לא הועלו תמונות</p>
            )}
          </>
        )}

        {activeTab === "ביקורות" && (
          <>
            <h4>⭐ ביקורות</h4>
            {reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="review">
                  <strong>{r.user}</strong> ★ {r.rating} / 5
                  <p>{r.text}</p>
                </div>
              ))
            ) : (
              <p>עדיין אין ביקורות</p>
            )}
          </>
        )}

        {activeTab === "חנות / יומן" && <p>תצוגת שירותים ויומן (בעתיד)</p>}

        {activeTab === "שאלות ותשובות" && <p>שאלות ותשובות יוצגו כאן</p>}
      </div>
    </div>
  );
};

export default BusinessCardFullView;
