import API from "@api";
import { getApiOrigin as resolveApiOrigin } from "../config/runtimeUrls";

export type CrmUploadedMedia = {
  secureUrl: string;
  publicId: string;
  mimeType?: string;
  resourceType?: string;
  originalName?: string;
};

function getApiOrigin() {
  return resolveApiOrigin();
}

async function signAndUploadDirect(
  file: File,
  businessId: string
): Promise<CrmUploadedMedia> {
  const token = localStorage.getItem("token") || "";
  const origin = getApiOrigin();

  const signResponse = await fetch(`${origin}/api/media/sign-upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ businessId }),
  });

  const signData = await signResponse.json().catch(() => null);

  if (!signResponse.ok || (!signData?.ok && !signData?.success)) {
    throw new Error(
      signData?.message || signData?.error || "יצירת חתימת העלאה נכשלה"
    );
  }

  if (
    !signData.apiKey ||
    !signData.timestamp ||
    !signData.signature ||
    !signData.uploadUrl
  ) {
    throw new Error("חסרים פרטי חתימה להעלאה");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", String(signData.apiKey));
  formData.append("timestamp", String(signData.timestamp));
  formData.append("signature", String(signData.signature));
  if (signData.folder) formData.append("folder", String(signData.folder));

  const params = signData.params || {};
  if (params.use_filename !== undefined) {
    formData.append("use_filename", String(params.use_filename));
  }
  if (params.unique_filename !== undefined) {
    formData.append("unique_filename", String(params.unique_filename));
  }
  if (params.overwrite !== undefined) {
    formData.append("overwrite", String(params.overwrite));
  }

  const cloudinaryResponse = await fetch(String(signData.uploadUrl), {
    method: "POST",
    body: formData,
  });

  const cloudinaryResult = await cloudinaryResponse.json().catch(() => null);

  if (!cloudinaryResponse.ok || !cloudinaryResult?.secure_url) {
    throw new Error(
      cloudinaryResult?.error?.message ||
        cloudinaryResult?.message ||
        "העלאה ל־Cloudinary נכשלה"
    );
  }

  const secureUrl = String(cloudinaryResult.secure_url || "");
  const publicId = String(cloudinaryResult.public_id || "");
  const resourceType = String(
    cloudinaryResult.resource_type ||
      (file.type.startsWith("image/") ? "image" : "raw")
  );

  try {
    await API.post("/media/asset", {
      businessId,
      secureUrl,
      url: secureUrl,
      publicId,
      public_id: publicId,
      resourceType,
      resource_type: resourceType,
      mediaType: file.type.startsWith("image/") ? "image" : "file",
      format: cloudinaryResult.format || "",
      bytes: file.size,
      originalName: file.name,
      mimeType: file.type,
      source: "crm-client-documentation",
    });
  } catch {
    /* catalog optional */
  }

  return {
    secureUrl,
    publicId,
    mimeType: file.type,
    resourceType,
    originalName: file.name,
  };
}

async function uploadViaServer(
  file: File,
  businessId: string
): Promise<CrmUploadedMedia> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessId", businessId);

  const { data } = await API.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });

  if (!data?.ok && !data?.secureUrl && !data?.url) {
    throw new Error(data?.message || data?.error || "העלאת הקובץ נכשלה");
  }

  return {
    secureUrl: String(data.secureUrl || data.url || ""),
    publicId: String(data.publicId || ""),
    mimeType: String(data.mimeType || file.type || ""),
    resourceType: String(
      data.resourceType || (file.type.startsWith("image/") ? "image" : "raw")
    ),
    originalName: String(data.originalName || file.name),
  };
}

/** Upload CRM documentation media with direct Cloudinary + server fallback. */
export async function uploadCrmDocumentationMedia({
  file,
  businessId,
}: {
  file: File;
  businessId: string;
}): Promise<CrmUploadedMedia> {
  try {
    return await signAndUploadDirect(file, businessId);
  } catch (directError) {
    console.warn("Direct Cloudinary upload failed, trying server upload:", directError);
    return uploadViaServer(file, businessId);
  }
}
