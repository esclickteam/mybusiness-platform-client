import React, { useEffect, useMemo, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import type { AdminWhatsAppCopy } from "./adminWhatsAppInboxCopy";
import type { WhatsAppInboxConnection } from "./whatsAppWebMessages";
import { normalizeManagedConnectionId } from "./whatsAppWebMessages";
import { WhatsAppContactDialog, type WhatsAppContactDraft } from "./WhatsAppContactDialog";

type Contact = {
  id: string;
  companyName: string;
  contactPersonName: string;
  phone: string;
  email?: string;
  country?: string;
  notes?: string;
  adminCustomerId?: string | null;
};

type Template = {
  id: string;
  name: string;
  language?: string;
  languageLabel?: string;
  body?: string;
  variables?: string[];
  headerVariables?: string[];
  buttonVariables?: Array<{ key: string; label?: string }>;
  status?: string;
};

export function WhatsAppNewMessageDialog({
  open,
  copy,
  dir,
  connections,
  onClose,
  onSent,
}: {
  open: boolean;
  copy: AdminWhatsAppCopy;
  dir: "rtl" | "ltr";
  connections: WhatsAppInboxConnection[];
  onClose: () => void;
  onSent: (result: { threadId?: string | null; adminCustomerId?: string | null }) => void;
}) {
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [creating, setCreating] = useState(false);
  const [contactError, setContactError] = useState("");
  const [savingContact, setSavingContact] = useState(false);
  const [connectionId, setConnectionId] = useState("");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [body, setBody] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const readyConnections = useMemo(
    () =>
      connections.filter((row) => {
        const id = normalizeManagedConnectionId(row.managedConnectionId);
        return id === "IL_MANAGED" || id === "US_MANAGED" || Boolean(id);
      }),
    [connections]
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(null);
    setCreating(false);
    setBody("");
    setTemplateId("");
    setPreview("");
    setError("");
    setContactError("");
    const first = normalizeManagedConnectionId(readyConnections[0]?.managedConnectionId);
    setConnectionId(first);
  }, [open, readyConnections]);

  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(() => {
      adminCrmApi
        .whatsappContacts(query)
        .then(({ data }) => setContacts(data.items || []))
        .catch(() => setContacts([]));
    }, 200);
    return () => window.clearTimeout(handle);
  }, [open, query]);

  useEffect(() => {
    if (!open || !selected || !connectionId) return;
    let cancelled = false;
    adminCrmApi
      .whatsappComposeContext({ phone: selected.phone, managedConnectionId: connectionId })
      .then(({ data }) => {
        if (cancelled) return;
        setSessionOpen(Boolean(data.sessionWindowOpen));
        setTemplates((data.templates || []) as Template[]);
        setTemplateId("");
        setPreview("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error || copy.sendFailed);
      });
    return () => {
      cancelled = true;
    };
  }, [open, selected, connectionId, copy.sendFailed]);

  const template = templates.find((row) => row.id === templateId);
  const needsTemplate = Boolean(selected) && !sessionOpen;
  const canPreview = Boolean(selected && (sessionOpen ? body.trim() : templateId));

  async function saveContact(draft: WhatsAppContactDraft) {
    setSavingContact(true);
    setContactError("");
    try {
      const payload = {
        companyName: draft.companyName,
        contactPersonName: draft.contactPersonName,
        phone: draft.phone,
        email: draft.email,
        country: draft.country,
        notes: draft.notes,
      };
      const { data } = draft.id
        ? await adminCrmApi.updateWhatsAppContact(draft.id, payload)
        : await adminCrmApi.createWhatsAppContact(payload);
      const contact = data.contact as Contact;
      setSelected(contact);
      setContacts((prev) => [contact, ...prev.filter((row) => row.id !== contact.id)]);
      setCreating(false);
      if (!contact.adminCustomerId) setError(copy.ambiguousPhone);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      setContactError(
        code === "DUPLICATE_PHONE" ? copy.duplicatePhone : err?.response?.data?.error || copy.sendFailed
      );
    } finally {
      setSavingContact(false);
    }
  }

  async function buildPreview() {
    if (!selected?.adminCustomerId) {
      setError(copy.ambiguousPhone);
      return;
    }
    if (needsTemplate && !templateId) {
      setError(copy.outsideWindow);
      return;
    }
    if (!templateId) {
      setPreview(body.trim());
      return;
    }
    try {
      const { data } = await adminCrmApi.whatsappPreview(selected.adminCustomerId, {
        templateId,
        vars,
        intent: "message",
        managedConnectionId: connectionId,
      });
      setPreview(data.preview?.preview || template?.body || "");
      if (data.preview?.mapped) setVars(data.preview.mapped);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.error || copy.sendFailed);
    }
  }

  async function send() {
    if (!selected?.adminCustomerId || sending) return;
    if (!sessionOpen && !templateId) {
      setError(copy.outsideWindow);
      return;
    }
    if (templateId && !preview) {
      setError(copy.previewTitle);
      return;
    }
    setSending(true);
    setError("");
    try {
      const { data } = await adminCrmApi.whatsappSend(selected.adminCustomerId, {
        intent: "message",
        templateId: templateId || null,
        body: sessionOpen && !templateId ? body.trim() : preview || body.trim(),
        vars,
        previewConfirmed: true,
        managedConnectionId: connectionId,
      });
      onSent({
        threadId: data.threadId || data.thread?.id || null,
        adminCustomerId: selected.adminCustomerId,
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || copy.sendFailed);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div
        dir={dir}
        className="flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 className="text-lg font-black text-[#111b21]">{copy.newMessage}</h2>
          <button type="button" className="min-h-11 px-2 text-sm font-bold text-slate-500" onClick={onClose}>
            {copy.close}
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          <input
            className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
            placeholder={copy.searchContacts}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-100">
            {contacts.length ? (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  className={[
                    "block w-full border-b border-slate-100 px-3 py-2 text-start last:border-b-0",
                    selected?.id === contact.id ? "bg-violet-50" : "bg-white",
                  ].join(" ")}
                  onClick={() => {
                    setSelected(contact);
                    setError(contact.adminCustomerId ? "" : copy.ambiguousPhone);
                    setPreview("");
                  }}
                >
                  <span className="block text-sm font-black text-[#111b21]">{contact.companyName}</span>
                  <span className="block text-xs font-bold text-slate-600">{contact.contactPersonName}</span>
                  <span className="block text-xs text-slate-500" dir="ltr">
                    {contact.phone}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-sm font-bold text-slate-400">{copy.noContacts}</p>
            )}
          </div>
          <button
            type="button"
            className="min-h-11 rounded-full bg-slate-100 px-4 text-sm font-black text-[#111b21]"
            onClick={() => setCreating(true)}
          >
            {copy.createRecipient}
          </button>

          {readyConnections.length > 1 ? (
            <label className="block text-sm font-bold text-[#111b21]">
              {copy.chooseSender}
              <select
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3"
                dir="ltr"
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
              >
                {readyConnections.map((row) => {
                  const id = normalizeManagedConnectionId(row.managedConnectionId);
                  return (
                    <option key={id} value={id}>
                      {row.connectionFlag ? `${row.connectionFlag} ` : ""}
                      {row.connectionLabel || id}
                      {row.businessDisplayPhone ? ` · ${row.businessDisplayPhone}` : ""}
                    </option>
                  );
                })}
              </select>
            </label>
          ) : null}

          {selected ? (
            <div className="space-y-2 rounded-2xl bg-[#f6f2fb] p-3">
              <p className="text-sm font-black">{selected.companyName}</p>
              <p className="text-xs font-bold text-slate-600">{selected.contactPersonName}</p>
              <p className="text-xs font-bold text-slate-500">
                {sessionOpen ? copy.sessionOpen : copy.templateRequired}
              </p>
              <select
                className="min-h-11 w-full rounded-xl border-none bg-white px-3 text-sm"
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  setPreview("");
                }}
              >
                <option value="">{sessionOpen ? copy.freeForm : copy.chooseTemplate}</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                    {tpl.languageLabel || tpl.language ? ` · ${tpl.languageLabel || tpl.language}` : ""}
                  </option>
                ))}
              </select>
              {(template?.variables || []).map((key) => (
                <input
                  key={key}
                  className="min-h-11 w-full rounded-xl border-none bg-white px-3 text-sm"
                  placeholder={`{{${key}}}`}
                  value={vars[key] || ""}
                  onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              ))}
              {sessionOpen && !templateId ? (
                <textarea
                  className="min-h-24 w-full rounded-xl border-none bg-white px-3 py-2 text-sm"
                  placeholder={copy.messagePlaceholder}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setPreview(e.target.value);
                  }}
                />
              ) : null}
              {!sessionOpen ? <p className="text-xs font-bold text-amber-800">{copy.outsideWindow}</p> : null}
              {preview ? (
                <div className="rounded-xl bg-white px-3 py-2 text-sm whitespace-pre-wrap">
                  <p className="mb-1 text-xs font-black text-slate-500">{copy.previewTitle}</p>
                  {preview}
                </div>
              ) : null}
            </div>
          ) : null}
          {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
        </div>
        <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            className="min-h-11 flex-1 rounded-full border border-slate-200 text-sm font-bold disabled:opacity-50"
            disabled={!canPreview || sending}
            onClick={() => void buildPreview()}
          >
            {copy.preview}
          </button>
          <button
            type="button"
            className="min-h-11 flex-1 rounded-full bg-[#7C4DFF] text-sm font-black text-white disabled:opacity-50"
            disabled={!preview || sending || (needsTemplate && !templateId)}
            onClick={() => void send()}
          >
            {copy.send}
          </button>
        </div>
      </div>
      <WhatsAppContactDialog
        open={creating}
        copy={copy}
        dir={dir}
        saving={savingContact}
        error={contactError}
        onClose={() => setCreating(false)}
        onSave={(draft) => void saveContact(draft)}
      />
    </div>
  );
}
