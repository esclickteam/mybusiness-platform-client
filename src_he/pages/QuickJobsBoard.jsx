import React, { useState, useEffect } from "react";
import "./QuickJobsBoard.css";
import { Link } from "react-router-dom";

function QuickJobsBoard() {
  const [userRole, setUserRole] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Simulation for a client user
    const mockUser = {
      name: "Dana",
      role: "client"
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUserRole("client");

    // Mock jobs
    setJobs([
      {
        id: 1,
        title: "Door Repair",
        description: "Front door is not closing well",
        priceMin: 150,
        priceMax: 250,
        time: "12:00-16:00",
        date: "Today",
        address: "Tel Aviv"
      },
      {
        id: 2,
        title: "Shelf Installation",
        description: "Wooden shelf for drywall",
        priceMin: 100,
        priceMax: 180,
        time: "Tomorrow morning",
        date: "Tomorrow",
        address: "Holon"
      }
    ]);
  }, []);

  return (
    <div className="quick-jobs-board">
      <h1>⚡ Quick Jobs Board</h1>

      {userRole === "client" && (
        <div className="quick-job-publish-wrapper">
          <Link to="/quick-jobs/new">
            <button className="quick-job-publish-button">📤 Publish Quick Job</button>
          </Link>
        </div>
      )}

      <div className="job-list">
        <h2>Available Jobs</h2>
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>📅 {job.date} | 🕒 {job.time}</p>
            <p>💰 {job.priceMin}$ - {job.priceMax}$</p>
            <p>📍 {job.address}</p>

            {userRole === "business" && (
              <div className="job-actions">
                <button>📥 Accept Job</button>
                <button>✏️ Submit Another Offer</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickJobsBoard;
