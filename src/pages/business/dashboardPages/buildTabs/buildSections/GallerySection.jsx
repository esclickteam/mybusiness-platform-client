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
}) {
  return (
    <>
      {/* ==== צד שמאל: הטופס ==== */}
      <div className="form-column">
        <h2>🎨 עיצוב הגלריה</h2>

        {/* קומפוננטת העריכה עצמה (כוללת את הפלוסים ל־placeholders) */}
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
        <h3 className="section-title">הגלריה שלנו</h3>
        <GalleryTab
          isForm={false}
          businessDetails={businessDetails}
        />
      </div>
    </>
  );
}
