// src/pages/business/dashboardPages/Build.jsx

import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// Section components
import MainSection    from "../buildTabs/buildSections/MainSection";
import GallerySection from "../buildTabs/buildSections/GallerySection";
import ReviewsSection from "../buildTabs/buildSections/ReviewsSection";
import ShopSection    from "../buildTabs/buildSections/ShopSection";
import ChatSection    from "../buildTabs/buildTabs/ChatSection";
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

  const [currentTab, setCurrentTab]         = useState("ראשי");
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    logo: null,
    story: [],
    gallery: [],      // כאן יאוחסן מערך ה-URLs של התמונות
    reviews: [],
    faqs: [],
    // שדות נוספים…
  });

  // refs
  const logoInputRef   = useRef();
  const storyInputRef  = useRef();
  const galleryInputRef= useRef();

  // initial load
  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          setBusinessDetails(prev => ({
            ...prev,
            ...data,
            // עטיפה כדי שנוכל להראות preview לפני העלאה
            story:   (data.story   || []).map(url => ({ preview: url })),
            gallery: (data.gallery || []).map(url => ({ preview: url }))
          }));
        }
      })
      .catch(console.error);
  }, []);

  // handle input text changes
  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  // save name/desc/phone then navigate
  const handleSave = async () => {
    try {
      await API.patch("/business/my", {
        name:        businessDetails.name,
        description: businessDetails.description,
        phone:       businessDetails.phone
      });
      navigate(`/business/${currentUser.businessId}`);
    } catch (err) {
      console.error("❌ Failed to save business details:", err);
    }
  };

  // logo upload (כמופיע אצלך)
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = async e => {
    // … הקוד שלך בלי שינוי
  };

  // story upload (כמופיע אצלך)
  const handleStoryUpload = async e => {
    // … הקוד שלך בלי שינוי
  };

  // *** gallery upload ***
  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) return;
    e.target.value = null;

    // מיידי עדכון תצוגה מקומי (preview)
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...previews, ...prev.gallery].slice(0, 10)
    }));

    try {
      const fd = new FormData();
      files.forEach(f => fd.append("gallery", f));
      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        // השרת מחזיר מערך URL מלא
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({ ...prev, gallery: wrapped }));
      }
    } catch (err) {
      console.error("❌ Failed to upload gallery images:", err);
    } finally {
      // שחרור זכרון
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  // render top bar (tabs, logo, rating…)
  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((s,r) => s + r.rating, 0) / businessDetails.reviews.length
      : 0;
    return (
      <>
        {/* … כל הקוד שלך ללא שינוי … */}
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
          handleSave={handleSave}
          showViewProfile={showViewProfile}
          navigate={navigate}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          galleryInputRef={galleryInputRef}
          handleGalleryChange={handleGalleryChange}
          // אם תרצי – handleDeleteImage, handleFitChange, handleConfirmEdit
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          setReviews={r => setBusinessDetails(p => ({ ...p, reviews: r }))}
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
          setFaqs={f => setBusinessDetails(p => ({ ...p, faqs: f }))}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}
    </div>
  );
}
