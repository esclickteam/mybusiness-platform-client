import React, { useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Phone,
  ScrollText,
  StickyNote,
  Upload,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "@api";
import { uploadMediaToCloudinary } from "../../../../components/site-builder/studio/utils/uploadMediaToCloudinary";

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

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toDatetimeLocalValue(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function formatDateTime(value: string | null | undefined, locale: string, fallback: string) {
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
  return mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);
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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aTime = new Date(a.occurredAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.occurredAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [activities]);

  const needsAttachment =
    activityType === "file" || activityType === "agreement";
  const showOccurredAt =
    activityType === "meeting" ||
    activityType === "note" ||
    activityType === "call" ||
    activityType === "whatsapp" ||
    activityType === "file" ||
    activityType === "agreement";

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

  const resetComposerDates = () => {
    const now = toDatetimeLocalValue();
    setOccurredAt(now);
    setTaskDueAt(now);
  };

  const handleTypeChange = (next: ClientActivityType) => {
    setActivityType(next);
    resetComposerDates();
    setError("");
    if (next !== "file" && next !== "agreement") {
      setPendingFiles([]);
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

    setSaving(true);
    setError("");

    try {
      let attachments: ClientActivityAttachment[] = [];

      if (pendingFiles.length > 0) {
        setUploading(true);
        attachments = await Promise.all(
          pendingFiles.map(async (file) => {
            const uploaded = await uploadMediaToCloudinary({
              file,
              businessId,
              source: "crm-client-documentation",
            });

            return {
              url: uploaded.secureUrl,
              name: file.name,
              mimeType: file.type || "",
              publicId: uploaded.publicId,
              resourceType: file.type.startsWith("image/") ? "image" : "raw",
            };
          })
        );
        setUploading(false);
      }

      const { data } = await API.post<{
        success?: boolean;
        activity?: ClientActivity;
        client?: { activities?: ClientActivity[] };
      }>(`/crm-clients/${clientId}/activities`, {
        type: activityType,
        text: trimmed,
        occurredAt: new Date(occurredAt || Date.now()).toISOString(),
        taskDueAt:
          activityType === "task"
            ? new Date(taskDueAt || Date.now()).toISOString()
            : null,
        attachments,
      });

      if (Array.isArray(data?.client?.activities)) {
        onActivitiesChange(data.client.activities);
      } else if (data?.activity) {
        onActivitiesChange([data.activity, ...activities]);
      }

      setText("");
      setPendingFiles([]);
      resetComposerDates();
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    <section className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800">
            {t("crm.clients.documentation.title")}
          </h3>
          <p className="text-sm font-bold text-slate-500">
            {t("crm.clients.documentation.subtitle")}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
          <select
            value={activityType}
            onChange={(event) =>
              handleTypeChange(event.target.value as ClientActivityType)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-violet-100"
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
            className="min-h-[96px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {showOccurredAt && (
          <div className="mb-3 grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex h-11 items-center gap-2 rounded-xl bg-violet-50 px-3 text-xs font-black text-violet-700 ring-1 ring-violet-100">
              <CalendarClock className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.occurredAt")}
            </div>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(event) => setOccurredAt(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-100"
            />
          </div>
        )}

        {activityType === "task" && (
          <div className="mb-3 grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex h-11 items-center gap-2 rounded-xl bg-amber-50 px-3 text-xs font-black text-amber-700 ring-1 ring-amber-100">
              <CalendarClock className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.dueAt")}
            </div>
            <input
              type="datetime-local"
              value={taskDueAt}
              onChange={(event) => setTaskDueAt(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-100"
            />
          </div>
        )}

        {(needsAttachment ||
          activityType === "meeting" ||
          activityType === "note") && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                setPendingFiles(files);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {t("crm.clients.documentation.attachFiles")}
            </button>
            {pendingFiles.length > 0 && (
              <span className="text-xs font-bold text-slate-500">
                {t("crm.clients.documentation.filesSelected", {
                  count: pendingFiles.length,
                })}
              </span>
            )}
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
            onClick={handleAddActivity}
            disabled={
              saving ||
              uploading ||
              (!text.trim() && pendingFiles.length === 0) ||
              (needsAttachment && pendingFiles.length === 0)
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#6D28D9] px-4 text-xs font-black text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
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

      {sortedActivities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <StickyNote className="mx-auto h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-xl font-black text-slate-800">
            {t("crm.clients.documentation.emptyTitle")}
          </h4>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {t("crm.clients.documentation.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="relative space-y-2.5 pr-5">
          <span className="absolute right-2 top-2 h-[calc(100%-12px)] w-px bg-slate-200" />

          {sortedActivities.map((activity) => {
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
                    "absolute -right-[23px] top-3.5 h-3 w-3 rounded-full ring-4 ring-white",
                    isTask
                      ? activity.taskDone
                        ? "bg-sky-500"
                        : "bg-blue-500"
                      : "bg-violet-500",
                  ].join(" ")}
                />

                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isTask && (
                      <button
                        type="button"
                        onClick={() => handleToggleTask(activity)}
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
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-black">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-amber-700 ring-1 ring-amber-100">
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
                            className="block overflow-hidden rounded-xl border border-slate-200 bg-white"
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.name || "attachment"}
                              className="h-24 w-24 object-cover"
                            />
                          </a>
                        ) : (
                          <a
                            key={`${attachment.url}-${attachment.name}`}
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
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
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
