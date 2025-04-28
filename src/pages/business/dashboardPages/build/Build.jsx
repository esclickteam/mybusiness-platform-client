/* Build.jsx – full, working version */

import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// Section components
import MainSection    from "../buildTabs/buildSections/MainSection";
import GallerySection from "../buildTabs/buildSections/GallerySection";
import ReviewsSection from "../buildTabs/buildSections/ReviewsSection";
import ShopSection    from "../buildTabs/buildSections/ShopSection";
import ChatSection    from "../buildTabs/buildSections/ChatSection";
import FaqSection     from "../buildTabs/buildSections/FaqSection";

import { useAuth } from "../../../../context/AuthContext";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "חנות / יומן",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    name:        "",
    description: "",
    phone:       "",
    logo:        null,
    gallery:     [],
    mainImages:  [],
    reviews:     [],
    faqs:        [],
  });

  const [isSaving, setIsSaving] = useState(false);

  /* ───── refs & helpers ───── */
  const logoInputRef       = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef    = useRef();
  const pendingUploadsRef  = useRef([]);

  const track = p => {
    pendingUploadsRef.current.push(p);
    p.finally(() => {
      pendingUploadsRef.current = pendingUploadsRef.current.filter(x => x !== p);
    });
    return p;
  };

  /* ───── initial data ───── */
  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          setBusinessDetails({
            ...data,
            gallery:    (data.gallery    || []).map(url => ({ preview: url })),
            mainImages: (data.mainImages || []).map(url => ({ preview: url })),
          });
        }
      })
      .catch(console.error);
  }, []);

  /* ───── input handlers ───── */
  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  /* logo upload */
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    const preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({ ...prev, logo: { file, preview } }));

    const fd = new FormData();
    fd.append("logo", file);
    track(
      API.put("/business/my/logo", fd)
        .then(res => {
          if (res.status === 200) {
            setBusinessDetails(prev => ({ ...prev, logo: res.data.logo }));
          }
        })
        .finally(() => URL.revokeObjectURL(preview))
        .catch(console.error)
    );
  };

  /* main images upload */
  const handleMainImagesChange = e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;
  
    setBusinessDetails(prev => {
      // 1) צור אובייקטי preview חדשים
      const newItems = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
  
      // 2) הוסף אותם על למה שהיה קודם, וחתוך עד 5
      const updated = [...prev.mainImages, ...newItems].slice(0, 5);
  
      // 3) בניית FormData (שם השדה נשאר "main-images")
      const fd = new FormData();
      updated.forEach(item => {
        if (item.file) fd.append("main-images", item.file);
      });
  
      // 4) שליחה אופטימיסטית
      track(
        API.put("/business/my/main-images", fd)
          .then(res => {
            if (res.status === 200) {
              // העדכון הרשמי מהשרת כולל כל ה-URLs הישנים + חדשים
              const wrapped = res.data.mainImages.map(url => ({ preview: url }));
              setBusinessDetails(p => ({ ...p, mainImages: wrapped }));
            }
          })
          .catch(console.error)
          .finally(() => {
            // תשחרר מקום בזיכרון
            newItems.forEach(item => URL.revokeObjectURL(item.preview));
          })
      );
  
      // 5) עדכון אופטימיסטי של ה-state
      return { ...prev, mainImages: updated };
    });
  };
  

  /* gallery upload */
  const handleGalleryChange = e => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) return;
    e.target.value = null;
  
    // יצירת פריוויים זמניים
    const previews = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f)
    }));
  
    // עדכון אופטימיסטי: מציג את היעד הנוכחי + החדשים
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...previews]
    }));
  
    // בניית FormData
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
  
    // שליחה ל-API
    track(
      API.put("/business/my/gallery", fd)
        .then(res => {
          if (res.status === 200) {
            // עטיפת ה-URLs שהשרת החזיר
            const wrapped = res.data.gallery.map(url => ({ preview: url }));
            // החלפה מלאה של הגלריה בנתונים מהשרת
            setBusinessDetails(prev => ({
              ...prev,
              gallery: wrapped
            }));
          }
        })
        .catch(console.error)
        .finally(() => {
          // שחרור זיכרון של ה-Object URLs הזמניים
          previews.forEach(p => URL.revokeObjectURL(p.preview));
        })
    );
  };
  

  /* save profile */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all(pendingUploadsRef.current);
      await API.patch("/business/my", {
        name:        businessDetails.name,
        description: businessDetails.description,
        phone:       businessDetails.phone,
      });
      navigate(`/business/${currentUser.businessId}`);
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בשמירה");
    } finally {
      setIsSaving(false);
    }
  };

  /* top bar rendering */
  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((s, r) => s + r.rating, 0) / businessDetails.reviews.length
      : 0;

    return (
      <>
        <div className="logo-circle" onClick={handleLogoClick}>
          {typeof businessDetails.logo === "string" ? (
            <img src={businessDetails.logo} className="logo-img" />
          ) : businessDetails.logo?.preview ? (
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

        <hr className="divider" />

        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tab ${tab === currentTab ? "active" : ""}`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </>
    );
  };

  /* render */
  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleMainImagesChange={handleMainImagesChange}
          handleSave={handleSave}
          renderTopBar={renderTopBar}
          logoInputRef={logoInputRef}
          mainImagesInputRef={mainImagesInputRef}
          isSaving={isSaving}
        />
      )}
      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          galleryInputRef={galleryInputRef}
          handleGalleryChange={handleGalleryChange}
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
    </div>
  );
}
