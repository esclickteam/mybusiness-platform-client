import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import en from "../../legal-annex/en.json";
import he from "../../legal-annex/he.json";
import es from "../../legal-annex/es.json";
import pt from "../../legal-annex/pt-BR.json";
import ar from "../../legal-annex/ar.json";

const documents = [
  ["/terms", "termsPage.title"],
  ["/privacy", "privacyPage.title"],
  ["/accessibility", "accessibilityPage.title"],
] as const;

const annexes = { en, he, es, "pt-BR": pt, ar } as const;

function annexFor(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("pt")) return annexes["pt-BR"];
  if (value.startsWith("he") || value.startsWith("iw")) return annexes.he;
  if (value.startsWith("es")) return annexes.es;
  if (value.startsWith("ar")) return annexes.ar;
  return annexes.en;
}

export default function LegalDocumentLinks({ current }: { current: "/terms" | "/privacy" | "/accessibility" }) {
  const { t, i18n } = useTranslation();
  const annex = annexFor(i18n.language || "en");
  return (
    <nav className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold text-slate-800">
      {documents.filter(([href]) => href !== current).map(([href, key]) => (
        <Link key={href} className="underline" to={href}>
          {t(key)}
        </Link>
      ))}
      {Object.entries(annex.docs).map(([id, item]) => (
        <Link key={id} className="underline" to={`/legal/${id}`}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
