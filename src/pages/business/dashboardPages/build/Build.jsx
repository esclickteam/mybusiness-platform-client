import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// Section components
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

const Build = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    logo: null,
    story: [],
    gallery: [],
    mainImages: [],
    reviews: [],
    faqs: [],
  });

  const logoInputRef = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef = useRef();

  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          setBusinessDetails({
            ...data,
            story: (data.story || []).map(url => ({ preview: url })),
            gallery: (data.gallery || []).map(url => ({ preview: url })),
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
        name: businessDetails.name,
        description: businessDetails.description,
        phone: businessDetails.phone,
      });
      navigate(`/business/${currentUser.businessId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = null;

    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));

    setBusinessDetails(prev => ({
      ...prev,
      [type]: previews, // עדכון התמונות לפי סוג
    }));

    try {
      const fd = new FormData();
      files.forEach(f => fd.append(type, f));

      const res = await API.put(`/business/my/${type}`, fd);
      if (res.status === 200) {
        const wrapped = res.data[type].map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          [type]: wrapped, // עדכון ה-state עם ה-URLs החדשים
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
      : 0;
    return (
      <>
        <div className="logo-circle" onClick={() => logoInputRef.current?.click()}>
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
            onChange={e => handleImageUpload(e, "logo")}
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
          handleSave={handleSave}
          renderTopBar={renderTopBar}
          mainImagesInputRef={mainImagesInputRef}
        />
      )}

      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          galleryInputRef={galleryInputRef}
          handleGalleryChange={e => handleImageUpload(e, "gallery")}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "חנות / יומן" && (
        <ShopSection
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "צ'אט עם העסק" && (
        <ChatSection
          businessDetails={businessDetails}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "שאלות ותשובות" && (
        <FaqSection
          faqs={businessDetails.faqs}
          renderTopBar={renderTopBar}
        />
      )}
    </div>
  );
};

export default Build;
