import React, { useState } from "react";
import API from "../../api";
import "./AdminAffiliates.css";

function AdminAffiliates() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    affiliateId: "",
    password: "",           // Added password field
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
      setError("Please fill in the name, unique identifier, and password");
      setLoading(false);
      return;
    }
    if (form.commissionRate < 0 || form.commissionRate > 1) {
      setError("The commission rate must be between 0 and 1");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/admin/affiliates", form);
      if (res.data.success) {
        setMessage("✅ The affiliate was created successfully!");
        setAffiliateUrl(`https://BizUply.co.il/affiliate/auto-login/${res.data.affiliate.publicToken}`);

        setForm({
          name: "",
          email: "",
          affiliateId: "",
          password: "",           // Resetting the password as well
          commissionRate: 0.2,
        });
      } else {
        setError("Error creating the affiliate");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-affiliates-container">
      <h2 className="title">Create New Affiliate</h2>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit} className="affiliate-form">
        <label>
          Affiliate Name*:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="For example: Yael Ben-Ari"
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
          Unique Identifier (affiliateId)*:
          <input
            type="text"
            name="affiliateId"
            value={form.affiliateId}
            onChange={handleChange}
            required
            placeholder="For example: yael123"
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

        <label>
          Commission Rate* (0–1):
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
          {loading ? "Saving..." : "Create Affiliate"}
        </button>
      </form>

      {affiliateUrl && (
        <div className="affiliate-url-container">
          Affiliate URL:{" "}
          <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="affiliate-link">
            {affiliateUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default AdminAffiliates;
