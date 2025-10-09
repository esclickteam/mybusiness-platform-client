import React, { useState } from "react";

const statuses = ["Waiting for response", "In process", "Closed"];

const getStatusColor = (status) => {
  switch (status) {
    case "Waiting for response":
      return "red";
    case "In process":
      return "orange";
    case "Closed":
      return "green";
    default:
      return "#555";
  }
};

const OpenLeadsTable = ({ leads = [] }) => {
  const today = new Date();
  // Initialize leadList only once without useEffect
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
    // In the future: save the status to the API
  };

  // If there are no leads, display a message
  if (!Array.isArray(leadList) || leadList.length === 0) {
    return (
      <div className="graph-box">
        <h4>📥 Open Leads</h4>
        <div>No open leads to display</div>
      </div>
    );
  }

  return (
    <div className="graph-box">
      <h4>📥 Open Leads</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
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
                title="Click to change status"
              >
                {lead.status}
              </td>
              <td>
                <button style={{ fontSize: "12px" }}>Handle now</button>
                {daysSince(lead.date) > 2 && (
                  <span
                    style={{ color: "red", fontSize: "12px", marginRight: "8px" }}
                  >
                    ⏱️ Old
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
