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
  renderTopBar            // <-- ודא שצריך לקבל פה גם את renderTopBar
}) {
  return (
    <>
      {/* ==== צד שמאל: הטופס ==== */}
      <div className="form-column">
        {/* שורת הלוגו/שם/טאבים */}
        {renderTopBar()}

        <h2>🎨 עיצוב הגלריה</h2>

        {/* כבר אין כפתור "העלאת תמונות" כאן */}
        {/* הקומפוננטה עצמה ידאג להציג פלוסים + תמונות */}
        <GalleryTab
          isForm
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          galleryTabInputRef={galleryInputRef}
          handleDeleteGalleryTabImage={handleDeleteImage}
          handleFitChange={handleFitChange}
          handleConfirmEdit={handleConfirmEdit}
          handleGalleryChange={handleGalleryChange}
        />
      </div>

      {/* ==== צד ימין: תצוגה (Preview) ==== */}
      <div className="preview-column">
        {/* מוודאים שגם כאן נקרא renderTopBar */}
        {renderTopBar()}

        {/* אפשר להציג כותרת קטנה או להשאיר רק את הגלריה */}
        <h3 className="section-title">הגלריה שלנו</h3>

        {/* התצוגה של הגלריה בלבד */}
        <GalleryTab
          isForm={false}
          businessDetails={businessDetails}
        />
      </div>
    </>
  );
}
