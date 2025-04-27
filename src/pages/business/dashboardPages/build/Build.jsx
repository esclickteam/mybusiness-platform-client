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
    services: null,      // נשאר null עד שהמשתמש יבחר
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

  // create refs once and pass down to MainSection
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

  const handleSave               = async () => { /* … */ };
  const handleMainImagesChange   = async e   => { /* … */ };
  const handleLogoClick          = ()          => logoInputRef.current?.click();
  const handleLogoChange         = async e   => { /* … */ };
  const handleStoryUpload        = e           => storyInputRef.current?.click() /* or your logic */;
  const handleGalleryChange      = async e   => { /* … */ };
  const handleDeleteImage        = i           => { /* … */ };
  const handleFitChange          = (i, fit)    => { /* … */ };
  const handleConfirmEdit        = ()          => console.log("שמירת הגלריה");

  const renderTopBar = () => {
    const avgRating =
      businessDetails.reviews.length > 0
        ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
        : 0;

    return (
      <>
        {/* לוגו */}
        <div className="logo-circle" onClick={handleLogoClick}>
          {typeof businessDetails.logo === "string"
            ? <img src={businessDetails.logo} className="logo-img" />
            : businessDetails.logo?.preview
              ? <img src={businessDetails.logo.preview} className="logo-img" />
              : <span>לוגו</span>
          }
        </div>

        {/* שם ודירוג */}
        <div className="name-rating">
          <h2>{businessDetails.name || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avgRating.toFixed(1)} / 5</span>
          </div>
        </div>

        <hr className="divider" />

        {/* טאבים עליונים */}
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
