// src/pages/business/dashboardPages/buildTabs/buildSections/GallerySection.jsx
import React from "react";
import GalleryTab from "../GalleryTab.jsx";

export default function GallerySection({
  businessDetails,
  setBusinessDetails,
  galleryInputRef,
  handleDeleteImage,
  handleFitChange,
  handleConfirmEdit,
  renderTopBar
}) {
  return (
    <>
      {/* ==== צד שמאל: רק העורך (no top bar) ==== */}
      <div className="form-column">
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

      {/* ==== צד ימין: preview כולל top bar ==== */}
      <div className="preview-column">
        {renderTopBar()}
        <h3 className="section-title">הגלריה שלנו</h3>
        <GalleryTab
          isForm={false}
          businessDetails={businessDetails}
        />
      </div>
    </>
  );
}
