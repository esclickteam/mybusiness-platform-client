import React, { useEffect, useState } from "react";
import API from "../../../../api";
import type { PublicWhatsAppMessage } from "./whatsAppWebMessages";
import { formatFileSize, isPdfDocument } from "./whatsappMedia";

type Props = {
  message: PublicWhatsAppMessage;
  customerId?: string | null;
  threadId?: string | null;
};

function mediaRequestPath(
  message: PublicWhatsAppMessage,
  customerId?: string | null,
  threadId?: string | null,
  download = false
) {
  const params = new URLSearchParams();
  if (customerId) params.set("customerId", customerId);
  if (threadId) params.set("threadId", threadId);
  if (download) params.set("download", "1");
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return `${message.mediaPath}${suffix}`;
}

async function fetchAuthedMediaBlob(
  message: PublicWhatsAppMessage,
  customerId?: string | null,
  threadId?: string | null,
  download = false
) {
  const res = await API.get(mediaRequestPath(message, customerId, threadId, download), {
    responseType: "blob",
    timeout: 120000,
    headers: { Accept: "*/*" },
  });
  const contentType = String(res.headers?.["content-type"] || "");
  if (contentType.includes("application/json")) {
    throw new Error("תגובת מדיה לא תקינה");
  }
  const mime =
    message.mimeType ||
    contentType.split(";")[0] ||
    "application/octet-stream";
  return res.data instanceof Blob
    ? res.data.type
      ? res.data
      : new Blob([res.data], { type: mime })
    : new Blob([res.data], { type: mime });
}

function triggerBlobDownload(blob: Blob, filename?: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || "file";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
}

function openBlobInNewTab(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);
  const opened = window.open(objectUrl, "_blank");
  if (!opened) {
    triggerBlobDownload(blob);
  }
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

function useAuthedMediaUrl(
  message: PublicWhatsAppMessage,
  customerId?: string | null,
  threadId?: string | null
) {
  const [url, setUrl] = useState(message.localPreviewUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const type = String(message.messageType || "text");
  const prefetch = type === "image" || type === "video" || type === "audio" || type === "sticker";

  useEffect(() => {
    if (message.localPreviewUrl && message.pending) {
      setUrl(message.localPreviewUrl);
      setLoading(false);
      setError("");
      return undefined;
    }

    if (!prefetch || !message.hasMedia || !message.mediaPath) {
      if (!message.localPreviewUrl) setUrl("");
      return undefined;
    }

    let active = true;
    let objectUrl = "";
    setLoading(true);
    setError("");

    fetchAuthedMediaBlob(message, customerId, threadId)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch((err) => {
        if (!active) return;
        if (message.localPreviewUrl) {
          setUrl(message.localPreviewUrl);
          setError("");
          return;
        }
        const status = err?.response?.status;
        const apiError = err?.response?.data?.error;
        setError(
          apiError
            ? String(apiError)
            : status
              ? `לא ניתן לטעון מדיה (${status})`
              : "לא ניתן לטעון מדיה"
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    message.id,
    message.mediaPath,
    message.hasMedia,
    message.localPreviewUrl,
    message.pending,
    message.messageType,
    customerId,
    threadId,
    prefetch,
  ]);

  return { url, loading, error };
}

function DocumentCard({
  filename,
  mimeType,
  size,
  busy,
  error,
  onOpen,
  onDownload,
}: {
  filename?: string;
  mimeType?: string;
  size?: number;
  busy?: boolean;
  error?: string;
  onOpen?: () => void;
  onDownload?: () => void;
}) {
  const pdf = isPdfDocument(mimeType, filename);
  return (
    <div className="min-w-[180px] space-y-2">
      <button
        type="button"
        onClick={onOpen}
        disabled={busy}
        className="flex w-full items-center gap-3 rounded-lg border border-black/5 bg-white/70 px-3 py-2 text-start hover:bg-white disabled:opacity-60"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f0f2f5] text-lg">
          📄
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-[#111b21]">
            {filename || "מסמך"}
          </span>
          <span className="block text-[11px] text-[#667781]">
            {[mimeType?.split("/").pop()?.toUpperCase(), formatFileSize(size || 0), busy ? "טוען…" : pdf ? "לחץ לפתיחה" : "לחץ להורדה"]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          disabled={busy}
          className="rounded-md bg-[#00a884] px-2 py-1 text-[11px] font-bold text-white disabled:opacity-60"
        >
          {pdf ? "פתח" : "הורד"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-[#111b21] ring-1 ring-black/10 disabled:opacity-60"
        >
          הורדה
        </button>
      </div>
      {error ? <p className="text-[11px] text-rose-700">{error}</p> : null}
    </div>
  );
}

export function WhatsAppMediaBubble({ message, customerId, threadId }: Props) {
  const type = String(message.messageType || "text");
  const { url, loading, error } = useAuthedMediaUrl(message, customerId, threadId);
  const [lightbox, setLightbox] = useState(false);
  const [docBusy, setDocBusy] = useState(false);
  const [docError, setDocError] = useState("");

  const isDocument =
    type === "document" ||
    Boolean(message.filename && type !== "image" && type !== "video" && type !== "audio" && type !== "sticker");

  async function loadDocument(download: boolean) {
    if (!message.mediaPath) {
      setDocError("לא נשמר מזהה קובץ — יש לבקש מהלקוח לשלוח שוב");
      return null;
    }
    setDocBusy(true);
    setDocError("");
    try {
      return await fetchAuthedMediaBlob(message, customerId, threadId, download);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const apiError = err?.response?.data?.error;
      const message = String(err?.message || "");
      const usefulMessage =
        apiError && typeof apiError === "string"
          ? apiError
          : message && message !== "{}" && !/^API Error/i.test(message)
            ? message
            : "";
      setDocError(
        usefulMessage ||
          (status === 410
            ? "WhatsApp כבר לא מחזיק את הקובץ — יש לבקש מהלקוח לשלוח אותו שוב"
            : "לא ניתן לפתוח את הקובץ")
      );
      return null;
    } finally {
      setDocBusy(false);
    }
  }

  async function openDocument() {
    const blob = await loadDocument(false);
    if (!blob) return;
    if (isPdfDocument(message.mimeType || blob.type, message.filename)) {
      const pdfBlob =
        blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
      openBlobInNewTab(pdfBlob);
      return;
    }
    triggerBlobDownload(blob, message.filename);
  }

  async function downloadDocument() {
    const blob = await loadDocument(true);
    if (!blob) return;
    triggerBlobDownload(blob, message.filename);
  }

  if (isDocument) {
    return (
      <DocumentCard
        filename={message.filename}
        mimeType={message.mimeType}
        size={message.mediaSize}
        busy={docBusy}
        error={docError}
        onOpen={openDocument}
        onDownload={downloadDocument}
      />
    );
  }

  if (type === "text" || !message.hasMedia) return null;

  if (loading && !url) {
    return <p className="text-[12px] text-[#667781]">טוען מדיה…</p>;
  }
  if (error && !url) {
    return <p className="text-[12px] text-rose-700">{error}</p>;
  }

  if (type === "image" || type === "sticker") {
    return (
      <>
        <button type="button" className="block max-w-full" onClick={() => setLightbox(true)}>
          <img
            src={url}
            alt={message.caption || message.filename || "תמונה"}
            className="max-h-72 max-w-full rounded-md object-cover"
          />
        </button>
        {lightbox ? (
          <div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4"
            onClick={() => setLightbox(false)}
          >
            <img
              src={url}
              alt={message.caption || message.filename || "תמונה"}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
            />
          </div>
        ) : null}
      </>
    );
  }

  if (type === "video") {
    return (
      <video src={url} controls className="max-h-72 max-w-full rounded-md bg-black/5" preload="metadata">
        <track kind="captions" />
      </video>
    );
  }

  if (type === "audio") {
    return <audio src={url} controls className="w-full min-w-[220px]" preload="metadata" />;
  }

  return (
    <DocumentCard
      filename={message.filename}
      mimeType={message.mimeType}
      size={message.mediaSize}
      busy={docBusy}
      error={docError}
      onOpen={openDocument}
      onDownload={downloadDocument}
    />
  );
}

export function WhatsAppMessageBody({
  message,
  customerId,
  threadId,
}: {
  message: PublicWhatsAppMessage;
  customerId?: string | null;
  threadId?: string | null;
}) {
  const type = String(message.messageType || "text");
  const isMedia =
    message.hasMedia ||
    type === "document" ||
    type === "image" ||
    type === "video" ||
    type === "audio" ||
    type === "sticker";
  const text =
    message.caption ||
    (type === "text" ? message.bodyPreview : "") ||
    "";

  return (
    <div className="space-y-1">
      {isMedia ? (
        <WhatsAppMediaBubble message={message} customerId={customerId} threadId={threadId} />
      ) : null}
      {text ? (
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{text}</p>
      ) : null}
      {!text && !isMedia ? (
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {message.bodyPreview || "—"}
        </p>
      ) : null}
    </div>
  );
}
