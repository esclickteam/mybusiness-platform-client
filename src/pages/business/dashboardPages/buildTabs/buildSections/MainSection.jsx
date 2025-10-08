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

  // ערים מה־API
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
        console.error("שגיאה בטעינת ערים:", err);
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

  // מחיקת לוגו
  async function handleDeleteLogo() {
    if (isSaving || isDeletingLogo) return;
    if (!window.confirm("אתה בטוח שברצונך למחוק את הלוגו?")) return;
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
        alert("שגיאה במחיקת הלוגו: " + (error.error || response.statusText));
        setIsDeletingLogo(false);
        return;
      }

      handleInputChange({ target: { name: "logo", value: "" } });
      alert("הלוגו נמחק בהצלחה");
    } catch (err) {
      alert("שגיאה במחיקת הלוגו");
      console.error(err);
    } finally {
      setIsDeletingLogo(false);
    }
  }

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 עריכת פרטי העסק</h2>

        <label>
          שם העסק: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          placeholder="הכנס שם העסק"
          required
          disabled={isSaving}
        />

        <label>תיאור:</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר"
          disabled={isSaving}
        />

        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
          disabled={isSaving}
        />

        <label>אימייל:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="הכנס מייל"
          disabled={isSaving}
        />

        <label>
          קטגוריה: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="הקלד קטגוריה"
          isClearable
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "אין קטגוריות מתאימות" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        <label>
          עיר: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === city) || null}
          onChange={wrapSelectChange("address.city")}
          isDisabled={isSaving || loadingCities}
          placeholder={loadingCities ? "טוען ערים..." : "הקלד עיר"}
          isClearable
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "אין ערים מתאימות" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        <label>לוגו:</label>
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
            העלאת לוגו
          </button>
          {logo && (
            <button
              type="button"
              className="delete-btn"
              onClick={handleDeleteLogo}
              disabled={isSaving || isDeletingLogo}
              title="מחק לוגו"
            >
              {isDeletingLogo ? "מוחק..." : "❌ מחק לוגו"}
            </button>
          )}
        </div>

        <label>תמונות ראשיות:</label>
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
              <ImageLoader src={preview} alt="תמונה ראשית" className="gallery-img" />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(publicId)}
                type="button"
                title="מחיקה"
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
          {isSaving ? "שומר..." : "💾 שמור שינויים"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${businessDetails._id}`)}
            disabled={isSaving}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      <div className="preview-column">
        {renderTopBar?.()}

        <div className="preview-images">
          {limitedMainImgs.map(({ preview }, i) => (
            <div key={i} className="image-wrapper">
              <ImageLoader src={preview} alt="תמונה ראשית" />
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
                דירוג ממוצע: {review.rating || "אין דירוג"}
              </div>
              <div>
                <strong>חוות דעת:</strong> {review.opinion || "אין חוות דעת"}
              </div>
              <div>
                <strong>תאריך:</strong>{" "}
                {review.date ? new Date(review.date).toLocaleDateString("he-IL") : "לא צוין"}
              </div>
              <div>
                <strong>מאת:</strong> {review.author || "לא צוין"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
