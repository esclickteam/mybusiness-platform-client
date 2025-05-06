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

const GALLERY_MAX = 5;

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    category: "",
    city: "",
    logo: null,
    gallery: [],
    mainImages: [],
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

  const track = (p) => {
    pendingUploadsRef.current.push(p);
    p.finally(() => {
      pendingUploadsRef.current = pendingUploadsRef.current.filter(
        (x) => x !== p
      );
    });
    return p;
  };

  useEffect(() => {
    API.get("/business/my")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          const rawAddress = data.address;
          const city =
            typeof rawAddress === "string" ? rawAddress : rawAddress?.city || "";

          setBusinessDetails({
            city,
            ...data,
            logo: data.logo ? { preview: data.logo } : null,
            gallery: (data.gallery || []).map((url) => ({ preview: url })),
            mainImages: dedupeByPreview(
              (data.mainImages || []).map((url) => ({ preview: url, size: "full" }))
            ).slice(0, 5),
          });
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת נתונים:", err);
      });
  }, []);

  const updateBusinessDetails = (newData) => {
    setBusinessDetails((prev) => ({ ...prev, ...newData }));
  };

  const handleInputChange = ({ target: { name, value } }) =>
    updateBusinessDetails({ [name]: value });

  const handleLogoClick = () => logoInputRef.current?.click();

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    if (businessDetails.logo?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(businessDetails.logo.preview);
    }

    const preview = URL.createObjectURL(file);

    updateBusinessDetails({ logo: { file, preview } });

    const fd = new FormData();
    fd.append("logo", file);

    track(
      API.put("/business/my/logo", fd)
        .then((res) => {
          if (res.status === 200) {
            updateBusinessDetails({ logo: { preview: res.data.logo } });
          }
        })
        .catch((err) => {
          console.error("שגיאה בהעלאת הלוגו:", err);
        })
        .finally(() => URL.revokeObjectURL(preview))
    );
  };

  const handleMainImagesChange = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;

    const previews = files.map((f) => ({
      preview: URL.createObjectURL(f),
      file: f,
    }));

    setBusinessDetails((prev) => ({
      ...prev,
      mainImages: [...prev.mainImages, ...previews],
    }));

    setIsSaving(true);

    const fd = new FormData();
    files.forEach((f) => fd.append("main-images", f));

    try {
      const res = await API.put("/business/my/main-images", fd);
      if (res.status === 200) {
        const wrapped = res.data.mainImages.slice(0, 5).map((url) => ({ preview: url }));
        updateBusinessDetails({ mainImages: wrapped });
      }
    } catch (err) {
      console.error("שגיאה בהעלאת תמונות:", err);
    } finally {
      previews.forEach((p) => URL.revokeObjectURL(p.preview));
      setIsSaving(false);
    }
  };

  const handleDeleteMainImage = async (idx) => {
    const url = businessDetails.mainImages[idx]?.preview;
    if (!url) return;

    if (editIndex === idx) closePopup();

    try {
      const res = await API.delete(
        `/business/my/main-images/${encodeURIComponent(url)}`
      );
      if (res.status === 200) {
        updateBusinessDetails({ mainImages: res.data.mainImages.map((url) => ({ preview: url })) });
      }
    } catch (err) {
      console.error("❌ שגיאה במחיקת תמונה ראשית:", err);
    }
  };

  const openMainImageEdit = (idx) => {
    setEditIndex(idx);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setEditIndex(null);
    setIsPopupOpen(false);
  };

  const updateImageSize = (sizeType) => {
    if (editIndex === null) return;

    setBusinessDetails((prev) => ({
      ...prev,
      mainImages: prev.mainImages.map((img, i) =>
        i === editIndex ? { ...img, size: sizeType } : img
      ),
    }));

    closePopup();
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = null;

    const previews = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));

    console.log("New images to upload:", previews);

    const newGallery = [
      ...businessDetails.gallery.filter(
        (existingImage) =>
          !previews.some((newImage) => newImage.preview === existingImage.preview)
      ),
      ...previews,
    ];

    console.log("Filtered gallery:", newGallery);

    updateBusinessDetails({ gallery: newGallery });

    const fd = new FormData();
    files.forEach((f) => fd.append("gallery", f));

    track(
      API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (res.status === 200) {
            const wrapped = res.data.gallery
              .slice(0, GALLERY_MAX)
              .map((url) => ({ preview: url }));
            updateBusinessDetails({ gallery: wrapped });
          }
        })
        .finally(() => previews.forEach((p) => URL.revokeObjectURL(p.preview)))
        .catch((err) => console.error("Error during gallery upload:", err))
    );
  };

  const handleDeleteGalleryImage = async (idx) => {
    const url = businessDetails.gallery[idx]?.preview;
    if (!url) return;

    try {
      const res = await API.delete(
        `/business/my/gallery/${encodeURIComponent(url)}`
      );

      if (res.status === 200) {
        updateBusinessDetails({ gallery: res.data.gallery.map((url) => ({ preview: url })) });
      } else {
        console.warn("מחיקה נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה:", err);
    }
  };

  const handleEditImage = (idx) => {
    console.log("Edit gallery image:", idx);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all(pendingUploadsRef.current);

      await API.patch("/business/my", {
        name: businessDetails.name,
        category: businessDetails.category,
        description: businessDetails.description,
        phone: businessDetails.phone,
        email: businessDetails.email,
        address: {
          city: businessDetails.city,
        },
      });

      alert("✅ נשמר בהצלחה!");
      setShowViewProfile(true);
    } catch (err) {
      console.error("❌ שגיאה בשמירה:", err);
      alert("❌ שמירה נכשלה");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTopBar = () => {
    const avg =
      businessDetails.reviews.length
        ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) /
          businessDetails.reviews.length
        : 0;

    return (
      <div className="topbar-preview">
        <div className="logo-circle" onClick={handleLogoClick}>
          {businessDetails.logo?.preview ? (
            <img src={businessDetails.logo.preview} className="logo-img" />
          ) : (
            <span>לוגו</span>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={logoInputRef}
            onChange={handleLogoChange}
          />
        </div>

        <div className="name-rating">
          <h2>{businessDetails.name || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avg.toFixed(1)} / 5</span>
          </div>
        </div>

        {businessDetails.category && (
          <p className="preview-category">
            <strong>קטגוריה:</strong> {businessDetails.category}
          </p>
        )}

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
        {businessDetails.city && (
          <p className="preview-city">
            <strong>עיר:</strong> {businessDetails.city}
          </p>
        )}

        <hr className="divider" />

        <div className="tabs">
          {TABS.map((tab) => (
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
          handleEditImage={openMainImageEdit}
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
          handleEditImage={handleEditImage}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          setReviews={(r) => updateBusinessDetails({ reviews: r })}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "חנות / יומן" && (
        <ShopSection
          setBusinessDetails={updateBusinessDetails}
          handleSave={handleSave}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "צ'אט עם העסק" && (
        <ChatSection
          businessDetails={businessDetails}
          setBusinessDetails={updateBusinessDetails}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "שאלות ותשובות" && (
        <FaqSection
          faqs={businessDetails.faqs}
          setFaqs={(f) => updateBusinessDetails({ faqs: f })}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button type="button" onClick={() => updateImageSize("full")}>
              גודל מלא
            </button>
            <button type="button" onClick={() => updateImageSize("custom")}>
              גודל מותאם
            </button>
            <button type="button" onClick={closePopup}>
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
