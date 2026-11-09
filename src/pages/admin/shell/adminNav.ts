export type NavItem = {
  path: string;
  label: string;
  labelKey?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

/**
 * Every existing admin route stays reachable. Groups only change where a
 * screen lives in the sidebar — paths, permissions, and data are unchanged.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    label: "דשבורד",
    items: [{ path: "/admin/dashboard", label: "סקירה" }],
  },
  {
    id: "saasOverview",
    label: "סקירה כללית",
    items: [{ path: "/admin/saas", label: "לוח בקרה" }],
  },
  {
    id: "saasSystems",
    label: "ניהול מערכות",
    items: [
      { path: "/admin/saas-systems", label: "עשר המערכות" },
      { path: "/admin/saas-control-center", label: "תבניות המערכות" },
      { path: "/admin/saas-marketplace", label: "קטלוג המכירה" },
    ],
  },
  {
    id: "saasCustomers",
    label: "לקוחות ועסקים",
    items: [
      { path: "/admin/saas-tenants", label: "עסקים על המערכות" },
      { path: "/admin/club", label: "מועדון עסקים" },
      { path: "/admin/early-access", label: "הרשמה מוקדמת" },
    ],
  },
  {
    id: "saasSales",
    label: "מכירות ותשלומים",
    items: [{ path: "/admin/saas-deals", label: "עסקאות והקמה" }],
  },
  {
    id: "saasOps",
    label: "תפעול ותמיכה",
    items: [
      { path: "/admin/support-chat", label: "תמיכה" },
      { path: "/admin/logs", label: "יומן מערכת" },
      { path: "/admin/calendar", label: "יומן" },
    ],
  },
  {
    id: "saasTools",
    label: "כלים מתקדמים",
    items: [
      { path: "/admin/system", label: "כלים" },
      { path: "/admin/ai-usage", label: "שימוש בבינה מלאכותית" },
      { path: "/admin/geo-intel", label: "נראות במנועי מענה" },
    ],
  },
  {
    id: "businesses",
    label: "עסקים",
    items: [{ path: "/admin/businesses", label: "כל העסקים" }],
  },
  {
    id: "crm",
    label: "CRM",
    items: [
      { path: "/admin/crm", label: "סקירה" },
      { path: "/admin/customers", label: "לקוחות" },
      { path: "/admin/crm/customers", label: "לידים" },
      { path: "/admin/crm/pipeline", label: "Pipeline" },
      { path: "/admin/crm/tasks", label: "משימות" },
      { path: "/admin/crm/follow-ups", label: "מעקבים" },
      { path: "/admin/crm/activities", label: "פעילות" },
      { path: "/admin/guided-demos", label: "דמואים" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp API",
    items: [
      { path: "/admin/managed-whatsapp", label: "חיבור מנוהל" },
      { path: "/admin/crm/whatsapp", label: "תיבת הודעות" },
    ],
  },
  {
    id: "campaigns",
    label: "קמפיינים",
    items: [{ path: "/admin/marketers", label: "משווקים" }],
  },
  {
    id: "automations",
    label: "אוטומציות",
    items: [{ path: "/admin/automations", label: "אוטומציות" }],
  },
  {
    id: "websites",
    label: "אתרים",
    items: [{ path: "/admin/site-edit", label: "תוכן האתר" }],
  },
  {
    id: "billing",
    label: "חיוב",
    items: [
      { path: "/admin/plans", label: "חבילות ומחירים" },
      { path: "/admin/withdrawals", label: "משיכות" },
      { path: "/admin/affiliate-payouts", label: "תשלומי שותפים" },
    ],
  },
  {
    id: "partners",
    label: "שותפים",
    items: [
      { path: "/admin/global-partners", label: "שותפים גלובליים" },
      { path: "/admin/partner-center", label: "מרכז שותפים" },
      { path: "/admin/partners", label: "פרטנרים" },
      { path: "/admin/affiliates", label: "אפיליאייטים" },
      { path: "/admin/partner-agreements", label: "הסכמים" },
      { path: "/admin/partners/referrals", label: "צירופים" },
      { path: "/admin/partners/attention", label: "טיפול נדרש" },
      { path: "/admin/settings/partner-program", label: "תמחור תת-פרטנר" },
    ],
  },
  {
    id: "users",
    label: "משתמשים",
    items: [
      { path: "/admin/users", label: "כל המשתמשים" },
      { path: "/admin/create-user", label: "יצירת משתמש" },
      { path: "/admin/roles", label: "תפקידים" },
    ],
  },
  {
    id: "settings",
    label: "הגדרות",
    items: [
      { path: "/admin/settings", label: "הגדרות כלליות" },
      { path: "/admin/settings/legal", label: "פרופיל משפטי" },
      { path: "/admin/privacy-requests", label: "בקשות פרטיות" },
    ],
  },
];

export function isNavItemActive(path: string, pathname: string) {
  if (path === "/admin/dashboard") {
    return pathname === "/admin" || pathname === "/admin/dashboard";
  }

  if (path === "/admin/crm" || path === "/admin/settings") {
    return pathname === path;
  }

  if (path === "/admin/partners") {
    return (
      pathname === path ||
      /^\/admin\/partners\/(?!referrals(?:\/|$)|attention(?:\/|$))[^/]+/.test(pathname)
    );
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function findNavMatch(pathname: string) {
  let best: { group: NavGroup; item: NavItem } | null = null;

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (!isNavItemActive(item.path, pathname)) continue;
      if (!best || item.path.length > best.item.path.length) {
        best = { group, item };
      }
    }
  }

  return best;
}
