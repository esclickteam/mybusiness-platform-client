import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

import MainSection from "../buildTabs/buildSections/MainSection";
import GallerySection from "../buildTabs/buildSections/GallerySection";
import ReviewsSection from "../buildTabs/buildSections/ReviewsSection";
import ShopSection from "../buildTabs/buildSections/ShopSection";
import ChatSection from "../buildTabs/buildSections/ChatSection";
import FaqSection from "../buildTabs/buildSections/FaqSection";

import { useAuth } from "../../../../context/AuthContext";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "חנות / יומן",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

// המקסימום המותרים בגלריה
const GALLERY_MAX = 5;

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    description: "",
    phone: "",
    category: "",
    address: { city: "" }, // ערך ברירת מחדל
    logo: null,
    gallery: [],
    galleryImageIds: [],
    mainImages: [],
    mainImageIds: [],
    reviews: [],
    faqs: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const logoInputRef = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef = useRef();
  const pendingUploadsRef = useRef([]);

  // עוזר ל-track עליות אסינכרוניות
  function extractPublicIdFromUrl(url) {
    const filename = url.split("/").pop().split("?")[0];
    return filename.substring(0, filename.lastIndexOf("."));
  }

  const track = p => {
    pendingUploadsRef.current.push(p);
    p.finally(() => {
      pendingUploadsRef.current = pendingUploadsRef.current.filter(x => x !== p);
    });
    return p;
  };

  // טעינת הנתונים הראשונית
  useEffect(() => {
    const savedBusinessDetails = JSON.parse(localStorage.getItem('businessDetails')) || {};
    setBusinessDetails(savedBusinessDetails);

    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;

          const rawAddress = data.address;
          const city = (typeof rawAddress === "object" && rawAddress !== null)
            ? rawAddress.city || ""   // אם address הוא אובייקט, ניגש ל־city
            : (typeof rawAddress === "string" ? rawAddress : ""); // אם address הוא מחרוזת או undefined, נשתמש בו ישירות או ב־""

          const urls = data.mainImages || [];
          const galleryUrls = data.gallery || [];

          const mainIds = Array.isArray(data.mainImageIds) && data.mainImageIds.length === urls.length
            ? data.mainImageIds
            : urls.map(extractPublicIdFromUrl);
          const galleryIds = Array.isArray(data.galleryImageIds) && data.galleryImageIds.length === galleryUrls.length
            ? data.galleryImageIds
            : galleryUrls.map(extractPublicIdFromUrl);

          setBusinessDetails(prev => ({
            ...prev,
            businessName: data.businessName || "",
            description: data.description || "",
            phone: data.phone || "",
            email: data.email || "",
            category: data.category || "",
            city,
            logo: data.logo || null,
            logoId: data.logoId || null,
            gallery: galleryUrls,
            galleryImageIds: galleryIds,
            mainImages: urls,
            mainImageIds: mainIds,
            faqs: data.faqs || [],
            reviews: data.reviews || [],
          }));
        }
      })
      .catch(console.error);
  }, []);

  // ===== INPUT CHANGE (supports nested fields) =====
  const handleInputChange = ({ target: { name, value } }) => {
    if (name.includes('.')) {
      // במידה ויש נקודה ב-name (למשל address.city), נחלק את השם לשני חלקים
      const [parent, child] = name.split('.');

      setBusinessDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value  // עדכון השדה בתוך האובייקט
        }
      }));
    } else {
      // עדכון שדה רגיל (ללא מבנים פנימיים)
      setBusinessDetails(prev => ({
        ...prev,
        [name]: value  // עדכון השדה
      }));
    }
  };

  // ===== LOGO UPLOAD =====
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    if (businessDetails.logo?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(businessDetails.logo.preview);
    }

    const preview = URL.createObjectURL(file);

    setBusinessDetails(prev => ({
      ...prev,
      logo: { file, preview }
    }));

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await API.put('/business/my/logo', formData);
      if (res.status === 200) {
        setBusinessDetails(prev => ({
          ...prev,
          logo: {
            preview: res.data.logo,
            publicId: res.data.logoId
          }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  // ===== MAIN IMAGES =====
  const handleMainImagesChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map(f => URL.createObjectURL(f));

    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));

    try {
      const res = await API.put("/business/my/main-images", fd);

      if (res.status === 200) {
        const urls = (res.data.mainImages || []).slice(0, 5);
        const ids = (res.data.mainImageIds || []).slice(0, 5);

        setBusinessDetails(prev => ({
          ...prev,
          mainImages: urls,
          mainImageIds: ids
        }));
      }
    } catch (err) {
      console.error("שגיאה בהעלאת תמונות ראשיות:", err);
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };

  // ===== DELETE IMAGE =====
  const handleDeleteMainImage = async publicId => {
    if (!publicId) return;

    try {
      const encodedId = encodeURIComponent(publicId);
      const res = await API.delete(`/business/my/main-images/${encodedId}`);

      if (res.status === 204) {
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: prev.mainImages.filter(img => img !== publicId),
          mainImageIds: prev.mainImageIds.filter(id => id !== publicId)
        }));
      } else {
        alert("שגיאה במחיקת תמונה");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקת תמונה");
    }
  };

  // ===== GALLERY =====
  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map(f => URL.createObjectURL(f));

    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));

    try {
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 200) {
        setBusinessDetails(prev => ({
          ...prev,
          gallery: res.data.gallery.slice(0, GALLERY_MAX),
          galleryImageIds: res.data.galleryImageIds.slice(0, GALLERY_MAX)
        }));
      } else {
        alert("❌ שגיאה בהעלאת גלריה");
      }
    } catch (err) {
      console.error("שגיאה בהעלאת גלריה:", err);
      alert("❌ שגיאה בהעלאת גלריה");
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };

  const handleDeleteGalleryImage = async publicId => {
    if (!publicId) return;

    try {
      const res = await API.delete(`/business/my/gallery/${encodeURIComponent(publicId)}`);

      if (res.status === 204) {
        setBusinessDetails(prev => ({
          ...prev,
          gallery: prev.gallery.filter(img => img !== publicId),
          galleryImageIds: prev.galleryImageIds.filter(id => id !== publicId)
        }));
      } else {
        alert("שגיאה במחיקת תמונה בגלריה");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקת תמונה בגלריה");
    }
  };

  // ===== SAVE =====
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await API.patch("/business/my", {
        businessName: businessDetails.businessName,
        category: businessDetails.category,
        description: businessDetails.description,
        phone: businessDetails.phone,
        email: businessDetails.email,
        address: { city: businessDetails.address.city }
      });

      if (res.status === 200) {
        setBusinessDetails(prev => ({
          ...prev,
          businessName: res.data.businessName || prev.businessName,
          address: { city: res.data.address.city || prev.address.city }
        }));
        localStorage.setItem('businessDetails', JSON.stringify(res.data));
        alert("✅ נשמר בהצלחה!");
      }
    } catch (err) {
      console.error("❌ שגיאה בשמירה:", err);
      alert("❌ שמירה נכשלה");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
      : 0;

    return (
      <div className="topbar-preview">
        {/* לוגו */}
        <div className="logo-circle" onClick={handleLogoClick}>
          {businessDetails.logo?.preview
            ? <img src={businessDetails.logo.preview} className="logo-img" />
            : <span>לוגו</span>}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={logoInputRef}
            onChange={handleLogoChange}
          />
        </div>

        {/* שם העסק + דירוג */}
        <div className="name-rating">
          <h2>{businessDetails.businessName || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avg.toFixed(1)} / 5</span>
          </div>
        </div>

        {/* קטגוריה */}
        {businessDetails.category && (
          <p className="preview-category">
            <strong>קטגוריה:</strong> {businessDetails.category}
          </p>
        )}

        {/* תיאור וטלפון */}
        {businessDetails.description && (
          <p className="preview-description">
            <strong>תיאור:</strong> {businessDetails.description}
          </p>
        )}
        {businessDetails.phone && (
          <p className="preview-phone">
            <strong>טלפון:</strong> {businessDetails.phone}
          </p>
        )}
        {businessDetails.address.city && (
          <p className="preview-city">
            <strong>עיר:</strong> {businessDetails.address.city}
          </p>
        )}

        <hr className="divider" />

        {/* כפתורי טאבים */}
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              className={`tab ${tab === currentTab ? "active" : ""}`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleMainImagesChange={handleMainImagesChange}
          handleDeleteImage={handleDeleteMainImage}
          handleEditImage={setEditIndex}
          handleSave={handleSave}
          showViewProfile={showViewProfile}
          navigate={navigate}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
          logoInputRef={logoInputRef}
          mainImagesInputRef={mainImagesInputRef}
          isSaving={isSaving}
        />
      )}

      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          galleryInputRef={galleryInputRef}
          handleGalleryChange={handleGalleryChange}
          handleDeleteImage={handleDeleteGalleryImage}
          handleEditImage={() => {}}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          setReviews={r => setBusinessDetails(prev => ({ ...prev, reviews: r }))}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "חנות / יומן" && (
        <ShopSection
          setBusinessDetails={setBusinessDetails}
          handleSave={handleSave}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "צ'אט עם העסק" && (
        <ChatSection
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "שאלות ותשובות" && (
        <FaqSection
          faqs={businessDetails.faqs}
          setFaqs={f => setBusinessDetails(prev => ({ ...prev, faqs: f }))}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button type="button" onClick={() => updateImageSize("full")}>גודל מלא</button>
            <button type="button" onClick={() => updateImageSize("custom")}>גודל מותאם</button>
            <button type="button" onClick={() => setIsPopupOpen(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
