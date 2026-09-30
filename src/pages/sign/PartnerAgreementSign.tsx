import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import logo from "../../images/logo_final.svg";

type Preview = {
  agreementNumber: string;
  locale: string;
  dir?: string;
  partnerLegalCompanyName: string;
  territoryLabel: string;
  territoryType: string;
  licenseFee: number | null;
  currency: string;
  startDate: string;
  endDate: string;
  confirmationText: string;
  partnerAlreadySigned: boolean;
  sections: { number: number | null; title: string; paragraphs: string[] }[];
  parts?: { locale: string; dir: string; title: string; sections: { number: number | null; title: string; paragraphs: string[] }[] }[];
};

export default function PartnerAgreementSign() {
  const { token = "" } = useParams();
  const [data, setData] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [typedName, setTypedName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    API.get(`/public/partner-agreement-sign/${token}`)
      .then((res) => setData(res.data))
      .catch(() => setError("This signing link is not valid."));
  }, [token]);

  async function sign(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;
    setError("");
    try {
      const res = await API.post(`/public/partner-agreement-sign/${token}`, {
        confirmed,
        method: "typed",
        typedName,
        confirmationText: data.confirmationText,
      });
      setDone(`Signed ${res.data.agreementNumber}. Status: ${res.data.status}.`);
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "Could not sign.");
    }
  }

  const dir = data?.dir === "rtl" || data?.locale === "he" || data?.locale === "ar" ? "rtl" : "ltr";
  const parts = data?.parts?.length
    ? data.parts
    : data
      ? [{ locale: data.locale, dir, title: "", sections: data.sections }]
      : [];

  return (
    <main className="min-h-screen bg-[#F3F0EA] px-4 py-8" dir={dir} lang={data?.locale || "en"}>
      <div className="mx-auto max-w-[860px]">
        <img src={logo} alt="Bizuply" className="h-12 w-auto" />
        <h1 className="mt-4 text-3xl font-black">Sign Partner Agreement</h1>
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {done ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">{done}</p> : null}
        {data ? (
          <article className="mt-4 rounded-[28px] bg-white px-6 py-8" data-testid="partner-sign">
            <p className="font-black">{data.agreementNumber}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Company</dt><dd className="font-black">{data.partnerLegalCompanyName}</dd></div>
              <div><dt className="text-slate-500">Territory</dt><dd className="font-black">{data.territoryLabel}</dd></div>
              <div><dt className="text-slate-500">Exclusivity</dt><dd className="font-black">{data.territoryType}</dd></div>
              <div><dt className="text-slate-500">Fee</dt><dd className="font-black">{data.currency} {data.licenseFee}</dd></div>
              <div><dt className="text-slate-500">Dates</dt><dd className="font-black">{data.startDate} – {data.endDate}</dd></div>
            </dl>
            {parts.map((part) => (
              <div key={part.locale} dir={part.dir === "rtl" ? "rtl" : "ltr"} lang={part.locale} className="mt-6 space-y-4">
                {part.sections.map((section) => (
                  <section key={`${part.locale}-${section.number}`}>
                    <h2 className="font-black text-[#6D28D9]">{section.number}. {section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 60)} className="mt-1 text-sm leading-6">{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            ))}
            {data.partnerAlreadySigned || done ? null : (
              <form onSubmit={sign} className="mt-8 space-y-3 border-t border-slate-200 pt-4">
                <label className="flex items-start gap-2 text-sm font-bold">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  <span>{data.confirmationText}</span>
                </label>
                <input className="w-full rounded-xl border px-3 py-2" placeholder="Type your signature" value={typedName} onChange={(e) => setTypedName(e.target.value)} />
                <button className="rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" type="submit">Sign agreement</button>
              </form>
            )}
          </article>
        ) : null}
      </div>
    </main>
  );
}
