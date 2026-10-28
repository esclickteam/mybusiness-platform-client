import React, { createContext, type ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";
import LanguageSwitcher from "../LanguageSwitcher";
import LoginShowcase from "./LoginShowcase";
import {
  applyPartnerFavicon,
  hidesBizuplyChrome,
  partnerFacingLogo,
  partnerFacingName,
  type PublicPartnerBranding,
} from "../../lib/partnerBranding";
import "./AuthShell.css";

const LoginBrandingContext = createContext<PublicPartnerBranding | null>(null);

export function useLoginBranding() {
  return useContext(LoginBrandingContext);
}

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const branding = useLoginBranding();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const text = size === "sm" ? "text-2xl" : "text-3xl";
  const hideChrome = hidesBizuplyChrome(branding, host);
  const logoUrl = partnerFacingLogo(branding, host);
  const brandName = partnerFacingName(branding, host);
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={brandName || ""}
        className={size === "sm" ? "h-10 max-w-[180px] object-contain" : "h-14 max-w-[220px] object-contain"}
      />
    );
  }
  if (hideChrome && brandName) {
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
  withSiteHeader?: boolean;
};

export default function AuthShell({
  children,
  headline,
  cardMaxWidthClassName = "max-w-[440px]",
  withSiteHeader = false,
}: AuthShellProps) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  const { branding } = usePartnerHostBranding();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const whiteLabel = hidesBizuplyChrome(branding, host);
  const brandName = partnerFacingName(branding, host);

  useEffect(() => {
    applyPartnerFavicon(whiteLabel ? branding?.faviconUrl || branding?.stored?.faviconUrl : "");
    return () => applyPartnerFavicon("");
  }, [whiteLabel, branding?.faviconUrl, branding?.stored?.faviconUrl]);

  return (
    <LoginBrandingContext.Provider value={branding}>
      <div dir={dir} className={`auth-stage${withSiteHeader ? " auth-stage--under-header" : ""}`}>
        <div className="auth-stage__bg" aria-hidden="true">
          <div className="auth-stage__gradient" />
          <div className="auth-stage__grid" />
          <div className="auth-orb auth-orb--a" />
          <div className="auth-orb auth-orb--b" />
          <div className="auth-orb auth-orb--c" />
        </div>
        {withSiteHeader ? null : (
          <div className="auth-stage__lang">
            <LanguageSwitcher />
          </div>
        )}
        <main className="auth-stage__main">
          <section className={`auth-stage__panel ${cardMaxWidthClassName}`}>
            {children}
          </section>
          {whiteLabel ? (
            <section className="auth-showcase">
              <div className="auth-showcase__brand">
                <BrandMark />
              </div>
              {brandName ? <h2 className="auth-showcase__title">{brandName}</h2> : null}
            </section>
          ) : (
            <LoginShowcase headline={headline} />
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
  const whiteLabel = Boolean(branding?.whiteLabelEnabled);
  return (
    <div className="auth-card">
      <div className="auth-card__mark">
        <BrandMark size="sm" />
        <h1 className="auth-card__title">
          {whiteLabel && branding?.brandName ? branding.brandName : title}
        </h1>
        {subtitle && !whiteLabel ? (
          <p className="auth-card__subtitle">{subtitle}</p>
        ) : null}
        <div className="auth-card__rule" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="auth-card__body">{children}</div>
    </div>
  );
}
