// src/pages/business/dashboardPages/buildTabs/buildSections/ShopSection.jsx
import React, { useState, useEffect } from "react";

// קומפוננטות נוספות ל־journal/shop תוכל להחליף בהתאם למה שיש אצלך
// import JournalEditor from "./JournalEditor";
// import ShopEditor    from "./ShopEditor";

export default function ShopSection({
  shopMode,
  setShopMode,
  setBusinessDetails,
  handleSave,
  renderTopBar
}) {
  // mode מקומי לצורך wizzard
  const [mode, setMode] = useState(shopMode || "");

  // אם רוצים לשמור את הבחירה במצב הכללי
  useEffect(() => {
    if (mode) {
      setShopMode(mode);
    }
  }, [mode, setShopMode]);

  // שלב 1: אין עדיין בחירה
  if (!mode) {
    return (
      <>
        {/* בצד שמאל – פשוט את השאלה והכפתורים */}
        <div className="form-column">
          <h2>איזה סוג שירות ברצונך לעצב?</h2>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="tab"
              onClick={() => setMode("journal")}
            >
              יומן
            </button>
            <button
              className="tab"
              onClick={() => setMode("shop")}
            >
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

        {/* בצד ימין – preview רגיל עם top bar */}
        <div className="preview-column">
          {renderTopBar()}
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#666" }}>
            בחר שירות בצד שמאל לעריכה וראה תצוגה כאן.
          </p>
        </div>
      </>
    );
  }

  // שלב 2: ה־mode כבר נקבע – מציגים את העורך המתאים
  return (
    <>
      {/* form column */}
      <div className="form-column">
        {renderTopBar()}
        <h2 style={{ marginBottom: "1rem" }}>
          {mode === "journal" ? "עיצוב היומן" : "עיצוב החנות"}
        </h2>

        {mode === "journal" ? (
          /* כאן תכניס את קומפוננטת העריכה של היומן שלך */
          <p>״Editor של יומן״ (JournalEditor)</p>
        ) : (
          /* וכאן את קומפוננטת העריכה של החנות שלך */
          <p>״Editor של חנות״ (ShopEditor)</p>
        )}

        <button
          className="save-btn"
          style={{ marginTop: "2rem" }}
          onClick={handleSave}
        >
          💾 שמור
        </button>
      </div>

      {/* preview column */}
      <div className="preview-column">
        {renderTopBar()}
        <h3 className="section-title" style={{ marginTop: "1rem" }}>
          {mode === "journal" ? "תצוגת היומן" : "תצוגת החנות"}
        </h3>
        {mode === "journal" ? (
          /* תצוגת היומן */
          <p>״Preview של יומן״</p>
        ) : (
          /* תצוגת החנות */
          <p>״Preview של חנות״</p>
        )}
      </div>
    </>
  );
}
