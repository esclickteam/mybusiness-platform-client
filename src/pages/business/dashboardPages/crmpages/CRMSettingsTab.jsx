import React, { useState } from "react";
import "./CRMSettingsTab.css";

const CRMSettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "My Business",
    businessEmail: "biz@example.com",
    businessPhone: "050-1234567",
    businessAddress: "Tel Aviv",
    sendFromEmail: "no-reply@mycrm.com",
    themeColor: "#7c4dff",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("🔧 Settings saved:", settings);
    alert("Settings saved successfully ✅");
    // Future: Send to DB
  };

  return (
    <div className="crm-tab-content">
      <h2>⚙️ CRM Settings</h2>

      <div className="settings-form">
        <label>Business Name</label>
        <input name="businessName" value={settings.businessName} onChange={handleChange} />

        <label>Business Email</label>
        <input name="businessEmail" value={settings.businessEmail} onChange={handleChange} />

        <label>Business Phone</label>
        <input name="businessPhone" value={settings.businessPhone} onChange={handleChange} />

        <label>Address</label>
        <input name="businessAddress" value={settings.businessAddress} onChange={handleChange} />

        <label>Reminder Sending Email</label>
        <input name="sendFromEmail" value={settings.sendFromEmail} onChange={handleChange} />

        <label>Primary Color (hex)</label>
        <input name="themeColor" value={settings.themeColor} onChange={handleChange} />

        <button className="save-settings-btn" onClick={handleSave}>💾 Save</button>
      </div>
    </div>
  );
};

export default CRMSettingsTab;
