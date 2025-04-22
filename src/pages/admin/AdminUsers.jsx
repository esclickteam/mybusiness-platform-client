import React, { useState, useEffect } from "react";
import "./AdminUsers.css";
import { Link } from "react-router-dom";
import API from "../../api";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);

  // 1. fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // 2. filter logic
  const filtered = users.filter((u) => {
    const matchSearch =
      u.phone?.includes(search) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  // 3. delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('בטוח שברצונך למחוק את המשתמש?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // 4. toggle status (requires matching backend endpoint)
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await API.put(`/admin/users/${id}`, { status: newStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error('Error toggling status:', err);
    }
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
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username || '-'}</td>
              <td>{user.email}</td>
              <td>{user.phone || '-'}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  🗑️
                </button>
                <button
                  className="status-btn"
                  onClick={() => handleStatusToggle(user._id, user.status)}
                >
                  {user.status === 'active' ? '🚫 חסום' : '✅ הפעל'}
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
