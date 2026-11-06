import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import he from "../legal-drafts/he.json";
import en from "../legal-drafts/en.json";

const DOCS = {
  privacyPage: "privacy",
  termsPage: "terms",
  accessibilityPage: "accessibility",
};

function Tree({ value }) {
  if (value == null || typeof value !== "object") {
    return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{String(value ?? "")}</p>;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="ms-5 list-disc space-y-2">
        {value.map((item, index) => (
          <li key={index}>
            <Tree value={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-4">
      {Object.entries(value).map(([key, child]) => (
        <section key={key}>
          <h3 className="text-sm font-black text-slate-900">{key}</h3>
          <Tree value={child} />
        </section>
      ))}
    </div>
  );
}

export default function LegalDraft({ doc }) {
  const { i18n } = useTranslation();
  const hebrew = i18n.language?.startsWith("he");
  return (
    <main className="min-h-screen bg-[#F7F4EE] px-5 py-16 text-slate-900" dir={hebrew ? "rtl" : "ltr"}>
      <Helmet>
        <title>{`Draft ${DOCS[doc]} — not the public document`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <article className="mx-auto max-w-4xl space-y-8">
        <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold leading-6">
          טיוטה לאישור משפטי. זה אינו המסמך הציבורי, והוא לא מחליף את מדיניות הפרטיות, תנאי השימוש או הצהרת הנגישות.
        </p>
        <section>
          <h2 className="text-2xl font-black">עברית</h2>
          <Tree value={he[doc]} />
        </section>
        <section>
          <h2 className="text-2xl font-black">English</h2>
          <Tree value={en[doc]} />
        </section>
      </article>
    </main>
  );
}
