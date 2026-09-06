import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  COUNTDOWN_UNIT_FORMATS,
  PRESET_DEFAULT_COLORS,
  type CountdownEffectMode,
  type CountdownEffectWhen,
  type CountdownFontPreset,
  type CountdownLayoutMode,
  type CountdownSettings,
  type CountdownSizePreset,
  type CountdownStylePreset,
  type CountdownUnitFormat,
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
  const { t } = useTranslation();
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
  const unitFormat = (settings.unitFormat as CountdownUnitFormat) || "standard";
  const isStandardFormat = unitFormat === "standard";

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
      title={t("sitePlugins.countdown.title")}
      description={t("sitePlugins.countdown.description")}
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save({ ...settings })}
    >
      <Toggle
        label={t("sitePlugins.countdown.pluginActive")}
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />

      <SectionCard icon={LayoutTemplate} title={t("sitePlugins.countdown.styleSize")} accent="#A855F7">
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
              <p className="text-xs font-black text-slate-800">
                {t(`sitePlugins.countdown.style${preset.value[0].toUpperCase()}${preset.value.slice(1)}`, {
                  defaultValue: preset.label,
                })}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                {t(`sitePlugins.countdown.style${preset.value[0].toUpperCase()}${preset.value.slice(1)}Hint`, {
                  defaultValue: preset.description,
                })}
              </p>
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.pageDisplay")}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {COUNTDOWN_LAYOUT_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => updateField("layoutMode", mode.value as CountdownLayoutMode)}
                className={`rounded-xl border p-3 text-right transition ${
                  (settings.layoutMode || "compact") === mode.value
                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
                    : "border-slate-200 bg-white hover:border-violet-200"
                }`}
              >
                <p className="text-xs font-black text-slate-800">
                  {t(`sitePlugins.countdown.layout${mode.value[0].toUpperCase()}${mode.value.slice(1)}`, {
                    defaultValue: mode.label,
                  })}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {t(`sitePlugins.countdown.layout${mode.value[0].toUpperCase()}${mode.value.slice(1)}Hint`, {
                    defaultValue: mode.description,
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.size")}</p>
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
                {t(`sitePlugins.countdown.size${size.value[0].toUpperCase()}${size.value.slice(1)}`, {
                  defaultValue: size.label,
                })}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-visible rounded-2xl border border-dashed border-violet-200 bg-slate-50 p-4">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wide text-violet-500">
            {t("sitePlugins.countdown.preview")}
          </p>
          <CountdownWidget settings={previewSettings} preview />
        </div>
      </SectionCard>

      <SectionCard icon={Timer} title={t("sitePlugins.countdown.contentTime")} accent="#6366F1">
        <Field label={t("sitePlugins.countdown.headline")}>
          <TextInput
            value={str(settings.title, t("sitePlugins.countdown.defaultTitle"))}
            onChange={(v) => updateField("title", v)}
          />
        </Field>
        <Field label={t("sitePlugins.countdown.endDate")}>
          <TextInput
            value={str(settings.endDate)}
            onChange={(v) => updateField("endDate", v)}
            type="datetime-local"
          />
        </Field>
        <Field label={t("sitePlugins.countdown.expiredMessage")}>
          <TextInput
            value={str(settings.expiredMessage, t("sitePlugins.countdown.defaultExpired"))}
            onChange={(v) => updateField("expiredMessage", v)}
          />
        </Field>
        <Toggle
          label={t("sitePlugins.countdown.reverseUnits")}
          checked={bool(settings.unitOrderReversed, true)}
          onChange={(v) => updateField("unitOrderReversed", v)}
        />

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.unitFormat")}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {COUNTDOWN_UNIT_FORMATS.map((format) => (
              <button
                key={format.value}
                type="button"
                onClick={() => updateField("unitFormat", format.value as CountdownUnitFormat)}
                className={`rounded-xl border p-3 text-right transition ${
                  unitFormat === format.value
                    ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-slate-200 bg-white hover:border-indigo-200"
                }`}
              >
                <p className="text-xs font-black text-slate-800">
                  {t(
                    format.value === "daysOnly"
                      ? "sitePlugins.countdown.formatDays"
                      : format.value === "weeksOnly"
                        ? "sitePlugins.countdown.formatWeeks"
                        : "sitePlugins.countdown.formatStandard",
                    { defaultValue: format.label }
                  )}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {t(
                    format.value === "daysOnly"
                      ? "sitePlugins.countdown.formatDaysHint"
                      : format.value === "weeksOnly"
                        ? "sitePlugins.countdown.formatWeeksHint"
                        : "sitePlugins.countdown.formatStandardHint",
                    { defaultValue: format.description }
                  )}
                </p>
              </button>
            ))}
          </div>
        </div>

        {isStandardFormat ? (
          <>
            <Toggle
              label={t("sitePlugins.countdown.monthsAsDays")}
              checked={bool(settings.monthsAsDays, false)}
              onChange={(v) => updateField("monthsAsDays", v)}
            />
            <Toggle
              label={t("sitePlugins.countdown.weeksAsDays")}
              checked={bool(settings.weeksAsDays, false)}
              onChange={(v) => updateField("weeksAsDays", v)}
            />
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {isStandardFormat ? (
            <Toggle
              label={t("sitePlugins.countdown.months")}
              checked={bool(settings.showMonths, true)}
              onChange={(v) => updateField("showMonths", v)}
            />
          ) : null}
          {unitFormat !== "daysOnly" ? (
            <Toggle label={t("sitePlugins.countdown.weeks")} checked={bool(settings.showWeeks, true)} onChange={(v) => updateField("showWeeks", v)} />
          ) : null}
          {unitFormat !== "weeksOnly" ? (
            <Toggle label={t("sitePlugins.countdown.days")} checked={bool(settings.showDays, true)} onChange={(v) => updateField("showDays", v)} />
          ) : null}
          <Toggle label={t("sitePlugins.countdown.hours")} checked={bool(settings.showHours, true)} onChange={(v) => updateField("showHours", v)} />
          <Toggle label={t("sitePlugins.countdown.minutes")} checked={bool(settings.showMinutes, true)} onChange={(v) => updateField("showMinutes", v)} />
          <Toggle label={t("sitePlugins.countdown.seconds")} checked={bool(settings.showSeconds, true)} onChange={(v) => updateField("showSeconds", v)} />
        </div>

        {isStandardFormat && (settings.monthsAsDays || settings.weeksAsDays) ? (
          <p className="text-[11px] leading-relaxed text-slate-500">
            {settings.monthsAsDays && settings.weeksAsDays
              ? t("sitePlugins.countdown.convertBothHint")
              : settings.monthsAsDays
                ? t("sitePlugins.countdown.convertMonthsHint")
                : t("sitePlugins.countdown.convertWeeksHint")}
          </p>
        ) : null}
        {unitFormat === "daysOnly" ? (
          <p className="text-[11px] leading-relaxed text-slate-500">
            {t("sitePlugins.countdown.daysOnlyHint")}
          </p>
        ) : null}
        {unitFormat === "weeksOnly" ? (
          <p className="text-[11px] leading-relaxed text-slate-500">
            {t("sitePlugins.countdown.weeksOnlyHint")}
          </p>
        ) : null}
      </SectionCard>

      <SectionCard icon={Sparkles} title={t("sitePlugins.countdown.effects")} accent="#F59E0B">
        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.effectType")}</p>
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
                {t(
                  `sitePlugins.countdown.effect${effect.value[0].toUpperCase()}${effect.value.slice(1)}`,
                  { defaultValue: effect.label }
                )}
              </button>
            ))}
          </div>
        </div>
        {(settings.effectMode || "none") !== "none" ? (
          <div>
            <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.effectWhen")}</p>
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
                  {t(
                    when.value === "onExpire"
                      ? "sitePlugins.countdown.whenExpire"
                      : when.value === "both"
                        ? "sitePlugins.countdown.whenBoth"
                        : "sitePlugins.countdown.whenDuring",
                    { defaultValue: when.label }
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard icon={Palette} title={t("sitePlugins.countdown.colors")} accent="#EC4899">
        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.countdown.font")}</p>
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
                {t(
                  `sitePlugins.countdown.font${font.value[0].toUpperCase()}${font.value.slice(1)}`,
                  { defaultValue: font.label }
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ColorField
            label={t("sitePlugins.countdown.background")}
            value={str(settings.backgroundColor, PRESET_DEFAULT_COLORS[selectedPreset].backgroundColor || "transparent")}
            onChange={(v) => updateField("backgroundColor", v)}
          />
          {isCards ? (
            <ColorField
              label={t("sitePlugins.countdown.cardColor")}
              value={str(settings.cardBackgroundColor, PRESET_DEFAULT_COLORS.cards.cardBackgroundColor || "#ffffff")}
              onChange={(v) => updateField("cardBackgroundColor", v)}
            />
          ) : null}
          <ColorField
            label={t("sitePlugins.countdown.numberColor")}
            value={str(settings.numberColor, PRESET_DEFAULT_COLORS[selectedPreset].numberColor || "#1e293b")}
            onChange={(v) => updateField("numberColor", v)}
          />
          <ColorField
            label={t("sitePlugins.countdown.labelColor")}
            value={str(settings.labelColor, PRESET_DEFAULT_COLORS[selectedPreset].labelColor || "#94a3b8")}
            onChange={(v) => updateField("labelColor", v)}
          />
          <ColorField
            label={t("sitePlugins.countdown.accentColor")}
            value={str(settings.accentColor, PRESET_DEFAULT_COLORS[selectedPreset].accentColor || "#7C3AED")}
            onChange={(v) => updateField("accentColor", v)}
          />
        </div>

        <Toggle
          label={t("sitePlugins.countdown.shadow")}
          checked={bool(settings.shadowEnabled, true)}
          onChange={(v) => updateField("shadowEnabled", v)}
        />
        {settings.shadowEnabled !== false ? (
          <ColorField
            label={t("sitePlugins.countdown.shadowColor")}
            value={str(settings.shadowColor, "rgba(15,23,42,0.12)")}
            onChange={(v) => updateField("shadowColor", v)}
          />
        ) : null}
      </SectionCard>

      <p className="text-xs leading-relaxed text-slate-500">
        {t("sitePlugins.countdown.editorTip")}
      </p>
    </SitePluginPanelFrame>
  );
}
