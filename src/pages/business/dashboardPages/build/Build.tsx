"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

/* =====================================================
   LAZY SECTIONS
===================================================== */

const MainSection = lazy(
  () =>
    import("../buildTabs/buildSections/MainSection") as Promise<{
      default: React.ComponentType<any>;
    }>
);

const GallerySection = lazy(
  () =>
    import("../buildTabs/buildSections/GallerySection") as Promise<{
      default: React.ComponentType<any>;
    }>
);

const ReviewsSection = lazy(
  () =>
    import("../buildTabs/buildSections/ReviewsSection") as Promise<{
      default: React.ComponentType<any>;
    }>
);

const FaqSection = lazy(
  () =>
    import("../buildTabs/buildSections/FaqSection") as Promise<{
      default: React.ComponentType<any>;
    }>
);

/* =====================================================
   CONSTANTS
===================================================== */

const TABS = ["Main", "Gallery", "Reviews", "FAQs"] as const;

type BuildTab = (typeof TABS)[number];

const TAB_LABELS: Record<BuildTab, string> = {
  Main: "ראשי",
  Gallery: "גלריה",
  Reviews: "ביקורות",
  FAQs: "שאלות נפוצות",
};

const GALLERY_MAX = 5;
const MAIN_IMAGES_MAX = 6;

/* =====================================================
   TYPES
===================================================== */

type Review = {
  _id?: string;
  id?: string;
  date?: string | Date;
  rating?: number;
  text?: string;
  userName?: string;
  [key: string]: unknown;
};

type FaqItem = {
  _id?: string;
  id?: string;
  question?: string;
  answer?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
};

type LogoValue =
  | null
  | string
  | {
      preview?: string;
      publicId?: string | null;
    };

type BusinessDetails = {
  _id?: string;
  businessName: string;
  description: string;
  phone: string;
  email: string;
  category: string;
  address: {
    city: string;
  };
  logo: LogoValue;
  logoId?: string | null;
  gallery: string[];
  galleryImageIds: Array<string | null>;
  mainImages: string[];
  mainImageIds: Array<string | null>;
  reviews: Review[];
  faqs: FaqItem[];
  workHours: Record<string, unknown>;
  rating?: number;
  reviewsCount?: number;

  websiteUrl?: string;
  website?: string;
  siteUrl?: string;
  publicSiteUrl?: string;
  miniSiteUrl?: string;
  builderSiteUrl?: string;

  [key: string]: unknown;
};

type InputChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

type WorkHoursMap = Record<string | number, unknown>;

/* =====================================================
   HELPERS
===================================================== */

function extractPublicIdFromUrl(url: string) {
  const filename = url.split("/").pop()?.split("?")[0] ?? "";
  const dotIndex = filename.lastIndexOf(".");

  if (!filename || dotIndex === -1) return filename;

  return filename.substring(0, dotIndex);
}

function getLogoPreview(logo: LogoValue) {
  if (!logo) return "";
  if (typeof logo === "string") return logo;
  return logo.preview || "";
}

function formatPhoneForPreview(phone?: string) {
  if (!phone) return "";

  const clean = String(phone)
    .trim()
    .replace(/[\s()-]/g, "");

  if (clean.startsWith("+972")) return `0${clean.slice(4)}`;
  if (clean.startsWith("972")) return `0${clean.slice(3)}`;

  return clean;
}

function getBusinessWebsiteUrl(businessDetails: BusinessDetails) {
  return (
    businessDetails.websiteUrl ||
    businessDetails.website ||
    businessDetails.siteUrl ||
    businessDetails.publicSiteUrl ||
    businessDetails.miniSiteUrl ||
    businessDetails.builderSiteUrl ||
    ""
  );
}

function normalizeWebsiteUrl(url?: string) {
  const clean = String(url || "").trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://${clean}`;
}

/* =====================================================
   BUILD PAGE
===================================================== */

export default function Build() {
  const { user: currentUser } = useAuth() as any;
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<BuildTab>("Main");

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "",
    description: "",
    phone: "",
    email: "",
    category: "",
    address: { city: "" },
    logo: null,
    logoId: null,
    gallery: [],
    galleryImageIds: [],
    mainImages: [],
    mainImageIds: [],
    reviews: [],
    faqs: [],
    workHours: {},
    websiteUrl: "",
    website: "",
    siteUrl: "",
    publicSiteUrl: "",
    miniSiteUrl: "",
    builderSiteUrl: "",
  });

  const [workHours, setWorkHours] = useState<WorkHoursMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [lockAutosave, setLockAutosave] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const mainImagesInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    let isMounted = true;

    async function loadBusiness() {
      try {
        const res = await API.get("/business/my");

        if (!isMounted || res.status !== 200) return;

        const data = res.data.business || res.data;

        const rawAddress = data.address;
        const city =
          typeof rawAddress === "string" ? rawAddress : rawAddress?.city || "";

        const mainImageUrls: string[] = data.mainImages || [];
        const galleryUrls: string[] = data.gallery || [];

        const mainIds =
          Array.isArray(data.mainImageIds) &&
          data.mainImageIds.length === mainImageUrls.length
            ? data.mainImageIds
            : mainImageUrls.map(extractPublicIdFromUrl);

        const galleryIds =
          Array.isArray(data.galleryImageIds) &&
          data.galleryImageIds.length === galleryUrls.length
            ? data.galleryImageIds
            : galleryUrls.map(extractPublicIdFromUrl);

        const logoObj = data.logo
          ? {
              preview: data.logo,
              publicId: data.logoId || null,
            }
          : null;

        setBusinessDetails((prev) => ({
          ...prev,
          _id: data._id || prev._id,
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
          mainImages: mainImageUrls,
          mainImageIds: mainIds,
          faqs: data.faqs || [],
          reviews: data.reviews || [],
          workHours: data.workHours || {},
          rating: data.rating,
          reviewsCount: data.reviewsCount,

          websiteUrl: data.websiteUrl || "",
          website: data.website || "",
          siteUrl: data.siteUrl || "",
          publicSiteUrl: data.publicSiteUrl || "",
          miniSiteUrl: data.miniSiteUrl || "",
          builderSiteUrl: data.builderSiteUrl || "",
        }));
      } catch (err) {
        console.error("שגיאה בטעינת העסק:", err);
      } finally {
        if (isMounted) setFirstLoad(false);
      }
    }

    async function loadWorkHours() {
      try {
        const res = await API.get("/appointments/get-work-hours", {
          params: {
            businessId: currentUser?.businessId || "",
          },
        });

        let map: WorkHoursMap = {};

        if (Array.isArray(res.data?.workHours)) {
          res.data.workHours.forEach((item: any) => {
            map[Number(item.day)] = item;
          });
        } else if (
          res.data?.workHours &&
          typeof res.data.workHours === "object" &&
          !Array.isArray(res.data.workHours)
        ) {
          map = res.data.workHours;
        } else if (Array.isArray(res.data)) {
          res.data.forEach((item: any) => {
            map[Number(item.day)] = item;
          });
        }

        if (!isMounted) return;

        setWorkHours(map);
        setBusinessDetails((prev) => ({
          ...prev,
          workHours: map as Record<string, unknown>,
        }));
      } catch (err) {
        console.warn("שגיאה בטעינת שעות הפעילות:", err);
      }
    }

    loadBusiness();
    loadWorkHours();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.businessId]);

  /* =====================================================
     AUTOSAVE
  ===================================================== */

  useEffect(() => {
    if (firstLoad || lockAutosave) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

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
          websiteUrl: businessDetails.websiteUrl || "",
        };

        const res = await API.patch("/business/my", payload);

        if (res.status === 200) {
          setBusinessDetails((prev) => ({
            ...prev,
            ...res.data,
            logo: prev.logo,
            logoId: prev.logoId,
            gallery: prev.gallery,
            galleryImageIds: prev.galleryImageIds,
            mainImages: prev.mainImages,
            mainImageIds: prev.mainImageIds,
            reviews: prev.reviews,
            faqs: prev.faqs,
            workHours: prev.workHours,
            websiteUrl:
              res.data.websiteUrl ??
              prev.websiteUrl ??
              getBusinessWebsiteUrl(prev),
          }));
        }
      } catch (err) {
        console.error("שמירה אוטומטית נכשלה:", err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [
    firstLoad,
    lockAutosave,
    businessDetails.businessName,
    businessDetails.category,
    businessDetails.description,
    businessDetails.phone,
    businessDetails.email,
    businessDetails.address.city,
    businessDetails.websiteUrl,
  ]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = ({ target: { name, value } }: InputChangeEvent) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setBusinessDetails((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BusinessDetails] as Record<string, unknown>),
          [child]: value,
        },
      }));

      return;
    }

    setBusinessDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     LOGO
  ===================================================== */

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    setLockAutosave(true);

    const previewUrl = URL.createObjectURL(file);

    setBusinessDetails((prev) => ({
      ...prev,
      logo: {
        preview: previewUrl,
        publicId: prev.logoId || null,
      },
    }));

    window.dispatchEvent(new Event("business-profile-updated"));

    const fd = new FormData();
    fd.append("logo", file);

    try {
      const res = await API.put("/business/my/logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        setBusinessDetails((prev) => ({
          ...prev,
          logo: {
            preview: res.data.logo,
            publicId: res.data.logoId,
          },
          logoId: res.data.logoId,
        }));

        window.dispatchEvent(new Event("business-profile-updated"));
      }
    } catch (err) {
      console.error("שגיאה בהעלאת הלוגו:", err);
      alert("שגיאה בהעלאת הלוגו");
    } finally {
      setTimeout(() => URL.revokeObjectURL(previewUrl), 500);
      setLockAutosave(false);
    }
  };

  /* =====================================================
     MAIN IMAGES
  ===================================================== */

  const handleMainImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []).slice(0, MAIN_IMAGES_MAX);
    if (!files.length) return;

    e.target.value = "";

    const tempPreviews = files.map((file) => URL.createObjectURL(file));

    setBusinessDetails((prev) => ({
      ...prev,
      mainImages: [...prev.mainImages, ...tempPreviews].slice(
        0,
        MAIN_IMAGES_MAX
      ),
    }));

    const fd = new FormData();
    files.forEach((file) => fd.append("main-images", file));

    try {
      const res = await API.put("/business/my/main-images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const urls = (res.data.mainImages || []).slice(0, MAIN_IMAGES_MAX);
        const ids = (res.data.mainImageIds || []).slice(0, MAIN_IMAGES_MAX);

        setBusinessDetails((prev) => ({
          ...prev,
          mainImages: urls,
          mainImageIds: ids,
        }));

        window.dispatchEvent(new Event("business-profile-updated"));
      }
    } catch (err) {
      console.error("שגיאה בהעלאת התמונות הראשיות:", err);
      alert("שגיאה בהעלאת התמונות הראשיות");
    } finally {
      tempPreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  const handleDeleteMainImage = async (publicId: string | null) => {
    if (!publicId) return;

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

        window.dispatchEvent(new Event("business-profile-updated"));
      } else {
        alert("שגיאה במחיקת התמונה");
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה ראשית:", err);
      alert("שגיאה במחיקת התמונה");
    }
  };

  /* =====================================================
     GALLERY
  ===================================================== */

  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []).slice(0, GALLERY_MAX);
    if (!files.length) return;

    e.target.value = "";

    const tempPreviews = files.map((file) => URL.createObjectURL(file));

    setBusinessDetails((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...tempPreviews],
      galleryImageIds: [
        ...prev.galleryImageIds,
        ...tempPreviews.map(() => null),
      ],
    }));

    window.dispatchEvent(new Event("business-profile-updated"));

    const fd = new FormData();
    files.forEach((file) => fd.append("gallery", file));

    try {
      const res = await API.put("/business/my/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const urls = (res.data.gallery || []).map(
          (url: string) => `${url}?v=${Date.now()}`
        );

        const ids = res.data.galleryImageIds || [];

        setBusinessDetails((prev) => ({
          ...prev,
          gallery: urls,
          galleryImageIds: ids,
        }));

        window.dispatchEvent(new Event("business-profile-updated"));
      }
    } catch (err) {
      console.error("שגיאה בהעלאת גלריה:", err);
      alert("שגיאה בהעלאת הגלריה");
    } finally {
      tempPreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  const handleDeleteGalleryImage = async (publicId: string) => {
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

        window.dispatchEvent(new Event("business-profile-updated"));
      } else {
        alert("שגיאה במחיקת תמונה מהגלריה");
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה מהגלריה:", err);
      alert("שגיאה במחיקת תמונה מהגלריה");
    }
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload = {
        businessName: businessDetails.businessName,
        category: businessDetails.category,
        description: businessDetails.description,
        phone: businessDetails.phone,
        email: businessDetails.email,
        address: { city: businessDetails.address.city },
        websiteUrl: businessDetails.websiteUrl || "",
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
          websiteUrl: updated.websiteUrl ?? prev.websiteUrl,
          logo: prev.logo,
          logoId: prev.logoId,
        }));

        setShowViewProfile(true);
        window.dispatchEvent(new Event("business-profile-updated"));
        alert("נשמר בהצלחה!");
      } else {
        alert("השמירה נכשלה: " + res.statusText);
      }
    } catch (err) {
      console.error("שגיאת שמירה:", err);
      alert("השמירה נכשלה");
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     TOP BAR
  ===================================================== */

  const renderTopBar = () => {
    const logoPreview = getLogoPreview(businessDetails.logo);
    const businessWebsiteUrl = getBusinessWebsiteUrl(businessDetails);
    const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);
    const previewPhone = formatPhoneForPreview(businessDetails.phone);

    const avg =
      businessDetails.rating != null
        ? Math.round(Number(businessDetails.rating) * 10) / 10
        : 0;

    const reviewsCount =
      businessDetails.reviewsCount != null
        ? Number(businessDetails.reviewsCount)
        : businessDetails.reviews.length;

    return (
      <div
        dir="rtl"
        className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 text-right shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="group flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-sky-50 shadow-sm transition hover:scale-105 hover:border-violet-300"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="לוגו העסק"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                  לוגו
                </span>
              )}
            </button>

            <div className="min-w-0">
              <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                תצוגה מקדימה של הפרופיל הציבורי
              </div>

              <h2 className="mt-3 truncate text-2xl font-black tracking-tight text-slate-950">
                {businessDetails.businessName || "שם העסק"}
              </h2>

              {reviewsCount > 0 && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-700">
                  <span>★</span>
                  <span>
                    {avg.toFixed(1)} / 5
                    <span className="font-bold text-amber-600/70">
                      {" "}
                      ({reviewsCount} ביקורות)
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {isSaving && (
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              שומר...
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {businessDetails.category && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                קטגוריה
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {businessDetails.category}
              </p>
            </div>
          )}

          {businessDetails.phone && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                טלפון
              </p>
              <p
                dir="ltr"
                className="mt-1 text-left text-sm font-bold text-slate-800"
              >
                {previewPhone}
              </p>
            </div>
          )}

          {businessDetails.address.city && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                עיר
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {businessDetails.address.city}
              </p>
            </div>
          )}

          {businessWebsiteUrl && (
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-violet-400">
                אתר העסק
              </p>
              <a
                href={normalizedWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="mt-1 block truncate text-left text-sm font-black text-violet-700 hover:underline"
              >
                {businessWebsiteUrl}
              </a>
            </div>
          )}

          {businessDetails.description && (
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                תיאור
              </p>
              <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-700">
                {businessDetails.description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4">
          {TABS.map((tab) => {
            const active = tab === currentTab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className={[
                  "shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition",
                  active
                    ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                ].join(" ")}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* =====================================================
     TAB CONTENT
  ===================================================== */

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
            handleLogoChange={handleLogoChange}
            handleSave={handleSave}
            navigate={navigate}
            currentUser={currentUser}
            renderTopBar={renderTopBar}
            logoInputRef={logoInputRef}
            mainImagesInputRef={mainImagesInputRef}
            isSaving={isSaving}
            showViewProfile={showViewProfile}
          />
        );

      case "Gallery":
        return (
          <GallerySection
            businessDetails={businessDetails}
            galleryInputRef={galleryInputRef}
            handleGalleryChange={handleGalleryChange}
            handleDeleteImage={handleDeleteGalleryImage}
            renderTopBar={renderTopBar}
            isSaving={isSaving}
            navigate={navigate}
          />
        );

      case "Reviews":
        return (
          <ReviewsSection
            reviews={businessDetails.reviews}
            currentUser={currentUser}
            businessId={
              currentUser?.businessId || businessDetails._id || currentUser?._id
            }
            renderTopBar={renderTopBar}
          />
        );

      case "FAQs":
        return (
          <FaqSection
            faqs={businessDetails.faqs}
            setFaqs={(nextFaqs: FaqItem[] | ((prev: FaqItem[]) => FaqItem[])) =>
              setBusinessDetails((prev) => ({
                ...prev,
                faqs:
                  typeof nextFaqs === "function"
                    ? nextFaqs(prev.faqs)
                    : nextFaqs,
              }))
            }
            currentUser={currentUser}
            businessId={
              currentUser?.businessId || businessDetails._id || currentUser?._id
            }
            renderTopBar={renderTopBar}
          />
        );

      default:
        return null;
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="rounded-[2rem] border border-white bg-white px-8 py-7 text-center shadow-2xl">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

                <h2 className="mt-5 text-lg font-black text-slate-950">
                  טוען אזור...
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  מכינים את בונה העמוד העסקי שלך.
                </p>
              </div>
            </div>
          }
        >
          {renderTabContent()}
        </Suspense>
      </div>
    </main>
  );
}