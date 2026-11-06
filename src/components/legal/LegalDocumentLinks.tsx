import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const documents = [
  ["/terms", "termsPage.title"],
  ["/privacy", "privacyPage.title"],
  ["/accessibility", "accessibilityPage.title"],
] as const;

export default function LegalDocumentLinks({ current }: { current: "/terms" | "/privacy" | "/accessibility" }) {
  const { t } = useTranslation();
  return (
    <nav className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold text-slate-800">
      {documents.filter(([href]) => href !== current).map(([href, key]) => (
        <Link key={href} className="underline" to={href}>
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
