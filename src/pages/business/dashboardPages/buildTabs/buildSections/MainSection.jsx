import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";

// Prepare sorted, deduped options
const CITIES = Array.from(new Set(rawCities)).sort((a, b) =>
  a.localeCompare(b, "he")
);
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions = CITIES.map(city => ({ value: city, label: city }));

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleMainImagesChange,
  handleSave,
  showViewProfile,
  navigate,
  currentUser,
  renderTopBar,
  logoInputRef,
  mainImagesInputRef,
  handleDeleteImage,
  isSaving
}) {
  const containerRef = useRef();
  const [isUploading, setIsUploading] = useState(false);  // State for spinner

  // dedupe & limit images
  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImgs = uniqueImages.slice(0, 5);

  // close react-select menus on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select will auto-close
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // wrap onChange to mimic native input event
  const wrapSelectChange = name => option =>
    handleInputChange({
      target: { name, value: option ? option.value : "" }
    });

  // Handle image selection and update immediately
  const handleMainImagesChangeWithSpinner = async e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;

    // 2) Prepare preview for uploading
    const previews = files.map(f => ({
      preview: URL.createObjectURL(f),
      file: f
    }));

    // 3) Immediately update the images in the gallery with preview
    setIsUploading(true);
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: [...prev.mainImages, ...previews]
    }));

    // 4) Upload to API
    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));
    try {
      const res = await API.put("/business/my/main-images", fd);
      if (res.status === 200) {
        // 5) Wrap URLs returned by the server and limit to 5
        const wrapped = res.data.mainImages.slice(0, 5).map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: wrapped
        }));
      } else {
        console.warn("Image upload failed:", res);
      }
    } catch (err) {
      console.error("Error during upload:", err);
    } finally {
      // 6) Clean up blob URLs
      previews.forEach(p => URL.revokeObjectURL(p.preview));
      // 7) Turn off the spinner after upload completes
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 Edit Business Details</h2>

        {/* Business Name */}
        <label>
          Business Name: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={businessDetails.name || ""}
          onChange={handleInputChange}
          placeholder="Enter business name"
          required
          disabled={isSaving}
        />

        {/* Description */}
        <label>Description:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="Enter short description"
          disabled={isSaving}
        />

        {/* Phone */}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          disabled={isSaving}
        />

        {/* Category */}
        <label>
          Category: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={
            categoryOptions.find(o => o.value === businessDetails.category) || null
          }
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="Select category"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "No matching categories" : null
          }
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
          }}
        />

        {/* City */}
        <label>
          City: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === businessDetails.city) || null}
          onChange={wrapSelectChange("city")}
          isDisabled={isSaving}
          placeholder="Select city"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "No matching cities" : null
          }
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
          }}
        />

        {/* Logo */}
        <label>Logo:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          disabled={isSaving}
        />
        <button
          type="button"
          className="save-btn"
          onClick={() => logoInputRef.current?.click()}
          disabled={isSaving}
        >
          Upload Logo
        </button>

        {/* Main Images */}
        <label>Main Images:</label>
        <input
          type="file"
          name="main-images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChangeWithSpinner}  
          disabled={isSaving}
        />
        <div className="gallery-preview">
          {limitedMainImgs.map((img, i) => (
            <div key={i} className="gallery-item-wrapper image-wrapper">
              <img
                src={img.preview}
                alt={`Main Image ${i + 1}`}
                className="gallery-img"
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(i)}
                type="button"
                title="Delete"
                disabled={isSaving}
              >
                🗑️
              </button>
            </div>
          ))}
          {limitedMainImgs.length < 5 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "💾 Save Changes"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
            disabled={isSaving}
          >
            👀 View Profile
          </button>
        )}
      </div>

      {/* Preview Column */}
      <div className="preview-column">
        {renderTopBar?.()}
        <div className="preview-images">
          {limitedMainImgs.map((img, i) => (
            <div key={i} className="image-wrapper">
              <img src={img.preview} alt={`Main Image ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {isUploading && <div className="spinner">🔄</div>}
    </>
  );
}
