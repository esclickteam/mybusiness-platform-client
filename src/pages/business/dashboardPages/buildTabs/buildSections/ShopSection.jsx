// src/pages/business/dashboardPages/buildTabs/buildSections/ShopSection.jsx
import React, { useState, useEffect } from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";

export default function ShopSection({
  shopMode,               // ערך שמגיע מה–API
  setShopMode: setParentMode,
  setBusinessDetails,
  handleSave,
  renderTopBar
}) {
  // מצב בחירה לוקאלי (UI בלבד)
  const [mode, setMode] = useState(null);

  // אם shopMode מה-API מייצג חנות — הגדר default ל-"store"
  useEffect(() => {
    if (Array.isArray(shopMode) && shopMode.length > 0) {
      setMode("store");
    }
  }, [shopMode]);

  // מעבר בין מצבים - משנה רק לוקאלית (ולא מעדכן API)
  const handleModeChange = newMode => setMode(newMode);

  return (
    <>
      <div className="form-column">
        {/* כפתורי בחירה (חנות/יומן) */}
        <div className="shop-type-btns">
          <button
            className={`mode-btn${mode === "appointments" ? " active" : ""}`}
            onClick={() => handleModeChange("appointments")}
          >
            יומן
          </button>
          <button
            className={`mode-btn${mode === "store" ? " active" : ""}`}
            onClick={() => handleModeChange("store")}
          >
            חנות
          </button>
        </div>
        {/* רנדר רק אם נבחר מצב */}
        {mode && (
          <ShopAndCalendar
            isPreview={false}
            shopMode={mode}
            setShopMode={setMode} // מעדכן מצב רק פה, לא ב-parent
            setBusinessDetails={setBusinessDetails || (() => {})}
          />
        )}
        {/* כפתור שמירה הוסר */}
      </div>

      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              {/* תצוגת Preview */}
              {mode && (
                <ShopAndCalendar
                  isPreview={true}
                  shopMode={mode}
                  setShopMode={() => {}}
                  setBusinessDetails={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
