import React, { type ReactNode } from "react";
import {
  Bot,
  CalendarDays,
  Globe2,
  Megaphone,
  Users,
} from "lucide-react";

const FEATURE_CARDS = [
  { title: "CRM", subtitle: "לידים וניהול", icon: Users },
  { title: "תורים", subtitle: "וזמינות", icon: CalendarDays },
  { title: "אוטומציות", subtitle: "חכמות", icon: Bot },
  { title: "בניית אתר", subtitle: "מקצועי", icon: Globe2 },
  { title: "לידים ממטא", subtitle: "פייסבוק ואינסטגרם", icon: Megaphone },
] as const;

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-2xl" : "text-3xl";

  return (
    <span className={`${text} font-black tracking-tight text-slate-900`}>
      BizUply
    </span>
  );
}

type AuthShellProps = {
  children: ReactNode;
  headline?: ReactNode;
  cardMaxWidthClassName?: string;
};

export default function AuthShell({
  children,
  headline,
  cardMaxWidthClassName = "max-w-[440px]",
}: AuthShellProps) {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F7F8FC] text-slate-800"
      style={{ fontFamily: '"Heebo", "Assistant", "Rubik", sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute left-10 top-10 hidden h-40 w-40 bg-[radial-gradient(circle,#94a3b8_1.2px,transparent_1.2px)] opacity-30 [background-size:14px_14px] lg:block" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />
      </div>

      <main className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <section
          className={`mx-auto w-full ${cardMaxWidthClassName} lg:mx-0 lg:justify-self-start`}
        >
          {children}
        </section>

        <section className="hidden text-center lg:flex lg:flex-col lg:items-center lg:justify-center">
          <BrandMark />

          <h2 className="mt-8 max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-slate-900 xl:text-5xl">
            {headline || (
              <>
                להתחבר אל{" "}
                <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  מערכת ההפעלה
                </span>
                <br />
                <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  העסקית
                </span>
              </>
            )}
          </h2>

          <div className="mt-6 flex w-48 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400 to-violet-500" />
            <span className="h-2 w-2 rounded-full bg-violet-500" />
          </div>

          <div className="mt-8 flex max-w-xl flex-wrap items-stretch justify-center gap-3">
            {FEATURE_CARDS.map(({ title, subtitle, icon: Icon }) => (
              <div
                key={title}
                className="flex w-[148px] flex-col items-center rounded-[22px] border border-white bg-white px-4 py-4 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                  <Icon size={18} />
                </span>
                <strong className="mt-3 text-sm font-black text-slate-900">
                  {title}
                </strong>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  {subtitle}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-white bg-white p-7 shadow-[0_28px_80px_rgba(15,23,42,0.10)] sm:p-9">
      <div className="flex flex-col items-center text-center">
        <BrandMark size="sm" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm font-semibold text-slate-500">{subtitle}</p>
        ) : null}
        <div className="mt-5 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="h-2 w-2 rounded-full border border-slate-300" />
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
