// src/pages/business/dashboardPages/buildTabs/buildSections/GallerySection.jsx
import React from "react";
import GalleryTab from "../GalleryTab.jsx";

export default function GallerySection({
  businessDetails,
  setBusinessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  handleFitChange,
  handleConfirmEdit,
  renderTopBar
}) {
  return (
    <>
      {/* ==== צד שמאל: הטופס ==== */}
      <div className="form-column">
        {/* שורת הלוגו/שם/טאבים */}
        {renderTopBar()}

        {/* כותרת הטופס */}
        <h2>🎨 עיצוב הגלריה</h2>

        {/* כפתור העלאת תמונות גלריה */}
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
          accept="image/*"
        />
        <button onClick={() => galleryInputRef.current.click()}>
          העלאת תמונות גלריה
        </button>

        {/* קומפוננטת העריכה עצמה */}
        <GalleryTab
          isForm
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          galleryTabInputRef={galleryInputRef}
          handleDeleteGalleryTabImage={handleDeleteImage}
          handleFitChange={handleFitChange}
          handleConfirmEdit={handleConfirmEdit}
        />
      </div>

      {/* ==== צד ימין: תצוגה (Preview) ==== */}
      <div className="preview-column">
        {/* רק renderTopBar */}
        {renderTopBar()}

        {/* התצוגה של הגלריה, ללא כפתורים וכותרות נוספות */}
        <GalleryTab
          isForm={false}
          businessDetails={businessDetails}
        />
      </div>
    </>
  );
}
