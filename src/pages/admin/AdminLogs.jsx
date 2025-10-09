import React, { useState } from "react";
import "./AdminLogs.css";
import { Link } from "react-router-dom";

function AdminLogs() {
  const [search, setSearch] = useState("");
  const [logs] = useState([
    { id: "log_001", user: "admin", action: "עריכה", description: "עודכן מחיר לחבילה 'בסיסית'", date: "2025-04-20 14:10" },
    { id: "log_002", user: "dana123", action: "יצירה", description: "נוצרה חבילת 'VIP נשים'", date: "2025-04-20 14:15" },
    { id: "log_003", user: "roni456", action: "מחיקה", description: "נמחק קופון 'SALE20'", date: "2025-04-20 14:20" },
    { id: "log_004", user: "admin", action: "התחברות", description: "התחברות מוצלחת למערכת", date: "2025-04-20 14:25" }
  ]);

  const filteredLogs = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.description.includes(search) ||
    l.action.includes(search)
  );

  return (
    <div className="admin-logs">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>
      <h1>🕐 פעולות מערכת (לוגים)</h1>

      <input
        type="text"
        placeholder="🔍 חיפוש לפי משתמש / פעולה / תיאור"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="log-search"
      />

      <table className="logs-table">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>משתמש</th>
            <th>פעולה</th>
            <th>תיאור</th>
            <th>תאריך</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.description}</td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminLogs;