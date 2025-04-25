import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@api";
import { useAuth } from "../context/AuthContext";
import { BusinessServicesProvider } from "../context/BusinessServicesContext";
import MainTab from "../pages/business/dashboardPages/buildTabs/MainTab";
import GalleryTab from "../pages/business/dashboardPages/buildTabs/GalleryTab";
import ShopAndCalendar from "../pages/business/dashboardPages/buildTabs/shopAndCalendar/ShopAndCalendar";
import ReviewsModule from "../pages/business/dashboardPages/buildTabs/ReviewsModule";
import FaqTab from "../pages/business/dashboardPages/buildTabs/FaqTab";
import ChatTab from "../pages/business/dashboardPages/buildTabs/ChatTab";
import "../pages/business/dashboardPages/Build.css";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "חנות / יומן",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

export default function BusinessBuilderPage({ publicView = false }) {
  const { user: currentUser } = useAuth();
  const { businessId: routeId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [loading, setLoading] = useState(true);
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    about: "",
    phone: "",
    logo: null,
    story: [],
    gallery: [],
    services: [],
    reviews: [],
    faqs: [],
    messages: [],
  });

  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const storyInputRef = useRef(null);

  // 1️⃣ Fetch data
  useEffect(() => {
    const endpoint = publicView ? `/business/${routeId}` : "/business/my";
    API.get(endpoint)
      .then(({ data }) => setBusinessDetails(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [publicView, routeId]);

  // 2️⃣ Save (only in edit mode)
  const handleSave = async () => {
    if (publicView) return;
    try {
      const formData = new FormData();
      Object.entries(businessDetails).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          formData.append("logo", value);
        } else if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      const res = await API.put("/business/my", formData);
      if (res.status === 200) {
        alert("✅ נשמר בהצלחה!");
        navigate(`/business/${currentUser.businessId}`, { replace: true });
      } else {
        alert("❌ שמירה נכשלה");
      }
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בשמירה");
    }
  };

  // 3️⃣ Input handlers (example)
  const handleInputChange = e => {
    const { name, value } = e.target;
    setBusinessDetails(prev => ({ ...prev, [name]: value }));
  };
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setBusinessDetails(prev => ({ ...prev, logo: file }));
    }
  };
  const handleGalleryChange = e => {
    const files = Array.from(e.target.files);
    setBusinessDetails(prev => ({ ...prev, gallery: files }));
  };
  const handleStoryUpload = e => {
    const files = Array.from(e.target.files);
    const newStories = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      uploadedAt: Date.now(),
    }));
    setBusinessDetails(prev => ({ ...prev, story: [...prev.story, ...newStories] }));
  };

  if (loading) return <div className="loading-screen">🔄 טוען נתונים...</div>;
  if (!publicView && !currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="build-wrapper">
      {/* 📝 Form-column */}
      {!publicView && currentTab === "ראשי" && (
        <div className="form-column">
          <h2>🎨 עיצוב הכרטיס</h2>
          <label>שם העסק:</label>
          <input name="name" value={businessDetails.name} onChange={handleInputChange} />
          <label>אודות:</label>
          <textarea name="about" value={businessDetails.about} onChange={handleInputChange} />
          <label>טלפון:</label>
          <input name="phone" value={businessDetails.phone} onChange={handleInputChange} />
          <label>לוגו:</label>
          <input type="file" ref={logoInputRef} style={{ display: "none" }} onChange={handleLogoChange} />
          <button onClick={handleLogoClick}>העלאת לוגו</button>
          <label>גלריה:</label>
          <input
            type="file"
            multiple
            ref={galleryInputRef}
            style={{ display: "none" }}
            onChange={handleGalleryChange}
          />
          <button onClick={() => galleryInputRef.current.click()}>הוספת תמונות</button>
          <label>סטורי:</label>
          <input
            type="file"
            multiple
            ref={storyInputRef}
            style={{ display: "none" }}
            onChange={handleStoryUpload}
          />
          <button onClick={() => storyInputRef.current.click()}>הוספת סטורי</button>
          <button onClick={handleSave} className="save-button">💾 שמור</button>
        </div>
      )}

      {/* 👀 Preview-column */}
      <div className="preview-column">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={currentTab === tab ? "tab active" : "tab"}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {currentTab === "ראשי" && <MainTab businessDetails={businessDetails} />}
        {currentTab === "גלריה" && <GalleryTab isForm={false} businessDetails={businessDetails} />}
        {currentTab === "ביקורות" && (
          <ReviewsModule reviews={businessDetails.reviews} isPreview currentUser={currentUser} />
        )}
        {currentTab === "חנות / יומן" && (
          <BusinessServicesProvider>
            <ShopAndCalendar isPreview businessDetails={businessDetails} />
          </BusinessServicesProvider>
        )}
        {currentTab === "צ'אט עם העסק" && (
          <ChatTab businessDetails={businessDetails} setBusinessDetails={() => {}} isPreview />
        )}
        {currentTab === "שאלות ותשובות" && (
          <FaqTab faqs={businessDetails.faqs} setFaqs={() => {}} isPreview />
        )}
      </div>
    </div>
  );
}
