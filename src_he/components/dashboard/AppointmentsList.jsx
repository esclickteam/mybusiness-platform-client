```javascript
import React from "react";

const AppointmentsList = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="graph-box">
        <h4>📅 Appointments Calendar</h4>
        <p style={{ textAlign: "center" }}>No scheduled appointments.</p>
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="graph-box">
      <h4>📅 Upcoming Appointments</h4>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
        {sorted.map((item, i) => {
          const clientName = item.clientName || "Unknown";
          const serviceName =
            item.serviceName || item.service?.name || item.service || "Unknown";

          return (
            <li key={i} style={{ marginBottom: "10px" }}>
              <strong>
                {new Date(item.date).toLocaleString("he-IL", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              <br />
              Client: {clientName} | Service: {serviceName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AppointmentsList;
```