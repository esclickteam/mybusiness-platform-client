import React, { useState, useEffect } from "react";

const statuses = ["ממתין למענה", "בטיפול", "נסגר"];

const getStatusColor = (status) => {
  switch (status) {
    case "ממתין למענה":
      return "red";
    case "בטיפול":
      return "orange";
    case "נסגר":
      return "green";
    default:
      return "#555";
  }
};

const OpenLeadsTable = ({ leads }) => {
  const today = new Date();
  const [leadList, setLeadList] = useState([]);

  useEffect(() => {
    setLeadList(leads);
  }, [leads]);

  const daysSince = (dateStr) => {
    const diff = (today - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  const cycleStatus = (index) => {
    setLeadList((prev) => {
      const updated = [...prev];
      const currentIndex = statuses.indexOf(updated[index].status);
      updated[index].status = statuses[(currentIndex + 1) % statuses.length];
      return updated;
    });

    // בעתיד: כאן תוסיפי שמירה ל־API עם fetch או axios
  };

  return (
    <div className="graph-box">
      <h4>📥 לידים פתוחים</h4>
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>תאריך</th>
            <th>סטטוס</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {leadList.map((lead, i) => (
            <tr key={i}>
              <td>{lead.name}</td>
              <td>{new Date(lead.date).toLocaleDateString("he-IL")}</td>
              <td
                style={{
                  color: getStatusColor(lead.status),
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => cycleStatus(i)}
                title="לחצי כדי לשנות סטטוס"
              >
                {lead.status}
              </td>
              <td>
                <button style={{ fontSize: "12px" }}>טפל עכשיו</button>
                {daysSince(lead.date) > 2 && (
                  <span style={{ color: "red", fontSize: "12px", marginRight: "8px" }}>
                    ⏱️ ישן
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenLeadsTable;
