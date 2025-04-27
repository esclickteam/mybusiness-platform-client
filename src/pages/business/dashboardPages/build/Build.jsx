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

  const [currentTab, setCurrentTab]       = useState("ראשי");
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    logo: null,
    story: [],
    gallery: [],
    mainImages: [],
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

  // refs for file inputs
  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const mainImagesInputRef = useRef();

  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          setBusinessDetails(prev => ({ ...prev, ...data }));
        }
      })
      .catch(console.error);
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    // … your save logic here
  };

  const handleLogoClick = () =>
    logoInputRef.current?.click();

  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    // immediate preview
    const previewUrl = URL.createObjectURL(file);
    setBusinessDetails(prev => ({
      ...prev,
      logo: { file, preview: previewUrl }
    }));

    e.target.value = null;

    // upload to server
    try {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await API.put("/business/my/logo", formData);
      if (res.status === 200) {
        setBusinessDetails(prev => ({
          ...prev,
          logo: res.data.logo
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
    const files = Array.from(e.target.files).slice(0, 5);
    if (!files.length) return;

    // build lists of files to upload
    const existingFiles = businessDetails.mainImages
      .filter(img => img.file instanceof File)
      .map(img => img.file);

    // take up to remaining slots
    const slotsLeft = 5 - existingFiles.length;
    const newFiles = files.slice(0, slotsLeft);

    // prepare previews
    const newPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    // update state immediately
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: [
        ...prev.mainImages,
        ...newPreviews
      ].slice(0, 5)
    }));

    e.target.value = null;

    // upload all files
    try {
      const formData = new FormData();
      [...existingFiles, ...newFiles].forEach(file =>
        formData.append("mainImages", file)
      );
      const res = await API.put("/business/my/main-images", formData);
      if (res.status === 200) {
        // server returns array of URLs
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: res.data.mainImages
        }));
      }
    } catch (err) {
      console.error("❌ Failed to upload main images:", err);
    } finally {
      // revoke only the object URLs we created
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
        <div className="logo-circle" onClick={handleLogoClick}>
          {typeof businessDetails.logo === "string" ? (
            <img src={businessDetails.logo} className="logo-img" />
          ) : businessDetails.logo?.preview ? (
            <img src={businessDetails.logo.preview} className="logo-img" />
          ) : (
            <span>לוגו</span>
          )}
        </div>

        <div className="name-rating">
          <h2>{businessDetails.name || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avgRating.toFixed(1)} / 5</span>
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
          setReviews={updated => setBusinessDetails(prev => ({ ...prev, reviews: updated }))}
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
