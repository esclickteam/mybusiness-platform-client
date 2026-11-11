import { useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";

const LANGUAGES = [
  ["he", "עברית"],
  ["en", "English"],
  ["es", "Español"],
  ["ar", "العربية"],
] as const;

export default function AdminSaasInternal() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [link, setLink] = useState("");
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState({
    templateSlug: "cliny",
    businessName: "",
    ownerName: "",
    email: "",
    language: "he",
    currency: "ILS",
    timezone: "Asia/Jerusalem",
    publicSlug: "",
  });

  async function submit() {
    setError("");
    setNotice("");
    setLink("");
    setPending(true);
    try {
      const { data } = await API.post("/admin/saas-internal", draft);
      setNotice("המערכת הפנימית הוקמה. לא נרשמה עסקה ולא נרשם תשלום.");
      setLink(String(data.passwordSetupUrl || ""));
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "";
      setError(message || "ההקמה נכשלה");
    } finally {
      setPending(false);
    }
  }

  return (
    <div dir="rtl">
      <AdminHeader />
      <main>
        <AdminPageHeader
          title="הקמת מערכת פנימית"
          description="מסלול נפרד למנהל Bizuply. בלי עסקה, בלי תשלום ובלי תקופת ניסיון שמתחדשת. כרגע פתוח רק ל-Cliny."
        />
        {error ? <p className="text-rose-700">{error}</p> : null}
        {notice ? <p className="text-emerald-800">{notice}</p> : null}
        <section className="max-w-3xl rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              מערכת
              <select className="rounded border px-2 py-1" value={draft.templateSlug} onChange={(event) => setDraft({ ...draft, templateSlug: event.target.value })}>
                <option value="cliny">Cliny</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              מזהה העסק
              <input className="rounded border px-2 py-1" value={draft.publicSlug} onChange={(event) => setDraft({ ...draft, publicSlug: event.target.value })} placeholder="cliny-qa-internal" />
            </label>
            <label className="grid gap-1 text-sm">
              שם העסק
              <input className="rounded border px-2 py-1" value={draft.businessName} onChange={(event) => setDraft({ ...draft, businessName: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm">
              שם בעל החשבון
              <input className="rounded border px-2 py-1" value={draft.ownerName} onChange={(event) => setDraft({ ...draft, ownerName: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm">
              אימייל
              <input className="rounded border px-2 py-1" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm">
              שפה
              <select className="rounded border px-2 py-1" value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })}>
                {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              מטבע
              <select className="rounded border px-2 py-1" value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
                {["ILS", "USD", "EUR", "GBP"].map((currency) => <option key={currency}>{currency}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              אזור זמן
              <select className="rounded border px-2 py-1" value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}>
                {["Asia/Jerusalem", "UTC", "Europe/London", "Europe/Berlin", "America/New_York"].map((zone) => <option key={zone}>{zone}</option>)}
              </select>
            </label>
          </div>
          <button type="button" className="biz-btn mt-4" disabled={pending} onClick={submit}>הקמת מערכת פנימית</button>
          {link ? (
            <p className="mt-4 break-all text-sm">
              קישור חד־פעמי לקביעת סיסמה ב־Cliny. הוא מוצג כאן פעם אחת ואין להעתיק אותו לצ׳אט.
              <br />
              <a className="font-bold" href={link}>{link}</a>
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
