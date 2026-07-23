import React, { useMemo, useState } from "react";
import { CircleDot, Plus, Trash2 } from "lucide-react";

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
  type BenefitsWheelTriggerShape,
} from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import BenefitsWheelSpinWheel from "../../../site-plugins/benefits-wheel/BenefitsWheelSpinWheel";

const TRIGGER_SHAPES: { value: BenefitsWheelTriggerShape; label: string }[] = [
  { value: "pill", label: "גלולה" },
  { value: "rounded", label: "מרובע מעוגל" },
  { value: "circle", label: "עיגול (אייקון בלבד)" },
];

export default function SiteBenefitsWheelPanel(props: PluginPanelProps) {
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
        triggerLabel: str(settings.triggerLabel, str(settings.title, "גלגל הטבות")),
        triggerColor: str(settings.triggerColor, "#7C3AED"),
        triggerColorEnd: str(settings.triggerColorEnd, "#a855f7"),
        triggerTextColor: str(settings.triggerTextColor, "#ffffff"),
        triggerShape: (settings.triggerShape as BenefitsWheelTriggerShape) || "pill",
      }),
    [settings]
  );

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
      !window.confirm(
        "להסיר את גלגל ההטבות מהאתר? התוסף יוסר מרשימת התוספים הפעילים."
      )
    ) {
      return;
    }

    setRemoving(true);
    setRemoveMessage("");
    try {
      const { enabledPlugins } = await getSitePlugins(props.siteId);
      await updateSitePlugins(
        props.siteId,
        enabledPlugins.filter((key) => key !== "benefits-wheel")
      );
      setRemoveMessage("התוסף הוסר מהאתר. חזרו לחנות תוספים להתקנה מחדש.");
    } catch {
      setRemoveMessage("שגיאה בהסרת התוסף. נסו שוב.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <SitePluginPanelFrame
      {...props}
      icon={CircleDot}
      accent="#D946EF"
      title="גלגל הטבות"
      description="גלגל מסתובב במודאל — נפתח בכניסה ראשונה לאתר. גררו את הכפתור הצף בעורך."
      loading={loading}
      saving={saving}
      message={message || removeMessage}
      onSave={() => save({ ...settings, segmentCount, segments })}
    >
      <Toggle
        label="תוסף פעיל באתר"
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />

      <Toggle
        label="פתיחה אוטומטית בכניסה ראשונה"
        checked={bool(settings.autoOpenOnFirstVisit, true)}
        onChange={(v) => updateField("autoOpenOnFirstVisit", v)}
      />

      <Toggle
        label="הצג כפתור צף"
        checked={bool(settings.showTrigger, true)}
        onChange={(v) => updateField("showTrigger", v)}
      />

      <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
        <p className="mb-3 text-sm font-bold text-slate-800">כפתור צף</p>

        <Field label="טקסט על הכפתור">
          <TextInput
            value={str(settings.triggerLabel, str(settings.title, "גלגל הטבות"))}
            onChange={(v) => updateField("triggerLabel", v)}
            placeholder="גלגל הטבות"
          />
        </Field>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="צבע ראשי">
            <input
              type="color"
              value={str(settings.triggerColor, "#7C3AED")}
              onChange={(e) => updateField("triggerColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
            />
          </Field>
          <Field label="צבע משני (גרדיאנט)">
            <input
              type="color"
              value={str(settings.triggerColorEnd, "#a855f7")}
              onChange={(e) => updateField("triggerColorEnd", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
            />
          </Field>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="צבע טקסט">
            <input
              type="color"
              value={str(settings.triggerTextColor, "#ffffff")}
              onChange={(e) => updateField("triggerTextColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
            />
          </Field>
          <Field label="צורת הכפתור">
            <select
              value={(settings.triggerShape as BenefitsWheelTriggerShape) || "pill"}
              onChange={(e) =>
                updateField("triggerShape", e.target.value as BenefitsWheelTriggerShape)
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"
            >
              {TRIGGER_SHAPES.map((shape) => (
                <option key={shape.value} value={shape.value}>
                  {shape.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4 flex justify-center">
          <span
            className={`inline-flex items-center gap-2 text-sm font-bold shadow-lg ${triggerPreview.shapeClass}`}
            style={{
              background: triggerPreview.background,
              color: triggerPreview.textColor,
            }}
          >
            🎁
            {triggerPreview.showLabel ? triggerPreview.label : null}
          </span>
        </div>
      </div>

      <Field label="כותרת המודאל">
        <TextInput
          value={str(settings.title, "גלגל ההטבות")}
          onChange={(v) => updateField("title", v)}
        />
      </Field>

      <Field label="תת-כותרת">
        <TextInput
          value={str(settings.subtitle, "סובבו וגלו מה זכיתם!")}
          onChange={(v) => updateField("subtitle", v)}
        />
      </Field>

      <Field label="סיבובים לכל מבקר">
        <TextInput
          type="number"
          value={String(num(settings.spinsPerUser, 1))}
          onChange={(v) => updateField("spinsPerUser", Math.max(1, Number(v) || 1))}
        />
      </Field>

      <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-slate-800">חלקי הגלגל</p>
            <p className="text-xs text-slate-500">כמה משולשים, צבע, טקסט וקוד הטבה</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">מספר:</label>
            <input
              type="number"
              min={3}
              max={12}
              value={segmentCount}
              onChange={(e) => setSegmentCount(Number(e.target.value) || 6)}
              className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-center text-sm font-bold"
            />
            <button
              type="button"
              onClick={addSegment}
              disabled={segmentCount >= 12}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-violet-200 bg-white px-2 text-xs font-bold text-violet-700 disabled:opacity-40"
            >
              <Plus size={14} />
              הוסף
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {segments.map((seg, index) => (
            <div key={index} className="rounded-lg border border-slate-100 bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={seg.color || WHEEL_COLORS[index % WHEEL_COLORS.length]}
                  onChange={(e) => updateSegment(index, { color: e.target.value })}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-slate-200"
                  aria-label={`צבע ${index + 1}`}
                />
                <input
                  value={seg.label}
                  onChange={(e) => updateSegment(index, { label: e.target.value })}
                  placeholder={`הטבה ${index + 1}`}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSegment(index)}
                  disabled={segmentCount <= 3}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-rose-100 text-rose-500 disabled:opacity-30"
                  aria-label="הסרה"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-2 pr-11">
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                  קוד הטבה
                </label>
                <input
                  value={seg.couponCode || ""}
                  onChange={(e) => updateSegment(index, { couponCode: e.target.value })}
                  placeholder="לדוגמה: SALE10"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm tracking-wide"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center overflow-visible rounded-xl bg-white p-4">
          <BenefitsWheelSpinWheel segments={segments} rotation={0} size={200} />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        בעורך: הוספה → תוספים → גלגל הטבות. גררו את הכפתור הצף למיקום הרצוי.
        להסרה מהעמוד: לחצו «הסרה» בלוח התוספים.
      </p>

      <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
        <p className="text-sm font-bold text-slate-800">הסרת התוסף מהאתר</p>
        <p className="mt-1 text-xs text-slate-500">
          מסיר את גלגל ההטבות לגמרי מרשימת התוספים הפעילים באתר.
        </p>
        <button
          type="button"
          onClick={handleRemovePlugin}
          disabled={removing}
          className="mt-3 inline-flex h-10 items-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
        >
          {removing ? "מסיר..." : "הסרת התוסף מהאתר"}
        </button>
      </div>

      {Array.isArray(settings.wonSpins) && settings.wonSpins.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-bold text-slate-800">
            הטבות שנשמרו ({settings.wonSpins.length})
          </p>
          <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-slate-600">
            {(settings.wonSpins as Array<{ prizeLabel?: string; couponCode?: string; createdAt?: string }>)
              .slice(0, 20)
              .map((row, i) => (
                <li key={i} className="flex justify-between gap-2 border-b border-slate-100 py-1">
                  <span className="font-semibold">
                    {row.prizeLabel || "—"}
                    {row.couponCode ? (
                      <span className="mr-2 font-mono text-[10px] text-violet-600">
                        ({row.couponCode})
                      </span>
                    ) : null}
                  </span>
                  <span className="text-slate-400">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString("he-IL") : ""}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </SitePluginPanelFrame>
  );
}
