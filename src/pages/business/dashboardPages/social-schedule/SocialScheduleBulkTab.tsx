import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Camera,
  ImagePlus,
  Layers3,
  Loader2,
  PlugZap,
  Share2,
} from "lucide-react";
import {
  createSocialBulkSchedule,
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

function defaultStartValue() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return toLocalInputValue(d);
}

/** Preview upcoming dates client-side (mirrors server defaults). */
function previewDates(
  startAt: string,
  count: number,
  timesPerWeek: number
): Date[] {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return [];
  const days =
    timesPerWeek >= 2 ? [0, 3] : [Number.isNaN(start.getDay()) ? 0 : start.getDay()];
  const hour = start.getHours();
  const minute = start.getMinutes();
  const dates: Date[] = [];
  const cursor = new Date(start);
  cursor.setSeconds(0, 0);
  let guard = 0;
  while (dates.length < count && guard < 400) {
    guard += 1;
    if (days.includes(cursor.getDay())) {
      const slot = new Date(cursor);
      slot.setHours(hour, minute, 0, 0);
      if (slot.getTime() >= Date.now() - 30 * 1000) {
        dates.push(slot);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export default function SocialScheduleBulkTab() {
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
  const [captionsText, setCaptionsText] = useState("");
  const [count, setCount] = useState(10);
  const [timesPerWeek, setTimesPerWeek] = useState(2);
  const [startAt, setStartAt] = useState(defaultStartValue);
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

  const captions = useMemo(
    () =>
      captionsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [captionsText]
  );

  const preview = useMemo(
    () => previewDates(startAt, Math.min(Math.max(count, 1), 50), timesPerWeek),
    [count, startAt, timesPerWeek]
  );

  const canSubmit = useMemo(() => {
    if (!connected) return false;
    if (platform === "instagram" && !igReady) return false;
    if (contentType === "story" && !media.length) return false;
    if (platform === "instagram" && !media.length) return false;
    if (
      platform === "facebook" &&
      contentType === "post" &&
      !caption.trim() &&
      !captions.length &&
      !media.length
    ) {
      return false;
    }
    return count >= 1 && timesPerWeek >= 1 && Boolean(startAt);
  }, [
    caption,
    captions.length,
    connected,
    contentType,
    count,
    igReady,
    media.length,
    platform,
    startAt,
    timesPerWeek,
  ]);

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

  const submit = async () => {
    if (!businessId || !canSubmit) {
      toast.error(t("socialSchedule.compose.incomplete"));
      return;
    }
    try {
      setSaving(true);
      const result = await createSocialBulkSchedule(businessId, {
        platform,
        contentType,
        caption: caption.trim(),
        captions,
        media,
        startAt: new Date(startAt).toISOString(),
        count,
        timesPerWeek,
      });
      toast.success(
        t("socialSchedule.toasts.bulkScheduled", { count: result.count })
      );
      navigate("../queue");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("socialSchedule.errors.bulk")
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
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-900">
            {t("socialSchedule.bulk.title")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("socialSchedule.bulk.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
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

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("socialSchedule.bulk.count")}
              </span>
              <input
                type="number"
                min={1}
                max={50}
                className={inputBase}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("socialSchedule.bulk.timesPerWeek")}
              </span>
              <input
                type="number"
                min={1}
                max={7}
                className={inputBase}
                value={timesPerWeek}
                onChange={(e) => setTimesPerWeek(Number(e.target.value) || 1)}
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("socialSchedule.bulk.startAt")}
              </span>
              <input
                type="datetime-local"
                className={inputBase}
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.bulk.sharedCaption")}
            </span>
            <textarea
              className={`${inputBase} h-24 resize-y py-3`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t("socialSchedule.compose.captionPlaceholder")}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
              {t("socialSchedule.bulk.captionsList")}
            </span>
            <textarea
              className={`${inputBase} h-36 resize-y py-3 font-mono text-xs`}
              value={captionsText}
              onChange={(e) => setCaptionsText(e.target.value)}
              placeholder={t("socialSchedule.bulk.captionsPlaceholder")}
            />
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("socialSchedule.bulk.captionsHint")}
            </p>
          </label>

          <div>
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
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                {media[0].type === "video" ? (
                  <video
                    src={media[0].url}
                    controls
                    className="max-h-48 w-full object-contain"
                  />
                ) : (
                  <img
                    src={media[0].url}
                    alt=""
                    className="max-h-48 w-full object-contain"
                  />
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className={btnPrimary}
            disabled={saving || !canSubmit}
            onClick={submit}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Layers3 className="h-4 w-4" />
            )}
            {t("socialSchedule.bulk.scheduleCta", { count })}
          </button>
        </div>
      </section>

      <aside className={`${cardBase} p-4 sm:p-5`}>
        <h3 className="text-base font-black text-slate-900">
          {t("socialSchedule.bulk.previewTitle")}
        </h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("socialSchedule.bulk.previewSubtitle", {
            count,
            timesPerWeek,
          })}
        </p>
        <ul className="mt-4 max-h-[420px] space-y-2 overflow-auto">
          {preview.map((date, index) => (
            <li
              key={`${date.toISOString()}-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <span className="font-black text-sky-700">#{index + 1}</span>{" "}
              {date.toLocaleString()}
              {captions[index] ? (
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {captions[index]}
                </span>
              ) : caption ? (
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {caption}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
