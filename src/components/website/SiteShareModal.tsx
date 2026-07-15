import React, { useEffect, useState } from "react";
import { X, UserPlus, ArrowRightLeft, Mail, Loader2 } from "lucide-react";
import type { MySiteSummary } from "../../api/mySitesApi";
import {
  listSiteCollaborators,
  removeSiteCollaborator,
  revokeSiteInvite,
  shareMySite,
  type SiteCollaborator,
  type SiteShareInvite,
} from "../../api/mySitesApi";

type Props = {
  site: MySiteSummary;
  open: boolean;
  onClose: () => void;
};

export default function SiteShareModal({ site, open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"share" | "transfer">("share");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [collaborators, setCollaborators] = useState<SiteCollaborator[]>([]);
  const [pending, setPending] = useState<SiteShareInvite[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (!open) return;

    setEmail("");
    setMode("share");
    setRole("editor");
    setMessage("");
    setError("");
    setLoadingList(true);

    listSiteCollaborators(site._id)
      .then((data) => {
        setCollaborators(data.collaborators);
        setPending(data.pendingInvites);
      })
      .catch((err) => {
        setError(err?.message || "לא ניתן לטעון את רשימת השותפים");
      })
      .finally(() => setLoadingList(false));
  }, [open, site._id]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("נא להזין כתובת מייל");
      return;
    }

    if (mode === "transfer") {
      const ok = window.confirm(
        `להעביר את הבעלות על "${site.name || "האתר"}" ל־${email.trim()}?\nלאחר האישור בצד השני, האתר יוסר מהחשבון שלכם.`
      );
      if (!ok) return;
    }

    try {
      setSending(true);
      await shareMySite(site._id, {
        email: email.trim(),
        mode,
        role: mode === "share" ? role : undefined,
      });
      setMessage(
        mode === "transfer"
          ? "נשלחה הזמנת העברה למייל. הבעלות תעבור רק אחרי שהצד השני יאשר."
          : "נשלחה הזמנת שיתוף למייל."
      );
      setEmail("");
      const data = await listSiteCollaborators(site._id);
      setCollaborators(data.collaborators);
      setPending(data.pendingInvites);
    } catch (err: any) {
      setError(err?.message || "שליחת ההזמנה נכשלה");
    } finally {
      setSending(false);
    }
  }

  async function handleRemoveCollaborator(id?: string) {
    if (!id) return;
    try {
      const next = await removeSiteCollaborator(site._id, id);
      setCollaborators(next);
    } catch (err: any) {
      setError(err?.message || "הסרת השותף נכשלה");
    }
  }

  async function handleRevokeInvite(id: string) {
    try {
      await revokeSiteInvite(id);
      setPending((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      setError(err?.message || "ביטול ההזמנה נכשל");
    }
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              שיתוף והעברת אתר
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {site.name || "האתר שלי"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              מייל של המשתמש
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-sm outline-none ring-violet-500/20 focus:ring-2"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              מה תרצו לעשות?
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("share")}
                className={`rounded-xl border px-3 py-3 text-right transition ${
                  mode === "share"
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                  <UserPlus className="h-4 w-4" />
                  שיתוף בנוסף
                </div>
                <p className="text-xs text-slate-500">
                  האתר נשאר אצלכם, והשותף מקבל גישה לעריכה או צפייה.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("transfer")}
                className={`rounded-xl border px-3 py-3 text-right transition ${
                  mode === "transfer"
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                  <ArrowRightLeft className="h-4 w-4" />
                  העברה מלאה
                </div>
                <p className="text-xs text-slate-500">
                  הבעלות עוברת רק אליו — האתר יוסר מהרשימה שלכם.
                </p>
              </button>
            </div>
          </div>

          {mode === "share" ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">הרשאה</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("editor")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    role === "editor"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  עריכה
                </button>
                <button
                  type="button"
                  onClick={() => setRole("viewer")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    role === "viewer"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  צפייה בלבד
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "transfer" ? "שליחת הזמנת העברה" : "שליחת הזמנת שיתוף"}
          </button>
        </form>

        <div className="border-t border-slate-100 px-5 py-4">
          <h3 className="mb-2 text-sm font-bold text-slate-800">שותפים והזמנות</h3>

          {loadingList ? (
            <p className="text-sm text-slate-500">טוען...</p>
          ) : (
            <div className="space-y-3">
              {collaborators.length === 0 && pending.length === 0 ? (
                <p className="text-sm text-slate-500">עדיין אין שותפים או הזמנות ממתינות.</p>
              ) : null}

              {collaborators.map((c) => (
                <div
                  key={c._id || c.email}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800" dir="ltr">
                      {c.email || "שותף"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.role === "viewer" ? "צפייה" : "עריכה"}
                    </p>
                  </div>
                  {c._id ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaborator(c._id)}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      הסרה
                    </button>
                  ) : null}
                </div>
              ))}

              {pending.map((invite) => (
                <div
                  key={invite._id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800" dir="ltr">
                      {invite.toEmail}
                    </p>
                    <p className="text-xs text-slate-500">
                      ממתין לאישור ·{" "}
                      {invite.mode === "transfer" ? "העברה" : "שיתוף"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevokeInvite(invite._id)}
                    className="text-xs font-semibold text-slate-600 hover:underline"
                  >
                    ביטול
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
