import React from "react";
import "../../build/Build.css";
import { dedupeByPreview } from "../../../../../utils/dedupe";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  setBusinessDetails,
  handleDeleteImage,
  handleEditImage,
  renderTopBar
}) {
  const maxItems    = 5;
  const gallery     = businessDetails.gallery || [];
  const limitedList = gallery.slice(0, maxItems);

  /* ---- העלאת תמונות ---- */
  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, maxItems - gallery.length);
    if (!files.length) return;
    e.target.value = null;                      // איפוס input

    // שלב 1 – תצוגה מוקדמת
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: dedupeByPreview([...prev.gallery, ...previews]),
    }));

    // שלב 2 – שליחת הקבצים לשרת
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("gallery", f));

      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        // עטוף כל URL לאובייקט אחד ואפס את הרשימה לגמרי
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          gallery: wrapped,                     // ⬅️  מחליף, לא ממזג
        }));
      } else {
        alert("העלאה נכשלה");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בהעלאה");
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  return (
    <>
      {renderTopBar()}
      <div className="form-column">
        <h3>העלאת תמונות לגלריה</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
        />

        <button
          onClick={() => galleryInputRef.current?.click()}
          type="button"
          className="save-btn"
          disabled={gallery.length >= maxItems}
        >
          {gallery.length >= maxItems ? "הגעת למקסימום" : "הוספת תמונות"}
        </button>

        <div className="thumbs">
          {limitedList.map((img, i) => (
            <div className="thumb" key={img.preview}>
              <img src={img.preview} alt={`gallery-${i}`} />
              <button onClick={() => handleEditImage(i)}>✏️</button>
              <button onClick={() => handleDeleteImage(i)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
