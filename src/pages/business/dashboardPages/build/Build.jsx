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
    logo: null,
    story: [],
    gallery: [],
    mainImages: [],
    services: null,
    reviews: [],
    faqs: [],
    messages: []
  });

  // refs for file inputs
  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const mainImagesInputRef = useRef();

  // initial load
  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        const data = res.data.business || res.data;
        const wrappedMain  = (data.mainImages || []).map(url => ({ preview: url }));
        const wrappedStory = (data.story      || []).map(url => ({ preview: url }));
        setBusinessDetails({
          ...data,
          mainImages: wrappedMain,
          story:      wrappedStory
        });
      })
      .catch(console.error);
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  // save text fields and navigate to profile
  const handleSave = async () => {
    try {
      await API.put("/business/my", {
        name: businessDetails.name,
        description: businessDetails.description,
        phone: businessDetails.phone
      });
      navigate(`/business/${currentUser.businessId}`);
    } catch (err) {
      console.error("❌ Failed to save business details:", err);
      alert("שגיאה בשמירת הנתונים, נסה שוב");
    }
  };

  // logo upload
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;
    const previewUrl = URL.createObjectURL(file);
    setBusinessDetails(prev => ({ ...prev, logo: { file, preview: previewUrl } }));
    try {
      const fd = new FormData();
      fd.append("logo", file);
      const r = await API.put("/business/my/logo", fd);
      if (r.status === 200) {
        setBusinessDetails(prev => ({ ...prev, logo: r.data.logo }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // story upload
  const handleStoryUpload = async e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({ ...prev, story: previews }));
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("story", f));
      const r = await API.put("/business/my/story", fd);
      if (r.status === 200) {
        const wrapped = r.data.story.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({ ...prev, story: wrapped }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  // main images upload
  const handleMainImagesChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({ ...prev, mainImages: previews }));
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("mainImages", f));
      const r = await API.put("/business/my/main-images", fd);
      if (r.status === 200) {
        const wrapped = r.data.mainImages.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({ ...prev, mainImages: wrapped }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  // render top bar (logo, name, tabs, rating)
  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((s,r) => s + r.rating, 0) / businessDetails.reviews.length
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

  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
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
          handleGalleryChange={() => {}}
          handleDeleteImage={() => {}}
          handleFitChange={() => {}}
          handleConfirmEdit={() => {}}
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
