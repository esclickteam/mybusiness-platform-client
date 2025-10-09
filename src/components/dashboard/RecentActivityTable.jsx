import React from "react";

const RecentActivityTable = ({ activities = [] }) => {
  if (!activities.length) {
    return <p style={{ textAlign: "center" }}>No activities to display.</p>;
  }

  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
        📝 Recent Activities
      </h4>
      <table style={{ width: "100%", fontSize: "14px", direction: "ltr" }}>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Action Type</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item) => (
            <tr key={item.id || item._id || item.date /* or fallback */}>
              <td>{new Date(item.date).toLocaleDateString("en-US")}</td>
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
