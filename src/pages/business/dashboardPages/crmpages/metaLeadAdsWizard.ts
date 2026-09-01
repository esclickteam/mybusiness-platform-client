export type MetaLeadWizardStep = 1 | 2 | 3;

export type MetaLeadWizardSnapshot = {
  metaAccountConnected?: boolean | null;
  connectedPageId?: string | null;
  selectedLeadFormId?: string | null;
  pagesCount?: number;
  connectedPage?: { pageId?: string | null } | null;
  selectedForm?: { formId?: string | null; id?: string | null } | null;
  selectedForms?: Array<{ formId?: string | null; id?: string | null }>;
  reconnectRequired?: boolean | null;
  connectionHealthy?: boolean | null;
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

export function isMetaLeadReconnectRequired(
  snapshot: MetaLeadWizardSnapshot
): boolean {
  if (snapshot.reconnectRequired === true) return true;
  if (
    snapshot.connectionHealthy === false &&
    Boolean(resolveConnectedPageId(snapshot))
  ) {
    return true;
  }
  return false;
}

export function isMetaLeadSetupComplete(
  snapshot: MetaLeadWizardSnapshot
): boolean {
  if (isMetaLeadReconnectRequired(snapshot)) return false;
  return (
    resolveMetaAccountConnected(snapshot) &&
    Boolean(resolveConnectedPageId(snapshot)) &&
    Boolean(resolveSelectedLeadFormId(snapshot))
  );
}

export function persistedMetaLeadWizardStep(
  snapshot: MetaLeadWizardSnapshot
): MetaLeadWizardStep {
  if (isMetaLeadReconnectRequired(snapshot)) return 1;
  if (!resolveMetaAccountConnected(snapshot)) return 1;
  if (isMetaLeadSetupComplete(snapshot)) return 3;
  return 2;
}

export function canNavigateToMetaLeadWizardStep(
  snapshot: MetaLeadWizardSnapshot,
  step: MetaLeadWizardStep
): boolean {
  if (step === 1) return true;
  if (step === 2) return resolveMetaAccountConnected(snapshot);
  return isMetaLeadSetupComplete(snapshot);
}

/**
 * Wizard step is derived from persisted integration state.
 * After reload, complete setup always opens on step 3.
 * The stepper can temporarily open step 1 or 2 without wiping the connection.
 */
export function deriveMetaLeadWizardStep(
  snapshot: MetaLeadWizardSnapshot,
  options: { viewingStep?: MetaLeadWizardStep | null; editingSetup?: boolean } = {}
): MetaLeadWizardStep {
  const persisted = persistedMetaLeadWizardStep(snapshot);
  const viewingStep = options.viewingStep ?? (options.editingSetup ? 2 : null);

  if (!viewingStep || viewingStep === persisted) return persisted;
  if (!canNavigateToMetaLeadWizardStep(snapshot, viewingStep)) return persisted;
  return viewingStep;
}
