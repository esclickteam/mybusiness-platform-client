// src/pages/business/MainSection.jsx
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
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
  currentUser,
  logoInputRef,
  mainImagesInputRef,
  isSaving,
  renderTopBar
}) {
  const containerRef = useRef();
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  // Cities from API
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoadingCities(true);
        const res = await fetch(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=5000"
        );
        const data = await res.json();
        const cities = (data.result?.records || [])
          .map(r => r["שם_ישוב"].trim())
          .filter(Boolean);

        const unique = Array.from(new Set(cities)).sort((a, b) =>
          a.localeCompare(b, "he")
        );
        setCityOptions(unique.map(c => ({ value: c, label: c })));
      } catch (err) {
        console.error("Error loading cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select auto-closes
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastTwoReviews = sortedReviews.slice(0, 2);

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

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 Edit Business Details</h2>

        <label>
          Business Name: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          placeholder="Enter business name"
          required
          disabled={isSaving}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          placeholder="Enter short description"
          disabled={isSaving}
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          disabled={isSaving}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          disabled={isSaving}
        />

        <label>
          Category: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="Type category"
          isClearable
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "No matching categories" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        <label>
          City: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === city) || null}
          onChange={wrapSelectChange("address.city")}
          isDisabled={isSaving || loadingCities}
          placeholder={loadingCities ? "Loading cities..." : "Type city"}
          isClearable
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "No matching cities" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        <label>Logo:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={handleLogoChange}
          disabled={isSaving}
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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

        <label>Main Images:</label>
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
        <div className="gallery-preview">
          {limitedMainImgs.map(({ preview, publicId }, i) => (
            <div key={publicId || `preview-${i}`} className="gallery-item-wrapper image-wrapper">
              <ImageLoader src={preview} alt="Main image" className="gallery-img" />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(publicId)}
                type="button"
                title="Delete"
                disabled={isSaving}
              >
                🗑️
              </button>
            </div>
          ))}
          {limitedMainImgs.length < 6 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "💾 Save Changes"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${businessDetails._id}`)}
            disabled={isSaving}
          >
            👀 View Profile
          </button>
        )}
      </div>

      <div className="preview-column">
        {renderTopBar?.()}

        <div className="preview-images">
          {limitedMainImgs.map(({ preview }, i) => (
            <div key={i} className="image-wrapper">
              <ImageLoader src={preview} alt="Main image" />
            </div>
          ))}
        </div>

        <div className="latest-reviews" style={{ marginTop: "1rem" }}>
          {lastTwoReviews.map((review, idx) => (
            <div
              key={idx}
              className="review-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Average Rating: {review.rating || "No rating"}
              </div>
              <div>
                <strong>Review:</strong> {review.opinion || "No review"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {review.date ? new Date(review.date).toLocaleDateString("en-US") : "Not specified"}
              </div>
              <div>
                <strong>By:</strong> {review.author || "Not specified"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
