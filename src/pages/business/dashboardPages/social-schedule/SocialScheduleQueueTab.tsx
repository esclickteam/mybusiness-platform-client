import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Ban,
  Camera,
  Loader2,
  RefreshCw,
  Share2,
} from "lucide-react";
import {
  cancelSocialScheduledPost,
  listSocialScheduledPosts,
  type SocialContentType,
  type SocialPlatform,
  type SocialScheduledPost,
} from "../../../../api/socialScheduleApi";
import {
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

const STATUS_FILTERS = [
  "scheduled",
  "published",
  "failed",
  "cancelled",
  "all",
] as const;

export default function SocialScheduleQueueTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [posts, setPosts] = useState<SocialScheduledPost[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("scheduled");
  const [platformFilter, setPlatformFilter] = useState<"all" | SocialPlatform>(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<"all" | SocialContentType>(
    "all"
  );

  const load = useCallback(async () => {
    if (!businessId) return;
    try {
      setLoading(true);
      const rows = await listSocialScheduledPosts(businessId, {
        status: statusFilter === "all" ? undefined : statusFilter,
        platform: platformFilter === "all" ? undefined : platformFilter,
        contentType: typeFilter === "all" ? undefined : typeFilter,
        limit: 150,
      });
      setPosts(rows);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("socialSchedule.errors.loadQueue")
      );
    } finally {
      setLoading(false);
    }
  }, [businessId, platformFilter, statusFilter, t, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    return {
      total: posts.length,
      scheduled: posts.filter((p) => p.status === "scheduled").length,
    };
  }, [posts]);

  const onCancel = async (postId: string) => {
    if (!businessId) return;
    if (!window.confirm(t("socialSchedule.queue.cancelConfirm"))) return;
    try {
      setCancellingId(postId);
      await cancelSocialScheduledPost(businessId, postId);
      toast.success(t("socialSchedule.toasts.cancelled"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("socialSchedule.errors.cancel")
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section className={`${cardBase} p-4 sm:p-5`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("socialSchedule.queue.title")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("socialSchedule.queue.subtitle")}
          </p>
        </div>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => load()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {t("socialSchedule.queue.refresh")}
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <select
          className={inputBase}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])
          }
        >
          {STATUS_FILTERS.map((value) => (
            <option key={value} value={value}>
              {t(`socialSchedule.status.${value}`)}
            </option>
          ))}
        </select>
        <select
          className={inputBase}
          value={platformFilter}
          onChange={(e) =>
            setPlatformFilter(e.target.value as "all" | SocialPlatform)
          }
        >
          <option value="all">{t("socialSchedule.filters.allPlatforms")}</option>
          <option value="facebook">
            {t("socialSchedule.platforms.facebook")}
          </option>
          <option value="instagram">
            {t("socialSchedule.platforms.instagram")}
          </option>
        </select>
        <select
          className={inputBase}
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "all" | SocialContentType)
          }
        >
          <option value="all">{t("socialSchedule.filters.allTypes")}</option>
          <option value="post">{t("socialSchedule.contentTypes.post")}</option>
          <option value="story">
            {t("socialSchedule.contentTypes.story")}
          </option>
        </select>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">
        {t("socialSchedule.queue.showing", {
          count: counts.total,
          scheduled: counts.scheduled,
        })}
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("socialSchedule.loading")}
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500">
          {t("socialSchedule.queue.empty")}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {posts.map((post) => {
            const PlatformIcon =
              post.platform === "instagram" ? Camera : Share2;
            const canCancel =
              post.status === "scheduled" || post.status === "failed";
            return (
              <li
                key={post._id}
                className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">
                        <PlatformIcon className="h-3.5 w-3.5" />
                        {t(`socialSchedule.platforms.${post.platform}`)}
                      </span>
                      <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-black text-sky-700">
                        {t(`socialSchedule.contentTypes.${post.contentType}`)}
                      </span>
                      <span className="rounded-md bg-violet-50 px-2 py-1 text-xs font-black text-violet-700">
                        {t(`socialSchedule.status.${post.status}`)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm font-semibold text-slate-800">
                      {post.caption || t("socialSchedule.queue.noCaption")}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {t("socialSchedule.queue.when")}:{" "}
                      {new Date(post.scheduledAt).toLocaleString()}
                      {post.pageName ? ` · ${post.pageName}` : ""}
                    </p>
                    {post.lastError ? (
                      <p className="mt-1 text-xs font-semibold text-rose-600">
                        {post.lastError}
                      </p>
                    ) : null}
                    {post.media?.[0]?.url ? (
                      <div className="mt-2 overflow-hidden rounded-lg border border-slate-100">
                        {post.media[0].type === "video" ? (
                          <video
                            src={post.media[0].url}
                            className="h-24 w-full max-w-[220px] object-cover"
                          />
                        ) : (
                          <img
                            src={post.media[0].url}
                            alt=""
                            className="h-24 w-full max-w-[220px] object-cover"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  {canCancel ? (
                    <button
                      type="button"
                      className={`${btnSecondary} shrink-0 text-rose-700`}
                      disabled={cancellingId === post._id}
                      onClick={() => onCancel(post._id)}
                    >
                      {cancellingId === post._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      {t("socialSchedule.queue.cancel")}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
