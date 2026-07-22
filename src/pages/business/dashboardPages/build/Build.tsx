"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "@api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import ImageLoader from "@components/ImageLoader";
import CityAutocomplete from "@components/CityAutocomplete";
import CategoryAutocomplete from "../../../../components/CategoryAutocomplete";
import ReviewCard from "@/components/ReviewCard";
import ProfileContactBlock from "@/components/shared/ProfileContactBlock";
import { REVIEW_RATING_PARAMETER_DEFINITIONS } from "@/utils/reviewDisplay";
import { useLocaleDir } from "@/hooks/useLocaleDir";

const TABS = ["Main", "Gallery", "Reviews", "Website", "FAQs"] as const;

type BuildTab = (typeof TABS)[number];

const TAB_LABEL_KEYS: Record<BuildTab, string> = {
  Main: "buildPage.tabs.main",
  Gallery: "buildPage.tabs.gallery",
  Reviews: "buildPage.tabs.reviews",
  Website: "buildPage.tabs.website",
  FAQs: "buildPage.tabs.faqs",
};

const GALLERY_MAX = 12;
const MAIN_IMAGES_MAX = 6;

type Review = {
  _id?: string;
  id?: string;
  rating?: number | string;
  averageScore?: number | string;
  comment?: string;
  text?: string;
  userName?: string;
  client?: {
    name?: string;
  };
  createdAt?: string | Date;
  date?: string | Date;
  [key: string]: unknown;
};

type FaqItem = {
  _id?: string;
  id?: string;
  faqId?: string;
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
      url?: string;
      secure_url?: string;
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

  whatsappUrl?: string;
  whatsapp?: string;
  whatsappLink?: string;
  whatsAppUrl?: string;

  [key: string]: unknown;
};

type InputChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

type FaqFormState = {
  question: string;
  answer: string;
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

  return logo.preview || logo.url || logo.secure_url || "";
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

function normalizePhoneValueForInput(phone?: string) {
  if (!phone) return "";

  return String(phone)
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");
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

function getBusinessWhatsappUrl(businessDetails: BusinessDetails) {
  return (
    businessDetails.whatsappUrl ||
    businessDetails.whatsapp ||
    businessDetails.whatsappLink ||
    businessDetails.whatsAppUrl ||
    ""
  );
}

function normalizeWhatsappUrl(value?: string) {
  const clean = String(value || "").trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  let digits = clean.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }

  return digits ? `https://wa.me/${digits}` : "";
}


function isMeaningfulCategory(category?: string) {
  const clean = String(category || "").trim();
  return clean !== "" && clean !== "כללי" && clean.toLowerCase() !== "general";
}

function getFaqId(faq: FaqItem, index: number) {
  return faq.faqId || faq._id || faq.id || `faq-${index}`;
}

function normalizeCategoryInput(value: unknown): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    const item = value as {
      name?: unknown;
      title?: unknown;
      label?: unknown;
      value?: unknown;
      category?: unknown;
    };

    return String(
      item.name || item.title || item.label || item.value || item.category || ""
    ).trim();
  }

  return String(value).trim();
}

export default function Build() {
  const { user: currentUser } = useAuth() as any;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const dir = useLocaleDir();

  const [currentTab, setCurrentTab] = useState<BuildTab>("Main");
  const [highlightedReviewId, setHighlightedReviewId] = useState("");

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
    whatsappUrl: "",
    whatsapp: "",
    whatsappLink: "",
    whatsAppUrl: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [lockAutosave, setLockAutosave] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  const [newFaq, setNewFaq] = useState<FaqFormState>({
    question: "",
    answer: "",
  });
  const [editFaqId, setEditFaqId] = useState<string | null>(null);
  const [editedFaq, setEditedFaq] = useState<FaqFormState>({
    question: "",
    answer: "",
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const mainImagesInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const logoPreview = getLogoPreview(businessDetails.logo);
  const businessWebsiteUrl = getBusinessWebsiteUrl(businessDetails);
  const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);
  const businessWhatsappUrl = getBusinessWhatsappUrl(businessDetails);
  const normalizedWhatsappUrl = normalizeWhatsappUrl(businessWhatsappUrl);
  const coverImage =
    businessDetails.mainImages?.[0] || businessDetails.gallery?.[0] || "";
  const previewPhone = formatPhoneForPreview(businessDetails.phone);
  const phoneInputValue = normalizePhoneValueForInput(businessDetails.phone);

  const avg =
    businessDetails.rating != null
      ? Math.round(Number(businessDetails.rating) * 10) / 10
      : 0;

  const reviewsCount =
    businessDetails.reviewsCount != null
      ? Number(businessDetails.reviewsCount)
      : businessDetails.reviews.length;

  const sortedReviews = useMemo(() => {
    return [...businessDetails.reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [businessDetails.reviews]);

  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toLowerCase();

    if (tabParam === "reviews") {
      setCurrentTab("Reviews");
    }

    const reviewId = searchParams.get("reviewId");

    if (reviewId) {
      setHighlightedReviewId(reviewId);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpenReview = (event: Event) => {
      const detail = (event as CustomEvent<{ reviewId?: string }>).detail;

      setCurrentTab("Reviews");

      if (detail?.reviewId) {
        setHighlightedReviewId(detail.reviewId);
      }
    };

    window.addEventListener("bizuply:open-review", handleOpenReview);

    return () => {
      window.removeEventListener("bizuply:open-review", handleOpenReview);
    };
  }, []);

  useEffect(() => {
    if (!highlightedReviewId || currentTab !== "Reviews") return;

    const scrollTimer = window.setTimeout(() => {
      document
        .getElementById(`review-${highlightedReviewId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);

    const clearTimer = window.setTimeout(() => {
      setHighlightedReviewId("");
    }, 6000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [highlightedReviewId, currentTab, sortedReviews.length]);

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
          whatsappUrl: data.whatsappUrl || "",
          whatsapp: data.whatsapp || "",
          whatsappLink: data.whatsappLink || "",
          whatsAppUrl: data.whatsAppUrl || "",
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
        const cleanCategory = normalizeCategoryInput(businessDetails.category);

        const payload = {
          businessName: businessDetails.businessName,
          category: cleanCategory,
          description: businessDetails.description,
          phone: businessDetails.phone,
          email: businessDetails.email,
          address: { city: businessDetails.address.city },
          websiteUrl: businessDetails.websiteUrl || "",
          website: businessDetails.websiteUrl || "",
          siteUrl: businessDetails.websiteUrl || "",
          publicSiteUrl: businessDetails.websiteUrl || "",
          whatsappUrl: businessDetails.whatsappUrl || "",
          whatsapp: businessDetails.whatsappUrl || "",
          whatsappLink: businessDetails.whatsappUrl || "",
          whatsAppUrl: businessDetails.whatsappUrl || "",
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
    businessDetails.whatsappUrl,
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
      alert(t("buildPage.alerts.uploadLogoFailed"));
    } finally {
      setTimeout(() => URL.revokeObjectURL(previewUrl), 500);
      setLockAutosave(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (isSaving || isDeletingLogo) return;

    const approved = window.confirm(t("buildPage.alerts.deleteLogoConfirm"));
    if (!approved) return;

    try {
      setIsDeletingLogo(true);

      const response = await fetch("/api/business/my/logo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        alert(t("buildPage.alerts.deleteLogoFailedWith", { detail: error?.error || response.statusText }));
        return;
      }

      setBusinessDetails((prev) => ({
        ...prev,
        logo: null,
        logoId: null,
      }));

      window.dispatchEvent(new Event("business-profile-updated"));
    } catch (err) {
      console.error(err);
      alert(t("buildPage.alerts.deleteLogoFailed"));
    } finally {
      setIsDeletingLogo(false);
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
      alert(t("buildPage.alerts.uploadMainImagesFailed"));
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
        alert(t("buildPage.alerts.deleteImageFailed"));
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה ראשית:", err);
      alert(t("buildPage.alerts.deleteImageFailed"));
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
      alert(t("buildPage.alerts.uploadGalleryFailed"));
    } finally {
      tempPreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  const handleDeleteGalleryImage = async (publicId: string | null) => {
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
        alert(t("buildPage.alerts.deleteGalleryImageFailed"));
      }
    } catch (err) {
      console.error("שגיאה במחיקת תמונה מהגלריה:", err);
      alert(t("buildPage.alerts.deleteGalleryImageFailed"));
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
        website: businessDetails.websiteUrl || "",
        siteUrl: businessDetails.websiteUrl || "",
        publicSiteUrl: businessDetails.websiteUrl || "",
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
          websiteUrl:
            updated.websiteUrl ??
            updated.website ??
            updated.siteUrl ??
            updated.publicSiteUrl ??
            prev.websiteUrl,
          website:
            updated.website ??
            updated.websiteUrl ??
            prev.website,
          siteUrl:
            updated.siteUrl ??
            updated.websiteUrl ??
            prev.siteUrl,
          publicSiteUrl:
            updated.publicSiteUrl ??
            updated.websiteUrl ??
            prev.publicSiteUrl,
          whatsappUrl:
            updated.whatsappUrl ??
            updated.whatsapp ??
            updated.whatsappLink ??
            updated.whatsAppUrl ??
            prev.whatsappUrl,
          whatsapp:
            updated.whatsapp ??
            updated.whatsappUrl ??
            prev.whatsapp,
          whatsappLink:
            updated.whatsappLink ??
            updated.whatsappUrl ??
            prev.whatsappLink,
          whatsAppUrl:
            updated.whatsAppUrl ??
            updated.whatsappUrl ??
            prev.whatsAppUrl,
          logo: prev.logo,
          logoId: prev.logoId,
        }));

        setShowViewProfile(true);
        window.dispatchEvent(new Event("business-profile-updated"));
        alert(t("buildPage.alerts.saved"));
      } else {
        alert(t("buildPage.alerts.saveFailedWith", { detail: res.statusText }));
      }
    } catch (err) {
      console.error("שגיאת שמירה:", err);
      alert(t("buildPage.alerts.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFaq = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = newFaq.question.trim();
    const answer = newFaq.answer.trim();

    if (!question || !answer) return;

    try {
      const res = await API.post("/business/my/faqs", {
        question,
        answer,
      });

      const added = res.data.faq ?? res.data;

      setBusinessDetails((prev) => ({
        ...prev,
        faqs: [added, ...prev.faqs],
      }));

      setNewFaq({ question: "", answer: "" });
    } catch (err) {
      console.error("שגיאה בהוספת שאלה:", err);
      alert(t("buildPage.alerts.addFaqFailed"));
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const approved = window.confirm(t("buildPage.alerts.deleteFaqConfirm"));
    if (!approved) return;

    try {
      await API.delete(`/business/my/faqs/${id}`);

      setBusinessDetails((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((faq, index) => getFaqId(faq, index) !== id),
      }));
    } catch (err) {
      console.error("שגיאה במחיקת שאלה:", err);
      alert(t("buildPage.alerts.deleteFaqFailed"));
    }
  };

  const handleSaveFaqEdit = async (id: string) => {
    const question = editedFaq.question.trim();
    const answer = editedFaq.answer.trim();

    if (!question || !answer) return;

    try {
      const res = await API.put(`/business/my/faqs/${id}`, {
        question,
        answer,
      });

      const updated = res.data.faq ?? res.data;

      setBusinessDetails((prev) => ({
        ...prev,
        faqs: prev.faqs.map((faq, index) =>
          getFaqId(faq, index) === id ? updated : faq
        ),
      }));

      setEditFaqId(null);
      setEditedFaq({ question: "", answer: "" });
    } catch (err) {
      console.error("שגיאה בעדכון שאלה:", err);
      alert(t("buildPage.alerts.updateFaqFailed"));
    }
  };

  const renderEditTabs = () => {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 border-b border-violet-100 pb-5 text-center">
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
                  ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-[0_14px_34px_rgba(124,58,237,0.30)]"
                  : "border border-violet-100 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700",
              ].join(" ")}
            >
              {t(TAB_LABEL_KEYS[tab])}
            </button>
          );
        })}
      </div>
    );
  };

  const renderEditorContent = () => {
    if (currentTab === "Main") {
      return (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-[1.75rem] border border-violet-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.78)_100%)] p-5 shadow-[0_18px_50px_rgba(79,70,229,0.10)]">
            <h2 className="text-lg font-black text-slate-800">
              {t("buildPage.main.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("buildPage.main.subtitle")}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.businessName")} <span className="text-violet-600">*</span>
                </label>

                <input
                  type="text"
                  name="businessName"
                  value={businessDetails.businessName}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  placeholder={t("buildPage.main.businessNamePlaceholder")}
                  className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.description")}
                </label>

                <textarea
                  name="description"
                  value={businessDetails.description}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={isSaving}
                  placeholder={t("buildPage.main.descriptionPlaceholder")}
                  className="w-full resize-none rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.phone")}
                </label>

                <div
                  dir="ltr"
                  className="relative w-full rounded-2xl border border-violet-100 bg-white/90 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100"
                >
                  <PhoneInput
                    country="il"
                    enableSearch
                    value={phoneInputValue}
                    onChange={(val) =>
                      handleInputChange({
                        target: { name: "phone", value: `+${val}` },
                      })
                    }
                    disabled={isSaving}
                    inputProps={{
                      name: "phone",
                      dir: "ltr",
                      inputMode: "tel",
                      autoComplete: "tel",
                    }}
                    containerClass="!w-full ![direction:ltr]"
                    inputClass="!h-12 !w-full !rounded-2xl !border-0 !bg-transparent !pl-14 !pr-4 !text-left !text-sm !font-bold !text-slate-900 !shadow-none !outline-none ![direction:ltr] ![unicode-bidi:plaintext]"
                    buttonClass="!left-0 !right-auto !rounded-l-2xl !rounded-r-none !border-0 !border-r !border-violet-100 !bg-white/70 hover:!bg-white"
                    dropdownClass="!z-[9999] !rounded-2xl !border-slate-200 !text-left !shadow-2xl ![direction:ltr]"
                    searchClass="!rounded-xl !border-slate-200 !px-3 !py-2 !text-left ![direction:ltr]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.email")}
                </label>

                <input
                  type="email"
                  name="email"
                  value={businessDetails.email}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.category")}
                </label>

                <div className="rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                  <CategoryAutocomplete
                    value={businessDetails.category}
                    onChange={(val: unknown) =>
                      handleInputChange({
                        target: {
                          name: "category",
                          value: normalizeCategoryInput(val),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.city")}
                </label>

                <div className="rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                  <CityAutocomplete
                    value={businessDetails.address.city}
                    onChange={(val: string) =>
                      handleInputChange({
                        target: { name: "address.city", value: val },
                      })
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.website")}
                </label>

                <input
                  type="url"
                  name="websiteUrl"
                  value={businessDetails.websiteUrl || ""}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  placeholder={t("buildPage.main.websitePlaceholder")}
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                  {t("buildPage.main.websiteHint")}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("buildPage.main.whatsapp")}
                </label>

                <input
                  type="text"
                  name="whatsappUrl"
                  value={businessDetails.whatsappUrl || ""}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  placeholder={t("buildPage.main.whatsappPlaceholder")}
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                  {t("buildPage.main.whatsappHint")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-violet-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)]">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-violet-50 shadow-sm">
                  {logoPreview ? (
                    <ImageLoader
                      src={logoPreview}
                      alt={t("buildPage.preview.logoAlt")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🏷️</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {t("buildPage.main.logoTitle")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("buildPage.main.logoHint")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 py-3 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20"
                >
                  {t("buildPage.main.uploadLogo")}
                </button>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleDeleteLogo}
                    disabled={isDeletingLogo}
                    className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-600 shadow-sm hover:bg-rose-50 disabled:opacity-60"
                  >
                    {isDeletingLogo ? t("buildPage.main.deletingLogo") : t("buildPage.main.deleteLogo")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentTab === "Gallery") {
      return (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-[1.75rem] border border-violet-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)]">
            <div className="mb-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  {t("buildPage.gallery.mainImagesTitle")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t("buildPage.gallery.mainImagesSubtitle")}
                </p>
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                {t("buildPage.gallery.uploadedCount", { count: businessDetails.mainImages.length })}
              </span>
            </div>

            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businessDetails.mainImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative w-full max-w-xs overflow-hidden rounded-2xl border border-violet-100 bg-slate-50 shadow-sm"
                >
                  <ImageLoader
                    src={url}
                    alt={t("buildPage.gallery.mainImageAlt", { index: index + 1 })}
                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {index === 0 && (
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-violet-700 shadow-sm">
                      {t("buildPage.gallery.coverBadge")}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteMainImage(
                        businessDetails.mainImageIds[index] || null
                      )
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg hover:bg-rose-50"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              {businessDetails.mainImages.length < MAIN_IMAGES_MAX && (
                <button
                  type="button"
                  onClick={() => mainImagesInputRef.current?.click()}
                  className="flex h-40 w-full max-w-xs flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/70 text-violet-600 transition hover:bg-violet-50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    +
                  </span>

                  <span className="mt-3 text-sm font-black">
                    {t("buildPage.gallery.addImages")}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-violet-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)]">
            <div className="mb-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  {t("buildPage.gallery.galleryTitle")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t("buildPage.gallery.gallerySubtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 py-3 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20"
              >
                {t("buildPage.gallery.addGalleryImages")}
              </button>
            </div>

            {businessDetails.gallery.length ? (
              <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {businessDetails.gallery.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative w-full max-w-xs overflow-hidden rounded-2xl border border-violet-100 bg-slate-50 shadow-sm"
                  >
                    <ImageLoader
                      src={url}
                      alt={t("buildPage.gallery.galleryImageAlt", { index: index + 1 })}
                      className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteGalleryImage(
                          businessDetails.galleryImageIds[index] || null
                        )
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg hover:bg-rose-50"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EditorEmptyState
                icon="📸"
                title={t("buildPage.gallery.emptyTitle")}
                text={t("buildPage.gallery.emptyText")}
              />
            )}
          </div>
        </div>
      );
    }

    if (currentTab === "Reviews") {
      const publicReviewsUrl = businessDetails._id
        ? `/business/${businessDetails._id}?tab=reviews`
        : "";

      return (
        <div className="mx-auto max-w-3xl space-y-6 text-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{t("buildPage.reviews.title")}</h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {t("buildPage.reviews.editorIntro")}
              {reviewsCount > 0
                ? t("buildPage.reviews.reviewsCountParen", { count: reviewsCount })
                : ""}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-violet-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.78)_100%)] p-5 shadow-[0_18px_50px_rgba(79,70,229,0.10)] sm:p-6">
            <h3 className="text-lg font-black text-slate-800">{t("buildPage.reviews.parametersTitle")}</h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {t("buildPage.reviews.parametersIntro")}
            </p>

            <ul className="mt-4 space-y-2">
              {REVIEW_RATING_PARAMETER_DEFINITIONS.map((parameter) => (
                <li
                  key={parameter.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-violet-100/80 bg-white/90 px-4 py-3 text-sm"
                >
                  <span className="font-black text-slate-800">
                    {parameter.label}
                  </span>

                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black",
                      parameter.required
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {parameter.required ? t("buildPage.reviews.required") : t("buildPage.reviews.optional")}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              {t("buildPage.reviews.viewHint")}
            </p>

            {publicReviewsUrl ? (
              <a
                href={publicReviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-sm font-black !text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 sm:w-auto"
              >
                {t("buildPage.reviews.viewPublic")}
              </a>
            ) : (
              <p className="mt-4 text-sm font-bold text-slate-400">
                {t("buildPage.reviews.saveForLink")}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (currentTab === "Website") {
      return (
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[1.75rem] border border-violet-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.78)_100%)] p-5 text-center shadow-[0_18px_50px_rgba(79,70,229,0.10)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
              🌐
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-800">
              {t("buildPage.website.title")}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
              {t("buildPage.website.editorSubtitle")}
            </p>

            <div className="mt-6 text-start">
              <label className="mb-2 block text-sm font-black text-slate-800">
                {t("buildPage.website.linkLabel")}
              </label>

              <input
                type="url"
                name="websiteUrl"
                value={businessDetails.websiteUrl || ""}
                onChange={handleInputChange}
                disabled={isSaving}
                placeholder={t("buildPage.main.websitePlaceholder")}
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="mt-5 text-start">
              <label className="mb-2 block text-sm font-black text-slate-800">
                {t("buildPage.website.whatsappLabel")}
              </label>

              <input
                type="text"
                name="whatsappUrl"
                value={businessDetails.whatsappUrl || ""}
                onChange={handleInputChange}
                disabled={isSaving}
                placeholder={t("buildPage.main.whatsappPlaceholder")}
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {businessDetails.whatsappUrl && (
              <a
                href={normalizeWhatsappUrl(businessDetails.whatsappUrl)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex h-[52px] w-full items-center justify-center rounded-2xl border border-emerald-100 bg-white px-6 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                {t("buildPage.website.openWhatsapp")}
              </a>
            )}

            {businessDetails.websiteUrl && (
              <a
                href={normalizeWebsiteUrl(businessDetails.websiteUrl)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex h-[52px] w-full items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                {t("buildPage.website.openWebsite")}
              </a>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <form
          onSubmit={handleAddFaq}
          className="rounded-[1.75rem] border border-violet-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)]"
        >
          <h2 className="text-lg font-black text-slate-800">
            {t("buildPage.faqs.addTitle")}
          </h2>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={newFaq.question}
              onChange={(event) =>
                setNewFaq((prev) => ({
                  ...prev,
                  question: event.target.value,
                }))
              }
              placeholder={t("buildPage.faqs.questionPlaceholder")}
              className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <textarea
              value={newFaq.answer}
              onChange={(event) =>
                setNewFaq((prev) => ({
                  ...prev,
                  answer: event.target.value,
                }))
              }
              rows={3}
              placeholder={t("buildPage.faqs.answerPlaceholder")}
              className="w-full resize-none rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <button
              type="submit"
              className="h-[48px] w-full rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20"
            >
              {t("buildPage.faqs.addButton")}
            </button>
          </div>
        </form>

        {businessDetails.faqs.length ? (
          businessDetails.faqs.map((faq, index) => {
            const id = getFaqId(faq, index);
            const isEditing = editFaqId === id;

            return (
              <div
                key={id}
                className="rounded-[1.5rem] border border-violet-100 bg-white/95 p-5 shadow-[0_10px_28px_rgba(79,70,229,0.08)]"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={editedFaq.question}
                      onChange={(event) =>
                        setEditedFaq((prev) => ({
                          ...prev,
                          question: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-bold outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />

                    <textarea
                      value={editedFaq.answer}
                      onChange={(event) =>
                        setEditedFaq((prev) => ({
                          ...prev,
                          answer: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveFaqEdit(id)}
                        className="h-11 flex-1 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-sm font-black text-slate-800"
                      >
                        {t("buildPage.actions.save")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditFaqId(null)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600"
                      >
                        {t("buildPage.actions.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-base font-black text-slate-800">
                      {faq.question}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {faq.answer}
                    </p>

                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditFaqId(id);
                          setEditedFaq({
                            question: faq.question || "",
                            answer: faq.answer || "",
                          });
                        }}
                        className="rounded-2xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700"
                      >
                        {t("buildPage.actions.edit")}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(id)}
                        className="rounded-2xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-600"
                      >
                        {t("buildPage.actions.delete")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <EditorEmptyState
            icon="❔"
            title={t("buildPage.faqs.emptyEditorTitle")}
            text={t("buildPage.faqs.emptyEditorText")}
          />
        )}
      </div>
    );
  };

  const renderPreviewContent = () => {
    if (currentTab === "Main") {
      return (
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {businessDetails.mainImages.length ? (
            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businessDetails.mainImages.slice(0, 6).map((url, index) => (
                <ImageLoader
                  key={`${url}-${index}`}
                  src={url}
                  alt={t("buildPage.gallery.mainImageAlt", { index: index + 1 })}
                  className="h-64 w-full max-w-sm rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
                />
              ))}
            </div>
          ) : (
            <PreviewEmptyState
              icon="🖼️"
              title={t("buildPage.previewEmpty.noMainImagesTitle")}
              text={t("buildPage.previewEmpty.noMainImagesText")}
            />
          )}

          <div className="mx-auto max-w-4xl text-start">
            <div className="mb-4 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
              <h2 className="text-xl font-black text-slate-800">
                {t("buildPage.reviews.recentTitle")}
              </h2>
            </div>

            {sortedReviews.length ? (
              <div className="grid justify-center gap-4 lg:grid-cols-2">
                {sortedReviews.slice(0, 2).map((review, index) => (
                  <ReviewCard key={review._id || review.id || index} review={review} />
                ))}
              </div>
            ) : (
              <PreviewEmptyState
                icon="⭐"
                title={t("buildPage.reviews.emptyTitle")}
                text={t("buildPage.reviews.emptyText")}
              />
            )}
          </div>
        </div>
      );
    }

    if (currentTab === "Gallery") {
      return (
        <div className="mx-auto max-w-4xl text-center">
          {businessDetails.gallery.length ? (
            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businessDetails.gallery.map((url, index) => (
                <ImageLoader
                  key={`${url}-${index}`}
                  src={url}
                  alt={t("buildPage.gallery.galleryImageAlt", { index: index + 1 })}
                  className="h-52 w-full max-w-xs rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
                />
              ))}
            </div>
          ) : (
            <PreviewEmptyState
              icon="📸"
              title={t("buildPage.previewEmpty.noGalleryTitle")}
              text={t("buildPage.previewEmpty.noGalleryText")}
            />
          )}
        </div>
      );
    }

    if (currentTab === "Reviews") {
      return (
        <div className="mx-auto max-w-5xl text-start">
          <div className="mb-5 text-center sm:text-start">
            <h2 className="text-2xl font-black text-slate-800">{t("buildPage.reviews.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("buildPage.reviews.countLabel", { count: reviewsCount })}</p>
          </div>

          {sortedReviews.length ? (
            <div className="grid justify-center gap-4 lg:grid-cols-2">
              {sortedReviews.map((review, index) => {
                const reviewId = String(review._id || review.id || "");

                return (
                  <ReviewCard
                    key={review._id || review.id || index}
                    review={review}
                    reviewDomId={reviewId ? `review-${reviewId}` : undefined}
                    highlighted={
                      Boolean(reviewId) && reviewId === highlightedReviewId
                    }
                  />
                );
              })}
            </div>
          ) : (
            <PreviewEmptyState
              icon="⭐"
              title={t("buildPage.reviews.emptyTitle")}
              text={t("buildPage.reviews.emptyText")}
            />
          )}
        </div>
      );
    }

    if (currentTab === "Website") {
      return (
        <div className="mx-auto max-w-3xl text-center">
          {businessWebsiteUrl ? (
            <div className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8 shadow-[0_16px_44px_rgba(79,70,229,0.10)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                🌐
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-800">
                {t("buildPage.website.title")}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                {t("buildPage.website.previewSubtitle")}
              </p>

              <a
                href={normalizedWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-sm font-black !text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5"
              >
                {t("buildPage.website.enterSite")}
              </a>
            </div>
          ) : (
            <PreviewEmptyState
              icon="🌐"
              title={t("buildPage.website.emptyTitle")}
              text={t("buildPage.website.emptyText")}
            />
          )}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        {businessDetails.faqs.length ? (
          businessDetails.faqs.slice(0, 5).map((faq, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div
                key={getFaqId(faq, index)}
                className="overflow-hidden rounded-2xl border border-violet-100 bg-white/90 shadow-[0_10px_28px_rgba(79,70,229,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-center text-sm font-black text-slate-800 hover:bg-violet-50"
                >
                  <span className="flex-1 text-center">
                    {faq.question || t("buildPage.faqs.questionFallback")}
                  </span>

                  <span
                    className={[
                      "text-lg text-violet-600 transition",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    ▾
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-violet-100 px-5 py-4 text-center text-sm leading-7 text-slate-600">
                    {faq.answer || t("buildPage.faqs.answerFallback")}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <PreviewEmptyState
            icon="❔"
            title={t("buildPage.faqs.emptyPreviewTitle")}
            text={t("buildPage.faqs.emptyPreviewText")}
          />
        )}
      </div>
    );
  };

  return (
    <main
      dir={dir}
      className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-6 text-start text-slate-800 sm:px-6 lg:px-8"
    >
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />

      <input
        type="file"
        multiple
        ref={mainImagesInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleMainImagesChange}
      />

      <input
        type="file"
        multiple
        ref={galleryInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleGalleryChange}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-7 xl:flex-row">
        <section className="order-1 w-full overflow-hidden rounded-[2rem] border border-white/90 bg-white/95 shadow-[0_34px_110px_rgba(79,70,229,0.16)] backdrop-blur-xl xl:w-[52%]">
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                  {t("buildPage.header.badgeEdit")}
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                  {t("buildPage.header.badgeLive")}
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                {t("buildPage.header.title")}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {t("buildPage.header.subtitle")}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {renderEditTabs()}

            {renderEditorContent()}

            <div className="sticky bottom-4 z-10 mt-8 rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex h-[56px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-sm font-black !text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {isSaving ? t("buildPage.actions.saving") : t("buildPage.actions.saveChanges")}
                </button>

                {showViewProfile && businessDetails._id && (
                  <button
                    type="button"
                    onClick={() => navigate(`/business/${businessDetails._id}`)}
                    disabled={isSaving}
                    className="flex h-[56px] items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {t("buildPage.actions.viewProfile")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="order-2 w-full xl:w-[48%]">
          <div className="sticky top-6 overflow-hidden rounded-[2.35rem] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.94)_38%,rgba(237,233,254,0.88)_100%)] text-start shadow-[0_34px_110px_rgba(79,70,229,0.18)] backdrop-blur-xl">
            <div className="relative p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative mb-5 flex items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                  {t("buildPage.preview.badge")}
                </div>

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-violet-100 bg-white/80 px-4 text-xs font-black text-violet-700 shadow-lg shadow-violet-500/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  {t("buildPage.preview.editLogo")}
                </button>
              </div>

              {coverImage ? (
                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 shadow-[0_24px_70px_rgba(30,41,59,0.14)]">
                  <ImageLoader
                    src={coverImage}
                    alt={t("buildPage.preview.coverAlt")}
                    className="h-64 w-full object-cover sm:h-80 lg:h-[360px]"
                  />
                </div>
              ) : (
                <div className="relative flex h-64 w-full items-center justify-center rounded-[2rem] border border-white/80 bg-gradient-to-br from-violet-100 via-white to-blue-100 text-center shadow-[0_24px_70px_rgba(30,41,59,0.10)] sm:h-80 lg:h-[360px]">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                      ✨
                    </div>

                    <p className="mt-4 text-lg font-black text-slate-800">
                      {t("buildPage.preview.addCover")}
                    </p>
                  </div>
                </div>
              )}

              <div className="-mt-16 relative mx-auto max-w-5xl rounded-[2rem] border border-white/90 bg-white/95 p-5 text-center shadow-[0_30px_90px_rgba(30,41,59,0.14)] backdrop-blur-xl sm:p-7">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-blue-100 shadow-[0_22px_55px_rgba(124,58,237,0.22)]">
                  {logoPreview ? (
                    <ImageLoader
                      src={logoPreview}
                      alt={t("buildPage.preview.logoAlt")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-violet-600">
                      {businessDetails.businessName?.charAt(0) || "B"}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-800">
                  {businessDetails.businessName || t("buildPage.preview.businessNameFallback")}
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

                  {reviewsCount > 0 && (
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
                      ★ {avg.toFixed(1)} ({t("buildPage.preview.reviewsCount", { count: reviewsCount })})
                    </span>
                  )}
                </div>

                {businessDetails.description && (
                  <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-600">
                    {businessDetails.description}
                  </p>
                )}

                <ProfileContactBlock
                  phone={businessDetails.phone}
                  email={businessDetails.email}
                  formattedPhone={previewPhone}
                  websiteUrl={businessWebsiteUrl}
                  whatsappUrl={businessWhatsappUrl}
                  normalizedWebsiteUrl={normalizedWebsiteUrl}
                  normalizedWhatsappUrl={normalizedWhatsappUrl}
                  showEmptyPlaceholders
                />

                {!businessWebsiteUrl && !businessWhatsappUrl && (
                  <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 px-4 py-3 text-sm font-black text-violet-700">
                    {t("buildPage.preview.noLinksYet")}
                  </div>
                )}

                <div className="mx-auto mt-7 max-w-5xl border-t border-violet-100/80 pt-6">
                  <div
                    className="flex flex-wrap items-center justify-center gap-3 text-center"
                    role="tablist"
                    aria-label={t("buildPage.preview.tabsAria")}
                  >
                    {TABS.map((tab) => {
                      const active = tab === currentTab;

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setCurrentTab(tab)}
                          role="tab"
                          aria-selected={active}
                          className={[
                            "flex min-w-[118px] cursor-pointer items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition",
                            active
                              ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-[0_14px_34px_rgba(124,58,237,0.30)]"
                              : "border border-violet-100 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700",
                          ].join(" ")}
                        >
                          {t(TAB_LABEL_KEYS[tab])}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(245,243,255,0.78)_48%,rgba(239,246,255,0.82)_100%)] p-5 text-center shadow-[0_20px_70px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-8">
                  {renderPreviewContent()}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PreviewEmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/70 px-6 py-10 text-center shadow-[0_16px_44px_rgba(79,70,229,0.08)]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function EditorEmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/70 px-6 py-10 text-center shadow-[0_16px_44px_rgba(79,70,229,0.08)]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}