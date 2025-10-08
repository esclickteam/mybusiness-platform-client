import React, { useState } from "react";
import API from "../../api";
import "./AdminAffiliates.css";

function AdminAffiliates() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    affiliateId: "",
    password: "",           // הוספתי שדה סיסמה
    commissionRate: 0.2,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [affiliateUrl, setAffiliateUrl] = useState(null);

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
    setAffiliateUrl(null);

    if (!form.name.trim() || !form.affiliateId.trim() || !form.password.trim()) {
      setError("נא למלא שם, מזהה ייחודי וסיסמה");
      setLoading(false);
      return;
    }
    if (form.commissionRate < 0 || form.commissionRate > 1) {
      setError("אחוז העמלה חייב להיות בין 0 ל-1");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/admin/affiliates", form);
      if (res.data.success) {
        setMessage("✅ המשווק נוצר בהצלחה!");
        setAffiliateUrl(`https://esclick.co.il/affiliate/auto-login/${res.data.affiliate.publicToken}`);

        setForm({
          name: "",
          email: "",
          affiliateId: "",
          password: "",           // איפוס הסיסמה גם
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
    <div className="admin-affiliates-container">
      <h2 className="title">יצירת משווק חדש</h2>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit} className="affiliate-form">
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
          סיסמה*:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="הכנס סיסמה"
            autoComplete="new-password"
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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "שומר..." : "צור משווק"}
        </button>
      </form>

      {affiliateUrl && (
        <div className="affiliate-url-container">
          כתובת המשווק:{" "}
          <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="affiliate-link">
            {affiliateUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default AdminAffiliates;
