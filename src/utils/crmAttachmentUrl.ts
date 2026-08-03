import API from "@api";

export type CrmAttachmentLike = {
  url?: string;
  name?: string;
  mimeType?: string;
  publicId?: string;
  resourceType?: string;
};

export function isDocumentAttachment(attachment: CrmAttachmentLike) {
  const mime = String(attachment.mimeType || "").toLowerCase();
  const url = String(attachment.url || "").toLowerCase();
  const name = String(attachment.name || "").toLowerCase();
  return (
    mime.includes("pdf") ||
    mime.includes("officedocument") ||
    mime.includes("msword") ||
    mime.includes("excel") ||
    mime.includes("powerpoint") ||
    mime.includes("text/") ||
    mime.includes("csv") ||
    /\.(pdf|docx?|xlsx?|pptx?|txt|csv)(\?|$)/i.test(url) ||
    /\.(pdf|docx?|xlsx?|pptx?|txt|csv)$/i.test(name)
  );
}

export function isImageAttachment(attachment: CrmAttachmentLike) {
  if (isDocumentAttachment(attachment)) return false;
  const mime = String(attachment.mimeType || "").toLowerCase();
  const url = String(attachment.url || "").toLowerCase();
  const resource = String(attachment.resourceType || "").toLowerCase();
  return (
    resource === "image" ||
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url)
  );
}

export function parseCloudinaryDeliveryUrl(url: string): {
  resourceType: string;
  publicId: string;
  format: string;
} | null {
  const raw = String(url || "").trim();
  if (!raw) return null;

  const match = raw.match(
    /res\.cloudinary\.com\/[^/]+\/(image|raw|video|auto)\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+)$/i
  );
  if (!match) return null;

  const resourceType = String(match[1] || "image").toLowerCase();
  let path = decodeURIComponent(String(match[2] || "").split("?")[0] || "");
  path = path.replace(/^\/+/, "");

  const lastDot = path.lastIndexOf(".");
  const lastSlash = path.lastIndexOf("/");
  let format = "";
  let publicId = path;

  if (lastDot > lastSlash) {
    format = path.slice(lastDot + 1).toLowerCase();
    publicId = path.slice(0, lastDot);
  }

  // Repair copies were stored as <original>_rawdoc.pdf
  publicId = publicId.replace(/_rawdoc$/i, "");

  if (!publicId) return null;
  return { resourceType, publicId, format };
}

/** Open CRM attachments; PDFs are streamed via API because Cloudinary delivery returns 401. */
export async function openCrmAttachment(attachment: CrmAttachmentLike) {
  const direct = String(attachment.url || "").trim();
  if (!direct) throw new Error("חסר קישור לקובץ");

  if (isImageAttachment(attachment)) {
    window.open(direct, "_blank", "noopener,noreferrer");
    return;
  }

  const parsed = parseCloudinaryDeliveryUrl(direct);
  const publicId = String(attachment.publicId || parsed?.publicId || "")
    .trim()
    .replace(/_rawdoc$/i, "");

  if (!publicId) {
    window.open(direct, "_blank", "noopener,noreferrer");
    return;
  }

  const format =
    parsed?.format ||
    String(attachment.name || "").match(/\.([a-z0-9]+)$/i)?.[1] ||
    "pdf";

  // Prefer the original image-stored PDF; server also tries raw variants.
  const resourceType = String(
    attachment.resourceType || parsed?.resourceType || "image"
  ).toLowerCase();

  const response = await API.get<Blob>("/media/file", {
    params: {
      publicId,
      resourceType: resourceType === "raw" ? "image" : resourceType || "image",
      format,
      filename: attachment.name || undefined,
    },
    responseType: "blob",
  });

  const contentType =
    String(response.headers?.["content-type"] || "").split(";")[0] ||
    attachment.mimeType ||
    "application/pdf";

  // API error payloads can arrive as JSON blobs when responseType=blob.
  if (contentType.includes("application/json")) {
    const text = await response.data.text();
    let message = "פתיחת הקובץ נכשלה";
    try {
      message = JSON.parse(text)?.message || message;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }

  const blob = new Blob([response.data], { type: contentType });
  const objectUrl = URL.createObjectURL(blob);
  const opened = window.open(objectUrl, "_blank", "noopener,noreferrer");

  // Revoke after the tab has a chance to load the blob.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);

  if (!opened) {
    // Popup blocked — fall back to download navigation in same tab context.
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = attachment.name || `document.${format}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}
