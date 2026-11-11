import { useMemo, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import { SAAS_SYSTEMS } from "./saas/saasSystems";

const LANGUAGES = [
  ["he", "עברית"],
  ["en", "English"],
  ["es", "Español"],
  ["ar", "العربية"],
] as const;

const STEPS = ["מערכת", "פרטי העסק", "סקירה", "סיום"] as const;

const SUMMARIES: Record<string, string> = {
  tableflow: "ניהול מסעדה, שולחנות והזמנות.",
  dinevo: "תפריט דיגיטלי והזמנות לאורחים.",
  beautyflow: "יומן תורים וניהול מכון יופי.",
  "global-properties": "ניהול נכסים ופניות.",
  cliny: "יומן מרפאה, מטופלים וצוות.",
  fitora: "מנויים, אימונים וניהול מכון.",
  bakeora: "הזמנות, תפריט וניהול מאפייה.",
  shiftly: "סידור משמרות וצוות.",
  meetora: "קביעת פגישות ויומן.",
  agentflow: "סוכני שירות לעסק.",
};

type MailStatus = { status?: string; reason?: string };

type SuccessState = {
  businessName: string;
  systemName: string;
  email: string;
  tenantId: string;
  passwordEmail: MailStatus;
};

const fieldClass = "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500";

function mailLabel(mail?: MailStatus) {
  if (mail?.status === "sent") return "נשלח לספק המייל. אין כאן אישור שההודעה נמסרה לתיבה.";
  if (mail?.status === "failed") return "שליחת המייל נכשלה. אפשר לשלוח שוב.";
  return "סטטוס המייל אינו ידוע.";
}

export default function AdminSaasInternal() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [draft, setDraft] = useState({
    templateSlug: "",
    businessName: "",
    ownerName: "",
    email: "",
    language: "he",
    currency: "ILS",
    timezone: "Asia/Jerusalem",
  });

  const selected = useMemo(
    () => SAAS_SYSTEMS.find((system) => system.slug === draft.templateSlug) || null,
    [draft.templateSlug],
  );
  const readyForReview = Boolean(selected && draft.businessName.trim() && draft.ownerName.trim() && draft.email.includes("@"));

  function detailsError() {
    if (!draft.businessName.trim()) return "יש למלא את שם העסק.";
    if (!draft.ownerName.trim()) return "יש למלא את שם בעל העסק.";
    if (!draft.email.includes("@")) return "יש למלא אימייל תקין.";
    return "";
  }

  async function submit() {
    setError("");
    setPending(true);
    try {
      const { data } = await API.post("/admin/saas-internal", draft);
      setSuccess({
        businessName: String(data.businessName || draft.businessName),
        systemName: selected?.name || draft.templateSlug,
        email: String(data.ownerEmail || draft.email),
        tenantId: String(data.tenantId || ""),
        passwordEmail: data.passwordEmail || { status: "failed" },
      });
      setStep(3);
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "";
      setError(message || "ההקמה נכשלה");
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    if (!success?.tenantId) return;
    setResending(true);
    setError("");
    try {
      const { data } = await API.post("/admin/saas-internal/password-email", {
        tenantId: success.tenantId,
        language: draft.language,
      });
      setSuccess({ ...success, passwordEmail: data.passwordEmail || { status: "failed" } });
    } catch (err) {
      const payload = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string; passwordEmail?: MailStatus } } }).response?.data
        : undefined;
      if (payload?.passwordEmail) setSuccess({ ...success, passwordEmail: payload.passwordEmail });
      setError(payload?.error || "השליחה החוזרת נכשלה");
    } finally {
      setResending(false);
    }
  }

  return (
    <div dir="rtl" className="biz-admin">
      <AdminHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
        <AdminPageHeader
          title="הקמת מערכת פנימית"
          description="מסלול מנהל Bizuply בלבד. נוצר עסק אמיתי, בלי עסקה ובלי תשלום."
        />
        <ol className="mb-5 grid grid-cols-4 gap-2">
          {STEPS.map((label, index) => (
            <li key={label} className={`rounded-md border px-2 py-2 text-center text-xs font-bold md:text-sm ${index === step ? "border-violet-600 bg-violet-600 text-white" : index < step ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-500"}`}>
              {index + 1}. {label}
            </li>
          ))}
        </ol>
        {error ? <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p> : null}

        {step === 0 ? (
          <section className="grid gap-3 sm:grid-cols-2">
            {SAAS_SYSTEMS.map((system) => {
              const open = system.slug === "cliny";
              const active = draft.templateSlug === system.slug;
              return (
                <button
                  key={system.slug}
                  type="button"
                  disabled={!open}
                  onClick={() => { setDraft({ ...draft, templateSlug: system.slug }); setError(""); }}
                  className={`rounded-md border bg-white p-4 text-start ${active ? "border-violet-600 ring-2 ring-violet-200" : "border-slate-200"} ${open ? "" : "cursor-not-allowed opacity-70"}`}
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-600 text-sm font-black text-white">
                    {system.name.slice(0, 1)}
                  </span>
                  <span className="block text-base font-black">{system.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">{SUMMARIES[system.slug]}</span>
                  <span className={`mt-3 block text-xs font-bold ${open ? "text-sky-700" : "text-slate-500"}`}>
                    {open ? "זמינה להקמה פנימית" : "חסומה: ההקמה הפנימית עדיין לא מחוברת למערכת הזו."}
                  </span>
                </button>
              );
            })}
          </section>
        ) : null}

        {step === 1 ? (
          <section className="rounded-md border border-slate-200 bg-white p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold">שם העסק
                <input className={fieldClass} value={draft.businessName} onChange={(event) => setDraft({ ...draft, businessName: event.target.value })} />
              </label>
              <label className="text-sm font-bold">שם בעל העסק
                <input className={fieldClass} value={draft.ownerName} onChange={(event) => setDraft({ ...draft, ownerName: event.target.value })} />
              </label>
              <label className="text-sm font-bold md:col-span-2">אימייל
                <input className={fieldClass} dir="ltr" type="email" autoComplete="off" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
              </label>
              <label className="text-sm font-bold">שפה
                <select className={fieldClass} value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })}>
                  {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              <label className="text-sm font-bold">מטבע
                <select className={fieldClass} value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
                  {["ILS", "USD", "EUR", "GBP"].map((currency) => <option key={currency}>{currency}</option>)}
                </select>
              </label>
              <label className="text-sm font-bold md:col-span-2">אזור זמן
                <select className={fieldClass} dir="ltr" value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}>
                  {["Asia/Jerusalem", "UTC", "Europe/London", "Europe/Berlin", "America/New_York"].map((zone) => <option key={zone}>{zone}</option>)}
                </select>
              </label>
            </div>
            <p className="mt-4 text-sm text-slate-600">מזהה טכני נוצר אוטומטית משם העסק ונשמר בשרת. הוא לא מוצג כאן.</p>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="rounded-md border border-slate-200 bg-white p-4 md:p-6">
            <h2 className="text-lg font-black">סיכום לפני הקמה</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-500">מערכת</dt><dd className="font-bold">{selected?.name}</dd></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-500">שם העסק</dt><dd className="font-bold">{draft.businessName}</dd></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-500">בעל העסק</dt><dd className="font-bold">{draft.ownerName}</dd></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-500">אימייל</dt><dd className="font-bold" dir="ltr">{draft.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">שפה ומטבע</dt><dd className="font-bold">{draft.language} · {draft.currency}</dd></div>
            </dl>
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
              זו יצירת עסק אמיתי בסביבת Production, גם כשהוא מסומן כפנימי. לא תיווצר עסקה ולא יירשם תשלום.
            </p>
          </section>
        ) : null}

        {step === 3 && success ? (
          <section className="rounded-md border border-emerald-200 bg-white p-4 md:p-6">
            <h2 className="text-lg font-black text-emerald-800">העסק הוקם</h2>
            <p className="mt-2 text-sm">{success.businessName} · {success.systemName}</p>
            <p className="mt-1 text-sm" dir="ltr">{success.email}</p>
            <p className="mt-4 text-sm font-bold">{mailLabel(success.passwordEmail)}</p>
            {success.passwordEmail.status !== "sent" ? (
              <button type="button" className="mt-4 rounded-md bg-sky-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60" disabled={resending || !success.tenantId} onClick={resend}>
                {resending ? "שולח שוב..." : "שליחה חוזרת"}
              </button>
            ) : null}
          </section>
        ) : null}

        {step < 3 ? (
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button type="button" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold" disabled={step === 0 || pending} onClick={() => { setError(""); setStep((value) => value - 1); }}>
              חזרה
            </button>
            {step === 0 ? (
              <button type="button" className="rounded-md bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={!selected} onClick={() => setStep(1)}>המשך</button>
            ) : null}
            {step === 1 ? (
              <button type="button" className="rounded-md bg-violet-600 px-4 py-2 text-sm font-bold text-white" onClick={() => { const message = detailsError(); if (message) setError(message); else { setError(""); setStep(2); } }}>המשך לסקירה</button>
            ) : null}
            {step === 2 ? (
              <button type="button" className="rounded-md bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={!readyForReview || pending} onClick={submit}>
                {pending ? "מקים את העסק..." : "אישור והקמה"}
              </button>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}
