import React, { useRef, useState } from "react";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import ALL_CATEGORIES from "../../../../../data/categories";
import ImageLoader from "@components/ImageLoader";
import CityAutocomplete from "@components/CityAutocomplete"; // ✅ חדש

const categoryOptions = ALL_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}));

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

  const wrappedMainImages = (businessDetails.mainImages || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.mainImageIds || [])[idx] || null,
  }));

  const limitedMainImgs = dedupeByPreview(wrappedMainImages).slice(0, 6);
  const wrapSelectChange = (name) => (option) =>
    handleInputChange({ target: { name, value: option ? option.value : "" } });

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

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastTwoReviews = sortedReviews.slice(0, 2);

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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
  direction: "ltr",      // ✅ כיוון טקסט משמאל לימין
  textAlign: "left",     // ✅ יישור הטקסט וה-placeholder לשמאל
};

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "start",
        width: "100%",
      }}
      className="main-section-grid"
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

        {/* Latest Reviews */}
        <div className="latest-reviews" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>⭐ Latest Reviews</h3>
          {lastTwoReviews.length === 0 ? (
            <p style={{ color: "#777" }}>No reviews yet</p>
          ) : (
            lastTwoReviews.map((review, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#fafafa",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {review.rating ? `⭐ ${review.rating}/5` : "No rating"}
                </div>
                <div>{review.opinion || "No review provided"}</div>
                <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                  {review.author || "Anonymous"} –{" "}
                  {review.date
                    ? new Date(review.date).toLocaleDateString("en-US")
                    : "Unknown date"}
                </div>
              </div>
            ))
          )}
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
        <h2
          style={{
            marginBottom: "1.5rem",
            fontWeight: "600",
            color: "#1e1e2f",
            textAlign: "center",
          }}
        >
          🎨 Edit Business Details
        </h2>

        {/* BUSINESS NAME */}
        <label>Business Name *</label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          placeholder="Enter business name"
          required
          disabled={isSaving}
          style={inputStyle}
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
        />

        {/* PHONE */}
        <label style={{ marginTop: "0.75rem" }}>Phone (US)</label>
        <PhoneInput
          country={"us"}
          onlyCountries={["us"]}
          value={phone?.replace("+", "")}
          onChange={(val) =>
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
        />

        {/* CATEGORY */}
        <label style={{ marginTop: "0.75rem" }}>Category *</label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find((o) => o.value === category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="Select category"
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              ...inputStyle,
              cursor: "pointer",
              borderRadius: "10px",
              boxShadow: "none",
              ":hover": { borderColor: "#6a11cb" },
            }),
          }}
        />

        {/* ✅ CITY AUTOCOMPLETE */}
        <label style={{ marginTop: "0.75rem" }}>City (United States only)</label>
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
            onClick={() => logoInputRef.current?.click()}
            disabled={isSaving || isDeletingLogo}
            style={{
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Upload Logo
          </button>
          {logo && (
            <button
              type="button"
              onClick={handleDeleteLogo}
              disabled={isSaving || isDeletingLogo}
              style={{
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "10px",
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
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
          disabled={isSaving}
        />
        <div className="gallery-preview" style={{ marginTop: "10px" }}>
          {limitedMainImgs.map(({ preview, publicId }, i) => (
            <div
              key={publicId || `preview-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                marginRight: "8px",
              }}
            >
              <ImageLoader src={preview} alt="Main image" className="gallery-img" />
              <button
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

        {/* SAVE BUTTON */}
        <button
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

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .main-section-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
