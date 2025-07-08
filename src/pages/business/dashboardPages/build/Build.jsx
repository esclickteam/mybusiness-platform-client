import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import "./Build.css";

import { useAuth } from "../../../../context/AuthContext";

const MainSection = lazy(() =>
  import("../buildTabs/buildSections/MainSection")
);
const GallerySection = lazy(() =>
  import("../buildTabs/buildSections/GallerySection")
);
const ReviewsSection = lazy(() =>
  import("../buildTabs/buildSections/ReviewsSection")
);
const ShopSection = lazy(() => import("../buildTabs/buildSections/ShopSection"));
const ChatSection = lazy(() => import("../buildTabs/buildSections/ChatSection"));
const FaqSection = lazy(() => import("../buildTabs/buildSections/FaqSection"));

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "יומן",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

// מקסימום תמונות בגלריה
const GALLERY_MAX = 5;

// Hook לשימוש ב-Intersection Observer לטעינה עצלה
function useOnScreen(ref, threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return isVisible;
}

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    description: "",
    phone: "",
    email: "",
    category: "",
    address: { city: "" },
    logo: null,
    gallery: [],
    galleryImageIds: [],
    mainImages: [],
    mainImageIds: [],
    reviews: [],
    faqs: [],
    workHours: {},
  });

  const [workHours, setWorkHours] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // מצב טעינת טאבים (למנוע טעינה חוזרת מיותרת)
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [shopLoaded, setShopLoaded] = useState(false);

  // רפרנסים ל־inputים
  const logoInputRef = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef = useRef();

  // לחצן לוגו
  const handleLogoClick = useCallback(() => {
    logoInputRef.current?.click();
  }, []);

  // חילוץ publicId מכתובת URL
  const extractPublicIdFromUrl = useCallback((url) => {
    const filename = url.split("/").pop().split("?")[0];
    return filename.substring(0, filename.lastIndexOf("."));
  }, []);

  // טעינת נתונים ראשונית
  useEffect(() => {
    API.get("/business/my")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.business || res.data;
          const rawAddress = data.address;
          const city =
            typeof rawAddress === "string"
              ? rawAddress
              : rawAddress?.city || "";

          const urls = data.mainImages || [];
          const galleryUrls = data.gallery || [];
          const mainIds =
            Array.isArray(data.mainImageIds) &&
            data.mainImageIds.length === urls.length
              ? data.mainImageIds
              : urls.map(extractPublicIdFromUrl);
          const galleryIds =
            Array.isArray(data.galleryImageIds) &&
            data.galleryImageIds.length === galleryUrls.length
              ? data.galleryImageIds
              : galleryUrls.map(extractPublicIdFromUrl);

          const logoObj = data.logo
            ? { preview: data.logo, publicId: data.logoId }
            : null;

          setBusinessDetails((prev) => ({
            ...prev,
            businessName: data.businessName || "",
            description: data.description || "",
            phone: data.phone || "",
            email: data.email || "",
            category: data.category || "",
            address: { city },
            logo: logoObj,
            logoId: data.logoId || null,
            gallery: galleryUrls,
            galleryImageIds: galleryIds,
            mainImages: urls,
            mainImageIds: mainIds,
            faqs: data.faqs || [],
            reviews: data.reviews || [],
            workHours: data.workHours || {},
          }));
        }
      })
      .catch(console.error);

    // טעינת שעות עבודה
    API.get("/appointments/get-work-hours", {
      params: { businessId: currentUser?.businessId || "" },
    })
      .then((res) => {
        let map = {};
        if (Array.isArray(res.data.workHours)) {
          res.data.workHours.forEach((item) => {
            map[Number(item.day)] = item;
          });
        } else if (
          res.data.workHours &&
          typeof res.data.workHours === "object" &&
          !Array.isArray(res.data.workHours)
        ) {
          map = res.data.workHours;
        } else if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            map[Number(item.day)] = item;
          });
        }
        setWorkHours(map);
        setBusinessDetails((prev) => ({ ...prev, workHours: map }));
      })
      .catch((err) => console.warn("Error loading work-hours:", err));
  }, [currentUser?.businessId, extractPublicIdFromUrl]);

  // Autosave עם debounce
  const saveTimeout = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const payload = {
          businessName: businessDetails.businessName,
          category: businessDetails.category,
          description: businessDetails.description,
          phone: businessDetails.phone,
          email: businessDetails.email,
          address: { city: businessDetails.address.city },
        };
        const res = await API.patch("/business/my", payload);
        if (res.status === 200) {
          setBusinessDetails((prev) => ({
            ...prev,
            ...res.data,
            logo: prev.logo,
            logoId: prev.logoId,
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
  ]);

  // שינוי שדות קלט
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBusinessDetails((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBusinessDetails((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // טיפול בלוגו - העלאה ושחרור זיכרון
  const handleLogoChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = null;

      if (businessDetails.logo?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(businessDetails.logo.preview);
      }

      const preview = URL.createObjectURL(file);
      setBusinessDetails((prev) => ({
        ...prev,
        logo: { preview },
      }));

      const fd = new FormData();
      fd.append("logo", file);

      try {
        const res = await API.put("/business/my/logo", fd);
        if (res.status === 200) {
          setBusinessDetails((prev) => ({
            ...prev,
            logo: {
              preview: res.data.logo,
              publicId: res.data.logoId,
            },
          }));
        } else {
          console.warn("Logo upload failed:", res);
        }
      } catch (err) {
        console.error("Error uploading logo:", err);
      } finally {
        URL.revokeObjectURL(preview);
      }
    },
    [businessDetails.logo]
  );

  // שינוי תמונות ראשיות
  const handleMainImagesChange = useCallback(async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map((f) => URL.createObjectURL(f));
    setBusinessDetails((prev) => ({
      ...prev,
      mainImages: [...prev.mainImages, ...tempPreviews],
    }));

    const fd = new FormData();
    files.forEach((f) => fd.append("main-images", f));

    try {
      const res = await API.put("/business/my/main-images", fd);
      if (res.status === 200) {
        const urls = (res.data.mainImages || []).slice(0, 6);
        const ids = (res.data.mainImageIds || []).slice(0, 6);

        setBusinessDetails((prev) => ({
          ...prev,
          mainImages: urls,
          mainImageIds: ids,
        }));
      } else {
        console.warn("העלאת תמונות ראשיות נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה בהעלאת תמונות ראשיות:", err);
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  }, []);

  // מחיקת תמונת ראשית לפי publicId
  const handleDeleteMainImage = useCallback(async (publicId) => {
    if (!publicId) {
      console.warn("⚠️ No publicId passed");
      return;
    }
    try {
      const encodedId = encodeURIComponent(publicId);
      const res = await API.delete(`/business/my/main-images/${encodedId}`);

      if (res.status === 204) {
        setBusinessDetails((prev) => {
          const idx = prev.mainImageIds.indexOf(publicId);
          if (idx === -1) return prev;
          const mainImages = [...prev.mainImages];
          const mainImageIds = [...prev.mainImageIds];
          mainImages.splice(idx, 1);
          mainImageIds.splice(idx, 1);
          return {
            ...prev,
            mainImages,
            mainImageIds,
          };
        });
      } else {
        console.warn("❌ DELETE failed:", res);
        alert("שגיאה במחיקת תמונה");
      }
    } catch (err) {
      console.error("🚨 Error:", err);
      alert("שגיאה במחיקת תמונה");
    }
  }, []);

  // פתיחת פופאפ עריכת תמונה
  const openMainImageEdit = useCallback((idx) => {
    setEditIndex(idx);
    setIsPopupOpen(true);
  }, []);

  // סגירת פופאפ
  const closePopup = useCallback(() => {
    setEditIndex(null);
    setIsPopupOpen(false);
  }, []);

  // עדכון גודל תמונה
  const updateImageSize = useCallback(
    (sizeType) => {
      if (editIndex === null) return;
      setBusinessDetails((prev) => ({
        ...prev,
        mainImages: prev.mainImages.map((img, i) =>
          i === editIndex ? { ...img, size: sizeType } : img
        ),
      }));
      closePopup();
    },
    [editIndex, closePopup]
  );

  // שינוי תמונות גלריה
  const handleGalleryChange = useCallback(async (e) => {
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map((f) => URL.createObjectURL(f));
    setBusinessDetails((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...tempPreviews],
    }));

    const fd = new FormData();
    files.forEach((f) => fd.append("gallery", f));

    try {
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        const urls = (res.data.gallery || []).map(
          (u) => `${u}?v=${Date.now()}`
        );
        const ids = res.data.galleryImageIds || [];
        setBusinessDetails((prev) => ({
          ...prev,
          gallery: urls,
          galleryImageIds: ids,
        }));
      }
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בהעלאת גלריה");
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  }, []);

  // מחיקת תמונת גלריה
  const handleDeleteGalleryImage = useCallback(async (publicId) => {
    if (!publicId) return;

    try {
      const res = await API.delete(
        `/business/my/gallery/${encodeURIComponent(publicId)}`
      );

      if (res.status === 204) {
        setBusinessDetails((prev) => {
          const idx = prev.galleryImageIds.indexOf(publicId);
          if (idx === -1) return prev;
          const gallery = [...prev.gallery];
          const galleryImageIds = [...prev.galleryImageIds];
          gallery.splice(idx, 1);
          galleryImageIds.splice(idx, 1);
          return {
            ...prev,
            gallery,
            galleryImageIds,
          };
        });
      } else {
        alert("שגיאה במחיקת תמונה בגלריה");
      }
    } catch (err) {
      console.error("🚨 Error deleting gallery image:", err);
      alert("שגיאה במחיקת תמונה בגלריה");
    }
  }, []);

  // עריכת תמונת גלריה (לדוגמא, כרגע רק לוג)
  const handleEditImage = useCallback((idx) => {
    console.log("Edit gallery image:", idx);
  }, []);

  // שמירת הנתונים (מנוהל ידנית)
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = {
        businessName: businessDetails.businessName,
        category: businessDetails.category,
        description: businessDetails.description,
        phone: businessDetails.phone,
        email: businessDetails.email,
        address: { city: businessDetails.address.city },
      };
      const res = await API.patch("/business/my", payload);
      if (res.status === 200) {
        const updated = res.data;
        setBusinessDetails((prev) => ({
          ...prev,
          businessName: updated.businessName ?? prev.businessName,
          category: updated.category ?? prev.category,
          description: updated.description ?? prev.description,
          phone: updated.phone ?? prev.phone,
          email: updated.email ?? prev.email,
          address: {
            ...prev.address,
            city: updated.address?.city ?? prev.address.city,
          },
          logo: prev.logo,
          logoId: prev.logoId,
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
  }, [businessDetails]);

  // רפרנסים לטעינה עצלה של טאבים
  const galleryRef = useRef();
  const reviewsRef = useRef();
  const shopRef = useRef();

  // בודקים אם הטאב נראה על המסך
  const galleryVisible = useOnScreen(galleryRef);
  const reviewsVisible = useOnScreen(reviewsRef);
  const shopVisible = useOnScreen(shopRef);

  // טוענים תוכן רק כשהטאב נראה או נבחר
  useEffect(() => {
    if (currentTab === "גלריה" || galleryVisible) setGalleryLoaded(true);
    if (currentTab === "ביקורות" || reviewsVisible) setReviewsLoaded(true);
    if (currentTab === "יומן" || shopVisible) setShopLoaded(true);
  }, [currentTab, galleryVisible, reviewsVisible, shopVisible]);

  // הצגת הטאב עם טעינה עצלה
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
        if (!galleryLoaded) {
          return <div ref={galleryRef}>טוען גלריה...</div>;
        }
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
        if (!reviewsLoaded) {
          return <div ref={reviewsRef}>טוען ביקורות...</div>;
        }
        return (
          <ReviewsSection
            reviews={businessDetails.reviews}
            setReviews={(r) =>
              setBusinessDetails((prev) => ({ ...prev, reviews: r }))
            }
            currentUser={currentUser}
            renderTopBar={renderTopBar}
          />
        );
      case "יומן":
        if (!shopLoaded) {
          return <div ref={shopRef}>טוען יומן...</div>;
        }
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
            setFaqs={(f) =>
              setBusinessDetails((prev) => ({ ...prev, faqs: f }))
            }
            currentUser={currentUser}
            renderTopBar={renderTopBar}
          />
        );
      default:
        return null;
    }
  };

  // רינדור בר עליון (שם העסק, לוגו, טאבים)
  const renderTopBar = useCallback(() => {
    const avg =
      businessDetails.reviews.length > 0
        ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) /
          businessDetails.reviews.length
        : 0;

    return (
      <div className="topbar-preview">
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

        <div className="name-rating">
          <h2>{businessDetails.businessName || "שם העסק"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avg.toFixed(1)} / 5</span>
          </div>
        </div>

        {businessDetails.category && (
          <p className="preview-category">
            <strong>קטגוריה:</strong> {businessDetails.category}
          </p>
        )}

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

        <div className="tabs">
          {TABS.map((tab) => (
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
  }, [
    businessDetails,
    currentTab,
    handleLogoChange,
    handleLogoClick,
  ]);

  return (
    <div className="build-wrapper" dir="rtl">
      <Suspense fallback={<div>טוען...</div>}>{renderTabContent()}</Suspense>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button type="button" onClick={() => updateImageSize("full")}>
              גודל מלא
            </button>
            <button type="button" onClick={() => updateImageSize("custom")}>
              גודל מותאם
            </button>
            <button type="button" onClick={closePopup}>
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
