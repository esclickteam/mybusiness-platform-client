import React from "react";

const RecentActivityTable = ({ activities }) => {
  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
        📝 פעילויות אחרונות
      </h4>
      <table style={{ width: "100%", fontSize: "14px", direction: "rtl" }}>
        <thead>
          <tr>
            <th>תאריך</th>
            <th>סוג פעולה</th>
            <th>פרטים</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item, idx) => (
            <tr key={idx}>
              <td>{item.date}</td>
              <td>{item.type}</td>
              <td>{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
