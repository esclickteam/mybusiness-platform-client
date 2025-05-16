import React from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";

export default function ShopSection({
  setBusinessDetails,
  renderTopBar,
  shopMode,
  setShopMode,
  workHours,
  setWorkHours
}) {
  return (
    <>
      <div className="form-column">
        {/* רנדר קבוע של יומן (appointments) */}
        <ShopAndCalendar
          isPreview={false}
          shopMode={shopMode}
          setShopMode={setShopMode}
          workHours={workHours}
          setWorkHours={setWorkHours}
          setBusinessDetails={setBusinessDetails}
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
                shopMode={shopMode}
                setShopMode={setShopMode}
                workHours={workHours}
                setWorkHours={setWorkHours}
                setBusinessDetails={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
