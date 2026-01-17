import React, { useRef, useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import ImageLoader from "@components/ImageLoader";
import CityAutocomplete from "@components/CityAutocomplete";
import CategoryAutocomplete from "@components/CategoryAutocomplete";

export default function MainSection({
  businessDetails = {},
  reviews = [],
  handleInputChange,
  handleMainImagesChange,
  handleDeleteImage,
  handleLogoChange,
  handleSave,
  showViewProfile,
  navigate,
  logoInputRef,
  mainImagesInputRef,
  isSaving,
  renderTopBar,
}) {
  const containerRef = useRef();
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  if (!businessDetails._id) return null;

  // ❌ לא dedupe – מציג בדיוק את מה שיש
  const mainImages = (businessDetails.mainImages || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.mainImageIds || [])[idx] || null,
  }));

  const limitedMainImgs = mainImages.slice(0, 6);

  const {
    businessName = "",
    description = "",
    phone = "",
    email = "",
    category = "",
    address = {},
    logo = null,
  } = businessDetails;

  const { city = "" } = address;

  async function handleDeleteLogo() {
    if (isSaving || isDeletingLogo) return;

    if (!window.confirm("Are you sure you want to delete the logo?")) return;

    try {
      setIsDeletingLogo(true);

      const response = await fetch("/api/business/my/logo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error deleting logo: " + (error.error || response.statusText));
        return;
      }

      handleInputChange({ target: { name: "logo", value: "" } });
      alert("Logo deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting logo");
    } finally {
      setIsDeletingLogo(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e3e6ed",
    fontSize: "1rem",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  return (
    <div
      className="main-section-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "start",
      }}
    >
      {/* RIGHT COLUMN — PREVIEW */}
      <div
        className="preview-column"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {renderTopBar?.()}

        <div
          className="preview-images"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px",
            marginTop: "1rem",
          }}
        >
          {limitedMainImgs.map(({ preview }, i) => (
            <div key={i} className="image-wrapper">
              <ImageLoader
                src={preview}
                alt="Main image"
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* LEFT COLUMN — FORM */}
      <div
        className="form-column"
        ref={containerRef}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", fontWeight: 600, textAlign: "center" }}>
          🎨 Edit Business Details
        </h2>

        {/* BUSINESS NAME */}
        <label>Business Name *</label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          disabled={isSaving}
          style={inputStyle}
        />

        {/* DESCRIPTION */}
        <label style={{ marginTop: "0.75rem" }}>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={3}
          disabled={isSaving}
          style={{ ...inputStyle, resize: "none" }}
        />

        {/* PHONE */}
        <label style={{ marginTop: "0.75rem" }}>Phone (US)</label>
        <PhoneInput
  country="us"
  enableSearch
  value={phone?.replace("+", "")}
  onChange={(val) =>
    handleInputChange({
      target: { name: "phone", value: "+" + val },
    })
  }
  inputStyle={{
    ...inputStyle,
    paddingLeft: "58px",
  }}
  buttonStyle={{
    border: "none",
    background: "transparent",
  }}
  dropdownStyle={{
    borderRadius: "12px",
  }}
  disabled={isSaving}
/>

        {/* EMAIL */}
        <label style={{ marginTop: "0.75rem" }}>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          disabled={isSaving}
          style={inputStyle}
        />

        {/* CATEGORY */}
        <label style={{ marginTop: "0.75rem" }}>Category *</label>
        <CategoryAutocomplete
          value={category}
          onChange={(val) =>
            handleInputChange({ target: { name: "category", value: val } })
          }
        />

        {/* CITY */}
        <label style={{ marginTop: "0.75rem" }}>City (USA)</label>
        <CityAutocomplete
          value={city}
          onChange={(val) =>
            handleInputChange({ target: { name: "address.city", value: val } })
          }
        />

        {/* LOGO */}
        <label style={{ marginTop: "0.75rem" }}>Logo</label>

        <input
          type="file"
          ref={logoInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleLogoChange}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={isSaving}
            style={{
              background: "linear-gradient(90deg,#6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Upload Logo
          </button>

          {logo?.preview && (
            <button
              type="button"
              onClick={handleDeleteLogo}
              disabled={isSaving || isDeletingLogo}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {isDeletingLogo ? "Deleting..." : "❌ Delete Logo"}
            </button>
          )}
        </div>

        {/* MAIN IMAGES */}
        <label style={{ marginTop: "0.75rem" }}>Main Images</label>

        <input
          type="file"
          multiple
          ref={mainImagesInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleMainImagesChange}
        />

        <div className="gallery-preview" style={{ marginTop: "10px" }}>
          {limitedMainImgs.map(({ preview, publicId }, i) => (
            <div key={i} style={{ display: "inline-block", position: "relative" }}>
              <ImageLoader src={preview} className="gallery-img" />
              <button
                onClick={() => handleDeleteImage(publicId)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  border: "none",
                }}
              >
                🗑️
              </button>
            </div>
          ))}

          {limitedMainImgs.length < 6 && (
            <div
              onClick={() => mainImagesInputRef.current?.click()}
              style={{
                width: "120px",
                height: "120px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                cursor: "pointer",
                color: "#888",
              }}
            >
              +
            </div>
          )}
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            marginTop: "1rem",
            padding: "10px 16px",
            background: "linear-gradient(90deg,#6a11cb 0%, #2575fc 100%)",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isSaving ? "Saving..." : "💾 Save Changes"}
        </button>

        {showViewProfile && (
  <button
    type="button"
    className="view-profile-btn"
    onClick={() => navigate(`/business/${businessDetails._id}`)}
  >
    👀 View Profile
  </button>
)}
      </div>
    </div>
  );
}
