export type MetaLeadWizardStep = 1 | 2 | 3;

export type MetaLeadWizardSnapshot = {
  metaAccountConnected?: boolean | null;
  connectedPageId?: string | null;
  selectedLeadFormId?: string | null;
  pagesCount?: number;
  connectedPage?: { pageId?: string | null } | null;
  selectedForm?: { formId?: string | null; id?: string | null } | null;
  selectedForms?: Array<{ formId?: string | null; id?: string | null }>;
};

export function cleanId(value: unknown): string {
  return String(value || "").trim();
}

export function resolveConnectedPageId(snapshot: MetaLeadWizardSnapshot): string {
  return (
    cleanId(snapshot.connectedPageId) ||
    cleanId(snapshot.connectedPage?.pageId)
  );
}

export function resolveSelectedLeadFormId(
  snapshot: MetaLeadWizardSnapshot
): string {
  const fromPrimary =
    cleanId(snapshot.selectedLeadFormId) ||
    cleanId(snapshot.selectedForm?.formId) ||
    cleanId(snapshot.selectedForm?.id);
  if (fromPrimary) return fromPrimary;

  const first = Array.isArray(snapshot.selectedForms)
    ? snapshot.selectedForms[0]
    : null;
  return cleanId(first?.formId) || cleanId(first?.id);
}

export function resolveMetaAccountConnected(
  snapshot: MetaLeadWizardSnapshot
): boolean {
  if (snapshot.metaAccountConnected === true) return true;
  if (snapshot.metaAccountConnected === false) {
    return Boolean(resolveConnectedPageId(snapshot));
  }
  return (
    Number(snapshot.pagesCount || 0) > 0 ||
    Boolean(resolveConnectedPageId(snapshot))
  );
}

export function isMetaLeadSetupComplete(
  snapshot: MetaLeadWizardSnapshot
): boolean {
  return (
    resolveMetaAccountConnected(snapshot) &&
    Boolean(resolveConnectedPageId(snapshot)) &&
    Boolean(resolveSelectedLeadFormId(snapshot))
  );
}

/**
 * Wizard step is derived from persisted integration state.
 * After reload, complete setup always opens on step 3.
 * Local "change setup" may temporarily show step 2.
 */
export function deriveMetaLeadWizardStep(
  snapshot: MetaLeadWizardSnapshot,
  options: { editingSetup?: boolean } = {}
): MetaLeadWizardStep {
  if (!resolveMetaAccountConnected(snapshot)) return 1;
  if (isMetaLeadSetupComplete(snapshot) && !options.editingSetup) return 3;
  return 2;
}
