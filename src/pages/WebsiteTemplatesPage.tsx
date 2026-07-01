import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, LayoutTemplate, Sparkles } from "lucide-react";

type WebsiteTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
};

const templates: WebsiteTemplate[] = [
  {
    id: "novara",
    name: "Novara",
    description:
      "Premium business website template with a clean homepage, services, portfolio and contact sections.",
    category: "Business",
  },
  {
    id: "velora",
    name: "Velora",
    description:
      "Modern service website template for small businesses, studios and consultants.",
    category: "Services",
  },
  {
    id: "solane",
    name: "Solane",
    description:
      "Elegant landing-style website template with strong visuals and clear call to action.",
    category: "Premium",
  },
];

export default function WebsiteTemplatesPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";

  function handleUseTemplate(templateId: string) {
    localStorage.setItem("bizuply-selected-template-id", templateId);
    navigate(`${basePath}/dashboard/website?templateId=${templateId}`);
  }

  function handlePreviewTemplate(templateId: string) {
    navigate(`${basePath}/dashboard/website/templates/${templateId}/preview`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 px-6 py-16 text-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
            <Sparkles className="h-4 w-4" />
            BizUply Website Builder
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Choose your website template
            </h1>

            <p className="mt-5 text-base leading-8 text-white/70 md:text-lg">
              Pick a ready-made website template, preview it, and create your
              built-in business website in one click.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-600">
                Templates
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Start from a professional design
              </h2>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
              <LayoutTemplate className="h-4 w-4 text-violet-600" />
              {templates.length} templates
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <article
                key={template.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-950 via-violet-900 to-slate-700">
                  <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">
                    {template.category}
                  </div>

                  <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <div className="h-3 w-28 rounded-full bg-white/70" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-2xl bg-white/20" />
                      <div className="h-16 rounded-2xl bg-white/30" />
                      <div className="h-16 rounded-2xl bg-white/20" />
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-white/20" />
                    <div className="mt-2 h-3 w-2/3 rounded-full bg-white/20" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreviewTemplate(template.id)}
                    className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition duration-300 group-hover:bg-slate-950/55 group-hover:opacity-100"
                  >
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl">
                      <Eye className="h-4 w-4" />
                      Preview
                    </span>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-slate-950">
                    {template.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {template.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template.id)}
                      className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}