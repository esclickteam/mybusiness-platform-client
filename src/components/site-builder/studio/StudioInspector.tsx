import React, { useMemo, useState } from "react";
import type { AnimationPresetValue, InspectorTab, StylePatch } from "./types";

type Props = {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  stylesRef: React.RefObject<HTMLDivElement | null>;
  traitsRef: React.RefObject<HTMLDivElement | null>;
  onSetBackgroundImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onApplyStyle?: (style: StylePatch) => void;
  onSetAnimation?: (animation: AnimationPresetValue | string) => void;
  onClearAnimation?: () => void;
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
  "#FEF3C7",
  "#FCE7F3",
];

const backgroundPresets = [
  { label: "לבן נקי", value: "#FFFFFF" },
  { label: "רקע אתר", value: "var(--biz-bg)" },
  { label: "צבע משני", value: "var(--biz-secondary)" },
  { label: "סגול רך", value: "#F5F3FF" },
  { label: "ורוד יוקרתי", value: "#FFF1F5" },
  { label: "שמנת", value: "#FFFBF6" },
  { label: "כהה", value: "#020617" },
  {
    label: "גרדיאנט מותג",
    value:
      "linear-gradient(135deg, var(--biz-primary), var(--biz-accent))",
  },
  {
    label: "גרדיאנט נקי",
    value:
      "linear-gradient(135deg, #FFFFFF, color-mix(in srgb, var(--biz-secondary) 65%, #FFFFFF))",
  },
  {
    label: "גרדיאנט כהה",
    value:
      "linear-gradient(135deg, #020617, #111827, color-mix(in srgb, var(--biz-primary) 36%, #020617))",
  },
];

const shadowPresets = [
  { label: "ללא", value: "none" },
  { label: "עדין", value: "0 18px 50px rgba(15,23,42,0.08)" },
  { label: "מקצועי", value: "0 24px 80px rgba(15,23,42,0.10)" },
  { label: "יוקרתי", value: "0 34px 110px rgba(15,23,42,0.14)" },
  { label: "עמוק", value: "0 44px 150px rgba(15,23,42,0.22)" },
  { label: "זוהר מותג", value: "0 30px 90px color-mix(in srgb, var(--biz-primary) 28%, transparent)" },
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
];

const quickSizes = [
  { label: "כותרת ענקית", style: { "font-size": "72px", "line-height": 0.95, "font-weight": 950 } },
  { label: "כותרת סקשן", style: { "font-size": "48px", "line-height": 1.05, "font-weight": 950 } },
  { label: "כותרת כרטיס", style: { "font-size": "24px", "line-height": 1.25, "font-weight": 900 } },
  { label: "טקסט רגיל", style: { "font-size": "18px", "line-height": 1.75, "font-weight": 700 } },
];

const radiusPresets = [
  { label: "מרובע", value: 0 },
  { label: "חד עדין", value: 6 },
  { label: "מלבני", value: 12 },
  { label: "רך", value: 22 },
  { label: "מעוגל", value: 34 },
  { label: "עגול מאוד", value: 48 },
];

function buildRadiusStyle(value: number): StylePatch {
  const safe = Math.max(0, Math.min(90, Number(value) || 0));
  const buttonRadius = Math.max(0, Math.min(safe, 24));
  const inputRadius = Math.max(0, Math.min(safe, 20));
  const imageRadius = Math.max(0, safe - 8);

  return {
    "border-radius": `${safe}px`,
    "--biz-radius": `${safe}px`,
    "--biz-card-radius": `${safe}px`,
    "--biz-soft-radius": `${safe}px`,
    "--biz-image-radius": `${imageRadius}px`,
    "--biz-button-radius": `${buttonRadius}px`,
    "--biz-input-radius": `${inputRadius}px`,
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
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [radius, setRadius] = useState(34);
  const [padding, setPadding] = useState(48);
  const [marginTop, setMarginTop] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState(800);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [opacity, setOpacity] = useState(100);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentTabTitle = useMemo(() => {
    if (activeTab === "design") return "עיצוב אלמנט";
    if (activeTab === "settings") return "הגדרות אלמנט";
    return "אנימציות ותנועה";
  }, [activeTab]);

  const applyStyle = (style: StylePatch) => {
    onApplyStyle?.(style);
  };

  const updateTextColor = (value: string) => {
    setTextColor(value);

    applyStyle({
      color: value,
      "--header-text": value,
      "--header-muted": value,
      "--biz-text": value,
    });
  };

  const updateBackgroundColor = (value: string) => {
    setBackgroundColor(value);

    applyStyle({
      background: value,
      "background-color": value,
      "--header-bg": value,
      "--biz-bg": value,
    });
  };

  const updateAccentColor = (value: string) => {
    setAccentColor(value);

    applyStyle({
      "border-color": value,
      border: `1px solid ${value}`,
      "--biz-primary": value,
      "--header-border": value,
      "--header-button-bg": value,
    });
  };

  const updateRadius = (value: number) => {
    const safe = Math.max(0, Math.min(90, Number(value) || 0));
    setRadius(safe);

    applyStyle({
      ...buildRadiusStyle(safe),
      "--header-radius": `${safe}px`,
      "--header-button-radius": `${Math.max(0, Math.min(safe, 24))}px`,
    });
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
      "--biz-radius": "",
      "--biz-card-radius": "",
      "--biz-soft-radius": "",
      "--biz-image-radius": "",
      "--biz-button-radius": "",
      "--biz-input-radius": "",
      "--header-bg": "",
      "--header-text": "",
      "--header-muted": "",
      "--header-border": "",
      "--header-button-bg": "",
      "--header-button-text": "",
      "--header-radius": "",
      "--header-button-radius": "",
      "--biz-bg": "",
      "--biz-text": "",
      "--biz-primary": "",
      padding: "",
      margin: "",
      "margin-top": "",
      "box-shadow": "",
      border: "",
      transform: "",
      filter: "",
      opacity: 1,
      "font-size": "",
      "font-weight": "",
      "line-height": "",
      "letter-spacing": "",
      "text-align": "",
    });
  };

  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-white via-violet-50/60 to-fuchsia-50/50 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-500">
              Inspector
            </p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
              {currentTabTitle}
            </h2>
          </div>

          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
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

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === "design" && (
          <>
            <PanelTitle
              title="בחרי אלמנט באתר"
              subtitle="לאחר בחירה אפשר לשנות צבע, רקע, פונט, ריווח, צל, גודל ומבנה. העיצוב חל רק על האלמנט הנבחר."
            />

            <DesignSection title="פעולות מהירות" icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={onSetBackgroundImage}>תמונת רקע</ActionButton>
                <ActionButton onClick={onDuplicate}>שכפול</ActionButton>
                <ActionButton onClick={onBringForward}>קדימה</ActionButton>
                <ActionButton onClick={onSendBackward}>אחורה</ActionButton>
                <ActionButton onClick={resetSelectedStyle}>איפוס עיצוב</ActionButton>
                <ActionButton danger onClick={onDelete}>
                  מחיקה
                </ActionButton>
              </div>
            </DesignSection>

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
                label="צבע הדגשה / גבול"
                value={accentColor}
                onChange={updateAccentColor}
              />

              <PresetLabel>צבעים מהירים לטקסט</PresetLabel>

              <div className="grid grid-cols-6 gap-2">
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

              <div className="grid grid-cols-6 gap-2">
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
                    onClick={() => {
                      setBackgroundColor(preset.value);
                      applyStyle({
                        background: preset.value,
                        "--header-bg": preset.value,
                        "--biz-bg": preset.value,
                      });
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
                className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                העלאת תמונת רקע לבלוק
              </button>
            </DesignSection>

            <DesignSection title="טיפוגרפיה" icon="T">
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
                    onClick={() =>
                      applyStyle({
                        "font-family": `"${font}", Arial, sans-serif`,
                      })
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    style={{ fontFamily: font }}
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

            <DesignSection title="צל וגבול" icon="◈">
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

            <DesignSection title="יישור וגודל" icon="↔">
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
                      gap: "16px",
                    })
                  }
                >
                  Flex מרכז
                </ActionButton>
              </div>
            </DesignSection>

            <button
              type="button"
              onClick={() => setShowAdvanced((value) => !value)}
              className="mb-4 flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span>GrapesJS מתקדם</span>
              <span>{showAdvanced ? "−" : "+"}</span>
            </button>

            {showAdvanced && (
              <DesignSection title="פאנל מקורי מתקדם" icon="⚙">
                <p className="mb-3 text-xs font-bold leading-5 text-slate-400">
                  הפאנל המקורי נשאר למקרים מתקדמים יותר.
                </p>
                <div ref={stylesRef} />
              </DesignSection>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <PanelTitle
              title="הגדרות אלמנט"
              subtitle="קישורים, פעולות, תמונות, שדות והגדרות מקוריות של GrapesJS."
            />

            <DesignSection title="פעולות מהירות" icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={onDuplicate}>שכפול</ActionButton>
                <ActionButton danger onClick={onDelete}>
                  מחיקה
                </ActionButton>
                <ActionButton onClick={onBringForward}>קדימה</ActionButton>
                <ActionButton onClick={onSendBackward}>אחורה</ActionButton>
              </div>
            </DesignSection>

            <DesignSection title="הגדרות מקוריות" icon="⚙">
              <div ref={traitsRef} />
            </DesignSection>
          </>
        )}

        {activeTab === "animations" && (
          <>
            <PanelTitle
              title="אנימציות ותנועה"
              subtitle="בחרי אנימציה לאלמנט / סקשן הנבחר. מתאים לכותרות, כרטיסים ותמונות."
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
      <p className="text-sm font-black text-slate-950">{title}</p>
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
        <p className="text-sm font-black text-slate-950">{title}</p>
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
            משנה את הזווית של הסקשן, הכרטיסים, התמונות, הכפתורים והטפסים.
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
              className="h-full rounded-full bg-gradient-to-l from-violet-700 to-fuchsia-500"
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
                ? "border-violet-700 bg-violet-700 text-white shadow-lg shadow-violet-100"
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
