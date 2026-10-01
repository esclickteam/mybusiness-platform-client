import React, { useEffect, useRef, useState } from "react";
import type { AdminWhatsAppCopy } from "./adminWhatsAppInboxCopy";

export type WhatsAppContactDraft = {
  id?: string;
  companyName: string;
  contactPersonName: string;
  phone: string;
  email: string;
  country: string;
  notes: string;
  whatsappProfileName?: string;
};

const EMPTY: WhatsAppContactDraft = {
  companyName: "",
  contactPersonName: "",
  phone: "",
  email: "",
  country: "",
  notes: "",
};

export function WhatsAppContactDialog({
  open,
  copy,
  dir,
  initial,
  saving,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  copy: AdminWhatsAppCopy;
  dir: "rtl" | "ltr";
  initial?: Partial<WhatsAppContactDraft> | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSave: (draft: WhatsAppContactDraft) => void;
}) {
  const [draft, setDraft] = useState<WhatsAppContactDraft>(EMPTY);

  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (!open) return;
    const seed = initialRef.current;
    setDraft({
      ...EMPTY,
      ...seed,
      companyName: seed?.companyName || "",
      contactPersonName: seed?.contactPersonName || "",
      phone: seed?.phone || "",
      email: seed?.email || "",
      country: seed?.country || "",
      notes: seed?.notes || "",
      id: seed?.id,
      whatsappProfileName: seed?.whatsappProfileName || "",
    });
  }, [open]);

  if (!open) return null;

  function setField(key: keyof WhatsAppContactDraft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <form
        dir={dir}
        className="max-h-[100dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 shadow-xl sm:max-w-lg sm:rounded-3xl sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-[#111b21]">
            {draft.id ? copy.editContact : copy.addContact}
          </h2>
          <button type="button" className="min-h-11 px-2 text-sm font-bold text-slate-500" onClick={onClose}>
            {copy.close}
          </button>
        </div>
        <div className="space-y-3">
          <Field label={copy.companyName} requiredLabel={copy.required}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={draft.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
              required
              autoComplete="organization"
            />
          </Field>
          <Field label={copy.contactPerson} requiredLabel={copy.required}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={draft.contactPersonName}
              onChange={(e) => setField("contactPersonName", e.target.value)}
              required
              autoComplete="name"
            />
          </Field>
          <Field label={copy.phone} requiredLabel={copy.required} hint={copy.phoneHint}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              dir="ltr"
              inputMode="tel"
              placeholder="+1 415 555 0134"
              value={draft.phone}
              onChange={(e) => setField("phone", e.target.value)}
              required
              autoComplete="tel"
            />
          </Field>
          <Field label={copy.email} optionalLabel={copy.optional}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              dir="ltr"
              type="email"
              value={draft.email}
              onChange={(e) => setField("email", e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label={copy.country} optionalLabel={copy.optional}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={draft.country}
              onChange={(e) => setField("country", e.target.value)}
              autoComplete="country-name"
            />
          </Field>
          <Field label={copy.notes} optionalLabel={copy.optional}>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={draft.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </Field>
        </div>
        {error ? <p className="mt-3 text-sm font-bold text-rose-700">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="min-h-11 flex-1 rounded-full border border-slate-200 text-sm font-bold"
            onClick={onClose}
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-full bg-[#7C4DFF] text-sm font-black text-white disabled:opacity-50"
            disabled={saving}
          >
            {copy.saveContact}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  requiredLabel,
  optionalLabel,
  hint,
  children,
}: {
  label: string;
  requiredLabel?: string;
  optionalLabel?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-[#111b21]">
      <span>
        {label}
        {requiredLabel ? <span className="ms-1 text-xs font-semibold text-rose-600">{requiredLabel}</span> : null}
        {optionalLabel ? <span className="ms-1 text-xs font-semibold text-slate-400">{optionalLabel}</span> : null}
      </span>
      <span className="mt-1 block">{children}</span>
      {hint ? <span className="mt-1 block text-xs font-semibold text-slate-500">{hint}</span> : null}
    </label>
  );
}
