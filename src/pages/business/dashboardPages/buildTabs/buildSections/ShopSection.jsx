import React from "react";
// No .jsx extension for build compatibility
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar";

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
        {/* Always render the appointments calendar */}
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
              {/* Preview display for calendar only */}
              <ShopAndCalendar
                isPreview={true}
                shopMode={shopMode}
                setShopMode={setShopMode}
                workHours={workHours}          // ← included!
                setWorkHours={setWorkHours}    // ← included!
                setBusinessDetails={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
