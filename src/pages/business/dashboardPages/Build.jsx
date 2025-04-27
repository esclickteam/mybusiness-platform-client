
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
  "mainImages",   // תמונות לעמוד הראשי
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

useEffect(() => {
  API.get("/business/my")
    .then(res => {
      if (res.status === 200) {
        // הקובץ שהשרת מחזיר, יכול להיות ב־res.data או ב־res.data.business
        const data = res.data.business || res.data;

        // merge של המצב הישן עם המידע החדש
        setBusinessDetails(prev => ({
          ...prev,
          ...data
        }));
      }
    })
    .catch(err => {
      console.error("Error fetching business:", err);
    });
}, []);


const handleSave = async () => {
  try {
    // בונים payload רק מהשדות המותרים
    const payload = {};
    Object.entries(businessDetails)
      .filter(([key]) => ALLOWED_KEYS.includes(key))
      .forEach(([key, value]) => {
        if (key === "about") {
          // מיפוי about → description
          payload.description = value;
        } else if (key === "description") {
          payload.description = value;
        } else if (key === "phone") {
          payload.phone = value;
        } else if (key === "name") {
          payload.name = value;
        }
        // אם בעתיד נוסיף עוד שדות טקסט פשוטים – נטפל גם בהם כאן
      });

    console.log("📤 שולח JSON ל־API:", payload);

    const res = await API.patch("/business/my", payload, {
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 200) {
      alert("✅ נשמר בהצלחה!");
      // מיזוג ה־state הקודם עם האובייקט החדש שהשרת החזיר
      setBusinessDetails(prev => ({
        ...prev,
        ...(res.data.business || res.data)
      }));
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
  const mainImagesInputRef = useRef(null);

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

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // הוסף preview כדי להציג מיד
    file.preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({
      ...prev,
      logo: file,
    }));
  
    // בנה את ה-FormData עם המפתח "logo"
    const formData = new FormData();
    formData.append("logo", file);
  
    try {
      // שליחת הבקשה ללא Content-Type ידני
      const res = await API.put("/business/my/logo", formData, {
        withCredentials: true,   // במידה ומשתמשים בעוגיות לאימות
      });
  
      if (res.status === 200) {
        // עדכן את ה־state ל-URL שמתקבל מ-Cloudinary
        setBusinessDetails(prev => ({
          ...prev,
          logo: res.data.logo,
        }));
        URL.revokeObjectURL(file.preview);
      } else {
        console.error("❌ Error uploading logo: Status", res.status);
        alert("❌ לא הצלחנו להעלות את הלוגו");
      }
    } catch (err) {
      console.error("🔥 Error uploading logo:", err.response || err);
      alert("❌ שגיאה בהעלאת הלוגו. נסה שנית מאוחר יותר.");
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

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
  
    // 1. צור פריווי לכל קובץ
    const previewFiles = files.map(file => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
  
    // 2. עדכן state מיד לתצוגה (בלי הגבלה)
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...previewFiles],
    }));
  
    // 3. בנה את ה-FormData עם המפתח "gallery"
    const formData = new FormData();
    previewFiles.forEach(file => {
      formData.append("gallery", file);
    });
  
    try {
      // 4. שלח את הבקשה ללא Content-Type ידני, עם cookies אם צריך
      const res = await API.put("/business/my/gallery", formData, {
        withCredentials: true,
      });
  
      if (res.status === 200) {
        // 5. עדכן את ה-gallery לפי מה שהשרת החזיר
        setBusinessDetails(prev => ({
          ...prev,
          gallery: res.data.gallery,
        }));
        // 6. שחרר את ה-previews
        previewFiles.forEach(file => URL.revokeObjectURL(file.preview));
      } else {
        console.error("❌ Error uploading gallery: Status", res.status);
        alert("❌ לא הצלחנו להעלות את הגלריה");
      }
    } catch (err) {
      console.error("🔥 Error uploading gallery:", err.response || err);
      alert("❌ שגיאה בהעלאת הגלריה. נסה שנית מאוחר יותר.");
    }
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
  {typeof businessDetails.logo === "string" ? (
    // מקרה של URL מהענן
    <img src={businessDetails.logo} alt="לוגו" className="logo-img" />
  ) : businessDetails.logo?.preview ? (
    // מקרה של אובייקט File עם preview
    <img src={businessDetails.logo.preview} alt="לוגו" className="logo-img" />
  ) : (
    // אין לוגו עדיין
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
  name="logo"
  ref={logoInputRef}
  onChange={handleLogoChange}
  style={{ display: "none" }}
/>
<button onClick={handleLogoClick} className="upload-logo-btn">
  העלאת לוגו
</button>

<label>סטורי:</label>
<input type="file" multiple onChange={handleStoryUpload} />

{/* תמונות ראשיות לטאב “ראשי” (עד 5) */}
<label>תמונות לעמוד הראשי (עד 5):</label>
<input
  type="file"
  name="mainImages"
  multiple
  style={{ display: "none" }}
  ref={mainImagesInputRef}
  onChange={handleMainImagesChange}
/>
<button
  onClick={() => mainImagesInputRef.current.click()}
  className="upload-main-images-btn"
>
  העלאת תמונות לעמוד הראשי
</button>



<div className="gallery-preview">
  {businessDetails.gallery.map((item, i) => (
    <div
      key={i}
      className={`gallery-item-wrapper ${editIndex === i ? "editing" : ""}`}
      style={{ position: "relative" }} // חובה בשביל הצמדה לפנים
    >
      <div className="gallery-item">
        <img
          src={
            // אם זה URL מהשרת
            typeof item === "string"
              ? item
              // אחרת אובייקט File עם preview
              : item.preview
          }
          alt={`gallery-${i}`}
          className="gallery-img"
          style={{
            objectFit:
              typeof item === "string"
                ? businessDetails.galleryFits?.[item] || "cover"
                : businessDetails.galleryFits?.[item.name] || "cover",
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
      value={
        typeof item === "string"
          ? businessDetails.galleryFits[item] || "cover"
          : businessDetails.galleryFits[item.name] || "cover"
      }
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
