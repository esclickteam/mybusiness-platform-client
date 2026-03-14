import React, { useState } from "react";
import API from "../../api";
import "./AdminAffiliates.css";

function AdminAffiliates() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    affiliateId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [affiliateLinks, setAffiliateLinks] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setError(null);
    setAffiliateLinks(null);

    if (!form.name.trim() || !form.affiliateId.trim() || !form.password.trim()) {
      setError("Please fill in name, unique ID, and password");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/admin/affiliates", {
        ...form,
        commissionRate: 0.2, // ⭐ קבוע 20%
      });

      if (res.data.success) {
        setMessage("✅ Marketer created successfully!");

        const affiliateId = res.data.affiliate.affiliateId;
        const publicToken = res.data.affiliate.publicToken;

        

        setForm({
          name: "",
          email: "",
          affiliateId: "",
          password: "",
        });
      } else {
        setError("Error creating marketer");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-affiliates-container">
      <h2 className="title">Create New Marketer</h2>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit} className="affiliate-form">
        <label>
          Marketer Name*:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g., Yael Ben-Ari"
            autoComplete="off"
          />
        </label>

        <label>
          Email (optional):
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
          Unique ID (affiliateId)*:
          <input
            type="text"
            name="affiliateId"
            value={form.affiliateId}
            onChange={handleChange}
            required
            placeholder="e.g., yael123"
            autoComplete="off"
          />
        </label>

        <label>
          Password*:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            autoComplete="new-password"
          />
        </label>

        {/* ⭐ Commission fixed */}
        <label>
          Commission Rate:
          <input
            type="text"
            value="20%"
            disabled
          />
        </label>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Saving..." : "Create Marketer"}
        </button>
      </form>

      {affiliateLinks && (
        <div className="affiliate-url-container">

          <p><strong>🔑 Marketer Login:</strong></p>
          <a
            href={affiliateLinks.login}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-link"
          >
            {affiliateLinks.login}
          </a>

          <p style={{ marginTop: "15px" }}>
            <strong>🔗 Referral Link:</strong>
          </p>

          <a
            href={affiliateLinks.referral}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-link"
          >
            {affiliateLinks.referral}
          </a>

        </div>
      )}
    </div>
  );
}

export default AdminAffiliates;