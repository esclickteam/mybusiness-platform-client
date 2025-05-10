import React, { useEffect, useState, useRef } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { dedupeByPreview } from "../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";
import ImageLoader from "@components/ImageLoader";
import "./Build.css";

// Prepare sorted, deduped options
const CITIES = Array.from(new Set(rawCities)).sort((a, b) =>
  a.localeCompare(b, "he")
);
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions = CITIES.map(city => ({ value: city, label: city }));

export default function Build() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    description: "",
    phone: "",
    category: "",
    address: { city: "" }, // ערך ברירת מחדל
    logo: null,
    gallery: [],
    galleryImageIds: [],
    mainImages: [],
    mainImageIds: [],
    reviews: [],
    faqs: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);

  const logoInputRef = useRef();
  const mainImagesInputRef = useRef();
  const galleryInputRef = useRef();
  const pendingUploadsRef = useRef([]);

  // Helper functions
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

  // Loading data on mount
  useEffect(() => {
    API.get("/business/my")
      .then(res => {
        if (res.status === 200) {
          const data = res.data.business || res.data;

          // Support for address as string or object
          const rawAddress = data.address || {};
          const city =
            typeof rawAddress === "object" && rawAddress !== null
              ? rawAddress.city || ""
              : typeof rawAddress === "string"
              ? rawAddress
              : ""; // Default value

          const urls = data.mainImages || [];
          const galleryUrls = data.gallery || [];

          // Handling IDs
          const mainIds =
            Array.isArray(data.mainImageIds) && data.mainImageIds.length === urls.length
              ? data.mainImageIds
              : urls.map(extractPublicIdFromUrl);
          const galleryIds =
            Array.isArray(data.galleryImageIds) && data.galleryImageIds.length === galleryUrls.length
              ? data.galleryImageIds
              : galleryUrls.map(extractPublicIdFromUrl);

          setBusinessDetails(prev => ({
            ...prev,
            businessName: data.businessName || "",
            description: data.description || "",
            phone: data.phone || "",
            category: data.category || "",
            city,

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
      })
      .catch(console.error);
  }, []);

  // Handle input change for both simple and nested fields
  const handleInputChange = ({ target: { name, value } }) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBusinessDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBusinessDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle logo click and upload
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;

    // Clean up previous blob preview if any
    if (businessDetails.logo?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(businessDetails.logo.preview);
    }

    const preview = URL.createObjectURL(file);

    setBusinessDetails(prev => ({
      ...prev,
      logo: { file, preview }
    }));

    const fd = new FormData();
    fd.append('logo', file);

    track(
      API.put('/business/my/logo', fd)
        .then(res => {
          if (res.status === 200) {
            setBusinessDetails(prev => ({
              ...prev,
              logo: {
                preview: res.data.logo,
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

  // Handle saving business details
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
          city: businessDetails.address.city
        }
      });

      if (res.status === 200) {
        setBusinessDetails(prev => ({
          ...prev,
          businessName: res.data.businessName || prev.businessName,
          address: { city: res.data.address.city || prev.address.city }
        }));

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

  // Render the top bar
  const renderTopBar = () => {
    const avg = businessDetails.reviews.length
      ? businessDetails.reviews.reduce((sum, r) => sum + r.rating, 0) / businessDetails.reviews.length
      : 0;

    return (
      <div className="topbar-preview">
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
          handleDeleteImage={handleDeleteImage}
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
          handleDeleteImage={handleDeleteImage}
          renderTopBar={renderTopBar}
        />
      )}
      
      {/* More sections can be added here */}
    </div>
  );
}
