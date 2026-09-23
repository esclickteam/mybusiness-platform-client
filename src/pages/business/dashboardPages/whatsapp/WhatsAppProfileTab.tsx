import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "react-toastify";
import {
  getWhatsAppBusinessProfile,
  syncWhatsAppBusinessProfile,
  updateWhatsAppBusinessProfile,
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

const VERTICALS = [
  "UNDEFINED",
  "OTHER",
  "AUTO",
  "BEAUTY",
  "APPAREL",
  "EDU",
  "ENTERTAIN",
  "EVENT_PLAN",
  "FINANCE",
  "GROCERY",
  "GOVT",
  "HOTEL",
  "HEALTH",
  "NONPROFIT",
  "PROF_SERVICES",
  "RETAIL",
  "TRAVEL",
  "RESTAURANT",
  "ALCOHOL",
];

export default function WhatsAppProfileTab() {
  const { t, i18n } = useTranslation();
  const { businessId, connection } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();
  const [profile, setProfile] = useState<WhatsAppBusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [draft, setDraft] = useState({
    about: "",
    address: "",
    description: "",
    email: "",
    vertical: "",
    websites: ["", ""] as string[],
  });

  const load = async (opts?: { syncFirst?: boolean }) => {
    if (visualQa) {
      const mock: WhatsAppBusinessProfile = {
        displayName: visualQa.connection.verifiedName || "Invistimo RSVP",
        nameStatus: visualQa.connection.nameStatus || "APPROVED",
        phoneNumber: visualQa.connection.displayPhoneNumber || "",
        phoneNumberId: visualQa.connection.phoneNumberId || "",
        wabaId: visualQa.connection.wabaId || "",
        about: "RSVP & event updates",
        address: "Tel Aviv",
        description: "Professional WhatsApp channel for event RSVP.",
        email: "hello@invistimo.example",
        profilePictureUrl: "",
        websites: ["https://invistimo.example"],
        vertical: "OTHER",
        syncedAt: new Date().toISOString(),
        editableFields: ["about", "address", "description", "email", "websites", "vertical"],
        readOnlyFields: ["displayName", "nameStatus", "phoneNumber", "profilePictureUrl"],
      };
      setProfile(mock);
      setDraft({
        about: mock.about,
        address: mock.address,
        description: mock.description,
        email: mock.email,
        vertical: mock.vertical,
        websites: [mock.websites[0] || "", mock.websites[1] || ""],
      });
      setLoading(false);
      return;
    }
    if (!businessId) return;
    setLoading(true);
    try {
      if (opts?.syncFirst) {
        setSyncing(true);
        await syncWhatsAppBusinessProfile(businessId);
      }
      const data = await getWhatsAppBusinessProfile(businessId);
      setProfile(data.profile);
      setDraft({
        about: data.profile.about || "",
        address: data.profile.address || "",
        description: data.profile.description || "",
        email: data.profile.email || "",
        vertical: data.profile.vertical || "",
        websites: [
          data.profile.websites?.[0] || "",
          data.profile.websites?.[1] || "",
        ],
      });
    } catch {
      toast.error(t("whatsapp.hub.profileLoadError"));
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
        websites: draft.websites.map((w) => w.trim()).filter(Boolean),
      });
      setProfile(result.profile);
      toast.success(t("whatsapp.hub.profileSaved"));
    } catch {
      toast.error(t("whatsapp.hub.profileSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const nameStatus = formatNameStatus(
    profile?.nameStatus || connection?.nameStatus
  );
  const displayName =
    profile?.displayName || connection?.verifiedName || t("whatsapp.hub.unnamed");
  const phone =
    profile?.phoneNumber || connection?.displayPhoneNumber || "";

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
            onClick={() => void load({ syncFirst: true })}
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

      {loading && !profile ? (
        <div className={`${cardBase} flex items-center gap-2 p-6 text-sm font-semibold text-slate-500`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("whatsapp.hub.loading")}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
          <aside className={`${cardBase} overflow-hidden p-0`}>
            <div className="bg-gradient-to-b from-emerald-50 to-white px-4 pb-5 pt-4">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow">
                {profile?.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
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
                <div className="mt-2 flex justify-center">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${nameStatusBadgeClass(
                      profile?.nameStatus || connection?.nameStatus
                    )}`}
                  >
                    {nameStatus}
                  </span>
                </div>
              ) : null}
              <div className="mt-4 rounded-xl bg-white/80 px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  About
                </p>
                <p className="mt-1 whitespace-pre-wrap">
                  {draft.about || "—"}
                </p>
              </div>
              {draft.websites[0] ? (
                <p className="mt-2 truncate text-center text-[11px] font-bold text-sky-700" dir="ltr">
                  {draft.websites[0]}
                </p>
              ) : null}
              <p className="mt-3 text-center text-[10px] font-semibold text-slate-400">
                {t("whatsapp.hub.photoReadOnly")}
              </p>
            </div>
          </aside>

          <div className={`${cardBase} space-y-3 p-3 sm:p-4`}>
            <div className="grid gap-2 sm:grid-cols-2">
              <ReadOnlyField
                label={t("whatsapp.hub.displayName")}
                value={displayName}
              />
              <ReadOnlyField
                label={t("whatsapp.hub.phone")}
                value={phone}
                ltr
              />
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
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  Email
                </span>
                <input
                  className={`${inputBase} mt-1 !h-10`}
                  type="email"
                  dir="ltr"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, email: e.target.value }))
                  }
                />
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
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Address
              </span>
              <input
                className={`${inputBase} mt-1 !h-10`}
                value={draft.address}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, address: e.target.value }))
                }
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  Website 1
                </span>
                <input
                  className={`${inputBase} mt-1 !h-10`}
                  dir="ltr"
                  value={draft.websites[0]}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      websites: [e.target.value, d.websites[1]],
                    }))
                  }
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  Website 2
                </span>
                <input
                  className={`${inputBase} mt-1 !h-10`}
                  dir="ltr"
                  value={draft.websites[1]}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      websites: [d.websites[0], e.target.value],
                    }))
                  }
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        className={`${inputBase} mt-1 !h-10 cursor-default bg-slate-50 text-slate-600`}
        value={value}
        readOnly
        dir={ltr ? "ltr" : undefined}
      />
    </label>
  );
}
