import React from "react";
import ShopAndCalendar from "../shopAndCalendar/ShopAndCalendar.jsx";
import { BusinessServicesProvider } from "../../../../../context/BusinessServicesContext";

export default function ShopSection({ shopMode, setShopMode, setBusinessDetails, handleSave, renderTopBar }) {
  return (
    <BusinessServicesProvider>
      <div className="form-column">
        {/* הצגת רכיב ShopAndCalendar כשהמשתמש לא במצב preview */}
        <ShopAndCalendar 
          isPreview={false} 
          shopMode={shopMode} 
          setShopMode={setShopMode} 
          setBusinessDetails={setBusinessDetails} 
        />
        <button onClick={handleSave}>💾 שמור</button>
      </div>
      
      <div className="preview-column">
        {renderTopBar()}
        <div className="phone-preview-wrapper">
          <div className="phone-frame">
            <div className="phone-body">
              {/* הצגת תצוגה מקדימה */}
              <ShopAndCalendar 
                isPreview 
                shopMode={shopMode} 
              />
            </div>
          </div>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
