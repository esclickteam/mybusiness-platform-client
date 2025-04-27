// src/pages/business/dashboardPages/build/Build.jsx

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
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    logo: null,         // { file, preview } or string URL
    story: [],
    gallery: [],
    mainImages: [],     // array of { file?, preview }
    services: null,
    galleryFits: {},
    galleryTabImages: [],
    galleryTabFits: {},
    galleryCategories: [],
    fullGallery: [],
    storyFits: {},
    reviews: [],
    faqs: [],
    messages: []
  });

  // refs for hidden file inputs
  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const mainImagesInputRef = useRef();

  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          // wrap existing mainImages URLs into { preview }
          const wrappedMainImages = (data.mainImages || []).map(url => ({ preview: url }));
          setBusinessDetails(prev => ({
            ...prev,
            ...data,
            mainImages: wrappedMainImages
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    // … your save logic here …
  };

  const handleLogoClick = () =>
    logoInputRef.current?.click();

  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    // 1) Immediate preview
    const previewUrl = URL.createObjectURL(file);
    setBusinessDetails(prev => ({
      ...prev,
      logo: { file, preview: previewUrl }
    }));

    // 2) Upload to server
    try {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await API.put("/business/my/logo", formData);
      if (res.status === 200) {
        // server returns the URL string
        setBusinessDetails(prev => ({
          ...prev,
          logo: res.data.logo  // now string URL
        }));
      }
    } catch (err) {
      console.error("❌ Failed to upload logo:", err);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleStoryUpload = () =>
    storyInputRef.current?.click();

  const handleMainImagesChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;

    // Build previews for new files
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    // Merge with existing previews/URLs
    setBusinessDetails(prev => {
      const existing = prev.mainImages || [];
      // ensure all existing are objects with preview
      const existingObjs = existing.map(img =>
        typeof img === "string" ? { preview: img } : img
      );
      const combined = [...existingObjs, ...newPreviews].slice(0, 5);
      return { ...prev, mainImages: combined };
    });

    // Upload files to server
    try {
      const formData = new FormData();
      files.forEach(file => formData.append("mainImages", file));
      const res = await API.put("/business/my/main-images", formData);
      if (res.status === 200) {
        // server returns array of URLs
        const serverPreviews = res.data.mainImages.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: serverPreviews
        }));
      }
    } catch (err) {
      console.error("❌ Failed to upload main images:", err);
    } finally {
      // revoke only object URLs we created
      newPreviews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  const handleGalleryChange = async e => { /* … */ };
  const handleDeleteImage   = i     => { /* … */ };
  const handleFitChange     = (i,f) => { /* … */ };
  const handleConfirmEdit   = ()    => console.log("שמירת הגלריה");

  const renderTopBar = () => {
    const avgRating =
      businessDetails.reviews.length > 0
        ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) /
          businessDetails.reviews.length
        : 0;

    return (
      <>
        {/* Logo */}
        <div className="logo-circle" onClick={handleLogoClick}>
          {typeof businessDetails.logo === "string" ? (
            <img src={businessDetails.logo} className="logo-img" />
          ) : businessDetails.logo?.preview ? (
            <img src={businessDetails.logo.preview} className="logo-img" />
          ) : (
            <span>לוגו</span>
          )}
        </div>

        {/* Name & rating */}
        <div className="name-rating">
          <h2>{businessDetails.name || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avgRating.toFixed(1)} / 5</span>
          </div>
        </div>

        <hr className="divider" />

        {/* Tabs */}
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

  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleLogoClick={handleLogoClick}
          handleLogoChange={handleLogoChange}
          handleStoryUpload={handleStoryUpload}
          handleMainImagesChange={handleMainImagesChange}
          handleSave={handleSave}
          showViewProfile={showViewProfile}
          navigate={navigate}
          currentUser={currentUser}
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
          galleryInputRef={useRef()}
          handleGalleryChange={handleGalleryChange}
          handleDeleteImage={handleDeleteImage}
          handleFitChange={handleFitChange}
          handleConfirmEdit={handleConfirmEdit}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          setReviews={updated =>
            setBusinessDetails(prev => ({ ...prev, reviews: updated }))
          }
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
          setFaqs={updated =>
            setBusinessDetails(prev => ({
              ...prev,
              faqs: Array.isArray(updated) ? updated : []
            }))
          }
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}
    </div>
  );
}
