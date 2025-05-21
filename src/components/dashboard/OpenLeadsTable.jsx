import React, { useState } from "react";

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

const OpenLeadsTable = ({ leads = [] }) => {
  const today = new Date();
  // אתחול leadList פעם אחת בלבד ללא useEffect
  const [leadList, setLeadList] = useState(
    Array.isArray(leads) ? leads : []
  );

  const daysSince = (dateStr) => {
    const diff = (today - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  const cycleStatus = (index) => {
    setLeadList((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const currentIndex = statuses.indexOf(updated[index]?.status);
      updated[index] = {
        ...updated[index],
        status: statuses[(currentIndex + 1) % statuses.length],
      };
      return updated;
    });
    // בעתיד: שמירת הסטטוס ב-API
  };

  // אם אין לידים, מציגים הודעה
  if (!Array.isArray(leadList) || leadList.length === 0) {
    return (
      <div className="graph-box">
        <h4>📥 לידים פתוחים</h4>
        <div>אין לידים פתוחים להצגה</div>
      </div>
    );
  }

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
            <tr key={lead.id || i}>
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
                  <span
                    style={{ color: "red", fontSize: "12px", marginRight: "8px" }}
                  >
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
