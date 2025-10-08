// src/pages/business/MainSection.jsx
import React, { useRef, useState } from "react";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import ALL_CATEGORIES from "../../../../../data/categories";
import ImageLoader from "@components/ImageLoader";

const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));

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
  renderTopBar
}) {
  const containerRef = useRef();
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  if (!businessDetails._id) return null;

  const wrappedMainImages = (businessDetails.mainImages || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.mainImageIds || [])[idx] || null
  }));

  const limitedMainImgs = dedupeByPreview(wrappedMainImages).slice(0, 6);
  const wrapSelectChange = name => option =>
    handleInputChange({ target: { name, value: option ? option.value : "" } });

  const {
    businessName = "",
    description = "",
    phone = "",
    email = "",
    category = "",
    address = {},
    logo = null
  } = businessDetails;
  const { city = "" } = address;

  // Delete logo
  async function handleDeleteLogo() {
    if (isSaving || isDeletingLogo) return;
    if (!window.confirm("Are you sure you want to delete the logo?")) return;
    try {
      setIsDeletingLogo(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/business/my/logo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error deleting logo: " + (error.error || response.statusText));
        setIsDeletingLogo(false);
        return;
      }

      handleInputChange({ target: { name: "logo", value: "" } });
      alert("Logo deleted successfully");
    } catch (err) {
      alert("Error deleting logo");
      console.error(err);
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
    transition: "0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  const inputFocus = {
    outline: "none",
    borderColor: "#6a11cb",
    boxShadow: "0 0 0 3px rgba(106,17,203,0.15)",
  };

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2 style={{ marginBottom: "1rem", fontWeight: "600", color: "#1e1e2f" }}>
          🎨 Edit Business Details
        </h2>

        {/* BUSINESS NAME */}
        <label>Business Name <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          placeholder="Enter business name"
          required
          disabled={isSaving}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, inputFocus)}
          onBlur={e => Object.assign(e.target.style, inputStyle)}
        />

        {/* DESCRIPTION */}
        <label style={{ marginTop: "0.75rem" }}>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          placeholder="Enter short description"
          disabled={isSaving}
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={e => Object.assign(e.target.style, inputFocus)}
          onBlur={e => Object.assign(e.target.style, inputStyle)}
        />

        {/* PHONE */}
        <label style={{ marginTop: "0.75rem" }}>Phone (US)</label>
        <PhoneInput
          country={"us"}
          onlyCountries={["us"]}
          value={phone?.replace("+", "")}
          onChange={val =>
            handleInputChange({ target: { name: "phone", value: "+" + val } })
          }
          disabled={isSaving}
          inputProps={{ name: "phone", required: true }}
          inputStyle={{
            ...inputStyle,
            paddingLeft: "50px",
          }}
          buttonStyle={{
            border: "none",
            background: "transparent",
          }}
        />

        {/* EMAIL */}
        <label style={{ marginTop: "0.75rem" }}>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          disabled={isSaving}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, inputFocus)}
          onBlur={e => Object.assign(e.target.style, inputStyle)}
        />

        {/* CATEGORY */}
        <label style={{ marginTop: "0.75rem" }}>
          Category <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="Select category"
          isClearable
          styles={{
            control: base => ({
              ...base,
              ...inputStyle,
              cursor: "pointer",
              boxShadow: "none",
              borderRadius: "10px",
              ":hover": { borderColor: "#6a11cb" },
            }),
            menu: base => ({
              ...base,
              borderRadius: "10px",
              zIndex: 9999,
            }),
          }}
        />

        {/* CITY */}
        <label style={{ marginTop: "0.75rem" }}>
          City <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="address.city"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city (e.g. New York)"
          required
          disabled={isSaving}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, inputFocus)}
          onBlur={e => Object.assign(e.target.style, inputStyle)}
        />

        {/* LOGO */}
        <label style={{ marginTop: "0.75rem" }}>Logo</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={handleLogoChange}
          disabled={isSaving}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="save-btn"
            onClick={() => logoInputRef.current?.click()}
            disabled={isSaving || isDeletingLogo}
          >
            Upload Logo
          </button>
          {logo && (
            <button
              type="button"
              className="delete-btn"
              onClick={handleDeleteLogo}
              disabled={isSaving || isDeletingLogo}
              title="Delete logo"
            >
              {isDeletingLogo ? "Deleting..." : "❌ Delete Logo"}
            </button>
          )}
        </div>

        {/* MAIN IMAGES */}
        <label style={{ marginTop: "0.75rem" }}>Main Images</label>
        <input
          type="file"
          name="main-images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
          disabled={isSaving}
        />
        <div className="gallery-preview" style={{ marginTop: "8px" }}>
          {limitedMainImgs.map(({ preview, publicId }, i) => (
            <div
              key={publicId || `preview-${i}`}
              className="gallery-item-wrapper image-wrapper"
              style={{ position: "relative" }}
            >
              <ImageLoader src={preview} alt="Main image" className="gallery-img" />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(publicId)}
                type="button"
                title="Delete"
                disabled={isSaving}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
          {limitedMainImgs.length < 6 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
              style={{
                width: "120px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                fontSize: "2rem",
                color: "#999",
                cursor: "pointer",
              }}
            >
              +
            </div>
          )}
        </div>

        {/* SAVE BUTTONS */}
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            marginTop: "1rem",
            padding: "10px 16px",
            background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "0.2s ease",
          }}
        >
          {isSaving ? "Saving..." : "💾 Save Changes"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            style={{
              marginTop: "0.5rem",
              background: "#f3f4f6",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px 16px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/business/${businessDetails._id}`)}
            disabled={isSaving}
          >
            👀 View Profile
          </button>
        )}
      </div>
    </>
  );
}
