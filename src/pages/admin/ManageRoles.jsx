```javascript
// src/pages/admin/ManageRoles.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import "./ManageRoles.css";

function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "worker",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Loads users from the server initially
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        console.log("📦 Users from server:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        alert("❌ Error loading users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!form.name || !form.username || !form.email) {
      alert("All fields must be filled");
      return;
    }
    try {
      const res = await API.post("/admin/create-user", form);
      const { userId, tempPassword } = res.data;
      alert(`✅ User created successfully!\nTemporary password: ${tempPassword}`);
      setUsers((prev) => [...prev, { ...form, _id: userId }]);
      setForm({ name: "", username: "", email: "", phone: "", role: "worker" });
    } catch (err) {
      console.error("❌ Error creating user:", err);
      alert(err.response?.data?.error || "❌ Error creating user");
    }
  };

  const handleReset = async (userId) => {
    const newPassword = prompt("Enter a new password (at least 6 characters):", "12345678");
    if (!newPassword || newPassword.length < 6) {
      alert("Invalid password");
      return;
    }
    try {
      await API.put("/admin/users/reset-user-password", { userId, newPassword });
      alert(`✅ Password reset to: ${newPassword}`);
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      alert(err.response?.data?.error || "❌ Error resetting password");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("✅ User deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert(err.response?.data?.error || "❌ Error deleting user");
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.username, user.name, user.phone]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="manage-roles">
      <h1>🔐 User and Role Management</h1>
      <Link to="/admin/dashboard" className="back-dashboard">
        🔙 Back to Dashboard
      </Link>

      <div className="role-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Unique Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="worker">Worker</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAdd}>➕ Add User</button>
      </div>

      <div className="user-search-box">
        <input
          type="text"
          placeholder="🔍 Search by name, username, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username || "-"}</td>
              <td>{user.email}</td>
              <td>{user.phone || "-"}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>🗑️</button>
                <button onClick={() => handleReset(user._id)}>🔄 Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRoles;
```