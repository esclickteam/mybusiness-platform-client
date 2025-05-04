// src/components/ManageRoles.jsx
import React, { useState, useEffect } from "react";
import "./ManageRoles.css";
import { Link } from "react-router-dom";

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

  // ✅ טוען את המשתמשים מהשרת בהתחלה
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/all", {
          method: "GET",
          credentials: "include",       // שולח גם את ה־cookie עם ה־JWT
        });
        const data = await res.json();
        console.log("📦 משתמשים מהשרת:", data);
        if (res.ok) {
          setUsers(data);
        } else {
          alert(`❌ שגיאה בטעינה: ${data.error}`);
        }
      } catch (err) {
        console.error("❌ שגיאה בטעינת משתמשים:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.username || !form.email) {
      alert("יש למלא את כל השדות");
      return;
    }

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ המשתמש נוצר בהצלחה!\nסיסמה זמנית: ${data.tempPassword}`);
        setUsers(prev => [...prev, { ...form, _id: data.userId }]);
        setForm({ name: "", username: "", email: "", phone: "", role: "worker" });
      } else {
        alert(`❌ שגיאה ביצירה: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ שגיאה ביצירת משתמש:", err);
      alert("❌ שגיאה בלתי צפויה");
    }
  };

  const handleReset = async (userId) => {
    const newPassword = prompt("הזן סיסמה חדשה (לפחות 6 תווים):", "12345678");
    if (!newPassword || newPassword.length < 6) {
      alert("סיסמה לא תקינה");
      return;
    }

    try {
      const res = await fetch("/api/users/reset-user-password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ הסיסמה אופסה ל: ${newPassword}`);
      } else {
        alert(`❌ שגיאה באיפוס: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ שגיאה באיפוס סיסמה:", err);
      alert("❌ שגיאה בלתי צפויה");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) return;

    try {
      const res = await fetch(`/api/users/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
      } else {
        alert(`❌ שגיאה במחיקה: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ שגיאה במחיקת משתמש:", err);
      alert("❌ שגיאה בלתי צפויה");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.includes(searchTerm) ||
    user.name?.includes(searchTerm) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="manage-roles">
      <h1>🔐 ניהול משתמשים ותפקידים</h1>
      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>

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
          placeholder="שם משתמש ייחודי"
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
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>🗑️</button>
                <button onClick={() => handleReset(user._id)}>🔄 איפוס סיסמה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRoles;
