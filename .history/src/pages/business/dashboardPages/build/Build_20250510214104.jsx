import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

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

// המקסימום המותרים בגלריה
const GALLERY_MAX = 5;

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",  // שם העסק
  description: "",    // תיאור העסק
  phone: "",          // טלפון
  category: "",       // קטגוריה
  address: { city: "" }, // ערך ברירת מחדל עבור address (עיר)
  logo: null,         // לוגו
  gallery: [],        // גלריה
  galleryImageIds: [], // IDs של תמונות בגלריה
  mainImages: [],     // תמונות ראשיות
  mainImageIds: [],   // IDs של תמונות ראשיות
  reviews: [],        // ביקורות
  faqs: [],           // שאלות ותשובות
});
  

  

  const [isSaving, setIsSaving]       = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);

  const [editIndex, setEditIndex]     = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const logoInputRef       = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef    = useRef();
  const pendingUploadsRef  = useRef([]);

  // עוזר ל-track עליות אסינכרוניות
  // Helper above your component
function extractPublicIdFromUrl(url) {
  // מניחים שה‐URL נגמר ב־<publicId>.<format>?… או ב־<publicId>.<format>
  const filename = url.split("/").pop().split("?")[0];
  return filename.substring(0, filename.lastIndexOf("."));
}

const track = p => {
  pendingUploadsRef.current.push(p);
  p.finally(() => {
    pendingUploadsRef.current = pendingUploadsRef.current.filter(x => x !== p);
  });
  return p;
};

// טעינת הנתונים הראשונית
useEffect(() => {
  const fetchBusinessDetails = async () => {
    try {
      const res = await API.get("/business/my");
      if (res.status === 200) {
        const data = res.data.business || res.data;

        // תמיכה ב־address מחרוזת או אובייקט
        const rawAddress = data.address || {};  // אם address לא קיים, אתחול עם אובייקט ריק
        const city = (typeof rawAddress === "object" && rawAddress !== null)
          ? rawAddress.city || ""  // אם address הוא אובייקט, ניגש ל־city
          : (typeof rawAddress === "string" ? rawAddress : "");  // אם address הוא מחרוזת, נשתמש בה ישירות

        // URLs ישנים
        const urls = data.mainImages || [];
        const galleryUrls = data.gallery || [];

        // IDs: אם כבר קיימים במערך – נשמור אותם, אחרת נחלץ מהכתובת
        const mainIds = Array.isArray(data.mainImageIds) && data.mainImageIds.length === urls.length
          ? data.mainImageIds
          : urls.map(extractPublicIdFromUrl);
        const galleryIds = Array.isArray(data.galleryImageIds) && data.galleryImageIds.length === galleryUrls.length
          ? data.galleryImageIds
          : galleryUrls.map(extractPublicIdFromUrl);

        // עדכון הנתונים
        setBusinessDetails(prev => ({
          ...prev,
          businessName: data.businessName || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          category: data.category || "",
          city,  // עדכון העיר

          logo: data.logo || null,
          logoId: data.logoId || null,

          gallery: galleryUrls,
          galleryImageIds: galleryIds,

          mainImages: urls,
          mainImageIds: mainIds,

          faqs: data.faqs || [],
          reviews: data.reviews || []
        }));
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  fetchBusinessDetails();
}, []);

      
  // ===== INPUT CHANGE (supports nested fields) =====
const handleInputChange = ({ target: { name, value } }) => {
  if (name.includes('.')) {
    const [parent, child] = name.split('.');  // אם יש נקודה ב-name, נחלק לשניים
    setBusinessDetails(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  } else {
    setBusinessDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};






// ===== LOGO UPLOAD =====
const handleLogoClick = () => {
  logoInputRef.current?.click();
};

const handleLogoChange = e => {
  const file = e.target.files?.[0];
  if (!file) return;
  e.target.value = null;

  // 🧹 ניקוי preview קודם אם היה blob
  if (businessDetails.logo?.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(businessDetails.logo.preview);
  }

  const preview = URL.createObjectURL(file);

  // ⬇️ עדכון זמני ל־state
  setBusinessDetails(prev => ({
    ...prev,
    logo: { file, preview }
  }));

  // ⬆️ שליחה ל־API
  const fd = new FormData();
  fd.append('logo', file);

  track(
    API.put('/business/my/logo', fd)
      .then(res => {
        if (res.status === 200) {
          setBusinessDetails(prev => ({
            ...prev,
            logo: {
              preview:  res.data.logo,
              publicId: res.data.logoId
            }
          }));
        }
      })
      .catch(console.error)
      .finally(() => {
        URL.revokeObjectURL(preview);
      })
  );
};

    

  // ===== MAIN IMAGES =====
  // בתוך src/pages/business/dashboardPages/buildTabs/Build.jsx

  const handleMainImagesChange = async e => {
    // 1) קבצים (עד 5)
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;
  
    // (אופציונלי) פריוויו מקומי בלבד, לא ב־state הקבוע
    const tempPreviews = files.map(f => URL.createObjectURL(f));
  
    // 2) בניית FormData
    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));
  
    try {
      // 3) שליחה ל־שרת
      const res = await API.put("/business/my/main-images", fd);
  
      if (res.status === 200) {
        // 4) חילוץ URL-ים ו־publicIds מה-response
        const urls = (res.data.mainImages   || []).slice(0, 5);
        const ids  = (res.data.mainImageIds || []).slice(0, 5);
  
        // 5) שמירה נקייה ב־state: רק מערכים של נתונים
        setBusinessDetails(prev => ({
          ...prev,
          mainImages:   urls,  // [ "https://...jpg", ... ]
          mainImageIds: ids    // [ "folder/xyz123", ... ]
        }));
      } else {
        console.warn("העלאת תמונות ראשיות נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה בהעלאת תמונות ראשיות:", err);
    } finally {
      // 6) שחרור הזכרון של ה־blob URLs
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };
  
  
  
  

  

  // Build.jsx

// קודם כל, נשנה את החתימה כך שהפונקציה תקבל כבר את ה-publicId
const handleDeleteMainImage = async publicId => {
  console.log("🔴 Deleting publicId:", publicId);
  if (!publicId) {
    console.warn("⚠️ No publicId passed");
    return;
  }

  try {
    // encodeURIComponent ימיר "/" ל־"%2F" כך שניתן לשלוח ל־path פרמטר עם תת־תיקיה
    const encodedId = encodeURIComponent(publicId);
    const res = await API.delete(`/business/my/main-images/${encodedId}`);

    console.log("🟢 DELETE status:", res.status);
    if (res.status === 204) {
      setBusinessDetails(prev => {
        // מצא את האינדקס של התמונה שנמחקה
        const idx = prev.mainImageIds.indexOf(publicId);
        if (idx === -1) return prev;
        // העתק שני המערכים ושחרר את הפריט המתאים בכל אחד
        const mainImages   = [...prev.mainImages];
        const mainImageIds = [...prev.mainImageIds];
        mainImages.splice(idx, 1);
        mainImageIds.splice(idx, 1);
        return {
          ...prev,
          mainImages,
          mainImageIds
        };
      });
      console.log("✅ Removed:", publicId);
    } else {
      console.warn("❌ DELETE failed:", res);
      alert("שגיאה במחיקת תמונה");
    }
  } catch (err) {
    console.error("🚨 Error:", err);
    alert("שגיאה במחיקת תמונה");
  }
};



  const openMainImageEdit = idx => {
    setEditIndex(idx);
    setIsPopupOpen(true);
  };
  
  // סוגר את הפופאפ ומאפס את האינדקס
  const closePopup = () => {
    setEditIndex(null);
    setIsPopupOpen(false);
  };
  
  // עדכון גודל התמונה לפי סוג ('full' או 'custom')
  const updateImageSize = sizeType => {
    if (editIndex === null) return;
  
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: prev.mainImages.map((img, i) =>
        i === editIndex ? { ...img, size: sizeType } : img
      )
    }));
  
    closePopup();
  };

  // ===== GALLERY =====
  // בתוך Build.jsx

  const handleGalleryChange = async e => {
    // 1) קבצים נבחרים
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;
    e.target.value = null;
  
    // (אופציונלי) תצוגת פריוויו מקומי; לא שומרים ב־state הקבוע
    const tempPreviews = files.map(f => URL.createObjectURL(f));
  
    // 2) בניית FormData
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
  
    try {
      // 3) שליחה לשרת
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      if (res.status === 200) {
        // 4) חילוץ URL-ים ו־publicIds מה-response
        const urls = (res.data.gallery         || []).slice(0, GALLERY_MAX);
        const ids  = (res.data.galleryImageIds || []).slice(0, GALLERY_MAX);
  
        // 5) עדכון נקי ב־state: רק שני המערכים
        setBusinessDetails(prev => ({
          ...prev,
          gallery:         urls,
          galleryImageIds: ids
        }));
      } else {
        console.warn("העלאת גלריה נכשלה:", res);
        alert("❌ שגיאה בהעלאת גלריה");
      }
    } catch (err) {
      console.error("שגיאה בהעלאת גלריה:", err);
      alert("❌ שגיאה בהעלאת גלריה");
    } finally {
      // 6) שחרור זיכרון ה־blob URLs
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };
  
   // ← הוסיפי כאן את הסוגרית המסולסלת והסמי-קולון לסיום הפונקציה
  
    
  
  
    
   const handleDeleteGalleryImage = async publicId => {
    if (!publicId) return;
  
    console.log("🔴 Deleting gallery publicId:", publicId);
  
    try {
      const res = await API.delete(`/business/my/gallery/${encodeURIComponent(publicId)}`);


        console.log("🟢 DELETE status:", res.status);
      if (res.status === 204) {
        setBusinessDetails(prev => {
          // מצא את האינדקס של התמונה בגלריה
          const idx = prev.galleryImageIds.indexOf(publicId);
          if (idx === -1) return prev;
          // העתק שני המערכים ושחרר את הפריט המתאים בכל אחד
          const gallery         = [...prev.gallery];
          const galleryImageIds = [...prev.galleryImageIds];
          gallery.splice(idx, 1);
          galleryImageIds.splice(idx, 1);
          return {
            ...prev,
            gallery,
            galleryImageIds
          };
        });
        console.log("✅ Gallery image removed:", publicId);
      } else {
        console.warn("❌ DELETE failed:", res);
        alert("שגיאה במחיקת תמונה בגלריה");
      }
    } catch (err) {
      console.error("🚨 Error deleting gallery image:", err);
      alert("שגיאה במחיקת תמונה בגלריה");
    }
  };
  
                          
  
  const handleEditImage = idx => {
    console.log("Edit gallery image:", idx);
  };
  

  // ===== SAVE =====
  const handleSave = async () => {
  setIsSaving(true);
  try {
    const res = await API.patch("/business/my", {
      businessName: businessDetails.businessName,
      category: businessDetails.category,
      description: businessDetails.description,
      phone: businessDetails.phone,
      email: businessDetails.email,
      address: {
        city: businessDetails.address.city  // ודא שהעיר נשלחת
      }
    });

    if (res.status === 200) {
      // עדכון state
      setBusinessDetails(prev => ({
        ...prev,
        businessName: res.data.businessName || prev.businessName,
        address: { city: res.data.address.city || prev.address.city }  // עדכון העיר בסטייט
      }));

      // שמירה ב-localStorage
      localStorage.setItem('businessDetails', JSON.stringify({
        businessName: res.data.businessName,
        category: res.data.category,
        description: res.data.description,
        phone: res.data.phone,
        email: res.data.email,
        address: {
          city: res.data.address.city
        }
      }));
    }

    alert("✅ נשמר בהצלחה!");
  } catch (err) {
    console.error("❌ שגיאה בשמירה:", err);
    alert("❌ שמירה נכשלה");
  } finally {
    setIsSaving(false);
  }
};



      
  // ===== TOP BAR =====
  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
      : 0;
  
    return (
      <div className="topbar-preview">
        {/* לוגו */}
        <div className="logo-circle" onClick={handleLogoClick}>
          {businessDetails.logo?.preview
            ? <img src={businessDetails.logo.preview} className="logo-img" />
            : <span>לוגו</span>}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={logoInputRef}
            onChange={handleLogoChange}
          />
        </div>
  
        {/* שם העסק + דירוג */}
        <div className="name-rating">
          <h2>{businessDetails.businessName || "שם העסק"}</h2> {/* הצגת שם העסק */}
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avg.toFixed(1)} / 5</span>
          </div>
        </div>
  
        {/* קטגוריה מתחת לשם */}
        {businessDetails.category && (
          <p className="preview-category">
            <strong>קטגוריה:</strong> {businessDetails.category}
          </p>
        )}
  
        {/* תיאור וטלפון מתחת לשם */}
        {businessDetails.description && (
          <p className="preview-description">
            <strong>תיאור:</strong> {businessDetails.description}
          </p>
        )}
        {businessDetails.phone && (
          <p className="preview-phone">
            <strong>טלפון:</strong> {businessDetails.phone}
          </p>
        )}
        {businessDetails.address.city && (
          <p className="preview-city">
            <strong>עיר:</strong> {businessDetails.address.city}
          </p>
        )}


<hr className="divider" />

  
        {/* כפתורי הטאבים */}
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              className={`tab ${tab === currentTab ? "active" : ""}`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  

  return (
    <div className="build-wrapper">
      {currentTab === "ראשי" && (
        <MainSection
          businessDetails={businessDetails}
          handleInputChange={handleInputChange}
          handleMainImagesChange={handleMainImagesChange}
          handleDeleteImage={handleDeleteMainImage}
          handleEditImage={openMainImageEdit}
          handleSave={handleSave}
          showViewProfile={showViewProfile}
          navigate={navigate}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
          logoInputRef={logoInputRef}
          mainImagesInputRef={mainImagesInputRef}
          isSaving={isSaving}
        />
      )}

      {currentTab === "גלריה" && (
        <GallerySection
          businessDetails={businessDetails}
          galleryInputRef={galleryInputRef}
          handleGalleryChange={handleGalleryChange}
          handleDeleteImage={handleDeleteGalleryImage}
          handleEditImage={handleEditImage}
          renderTopBar={renderTopBar}
        />
      )}

      {currentTab === "ביקורות" && (
        <ReviewsSection
          reviews={businessDetails.reviews}
          setReviews={r => setBusinessDetails(prev => ({ ...prev, reviews: r }))}
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
          setFaqs={f => setBusinessDetails(prev => ({ ...prev, faqs: f }))}
          currentUser={currentUser}
          renderTopBar={renderTopBar}
        />
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button type="button" onClick={() => updateImageSize("full")}>גודל מלא</button>
            <button type="button" onClick={() => updateImageSize("custom")}>גודל מותאם</button>
            <button type="button" onClick={closePopup}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
