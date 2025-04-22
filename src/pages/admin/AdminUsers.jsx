import React, { useState, useEffect } from "react";
import "./AdminUsers.css";
import { Link } from "react-router-dom";
import API from "../../api";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);

  // שליפת משתמשים
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת המשתמשים:", err);
        alert("❌ שגיאה בטעינת המשתמשים");
      }
    };
    fetchUsers();
  }, []);

  // סינון לפי חיפוש ותפקיד
  const filtered = users.filter((u) => {
    const matchSearch =
      u.phone?.includes(search) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  // מחיקת משתמש
  const handleDelete = async (id) => {
    console.log("📡 נלחץ כפתור מחיקה למשתמש:", id);

    if (!window.confirm("❗ פעולה בלתי הפיכה\nהאם למחוק את המשתמש?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("✅ המשתמש נמחק בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה במחיקה:", err.response?.data || err.message);
      alert(err.response?.data?.error || "שגיאה כללית");
    }
  };

  // החלפת סטטוס משתמש
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await API.put(`/admin/users/${id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("❌ שגיאה בהחלפת סטטוס:", err.response?.data || err.message);
      alert(err.response?.data?.error || "שגיאה בעדכון סטטוס");
    }
  };

  return (
    <div className="admin-users">
      <Link to="/admin/dashboard" className="back-dashboard">
        🔙 חזרה לדשבורד
      </Link>
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
          <option value="customer">לקוחות</option>
          <option value="business">עסקים</option>
          <option value="worker">עובדים</option>
          <option value="manager">מנהלים</option>
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
          {filtered.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username || "-"}</td>
              <td>{user.email}</td>
              <td>{user.phone || "-"}</td>
              <td>{user.role}</td>
              <td>{user.status || "active"}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🧪 נלחץ מחיקה על:", user._id);
                    handleDelete(user._id);
                  }}
                >
                  🗑️
                </button>
                <button
                  className="status-btn"
                  onClick={() =>
                    handleStatusToggle(user._id, user.status)
                  }
                >
                  {user.status === "active" ? "🚫 חסום" : "✅ הפעל"}
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
