import { useEffect, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";

type DealRow = {
  id: string;
  status: string;
  templateSlug: string;
  productName?: string;
  customerName: string;
  email: string;
  phone?: string;
  businessName: string;
  country?: string;
  publicSlug?: string;
  payment?: { recorded?: boolean; reference?: string; amount?: number | null };
  delivery?: { approved?: boolean };
  tenantId?: string;
  audit?: { at?: string; action?: string; note?: string; actorEmail?: string }[];
};

const STATUS_LABEL: Record<string, string> = {
  lead: "ליד",
  in_review: "בטיפול",
  payment_recorded: "תשלום אושר",
  delivery_approved: "מסירה אושרה",
  provisioned: "הוקצה",
  cancelled: "בוטל",
};

export default function AdminSaasDeals() {
  const [rows, setRows] = useState<DealRow[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    country: "IL",
    templateSlug: "beautyflow",
    publicSlug: "",
  });
  const [paymentFor, setPaymentFor] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  async function load() {
    const { data } = await API.get("/admin/saas-deals");
    setRows(data.deals || []);
  }

  useEffect(() => {
    load().catch(() => setError("לא ניתן לטעון עסקאות SaaS"));
  }, []);

  async function createDeal() {
    setError("");
    setNotice("");
    try {
      await API.post("/admin/saas-deals", draft);
      setNotice("העסקה נקלטה ושויכה למערכת.");
      setDraft({ ...draft, name: "", email: "", businessName: "", phone: "", publicSlug: "" });
      await load();
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "";
      setError(message || "יצירת העסקה נכשלה");
    }
  }

  async function act(id: string, path: string, body: Record<string, unknown> = {}, ok: string) {
    setError("");
    setNotice("");
    try {
      const { data } = await API.post(`/admin/saas-deals/${id}/${path}`, body);
      setNotice(ok);
      if (data.passwordSetupUrl) setNotice(`${ok} קישור הגדרת סיסמה הונפק.`);
      setPaymentFor(null);
      await load();
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string; code?: string } } }).response?.data?.error
        : "";
      setError(message || "הפעולה נחסמה");
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f6fb]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-black">עסקאות ומסירת SaaS</h1>
        <p className="mb-4 text-sm">תשלום מחוץ למערכת מול Bizuply. הקצאה רק אחרי אישור תשלום ואישור מסירה.</p>
        {error ? <p className="text-rose-700">{error}</p> : null}
        {notice ? <p className="text-emerald-800">{notice}</p> : null}
        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-black">קליטת ליד</h2>
          <div className="grid gap-2 md:grid-cols-3">
            <input className="rounded border px-2 py-1" placeholder="שם" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <input className="rounded border px-2 py-1" placeholder="אימייל" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
            <input className="rounded border px-2 py-1" placeholder="שם עסק" value={draft.businessName} onChange={(event) => setDraft({ ...draft, businessName: event.target.value })} />
            <input className="rounded border px-2 py-1" placeholder="טלפון" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
            <select className="rounded border px-2 py-1" value={draft.templateSlug} onChange={(event) => setDraft({ ...draft, templateSlug: event.target.value })}>
              {["beautyflow", "global-properties", "dinevo", "cliny", "tableflow"].map((slug) => (
                <option key={slug} value={slug}>{slug}</option>
              ))}
            </select>
            <input className="rounded border px-2 py-1" placeholder="כתובת מערכת" value={draft.publicSlug} onChange={(event) => setDraft({ ...draft, publicSlug: event.target.value })} />
          </div>
          <button type="button" className="mt-3 font-bold" onClick={createDeal}>שמירת ליד</button>
        </section>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-start">
                {["לקוח", "מערכת", "סטטוס", "כתובת", "תשלום", "מסירה", ""].map((head) => (
                  <th key={head} className="px-3 py-2 text-start">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b align-top">
                  <td className="px-3 py-2">{row.customerName}<br />{row.email}<br />{row.businessName}</td>
                  <td className="px-3 py-2">{row.templateSlug}<br />{row.productName}</td>
                  <td className="px-3 py-2">{STATUS_LABEL[row.status] || row.status}</td>
                  <td className="px-3 py-2">{row.publicSlug || "—"}</td>
                  <td className="px-3 py-2">{row.payment?.recorded ? `אושר · ${row.payment.reference || ""}` : "טרם אושר"}</td>
                  <td className="px-3 py-2">{row.delivery?.approved ? "אושרה" : "ממתינה"}{row.tenantId ? <><br />tenant {row.tenantId}</> : null}</td>
                  <td className="px-3 py-2">
                    {row.status === "lead" ? <button type="button" className="block font-bold" onClick={() => act(row.id, "review", {}, "העסקה בטיפול")}>טיפול</button> : null}
                    {row.status === "lead" || row.status === "in_review" ? (
                      <button type="button" className="block font-bold" onClick={() => setPaymentFor(row.id)}>אישור תשלום ידני</button>
                    ) : null}
                    {paymentFor === row.id ? (
                      <div className="mt-1 space-y-1">
                        <input className="w-full rounded border px-2 py-1" placeholder="אסמכתא" value={paymentRef} onChange={(event) => setPaymentRef(event.target.value)} />
                        <input className="w-full rounded border px-2 py-1" placeholder="סכום" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} />
                        <button type="button" className="font-bold" onClick={() => act(row.id, "record-payment", { reference: paymentRef, amount: Number(paymentAmount) || null }, "התשלום אושר ידנית")}>אישור מנהל</button>
                      </div>
                    ) : null}
                    {row.status === "payment_recorded" ? (
                      <button type="button" className="block font-bold" onClick={() => act(row.id, "approve-delivery", { publicSlug: row.publicSlug }, "המסירה אושרה")}>אישור מסירה</button>
                    ) : null}
                    {row.status === "delivery_approved" ? (
                      <button type="button" className="block font-bold" onClick={() => act(row.id, "provision", { publicSlug: row.publicSlug }, "סביבת הלקוח הוקמה.")}>הקצאת סביבה</button>
                    ) : null}
                    {row.status !== "provisioned" && row.status !== "cancelled" ? (
                      <button type="button" className="mt-1 block font-bold" onClick={() => act(row.id, "cancel", { note: "בוטל" }, "העסקה בוטלה")}>ביטול</button>
                    ) : null}
                    {(row.audit || []).slice(-4).reverse().map((entry) => (
                      <p key={`${entry.at}-${entry.action}`} className="text-xs">{entry.action} · {entry.note || ""}</p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
