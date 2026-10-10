import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

const LINKS = [
  { to: "/admin/customers", title: "לקוחות", text: "חשבונות SaaS, חיוב ומנויים" },
  { to: "/admin/users", title: "משתמשים", text: "כל משתמשי הפלטפורמה" },
  { to: "/admin/create-user", title: "יצירת משתמש", text: "עובד, מנהל, שותף, משווק או חשבון מיוחד" },
  { to: "/admin/businesses", title: "עסקים", text: "עסקי לקוחות בפלטפורמה" },
  { to: "/admin/affiliates", title: "שותפים", text: "תוכנית שותפים" },
  { to: "/admin/marketers", title: "משווקים", text: "משווקי קמפיינים" },
  { to: "/admin/partners", title: "פרטנרים", text: "תוכנית Partner, עמלות ומשיכות" },
  { to: "/admin/partner-agreements", title: "הסכמי פרטנר", text: "תבנית הסכם, טריטוריה ו-PDF" },
  { to: "/admin/withdrawals", title: "משיכות", text: "בקשות תשלום לשותפים" },
  { to: "/admin/support-chat", title: "צ'אט תמיכה", text: "פניות אנושיות מהאתר" },
  { to: "/admin/early-access", title: "הרשמה מוקדמת", text: "לידים מדף Early Access" },
  { to: "/admin/settings", title: "הגדרות", text: "הגדרות מערכת" },
  { to: "/admin/ai-usage", title: "AI Usage", text: "עלות, טוקנים וקריאות OpenAI" },
];

export default function AdminSystemHub() {
  const navigate = useNavigate();
  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <AdminPageHeader
          title="כלים"
          description="קיצורי דרך למסכי הניהול."
        />
        <div className="biz-shortcut-grid">
          {LINKS.map((item) => (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate(item.to)}
              className="biz-shortcut"
            >
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
