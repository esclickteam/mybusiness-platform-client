import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/i18n";
import en from "../legal-annex/en.json";
import he from "../legal-annex/he.json";
import es from "../legal-annex/es.json";
import pt from "../legal-annex/pt-BR.json";
import ar from "../legal-annex/ar.json";

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
  const { i18n, t } = useTranslation();
  const pack = packFor(i18n.language);
  const entry = pack.docs[doc];
  const dir = getTextDirection(i18n.language);

  return (
    <main dir={dir} className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
      <nav className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
        <Link className="underline" to="/terms">{t("termsPage.title")}</Link>
        <Link className="underline" to="/privacy">{t("privacyPage.title")}</Link>
        <Link className="underline" to="/accessibility">{t("accessibilityPage.title")}</Link>
        {Object.entries(pack.docs).map(([id, item]) => (
          <Link key={id} className="underline" to={`/legal/${id}`}>{item.title}</Link>
        ))}
      </nav>
      {entry ? (
        <>
          <h1 className="text-3xl font-black">{entry.title}</h1>
          {entry.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 leading-7">{paragraph}</p>
          ))}
        </>
      ) : null}
    </main>
  );
}
