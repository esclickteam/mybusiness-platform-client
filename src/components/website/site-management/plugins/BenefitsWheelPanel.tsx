import React, { useMemo } from "react";
import { CircleDot, Plus, Trash2 } from "lucide-react";

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
  WHEEL_COLORS,
  type BenefitsWheelSegment,
} from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import BenefitsWheelSpinWheel from "../../../site-plugins/benefits-wheel/BenefitsWheelSpinWheel";

export default function SiteBenefitsWheelPanel(props: PluginPanelProps) {
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "benefits-wheel");

  const segmentCount = Math.min(12, Math.max(3, num(settings.segmentCount, 6)));
  const segments = useMemo(
    () => normalizeSegments(settings.segments as BenefitsWheelSegment[], segmentCount),
    [settings.segments, segmentCount]
  );

  function setSegmentCount(count: number) {
    const n = Math.min(12, Math.max(3, count));
    updateField("segmentCount", n);
    updateField("segments", normalizeSegments(segments, n));
  }

  function updateSegment(index: number, label: string) {
    const next = segments.map((s, i) => (i === index ? { ...s, label } : s));
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

  return (
    <SitePluginPanelFrame
      {...props}
      icon={CircleDot}
      accent="#D946EF"
      title="גלגל הטבות"
      description="גלגל מסתובב במודאל — נפתח בכניסה ראשונה לאתר. גררו את הכפתור הצף בעורך."
      loading={loading}
      saving={saving}
      message={message}
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
            <p className="text-xs text-slate-500">כמה משולשים ומה כתוב בכל אחד</p>
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
            <div key={index} className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white"
                style={{ background: seg.color || WHEEL_COLORS[index % WHEEL_COLORS.length] }}
              >
                {index + 1}
              </span>
              <input
                value={seg.label}
                onChange={(e) => updateSegment(index, e.target.value)}
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
          ))}
        </div>

        <div className="mt-4 flex justify-center rounded-xl bg-white p-3">
          <BenefitsWheelSpinWheel segments={segments} rotation={0} size={200} />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        לאחר שמירה: עברו לעורך → הוספה → תוספים → גלגל הטבות. הכפתור הצף יופיע
        במיקום הנוכחי — גררו אותו למקום הרצוי. הגלגל עצמו נפתח במודאל, לא בתוך
        סקשן.
      </p>

      {Array.isArray(settings.wonSpins) && settings.wonSpins.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-bold text-slate-800">הטבות שנשמרו ({settings.wonSpins.length})</p>
          <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-slate-600">
            {(settings.wonSpins as Array<{ prizeLabel?: string; createdAt?: string }>)
              .slice(0, 20)
              .map((row, i) => (
                <li key={i} className="flex justify-between gap-2 border-b border-slate-100 py-1">
                  <span className="font-semibold">{row.prizeLabel || "—"}</span>
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
