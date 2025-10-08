```javascript
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
        <span>⏱ Shift Time: <strong>{formatTime(timer)}</strong></span>
        <span className={isOnBreak ? "break-status" : "active-status"}>
          {isOnBreak ? "On Break" : isWorking ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="middle-section">
        <input
          type="text"
          placeholder="🔎 Search phone number..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="right-section">
        {!isWorking ? (
          <button onClick={startSession}>▶️ Start Shift</button>
        ) : (
          <>
            <button onClick={toggleBreak}>
              {isOnBreak ? "🔙 Return from Break" : "☕ Break"}
            </button>
            <button onClick={stopSession}>🔚 End</button>
          </>
        )}
        <button onClick={() => alert("📞 Dialing function will be added soon")}>📞 Dial</button>
      </div>
    </div>
  );
}

export default StaffTopBar;
```