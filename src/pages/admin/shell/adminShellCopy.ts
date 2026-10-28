import { NAV_GROUPS } from "./adminNav";

const HEBREW_GROUPS: Record<string, string> = {
  dashboard: "דשבורד",
  platform: "פלטפורמה",
  businesses: "עסקים",
  crm: "CRM",
  whatsapp: "WhatsApp API",
  campaigns: "קמפיינים",
  automations: "אוטומציות",
  websites: "אתרים",
  billing: "חיוב",
  partners: "שותפים",
  users: "משתמשים",
  settings: "הגדרות",
};

const ENGLISH_GROUPS: Record<string, string> = {
  dashboard: "Dashboard",
  platform: "Platform",
  businesses: "Businesses",
  crm: "CRM",
  whatsapp: "WhatsApp API",
  campaigns: "Campaigns",
  automations: "Automations",
  websites: "Websites",
  billing: "Billing",
  partners: "Partners",
  users: "Users",
  settings: "Settings",
};

const HEBREW_ITEMS: Record<string, string> = {
  "/admin/dashboard": "סקירה",
  "/admin/saas-marketplace": "SaaS Marketplace",
  "/admin/saas-control-center": "SaaS Control Center",
  "/admin/saas-deals": "עסקאות SaaS",
  "/admin/saas-tenants": "מערכות SaaS",
  "/admin/club": "מועדון עסקים",
  "/admin/early-access": "הרשמה מוקדמת",
  "/admin/calendar": "יומן",
  "/admin/system": "כלים",
  "/admin/ai-usage": "שימוש ב-AI",
  "/admin/logs": "יומן מערכת",
  "/admin/support-chat": "תמיכה",
  "/admin/businesses": "כל העסקים",
  "/admin/crm": "סקירה",
  "/admin/customers": "לקוחות",
  "/admin/crm/customers": "לידים",
  "/admin/crm/pipeline": "Pipeline",
  "/admin/crm/tasks": "משימות",
  "/admin/crm/follow-ups": "מעקבים",
  "/admin/crm/activities": "פעילות",
  "/admin/guided-demos": "דמואים",
  "/admin/managed-whatsapp": "חיבור מנוהל",
  "/admin/crm/whatsapp": "תיבת הודעות",
  "/admin/marketers": "משווקים",
  "/admin/automations": "אוטומציות",
  "/admin/site-edit": "תוכן האתר",
  "/admin/plans": "חבילות ומחירים",
  "/admin/withdrawals": "משיכות",
  "/admin/affiliate-payouts": "תשלומי שותפים",
  "/admin/partner-center": "מרכז שותפים",
  "/admin/partners": "פרטנרים",
  "/admin/affiliates": "אפיליאייטים",
  "/admin/partner-agreements": "הסכמים",
  "/admin/partners/referrals": "צירופים",
  "/admin/partners/attention": "טיפול נדרש",
  "/admin/settings/partner-program": "תמחור תת-פרטנר",
  "/admin/users": "כל המשתמשים",
  "/admin/create-user": "יצירת משתמש",
  "/admin/roles": "תפקידים",
  "/admin/settings": "הגדרות כלליות",
  "/admin/settings/legal": "פרופיל משפטי",
};

const ENGLISH_ITEMS: Record<string, string> = {
  "/admin/dashboard": "Overview",
  "/admin/saas-marketplace": "SaaS Marketplace",
  "/admin/saas-control-center": "SaaS Control Center",
  "/admin/saas-deals": "SaaS deals",
  "/admin/saas-tenants": "SaaS systems",
  "/admin/club": "Business club",
  "/admin/early-access": "Early access",
  "/admin/calendar": "Calendar",
  "/admin/system": "Tools",
  "/admin/ai-usage": "AI usage",
  "/admin/logs": "System log",
  "/admin/support-chat": "Support",
  "/admin/businesses": "All businesses",
  "/admin/crm": "Overview",
  "/admin/customers": "Customers",
  "/admin/crm/customers": "Leads",
  "/admin/crm/pipeline": "Pipeline",
  "/admin/crm/tasks": "Tasks",
  "/admin/crm/follow-ups": "Follow-ups",
  "/admin/crm/activities": "Activity",
  "/admin/guided-demos": "Demos",
  "/admin/managed-whatsapp": "Managed connection",
  "/admin/crm/whatsapp": "Inbox",
  "/admin/marketers": "Marketers",
  "/admin/automations": "Automations",
  "/admin/site-edit": "Site content",
  "/admin/plans": "Plans and pricing",
  "/admin/withdrawals": "Withdrawals",
  "/admin/affiliate-payouts": "Affiliate payouts",
  "/admin/partner-center": "Partner center",
  "/admin/partners": "Partners",
  "/admin/affiliates": "Affiliates",
  "/admin/partner-agreements": "Agreements",
  "/admin/partners/referrals": "Referrals",
  "/admin/partners/attention": "Needs attention",
  "/admin/settings/partner-program": "Sub-partner pricing",
  "/admin/users": "All users",
  "/admin/create-user": "Create user",
  "/admin/roles": "Roles",
  "/admin/settings": "General settings",
  "/admin/settings/legal": "Legal profile",
};

const HEBREW_CHROME = {
  openMenu: "פתיחת תפריט",
  closeMenu: "סגירת תפריט",
  search: "חיפוש",
  searchScreens: "חיפוש במסכי הניהול",
  incomingCall: "שיחה נכנסת",
  activeCall: "שיחה פעילה",
  adminFallback: "מנהל",
  systemAdmin: "מנהל מערכת",
  settings: "הגדרות",
  softphone: "סופטפון",
  logout: "התנתקות",
  navigation: "ניווט אדמין",
  location: "מיקום",
  adminCrumb: "אדמין",
};

const ENGLISH_CHROME = {
  openMenu: "Open menu",
  closeMenu: "Close menu",
  search: "Search",
  searchScreens: "Search admin screens",
  incomingCall: "Incoming call",
  activeCall: "Active call",
  adminFallback: "Admin",
  systemAdmin: "System admin",
  settings: "Settings",
  softphone: "Softphone",
  logout: "Log out",
  navigation: "Admin navigation",
  location: "Location",
  adminCrumb: "Admin",
};

export type AdminShellCopy = {
  groups: Record<string, string>;
  items: Record<string, string>;
  chrome: typeof HEBREW_CHROME;
};

export function isEnglishAdminLanguage(language?: string) {
  return String(language || "").toLowerCase().startsWith("en");
}

export function adminShellCopy(language?: string): AdminShellCopy {
  if (isEnglishAdminLanguage(language)) {
    return { groups: ENGLISH_GROUPS, items: ENGLISH_ITEMS, chrome: ENGLISH_CHROME };
  }
  return { groups: HEBREW_GROUPS, items: HEBREW_ITEMS, chrome: HEBREW_CHROME };
}

export function adminNavPaths() {
  return NAV_GROUPS.flatMap((group) => group.items.map((item) => item.path));
}
