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
      agent: "Roni",
      result: "Answered",
      note: "Asked to call back in the evening",
    },
    {
      type: "note",
      date: "2024-02-10",
      agent: "Shahar",
      note: "Sent price quote document",
    },
    {
      type: "rating",
      date: "2024-01-20",
      by: "Dana Levy",
      rating: 4,
      comment: "Service was good but a bit expensive",
    },
  ]);

  const profile = {
    name: "Dana Levy",
    type: "Business Owner",
    businessId: "b123",
    city: "Tel Aviv",
    tags: ["Warm", "Frequent Caller", "Positive Review"],
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newEntry = {
      type: "note",
      date: new Date().toISOString().slice(0, 10),
      agent: "System User",
      note: `${newNote} (via ${channel})`,
    };

    setHistoryItems([newEntry, ...historyItems]);
    setNewNote("");
  };

  return (
    <div className="phone-profile">
      <h1>📱 Profile by Phone: {phone}</h1>

      <div className="profile-details">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Type:</strong> {profile.type}
        </p>
        <p>
          <strong>City:</strong> {profile.city}
        </p>
        <p>
          <strong>Tags:</strong> {profile.tags.join(", ")}
        </p>

        {profile.type === "Business Owner" && profile.businessId && (
          <Link
            to={`/dashboard/business/${profile.businessId}`}
            className="business-edit-link"
          >
            ✏️ Go to Business Page
          </Link>
        )}
      </div>

      <div className="add-note">
        <h4>➕ Add New Note</h4>
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="Phone">Phone</option>
        </select>
        <textarea
          placeholder="Enter a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        <button onClick={handleAddNote}>Save Note</button>
      </div>

      <div className="profile-history">
        <h3>📋 History</h3>
        <ul>
          {historyItems.map((item, i) => (
            <li key={i} className="history-item">
              {item.type === "call" && (
                <>
                  📞 {item.direction === "outgoing" ? "Outgoing Call" : "Incoming Call"} on {item.date} at {item.time} by {item.agent} → {item.result}
                  <br />
                  📝 Note: {item.note}
                </>
              )}
              {item.type === "note" && (
                <>
                  📝 {item.date} by {item.agent} – {item.note}
                </>
              )}
              {item.type === "rating" && (
                <>
                  ⭐ {item.rating}/5 ({item.date}) – "{item.comment}"
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PhoneProfile;
