export const WHATSAPP_MEDIA_LIMITS = {
  image: { maxBytes: 5 * 1024 * 1024, accept: "image/jpeg,image/png" },
  video: { maxBytes: 16 * 1024 * 1024, accept: "video/mp4,video/3gpp" },
  audio: {
    maxBytes: 16 * 1024 * 1024,
    accept: "audio/aac,audio/mp4,audio/mpeg,audio/amr,audio/ogg",
  },
  document: {
    maxBytes: 100 * 1024 * 1024,
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain",
  },
} as const;

export const WHATSAPP_FILE_ACCEPT = Object.values(WHATSAPP_MEDIA_LIMITS)
  .map((row) => row.accept)
  .join(",");

export type StagedWhatsAppFile = {
  file: File;
  previewUrl: string;
  messageType: "image" | "video" | "document" | "audio";
  mimeType: string;
  filename: string;
  size: number;
};

export function inferMessageTypeFromFile(file: File): StagedWhatsAppFile["messageType"] | null {
  const mime = String(file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    mime === "application/pdf" ||
    mime.startsWith("application/vnd.") ||
    mime === "application/msword" ||
    mime === "text/plain"
  ) {
    return "document";
  }
  return null;
}

export function validateWhatsAppFile(file: File): string | null {
  const messageType = inferMessageTypeFromFile(file);
  if (!messageType) {
    return "סוג הקובץ אינו נתמך ב-WhatsApp";
  }
  const rules = WHATSAPP_MEDIA_LIMITS[messageType];
  if (file.size > rules.maxBytes) {
    return `הקובץ גדול מדי (מקסימום ${Math.round(rules.maxBytes / (1024 * 1024))}MB)`;
  }
  const allowed = rules.accept.split(",").map((v) => v.trim().toLowerCase());
  if (!allowed.includes(String(file.type || "").toLowerCase())) {
    return "פורמט הקובץ אינו נתמך ב-WhatsApp";
  }
  return null;
}

export function formatFileSize(bytes = 0) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function supportsCaption(messageType?: string | null) {
  return messageType === "image" || messageType === "video" || messageType === "document";
}
