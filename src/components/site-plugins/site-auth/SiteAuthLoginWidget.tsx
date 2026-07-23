import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GripVertical, LogIn, LogOut, UserRound } from "lucide-react";

import {
  mergeSiteAuthSettings,
  type SiteAuthWidgetSettings,
} from "./siteAuthUtils";
import { resolveSiteAuthAccentColor } from "./siteAuthFormStyles";
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
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const settings = useMemo(
    () => mergeSiteAuthSettings(settingsProp ?? site?.pluginSettings?.["site-auth"]),
    [settingsProp, site?.pluginSettings]
  );

  const brandColor = String(site?.brand?.primaryColor || "#6366F1");
  const accent = resolveSiteAuthAccentColor(settings, brandColor);
  const isEditor = mode === "editor";
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const memberLabel =
    auth?.member?.displayName ||
    auth?.member?.username ||
    auth?.member?.email ||
    "";

  const position = settings.triggerPosition || { x: 92, y: 6 };
  const [dragPos, setDragPos] = useState(position);

  function handlePrimaryClick() {
    if (isEditor) return;

    if (isAuthenticated) {
      auth?.logout();
      return;
    }

    navigate("/login");
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor || variant !== "floating") return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPos.x,
      origY: dragPos.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor || variant !== "floating") return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    setDragPos({
      x: Math.min(96, Math.max(4, dragRef.current.origX - dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    });
  }

  function onPointerUp() {
    if (!dragRef.current || !isEditor || variant !== "floating") return;
    dragRef.current = null;
    onPositionChange?.(dragPos);
  }

  const buttonLabel = isAuthenticated
    ? settings.logoutButtonLabel
    : settings.loginButtonLabel;

  const ButtonIcon = isAuthenticated ? LogOut : LogIn;
  const textColor =
    settings.buttonTextColor ||
    (settings.buttonTransparent ? accent : settings.formButtonTextColor || "#ffffff");

  const editorRing = isEditor
    ? "ring-2 ring-violet-400 ring-offset-1 cursor-grab"
    : "cursor-pointer hover:opacity-85";

  const transparent = settings.buttonTransparent;
  const display = settings.buttonDisplay;

  const buttonStyle: React.CSSProperties = transparent
    ? {
        background: "transparent",
        color: textColor,
        boxShadow: "none",
        border: "none",
      }
    : {
        backgroundColor: accent,
        color: settings.formButtonTextColor || "#ffffff",
      };

  const button = (
    <button
      type="button"
      onClick={handlePrimaryClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`inline-flex items-center justify-center gap-2 transition ${editorRing} ${
        display === "icon"
          ? "rounded-full p-1.5"
          : display === "text"
            ? "rounded-lg px-1 py-0.5 text-sm font-black underline-offset-2 hover:underline"
            : "rounded-full px-4 py-2.5 text-sm font-black shadow-md"
      }`}
      style={buttonStyle}
      data-bizuply-site-auth-button="true"
      aria-label={buttonLabel}
    >
      {isEditor && variant === "floating" ? (
        <GripVertical size={14} className="opacity-70" />
      ) : display !== "text" ? (
        <ButtonIcon size={display === "icon" ? 22 : 16} />
      ) : null}
      {display !== "icon" ? <span>{buttonLabel}</span> : null}
      {isAuthenticated && settings.showMemberName && memberLabel && display !== "icon" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-bold">
          <UserRound size={12} />
          {memberLabel}
        </span>
      ) : null}
    </button>
  );

  if (variant === "inline") {
    return (
      <div
        className="bizuply-site-auth-widget pointer-events-none inline-flex items-center justify-center"
        dir="rtl"
        data-bizuply-plugin-runtime="true"
      >
        <div className="pointer-events-auto">{button}</div>
      </div>
    );
  }

  const pos = isEditor ? dragPos : position;

  return (
    <div
      className="pointer-events-none fixed z-[9998]"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, 0)",
      }}
      dir="rtl"
    >
      <div className="pointer-events-auto">{button}</div>
    </div>
  );
}

export function SiteAuthLoginWidgetPreview({
  settings,
  brandColor = "#6366F1",
}: {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
}) {
  const accent = resolveSiteAuthAccentColor(settings, brandColor);
  const textColor =
    settings.buttonTextColor ||
    (settings.buttonTransparent ? accent : settings.formButtonTextColor || "#ffffff");

  if (settings.buttonDisplay === "icon") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full p-1.5"
        style={{
          background: settings.buttonTransparent ? "transparent" : accent,
          color: textColor,
        }}
      >
        <LogIn size={22} />
      </span>
    );
  }

  if (settings.buttonDisplay === "text") {
    return (
      <span className="text-sm font-black underline" style={{ color: textColor }}>
        {settings.loginButtonLabel}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black shadow-lg"
      style={{
        background: settings.buttonTransparent ? "transparent" : accent,
        color: textColor,
      }}
    >
      <LogIn size={14} />
      {settings.loginButtonLabel}
    </span>
  );
}
