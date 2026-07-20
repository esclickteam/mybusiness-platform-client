import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaBan, FaCheck, FaUserSecret, FaStore } from "react-icons/fa";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { setAdminActiveBusinessId } from "../../utils/adminTenant";
import "./AdminUsers.css";

function AdminUsers() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);

  /* ===============================
     Fetch users
  =============================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        alert("❌ Error loading users");
      }
    };
    fetchUsers();
  }, []);

  /* ===============================
     Filters
  =============================== */
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

  /* ===============================
     Delete user
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("❗ פעולה בלתי הפיכה\nלמחוק משתמש?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("✅ User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "❌ General error");
    }
  };

  /* ===============================
     Block / Activate
  =============================== */
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
      alert(err.response?.data?.error || "❌ Error updating status");
    }
  };

  /* ===============================
     Enter business as admin (role stays admin)
  =============================== */
  const handleEnterAsAdmin = (user) => {
    const businessId = user.businessId?._id || user.businessId;
    if (!businessId) {
      alert("❌ למשתמש זה אין עסק משויך");
      return;
    }

    setAdminActiveBusinessId(businessId);
    navigate(`/business/${businessId}/dashboard`);
  };

  /* ===============================
     🔐 IMPERSONATION (legacy — swaps identity)
  =============================== */
  const handleImpersonate = async (user) => {
    if (!window.confirm(`להיכנס כ־${user.name}?`)) return;

    try {
      const res = await API.post("/admin/impersonate", {
        userId: user._id,
      });

      // ⚠️ התחברות עם token בלבד — בלי login רגיל
      loginWithToken(res.data.user, res.data.token, {
        skipRedirect: true,
      });

      // ניווט ידני, בטוח
      if (
        res.data.user.role === "business" &&
        res.data.user.businessId
      ) {
        navigate(
          `/business/${res.data.user.businessId}/dashboard`,
          { replace: true }
        );
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Impersonation error:", err);
      alert("❌ לא ניתן להיכנס כמשתמש");
    }
  };

  /* ===============================
     UI
  =============================== */
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

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
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
                {/* Enter business as admin — keep admin role */}
                {user.role === "business" && user.businessId && (
                  <button
                    className="enter-business-btn"
                    title="כניסה לעסק כאדמין"
                    onClick={() => handleEnterAsAdmin(user)}
                  >
                    <FaStore />
                  </button>
                )}

                {/* 🕵️‍♂️ Impersonate */}
                {user.role !== "admin" && (
                  <button
                    className="impersonate-btn"
                    title="Login as user"
                    onClick={() => handleImpersonate(user)}
                  >
                    <FaUserSecret />
                  </button>
                )}

                {/* 🚫 Block / Activate */}
                <button
                  className="status-btn"
                  title={
                    user.status === "active"
                      ? "Block user"
                      : "Activate user"
                  }
                  onClick={() =>
                    handleStatusToggle(
                      user._id,
                      user.status || "active"
                    )
                  }
                >
                  {user.status === "active" ? (
                    <FaBan />
                  ) : (
                    <FaCheck />
                  )}
                </button>

                {/* 🗑 Delete */}
                <button
                  className="delete-btn"
                  title="Delete user"
                  onClick={() => handleDelete(user._id)}
                >
                  <FaTrashAlt />
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
