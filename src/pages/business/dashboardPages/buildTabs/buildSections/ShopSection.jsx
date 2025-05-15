// src/pages/business/dashboardPages/buildTabs/buildSections/ShopSection.jsx
import React, { useState, useEffect } from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";

export default function ShopSection({
  shopMode,               // הערך מה–API: מערך/אובייקט של שירותים
  setShopMode: setParentMode,
  setBusinessDetails,
  handleSave,
  renderTopBar
}) {
  // UI-mode מקומי שנשאר null עד שהמשתמש יבחר חנות/יומן
  const [mode, setMode] = useState(null);

  // אופציונלי: אם shopMode שמגיע מה–API מייצג חנות (למשל מערך non-empty),
  // אפשר לסנכרן אליו
  useEffect(() => {
    if (Array.isArray(shopMode) && shopMode.length > 0) {
      setMode("store");
    }
  }, [shopMode]);

  // כשרוצים לשנות מצב – מעדכנים גם בלוקאל וגם אצבע ההורה
  const handleModeChange = newMode => {
    setMode(newMode);
    setParentMode(newMode);
  };

  return (
    <>
      <div className="form-column">
        {/* הפורם בו המשתמש בוחר ועורך */}
        <ShopAndCalendar
          isPreview={false}
          shopMode={mode}
          setShopMode={handleModeChange}
          setBusinessDetails={setBusinessDetails}
        />
        <button onClick={handleSave}>💾 שמור</button>
      </div>

      <div className="preview-column">
        {renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              {/* תצוגת Preview */}
              <ShopAndCalendar
                isPreview={true}
                shopMode={mode}
                setShopMode={handleModeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
