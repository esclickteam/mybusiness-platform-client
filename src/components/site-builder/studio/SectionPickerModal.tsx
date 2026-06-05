import React, { useMemo, useState } from "react";
import {
  sectionLayoutVariants,
  type SectionKind,
  type SectionLayoutVariant,
} from "./data/sectionLayoutVariants";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (variant: SectionLayoutVariant) => void;
};

const sectionTabs: { kind: SectionKind; label: string; icon: string }[] = [
  { kind: "header", label: "הידר", icon: "▤" },
  { kind: "hero", label: "דף הבית", icon: "★" },
  { kind: "welcome", label: "Welcome", icon: "✦" },
  { kind: "about", label: "אודות", icon: "ℹ" },
  { kind: "team", label: "צוות", icon: "◉" },
  { kind: "services", label: "שירותים", icon: "✦" },
  { kind: "gallery", label: "גלריה", icon: "▧" },
  { kind: "contact", label: "יצירת קשר", icon: "@" },
  { kind: "promotion", label: "מבצע", icon: "%" },
  { kind: "subscribe", label: "הרשמה", icon: "+" },
  { kind: "testimonials", label: "המלצות", icon: "❝" },
  { kind: "reviews", label: "ביקורות", icon: "★" },
  { kind: "clients", label: "לקוחות", icon: "◫" },
  { kind: "store", label: "חנות", icon: "₪" },
  { kind: "booking", label: "תורים", icon: "◷" },
  { kind: "events", label: "אירועים", icon: "◇" },
  { kind: "club", label: "מועדון", icon: "♛" },
  { kind: "bot", label: "בוט חכם", icon: "AI" },
  { kind: "social", label: "סושיאל", icon: "#" },
  { kind: "course", label: "קורס", icon: "▶" },
  { kind: "miniSaas", label: "Mini SaaS", icon: "S" },
  { kind: "basic", label: "בסיסי", icon: "+" },
  { kind: "text", label: "טקסט", icon: "T" },
  { kind: "list", label: "רשימה", icon: "☰" },
  { kind: "form", label: "טופס", icon: "▣" },
];

export default function SectionPickerModal({ open, onClose, onSelect }: Props) {
  const [activeKind, setActiveKind] = useState<SectionKind>("hero");
  const [query, setQuery] = useState("");

  const variants = useMemo(() => {
    const search = query.trim().toLowerCase();

    return sectionLayoutVariants.filter((variant) => {
      if (variant.kind !== activeKind) return false;

      if (!search) return true;

      return (
        variant.title.toLowerCase().includes(search) ||
        variant.description.toLowerCase().includes(search) ||
        variant.tags?.some((tag) => tag.toLowerCase().includes(search))
      );
    });
  }, [activeKind, query]);

  const activeLabel =
    sectionTabs.find((tab) => tab.kind === activeKind)?.label || "סקשנים";

  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
    >
      <div className="relative flex h-[92vh] w-full max-w-[1680px] overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_50px_180px_rgba(15,23,42,0.28)]">
        <aside className="hidden w-[290px] shrink-0 border-l border-slate-200 bg-slate-50/80 p-5 lg:block">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.32em] text-violet-600">
                SECTIONS
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                הוספת סקשן
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black text-slate-400 shadow-sm transition hover:text-slate-950"
            >
              ×
            </button>
          </div>

          <div className="grid gap-2 overflow-y-auto pr-1">
            {sectionTabs.map((tab) => {
              const count = sectionLayoutVariants.filter(
                (variant) => variant.kind === tab.kind
              ).length;

              if (count === 0) return null;

              const active = tab.kind === activeKind;

              return (
                <button
                  key={tab.kind}
                  type="button"
                  onClick={() => setActiveKind(tab.kind)}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 text-right text-sm font-black transition ${
                    active
                      ? "bg-gradient-to-l from-violet-700 to-fuchsia-600 text-white shadow-xl shadow-violet-200"
                      : "bg-white text-slate-600 shadow-sm hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl text-xs ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-violet-700"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.32em] text-violet-600">
                  {activeLabel}
                </p>
                <h3 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950">
                  בחרי מבנה מקצועי להוספה לעמוד
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  כל מבנה נכנס לעמוד וניתן לעריכה מלאה דרך האינספקטור.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="חיפוש מבנה..."
                  className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white sm:w-[320px]"
                />

                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden min-h-12 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white"
                >
                  סגירה
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {sectionTabs.map((tab) => {
                const count = sectionLayoutVariants.filter(
                  (variant) => variant.kind === tab.kind
                ).length;

                if (count === 0) return null;

                const active = tab.kind === activeKind;

                return (
                  <button
                    key={tab.kind}
                    type="button"
                    onClick={() => setActiveKind(tab.kind)}
                    className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black ${
                      active
                        ? "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </header>

          <section className="flex-1 overflow-y-auto bg-[#F6F7FB] p-5">
            {variants.length === 0 ? (
              <div className="grid min-h-[520px] place-items-center rounded-[32px] border border-dashed border-slate-200 bg-white text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-violet-50 text-2xl font-black text-violet-700">
                    +
                  </div>
                  <h4 className="mt-5 text-2xl font-black text-slate-950">
                    אין מבנים בקטגוריה הזו
                  </h4>
                  <p className="mt-2 text-sm font-bold text-slate-400">
                    צריך לוודא שהקובץ שלה מחובר ב־sectionLayoutVariants.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {variants.map((variant, index) => (
                  <article
                    key={variant.id}
                    className="group overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_110px_rgba(124,58,237,0.18)]"
                  >
                    <div className="relative h-[260px] overflow-hidden bg-slate-50">
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-xl">
                        {index + 1}/{variants.length}
                      </div>

                      {variant.badge ? (
                        <div className="absolute left-4 top-4 z-10 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 shadow-lg">
                          {variant.badge}
                        </div>
                      ) : null}

                      <div className="h-full w-full origin-top scale-[0.42] overflow-hidden bg-white">
                        <div
                          className="pointer-events-none w-[238%]"
                          dangerouslySetInnerHTML={{ __html: variant.html }}
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-5">
                      <h4 className="text-xl font-black text-slate-950">
                        {variant.title}
                      </h4>

                      <p className="mt-2 min-h-[44px] text-sm font-bold leading-6 text-slate-500">
                        {variant.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {variant.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelect(variant)}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl transition group-hover:bg-violet-700"
                        >
                          הוספה לעמוד
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}