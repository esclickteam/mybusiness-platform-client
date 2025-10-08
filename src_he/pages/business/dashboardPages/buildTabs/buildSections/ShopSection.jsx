```javascript
import React from "react";
// Without the .jsx extension for build fix
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
        {/* Constant rendering of the calendar (appointments) */}
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
              {/* Preview display of the calendar only */}
              <ShopAndCalendar
                isPreview={true}
                shopMode={shopMode}
                setShopMode={setShopMode}
                workHours={workHours}          // ← Add!
                setWorkHours={setWorkHours}    // ← Add!
                setBusinessDetails={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```