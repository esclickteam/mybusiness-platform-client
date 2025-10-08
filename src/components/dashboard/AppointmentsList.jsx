import React from "react";

const AppointmentsList = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="graph-box">
        <h4>📅 יומן פגישות</h4>
        <p style={{ textAlign: "center" }}>אין פגישות מתוכננות.</p>
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="graph-box">
      <h4>📅 פגישות קרובות</h4>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
        {sorted.map((item, i) => {
          const clientName = item.clientName || "לא ידוע";
          const serviceName =
            item.serviceName || item.service?.name || item.service || "לא ידוע";

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
              לקוח: {clientName} | שירות: {serviceName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AppointmentsList;
