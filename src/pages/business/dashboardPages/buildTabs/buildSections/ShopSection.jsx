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
  // UI-mode מקומי
  const [mode, setMode] = useState(null);

  // אם מגיע מערך של חנות (לדוג׳ מוצר ראשון), אפשר להגדיר default ל-"store"
  useEffect(() => {
    if (Array.isArray(shopMode) && shopMode.length > 0) {
      setMode("store");
    }
  }, [shopMode]);

  // שינוי מצב מעדכן גם לוקאל וגם להורה
  const handleModeChange = newMode => {
    setMode(newMode);
    setParentMode && setParentMode(newMode);
  };

  return (
    <>
      <div className="form-column">
        {/* הפורם בו המשתמש בוחר ועורך */}
        <ShopAndCalendar
          isPreview={false}
          shopMode={shopMode}
          setShopMode={setParentMode || (() => {})}  // הגנה: תמיד פונקציה
          setBusinessDetails={setBusinessDetails || (() => {})}
        />
        <button onClick={handleSave}>💾 שמור</button>
      </div>

      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              {/* תצוגת Preview */}
              <ShopAndCalendar
                isPreview={true}
                shopMode={mode}
                setShopMode={() => {}}                // preview: תמיד פונקציה ריקה
                setBusinessDetails={() => {}}         // preview: תמיד פונקציה ריקה
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
