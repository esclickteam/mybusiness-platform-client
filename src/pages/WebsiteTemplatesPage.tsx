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
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wand2,
} from "lucide-react";

type TemplateCategory = {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
};

type WebsiteTemplate = {
  id: string;
  name: string;
  author: string;
  price: string;
  category: string;
  badge?: string;
  image: string;
};

const categories: TemplateCategory[] = [
  { id: "landing", label: "Landing Pages", count: 1089, icon: Home },
  { id: "business", label: "Business & Services", count: 1832, icon: BriefcaseBusiness },
  { id: "real-estate", label: "Real Estate", count: 351, icon: Building2 },
  { id: "portfolio", label: "Portfolio & Agency", count: 3930, icon: LayoutTemplate },
  { id: "store", label: "Retail & E-Commerce", count: 845, icon: ShoppingBag },
  { id: "food", label: "Food & Drink", count: 418, icon: Utensils },
  { id: "medical", label: "Medical", count: 266, icon: HeartPulse },
  { id: "education", label: "Education", count: 290, icon: GraduationCap },
  { id: "beauty", label: "Hair & Beauty", count: 213, icon: Sparkles },
];

const templates: WebsiteTemplate[] = [
  {
    id: "spalcio",
    name: "Spalcio",
    author: "Pentaclay",
    price: "79 USD",
    category: "business",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "collabora",
    name: "Collabora",
    author: "Onixtheme",
    price: "99 USD",
    category: "business",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "orenda",
    name: "Orenda",
    author: "Brandbes",
    price: "59 USD",
    category: "business",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "transiq",
    name: "Transiq",
    author: "Geniusflow",
    price: "79 USD",
    category: "business",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "qural",
    name: "Qural",
    author: "Flownix",
    price: "79 USD",
    category: "portfolio",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "neurva",
    name: "Neurva",
    author: "Mezario",
    price: "79 USD",
    category: "business",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "devmode",
    name: "Devmode",
    author: "Flowxrid",
    price: "59 USD",
    category: "landing",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "safehaven",
    name: "SafeHaven",
    author: "Leonardo Mattar",
    price: "99 USD",
    category: "portfolio",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function WebsiteTemplatesPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const [activeCategory, setActiveCategory] = useState("business");
  const [search, setSearch] = useState("");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory =
        activeCategory === "all" || template.category === activeCategory;

      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

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
        <aside className="hidden w-[295px] shrink-0 border-r border-[#e5e7eb] bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto px-9 py-8">
            <div className="mb-7 border-b border-[#e5e7eb] pb-6">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={[
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition",
                  activeCategory === "all"
                    ? "bg-[#f5f7fb] font-semibold text-[#111827]"
                    : "text-[#4b5563] hover:bg-[#f9fafb]",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <Wand2 className="h-4 w-4" />
                  All templates
                </span>
                <span className="text-xs text-[#9ca3af]">11,055</span>
              </button>
            </div>

            <nav className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={[
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition",
                      isActive
                        ? "bg-[#f5f7fb] font-semibold text-[#111827]"
                        : "text-[#4b5563] hover:bg-[#f9fafb]",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{category.label}</span>
                    </span>

                    <span className="ml-3 shrink-0 text-xs text-[#9ca3af]">
                      {category.count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-white">
          <div className="border-b border-[#e5e7eb] bg-white px-6 py-6 lg:px-9">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-[#111827]">
                  Website Templates
                </h1>

                <p className="mt-2 text-[15px] text-[#6b7280]">
                  Choose a ready-made professional template, preview it, and
                  create your website.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative block w-full sm:w-[320px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search templates"
                    className="
                      h-11 w-full rounded-xl border border-[#d1d5db] bg-white
                      pl-11 pr-4 text-sm outline-none transition
                      placeholder:text-[#9ca3af] focus:border-[#111827]
                    "
                  />
                </label>

                <button
                  type="button"
                  className="
                    inline-flex h-11 items-center justify-between gap-7 rounded-xl
                    border border-[#d1d5db] bg-white px-4 text-sm text-[#111827]
                    transition hover:bg-[#f9fafb]
                  "
                >
                  Newest
                  <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
              {[{ id: "all", label: "All" }, ...categories].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm",
                    activeCategory === category.id
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[#e5e7eb] bg-white text-[#374151]",
                  ].join(" ")}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 lg:px-9">
            <p className="mb-6 text-sm text-[#6b7280]">
              {filteredTemplates.length.toLocaleString()} templates
            </p>

            <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 2xl:grid-cols-4">
              {filteredTemplates.map((template) => (
                <article key={template.id} className="group">
                  <button
                    type="button"
                    onClick={() => handlePreviewTemplate(template.id)}
                    className="
                      relative block w-full overflow-hidden rounded-[7px]
                      border border-[#e5e7eb] bg-[#f3f4f6] text-left
                      transition group-hover:border-[#d1d5db]
                    "
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#f3f4f6]">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="
                          h-full w-full object-cover transition duration-500
                          group-hover:scale-[1.025]
                        "
                      />
                    </div>

                    {template.badge && (
                      <div className="absolute left-3 top-3 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                        ✦ {template.badge}
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                      <span className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#111827] shadow-lg">
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
                          <h3 className="truncate text-[16px] font-semibold text-[#111827]">
                            {template.name}
                          </h3>
                          <p className="truncate text-sm text-[#6b7280]">
                            {template.author}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template.id)}
                      className="
                        shrink-0 rounded-lg border border-[#d1d5db] bg-white
                        px-3 py-2 text-xs font-semibold text-[#111827]
                        transition hover:border-[#111827] hover:bg-[#111827]
                        hover:text-white
                      "
                    >
                      Use
                    </button>
                  </div>

                  <div className="mt-1 pl-10 text-[15px] font-medium text-[#111827]">
                    {template.price}
                  </div>
                </article>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-10 text-center">
                <h3 className="text-lg font-semibold text-[#111827]">
                  No templates found
                </h3>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Try another category or search term.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}