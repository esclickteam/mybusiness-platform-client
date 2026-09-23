import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";
import {
  formatNameStatus,
  nameStatusBadgeClass,
} from "./hubFormat";

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
  const { businessId, connection } = useOutletContext<WhatsAppHubOutletContext>();
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

  const nameStatus = formatNameStatus(profile?.nameStatus || connection?.nameStatus);

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.hub.profileTitle")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("whatsapp.hub.profileSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            disabled={!businessId || syncing || loading}
            onClick={() => void load({ syncFirst: true })}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t("whatsapp.hub.syncProfile")}
          </button>
          <button
            type="button"
            className={btnPrimary}
            disabled={!businessId || saving || loading || !connection?.connected}
            onClick={() => void save()}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t("whatsapp.hub.saveToMeta")}
          </button>
        </div>
      </div>

      {loading && !profile ? (
        <div className={`${cardBase} flex items-center gap-2 p-8 text-sm font-semibold text-slate-500`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("whatsapp.hub.loading")}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <aside className={`${cardBase} p-4`}>
            {profile?.profilePictureUrl ? (
              <img
                src={profile.profilePictureUrl}
                alt=""
                className="mx-auto h-36 w-36 rounded-2xl object-cover"
              />
            ) : (
              <div className="mx-auto grid h-36 w-36 place-items-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-400">
                {t("whatsapp.hub.noPhoto")}
              </div>
            )}
            <p className="mt-3 text-center text-xs font-semibold text-slate-400">
              {t("whatsapp.hub.photoReadOnly")}
            </p>
          </aside>

          <div className="space-y-3">
            <article className={`${cardBase} grid gap-3 p-4 sm:grid-cols-2`}>
              <label className="block">
                <span className="text-xs font-black text-slate-500">
                  {t("whatsapp.hub.displayName")}
                </span>
                <input
                  className={`${inputBase} mt-1 bg-slate-50`}
                  value={profile?.displayName || connection?.verifiedName || ""}
                  readOnly
                />
                {nameStatus ? (
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${nameStatusBadgeClass(
                      profile?.nameStatus || connection?.nameStatus
                    )}`}
                  >
                    {nameStatus}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-500">
                  {t("whatsapp.hub.phone")}
                </span>
                <input
                  className={`${inputBase} mt-1 bg-slate-50`}
                  dir="ltr"
                  value={profile?.phoneNumber || connection?.displayPhoneNumber || ""}
                  readOnly
                />
              </label>
            </article>

            <article className={`${cardBase} grid gap-3 p-4 sm:grid-cols-2`}>
              <label className="block sm:col-span-2">
                <span className="text-xs font-black text-slate-500">About</span>
                <input
                  className={`${inputBase} mt-1`}
                  maxLength={139}
                  value={draft.about}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, about: e.target.value }))
                  }
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-black text-slate-500">
                  Description
                </span>
                <textarea
                  className={`${inputBase} mt-1 h-24 py-2`}
                  maxLength={512}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-500">Email</span>
                <input
                  className={`${inputBase} mt-1`}
                  type="email"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, email: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-500">
                  Vertical
                </span>
                <select
                  className={`${inputBase} mt-1`}
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
              <label className="block sm:col-span-2">
                <span className="text-xs font-black text-slate-500">Address</span>
                <input
                  className={`${inputBase} mt-1`}
                  value={draft.address}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, address: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-500">
                  Website 1
                </span>
                <input
                  className={`${inputBase} mt-1`}
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
                <span className="text-xs font-black text-slate-500">
                  Website 2
                </span>
                <input
                  className={`${inputBase} mt-1`}
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
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
