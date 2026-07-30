import React, { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Bold,
  Check,
  FileText,
  Image as ImageIcon,
  Italic,
  Loader2,
  Plus,
  Strikethrough,
  Trash2,
  Video,
} from "lucide-react";
import {
  saveWhatsAppTemplateDraft,
  submitWhatsAppTemplateToMeta,
  type WhatsAppHeaderType,
  type WhatsAppTemplateButton,
  type WhatsAppTemplateSubmitPayload,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
  onClose: () => void;
  onSubmitted: () => void;
};

type MetaCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";
type Step = 0 | 1 | 2;

type FormState = {
  metaCategory: MetaCategory;
  marketingType: "default" | "catalog" | "flows" | "call_permission";
  name: string;
  language: string;
  variableType: "number" | "name";
  headerType: WhatsAppHeaderType;
  headerText: string;
  headerMediaUrl: string;
  body: string;
  footer: string;
  exampleValues: Record<string, string>;
  buttons: WhatsAppTemplateButton[];
};

const BODY_MAX = 1024;
const HEADER_MAX = 60;
const FOOTER_MAX = 60;

const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: "en", label: "English" },
  { code: "en_GB", label: "English (UK)" },
  { code: "en_US", label: "English (US)" },
  { code: "he", label: "Hebrew" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "es_ES", label: "Spanish (Spain)" },
  { code: "es_MX", label: "Spanish (Mexico)" },
  { code: "pt_BR", label: "Portuguese (BR)" },
  { code: "pt_PT", label: "Portuguese (PT)" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "hi", label: "Hindi" },
  { code: "id", label: "Indonesian" },
];

const emptyForm: FormState = {
  metaCategory: "MARKETING",
  marketingType: "default",
  name: "",
  language: "en_US",
  variableType: "number",
  headerType: "none",
  headerText: "",
  headerMediaUrl: "",
  body: "",
  footer: "",
  exampleValues: {},
  buttons: [],
};

function extractVars(body: string, variableType: "number" | "name") {
  const re =
    variableType === "name"
      ? /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g
      : /\{\{\s*(\d+)\s*\}\}/g;
  const matches = Array.from(String(body).matchAll(re));
  const seen = new Set<string>();
  const vars: string[] = [];
  for (const match of matches) {
    const key = match[1];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    vars.push(key);
  }
  if (variableType === "number") {
    return vars.sort((a, b) => Number(a) - Number(b));
  }
  return vars;
}

function nextVarToken(body: string, variableType: "number" | "name") {
  if (variableType === "name") {
    const existing = extractVars(body, "name");
    let i = 1;
    let candidate = `var_${i}`;
    while (existing.includes(candidate)) {
      i += 1;
      candidate = `var_${i}`;
    }
    return `{{${candidate}}}`;
  }
  const nums = extractVars(body, "number").map(Number);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `{{${next}}}`;
}

function normalizeName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 512);
}

function wrapSelection(
  textarea: HTMLTextAreaElement | null,
  value: string,
  before: string,
  after: string,
  onChange: (next: string) => void
) {
  if (!textarea) {
    onChange(`${value}${before}${after}`.slice(0, BODY_MAX));
    return;
  }
  const start = textarea.selectionStart ?? value.length;
  const end = textarea.selectionEnd ?? value.length;
  const selected = value.slice(start, end) || "text";
  const next = (
    value.slice(0, start) +
    before +
    selected +
    after +
    value.slice(end)
  ).slice(0, BODY_MAX);
  onChange(next);
  requestAnimationFrame(() => {
    const pos = start + before.length + selected.length + after.length;
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
  });
}

function renderPreviewBody(body: string, samples: Record<string, string>) {
  return String(body || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) =>
    samples[key] ? String(samples[key]) : `{{${key}}}`
  );
}

export default function WhatsAppCreateTemplateWizard({
  businessId,
  onClose,
  onSubmitted,
}: Props) {
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const variables = useMemo(
    () => extractVars(form.body, form.variableType),
    [form.body, form.variableType]
  );

  const nameValid = /^[a-z0-9_]+$/.test(form.name) && form.name.length > 0;
  const samplesComplete = variables.every((v) =>
    String(form.exampleValues[v] || "").trim()
  );
  const bodyValid = form.body.trim().length > 0;
  const languageValid = Boolean(form.language);
  const mediaOk =
    form.headerType === "none" ||
    form.headerType === "text" ||
    Boolean(form.headerMediaUrl.trim());

  const canGoEdit =
    nameValid && languageValid && Boolean(form.metaCategory);
  const canGoReview =
    canGoEdit &&
    bodyValid &&
    samplesComplete &&
    mediaOk &&
    !/^\{\{/.test(form.body.trim()) &&
    !/\}\}$/.test(form.body.trim());

  const previewBody = renderPreviewBody(form.body, form.exampleValues);
  const previewHeader =
    form.headerType === "text"
      ? renderPreviewBody(form.headerText, form.exampleValues)
      : "";

  const buildPayload = (): WhatsAppTemplateSubmitPayload => ({
    name: form.name,
    metaTemplateName: form.name,
    language: form.language,
    metaCategory: form.metaCategory,
    category: form.metaCategory === "MARKETING" ? "promotion" : "custom",
    variableType: form.variableType,
    headerType: form.headerType,
    headerText: form.headerText,
    headerMediaUrl: form.headerMediaUrl,
    body: form.body,
    footer: form.footer,
    exampleValues: form.exampleValues,
    buttons: form.buttons,
  });

  const insertVariable = () => {
    const token = nextVarToken(form.body, form.variableType);
    const textarea = bodyRef.current;
    if (!textarea) {
      setForm((prev) => ({
        ...prev,
        body: `${prev.body}${prev.body && !/\s$/.test(prev.body) ? " " : ""}${token}`.slice(
          0,
          BODY_MAX
        ),
      }));
      return;
    }
    const start = textarea.selectionStart ?? form.body.length;
    const end = textarea.selectionEnd ?? form.body.length;
    const next = (
      form.body.slice(0, start) +
      token +
      form.body.slice(end)
    ).slice(0, BODY_MAX);
    setForm((prev) => ({ ...prev, body: next }));
    requestAnimationFrame(() => {
      const pos = start + token.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const addButton = (type: WhatsAppTemplateButton["type"]) => {
    setForm((prev) => {
      if (prev.buttons.length >= 10) return prev;
      return {
        ...prev,
        buttons: [
          ...prev.buttons,
          {
            type,
            text: type === "copy_code" ? "Copy code" : "Button",
            url: type === "url" ? "https://" : "",
            urlType: "static",
            exampleUrl: "",
            phoneNumber: "",
          },
        ],
      };
    });
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      await saveWhatsAppTemplateDraft(businessId, buildPayload());
      toast.success("Local draft saved");
      onSubmitted();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to save local draft";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      const result = await submitWhatsAppTemplateToMeta(
        businessId,
        buildPayload()
      );
      toast.success(
        `Submitted to Meta · status: ${result.meta?.status || "PENDING"}`
      );
      onSubmitted();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Failed to submit template to Meta";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    "Set up template",
    "Edit template",
    "Submit for review",
  ] as const;

  return (
    <section dir="ltr" className={`${cardBase} space-y-5 p-4 sm:p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900">
            Create template
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Same structure and flow as Meta WhatsApp Manager
          </p>
        </div>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
          Meta Cloud API
        </span>
      </div>

      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((label, index) => {
          const done = step > index;
          const active = step === index;
          return (
            <li
              key={label}
              className={[
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold",
                active
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : done
                    ? "border-slate-200 bg-white text-slate-700"
                    : "border-slate-100 bg-slate-50 text-slate-400",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  done || active
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
        <aside className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-black text-slate-900">
              WhatsApp-style Template Preview
            </p>
            <p className="text-xs font-medium text-slate-500">
              Updates in real time from your fields and sample values
            </p>
          </div>
          <div className="min-h-[320px] bg-[#ECE5DD] p-4">
            <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-sm text-slate-800 shadow-sm">
              {form.headerType === "image" && (
                <div className="mb-2 flex h-28 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              {form.headerType === "video" && (
                <div className="mb-2 flex h-28 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <Video className="h-6 w-6" />
                </div>
              )}
              {form.headerType === "document" && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
                  <FileText className="h-4 w-4" />
                  Document sample
                </div>
              )}
              {previewHeader ? (
                <p className="mb-1 font-black">{previewHeader}</p>
              ) : null}
              <p className="whitespace-pre-wrap font-medium leading-relaxed">
                {previewBody || "Your body preview will appear here"}
              </p>
              {form.footer ? (
                <p className="mt-2 text-xs text-slate-400">{form.footer}</p>
              ) : null}
              {form.buttons.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                  {form.buttons.map((btn, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-slate-200 px-2 py-1.5 text-center text-xs font-bold text-sky-700"
                    >
                      {btn.text || `Button ${i + 1}`}
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-end text-[10px] font-semibold text-slate-400">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {step === 0 && (
            <>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Choose a category
                </h4>
                <div className="mt-3 grid gap-2">
                  {(
                    [
                      [
                        "MARKETING",
                        "Marketing",
                        "Send promotions, offers, and product updates.",
                      ],
                      [
                        "UTILITY",
                        "Utility",
                        "Send account updates, reminders, and order details.",
                      ],
                      [
                        "AUTHENTICATION",
                        "Authentication",
                        "Send one-time passwords and verification codes.",
                      ],
                    ] as const
                  ).map(([value, title, desc]) => (
                    <label
                      key={value}
                      className={[
                        "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3",
                        form.metaCategory === value
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        className="mt-1 accent-emerald-600"
                        checked={form.metaCategory === value}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, metaCategory: value }))
                        }
                      />
                      <span>
                        <span className="block text-sm font-black text-slate-900">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-xs font-medium text-slate-500">
                          {desc}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {form.metaCategory === "MARKETING" && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["default", "Default"],
                        ["catalog", "Catalog"],
                        ["flows", "Flows"],
                        ["call_permission", "Request permission to call"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            marketingType: value,
                          }))
                        }
                        className={[
                          "rounded-xl border px-3 py-2 text-start text-sm font-bold",
                          form.marketingType === value
                            ? "border-sky-300 bg-sky-50 text-sky-900"
                            : "border-slate-200 text-slate-600",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-black text-slate-600">
                    Template name
                  </span>
                  <input
                    className={inputBase}
                    dir="ltr"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: normalizeName(e.target.value),
                      }))
                    }
                    placeholder="order_update"
                  />
                  <span className="text-[11px] font-medium text-slate-400">
                    Lowercase English, numbers, underscore only ·{" "}
                    {form.name || "template_name"}
                  </span>
                  {form.name && !nameValid && (
                    <span className="text-xs font-semibold text-rose-600">
                      Invalid template name
                    </span>
                  )}
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-black text-slate-600">
                    Language
                  </span>
                  <select
                    className={inputBase}
                    value={form.language}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label} ({lang.code})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  Variable type
                </span>
                <select
                  className={inputBase}
                  value={form.variableType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      variableType: e.target.value as "number" | "name",
                    }))
                  }
                >
                  <option value="number">Number · {"{{1}} {{2}} {{3}}"}</option>
                  <option value="name">
                    Name · {"{{customer_name}} {{appointment_date}}"}
                  </option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  Media sample · Optional
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      ["none", "None", null],
                      ["image", "Image", ImageIcon],
                      ["video", "Video", Video],
                      ["document", "Document", FileText],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          headerType: value,
                          headerText:
                            value === "none" ? "" : prev.headerText,
                        }))
                      }
                      className={[
                        "flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-bold",
                        form.headerType === value
                          ? "border-sky-300 bg-sky-50 text-sky-900"
                          : "border-slate-200 text-slate-600",
                      ].join(" ")}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {label}
                    </button>
                  ))}
                </div>
                {["image", "video", "document"].includes(form.headerType) && (
                  <div className="mt-2 space-y-2">
                    <input
                      className={inputBase}
                      dir="ltr"
                      value={form.headerMediaUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          headerMediaUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/sample.jpg"
                    />
                    <p className="text-[11px] font-medium text-amber-700">
                      Media headers can be saved as local draft. Submit to Meta
                      currently supports text headers (Meta media upload handle
                      required).
                    </p>
                    {form.headerMediaUrl && (
                      <button
                        type="button"
                        className={btnSecondary}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            headerMediaUrl: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              {form.headerType === "none" || form.headerType === "text" ? (
                <label className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-600">
                      Header · Optional
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {form.headerText.length}/{HEADER_MAX}
                    </span>
                  </div>
                  <input
                    className={inputBase}
                    maxLength={HEADER_MAX}
                    value={form.headerText}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        headerText: e.target.value,
                        headerType: e.target.value.trim() ? "text" : "none",
                      }))
                    }
                    placeholder="Add a short header"
                  />
                </label>
              ) : null}

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600">Body</span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {form.body.length}/{BODY_MAX}
                  </span>
                </div>
                <textarea
                  ref={bodyRef}
                  className={`${inputBase} min-h-[160px] py-3`}
                  maxLength={BODY_MAX}
                  value={form.body}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      body: e.target.value.slice(0, BODY_MAX),
                    }))
                  }
                  placeholder={
                    "Hello {{1}},\nYour appointment is on {{2}}."
                  }
                />
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={insertVariable}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add variable
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "*",
                        "*",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "_",
                        "_",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "~",
                        "~",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Strikethrough className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "```",
                        "```",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    Code
                  </button>
                </div>
              </div>

              <label className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600">
                    Footer · Optional
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {form.footer.length}/{FOOTER_MAX}
                  </span>
                </div>
                <input
                  className={inputBase}
                  maxLength={FOOTER_MAX}
                  value={form.footer}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      footer: e.target.value.replace(/\{\{[^}]*\}\}/g, ""),
                    }))
                  }
                  placeholder="Short footer line"
                />
              </label>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-600">
                    Buttons · Optional
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => addButton("quick_reply")}
                    >
                      Quick reply
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => addButton("url")}
                    >
                      Visit website
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => addButton("phone_number")}
                    >
                      Call phone number
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => addButton("copy_code")}
                    >
                      Copy offer code
                    </button>
                  </div>
                </div>
                {form.buttons.map((btn, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase text-slate-500">
                        {btn.type}
                      </span>
                      <button
                        type="button"
                        className={btnSecondary}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            buttons: prev.buttons.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {btn.type !== "copy_code" && (
                      <input
                        className={inputBase}
                        value={btn.text}
                        maxLength={25}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            buttons: prev.buttons.map((b, i) =>
                              i === index
                                ? { ...b, text: e.target.value }
                                : b
                            ),
                          }))
                        }
                        placeholder="Button text"
                      />
                    )}
                    {btn.type === "url" && (
                      <>
                        <input
                          className={inputBase}
                          dir="ltr"
                          value={btn.url || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              buttons: prev.buttons.map((b, i) =>
                                i === index ? { ...b, url: e.target.value } : b
                              ),
                            }))
                          }
                          placeholder="https://example.com"
                        />
                        <input
                          className={inputBase}
                          dir="ltr"
                          value={btn.exampleUrl || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              buttons: prev.buttons.map((b, i) =>
                                i === index
                                  ? { ...b, exampleUrl: e.target.value }
                                  : b
                              ),
                            }))
                          }
                          placeholder="Sample URL (for dynamic URLs)"
                        />
                      </>
                    )}
                    {btn.type === "phone_number" && (
                      <input
                        className={inputBase}
                        dir="ltr"
                        value={btn.phoneNumber || ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            buttons: prev.buttons.map((b, i) =>
                              i === index
                                ? { ...b, phoneNumber: e.target.value }
                                : b
                            ),
                          }))
                        }
                        placeholder="+972501234567"
                      />
                    )}
                    {btn.type === "copy_code" && (
                      <input
                        className={inputBase}
                        dir="ltr"
                        value={btn.exampleUrl || ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            buttons: prev.buttons.map((b, i) =>
                              i === index
                                ? { ...b, exampleUrl: e.target.value }
                                : b
                            ),
                          }))
                        }
                        placeholder="Example offer code"
                      />
                    )}
                  </div>
                ))}
              </div>

              {variables.length > 0 && (
                <div className="space-y-2 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-black text-slate-600">
                    Variable samples
                  </p>
                  {variables.map((key) => (
                    <label key={key} className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-500" dir="ltr">
                        {`{{${key}}}`}
                      </span>
                      <input
                        className={inputBase}
                        value={form.exampleValues[key] || ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            exampleValues: {
                              ...prev.exampleValues,
                              [key]: e.target.value,
                            },
                          }))
                        }
                        placeholder="Sample value"
                      />
                    </label>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-black text-slate-900">
                Review before submit
              </h4>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-500">Template name</dt>
                  <dd className="font-bold text-slate-900" dir="ltr">
                    {form.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-500">Language</dt>
                  <dd className="font-bold text-slate-900">{form.language}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-500">Category</dt>
                  <dd className="font-bold text-slate-900">
                    {form.metaCategory}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Header</dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {form.headerType === "text"
                      ? form.headerText || "—"
                      : form.headerType}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Body</dt>
                  <dd className="mt-1 whitespace-pre-wrap font-medium text-slate-800">
                    {form.body}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Footer</dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {form.footer || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Buttons</dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {form.buttons.length
                      ? form.buttons
                          .map((b) => `${b.type}:${b.text || b.exampleUrl}`)
                          .join(" · ")
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">
                    Variable samples
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800" dir="ltr">
                    {variables.length
                      ? variables
                          .map(
                            (v) =>
                              `{{${v}}}=${form.exampleValues[v] || ""}`
                          )
                          .join(" · ")
                      : "—"}
                  </dd>
                </div>
              </dl>
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                Submit sends this template to Meta for review. Status will show
                as PENDING until Meta returns APPROVED or REJECTED. No fake
                approved status is shown.
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button type="button" className={btnSecondary} onClick={onClose}>
              Cancel
            </button>
            {step > 0 && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setStep((prev) => (prev - 1) as Step)}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className={btnSecondary}
              disabled={saving || !form.name}
              onClick={handleSaveDraft}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save as draft
            </button>
            {step < 2 ? (
              <button
                type="button"
                className={btnPrimary}
                disabled={step === 0 ? !canGoEdit : !canGoReview}
                onClick={() => setStep((prev) => (prev + 1) as Step)}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className={btnPrimary}
                disabled={saving || !canGoReview}
                onClick={handleSubmit}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Submit to Meta
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
