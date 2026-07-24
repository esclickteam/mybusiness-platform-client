import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, UserRound, X } from "lucide-react";

import SiteAuthLoginForm from "./SiteAuthLoginForm";
import {
  mergeSiteAuthSettings,
  type SiteAuthWidgetSettings,
} from "./siteAuthUtils";
import { buildSiteAuthFormShellStyle } from "./siteAuthFormStyles";
import { useOptionalSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

type SiteAuthLoginWidgetProps = {
  site: Record<string, any>;
  settings?: unknown;
  variant?: "floating" | "inline";
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

export default function SiteAuthLoginWidget({
  site,
  settings: settingsProp,
  variant = "floating",
  mode = "live",
  onPositionChange,
}: SiteAuthLoginWidgetProps) {
  const auth = useOptionalSiteMemberAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const settings = useMemo(
    () => mergeSiteAuthSettings(settingsProp ?? site?.pluginSettings?.["site-auth"]),
    [settingsProp, site?.pluginSettings]
  );

  const brandColor = String(site?.brand?.primaryColor || "#6366F1");
  const isEditor = mode === "editor";
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const memberLabel =
    auth?.member?.displayName ||
    auth?.member?.username ||
    auth?.member?.email ||
    "";

  const position = settings.triggerPosition || { x: 92, y: 6 };

  function handlePrimaryClick() {
    if (isEditor) return;

    if (isAuthenticated) {
      auth?.logout();
      return;
    }

    if (settings.useLoginModal) {
      setModalOpen(true);
      return;
    }

    navigate("/login");
  }

  function handleLoginSuccess() {
    setModalOpen(false);
    const target = settings.memberAreaPath || "/";
    if (target && target !== "/login") {
      navigate(target);
    }
  }

  const buttonLabel = isAuthenticated
    ? settings.logoutButtonLabel
    : settings.loginButtonLabel;

  const ButtonIcon = isAuthenticated ? LogOut : LogIn;

  const button = (
    <button
      type="button"
      onClick={handlePrimaryClick}
      className={
        variant === "inline"
          ? "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:opacity-90"
          : "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black text-white shadow-lg transition hover:opacity-90"
      }
      style={{ backgroundColor: brandColor }}
      data-bizuply-site-auth-button="true"
    >
      <ButtonIcon size={variant === "inline" ? 16 : 14} />
      <span>{buttonLabel}</span>
      {isAuthenticated && settings.showMemberName && memberLabel ? (
        <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold">
          <UserRound size={12} />
          {memberLabel}
        </span>
      ) : null}
    </button>
  );

  const modal =
    modalOpen && !isAuthenticated ? (
      <div
        className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
        dir="rtl"
        onClick={() => setModalOpen(false)}
      >
        <div
          className="relative w-full max-w-md border p-6 shadow-2xl"
          style={buildSiteAuthFormShellStyle(settings, brandColor)}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="absolute left-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={() => setModalOpen(false)}
            aria-label="סגירה"
          >
            <X size={18} />
          </button>

          <h2 className="mb-1 text-xl font-black" style={{ color: settings.formTextColor }}>
            {settings.loginPageTitle}
          </h2>
          {settings.loginSubtitle ? (
            <p
              className="mb-5 text-sm font-medium opacity-80"
              style={{ color: settings.formTextColor }}
            >
              {settings.loginSubtitle}
            </p>
          ) : (
            <p className="mb-5 text-sm font-medium opacity-80" style={{ color: settings.formTextColor }}>
              התחברות לאתר {String(site?.name || "")}
            </p>
          )}

          <SiteAuthLoginForm
            settings={settings}
            brandColor={brandColor}
            compact
            onSuccess={handleLoginSuccess}
            onForgotPassword={() => {
              setModalOpen(false);
              navigate("/forgot-password");
            }}
          />
        </div>
      </div>
    ) : null;

  if (variant === "inline") {
    return (
      <>
        <div className="inline-flex items-center" dir="rtl">
          {button}
        </div>
        {modal}
      </>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, 0)",
        }}
        dir="rtl"
      >
        <div className="pointer-events-auto">{button}</div>
      </div>
      {modal}
    </>
  );
}

export function SiteAuthLoginWidgetPreview({
  settings,
  brandColor = "#6366F1",
}: {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black text-white shadow-lg" style={{ backgroundColor: brandColor }}>
      <LogIn size={14} />
      {settings.loginButtonLabel}
    </div>
  );
}
