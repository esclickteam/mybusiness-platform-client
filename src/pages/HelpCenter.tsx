import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  Handshake,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Globe,
  Megaphone,
  PencilLine,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";
import { useLocaleDir } from "../hooks/useLocaleDir";

type AuthUser = {
  businessId?: string | number;
  [key: string]: unknown;
};

type AuthContextValue = {
  user?: AuthUser | null;
};

type ArticleItem = {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: React.ElementType;
  keywords: string[];
};

type FaqCategoryItem = {
  id: number;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  keywords: string[];
};

type QuickAction = {
  label: string;
  query: string;
  icon?: React.ElementType;
};

function normalizeForSearch(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u0591-\u05c7]/g, "")
    .replace(/[\u200f\u200e]/g, "")
    .replace(/[\u05be\u2013\u2014\-_/|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(query: string) {
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

function textContainsToken(text: string, token: string) {
  return normalizeForSearch(text).includes(token);
}

function itemMatchesQuery(
  item: { title: string; description?: string; keywords?: string[] },
  query: string
) {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return true;

  const searchableTexts = [
    item.title,
    item.description ?? "",
    ...(item.keywords ?? []),
  ];

  const fullMatch = searchableTexts.some((text) =>
    normalizeForSearch(text).includes(normalizedQuery)
  );
  if (fullMatch) return true;

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return false;

  return tokens.every((token) =>
    searchableTexts.some((text) => textContainsToken(text, token))
  );
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export default function HelpCenter() {
  const { t } = useTranslation();
  const { user } = useAuth() as AuthContextValue;
  const dir = useLocaleDir();
  const businessId = user?.businessId;
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(
    null
  );

  const basePath = businessId ? `/business/${businessId}/dashboard` : "/";

  const suggestedQueries: QuickAction[] = useMemo(
    () => [
      {
        label: t("helpCenter.suggested.buildSite.label"),
        query: t("helpCenter.suggested.buildSite.query"),
        icon: Globe,
      },
      {
        label: t("helpCenter.suggested.publishSite.label"),
        query: t("helpCenter.suggested.publishSite.query"),
        icon: Megaphone,
      },
      {
        label: t("helpCenter.suggested.crmAppointments.label"),
        query: t("helpCenter.suggested.crmAppointments.query"),
        icon: CalendarDays,
      },
      {
        label: t("helpCenter.suggested.useAi.label"),
        query: t("helpCenter.suggested.useAi.query"),
        icon: Sparkles,
      },
      {
        label: t("helpCenter.suggested.editProfile.label"),
        query: t("helpCenter.suggested.editProfile.query"),
        icon: PencilLine,
      },
      {
        label: t("helpCenter.suggested.seo.label"),
        query: t("helpCenter.suggested.seo.query"),
        icon: LayoutDashboard,
      },
      {
        label: t("helpCenter.suggested.dashboard.label"),
        query: t("helpCenter.suggested.dashboard.query"),
        icon: LayoutDashboard,
      },
      {
        label: t("helpCenter.suggested.leads.label"),
        query: t("helpCenter.suggested.leads.query"),
        icon: UsersRound,
      },
    ],
    [t]
  );

  const popularArticles: ArticleItem[] = useMemo(
    () => [
      {
        id: 1,
        title: t("helpCenter.articles.buildBusinessPage.title"),
        description: t("helpCenter.articles.buildBusinessPage.description"),
        url: `${basePath}/articles/build-business-page`,
        icon: BriefcaseBusiness,
        keywords: asStringArray(
          t("helpCenter.articles.buildBusinessPage.keywords", {
            returnObjects: true,
          })
        ),
      },
      {
        id: 2,
        title: t("helpCenter.articles.websiteBuilding.title"),
        description: t("helpCenter.articles.websiteBuilding.description"),
        url: `${basePath}/articles/website-building-guide`,
        icon: Globe,
        keywords: asStringArray(
          t("helpCenter.articles.websiteBuilding.keywords", {
            returnObjects: true,
          })
        ),
      },
      {
        id: 3,
        title: t("helpCenter.articles.dashboard.title"),
        description: t("helpCenter.articles.dashboard.description"),
        url: `${basePath}/articles/dashboard-guide`,
        icon: LayoutDashboard,
        keywords: asStringArray(
          t("helpCenter.articles.dashboard.keywords", { returnObjects: true })
        ),
      },
      {
        id: 4,
        title: t("helpCenter.articles.crmAppointments.title"),
        description: t("helpCenter.articles.crmAppointments.description"),
        url: `${basePath}/articles/appointment-crm-guide`,
        icon: CalendarDays,
        keywords: asStringArray(
          t("helpCenter.articles.crmAppointments.keywords", {
            returnObjects: true,
          })
        ),
      },
      {
        id: 5,
        title: t("helpCenter.articles.aiCompanion.title"),
        description: t("helpCenter.articles.aiCompanion.description"),
        url: `${basePath}/articles/ai-companion`,
        icon: Bot,
        keywords: asStringArray(
          t("helpCenter.articles.aiCompanion.keywords", { returnObjects: true })
        ),
      },
      {
        id: 6,
        title: t("helpCenter.articles.collaborations.title"),
        description: t("helpCenter.articles.collaborations.description"),
        url: `${basePath}/articles/business-collaboration`,
        icon: Handshake,
        keywords: asStringArray(
          t("helpCenter.articles.collaborations.keywords", {
            returnObjects: true,
          })
        ),
      },
    ],
    [basePath, t]
  );

  const faqCategories: FaqCategoryItem[] = useMemo(
    () => [
      {
        id: 1,
        title: t("helpCenter.faq.profile.title"),
        description: t("helpCenter.faq.profile.description"),
        path: `${basePath}/faq/profile`,
        icon: BriefcaseBusiness,
        keywords: asStringArray(
          t("helpCenter.faq.profile.keywords", { returnObjects: true })
        ),
      },
      {
        id: 2,
        title: t("helpCenter.faq.dashboard.title"),
        description: t("helpCenter.faq.dashboard.description"),
        path: `${basePath}/faq/dashboard`,
        icon: LayoutDashboard,
        keywords: asStringArray(
          t("helpCenter.faq.dashboard.keywords", { returnObjects: true })
        ),
      },
      {
        id: 3,
        title: t("helpCenter.faq.websiteBuilding.title"),
        description: t("helpCenter.faq.websiteBuilding.description"),
        path: `${basePath}/faq/website-building`,
        icon: Globe,
        keywords: asStringArray(
          t("helpCenter.faq.websiteBuilding.keywords", { returnObjects: true })
        ),
      },
      {
        id: 4,
        title: t("helpCenter.faq.collaborations.title"),
        description: t("helpCenter.faq.collaborations.description"),
        path: `${basePath}/faq/collaborations`,
        icon: Handshake,
        keywords: asStringArray(
          t("helpCenter.faq.collaborations.keywords", { returnObjects: true })
        ),
      },
      {
        id: 5,
        title: t("helpCenter.faq.crm.title"),
        description: t("helpCenter.faq.crm.description"),
        path: `${basePath}/faq/crm`,
        icon: UsersRound,
        keywords: asStringArray(
          t("helpCenter.faq.crm.keywords", { returnObjects: true })
        ),
      },
      {
        id: 6,
        title: t("helpCenter.faq.advisor.title"),
        description: t("helpCenter.faq.advisor.description"),
        path: `${basePath}/faq/BizUply-advisor`,
        icon: Bot,
        keywords: asStringArray(
          t("helpCenter.faq.advisor.keywords", { returnObjects: true })
        ),
      },
      {
        id: 7,
        title: t("helpCenter.faq.settings.title"),
        description: t("helpCenter.faq.settings.description"),
        path: `${basePath}/faq/system-settings`,
        icon: Settings,
        keywords: asStringArray(
          t("helpCenter.faq.settings.keywords", { returnObjects: true })
        ),
      },
      {
        id: 8,
        title: t("helpCenter.faq.troubleshooting.title"),
        description: t("helpCenter.faq.troubleshooting.description"),
        path: `${basePath}/faq/troubleshooting`,
        icon: Wrench,
        keywords: asStringArray(
          t("helpCenter.faq.troubleshooting.keywords", { returnObjects: true })
        ),
      },
      {
        id: 9,
        title: t("helpCenter.faq.support.title"),
        description: t("helpCenter.faq.support.description"),
        path: `${basePath}/faq/technical-support`,
        icon: HelpCircle,
        keywords: asStringArray(
          t("helpCenter.faq.support.keywords", { returnObjects: true })
        ),
      },
    ],
    [basePath, t]
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const filteredArticles = useMemo(() => {
    if (!normalizedSearch) return popularArticles;
    return popularArticles.filter((a) => itemMatchesQuery(a, normalizedSearch));
  }, [normalizedSearch, popularArticles]);

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return faqCategories;
    return faqCategories.filter((c) => itemMatchesQuery(c, normalizedSearch));
  }, [normalizedSearch, faqCategories]);

  const searchSuggestions = useMemo<{
    articles: ArticleItem[];
    categories: FaqCategoryItem[];
  }>(() => {
    if (!normalizedSearch) {
      return {
        articles: [],
        categories: [],
      };
    }

    const articleHits = popularArticles
      .filter((article) => itemMatchesQuery(article, normalizedSearch))
      .slice(0, 3);

    const categoryHits = faqCategories
      .filter((category) => itemMatchesQuery(category, normalizedSearch))
      .slice(0, 3);

    return {
      articles: articleHits,
      categories: categoryHits,
    };
  }, [normalizedSearch, popularArticles, faqCategories]);

  const hasSearchResults =
    filteredArticles.length > 0 || filteredCategories.length > 0;

  const openChatWithPrompt = useCallback((prompt: string) => {
    setInitialChatMessage(prompt);
    setChatOpen(true);
  }, []);

  const handleSuggestionClick = useCallback((query: string) => {
    setSearchTerm(query);
    setSearchFocused(false);
    searchInputRef.current?.blur();
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && searchFocused) {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchFocused]);

  const popularCardStyles = [
    "bg-violet-50 text-violet-600",
    "bg-fuchsia-50 text-fuchsia-600",
    "bg-blue-50 text-blue-600",
    "bg-cyan-50 text-cyan-600",
    "bg-emerald-50 text-emerald-600",
    "bg-amber-50 text-amber-600",
  ];

  return (
    <main
      dir={dir}
      className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-start text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* HERO */}
        <section className="relative overflow-visible rounded-[30px] border border-violet-100/80 bg-[linear-gradient(135deg,#f6f1ff_0%,#fbf9ff_46%,#eee1ff_100%)] px-5 py-7 shadow-[0_22px_70px_rgba(109,40,217,0.10)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]">
            <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="absolute bottom-[-120px] right-[12%] h-72 w-72 rounded-full bg-fuchsia-100/60 blur-3xl" />
            <div className="absolute -right-10 top-10 h-[430px] w-[430px] rounded-full border border-white/80" />
            <div className="absolute -right-2 top-14 h-[370px] w-[370px] rounded-full border border-violet-200/60" />
            <div className="absolute bottom-7 right-10 grid grid-cols-8 gap-2 opacity-25">
              {Array.from({ length: 48 }).map((_, index) => (
                <span key={index} className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              ))}
            </div>
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
            <div className="hidden min-h-[330px] items-center justify-center lg:flex">
              <div className="relative h-[285px] w-[260px]">
                <div className="absolute left-4 top-6 h-56 w-56 rounded-full border border-violet-200/80" />
                <span className="absolute left-7 top-12 h-2.5 w-2.5 rounded-full bg-violet-500/70" />
                <span className="absolute right-7 top-16 h-2 w-2 rounded-full bg-fuchsia-400/70" />
                <span className="absolute right-14 bottom-24 h-2.5 w-2.5 rounded-full bg-violet-300" />

                <div className="absolute bottom-7 left-1/2 h-7 w-44 -translate-x-1/2 rounded-full bg-violet-300/25 blur-xl" />
                <div className="absolute bottom-8 left-1/2 h-11 w-40 -translate-x-1/2 rounded-[50%] border border-violet-200/80 bg-white/80 shadow-lg" />

                <div className="absolute bottom-[54px] left-1/2 flex h-44 w-32 -translate-x-1/2 items-center justify-center rounded-[28px] border border-white bg-gradient-to-br from-white to-violet-50 shadow-[0_26px_60px_rgba(109,40,217,0.16)]">
                  <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-[28px] border border-violet-100 bg-white/50" />
                  <span className="text-[86px] font-black leading-none text-violet-700">?</span>
                </div>

                <div className="absolute bottom-8 left-1 h-16 w-16 rounded-2xl border border-slate-100 bg-white shadow-lg" />
                <div className="absolute bottom-[66px] left-[27px] h-9 w-2 rounded-full bg-emerald-500/70" />
                <div className="absolute bottom-[89px] left-[17px] h-6 w-5 rotate-[-24deg] rounded-full bg-emerald-400/80" />
                <div className="absolute bottom-[82px] left-[30px] h-6 w-5 rotate-[24deg] rounded-full bg-emerald-300/80" />
                <div className="absolute bottom-[105px] left-[27px] h-6 w-5 rounded-full bg-emerald-500/70" />
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-4 py-2 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                <BookOpen size={15} />
                {t("helpCenter.badge")}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-[#1f1b55] sm:text-5xl lg:text-[62px] lg:leading-[1.02]">
                {t("helpCenter.title")}
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
                {t("helpCenter.subtitle")}
              </p>

              <div className="relative mx-auto mt-7 max-w-3xl">
                <div
                  className={`relative flex items-center overflow-hidden rounded-[20px] border bg-white transition-all duration-200 ${
                    searchFocused
                      ? "border-violet-300 shadow-[0_0_0_5px_rgba(139,92,246,0.12),0_22px_45px_rgba(109,40,217,0.12)]"
                      : "border-white shadow-[0_14px_34px_rgba(76,29,149,0.10)]"
                  }`}
                >
                  <Search size={22} className="pointer-events-none absolute end-5 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("helpCenter.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    dir={dir}
                    aria-label={t("helpCenter.searchAria")}
                    autoComplete="off"
                    className="h-[64px] w-full bg-transparent pe-14 ps-14 text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute start-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                      aria-label={t("helpCenter.clearSearchAria")}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {searchFocused && normalizedSearch && (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-violet-100 bg-white text-start shadow-[0_26px_60px_rgba(15,23,42,0.16)]">
                    {searchSuggestions.articles.length > 0 && (
                      <div className="border-b border-slate-100 p-2.5">
                        <p className="px-3 py-2 text-xs font-black text-slate-400">
                          {t("helpCenter.guides")}
                        </p>
                        {searchSuggestions.articles.map((article) => {
                          const Icon = article.icon;
                          return (
                            <Link
                              key={article.id}
                              to={article.url}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-violet-50"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                <Icon size={17} />
                              </div>
                              <div className="min-w-0 text-start">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {article.title}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {article.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {searchSuggestions.categories.length > 0 && (
                      <div className="p-2.5">
                        <p className="px-3 py-2 text-xs font-black text-slate-400">
                          {t("helpCenter.categories")}
                        </p>
                        {searchSuggestions.categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => navigate(cat.path)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-violet-50"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <Icon size={17} />
                              </div>
                              <div className="min-w-0 text-start">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {cat.title}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {cat.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {!hasSearchResults && (
                      <div className="px-5 py-7 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {t("helpCenter.noResults")}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openChatWithPrompt(
                              t("helpCenter.searchingFor", { term: searchTerm })
                            )
                          }
                          className="mt-2 text-sm font-black text-violet-700 hover:underline"
                        >
                          {t("helpCenter.askAssistant")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isSearching && (
                <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
                  {suggestedQueries.map((sq) => {
                    const Icon = sq.icon;
                    return (
                      <button
                        key={sq.query}
                        type="button"
                        onClick={() => handleSuggestionClick(sq.query)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-[0_7px_18px_rgba(76,29,149,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:text-sm"
                      >
                        {Icon ? <Icon size={17} className="text-violet-600" /> : null}
                        {sq.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="mt-5 text-xs text-violet-500/70">
                {t("helpCenter.quickSearchHint")}{" "}
                <kbd className="rounded-md border border-violet-200 bg-white/70 px-2 py-0.5 font-mono text-violet-700">
                  /
                </kbd>
              </p>
            </div>
          </div>
        </section>

        {isSearching && (
          <section className="mt-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                {t("helpCenter.resultsFor", { term: searchTerm })}
              </h2>
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                <ArrowLeft size={15} /> {t("helpCenter.backToTopics")}
              </button>
            </div>

            {hasSearchResults ? (
              <div className="space-y-8">
                {filteredArticles.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-500">
                      {t("helpCenter.guidesCount", {
                        count: filteredArticles.length,
                      })}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredArticles.map((article, index) => {
                        const Icon = article.icon;
                        return (
                          <Link
                            key={article.id}
                            to={article.url}
                            className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg"
                          >
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${popularCardStyles[index % popularCardStyles.length]}`}
                            >
                              <Icon size={21} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900">
                                {article.title}
                              </p>
                              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                {article.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredCategories.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-500">
                      {t("helpCenter.categoriesCount", {
                        count: filteredCategories.length,
                      })}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCategories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => navigate(cat.path)}
                            className="group flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-start shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                              <Icon size={19} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900">
                                {cat.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {cat.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                <HelpCircle size={40} className="mx-auto text-slate-300" />
                <p className="mt-4 text-lg font-black text-slate-700">
                  {t("helpCenter.noResultsTitle")}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {t("helpCenter.noResultsHint")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openChatWithPrompt(
                      t("helpCenter.searchingHelpFor", { term: searchTerm })
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-violet-700"
                >
                  <Bot size={16} /> {t("helpCenter.askAssistantShort")}
                </button>
              </div>
            )}
          </section>
        )}

        {!isSearching && (
          <>
            <section className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-violet-600">
                    <Sparkles size={16} />
                    <span className="text-sm font-black">
                      {t("helpCenter.popularTopics")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("helpCenter.popularTopicsHint")}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {popularArticles.slice(0, 5).map((article, index) => {
                  const Icon = article.icon;
                  return (
                    <Link
                      key={article.id}
                      to={article.url}
                      className="group flex min-h-[270px] flex-col rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_45px_rgba(109,40,217,0.09)]"
                    >
                      <div
                        className={`flex h-13 w-13 items-center justify-center rounded-2xl ${popularCardStyles[index % popularCardStyles.length]}`}
                      >
                        <Icon size={23} />
                      </div>
                      <h3 className="mt-5 text-base font-black leading-7 text-slate-900">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {article.description}
                      </p>
                      <div className="mt-auto pt-5">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 text-violet-600 transition group-hover:bg-violet-50">
                          <ChevronLeft size={17} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="mt-14 rounded-[30px] border border-violet-100 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] sm:p-7">
              <h2 className="text-2xl font-black text-slate-900">
                {t("helpCenter.browseByTopic")}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {t("helpCenter.browseByTopicHint")}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => navigate(cat.path)}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#fbfaff] p-4 text-start transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900">{cat.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {cat.description}
                        </p>
                      </div>
                      <ChevronLeft
                        size={16}
                        className="shrink-0 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-violet-600"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-black text-slate-900">
                {t("helpCenter.moreHelp")}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/business-support")}
                  className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">
                      {t("helpCenter.contactSupport")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {t("helpCenter.contactSupportHint")}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-violet-600">
                      {t("helpCenter.sendRequest")} <ChevronLeft size={14} />
                    </span>
                  </div>
                </button>
                <Link
                  to={`${basePath}/faq/troubleshooting`}
                  className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">
                      {t("helpCenter.troubleshooting")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {t("helpCenter.troubleshootingHint")}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-violet-600">
                      {t("helpCenter.viewGuide")} <ChevronLeft size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>

      <ChatBot
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        initialMessage={initialChatMessage}
        onInitialMessageSent={() => setInitialChatMessage(null)}
      />
    </main>
  );
}
