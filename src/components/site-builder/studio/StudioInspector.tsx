import React, { useState } from "react";
import type { InspectorTab, StylePatch } from "./types";

type Props = {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  stylesRef: React.RefObject<HTMLDivElement>;
  traitsRef: React.RefObject<HTMLDivElement>;
  onSetBackgroundImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onApplyStyle?: (style: StylePatch) => void;
  onSetAnimation?: (animation: string) => void;
  onClearAnimation?: () => void;
};

const colorPresets = [
  "#8B5CF6",
  "#EC4899",
  "#BE185D",
  "#F59E0B",
  "#0F766E",
  "#2563EB",
  "#111827",
  "#FFFFFF",
];

const backgroundPresets = [
  { label: "לבן נקי", value: "#FFFFFF" },
  { label: "סגול רך", value: "#F5F3FF" },
  { label: "ורוד יוקרתי", value: "#FFF1F5" },
  { label: "שמנת", value: "#FFFBF6" },
  { label: "כהה", value: "#020617" },
  {
    label: "גרדיאנט סגול",
    value: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
  {
    label: "גרדיאנט נקי",
    value: "linear-gradient(135deg, #FFFFFF, #F5F3FF)",
  },
  {
    label: "גרדיאנט שמנת",
    value: "linear-gradient(135deg, #FFFBF6, #F7E7D4)",
  },
];

const shadowPresets = [
  { label: "ללא", value: "none" },
  { label: "עדין", value: "0 18px 50px rgba(15,23,42,0.08)" },
  { label: "יוקרתי", value: "0 34px 110px rgba(15,23,42,0.14)" },
  { label: "זוהר", value: "0 30px 90px rgba(139,92,246,0.28)" },
];

const animationPresets = [
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
];

export default function StudioInspector({
  activeTab,
  setActiveTab,
  stylesRef,
  traitsRef,
  onSetBackgroundImage,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onApplyStyle,
  onSetAnimation,
  onClearAnimation,
}: Props) {
  const [textColor, setTextColor] = useState("#171321");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("#8B5CF6");
  const [radius, setRadius] = useState(34);
  const [padding, setPadding] = useState(48);
  const [marginTop, setMarginTop] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState(800);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [opacity, setOpacity] = useState(100);

  const applyStyle = (style: StylePatch) => {
    onApplyStyle?.(style);
  };

  const updateTextColor = (value: string) => {
    setTextColor(value);
    applyStyle({ color: value });
  };

  const updateBackgroundColor = (value: string) => {
    setBackgroundColor(value);
    applyStyle({ "background-color": value });
  };

  const updateAccentColor = (value: string) => {
    setAccentColor(value);
    applyStyle({
      "border-color": value,
      "--biz-primary": value,
    });
  };

  const updateRadius = (value: number) => {
    setRadius(value);
    applyStyle({ "border-radius": `${value}px` });
  };

  const updatePadding = (value: number) => {
    setPadding(value);
    applyStyle({ padding: `${value}px` });
  };

  const updateMarginTop = (value: number) => {
    setMarginTop(value);
    applyStyle({ "margin-top": `${value}px` });
  };

  const updateFontSize = (value: number) => {
    setFontSize(value);
    applyStyle({ "font-size": `${value}px` });
  };

  const updateFontWeight = (value: number) => {
    setFontWeight(value);
    applyStyle({ "font-weight": value });
  };

  const updateLineHeight = (value: number) => {
    setLineHeight(value);
    applyStyle({ "line-height": value });
  };

  const updateOpacity = (value: number) => {
    setOpacity(value);
    applyStyle({ opacity: value / 100 });
  };

  const resetSelectedStyle = () => {
    applyStyle({
      color: "",
      background: "",
      "background-color": "",
      "background-image": "",
      "border-radius": "",
      padding: "",
      margin: "",
      "box-shadow": "",
      border: "",
      transform: "",
      filter: "",
      opacity: 1,
    });
  };

  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 shrink-0 border-b border-slate-200">
        <Tab active={activeTab === "design"} onClick={() => setActiveTab("design")}>
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

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === "design" && (
          <>
            <PanelTitle
              title="עיצוב אלמנט"
              subtitle="שינוי צבעים, רקעים, פונטים, פינות, צל, גודל וריווח לאלמנט הנבחר"
            />

            <div className="mb-5 grid grid-cols-2 gap-2">
              <ActionButton onClick={onSetBackgroundImage}>תמונת רקע</ActionButton>
              <ActionButton onClick={onDuplicate}>שכפול</ActionButton>
              <ActionButton onClick={onBringForward}>קדימה</ActionButton>
              <ActionButton onClick={onSendBackward}>אחורה</ActionButton>
              <ActionButton onClick={resetSelectedStyle}>איפוס עיצוב</ActionButton>
              <ActionButton danger onClick={onDelete}>
                מחיקה
              </ActionButton>
            </div>

            <DesignSection title="צבעים">
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
                label="צבע הדגשה / גבול"
                value={accentColor}
                onChange={updateAccentColor}
              />

              <p className="mb-2 mt-4 text-xs font-black text-slate-500">
                צבעים מהירים לטקסט
              </p>

              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={`text-${color}`}
                    type="button"
                    onClick={() => updateTextColor(color)}
                    className="h-10 rounded-2xl border border-slate-200 shadow-sm transition hover:scale-105"
                    style={{ backgroundColor: color }}
                    title={`טקסט ${color}`}
                  />
                ))}
              </div>

              <p className="mb-2 mt-4 text-xs font-black text-slate-500">
                צבעים מהירים לרקע
              </p>

              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={`background-${color}`}
                    type="button"
                    onClick={() => updateBackgroundColor(color)}
                    className="h-10 rounded-2xl border border-slate-200 shadow-sm transition hover:scale-105"
                    style={{ backgroundColor: color }}
                    title={`רקע ${color}`}
                  />
                ))}
              </div>
            </DesignSection>

            <DesignSection title="רקע וסקשן">
              <div className="space-y-2">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setBackgroundColor(preset.value);
                      applyStyle({ background: preset.value });
                    }}
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

              <button
                type="button"
                onClick={onSetBackgroundImage}
                className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5"
              >
                העלאת / הדבקת תמונת רקע לבלוק
              </button>
            </DesignSection>

            <DesignSection title="טיפוגרפיה">
              <RangeControl
                label="גודל טקסט"
                value={fontSize}
                min={10}
                max={96}
                suffix="px"
                onChange={updateFontSize}
              />

              <RangeControl
                label="עובי טקסט"
                value={fontWeight}
                min={300}
                max={950}
                step={50}
                onChange={updateFontWeight}
              />

              <RangeControl
                label="גובה שורה"
                value={lineHeight}
                min={0.9}
                max={2.4}
                step={0.1}
                onChange={updateLineHeight}
              />

              <div className="mt-4 grid grid-cols-2 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => applyStyle({ "font-family": font })}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </DesignSection>

            <DesignSection title="מבנה, פינות וריווח">
              <RangeControl
                label="עיגול פינות"
                value={radius}
                min={0}
                max={90}
                suffix="px"
                onChange={updateRadius}
              />

              <RangeControl
                label="ריווח פנימי"
                value={padding}
                min={0}
                max={130}
                suffix="px"
                onChange={updatePadding}
              />

              <RangeControl
                label="מרווח עליון"
                value={marginTop}
                min={-80}
                max={160}
                suffix="px"
                onChange={updateMarginTop}
              />

              <RangeControl
                label="שקיפות"
                value={opacity}
                min={10}
                max={100}
                suffix="%"
                onChange={updateOpacity}
              />
            </DesignSection>

            <DesignSection title="צל וגבול">
              <div className="grid grid-cols-2 gap-2">
                {shadowPresets.map((shadow) => (
                  <ActionButton
                    key={shadow.label}
                    onClick={() => applyStyle({ "box-shadow": shadow.value })}
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
              </div>
            </DesignSection>

            <DesignSection title="יישור וגודל">
              <div className="grid grid-cols-3 gap-2">
                <ActionButton onClick={() => applyStyle({ "text-align": "right" })}>
                  ימין
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "text-align": "center" })}>
                  מרכז
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "text-align": "left" })}>
                  שמאל
                </ActionButton>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <ActionButton onClick={() => applyStyle({ width: "100%" })}>
                  רוחב מלא
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "max-width": "1180px" })}>
                  רוחב אתר
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ display: "block" })}>
                  בלוק
                </ActionButton>
                <ActionButton
                  onClick={() =>
                    applyStyle({
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "center",
                    })
                  }
                >
                  Flex מרכז
                </ActionButton>
              </div>
            </DesignSection>

            <DesignSection title="GrapesJS מתקדם">
              <p className="mb-3 text-xs font-bold leading-5 text-slate-400">
                הפאנל המקורי נשאר למקרים מתקדמים יותר.
              </p>
              <div ref={stylesRef} />
            </DesignSection>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <PanelTitle
              title="הגדרות אלמנט"
              subtitle="קישורים, פעולות, תמונות, שדות והגדרות מתקדמות"
            />

            <DesignSection title="פעולות מהירות">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={onDuplicate}>שכפול</ActionButton>
                <ActionButton danger onClick={onDelete}>
                  מחיקה
                </ActionButton>
                <ActionButton onClick={onBringForward}>קדימה</ActionButton>
                <ActionButton onClick={onSendBackward}>אחורה</ActionButton>
              </div>
            </DesignSection>

            <DesignSection title="הגדרות מקוריות">
              <div ref={traitsRef} />
            </DesignSection>
          </>
        )}

        {activeTab === "animations" && (
          <>
            <PanelTitle
              title="אנימציות ותנועה"
              subtitle="בחרי אנימציה לאלמנט / סקשן הנבחר"
            />

            <div className="space-y-3">
              {animationPresets.map((animation) => (
                <AnimationButton
                  key={animation.label}
                  label={animation.label}
                  value={animation.value}
                  description={animation.description}
                  onClick={() => {
                    if (!animation.value) {
                      onClearAnimation?.();
                      return;
                    }

                    onSetAnimation?.(animation.value);
                  }}
                />
              ))}
            </div>

            <DesignSection title="אפקטים מהירים">
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
        )}
      </div>
    </aside>
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
        "flex-1 text-sm font-black transition",
        active
          ? "border-b-2 border-violet-700 bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function DesignSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-[1.65rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-black text-slate-950">{title}</p>
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
        value={value.startsWith("#") ? value : "#8B5CF6"}
        onChange={(event) => onChange(event.target.value)}
        className="h-[42px] w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
      />
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
        "rounded-2xl px-3 py-3 text-xs font-black transition",
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
          <p className="text-sm font-black text-slate-950">{label}</p>
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