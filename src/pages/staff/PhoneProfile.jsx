import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./PhoneProfile.css";

function PhoneProfile() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "0501234567";

  const [newNote, setNewNote] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [historyItems, setHistoryItems] = useState([
    {
      type: "call",
      direction: "outgoing",
      date: "2024-02-12",
      time: "13:50",
      agent: "רוני",
      result: "נענתה",
      note: "ביקשה לחזור בערב"
    },
    {
      type: "note",
      date: "2024-02-10",
      agent: "שחר",
      note: "נשלח מסמך הצעת מחיר"
    },
    {
      type: "rating",
      date: "2024-01-20",
      by: "דנה לוי",
      rating: 4,
      comment: "השירות היה טוב אבל קצת יקר"
    }
  ]);

  const profile = {
    name: "דנה לוי",
    type: "בעל עסק",
    businessId: "b123",
    city: "תל אביב",
    tags: ["חמה", "חוזרת הרבה", "ביקורת טובה"]
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newEntry = {
      type: "note",
      date: new Date().toISOString().slice(0, 10),
      agent: "עובד מערכת",
      note: `${newNote} (דרך ${channel})`
    };

    setHistoryItems([newEntry, ...historyItems]);
    setNewNote("");
  };

  return (
    <div className="phone-profile">
      <h1>📱 פרופיל לפי טלפון: {phone}</h1>

      <div className="profile-details">
        <p><strong>שם:</strong> {profile.name}</p>
        <p><strong>סוג:</strong> {profile.type}</p>
        <p><strong>עיר:</strong> {profile.city}</p>
        <p><strong>תגיות:</strong> {profile.tags.join(", ")}</p>

        {profile.type === "בעל עסק" && profile.businessId && (
          <Link
            to={`/dashboard/business/${profile.businessId}`}
            className="business-edit-link"
          >
            ✏️ מעבר לעמוד העסקי
          </Link>
        )}
      </div>

      <div className="add-note">
        <h4>➕ הוסף תיעוד חדש</h4>
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="WhatsApp">וואטסאפ</option>
          <option value="Facebook">פייסבוק</option>
          <option value="Instagram">אינסטגרם</option>
          <option value="Phone">טלפון</option>
        </select>
        <textarea
          placeholder="הכנס תיעוד..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        <button onClick={handleAddNote}>שמור תיעוד</button>
      </div>

      <div className="profile-history">
        <h3>📋 היסטוריה</h3>
        <ul>
          {historyItems.map((item, i) => (
            <li key={i} className="history-item">
              {item.type === "call" && (
                <>
                  📞 {item.direction === "outgoing" ? "שיחה יוצאת" : "שיחה נכנסת"} בתאריך {item.date} בשעה {item.time} ע"י {item.agent} → {item.result}<br />
                  📝 הערה: {item.note}
                </>
              )}
              {item.type === "note" && (
                <>📝 {item.date} ע"י {item.agent} – {item.note}</>
              )}
              {item.type === "rating" && (
                <>⭐ {item.rating}/5 ({item.date}) – "{item.comment}"</>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PhoneProfile;
