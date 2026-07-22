import React, { useEffect } from "react";

type DashboardStats = {
  views_count?: number;
  reviews_count?: number;
  appointments_count?: number;
  messages_count?: number;
};

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type DashboardCardsProps = {
  stats?: DashboardStats;
  t?: TFunction;
  locale?: string;
};

type CardItem = {
  key: string;
  label: string;
  value: string | number;
  trend: string;
  trendColor: string;
  iconBg: string;
  iconColor: string;
  lineColor: string;
  Icon: React.FC;
};

const fallbackT: TFunction = (key, values) => {
  const dictionary: Record<string, string> = {
    "dashboard.cards.ariaLabel": "Dashboard key metrics",
    "dashboard.cards.profileViews": "Profile Views",
    "dashboard.cards.appointments": "Appointments",
    "dashboard.cards.messages": "Messages",
    "dashboard.cards.reviews": "Reviews",
    "dashboard.cards.period30Days": "30 days",
    "dashboard.cards.vsLast30Days": "vs last 30 days",
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
const isHebrewLocale = (locale: string) => {
  return locale === "he" || locale === "he-IL";
};

const ProfileViewsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M20 8v6" />
    <path d="M23 11h-6" />
  </svg>
);

const AppointmentsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="4" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
  </svg>
);

const MessagesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    <path d="M8 10h.01" />
    <path d="M12 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);
const ReviewsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="currentColor"
  >
    <path d="M12 2.8l2.74 5.55 6.13.89-4.44 4.33 1.05 6.11L12 16.8l-5.48 2.88 1.05-6.11-4.44-4.33 6.13-.89L12 2.8z" />
  </svg>
);

const MiniLine = ({ color }: { color: string }) => (
  <div className="mt-5 h-7 w-full overflow-hidden">
    <svg
      viewBox="0 0 220 44"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path
        d="M0 34 C18 34 18 28 35 28 C51 28 52 20 68 22 C85 24 84 31 101 31 C118 31 118 27 134 28 C153 29 153 35 171 34 C190 33 190 22 207 23 C215 23 216 19 220 17"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M0 34 C18 34 18 28 35 28 C51 28 52 20 68 22 C85 24 84 31 101 31 C118 31 118 27 134 28 C153 29 153 35 171 34 C190 33 190 22 207 23 C215 23 216 19 220 17 L220 44 L0 44 Z"
        fill={color}
        opacity="0.1"
      />
    </svg>
  </div>
);

const DashboardCards = React.memo(
  ({
    stats = {},
    t = fallbackT,
    locale = "en-US",
  }: DashboardCardsProps) => {
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("DashboardCards received stats:", stats);
      }
    }, [stats]);

    const isRtl = isHebrewLocale(locale);
    const cards: CardItem[] = [
      {
        key: "profileViews",
        label: t("dashboard.cards.profileViews"),
        value: formatNumber(stats.views_count, locale),
        trend: "18.6%",
        trendColor: "text-emerald-600",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        lineColor: "#8b5cf6",
        Icon: ProfileViewsIcon,
      },
      {
        key: "appointments",
        label: t("dashboard.cards.appointments"),
        value: formatNumber(stats.appointments_count, locale),
        trend: "12.4%",
        trendColor: "text-emerald-600",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        lineColor: "#a855f7",
        Icon: AppointmentsIcon,
      },
      {
        key: "messages",
        label: t("dashboard.cards.messages"),
        value: formatNumber(stats.messages_count, locale),
        trend: "21.7%",
        trendColor: "text-emerald-600",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        lineColor: "#3b82f6",
        Icon: MessagesIcon,
      },
      {
        key: "reviews",
        label: t("dashboard.cards.reviews"),
        value: stats.reviews_count
          ? Number(stats.reviews_count).toFixed(1)
          : "0.0",
        trend: "8.7%",
        trendColor: "text-emerald-600",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        lineColor: "#f59e0b",
        Icon: ReviewsIcon,
      },
    ];

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        role="list"
        aria-label={t("dashboard.cards.ariaLabel")}
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.Icon;

          return (
            <article
              key={card.key}
              role="listitem"
              aria-label={`${card.label}: ${card.value}`}
              className="
                group relative overflow-hidden rounded-2xl border border-slate-200/70
                bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]
                transition-all duration-300 hover:-translate-y-1
                hover:shadow-[0_18px_45px_rgba(124,58,237,0.12)]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-2xl
                    ${card.iconBg} ${card.iconColor}
                  `}
                  aria-hidden="true"
                >
                  <Icon />
                </div>

                <div className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  {t("dashboard.cards.period30Days")}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-600">
                  {card.label}
                </p>

                <div className="mt-1 flex items-end justify-between gap-3">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                    {card.value}
                  </h3>

                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <span className={card.trendColor}>
                      ↑ {card.trend}
                    </span>

                    <span className="font-medium text-slate-400">
                      {t("dashboard.cards.vsLast30Days")}
                    </span>
                  </div>
                </div>
              </div>

              <MiniLine color={card.lineColor} />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </article>
          );
        })}
      </section>
    );
  }
);

DashboardCards.displayName = "DashboardCards";

export default DashboardCards;