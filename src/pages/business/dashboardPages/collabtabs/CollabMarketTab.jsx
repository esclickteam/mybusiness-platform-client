import React, { useState, useEffect } from "react";
import API from "../../../../api"; // הנתיב שלך ל-API
import "./CollabMarketTab.css";

export default function CollabMarketTab({ isDevUser }) {
  const [collabMarket, setCollabMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCollabs() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/business/my/proposals/active");  // עדכון הנתיב כאן
        // הנתונים ב-res.data.activeProposals לפי שרת
        if (res.data.activeProposals) {
          // המרה למבנה המותאם לתצוגה
          const collabs = res.data.activeProposals.map(item => ({
            _id: item._id,
            title: item.message.כותרת || item.message.title || "שיתוף פעולה",
            category: item.message.קטגוריה || item.category || "כללי",
            description: item.message.תיאור || item.message.description || "",
            contactName: item.partnerName || "שותף עסקי",
            phone: item.message.טלפון || item.phone || "",
            image: item.message.image || "", // אם יש שדה תמונה
          }));

          setCollabMarket(collabs);
        } else {
          setError("שגיאה בטעינת שיתופי פעולה");
        }
      } catch (err) {
        setError("שגיאה בטעינת שיתופי פעולה");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollabs();
  }, []);

  return (
    <div className="collab-market-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="collab-title">📣 מרקט שיתופים</h3>
      </div>

      {loading && <p>טוען שיתופי פעולה...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && collabMarket.length === 0 && (
        <div>אין שיתופי פעולה להצגה</div>
      )}

      {collabMarket.map((item) => (
        <div key={item._id} className="collab-card">
          {item.image && (
            <img src={item.image} alt={item.title} className="collab-market-image" />
          )}
          <h4>{item.title}</h4>
          <p><strong>קטגוריה:</strong> {item.category}</p>
          <p>{item.description}</p>
          <p><strong>איש קשר:</strong> {item.contactName}</p>
          <p><strong>טלפון:</strong> {item.phone}</p>
          <button
            className="contact-button"
            onClick={() => alert(`פותח צ'אט עם ${item.contactName}`)}
          >
            📩 פנה בצ'אט
          </button>
        </div>
      ))}
    </div>
  );
}
