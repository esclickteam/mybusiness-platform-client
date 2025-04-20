import React, { useState } from "react";
import "./AdminUsers.css";
import { Link } from "react-router-dom";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([
    { id: 1, name: "דנה כהן", username: "dana123", email: "dana@example.com", phone: "0501234567", role: "לקוח", status: "פעיל" },
    { id: 2, name: "רוני לוי", username: "roni456", email: "roni@example.com", phone: "0549876543", role: "עסק", status: "חסום" },
    { id: 3, name: "שחר ישראלי", username: "shachar789", email: "shachar@example.com", phone: "0523332211", role: "עובד", status: "פעיל" }
  ]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.phone.includes(search) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  const handleStatusToggle = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === "פעיל" ? "חסום" : "פעיל" } : u
    ));
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="admin-users">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>
      <h1>👥 ניהול משתמשים</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 חיפוש לפי טלפון / שם משתמש / אימייל"
          className="user-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">הכל</option>
          <option value="לקוח">לקוחות</option>
          <option value="עסק">עסקים</option>
          <option value="עובד">עובדים</option>
          <option value="מנהל">מנהלים</option>
          <option value="admin">אדמינים</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>תפקיד</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className="edit-btn">✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>🗑️</button>
                <button className="status-btn" onClick={() => handleStatusToggle(user.id)}>
                  {user.status === "פעיל" ? "🚫 חסום" : "✅ הפעל"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;