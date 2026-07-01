import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Globe2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const extensions = [".com", ".co.il", ".net", ".org", ".biz", ".store"];

function cleanDomain(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9.-]/g, "");
}

function getDomainNameOnly(value: string) {
  const clean = cleanDomain(value);

  return clean.replace(/\.(com|co\.il|net|org|biz|store)$/i, "");
}

export default function DomainSearchPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const [query, setQuery] = React.useState("");
  const [searched, setSearched] = React.useState(false);

  const domainBase = getDomainNameOnly(query || "mybusiness");

  const suggestions = extensions.map((ext, index) => ({
    id: `${domainBase}${ext}`,
    domain: `${domainBase}${ext}`,
    available: index !== 1,
    price:
      ext === ".co.il"
        ? "₪89 לשנה"
        : ext === ".com"
        ? "₪59 לשנה"
        : "₪49 לשנה",
  }));

  function handleSearch(event?: React.FormEvent) {
    event?.preventDefault();
    setSearched(true);
  }

  function handleBackToBuilder() {
    navigate(`${basePath}/dashboard/website`);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-slate-950">
      <header className="border-b border-slate-200 bg-white px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackToBuilder}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לעורך האתר
          </button>

          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              BizUply Domains
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              חיפוש וחיבור דומיין עצמאי
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Globe2 className="h-8 w-8" />
            </div>

            <div className="mx-auto mt-7 max-w-3xl text-center">
              <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                חיפוש דומיין לעסק
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-500">
                הסאב־דומיין של BizUply כלול במערכת. כאן אפשר לחפש דומיין עצמאי
                כמו example.com או example.co.il ולחבר אותו לאתר.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="לדוגמה: dana-hair או bizuply.co.il"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />
              </div>

              <button
                type="submit"
                className="h-14 rounded-xl bg-slate-950 px-8 text-sm font-black text-white transition hover:bg-black"
              >
                חפש דומיין
              </button>
            </form>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: BadgeCheck,
                  title: "דומיין עצמאי",
                  text: "כתובת מקצועית כמו yourbrand.com.",
                },
                {
                  icon: ShieldCheck,
                  title: "חיבור לאתר",
                  text: "הדומיין יופנה לאתר שנבנה ב־BizUply.",
                },
                {
                  icon: Sparkles,
                  title: "סאב־דומיין כלול",
                  text: "אפשר להישאר גם עם sites.bizuply.com.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <Icon className="h-6 w-6 text-slate-950" />
                    <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {searched && (
            <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-black">תוצאות חיפוש</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    תוצאות לדוגמה. בהמשך מחברים לספק דומיינים אמיתי.
                  </p>
                </div>

                <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                  Demo availability
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {suggestions.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-xl",
                          item.available
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700",
                        ].join(" ")}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-xl font-black">{item.domain}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.available ? "פנוי לרכישה" : "לא פנוי כרגע"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-slate-700">
                        {item.price}
                      </p>

                      <button
                        type="button"
                        disabled={!item.available}
                        className={[
                          "h-11 rounded-xl px-5 text-sm font-black transition",
                          item.available
                            ? "bg-slate-950 text-white hover:bg-black"
                            : "cursor-not-allowed bg-slate-200 text-slate-400",
                        ].join(" ")}
                      >
                        {item.available ? "בחר דומיין" : "לא זמין"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}