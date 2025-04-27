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
      <div className="form-column">
        {renderTopBar()}
        <h2>🎨 עיצוב הגלריה</h2>

        <input type="file" multiple style={{display:"none"}} ref={galleryInputRef} onChange={handleGalleryChange} accept="image/*" />
        <button onClick={() => galleryInputRef.current.click()}>העלאת תמונות גלריה</button>

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
      <div className="preview-column">
        <GalleryTab isForm={false} businessDetails={businessDetails} />
      </div>
    </>
  );
}
