/**
 * Icon rail for the mobile demo sketch.
 * Same entries, order, and lucide icons as BusinessWorkspaceNav for a full
 * BizUply workspace that includes WhatsApp API and Meta Campaigns.
 * Hidden product entries (My SaaS, SaaS bridge, Global Business Club) stay out.
 * There is no separate Website item in that sidebar.
 */
export const MOBILE_DEMO_RAIL = [
  { key: "dashboard", icon: "LayoutDashboard", he: "דשבורד", en: "Dashboard" },
  { key: "crm", icon: "CircleUserRound", he: "מערכת CRM", en: "CRM System" },
  { key: "automations", icon: "Workflow", he: "אוטומציות", en: "Automations" },
  { key: "whatsapp", icon: "MessageCircle", he: "WhatsApp API", en: "WhatsApp API" },
  { key: "meta", icon: "Megaphone", he: "Meta Campaigns", en: "Meta Campaigns" },
  { key: "collab", icon: "Handshake", he: "שיתופי פעולה", en: "Collaborations" },
  { key: "advisor", icon: "Sparkles", he: "היועץ העסקי", en: "Business Advisor" },
  { key: "edit", icon: "PencilLine", he: "עריכת עמוד עסקי", en: "Edit Business Page" },
  { key: "profile", icon: "UserRound", he: "צפייה בפרופיל הציבורי", en: "View Public Profile" },
  { key: "build", icon: "LayoutTemplate", he: "בניית אתרים", en: "Build Website" },
  { key: "security", icon: "Shield", he: "סורק אבטחה", en: "Security scanner" },
  { key: "billing", icon: "CreditCard", he: "חיוב ומנוי", en: "Billing & Subscription" },
  { key: "help", icon: "HelpCircle", he: "מרכז עזרה", en: "Help Center" },
] as const;

export type MobileDemoRailKey = (typeof MOBILE_DEMO_RAIL)[number]["key"];
export type MobileDemoIconName = (typeof MOBILE_DEMO_RAIL)[number]["icon"];

/** Sample story. Nothing here is a real customer. */
export const MOBILE_DEMO_SCENES = [
  { id: "lead", rail: "dashboard", seconds: 2.5 },
  { id: "crm", rail: "crm", seconds: 2.5 },
  { id: "whatsapp", rail: "whatsapp", seconds: 2.5 },
  { id: "task", rail: "crm", seconds: 2.5 },
  { id: "meeting", rail: "crm", seconds: 2.5 },
  { id: "automations", rail: "automations", seconds: 2.5 },
] as const;

export type MobileDemoSceneId = (typeof MOBILE_DEMO_SCENES)[number]["id"];

export const MOBILE_DEMO_DURATION = MOBILE_DEMO_SCENES.reduce((sum, scene) => sum + scene.seconds, 0);

export const MOBILE_DEMO_WIDTHS = [320, 375, 390, 430] as const;

export function sceneAt(time: number) {
  const duration = MOBILE_DEMO_DURATION;
  const t = ((time % duration) + duration) % duration;
  let cursor = 0;
  for (let index = 0; index < MOBILE_DEMO_SCENES.length; index += 1) {
    const scene = MOBILE_DEMO_SCENES[index];
    const next = cursor + scene.seconds;
    if (t < next || index === MOBILE_DEMO_SCENES.length - 1) {
      return {
        index,
        scene,
        local: scene.seconds === 0 ? 1 : Math.min(1, Math.max(0, (t - cursor) / scene.seconds)),
      };
    }
    cursor = next;
  }
  const last = MOBILE_DEMO_SCENES[MOBILE_DEMO_SCENES.length - 1];
  return { index: MOBILE_DEMO_SCENES.length - 1, scene: last, local: 1 };
}
