import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CalendarClock,
  Camera,
  ImagePlus,
  Loader2,
  PlugZap,
  Share2,
} from "lucide-react";
import {
  createSocialScheduledPost,
  getSocialScheduleStatus,
  uploadSocialScheduleMedia,
  type SocialContentType,
  type SocialMediaItem,
  type SocialPlatform,
  type SocialScheduleStatusResponse,
} from "../../../../api/socialScheduleApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultScheduleValue() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  return toLocalInputValue(d);
}

export default function SocialScheduleComposeTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<SocialScheduleStatusResponse | null>(
    null
  );

  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [contentType, setContentType] = useState<SocialContentType>("post");
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState(defaultScheduleValue);
  const [media, setMedia] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getSocialScheduleStatus(businessId);
        if (!cancelled) setStatus(data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || t("socialSchedule.errors.loadStatus")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, t]);

  const connected = Boolean(status?.connected);
  const igReady = Boolean(status?.instagram?.connected);

  const canSubmit = useMemo(() => {
    if (!connected) return false;
    if (platform === "instagram" && !igReady) return false;
    if (contentType === "story" && !media.length) return false;
    if (platform === "instagram" && !media.length) return false;
    if (
      platform === "facebook" &&
      contentType === "post" &&
      !caption.trim() &&
      !media.length
    ) {
      return false;
    }
    return Boolean(scheduledAt);
  }, [caption, connected, contentType, igReady, media.length, platform, scheduledAt]);

  const onUpload = async (file: File | null) => {
    if (!file || !businessId) return;
    const kind = file.type.startsWith("video/") ? "video" : "image";
    try {
      setUploading(true);
      const uploaded = await uploadSocialScheduleMedia(businessId, file, kind);
      if (!uploaded.url) {
        throw new Error(t("socialSchedule.errors.mediaUpload"));
      }
      setMedia([uploaded]);
      toast.success(t("socialSchedule.toasts.mediaUploaded"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          t("socialSchedule.errors.mediaUpload")
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = async (publishNow = false) => {
    if (!businessId) return;
    if (!canSubmit && !publishNow) {
      toast.error(t("socialSchedule.compose.incomplete"));
      return;
    }
    try {
      setSaving(true);
      const iso = new Date(scheduledAt).toISOString();
      await createSocialScheduledPost(businessId, {
        platform,
        contentType,
        caption: caption.trim(),
        media,
        scheduledAt: iso,
        publishNow,
      });
      toast.success(
        publishNow
          ? t("socialSchedule.toasts.published")
          : t("socialSchedule.toasts.scheduled")
      );
      setCaption("");
      setMedia([]);
      setScheduledAt(defaultScheduleValue());
      navigate("../queue");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("socialSchedule.errors.schedule")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center gap-2 p-6 text-slate-600`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("socialSchedule.loading")}
      </div>
    );
  }

  if (!connected) {
    return (
      <div className={`${cardBase} p-6`}>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-slate-900">
              {t("socialSchedule.compose.notConnectedTitle")}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("socialSchedule.compose.notConnectedHint")}
            </p>
            <button
              type="button"
              className={`${btnPrimary} mt-4`}
              onClick={() =>
                navigate(
                  businessId
                    ? `/business/${businessId}/dashboard/meta-campaigns/settings`
                    : "../meta-campaigns/settings"
                )
              }
            >
              <PlugZap className="h-4 w-4" />
              {t("socialSchedule.compose.connectCta")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-900">
            {t("socialSchedule.compose.title")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("socialSchedule.compose.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.compose.platform")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    id: "facebook" as const,
                    icon: Share2,
                    label: t("socialSchedule.platforms.facebook"),
                  },
                  {
                    id: "instagram" as const,
                    icon: Camera,
                    label: t("socialSchedule.platforms.instagram"),
                  },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const active = platform === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlatform(option.id)}
                    className={[
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-black transition",
                      active
                        ? "border-sky-300 bg-sky-50 text-sky-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-200",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
            {platform === "instagram" && !igReady ? (
              <p className="mt-2 text-xs font-semibold text-amber-700">
                {t("socialSchedule.compose.instagramMissing")}
              </p>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.compose.contentType")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    id: "post" as const,
                    label: t("socialSchedule.contentTypes.post"),
                  },
                  {
                    id: "story" as const,
                    label: t("socialSchedule.contentTypes.story"),
                  },
                ] as const
              ).map((option) => {
                const active = contentType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setContentType(option.id)}
                    className={[
                      "rounded-lg border px-3 py-3 text-sm font-black transition",
                      active
                        ? "border-sky-300 bg-sky-50 text-sky-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-200",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.compose.caption")}
            </label>
            <textarea
              className={`${inputBase} h-32 resize-y py-3`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t("socialSchedule.compose.captionPlaceholder")}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.compose.media")}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className={`${btnSecondary} cursor-pointer`}>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {t("socialSchedule.compose.uploadMedia")}
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onUpload(e.target.files?.[0] || null)}
                />
              </label>
              {media[0]?.url ? (
                <button
                  type="button"
                  className="text-xs font-bold text-rose-600"
                  onClick={() => setMedia([])}
                >
                  {t("socialSchedule.compose.removeMedia")}
                </button>
              ) : null}
            </div>
            {media[0]?.url ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {media[0].type === "video" ? (
                  <video
                    src={media[0].url}
                    controls
                    className="max-h-56 w-full object-contain"
                  />
                ) : (
                  <img
                    src={media[0].url}
                    alt=""
                    className="max-h-56 w-full object-contain"
                  />
                )}
              </div>
            ) : null}
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {t("socialSchedule.compose.mediaHint")}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.compose.scheduledAt")}
            </label>
            <input
              type="datetime-local"
              className={inputBase}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className={btnPrimary}
              disabled={saving || !canSubmit}
              onClick={() => submit(false)}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarClock className="h-4 w-4" />
              )}
              {t("socialSchedule.compose.scheduleCta")}
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={saving || !canSubmit}
              onClick={() => submit(true)}
            >
              {t("socialSchedule.compose.publishNowCta")}
            </button>
          </div>
        </div>
      </section>

      <aside className={`${cardBase} p-4 sm:p-5`}>
        <h3 className="text-base font-black text-slate-900">
          {t("socialSchedule.compose.summaryTitle")}
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">
              {t("socialSchedule.compose.platform")}
            </dt>
            <dd className="font-black text-slate-800">
              {t(`socialSchedule.platforms.${platform}`)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">
              {t("socialSchedule.compose.contentType")}
            </dt>
            <dd className="font-black text-slate-800">
              {t(`socialSchedule.contentTypes.${contentType}`)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">
              {t("socialSchedule.compose.page")}
            </dt>
            <dd className="truncate font-black text-slate-800">
              {status?.selectedPage?.pageName || "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">
              {t("socialSchedule.compose.scheduledAt")}
            </dt>
            <dd className="font-black text-slate-800">
              {scheduledAt
                ? new Date(scheduledAt).toLocaleString()
                : "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-5 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800">
          {t("socialSchedule.compose.autoPublishHint")}
        </p>
      </aside>
    </div>
  );
}
