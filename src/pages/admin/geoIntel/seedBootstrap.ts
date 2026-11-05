/** Pure helpers for GEO owner seed bootstrap UI (no secrets). */

export type SeedSummary = {
  brandCount?: number;
  promptsCreated?: number;
  promptsSkipped?: number;
  promptsTotalNow?: number;
  expectedPrompts?: number;
  complete?: boolean;
  deleted?: number;
  noteHe?: string;
};

export type SeedBootstrapStatus = {
  brandCount?: number;
  promptCount?: number;
  expectedPrompts?: number;
  complete?: boolean;
  buttonVisible?: boolean;
};

export function shouldShowSeedInitButton(
  bootstrap?: SeedBootstrapStatus | null,
  forceHiddenAfterSuccess = false
): boolean {
  if (forceHiddenAfterSuccess) return false;
  if (!bootstrap) return true;
  if (bootstrap.complete === true) return false;
  if (bootstrap.buttonVisible === false) return false;
  return true;
}

export function formatSeedResultHe(summary?: SeedSummary | null): string {
  if (!summary) return "האתחול הסתיים.";
  if (summary.noteHe) return summary.noteHe;
  const brands = summary.brandCount ?? 0;
  const created = summary.promptsCreated ?? 0;
  const skipped = summary.promptsSkipped ?? 0;
  const total = summary.promptsTotalNow ?? created + skipped;
  return `מותגים: ${brands} · שאלות חדשות: ${created} · דולגו: ${skipped} · סה״כ במערכת: ${total}`;
}
