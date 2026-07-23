import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, UserRound } from "lucide-react";

import {
  readSiteAuthSettings,
  siteHasAuthPlugin,
} from "../../../api/siteMemberAuthApi";
import { useOptionalSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

type PublicSiteAuthBarProps = {
  site: Record<string, any>;
};

export default function PublicSiteAuthBar({ site }: PublicSiteAuthBarProps) {
  const auth = useOptionalSiteMemberAuth();

  if (!siteHasAuthPlugin(site)) return null;

  const settings = readSiteAuthSettings(site);
  if (!settings.isActive || !settings.showLoginButton) return null;

  const brandColor = String(site?.brand?.primaryColor || "#6366F1");
  const memberLabel =
    auth?.member?.displayName ||
    auth?.member?.username ||
    auth?.member?.email ||
    "";

  if (auth?.loading) return null;

  return (
    <div
      className="fixed left-4 top-4 z-[9998] flex items-center gap-2"
      dir="rtl"
    >
      {auth?.isAuthenticated ? (
        <>
          <div
            className="flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg backdrop-blur"
            style={{ borderColor: `${brandColor}33` }}
          >
            <UserRound size={14} style={{ color: brandColor }} />
            <span>{memberLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => auth.logout()}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-white shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            <LogOut size={14} />
            {settings.logoutButtonLabel}
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-white shadow-lg transition hover:opacity-90"
          style={{ backgroundColor: brandColor }}
        >
          <LogIn size={14} />
          {settings.loginButtonLabel}
        </Link>
      )}
    </div>
  );
}
