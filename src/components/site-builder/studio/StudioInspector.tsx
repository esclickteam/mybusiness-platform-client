import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  AnimationPresetValue,
  InspectorTab,
  StylePatch,
  StudioEditableLink,
  StudioSitePage,
} from "./types";
import { readEditableLinkFromAttributes } from "./data/linkUtils";

type Props = {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  stylesRef: React.RefObject<HTMLDivElement | null>;
  traitsRef: React.RefObject<HTMLDivElement | null>;

  pages?: StudioSitePage[];
  selectedComponent?: any;
  onApplyLink?: (link: StudioEditableLink) => void;

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
{ labelKey: "studio.inspector.bgWhite", value: "#FFFFFF" },
{ labelKey: "studio.inspector.bgSite", value: "var(--biz-bg)" },
{ labelKey: "studio.inspector.bgSecondary", value: "var(--biz-secondary)" },
{ labelKey: "studio.inspector.bgSoftViolet", value: "#F5F3FF" },
{ labelKey: "studio.inspector.bgLuxuryPink", value: "#FFF1F5" },
{ labelKey: "studio.inspector.bgCream", value: "#FFFBF6" },
{ labelKey: "studio.inspector.bgDark", value: "#020617" },
  {
    labelKey: "studio.inspector.bgBrandGradient",
    value: "linear-gradient(135deg, var(--biz-primary), var(--biz-accent))",
  },
  {
    labelKey: "studio.inspector.bgCleanGradient",
    value:
      "linear-gradient(135deg, #FFFFFF, color-mix(in srgb, var(--biz-secondary) 65%, #FFFFFF))",
  },
  {
    labelKey: "studio.inspector.bgDarkGradient",
    value:
      "linear-gradient(135deg, #020617, #111827, color-mix(in srgb, var(--biz-primary) 36%, #020617))",
  },
];

const shadowPresets = [
{ labelKey: "studio.inspector.shadowNone", value: "none" },
{ labelKey: "studio.inspector.shadowSoft", value: "0 18px 50px rgba(15,23,42,0.08)" },
{ labelKey: "studio.inspector.shadowPro", value: "0 24px 80px rgba(15,23,42,0.10)" },
{ labelKey: "studio.inspector.shadowLuxury", value: "0 34px 110px rgba(15,23,42,0.14)" },
{ labelKey: "studio.inspector.shadowDeep", value: "0 44px 150px rgba(15,23,42,0.22)" },
  {
    labelKey: "studio.inspector.shadowBrand",
    value:
      "0 30px 90px color-mix(in srgb, var(--biz-primary) 28%, transparent)",
  },
];

const animationPresets: {
  labelKey: string;
  value: AnimationPresetValue;
  descriptionKey: string;
}[] = [
  { labelKey: "studio.inspector.motionNone", value: "", descriptionKey: "studio.inspector.motionNoneHint" },
  { labelKey: "Fade Up", value: "fade-up", descriptionKey: "studio.inspector.fadeUp" },
  { labelKey: "Zoom In", value: "zoom-in", descriptionKey: "studio.inspector.zoomIn" },
  { labelKey: "Slide Right", value: "slide-right", descriptionKey: "studio.inspector.slideRight" },
  { labelKey: "Blur Reveal", value: "blur-reveal", descriptionKey: "studio.inspector.blurReveal" },
  { labelKey: "Float Soft", value: "float-soft", descriptionKey: "studio.inspector.float" },
  { labelKey: "Pulse Soft", value: "pulse-soft", descriptionKey: "studio.inspector.pulse" },
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
  {
    labelKey: "studio.inspector.typeHuge",
    style: {
      "font-size": "72px",
      "line-height": 0.95,
      "font-weight": 950,
    },
  },
  {
    labelKey: "studio.inspector.typeSection",
    style: {
      "font-size": "48px",
      "line-height": 1.05,
      "font-weight": 950,
    },
  },
  {
    labelKey: "studio.inspector.typeCard",
    style: {
      "font-size": "24px",
      "line-height": 1.25,
      "font-weight": 900,
    },
  },
  {
    labelKey: "studio.inspector.typeBody",
    style: {
      "font-size": "18px",
      "line-height": 1.75,
      "font-weight": 700,
    },
  },
];

const radiusPresets = [
{ labelKey: "studio.inspector.radiusSquare", value: 0 },
{ labelKey: "studio.inspector.radiusSharpSoft", value: 6 },
{ labelKey: "studio.inspector.radiusRect", value: 12 },
{ labelKey: "studio.inspector.radiusSoft", value: 22 },
{ labelKey: "studio.inspector.radiusRound", value: 34 },
{ labelKey: "studio.inspector.radiusVeryRound", value: 48 },
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

function radiusLabel(value: number, t: (key: string) => string) {
  if (value <= 0) return t("studio.inspector.radiusSharp");
  if (value <= 8) return t("studio.inspector.radiusAlmostSquare");
  if (value <= 16) return t("studio.inspector.radiusRect");
  if (value <= 28) return t("studio.inspector.radiusSoft");
  if (value <= 42) return t("studio.inspector.radiusRound");
  return t("studio.inspector.radiusVeryRound");
}

function isEditableLinkComponent(selectedComponent: any) {
  if (!selectedComponent) return false;

  const tagName = String(selectedComponent.get?.("tagName") || "").toLowerCase();
  const attrs = selectedComponent.getAttributes?.() || {};

  return (
    tagName === "a" ||
    tagName === "button" ||
    attrs["data-editable-link"] === "true" ||
    attrs["data-biz-button"] ||
    attrs.href
  );
}

export default function StudioInspector({
  activeTab,
  setActiveTab,
  stylesRef,
  traitsRef,
  pages = [],
  selectedComponent,
  onApplyLink,
  onSetBackgroundImage,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onApplyStyle,
  onSetAnimation,
  onClearAnimation,
}: Props) {
  const { t } = useTranslation();
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
    if (activeTab === "design") return t("studio.inspector.designElement");
    if (activeTab === "settings") return t("studio.inspector.settingsElement");
    return t("studio.inspector.motionElement");
  }, [activeTab, t]);

  const selectedName = useMemo(() => {
    if (!selectedComponent) return t("studio.inspector.noElement");

    const tagName = String(selectedComponent.get?.("tagName") || "").toUpperCase();
    const attrs = selectedComponent.getAttributes?.() || {};
    const kind = attrs["data-section-kind"] || attrs["data-bizuply-block"];

    if (kind) return `${tagName} · ${kind}`;

    return tagName || t("studio.element");
  }, [selectedComponent, t]);

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
            <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-800">
              {currentTabTitle}
            </h2>
            <p className="mt-1 text-[11px] font-bold text-slate-400">
              {selectedName}
            </p>
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
            {t("studio.inspector.tabDesign")}
          </Tab>

          <Tab
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          >
            {t("studio.inspector.tabSettings")}
          </Tab>

          <Tab
            active={activeTab === "animations"}
            onClick={() => setActiveTab("animations")}
          >
            {t("studio.inspector.tabMotion")}
          </Tab>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === "design" && (
          <>
            <PanelTitle
              title={t("studio.inspector.selectOnSite")}
              subtitle={t("studio.inspector.selectOnSiteHint")}
            />

            <DesignSection title={t("studio.inspector.quickActions")} icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={onSetBackgroundImage}>{t("studio.inspector.bgImage")}</ActionButton>
                <ActionButton onClick={onDuplicate}>{t("studio.duplicate")}</ActionButton>
                <ActionButton onClick={onBringForward}>{t("studio.forward")}</ActionButton>
                <ActionButton onClick={onSendBackward}>{t("studio.backward")}</ActionButton>
                <ActionButton onClick={resetSelectedStyle}>{t("studio.inspector.resetDesign")}</ActionButton>
                <ActionButton danger onClick={onDelete}>
                  {t("studio.delete")}
                </ActionButton>
              </div>
            </DesignSection>

            <DesignSection title={t("studio.inspector.colors")} icon="🎨">
              <ColorControl
                label={t("studio.inspector.textColor")}
                value={textColor}
                onChange={updateTextColor}
              />

              <ColorControl
                label={t("studio.inspector.bgColor")}
                value={backgroundColor}
                onChange={updateBackgroundColor}
              />

              <ColorControl
                label={t("studio.inspector.accentBorder")}
                value={accentColor}
                onChange={updateAccentColor}
              />

<PresetLabel>{t("studio.inspector.quickTextColors")}</PresetLabel>

              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map((color) => (
                  <ColorSwatch
                    key={`text-${color}`}
                    color={color}
                    onClick={() => updateTextColor(color)}
                    title={t("studio.inspector.textSwatch", { color })}
                  />
                ))}
              </div>

<PresetLabel>{t("studio.inspector.quickBgColors")}</PresetLabel>

              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map((color) => (
                  <ColorSwatch
                    key={`background-${color}`}
                    color={color}
                    onClick={() => updateBackgroundColor(color)}
                    title={t("studio.inspector.bgSwatch", { color })}
                  />
                ))}
              </div>
            </DesignSection>

            <DesignSection title={t("studio.inspector.bgAndSection")} icon="▧">
              <div className="space-y-2">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.labelKey}
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
                      {t(preset.labelKey)}
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
                className="mt-3 w-full rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
              >
                {t("studio.inspector.uploadSectionBg")}
              </button>
            </DesignSection>

            <DesignSection title={t("studio.inspector.typography")} icon="T">
              <div className="mb-4 grid grid-cols-2 gap-2">
                {quickSizes.map((item) => (
                  <ActionButton
                    key={item.labelKey}
                    onClick={() => applyStyle(item.style)}
                  >
                    {t(item.labelKey)}
                  </ActionButton>
                ))}
              </div>

              <RangeControl
                label={t("studio.inspector.fontSize")}
                value={fontSize}
                min={10}
                max={96}
                suffix="px"
                onChange={updateFontSize}
              />

              <RangeControl
                label={t("studio.inspector.fontWeight")}
                value={fontWeight}
                min={300}
                max={950}
                step={50}
                onChange={updateFontWeight}
              />

              <RangeControl
                label={t("studio.inspector.lineHeight")}
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

            <DesignSection title={t("studio.inspector.structure")} icon="□">
              <RadiusControl value={radius} onChange={updateRadius} />

              <RangeControl
                label={t("studio.inspector.padding")}
                value={padding}
                min={0}
                max={130}
                suffix="px"
                onChange={updatePadding}
              />

              <RangeControl
                label={t("studio.inspector.marginTop")}
                value={marginTop}
                min={-80}
                max={160}
                suffix="px"
                onChange={updateMarginTop}
              />

              <RangeControl
                label={t("studio.inspector.opacity")}
                value={opacity}
                min={10}
                max={100}
                suffix="%"
                onChange={updateOpacity}
              />
            </DesignSection>

            <DesignSection title={t("studio.inspector.shadowBorder")} icon="◈">
              <div className="grid grid-cols-2 gap-2">
                {shadowPresets.map((shadow) => (
                  <ActionButton
                    key={shadow.labelKey}
                    onClick={() => applyStyle({ "box-shadow": shadow.value })}
                  >
                    {t(shadow.labelKey)}
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
                  {t("studio.inspector.softBorder")}
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    applyStyle({
                      border: `2px solid ${accentColor}`,
                    })
                  }
                >
                  {t("studio.inspector.coloredBorder")}
                </ActionButton>
              </div>
            </DesignSection>

            <DesignSection title={t("studio.inspector.alignSize")} icon="↔">
              <div className="grid grid-cols-3 gap-2">
                <ActionButton onClick={() => applyStyle({ "text-align": "right" })}>
                  {t("studio.inspector.right")}
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "text-align": "center" })}>
                  {t("studio.inspector.center")}
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "text-align": "left" })}>
                  {t("studio.inspector.left")}
                </ActionButton>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <ActionButton onClick={() => applyStyle({ width: "100%" })}>
                  {t("studio.inspector.fullWidth")}
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ "max-width": "1180px" })}>
                  {t("studio.inspector.siteWidth")}
                </ActionButton>
                <ActionButton onClick={() => applyStyle({ display: "block" })}>
                  {t("studio.inspector.block")}
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
                  {t("studio.inspector.flexCenter")}
                </ActionButton>
              </div>
            </DesignSection>

            <button
              type="button"
              onClick={() => setShowAdvanced((value) => !value)}
              className="mb-4 flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
<span>{t("studio.inspector.grapesAdvanced")}</span>
              <span>{showAdvanced ? "−" : "+"}</span>
            </button>

            {showAdvanced && (
              <DesignSection title={t("studio.inspector.nativePanel")} icon="⚙">
                <p className="mb-3 text-xs font-bold leading-5 text-slate-400">
{t("studio.inspector.nativePanelHint")}
                </p>
                <div ref={stylesRef} />
              </DesignSection>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <PanelTitle
              title={t("studio.inspector.settingsTitle")}
              subtitle={t("studio.inspector.settingsHint")}
            />

            <LinkEditorPanel
              selectedComponent={selectedComponent}
              pages={pages}
              onApplyLink={onApplyLink}
            />

            <DesignSection title={t("studio.inspector.quickActions")} icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={onDuplicate}>{t("studio.duplicate")}</ActionButton>
                <ActionButton danger onClick={onDelete}>
                  {t("studio.delete")}
                </ActionButton>
                <ActionButton onClick={onBringForward}>{t("studio.forward")}</ActionButton>
                <ActionButton onClick={onSendBackward}>{t("studio.backward")}</ActionButton>
              </div>
            </DesignSection>

            <DesignSection title={t("studio.inspector.nativeSettings")} icon="⚙">
              <div ref={traitsRef} />
            </DesignSection>
          </>
        )}

        {activeTab === "animations" && (
          <>
            <PanelTitle
              title={t("studio.inspector.motionTitle")}
              subtitle={t("studio.inspector.motionHint")}
            />

            <div className="space-y-3">
              {animationPresets.map((animation) => (
                <AnimationButton
                  key={animation.labelKey}
                  label={t(animation.labelKey)}
                  value={animation.value}
                  description={t(animation.descriptionKey)}
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

            <DesignSection title={t("studio.inspector.quickEffects")} icon="✦">
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
                  {t("studio.reset")}
                </ActionButton>
              </div>
            </DesignSection>
          </>
        )}
      </div>
    </aside>
  );
}

function LinkEditorPanel({
  selectedComponent,
  pages,
  onApplyLink,
}: {
  selectedComponent?: any;
  pages: StudioSitePage[];
  onApplyLink?: (link: StudioEditableLink) => void;
}) {
  const attrs = selectedComponent?.getAttributes?.() || {};
  const isLinkLike = isEditableLinkComponent(selectedComponent);

  const [link, setLink] = useState<StudioEditableLink>(() =>
    readEditableLinkFromAttributes(attrs)
  );

  useEffect(() => {
    const nextAttrs = selectedComponent?.getAttributes?.() || {};
    setLink(readEditableLinkFromAttributes(nextAttrs));
  }, [selectedComponent]);

  const updateLink = (next: StudioEditableLink) => {
    setLink(next);
    onApplyLink?.(next);
  };

  if (!selectedComponent) {
    return (
      <DesignSection title={t("studio.inspector.buttonLink")} icon="↗">
        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="text-xs font-bold leading-5 text-slate-500">
{t("studio.inspector.chooseButtonHint")}
          </p>
        </div>
      </DesignSection>
    );
  }

  return (
    <DesignSection title={t("studio.inspector.buttonLink")} icon="↗">
      {!isLinkLike ? (
        <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-700">
          {t("studio.inspector.notButtonHint")}
          data-editable-link.
        </div>
      ) : null}

      <label className="grid gap-2">
<span className="text-xs font-black text-slate-500">{t("studio.inspector.linkType")}</span>

        <select
          value={link.type || "none"}
          onChange={(event) =>
            updateLink({
              type: event.target.value as StudioEditableLink["type"],
            })
          }
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
        >
          <option value="none">{t("studio.inspector.noLink")}</option>
          <option value="page">{t("studio.inspector.pageOnSite")}</option>
          <option value="section">{t("studio.inspector.sectionOnPage")}</option>
          <option value="product">{t("studio.inspector.product")}</option>
          <option value="category">{t("studio.inspector.category")}</option>
          <option value="whatsapp">{t("studio.inspector.whatsapp")}</option>
          <option value="phone">{t("studio.inspector.phone")}</option>
          <option value="email">{t("studio.inspector.email")}</option>
          <option value="external">{t("studio.inspector.external")}</option>
        </select>
      </label>

      {link.type === "page" ? (
        <label className="mt-4 grid gap-2">
          <span className="text-xs font-black text-slate-500">
{t("studio.inspector.choosePageByName")}
          </span>

          <select
            value={link.pageId || ""}
            onChange={(event) =>
              updateLink({
                type: "page",
                pageId: event.target.value,
              })
            }
            className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
          >
            <option value="">{t("studio.inspector.choosePagePlaceholder")}</option>

            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title}
{page.isHome ? t("studio.inspector.homeSuffix") : page.slug ? ` — /${page.slug}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {link.type === "section" ? (
        <label className="mt-4 grid gap-2">
          <span className="text-xs font-black text-slate-500">
{t("studio.inspector.sectionId")}
          </span>

          <input
            value={link.sectionId || ""}
            onChange={(event) =>
              updateLink({
                type: "section",
                sectionId: event.target.value,
              })
            }
            placeholder="about / store / contact"
            className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
          />
        </label>
      ) : null}

      {["whatsapp", "phone", "email", "external"].includes(link.type) ? (
        <label className="mt-4 grid gap-2">
          <span className="text-xs font-black text-slate-500">
{t("studio.inspector.linkValue")}
          </span>

          <input
            value={link.value || ""}
            onChange={(event) =>
              updateLink({
                type: link.type,
                value: event.target.value,
              })
            }
            placeholder={
              link.type === "whatsapp"
                ? "972501234567"
                : link.type === "phone"
                  ? "0501234567"
                  : link.type === "email"
                    ? "name@email.com"
                    : "https://example.com"
            }
            dir="ltr"
            className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
          />
        </label>
      ) : null}

      {link.type === "product" ? (
        <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-700">
{t("studio.inspector.productComingSoon")}
        </div>
      ) : null}

      {link.type === "category" ? (
        <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-700">
{t("studio.inspector.categoryComingSoon")}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
        <p className="text-[11px] font-bold leading-5 text-slate-400">
          {t("studio.inspector.stablePageId")}
        </p>
      </div>
    </DesignSection>
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
  const { t } = useTranslation();
  const progress = Math.max(0, Math.min(100, (value / 90) * 100));

  return (
    <div className="mb-5 rounded-[1.35rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-slate-700">
{t("studio.inspector.cornerLine")}
          </p>
          <p className="mt-1 text-[11px] font-bold leading-5 text-slate-400">
{t("studio.inspector.cornerLineHint")}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-violet-700 px-3 py-1 text-[11px] font-black text-black">
          {value}px
        </span>
      </div>

      <div className="mb-4 grid grid-cols-[54px_1fr_54px] items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-none border-2 border-slate-300 bg-white text-[10px] font-black text-slate-500">
{t("studio.inspector.square")}
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
{t("studio.inspector.round")}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-[11px] font-black text-slate-400">
        <span>0px</span>
        <span className="text-violet-700">{radiusLabel(value, t)}</span>
        <span>90px</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {radiusPresets.map((preset) => (
          <button
            key={preset.labelKey}
            type="button"
            onClick={() => onChange(preset.value)}
            className={[
              "flex min-h-[42px] items-center justify-center border px-2 py-2 text-center text-[11px] font-black leading-tight transition",
              value === preset.value
                ? "border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg shadow-violet-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700",
            ].join(" ")}
            style={{ borderRadius: `${Math.min(preset.value, 28)}px` }}
            title={`${t(preset.labelKey)} ${preset.value}px`}
          >
            {t(preset.labelKey)}
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
