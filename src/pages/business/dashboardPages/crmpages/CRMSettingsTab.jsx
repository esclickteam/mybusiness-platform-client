import React, { useState } from "react";
import "./CRMSettingsTab.css";

const CRMSettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "העסק שלי",
    businessEmail: "biz@example.com",
    businessPhone: "050-1234567",
    businessAddress: "תל אביב",
    sendFromEmail: "no-reply@mycrm.com",
    themeColor: "#7c4dff",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("🔧 הגדרות נשמרו:", settings);
    alert("ההגדרות נשמרו ✅");
    // בעתיד: שליחה ל-DB
  };

  return (
    <div className="crm-tab-content">
      <h2>⚙️ הגדרות CRM</h2>

      <div className="settings-form">
        <label>שם עסק</label>
        <input name="businessName" value={settings.businessName} onChange={handleChange} />

        <label>אימייל עסקי</label>
        <input name="businessEmail" value={settings.businessEmail} onChange={handleChange} />

        <label>טלפון עסק</label>
        <input name="businessPhone" value={settings.businessPhone} onChange={handleChange} />

        <label>כתובת</label>
        <input name="businessAddress" value={settings.businessAddress} onChange={handleChange} />

        <label>אימייל לשליחת תזכורות</label>
        <input name="sendFromEmail" value={settings.sendFromEmail} onChange={handleChange} />

        <label>צבע ראשי (hex)</label>
        <input name="themeColor" value={settings.themeColor} onChange={handleChange} />

        <button className="save-settings-btn" onClick={handleSave}>💾 שמור</button>
      </div>
    </div>
  );
};

export default CRMSettingsTab;
