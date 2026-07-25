import React, { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, UserRound } from "lucide-react";

import {
  mergeSiteAuthSettings,
  type SiteAuthWidgetSettings,
} from "./siteAuthUtils";
import { resolveSiteAuthAccentColor } from "./siteAuthFormStyles";
import { SiteAuthTriggerIcon } from "./siteAuthTriggerIcons";
import { openSiteMemberLogin } from "./siteAuthNavigation";
import { useOptionalSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

function resolveButtonDimensions(size: SiteAuthWidgetSettings["buttonSize"], display: string) {
  if (display === "text") {
    return { className: "rounded-lg px-2 py-1", iconSize: 16 };
  }
  if (display === "button") {
    if (size === "sm") return { className: "rounded-full px-3 py-2 text-xs", iconSize: 14 };
    if (size === "lg") return { className: "rounded-full px-5 py-3 text-base", iconSize: 18 };
    return { className: "rounded-full px-4 py-2.5 text-sm", iconSize: 16 };
  }
  if (size === "sm") return { className: "h-10 w-10 rounded-full", iconSize: 18 };
  if (size === "lg") return { className: "h-14 w-14 rounded-full", iconSize: 26 };
  return { className: "h-12 w-12 rounded-full", iconSize: 22 };
}

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
    openSiteMemberLogin(site);
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
  const iconKey = isAuthenticated ? settings.logoutIcon : settings.loginIcon;
  const display = settings.buttonDisplay || "icon";
  const transparent = settings.buttonTransparent !== false;
  const textColor =
    settings.buttonTextColor ||
    (transparent ? accent : settings.formButtonTextColor || "#ffffff");
  const backgroundColor = transparent
    ? "transparent"
    : settings.buttonBackgroundColor || accent;
  const { className: shapeClass, iconSize } = resolveButtonDimensions(
    settings.buttonSize || "md",
    display
  );
  const borderRadius =
    display === "text"
      ? Math.min(16, settings.buttonBorderRadius || 8)
      : settings.buttonBorderRadius || 999;

  const pos = isEditor ? dragPos : position;

  return (
    <button
      type="button"
      onClick={handlePrimaryClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`fixed z-[99990] relative flex items-center justify-center gap-2 font-black transition hover:scale-105 ${shapeClass} ${
        isEditor ? "cursor-grab ring-2 ring-violet-400 ring-offset-2" : "cursor-pointer"
      } ${!transparent && display !== "text" ? "shadow-[0_8px_32px_rgba(99,102,241,0.35)]" : ""}`}
      style={{
        right: `${pos.x}%`,
        bottom: `${100 - pos.y}%`,
        transform: "translate(50%, 50%)",
        background: backgroundColor,
        color: textColor,
        boxShadow: transparent ? "none" : undefined,
        border: transparent ? "none" : undefined,
        borderRadius: `${borderRadius}px`,
      }}
      data-bizuply-site-auth-button="true"
      aria-label={buttonLabel}
      dir="rtl"
    >
      {isEditor ? (
        <>
          {display !== "text" ? (
            <SiteAuthTriggerIcon icon={iconKey as any} size={iconSize} />
          ) : null}
          {display !== "icon" ? (
            <span className="text-xs">{buttonLabel}</span>
          ) : null}
          <span className="pointer-events-none absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white shadow">
            <GripVertical size={10} />
          </span>
        </>
      ) : display !== "text" ? (
        <SiteAuthTriggerIcon icon={iconKey as any} size={iconSize} />
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
  const backgroundColor =
    settings.buttonTransparent !== false
      ? "transparent"
      : settings.buttonBackgroundColor || accent;
  const { className: shapeClass, iconSize } = resolveButtonDimensions(
    settings.buttonSize || "md",
    settings.buttonDisplay || "icon"
  );
  const borderRadius =
    settings.buttonDisplay === "text"
      ? Math.min(16, settings.buttonBorderRadius || 8)
      : settings.buttonBorderRadius || 999;

  if (settings.buttonDisplay === "icon") {
    return (
      <span
        className={`inline-flex items-center justify-center ${shapeClass}`}
        style={{
          background: backgroundColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <SiteAuthTriggerIcon icon={settings.loginIcon as any} size={iconSize} />
      </span>
    );
  }

  if (settings.buttonDisplay === "text") {
    return (
      <span
        className="text-sm font-black underline"
        style={{ color: textColor, borderRadius: `${borderRadius}px` }}
      >
        {settings.loginButtonLabel}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 font-black shadow-lg ${shapeClass}`}
      style={{
        background: backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
      }}
    >
      <SiteAuthTriggerIcon icon={settings.loginIcon as any} size={iconSize} />
      {settings.loginButtonLabel}
    </span>
  );
}
