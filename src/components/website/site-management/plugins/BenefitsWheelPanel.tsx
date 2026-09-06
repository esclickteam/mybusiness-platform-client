import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FerrisWheel,
  LayoutTemplate,
  MousePointerClick,
  Palette,
  Plus,
  Power,
  Sparkles,
  Ticket,
  Trash2,
  Zap,
} from "lucide-react";
import { getIntlLocale } from "../../../../i18n/localeUtils";

import { getSitePlugins, updateSitePlugins } from "../../../../api/sitePluginsApi";
import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  Field,
  PluginPanelProps,
  SitePluginPanelFrame,
  Toggle,
  bool,
  num,
  str,
  TextInput,
} from "./SitePluginPanelFrame";
import {
  normalizeSegments,
  resolveTriggerPresentation,
  WHEEL_COLORS,
  type BenefitsWheelSegment,
  type BenefitsWheelTriggerIcon,
  type BenefitsWheelTriggerShape,
} from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import BenefitsWheelSpinWheel from "../../../site-plugins/benefits-wheel/BenefitsWheelSpinWheel";
import {
  BenefitsWheelTriggerIcon as TriggerIconPreview,
  TRIGGER_ICON_OPTIONS,
} from "../../../site-plugins/benefits-wheel/benefitsWheelTriggerIcons";

const TRIGGER_SHAPE_KEYS: Record<BenefitsWheelTriggerShape, string> = {
  pill: "sitePlugins.benefitsWheel.pill",
  rounded: "sitePlugins.benefitsWheel.rounded",
  circle: "sitePlugins.benefitsWheel.circle",
};

const TRIGGER_ICON_KEYS: Record<string, string> = {
  "ferris-wheel": "sitePlugins.benefitsWheel.iconFerris",
  gift: "sitePlugins.benefitsWheel.iconGift",
  sparkles: "sitePlugins.benefitsWheel.iconSparkles",
  tag: "sitePlugins.benefitsWheel.iconTag",
  percent: "sitePlugins.benefitsWheel.iconPercent",
  star: "sitePlugins.benefitsWheel.iconStar",
  trophy: "sitePlugins.benefitsWheel.iconTrophy",
};

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  accent = "#7C3AED",
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div
        className="flex items-center gap-3 border-b border-slate-100 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${accent}12, ${accent}06)` }}
      >
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800">{title}</p>
          {subtitle ? <p className="text-[11px] text-slate-500">{subtitle}</p> : null}
        </div>
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
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-500">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent font-mono text-xs font-semibold uppercase text-slate-700 outline-none"
        />
      </div>
    </label>
  );
}

export default function SiteBenefitsWheelPanel(props: PluginPanelProps) {
  const { t, i18n } = useTranslation();
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "benefits-wheel");
  const [removing, setRemoving] = useState(false);
  const [removeMessage, setRemoveMessage] = useState("");

  const segmentCount = Math.min(12, Math.max(3, num(settings.segmentCount, 6)));
  const segments = useMemo(
    () => normalizeSegments(settings.segments as BenefitsWheelSegment[], segmentCount),
    [settings.segments, segmentCount]
  );
  const triggerPreview = useMemo(
    () =>
      resolveTriggerPresentation({
        ...(settings as object),
        triggerLabel: str(settings.triggerLabel, str(settings.title, t("sitePlugins.benefitsWheel.defaultTitle"))),
        triggerIcon: (settings.triggerIcon as BenefitsWheelTriggerIcon) || "ferris-wheel",
        triggerShowIcon: settings.triggerShowIcon !== false,
        triggerColor: str(settings.triggerColor, "#7C3AED"),
        triggerColorEnd: str(settings.triggerColorEnd, "#a855f7"),
        triggerTextColor: str(settings.triggerTextColor, "#ffffff"),
        triggerShape: (settings.triggerShape as BenefitsWheelTriggerShape) || "pill",
      }),
    [settings, t]
  );
  const selectedIcon = (settings.triggerIcon as BenefitsWheelTriggerIcon) || "ferris-wheel";
  const selectedShape = (settings.triggerShape as BenefitsWheelTriggerShape) || "pill";

  function setSegmentCount(count: number) {
    const n = Math.min(12, Math.max(3, count));
    updateField("segmentCount", n);
    updateField("segments", normalizeSegments(segments, n));
  }

  function updateSegment(index: number, patch: Partial<BenefitsWheelSegment>) {
    const next = segments.map((s, i) => (i === index ? { ...s, ...patch } : s));
    updateField("segments", next);
  }

  function addSegment() {
    if (segmentCount >= 12) return;
    setSegmentCount(segmentCount + 1);
  }

  function removeSegment(index: number) {
    if (segmentCount <= 3) return;
    const next = segments.filter((_, i) => i !== index);
    updateField("segmentCount", segmentCount - 1);
    updateField("segments", next);
  }

  async function handleRemovePlugin() {
    if (
      !window.confirm(t("sitePlugins.benefitsWheel.removeConfirm"))
    ) {
      return;
    }

    setRemoving(true);
    setRemoveMessage("");
    try {
      const { enabledPlugins } = await getSitePlugins(props.siteId);
      const result = await updateSitePlugins(
        props.siteId,
        enabledPlugins.filter((key) => key !== "benefits-wheel")
      );
      props.onPluginUninstalled?.("benefits-wheel");
      setRemoveMessage(
        result.enabledPlugins.includes("benefits-wheel")
          ? t("sitePlugins.benefitsWheel.removeFailed")
          : ""
      );
    } catch {
      setRemoveMessage(t("sitePlugins.benefitsWheel.removeFailed"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <SitePluginPanelFrame
      {...props}
      icon={FerrisWheel}
      accent="#D946EF"
      title={t("sitePlugins.benefitsWheel.title")}
      description={t("sitePlugins.benefitsWheel.description")}
      loading={loading}
      saving={saving}
      message={message || (removeMessage ? { type: "error", text: removeMessage } : null)}
      onSave={() => save({ ...settings, segmentCount, segments })}
    >
      <SectionCard
        icon={Power}
        title={t("sitePlugins.benefitsWheel.activation")}
        subtitle={t("sitePlugins.benefitsWheel.activationHint")}
        accent="#8B5CF6"
      >
        <Toggle
          label={t("sitePlugins.benefitsWheel.pluginActive")}
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Toggle
          label={t("sitePlugins.benefitsWheel.autoOpen")}
          checked={bool(settings.autoOpenOnFirstVisit, true)}
          onChange={(v) => updateField("autoOpenOnFirstVisit", v)}
        />
        <Toggle
          label={t("sitePlugins.benefitsWheel.showTrigger")}
          checked={bool(settings.showTrigger, true)}
          onChange={(v) => updateField("showTrigger", v)}
        />
      </SectionCard>

      <SectionCard
        icon={MousePointerClick}
        title={t("sitePlugins.benefitsWheel.trigger")}
        subtitle={t("sitePlugins.benefitsWheel.triggerHint")}
        accent="#EC4899"
      >
        <div className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wide text-violet-500">
            {t("sitePlugins.benefitsWheel.preview")}
          </p>
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-2 text-sm font-bold shadow-[0_8px_24px_rgba(124,58,237,0.35)] ${triggerPreview.shapeClass}`}
              style={{
                background: triggerPreview.background,
                color: triggerPreview.textColor,
              }}
            >
              {triggerPreview.showIcon ? (
                <TriggerIconPreview icon={triggerPreview.icon} size={18} />
              ) : null}
              {triggerPreview.showLabel ? triggerPreview.label : null}
            </span>
          </div>
        </div>

        <Field label={t("sitePlugins.benefitsWheel.buttonText")}>
          <TextInput
            value={str(settings.triggerLabel, str(settings.title, t("sitePlugins.benefitsWheel.defaultTitle")))}
            onChange={(v) => updateField("triggerLabel", v)}
            placeholder={t("sitePlugins.benefitsWheel.defaultTitle")}
          />
        </Field>

        <Toggle
          label={t("sitePlugins.benefitsWheel.showIcon")}
          checked={bool(settings.triggerShowIcon, true)}
          onChange={(v) => updateField("triggerShowIcon", v)}
        />

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.benefitsWheel.icon")}</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
            {TRIGGER_ICON_OPTIONS.filter((opt) => opt.value !== "none").map(({ value, label, Icon }) => {
              const active = selectedIcon === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("triggerIcon", value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
                    active
                      ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm ring-2 ring-violet-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.25} />
                  <span className="text-[10px] font-bold">
                    {t(TRIGGER_ICON_KEYS[value] || label, { defaultValue: label })}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => updateField("triggerIcon", "none")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
                selectedIcon === "none"
                  ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm ring-2 ring-violet-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"
              }`}
            >
              <span className="grid h-5 w-5 place-items-center text-xs font-black">—</span>
              <span className="text-[10px] font-bold">{t("sitePlugins.benefitsWheel.none")}</span>
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold text-slate-500">{t("sitePlugins.benefitsWheel.shape")}</p>
          <div className="grid grid-cols-3 gap-2">
            {(["pill", "rounded", "circle"] as BenefitsWheelTriggerShape[]).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => updateField("triggerShape", shape)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                  selectedShape === shape
                    ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"
                }`}
              >
                {t(TRIGGER_SHAPE_KEYS[shape])}
              </button>
            ))}
          </div>
          {selectedShape === "circle" ? (
            <p className="mt-2 text-[11px] text-slate-400">{t("sitePlugins.benefitsWheel.circleHint")}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ColorField
            label={t("sitePlugins.benefitsWheel.primary")}
            value={str(settings.triggerColor, "#7C3AED")}
            onChange={(v) => updateField("triggerColor", v)}
          />
          <ColorField
            label={t("sitePlugins.benefitsWheel.secondary")}
            value={str(settings.triggerColorEnd, "#a855f7")}
            onChange={(v) => updateField("triggerColorEnd", v)}
          />
          <ColorField
            label={t("sitePlugins.benefitsWheel.textColor")}
            value={str(settings.triggerTextColor, "#ffffff")}
            onChange={(v) => updateField("triggerTextColor", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={LayoutTemplate}
        title={t("sitePlugins.benefitsWheel.modal")}
        subtitle={t("sitePlugins.benefitsWheel.modalHint")}
        accent="#6366F1"
      >
        <Field label={t("sitePlugins.benefitsWheel.modalTitle")}>
          <TextInput
            value={str(settings.title, t("sitePlugins.benefitsWheel.defaultModal"))}
            onChange={(v) => updateField("title", v)}
          />
        </Field>
        <Field label={t("sitePlugins.benefitsWheel.subtitle")}>
          <TextInput
            value={str(settings.subtitle, t("sitePlugins.benefitsWheel.defaultSubtitle"))}
            onChange={(v) => updateField("subtitle", v)}
          />
        </Field>
        <Field label={t("sitePlugins.benefitsWheel.spins")}>
          <TextInput
            type="number"
            value={String(num(settings.spinsPerUser, 1))}
            onChange={(v) => updateField("spinsPerUser", Math.max(1, Number(v) || 1))}
          />
        </Field>
      </SectionCard>

      <SectionCard
        icon={Sparkles}
        title={t("sitePlugins.benefitsWheel.segments")}
        subtitle={t("sitePlugins.benefitsWheel.segmentsHint")}
        accent="#F59E0B"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50/60 px-3 py-2">
          <p className="text-xs font-semibold text-slate-600">
            {t("sitePlugins.benefitsWheel.sliceCount", { count: segmentCount })}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={3}
              max={12}
              value={segmentCount}
              onChange={(e) => setSegmentCount(Number(e.target.value) || 6)}
              className="h-9 w-14 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm font-bold"
            />
            <button
              type="button"
              onClick={addSegment}
              disabled={segmentCount >= 12}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-amber-200 bg-white px-3 text-xs font-bold text-amber-700 disabled:opacity-40"
            >
              <Plus size={14} />
              {t("sitePlugins.benefitsWheel.add")}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {segments.map((seg, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white"
                  style={{ background: seg.color || WHEEL_COLORS[index % WHEEL_COLORS.length] }}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t("sitePlugins.benefitsWheel.perkN", { n: index + 1 })}
                </span>
                <button
                  type="button"
                  onClick={() => removeSegment(index)}
                  disabled={segmentCount <= 3}
                  className="mr-auto grid h-8 w-8 place-items-center rounded-lg border border-rose-100 bg-white text-rose-500 disabled:opacity-30"
                  aria-label={t("sitePlugins.benefitsWheel.remove")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
                <input
                  type="color"
                  value={seg.color || WHEEL_COLORS[index % WHEEL_COLORS.length]}
                  onChange={(e) => updateSegment(index, { color: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white sm:w-12"
                  aria-label={t("sitePlugins.benefitsWheel.colorN", { n: index + 1 })}
                />
                <input
                  value={seg.label}
                  onChange={(e) => updateSegment(index, { label: e.target.value })}
                  placeholder={t("sitePlugins.benefitsWheel.perkN", { n: index + 1 })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-2">
                <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <Ticket size={12} />
                  {t("sitePlugins.benefitsWheel.perkCode")}
                </label>
                <input
                  value={seg.couponCode || ""}
                  onChange={(e) => updateSegment(index, { couponCode: e.target.value })}
                  placeholder="SALE10"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm tracking-wide"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center overflow-visible rounded-2xl border border-dashed border-amber-200 bg-white p-4">
          <BenefitsWheelSpinWheel segments={segments} rotation={0} size={200} />
        </div>
      </SectionCard>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-500">
        <Zap size={16} className="mt-0.5 shrink-0 text-violet-500" />
        <p>
          {t("sitePlugins.benefitsWheel.editorTip")}
        </p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-4">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-rose-500" />
          <p className="text-sm font-bold text-slate-800">{t("sitePlugins.benefitsWheel.removeTitle")}</p>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {t("sitePlugins.benefitsWheel.removeHint")}
        </p>
        <button
          type="button"
          onClick={handleRemovePlugin}
          disabled={removing}
          className="mt-3 inline-flex h-10 items-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
        >
          {removing ? t("sitePlugins.benefitsWheel.removing") : t("sitePlugins.benefitsWheel.removeCta")}
        </button>
      </div>

      {Array.isArray(settings.wonSpins) && settings.wonSpins.length > 0 ? (
        <SectionCard
          icon={Palette}
          title={t("sitePlugins.benefitsWheel.winsTitle", { count: settings.wonSpins.length })}
          subtitle={t("sitePlugins.benefitsWheel.winsHint")}
          accent="#059669"
        >
          <ul className="max-h-44 space-y-1 overflow-y-auto text-xs text-slate-600">
            {(settings.wonSpins as Array<{ prizeLabel?: string; couponCode?: string; createdAt?: string }>)
              .slice(0, 20)
              .map((row, i) => (
                <li
                  key={i}
                  className="flex justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="font-semibold">
                    {row.prizeLabel || "—"}
                    {row.couponCode ? (
                      <span className="mr-2 font-mono text-[10px] text-emerald-600">
                        {row.couponCode}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-slate-400">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString(getIntlLocale(i18n.language)) : ""}
                  </span>
                </li>
              ))}
          </ul>
        </SectionCard>
      ) : null}
    </SitePluginPanelFrame>
  );
}
