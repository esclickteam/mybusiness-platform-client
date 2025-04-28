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
    story:       [],
    gallery:     [],
    mainImages:  [],
    reviews:     [],
    faqs:        [],
  });

  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef    = useRef();

  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          console.log("🚀 useEffect data:", data);
          setBusinessDetails({
            ...data,
            story:      (data.story      || []).map(url => ({ preview: url })),
            gallery:    (data.gallery    || []).map(url => ({ preview: url })),
            mainImages: (data.mainImages || []).map(url => ({ preview: url })),
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    try {
      await API.patch("/business/my", {
        name:        businessDetails.name,
        description: businessDetails.description,
        phone:       businessDetails.phone,
      });
      navigate(`/business/${currentUser.businessId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;
    const preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({ ...prev, logo: { file, preview } }));
    try {
      const fd = new FormData(); fd.append("logo", file);
      const res = await API.put("/business/my/logo", fd);
      if (res.status === 200) {
        setBusinessDetails(prev => ({ ...prev, logo: res.data.logo }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  

  // פונקציה בצד הלקוח לעדכון התמונות
const handleMainImagesChange = async (e) => {
  const files = Array.from(e.target.files || []).slice(0, 5);
  if (!files.length) return;
  e.target.value = null;

  // יצירת preview לכל תמונה חדשה
  const previews = files.map((f) => ({
    file: f,
    preview: URL.createObjectURL(f),
  }));

  setBusinessDetails((prev) => ({
    ...prev,
    mainImages: previews, // עדכון רק עם התמונות החדשות
  }));

  try {
    const fd = new FormData();
    files.forEach((f) => fd.append("mainImages", f));

    const res = await API.put("/business/my/main-images", fd);
    if (res.status === 200) {
      const wrapped = res.data.mainImages.map((url) => ({
        preview: url,
      }));
      setBusinessDetails((prev) => ({
        ...prev,
        mainImages: wrapped, // עדכון התמונות ב-state עם ה-URLs החדשים
      }));
    }
  } catch (err) {
    console.error(err);
  }
};

  
  

  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) return;
    e.target.value = null;
  
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...previews], // מוסיף את התמונות החדשות לתמונות הישנות
    }));
    console.log("🖼️ Gallery - לפני שליחה:", previews);
  
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("gallery", f));
  
      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        console.log("🖼️ Gallery מהשרת:", wrapped);
        setBusinessDetails(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...wrapped], // מוסיף את התמונות החדשות לתמונות הישנות
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };
  

  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
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
            >{tab}</button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleStoryUpload={handleStoryUpload}
          handleMainImagesChange={handleMainImagesChange}
          handleSave={handleSave}
          renderTopBar={renderTopBar}
          logoInputRef={logoInputRef}
          storyInputRef={storyInputRef}
          mainImagesInputRef={mainImagesInputRef}
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
