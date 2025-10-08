```javascript
import React, { useState } from "react";
import "./AdminLogs.css";
import { Link } from "react-router-dom";

function AdminLogs() {
  const [search, setSearch] = useState("");
  const [logs] = useState([
    { id: "log_001", user: "admin", action: "Edit", description: "Updated price for package 'Basic'", date: "2025-04-20 14:10" },
    { id: "log_002", user: "dana123", action: "Create", description: "Created package 'VIP Women'", date: "2025-04-20 14:15" },
    { id: "log_003", user: "roni456", action: "Delete", description: "Deleted coupon 'SALE20'", date: "2025-04-20 14:20" },
    { id: "log_004", user: "admin", action: "Login", description: "Successful login to the system", date: "2025-04-20 14:25" }
  ]);

  const filteredLogs = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.description.includes(search) ||
    l.action.includes(search)
  );

  return (
    <div className="admin-logs">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 Back to Dashboard</Link>
      <h1>🕐 System Actions (Logs)</h1>

      <input
        type="text"
        placeholder="🔍 Search by user / action / description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="log-search"
      />

      <table className="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Action</th>
            <th>Description</th>
            <th>Date</th>
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
```