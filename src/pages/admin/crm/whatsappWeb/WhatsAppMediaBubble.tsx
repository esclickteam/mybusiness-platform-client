import React, { useEffect, useState } from "react";
import API from "../../../../api";
import type { PublicWhatsAppMessage } from "./whatsAppWebMessages";
import { formatFileSize } from "./whatsappMedia";

type Props = {
  message: PublicWhatsAppMessage;
  customerId?: string | null;
  threadId?: string | null;
};

function useAuthedMediaUrl(message: PublicWhatsAppMessage, customerId?: string | null, threadId?: string | null) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!message.hasMedia || !message.mediaPath) {
      setUrl("");
      return undefined;
    }

    let active = true;
    let objectUrl = "";
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (customerId) params.set("customerId", customerId);
    if (threadId) params.set("threadId", threadId);
    const suffix = params.toString() ? `?${params.toString()}` : "";

    API.get(`${message.mediaPath}${suffix}`, {
      responseType: "blob",
      maxRedirects: 5,
    })
      .then((res) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(res.data);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!active) return;
        setError("לא ניתן לטעון מדיה");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [message.id, message.mediaPath, message.hasMedia, customerId, threadId]);

  return { url, loading, error };
}

function DocumentCard({
  filename,
  mimeType,
  size,
  onOpen,
}: {
  filename?: string;
  mimeType?: string;
  size?: number;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full min-w-[180px] items-center gap-3 rounded-lg border border-black/5 bg-white/70 px-3 py-2 text-start"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f0f2f5] text-lg">
        📄
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[#111b21]">
          {filename || "מסמך"}
        </span>
        <span className="block text-[11px] text-[#667781]">
          {[mimeType?.split("/").pop()?.toUpperCase(), formatFileSize(size || 0)]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
    </button>
  );
}

export function WhatsAppMediaBubble({ message, customerId, threadId }: Props) {
  const type = String(message.messageType || "text");
  const { url, loading, error } = useAuthedMediaUrl(message, customerId, threadId);
  const [lightbox, setLightbox] = useState(false);

  if (type === "text" || !message.hasMedia) return null;

  if (loading) {
    return <p className="text-[12px] text-[#667781]">טוען מדיה…</p>;
  }
  if (error) {
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
      onOpen={() => {
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
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
  const text =
    message.caption ||
    (type === "text" ? message.bodyPreview : "") ||
    "";

  return (
    <div className="space-y-1">
      {message.hasMedia ? (
        <WhatsAppMediaBubble message={message} customerId={customerId} threadId={threadId} />
      ) : null}
      {text ? (
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{text}</p>
      ) : null}
      {!text && !message.hasMedia ? (
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {message.bodyPreview || "—"}
        </p>
      ) : null}
    </div>
  );
}
