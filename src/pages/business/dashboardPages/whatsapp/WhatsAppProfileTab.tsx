import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "react-toastify";
import {
  getWhatsAppBusinessProfile,
  syncWhatsAppBusinessProfile,
  updateWhatsAppBusinessProfile,
  uploadWhatsAppBusinessProfilePicture,
  type WhatsAppBusinessProfile,
} from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import {
  formatNameStatus,
  nameStatusBadgeClass,
} from "./hubFormat";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";

const VERTICALS: { value: string; label: string }[] = [
  { value: "UNDEFINED", label: "Undefined" },
  { value: "OTHER", label: "Other" },
  { value: "AUTO", label: "Automotive" },
  { value: "BEAUTY", label: "Beauty, Spa and Salon" },
  { value: "APPAREL", label: "Clothing and Apparel" },
  { value: "EDU", label: "Education" },
  { value: "ENTERTAIN", label: "Entertainment" },
  { value: "EVENT_PLAN", label: "Event Planning and Service" },
  { value: "FINANCE", label: "Finance and Banking" },
  { value: "GROCERY", label: "Grocery and Supermarket" },
  { value: "GOVT", label: "Public Service" },
  { value: "HOTEL", label: "Hotel and Lodging" },
  { value: "HEALTH", label: "Medical and Health" },
  { value: "NONPROFIT", label: "Non-profit" },
  { value: "PROF_SERVICES", label: "Professional Services" },
  { value: "RETAIL", label: "Shopping and Retail" },
  { value: "TRAVEL", label: "Travel and Transportation" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "ALCOHOL", label: "Alcoholic Beverages" },
];

const VERTICAL_LABEL = Object.fromEntries(
  VERTICALS.map((item) => [item.value, item.label])
);

function emptyDraft() {
  return {
    about: "",
    address: "",
    description: "",
    email: "",
    vertical: "",
    websites: ["", ""] as string[],
    profilePictureUrl: "",
  };
}

function draftFromProfile(profile: WhatsAppBusinessProfile) {
  return {
    about: profile.about || "",
    address: profile.address || "",
    description: profile.description || "",
    email: profile.email || "",
    vertical: profile.vertical || "",
    websites: [profile.websites?.[0] || "", profile.websites?.[1] || ""],
    profilePictureUrl: profile.profilePictureUrl || "",
  };
}

function firstFieldError(errors?: Record<string, string> | null) {
  if (!errors) return "";
  return (
    errors._all ||
    errors.about ||
    errors.description ||
    errors.vertical ||
    errors.email ||
    errors.address ||
    errors.websites ||
    errors.profilePictureUrl ||
    Object.values(errors).find(Boolean) ||
    ""
  );
}

function metaErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function WhatsAppProfileTab() {
  const { t, i18n } = useTranslation();
  const { businessId, connection, refreshConnection } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<WhatsAppBusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const applyProfile = (next: WhatsAppBusinessProfile) => {
    setProfile(next);
    setDraft(draftFromProfile(next));
  };

  const fieldErrors = profile?.fieldErrors || {};
  const pictureUrl = draft.profilePictureUrl || profile?.profilePictureUrl || "";

  const load = async (opts?: { syncFirst?: boolean }) => {
    if (visualQa) {
      const mock: WhatsAppBusinessProfile = {
        displayName: visualQa.connection.verifiedName || "Invistimo RSVP",
        nameStatus: visualQa.connection.nameStatus || "AVAILABLE_WITHOUT_REVIEW",
        nameStatusDisplay: formatNameStatus(
          visualQa.connection.nameStatus || "AVAILABLE_WITHOUT_REVIEW"
        ),
        displayNameStatusRaw:
          visualQa.connection.displayNameStatusRaw ||
          visualQa.connection.nameStatus ||
          "AVAILABLE_WITHOUT_REVIEW",
        displayNameStatus:
          visualQa.connection.displayNameStatus ||
          formatNameStatus(
            visualQa.connection.nameStatus || "AVAILABLE_WITHOUT_REVIEW"
          ),
        phoneNumber: visualQa.connection.displayPhoneNumber || "",
        phoneNumberId: visualQa.connection.phoneNumberId || "",
        wabaId: visualQa.connection.wabaId || "",
        about: "RSVP & event updates",
        address: "Tel Aviv",
        description: "Professional WhatsApp channel for event RSVP.",
        email: "hello@invistimo.example",
        profilePictureUrl: "",
        websites: ["https://invistimo.example"],
        vertical: "EVENT_PLAN",
        syncedAt: new Date().toISOString(),
        source: "meta",
        editableFields: [
          "about",
          "address",
          "description",
          "email",
          "websites",
          "vertical",
          "profilePictureUrl",
        ],
        readOnlyFields: [
          "displayName",
          "nameStatus",
          "displayNameStatus",
          "displayNameStatusRaw",
          "phoneNumber",
        ],
      };
      applyProfile(mock);
      setLoading(false);
      return;
    }
    if (!businessId) return;
    setLoading(true);
    try {
      const data = opts?.syncFirst
        ? await syncWhatsAppBusinessProfile(businessId)
        : await getWhatsAppBusinessProfile(businessId);
      applyProfile(data.profile);
      await refreshConnection();
      const syncError =
        data.syncError || data.profile?.syncError || firstFieldError(data.fieldErrors);
      if (syncError && opts?.syncFirst) {
        toast.error(`${t("whatsapp.hub.profileSyncWarning")} ${syncError}`);
      }
    } catch (error) {
      toast.error(metaErrorMessage(error, t("whatsapp.hub.profileLoadError")));
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const save = async () => {
    if (!businessId) return;
    setSaving(true);
    try {
      const result = await updateWhatsAppBusinessProfile(businessId, {
        about: draft.about,
        address: draft.address,
        description: draft.description,
        email: draft.email,
        vertical: draft.vertical,
        websites: [draft.websites[0], draft.websites[1]],
      });
      applyProfile(result.profile);
      await refreshConnection();
      const syncError =
        result.syncError ||
        result.profile?.syncError ||
        firstFieldError(result.fieldErrors || result.profile?.fieldErrors) ||
        (result.pictureSync?.ok === false
          ? result.pictureSync.error || t("whatsapp.hub.profilePhotoMetaError")
          : "");
      if (syncError) {
        toast.error(`${t("whatsapp.hub.profileSyncWarning")} ${syncError}`);
      } else {
        toast.success(t("whatsapp.hub.profileSaved"));
      }
    } catch (error) {
      toast.error(metaErrorMessage(error, t("whatsapp.hub.profileSaveError")));
    } finally {
      setSaving(false);
    }
  };

  const onPickPhoto = async (file?: File | null) => {
    if (!businessId || !file) return;
    setUploadingPhoto(true);
    try {
      const result = await uploadWhatsAppBusinessProfilePicture(
        businessId,
        file
      );
      applyProfile(result.profile);
      await refreshConnection();
      toast.success(t("whatsapp.hub.profilePhotoSaved"));
    } catch (error) {
      toast.error(
        metaErrorMessage(error, t("whatsapp.hub.profilePhotoSaveError"))
      );
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const metaNameStatusRaw = String(
    profile?.displayNameStatusRaw ||
      profile?.nameStatus ||
      connection?.displayNameStatusRaw ||
      connection?.nameStatus ||
      ""
  ).trim();
  const nameStatus =
    profile?.displayNameStatus ||
    connection?.displayNameStatus ||
    formatNameStatus(metaNameStatusRaw, t);
  const displayName =
    profile?.displayName || connection?.verifiedName || t("whatsapp.hub.unnamed");
  const phone =
    profile?.phoneNumber || connection?.displayPhoneNumber || "";
  const categoryLabel =
    VERTICAL_LABEL[draft.vertical] || draft.vertical || "—";

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-slate-900">
            {t("whatsapp.hub.profileTitle")}
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            {t("whatsapp.hub.profileSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
            disabled={!businessId || syncing || loading}
            onClick={() => {
              setSyncing(true);
              void load({ syncFirst: true });
            }}
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {t("whatsapp.hub.syncProfile")}
          </button>
          <button
            type="button"
            className={`${btnPrimary} !px-3 !py-1.5 text-xs`}
            disabled={!businessId || saving || loading || !connection?.connected}
            onClick={() => void save()}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {t("whatsapp.hub.saveToMeta")}
          </button>
        </div>
      </div>

      {profile?.syncError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          {t("whatsapp.hub.profileSyncWarning")} {profile.syncError}
        </p>
      ) : null}

      {loading && !profile ? (
        <div className={`${cardBase} flex items-center gap-2 p-6 text-sm font-semibold text-slate-500`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("whatsapp.hub.loading")}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className={`${cardBase} space-y-3 p-3 sm:p-4`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.displayName")}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <input
                  className={`${inputBase} !h-10 min-w-0 flex-1 cursor-default bg-slate-50 text-slate-600`}
                  value={displayName}
                  readOnly
                />
                {nameStatus ? (
                  <span className="inline-flex min-w-0 flex-col items-start gap-0.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-black ${nameStatusBadgeClass(
                        metaNameStatusRaw || nameStatus
                      )}`}
                      title={
                        metaNameStatusRaw
                          ? `${t("whatsapp.hub.displayNameMetaStatus")}: ${metaNameStatusRaw}`
                          : nameStatus
                      }
                    >
                      {nameStatus === "REJECTED" ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      ) : null}
                      {nameStatus}
                    </span>
                    {metaNameStatusRaw ? (
                      <span
                        className="max-w-[220px] truncate text-[9px] font-semibold text-slate-400"
                        dir="ltr"
                        title={`${t("whatsapp.hub.displayNameMetaStatus")}: ${metaNameStatusRaw}`}
                      >
                        {t("whatsapp.hub.displayNameMetaStatus")}: {metaNameStatusRaw}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Picture
              </span>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100"
                  disabled={!businessId || uploadingPhoto || !connection?.connected}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {pictureUrl ? (
                    <img
                      src={pictureUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-[10px] font-bold text-slate-400">
                      WA
                    </span>
                  )}
                  <span className="absolute bottom-0 end-0 grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-white shadow">
                    {uploadingPhoto ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </span>
                </button>
                <div>
                  <button
                    type="button"
                    className="text-xs font-bold text-sky-700"
                    disabled={!businessId || uploadingPhoto || !connection?.connected}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("whatsapp.hub.changePhoto")}
                  </button>
                  <p className="text-[10px] font-semibold text-slate-400">
                    PNG, JPG or GIF
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(e) => void onPickPhoto(e.target.files?.[0])}
                />
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                About
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                maxLength={139}
                dir="auto"
                value={draft.about}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, about: e.target.value }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.about.length}/139
              </p>
              <FieldError message={fieldErrors.about} />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Category
              </span>
              <select
                className={`${inputBase} mt-1 !h-10`}
                value={draft.vertical}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, vertical: e.target.value }))
                }
              >
                <option value="">—</option>
                {VERTICALS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.vertical} />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Description
              </span>
              <textarea
                className={`${inputBase} mt-1 !h-24 py-2`}
                maxLength={512}
                dir="auto"
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.description.length}/512
              </p>
              <FieldError message={fieldErrors.description} />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Email
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                type="email"
                dir="ltr"
                maxLength={128}
                value={draft.email}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, email: e.target.value }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.email.length}/128
              </p>
              <FieldError message={fieldErrors.email} />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Address
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                maxLength={256}
                value={draft.address}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, address: e.target.value }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.address.length}/256
              </p>
              <FieldError message={fieldErrors.address} />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Website (primary)
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                dir="ltr"
                maxLength={256}
                value={draft.websites[0]}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    websites: [e.target.value, d.websites[1]],
                  }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.websites[0].length}/256
              </p>
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Website (secondary)
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                dir="ltr"
                maxLength={256}
                value={draft.websites[1]}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    websites: [d.websites[0], e.target.value],
                  }))
                }
              />
              <p className="mt-0.5 text-end text-[10px] font-semibold text-slate-400" dir="ltr">
                {draft.websites[1].length}/256
              </p>
              <FieldError message={fieldErrors.websites} />
            </label>
          </div>

          <aside className={`${cardBase} overflow-hidden p-0`}>
            <div className="bg-gradient-to-b from-slate-50 to-white px-4 pb-5 pt-4">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow">
                {pictureUrl ? (
                  <img
                    src={pictureUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-bold text-slate-400">
                    WA
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-center text-base font-black text-slate-900">
                {displayName}
              </h3>
              <p className="mt-0.5 text-center text-xs font-semibold text-slate-500" dir="ltr">
                {phone || "—"}
              </p>
              {nameStatus ? (
                <div className="mt-2 flex flex-col items-center gap-0.5">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${nameStatusBadgeClass(
                      metaNameStatusRaw || nameStatus
                    )}`}
                    title={
                      metaNameStatusRaw
                        ? `${t("whatsapp.hub.displayNameMetaStatus")}: ${metaNameStatusRaw}`
                        : nameStatus
                    }
                  >
                    {nameStatus}
                  </span>
                  {metaNameStatusRaw ? (
                    <span
                      className="max-w-[220px] truncate text-[9px] font-semibold text-slate-400"
                      dir="ltr"
                      title={`${t("whatsapp.hub.displayNameMetaStatus")}: ${metaNameStatusRaw}`}
                    >
                      {t("whatsapp.hub.displayNameMetaStatus")}: {metaNameStatusRaw}
                    </span>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-4 space-y-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
                <PreviewRow label="ABOUT" value={draft.about} />
                <PreviewRow label="DESCRIPTION" value={draft.description} />
                <PreviewRow label="CATEGORY" value={categoryLabel} />
                <PreviewRow label="EMAIL" value={draft.email} ltr />
                <PreviewRow label="ADDRESS" value={draft.address} />
                <PreviewRow label="WEBSITE" value={draft.websites[0]} ltr />
                {draft.websites[1] ? (
                  <PreviewRow label="WEBSITE 2" value={draft.websites[1]} ltr />
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-0.5 text-[10px] font-bold text-rose-600">{message}</p>
  );
}

function PreviewRow({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-all" dir={ltr ? "ltr" : "auto"}>
        {value || "—"}
      </p>
    </div>
  );
}
