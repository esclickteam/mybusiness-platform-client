import React, { useEffect, useMemo, useState } from "react";
import { getPublicSiteResource } from "../../../api/publicSiteRuntimeApi";
import { matchesPageTarget } from "../whatsapp-float/whatsappFloatUtils";

type FaqItem = {
  id?: string;
  question?: string;
  answer?: string;
  category?: string;
};

type FaqSet = {
  _id: string;
  name?: string;
  categories?: string[];
  items?: FaqItem[];
  schemaEnabled?: boolean;
};

export default function FaqWidget({
  slug,
  pageId,
  settings,
}: {
  slug: string;
  pageId?: string;
  settings?: { pageTargeting?: { mode?: string; pageIds?: string[] } };
}) {
  const [sets, setSets] = useState<FaqSet[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!slug) return;
    getPublicSiteResource<{ items?: FaqSet[] }>(slug, "/faq-sets")
      .then((data) => setSets(Array.isArray(data?.items) ? data.items : []))
      .catch(() => setSets([]));
  }, [slug]);

  const items = useMemo(() => {
    return sets.flatMap((set) =>
      (set.items || []).map((item) => ({ ...item, setName: set.name }))
    );
  }, [sets]);

  const filtered = items.filter((item) => {
    const hay = `${item.question || ""} ${item.answer || ""}`.toLowerCase();
    const qOk = !query || hay.includes(query.toLowerCase());
    const cOk = !category || item.category === category;
    return qOk && cOk;
  });

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
  const schemaSets = sets.filter((set) => set.schemaEnabled !== false);

  if (!matchesPageTarget(settings?.pageTargeting, pageId)) return null;
  if (!sets.length) return null;

  return (
    <div data-bizuply-widget="faq-pro" data-bizuply-plugin="faq-pro" data-bizuply-plugin-runtime="true" className="mx-auto my-6 max-w-3xl rounded-2xl bg-white p-4 shadow">
      {schemaSets.length ? (
        <script
          type="application/ld+json"
          data-testid="faq-schema"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      ) : null}
      <input
        data-testid="faq-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search FAQ"
        className="mb-3 w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            data-testid="faq-category-filter"
            className={`rounded-full px-3 py-1 text-xs font-bold ${category === cat ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            onClick={() => setCategory(category === cat ? "" : String(cat))}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.map((item, index) => (
        <details key={`${item.id || index}`} data-testid="faq-item" className="border-b py-2">
          <summary className="cursor-pointer font-semibold">{item.question}</summary>
          <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
