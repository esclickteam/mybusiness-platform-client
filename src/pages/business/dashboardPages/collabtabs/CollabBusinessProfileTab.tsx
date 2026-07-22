import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Building2,
  Camera,
  CheckCircle2,
  Edit3,
  Handshake,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

import API from "../../../../api";
import CollabChat from "./CollabChat";
import { useAi } from "../../../../context/AiContext";
import AiModal from "../../../../components/AiModal";
import { useCollabOutletContext } from "./useCollabOutletContext";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";

type CollabBusinessProfileTabProps = Record<string, never>;

type BusinessProfile = {
  _id?: string;
  businessName?: string;
  category?: string;
  area?: string;
  description?: string;
  collabPref?: string;
  contact?: string;
  phone?: string;
  email?: string;
  logo?: string | { preview?: string };
};

type SafeProfile = {
  businessName: string;
  category: string;
  area: string;
  about: string;
  collabPref: string[];
  contact: string;
  phone: string;
  email: string;
};

type EditProfilePayload = {
  businessName: FormDataEntryValue | null;
  category: FormDataEntryValue | null;
  area: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  collabPref: FormDataEntryValue | null;
  contact: FormDataEntryValue | null;
  phone: string;
  email: FormDataEntryValue | null;
  logo?: string;
};

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";

const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";

const phoneInputClass =
  "!h-[48px] !w-full !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !pr-4 !text-left !text-sm !font-semibold !text-slate-900 !outline-none focus:!border-violet-300 focus:!bg-white";

const phoneButtonClass =
  "!left-0 !right-auto !rounded-l-2xl !rounded-r-none !border-slate-200 !bg-white";

export default function CollabBusinessProfileTab(_props: CollabBusinessProfileTabProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { socket } = useCollabOutletContext();
  const [profileData, setProfileData] = useState<BusinessProfile | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBusinessChat, setShowBusinessChat] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [phone, setPhone] = useState("");

  const [myBusinessId, setMyBusinessId] = useState<string | null>(null);
  const [myBusinessName, setMyBusinessName] = useState("");

  const {
    addSuggestion,
    activeSuggestion,
    approveSuggestion,
    rejectSuggestion,
    closeModal,
    loading: aiLoading,
  } = useAi();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [profileRes, businessIdRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business-chat/me"),
      ]);

      const businessData: BusinessProfile =
        profileRes.data.business || profileRes.data || null;

      if (businessData) {
        setProfileData(businessData);

        if (businessData.phone) {
          setPhone(businessData.phone);
        }

        if (typeof businessData.logo === "string") {
          setLogoPreview(businessData.logo);
        } else if (businessData.logo?.preview) {
          setLogoPreview(businessData.logo.preview);
        } else {
          setLogoPreview(null);
        }

        setMyBusinessName(businessData.businessName || t("collab.profile.myBusinessFallback"));
      }

      if (businessIdRes.data.myBusinessId) {
        setMyBusinessId(businessIdRes.data.myBusinessId);
      }
    } catch (error) {
      console.error("Error loading business details:", error);
      alert(t("collab.profile.alerts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNewRecommendation = useCallback(
    (recommendation: unknown) => {
      addSuggestion(recommendation);
    },
    [addSuggestion]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("newRecommendation", handleNewRecommendation);

    return () => {
      socket.off("newRecommendation", handleNewRecommendation);
    };
  }, [socket, handleNewRecommendation]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, logoFile]);

  const handleLogoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    },
    [logoPreview, logoFile]
  );

  const handleDeleteLogo = useCallback(async () => {
    if (saving || isDeletingLogo) return;

    if (!window.confirm(t("collab.profile.alerts.deleteLogoConfirm"))) return;

    try {
      setIsDeletingLogo(true);

      const res = await API.delete("/business/my/logo");

      if (res.status !== 200 && res.status !== 204) {
        alert(t("collab.profile.alerts.deleteLogoError"));
        return;
      }

      setLogoPreview(null);
      setLogoFile(null);

      await fetchData();
    } catch (error) {
      console.error("Error deleting logo:", error);
      alert(t("collab.profile.alerts.deleteLogoError"));
    } finally {
      setIsDeletingLogo(false);
    }
  }, [saving, isDeletingLogo, fetchData, t]);

  const handleSaveProfile = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);

      const formData = new FormData(event.currentTarget);

      const updatedData: EditProfilePayload = {
        businessName: formData.get("businessName"),
        category: formData.get("category"),
        area: formData.get("area"),
        description: formData.get("about"),
        collabPref: formData.get("collabPref"),
        contact: formData.get("contact"),
        phone,
        email: formData.get("email"),
      };

      try {
        if (logoFile) {
          const logoFormData = new FormData();
          logoFormData.append("logo", logoFile);

          const logoRes = await API.put("/business/my/logo", logoFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (logoRes.status === 200) {
            updatedData.logo = logoRes.data.logo;
            setLogoPreview(logoRes.data.logo);
            setLogoFile(null);
          }
        }

        const profileRes = await API.put("/business/profile", updatedData);

        if (profileRes.status === 200) {
          await fetchData();
          setShowEditProfile(false);
        } else {
          alert(t("collab.profile.alerts.saveError"));
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        alert(t("collab.profile.alerts.saveError"));
      } finally {
        setSaving(false);
      }
    },
    [logoFile, fetchData, phone]
  );

  const collabPrefLines = useMemo(() => {
    if (!profileData?.collabPref) return [];

    return profileData.collabPref
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, [profileData]);

  if (loading || !profileData) {
    return <ProfileSkeleton />;
  }

  const safeProfile: SafeProfile = {
    businessName: profileData.businessName || "—",
    category: profileData.category || "—",
    area: profileData.area || "—",
    about: profileData.description || "—",
    collabPref: collabPrefLines,
    contact: profileData.contact || "—",
    phone: profileData.phone || "—",
    email: profileData.email || "—",
  };

  const token = (API as any).token || localStorage.getItem("token") || "";

  return (
    <>
      <section dir={dir} className="space-y-6 text-start">
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <label
                htmlFor="logo-upload"
                className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[1.8rem] border border-white bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt={t("collab.profile.logoAlt")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-sky-700" />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-violet-700/55 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>

                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  hidden
                />
              </label>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  {t("collab.profile.badge")}
                </div>

                <h1 className="mt-4 truncate text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {safeProfile.businessName}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                    {safeProfile.category}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                    <MapPin className="h-3.5 w-3.5" />
                    {safeProfile.area}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <button
                type="button"
                onClick={() => {
                  setPhone(profileData?.phone || "");
                  setShowEditProfile(true);
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5"
              >
                <Edit3 className="h-5 w-5" />
                {t("collab.profile.editProfile")}
              </button>

              <button
                type="button"
                onClick={() => setShowBusinessChat(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <MessageCircle className="h-5 w-5" />
                {t("collab.profile.businessMessages")}
              </button>

              {logoPreview && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={saving || isDeletingLogo}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-5 text-sm font-black text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeletingLogo ? (
                    <BizuplyLoader size="sm" compact />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  {isDeletingLogo ? t("collab.profile.deleting") : t("collab.profile.deleteLogo")}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("collab.profile.stats.status")}
            value={t("collab.profile.stats.statusValue")}
            helper={t("collab.profile.stats.statusHelper")}
            icon={CheckCircle2}
            tone="emerald"
          />

          <StatCard
            label={t("collab.profile.stats.category")}
            value={safeProfile.category}
            helper={t("collab.profile.stats.categoryHelper")}
            icon={Building2}
            tone="sky"
          />

          <StatCard
            label={t("collab.profile.stats.area")}
            value={safeProfile.area}
            helper={t("collab.profile.stats.areaHelper")}
            icon={MapPin}
            tone="violet"
          />

          <StatCard
            label={t("collab.profile.stats.collabs")}
            value={safeProfile.collabPref.length}
            helper={t("collab.profile.stats.collabsHelper")}
            icon={Handshake}
            tone="amber"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <InfoSection
              icon={MapPin}
              title={t("collab.profile.areaTitle")}
              value={safeProfile.area}
            />

            <InfoSection
              icon={Building2}
              title={t("collab.profile.aboutTitle")}
              value={safeProfile.about}
            />

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Handshake className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {t("collab.profile.preferredCollabs")}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500">
                    {t("collab.profile.preferredCollabsHint")}
                  </p>
                </div>
              </div>

              {safeProfile.collabPref.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {safeProfile.collabPref.map((line, index) => (
                    <div
                      key={`${line}-${index}`}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <p className="text-sm font-semibold leading-6 text-slate-600">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  {t("collab.profile.noCollabPrefs")}
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {t("collab.profile.contactDetails")}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500">
                    {t("collab.profile.contactDetailsHint")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ContactRow
                  icon={UserRound}
                  label={t("collab.profile.name")}
                  value={safeProfile.contact}
                />

                <ContactRow
                  icon={Phone}
                  label={t("collab.profile.phone")}
                  value={safeProfile.phone}
                />

                <ContactRow
                  icon={Mail}
                  label={t("collab.profile.email")}
                  value={safeProfile.email}
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <h3 className="text-base font-black text-slate-950">
                {t("collab.profile.quickActions")}
              </h3>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setShowBusinessChat(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("collab.profile.openMessages")}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditProfile(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-5 text-sm font-black text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-100"
                >
                  <Edit3 className="h-5 w-5" />
                  {t("collab.profile.editBusinessDetails")}
                </button>
              </div>
            </section>
          </aside>
        </section>
      </section>

      {showEditProfile && (
        <AppModal onClose={() => setShowEditProfile(false)}>
          <div
            dir={dir}
            className="mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-5 text-start shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  {t("collab.profile.editBadge")}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  {t("collab.profile.editTitle")}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {t("collab.profile.editSubtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="grid gap-4 lg:grid-cols-2"
            >
              <FormField label={t("collab.profile.fields.businessName")} required>
                <input
                  name="businessName"
                  defaultValue={safeProfile.businessName}
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.profile.fields.category")} required>
                <input
                  name="category"
                  defaultValue={safeProfile.category}
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.profile.fields.area")} required>
                <input
                  name="area"
                  defaultValue={safeProfile.area}
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.profile.fields.contact")} required>
                <input
                  name="contact"
                  defaultValue={safeProfile.contact}
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.profile.fields.phone")} required>
                <div dir="ltr" className="text-left">
                  <PhoneInput
                    country="il"
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputProps={{
                      required: true,
                      dir: "ltr",
                    }}
                    containerClass="!w-full !text-left"
                    inputClass={phoneInputClass}
                    buttonClass={phoneButtonClass}
                    dropdownClass="!text-left"
                    searchClass="!text-left"
                    enableSearch
                  />
                </div>
              </FormField>

              <FormField label={t("collab.profile.fields.email")} required>
                <input
                  name="email"
                  defaultValue={safeProfile.email}
                  required
                  className={inputClass}
                />
              </FormField>

              <div className="lg:col-span-2">
                <FormField label={t("collab.profile.fields.about")}>
                  <textarea
                    name="about"
                    defaultValue={safeProfile.about}
                    rows={4}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <div className="lg:col-span-2">
                <FormField label={t("collab.profile.fields.preferredCollabs")}>
                  <textarea
                    name="collabPref"
                    defaultValue={profileData.collabPref || ""}
                    rows={4}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 lg:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  disabled={saving}
                  className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t("collab.profile.cancel")}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <BizuplyLoader size="sm" compact />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}

                  {saving ? t("collab.profile.saving") : t("collab.profile.saveProfile")}
                </button>
              </div>
            </form>
          </div>
        </AppModal>
      )}

      {showBusinessChat && (
        <AppModal onClose={() => setShowBusinessChat(false)}>
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            {myBusinessId ? (
              <CollabChat
                token={token}
                myBusinessId={myBusinessId}
                myBusinessName={myBusinessName}
                onClose={() => setShowBusinessChat(false)}
              />
            ) : (
              <div dir={dir} className="p-10 text-center">
                <p className="text-sm font-black text-slate-500">
                  {t("collab.profile.chatNotReady")}
                </p>
              </div>
            )}
          </div>
        </AppModal>
      )}

      <AiModal
        loading={aiLoading}
        activeSuggestion={activeSuggestion}
        approveSuggestion={approveSuggestion}
        rejectSuggestion={rejectSuggestion}
        closeModal={closeModal}
      />
    </>
  );
}

function ProfileSkeleton() {
  const dir = useLocaleDir();
  return (
    <section dir={dir} className="space-y-5 text-start">
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex animate-pulse gap-5">
          <div className="h-24 w-24 rounded-[1.8rem] bg-white/80 shadow-sm" />

          <div className="flex-1 space-y-4">
            <div className="h-4 w-40 rounded-full bg-slate-100" />
            <div className="h-9 w-72 rounded-full bg-slate-100" />
            <div className="h-4 w-56 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
          />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  helper: string;
  icon: React.ElementType;
  tone: "sky" | "violet" | "amber" | "emerald";
}) {
  const { t } = useTranslation();
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 truncate text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">{t("collab.active")}</p>

          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>

          <p className="text-xs font-semibold text-slate-500">
            {t("collab.profile.fromProfile")}
          </p>
        </div>
      </div>

      <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-600">
        {value}
      </p>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-black text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
        {required && <span className="mr-1 text-rose-500">*</span>}
      </span>

      {children}
    </label>
  );
}

function AppModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/25 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex min-h-full w-full items-center justify-center py-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
}