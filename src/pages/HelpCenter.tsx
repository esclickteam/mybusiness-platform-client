import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronLeft,
  HelpCircle,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  UsersRound,
  Wrench,
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
};

type FaqCategoryItem = {
  id: number;
  title: string;
  path: string;
  icon: React.ElementType;
};

export default function HelpCenter() {
  const { user } = useAuth() as AuthContextValue;
  const businessId = user?.businessId;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const popularArticles: ArticleItem[] = [
    {
      id: 1,
      title: "בניית עמוד עסקי",
      description:
        "מדריך שלב־אחר־שלב ליצירת עמוד עסקי מקצועי ומושך שמביא לקוחות חדשים.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/build-business-page`
        : "/",
      icon: BriefcaseBusiness,
    },
    {
      id: 2,
      title: "שימוש נכון בצ׳אט עם לקוחות",
      description:
        "טיפים לניהול שיחות חכמות עם לקוחות ולחיזוק הקשר עם הלקוחות שלך.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/chat-guide`
        : "/",
      icon: MessageCircle,
    },
    {
      id: 3,
      title: "דשבורד העסק",
      description:
        "גלה איך הדשבורד נותן לך שליטה מלאה ותצוגה ברורה על כל מה שקורה בעסק.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/dashboard-guide`
        : "/",
      icon: LayoutDashboard,
    },
    {
      id: 4,
      title: "קביעת תורים / CRM",
      description:
        "נהל תורים ולקוחות במקום אחד — בצורה פשוטה, מסודרת ויעילה.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/appointment-crm-guide`
        : "/",
      icon: UsersRound,
    },
    {
      id: 5,
      title: "יועץ ה־AI של Bizuply",
      description:
        "הכירו את העוזר הדיגיטלי שמחזק את העסק בעזרת בינה מלאכותית.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/ai-companion`
        : "/",
      icon: Bot,
    },
    {
      id: 6,
      title: "שיתופי פעולה עסקיים",
      description:
        "למד איך להרחיב את העסק באמצעות שיתופי פעולה חזקים עם עסקים אחרים.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/business-collaboration`
        : "/",
      icon: UsersRound,
    },
  ];

  const faqCategories: FaqCategoryItem[] = [
    {
      id: 1,
      title: "פרופיל עסקי",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/profile`
        : "/",
      icon: BriefcaseBusiness,
    },
    {
      id: 2,
      title: "דשבורד",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/dashboard`
        : "/",
      icon: LayoutDashboard,
    },
    {
      id: 3,
      title: "הודעות לקוחות",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/customer-messages`
        : "/",
      icon: MessageCircle,
    },
    {
      id: 4,
      title: "שיתופי פעולה",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/collaborations`
        : "/",
      icon: UsersRound,
    },
    {
      id: 5,
      title: "CRM",
      path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/",
      icon: UsersRound,
    },
    {
      id: 6,
      title: "יועץ Bizuply",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/BizUply-advisor`
        : "/",
      icon: Bot,
    },
    {
      id: 7,
      title: "הגדרות מערכת",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/system-settings`
        : "/",
      icon: Settings,
    },
    {
      id: 8,
      title: "תקלות ושגיאות",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/troubleshooting`
        : "/",
      icon: Wrench,
    },
    {
      id: 9,
      title: "תמיכה טכנית",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/technical-support`
        : "/",
      icon: HelpCircle,
    },
  ];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return faqCategories;

    return faqCategories.filter((category) =>
      category.title.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const filteredArticles = useMemo(() => {
    if (!normalizedSearch) return popularArticles;

    return popularArticles.filter((article) =>
      article.title.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 px-6 py-10 text-slate-950 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
              <BookOpen size={15} />
              מרכז ידע ותמיכה
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              מרכז הידע של Bizuply
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              כאן תמצא מדריכים, כלים חכמים ותשובות שיעזרו לך לנהל, להבין
              ולפתח את העסק שלך בצורה מסודרת ובטוחה.
            </p>

            {/* SEARCH */}
            <div className="mt-8 max-w-3xl">
              <div className="relative">
                <Search
                  size={20}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder='חפש נושאים כמו "דשבורד", "CRM" או "יועץ AI"...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  dir="rtl"
                  aria-label="חיפוש קטגוריות ומאמרים"
                  autoComplete="off"
                  className="
                    h-14 w-full rounded-2xl border border-violet-100 bg-white
                    pr-13 pl-4 text-sm font-bold text-slate-950 shadow-xl
                    outline-none transition placeholder:text-slate-400
                    focus:border-violet-300 focus:ring-4 focus:ring-violet-100
                  "
                />
              </div>
            </div>
          </div>
        </section>

        {normalizedSearch === "" ? (
          <>
            {/* FEATURED ARTICLES */}
            <section className="mt-8">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
                    מדריכים מומלצים
                  </div>

                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    מדריכים ומאמרים שיעזרו לך להתחיל
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {popularArticles.map((article) => {
                  const Icon = article.icon;

                  return (
                    <article
                      key={article.id}
                      className="
                        group flex min-h-[230px] flex-col justify-between
                        rounded-[1.75rem] border border-slate-200/70 bg-white
                        p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]
                        transition hover:-translate-y-1 hover:border-violet-200
                        hover:shadow-[0_24px_70px_rgba(109,40,217,0.12)]
                      "
                    >
                      <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
                          <Icon size={21} />
                        </div>

                        <h3 className="mt-4 text-lg font-black text-slate-950">
                          {article.title}
                        </h3>

                        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                          {article.description}
                        </p>
                      </div>

                      <Link
                        to={article.url}
                        className="
                          mt-5 inline-flex h-11 items-center justify-center gap-2
                          rounded-2xl bg-violet-600 px-5 text-sm font-black
                          text-white shadow-lg shadow-violet-500/20 transition
                          hover:-translate-y-0.5 hover:bg-violet-700
                        "
                        aria-label={`מידע נוסף על ${article.title}`}
                      >
                        למידע נוסף
                        <ChevronLeft size={17} />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* FAQ CATEGORIES */}
            <section className="mt-10">
              <div className="mb-5">
                <div className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-600">
                  שאלות נפוצות
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  חיפוש לפי קטגוריה
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {faqCategories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryClick(category.path)}
                      className="
                        group flex min-h-[96px] items-center justify-between gap-4
                        rounded-[1.5rem] border border-slate-200 bg-white p-5
                        text-right shadow-sm transition hover:-translate-y-0.5
                        hover:border-violet-200 hover:bg-violet-50
                      "
                      aria-label={`פתיחת שאלות נפוצות בקטגוריה ${category.title}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-violet-700 group-hover:text-white">
                          <Icon size={21} />
                        </div>

                        <span className="text-sm font-black text-slate-950">
                          {category.title}
                        </span>
                      </div>

                      <ChevronLeft
                        size={18}
                        className="shrink-0 text-slate-400 transition group-hover:text-violet-700"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-7">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              תוצאות חיפוש עבור "{searchTerm}"
            </h2>

            <div className="mt-6">
              <h3 className="mb-4 text-lg font-black text-slate-950">
                מאמרים
              </h3>

              {filteredArticles.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredArticles.map((article) => {
                    const Icon = article.icon;

                    return (
                      <article
                        key={article.id}
                        className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                          <Icon size={20} />
                        </div>

                        <h4 className="mt-4 text-base font-black text-slate-950">
                          {article.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {article.description}
                        </p>

                        <Link
                          to={article.url}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-black text-violet-700 hover:underline"
                          aria-label={`מידע נוסף על ${article.title}`}
                        >
                          למידע נוסף
                          <ChevronLeft size={16} />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm font-bold text-slate-500">
                  לא נמצאו מאמרים שתואמים לחיפוש שלך.
                </p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-black text-slate-950">
                קטגוריות
              </h3>

              {filteredCategories.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryClick(category.path)}
                        className="
                          group flex min-h-[86px] items-center justify-between
                          gap-4 rounded-[1.5rem] border border-slate-200
                          bg-white p-5 text-right shadow-sm transition
                          hover:-translate-y-0.5 hover:border-violet-200
                          hover:bg-violet-50
                        "
                        aria-label={`פתיחת שאלות נפוצות בקטגוריה ${category.title}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-violet-700 group-hover:text-white">
                            <Icon size={20} />
                          </div>

                          <span className="text-sm font-black text-slate-950">
                            {category.title}
                          </span>
                        </div>

                        <ChevronLeft
                          size={18}
                          className="shrink-0 text-slate-400 transition group-hover:text-violet-700"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm font-bold text-slate-500">
                  לא נמצאו קטגוריות שתואמות לחיפוש שלך.
                </p>
              )}
            </div>
          </section>
        )}

        {/* CONTACT SUPPORT */}
        <section className="mt-10 overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 text-center text-slate-950 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <HelpCircle size={26} />
          </div>

          <h2 className="mt-4 text-2xl font-black">צריך עזרה נוספת?</h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
            צוות התמיכה שלנו כאן כדי לעזור לך בכל שאלה, תקלה או דבר שצריך
            לבדוק.
          </p>

          <button
            type="button"
            onClick={() => navigate("/business-support")}
            className="
              mt-6 inline-flex h-12 items-center justify-center rounded-2xl
              bg-violet-600 px-7 text-sm font-black text-white shadow-lg
              shadow-violet-500/20 transition hover:-translate-y-0.5
              hover:bg-violet-700
            "
            aria-label="מעבר לעמוד תמיכה לעסקים"
          >
            פנייה לתמיכה
          </button>
        </section>
      </div>

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </main>
  );
}