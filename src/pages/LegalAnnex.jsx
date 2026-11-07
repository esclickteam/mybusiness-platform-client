import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/i18n";
import LegalDocumentLinks from "../components/legal/LegalDocumentLinks";
import en from "../legal-annex/en.json";
import he from "../legal-annex/he.json";
import es from "../legal-annex/es.json";
import pt from "../legal-annex/pt-BR.json";
import ar from "../legal-annex/ar.json";
import registry from "../legal-annex/subprocessors.registry.json";

const packs = { en, he, es, "pt-BR": pt, ar };

function packFor(language) {
  const value = String(language || "en").toLowerCase();
  if (value.startsWith("pt")) return packs["pt-BR"];
  if (value.startsWith("he") || value.startsWith("iw")) return packs.he;
  if (value.startsWith("es")) return packs.es;
  if (value.startsWith("ar")) return packs.ar;
  return packs.en;
}

export default function LegalAnnex() {
  const { doc } = useParams();
  const { i18n } = useTranslation();
  const pack = packFor(i18n.language);
  const entry = pack.docs[doc] || null;
  const dir = getTextDirection(i18n.language);

  return (
    <main
      dir={dir}
      className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-start text-slate-800"
    >
      <Helmet>
        <title>{entry ? entry.title : "Bizuply"}</title>
        {entry ? <link rel="canonical" href={`https://bizuply.com/legal/${doc}`} /> : null}
      </Helmet>
      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:px-10 lg:pt-24">
        <h1 className="mx-auto max-w-5xl text-center text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl">
          {entry ? entry.title : ""}
        </h1>
        <LegalDocumentLinks current={`/legal/${doc || ""}`} />
        {entry ? (
          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8">
            {entry.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-base font-medium leading-8 text-slate-600">
                {paragraph}
              </p>
            ))}
            {doc === "subprocessors" ? (
              <table className="mt-6 w-full border-collapse text-sm">
                <caption className="mb-3 text-start font-semibold">
                  {registry.checkedOn}
                </caption>
                <tbody>
                  {registry.rows.map((row) => (
                    <tr key={row.provider} className="border-t border-slate-200 align-top">
                      <th scope="row" className="py-3 pe-3 text-start font-semibold text-slate-800">{row.provider}</th>
                      <td className="py-3 text-slate-600">
                        <p>{row.service}</p>
                        <p>{row.status}</p>
                        <p>{row.region}</p>
                        <p><a href={row.dpa}>{row.dpa}</a></p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
