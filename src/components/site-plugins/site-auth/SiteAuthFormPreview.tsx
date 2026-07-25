import React, { useState } from "react";

import type { SiteAuthWidgetSettings } from "./siteAuthUtils";
import {
  buildSiteAuthButtonStyle,
  buildSiteAuthFormShellStyle,
  buildSiteAuthInputStyle,
  buildSiteAuthLabelStyle,
  buildSiteAuthLinkStyle,
  resolveSiteAuthAccentColor,
} from "./siteAuthFormStyles";

type PreviewMode = "login" | "register" | "forgot";

type SiteAuthFormPreviewProps = {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
};

function PreviewField({
  label,
  labelStyle,
  inputStyle,
}: {
  label: string;
  labelStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold" style={labelStyle}>
        {label}
      </span>
      <div className="h-10 border px-3" style={inputStyle} />
    </label>
  );
}

export default function SiteAuthFormPreview({
  settings,
  brandColor = "#6366F1",
}: SiteAuthFormPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>("login");
  const shellStyle = buildSiteAuthFormShellStyle(settings, brandColor);
  const labelStyle = buildSiteAuthLabelStyle(settings);
  const inputStyle = buildSiteAuthInputStyle(settings);
  const buttonStyle = buildSiteAuthButtonStyle(settings, brandColor);
  const linkStyle = buildSiteAuthLinkStyle(settings, brandColor);
  const accent = resolveSiteAuthAccentColor(settings, brandColor);

  const tabs: { id: PreviewMode; label: string; show: boolean }[] = [
    { id: "login", label: "התחברות", show: true },
    { id: "register", label: "הרשמה", show: settings.allowSelfRegister },
    { id: "forgot", label: "שכחתי סיסמה", show: settings.forgotPasswordEnabled },
  ];

  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 p-4" dir="rtl">
      <p className="mb-3 text-xs font-bold text-violet-700">תצוגה מקדימה — עיצוב הטפסים</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                mode === tab.id
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      <div className="border p-5 shadow-sm" style={shellStyle}>
        {mode === "login" ? (
          <>
            <h3 className="text-lg font-black" style={{ color: settings.formTextColor }}>
              {settings.loginPageTitle}
            </h3>
            {settings.loginSubtitle ? (
              <p
                className="mt-1 text-sm font-medium opacity-80"
                style={{ color: settings.formTextColor }}
              >
                {settings.loginSubtitle}
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              <PreviewField label="אימייל" labelStyle={labelStyle} inputStyle={inputStyle} />
              <PreviewField label="סיסמה" labelStyle={labelStyle} inputStyle={inputStyle} />
              <div
                className="flex h-11 items-center justify-center text-sm font-black"
                style={buttonStyle}
              >
                {settings.loginButtonLabel}
              </div>
              {settings.forgotPasswordEnabled ? (
                <p className="text-center text-xs font-bold" style={linkStyle}>
                  שכחתי סיסמה
                </p>
              ) : null}
              {settings.allowSelfRegister ? (
                <p className="text-center text-xs font-bold" style={{ color: accent }}>
                  אין לך חשבון? הרשמה
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {mode === "register" ? (
          <>
            <h3 className="text-lg font-black" style={{ color: settings.formTextColor }}>
              {settings.registerTitle}
            </h3>
            {settings.registerSubtitle ? (
              <p
                className="mt-1 text-sm font-medium opacity-80"
                style={{ color: settings.formTextColor }}
              >
                {settings.registerSubtitle}
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              <PreviewField label="שם מלא" labelStyle={labelStyle} inputStyle={inputStyle} />
              <PreviewField label="טלפון" labelStyle={labelStyle} inputStyle={inputStyle} />
              <PreviewField label="אימייל" labelStyle={labelStyle} inputStyle={inputStyle} />
              <PreviewField label="סיסמה" labelStyle={labelStyle} inputStyle={inputStyle} />
              <div
                className="flex h-11 items-center justify-center text-sm font-black"
                style={buttonStyle}
              >
                {settings.registerTitle || "הרשמה"}
              </div>
              <p className="text-center text-xs font-bold" style={{ color: accent }}>
                יש לך חשבון? התחברות
              </p>
            </div>
          </>
        ) : null}

        {mode === "forgot" ? (
          <>
            <h3 className="text-lg font-black" style={{ color: settings.formTextColor }}>
              שכחתי סיסמה
            </h3>
            <p
              className="mt-1 text-sm font-medium opacity-80"
              style={{ color: settings.formTextColor }}
            >
              הזינו אימייל ונשלח קישור לאיפוס
            </p>
            <div className="mt-4 space-y-3">
              <PreviewField label="אימייל" labelStyle={labelStyle} inputStyle={inputStyle} />
              <div
                className="flex h-11 items-center justify-center text-sm font-black"
                style={buttonStyle}
              >
                שליחת קישור
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
