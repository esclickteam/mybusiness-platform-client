"use client";

import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import API from "@api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

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

const TABS = ["Main", "Gallery", "Reviews", "Website", "FAQs"] as const;

type BuildTab = (typeof TABS)[number];

const TAB_LABELS: Record<BuildTab, string> = {
  Main: "ראשי",
  Gallery: "גלריה",
  Reviews: "ביקורות",
  Website: "אתר",
  FAQs: "שאלות נפוצות",
};

const GALLERY_MAX = 5;
const MAIN_IMAGES_MAX = 6;

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

function isMeaningfulCategory(category?: string) {
  const clean = String(category || "").trim();
  return clean !== "" && clean !== "כללי" && clean.toLowerCase() !== "general";
}

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
    websiteUrl: "",
    website: "",
    siteUrl: "",
    publicSiteUrl: "",
    miniSiteUrl: "",
    builderSiteUrl: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [lockAutosave, setLockAutosave] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const mainImagesInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

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

    loadBusiness();

    return () => {
      isMounted = false;
    };
  }, []);

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
            websiteUrl:
              res.data.websiteUrl ??
              prev.websiteUrl ??
              getBusinessWebsiteUrl(prev),
          }));

          window.dispatchEvent(new Event("business-profile-updated"));
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

  const renderPreviewCard = () => {
    const logoPreview = getLogoPreview(businessDetails.logo);
    const businessWebsiteUrl = getBusinessWebsiteUrl(businessDetails);
    const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);
    const previewPhone = formatPhoneForPreview(businessDetails.phone);
    const coverImage = businessDetails.mainImages?.[0] || businessDetails.gallery?.[0];

    return (
      <div
        dir="rtl"
        className="overflow-hidden rounded-[2.35rem] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.94)_38%,rgba(237,233,254,0.88)_100%)] text-right shadow-[0_34px_110px_rgba(79,70,229,0.18)] backdrop-blur-xl"
      >
        <div className="relative p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          {coverImage && (
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 shadow-[0_24px_70px_rgba(30,41,59,0.14)]">
              <img
                src={coverImage}
                alt="תמונת קאבר"
                className="h-64 w-full object-cover sm:h-80 lg:h-[360px]"
              />
            </div>
          )}

          <div
            className={[
              "relative mx-auto rounded-[2rem] border border-white/90 bg-white/92 p-5 text-center shadow-[0_30px_90px_rgba(30,41,59,0.14)] backdrop-blur-xl sm:p-7",
              coverImage ? "-mt-16 max-w-5xl" : "mt-8 max-w-5xl",
            ].join(" ")}
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-blue-100 shadow-[0_22px_55px_rgba(124,58,237,0.22)]">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="לוגו העסק"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black text-violet-600">
                  {businessDetails.businessName?.charAt(0) || "B"}
                </span>
              )}
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {businessDetails.businessName || "שם העסק"}
            </h2>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {isMeaningfulCategory(businessDetails.category) && (
                <span className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-black text-violet-800">
                  {businessDetails.category}
                </span>
              )}

              {businessDetails.address.city && (
                <span className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
                  {businessDetails.address.city}
                </span>
              )}
            </div>

            {businessDetails.description && (
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">
                {businessDetails.description}
              </p>
            )}

            <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2">
              {businessDetails.phone && (
                <div className="rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-right shadow-[0_12px_32px_rgba(79,70,229,0.08)]">
                  <p className="text-xs font-black text-slate-400">טלפון</p>
                  <p
                    dir="ltr"
                    className="mt-1 text-left text-lg font-black text-slate-950"
                  >
                    {previewPhone}
                  </p>
                </div>
              )}

              {businessDetails.email && (
                <div className="rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-right shadow-[0_12px_32px_rgba(79,70,229,0.08)]">
                  <p className="text-xs font-black text-slate-400">אימייל</p>
                  <p
                    dir="ltr"
                    className="mt-1 truncate text-left text-lg font-black text-slate-950"
                  >
                    {businessDetails.email}
                  </p>
                </div>
              )}
            </div>

            {businessWebsiteUrl ? (
              <a
                href={normalizedWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5"
              >
                כניסה לאתר העסק
              </a>
            ) : (
              <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 px-4 py-3 text-sm font-black text-violet-700">
                עדיין לא נוסף קישור לאתר העסק.
              </div>
            )}

            <div className="mx-auto mt-7 max-w-5xl border-t border-violet-100/80 pt-6">
              <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                {TABS.map((tab) => {
                  const active = tab === currentTab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCurrentTab(tab)}
                      className={[
                        "flex min-w-[124px] items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition",
                        active
                          ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-[0_14px_34px_rgba(124,58,237,0.30)]"
                          : "border border-violet-100 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700",
                      ].join(" ")}
                    >
                      {TAB_LABELS[tab]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {businessDetails.mainImages.length > 1 && (
            <div className="mx-auto mt-7 grid max-w-5xl grid-cols-3 gap-3">
              {businessDetails.mainImages.slice(1, 4).map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`תמונה ${index + 1}`}
                  className="h-24 w-full rounded-2xl object-cover shadow-lg shadow-slate-200"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWebsiteTab = () => {
    return (
      <section
        dir="rtl"
        className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[0.95fr_1.05fr]">
          <aside className="order-2 xl:order-1">{renderPreviewCard()}</aside>

          <div className="order-1 overflow-hidden rounded-[2rem] border border-white/90 bg-white/92 shadow-[0_34px_110px_rgba(79,70,229,0.16)] backdrop-blur-xl xl:order-2">
            <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
              <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                  ניהול אתר העסק
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  אתר העסק
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  כאן מחברים את האתר שנבנה במערכת. הקישור יוצג ללקוחות בעמוד
                  הציבורי ובתצוגה המקדימה.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <div className="rounded-[1.75rem] border border-violet-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.78)_100%)] p-5 shadow-[0_18px_50px_rgba(79,70,229,0.10)]">
                <label className="mb-2 block text-sm font-black text-slate-800">
                  קישור לאתר שנבנה במערכת
                </label>

                <input
                  type="url"
                  name="websiteUrl"
                  value={businessDetails.websiteUrl || ""}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  placeholder="לדוגמה: https://your-site.bizuply.com"
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                  אפשר להדביק קישור מלא או דומיין. אם אין https המערכת תפתח אותו
                  אוטומטית כקישור תקין.
                </p>
              </div>

              {businessDetails.websiteUrl && (
                <a
                  href={normalizeWebsiteUrl(businessDetails.websiteUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[52px] w-full items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  פתיחת האתר בחלון חדש
                </a>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "שומר..." : "שמירת קישור האתר"}
              </button>
            </div>
          </div>
        </div>
      </section>
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
            handleLogoChange={handleLogoChange}
            handleSave={handleSave}
            navigate={navigate}
            currentUser={currentUser}
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
          />
        );

      case "Website":
        return renderWebsiteTab();

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
          />
        );

      default:
        return null;
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
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