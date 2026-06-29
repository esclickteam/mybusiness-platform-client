"use client";

import React, { useRef, useState } from "react";
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

  if (!businessDetails._id) return null;

  const mainImages: MainImageItem[] = (businessDetails.mainImages ?? []).map(
    (url, idx) => ({
      preview: url,
      publicId: businessDetails.mainImageIds?.[idx] ?? null,
    })
  );

  const limitedMainImgs = mainImages.slice(0, 6);

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

  const logoPreview =
    typeof logo === "string"
      ? logo
      : logo?.preview || logo?.url || logo?.secure_url || "";

  const canUploadMoreImages = limitedMainImgs.length < 6;
  const coverImage = limitedMainImgs[0]?.preview;

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
    <section dir="rtl" className="min-h-screen bg-slate-50 px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* FORM - LEFT SIDE */}
        <div
          ref={containerRef}
          className="order-1 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] xl:order-1"
        >
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-6 py-7 text-white sm:px-8">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/80 backdrop-blur">
              עריכת פרופיל עסקי
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              עריכת פרטי העסק
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              עדכן את פרטי העסק, הלוגו וגלריית התמונות הראשית. כל מה שמופיע כאן משפיע על איך שהלקוחות רואים את העסק.
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
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
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  טלפון
                </label>

                <PhoneInput
                  country="us"
                  enableSearch
                  value={phone?.replace("+", "")}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "phone", value: `+${val}` },
                    })
                  }
                  disabled={isSaving}
                  containerClass="!w-full"
                  inputClass="!h-12 !w-full !rounded-2xl !border !border-slate-200 !bg-white !pr-14 !pl-4 !text-right !text-sm !font-semibold !text-slate-900 !shadow-sm !outline-none focus:!border-violet-400 focus:!ring-4 focus:!ring-violet-100"
                  buttonClass="!rounded-r-2xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100"
                  dropdownClass="!rounded-2xl !border-slate-200 !shadow-2xl"
                  searchClass="!rounded-xl !border-slate-200 !px-3 !py-2"
                />
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
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  קטגוריה <span className="text-violet-600">*</span>
                </label>

                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
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

                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
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
            </div>

            {/* LOGO */}
            <div className="rounded-[1.6rem] border border-slate-100 bg-slate-50/80 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
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
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      העלה לוגו נקי שנראה טוב בתוך ריבוע.
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
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* MAIN IMAGES */}
            <div className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    תמונות ראשיות
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    אפשר להוסיף עד 6 תמונות לפרופיל. התמונה הראשונה תהיה תמונת הקאבר הראשית.
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
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
                      <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
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
                    className="flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl font-light shadow-sm">
                      +
                    </span>
                    <span className="mt-3 text-sm font-black">הוספת תמונות</span>
                  </button>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex h-13 flex-1 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {isSaving ? "שומר..." : "שמירת שינויים"}
                </button>

                {showViewProfile && (
                  <button
                    type="button"
                    onClick={() => navigate(`/business/${businessDetails._id}`)}
                    disabled={isSaving}
                    className="flex h-13 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    צפייה בפרופיל
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW - RIGHT SIDE */}
        <aside className="order-2 xl:order-2">
          <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            {renderTopBar && (
              <div className="border-b border-slate-100 bg-white/70 px-5 py-4">
                {renderTopBar()}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-sky-500/20" />

              <div className="relative p-5">
                <div className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-slate-900 shadow-2xl">
                  {coverImage ? (
                    <ImageLoader
                      src={coverImage}
                      alt={businessName || "תמונת קאבר של העסק"}
                      className="h-64 w-full object-cover sm:h-80"
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 text-center text-white sm:h-80">
                      <div>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">
                          ✨
                        </div>
                        <p className="text-lg font-bold">הוסף תמונה ראשית</p>
                        <p className="mt-1 text-sm text-white/70">
                          התצוגה המקדימה של הפרופיל תופיע כאן
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="-mt-12 px-4">
                  <div className="relative rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-100 to-sky-100 shadow-lg">
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
                        <div className="mb-2 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                          תצוגה מקדימה חיה
                        </div>

                        <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">
                          {businessName || "שם העסק"}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {[category, city].filter(Boolean).join(" • ") ||
                            "קטגוריה • עיר"}
                        </p>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {description ||
                            "כתוב תיאור קצר וברור שמסביר ללקוחות מה העסק מציע ולמה כדאי לבחור בו."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          טלפון
                        </p>
                        <p className="mt-1 truncate font-bold text-slate-800">
                          {phone || "לא נוסף"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          אימייל
                        </p>
                        <p className="mt-1 truncate font-bold text-slate-800">
                          {email || "לא נוסף"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {limitedMainImgs.slice(0, 6).map(({ preview }, i) => (
                    <div
                      key={`${preview}-${i}`}
                      className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-lg"
                    >
                      <ImageLoader
                        src={preview}
                        alt={`תמונת עסק ${i + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}

                  {limitedMainImgs.length === 0 && (
                    <>
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="h-24 rounded-2xl border border-dashed border-slate-200 bg-white/70"
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}