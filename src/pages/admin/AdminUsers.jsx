// src/components/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaBan, FaCheck } from "react-icons/fa";
import API from "../../api";
import "./AdminUsers.css";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Relative path without `/api` — baseURL already sets `/api`
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        alert("❌ Error loading users");
      }
    };
    fetchUsers();
  }, []);

  // Filter by search and role
  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const matchSearch =
      u.phone?.includes(search) ||
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.name?.toLowerCase().includes(term);
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("❗ Irreversible action\nDelete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);

      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("✅ User deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting user:", err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ General error");
    }
  };

  // Toggle user status
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await API.put(`/admin/users/${id}`, { status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      console.error("❌ Error updating status:", err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ Error updating status");
    }
  };

  return (
    <div className="admin-users">
      <Link to="/admin/dashboard" className="back-dashboard">
        🔙 Back to Dashboard
      </Link>
      <h1>👥 User Management</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search by phone / name / username / email"
          className="user-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="customer">Customers</option>
          <option value="business">Businesses</option>
          <option value="worker">Workers</option>
          <option value="manager">Managers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username || "—"}</td>
              <td>{user.email}</td>
              <td>{user.phone || "—"}</td>
              <td>{user.role}</td>
              <td>{user.status || "active"}</td>
              <td className="actions-cell">
                <button
                  className="delete-btn"
                  title="Delete user"
                  onClick={() => handleDelete(user._id)}
                >
                  <FaTrashAlt />
                </button>
                <button
                  className="status-btn"
                  title={
                    user.status === "active" ? "Block user" : "Activate user"
                  }
                  onClick={() =>
                    handleStatusToggle(user._id, user.status || "active")
                  }
                >
                  {user.status === "active" ? <FaBan /> : <FaCheck />}
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
