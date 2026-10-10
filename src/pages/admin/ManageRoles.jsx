// src/pages/admin/ManageRoles.jsx
import React, { useState, useEffect } from "react";
import API from "../../api";
import "./ManageRoles.css";
import AdminPageHeader from "./shell/AdminPageHeader";

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

  // Load users from server on init
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        console.log("📦 Users from server:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        alert("לא ניתן לטעון את המשתמשים");
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
      alert("יש למלא את כל השדות");
      return;
    }
    try {
      const res = await API.post("/admin/create-user", form);
      const { userId, tempPassword } = res.data;
      alert(`המשתמש נוצר.\nסיסמה זמנית: ${tempPassword}`);
      setUsers((prev) => [...prev, { ...form, _id: userId }]);
      setForm({ name: "", username: "", email: "", phone: "", role: "worker" });
    } catch (err) {
      console.error("❌ Error creating user:", err);
      alert(err.response?.data?.error || "לא ניתן ליצור משתמש");
    }
  };

  const handleReset = async (userId) => {
    const newPassword = prompt("סיסמה חדשה (6 תווים לפחות):", "12345678");
    if (!newPassword || newPassword.length < 6) {
      alert("הסיסמה קצרה מדי");
      return;
    }
    try {
      await API.put("/admin/users/reset-user-password", { userId, newPassword });
      alert(`הסיסמה אופסה ל: ${newPassword}`);
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      alert(err.response?.data?.error || "לא ניתן לאפס את הסיסמה");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את המשתמש?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("המשתמש נמחק");
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert(err.response?.data?.error || "לא ניתן למחוק את המשתמש");
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.username, user.name, user.phone]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="manage-roles">
      <AdminPageHeader title="תפקידים" description="יצירה, חיפוש ומחיקה של משתמשי מערכת." />

      <div className="role-form">
        <input
          type="text"
          name="name"
          placeholder="שם מלא"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="שם משתמש"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="טלפון"
          value={form.phone}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="worker">עובד</option>
          <option value="manager">מנהל</option>
          <option value="admin">מנהל מערכת</option>
        </select>
        <button onClick={handleAdd}>הוספת משתמש</button>
      </div>

      <div className="user-search-box">
        <input
          type="text"
          placeholder="חיפוש לפי שם, שם משתמש או טלפון"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>תפקיד</th>
            <th>פעולות</th>
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
                <button onClick={() => handleReset(user._id)}>איפוס סיסמה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRoles;
