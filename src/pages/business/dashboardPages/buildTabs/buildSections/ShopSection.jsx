// src/pages/business/dashboardPages/buildTabs/buildSections/ShopSection.jsx

import React, { useState, useEffect } from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";
import { BusinessServicesProvider } from "../../../../../context/BusinessServicesContext";

// props:
// - shopMode: הערך שבסטור ("" | "calendar" | "shop")
// - setShopMode: עדכון הערך בסטור
// - setBusinessDetails: פונקציה להוסיף שינויים בסטור העסק
// - handleSave: שמירה
// - renderTopBar: פונקציית ציור הלוגו/שם/טאבים בצד ימין
export default function ShopSection({
  shopMode,
  setShopMode,
  setBusinessDetails,
  handleSave,
  renderTopBar
}) {
  // local wizard-state: undefined = לא נבחר כלום, אחרת "calendar" או "shop"
  const [mode, setMode] = useState(undefined);

  // אם כבר יש מצב בשור (לדוגמה חוזרים לטאב), נדביק אותו ל־mode
  useEffect(() => {
    if (shopMode && mode === undefined) {
      setMode(shopMode);
    }
  }, [shopMode, mode]);

  // ברגע שבוחרים – גם בעדכון מקומי וגם בסטור ההורה
  const chooseMode = (m) => {
    setMode(m);
    setShopMode(m);
  };

  // ————— שלב א': דף הבחירה —————
  if (mode === undefined) {
    return (
      <>
        <div className="form-column">
          <h2>איזה סוג שירות ברצונך לעצב?</h2>
          <div className="tabs" style={{ marginTop: "1rem" }}>
            <button className="tab" onClick={() => chooseMode("calendar")}>
              יומן / תורים
            </button>
            <button className="tab" onClick={() => chooseMode("shop")}>
              חנות
            </button>
          </div>
          <button
            className="save-btn"
            style={{ marginTop: "2rem" }}
            onClick={handleSave}
          >
            💾 שמור
          </button>
        </div>
        <div className="preview-column">
          {renderTopBar()}
          <p style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "#666",
            fontStyle: "italic"
          }}>
            בחרו שירות כדי להתחיל לעצב ותראו תצוגה כאן.
          </p>
        </div>
      </>
    );
  }

  // ————— שלב B': הטעינה של ShopAndCalendar —————
  return (
    <BusinessServicesProvider>
      <div className="form-column">
        <ShopAndCalendar
          isPreview={false}
          shopMode={mode}
          setShopMode={setShopMode}
          setBusinessDetails={setBusinessDetails}
        />
        <button
          className="save-btn"
          style={{ marginTop: "1.5rem" }}
          onClick={handleSave}
        >
          💾 שמור
        </button>
      </div>

      <div className="preview-column">
        {renderTopBar()}
        <div className="phone-preview-wrapper" style={{ marginTop: "1rem" }}>
          <div className="phone-frame">
            <div className="phone-body">
              <ShopAndCalendar
                isPreview={true}
                shopMode={mode}
              />
            </div>
          </div>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
