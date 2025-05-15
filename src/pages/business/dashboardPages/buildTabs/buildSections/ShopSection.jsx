// src/pages/business/dashboardPages/buildTabs/buildSections/ShopSection.jsx
import React from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";

export default function ShopSection({
  setBusinessDetails,
  renderTopBar
}) {
  return (
    <>
      <div className="form-column">
        {/* רנדר קבוע של יומן (appointments) */}
        <ShopAndCalendar
          isPreview={false}
          shopMode="appointments"
          setShopMode={() => {}} // לא נדרש שינוי מצב
          setBusinessDetails={setBusinessDetails || (() => {})}
        />
      </div>

      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              {/* תצוגת Preview */}
              <ShopAndCalendar
                isPreview={true}
                shopMode="appointments"
                setShopMode={() => {}}
                setBusinessDetails={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
