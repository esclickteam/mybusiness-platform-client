import React, { useMemo, useState } from "react";
import type {
  AnimationPresetValue,
  InspectorTab,
  StylePatch,
} from "./types";

export type VisualEditableElementType =
  | "section"
  | "text"
  | "image"
  | "button"
  | "line"
  | "box"
  | "icon"
  | "unknown";

export type VisualSelectedElement = {
  id: string;
  type: VisualEditableElementType;
  label: string;
  sectionId?: string;
  fieldKey?: string;
  textValue?: string;
  imageValue?: string;
  altValue?: string;
};

type VisualInspectorProps = {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;

  selectedElement: VisualSelectedElement | null;

  onUpdateText?: (elementId: string, value: string) => void;
  onUpdateImage?: (
    elementId: string,
    payload: {
      src?: string;
      alt?: string;
    }
  ) => void;

  onApplyStyle?: (elementId: string, style: StylePatch) => void;
  onResetStyle?: (elementId: string) => void;

  onDuplicate?: (elementId: string) => void;
  onDelete?: (elementId: string) => void;
  onBringForward?: (elementId: string) => void;
  onSendBackward?: (elementId: string) => void;

  onSetAnimation?: (
    elementId: string,
    animation: AnimationPresetValue | string
  ) => void;
  onClearAnimation?: (elementId: string) => void;
};

const colorPresets = [
  "#7C3AED",
  "#EC4899",
  "#BE185D",
  "#F59E0B",
  "#0F766E",
  "#2563EB",
  "#111827",
  "#FFFFFF",
  "#000000",
  "#F8FAFC",
  "#F6F2EA",
  "#E8DFCF",
  "#2B2722",
  "#B68A55",
];

const backgroundPresets = [
  { label: "לבן נקי", value: "#FFFFFF" },
  { label: "שמנת", value: "#F6F2EA" },
  { label: "בז׳ עדין", value: "#E8DFCF" },
  { label: "כהה", value: "#020617" },
  { label: "חום אופנה", value: "#292318" },
  {
    label: "גרדיאנט נקי",
    value: "linear-gradient(135deg, #FFFFFF, #F6F2EA)",
  },
  {
    label: "גרדיאנט כהה",
    value: "linear-gradient(135deg, #020617, #292318)",
  },
];

const shadowPresets = [
  { label: "ללא", value: "none" },
  { label: "עדין", value: "0 18px 50px rgba(15,23,42,0.08)" },
  { label: "מקצועי", value: "0 24px 80px rgba(15,23,42,0.10)" },
  { label: "יוקרתי", value: "0 34px 110px rgba(15,23,42,0.14)" },
  { label: "עמוק", value: "0 44px 150px rgba(15,23,42,0.22)" },
  { label: "אופנה", value: "0 34px 110px rgba(41,35,24,0.18)" },
];

const animationPresets: {
  label: string;
  value: AnimationPresetValue;
  description: string;
}[] = [
  {
    label: "ללא תנועה",
    value: "",
    description: "מסיר אנימציה מהאלמנט",
  },
  {
    label: "Fade Up",
    value: "fade-up",
    description: "כניסה מלמטה עם שקיפות",
  },
  {
    label: "Zoom In",
    value: "zoom-in",
    description: "כניסה עם הגדלה עדינה",
  },
  {
    label: "Slide Right",
    value: "slide-right",
    description: "כניסה מצד ימין",
  },
  {
    label: "Slide Left",
    value: "slide-left",
    description: "כניסה מצד שמאל",
  },
  {
    label: "Blur Reveal",
    value: "blur-reveal",
    description: "חשיפה עם טשטוש יוקרתי",
  },
  {
    label: "Float Soft",
    value: "float-soft",
    description: "תנועה עדינה למעלה ולמטה",
  },
  {
    label: "Pulse Soft",
    value: "pulse-soft",
    description: "פעימה עדינה לאלמנט",
  },
];

const fontOptions = [
  "Heebo",
  "Assistant",
  "Rubik",
  "Alef",
  "Varela Round",
  "Noto Sans Hebrew",
  "Poppins",
  "Inter",
  "DM Sans",
  "Playfair Display",
  "Lora",
  "Libre Baskerville",
  "Georgia",
];

const quickSizes: Array<{
  label: string;
  style: StylePatch;
}> = [
  {
    label: "כותרת ענקית",
    style: {
      fontSize: "86px",
      lineHeight: 0.95,
      fontWeight: 900,
    },
  },
  {
    label: "כותרת סקשן",
    style: {
      fontSize: "54px",
      lineHeight: 1.05,
      fontWeight: 850,
    },
  },
  {
    label: "כותרת כרטיס",
    style: {
      fontSize: "28px",
      lineHeight: 1.25,
      fontWeight: 800,
    },
  },
  {
    label: "טקסט רגיל",
    style: {
      fontSize: "18px",
      lineHeight: 1.75,
      fontWeight: 500,
    },
  },
];

const radiusPresets = [
  { label: "מרובע", value: 0 },
  { label: "חד עדין", value: 6 },
  { label: "מלבני", value: 12 },
  { label: "רך", value: 22 },
  { label: "מעוגל", value: 34 },
  { label: "עגול מאוד", value: 48 },
];

function normalizeStylePatch(style: StylePatch): StylePatch {
  const next: StylePatch = {};

  Object.entries(style || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key.includes("-") && !key.startsWith("--")) {
      const camelKey = key.replace(/-([a-z])/g, (_, letter) =>
        String(letter).toUpperCase()
      );
      next[camelKey] = value;
      return;
    }

    next[key] = value;
  });

  return next;
}

function buildRadiusStyle(value: number): StylePatch {
  const safe = Math.max(0, Math.min(90, Number(value) || 0));

  return {
    borderRadius: `${safe}px`,
    "--biz-radius": `${safe}px`,
    "--biz-card-radius": `${safe}px`,
    "--biz-soft-radius": `${safe}px`,
    "--biz-image-radius": `${Math.max(0, safe - 8)}px`,
    "--biz-button-radius": `${Math.max(0, Math.min(safe, 24))}px`,
  };
}

function radiusLabel(value: number) {
  if (value <= 0) return "מרובע חד";
  if (value <= 8) return "כמעט מרובע";
  if (value <= 16) return "מלבני";
  if (value <= 28) return "רך";
  if (value <= 42) return "מעוגל";
  return "עגול מאוד";
}

function getSelectedTitle(selectedElement: VisualSelectedElement | null) {
  if (!selectedElement) return "לא נבחר אלמנט";

  const typeLabels: Record<VisualEditableElementType, string> = {
    section: "סקשן",
    text: "טקסט",
    image: "תמונה",
    button: "כפתור",
    line: "קו",
    box: "קופסה",
    icon: "אייקון",
    unknown: "אלמנט",
  };

  return `${typeLabels[selectedElement.type] || "אלמנט"} · ${
    selectedElement.label || selectedElement.id
  }`;
}

function supportsTextEdit(selectedElement: VisualSelectedElement | null) {
  return (
    selectedElement?.type === "text" ||
    selectedElement?.type === "button" ||
    selectedElement?.type === "section"
  );
}

function supportsImageEdit(selectedElement: VisualSelectedElement | null) {
  return selectedElement?.type === "image";
}

function getFontFamily(font: string) {
  if (font === "Georgia") return "Georgia, Times New Roman, serif";
  return `"${font}", Arial, sans-serif`;
}

export default function VisualInspector({
  activeTab,
  setActiveTab,
  selectedElement,
  onUpdateText,
  onUpdateImage,
  onApplyStyle,
  onResetStyle,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onSetAnimation,
  onClearAnimation,
}: VisualInspectorProps) {
  const [textColor, setTextColor] = useState("#2B2722");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("#B68A55");

  const [radius, setRadius] = useState(22);
  const [padding, setPadding] = useState(48);
  const [marginTop, setMarginTop] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);

  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState(600);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [selectedFont, setSelectedFont] = useState("Inter");

  const [opacity, setOpacity] = useState(100);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [zIndex, setZIndex] = useState(1);

  const [width, setWidth] = useState(100);
  const [maxWidth, setMaxWidth] = useState(1180);

  const [textDraft, setTextDraft] = useState("");
  const [imageDraft, setImageDraft] = useState("");
  const [altDraft, setAltDraft] = useState("");

  React.useEffect(() => {
    setTextDraft(selectedElement?.textValue || "");
    setImageDraft(selectedElement?.imageValue || "");
    setAltDraft(selectedElement?.altValue || "");
  }, [selectedElement]);

  const currentTabTitle = useMemo(() => {
    if (activeTab === "design") return "עיצוב אלמנט";
    if (activeTab === "settings") return "הגדרות אלמנט";
    return "אנימציות ותנועה";
  }, [activeTab]);

  const selectedName = useMemo(() => {
    return getSelectedTitle(selectedElement);
  }, [selectedElement]);

  const hasSelectedElement = Boolean(selectedElement?.id);

  function applyStyle(style: StylePatch) {
    if (!selectedElement?.id) return;
    onApplyStyle?.(selectedElement.id, normalizeStylePatch(style));
  }

  function updateTextColor(value: string) {
    setTextColor(value);

    applyStyle({
      color: value,
      "--biz-text": value,
      "--header-text": value,
    });
  }

  function updateBackgroundColor(value: string) {
    setBackgroundColor(value);

    applyStyle({
      background: value,
      backgroundColor: value,
      "--biz-bg": value,
      "--header-bg": value,
    });
  }

  function updateAccentColor(value: string) {
    setAccentColor(value);

    applyStyle({
      borderColor: value,
      border: `1px solid ${value}`,
      "--biz-primary": value,
      "--header-border": value,
      "--header-button-bg": value,
    });
  }

  function updateRadius(value: number) {
    const safe = Math.max(0, Math.min(90, Number(value) || 0));
    setRadius(safe);
    applyStyle(buildRadiusStyle(safe));
  }

  function updatePadding(value: number) {
    setPadding(value);
    applyStyle({ padding: `${value}px` });
  }

  function updateMarginTop(value: number) {
    setMarginTop(value);
    applyStyle({ marginTop: `${value}px` });
  }

  function updateMarginBottom(value: number) {
    setMarginBottom(value);
    applyStyle({ marginBottom: `${value}px` });
  }

  function updateFontSize(value: number) {
    setFontSize(value);
    applyStyle({ fontSize: `${value}px` });
  }

  function updateFontWeight(value: number) {
    setFontWeight(value);
    applyStyle({ fontWeight: value });
  }

  function updateLineHeight(value: number) {
    setLineHeight(value);
    applyStyle({ lineHeight: value });
  }

  function updateLetterSpacing(value: number) {
    setLetterSpacing(value);
    applyStyle({ letterSpacing: `${value}px` });
  }

  function updateFontFamily(font: string) {
    setSelectedFont(font);
    applyStyle({ fontFamily: getFontFamily(font) });
  }

  function updateOpacity(value: number) {
    setOpacity(value);
    applyStyle({ opacity: value / 100 });
  }

  function applyTransform({
    nextTranslateX,
    nextTranslateY,
    nextScale,
    nextRotate,
  }: {
    nextTranslateX: number;
    nextTranslateY: number;
    nextScale: number;
    nextRotate: number;
  }) {
    applyStyle({
      transform: `translate(${nextTranslateX}px, ${nextTranslateY}px) scale(${
        nextScale / 100
      }) rotate(${nextRotate}deg)`,
    });
  }

  function updateTranslateX(value: number) {
    setTranslateX(value);
    applyTransform({
      nextTranslateX: value,
      nextTranslateY: translateY,
      nextScale: scale,
      nextRotate: rotate,
    });
  }

  function updateTranslateY(value: number) {
    setTranslateY(value);
    applyTransform({
      nextTranslateX: translateX,
      nextTranslateY: value,
      nextScale: scale,
      nextRotate: rotate,
    });
  }

  function updateScale(value: number) {
    setScale(value);
    applyTransform({
      nextTranslateX: translateX,
      nextTranslateY: translateY,
      nextScale: value,
      nextRotate: rotate,
    });
  }

  function updateRotate(value: number) {
    setRotate(value);
    applyTransform({
      nextTranslateX: translateX,
      nextTranslateY: translateY,
      nextScale: scale,
      nextRotate: value,
    });
  }

  function updateZIndex(value: number) {
    setZIndex(value);
    applyStyle({ position: "relative", zIndex: value });
  }

  function updateWidth(value: number) {
    setWidth(value);
    applyStyle({ width: `${value}%` });
  }

  function updateMaxWidth(value: number) {
    setMaxWidth(value);
    applyStyle({ maxWidth: `${value}px` });
  }

  function resetSelectedStyle() {
    if (!selectedElement?.id) return;

    onResetStyle?.(selectedElement.id);

    setTextColor("#2B2722");
    setBackgroundColor("#FFFFFF");
    setAccentColor("#B68A55");
    setRadius(22);
    setPadding(48);
    setMarginTop(0);
    setMarginBottom(0);
    setFontSize(18);
    setFontWeight(600);
    setLineHeight(1.7);
    setLetterSpacing(0);
    setSelectedFont("Inter");
    setOpacity(100);
    setTranslateX(0);
    setTranslateY(0);
    setScale(100);
    setRotate(0);
    setZIndex(1);
    setWidth(100);
    setMaxWidth(1180);
  }

  function handleTextSave() {
    if (!selectedElement?.id) return;
    onUpdateText?.(selectedElement.id, textDraft);
  }

  function handleImageSave() {
    if (!selectedElement?.id) return;

    onUpdateImage?.(selectedElement.id, {
      src: imageDraft,
      alt: altDraft,
    });
  }

  return (
    <aside
      data-visual-inspector-root="true"
      className="flex h-full min-h-0 max-h-full flex-col overflow-hidden border-r border-slate-200 bg-white"
    >
      <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-white via-violet-50/60 to-fuchsia-50/50 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-500">
              Inspector
            </p>

            <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-800">
              {currentTabTitle}
            </h2>

            <p className="mt-1 max-w-[330px] truncate text-[11px] font-bold text-slate-400">
              {selectedName}
            </p>
          </div>

          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
            {activeTab === "design" ? "◐" : activeTab === "settings" ? "⚙" : "✺"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <Tab
            active={activeTab === "design"}
            onClick={() => setActiveTab("design")}
          >
            עיצוב
          </Tab>

          <Tab
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          >
            הגדרות
          </Tab>

          <Tab
            active={activeTab === "animations"}
            onClick={() => setActiveTab("animations")}
          >
            תנועה
          </Tab>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-32">
        {!hasSelectedElement ? <EmptySelection /> : null}

        {hasSelectedElement && activeTab === "design" ? (
          <>
            <PanelTitle
              title="מה שסימנת — אותו את עורכת"
              subtitle="צבעים, פונטים, ריווחים, פינות, מיקום וצל נשמרים רק לאלמנט הנבחר."
            />

            <DesignSection title="פעולות מהירות" icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onDuplicate?.(selectedElement.id)
                  }
                >
                  שכפול
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onBringForward?.(selectedElement.id)
                  }
                >
                  קדימה
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onSendBackward?.(selectedElement.id)
                  }
                >
                  אחורה
                </ActionButton>

                <ActionButton onClick={resetSelectedStyle}>
                  איפוס עיצוב
                </ActionButton>

                <ActionButton
                  danger
                  onClick={() =>
                    selectedElement?.id && onDelete?.(selectedElement.id)
                  }
                >
                  מחיקה
                </ActionButton>
              </div>
            </DesignSection>

            {supportsTextEdit(selectedElement) ? (
              <DesignSection title="עריכת טקסט" icon="T">
                <textarea
                  value={textDraft}
                  onChange={(event) => setTextDraft(event.target.value)}
                  onBlur={handleTextSave}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-7 text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white"
                  placeholder="כתבי טקסט..."
                />

                <button
                  type="button"
                  onClick={handleTextSave}
                  className="mt-3 w-full rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                >
                  עדכון טקסט
                </button>
              </DesignSection>
            ) : null}

            <DesignSection title="צבעים" icon="🎨">
              <ColorControl
                label="צבע טקסט"
                value={textColor}
                onChange={updateTextColor}
              />

              <ColorControl
                label="צבע רקע"
                value={backgroundColor}
                onChange={updateBackgroundColor}
              />

              <ColorControl
                label="צבע גבול / הדגשה"
                value={accentColor}
                onChange={updateAccentColor}
              />

              <PresetLabel>צבעים מהירים לטקסט</PresetLabel>

              <div className="grid grid-cols-7 gap-2">
                {colorPresets.map((color) => (
                  <ColorSwatch
                    key={`text-${color}`}
                    color={color}
                    onClick={() => updateTextColor(color)}
                    title={`טקסט ${color}`}
                  />
                ))}
              </div>

              <PresetLabel>צבעים מהירים לרקע</PresetLabel>

              <div className="grid grid-cols-7 gap-2">
                {colorPresets.map((color) => (
                  <ColorSwatch
                    key={`background-${color}`}
                    color={color}
                    onClick={() => updateBackgroundColor(color)}
                    title={`רקע ${color}`}
                  />
                ))}
              </div>
            </DesignSection>

            <DesignSection title="רקע וסקשן" icon="▧">
              <div className="space-y-2">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateBackgroundColor(preset.value)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <span className="text-xs font-black text-slate-700">
                      {preset.label}
                    </span>

                    <span
                      className="h-8 w-14 rounded-xl border border-slate-200 shadow-sm"
                      style={{ background: preset.value }}
                    />
                  </button>
                ))}
              </div>
            </DesignSection>

            <DesignSection title="טיפוגרפיה ופונטים" icon="T">
              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  בחירת פונט
                </span>

                <select
                  value={selectedFont}
                  onChange={(event) => updateFontFamily(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white"
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>

              <PresetLabel>גדלים מהירים</PresetLabel>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {quickSizes.map((item) => (
                  <ActionButton
                    key={item.label}
                    onClick={() => applyStyle(item.style)}
                  >
                    {item.label}
                  </ActionButton>
                ))}
              </div>

              <RangeControl
                label="גודל טקסט"
                value={fontSize}
                min={8}
                max={120}
                suffix="px"
                onChange={updateFontSize}
              />

              <RangeControl
                label="עובי טקסט"
                value={fontWeight}
                min={100}
                max={950}
                step={50}
                onChange={updateFontWeight}
              />

              <RangeControl
                label="גובה שורה"
                value={lineHeight}
                min={0.8}
                max={2.8}
                step={0.1}
                onChange={updateLineHeight}
              />

              <RangeControl
                label="ריווח אותיות"
                value={letterSpacing}
                min={-8}
                max={20}
                step={0.5}
                suffix="px"
                onChange={updateLetterSpacing}
              />

              <div className="mt-4 grid grid-cols-2 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => updateFontFamily(font)}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    style={{ fontFamily: getFontFamily(font) }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </DesignSection>

            <DesignSection title="מבנה, פינות וריווח" icon="□">
              <RadiusControl value={radius} onChange={updateRadius} />

              <RangeControl
                label="ריווח פנימי"
                value={padding}
                min={0}
                max={180}
                suffix="px"
                onChange={updatePadding}
              />

              <RangeControl
                label="מרווח עליון"
                value={marginTop}
                min={-160}
                max={240}
                suffix="px"
                onChange={updateMarginTop}
              />

              <RangeControl
                label="מרווח תחתון"
                value={marginBottom}
                min={-160}
                max={240}
                suffix="px"
                onChange={updateMarginBottom}
              />

              <RangeControl
                label="שקיפות"
                value={opacity}
                min={5}
                max={100}
                suffix="%"
                onChange={updateOpacity}
              />
            </DesignSection>

            <DesignSection title="מיקום ושכבות" icon="↕">
              <RangeControl
                label="הזזה ימינה / שמאלה"
                value={translateX}
                min={-300}
                max={300}
                suffix="px"
                onChange={updateTranslateX}
              />

              <RangeControl
                label="הזזה למעלה / למטה"
                value={translateY}
                min={-300}
                max={300}
                suffix="px"
                onChange={updateTranslateY}
              />

              <RangeControl
                label="גודל / Scale"
                value={scale}
                min={20}
                max={220}
                suffix="%"
                onChange={updateScale}
              />

              <RangeControl
                label="סיבוב"
                value={rotate}
                min={-45}
                max={45}
                suffix="°"
                onChange={updateRotate}
              />

              <RangeControl
                label="שכבה קדימה / אחורה"
                value={zIndex}
                min={0}
                max={100}
                onChange={updateZIndex}
              />
            </DesignSection>

            <DesignSection title="רוחב וגודל" icon="↔">
              <RangeControl
                label="רוחב באחוזים"
                value={width}
                min={5}
                max={100}
                suffix="%"
                onChange={updateWidth}
              />

              <RangeControl
                label="רוחב מקסימלי"
                value={maxWidth}
                min={120}
                max={1800}
                suffix="px"
                onChange={updateMaxWidth}
              />

              <div className="mt-2 grid grid-cols-2 gap-2">
                <ActionButton onClick={() => applyStyle({ width: "100%" })}>
                  רוחב מלא
                </ActionButton>

                <ActionButton onClick={() => applyStyle({ width: "auto" })}>
                  רוחב טבעי
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "16px",
                    })
                  }
                >
                  Flex מרכז
                </ActionButton>

                <ActionButton onClick={() => applyStyle({ display: "block" })}>
                  בלוק
                </ActionButton>
              </div>
            </DesignSection>

            <DesignSection title="צל וגבול" icon="◈">
              <div className="grid grid-cols-2 gap-2">
                {shadowPresets.map((shadow) => (
                  <ActionButton
                    key={shadow.label}
                    onClick={() => applyStyle({ boxShadow: shadow.value })}
                  >
                    {shadow.label}
                  </ActionButton>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionButton
                  onClick={() =>
                    applyStyle({
                      border: "1px solid rgba(226,232,240,0.95)",
                    })
                  }
                >
                  גבול עדין
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      border: `2px solid ${accentColor}`,
                    })
                  }
                >
                  גבול בצבע
                </ActionButton>

                <ActionButton onClick={() => applyStyle({ border: "none" })}>
                  בלי גבול
                </ActionButton>
              </div>
            </DesignSection>

            <DesignSection title="יישור" icon="↔">
              <div className="grid grid-cols-3 gap-2">
                <ActionButton onClick={() => applyStyle({ textAlign: "right" })}>
                  ימין
                </ActionButton>

                <ActionButton
                  onClick={() => applyStyle({ textAlign: "center" })}
                >
                  מרכז
                </ActionButton>

                <ActionButton onClick={() => applyStyle({ textAlign: "left" })}>
                  שמאל
                </ActionButton>
              </div>
            </DesignSection>
          </>
        ) : null}

        {hasSelectedElement && activeTab === "settings" ? (
          <>
            <PanelTitle
              title="הגדרות אלמנט"
              subtitle="תוכן, תמונה ו־ALT לפי האלמנט שסימנת."
            />

            {supportsTextEdit(selectedElement) ? (
              <DesignSection title="תוכן טקסט" icon="T">
                <textarea
                  value={textDraft}
                  onChange={(event) => setTextDraft(event.target.value)}
                  onBlur={handleTextSave}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-7 text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={handleTextSave}
                  className="mt-3 w-full rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                >
                  שמירת טקסט
                </button>
              </DesignSection>
            ) : null}

            {supportsImageEdit(selectedElement) ? (
              <DesignSection title="תמונה" icon="▧">
                <label className="mb-3 block">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    כתובת תמונה
                  </span>

                  <input
                    value={imageDraft}
                    onChange={(event) => setImageDraft(event.target.value)}
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-black text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white"
                    placeholder="https://..."
                  />
                </label>

                <label className="mb-3 block">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Alt / תיאור תמונה
                  </span>

                  <input
                    value={altDraft}
                    onChange={(event) => setAltDraft(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white"
                    placeholder="תיאור לתמונה"
                  />
                </label>

                {imageDraft ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={imageDraft}
                      alt=""
                      className="h-44 w-full object-cover"
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleImageSave}
                  className="w-full rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                >
                  החלפת תמונה
                </button>
              </DesignSection>
            ) : null}

            <DesignSection title="פעולות מהירות" icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onDuplicate?.(selectedElement.id)
                  }
                >
                  שכפול
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onBringForward?.(selectedElement.id)
                  }
                >
                  קדימה
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    selectedElement?.id && onSendBackward?.(selectedElement.id)
                  }
                >
                  אחורה
                </ActionButton>

                <ActionButton
                  danger
                  onClick={() =>
                    selectedElement?.id && onDelete?.(selectedElement.id)
                  }
                >
                  מחיקה
                </ActionButton>
              </div>
            </DesignSection>
          </>
        ) : null}

        {hasSelectedElement && activeTab === "animations" ? (
          <>
            <PanelTitle
              title="אנימציות ותנועה"
              subtitle="בחרי אנימציה לאלמנט שסימנת."
            />

            <div className="space-y-3">
              {animationPresets.map((animation) => (
                <AnimationButton
                  key={animation.label}
                  label={animation.label}
                  value={animation.value}
                  description={animation.description}
                  onClick={() => {
                    if (!selectedElement?.id) return;

                    if (!animation.value) {
                      onClearAnimation?.(selectedElement.id);
                      return;
                    }

                    onSetAnimation?.(selectedElement.id, animation.value);
                  }}
                />
              ))}
            </div>

            <DesignSection title="אפקטים מהירים" icon="✦">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  onClick={() =>
                    applyStyle({
                      transition: "0.25s ease",
                      transform: "translateY(-4px)",
                    })
                  }
                >
                  Lift
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      transition: "0.25s ease",
                      filter: "brightness(1.06)",
                    })
                  }
                >
                  Glow
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      transition: "0.25s ease",
                      transform: "scale(1.025)",
                    })
                  }
                >
                  Zoom
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      transform: "none",
                      filter: "none",
                    })
                  }
                >
                  איפוס
                </ActionButton>
              </div>
            </DesignSection>
          </>
        ) : null}
      </div>
    </aside>
  );
}

function EmptySelection() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
        ✦
      </div>

      <p className="mt-5 text-lg font-black text-slate-800">
        לא נבחר אלמנט
      </p>

      <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
        לחצי על כותרת, תמונה, כפתור, קו, קופסה או סקשן בתוך התבנית כדי לפתוח
        עריכה מלאה.
      </p>
    </div>
  );
}

function Tab({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-2 py-2.5 text-xs font-black transition",
        active
          ? "bg-violet-700 text-white shadow-lg shadow-violet-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function DesignSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-[1.65rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-800">{title}</p>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-50 text-xs font-black text-violet-700">
          {icon}
        </span>
      </div>

      {children}
    </section>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-3 grid grid-cols-[1fr_54px] items-end gap-2">
      <div>
        <label className="mb-2 block text-xs font-black text-slate-600">
          {label}
        </label>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-black text-slate-700 outline-none focus:border-violet-300 focus:bg-white"
          dir="ltr"
        />
      </div>

      <input
        type="color"
        value={value.startsWith("#") ? value : "#7C3AED"}
        onChange={(event) => onChange(event.target.value)}
        className="h-[42px] w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
      />
    </div>
  );
}

function ColorSwatch({
  color,
  title,
  onClick,
}: {
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 rounded-2xl border border-slate-200 shadow-sm transition hover:scale-105"
      style={{ backgroundColor: color }}
      title={title}
    />
  );
}

function PresetLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-4 text-xs font-black text-slate-500">
      {children}
    </p>
  );
}

function RadiusControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const progress = Math.max(0, Math.min(100, (value / 90) * 100));

  return (
    <div className="mb-5 rounded-[1.35rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-slate-700">
            קו פינות — מריבוע עד עיגול
          </p>

          <p className="mt-1 text-[11px] font-bold leading-5 text-slate-400">
            משנה פינות של האלמנט שסימנת.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-violet-700 px-3 py-1 text-[11px] font-black text-white">
          {value}px
        </span>
      </div>

      <div className="mb-4 grid grid-cols-[54px_1fr_54px] items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-none border-2 border-slate-300 bg-white text-[10px] font-black text-slate-500">
          מרובע
        </div>

        <div>
          <input
            type="range"
            min={0}
            max={90}
            step={1}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full accent-violet-700"
          />

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-[24px] border-2 border-violet-300 bg-white text-[10px] font-black text-violet-600">
          עגול
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-[11px] font-black text-slate-400">
        <span>0px</span>
        <span className="text-violet-700">{radiusLabel(value)}</span>
        <span>90px</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {radiusPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.value)}
            className={[
              "flex min-h-[42px] items-center justify-center border px-2 py-2 text-center text-[11px] font-black leading-tight transition",
              value === preset.value
                ? "border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg shadow-violet-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700",
            ].join(" ")}
            style={{ borderRadius: `${Math.min(preset.value, 28)}px` }}
            title={`${preset.label} ${preset.value}px`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-black text-slate-600">{label}</label>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-violet-700"
      />
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl px-3 py-3 text-center text-xs font-black leading-tight transition",
        danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function AnimationButton({
  label,
  value,
  description,
  onClick,
}: {
  label: string;
  value: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-800">{label}</p>

          <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
          {value || "none"}
        </span>
      </div>
    </button>
  );
}