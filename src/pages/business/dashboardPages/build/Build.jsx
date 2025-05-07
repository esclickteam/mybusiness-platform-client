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
    name:        "",
    description: "",
    phone:       "",
    category:    "",
    city:        "",       // ← חדש: עיר חובה
    logo:        null,
    gallery:     [],
    mainImages:  [],
    reviews:     [],
    faqs:        [],
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
  
          // תמיכה ב־address מחרוזת או אובייקט
          const rawAddress = data.address;
          const city = typeof rawAddress === "string"
            ? rawAddress
            : rawAddress?.city || "";
  
          setBusinessDetails({
            // שדות בסיסיים
            name:        data.name || "",
            description: data.description || "",
            phone:       data.phone || "",
            email:       data.email || "",
            category:    data.category || "",
            city,
  
            // לוגו: שומרים URL ומזהה נפרד
            logo:    data.logo    || null,
            logoId:  data.logoId  || null,
  
            // גלריה: מערך URLs + מערך publicIds
            gallery:         data.gallery         || [],
            galleryImageIds: data.galleryImageIds || [],
  
            // תמונות ראשיות: מערך URLs + מערך publicIds
            mainImages:    data.mainImages    || [],
            mainImageIds:  data.mainImageIds  || [],
  
            // שאר השדות
            faqs:    data.faqs    || [],
            reviews: data.reviews || []
          });
        }
      })
      .catch(console.error);
  }, []);
  
  
  
  
  
  

  const handleInputChange = ({ target: { name, value } }) =>
    setBusinessDetails(prev => ({ ...prev, [name]: value }));

  // ===== LOGO =====
  const handleLogoClick = () => logoInputRef.current?.click();

  const handleLogoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;
  
    // 🧹 ניקוי preview קודם אם היה blob
    if (businessDetails.logo?.preview?.startsWith("blob:")) {
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
    fd.append("logo", file);
  
    track(
      API.put("/business/my/logo", fd)
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
        .finally(() => URL.revokeObjectURL(preview))
    );
  };  // ← כאן סוגרים את handleLogoChange
  
  


  // ===== MAIN IMAGES =====
  // בתוך src/pages/business/dashboardPages/buildTabs/Build.jsx

  const handleMainImagesChange = async e => {
    // 1) בוחרים עד 5 קבצים
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;
  
    // 2) הכנת פריוויו לשלב ההעלאה
    const previews = files.map(f => ({
      preview: URL.createObjectURL(f),
      file:    f
    }));
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: previews
    }));
  
    // 3) שליחה ל-API
    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));
  
    try {
      const res = await API.put("/business/my/main-images", fd);
  
      if (res.status === 200) {
        const wrapped = (res.data.mainImages || [])
          .slice(0, 5)
          .map((url, i) => ({
            preview:  url,
            publicId: (res.data.mainImageIds || [])[i] || null
          }));
  
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: wrapped
        }));
      } else {
        console.warn("העלאת תמונות נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה בהעלאה:", err);
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };
  

  

  // Build.jsx

// קודם כל, נשנה את החתימה כך שהפונקציה תקבל כבר את ה-publicId
const handleDeleteMainImage = async (fullPublicId) => {
  console.log("🔴 handleDeleteMainImage called with publicId:", fullPublicId);

  if (!fullPublicId) {
    console.warn("⚠️ No publicId passed to handleDeleteMainImage");
    return;
  }

  //  מדלגים על התיקיה: לוקחים רק את הסגמנט האחרון
  const shortId = fullPublicId.split("/").pop();

  try {
    // שולחים shortId (בלי הסלאשים) ל־endpoint
    const res = await API.delete(
      `/business/my/main-images/${shortId}`
    );

    console.log("🟢 DELETE response status:", res.status);

    if (res.status === 204) {
      // מסננים בחזרה לפי ה־fullPublicId
      setBusinessDetails(prev => ({
        ...prev,
        mainImages: prev.mainImages.filter(img => img.publicId !== fullPublicId)
      }));
      console.log("✅ Image removed from state:", fullPublicId);
    } else {
      console.warn("❌ DELETE failed with response:", res);
      alert("❌ שגיאה במחיקת התמונה. אנא נסה שוב.");
    }
  } catch (err) {
    console.error("🚨 Error in handleDeleteMainImage:", err);
    alert("❌ שגיאה במחיקת התמונה. אנא נסה שוב.");
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

  const handleGalleryChange = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = null;
  
    // הצגת תמונות ללא כפילויות
    const previews = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f)
    }));
  
    console.log("New images to upload:", previews);
  
    // סינון התמונות הכפולות
    const newGallery = [
      ...businessDetails.gallery.filter(
        existingImage => !previews.some(newImage => newImage.preview === existingImage.preview)
      ),
      ...previews
    ];
  
    console.log("Filtered gallery:", newGallery);
  
    setBusinessDetails(prev => ({
      ...prev,
      gallery: newGallery
    }));
  
    // העלאה ל-API וסנכרון
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
  
    track(
      API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          if (res.status === 200) {
            const wrapped = (res.data.gallery || [])
              .slice(0, GALLERY_MAX)
              .map((url, i) => ({
                preview:  url,
                publicId: (res.data.galleryImageIds || [])[i] || null
              }));
            setBusinessDetails(prev => ({
              ...prev,
              gallery: wrapped
            }));
          }
        })
        .finally(() => previews.forEach(p => URL.revokeObjectURL(p.preview)))
        .catch(err => console.error("Error during gallery upload:", err))
    );
  };  // ← הוסיפי כאן את הסוגרית המסולסלת והסמי-קולון לסיום הפונקציה
  
    
  
  
    
  const handleDeleteGalleryImage = async (publicId) => {
    if (!publicId) return;
  
    console.log("Deleting image with publicId:", publicId);
  
    try {
      const res = await API.delete(
        `/business/my/gallery/${encodeURIComponent(publicId)}`
      );
      if (res.status === 204) {
        setBusinessDetails(prev => ({
          ...prev,
          gallery: prev.gallery.filter(img => img.publicId !== publicId)
        }));
        console.log("Image deleted successfully!");
      } else {
        console.warn("מחיקה נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה בגלריה:", err);
    }
  };
  
    
    
    
    
    
    
    
  
  const handleEditImage = idx => {
    console.log("Edit gallery image:", idx);
  };
  

  // ===== SAVE =====
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // מחכים שכל ההעלאות בתור יסתיימו
      await Promise.all(pendingUploadsRef.current);
  
      // שולחים את השדות הנתמכים כולל address עם עיר
      await API.patch("/business/my", {
        name:        businessDetails.name,
        category:    businessDetails.category,
        description: businessDetails.description,
        phone:       businessDetails.phone,
        email:       businessDetails.email,
        address: {
          city: businessDetails.city // ← חובה להוסיף!
        }
      });
      
  
      alert("✅ נשמר בהצלחה!");
      setShowViewProfile(true);
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
          <h2>{businessDetails.name || "שם העסק"}</h2>
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
{businessDetails.city && (
  <p className="preview-city">
    <strong>עיר:</strong> {businessDetails.city}
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
