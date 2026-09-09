import type { TranslateFn } from "./partnerCatalogCopy";

export type PartnerDemoTaskLike = {
  title?: string | null;
  titleKey?: string | null;
};

export type PartnerDemoTextInput =
  | string
  | null
  | undefined
  | {
      titleKey?: string | null;
      text?: string | null;
      title?: string | null;
      notes?: string | null;
    };

const DEMO_PREFIX_RE = /^\[(?:Demo|Staging Demo|דמו|דמו סטייג'ינג)\]\s*/i;
const STAGING_PREFIX_RE = /^\[(?:Staging Demo|דמו סטייג'ינג)\]\s*/i;

/** Known Hebrew + English demo/system strings → partner.demo.* keys */
const LEXICON: Record<string, string> = {
  // —— Personas: business names ——
  "סטודיו נועה": "partner.demo.persona.studio-noa.businessName",
  "Noa Studio": "partner.demo.persona.studio-noa.businessName",
  "Studio Noa": "partner.demo.persona.studio-noa.businessName",
  "כהן פתרונות לעסקים": "partner.demo.persona.cohen-solutions.businessName",
  "Cohen Business Solutions": "partner.demo.persona.cohen-solutions.businessName",
  "Cohen Solutions": "partner.demo.persona.cohen-solutions.businessName",
  "Bloom Beauty": "partner.demo.persona.bloom-beauty.businessName",
  "אלון דיגיטל": "partner.demo.persona.alon-digital.businessName",
  "Alon Digital": "partner.demo.persona.alon-digital.businessName",
  "Maya Events": "partner.demo.persona.maya-events.businessName",
  "Green Office": "partner.demo.persona.green-office.businessName",
  "Urban Studio": "partner.demo.persona.urban-studio.businessName",
  "דמו פרימיום מדיה": "partner.demo.persona.premium-client.businessName",
  "Demo Premium Media": "partner.demo.persona.premium-client.businessName",
  "Premium Media Demo": "partner.demo.persona.premium-client.businessName",

  // —— Personas: contact names ——
  "נועה לוי": "partner.demo.persona.studio-noa.contactName",
  "Noa Levi": "partner.demo.persona.studio-noa.contactName",
  "יוסי כהן": "partner.demo.persona.cohen-solutions.contactName",
  "Yossi Cohen": "partner.demo.persona.cohen-solutions.contactName",
  "מיכל פרח": "partner.demo.persona.bloom-beauty.contactName",
  "Michal Perach": "partner.demo.persona.bloom-beauty.contactName",
  "Michal Flower": "partner.demo.persona.bloom-beauty.contactName",
  "אלון מזרחי": "partner.demo.persona.alon-digital.contactName",
  "Alon Mizrahi": "partner.demo.persona.alon-digital.contactName",
  "מאיה שרון": "partner.demo.persona.maya-events.contactName",
  "Maya Sharon": "partner.demo.persona.maya-events.contactName",
  "דני ירוק": "partner.demo.persona.green-office.contactName",
  "Dani Yarok": "partner.demo.persona.green-office.contactName",
  "Dani Green": "partner.demo.persona.green-office.contactName",
  "רועי עירוני": "partner.demo.persona.urban-studio.contactName",
  "Roi Ironi": "partner.demo.persona.urban-studio.contactName",
  "Roi Urban": "partner.demo.persona.urban-studio.contactName",
  "שירה גולן": "partner.demo.persona.premium-client.contactName",
  "Shira Golan": "partner.demo.persona.premium-client.contactName",

  // —— Contact notes (showcase + staging) ——
  "סטודיו לצילום. הפרטנר מנהל את החשבון ומרוויח 15% מכל עסקה.":
    "partner.demo.persona.studio-noa.contactNotes",
  "Photography studio. The partner manages the account and earns 15% on every sale.":
    "partner.demo.persona.studio-noa.contactNotes",
  "סטודיו לצילום ועיצוב. הפרטנר מנהל את חשבון Bizuply במלואו.":
    "partner.demo.persona.studio-noa.contactNotesAlt",
  "Photography and design studio. The partner fully manages the Bizuply account.":
    "partner.demo.persona.studio-noa.contactNotesAlt",
  "משרד ייעוץ. ניהול משותף — עמלה באחוזים מכל חידוש.":
    "partner.demo.persona.cohen-solutions.contactNotes",
  "Consulting firm. Shared management — percent commission on every renewal.":
    "partner.demo.persona.cohen-solutions.contactNotes",
  "משרד ייעוץ. ניהול משותף — הפרטנר על הקמה, הלקוח על יום-יום.":
    "partner.demo.persona.cohen-solutions.contactNotesAlt",
  "Consulting firm. Shared management — partner handles setup, customer handles day-to-day.":
    "partner.demo.persona.cohen-solutions.contactNotesAlt",
  "מכון יופי. הלקוחה מנהלת לבד אחרי ההקמה.":
    "partner.demo.persona.bloom-beauty.contactNotes",
  "Beauty studio. The customer manages alone after setup.":
    "partner.demo.persona.bloom-beauty.contactNotes",
  "מכון יופי. הלקוחה מנהלת את העסק בעצמה אחרי ההקמה.":
    "partner.demo.persona.bloom-beauty.contactNotesAlt",
  "Beauty studio. The customer runs the business herself after setup.":
    "partner.demo.persona.bloom-beauty.contactNotesAlt",
  "חשבון פעיל — כניסה לניהול מלא עם CRM, לידים וקמפיינים.":
    "partner.demo.persona.alon-digital.contactNotes",
  "Active account — full management access with CRM, leads, and campaigns.":
    "partner.demo.persona.alon-digital.contactNotes",
  "ממתין לתשלום הלקוח לפני הפעלה.":
    "partner.demo.persona.alon-digital.contactNotesAlt",
  "Waiting for customer payment before activation.":
    "partner.demo.persona.alon-digital.contactNotesAlt",
  "חשבון פעיל לניהול מלא — CRM, לידים, יומן וקמפיינים.":
    "partner.demo.persona.maya-events.contactNotes",
  "Active account for full management — CRM, leads, calendar, and campaigns.":
    "partner.demo.persona.maya-events.contactNotes",
  "ליד חדש מאירוע נטוורקינג. עדיין בלי מוצרים.":
    "partner.demo.persona.maya-events.contactNotesAlt",
  "New lead from a networking event. No products yet.":
    "partner.demo.persona.maya-events.contactNotesAlt",
  "התשלום נכשל. לא מפעילים הרשאות עד להסדרה.":
    "partner.demo.persona.green-office.contactNotes",
  "Payment failed. Permissions stay off until resolved.":
    "partner.demo.persona.green-office.contactNotes",
  "הושעה אחרי פיגור ממושך.": "partner.demo.persona.urban-studio.contactNotes",
  "Suspended after prolonged overdue payment.":
    "partner.demo.persona.urban-studio.contactNotes",
  "לקוח עם סל רחב: מנוי, אתר, הקמת אוטומציות ומסלול אוטומציות Growth.":
    "partner.demo.persona.premium-client.contactNotes",
  "Customer with a wide basket: plan, website, automations setup, and Growth automations.":
    "partner.demo.persona.premium-client.contactNotes",

  // —— Tasks ——
  "שיחת הדרכה": "partner.demo.task.onboardingCall",
  "Onboarding call": "partner.demo.task.onboardingCall",
  "Training call": "partner.demo.task.onboardingCall",
  "מעקב אחרי הלקוח": "partner.demo.task.followUpClient",
  "Follow up with the client": "partner.demo.task.followUpClient",
  "Client follow-up": "partner.demo.task.followUpClient",
  "Llamada de incorporación": "partner.demo.task.onboardingCall",
  "Seguimiento del cliente": "partner.demo.task.followUpClient",
  "Chamada de onboarding": "partner.demo.task.onboardingCall",
  "Acompanhamento do cliente": "partner.demo.task.followUpClient",
  "مكالمة تهيئة": "partner.demo.task.onboardingCall",
  "متابعة العميل": "partner.demo.task.followUpClient",
  "מעקב אחרי הלקוחה": "partner.demo.task.followUpClientF",
  "Follow up with the customer": "partner.demo.task.followUpClientF",
  "בדיקת חידוש מנוי": "partner.demo.task.renewalCheck",
  "Check subscription renewal": "partner.demo.task.renewalCheck",
  "Renewal check": "partner.demo.task.renewalCheck",
  "Subscription renewal check": "partner.demo.task.renewalCheck",
  "Revisión de renovación": "partner.demo.task.renewalCheck",
  "Verificação de renovação": "partner.demo.task.renewalCheck",
  "שיחת שביעות רצון": "partner.demo.task.satisfactionCall",
  "Satisfaction call": "partner.demo.task.satisfactionCall",
  "סיור במוצרים": "partner.demo.task.productTour",
  "Product tour": "partner.demo.task.productTour",
  "לשלוח הצעת מחיר": "partner.demo.task.sendQuote",
  "Send a quote": "partner.demo.task.sendQuote",
  "Send quote": "partner.demo.task.sendQuote",
  "טיפול בבעיית תשלום": "partner.demo.task.paymentIssue",
  "Resolve payment issue": "partner.demo.task.paymentIssue",
  "העלאת תכנים לאתר": "partner.demo.task.uploadWebsiteContent",
  "Upload website content": "partner.demo.task.uploadWebsiteContent",

  // —— Notes ——
  "נשלחה הצעת מחיר": "partner.demo.note.quoteSent",
  "Quote sent": "partner.demo.note.quoteSent",
  "הלקוחה אישרה חבילה חודשית": "partner.demo.note.monthlyApprovedF",
  "The customer approved a monthly package": "partner.demo.note.monthlyApprovedF",
  "נקבעה שיחת הדרכה": "partner.demo.note.onboardingScheduled",
  "Onboarding call scheduled": "partner.demo.note.onboardingScheduled",
  "הוספנו תוסף אתר": "partner.demo.note.websiteAddonAdded",
  "Added website add-on": "partner.demo.note.websiteAddonAdded",
  "הלקוח רואה את העמלה הצפויה בדשבורד": "partner.demo.note.commissionVisible",
  "The customer sees expected commission on the dashboard":
    "partner.demo.note.commissionVisible",
  "הושלמה הקמה": "partner.demo.note.setupComplete",
  "Setup completed": "partner.demo.note.setupComplete",
  "הלקוח שילם והחשבון הופעל": "partner.demo.note.paidAndActivated",
  "Customer paid and the account was activated": "partner.demo.note.paidAndActivated",
  "החשבון הופעל להצגת ניהול מלא": "partner.demo.note.activatedForDemo",
  "Account activated to showcase full management": "partner.demo.note.activatedForDemo",
  "הלקוח ביקש להוסיף אתר": "partner.demo.note.requestedWebsite",
  "Customer asked to add a website": "partner.demo.note.requestedWebsite",
  "הוספנו תוסף אתר למנוי הקיים": "partner.demo.note.websiteAddonOnPlan",
  "Added website add-on to the existing plan": "partner.demo.note.websiteAddonOnPlan",
  "הלקוח אישר את המחיר הסופי": "partner.demo.note.finalPriceApproved",
  "Customer approved the final price": "partner.demo.note.finalPriceApproved",
  "הושלמה הקמה. הלקוחה ממשיכה לבד": "partner.demo.note.setupDoneSolo",
  "Setup completed. The customer continues alone": "partner.demo.note.setupDoneSolo",
  "נשלחה הצעת מחיר לאתר": "partner.demo.note.websiteQuoteSent",
  "Website quote sent": "partner.demo.note.websiteQuoteSent",
  "שיחת היכרות ראשונית": "partner.demo.note.introCall",
  "Initial intro call": "partner.demo.note.introCall",
  "תשלום נכשל": "partner.demo.note.paymentFailed",
  "Payment failed": "partner.demo.note.paymentFailed",
  "נשלחה תזכורת גבייה": "partner.demo.note.collectionReminder",
  "Collection reminder sent": "partner.demo.note.collectionReminder",
  "החשבון הושהה": "partner.demo.note.accountSuspended",
  "Account suspended": "partner.demo.note.accountSuspended",
  "יש לשמור על הקשר למקרה שיחזרו": "partner.demo.note.keepInTouch",
  "Stay in touch in case they return": "partner.demo.note.keepInTouch",
  "אושר סל פרימיום": "partner.demo.note.premiumBasketApproved",
  "Premium basket approved": "partner.demo.note.premiumBasketApproved",
  "נקבעה שיחת הדרכה לאוטומציות": "partner.demo.note.automationsOnboarding",
  "Automations onboarding call scheduled": "partner.demo.note.automationsOnboarding",

  // —— Product / plan display strings ——
  "מנוי Bizuply חודשי": "partner.demo.product.monthlyBizuply",
  "Bizuply monthly plan": "partner.demo.product.monthlyBizuply",
  "Bizuply monthly subscription": "partner.demo.product.monthlyBizuply",
  "תוסף אתר": "partner.demo.product.websiteAddon",
  "Website add-on": "partner.demo.product.websiteAddon",
  "אתר בלבד": "partner.demo.product.websiteOnly",
  "Website only": "partner.demo.product.websiteOnly",
  "רישיון שימוש במערכת": "partner.demo.product.systemLicense",
  "System usage license": "partner.demo.product.systemLicense",
  "License to use the system": "partner.demo.product.systemLicense",
  "אחוזים בלבד": "partner.demo.product.percentOnly",
  "Percent only": "partner.demo.product.percentOnly",
  "Percentage only": "partner.demo.product.percentOnly",
  "אתר + מנוי": "partner.demo.product.websitePlusPlan",
  "Website + subscription": "partner.demo.product.websitePlusPlan",
  "Website + plan": "partner.demo.product.websitePlusPlan",
  "אוטומציות Growth": "partner.demo.product.automationsGrowth",
  "Automations Growth": "partner.demo.product.automationsGrowth",
  "Growth automations": "partner.demo.product.automationsGrowth",

  // —— Agency / referral extras ——
  "סוכנות דמו — אחוזים בלבד": "partner.demo.agency.percentOnlyName",
  "Demo agency — percent only": "partner.demo.agency.percentOnlyName",
  "פרטנר דמו חינמי": "partner.demo.agency.freePartnerName",
  "Free demo partner": "partner.demo.agency.freePartnerName",
  "Free Demo Partner": "partner.demo.agency.freePartnerName",
  "Socio demo gratuito": "partner.demo.agency.freePartnerName",
  "Parceiro demo gratuito": "partner.demo.agency.freePartnerName",
  "شريك تجريبي مجاني": "partner.demo.agency.freePartnerName",
  "Partner demo gratuito": "partner.demo.agency.freePartnerName",
  "ליה כהן": "partner.demo.agency.teamLia",
  "Lia Cohen": "partner.demo.agency.teamLia",
  "דנה שמש": "partner.demo.agency.referralDana",
  "Dana Shemesh": "partner.demo.agency.referralDana",
  "שמש דיגיטל": "partner.demo.agency.referralBusiness",
  "Shemesh Digital": "partner.demo.agency.referralBusiness",
  "סטודיו דמו ללקוחות": "partner.demo.agency.customerStudio",
  "Demo customer studio": "partner.demo.agency.customerStudio",
  "לקוח דמו חינמי": "partner.demo.agency.freeCustomer",
  "Free demo customer": "partner.demo.agency.freeCustomer",
};

function normalizeLookup(value: string) {
  return String(value || "")
    .replace(/\u200f|\u200e/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripDemoPrefix(raw: string): {
  core: string;
  kind: "demo" | "staging" | null;
} {
  const text = normalizeLookup(raw);
  if (!text) return { core: "", kind: null };
  if (STAGING_PREFIX_RE.test(text)) {
    return { core: text.replace(STAGING_PREFIX_RE, "").trim(), kind: "staging" };
  }
  if (DEMO_PREFIX_RE.test(text)) {
    return { core: text.replace(DEMO_PREFIX_RE, "").trim(), kind: "demo" };
  }
  return { core: text, kind: null };
}

function resolveKey(t: TranslateFn, key: string, fallback = ""): string {
  const trimmed = String(key || "").trim();
  if (!trimmed) return fallback;
  const translated = t(trimmed, { defaultValue: "" });
  if (translated && translated !== trimmed) return translated;
  if (translated) return translated;
  return fallback;
}

function applyPrefix(t: TranslateFn, value: string, kind: "demo" | "staging" | null) {
  if (!kind || !value) return value;
  const prefix = resolveKey(
    t,
    kind === "staging" ? "partner.demo.prefix.stagingDemo" : "partner.demo.prefix.demo",
    kind === "staging" ? "[Staging Demo]" : "[Demo]",
  );
  return `${prefix} ${value}`.trim();
}

function lexiconLookup(raw: string): string | null {
  const direct = LEXICON[normalizeLookup(raw)];
  if (direct) return direct;
  const { core } = stripDemoPrefix(raw);
  if (core && core !== normalizeLookup(raw)) {
    return LEXICON[core] || null;
  }
  return null;
}

/**
 * Localize known demo/system text. Unknown strings pass through as real user content.
 * Accepts a string or an object with titleKey / text / title / notes.
 */
export function localizePartnerDemoText(t: TranslateFn, text?: PartnerDemoTextInput): string {
  if (text && typeof text === "object") {
    const titleKey = String(text.titleKey || "").trim();
    if (titleKey) {
      const fromKey = resolveKey(t, titleKey);
      if (fromKey) return fromKey;
    }
    return localizePartnerDemoText(
      t,
      text.text ?? text.title ?? text.notes ?? "",
    );
  }

  const raw = String(text ?? "");
  if (!raw.trim()) return raw;

  const { core, kind } = stripDemoPrefix(raw);
  const key = lexiconLookup(raw) || (core ? LEXICON[core] : null);
  if (!key) return raw;

  const translated = resolveKey(t, key, core || raw);
  return applyPrefix(t, translated, kind);
}

/**
 * Localize demo business/contact names. Prefers lexicon match, then personaKey.
 */
export function localizePartnerDemoName(
  t: TranslateFn,
  name?: string | null,
  options?: {
    personaKey?: string | null;
    field?: "businessName" | "contactName" | "contactNotes";
  },
): string {
  const raw = String(name ?? "");
  if (!raw.trim()) return raw;

  const fromLexicon = localizePartnerDemoText(t, raw);
  if (fromLexicon !== raw) return fromLexicon;

  const personaKey = String(options?.personaKey || "").trim();
  const field = options?.field || "businessName";
  if (personaKey) {
    const { kind } = stripDemoPrefix(raw);
    const fromPersona = resolveKey(t, `partner.demo.persona.${personaKey}.${field}`);
    if (fromPersona) {
      return applyPrefix(t, fromPersona, field === "businessName" ? kind : null);
    }
  }

  return fromLexicon;
}

/**
 * Task title: prefer stable titleKey, then lexicon on title.
 */
export function partnerDemoTaskTitle(
  t: TranslateFn,
  task?: PartnerDemoTaskLike | null,
): string {
  const titleKey = String(task?.titleKey || "").trim();
  if (titleKey) {
    const key = titleKey.startsWith("partner.")
      ? titleKey
      : `partner.demo.task.${titleKey}`;
    const fromKey = resolveKey(t, key);
    if (fromKey) return fromKey;
  }
  return localizePartnerDemoText(t, task?.title);
}

export function partnerDemoProductLabel(
  t: TranslateFn,
  product?: string | null,
  sku?: string | null,
): string {
  const skuKey = String(sku || "").trim();
  if (skuKey) {
    const fromCatalog = resolveKey(t, `partner.catalog.products.${skuKey}.name`);
    if (fromCatalog) return fromCatalog;
  }
  return localizePartnerDemoText(t, product);
}

export { LEXICON as PARTNER_DEMO_LEXICON };
