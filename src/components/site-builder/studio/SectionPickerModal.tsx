import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../hooks/useLocaleDir";
import { localizeBuiltInText, tx } from "../../../i18n/localizeBuiltInTemplateSeed";
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

const SECTION_TAB_KINDS: Array<{ kind: SectionKind; icon: string }> = [
  { kind: "header", icon: "▤" },
  { kind: "hero", icon: "★" },
  { kind: "welcome", icon: "✦" },
  { kind: "about", icon: "ℹ" },
  { kind: "team", icon: "◉" },
  { kind: "services", icon: "✦" },
  { kind: "gallery", icon: "▧" },
  { kind: "contact", icon: "@" },
  { kind: "promotion", icon: "%" },
  { kind: "subscribe", icon: "+" },
  { kind: "testimonials", icon: "❝" },
  { kind: "reviews", icon: "★" },
  { kind: "clients", icon: "◫" },
  { kind: "store", icon: "₪" },
  { kind: "booking", icon: "◷" },
  { kind: "events", icon: "◇" },
  { kind: "club", icon: "♛" },
  { kind: "bot", icon: "AI" },
  { kind: "social", icon: "#" },
  { kind: "course", icon: "▶" },
  { kind: "miniSaas", icon: "S" },
  { kind: "basic", icon: "+" },
  { kind: "text", icon: "T" },
  { kind: "list", icon: "☰" },
  { kind: "form", icon: "▣" },
];

export default function SectionPickerModal({ open, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [activeKind, setActiveKind] = useState<SectionKind>("hero");
  const [query, setQuery] = useState("");
  const sectionTabs = useMemo(
    () =>
      SECTION_TAB_KINDS.map((tab) => ({
        ...tab,
        label: t(`studio.kind.${tab.kind}`),
      })),
    [t],
  );

  const variants = useMemo(() => {
    const search = query.trim().toLowerCase();

    return sectionLayoutVariants.filter((variant) => {
      if (variant.kind !== activeKind) return false;

      if (!search) return true;

      const title = tx(variant.title);
      const description = tx(variant.description);
      const tags = (variant.tags || []).map((tag) => tx(tag));
      return (
        variant.title.toLowerCase().includes(search) ||
        variant.description.toLowerCase().includes(search) ||
        title.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search) ||
        variant.tags?.some((tag) => tag.toLowerCase().includes(search)) ||
        tags.some((tag) => tag.toLowerCase().includes(search))
      );
    });
  }, [activeKind, query]);

  const activeLabel =
    sectionTabs.find((tab) => tab.kind === activeKind)?.label ||
    t("studio.sections");

  if (!open) return null;

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-[999999] flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/55 p-4 backdrop-blur-sm"
    >
      <div className="relative flex h-[92vh] w-full max-w-[1680px] overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_50px_180px_rgba(15,23,42,0.28)]">
        <aside className="hidden w-[290px] shrink-0 border-l border-slate-200 bg-slate-50/80 p-5 lg:block">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.32em] text-violet-600">
                SECTIONS
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-800">
                {t("studio.sectionPicker.addSection")}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black text-slate-400 shadow-sm transition hover:text-slate-800"
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
                      ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-white shadow-xl shadow-violet-200"
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
                <h3 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-800">
                  {t("studio.sectionPicker.chooseLayout")}
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  {t("studio.sectionPicker.layoutHint")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("studio.sectionPicker.searchPlaceholder")}
                  className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white sm:w-[320px]"
                />

                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden min-h-12 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
                >
                  {t("studio.close")}
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
                  <h4 className="mt-5 text-2xl font-black text-slate-800">
                    {t("studio.sectionPicker.emptyCategory")}
                  </h4>
                  <p className="mt-2 text-sm font-bold text-slate-400">
                    {t("studio.sectionPicker.emptyHint")}
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
                      <div className="absolute right-4 top-4 z-10 rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl">
                        {index + 1}/{variants.length}
                      </div>

                      {variant.badge ? (
                        <div className="absolute left-4 top-4 z-10 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 shadow-lg">
                          {tx(variant.badge)}
                        </div>
                      ) : null}

                      <div className="h-full w-full origin-top scale-[0.42] overflow-hidden bg-white">
                        <div
                          className="pointer-events-none w-[238%]"
                          dangerouslySetInnerHTML={{
                            __html: localizeBuiltInText(variant.html),
                          }}
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-5">
                      <h4 className="text-xl font-black text-slate-800">
                        {tx(variant.title)}
                      </h4>

                      <p className="mt-2 min-h-[44px] text-sm font-bold leading-6 text-slate-500">
                        {tx(variant.description)}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {variant.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-400"
                            >
                              {tx(tag)}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelect(variant)}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl transition group-hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                        >
                          {t("studio.sectionPicker.addToPage")}
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