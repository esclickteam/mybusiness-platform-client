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
  reviews?: unknown[];
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
  logoInputRef?: React.RefObject<HTMLInputElement>;
  mainImagesInputRef?: React.RefObject<HTMLInputElement>;
  isSaving?: boolean;
  renderTopBar?: () => React.ReactNode;
};

type MainImageItem = {
  preview: string;
  publicId: string | null;
};

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

export default function MainSection({
  businessDetails = {},
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
  renderTopBar,
}: MainSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fallbackLogoInputRef = useRef<HTMLInputElement | null>(null);
  const fallbackMainImagesInputRef = useRef<HTMLInputElement | null>(null);

  const activeLogoInputRef = logoInputRef ?? fallbackLogoInputRef;
  const activeMainImagesInputRef =
    mainImagesInputRef ?? fallbackMainImagesInputRef;

  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  const {
    businessName = "",
    description = "",
    phone = "",
    email = "",
    category = "",
    address = {},
    logo = null,
    websiteUrl = "",
    website = "",
    siteUrl = "",
    publicSiteUrl = "",
    miniSiteUrl = "",
    builderSiteUrl = "",
  } = businessDetails;

  const city = address.city ?? "";
  const logoPreview = getLogoPreview(logo);

  const businessWebsiteUrl =
    websiteUrl ||
    website ||
    siteUrl ||
    publicSiteUrl ||
    miniSiteUrl ||
    builderSiteUrl ||
    "";

  const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);

  const mainImages: MainImageItem[] = useMemo(() => {
    return (businessDetails.mainImages ?? []).map((url, idx) => ({
      preview: url,
      publicId: businessDetails.mainImageIds?.[idx] ?? null,
    }));
  }, [businessDetails.mainImageIds, businessDetails.mainImages]);

  const limitedMainImgs = mainImages.slice(0, 6);
  const canUploadMoreImages = limitedMainImgs.length < 6;
  const coverImage = limitedMainImgs[0]?.preview;
  const previewPhone = formatPhoneForPreview(phone);
  const phoneInputValue = normalizePhoneValueForInput(phone);

  if (!businessDetails._id) return null;

  async function handleDeleteLogo() {
    if (isSaving || isDeletingLogo) return;

    const approved = window.confirm("האם אתה בטוח שברצונך למחוק את הלוגו?");
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

  return (
    <section
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.02fr_0.98fr]">
        <div
          ref={containerRef}
          className="order-1 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl"
        >
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                  עריכת פרופיל עסקי
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                  תצוגה חיה בזמן אמת
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                עריכת עמוד עסקי
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                עדכן את פרטי העסק, הלוגו, התמונות והקישור לאתר שנבנה דרך
                המערכת. כל שינוי כאן משפיע ישירות על איך שהלקוחות רואים את
                העסק בפרופיל הציבורי.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
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
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    טלפון
                  </label>

                  <div
                    dir="ltr"
                    className="relative w-full rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100"
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
                      buttonClass="!left-0 !right-auto !rounded-l-2xl !rounded-r-none !border-0 !border-r !border-slate-200 !bg-white/70 hover:!bg-white"
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
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-extrabold text-slate-800">
                    קטגוריה <span className="text-violet-600">*</span>
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
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

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
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
                    קישור לאתר שנבנה במערכת
                  </label>

                  <input
                    type="url"
                    name="websiteUrl"
                    value={businessWebsiteUrl}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="לדוגמה: https://your-site.bizuply.com"
                    dir="ltr"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />

                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                    כאן מכניסים את הקישור לאתר שהעסק בנה דרך המערכת. הקישור
                    יוצג ללקוחות בפרופיל הציבורי.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white bg-gradient-to-br from-violet-50 to-blue-50 shadow-[0_18px_40px_rgba(79,70,229,0.16)]">
                    {logoPreview ? (
                      <ImageLoader
                        src={logoPreview}
                        alt="לוגו העסק"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🏷️</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      לוגו העסק
                    </h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                      מומלץ להעלות לוגו נקי וברור, עדיף בתוך ריבוע או עיגול.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={activeLogoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => activeLogoInputRef.current?.click()}
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    העלאת לוגו
                  </button>

                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      disabled={isSaving || isDeletingLogo}
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 text-sm font-black text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeletingLogo ? "מוחק..." : "מחיקת לוגו"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
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

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {limitedMainImgs.map(({ preview, publicId }, i) => (
                  <div
                    key={`${preview}-${i}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
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
                    className="flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 text-violet-600 transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="flex h-[52px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {isSaving ? "שומר..." : "שמירת שינויים"}
                </button>

                {showViewProfile && (
                  <button
                    type="button"
                    onClick={() => navigate(`/business/${businessDetails._id}`)}
                    disabled={isSaving}
                    className="flex h-[52px] items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    צפייה בפרופיל
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="order-2">
          <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            {renderTopBar && (
              <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
                {renderTopBar()}
              </div>
            )}

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.14),transparent_32%)]" />

              <div className="relative p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-violet-700">
                      תצוגה מקדימה של הפרופיל הציבורי
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      כך הלקוחות יראו אותך
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20">
                    ✨
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.7rem] border border-white/80 bg-white shadow-2xl">
                  <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
                    {coverImage ? (
                      <ImageLoader
                        src={coverImage}
                        alt={businessName || "תמונת קאבר של העסק"}
                        className="h-72 w-full object-cover sm:h-80"
                      />
                    ) : (
                      <div className="flex h-72 w-full items-center justify-center text-center sm:h-80">
                        <div>
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                            ✨
                          </div>
                          <p className="text-lg font-black text-slate-950">
                            הוסף תמונה ראשית
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            התמונה הראשונה בגלריה תופיע כאן
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 rounded-full border border-white bg-white/85 px-4 py-2 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                      פרופיל עסקי
                    </div>
                  </div>

                  <div className="relative px-5 pb-5">
                    <div className="-mt-14 rounded-[1.5rem] border border-white/90 bg-white/95 p-5 shadow-xl backdrop-blur">
                      <div className="flex items-start gap-4">
                        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-gradient-to-br from-violet-100 to-blue-100 shadow-[0_16px_35px_rgba(79,70,229,0.18)]">
                          {logoPreview ? (
                            <ImageLoader
                              src={logoPreview}
                              alt={`לוגו ${businessName || "העסק"}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">🏢</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                            תצוגה מקדימה חיה
                          </div>

                          <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">
                            {businessName || "שם העסק"}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {[category, city].filter(Boolean).join(" • ") ||
                              "קטגוריה • עיר"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 line-clamp-4 text-sm leading-7 text-slate-600">
                        {description ||
                          "כתוב תיאור קצר וברור שמסביר ללקוחות מה העסק מציע ולמה כדאי לבחור בו."}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            טלפון
                          </p>
                          <p
                            dir="ltr"
                            className="mt-1 truncate text-left font-black text-slate-900"
                          >
                            {previewPhone || "לא נוסף"}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            אימייל
                          </p>
                          <p
                            dir="ltr"
                            className="mt-1 truncate text-left font-black text-slate-900"
                          >
                            {email || "לא נוסף"}
                          </p>
                        </div>
                      </div>

                      {businessWebsiteUrl && (
                        <a
                          href={normalizedWebsiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          dir="ltr"
                          className="mt-4 flex h-[48px] items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 text-center text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                        >
                          צפייה באתר העסק
                        </a>
                      )}

                      {!businessWebsiteUrl && (
                        <div className="mt-4 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 px-4 py-3 text-sm font-bold text-violet-700">
                          עדיין לא נוסף קישור לאתר העסק.
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {["ראשי", "גלריה", "ביקורות", "אתר", "שאלות נפוצות"].map(
                          (tab, index) => (
                            <span
                              key={tab}
                              className={[
                                "rounded-full px-4 py-2 text-xs font-black transition",
                                index === 0
                                  ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                                  : "bg-slate-100 text-slate-500",
                              ].join(" ")}
                            >
                              {tab}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {limitedMainImgs.slice(0, 6).map(({ preview }, i) => (
                    <div
                      key={`${preview}-${i}`}
                      className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-lg"
                    >
                      <ImageLoader
                        src={preview}
                        alt={`תמונת עסק ${i + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}

                  {limitedMainImgs.length === 0 &&
                    [1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-24 rounded-2xl border border-dashed border-slate-200 bg-white/70"
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}