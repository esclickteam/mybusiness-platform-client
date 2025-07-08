import React from "react";

const RecentActivityTable = ({ activities = [] }) => {
  if (!activities.length) {
    return <p style={{ textAlign: "center" }}>אין פעילויות להצגה.</p>;
  }

  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
        📝 פעילויות אחרונות
      </h4>
      <table style={{ width: "100%", fontSize: "14px", direction: "rtl" }}>
        <thead>
          <tr>
            <th scope="col">תאריך</th>
            <th scope="col">סוג פעולה</th>
            <th scope="col">פרטים</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item) => (
            <tr key={item.id || item._id || item.date /* או fallback */}>
              <td>{new Date(item.date).toLocaleDateString("he-IL")}</td>
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
