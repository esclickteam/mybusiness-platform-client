import React, { createContext, type ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Bot,
  CalendarDays,
  Globe2,
  Megaphone,
  Users,
} from "lucide-react";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";
import {
  applyPartnerFavicon,
  hidesBizuplyChrome,
  isPartnerHostBranding,
  partnerDisplayLogo,
  partnerDisplayName,
  partnerFacingLogo,
  partnerFacingName,
  type PublicPartnerBranding,
} from "../../lib/partnerBranding";

const LoginBrandingContext = createContext<PublicPartnerBranding | null>(null);

export function useLoginBranding() {
  return useContext(LoginBrandingContext);
}

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const branding = useLoginBranding();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const text = size === "sm" ? "text-2xl" : "text-3xl";
  const hideChrome = hidesBizuplyChrome(branding, host);
  const logoUrl = partnerFacingLogo(branding, host) || partnerDisplayLogo(branding);
  const brandName = partnerFacingName(branding, host) || partnerDisplayName(branding);
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={brandName || ""}
        className={size === "sm" ? "h-10 max-w-[180px] object-contain" : "h-14 max-w-[220px] object-contain"}
      />
    );
  }
  if (brandName) {
    return <span className={`${text} font-black tracking-tight text-slate-900`}>{brandName}</span>;
  }
  if (hideChrome) {
    return null;
  }
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
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { branding } = usePartnerHostBranding();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const whiteLabel = hidesBizuplyChrome(branding, host);
  const leftoverHost = isPartnerHostBranding(branding);
  const partnerChrome = whiteLabel;
  const brandName = partnerFacingName(branding, host) || partnerDisplayName(branding);
  const faviconUrl = branding?.faviconUrl || branding?.stored?.faviconUrl || "";
  const featureCards = [
    { title: t("login.featureCrmTitle"), subtitle: t("login.featureCrmText"), icon: Users },
    { title: t("login.featureAppointmentsTitle"), subtitle: t("login.featureAppointmentsText"), icon: CalendarDays },
    { title: t("login.featureAiTitle"), subtitle: t("login.featureAiText"), icon: Bot },
    { title: t("login.featureWebsiteTitle"), subtitle: t("login.featureWebsiteText"), icon: Globe2 },
    { title: t("login.featureMetaLeadsTitle"), subtitle: t("login.featureMetaLeadsText"), icon: Megaphone },
  ];

  useEffect(() => {
    applyPartnerFavicon(partnerChrome || leftoverHost ? faviconUrl : "");
    return () => applyPartnerFavicon("");
  }, [partnerChrome, leftoverHost, faviconUrl]);

  return (
    <LoginBrandingContext.Provider value={branding}>
    <div
      dir={dir}
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

        {partnerChrome ? (
          <section className="hidden text-center lg:flex lg:flex-col lg:items-center lg:justify-center">
            <BrandMark />
            {brandName ? (
              <h2 className="mt-8 max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-slate-900">
                {brandName}
              </h2>
            ) : null}
          </section>
        ) : (
        <section className="hidden text-center lg:flex lg:flex-col lg:items-center lg:justify-center">
          <BrandMark />

          <h2 className="mt-8 max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-slate-900 xl:text-5xl">
            {headline || (
              <>
                {t("login.heroTitleTop")}{" "}
                <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  {t("login.heroTitleHighlight")}
                </span>
              </>
            )}
          </h2>

          <div className="mt-6 flex w-48 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400 to-violet-500" />
            <span className="h-2 w-2 rounded-full bg-violet-500" />
          </div>

          <div className="mt-8 flex max-w-xl flex-wrap items-stretch justify-center gap-3">
            {featureCards.map(({ title, subtitle, icon: Icon }) => (
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
        )}
      </main>
    </div>
    </LoginBrandingContext.Provider>
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
  const branding = useLoginBranding();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const whiteLabel = hidesBizuplyChrome(branding, host);
  const partnerChrome = whiteLabel;
  const brandName = partnerFacingName(branding, host) || partnerDisplayName(branding);
  return (
    <div className="rounded-[32px] border border-white bg-white p-7 shadow-[0_28px_80px_rgba(15,23,42,0.10)] sm:p-9">
      <div className="flex flex-col items-center text-center">
        <BrandMark size="sm" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
          {partnerChrome && brandName ? brandName : title}
        </h1>
        {subtitle && !partnerChrome ? (
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
