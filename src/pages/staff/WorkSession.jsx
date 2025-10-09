import React, { useState, useEffect } from "react";
import "./WorkSession.css";

function WorkSession() {
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

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
    setStartTime(new Date());
    setTimer(0);
    setBreaks([]);
  };

  const endSession = () => {
    setIsWorking(false);
    setIsOnBreak(false);
    clearInterval(intervalId);
    alert("✔️ משמרת הסתיימה. משך כולל: " + formatTime(timer));
  };

  const toggleBreak = () => {
    if (!isOnBreak) {
      setBreaks((prev) => [...prev, { start: new Date(), end: null }]);
      setIsOnBreak(true);
    } else {
      setBreaks((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].end = new Date();
        return updated;
      });
      setIsOnBreak(false);
    }
  };

  return (
    <div className="work-session">
      <h1>🕒 ניהול משמרת</h1>

      {!isWorking ? (
        <button onClick={startSession} className="session-button">▶️ התחל משמרת</button>
      ) : (
        <>
          <p>⏳ זמן עבודה: <strong>{formatTime(timer)}</strong></p>

          <button onClick={toggleBreak} className="session-button">
            {isOnBreak ? "🔙 חזרה מהפסקה" : "☕ צא להפסקה"}
          </button>

          <button onClick={endSession} className="session-button end">🔚 סיים משמרת</button>

          <div className="breaks-list">
            <h4>הפסקות:</h4>
            <ul>
              {breaks.map((brk, idx) => (
                <li key={idx}>
                  {brk.start.toLocaleTimeString()} - {brk.end ? brk.end.toLocaleTimeString() : "בהפסקה..."}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkSession;
