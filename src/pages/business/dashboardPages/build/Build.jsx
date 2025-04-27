// src/pages/business/dashboardPages/build/Build.jsx

import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// אלו ה־Section components שלך
import MainSection      from "../buildTabs/buildSections/MainSection.jsx";
import GallerySection   from "../buildTabs/buildSections/GallerySection.jsx";
import ReviewsSection   from "../buildTabs/buildSections/ReviewsSection.jsx";
import ShopSection      from "../buildTabs/buildSections/ShopSection.jsx";
import ChatSection      from "../buildTabs/buildSections/ChatSection.jsx";
import FaqSection       from "../buildTabs/buildSections/FaqSection.jsx";

// אלו ה־Preview components המקוריים
import MainTab          from "../buildTabs/MainTab.jsx";
import GalleryTab       from "../buildTabs/GalleryTab.jsx";
import ReviewsModule    from "../buildTabs/ReviewsModule.jsx";
import ShopAndCalendar  from "../buildTabs/shopAndCalendar/ShopAndCalendar.jsx";
import ChatTab          from "../buildTabs/ChatTab.jsx";
import FaqTab           from "../buildTabs/FaqTab.jsx";

import { useAuth } from "../../../../context/AuthContext";
import { BusinessServicesProvider } from "../../../../context/BusinessServicesContext";

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
    name: "", description: "", phone: "", logo: null,
    story: [], mainImages: [], gallery: [],
    reviews: [], faqs: [], services: [], messages: [],
    galleryFits: {}, /* … וכו' … */
  });

  // Refs ל־file inputs
  const logoInputRef       = useRef();
  const storyInputRef      = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef    = useRef();

  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          setBusinessDetails(prev => ({ ...prev, ...(res.data.business || res.data) }));
        }
      })
      .catch(console.error);
  }, []);

  // כל ה־handlers שלך כאן (קיצרתי להצגה)
  const handleInputChange         = ({ target: { name, value } }) => setBusinessDetails(p => ({ ...p, [name]: value }));
  const handleSave                = async () => { /* … */ };
  const handleMainImagesChange    = async e => { /* … */ };
  const handleLogoClick           = () => logoInputRef.current.click();
  const handleLogoChange          = async e => { /* … */ };
  const handleStoryUpload         = e => { /* … */ };
  const handleGalleryChange       = async e => { /* … */ };
  const handleDeleteImage         = i => { /* … */ };
  const handleFitChange           = (i,fit) => { /* … */ };
  const handleConfirmEdit         = () => console.log("שמרתי גלריה");

  // שורת הלוגו + כותרת + rating + טאבים עליונים
  const renderTopBar = () => (
    <div>
      {/* כאן תדביק את הלוגו, שם העסק, דירוג וכפתורי ה־Tabs */}
    </div>
  );

  return (
    <div className="build-wrapper">
      {/* ====== שורת הטאבים ====== */}
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

      {/* ====== ראשי ====== */}
      {currentTab === "ראשי" && (
        <>
          <div className="form-column">
            <MainSection
              businessDetails={businessDetails}
              handleInputChange={handleInputChange}
              handleLogoClick={handleLogoClick}
              handleLogoChange={handleLogoChange}
              handleStoryUpload={handleStoryUpload}
              handleSave={handleSave}
              showViewProfile={false}
              navigate={navigate}
              currentUser={currentUser}
              handleMainImagesChange={handleMainImagesChange}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <MainTab businessDetails={businessDetails} />
          </div>
        </>
      )}

      {/* ====== גלריה ====== */}
      {currentTab === "גלריה" && (
        <>
          <div className="form-column">
            <GallerySection
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              galleryInputRef={galleryInputRef}
              handleGalleryChange={handleGalleryChange}
              handleDeleteImage={handleDeleteImage}
              handleFitChange={handleFitChange}
              handleConfirmEdit={handleConfirmEdit}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <GalleryTab isForm={false} businessDetails={businessDetails} />
          </div>
        </>
      )}

      {/* ====== ביקורות ====== */}
      {currentTab === "ביקורות" && (
        <>
          <div className="form-column">
            <ReviewsSection
              reviews={businessDetails.reviews}
              setReviews={u => setBusinessDetails(p => ({ ...p, reviews: u }))}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <ReviewsModule
              reviews={businessDetails.reviews}
              setReviews={u => setBusinessDetails(p => ({ ...p, reviews: u }))}
              isPreview
            />
          </div>
        </>
      )}

      {/* ====== חנות / יומן ====== */}
      {currentTab === "חנות / יומן" && (
        <BusinessServicesProvider>
          <div className="form-column">
            <ShopSection
              services={businessDetails.services}
              setServices={s => setBusinessDetails(p => ({ ...p, services: s }))}
              handleSave={handleSave}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <ShopAndCalendar
              isPreview
              shopMode={businessDetails.services}
            />
          </div>
        </BusinessServicesProvider>
      )}

      {/* ====== צ'אט ====== */}
      {currentTab === "צ'אט עם העסק" && (
        <>
          <div className="form-column">
            <ChatSection
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <ChatTab isPreview businessDetails={businessDetails} />
          </div>
        </>
      )}

      {/* ====== שאלות ותשובות ====== */}
      {currentTab === "שאלות ותשובות" && (
        <>
          <div className="form-column">
            <FaqSection
              faqs={businessDetails.faqs}
              setFaqs={u => setBusinessDetails(p => ({ ...p, faqs: u }))}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <FaqTab isPreview faqs={businessDetails.faqs} />
          </div>
        </>
      )}
    </div>
  );
}
