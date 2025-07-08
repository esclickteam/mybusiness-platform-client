import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

import { useAuth } from "../../../../context/AuthContext";

const MainSection    = lazy(() => import("../buildTabs/buildSections/MainSection"));
const GallerySection = lazy(() => import("../buildTabs/buildSections/GallerySection"));
const ReviewsSection = lazy(() => import("../buildTabs/buildSections/ReviewsSection"));
const ShopSection    = lazy(() => import("../buildTabs/buildSections/ShopSection"));
const ChatSection    = lazy(() => import("../buildTabs/buildSections/ChatSection"));
const FaqSection     = lazy(() => import("../buildTabs/buildSections/FaqSection"));

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  " יומן",
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
    businessName:    "",
    description:     "",
    phone:           "",
    email:           "",       
    category:        "",
    address:         { city: "" },
    logo:            null,
    gallery:         [],
    galleryImageIds: [],
    mainImages:      [],
    mainImageIds:    [],
    reviews:         [],
    faqs:            [],
    workHours:       {},
  });

  const [workHours, setWorkHours] = useState({});
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

  // הוספת סטייט עבור shopMode
  const [shopMode, setShopMode] = useState(null);

   const setGalleryOrder = (newOrder) => {
    setBusinessDetails(prev => ({
      ...prev,
      gallery: newOrder.map(item => item.preview),
      galleryImageIds: newOrder.map(item => item.publicId),
    }));
  };


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
    // Load business details
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          const rawAddress = data.address;
          const city = typeof rawAddress === "string"
            ? rawAddress
            : rawAddress?.city || "";

          const urls        = data.mainImages     || [];
          const galleryUrls = data.gallery        || [];
          const mainIds = Array.isArray(data.mainImageIds) && data.mainImageIds.length === urls.length
            ? data.mainImageIds
            : urls.map(extractPublicIdFromUrl);
          const galleryIds = Array.isArray(data.galleryImageIds) && data.galleryImageIds.length === galleryUrls.length
            ? data.galleryImageIds
            : galleryUrls.map(extractPublicIdFromUrl);

          const logoObj = data.logo
            ? { preview: data.logo, publicId: data.logoId }
            : null;

          setBusinessDetails(prev => ({
            ...prev,
            businessName:    data.businessName    || "",
            description:     data.description     || "",
            phone:           data.phone           || "",
            email:           data.email           || "",
            category:        data.category        || "",
            address:         { city },
            logo:            logoObj,
            logoId:          data.logoId          || null,
            gallery:         galleryUrls,
            galleryImageIds: galleryIds,
            mainImages:      urls,
            mainImageIds:    mainIds,
            faqs:            data.faqs            || [],
            reviews:         data.reviews         || [],
            workHours:       data.workHours       || {}
          }));
        }
      })
      .catch(console.error)
      .finally(() => setFirstLoad(false));

    // Load work hours correctly - לא לעשות reduce!
    API.get('/appointments/get-work-hours', {
      params: { businessId: currentUser?.businessId || "" }
    })
    .then(res => {
      let map = {};
      // אם המידע הגיע כמערך
      if (Array.isArray(res.data.workHours)) {
        res.data.workHours.forEach(item => {
          map[Number(item.day)] = item;
        });
      }
      // אם המידע הגיע כאובייקט (ולא מערך)
      else if (
        res.data.workHours &&
        typeof res.data.workHours === "object" &&
        !Array.isArray(res.data.workHours)
      ) {
        map = res.data.workHours;
      }
      // fallback: אולי כל התשובה היא מערך (נדיר אבל אפשרי)
      else if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          map[Number(item.day)] = item;
        });
      }
      // אחרת (שום דבר תקין): משאירים map ריק

      setWorkHours(map);
      setBusinessDetails(prev => ({ ...prev, workHours: map }));
    })
    .catch(err => console.warn('Error loading work-hours:', err));
  }, []);


  // Autosave business details debounce
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
        const res = await API.patch('/business/my', payload);
        if (res.status === 200) {
          setBusinessDetails(prev => ({
            ...prev,
            ...res.data,
            logo: prev.logo,
            logoId: prev.logoId
          }));
        }
      } catch (err) {
        console.error('Autosave failed:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout.current);
  }, [firstLoad,
    businessDetails.businessName,
    businessDetails.category,
    businessDetails.description,
    businessDetails.phone,
    businessDetails.email,
    businessDetails.address.city
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

  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    // שחרור הזכרון של preview קודם אם היה blob
    if (businessDetails.logo?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(businessDetails.logo.preview);
    }

    // יצירת preview חדש
    const preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({
      ...prev,
      logo: { preview }
    }));

    // בניית FormData והעלאה לשרת
    const fd = new FormData();
    fd.append('logo', file);

    try {
      const res = await API.put('/business/my/logo', fd);
      if (res.status === 200) {
        // לאחר העלאה מוצלחת, עדכון preview ו-publicId מהשרת
        setBusinessDetails(prev => ({
          ...prev,
          logo: {
            preview:  res.data.logo,
            publicId: res.data.logoId
          }
        }));
      } else {
        console.warn('Logo upload failed:', res);
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
    } finally {
      // שחרור הזכרון של ה-blob URL שנוצר
      URL.revokeObjectURL(preview);
    }
  };


  // ===== MAIN IMAGES =====
  // בתוך src/pages/business/dashboardPages/buildTabs/Build.jsx

  const handleMainImagesChange = async e => {
    // 1) קבצים (עד 5)
    const files = Array.from(e.target.files || []).slice(0, 6);
    if (!files.length) return;
    e.target.value = null;

    // 2) פריוויו מקומי - עדכון state עם התמונות החדשות
    const tempPreviews = files.map(f => URL.createObjectURL(f));
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: [...prev.mainImages, ...tempPreviews]  // הוספת התמונות לפריוויו
    }));

    // 3) בניית FormData לשליחה לשרת
    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));

    try {
      // 4) שליחה לשרת
      const res = await API.put("/business/my/main-images", fd);

      if (res.status === 200) {
        // 5) חילוץ URL-ים ו־publicIds מה-response
        const urls = (res.data.mainImages || []).slice(0, 6);
        const ids = (res.data.mainImageIds || []).slice(0, 6);

        // 6) עדכון ה-state עם התוצאות מהשרת
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: urls,  // עדכון עם הכתובות שהתקבלו מהשרת
          mainImageIds: ids  // עדכון עם ה-publicIds
        }));
      } else {
        console.warn("העלאת תמונות ראשיות נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה בהעלאת תמונות ראשיות:", err);
    } finally {
      // 7) שחרור הזיכרון של ה־blob URLs (לאחר סיום)
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
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;
    e.target.value = null;

    // 1️⃣ פריוויו מקומי
    const tempPreviews = files.map(f => URL.createObjectURL(f));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...tempPreviews]
    }));

    // 2️⃣ ממשיכים להעלות לשרת
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 200) {
        // 3️⃣ קבלת כתובות מהשרת + cache-busting
        const urls = (res.data.gallery || []).map(u => `${u}?v=${Date.now()}`);
        const ids  = res.data.galleryImageIds || [];
        setBusinessDetails(prev => ({
          ...prev,
          gallery:         urls,
          galleryImageIds: ids
        }));
      }
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בהעלאת גלריה");
    } finally {
      // 4️⃣ שחרור הזכרון של הפריוויוים המקומיים
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
    // שמירת כל השדות, כולל המייל
    setIsSaving(true);
    try {
      const payload = {
        businessName: businessDetails.businessName,
        category:     businessDetails.category,
        description:  businessDetails.description,
        phone:        businessDetails.phone,
        email:        businessDetails.email,
        address:      { city: businessDetails.address.city }
      };
      const res = await API.patch("/business/my", payload);
      if (res.status === 200) {
        const updated = res.data;
        setBusinessDetails(prev => ({
          ...prev,
          businessName: updated.businessName ?? prev.businessName,
          category:     updated.category     ?? prev.category,
          description:  updated.description  ?? prev.description,
          phone:        updated.phone        ?? prev.phone,
          email:        updated.email        ?? prev.email,
          address: {
            ...prev.address,
            city: updated.address?.city ?? prev.address.city
          },
          logo: prev.logo,
          logoId: prev.logoId
        }));
        setShowViewProfile(true);
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
          {businessDetails.logo?.preview ? (
            <img src={businessDetails.logo.preview} className="logo-img" />
          ) : businessDetails.logo ? (
            <img src={businessDetails.logo} className="logo-img" />
          ) : (
            <span>לוגו</span>
          )}
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


  const renderTabContent = () => {
    switch (currentTab) {
      case "ראשי":
        return (
          <MainSection
            businessDetails={businessDetails}
            reviews={businessDetails.reviews}
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
        );
      case "גלריה":
        return (
          <GallerySection
            businessDetails={businessDetails}
            galleryInputRef={galleryInputRef}
            handleGalleryChange={handleGalleryChange}
            handleDeleteImage={handleDeleteGalleryImage}
            setGalleryOrder={setGalleryOrder}
            handleEditImage={handleEditImage}
            renderTopBar={renderTopBar}
          />
        );
      case "ביקורות":
        return (
          <ReviewsSection
            reviews={businessDetails.reviews}
            setReviews={r => setBusinessDetails(prev => ({ ...prev, reviews: r }))}
            currentUser={currentUser}
            renderTopBar={renderTopBar}
          />
        );
      case " יומן":
        return (
          <ShopSection
            setBusinessDetails={setBusinessDetails}
            renderTopBar={renderTopBar}
            workHours={workHours}
            setWorkHours={setWorkHours}
          />
        );
      case "צ'אט עם העסק":
        return (
          <ChatSection
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            renderTopBar={renderTopBar}
          />
        );
      case "שאלות ותשובות":
        return (
          <FaqSection
            faqs={businessDetails.faqs}
            setFaqs={f => setBusinessDetails(prev => ({ ...prev, faqs: f }))}
            currentUser={currentUser}
            renderTopBar={renderTopBar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="build-wrapper">
      <Suspense fallback={<div>טוען...</div>}>
        {renderTabContent()}
      </Suspense>

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
