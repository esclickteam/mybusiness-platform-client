import React from "react";
import { BusinessServicesProvider } from "../../../context/BusinessServicesContext";
import ShopAndCalendar from "../buildTabs/shopAndCalendar/ShopAndCalendar";

export default function ShopSection({
  shopMode,
  setShopMode,
  setBusinessDetails,
  handleSave,
  renderTopBar
}) {
  return (
    <BusinessServicesProvider>
      <div className="form-column">
        <ShopAndCalendar
          isPreview={false}
          shopMode={shopMode}
          setShopMode={setShopMode}
          setBusinessDetails={setBusinessDetails}
        />
        <button onClick={handleSave} className="save-btn">
          💾 שמור
        </button>
      </div>
      <div className="preview-column">
        {renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              <ShopAndCalendar isPreview shopMode={shopMode} />
            </div>
          </div>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
