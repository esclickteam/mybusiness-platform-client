import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import { CrmCard } from "./crm/AdminCrmUi";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

const LINKS = [
  { to: "/admin/customers", title: "לקוחות", text: "חשבונות SaaS, חיוב ומנויים" },
  { to: "/admin/users", title: "משתמשים", text: "כל משתמשי הפלטפורמה" },
  { to: "/admin/create-user", title: "יצירת משתמש", text: "עובד, מנהל, שותף, משווק או חשבון מיוחד" },
  { to: "/admin/businesses", title: "עסקים", text: "עסקי לקוחות בפלטפורמה" },
  { to: "/admin/affiliates", title: "שותפים", text: "תוכנית שותפים" },
  { to: "/admin/marketers", title: "משווקים", text: "משווקי קמפיינים" },
  { to: "/admin/withdrawals", title: "משיכות", text: "בקשות תשלום לשותפים" },
  { to: "/admin/support-chat", title: "צ'אט תמיכה", text: "פניות אנושיות מהאתר" },
  { to: "/admin/early-access", title: "הרשמה מוקדמת", text: "לידים מדף Early Access" },
  { to: "/admin/settings", title: "הגדרות", text: "הגדרות מערכת" },
];

export default function AdminSystemHub() {
  const navigate = useNavigate();
  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <div>
          <p className="text-xs font-black text-[#7C4DFF]">ניהול מערכת</p>
          <h1 className="text-2xl font-black text-purple-950">כלים טכניים</h1>
          <p className="font-bold text-slate-500">
            הנתיבים הישנים נשמרו. מכאן אפשר להגיע ליצירת משתמש, עסקים, שותפים ותמיכה.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((item) => (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate(item.to)}
              className="text-right"
            >
              <CrmCard>
                <h2 className="text-lg font-black text-purple-950">{item.title}</h2>
                <p className="mt-1 font-bold text-slate-600">{item.text}</p>
              </CrmCard>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
