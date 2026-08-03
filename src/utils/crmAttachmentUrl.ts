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

  if (!publicId) return null;
  return { resourceType, publicId, format };
}

function preferredResourceType(attachment: CrmAttachmentLike) {
  const explicit = String(attachment.resourceType || "").toLowerCase();
  if (explicit === "raw" || explicit === "image" || explicit === "video") {
    return explicit;
  }
  if (isDocumentAttachment(attachment)) return "raw";
  if (isImageAttachment(attachment)) return "image";
  return "raw";
}

/** Resolve a short-lived openable URL for CRM attachments (esp. PDFs). */
export async function resolveCrmAttachmentOpenUrl(
  attachment: CrmAttachmentLike
): Promise<string> {
  const direct = String(attachment.url || "").trim();
  if (!direct) throw new Error("חסר קישור לקובץ");

  if (isImageAttachment(attachment)) {
    return direct;
  }

  const parsed = parseCloudinaryDeliveryUrl(direct);
  const publicId = String(attachment.publicId || parsed?.publicId || "").trim();
  if (!publicId) return direct;

  const resourceType = preferredResourceType({
    ...attachment,
    resourceType: attachment.resourceType || parsed?.resourceType,
  });

  const format =
    parsed?.format ||
    String(attachment.name || "").match(/\.([a-z0-9]+)$/i)?.[1] ||
    "";

  // Existing PDFs were often stored as image/* and blocked by Cloudinary ACL.
  // Ask the server for a signed/private URL, trying image first when URL says so.
  const resourceCandidates = Array.from(
    new Set(
      [
        parsed?.resourceType,
        resourceType,
        isDocumentAttachment(attachment) ? "image" : "",
        "raw",
      ].filter(Boolean)
    )
  );

  let lastError: unknown = null;
  for (const candidate of resourceCandidates) {
    try {
      const { data } = await API.get<{
        ok?: boolean;
        url?: string;
        message?: string;
      }>("/media/file-url", {
        params: {
          publicId,
          resourceType: candidate,
          format,
          filename: attachment.name || undefined,
        },
      });
      if (data?.url) return String(data.url);
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) throw lastError;
  return direct;
}

export async function openCrmAttachment(attachment: CrmAttachmentLike) {
  const url = await resolveCrmAttachmentOpenUrl(attachment);
  window.open(url, "_blank", "noopener,noreferrer");
}
