import React, { useState } from "react";
import "./AdminSettings.css";
import { Link } from "react-router-dom";

function AdminSettings() {
  const [settings, setSettings] = useState({
    timezone: "Asia/Jerusalem",
    language: "Hebrew",
    dateFormat: "DD/MM/YYYY",
    currency: "₪",
    supportEmail: "support@example.com",
    supportPhone: "03-5555555",
    enablePopups: true,
    enableCoupons: true,
    enableAlerts: true,
    allowRegistration: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = () => {
    console.log("✅ Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="admin-settings">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 Back to Dashboard</Link>
      <h1>⚙️ General Settings</h1>

      <div className="settings-form">
        <label>🌍 Time Zone:
          <input type="text" name="timezone" value={settings.timezone} onChange={handleChange} />
        </label>
        <label>🗣️ Default Language:
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="Hebrew">Hebrew</option>
            <option value="English">English</option>
          </select>
        </label>
        <label>📅 Date Format:
          <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          </select>
        </label>
        <label>💸 Currency:
          <select name="currency" value={settings.currency} onChange={handleChange}>
            <option value="₪">₪</option>
            <option value="$">$</option>
            <option value="€">€</option>
          </select>
        </label>
        <label>📧 Support Email:
          <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} />
        </label>
        <label>📞 Support Phone:
          <input type="text" name="supportPhone" value={settings.supportPhone} onChange={handleChange} />
        </label>
        <label>
          <input type="checkbox" name="enablePopups" checked={settings.enablePopups} onChange={handleChange} />
          🛎️ Show automatic popups
        </label>
        <label>
          <input type="checkbox" name="enableCoupons" checked={settings.enableCoupons} onChange={handleChange} />
          🎁 Show coupon promotions
        </label>
        <label>
          <input type="checkbox" name="enableAlerts" checked={settings.enableAlerts} onChange={handleChange} />
          🔔 Show system alerts
        </label>
        <label>
          <input type="checkbox" name="allowRegistration" checked={settings.allowRegistration} onChange={handleChange} />
          🧾 Allow user registration
        </label>

        <button onClick={handleSave}>💾 Save Settings</button>
      </div>
    </div>
  );
}

export default AdminSettings;
