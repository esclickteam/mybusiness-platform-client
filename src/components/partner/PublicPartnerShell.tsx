import React, { type ReactNode, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  applyPartnerFavicon,
  hidesBizuplyChrome,
  partnerFacingLogo,
  partnerFacingName,
  type PublicPartnerBranding,
} from "../../lib/partnerBranding";

export default function PublicPartnerShell({
  branding,
  title,
  noIndex = false,
  children,
}: {
  branding?: PublicPartnerBranding | null;
  title?: string;
  noIndex?: boolean;
  children: ReactNode;
}) {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const whiteLabel = hidesBizuplyChrome(branding, host);
  const logoUrl = partnerFacingLogo(branding, host);
  const brandName = partnerFacingName(branding, host);

  useEffect(() => {
    applyPartnerFavicon(whiteLabel ? branding?.faviconUrl || branding?.stored?.faviconUrl : "");
    return () => applyPartnerFavicon("");
  }, [whiteLabel, branding?.faviconUrl, branding?.stored?.faviconUrl]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FC] text-slate-900"
      style={{ fontFamily: '"Assistant","Heebo","Rubik",sans-serif' }}
    >
      <Helmet>
        {title ? <title>{title}</title> : null}
        {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
        {whiteLabel && (branding?.faviconUrl || branding?.stored?.faviconUrl) ? (
          <link rel="icon" href={branding?.faviconUrl || branding?.stored?.faviconUrl} />
        ) : null}
      </Helmet>
      <header className="border-b border-white/80 bg-white/90 px-4 py-5">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={brandName || ""} className="h-12 w-12 rounded-2xl object-contain" />
          ) : brandName ? (
            <span className="text-xl font-black">{brandName}</span>
          ) : whiteLabel ? null : (
            <span className="text-xl font-black tracking-tight">BizUply</span>
          )}
          {whiteLabel && brandName && logoUrl ? (
            <p className="text-lg font-black">{brandName}</p>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      {!whiteLabel ? (
        <footer className="py-6 text-center text-xs font-bold text-slate-400">Powered by Bizuply</footer>
      ) : null}
    </div>
  );
}
