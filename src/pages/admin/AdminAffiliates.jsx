import React, { useState } from "react";
import API from "../../api"; // לוודא שהנתיב נכון

function AdminAffiliates() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    affiliateId: "",
    commissionRate: 0.2,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "commissionRate" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // בדיקות בסיסיות
    if (!form.name.trim() || !form.affiliateId.trim()) {
      setError("נא למלא שם ומשתמש ייחודי (affiliateId)");
      setLoading(false);
      return;
    }
    if (form.commissionRate < 0 || form.commissionRate > 1) {
      setError("אחוז העמלה חייב להיות בין 0 ל-1");
      setLoading(false);
      return;
    }

    try {
      // הקריאה ל-API מתבצעת באמצעות axios שהגדרת עם baseURL נכון
      const res = await API.post("/admin/affiliates", form);
      if (res.data.success) {
        setMessage("✅ המשווק נוצר בהצלחה!");
        setForm({
          name: "",
          email: "",
          affiliateId: "",
          commissionRate: 0.2,
        });
      } else {
        setError("שגיאה ביצירת המשווק");
      }
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה בשרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-affiliates-container" style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>יצירת משווק חדש</h2>

      {message && <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>}
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          שם המשווק*:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="לדוגמה: יעל בן-ארי"
            autoComplete="off"
          />
        </label>

        <label>
          אימייל (אופציונלי):
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            autoComplete="off"
          />
        </label>

        <label>
          מזהה ייחודי (affiliateId)*:
          <input
            type="text"
            name="affiliateId"
            value={form.affiliateId}
            onChange={handleChange}
            required
            placeholder="לדוגמה: yael123"
            autoComplete="off"
          />
        </label>

        <label>
          אחוז עמלה* (0–1):
          <input
            type="number"
            name="commissionRate"
            step="0.01"
            min="0"
            max="1"
            value={form.commissionRate}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "שומר..." : "צור משווק"}
        </button>
      </form>
    </div>
  );
}

export default AdminAffiliates;
