import React, { useEffect, useMemo, useState } from "react";
import { Send, X } from "lucide-react";

import API from "../../api";
import { previewWhatsAppTemplateBody } from "./adminSupportChatScroll";

export type SupportWhatsAppTemplate = {
  id?: string;
  _id?: string;
  name?: string;
  displayName?: string;
  metaTemplateName?: string;
  language?: string;
  languageLabelHe?: string;
  category?: string;
  metaCategory?: string;
  categoryLabelHe?: string;
  status?: string;
  metaStatus?: string;
  statusLabelHe?: string;
  body?: string;
  variables?: string[];
  variableCount?: number;
  managedConnectionId?: string;
};

function templateIdOf(tpl: SupportWhatsAppTemplate) {
  return String(tpl.id || tpl._id || "");
}

function templateNameOf(tpl: SupportWhatsAppTemplate) {
  return String(
    tpl.metaTemplateName || tpl.displayName || tpl.name || ""
  ).trim();
}

export default function AdminSupportChatSendTemplateModal({
  open,
  conversationId,
  managedConnectionId,
  onClose,
  onSent,
}: {
  open: boolean;
  conversationId: string;
  managedConnectionId?: string;
  onClose: () => void;
  onSent: (payload: {
    message?: unknown;
    conversation?: unknown;
    templateName?: string;
    managedConnectionId?: string;
  }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState<SupportWhatsAppTemplate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [catalogConnection, setCatalogConnection] = useState("");

  useEffect(() => {
    if (!open || !conversationId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setSelectedId("");
    setVars({});
    API.get(`/support-chat/admin/${conversationId}/whatsapp-templates`)
      .then(({ data }) => {
        if (cancelled) return;
        const rows: SupportWhatsAppTemplate[] = data.templates || [];
        setTemplates(rows);
        setCatalogConnection(
          String(data.managedConnectionId || managedConnectionId || "")
        );
        const followup = rows.find(
          (tpl) => templateNameOf(tpl) === "partner_agreement_followup_v1"
        );
        const first = followup || rows[0];
        if (first) setSelectedId(templateIdOf(first));
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.response?.data?.error || "Failed to load templates");
        setTemplates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, conversationId, managedConnectionId]);

  const selected = useMemo(
    () => templates.find((tpl) => templateIdOf(tpl) === selectedId) || null,
    [templates, selectedId]
  );

  const requiredVars = useMemo(
    () => (selected?.variables || []).map(String).filter(Boolean),
    [selected]
  );

  useEffect(() => {
    if (!selected) {
      setVars({});
      return;
    }
    setVars((prev) => {
      const next: Record<string, string> = {};
      for (const key of requiredVars) {
        next[key] = prev[key] || "";
      }
      return next;
    });
  }, [selected, requiredVars]);

  const preview = selected
    ? previewWhatsAppTemplateBody(String(selected.body || ""), vars)
    : "";
  const missingVars = requiredVars.filter((key) => !String(vars[key] || "").trim());

  async function send() {
    if (!selected || sending || missingVars.length) return;
    setSending(true);
    setError("");
    const clientRequestId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `tpl-${Date.now()}`;
    try {
      const { data } = await API.post(
        `/support-chat/admin/${conversationId}/whatsapp-template`,
        {
          templateId: templateIdOf(selected),
          vars,
          clientRequestId,
        }
      );
      onSent(data);
      onClose();
    } catch (err: any) {
      const body = err?.response?.data;
      if (body?.message) {
        onSent(body);
      }
      setError(body?.error || err?.message || "Failed to send template");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      data-testid="support-template-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Send WhatsApp template"
    >
      <button
        type="button"
        className="h-full flex-1 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <aside
        dir="rtl"
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Send Template</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500" dir="ltr">
              Via {catalogConnection || managedConnectionId || "managed connection"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500"
            aria-label="Close template picker"
          >
            <X size={16} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-sm font-semibold text-slate-500">Loading approved templates…</p>
          ) : error && !templates.length ? (
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          ) : templates.length === 0 ? (
            <p className="text-sm font-semibold text-slate-500">
              No approved templates on this WhatsApp connection.
            </p>
          ) : (
            <ul className="space-y-2">
              {templates.map((tpl) => {
                const id = templateIdOf(tpl);
                const active = id === selectedId;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      data-testid="support-template-row"
                      data-template-name={templateNameOf(tpl)}
                      onClick={() => setSelectedId(id)}
                      className={`w-full rounded-2xl border px-3 py-3 text-right transition ${
                        active
                          ? "border-violet-300 bg-violet-50 ring-1 ring-violet-200"
                          : "border-slate-200 bg-white hover:border-violet-200"
                      }`}
                    >
                      <p className="text-sm font-black text-slate-900" dir="ltr">
                        {templateNameOf(tpl)}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-slate-500" dir="ltr">
                        {tpl.language || tpl.languageLabelHe || "—"}
                        {" · "}
                        {tpl.categoryLabelHe || tpl.metaCategory || tpl.category || "—"}
                        {" · "}
                        {tpl.statusLabelHe || tpl.metaStatus || tpl.status || "APPROVED"}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {selected ? (
            <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                Preview
              </p>
              <p
                className="whitespace-pre-wrap text-sm font-semibold text-slate-800"
                data-testid="support-template-preview"
                dir="auto"
              >
                {preview || "—"}
              </p>
              {requiredVars.length ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    Required variables
                  </p>
                  {requiredVars.map((key) => (
                    <label key={key} className="block text-xs font-bold text-slate-600">
                      {`{{${key}}}`}
                      <input
                        value={vars[key] || ""}
                        onChange={(e) =>
                          setVars((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] font-semibold text-slate-500">
                  No variables required
                </p>
              )}
            </div>
          ) : null}

          {error && templates.length ? (
            <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>
          ) : null}
        </div>

        <footer className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            data-testid="support-template-send"
            disabled={!selected || sending || missingVars.length > 0}
            onClick={() => void send()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-4 py-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 disabled:opacity-40"
          >
            <Send size={16} className="-scale-x-100" />
            {sending ? "Sending…" : "Send template"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
