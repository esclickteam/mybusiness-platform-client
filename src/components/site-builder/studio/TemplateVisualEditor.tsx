import React from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  Monitor,
  MousePointer2,
  Save,
  Smartphone,
  Tablet,
  Type,
} from "lucide-react";

import type {
  StudioTemplateField,
  StudioTemplateFieldType,
  StudioTemplateRenderer,
  StudioTemplateSchemaSection,
} from "./data/templates/templateEditorTypes";

type DeviceMode = "desktop" | "tablet" | "mobile";

type TemplateVisualEditorProps = {
  renderer: StudioTemplateRenderer;
  businessId?: string;
  initialData?: Record<string, any>;
  onBack?: () => void;
  onSave?: (payload: {
    templateKey: string;
    editorMode: "visual-react";
    data: Record<string, any>;
    updatedAt: string;
  }) => void | Promise<void>;
};

function cloneData<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch {
    return {} as T;
  }
}

function getSectionData(
  data: Record<string, any>,
  sectionId: string,
): Record<string, any> {
  const value = data?.[sectionId];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return {};
}

function getFieldValue(
  data: Record<string, any>,
  sectionId: string,
  fieldKey: string,
) {
  return getSectionData(data, sectionId)?.[fieldKey];
}

function getInputType(type: StudioTemplateFieldType) {
  if (type === "number") return "number";
  if (type === "color") return "color";
  return "text";
}

function getDeviceWidth(device: DeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";
  return "100%";
}

function getDeviceLabel(device: DeviceMode) {
  if (device === "mobile") return "טלפון";
  if (device === "tablet") return "טאבלט";
  return "דסקטופ";
}

function isTextualField(type: StudioTemplateFieldType) {
  return (
    type === "text" ||
    type === "textarea" ||
    type === "number" ||
    type === "color" ||
    type === "link" ||
    type === "select" ||
    type === "boolean" ||
    type === "image"
  );
}

function FieldIcon({ type }: { type: StudioTemplateFieldType }) {
  if (type === "image" || type === "image-list" || type === "gallery") {
    return <ImageIcon className="h-4 w-4" />;
  }

  return <Type className="h-4 w-4" />;
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center">
      <div className="max-w-sm rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <MousePointer2 className="h-5 w-5" />
        </div>

        <h3 className="mt-5 text-xl font-black tracking-[-0.04em] text-slate-950">
          בחרי סקשן לעריכה
        </h3>

        <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
          לחצי על סקשן מהרשימה כדי לערוך טקסטים, תמונות, כפתורים והגדרות של
          התבנית בלי לשבור את העיצוב.
        </p>
      </div>
    </div>
  );
}

function VisualEditorField({
  sectionId,
  field,
  value,
  onChange,
}: {
  sectionId: string;
  field: StudioTemplateField;
  value: any;
  onChange: (sectionId: string, fieldKey: string, value: any) => void;
}) {
  const fieldId = `${sectionId}-${field.key}`;

  if (field.type === "textarea") {
    return (
      <label
        htmlFor={fieldId}
        className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
          <FieldIcon type={field.type} />
          {field.label}
        </div>

        <textarea
          id={fieldId}
          value={String(value ?? "")}
          placeholder={field.placeholder || ""}
          rows={5}
          onChange={(event) =>
            onChange(sectionId, field.key, event.target.value)
          }
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white"
        />
      </label>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-700">
            <FieldIcon type={field.type} />
            {field.label}
          </div>

          {field.placeholder ? (
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {field.placeholder}
            </p>
          ) : null}
        </div>

        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) =>
            onChange(sectionId, field.key, event.target.checked)
          }
          className="h-5 w-5 accent-slate-950"
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label
        htmlFor={fieldId}
        className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
          <FieldIcon type={field.type} />
          {field.label}
        </div>

        <select
          id={fieldId}
          value={String(value ?? "")}
          onChange={(event) =>
            onChange(sectionId, field.key, event.target.value)
          }
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white"
        >
          <option value="">בחרי אפשרות</option>

          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "image-list" || field.type === "gallery") {
    const listValue = Array.isArray(value) ? value : [];

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
          <FieldIcon type={field.type} />
          {field.label}
        </div>

        <div className="grid gap-3">
          {listValue.length ? (
            listValue.map((item, index) => (
              <div
                key={`${field.key}-${index}`}
                className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2"
              >
                <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-200">
                  {String(item || "").startsWith("http") ? (
                    <img
                      src={String(item)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <input
                  value={String(item || "")}
                  onChange={(event) => {
                    const next = [...listValue];
                    next[index] = event.target.value;
                    onChange(sectionId, field.key, next);
                  }}
                  placeholder="URL של תמונה"
                  className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-slate-950"
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = listValue.filter((_, itemIndex) => {
                      return itemIndex !== index;
                    });

                    onChange(sectionId, field.key, next);
                  }}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                >
                  מחיקה
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm font-bold text-slate-400">
              אין תמונות עדיין
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange(sectionId, field.key, [...listValue, ""])}
            className="h-10 rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-black"
          >
            הוספת תמונה
          </button>
        </div>
      </div>
    );
  }

  if (field.type === "products") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-amber-900">
          <FieldIcon type={field.type} />
          {field.label}
        </div>

        <p className="mt-2 text-xs font-semibold leading-6 text-amber-700">
          עריכת מוצרים מלאה תהיה בשלב הבא דרך Product Editor ייעודי.
        </p>
      </div>
    );
  }

  if (!isTextualField(field.type)) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
          <FieldIcon type={field.type} />
          {field.label}
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-400">
          סוג שדה לא נתמך עדיין: {field.type}
        </p>
      </div>
    );
  }

  return (
    <label
      htmlFor={fieldId}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
        <FieldIcon type={field.type} />
        {field.label}
      </div>

      <input
        id={fieldId}
        type={getInputType(field.type)}
        value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
        placeholder={field.placeholder || ""}
        onChange={(event) => {
          const nextValue =
            field.type === "number"
              ? Number(event.target.value || 0)
              : event.target.value;

          onChange(sectionId, field.key, nextValue);
        }}
        className={[
          "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white",
          field.type === "color" ? "p-1" : "",
        ].join(" ")}
      />
    </label>
  );
}

export default function TemplateVisualEditor({
  renderer,
  businessId,
  initialData,
  onBack,
  onSave,
}: TemplateVisualEditorProps) {
  const TemplateComponent = renderer.Component as React.ComponentType<any>;

  const schema = renderer.schema;
  const sections = schema?.sections || [];
  const baseData = React.useMemo(() => {
    return {
      ...(cloneData(renderer.defaultData || {}) as Record<string, any>),
      ...(cloneData(initialData || {}) as Record<string, any>),
    };
  }, [renderer.defaultData, initialData]);

  const [templateData, setTemplateData] =
    React.useState<Record<string, any>>(baseData);
  const [selectedSectionId, setSelectedSectionId] = React.useState(
    sections[0]?.id || "",
  );
  const [device, setDevice] = React.useState<DeviceMode>("desktop");
  const [previewOnly, setPreviewOnly] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState("");

  const selectedSection = React.useMemo(() => {
    return (
      sections.find((section) => section.id === selectedSectionId) ||
      sections[0] ||
      null
    );
  }, [sections, selectedSectionId]);

  React.useEffect(() => {
    setTemplateData(baseData);
  }, [baseData]);

  React.useEffect(() => {
    if (!selectedSectionId && sections[0]?.id) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  function updateField(sectionId: string, fieldKey: string, value: any) {
    setTemplateData((current) => {
      const currentSection = getSectionData(current, sectionId);

      return {
        ...current,
        [sectionId]: {
          ...currentSection,
          [fieldKey]: value,
        },
      };
    });
  }

  async function handleSave() {
    const updatedAt = new Date().toISOString();

    setSaving(true);

    try {
      await onSave?.({
        templateKey: renderer.key,
        editorMode: "visual-react",
        data: templateData,
        updatedAt,
      });

      setSavedAt(updatedAt);
    } finally {
      setSaving(false);
    }
  }

  function renderSectionButton(section: StudioTemplateSchemaSection) {
    const active = selectedSectionId === section.id;

    return (
      <button
        key={section.id}
        type="button"
        onClick={() => {
          setSelectedSectionId(section.id);
          setPreviewOnly(false);
        }}
        className={[
          "group flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-right transition",
          active
            ? "border-slate-950 bg-slate-950 text-white shadow-lg"
            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
        ].join(" ")}
      >
        <span className="min-w-0">
          <span className="block text-sm font-black">{section.label}</span>

          {section.description ? (
            <span
              className={[
                "mt-1 block text-xs font-semibold leading-5",
                active ? "text-white/65" : "text-slate-400",
              ].join(" ")}
            >
              {section.description}
            </span>
          ) : null}
        </span>

        <Layers
          className={[
            "mt-0.5 h-4 w-4 shrink-0",
            active ? "text-white" : "text-slate-400",
          ].join(" ")}
        />
      </button>
    );
  }

  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-100 text-slate-950"
      dir="rtl"
      data-template-visual-editor="true"
      data-template-key={renderer.key}
      data-business-id={businessId || ""}
    >
      <header className="z-20 flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </button>
          ) : null}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              React Visual Editor
            </p>

            <h1 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {renderer.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 md:flex">
            {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((item) => {
              const active = device === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDevice(item)}
                  title={getDeviceLabel(item)}
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-950",
                  ].join(" ")}
                >
                  {item === "desktop" ? (
                    <Monitor className="h-4 w-4" />
                  ) : item === "tablet" ? (
                    <Tablet className="h-4 w-4" />
                  ) : (
                    <Smartphone className="h-4 w-4" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPreviewOnly((current) => !current)}
            className={[
              "inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition",
              previewOnly
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {previewOnly ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewOnly ? "חזרה לעריכה" : "מצב צפייה"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "שומר..." : "שמירה"}
          </button>
        </div>
      </header>

      <div
        className={[
          "grid min-h-0 flex-1 transition-[grid-template-columns] duration-300",
          previewOnly
            ? "grid-cols-[0px_minmax(0,1fr)_0px]"
            : "grid-cols-[340px_minmax(0,1fr)_390px]",
        ].join(" ")}
      >
        <aside
          className={[
            "min-h-0 overflow-hidden border-l border-slate-200 bg-white transition-opacity",
            previewOnly ? "pointer-events-none opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-slate-200 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Sections
              </p>

              <h2 className="mt-1 text-lg font-black tracking-[-0.04em]">
                סקשנים לעריכה
              </h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="grid gap-3">
                {sections.length ? (
                  sections.map(renderSectionButton)
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-400">
                    אין schema לתבנית הזאת
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-0 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff)] p-5">
          <div className="mx-auto flex min-h-full justify-center">
            <div
              className={[
                "min-h-full overflow-hidden bg-white shadow-[0_24px_90px_rgba(15,23,42,0.16)] transition-all duration-300",
                device === "desktop"
                  ? "w-full max-w-none rounded-[26px]"
                  : "rounded-[32px] border-[10px] border-slate-900",
              ].join(" ")}
              style={{
                width: getDeviceWidth(device),
              }}
            >
              <div
                className="relative min-h-full"
                data-visual-template-canvas="true"
              >
                <TemplateComponent
                  initialPage="home"
                  isStudioStatic={false}
                  isVisualEditor
                  templateData={templateData}
                  data={templateData}
                  studioData={templateData}
                />

                {!previewOnly && selectedSection ? (
                  <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-5 py-3 text-sm font-black text-slate-700 shadow-2xl backdrop-blur">
                    עריכה פעילה: {selectedSection.label}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>

        <aside
          className={[
            "min-h-0 overflow-hidden border-r border-slate-200 bg-white transition-opacity",
            previewOnly ? "pointer-events-none opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-slate-200 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Inspector
              </p>

              <h2 className="mt-1 text-lg font-black tracking-[-0.04em]">
                {selectedSection?.label || "עריכה"}
              </h2>

              {selectedSection?.description ? (
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {selectedSection.description}
                </p>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {selectedSection ? (
                <div className="grid gap-4">
                  {selectedSection.fields.map((field) => (
                    <VisualEditorField
                      key={`${selectedSection.id}-${field.key}`}
                      sectionId={selectedSection.id}
                      field={field}
                      value={getFieldValue(
                        templateData,
                        selectedSection.id,
                        field.key,
                      )}
                      onChange={updateField}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-500">
                    {savedAt
                      ? `נשמר: ${new Date(savedAt).toLocaleTimeString("he-IL")}`
                      : "עדיין לא נשמר"}
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                    {renderer.key} · {getDeviceLabel(device)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 shrink-0 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "שומר..." : "שמירה"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}