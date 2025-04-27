import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// Section components
import MainSection    from "../buildTabs/buildSections/MainSection.jsx";
import GallerySection from "../buildTabs/buildSections/GallerySection.jsx";
import ReviewsSection from "../buildTabs/buildSections/ReviewsSection.jsx";
import ShopSection    from "../buildTabs/buildSections/ShopSection.jsx";
import ChatSection    from "../buildTabs/buildSections/ChatSection.jsx";
import FaqSection     from "../buildTabs/buildSections/FaqSection.jsx";

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
    name: "", description: "", phone: "",
    logo: null, story: [], gallery: [], services: [],
    galleryFits: {}, galleryTabImages: [], galleryTabFits: {},
    galleryCategories: [], fullGallery: [], storyFits: {},
    reviews: [], faqs: [], messages: []
  });

  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const galleryInputRef    = useRef();
  const galleryTabInputRef = useRef();
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

  const handleSave = async () => { /* … */ };
  const handleMainImagesChange = async e => { /* … */ };
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = async e => { /* … */ };
  const handleStoryUpload = e => { /* … */ };
  const handleGalleryChange = async e => { /* … */ };
  const handleDeleteImage = i => { /* … */ };
  const handleFitChange = (i, fit) => { /* … */ };
  const handleConfirmEdit = () => console.log("שמירת הגלריה");

  const renderTopBar = () => (
    <>
      {/* לוגו, שם ושורת טאבים */}
    </>
  );

  return (
    <div className="build-wrapper">
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={tab === currentTab ? "active" : ""}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleLogoClick={handleLogoClick}
          handleLogoChange={handleLogoChange}
          handleStoryUpload={handleStoryUpload}
          handleSave={handleSave}
          showViewProfile={showViewProfile}
          navigate={navigate}
          currentUser={currentUser}
          handleMainImagesChange={handleMainImagesChange}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          galleryInputRef={galleryInputRef}
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
          shopMode={businessDetails.services}
          setShopMode={mode => setBusinessDetails(prev => ({ ...prev, services: mode }))}
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
          setFaqs={updated => setBusinessDetails(prev => ({ ...prev, faqs: Array.isArray(updated) ? updated : [] }))}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}
    </div>
  );
}
