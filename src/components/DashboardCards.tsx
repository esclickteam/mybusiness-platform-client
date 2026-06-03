import React from "react";
import {
  CalendarDays,
  DollarSign,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
} from "lucide-react";

type DashboardStats = {
  views_count?: number;
  reviews_count?: number;
  appointments_count?: number;
  messages_count?: number;
  revenue_count?: number;
  revenue?: number;
};

type TranslationValues = Record<string, string | number>;
type TFunction = (key: string, values?: TranslationValues) => string;

type DashboardCardsProps = {
  stats?: DashboardStats;
  t?: TFunction;
  locale?: string;
  currency?: string;
};

type CardTone = "violet" | "green" | "blue" | "amber" | "pink";

type CardItem = {
  key: string;
  label: string;
  value: string | number;
  trend: string;
  period: string;
  tone: CardTone;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  sparkline: string;
};

const fallbackT: TFunction = (key, values) => {
  const dictionary: Record<string, string> = {
    "dashboard.cards.ariaLabel": "Dashboard key metrics",
    "dashboard.cards.profileViews": "Views",
    "dashboard.cards.appointments": "Appointments",
    "dashboard.cards.messages": "Messages",
    "dashboard.cards.revenue": "Revenue",
    "dashboard.cards.reviews": "Reviews",
    "dashboard.cards.vsLast7Days": "vs last 7 days",
  };

  let text = dictionary[key] || key;

  if (values) {
    Object.entries(values).forEach(([valueKey, value]) => {
      text = text.split(`{{${valueKey}}}`).join(String(value));
    });
  }

  return text;
};

const formatNumber = (value?: number, locale = "en-US") => {
  return new Intl.NumberFormat(locale).format(value ?? 0);
};

const formatMoney = (value?: number, locale = "en-US", currency = "USD") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const isHebrewLocale = (locale: string) => {
  return locale === "he" || locale === "he-IL" || locale.startsWith("he-");
};

const toneMap: Record<
  CardTone,
  {
    icon: string;
    line: string;
    gradient: string;
    glow: string;
  }
> = {
  violet: {
    icon: "bg-violet-100 text-violet-700",
    line: "#8b5cf6",
    gradient: "from-violet-50 via-white to-white",
    glow: "bg-violet-300/25",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-700",
    line: "#22c55e",
    gradient: "from-emerald-50 via-white to-white",
    glow: "bg-emerald-300/20",
  },
  blue: {
    icon: "bg-sky-100 text-sky-700",
    line: "#38bdf8",
    gradient: "from-sky-50 via-white to-white",
    glow: "bg-sky-300/20",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    line: "#f59e0b",
    gradient: "from-amber-50 via-white to-white",
    glow: "bg-amber-300/20",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600",
    line: "#ec4899",
    gradient: "from-pink-50 via-white to-white",
    glow: "bg-pink-300/20",
  },
};

const MiniLine = ({ color, path }: { color: string; path: string }) => (
  <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-[45%] opacity-95">
    <svg
      viewBox="0 0 220 70"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`${path} L220 70 L0 70 Z`}
        fill={color}
        opacity="0.11"
      />
    </svg>
  </div>
);

const DashboardCards = React.memo(
  ({
    stats = {},
    t = fallbackT,
    locale = "en-US",
    currency = "USD",
  }: DashboardCardsProps) => {
    const isRtl = isHebrewLocale(locale);
    const revenueValue = stats.revenue ?? stats.revenue_count ?? 0;

    const cards: CardItem[] = [
      {
        key: "appointments",
        label: t("dashboard.cards.appointments"),
        value: formatNumber(stats.appointments_count, locale),
        trend: "18%",
        period: t("dashboard.cards.vsLast7Days"),
        tone: "violet",
        Icon: CalendarDays,
        sparkline:
          "M0 42 C20 42 22 20 42 24 C60 28 58 40 77 37 C95 34 92 17 112 18 C132 19 127 42 148 38 C166 35 166 24 184 27 C202 30 202 18 220 16",
      },
      {
        key: "revenue",
        label: t("dashboard.cards.revenue"),
        value: formatMoney(revenueValue, locale, currency),
        trend: "24%",
        period: t("dashboard.cards.vsLast7Days"),
        tone: "green",
        Icon: DollarSign,
        sparkline:
          "M0 46 C16 28 22 18 40 29 C58 40 61 38 78 43 C94 48 96 30 112 31 C130 32 132 19 150 17 C169 15 169 42 188 35 C205 28 202 23 220 26",
      },
      {
        key: "messages",
        label: t("dashboard.cards.messages"),
        value: formatNumber(stats.messages_count, locale),
        trend: "12%",
        period: t("dashboard.cards.vsLast7Days"),
        tone: "blue",
        Icon: MessageCircle,
        sparkline:
          "M0 50 C18 47 18 39 34 40 C53 42 49 28 68 30 C87 32 82 14 102 13 C121 12 117 52 137 46 C154 41 154 37 172 38 C192 39 190 24 208 22 C214 21 216 26 220 27",
      },
      {
        key: "reviews",
        label: t("dashboard.cards.reviews"),
        value: stats.reviews_count ? Number(stats.reviews_count).toFixed(1) : "0.0",
        trend: "0.3",
        period: t("dashboard.cards.vsLast7Days"),
        tone: "amber",
        Icon: Star,
        sparkline:
          "M0 48 C22 48 20 42 42 42 C62 42 58 36 78 35 C100 34 97 28 118 30 C138 32 138 24 158 25 C179 26 176 36 196 31 C210 27 211 20 220 18",
      },
      {
        key: "profileViews",
        label: t("dashboard.cards.profileViews"),
        value: formatNumber(stats.views_count, locale),
        trend: "35%",
        period: t("dashboard.cards.vsLast7Days"),
        tone: "pink",
        Icon: Eye,
        sparkline:
          "M0 46 C19 46 17 41 36 39 C54 37 49 20 68 19 C88 18 82 34 102 31 C122 28 119 35 139 36 C158 37 157 38 176 38 C197 38 194 27 212 25 C216 24 218 27 220 28",
      },
    ];

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        role="list"
        aria-label={t("dashboard.cards.ariaLabel")}
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {cards.map((card) => {
          const Icon = card.Icon;
          const tone = toneMap[card.tone];

          return (
            <article
              key={card.key}
              role="listitem"
              aria-label={`${card.label}: ${card.value}`}
              className={`group relative min-h-[170px] overflow-hidden rounded-[26px] border border-slate-200/80 bg-gradient-to-br ${tone.gradient} p-5 shadow-[0_18px_45px_rgba(15,23,42,0.065)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_60px_rgba(124,58,237,0.14)]`}
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full ${tone.glow} blur-2xl`} />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon} shadow-inner`}>
                  <Icon size={22} />
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-black text-emerald-600 ring-1 ring-emerald-100">
                  <TrendingUp size={12} />
                  <span>↑ {card.trend}</span>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <p className="text-sm font-black text-slate-700">{card.label}</p>
                <h3 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {card.period}
                </p>
              </div>

              <MiniLine color={tone.line} path={card.sparkline} />
            </article>
          );
        })}
      </section>
    );
  }
);

DashboardCards.displayName = "DashboardCards";

export default DashboardCards;
