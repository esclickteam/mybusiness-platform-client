
import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";
import MainTab from "./buildTabs/MainTab";
import GalleryTab from "./buildTabs/GalleryTab";
import ShopAndCalendar from './buildTabs/shopAndCalendar/ShopAndCalendar';
import ReviewsModule from "./buildTabs/ReviewsModule"; // 🔁 שינוי כאן
import FaqTab from "./buildTabs/FaqTab";
import ChatTab from "./buildTabs/ChatTab";
import { useAuth } from "../../../context/AuthContext";
import { BusinessServicesProvider } from "../../../context/BusinessServicesContext";



const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "חנות / יומן",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

const Build = () => {
  console.log("✅ Build.jsx נטען דרך הדשבורד");

  const { user: currentUser }  = useAuth();
  const navigate = useNavigate();


  // בתוך רכיב BuildBusinessPage.jsx

// רשימת השדות המותרת לעדכון
const ALLOWED_KEYS = [
  "name",
  "about",        // so we can map it to description
  "description",  // just in case
  "phone",
  "logo",
  "gallery",
  "story",
  "services",
  "reviews",
  "faqs",
  "messages",
  "galleryTabImages",
  "galleryCategories",
  "fullGallery",
];

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

// טען נתוני העסק בעת העלאה
useEffect(() => {
  API.get("/business/my").then(res => {
    if (res.status === 200) {
      setBusinessDetails(res.data.business || res.data);
    }
  });
}, []);

const handleSave = async () => {
  try {
    const formData = new FormData();

    // סינון ושילוח רק של השדות המותרנים
    Object.entries(businessDetails)
      .filter(([key]) => ALLOWED_KEYS.includes(key))
      .forEach(([key, value]) => {
        // קובץ לוגו
        if (key === "logo" && value instanceof File) {
          formData.append("logo", value);

        // מיפוי שדה about ל־description
        } else if (key === "about") {
          formData.append("description", value);

        // שדות מערכים בשילוח כ־JSON
        } else if (
          ["gallery", "story", "services", "reviews", "faqs", "messages", "galleryTabImages", "galleryCategories", "fullGallery"]
            .includes(key)
        ) {
          formData.append(key, JSON.stringify(value));

        // שדות טקסט/מספר
        } else if (value !== undefined && value !== null) {
          // description אם הגיע ישירות
          if (key === "description") {
            formData.append("description", value);
          } else {
            formData.append(key, value);
          }
        }
      });

    // ====== לוג של כל כניסות ה־FormData ======
    for (let [key, val] of formData.entries()) {
      console.log("🧩 formData entry:", key, val);
    }

    console.log("📤 שולח ל־API:", "/business/my");

    // שולח גם header של multipart/form-data
    const res = await API.put(
      "/business/my",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.status === 200) {
      alert("✅ נשמר בהצלחה!");
      const updated = res.data.business || res.data;
      setBusinessDetails(prev => ({ ...prev, ...updated }));
      setShowViewProfile(true);
    } else {
      alert("❌ שמירה נכשלה");
    }
  } catch (error) {
    console.error("❌ שגיאה בשמירה:", error);
    alert("❌ שגיאה בשמירה");
  }
};


  
      
        
  console.log("🔁 שינוי כפוי לבנייה מחדש");
  console.log("💥 שינוי כפוי כדי לנקות את Vercel");

          
  const [editIndex, setEditIndex] = useState(null);
  const [editGalleryTabIndex, setEditGalleryTabIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  const storyInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const galleryTabInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [shopMode, setShopMode] = useState(null);
  
  const avgRating =
    Array.isArray(businessDetails.reviews) && businessDetails.reviews.length > 0
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
      : 0;

  const activeStories = businessDetails.story.filter(
    (s) => Date.now() - s.uploadedAt < 1000 * 60 * 60 * 24
  );

  useEffect(() => {
    if (activeStoryIndex !== null) {
      setStoryProgress(0);
      const interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveStoryIndex((prevIndex) =>
              prevIndex + 1 < activeStories.length ? prevIndex + 1 : null
            );
            return 0;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [activeStoryIndex, activeStories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoClick = () => {
    if (logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setBusinessDetails((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const handleStoryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newStories = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      uploadedAt: Date.now(),
    }));
    setBusinessDetails((prev) => ({
      ...prev,
      story: [...prev.story, ...newStories],
    }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const existingKeys = businessDetails.gallery.map((f) => f.name + f.size);
    const newFiles = files.filter((f) => !existingKeys.includes(f.name + f.size));
    setBusinessDetails((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...newFiles].slice(0, 5),
    }));
  };

  const handleDeleteImage = (index) => {
    const updatedGallery = [...businessDetails.gallery];
    const updatedFits = { ...businessDetails.galleryFits };
    const fileToDelete = updatedGallery[index];
    updatedGallery.splice(index, 1);
    if (fileToDelete && fileToDelete.name) {
      delete updatedFits[fileToDelete.name];
    }
    setBusinessDetails((prev) => ({
      ...prev,
      gallery: updatedGallery,
      galleryFits: updatedFits,
    }));
  };

  const handleFitChange = (index, fit) => {
    const file = businessDetails.gallery[index];
    if (!file) return;
    setBusinessDetails((prev) => ({
      ...prev,
      galleryFits: {
        ...prev.galleryFits,
        [file.name]: fit,
      },
    }));
  };

  const handleConfirmEdit = () => {
    console.log("שמירת הגלריה בוצעה!");
  };

  const renderTopBar = () => {
    return (
      <>
        <div className="logo-circle" onClick={handleLogoClick}>
          {businessDetails.logo?.preview ? (
            <img src={businessDetails.logo.preview} alt="לוגו" className="logo-img" />
          ) : (
            <span>לוגו / פרופיל</span>
          )}
        </div>
        <div className="name-rating">
          <h2>{businessDetails.name || "שם העסק"}</h2>
          <div className="rating-badge">
            <span>{avgRating.toFixed(1)} / 5</span>
            <span className="star">★</span>
          </div>
        </div>
        <p className="about-text center-text">
          {businessDetails.description || "אודות העסק"}
        </p>
        <hr className="divider" />
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab ${currentTab === tab ? "active" : ""}`}
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
  <>
    <div className="form-column">
  <h2>🎨 עיצוב הכרטיס</h2>

  <label>שם העסק:</label>
  <input
    type="text"
    name="name"
    value={businessDetails.name}
    onChange={handleInputChange}
  />

  <label>תיאור:</label>
  <textarea
    name="description"
    value={businessDetails.description}
    onChange={handleInputChange}
  />

  <label>מספר טלפון:</label>
  <input
    type="text"
    name="phone"
    value={businessDetails.phone}
    onChange={handleInputChange}
    placeholder="050-1234567"
  />

  <label>לוגו:</label>
  <input
    type="file"
    ref={logoInputRef}
    onChange={handleLogoChange}
    style={{ display: "none" }}
  />
  <button onClick={handleLogoClick} className="upload-logo-btn">
    העלאת לוגו
  </button>

  <label>סטורי:</label>
  <input type="file" multiple onChange={handleStoryUpload} />

      {/* גלריה ראשית */}
<label>תמונות לעמוד הראשי (עד 5):</label>
<input
  type="file"
  multiple
  style={{ display: "none" }}
  ref={galleryInputRef}
  onChange={handleGalleryChange}
/>

<div className="gallery-preview">
{businessDetails.gallery.map((file, i) => (
  <div
    className={`gallery-item-wrapper ${editIndex === i ? "editing" : ""}`}
    key={i}
    style={{ position: "relative" }} // חובה בשביל הצמדה לפנים
  >
    <div className="gallery-item">
      <img
        src={URL.createObjectURL(file)}
        alt={`gallery-${i}`}
        className="gallery-img"
        style={{
          objectFit: businessDetails.galleryFits[file.name] || "cover",
        }}
      />
    </div>

    <button
      className="edit-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditIndex(i);
      }}
    >
      ✏️
    </button>

    <button
      className="delete-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDeleteImage(i);
      }}
    >
      🗑️
    </button>

    {/* ✅ כאן מוצג הפופאפ מעל התמונה */}
    {editIndex === i && (
      <div
        className="fit-select-popup global"
        style={{
          position: "absolute",
          bottom: "100%", // מעלה את הפופאפ
          left: 0,
          marginBottom: "8px",
          zIndex: 10,
        }}
      >
        <select
          value={businessDetails.galleryFits[file.name] || "cover"}
          onChange={(e) => handleFitChange(i, e.target.value)}
        >
          <option value="cover">חתוך (cover)</option>
          <option value="contain">מותאם (contain)</option>
        </select>
        <button className="confirm-btn" onClick={() => setEditIndex(null)}>
          ✔ שמור
        </button>
      </div>
    )}
  </div>
))}


  {[...Array(5 - businessDetails.gallery.length)].map((_, i) => (
    <div
      className="gallery-placeholder clickable"
      key={`placeholder-${i}`}
      onClick={() => galleryInputRef.current.click()}
    >
      +
    </div>
  ))}
</div>

<button onClick={handleSave} className="save-button">
        💾 שמור
      </button>

      {showViewProfile && (
        <button
          onClick={() => navigate(`/business/${currentUser.businessId}`)}
          className="view-profile-button"
          style={{
            marginTop: "1rem",
            padding: "8px 16px",
            background: "#00aaff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          👀 צפה בפרופיל
        </button>
      )}

    </div>

    <div className="preview-column">
      {renderTopBar()}
      <MainTab businessDetails={businessDetails} />
    </div>
  </>
)}


      {currentTab === "גלריה" && (
        <>
          <div className="form-column">
            <h2>🎨 עיצוב הגלריה</h2>
            <GalleryTab
              isForm={true}
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              galleryTabInputRef={galleryTabInputRef}
              editGalleryTabIndex={editGalleryTabIndex}
              setEditGalleryTabIndex={setEditGalleryTabIndex}
              handleDeleteGalleryTabImage={(i) => handleDeleteImage(i)}
              handleFitChange={(i, fit) => handleFitChange(i, fit)}
              handleConfirmEdit={handleConfirmEdit}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <GalleryTab isForm={false} businessDetails={businessDetails} />
          </div>
        </>
      )}

      {currentTab === "ביקורות" && (
        <>
          <div className="form-column">
            <ReviewsModule
              reviews={businessDetails.reviews}
              setReviews={(updated) => setBusinessDetails((prev) => ({ ...prev, reviews: updated }))}
              currentUser={currentUser}
              isPreview={false}
            />
          </div>
          <div className="preview-column">
            {renderTopBar()}
            <ReviewsModule
              reviews={businessDetails.reviews}
              setReviews={(updated) => setBusinessDetails((prev) => ({ ...prev, reviews: updated }))}
              currentUser={currentUser}
              isPreview
            />
          </div>
        </>
      )}

{currentTab === "חנות / יומן" && (
  <BusinessServicesProvider>
    <div className="form-column">
  
    <ShopAndCalendar
  isPreview={false}
  shopMode={shopMode}
  setShopMode={setShopMode}
  setBusinessDetails={setBusinessDetails}
/>


<button className="save-btn" onClick={handleSave}>שמור</button>


    </div>

    <div className="preview-column">
      {renderTopBar()}
      <div className="phone-preview-wrapper">
        <div className="phone-frame">
          <div className="phone-body">
          <ShopAndCalendar
  isPreview
  shopMode={shopMode}
/>
          </div>
        </div>
      </div>
    </div>
  </BusinessServicesProvider>
)}{currentTab === "צ'אט עם העסק" && (
  <>
    <div className="form-column">
      <ChatTab
        businessDetails={businessDetails}
        setBusinessDetails={setBusinessDetails}
        isPreview={false}
      />
    </div>
    <div className="preview-column">
      {renderTopBar()}
      <ChatTab
        businessDetails={businessDetails}
        setBusinessDetails={setBusinessDetails}
        isPreview={true}
      />
    </div>
  </>
)}


{currentTab === "שאלות ותשובות" && (
  <>
    <div className="form-column">
      <FaqTab
        faqs={businessDetails.faqs}
        setFaqs={(updated) =>
          setBusinessDetails((prev) => ({
            ...prev,
            faqs: Array.isArray(updated) ? updated : []
          }))
        }
        currentUser={currentUser}
        isPreview={false}
      />
    </div>
    <div className="preview-column">
      {renderTopBar()}
      <FaqTab
        faqs={businessDetails.faqs}
        setFaqs={(updated) =>
          setBusinessDetails((prev) => ({
            ...prev,
            faqs: Array.isArray(updated) ? updated : []
          }))
        }
        isPreview
        currentUser={currentUser}
      />
    </div>
  </>
)} {/* ✅ סוגר את התנאי בצורה תקינה */}

</div>
  );
}; // ← סוגר את const BuildBusinessPage = () => { … }

export default Build;
