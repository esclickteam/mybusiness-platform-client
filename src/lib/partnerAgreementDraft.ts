import type { AgreementInput } from "./partnerAgreementApi";

export const CANONICAL_DRAFT_KEY = "partner-agreement-canonical-draft";
export const UNSAVED_PREVIEW_KEY = "partner-agreement-unsaved-preview";
export const PENDING_SIGNATURE_KEY = "partner-agreement-pending-bizuply-signature";

export type DraftSignature = { imageDataUrl: string; confirmed: boolean } | null;

export type CanonicalDraft = {
  form: AgreementInput;
  signature: DraftSignature;
};

export function loadCanonicalDraft(): CanonicalDraft | null {
  try {
    const raw = sessionStorage.getItem(CANONICAL_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CanonicalDraft;
    if (!parsed?.form || typeof parsed.form !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCanonicalDraft(form: AgreementInput, signature: DraftSignature = null) {
  sessionStorage.setItem(CANONICAL_DRAFT_KEY, JSON.stringify({ form, signature }));
}

export function clearCanonicalDraft() {
  sessionStorage.removeItem(CANONICAL_DRAFT_KEY);
  sessionStorage.removeItem(UNSAVED_PREVIEW_KEY);
  sessionStorage.removeItem(PENDING_SIGNATURE_KEY);
}
