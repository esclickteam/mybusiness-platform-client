import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { WhatsAppTemplate } from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  metaTemplateStatusKey,
  metaTemplateStatusLabel,
} from "../../../../i18n/whatsappMappingCopy";
import { formatWhatsAppTemplateCategory } from "../automations/whatsAppTemplateSelectFormat";
import { btnSecondary } from "../../../../styles/bizuplyUi";

type Props = {
  template: WhatsAppTemplate | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (tpl: WhatsAppTemplate) => void;
  onDelete?: (tpl: WhatsAppTemplate) => void;
  onMap?: (tpl: WhatsAppTemplate) => void;
  /** When true, drawer is positioned inside a relative parent (visual QA). */
  contained?: boolean;
};

function previewBody(body: string, max = 160) {
  const text = String(body || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export default function WhatsAppTemplateDrawer({
  template,
  open,
  onClose,
  onEdit,
  onDelete,
  onMap,
  contained = false,
}: Props) {
  const { t, i18n } = useTranslation();
  const dir = getTextDirection(i18n.language);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !template) return null;

  const statusLabel = metaTemplateStatusLabel(
    t,
    template.metaStatus,
    template.metaQualityScore,
    template.source
  );
  const statusKey = metaTemplateStatusKey(
    template.metaStatus,
    template.metaQualityScore,
    template.source
  );
  const statusClass = statusKey.startsWith("active")
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : statusKey === "pending" || statusKey === "inAppeal"
      ? "bg-amber-50 text-amber-800 border-amber-100"
      : statusKey === "rejected" || statusKey === "disabled"
        ? "bg-rose-50 text-rose-700 border-rose-100"
        : "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <div
      className={[
        "z-50 flex justify-end",
        contained ? "absolute inset-0" : "fixed inset-0",
      ].join(" ")}
      dir={dir}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col border-s border-slate-200 bg-white shadow-[-8px_0_32px_rgba(15,23,42,0.12)]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
              {formatWhatsAppTemplateCategory(template)}
            </p>
            <h2 className="mt-0.5 truncate text-base font-black text-slate-900">
              {template.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusClass}`}
              >
                {statusLabel}
              </span>
              <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {template.language}
              </span>
              {template.metaQualityScore ? (
                <span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                  {template.metaQualityScore}
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <section>
            <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
              Preview
            </p>
            <div className="rounded-2xl bg-[#e5ddd5] p-3">
              <div className="ms-auto max-w-[92%] rounded-xl rounded-ee-sm bg-[#dcf8c6] px-3 py-2 text-sm text-slate-900 shadow-sm">
                {template.headerType && template.headerType !== "none" ? (
                  <p className="mb-1 text-xs font-bold text-slate-700">
                    {template.headerType === "text"
                      ? template.headerText
                      : `[${template.headerType}]`}
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
                  {template.body}
                </p>
                {template.footer ? (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {template.footer}
                  </p>
                ) : null}
                {(template.buttons || []).length ? (
                  <div className="mt-2 space-y-1 border-t border-emerald-900/10 pt-2">
                    {(template.buttons || []).map((btn, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-white/70 px-2 py-1 text-center text-xs font-bold text-sky-700"
                      >
                        {btn.text || btn.type}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-2 text-sm">
            <DetailRow label="Language" value={template.language} />
            <DetailRow
              label="Category"
              value={formatWhatsAppTemplateCategory(template)}
            />
            <DetailRow label="Meta status" value={statusLabel} />
            <DetailRow
              label="Quality"
              value={template.metaQualityScore || "—"}
            />
            <DetailRow
              label="Header"
              value={
                template.headerType && template.headerType !== "none"
                  ? `${template.headerType}${
                      template.headerText ? `: ${template.headerText}` : ""
                    }`
                  : "—"
              }
            />
            <DetailRow label="Body" value={previewBody(template.body, 280)} />
            <DetailRow label="Footer" value={template.footer || "—"} />
            <DetailRow
              label="Variables"
              value={
                (template.variables || []).length
                  ? (template.variables || []).map((v) => `{{${v}}}`).join(", ")
                  : "—"
              }
            />
            <DetailRow
              label="Buttons"
              value={
                (template.buttons || []).length
                  ? (template.buttons || [])
                      .map((b) => `${b.type}: ${b.text || ""}`)
                      .join(" · ")
                  : "—"
              }
            />
            {template.rejectionReason ? (
              <DetailRow
                label="Rejection reason"
                value={template.rejectionReason}
                danger
              />
            ) : null}
          </section>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
          {onMap && String(template.metaStatus || "").toUpperCase() === "APPROVED" ? (
            <button
              type="button"
              className={`${btnSecondary} text-xs`}
              onClick={() => onMap(template)}
            >
              {t("whatsapp.templates.setupVariables")}
            </button>
          ) : null}
          {onEdit && template.source !== "meta" ? (
            <button
              type="button"
              className={`${btnSecondary} text-xs`}
              onClick={() => onEdit(template)}
            >
              {t("whatsapp.templates.edit")}
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              className={`${btnSecondary} text-xs !border-rose-200 !text-rose-700`}
              onClick={() => onDelete(template)}
            >
              {t("whatsapp.templates.delete")}
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function DetailRow({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-100 px-2.5 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={[
          "mt-0.5 whitespace-pre-wrap text-xs font-semibold",
          danger ? "text-rose-700" : "text-slate-800",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
