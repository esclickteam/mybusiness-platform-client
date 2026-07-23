import React, { useMemo } from "react";
import { LayoutTemplate, Palette, Sparkles, Timer } from "lucide-react";

import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  Field,
  PluginPanelProps,
  SitePluginPanelFrame,
  Toggle,
  bool,
  str,
  TextInput,
} from "./SitePluginPanelFrame";
import CountdownWidget from "../../../site-plugins/countdown/CountdownWidget";
import {
  COUNTDOWN_EFFECT_MODES,
  COUNTDOWN_EFFECT_WHEN,
  COUNTDOWN_FONT_PRESETS,
  COUNTDOWN_LAYOUT_MODES,
  COUNTDOWN_SIZE_PRESETS,
  COUNTDOWN_STYLE_PRESETS,
  PRESET_DEFAULT_COLORS,
  type CountdownEffectMode,
  type CountdownEffectWhen,
  type CountdownFontPreset,
  type CountdownLayoutMode,
  type CountdownSettings,
  type CountdownSizePreset,
  type CountdownStylePreset,
} from "../../../site-plugins/countdown/countdownUtils";

function SectionCard({
  icon: Icon,
  title,
  children,
  accent = "#A855F7",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div
        className="flex items-center gap-3 border-b border-slate-100 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${accent}14, ${accent}06)` }}
      >
        <div
          className="grid h-9 w-9 place-items-center rounded-xl text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <Icon size={18} />
        </div>
        <p className="text-sm font-black text-slate-800">{title}</p>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isGradient = value.includes("gradient");
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-500">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
        {!isGradient ? (
          <input
            type="color"
            value={value.startsWith("#") ? value : "#7C3AED"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
        ) : null}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent font-mono text-xs font-semibold text-slate-700 outline-none"
        />
      </div>
    </label>
  );
}

export default function SiteCountdownPanel(props: PluginPanelProps) {
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "countdown");

  const previewSettings = useMemo(() => {
    const preset = (settings.stylePreset as CountdownStylePreset) || "cards";
    return {
      ...(settings as CountdownSettings),
      stylePreset: preset,
      endDate: str(settings.endDate) || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    } as CountdownSettings;
  }, [settings]);

  const selectedPreset = (settings.stylePreset as CountdownStylePreset) || "cards";
  const isCards = selectedPreset === "cards";

  function applyPreset(preset: CountdownStylePreset) {
    updateField("stylePreset", preset);
    const colors = PRESET_DEFAULT_COLORS[preset];
    updateField("backgroundColor", colors.backgroundColor);
    updateField("cardBackgroundColor", colors.cardBackgroundColor);
    updateField("numberColor", colors.numberColor);
    updateField("labelColor", colors.labelColor);
    updateField("accentColor", colors.accentColor);
  }

  return (
    <SitePluginPanelFrame
      {...props}
      icon={Timer}
      accent="#A855F7"
      title="ספירה לאחור"
      description="טיימר דינמי למבצעים, השקות ואירועים — הוסיפו לעמוד דרך העורך → תוספים."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save({ ...settings })}
    >
      <Toggle
        label="תוסף פעיל באתר"
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />

      <SectionCard icon={LayoutTemplate} title="סגנון וגודל" accent="#A855F7">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COUNTDOWN_STYLE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => applyPreset(preset.value)}
              className={`rounded-xl border p-3 text-right transition ${
                selectedPreset === preset.value
                  ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
                  : "border-slate-200 bg-white hover:border-violet-200"
              }`}
            >
              <p className="text-xs font-black text-slate-800">{preset.label}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">{preset.description}</p>
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">תצוגה בעמוד</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {COUNTDOWN_LAYOUT_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => updateField("layoutMode", mode.value as CountdownLayoutMode)}
                className={`rounded-xl border p-3 text-right transition ${
                  (settings.layoutMode || "section") === mode.value
                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
                    : "border-slate-200 bg-white hover:border-violet-200"
                }`}
              >
                <p className="text-xs font-black text-slate-800">{mode.label}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">גודל</p>
          <div className="grid grid-cols-3 gap-2">
            {COUNTDOWN_SIZE_PRESETS.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => updateField("sizePreset", size.value as CountdownSizePreset)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  (settings.sizePreset || "md") === size.value
                    ? "border-violet-400 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-visible rounded-2xl border border-dashed border-violet-200 bg-slate-50 p-4">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wide text-violet-500">
            תצוגה מקדימה
          </p>
          <CountdownWidget settings={previewSettings} preview />
        </div>
      </SectionCard>

      <SectionCard icon={Timer} title="תוכן וזמן" accent="#6366F1">
        <Field label="כותרת">
          <TextInput
            value={str(settings.title, "המבצע מסתיים בעוד")}
            onChange={(v) => updateField("title", v)}
          />
        </Field>
        <Field label="תאריך ושעת סיום">
          <TextInput
            value={str(settings.endDate)}
            onChange={(v) => updateField("endDate", v)}
            type="datetime-local"
          />
        </Field>
        <Field label="הודעה כשהמבצע נגמר">
          <TextInput
            value={str(settings.expiredMessage, "המבצע הסתיים")}
            onChange={(v) => updateField("expiredMessage", v)}
          />
        </Field>
        <Toggle
          label="סדר יחידות הפוך (שניות ← חודשים)"
          checked={bool(settings.unitOrderReversed, true)}
          onChange={(v) => updateField("unitOrderReversed", v)}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Toggle label="חודשים" checked={bool(settings.showMonths, true)} onChange={(v) => updateField("showMonths", v)} />
          <Toggle label="ימים" checked={bool(settings.showDays, true)} onChange={(v) => updateField("showDays", v)} />
          <Toggle label="שעות" checked={bool(settings.showHours, true)} onChange={(v) => updateField("showHours", v)} />
          <Toggle label="דקות" checked={bool(settings.showMinutes, true)} onChange={(v) => updateField("showMinutes", v)} />
          <Toggle label="שניות" checked={bool(settings.showSeconds, true)} onChange={(v) => updateField("showSeconds", v)} />
        </div>
      </SectionCard>

      <SectionCard icon={Sparkles} title="אפקטים" accent="#F59E0B">
        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">סוג אפקט</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {COUNTDOWN_EFFECT_MODES.map((effect) => (
              <button
                key={effect.value}
                type="button"
                onClick={() => updateField("effectMode", effect.value as CountdownEffectMode)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  (settings.effectMode || "none") === effect.value
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>
        {(settings.effectMode || "none") !== "none" ? (
          <div>
            <p className="mb-2 text-[11px] font-bold text-slate-500">מתי להציג</p>
            <div className="grid grid-cols-3 gap-2">
              {COUNTDOWN_EFFECT_WHEN.map((when) => (
                <button
                  key={when.value}
                  type="button"
                  onClick={() => updateField("effectWhen", when.value as CountdownEffectWhen)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    (settings.effectWhen || "onExpire") === when.value
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {when.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard icon={Palette} title="צבעים, פונט וצל" accent="#EC4899">
        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">פונט</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {COUNTDOWN_FONT_PRESETS.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => updateField("fontPreset", font.value as CountdownFontPreset)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  (settings.fontPreset || "rounded") === font.value
                    ? "border-violet-400 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
                style={{ fontFamily: font.css }}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ColorField
            label="רקע"
            value={str(settings.backgroundColor, PRESET_DEFAULT_COLORS[selectedPreset].backgroundColor || "transparent")}
            onChange={(v) => updateField("backgroundColor", v)}
          />
          {isCards ? (
            <ColorField
              label="צבע כרטיסיות"
              value={str(settings.cardBackgroundColor, PRESET_DEFAULT_COLORS.cards.cardBackgroundColor || "#ffffff")}
              onChange={(v) => updateField("cardBackgroundColor", v)}
            />
          ) : null}
          <ColorField
            label="צבע מספרים"
            value={str(settings.numberColor, PRESET_DEFAULT_COLORS[selectedPreset].numberColor || "#1e293b")}
            onChange={(v) => updateField("numberColor", v)}
          />
          <ColorField
            label="צבע תוויות"
            value={str(settings.labelColor, PRESET_DEFAULT_COLORS[selectedPreset].labelColor || "#94a3b8")}
            onChange={(v) => updateField("labelColor", v)}
          />
          <ColorField
            label="צבע הדגשה"
            value={str(settings.accentColor, PRESET_DEFAULT_COLORS[selectedPreset].accentColor || "#7C3AED")}
            onChange={(v) => updateField("accentColor", v)}
          />
        </div>

        <Toggle
          label="צל להדגשה"
          checked={bool(settings.shadowEnabled, true)}
          onChange={(v) => updateField("shadowEnabled", v)}
        />
        {settings.shadowEnabled !== false ? (
          <ColorField
            label="צבע צל"
            value={str(settings.shadowColor, "rgba(15,23,42,0.12)")}
            onChange={(v) => updateField("shadowColor", v)}
          />
        ) : null}
      </SectionCard>

      <p className="text-xs leading-relaxed text-slate-500">
        בעורך: <strong className="text-slate-700">הוספה → תוספים → ספירה לאחור</strong>.
        בחרו <strong className="text-slate-700">בלוק מלא</strong> לסקשן, או <strong className="text-slate-700">צף ונגרר</strong> לווידג'ט קטן — גררו אותו בעורך למיקום הרצוי.
      </p>
    </SitePluginPanelFrame>
  );
}
