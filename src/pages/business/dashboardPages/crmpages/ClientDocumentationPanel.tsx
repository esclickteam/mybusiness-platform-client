import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Phone,
  Route,
  Search,
  ScrollText,
  StickyNote,
  Upload,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "@api";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import {
  isImageAttachment,
  openCrmAttachment,
} from "../../../../utils/crmAttachmentUrl";
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
  clientName?: string;
  activities?: ClientActivity[];
  onActivitiesChange: (activities: ClientActivity[]) => void;
};

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

function activityDayKey(activity: ClientActivity) {
  const raw = activity.occurredAt || activity.createdAt;
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return toDateInputValue(date);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ClientDocumentationPanel({
  clientId,
  businessId,
  clientName,
  activities = [],
  onActivitiesChange,
}: ClientDocumentationPanelProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
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
  const [journeyOpen, setJourneyOpen] = useState(false);

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aTime = new Date(a.occurredAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.occurredAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [activities]);

  const todayActivities = useMemo(() => {
    const today = new Date();
    return sortedActivities.filter((activity) => {
      const raw = activity.occurredAt || activity.createdAt;
      if (!raw) return false;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return false;
      return isSameDay(date, today);
    });
  }, [sortedActivities]);

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
    pendingPreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setPendingFiles([]);
    setPendingPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetComposerDates = () => {
    const now = toDatetimeLocalValue();
    setOccurredAt(now);
    setTaskDueAt(now);
  };

  const handleSelectFiles = (files: File[]) => {
    pendingPreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setPendingFiles(files);
    setPendingPreviews(
      files.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      )
    );
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
        activityType === "note" && attachments.length > 0 && !trimmed
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

  useEffect(() => {
    if (!journeyOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [journeyOpen]);

  return (
    <div className="space-y-3" dir={dir}>
      <button
        type="button"
        onClick={() => setJourneyOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-gradient-to-br from-[#6D28D9] to-[#2563EB] p-4 text-start text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] transition hover:brightness-105"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/80">
            {t("crm.clients.documentation.journeyBadge")}
          </p>
          <h3 className="mt-1 truncate text-lg font-black">
            {t("crm.clients.documentation.openFullJourney")}
          </h3>
          <p className="mt-1 text-xs font-bold text-white/80">
            {t("crm.clients.documentation.journeyCount", {
              count: sortedActivities.length,
            })}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <Route className="h-5 w-5" />
        </span>
      </button>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="mb-4">
          <h3 className="text-base font-black text-slate-800">
            {t("crm.clients.documentation.title")}
          </h3>
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            {t("crm.clients.documentation.subtitle")}
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)]">
            <select
              value={activityType}
              onChange={(event) => {
                setActivityType(event.target.value as ClientActivityType);
                resetComposerDates();
                setError("");
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
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
              className="min-h-[80px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div className="flex h-10 items-center rounded-xl bg-sky-50 px-3 text-xs font-black text-sky-700 ring-1 ring-sky-100">
              <CalendarClock className="me-1.5 h-3.5 w-3.5" />
              {t("crm.clients.documentation.occurredAt")}
            </div>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(event) => setOccurredAt(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {activityType === "task" && (
            <div className="mb-3 grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div className="flex h-10 items-center rounded-xl bg-amber-50 px-3 text-xs font-black text-amber-700 ring-1 ring-amber-100">
                {t("crm.clients.documentation.dueAt")}
              </div>
              <input
                type="datetime-local"
                value={taskDueAt}
                onChange={(event) => setTaskDueAt(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
              />
            </div>
          )}

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              className="hidden"
              onChange={(event) => {
                handleSelectFiles(Array.from(event.target.files || []));
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.attachFiles")}
            </button>
            {pendingFiles.length > 0 && (
              <>
                <span className="text-xs font-bold text-slate-500">
                  {t("crm.clients.documentation.filesSelected", {
                    count: pendingFiles.length,
                  })}
                </span>
                <button
                  type="button"
                  onClick={clearPendingFiles}
                  className="text-xs font-black text-slate-400 hover:text-slate-600"
                >
                  {t("crm.clients.documentation.clearFiles")}
                </button>
              </>
            )}
          </div>

          {pendingFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {pendingFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {pendingPreviews[index] ? (
                    <img
                      src={pendingPreviews[index]}
                      alt={file.name}
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-32 items-center gap-2 px-2">
                      <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate text-[11px] font-bold text-slate-600">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="mb-3 text-xs font-black text-rose-600">{error}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-slate-400">
              {t("crm.clients.documentation.defaultNowHint")}
            </p>
            <button
              type="button"
              onClick={() => void handleAddActivity()}
              disabled={
                saving ||
                uploading ||
                (!text.trim() && pendingFiles.length === 0) ||
                (needsAttachment && pendingFiles.length === 0)
              }
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-sky-200/80 bg-gradient-to-l from-sky-100 via-cyan-100 to-white px-4 text-xs font-black text-black transition hover:from-sky-200/80 hover:via-cyan-100 hover:to-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(saving || uploading) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {uploading
                ? t("crm.clients.documentation.uploading")
                : activityType === "task"
                  ? t("crm.clients.documentation.saveTask")
                  : t("crm.clients.documentation.saveActivity")}
            </button>
          </div>
        </div>

      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-black text-slate-800">
              {t("crm.clients.documentation.todayTitle")}
            </h4>
            <p className="mt-0.5 text-[11px] font-bold text-slate-400">
              {t("crm.clients.documentation.todaySubtitle")}
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-black text-sky-700 ring-1 ring-sky-100">
            {t("crm.clients.documentation.todayCount", {
              count: todayActivities.length,
            })}
          </span>
        </div>

        {todayActivities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-bold text-slate-400">
              {t("crm.clients.documentation.todayEmpty")}
            </p>
            <button
              type="button"
              onClick={() => setJourneyOpen(true)}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#6D28D9] px-3 text-xs font-black text-white transition hover:bg-[#5B21B6]"
            >
              <Route className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.openFullJourney")}
            </button>
          </div>
        ) : (
          <ActivityTimeline
            activities={todayActivities}
            locale={locale}
            emDash={emDash}
            typeLabel={typeLabel}
            onToggleTask={handleToggleTask}
          />
        )}
      </section>

      {journeyOpen && (
        <ClientJourneyModal
          clientName={clientName}
          activities={sortedActivities}
          locale={locale}
          emDash={emDash}
          typeLabel={typeLabel}
          onClose={() => setJourneyOpen(false)}
          onToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
}

function ClientJourneyModal({
  clientName,
  activities,
  locale,
  emDash,
  typeLabel,
  onClose,
  onToggleTask,
}: {
  clientName?: string;
  activities: ClientActivity[];
  locale: string;
  emDash: string;
  typeLabel: (type?: ClientActivityType) => string;
  onClose: () => void;
  onToggleTask: (activity: ClientActivity) => void;
}) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ClientActivityType>(
    "all"
  );

  const hasFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    typeFilter !== "all";

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return activities.filter((activity) => {
      if (typeFilter !== "all" && activity.type !== typeFilter) return false;

      const day = activityDayKey(activity);
      if (dateFrom && (!day || day < dateFrom)) return false;
      if (dateTo && (!day || day > dateTo)) return false;

      if (!query) return true;

      const haystack = [
        activity.text,
        activity.createdBy,
        activity.type,
        typeLabel(activity.type),
        ...(activity.attachments || []).map((item) => item.name || ""),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activities, searchQuery, dateFrom, dateTo, typeFilter, typeLabel]);

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setTypeFilter("all");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#F4F5F8]"
      dir={dir}
    >
      <section className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-[#F4F5F8]">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 text-lg font-black leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label={t("crm.common.close")}
            >
              ×
            </button>

            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-100 text-sm font-black text-[#6D28D9] shadow-sm">
              <Route className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-700">
                {t("crm.clients.documentation.journeyBadge")}
              </p>
              <h2 className="truncate text-xl font-black text-slate-800 sm:text-2xl">
                {clientName || t("crm.clients.documentation.journeyTitle")}
              </h2>
              <p className="mt-0.5 truncate text-[11px] font-bold text-slate-500">
                {t("crm.clients.documentation.journeyTitle")}
                {" · "}
                {t("crm.clients.documentation.journeyCount", {
                  count: filtered.length,
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
          >
            {t("crm.clients.documentation.closeJourney")}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto max-w-[980px] space-y-3 p-3 sm:p-4">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-black text-slate-800">
                    {t("crm.clients.documentation.filtersTitle")}
                  </h3>
                </div>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-black text-slate-400 transition hover:text-slate-700"
                  >
                    {t("crm.clients.documentation.clearFilters")}
                  </button>
                )}
              </div>

              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                <label className="relative block md:col-span-2 xl:col-span-1">
                  <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t(
                      "crm.clients.documentation.searchPlaceholder"
                    )}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pe-3 ps-9 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value as "all" | ClientActivityType
                    )
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="all">
                    {t("crm.clients.documentation.filterAllTypes")}
                  </option>
                  <option value="note">
                    {t("crm.clients.documentation.types.note")}
                  </option>
                  <option value="call">
                    {t("crm.clients.documentation.types.call")}
                  </option>
                  <option value="whatsapp">
                    {t("crm.clients.documentation.types.whatsapp")}
                  </option>
                  <option value="task">
                    {t("crm.clients.documentation.types.task")}
                  </option>
                  <option value="meeting">
                    {t("crm.clients.documentation.types.meeting")}
                  </option>
                  <option value="file">
                    {t("crm.clients.documentation.types.file")}
                  </option>
                  <option value="agreement">
                    {t("crm.clients.documentation.types.agreement")}
                  </option>
                </select>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-black text-slate-400">
                    {t("crm.clients.documentation.dateFrom")}
                  </span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-black text-slate-400">
                    {t("crm.clients.documentation.dateTo")}
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-bold text-slate-400">
                    {hasFilters
                      ? t("crm.clients.documentation.noMatch")
                      : t("crm.clients.documentation.journeyEmpty")}
                  </p>
                </div>
              ) : (
                <ActivityTimeline
                  activities={filtered}
                  locale={locale}
                  emDash={emDash}
                  typeLabel={typeLabel}
                  onToggleTask={onToggleTask}
                />
              )}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityTimeline({
  activities,
  locale,
  emDash,
  typeLabel,
  onToggleTask,
}: {
  activities: ClientActivity[];
  locale: string;
  emDash: string;
  typeLabel: (type?: ClientActivityType) => string;
  onToggleTask: (activity: ClientActivity) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative space-y-2.5 pe-5">
      <span className="absolute end-2 top-2 h-[calc(100%-12px)] w-px bg-slate-200" />

      {activities.map((activity) => {
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
          <div
            key={activity._id || activity.id}
            className={[
              "relative rounded-xl border p-3 transition",
              isTask
                ? activity.taskDone
                  ? "border-sky-200 bg-sky-50/60"
                  : "border-blue-200 bg-blue-50/60"
                : "border-slate-200 bg-slate-50",
            ].join(" ")}
          >
            <span
              className={[
                "absolute -end-[23px] top-3.5 h-3 w-3 rounded-full ring-4 ring-white",
                isTask
                  ? activity.taskDone
                    ? "bg-sky-500"
                    : "bg-blue-500"
                  : "bg-sky-500",
              ].join(" ")}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {isTask && (
                  <button
                    type="button"
                    onClick={() => onToggleTask(activity)}
                    className={[
                      "rounded-lg border px-2 py-0.5 text-[10px] font-black transition",
                      activity.taskDone
                        ? "border-sky-400 bg-sky-100 text-sky-700"
                        : "border-blue-300 bg-white text-blue-700 hover:bg-blue-50",
                    ].join(" ")}
                  >
                    {activity.taskDone
                      ? t("crm.clients.documentation.reopenTask")
                      : t("crm.clients.documentation.markDone")}
                  </button>
                )}

                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">
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
                  "mt-2 whitespace-pre-wrap text-sm font-semibold leading-6",
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
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-amber-700 ring-1 ring-amber-100">
                  {t("crm.clients.documentation.dueTimeLabel", {
                    time: formatDateTime(activity.taskDueAt, locale, emDash),
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
                        className="block overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <img
                          src={attachment.url}
                          alt={attachment.name || "attachment"}
                          className="h-24 w-24 object-cover"
                        />
                      </a>
                    ) : (
                      <button
                        key={`${attachment.url}-${attachment.name}`}
                        type="button"
                        onClick={() => {
                          openCrmAttachment(attachment).catch((err) => {
                            console.error("Open attachment failed:", err);
                            if (attachment.url) {
                              window.open(
                                attachment.url,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                      >
                        {attachment.mimeType?.startsWith("image/") ? (
                          <ImageIcon className="h-3.5 w-3.5" />
                        ) : (
                          <Paperclip className="h-3.5 w-3.5" />
                        )}
                        {attachment.name ||
                          t("crm.clients.documentation.attachedFile")}
                      </button>
                    )
                  )}
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}
