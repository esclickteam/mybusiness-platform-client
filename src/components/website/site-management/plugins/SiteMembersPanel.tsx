import React, { useCallback, useEffect, useState } from "react";
import { KeyRound, Plus, Trash2, UserRound } from "lucide-react";

import {
  createSiteMember,
  deleteSiteMember,
  listSiteMembers,
  resetSiteMemberPassword,
  updateSiteMember,
} from "../../../../api/siteMembersAdminApi";
import type { SiteMemberProfile } from "../../../../api/siteMemberAuthApi";
import BizuplyLoader from "../../../ui/BizuplyLoader";
import {
  btnPrimary,
  btnSecondary,
  inputBase,
  panelSection,
} from "../siteManagementUi";
import type { PluginPanelProps } from "./SitePluginPanelFrame";

const STATUS_OPTIONS = [
  { value: "active", label: "פעיל" },
  { value: "pending", label: "ממתין" },
  { value: "blocked", label: "חסום" },
];

export default function SiteMembersPanel({ siteId }: PluginPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<SiteMemberProfile[]>([]);
  const [pluginEnabled, setPluginEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    status: "active" as SiteMemberProfile["status"],
  });

  const loadMembers = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    setError("");
    try {
      const data = await listSiteMembers(siteId);
      setMembers(data.members);
      setPluginEnabled(data.pluginEnabled);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await createSiteMember(siteId, form);
      setForm({
        email: "",
        username: "",
        displayName: "",
        password: "",
        status: "active",
      });
      setMessage("המשתמש נוצר בהצלחה");
      await loadMembers();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה ביצירה");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(
    memberId: string,
    status: SiteMemberProfile["status"]
  ) {
    try {
      await updateSiteMember(siteId, memberId, { status });
      await loadMembers();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה בעדכון");
    }
  }

  async function handleDelete(memberId: string) {
    if (!window.confirm("למחוק את המשתמש?")) return;
    try {
      await deleteSiteMember(siteId, memberId);
      await loadMembers();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה במחיקה");
    }
  }

  async function handleResetPassword(memberId: string) {
    const password = window.prompt("הזינו סיסמה חדשה (לפחות 6 תווים):");
    if (!password || password.length < 6) return;

    try {
      await resetSiteMemberPassword(siteId, memberId, password);
      setMessage("הסיסמה עודכנה");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה באיפוס");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <BizuplyLoader />
      </div>
    );
  }

  if (!pluginEnabled) {
    return (
      <div className={panelSection}>
        <p className="text-sm font-bold text-slate-600">
          התקינו את תוסף &quot;התחברות ואזור אישי&quot; מחנות התוספים כדי לנהל
          משתמשים לאתר.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={panelSection}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <UserRound size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">משתמשי האתר</h2>
            <p className="text-sm font-medium text-slate-500">
              מערכת התחברות נפרדת לחלוטין מ-BizUply — רק ללקוחות של אתר זה.
            </p>
          </div>
        </div>

        {message ? (
          <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">אימייל</span>
            <input
              className={inputBase}
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">שם משתמש</span>
            <input
              className={inputBase}
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">שם תצוגה</span>
            <input
              className={inputBase}
              value={form.displayName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayName: e.target.value }))
              }
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">סיסמה</span>
            <input
              className={inputBase}
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </label>

          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-slate-700">סטטוס</span>
            <select
              className={inputBase}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as SiteMemberProfile["status"],
                }))
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              <Plus size={16} />
              {saving ? "שומר..." : "הוספת משתמש"}
            </button>
          </div>
        </form>
      </div>

      <div className={panelSection}>
        <h3 className="mb-4 text-base font-black text-slate-800">
          רשימת משתמשים ({members.length})
        </h3>

        {members.length === 0 ? (
          <p className="text-sm font-bold text-slate-500">אין משתמשים עדיין.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-black text-slate-800">
                    {member.displayName || member.username || member.email || "משתמש"}
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    {[member.email, member.username].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className={inputBase + " h-10 min-w-[120px] text-xs"}
                    value={member.status}
                    onChange={(e) =>
                      handleStatusChange(
                        member.id,
                        e.target.value as SiteMemberProfile["status"]
                      )
                    }
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className={btnSecondary + " h-10 text-xs"}
                    onClick={() => handleResetPassword(member.id)}
                  >
                    <KeyRound size={14} />
                    איפוס סיסמה
                  </button>

                  <button
                    type="button"
                    className={btnSecondary + " h-10 text-xs text-rose-600"}
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 size={14} />
                    מחיקה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
