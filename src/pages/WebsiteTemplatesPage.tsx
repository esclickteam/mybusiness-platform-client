import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutTemplate,
  Paintbrush,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wrench,
} from "lucide-react";

import {
  studioTemplateDefinitions,
  getStudioTemplatesByCategory,
} from "../components/site-builder/studio/data/templates";

type TemplateCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const templateCategories: TemplateCategory[] = [
  {
    id: "landing",
    label: "Landing Pages",
    icon: Home,
  },
  {
    id: "business",
    label: "Business & Services",
    icon: BriefcaseBusiness,
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Building2,
  },
  {
    id: "portfolio",
    label: "Portfolio & Agency",
    icon: LayoutTemplate,
  },
  {
    id: "store",
    label: "Retail & E-Commerce",
    icon: ShoppingBag,
  },
  {
    id: "food",
    label: "Food & Drink",
    icon: Utensils,
  },
  {
    id: "medical",
    label: "Medical",
    icon: HeartPulse,
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
  },
  {
    id: "beauty",
    label: "Hair & Beauty",
    icon: Sparkles,
  },
  {
    id: "service",
    label: "Home Services",
    icon: Wrench,
  },
];

function getCategoryCount(categoryId: string) {
  if (categoryId === "all") {
    return studioTemplateDefinitions.length;
  }

  return getStudioTemplatesByCategory(categoryId).length;
}

export default function WebsiteTemplatesPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return studioTemplateDefinitions.filter((template) => {
      const matchesCategory =
        activeCategory === "all" || template.category === activeCategory;

      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.categoryLabel.toLowerCase().includes(query) ||
        template.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const activeCategoryLabel =
    activeCategory === "all"
      ? "All Website Templates"
      : templateCategories.find((category) => category.id === activeCategory)
          ?.label || "Website Templates";

  function handleUseTemplate(templateId: string) {
    localStorage.setItem("bizuply-selected-template-id", templateId);
    navigate(`${basePath}/dashboard/website?templateId=${templateId}`);
  }

  function handlePreviewTemplate(templateId: string) {
    navigate(`${basePath}/dashboard/website/templates/${templateId}/preview`);
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[310px] shrink-0 border-r border-[#e5e7eb] bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto px-7 py-8">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <h2 className="text-lg font-black tracking-[-0.03em] text-[#111827]">
                Categories
              </h2>

              <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search templates"
                  className="
                    h-11 w-full rounded-xl border border-[#e5e7eb] bg-white
                    pl-11 pr-4 text-sm font-medium outline-none transition
                    placeholder:text-[#9ca3af] focus:border-[#2563eb]
                    focus:ring-4 focus:ring-[#2563eb]/10
                  "
                />
              </label>

              <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] transition",
                    activeCategory === "all"
                      ? "bg-[#eef4ff] font-bold text-[#2563eb]"
                      : "text-[#374151] hover:bg-[#f9fafb]",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Paintbrush className="h-4 w-4 shrink-0" />
                    <span className="truncate">All</span>
                  </span>

                  <span className="ml-3 shrink-0 text-xs text-[#9ca3af]">
                    {getCategoryCount("all").toLocaleString()}
                  </span>
                </button>

                <nav className="mt-2 space-y-1">
                  {templateCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const count = getCategoryCount(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] transition",
                          isActive
                            ? "bg-[#eef4ff] font-bold text-[#2563eb]"
                            : "text-[#374151] hover:bg-[#f9fafb]",
                        ].join(" ")}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{category.label}</span>
                        </span>

                        <span className="ml-3 shrink-0 text-xs text-[#9ca3af]">
                          {count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-white">
          <div className="border-b border-[#e5e7eb] bg-white px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-[1500px]">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
                <span>Templates</span>
                <span className="text-[#9ca3af]">›</span>
                <span>Categories</span>
                <span className="text-[#9ca3af]">›</span>
                <span className="text-[#6b7280]">
                  {activeCategory === "all" ? "All" : activeCategoryLabel}
                </span>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h1 className="text-[34px] font-black tracking-[-0.045em] text-[#111827] md:text-[42px]">
                    {activeCategoryLabel}
                  </h1>

                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
                    Choose a ready-made BizUply website template, preview the
                    full design, and use it as the starting point for your
                    built-in website.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block w-full sm:w-[330px] lg:hidden">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search templates"
                      className="
                        h-11 w-full rounded-xl border border-[#d1d5db] bg-white
                        pl-11 pr-4 text-sm outline-none transition
                        placeholder:text-[#9ca3af] focus:border-[#2563eb]
                      "
                    />
                  </label>

                  <button
                    type="button"
                    className="
                      inline-flex h-11 items-center justify-between gap-7 rounded-xl
                      border border-[#d1d5db] bg-white px-4 text-sm font-medium
                      text-[#111827] transition hover:bg-[#f9fafb]
                    "
                  >
                    Newest
                    <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                  </button>
                </div>
              </div>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={[
                    "h-11 shrink-0 rounded-xl border px-5 text-sm font-bold transition",
                    activeCategory === "all"
                      ? "border-[#2563eb] bg-white text-[#2563eb] ring-2 ring-[#2563eb]/10"
                      : "border-[#e5e7eb] bg-[#f8fafc] text-[#111827] hover:bg-white",
                  ].join(" ")}
                >
                  All Categories
                </button>

                {templateCategories.slice(0, 7).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={[
                      "h-11 shrink-0 rounded-xl border px-5 text-sm font-bold transition",
                      activeCategory === category.id
                        ? "border-[#2563eb] bg-white text-[#2563eb] ring-2 ring-[#2563eb]/10"
                        : "border-[#e5e7eb] bg-[#f8fafc] text-[#111827] hover:bg-white",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-[1500px]">
              <p className="mb-7 text-sm font-medium text-[#9ca3af]">
                {filteredTemplates.length.toLocaleString()} templates
              </p>

              {filteredTemplates.length > 0 ? (
                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredTemplates.map((template) => (
                    <article key={template.id} className="group">
                      <button
                        type="button"
                        onClick={() => handlePreviewTemplate(template.id)}
                        className="
                          relative block w-full overflow-hidden rounded-xl
                          border border-[#e5e7eb] bg-[#f3f4f6] text-left
                          shadow-sm transition duration-300
                          group-hover:-translate-y-1 group-hover:border-[#d1d5db]
                          group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
                        "
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-[#f3f4f6]">
                          {template.thumbnail ? (
                            <div className="h-full w-full">
                              {template.thumbnail}
                            </div>
                          ) : template.previewImage ? (
                            <img
                              src={template.previewImage}
                              alt={template.name}
                              className="
                                h-full w-full object-cover transition duration-500
                                group-hover:scale-[1.025]
                              "
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#f9fafb]">
                              <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" />
                            </div>
                          )}
                        </div>

                        {template.badge && (
                          <div className="absolute left-3 top-3 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-2.5 py-1 text-xs font-bold text-[#2563eb]">
                            ✦ {template.badge}
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                          <span className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#111827] shadow-lg">
                            Preview
                          </span>
                        </div>
                      </button>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
                              <BadgeCheck className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-[17px] font-black tracking-[-0.02em] text-[#111827]">
                                {template.name}
                              </h3>

                              <p className="truncate text-sm text-[#6b7280]">
                                {template.categoryLabel}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUseTemplate(template.id)}
                          className="
                            shrink-0 rounded-lg border border-[#d1d5db] bg-white
                            px-3 py-2 text-xs font-bold text-[#111827]
                            transition hover:border-[#111827] hover:bg-[#111827]
                            hover:text-white
                          "
                        >
                          Use
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6b7280] shadow-sm">
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#111827]">
                    No templates found
                  </h3>

                  <p className="mt-2 text-sm text-[#6b7280]">
                    Try another category or search term.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("all");
                    }}
                    className="mt-6 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Show all templates
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}