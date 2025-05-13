import React, { useState, useRef, useEffect } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

import MainSection    from "../buildTabs/buildSections/MainSection";
import GallerySection from "../buildTabs/buildSections/GallerySection";
import ReviewsSection from "../buildTabs/buildSections/ReviewsSection";
import ShopSection    from "../buildTabs/buildSections/ShopSection";
import FaqSection     from "../buildTabs/buildSections/FaqSection";

import { useAuth } from "../../../../context/AuthContext";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "חנות / יומן",
    "שאלות ותשובות",
];

// המקסימום המותרים בגלריה
const GALLERY_MAX = 5;

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    businessName:    "",
    description:     "",
    phone:           "",
    category:        "",
    email:           "",
    address:         { city: "" },
    logo:            null,
    gallery:         [],
    galleryImageIds: [],
    mainImages:      [],
    mainImageIds:    [],
    reviews:         [],
    faqs:            [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Autosave setup
  const [firstLoad, setFirstLoad] = useState(true);
  const saveTimeout = useRef(null);

  const logoInputRef       = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef    = useRef();
  const pendingUploadsRef  = useRef([]);

  function extractPublicIdFromUrl(url) {
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
  API.get("/business/my")
    .then(res => {
      if (res.status === 200) {
        const data = res.data.business || res.data;

        // כתובת העיר
        const rawAddress = data.address;
        const city = typeof rawAddress === "string"
          ? rawAddress
          : rawAddress?.city || "";

        // תמונות ראשיות
        const urls = data.mainImages || [];
        const mainIds = Array.isArray(data.mainImageIds) && data.mainImageIds.length === urls.length
          ? data.mainImageIds
          : urls.map(extractPublicIdFromUrl);

        // גלריה
        const galleryUrls = data.gallery || [];
        const galleryIds = Array.isArray(data.galleryImageIds) && data.galleryImageIds.length === galleryUrls.length
          ? data.galleryImageIds
          : galleryUrls.map(extractPublicIdFromUrl);

        setBusinessDetails(prev => ({
          ...prev,
          businessName:    data.businessName  || "",
          description:     data.description   || "",
          phone:           data.phone         || "",
          email:           data.email         || "",
          category:        data.category      || "",
          address:         { city },

          // לוגו: שמירה של URL קבוע ו-publicId
          logo: {
            preview:  data.logo           || null,
            publicId: data.logoPublicId  || null
          },

          gallery:         galleryUrls,
          galleryImageIds: galleryIds,
          mainImages:      urls,
          mainImageIds:    mainIds,
          faqs:            data.faqs      || [],
          reviews:         data.reviews   || []
        }));
      }
    })
    .catch(console.error)
    .finally(() => setFirstLoad(false));
}, []);



  // Autosave אחרי debounce
  useEffect(() => {
  if (firstLoad) return;

  clearTimeout(saveTimeout.current);

  saveTimeout.current = setTimeout(async () => {
    setIsSaving(true);
    try {
      const payload = {
        businessName: businessDetails.businessName,
        category:     businessDetails.category,
        description:  businessDetails.description,
        phone:        businessDetails.phone,
        email:        businessDetails.email,
        address:      { city: businessDetails.address.city },
      };

      const res = await API.patch("/business/my", payload);
      if (res.status === 200) {
        const updated = res.data.business;  // מתוך { business: updatedBiz }
        setBusinessDetails(prev => ({
          ...prev,
          businessName: updated.businessName,
          category:     updated.category,
          description:  updated.description,
          phone:        updated.phone,
          email:        updated.email,
          address:      { city: updated.address.city || prev.address.city },
          logo:         prev.logo,            // משמרים את אובייקט הלוגו כפי שהוא ב-state
          gallery:         prev.gallery,
          galleryImageIds: prev.galleryImageIds,
          mainImages:      prev.mainImages,
          mainImageIds:    prev.mainImageIds,
          faqs:            prev.faqs,
          reviews:         prev.reviews,
        }));
      }
    } catch (err) {
      console.error("Autosave failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  return () => clearTimeout(saveTimeout.current);
}, [
  businessDetails.businessName,
  businessDetails.category,
  businessDetails.description,
  businessDetails.phone,
  businessDetails.email,
  businessDetails.address.city,
  firstLoad
]);


  
           // ===== INPUT CHANGE (supports nested fields) =====
const handleInputChange = ({ target: { name, value } }) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBusinessDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBusinessDetails(prev => ({ ...prev, [name]: value }));
    }
  };

// ===== LOGO UPLOAD =====
const handleLogoClick = () => {
  logoInputRef.current?.click();
};

// בתוך ה־component שלך
const handleLogoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  // 1) טרם ההעלאה – הצגת Preview מיידי
  const previewUrl = URL.createObjectURL(file);
  setBusinessDetails(prev => ({
    ...prev,
    logo: { file, preview: previewUrl },
  }));

  // 2) העלאה לשרת
  const formData = new FormData();
  formData.append('logo', file);
  try {
    const res = await API.patch('/business/my/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // מניח ש־res.data.business.logo הוא ה־URL ב־Cloudinary
    setBusinessDetails(prev => ({
      ...prev,
      logo: { preview: res.data.business.logo, publicId: res.data.business.logoPublicId }
    }));
  } catch (err) {
    console.error('❌ שגיאה בהעלאת לוגו:', err);
    alert('שגיאה בהעלאת לוגו');
  }
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
  // 1) קבצים נבחרים (עד GALLERY_MAX)
  const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
  if (!files.length) return;
  e.target.value = null;

  // 2) פריוויו מקומי ואופטימיסטי ב־UI
  const tempPreviews = files.map(f => URL.createObjectURL(f));
  setBusinessDetails(prev => ({
    ...prev,
    gallery: dedupeByPreview([...prev.gallery, ...tempPreviews]).slice(0, GALLERY_MAX),
    // galleryImageIds נשמרים כמו שהם עד לקבלת התשובה מהשרת
  }));

  // 3) בניית FormData
  const fd = new FormData();
  files.forEach(f => fd.append("gallery", f));

  try {
    // 4) שליחה לשרת (ועקיבה אחרי ההבטחה)
    const res = await track(API.put("/business/my/gallery", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    }));

    if (res.status === 200) {
      // 5) חילוץ URL-ים ו־publicIds
      const urls = (res.data.gallery || []).slice(0, GALLERY_MAX);
      const ids  = (res.data.galleryImageIds || []).slice(0, GALLERY_MAX);

      // 6) עדכון ה־state עם נתוני השרת, מסוננים מפי-דופס
      setBusinessDetails(prev => ({
        ...prev,
        gallery: dedupeByPreview(urls).slice(0, GALLERY_MAX),
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
    // 7) שחרור זיכרון של ה־blob URLs
    tempPreviews.forEach(URL.revokeObjectURL);
  }
};

  
        
  
    
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
    // אריזת ה־payload
    const payload = {
      businessName: businessDetails.businessName,
      category:     businessDetails.category,
      description:  businessDetails.description,
      phone:        businessDetails.phone,
      email:        businessDetails.email,
      address: {
        city: businessDetails.address.city
      }
    };

    // קריאה ל־PATCH
    const res = await API.patch('/business/my/details', payload)

    if (res.status === 200) {
      // צריכה להיות התשובה: האובייקט המעודכן במלואו
      const updated = res.data; // או res.data.business אם השרת עוטף תחת `business`

      // עדכון כל השדות ב־state
      setBusinessDetails(prev => ({
  ...prev,
  businessName: updated.businessName  ?? prev.businessName,
  category:     updated.category      ?? prev.category,
  description:  updated.description   ?? prev.description,
  phone:        updated.phone         ?? prev.phone,
  email:        updated.email         ?? prev.email,
  address: {
    ...prev.address,
    city: updated.address?.city      ?? prev.address.city
  },
  logo: {
    // אם קיבלנו מהשרת URL חדש, נעדכן את ה־preview אליו,
    // אחרת נשמור את ה־preview הקיים (למשל blob בזמן העלאה)
    preview:    updated.logoUrl       ?? prev.logo?.preview,
    // אם קיבלנו publicId מהשרת, נעדכן אותו; אחרת נשמור את הישן
    publicId:   updated.logoPublicId ?? prev.logo?.publicId
  }
}));


      alert("✅ נשמר בהצלחה!");
    } else {
      alert("❌ שמירה נכשלה: " + res.statusText);
    }
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
