import React from "react";
import "./StatsProgressBar.css"; // We'll also create matching CSS

const StatsProgressBar = ({ value = 0, goal = 100, label = "Orders this month" }) => {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <div className="progress-box">
      <div className="progress-label">
        {label} – {value}/{goal}
      </div>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default StatsProgressBar;
