import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

// Section components
import MainSection from "./buildSections/MainSection";
import GallerySection from "./buildSections/GallerySection";
import ReviewsSection from "./buildSections/ReviewsSection";
import ShopSection from "./buildSections/ShopSection";
import ChatSection from "./buildSections/ChatSection";
import FaqSection from "./buildSections/FaqSection";

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

  // state
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    description: "",
    phone: "",
    logo: null,
    story: [],
    gallery: [],
    services: [],
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
  const logoInputRef = useRef();
  const storyInputRef = useRef();
  const galleryInputRef = useRef();
  const galleryTabInputRef = useRef();
  const mainImagesInputRef = useRef();

  // fetch business data
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

  // common handlers
  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    const ALLOWED_KEYS = [
      "name","description","phone","logo","mainImages",
      "gallery","story","services","reviews","faqs",
      "messages","galleryTabImages","galleryCategories","fullGallery"
    ];
    const payload = {};
    Object.entries(businessDetails)
      .filter(([key]) => ALLOWED_KEYS.includes(key))
      .forEach(([key, value]) => { payload[key] = value; });
    try {
      const res = await API.patch("/business/my", payload);
      if (res.status === 200) {
        setBusinessDetails(prev => ({ ...prev, ...(res.data.business || res.data) }));
        setShowViewProfile(true);
        alert("✅ נשמר בהצלחה!");
      } else {
        alert("❌ שמירה נכשלה");
      }
    } catch {
      alert("❌ שגיאה בשמירה");
    }
  };

  const handleMainImagesChange = async e => {
    const files = Array.from(e.target.files).slice(0,5);
    if (!files.length) return;
    const preview = files.map(f => (f.preview = URL.createObjectURL(f), f));
    setBusinessDetails(prev => ({ ...prev, mainImages: preview }));
    const fd = new FormData(); preview.forEach(f => fd.append("mainImages", f));
    try {
      const res = await API.put("/business/my/main-images", fd, { withCredentials: true });
      if (res.status === 200) {
        setBusinessDetails(prev => ({ ...prev, mainImages: res.data.mainImages }));
        preview.forEach(f => URL.revokeObjectURL(f.preview));
      }
    } catch {
      alert("❌ שגיאה בהעלאת תמונות ראשיות");
    }
  };

  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    file.preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({ ...prev, logo: file }));
    const fd = new FormData(); fd.append("logo", file);
    try {
      const res = await API.put("/business/my/logo", fd, { withCredentials: true });
      if (res.status === 200) {
        setBusinessDetails(prev => ({ ...prev, logo: res.data.logo }));
        URL.revokeObjectURL(file.preview);
      }
    } catch {
      alert("❌ שגיאה בהעלאת הלוגו");
    }
  };

  const handleStoryUpload = e => {
    const newItems = Array.from(e.target.files).map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image",
      uploadedAt: Date.now()
    }));
    setBusinessDetails(prev => ({ ...prev, story: [...prev.story, ...newItems] }));
  };

  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files); if (!files.length) return;
    const preview = files.map(f => (f.preview = URL.createObjectURL(f), f));
    setBusinessDetails(prev => ({ ...prev, gallery: [...prev.gallery, ...preview] }));
    const fd = new FormData(); preview.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd, { withCredentials: true });
      if (res.status === 200) {
        setBusinessDetails(prev => ({ ...prev, gallery: res.data.gallery }));
        preview.forEach(f => URL.revokeObjectURL(f.preview));
      }
    } catch {
      alert("❌ שגיאה בהעלאת הגלריה");
    }
  };

  const handleDeleteImage = i => {
    const g = [...businessDetails.gallery];
    const fits = { ...businessDetails.galleryFits };
    const file = g.splice(i,1)[0];
    if (file?.name) delete fits[file.name];
    setBusinessDetails(prev => ({ ...prev, gallery: g, galleryFits: fits }));
  };

  const handleFitChange = (i,fit) => {
    const file = businessDetails.gallery[i]; if (!file) return;
    setBusinessDetails(prev => ({
      ...prev,
      galleryFits: { ...prev.galleryFits, [file.name]: fit }
    }));
  };

  const handleConfirmEdit = () => console.log("שמירת הגלריה");

  const renderTopBar = () => (
    <>
      {/* כאן תוסיף את הלוגו, שם, דירוג ושורת הטאבים העליונה */}
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
