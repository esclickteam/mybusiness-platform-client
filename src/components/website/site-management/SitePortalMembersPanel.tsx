import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  KeyRound,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";

import {
  createSitePortalMember,
  deleteSitePortalMember,
  listSitePortalMembers,
  reinviteSitePortalMember,
  updateSitePortalMember,
  type SitePortalPageInfo,
} from "../../../api/sitePortalApi";
import type { SitePortalMember } from "../../../utils/sitePortalSession";
import { btnPrimary, btnSecondary } from "./siteManagementUi";

type Props = {
  siteId: string;
  publicUrl?: string;
};

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "פעיל";
    case "invited":
      return "ממתין להזמנה";
    case "paused":
      return "מושהה";
    case "disabled":
      return "מושבת";
    default:
      return status;
  }
}

export default function SitePortalMembersPanel({ siteId, publicUrl = "" }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<SitePortalMember[]>([]);
  const [portalPages, setPortalPages] = useState<SitePortalPageInfo[]>([]);
  const [loginPath, setLoginPath] = useState("/portal/login");
  const [notice, setNotice] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [assignedPageIds, setAssignedPageIds] = useState<string[]>([]);

  const loginUrl = useMemo(() => {
    const base = String(publicUrl || "").replace(/\/$/, "");
    return base ? `${base}${loginPath}` : loginPath;
  }, [publicUrl, loginPath]);

  const load = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    setError("");

    try {
      const data = await listSitePortalMembers(siteId);
      setMembers(data.members || []);
      setPortalPages(data.portalPages || []);
      setLoginPath(data.loginPath || "/portal/login");
      setAssignedPageIds((prev) =>
        prev.length ? prev : (data.portalPages || []).map((p) => p.id)
      );
    } catch (err: any) {
      setError(err?.message || "שגיאה בטעינת חברי האזור האישי");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSendInvite(true);
    setAssignedPageIds(portalPages.map((p) => p.id));
    setShowForm(false);
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const result = await createSitePortalMember(siteId, {
        fullName,
        email,
        phone,
        password: sendInvite ? undefined : password,
        sendInvite,
        assignedPageIds,
        returnPassword: !sendInvite,
      });

      if (result.inviteUrl) {
        setNotice(`נוצרה הזמנה. קישור: ${result.inviteUrl}`);
        try {
          await navigator.clipboard.writeText(result.inviteUrl);
        } catch {
          /* ignore */
        }
      } else {
        setNotice("החבר נוסף בהצלחה לאזור האישי של האתר.");
      }

      resetForm();
      await load();
    } catch (err: any) {
      setError(err?.message || "יצירת החבר נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(member: SitePortalMember, status: string) {
    try {
      await updateSitePortalMember(siteId, member.id, { status });
      await load();
    } catch (err: any) {
      alert(err?.message || "עדכון נכשל");
    }
  }

  async function handleDelete(member: SitePortalMember) {
    if (!window.confirm(`למחוק את ${member.fullName} מהאזור האישי?`)) return;

    try {
      await deleteSitePortalMember(siteId, member.id);
      await load();
    } catch (err: any) {
      alert(err?.message || "מחיקה נכשלה");
    }
  }

  async function handleReinvite(member: SitePortalMember) {
    try {
      const result = await reinviteSitePortalMember(siteId, member.id);
      setNotice(`קישור הזמנה חדש: ${result.inviteUrl}`);
      try {
        await navigator.clipboard.writeText(result.inviteUrl);
      } catch {
        /* ignore */
      }
      await load();
    } catch (err: any) {
      alert(err?.message || "יצירת הזמנה נכשלה");
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border border-violet-100/70 bg-white p-8 text-center text-sm font-semibold text-slate-500">
        טוען אזור אישי...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-sky-100 bg-gradient-to-l from-sky-50/80 to-white p-5">
        <h3 className="text-base font-bold text-slate-900">
          אזור אישי של האתר הזה
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          התחברות נפרדת לגמרי מחשבון BizUply. כל אתר מנהל את החברים שלו בלבד.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {loginUrl}
          </code>
          <button
            type="button"
            className={btnSecondary + " h-8 px-3 text-xs"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(loginUrl);
                setNotice("קישור ההתחברות הועתק");
              } catch {
                setNotice(loginUrl);
              }
            }}
          >
            <Copy size={14} />
            העתק קישור
          </button>
        </div>
      </div>

      {notice ? (
        <div className="rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {portalPages.length === 0 ? (
        <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          עדיין אין עמודי אזור אישי באתר. בסטודיו סמנו עמוד כ־&quot;אזור
          אישי&quot; ופרסמו את האתר.
        </div>
      ) : (
        <div className="rounded-md border border-violet-100/70 bg-white p-4">
          <p className="text-xs font-bold text-slate-500">עמודי אזור אישי</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {portalPages.map((page) => (
              <span
                key={page.id}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
              >
                {page.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">
          חברים ({members.length})
        </h3>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setShowForm((v) => !v)}
        >
          <UserPlus size={16} />
          הוספת חבר
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-md border border-violet-100/70 bg-white p-5"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">שם מלא</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">אימייל</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">טלפון</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            {!sendInvite ? (
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-slate-600">סיסמה</span>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
            />
            שליחת הזמנה ללקוח (במקום הגדרת סיסמה עכשיו)
          </label>

          {portalPages.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">
                עמודים מורשים
              </p>
              <div className="flex flex-wrap gap-3">
                {portalPages.map((page) => {
                  const checked = assignedPageIds.includes(page.id);
                  return (
                    <label
                      key={page.id}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setAssignedPageIds((prev) =>
                            e.target.checked
                              ? [...prev, page.id]
                              : prev.filter((id) => id !== page.id)
                          );
                        }}
                      />
                      {page.title}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              <Plus size={16} />
              {saving ? "שומר..." : "שמירה"}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={resetForm}
            >
              ביטול
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-md border border-violet-100/70 bg-white">
        {members.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-slate-500">
            עדיין אין חברים באזור האישי של האתר הזה.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {member.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{member.email}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {statusLabel(member.status)}
                    {member.assignedPageIds?.length
                      ? ` · ${member.assignedPageIds.length} עמודים`
                      : " · כל עמודי האזור האישי"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.status === "active" ? (
                    <button
                      type="button"
                      className={btnSecondary + " h-8 px-3 text-xs"}
                      onClick={() => handleStatus(member, "paused")}
                    >
                      השהה
                    </button>
                  ) : member.status === "paused" || member.status === "disabled" ? (
                    <button
                      type="button"
                      className={btnSecondary + " h-8 px-3 text-xs"}
                      onClick={() => handleStatus(member, "active")}
                    >
                      הפעל
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={btnSecondary + " h-8 px-3 text-xs"}
                    onClick={() => handleReinvite(member)}
                    title="יצירת קישור הזמנה חדש"
                  >
                    {member.status === "invited" ? (
                      <RefreshCw size={14} />
                    ) : (
                      <KeyRound size={14} />
                    )}
                    הזמנה
                  </button>

                  <button
                    type="button"
                    className={btnSecondary + " h-8 px-3 text-xs text-rose-600"}
                    onClick={() => handleDelete(member)}
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
