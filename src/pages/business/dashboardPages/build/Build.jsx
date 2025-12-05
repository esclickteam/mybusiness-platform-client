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
  "Main",
  "Gallery",
  "Reviews",
  "Calendar",
  "Chat with Business",
  "FAQs",
];

// Maximum images allowed in the gallery
const GALLERY_MAX = 5;

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("Main");
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

  // shopMode state
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

  // Initial data load
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

    // Load work hours correctly (no reduce!)
    API.get('/appointments/get-work-hours', {
      params: { businessId: currentUser?.businessId || "" }
    })
    .then(res => {
      let map = {};
      if (Array.isArray(res.data.workHours)) {
        res.data.workHours.forEach(item => {
          map[Number(item.day)] = item;
        });
      } else if (
        res.data.workHours &&
        typeof res.data.workHours === "object" &&
        !Array.isArray(res.data.workHours)
      ) {
        map = res.data.workHours;
      } else if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          map[Number(item.day)] = item;
        });
      }
      setWorkHours(map);
      setBusinessDetails(prev => ({ ...prev, workHours: map }));
    })
    .catch(err => console.warn('Error loading work-hours:', err));
  }, []);

  // Autosave debounce
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

        // 🔥 חשוב: חלק מהשרתים מחזירים "business", חלק מחזירים ישירות את האובייקט
        const updated = res.data.business || res.data || {};

        setBusinessDetails(prev => ({
          ...prev,

          businessName: updated.businessName ?? prev.businessName,
          category:     updated.category     ?? prev.category,
          description:  updated.description  ?? prev.description,
          phone:        updated.phone        ?? prev.phone,
          email:        updated.email        ?? prev.email,

          address: {
            ...prev.address,
            city: updated.address?.city ?? prev.address.city,
          },

          // לא מוחקים שום דבר נוסף מה-state
          logo: prev.logo,
          logoId: prev.logoId,
          gallery: prev.gallery,
          galleryImageIds: prev.galleryImageIds,
          mainImages: prev.mainImages,
          mainImageIds: prev.mainImageIds,
          faqs: prev.faqs,
          reviews: prev.reviews,
          workHours: prev.workHours,
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
  firstLoad,
  businessDetails.businessName,
  businessDetails.category,
  businessDetails.description,
  businessDetails.phone,
  businessDetails.email,
  businessDetails.address.city
]);



  // ===== INPUT CHANGE =====
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

    if (businessDetails.logo?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(businessDetails.logo.preview);
    }

    const preview = URL.createObjectURL(file);
    setBusinessDetails(prev => ({
      ...prev,
      logo: { preview }
    }));

    const fd = new FormData();
    fd.append('logo', file);

    try {
      const res = await API.put('/business/my/logo', fd);
      if (res.status === 200) {
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
      URL.revokeObjectURL(preview);
    }
  };

  // ===== MAIN IMAGES =====
  const handleMainImagesChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map(f => URL.createObjectURL(f));
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: [...prev.mainImages, ...tempPreviews]
    }));

    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));

    try {
      const res = await API.put("/business/my/main-images", fd);
      if (res.status === 200) {
        const urls = (res.data.mainImages || []).slice(0, 6);
        const ids = (res.data.mainImageIds || []).slice(0, 6);
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: urls,
          mainImageIds: ids
        }));
      } else {
        console.warn("Main images upload failed:", res);
      }
    } catch (err) {
      console.error("Error uploading main images:", err);
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };

  const handleDeleteMainImage = async publicId => {
    console.log("🔴 Deleting publicId:", publicId);
    if (!publicId) return;

    try {
      const encodedId = encodeURIComponent(publicId);
      const res = await API.delete(`/business/my/main-images/${encodedId}`);

      if (res.status === 204) {
        setBusinessDetails(prev => {
          const idx = prev.mainImageIds.indexOf(publicId);
          if (idx === -1) return prev;
          const mainImages   = [...prev.mainImages];
          const mainImageIds = [...prev.mainImageIds];
          mainImages.splice(idx, 1);
          mainImageIds.splice(idx, 1);
          return { ...prev, mainImages, mainImageIds };
        });
      } else {
        alert("Error deleting image");
      }
    } catch (err) {
      console.error("🚨 Error:", err);
      alert("Error deleting image");
    }
  };

  const openMainImageEdit = idx => {
    setEditIndex(idx);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setEditIndex(null);
    setIsPopupOpen(false);
  };

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
  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;
    e.target.value = null;

    const tempPreviews = files.map(f => URL.createObjectURL(f));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...tempPreviews]
    }));

    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 200) {
        const urls = (res.data.gallery || []).map(u => `${u}?v=${Date.now()}`);
        const ids  = res.data.galleryImageIds || [];
        setBusinessDetails(prev => ({
          ...prev,
          gallery: urls,
          galleryImageIds: ids
        }));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading gallery");
    } finally {
      tempPreviews.forEach(URL.revokeObjectURL);
    }
  };

  const handleDeleteGalleryImage = async publicId => {
    if (!publicId) return;
    try {
      const res = await API.delete(`/business/my/gallery/${encodeURIComponent(publicId)}`);
      if (res.status === 204) {
        setBusinessDetails(prev => {
          const idx = prev.galleryImageIds.indexOf(publicId);
          if (idx === -1) return prev;
          const gallery         = [...prev.gallery];
          const galleryImageIds = [...prev.galleryImageIds];
          gallery.splice(idx, 1);
          galleryImageIds.splice(idx, 1);
          return { ...prev, gallery, galleryImageIds };
        });
      } else {
        alert("Error deleting gallery image");
      }
    } catch (err) {
      console.error("🚨 Error deleting gallery image:", err);
      alert("Error deleting gallery image");
    }
  };

  const handleEditImage = idx => {
    console.log("Edit gallery image:", idx);
  };

  // ===== SAVE =====
  const handleSave = async () => {
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
        alert("✅ Saved successfully!");
      } else {
        alert("❌ Save failed: " + res.statusText);
      }
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("❌ Save failed");
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
        <div className="logo-circle" onClick={handleLogoClick}>
          {businessDetails.logo?.preview ? (
  <img src={businessDetails.logo.preview} className="logo-img" />
) : (
  <span>Logo</span>
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
          <h2>{businessDetails.businessName || "Business Name"}</h2>
          <div className="rating-badge">
            <span className="star">★</span>
            <span>{avg.toFixed(1)} / 5</span>
          </div>
        </div>

        {businessDetails.category && (
          <p className="preview-category">
            <strong>Category:</strong> {businessDetails.category}
          </p>
        )}

        {businessDetails.description && (
          <p className="preview-description">
            <strong>Description:</strong> {businessDetails.description}
          </p>
        )}
        {businessDetails.phone && (
          <p className="preview-phone">
            <strong>Phone:</strong> {businessDetails.phone}
          </p>
        )}
        {businessDetails.address.city && (
          <p className="preview-city">
            <strong>City:</strong> {businessDetails.address.city}
          </p>
        )}

        <hr className="divider" />

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
      case "Main":
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
      case "Gallery":
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
      case "Reviews":
        return (
          <ReviewsSection
            reviews={businessDetails.reviews}
            setReviews={r => setBusinessDetails(prev => ({ ...prev, reviews: r }))}
            currentUser={currentUser}
            renderTopBar={renderTopBar}
          />
        );
      case "Calendar":
        return (
          <ShopSection
            setBusinessDetails={setBusinessDetails}
            renderTopBar={renderTopBar}
            workHours={workHours}
            setWorkHours={setWorkHours}
          />
        );
      case "Chat with Business":
        return (
          <ChatSection
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            renderTopBar={renderTopBar}
          />
        );
      case "FAQs":
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
      <Suspense fallback={<div>Loading...</div>}>
        {renderTabContent()}
      </Suspense>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Select Image Size</h3>
            <button type="button" onClick={() => updateImageSize("full")}>Full Size</button>
            <button type="button" onClick={() => updateImageSize("custom")}>Custom Size</button>
            <button type="button" onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
