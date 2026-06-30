"use client";

import React, { useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import ImageLoader from "@components/ImageLoader";
import CityAutocomplete from "@components/CityAutocomplete";
import CategoryAutocomplete from "@components/CategoryAutocomplete";

type BusinessAddress = {
  city?: string;
  [key: string]: unknown;
};

type LogoValue =
  | string
  | {
      preview?: string;
      url?: string;
      secure_url?: string;
      [key: string]: unknown;
    }
  | null;

type ReviewItem = {
  _id?: string;
  id?: string;
  userName?: string;
  client?: {
    name?: string;
  };
  comment?: string;
  text?: string;
  rating?: number | string;
  averageScore?: number | string;
  createdAt?: string | Date;
  date?: string | Date;
  [key: string]: unknown;
};

type FaqItem = {
  _id?: string;
  id?: string;
  question?: string;
  answer?: string;
  [key: string]: unknown;
};

type BusinessDetails = {
  _id?: string;
  businessName?: string;
  description?: string;
  phone?: string;
  email?: string;
  category?: string;
  address?: BusinessAddress;
  logo?: LogoValue;
  mainImages?: string[];
  mainImageIds?: Array<string | null>;
  gallery?: string[];
  galleryImageIds?: Array<string | null>;
  faqs?: FaqItem[];

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

type MainSectionProps = {
  businessDetails?: BusinessDetails;
  reviews?: ReviewItem[];
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | InputChangeEvent
  ) => void;
  handleMainImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: (publicId: string | null) => void;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void | Promise<void>;
  showViewProfile?: boolean;
  navigate: (path: string) => void;
  currentUser?: unknown;
  logoInputRef?: React.RefObject<HTMLInputElement>;
  mainImagesInputRef?: React.RefObject<HTMLInputElement>;
  isSaving?: boolean;
};

type MainImageItem = {
  preview: string;
  publicId: string | null;
};

type PreviewTab = "main" | "gallery" | "reviews" | "website" | "faqs";

const PREVIEW_TABS: Array<{ key: PreviewTab; label: string }> = [
  { key: "main", label: "ראשי" },
  { key: "gallery", label: "גלריה" },
  { key: "reviews", label: "ביקורות" },
  { key: "website", label: "אתר" },
  { key: "faqs", label: "שאלות נפוצות" },
];

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

function normalizeWebsiteUrl(url?: string) {
  const clean = String(url || "").trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://${clean}`;
}

function formatWebsiteForPreview(url?: string) {
  const clean = String(url || "").trim();
  if (!clean) return "";

  return clean
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
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

function isMeaningfulCategory(category?: string) {
  const clean = String(category || "").trim();
  return clean !== "" && clean !== "כללי" && clean.toLowerCase() !== "general";
}

function getReviewName(review: ReviewItem) {
  return (
    review.userName ||
    review.client?.name ||
    String(review.name || "") ||
    "לקוח אנונימי"
  );
}

function getReviewText(review: ReviewItem) {
  return review.comment || review.text || "";
}

function getReviewRating(review: ReviewItem) {
  const value = Number(review.averageScore ?? review.rating ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export default function MainSection({
  businessDetails = {},
  reviews = [],
  handleInputChange,
  handleMainImagesChange,
  handleDeleteImage,
  handleLogoChange,
  handleSave,
  showViewProfile = false,
  navigate,
  logoInputRef,
  mainImagesInputRef,
  isSaving = false,
}: MainSectionProps) {
  const fallbackLogoInputRef = useRef<HTMLInputElement | null>(null);
  const fallbackMainImagesInputRef = useRef<HTMLInputElement | null>(null);

  const activeLogoInputRef = logoInputRef ?? fallbackLogoInputRef;
  const activeMainImagesInputRef =
    mainImagesInputRef ?? fallbackMainImagesInputRef;

  const [previewTab, setPreviewTab] = useState<PreviewTab>("main");
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  const {
    businessName = "",
    description = "",
    phone = "",
    email = "",
    category = "",
    address = {},
    logo = null,
  } = businessDetails;

  const city = address.city ?? "";
  const logoPreview = getLogoPreview(logo);
  const businessWebsiteUrl = getBusinessWebsiteUrl(businessDetails);
  const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);

  const mainImages: MainImageItem[] = useMemo(() => {
    return (businessDetails.mainImages ?? []).map((url, idx) => ({
      preview: url,
      publicId: businessDetails.mainImageIds?.[idx] ?? null,
    }));
  }, [businessDetails.mainImageIds, businessDetails.mainImages]);

  const galleryImages = Array.isArray(businessDetails.gallery)
    ? businessDetails.gallery
    : [];

  const faqs = Array.isArray(businessDetails.faqs) ? businessDetails.faqs : [];

  const limitedMainImgs = mainImages.slice(0, 6);
  const canUploadMoreImages = limitedMainImgs.length < 6;
  const coverImage = limitedMainImgs[0]?.preview || galleryImages[0] || "";
  const previewPhone = formatPhoneForPreview(phone);
  const phoneInputValue = normalizePhoneValueForInput(phone);

  async function handleDeleteLogo() {
    if (isSaving || isDeletingLogo) return;

    const approved = window.confirm("האם למחוק את הלוגו?");
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
        alert("שגיאה במחיקת הלוגו: " + (error?.error || response.statusText));
        return;
      }

      handleInputChange({ target: { name: "logo", value: "" } });
      alert("הלוגו נמחק בהצלחה");
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקת הלוגו");
    } finally {
      setIsDeletingLogo(false);
    }
  }

  const renderPreviewTabContent = () => {
    if (previewTab === "main") {
      return (
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          {limitedMainImgs.length > 0 ? (
            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {limitedMainImgs.map(({ preview }, index) => (
                <ImageLoader
                  key={`${preview}-${index}`}
                  src={preview}
                  alt={`תמונה ראשית ${index + 1}`}
                  className="h-52 w-full max-w-xs rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
                />
              ))}
            </div>
          ) : (
            <PreviewEmptyState
              icon="🖼️"
              title="אין תמונות ראשיות"
              text="התמונות הראשיות שהעסק יעלה יופיעו כאן."
            />
          )}
        </div>
      );
    }

    if (previewTab === "gallery") {
      return (
        <div className="mx-auto max-w-4xl text-center">
          {galleryImages.length > 0 ? (
            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((url, index) => (
                <ImageLoader
                  key={`${url}-${index}`}
                  src={url}
                  alt={`תמונת גלריה ${index + 1}`}
                  className="h-52 w-full max-w-xs rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
                />
              ))}
            </div>
          ) : (
            <PreviewEmptyState
              icon="📸"
              title="אין תמונות בגלריה"
              text="תמונות הגלריה שהעסק יעלה יופיעו כאן."
            />
          )}
        </div>
      );
    }

    if (previewTab === "reviews") {
      return (
        <div className="mx-auto max-w-4xl text-center">
          {reviews.length > 0 ? (
            <div className="grid place-items-center gap-4 md:grid-cols-2">
              {reviews.slice(0, 4).map((review, index) => {
                const rating = getReviewRating(review);

                return (
                  <div
                    key={review._id || review.id || index}
                    className="w-full max-w-sm rounded-[1.5rem] border border-violet-100 bg-white/90 p-5 text-center shadow-[0_14px_36px_rgba(79,70,229,0.10)]"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                      ⭐
                    </div>

                    <h4 className="mt-3 text-base font-black text-slate-950">
                      {getReviewName(review)}
                    </h4>

                    <p className="mt-1 text-sm font-black text-amber-500">
                      {rating ? `${rating.toFixed(1)} / 5` : "ביקורת"}
                    </p>

                    {getReviewText(review) && (
                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        ״{getReviewText(review)}״
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <PreviewEmptyState
              icon="⭐"
              title="אין ביקורות עדיין"
              text="ביקורות של לקוחות יופיעו כאן."
            />
          )}
        </div>
      );
    }

    if (previewTab === "website") {
      return (
        <div className="mx-auto max-w-3xl text-center">
          {businessWebsiteUrl ? (
            <div className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8 shadow-[0_16px_44px_rgba(79,70,229,0.10)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                🌐
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                אתר העסק
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                כאן הלקוחות יכולים להיכנס לאתר שהעסק בנה דרך המערכת.
              </p>

              <a
                href={normalizedWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5"
              >
                כניסה לאתר העסק
              </a>
            </div>
          ) : (
            <PreviewEmptyState
              icon="🌐"
              title="אין אתר מחובר"
              text="כאשר יתווסף אתר עסק, הוא יופיע כאן."
            />
          )}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        {faqs.length > 0 ? (
          faqs.slice(0, 5).map((faq, index) => (
            <div
              key={faq._id || faq.id || index}
              className="rounded-2xl border border-violet-100 bg-white/90 p-5 text-center shadow-[0_10px_28px_rgba(79,70,229,0.08)]"
            >
              <h4 className="text-base font-black text-slate-950">
                {faq.question || "שאלה נפוצה"}
              </h4>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
                {faq.answer || "תשובה תופיע כאן."}
              </p>
            </div>
          ))
        ) : (
          <PreviewEmptyState
            icon="❔"
            title="אין שאלות נפוצות"
            text="שאלות ותשובות של העסק יופיעו כאן."
          />
        )}
      </div>
    );
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[0.95fr_1.05fr]">
        <aside className="order-2 xl:order-1">
          <div className="overflow-hidden rounded-[2.35rem] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.94)_38%,rgba(237,233,254,0.88)_100%)] text-right shadow-[0_34px_110px_rgba(79,70,229,0.18)] backdrop-blur-xl">
            <div className="relative p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative mb-5 flex items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                  תצוגה מקדימה חיה
                </div>

                <button
                  type="button"
                  onClick={() => activeLogoInputRef.current?.click()}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-violet-100 bg-white/80 px-4 text-xs font-black text-violet-700 shadow-lg shadow-violet-500/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  ✏️ עריכת לוגו
                </button>
              </div>

              {coverImage ? (
                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 shadow-[0_24px_70px_rgba(30,41,59,0.14)]">
                  <ImageLoader
                    src={coverImage}
                    alt="תמונת קאבר"
                    className="h-64 w-full object-cover sm:h-80 lg:h-[360px]"
                  />
                </div>
              ) : (
                <div className="relative flex h-64 w-full items-center justify-center rounded-[2rem] border border-white/80 bg-gradient-to-br from-violet-100 via-white to-blue-100 text-center shadow-[0_24px_70px_rgba(30,41,59,0.10)] sm:h-80 lg:h-[360px]">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                      ✨
                    </div>

                    <p className="mt-4 text-lg font-black text-slate-950">
                      הוסף תמונת קאבר
                    </p>
                  </div>
                </div>
              )}

              <div
                className={[
                  "relative mx-auto rounded-[2rem] border border-white/90 bg-white/95 p-5 text-center shadow-[0_30px_90px_rgba(30,41,59,0.14)] backdrop-blur-xl sm:p-7",
                  coverImage ? "-mt-16 max-w-5xl" : "mt-8 max-w-5xl",
                ].join(" ")}
              >
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-blue-100 shadow-[0_22px_55px_rgba(124,58,237,0.22)]">
                  {logoPreview ? (
                    <ImageLoader
                      src={logoPreview}
                      alt="לוגו העסק"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-violet-600">
                      {businessName?.charAt(0) || "B"}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
                  {businessName || "שם העסק"}
                </h2>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {isMeaningfulCategory(category) && (
                    <span className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-black text-violet-800">
                      {category}
                    </span>
                  )}

                  {city && (
                    <span className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
                      {city}
                    </span>
                  )}
                </div>

                {description && (
                  <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-600">
                    {description}
                  </p>
                )}

                <div className="mx-auto mt-6 grid max-w-4xl place-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {phone && (
                    <div className="w-full max-w-sm rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-center shadow-[0_12px_32px_rgba(79,70,229,0.08)]">
                      <p className="text-xs font-black text-slate-400">
                        טלפון
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-center text-lg font-black text-slate-950"
                      >
                        {previewPhone || "לא נוסף"}
                      </p>
                    </div>
                  )}

                  {email && (
                    <div className="w-full max-w-sm rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-center shadow-[0_12px_32px_rgba(79,70,229,0.08)]">
                      <p className="text-xs font-black text-slate-400">
                        אימייל
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 truncate text-center text-lg font-black text-slate-950"
                      >
                        {email || "לא נוסף"}
                      </p>
                    </div>
                  )}

                  {businessWebsiteUrl && (
                    <div className="w-full max-w-sm rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-center shadow-[0_12px_32px_rgba(79,70,229,0.08)]">
                      <p className="text-xs font-black text-slate-400">
                        אתר
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 truncate text-center text-lg font-black text-violet-700"
                      >
                        {formatWebsiteForPreview(businessWebsiteUrl)}
                      </p>
                    </div>
                  )}
                </div>

                {!businessWebsiteUrl && (
                  <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 px-4 py-3 text-sm font-black text-violet-700">
                    עדיין לא נוסף קישור לאתר העסק.
                  </div>
                )}

                {businessWebsiteUrl && (
                  <a
                    href={normalizedWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5"
                  >
                    כניסה לאתר העסק
                  </a>
                )}

                <div className="mx-auto mt-7 max-w-5xl border-t border-violet-100/80 pt-6">
                  <div
                    className="flex flex-wrap items-center justify-center gap-3 text-center"
                    role="tablist"
                    aria-label="טאבים של תצוגת הפרופיל"
                  >
                    {PREVIEW_TABS.map((tab) => {
                      const active = tab.key === previewTab;

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setPreviewTab(tab.key)}
                          role="tab"
                          aria-selected={active}
                          className={[
                            "flex min-w-[118px] cursor-pointer items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition",
                            active
                              ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-[0_14px_34px_rgba(124,58,237,0.30)]"
                              : "border border-violet-100 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700",
                          ].join(" ")}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(245,243,255,0.78)_48%,rgba(239,246,255,0.82)_100%)] p-5 text-center shadow-[0_20px_70px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-8">
                  {renderPreviewTabContent()}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="order-1 overflow-hidden rounded-[2rem] border border-white/90 bg-white/95 shadow-[0_34px_110px_rgba(79,70,229,0.16)] backdrop-blur-xl xl:order-2">
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                  עריכת פרופיל עסקי
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                  תצוגה חיה בזמן אמת
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                עריכת עמוד עסקי
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                עדכן את פרטי העסק, הלוגו, התמונות והקישור לאתר שנבנה דרך
                המערכת. כל שינוי כאן משפיע ישירות על הפרופיל הציבורי.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="rounded-[1.75rem] border border-violet-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.78)_100%)] p-4 shadow-[0_18px_50px_rgba(79,70,229,0.10)] sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    פרטים בסיסיים
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    מידע שיופיע בראש הפרופיל העסקי.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl sm:flex">
                  ✦
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    שם העסק <span className="text-violet-600">*</span>
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    value={businessName}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="לדוגמה: Bella Beauty Studio"
                    className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    תיאור
                  </label>

                  <textarea
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={isSaving}
                    placeholder="כתוב ללקוחות מה העסק עושה, מה מייחד אותו ואילו שירותים אתה מציע..."
                    className="w-full resize-none rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    טלפון
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
                    אימייל
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    קטגוריה <span className="text-violet-600">*</span>
                  </label>

                  <div className="rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                    <CategoryAutocomplete
                      value={category}
                      onChange={(val: string) =>
                        handleInputChange({
                          target: { name: "category", value: val },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    עיר
                  </label>

                  <div className="rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                    <CityAutocomplete
                      value={city}
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
                    אתר העסק
                  </label>

                  <input
                    type="url"
                    name="websiteUrl"
                    value={businessWebsiteUrl}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="לדוגמה: https://www.example.com"
                    dir="ltr"
                    className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                    כאן מכניסים קישור לאתר העסק. הקישור יתעדכן מיד בתצוגה המקדימה ובפרופיל הציבורי לאחר שמירה.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-violet-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)]">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    תמונות ראשיות
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    אפשר להוסיף עד 6 תמונות. התמונה הראשונה תהיה תמונת הקאבר.
                  </p>
                </div>

                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                  {limitedMainImgs.length}/6 הועלו
                </span>
              </div>

              <input
                type="file"
                multiple
                ref={activeMainImagesInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleMainImagesChange}
              />

              <input
                type="file"
                ref={activeLogoInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {limitedMainImgs.map(({ preview, publicId }, i) => (
                  <div
                    key={`${preview}-${i}`}
                    className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-slate-50 shadow-sm"
                  >
                    <ImageLoader
                      src={preview}
                      alt={`תמונה ראשית של העסק ${i + 1}`}
                      className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {i === 0 && (
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                        קאבר
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(publicId)}
                      disabled={isSaving}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm shadow-lg transition hover:scale-105 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="מחיקת תמונה"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {canUploadMoreImages && (
                  <button
                    type="button"
                    onClick={() => activeMainImagesInputRef.current?.click()}
                    disabled={isSaving}
                    className="flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/70 text-violet-600 transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl font-light shadow-sm">
                      +
                    </span>

                    <span className="mt-3 text-sm font-black">
                      הוספת תמונות
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex h-[56px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {isSaving ? "שומר..." : "שמירת שינויים"}
                </button>

                {showViewProfile && businessDetails._id && (
                  <button
                    type="button"
                    onClick={() => navigate(`/business/${businessDetails._id}`)}
                    disabled={isSaving}
                    className="flex h-[56px] items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    צפייה בפרופיל
                  </button>
                )}
              </div>
            </div>

            {logoPreview && (
              <button
                type="button"
                onClick={handleDeleteLogo}
                disabled={isSaving || isDeletingLogo}
                className="w-full rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeletingLogo ? "מוחק לוגו..." : "מחיקת לוגו"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
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

      <h3 className="text-lg font-black text-slate-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}