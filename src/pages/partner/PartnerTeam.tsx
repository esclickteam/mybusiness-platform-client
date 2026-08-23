import React, { useEffect, useState } from "react";
import {
  fetchPartnerTeam,
  invitePartnerMember,
  partnerApiError,
  revokePartnerMember,
  updatePartnerMember,
} from "../../lib/partnerApi";
import type { PartnerPermission } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
} from "../../components/partner/partnerUi";

const PERMISSIONS: Array<{ key: PartnerPermission; label: string }> = [
  { key: "view_clients", label: "צפייה בלקוחות" },
  { key: "create_clients", label: "יצירת לקוחות" },
  { key: "edit_clients", label: "עריכת לקוחות" },
  { key: "manage_subscriptions", label: "ניהול מנויים" },
  { key: "manage_pricing", label: "ניהול תמחור" },
  { key: "manage_permissions", label: "ניהול הרשאות" },
  { key: "view_financial_reports", label: "דוחות כספיים" },
  { key: "manage_storefront", label: "ניהול חנות" },
  { key: "manage_partner_settings", label: "הגדרות פרטנר" },
];

export default function PartnerTeam() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: ["view_clients"] as PartnerPermission[],
  });

  async function refresh() {
    const next = await fetchPartnerTeam();
    setData(next);
  }

  useEffect(() => {
    refresh().catch((err) => setError(partnerApiError(err, "שגיאה בטעינת צוות")));
  }, []);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await invitePartnerMember(form);
      setForm({ name: "", email: "", password: "", permissions: ["view_clients"] });
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה בהזמנה");
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="צוות"
        title="צוות פרטנר"
        subtitle={`מגבלת מושבים: ${data?.used || 0} / ${data?.limit ?? 0} (מעבר לבעלים)`}
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={invite} className="grid gap-3">
        <PartnerCard className="grid gap-3 p-5">
        <PartnerInput
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="שם"
        />
        <PartnerInput
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="אימייל"
        />
        <PartnerInput
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="סיסמה"
        />
        <div className="grid gap-1 text-sm">
          {PERMISSIONS.map((item) => (
            <label key={item.key}>
              <input
                type="checkbox"
                checked={form.permissions.includes(item.key)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.permissions, item.key]
                    : form.permissions.filter((key) => key !== item.key);
                  setForm({ ...form, permissions: next });
                }}
              />{" "}
              {item.label}
            </label>
          ))}
        </div>
        <PartnerPrimaryButton type="submit">הזמן חבר צוות</PartnerPrimaryButton>
        </PartnerCard>
      </form>

      <div className="space-y-3">
        {(data?.members || []).map((member: any) => (
          <article key={member._id} className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <p className="font-black">
              {member.user?.name || "משתמש"} · {member.role} · {member.status}
            </p>
            <p className="text-sm text-slate-500">{member.user?.email}</p>
            {member.role === "owner" ? (
              <p className="mt-2 text-xs font-bold text-slate-500">לבעלים יש גישה מלאה תמיד</p>
            ) : (
              <div className="mt-2 grid gap-1 text-sm">
                {PERMISSIONS.map((item) => (
                  <label key={item.key}>
                    <input
                      type="checkbox"
                      checked={(member.permissions || []).includes(item.key)}
                      onChange={async (e) => {
                        const current = new Set(member.permissions || []);
                        if (e.target.checked) current.add(item.key);
                        else current.delete(item.key);
                        await updatePartnerMember(member._id, [...current] as PartnerPermission[]);
                        await refresh();
                      }}
                    />{" "}
                    {item.label}
                  </label>
                ))}
                <button
                  type="button"
                  onClick={async () => {
                    await revokePartnerMember(member._id);
                    await refresh();
                  }}
                  className="mt-2 w-fit rounded-xl border border-rose-200 px-3 py-1 text-sm font-bold text-rose-700"
                >
                  בטל גישה
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
