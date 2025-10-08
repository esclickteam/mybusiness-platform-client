import React, { useState, useEffect } from "react";
import "./StaffTopBar.css";
import { useNavigate } from "react-router-dom";

function StaffTopBar() {
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [searchPhone, setSearchPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isWorking && !isOnBreak) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isWorking, isOnBreak]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const startSession = () => {
    setIsWorking(true);
    setTimer(0);
  };

  const stopSession = () => {
    setIsWorking(false);
    setIsOnBreak(false);
    clearInterval(intervalId);
  };

  const toggleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  const handleSearch = () => {
    if (searchPhone.trim()) {
      navigate(`/staff/profile?phone=${encodeURIComponent(searchPhone)}`);
    }
  };

  return (
    <div className="staff-top-bar">
      <div className="left-section">
        <span>⏱ זמן משמרת: <strong>{formatTime(timer)}</strong></span>
        <span className={isOnBreak ? "break-status" : "active-status"}>
          {isOnBreak ? "בהפסקה" : isWorking ? "פעיל" : "לא פעיל"}
        </span>
      </div>

      <div className="middle-section">
        <input
          type="text"
          placeholder="🔎 חפש מספר טלפון..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={handleSearch}>חפש</button>
      </div>

      <div className="right-section">
        {!isWorking ? (
          <button onClick={startSession}>▶️ התחלת משמרת</button>
        ) : (
          <>
            <button onClick={toggleBreak}>
              {isOnBreak ? "🔙 חזרה מהפסקה" : "☕ הפסקה"}
            </button>
            <button onClick={stopSession}>🔚 סיום</button>
          </>
        )}
        <button onClick={() => alert("📞 פונקציית חיוג תתווסף בקרוב")}>📞 חיוג</button>
      </div>
    </div>
  );
}

export default StaffTopBar;
