import React, { useState } from "react";
import "./ManageRoles.css";
import { Link } from "react-router-dom";

function ManageRoles() {
  const [users, setUsers] = useState([
    { id: 1, username: "dana123", name: "דנה כהן", phone: "0501234567", role: "manager" },
    { id: 2, username: "roni456", name: "רוני לוי", phone: "0529876543", role: "staff" }
  ]);

  const [form, setForm] = useState({ name: "", username: "", phone: "", role: "staff" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = () => {
    if (!form.name || !form.username) return;
    const newUser = { ...form, id: Date.now() };
    setUsers([...users, newUser]);
    setForm({ name: "", username: "", phone: "", role: "staff" });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const filteredUsers = users.filter(user =>
    user.username.includes(searchTerm) ||
    user.name.includes(searchTerm) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="manage-roles">
      <h1>🔐 ניהול משתמשים ותפקידים</h1>

      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>

      <div className="role-form">
        <input type="text" name="name" placeholder="שם מלא" value={form.name} onChange={handleChange} />
        <input type="text" name="username" placeholder="שם משתמש ייחודי" value={form.username} onChange={handleChange} />
        <input type="tel" name="phone" placeholder="טלפון" value={form.phone} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="staff">עובד</option>
          <option value="manager">מנהל</option>
          <option value="admin">אדמין</option>
        </select>
        <button onClick={handleAdd}>➕ הוסף משתמש</button>
      </div>

      <div className="user-search-box">
        <input
          type="text"
          placeholder="🔍 חפש לפי שם, שם משתמש או טלפון..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>חפש</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>שם משתמש</th>
            <th>טלפון</th>
            <th>תפקיד</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td><button onClick={() => handleDelete(user.id)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRoles;