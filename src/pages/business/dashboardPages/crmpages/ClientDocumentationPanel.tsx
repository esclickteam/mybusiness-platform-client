import React, { useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Filter,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Phone,
  Search,
  ScrollText,
  StickyNote,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "@api";
import { uploadCrmDocumentationMedia } from "../../../../utils/crmMediaUpload";

export type ClientActivityType =
  | "note"
  | "call"
  | "whatsapp"
  | "task"
  | "meeting"
  | "file"
  | "agreement";

export type ClientActivityAttachment = {
  url: string;
  name?: string;
  mimeType?: string;
  publicId?: string;
  resourceType?: string;
};

export type ClientActivity = {
  _id?: string;
  id?: string;
  type?: ClientActivityType;
  text?: string;
  createdBy?: string;
  createdAt?: string;
  occurredAt?: string | null;
  taskDueAt?: string | null;
  taskDone?: boolean;
  taskCompletedAt?: string | null;
  taskCompletedBy?: string;
  attachments?: ClientActivityAttachment[];
};

type ClientDocumentationPanelProps = {
  clientId: string;
  businessId: string;
  activities?: ClientActivity[];
  onActivitiesChange: (activities: ClientActivity[]) => void;
};

type ViewMode = "timeline" | "gallery";

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toDatetimeLocalValue(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function toDateInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatDateTime(
  value: string | null | undefined,
  locale: string,
  fallback: string
) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isImageAttachment(attachment: ClientActivityAttachment) {
  const mime = String(attachment.mimeType || "").toLowerCase();
  const url = String(attachment.url || "").toLowerCase();
  const resource = String(attachment.resourceType || "").toLowerCase();
  return (
    resource === "image" ||
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url)
  );
}

function activityDayKey(activity: ClientActivity) {
  const raw = activity.occurredAt || activity.createdAt;
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return toDateInputValue(date);
}

export default function ClientDocumentationPanel({
  clientId,
  businessId,
  activities = [],
  onActivitiesChange,
}: ClientDocumentationPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "he";
  const emDash = t("crm.common.emDash");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activityType, setActivityType] = useState<ClientActivityType>("note");
  const [text, setText] = useState("");
  const [occurredAt, setOccurredAt] = useState(toDatetimeLocalValue());
  const [taskDueAt, setTaskDueAt] = useState(toDatetimeLocalValue());
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ClientActivityType>(
    "all"
  );

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aTime = new Date(a.occurredAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.occurredAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedActivities.filter((activity) => {
      if (typeFilter !== "all" && activity.type !== typeFilter) return false;

      const day = activityDayKey(activity);
      if (dateFrom && day && day < dateFrom) return false;
      if (dateTo && day && day > dateTo) return false;

      if (!query) return true;

      const haystack = [
        activity.text,
        activity.createdBy,
        ...(activity.attachments || []).map((item) => item.name || ""),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [sortedActivities, searchQuery, dateFrom, dateTo, typeFilter]);

  const galleryItems = useMemo(() => {
    const items: {
      url: string;
      name: string;
      mimeType?: string;
      createdAt?: string;
      activityText?: string;
      isImage: boolean;
    }[] = [];

    filteredActivities.forEach((activity) => {
      (activity.attachments || []).forEach((attachment) => {
        if (!attachment?.url) return;
        items.push({
          url: attachment.url,
          name:
            attachment.name || t("crm.clients.documentation.attachedFile"),
          mimeType: attachment.mimeType,
          createdAt: activity.occurredAt || activity.createdAt,
          activityText: activity.text,
          isImage: isImageAttachment(attachment),
        });
      });
    });

    return items;
  }, [filteredActivities, t]);

  const needsAttachment =
    activityType === "file" || activityType === "agreement";

  const typeLabel = (type?: ClientActivityType) => {
    switch (type) {
      case "call":
        return t("crm.clients.documentation.types.call");
      case "whatsapp":
        return t("crm.clients.documentation.types.whatsapp");
      case "task":
        return t("crm.clients.documentation.types.task");
      case "meeting":
        return t("crm.clients.documentation.types.meeting");
      case "file":
        return t("crm.clients.documentation.types.file");
      case "agreement":
        return t("crm.clients.documentation.types.agreement");
      case "note":
      default:
        return t("crm.clients.documentation.types.note");
    }
  };

  const placeholder = () => {
    switch (activityType) {
      case "task":
        return t("crm.clients.documentation.placeholders.task");
      case "meeting":
        return t("crm.clients.documentation.placeholders.meeting");
      case "file":
        return t("crm.clients.documentation.placeholders.file");
      case "agreement":
        return t("crm.clients.documentation.placeholders.agreement");
      case "call":
        return t("crm.clients.documentation.placeholders.call");
      case "whatsapp":
        return t("crm.clients.documentation.placeholders.whatsapp");
      default:
        return t("crm.clients.documentation.placeholders.note");
    }
  };

  const clearPendingFiles = () => {
    pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPendingFiles([]);
    setPendingPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetComposerDates = () => {
    const now = toDatetimeLocalValue();
    setOccurredAt(now);
    setTaskDueAt(now);
  };

  const handleTypeChange = (next: ClientActivityType) => {
    setActivityType(next);
    resetComposerDates();
    setError("");
  };

  const handleSelectFiles = (files: File[]) => {
    pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPendingFiles(files);
    setPendingPreviews(
      files.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      )
    );
    if (files.length > 0 && (activityType === "note" || activityType === "call")) {
      /* keep current type — attachments allowed on notes */
    }
  };

  const handleAddActivity = async () => {
    if (saving || uploading) return;

    const trimmed = text.trim();
    if (!trimmed && pendingFiles.length === 0) {
      setError(t("crm.clients.documentation.errors.textOrFileRequired"));
      return;
    }

    if (needsAttachment && pendingFiles.length === 0) {
      setError(t("crm.clients.documentation.errors.fileRequired"));
      return;
    }

    if (!businessId) {
      setError(t("crm.clients.alerts.businessIdMissing"));
      return;
    }

    setSaving(true);
    setError("");

    try {
      let attachments: ClientActivityAttachment[] = [];

      if (pendingFiles.length > 0) {
        setUploading(true);
        attachments = await Promise.all(
          pendingFiles.map(async (file) => {
            const uploaded = await uploadCrmDocumentationMedia({
              file,
              businessId,
            });

            if (!uploaded.secureUrl) {
              throw new Error(t("crm.clients.documentation.errors.uploadFailed"));
            }

            return {
              url: uploaded.secureUrl,
              name: uploaded.originalName || file.name,
              mimeType: uploaded.mimeType || file.type || "",
              publicId: uploaded.publicId,
              resourceType:
                uploaded.resourceType ||
                (file.type.startsWith("image/") ? "image" : "raw"),
            };
          })
        );
        setUploading(false);
      }

      const resolvedType: ClientActivityType =
        activityType === "note" &&
        attachments.length > 0 &&
        !trimmed
          ? "file"
          : activityType;

      const { data } = await API.post<{
        success?: boolean;
        activity?: ClientActivity;
        client?: { activities?: ClientActivity[] };
      }>(`/crm-clients/${clientId}/activities`, {
        type: resolvedType,
        text: trimmed,
        occurredAt: new Date(occurredAt || Date.now()).toISOString(),
        taskDueAt:
          resolvedType === "task"
            ? new Date(taskDueAt || Date.now()).toISOString()
            : null,
        attachments,
      });

      if (Array.isArray(data?.client?.activities)) {
        onActivitiesChange(data.client.activities);
      } else if (data?.activity) {
        onActivitiesChange([data.activity, ...activities]);
      } else {
        throw new Error(t("crm.clients.documentation.errors.saveFailed"));
      }

      setText("");
      clearPendingFiles();
      resetComposerDates();
    } catch (err) {
      console.error("Add client activity error:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("crm.clients.documentation.errors.saveFailed")
      );
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleToggleTask = async (activity: ClientActivity) => {
    const activityId = activity._id || activity.id;
    if (!activityId) return;

    const nextDone = !activity.taskDone;

    onActivitiesChange(
      activities.map((item) =>
        (item._id || item.id) === activityId
          ? {
              ...item,
              taskDone: nextDone,
              taskCompletedAt: nextDone ? new Date().toISOString() : null,
            }
          : item
      )
    );

    try {
      const { data } = await API.patch<{
        success?: boolean;
        client?: { activities?: ClientActivity[] };
      }>(`/crm-clients/${clientId}/activities/${activityId}/done`, {
        done: nextDone,
      });

      if (Array.isArray(data?.client?.activities)) {
        onActivitiesChange(data.client.activities);
      }
    } catch (err) {
      console.error("Toggle client task error:", err);
      onActivitiesChange(activities);
      setError(t("crm.clients.documentation.errors.taskUpdateFailed"));
    }
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-[#fbfaff] to-[#f3f7ff] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#6D28D9] text-white shadow-lg shadow-violet-200">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("crm.clients.documentation.title")}
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {t("crm.clients.documentation.subtitle")}
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-black transition",
                  viewMode === "timeline"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                {t("crm.clients.documentation.viewTimeline")}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("gallery")}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-black transition",
                  viewMode === "gallery"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                {t("crm.clients.documentation.viewGallery")}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 grid gap-2 lg:grid-cols-[180px_minmax(0,1fr)]">
              <select
                value={activityType}
                onChange={(event) =>
                  handleTypeChange(event.target.value as ClientActivityType)
                }
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                <option value="note">{t("crm.clients.documentation.types.note")}</option>
                <option value="call">{t("crm.clients.documentation.types.call")}</option>
                <option value="whatsapp">
                  {t("crm.clients.documentation.types.whatsapp")}
                </option>
                <option value="task">{t("crm.clients.documentation.types.task")}</option>
                <option value="meeting">
                  {t("crm.clients.documentation.types.meeting")}
                </option>
                <option value="file">{t("crm.clients.documentation.types.file")}</option>
                <option value="agreement">
                  {t("crm.clients.documentation.types.agreement")}
                </option>
              </select>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={placeholder()}
                className="min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {t("crm.clients.documentation.occurredAt")}
                </span>
                <input
                  type="datetime-local"
                  value={occurredAt}
                  onChange={(event) => setOccurredAt(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>

              {activityType === "task" ? (
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-amber-500">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {t("crm.clients.documentation.dueAt")}
                  </span>
                  <input
                    type="datetime-local"
                    value={taskDueAt}
                    onChange={(event) => setTaskDueAt(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-amber-100 bg-amber-50/50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-amber-100"
                  />
                </label>
              ) : (
                <div className="flex items-end">
                  <p className="pb-2 text-xs font-bold text-slate-400">
                    {t("crm.clients.documentation.defaultNowHint")}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-3 rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 p-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  handleSelectFiles(files);
                }}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-violet-700 shadow-sm ring-1 ring-violet-100 transition hover:bg-violet-50"
                >
                  <Upload className="h-4 w-4" />
                  {t("crm.clients.documentation.attachFiles")}
                </button>

                {pendingFiles.length > 0 && (
                  <>
                    <span className="text-xs font-black text-violet-700">
                      {t("crm.clients.documentation.filesSelected", {
                        count: pendingFiles.length,
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={clearPendingFiles}
                      className="inline-flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-black text-slate-500 hover:bg-white"
                    >
                      <X className="h-3.5 w-3.5" />
                      {t("crm.clients.documentation.clearFiles")}
                    </button>
                  </>
                )}
              </div>

              {pendingFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pendingFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm"
                    >
                      {pendingPreviews[index] ? (
                        <img
                          src={pendingPreviews[index]}
                          alt={file.name}
                          className="h-20 w-20 object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-36 items-center gap-2 px-3">
                          <Paperclip className="h-4 w-4 text-slate-400" />
                          <span className="truncate text-xs font-bold text-slate-600">
                            {file.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="mb-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 ring-1 ring-rose-100">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void handleAddActivity()}
                disabled={
                  saving ||
                  uploading ||
                  (!text.trim() && pendingFiles.length === 0) ||
                  (needsAttachment && pendingFiles.length === 0)
                }
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6D28D9] px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(saving || uploading) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {uploading
                  ? t("crm.clients.documentation.uploading")
                  : activityType === "task"
                    ? t("crm.clients.documentation.saveTask")
                    : t("crm.clients.documentation.saveActivity")}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.filtersTitle")}
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("crm.clients.documentation.searchPlaceholder")}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pe-3 ps-10 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as "all" | ClientActivityType)
                }
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                <option value="all">{t("crm.clients.documentation.filterAllTypes")}</option>
                <option value="note">{t("crm.clients.documentation.types.note")}</option>
                <option value="call">{t("crm.clients.documentation.types.call")}</option>
                <option value="whatsapp">
                  {t("crm.clients.documentation.types.whatsapp")}
                </option>
                <option value="task">{t("crm.clients.documentation.types.task")}</option>
                <option value="meeting">
                  {t("crm.clients.documentation.types.meeting")}
                </option>
                <option value="file">{t("crm.clients.documentation.types.file")}</option>
                <option value="agreement">
                  {t("crm.clients.documentation.types.agreement")}
                </option>
              </select>

              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-violet-100"
                aria-label={t("crm.clients.documentation.dateFrom")}
              />

              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-violet-100"
                aria-label={t("crm.clients.documentation.dateTo")}
              />
            </div>
          </div>

          {viewMode === "gallery" ? (
            galleryItems.length === 0 ? (
              <EmptyDocsState
                title={t("crm.clients.documentation.emptyGalleryTitle")}
                description={t("crm.clients.documentation.emptyGalleryDescription")}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item, index) => (
                  <a
                    key={`${item.url}-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {item.isImage ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-slate-50">
                        <FileText className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="truncate text-sm font-black text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {formatDateTime(item.createdAt, locale, emDash)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )
          ) : filteredActivities.length === 0 ? (
            <EmptyDocsState
              title={t("crm.clients.documentation.emptyTitle")}
              description={t("crm.clients.documentation.emptyDescription")}
            />
          ) : (
            <div className="relative space-y-3 pe-5">
              <span className="absolute end-2 top-2 h-[calc(100%-12px)] w-px bg-gradient-to-b from-violet-300 via-slate-200 to-transparent" />

              {filteredActivities.map((activity) => {
                const isTask = activity.type === "task";
                const TypeIcon =
                  activity.type === "call"
                    ? Phone
                    : activity.type === "meeting"
                      ? UsersRound
                      : activity.type === "file"
                        ? Paperclip
                        : activity.type === "agreement"
                          ? ScrollText
                          : activity.type === "task"
                            ? CheckCircle2
                            : activity.type === "whatsapp"
                              ? StickyNote
                              : FileText;

                return (
                  <article
                    key={activity._id || activity.id}
                    className={[
                      "relative rounded-3xl border p-4 shadow-sm transition",
                      isTask
                        ? activity.taskDone
                          ? "border-emerald-100 bg-emerald-50/50"
                          : "border-amber-100 bg-amber-50/40"
                        : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    <span className="absolute -end-[21px] top-5 h-3 w-3 rounded-full bg-[#6D28D9] ring-4 ring-[#f7f8fc]" />

                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isTask && (
                          <button
                            type="button"
                            onClick={() => void handleToggleTask(activity)}
                            className={[
                              "rounded-xl border px-2.5 py-1 text-[10px] font-black transition",
                              activity.taskDone
                                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                : "border-amber-300 bg-white text-amber-700 hover:bg-amber-50",
                            ].join(" ")}
                          >
                            {activity.taskDone
                              ? t("crm.clients.documentation.reopenTask")
                              : t("crm.clients.documentation.markDone")}
                          </button>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">
                          <TypeIcon className="h-3 w-3" />
                          {typeLabel(activity.type)}
                        </span>

                        <span className="text-[11px] font-black text-slate-500">
                          {activity.createdBy || t("crm.common.systemUser")}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-slate-400">
                        {formatDateTime(
                          activity.occurredAt || activity.createdAt,
                          locale,
                          emDash
                        )}
                      </span>
                    </div>

                    {activity.text && (
                      <p
                        className={[
                          "mt-3 whitespace-pre-wrap text-sm font-semibold leading-7",
                          activity.taskDone
                            ? "text-slate-400 line-through"
                            : "text-slate-700",
                        ].join(" ")}
                      >
                        {activity.text}
                      </p>
                    )}

                    {isTask && (
                      <div className="mt-2">
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-amber-700 ring-1 ring-amber-100">
                          {t("crm.clients.documentation.dueTimeLabel", {
                            time: formatDateTime(
                              activity.taskDueAt,
                              locale,
                              emDash
                            ),
                          })}
                        </span>
                      </div>
                    )}

                    {Array.isArray(activity.attachments) &&
                      activity.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activity.attachments.map((attachment) =>
                            isImageAttachment(attachment) ? (
                              <a
                                key={`${attachment.url}-${attachment.name}`}
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                              >
                                <img
                                  src={attachment.url}
                                  alt={attachment.name || "attachment"}
                                  className="h-28 w-28 object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                key={`${attachment.url}-${attachment.name}`}
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                              >
                                {attachment.mimeType?.startsWith("image/") ? (
                                  <ImageIcon className="h-3.5 w-3.5" />
                                ) : (
                                  <Paperclip className="h-3.5 w-3.5" />
                                )}
                                {attachment.name ||
                                  t("crm.clients.documentation.attachedFile")}
                              </a>
                            )
                          )}
                        </div>
                      )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyDocsState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
      <StickyNote className="mx-auto h-12 w-12 text-slate-300" />
      <h4 className="mt-4 text-xl font-black text-slate-800">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
