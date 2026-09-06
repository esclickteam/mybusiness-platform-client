type TranslateFn = (
  key: string,
  options?: Record<string, unknown>,
) => string;

const EXACT: Record<string, string> = {
  "בקרוב — עדיין לא זמין להפעלה": "automations.readiness.comingSoon",
  "חברו WhatsApp Business (Bizuply) כדי להפעיל":
    "automations.readiness.connectWhatsapp",
  "אין תבניות WhatsApp מאושרות (APPROVED) לבחירה":
    "automations.readiness.noApprovedTemplates",
  "האוטומציה עדיין לא זמינה להפעלה במערכת":
    "automations.readiness.notAvailable",
  "חברו Google Calendar במסך החיבורים כדי להפעיל":
    "automations.readiness.connectCalendar",
  "לא ניתן להפעיל תבנית זו": "automations.readiness.cannotEnable",
  "אין טריגר נתמך להפעלת האוטומציה הזו כרגע":
    "automations.readiness.noSupportedTrigger",
  "המתכון עדיין לא זמין להפעלה בחשבון הזה":
    "automations.readiness.recipeNotAvailable",
  "המתכון לא נמצא בשרת": "automations.readiness.recipeMissing",
};

const MISSING_APPROVED =
  /^חסרות תבניות WhatsApp מאושרות:\s*(.+)$/;

export function translateReadinessBlocker(
  t: TranslateFn,
  blocker?: string | null,
) {
  const text = String(blocker || "").trim();
  if (!text) return "";
  const key = EXACT[text];
  if (key) return t(key);
  const missing = text.match(MISSING_APPROVED);
  if (missing) {
    return t("automations.readiness.missingApproved", {
      names: missing[1],
    });
  }
  return text;
}
