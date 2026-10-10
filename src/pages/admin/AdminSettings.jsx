import React, { useState } from "react";
import "./AdminSettings.css";
import { Link } from "react-router-dom";
import AdminPageHeader from "./shell/AdminPageHeader";

function AdminSettings() {
  const [settings, setSettings] = useState({
    timezone: "Asia/Jerusalem",
    language: "Hebrew",
    dateFormat: "DD/MM/YYYY",
    currency: "$",
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
    alert("ההגדרות נשמרו");
  };

  return (
    <div className="admin-settings">
      <AdminPageHeader
        title="הגדרות כלליות"
        description="הגדרות תצוגה מקומיות של פאנל הניהול."
      />
      <p><Link to="/admin/settings/legal">פרופיל משפטי</Link></p>
      <p><Link to="/admin/settings/partner-program">תמחור תת-פרטנר</Link></p>

      <div className="settings-form">
        <label>אזור זמן
          <input type="text" name="timezone" value={settings.timezone} onChange={handleChange} />
        </label>
        <label>שפת ברירת מחדל
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="Hebrew">עברית</option>
            <option value="English">English</option>
          </select>
        </label>
        <label>פורמט תאריך
          <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          </select>
        </label>
        <label>מטבע
          <select name="currency" value={settings.currency} onChange={handleChange}>
            <option value="$">$</option>
            <option value="$">$</option>
            <option value="€">€</option>
          </select>
        </label>
        <label>אימייל תמיכה
          <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} />
        </label>
        <label>טלפון תמיכה
          <input type="text" name="supportPhone" value={settings.supportPhone} onChange={handleChange} />
        </label>
        <label>
          <input type="checkbox" name="enablePopups" checked={settings.enablePopups} onChange={handleChange} />
          הצגת חלונות קופצים
        </label>
        <label>
          <input type="checkbox" name="enableCoupons" checked={settings.enableCoupons} onChange={handleChange} />
          הצגת קופונים
        </label>
        <label>
          <input type="checkbox" name="enableAlerts" checked={settings.enableAlerts} onChange={handleChange} />
          הצגת התראות מערכת
        </label>
        <label>
          <input type="checkbox" name="allowRegistration" checked={settings.allowRegistration} onChange={handleChange} />
          הרשמת משתמשים
        </label>

        <button onClick={handleSave}>שמירת הגדרות</button>
      </div>
    </div>
  );
}

export default AdminSettings;
