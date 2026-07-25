import React from "react";

import type { SiteAuthWidgetSettings } from "./siteAuthUtils";
import {
  buildSiteAuthButtonStyle,
  buildSiteAuthFormShellStyle,
  buildSiteAuthInputStyle,
  buildSiteAuthLabelStyle,
} from "./siteAuthFormStyles";

type SiteAuthFormPreviewProps = {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
};

export default function SiteAuthFormPreview({
  settings,
  brandColor = "#6366F1",
}: SiteAuthFormPreviewProps) {
  const shellStyle = buildSiteAuthFormShellStyle(settings, brandColor);
  const labelStyle = buildSiteAuthLabelStyle(settings);
  const inputStyle = buildSiteAuthInputStyle(settings);
  const buttonStyle = buildSiteAuthButtonStyle(settings, brandColor);

  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 p-4" dir="rtl">
      <p className="mb-3 text-xs font-bold text-violet-700">תצוגה מקדימה — טופס התחברות</p>
      <div className="border p-5 shadow-sm" style={shellStyle}>
        <h3 className="text-lg font-black" style={{ color: settings.formTextColor }}>
          {settings.loginPageTitle}
        </h3>
        {settings.loginSubtitle ? (
          <p className="mt-1 text-sm font-medium opacity-80" style={{ color: settings.formTextColor }}>
            {settings.loginSubtitle}
          </p>
        ) : null}

        <div className="mt-4 space-y-3">
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={labelStyle}>
              אימייל או שם משתמש
            </span>
            <div className="h-10 border px-3" style={inputStyle} />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={labelStyle}>
              סיסמה
            </span>
            <div className="h-10 border px-3" style={inputStyle} />
          </label>
          <div className="flex h-11 items-center justify-center text-sm font-black" style={buttonStyle}>
            {settings.loginButtonLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
