import React, { useState, useEffect } from "react";
import "./QuickJobsBoard.css";
import { Link } from "react-router-dom";

function QuickJobsBoard() {
  const [userRole, setUserRole] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // סימולציה למשתמש מסוג לקוח
    const mockUser = {
      name: "דנה",
      role: "client"
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUserRole("client");

    // עבודות מדומות
    setJobs([
      {
        id: 1,
        title: "תיקון דלת",
        description: "דלת כניסה לא נסגרת טוב",
        priceMin: 150,
        priceMax: 250,
        time: "12:00-16:00",
        date: "היום",
        address: "תל אביב"
      },
      {
        id: 2,
        title: "התקנת מדף",
        description: "מדף עץ לקיר גבס",
        priceMin: 100,
        priceMax: 180,
        time: "מחר בבוקר",
        date: "מחר",
        address: "חולון"
      }
    ]);
  }, []);

  return (
    <div className="quick-jobs-board">
      <h1>⚡ לוח עבודות מהירות</h1>

      {userRole === "client" && (
        <div className="quick-job-publish-wrapper">
          <Link to="/quick-jobs/new">
            <button className="quick-job-publish-button">📤 פרסם עבודה מהירה</button>
          </Link>
        </div>
      )}

      <div className="job-list">
        <h2>עבודות פנויות</h2>
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>📅 {job.date} | 🕒 {job.time}</p>
            <p>💰 {job.priceMin}₪ - {job.priceMax}₪</p>
            <p>📍 {job.address}</p>

            {userRole === "business" && (
              <div className="job-actions">
                <button>📥 קבל עבודה</button>
                <button>✏️ הצע הצעה אחרת</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickJobsBoard;