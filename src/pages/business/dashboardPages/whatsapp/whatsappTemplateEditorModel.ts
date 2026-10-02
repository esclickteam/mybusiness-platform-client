import type {
  WhatsAppHeaderType,
  WhatsAppTemplate,
  WhatsAppTemplateButton,
  WhatsAppTemplateSubmitPayload,
} from "@/api/whatsappApi";

const MB = 1024 * 1024;

export const TEMPLATE_SAMPLE_LIMITS = {
  image: {
    maxBytes: 5 * MB,
    mimes: ["image/jpeg", "image/png"],
    extensions: [".jpg", ".jpeg", ".png"],
  },
  video: {
    maxBytes: 16 * MB,
    mimes: ["video/mp4"],
    extensions: [".mp4"],
  },
  document: {
    maxBytes: 16 * MB,
    mimes: ["application/pdf"],
    extensions: [".pdf"],
  },
} as const;

export type TemplateSampleKind = keyof typeof TEMPLATE_SAMPLE_LIMITS;

export type TemplateEditPolicy = {
  status: string;
  canEditName: boolean;
  canEditLanguage: boolean;
  canEditCategory: boolean;
  canEditContent: boolean;
  canSubmitToMeta: boolean;
  canSaveLocalDraft: boolean;
  canDuplicate: boolean;
  lockCode: string;
  lockMessageKey: string;
};

const EDITABLE = new Set(["APPROVED", "REJECTED", "PAUSED"]);
const PENDING = new Set(["PENDING", "IN_APPEAL", "PENDING_DELETION"]);
const APPROVED_EDIT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function isResumableHeaderHandle(value = ""): boolean {
  const handle = String(value || "").trim();
  if (handle.length < 8) return false;
  if (/^\d+$/.test(handle)) return false;
  if (/^https?:\/\//i.test(handle)) return false;
  if (handle.startsWith("blob:") || handle.startsWith("data:")) return false;
  return true;
}

function extensionOf(filename = ""): string {
  const name = filename.toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

export function validateTemplateSampleFile(
  file: { name: string; type: string; size: number },
  headerType: string
): string | null {
  const rules = TEMPLATE_SAMPLE_LIMITS[headerType as TemplateSampleKind];
  if (!rules) return "unsupported";
  if (!file.size) return "empty";
  if (file.size > rules.maxBytes) return "too-large";
  const mime = String(file.type || "").toLowerCase().split(";")[0].trim();
  const ext = extensionOf(file.name);
  if (!rules.mimes.includes(mime as never) || !rules.extensions.includes(ext as never)) {
    return "mime";
  }
  return null;
}

export function getTemplateEditPolicy(
  template?: Partial<WhatsAppTemplate> | null,
  now = Date.now()
): TemplateEditPolicy {
  const status = String(template?.metaStatus || "LOCAL").toUpperCase() || "LOCAL";
  const hasMetaId = Boolean(String(template?.metaTemplateId || "").trim());
  const base: TemplateEditPolicy = {
    status: hasMetaId ? status : "LOCAL",
    canEditName: !hasMetaId,
    canEditLanguage: !hasMetaId,
    canEditCategory: !hasMetaId,
    canEditContent: false,
    canSubmitToMeta: false,
    canSaveLocalDraft: false,
    canDuplicate: true,
    lockCode: "",
    lockMessageKey: "",
  };
  if (!hasMetaId || status === "LOCAL" || status === "") {
    return {
      ...base,
      status: "LOCAL",
      canEditName: true,
      canEditLanguage: true,
      canEditCategory: true,
      canEditContent: true,
      canSubmitToMeta: true,
      canSaveLocalDraft: true,
    };
  }
  if (PENDING.has(status)) {
    return {
      ...base,
      lockCode: "META_EDIT_LOCKED_PENDING",
      lockMessageKey: "whatsapp.wizard.locks.pending",
    };
  }
  if (status === "DISABLED" || status === "DELETED") {
    return {
      ...base,
      lockCode: "META_EDIT_LOCKED_DISABLED",
      lockMessageKey: "whatsapp.wizard.locks.disabled",
    };
  }
  if (EDITABLE.has(status)) {
    const lastEdit = template?.lastMetaEditAt
      ? new Date(template.lastMetaEditAt).getTime()
      : 0;
    if (status === "APPROVED" && lastEdit && now - lastEdit < APPROVED_EDIT_COOLDOWN_MS) {
      return {
        ...base,
        lockCode: "META_EDIT_COOLDOWN",
        lockMessageKey: "whatsapp.wizard.locks.cooldown",
      };
    }
    return {
      ...base,
      canEditContent: true,
      canSubmitToMeta: true,
      lockCode: status === "APPROVED" ? "META_EDIT_REQUIRES_REVIEW" : "",
      lockMessageKey:
        status === "APPROVED"
          ? "whatsapp.wizard.locks.approved"
          : "whatsapp.wizard.locks.rejected",
    };
  }
  return {
    ...base,
    lockCode: "META_EDIT_LOCKED",
    lockMessageKey: "whatsapp.wizard.locks.generic",
  };
}

export type TemplateEditorSnapshot = {
  name: string;
  language: string;
  metaCategory: string;
  headerType: WhatsAppHeaderType | string;
  headerText: string;
  headerMediaHandle: string;
  headerMediaUrl: string;
  body: string;
  footer: string;
  buttons: WhatsAppTemplateButton[];
  exampleValues: Record<string, string>;
};

export function contentChangeKeys(
  current: TemplateEditorSnapshot,
  original: TemplateEditorSnapshot | null
): string[] {
  if (!original) return [];
  const keys: Array<keyof TemplateEditorSnapshot> = [
    "headerType",
    "headerText",
    "headerMediaHandle",
    "body",
    "footer",
    "buttons",
    "exampleValues",
  ];
  return keys.filter(
    (key) => JSON.stringify(current[key] ?? "") !== JSON.stringify(original[key] ?? "")
  );
}

export function buildTemplateSubmitPayload(input: {
  name: string;
  language: string;
  metaCategory: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  variableType?: "number" | "name";
  headerType: WhatsAppHeaderType;
  headerText?: string;
  headerMediaUrl?: string;
  headerMediaHandle?: string;
  headerMediaFileName?: string;
  headerMediaMime?: string;
  headerMediaBytes?: number;
  body: string;
  footer?: string;
  buttons?: WhatsAppTemplateButton[];
  exampleValues?: Record<string, string>;
  templateId?: string;
}, options?: { requireMedia?: boolean }): WhatsAppTemplateSubmitPayload {
  const media = ["image", "video", "document"].includes(input.headerType);
  if (
    media &&
    options?.requireMedia !== false &&
    !isResumableHeaderHandle(input.headerMediaHandle || "")
  ) {
    const err = new Error("MEDIA_SAMPLE_REQUIRED");
    throw err;
  }
  return {
    templateId: input.templateId,
    name: input.name.trim(),
    language: input.language,
    metaCategory: input.metaCategory,
    variableType: input.variableType,
    headerType: input.headerType,
    headerText: input.headerType === "text" ? input.headerText : undefined,
    headerMediaUrl: media ? input.headerMediaUrl : undefined,
    headerMediaHandle: media ? input.headerMediaHandle : undefined,
    headerMediaFileName: media ? input.headerMediaFileName : undefined,
    headerMediaMime: media ? input.headerMediaMime : undefined,
    headerMediaBytes: media ? input.headerMediaBytes : undefined,
    body: input.body,
    footer: input.footer || undefined,
    buttons: input.buttons,
    exampleValues: input.exampleValues,
  };
}

export function lifecycleBucket(
  template: Partial<WhatsAppTemplate>
): "sync_error" | "local" | "pending" | "approved" | "rejected" | "paused" | "other" {
  if (String(template.lastSyncError || "").trim()) return "sync_error";
  const status = String(template.metaStatus || "LOCAL").toUpperCase();
  if (!template.metaTemplateId || status === "LOCAL" || status === "") return "local";
  if (status === "PENDING" || status === "IN_APPEAL") return "pending";
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  if (status === "PAUSED" || status === "DISABLED") return "paused";
  return "other";
}
