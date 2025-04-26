import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "@api";
import "./BusinessProfileView.css";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות ותשובות",
  "צ'אט עם העסק",
  "חנות / יומן",
];

export default function BusinessProfileView() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");

  // נתונים ל-צ'אט
  const [chatMessage, setChatMessage] = useState("");
  const [chatName, setChatName] = useState("");

  // fetch בכל שינוי של businessId או currentTab
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await API.get(`/business/${businessId}`);
        const data = res.data.business || res.data;
        setProfileData(data);
      } catch (err) {
        console.error("Error loading business:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [businessId, currentTab]);

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !chatName.trim()) {
      alert("נא למלא את כל השדות");
      return;
    }

    try {
      await API.post(`/business/${businessId}/chat`, {
        name: chatName,
        text: chatMessage,
      });
      alert("✅ ההודעה נשלחה!");
      setChatMessage("");
      setChatName("");
      // לאחר שליחת ההודעה, ייתכן שנרצה לרענן הצגת צ'אט
      setCurrentTab("צ'אט עם העסק");
    } catch (err) {
      console.error("❌ שגיאה בשליחת ההודעה:", err);
      alert("❌ שגיאה בשליחה");
    }
  };

  if (loading) return <div>טוען…</div>;
  if (!profileData) return <div>העסק לא נמצא</div>;

  const {
    name,
    description = "",
    phone = "",
    gallery = [],
    reviews = [],
    faqs = [],
  } = profileData;

  const realReviews = reviews.filter(r => typeof r.rating === "number");

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {/* כפתור עריכה בדשבורד */}
          <Link
            to={`/business/${businessId}/dashboard/edit`}
            className="edit-profile-btn"
          >
            ✏️ ערוך עמוד עסקי
          </Link>

          <h1 className="business-name">{name}</h1>

          {currentTab === "ראשי" && (
            <>
              {description && (
                <div className="about-section">
                  <p className="about-snippet">
                    {description.length > 200
                      ? description.slice(0, 200) + "..."
                      : description}
                  </p>
                </div>
              )}
              {phone && (
                <div className="phone-section">
                  <strong>טלפון:</strong> {phone}
                </div>
              )}
            </>
          )}

          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${currentTab === tab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {currentTab === "גלריה" && gallery.length > 0 && (
            <div className="gallery-preview no-actions">
              {gallery.map((item, i) => {
                const src = typeof item === "string" ? item : item.url || item.preview;
                return (
                  src && (
                    <div key={i} className="gallery-item-wrapper">
                      <img
                        src={src}
                        alt={`gallery-${i}`}
                        className="gallery-img"
                      />
                    </div>
                  )
                );
              })}
            </div>
          )}

          {currentTab === "ביקורות" && realReviews.length > 0 && (
            <div className="reviews">
              <h3>⭐ ביקורות אחרונות</h3>
              {realReviews.map((r, i) => (
                <div key={i} className="review-card improved">
                  <div className="review-header">
                    <strong className="review-user">{r.user}</strong>
                    <span className="star-text">★ {r.rating} / 5</span>
                  </div>
                  <p className="review-text">
                    {r.comment || r.text || "אין תוכן לביקורת."}
                  </p>
                </div>
              ))}
            </div>
          )}

          {currentTab === "שאלות ותשובות" && faqs.length > 0 && (
            <div className="faqs">
              <h3>❓ שאלות ותשובות</h3>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
          )}

          {currentTab === "צ'אט עם העסק" && (
            <div className="chat-tab">
              <h3>💬 שלח הודעה לעסק</h3>
              <textarea
                placeholder="כתוב הודעה..."
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                rows={4}
              />
              <input
                type="text"
                placeholder="השם שלך"
                value={chatName}
                onChange={e => setChatName(e.target.value)}
              />
              <button onClick={sendChatMessage}>שלח</button>
            </div>
          )}

          {currentTab === "חנות / יומן" && (
            <div className="shop-tab-placeholder">
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
