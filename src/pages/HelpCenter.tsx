import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Search,
  Settings,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";

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
};

const SUGGESTED_QUERIES: QuickAction[] = [
  { label: "איך לבנות אתר?", query: "בניית אתר" },
  { label: "איך לפרסם את האתר?", query: "פרסום אתר" },
  { label: "איך לנהל תורים ו-CRM?", query: "CRM תורים" },
  { label: "איך להשתמש ביועץ AI?", query: "יועץ AI" },
  { label: "עריכת פרופיל עסקי", query: "פרופיל עסקי" },
  { label: "הגדרות SEO לאתר", query: "SEO" },
];

const AI_QUICK_PROMPTS: QuickAction[] = [
  { label: "איך ליצור אתר חדש?", query: "איך ליצור אתר חדש ב-Bizuply?" },
  { label: "איך לפרסם את האתר?", query: "איך מפרסמים אתר ב-Bizuply?" },
  { label: "הדשבורד לא מתעדכן", query: "הדשבורד לא מתעדכן, מה לעשות?" },
  { label: "איך לקבוע תור ללקוח?", query: "איך לקבוע תור ללקוח?" },
];

function matchesSearch(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

function itemMatchesQuery(
  item: { title: string; description?: string; keywords?: string[] },
  query: string
) {
  if (matchesSearch(item.title, query)) return true;
  if (item.description && matchesSearch(item.description, query)) return true;
  if (item.keywords?.some((kw) => matchesSearch(kw, query))) return true;
  return false;
}

export default function HelpCenter() {
  const { user } = useAuth() as AuthContextValue;
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

  const popularArticles: ArticleItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "בניית עמוד עסקי",
        description:
          "מדריך שלב־אחר־שלב ליצירת עמוד עסקי מקצועי ומושך שמביא לקוחות חדשים.",
        url: `${basePath}/articles/build-business-page`,
        icon: BriefcaseBusiness,
        keywords: ["עמוד", "פרופיל", "לוגו", "גלריה", "קטגוריה"],
      },
      {
        id: 2,
        title: "בניית אתר",
        description:
          "מדריך מלא ליצירת אתר מקצועי — מתבנית, עם AI, עריכה ופרסום.",
        url: `${basePath}/articles/website-building-guide`,
        icon: Globe,
        keywords: ["אתר", "תבנית", "AI", "עורך", "פרסום", "SEO"],
      },
      {
        id: 3,
        title: "דשבורד העסק",
        description:
          "גלה איך הדשבורד נותן לך שליטה מלאה ותצוגה ברורה על כל מה שקורה בעסק.",
        url: `${basePath}/articles/dashboard-guide`,
        icon: LayoutDashboard,
        keywords: ["דשבורד", "סטטיסטיקות", "גרפים", "ניתוח"],
      },
      {
        id: 4,
        title: "קביעת תורים / CRM",
        description:
          "נהל תורים ולקוחות במקום אחד — בצורה פשוטה, מסודרת ויעילה.",
        url: `${basePath}/articles/appointment-crm-guide`,
        icon: CalendarDays,
        keywords: ["CRM", "תורים", "לקוחות", "יומן", "קביעה"],
      },
      {
        id: 5,
        title: "יועץ ה־AI של Bizuply",
        description:
          "הכירו את העוזר הדיגיטלי שמחזק את העסק בעזרת בינה מלאכותית.",
        url: `${basePath}/articles/ai-companion`,
        icon: Bot,
        keywords: ["AI", "בינה מלאכותית", "יועץ", "עוזר"],
      },
      {
        id: 6,
        title: "שיתופי פעולה עסקיים",
        description:
          "למד איך להרחיב את העסק באמצעות שיתופי פעולה חזקים עם עסקים אחרים.",
        url: `${basePath}/articles/business-collaboration`,
        icon: Handshake,
        keywords: ["שיתוף", "שותפות", "הרחבה", "collaboration"],
      },
    ],
    [basePath]
  );

  const faqCategories: FaqCategoryItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "פרופיל עסקי",
        description: "עריכת פרטים, גלריה, קטגוריה ומיקום",
        path: `${basePath}/faq/profile`,
        icon: BriefcaseBusiness,
        keywords: ["פרופיל", "עמוד", "גלריה", "לוגו"],
      },
      {
        id: 2,
        title: "דשבורד",
        description: "סטטיסטיקות, גרפים, יומן וניתוח נתונים",
        path: `${basePath}/faq/dashboard`,
        icon: LayoutDashboard,
        keywords: ["דשבורד", "גרפים", "סטטיסטיקות"],
      },
      {
        id: 3,
        title: "בניית אתר",
        description: "יצירה, עריכה, SEO ופרסום אתרים",
        path: `${basePath}/faq/website-building`,
        icon: Globe,
        keywords: ["אתר", "תבנית", "AI", "עורך", "פרסום", "SEO"],
      },
      {
        id: 4,
        title: "שיתופי פעולה",
        description: "יצירת שותפויות והרחבת העסק",
        path: `${basePath}/faq/collaborations`,
        icon: Handshake,
        keywords: ["שיתוף", "שותפות"],
      },
      {
        id: 5,
        title: "CRM",
        description: "ניהול לקוחות, תורים ומעקב",
        path: `${basePath}/faq/crm`,
        icon: UsersRound,
        keywords: ["CRM", "תורים", "לקוחות"],
      },
      {
        id: 6,
        title: "יועץ Bizuply",
        description: "שימוש בעוזר AI לקידום העסק",
        path: `${basePath}/faq/BizUply-advisor`,
        icon: Bot,
        keywords: ["AI", "יועץ", "בינה מלאכותית"],
      },
      {
        id: 7,
        title: "הגדרות מערכת",
        description: "הגדרות חשבון, התראות ואבטחה",
        path: `${basePath}/faq/system-settings`,
        icon: Settings,
        keywords: ["הגדרות", "חשבון", "אבטחה"],
      },
      {
        id: 8,
        title: "תקלות ושגיאות",
        description: "פתרון בעיות נפוצות ושגיאות מערכת",
        path: `${basePath}/faq/troubleshooting`,
        icon: Wrench,
        keywords: ["תקלה", "שגיאה", "בעיה", "לא עובד"],
      },
      {
        id: 9,
        title: "תמיכה טכנית",
        description: "יצירת קשר עם צוות התמיכה",
        path: `${basePath}/faq/technical-support`,
        icon: HelpCircle,
        keywords: ["תמיכה", "עזרה", "צוות"],
      },
    ],
    [basePath]
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
    .filter((article) =>
      itemMatchesQuery(article, normalizedSearch),
    )
    .slice(0, 3);

  const categoryHits = faqCategories
    .filter((category) =>
      itemMatchesQuery(category, normalizedSearch),
    )
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

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── HERO + SEARCH ── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 px-6 py-12 text-white shadow-2xl shadow-violet-500/25 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />


          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur-sm">
              <BookOpen size={14} />
              מרכז העזרה של Bizuply
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              היי, איך אפשר לעזור?
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-violet-100 sm:text-base">
              חפש מדריכים, שאלות נפוצות או שאל את העוזר החכם של Bizuply
            </p>

            {/* Search bar */}
            <div className="relative mt-8">
              <div
                className={`relative flex items-center overflow-hidden rounded-2xl bg-white shadow-xl transition-shadow ${
                  searchFocused
                    ? "ring-4 ring-white/30 shadow-2xl"
                    : "shadow-lg"
                }`}
              >
                <Search
                  size={20}
                  className="pointer-events-none absolute right-5 text-slate-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="חפש מדריכים, קטגוריות או נושאים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  dir="rtl"
                  aria-label="חיפוש במרכז העזרה"
                  autoComplete="off"
                  className="h-14 w-full bg-transparent pr-13 pl-12 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    aria-label="נקה חיפוש"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Live suggestions dropdown */}
              {searchFocused && normalizedSearch && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white text-right shadow-2xl">
                  {searchSuggestions.articles.length > 0 && (
                    <div className="border-b border-slate-100 p-2">
                      <p className="px-3 py-1.5 text-xs font-bold text-slate-400">
                        מדריכים
                      </p>
                      {searchSuggestions.articles.map((article) => {
                        const Icon = article.icon;
                        return (
                          <Link
                            key={article.id}
                            to={article.url}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-violet-50"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 text-right">
                              <p className="truncate text-sm font-bold text-slate-900">
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
                    <div className="p-2">
                      <p className="px-3 py-1.5 text-xs font-bold text-slate-400">
                        קטגוריות
                      </p>
                      {searchSuggestions.categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => navigate(cat.path)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-violet-50"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 text-right">
                              <p className="truncate text-sm font-bold text-slate-900">
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
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        לא נמצאו תוצאות
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          openChatWithPrompt(`אני מחפש: ${searchTerm}`)
                        }
                        className="mt-2 text-sm font-bold text-violet-600 hover:underline"
                      >
                        שאל את העוזר החכם של Bizuply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suggested query chips */}
            {!isSearching && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUERIES.map((sq) => (
                  <button
                    key={sq.query}
                    type="button"
                    onClick={() => handleSuggestionClick(sq.query)}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    {sq.label}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-violet-200/70">
              לחץ <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">/</kbd>{" "}
              לחיפוש מהיר
            </p>
          </div>
        </section>

        {/* ── SEARCH RESULTS (full page) ── */}
        {isSearching && (
          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                תוצאות עבור &ldquo;{searchTerm}&rdquo;
              </h2>
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline"
              >
                <ArrowLeft size={14} />
                חזרה לכל הנושאים
              </button>
            </div>

            {hasSearchResults ? (
              <div className="space-y-8">
                {filteredArticles.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-500">
                      מדריכים ({filteredArticles.length})
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {filteredArticles.map((article) => {
                        const Icon = article.icon;
                        return (
                          <Link
                            key={article.id}
                            to={article.url}
                            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-md"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {article.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
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
                      קטגוריות ({filteredCategories.length})
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCategories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => navigate(cat.path)}
                            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-violet-200 hover:shadow-md"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-violet-600 group-hover:text-white">
                              <Icon size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {cat.title}
                              </p>
                              <p className="text-xs text-slate-500">
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
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <HelpCircle
                  size={40}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-4 text-lg font-bold text-slate-700">
                  לא מצאנו תוצאות
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  נסה מילות חיפוש אחרות, או שאל את העוזר החכם של Bizuply
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openChatWithPrompt(`אני מחפש עזרה בנושא: ${searchTerm}`)
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                >
                  <Bot size={16} />
                  שאל את העוזר החכם
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── DEFAULT VIEW (no active search) ── */}
        {!isSearching && (
          <>
            {/* Popular topics — Facebook-style */}
            <section className="mt-10">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                נושאים פופולריים
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                המדריכים והנושאים הנפוצים ביותר ב-Bizuply
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularArticles.map((article) => {
                  const Icon = article.icon;
                  return (
                    <Link
                      key={article.id}
                      to={article.url}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Icon size={22} />
                      </div>
                      <h3 className="mt-4 text-base font-black text-slate-900">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        {article.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-600 opacity-0 transition group-hover:opacity-100">
                        קרא עוד
                        <ChevronLeft size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Browse by topic — Wix-style */}
            <section className="mt-12">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                עיון לפי נושא
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                בחר קטגוריה ומצא תשובות לשאלות הנפוצות ביותר
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => navigate(cat.path)}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-violet-200 hover:bg-violet-50/50 hover:shadow-sm"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{cat.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {cat.description}
                        </p>
                      </div>
                      <ChevronLeft
                        size={16}
                        className="shrink-0 text-slate-300 transition group-hover:text-violet-600"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* AI Assistant — Facebook-style */}
            <section className="mt-12 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/30">
                    <Sparkles size={26} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      שיחה עם העוזר החכם של Bizuply
                    </h2>
                    <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-600">
                      קבל תשובות מיידיות, פתור בעיות ולמד איך להשתמש בפלטפורמה
                      — זמין 24/7
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="shrink-0 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700"
                >
                  התחל שיחה
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {AI_QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.query}
                    type="button"
                    onClick={() => openChatWithPrompt(prompt.query)}
                    className="rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Additional help options */}
            <section className="mt-10">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                דרכים נוספות לקבלת עזרה
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/business-support")}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-right transition hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">פנייה לתמיכה</p>
                    <p className="mt-1 text-sm text-slate-500">
                      שלח פנייה לצוות התמיכה ונחזור אליך בהקדם
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-violet-600 opacity-0 transition group-hover:opacity-100">
                      שלח פנייה
                      <ChevronLeft size={14} />
                    </span>
                  </div>
                </button>

                <Link
                  to={`${basePath}/faq/troubleshooting`}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-right transition hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">
                      פתרון תקלות נפוצות
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      מדריך לפתרון בעיות טכניות ושגיאות מערכת
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-violet-600 opacity-0 transition group-hover:opacity-100">
                      צפה במדריך
                      <ChevronLeft size={14} />
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
