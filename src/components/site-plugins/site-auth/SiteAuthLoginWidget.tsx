import React, { useEffect, useMemo, useRef, useState } from "react";
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
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

export default function SiteAuthLoginWidget({
  site,
  settings: settingsProp,
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

  const position = settings.triggerPosition || { x: 88, y: 82 };
  const [dragPos, setDragPos] = useState(position);
  const dragPosRef = useRef(dragPos);

  useEffect(() => {
    setDragPos(position);
  }, [position.x, position.y]);

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  function handlePrimaryClick() {
    if (isEditor) return;
    if (isAuthenticated) {
      auth?.logout();
      return;
    }
    navigate("/login");
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
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
    if (!dragRef.current || !isEditor) return;
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
    if (!dragRef.current || !isEditor) return;
    dragRef.current = null;
    onPositionChange?.(dragPosRef.current);
  }

  if (!settings.isActive || settings.showLoginButton === false || settings.showTrigger === false) {
    return null;
  }

  const buttonLabel = isAuthenticated ? settings.logoutButtonLabel : settings.loginButtonLabel;
  const ButtonIcon = isAuthenticated ? LogOut : LogIn;
  const display = settings.buttonDisplay || "icon";
  const transparent = settings.buttonTransparent !== false;
  const textColor =
    settings.buttonTextColor ||
    (transparent ? accent : settings.formButtonTextColor || "#ffffff");

  const pos = isEditor ? dragPos : position;
  const shapeClass =
    display === "icon"
      ? "h-12 w-12 rounded-full"
      : display === "text"
        ? "rounded-lg px-2 py-1"
        : "rounded-full px-4 py-2.5";

  return (
    <button
      type="button"
      onClick={handlePrimaryClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`fixed z-[99990] flex items-center justify-center gap-2 text-sm font-black transition hover:scale-105 ${shapeClass} ${
        isEditor ? "cursor-grab ring-2 ring-violet-400 ring-offset-2" : "cursor-pointer"
      } ${!transparent && display !== "text" ? "shadow-[0_8px_32px_rgba(99,102,241,0.35)]" : ""}`}
      style={{
        right: `${pos.x}%`,
        bottom: `${100 - pos.y}%`,
        transform: "translate(50%, 50%)",
        background: transparent ? "transparent" : accent,
        color: transparent ? textColor : settings.formButtonTextColor || "#ffffff",
        boxShadow: transparent ? "none" : undefined,
        border: transparent ? "none" : undefined,
      }}
      data-bizuply-site-auth-button="true"
      aria-label={buttonLabel}
      dir="rtl"
    >
      {isEditor ? (
        <GripVertical size={16} className="opacity-80" />
      ) : display !== "text" ? (
        <ButtonIcon size={display === "icon" ? 22 : 16} />
      ) : null}
      {!isEditor && display !== "icon" ? <span>{buttonLabel}</span> : null}
      {!isEditor &&
      isAuthenticated &&
      settings.showMemberName &&
      memberLabel &&
      display !== "icon" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-bold">
          <UserRound size={12} />
          {memberLabel}
        </span>
      ) : null}
    </button>
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
    (settings.buttonTransparent !== false ? accent : settings.formButtonTextColor || "#ffffff");

  if (settings.buttonDisplay === "icon") {
    return (
      <span
        className="inline-flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: settings.buttonTransparent !== false ? "transparent" : accent,
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
        background: settings.buttonTransparent !== false ? "transparent" : accent,
        color: textColor,
      }}
    >
      <LogIn size={14} />
      {settings.loginButtonLabel}
    </span>
  );
}
