import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

import { defaultCanvasCss, defaultWebsiteHtml } from "./canvasTheme";
import { studioElements } from "../data/elementLibrary";
import {
  getSectionLayoutVariants,
  type SectionKind,
  type SectionLayoutVariant,
} from "../data/sectionLayoutVariants";

type InitEditorArgs = {
  container: HTMLElement;
  stylesContainer?: HTMLElement | null;
  traitsContainer?: HTMLElement | null;
  layersContainer?: HTMLElement | null;
  onReady?: (editor: Editor) => void;
  onSelect?: () => void;
};

const TAILWIND_CDN_URL = "https://cdn.tailwindcss.com";
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800;900&family=Heebo:wght@300;400;600;700;800;900&family=Rubik:wght@400;600;700;800;900&family=Alef:wght@400;700&family=Varela+Round&family=Noto+Sans+Hebrew:wght@400;600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&family=DM+Sans:wght@400;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&family=Lora:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap";

const defaultAssets = [
  {
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
    name: "Beauty hero",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
    name: "Beauty gallery",
  },
  {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
    name: "Spa / Salon",
  },
  {
    src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
    name: "Clinic",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
    name: "Business office",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
    name: "Store",
  },
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
    name: "Product",
  },
];


function installBizuplyEditorUiFixes() {
  const styleId = "bizuply-grapes-ui-toolbar-fix";

  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;

  style.innerHTML = `
    .gjs-toolbar {
      direction: rtl !important;
      display: flex !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      width: auto !important;
      min-width: max-content !important;
      max-width: calc(100vw - 24px) !important;
      height: auto !important;
      min-height: 46px !important;
      padding: 7px 9px !important;
      border-radius: 999px !important;
      overflow: visible !important;
      white-space: nowrap !important;
      background: rgba(15,23,42,.96) !important;
      box-shadow: 0 22px 70px rgba(15,23,42,.30) !important;
      z-index: 999999 !important;
    }

    .gjs-toolbar .gjs-toolbar-item {
      position: relative !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      width: auto !important;
      min-width: 36px !important;
      height: 34px !important;
      max-height: 34px !important;
      margin: 0 !important;
      padding: 0 10px !important;
      border-radius: 999px !important;
      color: #ffffff !important;
      background: transparent !important;
      font-family: Assistant, Heebo, Arial, sans-serif !important;
      font-size: 12px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
      letter-spacing: 0 !important;
      opacity: 1 !important;
      overflow: visible !important;
      white-space: nowrap !important;
      transform: none !important;
      text-align: center !important;
    }

    .gjs-toolbar .gjs-toolbar-item:hover {
      background: rgba(255,255,255,.14) !important;
    }

    .gjs-toolbar .gjs-toolbar-item:first-child {
      background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
      box-shadow: 0 12px 28px rgba(124,58,237,.25) !important;
    }

    .gjs-toolbar .gjs-toolbar-item svg,
    .gjs-toolbar .gjs-toolbar-item i {
      width: 15px !important;
      height: 15px !important;
      flex: 0 0 auto !important;
      pointer-events: none !important;
    }

    .gjs-toolbar .gjs-toolbar-item[title]::after {
      content: attr(title);
      position: absolute;
      right: 50%;
      bottom: calc(100% + 9px);
      transform: translateX(50%);
      display: none;
      padding: 7px 10px;
      border-radius: 12px;
      background: #020617;
      color: #ffffff;
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
      box-shadow: 0 14px 34px rgba(15,23,42,.24);
      pointer-events: none;
    }

    .gjs-toolbar .gjs-toolbar-item[title]:hover::after {
      display: block;
    }

    .gjs-badge {
      max-width: max-content !important;
      border-radius: 999px !important;
      padding: 7px 12px !important;
      background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
      color: #ffffff !important;
      font-family: Assistant, Heebo, Arial, sans-serif !important;
      font-size: 12px !important;
      font-weight: 900 !important;
      white-space: nowrap !important;
      box-shadow: 0 14px 40px rgba(124,58,237,.26) !important;
    }

    @media (max-width: 768px) {
      .gjs-toolbar {
        flex-wrap: wrap !important;
        max-width: calc(100vw - 18px) !important;
        min-width: 0 !important;
        padding: 6px !important;
        border-radius: 22px !important;
      }

      .gjs-toolbar .gjs-toolbar-item {
        min-width: 34px !important;
        height: 32px !important;
        max-height: 32px !important;
        padding: 0 8px !important;
        font-size: 11px !important;
      }
    }
  `;

  document.head.appendChild(style);
}

const sectionKindOptions: { kind: SectionKind; label: string; icon: string }[] =
  [
    { kind: "header", label: "הידר", icon: "▤" },
    { kind: "hero", label: "דף הבית", icon: "★" },
    { kind: "welcome", label: "Welcome", icon: "✦" },
    { kind: "about", label: "אודות", icon: "ℹ" },
    { kind: "team", label: "צוות", icon: "◉" },
    { kind: "services", label: "שירותים", icon: "✦" },
    { kind: "gallery", label: "גלריה", icon: "▧" },
    { kind: "contact", label: "צור קשר", icon: "@" },
    { kind: "promotion", label: "מבצע", icon: "%" },
    { kind: "subscribe", label: "הרשמה", icon: "+" },
    { kind: "testimonials", label: "המלצות", icon: "❝" },
    { kind: "reviews", label: "ביקורות", icon: "★" },
    { kind: "clients", label: "לקוחות", icon: "◫" },
    { kind: "store", label: "חנות", icon: "₪" },
    { kind: "booking", label: "תיאום תורים", icon: "☷" },
    { kind: "bookings", label: "תיאום תורים", icon: "☷" },
    { kind: "events", label: "אירועים", icon: "◇" },
    { kind: "club", label: "מועדון", icon: "♛" },
    { kind: "bot", label: "בוט חכם", icon: "AI" },
    { kind: "social", label: "רשתות", icon: "#" },
    { kind: "course", label: "קורס", icon: "▶" },
    { kind: "miniSaas", label: "Mini SaaS", icon: "S" },
    { kind: "basic", label: "בסיסי", icon: "+" },
    { kind: "text", label: "טקסט", icon: "T" },
    { kind: "list", label: "רשימה", icon: "☰" },
    { kind: "form", label: "טופס", icon: "▣" },
    { kind: "savedSections", label: "סקשנים שמורים", icon: "♡" },
  ];

export function initBizuplyEditor({
  container,
  stylesContainer,
  traitsContainer,
  layersContainer,
  onReady,
  onSelect,
}: InitEditorArgs) {
  const editor = grapesjs.init({
    container,
    height: "100%",
    width: "100%",
    fromElement: false,
    storageManager: false,

    panels: {
      defaults: [],
    },

    selectorManager: {
      componentFirst: true,
    },

    blockManager: {
      blocks: [],
    },

    layerManager: {
      appendTo: layersContainer || undefined,
    },

    traitManager: {
      appendTo: traitsContainer || undefined,
    },

    styleManager: {
      appendTo: stylesContainer || undefined,
      sectors: [
        {
          name: "צבעים ורקע",
          open: false,
          properties: [
            "color",
            "background-color",
            "background",
            "background-image",
            "background-size",
            "background-position",
            "background-repeat",
            "opacity",
          ],
        },
        {
          name: "טיפוגרפיה",
          open: false,
          properties: [
            "font-family",
            "font-size",
            "font-weight",
            "letter-spacing",
            "line-height",
            "text-align",
            "text-decoration",
          ],
        },
        {
          name: "גודל ומיקום",
          open: false,
          properties: [
            "display",
            "position",
            "top",
            "right",
            "bottom",
            "left",
            "width",
            "height",
            "min-width",
            "min-height",
            "max-width",
            "max-height",
            "z-index",
          ],
        },
        {
          name: "Flex / Grid",
          open: false,
          properties: [
            "flex-direction",
            "align-items",
            "justify-content",
            "gap",
            "grid-template-columns",
          ],
        },
        {
          name: "מרווחים",
          open: false,
          properties: ["margin", "padding"],
        },
        {
          name: "פינות, גבול וצל",
          open: false,
          properties: [
            "border-radius",
            "border",
            "border-color",
            "box-shadow",
          ],
        },
        {
          name: "אפקטים ותנועה",
          open: false,
          properties: [
            "transform",
            "transition",
            "filter",
            "backdrop-filter",
            "animation",
          ],
        },
      ],
    },

    assetManager: {
      upload: false,
      autoAdd: true,
      assets: defaultAssets,
    },

    deviceManager: {
      devices: [
        { name: "Desktop", width: "" },
        { name: "Tablet", width: "768px", widthMedia: "992px" },
        { name: "Mobile", width: "390px", widthMedia: "480px" },
      ],
    },

    canvas: {
      styles: [GOOGLE_FONTS_URL],
      scripts: [TAILWIND_CDN_URL],
    },

    i18n: {
      locale: "he",
      localeFallback: "he",
      messages: {
        he: {
          styleManager: {
            empty: "בחרי אלמנט כדי לערוך עיצוב",
          },
          traitManager: {
            empty: "בחרי אלמנט כדי לערוך הגדרות",
          },
          assetManager: {
            addButton: "הוספת תמונה",
            inputPlh: "מקור מדיה",
            modalTitle: "ניהול מדיה",
            uploadTitle: "גררי תמונות או סרטונים לכאן",
          },
        },
      },
    },
  });

  installBizuplyEditorUiFixes();

  setupDesignPanelVisibility(editor, stylesContainer);
  registerCommands(editor, stylesContainer);
  registerKeyboardShortcuts(editor);
  registerCustomComponentTypes(editor);

  editor.on("canvas:frame:load", () => {
    injectCanvasRuntimeAssets(editor);
  });

  editor.on("load", () => {
    injectCanvasRuntimeAssets(editor);
    editor.setComponents(defaultWebsiteHtml);
    editor.setStyle(defaultCanvasCss);

    studioElements.forEach((element) => {
      editor.BlockManager.add(element.id, {
        label: element.label,
        media: element.icon,
        category: element.category,
        content: element.html,
      });
    });

    editor.Css.addRules(`
      .gjs-selected {
        outline: 4px solid #7C3AED !important;
        outline-offset: 8px !important;
        box-shadow: 0 0 0 9999px rgba(15,23,42,0.015) !important;
      }

      .gjs-hovered {
        outline: 2px dashed rgba(124,58,237,0.55) !important;
        outline-offset: 6px !important;
      }

      .gjs-badge {
        background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
        color: #fff !important;
        border-radius: 999px !important;
        padding: 7px 12px !important;
        font-weight: 900 !important;
        font-size: 12px !important;
        box-shadow: 0 14px 40px rgba(124,58,237,.28) !important;
      }

      .gjs-toolbar {
        direction: rtl !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        width: auto !important;
        min-width: max-content !important;
        max-width: calc(100vw - 24px) !important;
        height: auto !important;
        min-height: 46px !important;
        border-radius: 999px !important;
        overflow: visible !important;
        white-space: nowrap !important;
        background: rgba(15,23,42,.96) !important;
        box-shadow: 0 22px 70px rgba(15,23,42,.30) !important;
        padding: 7px 9px !important;
        z-index: 999999 !important;
      }

      .gjs-toolbar-item {
        position: relative !important;
        min-height: 34px !important;
        max-height: 34px !important;
        min-width: 36px !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 10px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
        color: #fff !important;
        font-weight: 900 !important;
        font-size: 12px !important;
        line-height: 1 !important;
        border-radius: 999px !important;
        background: transparent !important;
        opacity: 1 !important;
      }

      .gjs-toolbar-item:hover {
        background: rgba(255,255,255,.14) !important;
      }

      .gjs-toolbar-item:first-child {
        background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
        box-shadow: 0 12px 28px rgba(124,58,237,.25) !important;
      }

      .gjs-toolbar-item svg,
      .gjs-toolbar-item i {
        width: 15px !important;
        height: 15px !important;
        pointer-events: none !important;
      }

      .gjs-resizer-h {
        border-color: #7C3AED !important;
        background: #FFFFFF !important;
        box-shadow: 0 6px 16px rgba(124,58,237,.25) !important;
      }

      .gjs-mdl-dialog {
        width: min(1380px, 94vw) !important;
        max-width: 1380px !important;
        border-radius: 34px !important;
        overflow: hidden !important;
        box-shadow: 0 38px 160px rgba(15,23,42,.34) !important;
      }

      .gjs-mdl-header {
        display: none !important;
      }

      .gjs-mdl-content {
        padding: 0 !important;
      }
    `);

    makeAllComponentsEditable(editor);
    editor.select(null);
    onReady?.(editor);
  });

  editor.on("component:selected", (component) => {
    if (!component) return;

    ensureComponentEditable(component);
    onSelect?.();
  });

  editor.on("component:add", (component) => {
    ensureComponentEditable(component);
  });

  editor.on("component:mount", (component) => {
    ensureComponentEditable(component);
  });

  editor.on("component:update:attributes", (component) => {
    if (isHeaderComponent(component)) {
      applyHeaderVisualSettings(component);
    }
  });

  return editor;
}


/* =====================================================
   CANVAS RUNTIME ASSETS
   GrapesJS renders the website inside an iframe.
   Tailwind from the React app does NOT automatically exist there,
   so we explicitly inject Tailwind CDN + fonts into the iframe.
===================================================== */

function injectCanvasRuntimeAssets(editor: Editor) {
  const doc = editor.Canvas.getDocument();

  if (!doc?.head) return;

  const head = doc.head;

  if (!head.querySelector('link[data-bizuply-fonts="true"]')) {
    const fonts = doc.createElement("link");
    fonts.setAttribute("data-bizuply-fonts", "true");
    fonts.rel = "stylesheet";
    fonts.href = GOOGLE_FONTS_URL;
    head.appendChild(fonts);
  }

  if (!head.querySelector('script[data-bizuply-tailwind="true"]')) {
    const config = doc.createElement("script");
    config.setAttribute("data-bizuply-tailwind-config", "true");
    config.textContent = `
      window.tailwind = window.tailwind || {};
      window.tailwind.config = {
        corePlugins: { preflight: false },
        theme: {
          extend: {
            fontFamily: {
              assistant: ['Assistant', 'Arial', 'sans-serif'],
              heebo: ['Heebo', 'Arial', 'sans-serif'],
              rubik: ['Rubik', 'Arial', 'sans-serif'],
            }
          }
        }
      };
    `;
    head.appendChild(config);

    const script = doc.createElement("script");
    script.setAttribute("data-bizuply-tailwind", "true");
    script.src = TAILWIND_CDN_URL;
    head.appendChild(script);
  }

  if (!head.querySelector('style[data-bizuply-canvas-fixes="true"]')) {
    const style = doc.createElement("style");
    style.setAttribute("data-bizuply-canvas-fixes", "true");
    style.textContent = `
      html, body {
        margin: 0;
        direction: rtl;
        min-height: 100%;
        font-family: Assistant, Heebo, Arial, sans-serif;
        background: var(--biz-bg, #FFF7FD);
        color: var(--biz-text, #171321);
      }

      body {
        overflow-x: hidden;
      }

      img {
        max-width: 100%;
      }

      [data-section-kind],
      header,
      section {
        box-sizing: border-box;
      }

      header[data-header-editable="true"] {
        background: var(--header-bg, rgba(255,255,255,0.94)) !important;
        color: var(--header-text, #0f172a) !important;
        border-color: var(--header-border, rgba(226,232,240,0.85)) !important;
      }

      header[data-header-editable="true"] [data-header-business-name="true"],
      header[data-header-editable="true"] [data-header-link],
      header[data-header-editable="true"] [data-header-phone="true"] {
        color: var(--header-text, #0f172a);
      }

      header[data-header-editable="true"] [data-header-business-tagline="true"] {
        color: var(--header-muted, #64748b);
      }

      header[data-header-editable="true"] [data-header-cta="true"] {
        background: var(--header-button-bg, var(--biz-primary, #7C3AED)) !important;
        color: var(--header-button-text, #ffffff) !important;
      }

      .gjs-selected {
        outline: 4px solid #7C3AED !important;
        outline-offset: 8px !important;
      }

      .gjs-hovered {
        outline: 2px dashed rgba(124,58,237,0.55) !important;
        outline-offset: 6px !important;
      }
    `;
    head.appendChild(style);
  }
}



/* =====================================================
   HEADER EDITING HELPERS
===================================================== */

function isHeaderComponent(component: any) {
  if (!component || typeof component.get !== "function") return false;

  const tagName = String(component.get("tagName") || "").toLowerCase();
  const attrs = component.getAttributes?.() || {};

  return tagName === "header" || attrs["data-header-editable"] === "true";
}

function findSelectedHeader(editor: Editor) {
  let current: any = editor.getSelected();

  while (current) {
    if (isHeaderComponent(current)) return current;
    current = getParentComponent(current);
  }

  return null;
}

function getHeaderAttrs(component: any) {
  return component?.getAttributes?.() || {};
}

function applyHeaderVisualSettings(component: any) {
  if (!isHeaderComponent(component)) return;

  const attrs = getHeaderAttrs(component);

  const bg = attrs["data-header-bg"] || "rgba(255,255,255,0.94)";
  const text = attrs["data-header-text"] || "#0f172a";
  const muted = attrs["data-header-muted"] || "#64748b";
  const border = attrs["data-header-border"] || "rgba(226,232,240,0.85)";
  const buttonBg = attrs["data-header-button-bg"] || "var(--biz-primary,#7C3AED)";
  const buttonText = attrs["data-header-button-text"] || "#ffffff";
  const radius = attrs["data-header-radius"] || "";
  const width = attrs["data-header-width"] || "";
  const shadow = attrs["data-header-shadow"] || "";
  const padding = attrs["data-header-padding"] || "";

  const nextStyle: Record<string, string> = {
    "--header-bg": bg,
    "--header-text": text,
    "--header-muted": muted,
    "--header-border": border,
    "--header-button-bg": buttonBg,
    "--header-button-text": buttonText,
    background: "var(--header-bg)",
    color: "var(--header-text)",
    "border-color": "var(--header-border)",
  };

  if (radius) nextStyle["border-radius"] = radius;
  if (width) {
    nextStyle.width = width;
    nextStyle["max-width"] = width;
  }
  if (shadow) nextStyle["box-shadow"] = shadow;
  if (padding) nextStyle.padding = padding;

  component.addStyle?.(nextStyle);
}

function setHeaderTraits(component: any) {
  if (!isHeaderComponent(component)) return;

  component.set({
    name: "הידר",
    traits: [
      {
        type: "select",
        name: "dir",
        label: "כיוון הידר",
        options: [
          { id: "rtl", label: "ימין לשמאל" },
          { id: "ltr", label: "שמאל לימין" },
        ],
      },
      {
        type: "text",
        name: "data-header-bg",
        label: "צבע רקע Header",
        placeholder: "#FFFFFF / rgba(...)",
      },
      {
        type: "text",
        name: "data-header-text",
        label: "צבע טקסט",
        placeholder: "#0F172A",
      },
      {
        type: "text",
        name: "data-header-muted",
        label: "צבע טקסט משני",
        placeholder: "#64748B",
      },
      {
        type: "text",
        name: "data-header-border",
        label: "צבע גבול",
        placeholder: "#E2E8F0",
      },
      {
        type: "text",
        name: "data-header-button-bg",
        label: "צבע כפתור",
        placeholder: "#7C3AED",
      },
      {
        type: "text",
        name: "data-header-button-text",
        label: "צבע טקסט כפתור",
        placeholder: "#FFFFFF",
      },
      {
        type: "select",
        name: "data-header-radius",
        label: "צורת Header",
        options: [
          { id: "", label: "לפי התבנית" },
          { id: "0px", label: "מרובע חד" },
          { id: "12px", label: "מלבני עדין" },
          { id: "24px", label: "מעוגל עדין" },
          { id: "999px", label: "קפסולה" },
        ],
      },
      {
        type: "select",
        name: "data-header-width",
        label: "רוחב Header",
        options: [
          { id: "", label: "לפי התבנית" },
          { id: "100%", label: "רוחב מלא" },
          { id: "min(1280px, calc(100% - 32px))", label: "צף רחב" },
          { id: "min(1120px, calc(100% - 32px))", label: "צף צר" },
        ],
      },
      {
        type: "select",
        name: "data-header-shadow",
        label: "צל Header",
        options: [
          { id: "", label: "לפי התבנית" },
          { id: "none", label: "בלי צל" },
          { id: "0 10px 40px rgba(15,23,42,.08)", label: "צל עדין" },
          { id: "0 24px 90px rgba(15,23,42,.16)", label: "צל פרימיום" },
        ],
      },
      {
        type: "select",
        name: "data-header-padding",
        label: "גובה Header",
        options: [
          { id: "", label: "לפי התבנית" },
          { id: "12px 20px", label: "נמוך" },
          { id: "16px 24px", label: "רגיל" },
          { id: "22px 32px", label: "גבוה" },
        ],
      },
    ],
  });

  const attrs = getHeaderAttrs(component);

  component.addAttributes?.({
    "data-header-editable": "true",
    "data-header-bg": attrs["data-header-bg"] || "rgba(255,255,255,0.94)",
    "data-header-text": attrs["data-header-text"] || "#0f172a",
    "data-header-muted": attrs["data-header-muted"] || "#64748b",
    "data-header-border": attrs["data-header-border"] || "rgba(226,232,240,0.85)",
    "data-header-button-bg": attrs["data-header-button-bg"] || "var(--biz-primary,#7C3AED)",
    "data-header-button-text": attrs["data-header-button-text"] || "#ffffff",
    "data-header-radius": attrs["data-header-radius"] || "",
    "data-header-width": attrs["data-header-width"] || "",
    "data-header-shadow": attrs["data-header-shadow"] || "",
    "data-header-padding": attrs["data-header-padding"] || "",
  });

  applyHeaderVisualSettings(component);
}

function setHeaderChildTraits(component: any) {
  const attrs = component?.getAttributes?.() || {};
  const tagName = String(component?.get?.("tagName") || "").toLowerCase();

  if (attrs["data-header-logo-slot"] === "true") {
    component.set({
      name: "לוגו",
      traits: [
        {
          type: "text",
          name: "data-header-logo-slot",
          label: "אזור לוגו",
        },
      ],
    });
  }

  if (attrs["data-header-link"]) {
    component.set({
      name: "קישור עמוד",
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור",
          placeholder: "#about",
        },
        {
          type: "text",
          name: "data-header-link",
          label: "מזהה עמוד",
        },
      ],
    });
  }

  if (attrs["data-header-login"] === "true" || attrs["data-header-logout"] === "true") {
    component.set({
      name: attrs["data-header-login"] === "true" ? "כפתור התחברות" : "כפתור התנתקות",
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור",
          placeholder: "/login",
        },
      ],
    });
  }

  if (attrs["data-header-cta"] === "true") {
    component.set({
      name: "כפתור פעולה",
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור",
          placeholder: "#contact",
        },
      ],
    });
  }

  if (tagName === "header") {
    setHeaderTraits(component);
  }
}

function findHeaderLogoSlot(header: any) {
  if (!header?.find) return null;

  const selectors = [
    '[data-header-logo-slot="true"]',
    "[data-header-logo-slot]",
    '[data-header-logo-image="true"]',
    "[data-header-logo-image]",
    "[data-logo-slot]",
    "[data-logo]",
    '[data-editable-logo="true"]',
    "[data-editable-logo]",
  ];

  for (const selector of selectors) {
    const found = header.find?.(selector) || [];
    if (!found[0]) continue;

    const attrs = found[0].getAttributes?.() || {};
    const tagName = String(found[0].get?.("tagName") || "").toLowerCase();

    if (tagName === "img" || attrs["data-header-logo-image"] === "true") {
      return getParentComponent(found[0]) || found[0];
    }

    return found[0];
  }

  return null;
}

function createHeaderLogoSlot(header: any) {
  const logoHtml = `
    <div
      class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white shadow-lg"
      data-header-logo-slot="true"
      data-editable-card="true"
      data-media-replaceable="true"
    >
      B
    </div>
  `;

  const businessName =
    header.find?.('[data-header-business-name="true"]')?.[0] ||
    header.find?.("[data-header-business-name]")?.[0];

  const textWrap = businessName ? getParentComponent(businessName) : null;
  const brandWrap = textWrap ? getParentComponent(textWrap) : null;

  if (brandWrap?.append) {
    brandWrap.append(logoHtml, { at: 0 });
    return brandWrap.find?.('[data-header-logo-slot="true"]')?.[0] || null;
  }

  const firstHeaderChild = header.components?.()?.at?.(0);

  if (firstHeaderChild?.append) {
    firstHeaderChild.append(logoHtml, { at: 0 });
    return firstHeaderChild.find?.('[data-header-logo-slot="true"]')?.[0] || null;
  }

  if (header?.append) {
    header.append(logoHtml, { at: 0 });
    return header.find?.('[data-header-logo-slot="true"]')?.[0] || null;
  }

  return null;
}

function setLogoImageToSlot(logoSlot: any, src: string) {
  if (!logoSlot) return;

  logoSlot.addAttributes?.({
    "data-header-logo-slot": "true",
    "data-editable-card": "true",
    "data-media-replaceable": "true",
  });

  logoSlot.addStyle?.({
    overflow: "hidden",
  });

  logoSlot.components(`
    <img
      src="${src}"
      alt="Logo"
      class="h-full w-full rounded-[inherit] object-cover"
      data-header-logo-image="true"
      data-editable-image="true"
    />
  `);
}

function uploadHeaderLogo(editor: Editor) {
  const header = findSelectedHeader(editor);

  if (!header) {
    alert("בחרי את ההידר ואז לחצי לוגו");
    return;
  }

  pickImageFromComputer(editor, (src) => {
    let logoSlot = findHeaderLogoSlot(header);

    if (!logoSlot) {
      logoSlot = createHeaderLogoSlot(header);
    }

    if (!logoSlot) {
      alert("לא הצלחתי ליצור אזור לוגו בהידר הזה");
      return;
    }

    setLogoImageToSlot(logoSlot, src);

    makeAllComponentsEditable(editor);
    ensureComponentEditable(logoSlot);
    setHeaderChildTraits(logoSlot);

    editor.select(logoSlot);
  });
}

function toggleHeaderDirection(editor: Editor) {
  const header = findSelectedHeader(editor);

  if (!header) {
    alert("בחרי Header כדי לשנות כיוון");
    return;
  }

  const attrs = header.getAttributes?.() || {};
  const current = attrs.dir || "rtl";
  const next = current === "rtl" ? "ltr" : "rtl";

  header.addAttributes?.({ dir: next });
  editor.select(header);
}

function quickHeaderColors(editor: Editor) {
  const header = findSelectedHeader(editor);

  if (!header) {
    alert("בחרי Header כדי לשנות צבעים");
    return;
  }

  setHeaderTraits(header);
  applyHeaderVisualSettings(header);
  editor.select(header);

  const externalOpen = (editor as any).__bizuplyOpenDesignPanel;

  if (typeof externalOpen === "function") {
    externalOpen();
  }

  editor.trigger("bizuply:design-panel:open", header);

  window.dispatchEvent(new CustomEvent("bizuply:open-design-panel"));

  window.dispatchEvent(
    new CustomEvent("bizuply:design-panel:open", {
      detail: {
        target: "header",
        message: "Header selected for color editing",
      },
    })
  );
}

/* =====================================================
   SAFE COMPONENT EDITING
===================================================== */

function makeAllComponentsEditable(editor: Editor) {
  const wrapper = editor.getWrapper();

  if (!wrapper) return;

  wrapper.find("*").forEach((component) => {
    ensureComponentEditable(component);
  });
}

function ensureComponentEditable(component: any) {
  if (!component || typeof component.set !== "function") return;

  const isSection = isSectionComponent(component);
  const isHeader = isHeaderComponent(component);

  component.set({
    draggable: true,
    droppable: true,
    copyable: true,
    removable: true,
    editable: true,
    stylable: true,
    highlightable: true,
    hoverable: true,
    selectable: true,
    resizable: {
      tl: true,
      tc: true,
      tr: true,
      cl: true,
      cr: true,
      bl: true,
      bc: true,
      br: true,
      keyWidth: "width",
      keyHeight: "height",
    },

    toolbar: isHeader
      ? [
          {
            label: "מבנה",
            attributes: {
              title: "בחירת מבנה Header מקצועי",
            },
            command: "bizuply-change-layout",
          },
          {
            label: "לוגו",
            attributes: {
              title: "העלאת לוגו להידר",
            },
            command: "bizuply-upload-header-logo",
          },
          {
            label: "צבע",
            attributes: {
              title: "פתיחת צבעים באינספקטור",
            },
            command: "bizuply-header-quick-colors",
          },
          {
            label: "כיוון",
            attributes: {
              title: "RTL / LTR",
            },
            command: "bizuply-toggle-header-direction",
          },
          {
            label: "עיצוב",
            attributes: {
              title: "פתיחת עיצוב מלא",
            },
            command: "bizuply-open-design-panel",
          },
          {
            attributes: {
              class: "fa fa-arrows",
              title: "גרירה",
            },
            command: "tlb-move",
          },
          {
            attributes: {
              class: "fa fa-clone",
              title: "שכפול",
            },
            command: "bizuply-duplicate",
          },
          {
            attributes: {
              class: "fa fa-trash",
              title: "מחיקה",
            },
            command: "bizuply-delete",
          },
        ]
      : isSection
      ? [
          {
            label: "מבנה",
            attributes: {
              title: "בחירת מבנה מקצועי לסקשן",
            },
            command: "bizuply-change-layout",
          },
          {
            label: "עיצוב",
            attributes: {
              title: "פתיחת עיצוב, צבעים, גדלים וריווחים",
            },
            command: "bizuply-open-design-panel",
          },
          {
            label: "+מדיה",
            attributes: {
              title: "הוספת תמונה או סרטון מהמחשב לסקשן",
            },
            command: "bizuply-add-media-to-section",
          },
          {
            label: "רקע",
            attributes: {
              title: "הגדרת תמונה מהמחשב כרקע לסקשן",
            },
            command: "bizuply-set-section-bg-image",
          },
          {
            label: "מדיה",
            attributes: {
              title: "החלפת תמונה או סרטון מהמחשב",
            },
            command: "bizuply-replace-image",
          },
          {
            attributes: {
              class: "fa fa-arrows",
              title: "גרירה",
            },
            command: "tlb-move",
          },
          {
            attributes: {
              class: "fa fa-clone",
              title: "שכפול",
            },
            command: "bizuply-duplicate",
          },
          {
            attributes: {
              class: "fa fa-trash",
              title: "מחיקה",
            },
            command: "bizuply-delete",
          },
        ]
      : [
          {
            label: "עיצוב",
            attributes: {
              title: "פתיחת עיצוב לאלמנט הנבחר",
            },
            command: "bizuply-open-design-panel",
          },
          {
            label: "מדיה",
            attributes: {
              title: "החלפת תמונה / וידאו / עריכת מדיה",
            },
            command: "bizuply-replace-image",
          },
          {
            attributes: {
              class: "fa fa-arrows",
              title: "גרירה",
            },
            command: "tlb-move",
          },
          {
            attributes: {
              class: "fa fa-clone",
              title: "שכפול",
            },
            command: "bizuply-duplicate",
          },
          {
            attributes: {
              class: "fa fa-trash",
              title: "מחיקה",
            },
            command: "bizuply-delete",
          },
        ],
  });

  const tagName = String(component.get?.("tagName") || "").toLowerCase();

  if (isHeader) {
    setHeaderTraits(component);
  }

  setHeaderChildTraits(component);

  if (tagName === "a") {
    component.set({
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור",
          placeholder: "https://...",
        },
        {
          type: "select",
          name: "target",
          label: "פתיחה",
          options: [
            { id: "", label: "באותו חלון" },
            { id: "_blank", label: "בטאב חדש" },
          ],
        },
      ],
    });
  }

  if (tagName === "img") {
    component.set({
      traits: [
        {
          type: "text",
          name: "src",
          label: "מקור תמונה",
        },
        {
          type: "text",
          name: "alt",
          label: "טקסט חלופי",
        },
      ],
    });
  }

  if (tagName === "video") {
    component.set({
      traits: [
        {
          type: "text",
          name: "src",
          label: "מקור וידאו",
        },
        {
          type: "checkbox",
          name: "controls",
          label: "פקדי וידאו",
        },
        {
          type: "checkbox",
          name: "autoplay",
          label: "ניגון אוטומטי",
        },
        {
          type: "checkbox",
          name: "muted",
          label: "השתקה",
        },
        {
          type: "checkbox",
          name: "loop",
          label: "לופ",
        },
      ],
    });
  }

  const attrs = component.getAttributes?.() || {};

  if (attrs["data-bot-action"] === "whatsapp") {
    component.set({
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור וואטסאפ",
          placeholder: "https://wa.me/972...",
        },
      ],
    });
  }

  if (attrs["data-social-link"]) {
    component.set({
      traits: [
        {
          type: "text",
          name: "href",
          label: "קישור לרשת חברתית",
          placeholder: "https://...",
        },
        {
          type: "text",
          name: "data-social-link",
          label: "שם רשת",
        },
      ],
    });
  }

  if (attrs["data-mini-saas-action"]) {
    component.set({
      traits: [
        {
          type: "text",
          name: "data-mini-saas-action",
          label: "פעולת Mini SaaS",
        },
      ],
    });
  }
}

function isSectionComponent(component: any) {
  if (!component || typeof component.get !== "function") return false;

  const tagName = String(component.get("tagName") || "").toLowerCase();
  const classes = component.getClasses?.() || [];
  const attrs = component.getAttributes?.() || {};

  return (
    tagName === "section" ||
    tagName === "header" ||
    Boolean(attrs["data-section-kind"]) ||
    classes.includes("biz-section") ||
    classes.includes("biz-section-wide") ||
    classes.includes("biz-section-full") ||
    classes.includes("biz-hero") ||
    classes.some((className: string) => String(className).includes("section"))
  );
}

function getParentComponent(component: any) {
  if (!component) return null;

  if (typeof component.parent === "function") {
    return component.parent();
  }

  if (typeof component.getParent === "function") {
    return component.getParent();
  }

  return null;
}

function findSelectedSection(editor: Editor) {
  let current: any = editor.getSelected();

  while (current) {
    if (isSectionComponent(current)) return current;
    current = getParentComponent(current);
  }

  return null;
}

function getSectionKind(component: any): SectionKind {
  const attrs = component.getAttributes?.() || {};
  const classes = component.getClasses?.() || [];
  const html = component.toHTML?.() || "";
  const tagName = String(component.get?.("tagName") || "").toLowerCase();

  if (tagName === "header") return "header";

  const explicit = attrs["data-section-kind"];

  if (explicit) return explicit as SectionKind;

  if (attrs["data-bizuply-block"] === "services") return "services";
  if (attrs["data-bizuply-block"] === "booking") return "booking";
  if (attrs["data-bizuply-block"] === "products") return "store";
  if (attrs["data-bizuply-block"] === "reviews") return "reviews";
  if (attrs["data-bizuply-block"] === "lead-form") return "contact";
  if (attrs["data-bizuply-block"] === "customer-club") return "club";

  if (
    attrs["data-bizuply-block"] === "smart-bot" ||
    attrs["data-bizuply-block"] === "smart-bot-buttons" ||
    attrs["data-bizuply-block"] === "conversation-tree"
  ) return "bot";

  if (
    attrs["data-bizuply-block"] === "social-links" ||
    attrs["data-bizuply-block"] === "social-feed"
  ) return "social";

  if (
    attrs["data-bizuply-block"] === "digital-course" ||
    attrs["data-bizuply-block"] === "course-lessons" ||
    attrs["data-bizuply-block"] === "course-hero"
  ) return "course";

  if (
    attrs["data-bizuply-block"] === "mini-saas" ||
    attrs["data-bizuply-block"] === "mini-saas-types" ||
    attrs["data-bizuply-block"] === "mini-saas-preview"
  ) return "miniSaas";

  if (classes.includes("biz-hero")) return "hero";

  if (html.includes("בוט") || html.includes("וואטסאפ") || html.includes("עץ שיחה")) return "bot";
  if (html.includes("רשת") || html.includes("Instagram") || html.includes("TikTok")) return "social";
  if (html.includes("קורס") || html.includes("שיעור") || html.includes("סילבוס")) return "course";
  if (html.includes("SaaS") || html.includes("מיני") || html.includes("התחברות")) return "miniSaas";

  if (html.includes("אודות")) return "about";
  if (html.includes("שירות")) return "services";
  if (html.includes("גלר")) return "gallery";
  if (html.includes("מוצר") || html.includes("חנות")) return "store";
  if (html.includes("תור") || html.includes("יומן")) return "booking";
  if (html.includes("ביקור")) return "reviews";
  if (html.includes("מועדון")) return "club";
  if (html.includes("צור קשר") || html.includes("השאירו פרטים")) {
    return "contact";
  }

  return "basic";
}

function findFirstImage(component: any) {
  if (!component) return null;

  const tagName = String(component.get?.("tagName") || "").toLowerCase();

  if (tagName === "img") return component;

  const images = component.find?.("img") || [];

  return images[0] || null;
}

/* =====================================================
   CUSTOM TYPES
===================================================== */

function registerCustomComponentTypes(editor: Editor) {
  const domComponents = editor.DomComponents;

  domComponents.addType("biz-section", {
    isComponent: (el) => {
      if (!(el instanceof HTMLElement)) return false;

      if (
        el.tagName === "SECTION" ||
        el.tagName === "HEADER" ||
        el.classList.contains("biz-section") ||
        el.classList.contains("biz-section-wide") ||
        el.classList.contains("biz-section-full") ||
        el.classList.contains("biz-hero") ||
        el.hasAttribute("data-section-kind")
      ) {
        return { type: "biz-section" };
      }

      return false;
    },
    model: {
      defaults: {
        name: "סקשן",
        draggable: true,
        droppable: true,
        copyable: true,
        removable: true,
        editable: true,
        stylable: true,
        selectable: true,
        hoverable: true,
        highlightable: true,
        resizable: true,
      },
    },
  });

  domComponents.addType("biz-button", {
    isComponent: (el) => {
      if (!(el instanceof HTMLElement)) return false;

      if (el.classList.contains("biz-btn")) {
        return { type: "biz-button" };
      }

      return false;
    },
    model: {
      defaults: {
        name: "כפתור",
        draggable: true,
        droppable: false,
        copyable: true,
        removable: true,
        editable: true,
        stylable: true,
        selectable: true,
        hoverable: true,
        highlightable: true,
        traits: [
          {
            type: "text",
            name: "href",
            label: "קישור",
            placeholder: "https://...",
          },
          {
            type: "select",
            name: "target",
            label: "פתיחה",
            options: [
              { id: "", label: "באותו חלון" },
              { id: "_blank", label: "בטאב חדש" },
            ],
          },
        ],
      },
    },
  });

  domComponents.addType("biz-image", {
    isComponent: (el) => {
      if (!(el instanceof HTMLElement)) return false;

      if (el.tagName === "IMG") {
        return { type: "biz-image" };
      }

      return false;
    },
    model: {
      defaults: {
        name: "תמונה",
        draggable: true,
        droppable: false,
        copyable: true,
        removable: true,
        editable: true,
        stylable: true,
        selectable: true,
        hoverable: true,
        highlightable: true,
        resizable: true,
        traits: [
          {
            type: "text",
            name: "src",
            label: "מקור תמונה",
          },
          {
            type: "text",
            name: "alt",
            label: "טקסט חלופי",
          },
        ],
      },
    },
  });
  domComponents.addType("biz-video", {
    isComponent: (el) => {
      if (!(el instanceof HTMLElement)) return false;

      if (el.tagName === "VIDEO" || el.hasAttribute("data-editable-video")) {
        return { type: "biz-video" };
      }

      return false;
    },
    model: {
      defaults: {
        name: "וידאו",
        draggable: true,
        droppable: false,
        copyable: true,
        removable: true,
        editable: true,
        stylable: true,
        selectable: true,
        hoverable: true,
        highlightable: true,
        resizable: true,
        traits: [
          {
            type: "text",
            name: "src",
            label: "מקור וידאו",
          },
          {
            type: "checkbox",
            name: "controls",
            label: "פקדי וידאו",
          },
          {
            type: "checkbox",
            name: "autoplay",
            label: "ניגון אוטומטי",
          },
          {
            type: "checkbox",
            name: "muted",
            label: "השתקה",
          },
          {
            type: "checkbox",
            name: "loop",
            label: "לופ",
          },
        ],
      },
    },
  });

}

/* =====================================================
   CONTENT SNAPSHOT + LOCAL IMAGE FILES
===================================================== */

type SectionSnapshot = {
  headings: string[];
  paragraphs: string[];
  buttons: string[];
  links: { text: string; href?: string }[];
  images: string[];
  videos: string[];
  backgroundImage?: string;
};

function cleanText(value: string | null | undefined) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function extractSectionSnapshot(section: any): SectionSnapshot {
  const el = section?.view?.el as HTMLElement | undefined;

  if (!el) {
    return {
      headings: [],
      paragraphs: [],
      buttons: [],
      links: [],
      images: [],
      videos: [],
    };
  }

  const headings = Array.from(el.querySelectorAll("h1,h2,h3"))
    .map((node) => cleanText(node.textContent))
    .filter(Boolean);

  const paragraphs = Array.from(el.querySelectorAll("p"))
    .map((node) => cleanText(node.textContent))
    .filter(Boolean)
    .filter((text) => text.length > 2);

  const buttons = Array.from(el.querySelectorAll("button,a"))
    .map((node) => cleanText(node.textContent))
    .filter(Boolean)
    .filter((text) => text.length <= 40);

  const links = Array.from(el.querySelectorAll("a"))
    .map((node) => ({
      text: cleanText(node.textContent),
      href: node.getAttribute("href") || undefined,
    }))
    .filter((item) => Boolean(item.text || item.href));

  const images = Array.from(el.querySelectorAll("img"))
    .map((node) => node.getAttribute("src") || "")
    .filter(Boolean);

  const videos = Array.from(el.querySelectorAll("video"))
    .map((node) => node.getAttribute("src") || "")
    .filter(Boolean);

  const backgroundImage = el.style?.backgroundImage || undefined;

  return {
    headings,
    paragraphs,
    buttons,
    links,
    images,
    videos,
    backgroundImage,
  };
}

function setComponentText(component: any, text: string) {
  if (!component || !text) return;

  if (typeof component.components === "function") {
    component.components(text);
  } else if (typeof component.set === "function") {
    component.set("content", text);
  }
}

function applySnapshotToSection(section: any, snapshot: SectionSnapshot) {
  if (!section) return;

  const headingComponents = [
    ...(section.find?.("h1") || []),
    ...(section.find?.("h2") || []),
    ...(section.find?.("h3") || []),
  ];

  headingComponents.forEach((component: any, index: number) => {
    const text = snapshot.headings[index] || snapshot.headings[0];
    if (text) setComponentText(component, text);
  });

  const paragraphComponents = section.find?.("p") || [];
  paragraphComponents.forEach((component: any, index: number) => {
    const text = snapshot.paragraphs[index] || snapshot.paragraphs[0];
    if (text) setComponentText(component, text);
  });

  const buttonComponents = [
    ...(section.find?.("a") || []),
    ...(section.find?.("button") || []),
  ];

  buttonComponents.forEach((component: any, index: number) => {
    const text = snapshot.buttons[index] || snapshot.links[index]?.text;
    if (text) setComponentText(component, text);

    const link = snapshot.links[index];
    if (link?.href && typeof component.addAttributes === "function") {
      component.addAttributes({ href: link.href });
    }
  });

  const imageComponents = section.find?.("img") || [];
  imageComponents.forEach((component: any, index: number) => {
    const src = snapshot.images[index] || snapshot.images[0];
    if (src && typeof component.addAttributes === "function") {
      component.addAttributes({ src });
    }
  });

  const videoComponents = section.find?.("video") || [];
  videoComponents.forEach((component: any, index: number) => {
    const src = snapshot.videos[index] || snapshot.videos[0];
    if (src && typeof component.addAttributes === "function") {
      component.addAttributes({ src, controls: true });
    }
  });

  if (snapshot.backgroundImage && snapshot.backgroundImage !== "none") {
    section.addStyle?.({
      "background-image": snapshot.backgroundImage,
      "background-size": "cover",
      "background-position": "center",
      "background-repeat": "no-repeat",
    });
  }
}

function withTemporarySectionMarker(html: string, marker: string) {
  if (/<header\b/i.test(html)) {
    return html.replace(
      /<header\b/i,
      `<header data-bizuply-temp-section-id="${marker}"`
    );
  }

  return html.replace(
    /<section\b/i,
    `<section data-bizuply-temp-section-id="${marker}"`
  );
}

function findSectionByMarker(editor: Editor, marker: string) {
  const wrapper = editor.getWrapper();
  const sections = [
    ...(wrapper?.find("header") || []),
    ...(wrapper?.find("section") || []),
  ];

  return (
    sections.find((component: any) => {
      const attrs = component.getAttributes?.() || {};
      return attrs["data-bizuply-temp-section-id"] === marker;
    }) || null
  );
}

function applyLayoutVariantToSection(
  editor: Editor,
  section: any,
  variant: SectionLayoutVariant,
  options: { preserveCurrentContent: boolean }
) {
  const snapshot = options.preserveCurrentContent
    ? extractSectionSnapshot(section)
    : null;

  const parent = section.parent?.();
  const marker = `layout-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const markedHtml = withTemporarySectionMarker(variant.html, marker);

  let insertedSection: any = null;

  if (parent?.components) {
    const collection = parent.components();
    const index = collection.indexOf(section);

    section.remove();
    collection.add(markedHtml, { at: index >= 0 ? index : undefined });
  } else {
    section.replaceWith(markedHtml);
  }

  setTimeout(() => {
    makeAllComponentsEditable(editor);

    insertedSection = findSectionByMarker(editor, marker);

    if (!insertedSection) {
      const wrapper = editor.getWrapper();
      const allSections = [
        ...(wrapper?.find("header") || []),
        ...(wrapper?.find("section") || []),
      ];
      insertedSection = allSections[allSections.length - 1];
    }

    if (insertedSection) {
      if (snapshot) applySnapshotToSection(insertedSection, snapshot);

      insertedSection.removeAttributes?.(["data-bizuply-temp-section-id"]);
      ensureComponentEditable(insertedSection);
      editor.select(insertedSection);

      insertedSection.view?.el?.scrollIntoView?.({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 30);
}

function pickMediaFromComputer(
  editor: Editor,
  callback: (src: string, file: File, mediaType: "image" | "video") => void,
  options: { imagesOnly?: boolean } = {}
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = options.imagesOnly ? "image/*" : "image/*,video/*";
  input.multiple = false;

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (options.imagesOnly && !isImage) {
      alert("בחרי קובץ תמונה בלבד");
      return;
    }

    if (!isImage && !isVideo) {
      alert("בחרי קובץ תמונה או סרטון בלבד");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const src = String(reader.result || "");
      if (!src) return;

      editor.AssetManager.add({
        src,
        name: file.name,
      });

      callback(src, file, isVideo ? "video" : "image");
    };

    reader.readAsDataURL(file);
  });

  input.click();
}

function pickImageFromComputer(
  editor: Editor,
  callback: (src: string, file: File) => void
) {
  pickMediaFromComputer(
    editor,
    (src, file) => callback(src, file),
    { imagesOnly: true }
  );
}

function appendMediaToSection(
  editor: Editor,
  section: any,
  src: string,
  mediaType: "image" | "video"
) {
  const mediaHtml =
    mediaType === "video"
      ? `
        <video
          src="${src}"
          class="min-h-[320px] w-full rounded-[26px] object-cover"
          controls
          playsinline
          data-editable-video="true"
        ></video>
      `
      : `
        <img
          src="${src}"
          alt=""
          class="min-h-[320px] w-full rounded-[26px] object-cover"
          data-editable-image="true"
        />
      `;

  section.append(`
    <div class="relative mt-8 cursor-move overflow-hidden rounded-[34px] bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)]" data-media-replaceable="true">
      ${mediaHtml}
    </div>
  `);

  setTimeout(() => {
    makeAllComponentsEditable(editor);

    const selector = mediaType === "video" ? "video" : "img";
    const mediaItems = section.find(selector);
    const lastMedia = mediaItems[mediaItems.length - 1];

    if (lastMedia) editor.select(lastMedia);
  }, 0);
}

function appendImageToSection(editor: Editor, section: any, src: string) {
  appendMediaToSection(editor, section, src, "image");
}

function findFirstMedia(component: any) {
  if (!component) return null;

  const tagName = String(component.get?.("tagName") || "").toLowerCase();

  if (tagName === "img" || tagName === "video") return component;

  const images = component.find?.("img") || [];
  const videos = component.find?.("video") || [];

  return images[0] || videos[0] || null;
}

function replaceMediaComponent(
  editor: Editor,
  media: any,
  src: string,
  mediaType: "image" | "video"
) {
  const tagName = String(media.get?.("tagName") || "").toLowerCase();

  if (tagName === mediaType || (tagName === "img" && mediaType === "image") || (tagName === "video" && mediaType === "video")) {
    media.addAttributes?.(
      mediaType === "video"
        ? { src, controls: true, playsinline: true, "data-editable-video": "true" }
        : { src, "data-editable-image": "true" }
    );
    editor.select(media);
    return;
  }

  const replacement =
    mediaType === "video"
      ? `
        <video
          src="${src}"
          class="min-h-[320px] w-full rounded-[26px] object-cover"
          controls
          playsinline
          data-editable-video="true"
        ></video>
      `
      : `
        <img
          src="${src}"
          alt=""
          class="min-h-[320px] w-full rounded-[26px] object-cover"
          data-editable-image="true"
        />
      `;

  media.replaceWith?.(replacement);

  setTimeout(() => {
    makeAllComponentsEditable(editor);
  }, 0);
}


function setupDesignPanelVisibility(
  editor: Editor,
  stylesContainer?: HTMLElement | null
) {
  if (!stylesContainer) return;

  stylesContainer.dataset.bizuplyDesignPanel = "true";
  stylesContainer.style.display = "none";

  const hideDesignPanel = () => {
    stylesContainer.style.display = "none";
    stylesContainer.setAttribute("aria-hidden", "true");
  };

  const openDesignPanel = () => {
    stylesContainer.style.display = "block";
    stylesContainer.setAttribute("aria-hidden", "false");
    stylesContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  (editor as any).__bizuplyOpenDesignPanel = openDesignPanel;
  (editor as any).__bizuplyHideDesignPanel = hideDesignPanel;

  window.addEventListener("bizuply:open-design-panel", openDesignPanel);
  window.addEventListener("bizuply:close-design-panel", hideDesignPanel);

  editor.on("destroy", () => {
    window.removeEventListener("bizuply:open-design-panel", openDesignPanel);
    window.removeEventListener("bizuply:close-design-panel", hideDesignPanel);
  });
}

function openDesignPanel(editor: Editor, stylesContainer?: HTMLElement | null) {
  const selected = editor.getSelected();

  if (!selected) {
    alert("בחרי אלמנט באתר ואז לחצי עיצוב");
    return;
  }

  if (stylesContainer) {
    stylesContainer.style.display = "block";
    stylesContainer.setAttribute("aria-hidden", "false");
    stylesContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const externalOpen = (editor as any).__bizuplyOpenDesignPanel;
  if (typeof externalOpen === "function") externalOpen();

  editor.trigger("bizuply:design-panel:open", selected);
  window.dispatchEvent(new CustomEvent("bizuply:design-panel:open"));
}

/* =====================================================
   COMMANDS
===================================================== */

function registerCommands(editor: Editor, stylesContainer?: HTMLElement | null) {
  editor.Commands.add("bizuply-upload-header-logo", {
    run(currentEditor) {
      uploadHeaderLogo(currentEditor);
    },
  });

  editor.Commands.add("bizuply-toggle-header-direction", {
    run(currentEditor) {
      toggleHeaderDirection(currentEditor);
    },
  });

  editor.Commands.add("bizuply-header-quick-colors", {
    run(currentEditor) {
      quickHeaderColors(currentEditor);
    },
  });

  editor.Commands.add("bizuply-open-design-panel", {
    run(currentEditor) {
      openDesignPanel(currentEditor, stylesContainer);
    },
  });

  editor.Commands.add("bizuply-change-layout", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי לשנות לו מבנה");
        return;
      }

      const kind = getSectionKind(section);
      const variants = getSectionLayoutVariants(kind);

      if (!variants.length) {
        alert("אין עדיין מבנים לסקשן הזה");
        return;
      }

      openLayoutVariantsModal(currentEditor, section, kind, variants);
    },
  });

  editor.Commands.add("bizuply-add-media-to-section", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי להוסיף אליו תמונה");
        return;
      }

      pickMediaFromComputer(currentEditor, (src, _file, mediaType) => {
        appendMediaToSection(currentEditor, section, src, mediaType);
      });
    },
  });

  editor.Commands.add("bizuply-add-image-to-section", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי להוסיף אליו תמונה");
        return;
      }

      pickImageFromComputer(currentEditor, (src) => {
        appendImageToSection(currentEditor, section, src);
      });
    },
  });

  editor.Commands.add("bizuply-replace-image", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) {
        alert("בחרי תמונה או סקשן שיש בו תמונה");
        return;
      }

      const media = findFirstMedia(selected) || findFirstImage(selected);

      if (!media) {
        alert("לא נמצאה תמונה או וידאו באלמנט הנבחר");
        return;
      }

      pickMediaFromComputer(currentEditor, (src, _file, mediaType) => {
        replaceMediaComponent(currentEditor, media, src, mediaType);
      });
    },
  });

  editor.Commands.add("bizuply-set-section-bg-image", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי להגדיר לו תמונת רקע");
        return;
      }

      pickImageFromComputer(currentEditor, (src) => {
        section.addStyle({
          "background-image": `linear-gradient(135deg, rgba(2,6,23,0.58), rgba(2,6,23,0.20)), url("${src}")`,
          "background-size": "cover",
          "background-position": "center",
          "background-repeat": "no-repeat",
          color: "#ffffff",
        });
      });
    },
  });

  editor.Commands.add("bizuply-duplicate", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) return;

      const cloned = selected.clone();

      if (cloned) {
        currentEditor.select(cloned);
      }
    },
  });

  editor.Commands.add("bizuply-delete", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) return;

      selected.remove();
    },
  });

  editor.Commands.add("bizuply-bring-forward", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) return;

      const currentStyle = selected.getStyle();
      const currentZIndex = Number(currentStyle["z-index"] || 1);

      selected.addStyle({
        position: currentStyle.position || "relative",
        "z-index": currentZIndex + 1,
      });
    },
  });

  editor.Commands.add("bizuply-send-backward", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) return;

      const currentStyle = selected.getStyle();
      const currentZIndex = Number(currentStyle["z-index"] || 1);

      selected.addStyle({
        position: currentStyle.position || "relative",
        "z-index": Math.max(0, currentZIndex - 1),
      });
    },
  });
}

/* =====================================================
   PREMIUM LAYOUT MODAL
===================================================== */

function openLayoutVariantsModal(
  editor: Editor,
  section: any,
  kind: SectionKind,
  variants: SectionLayoutVariant[]
) {
  const content = document.createElement("div");
  content.dir = "rtl";

  content.style.cssText = `
    width:100%;
    min-height:76vh;
    background:#eef2ff;
    color:#0f172a;
    font-family:Assistant,Heebo,Arial,sans-serif;
  `;

  const kindLabel: Record<SectionKind, string> = {
  header: "הידר",
  hero: "דף הבית",
  welcome: "Welcome",
  about: "אודות",
  team: "צוות",
  services: "שירותים",
  gallery: "גלריה",
  contact: "יצירת קשר",
  promotion: "מבצע",
  subscribe: "הרשמה",
  testimonials: "המלצות",
  reviews: "ביקורות",
  clients: "לקוחות",
  store: "חנות",
  booking: "תיאום תורים",
  bookings: "תיאום תורים",
  events: "אירועים",
  club: "מועדון לקוחות",
  bot: "בוט חכם",
  social: "רשתות חברתיות",
  course: "קורס דיגיטלי",
  miniSaas: "מיני SaaS",
  basic: "סקשן חופשי",
  text: "טקסט",
  list: "רשימה",
  form: "טופס",
  forms: "טפסים",
  savedSections: "סקשנים שמורים",
};

  let activeKind: SectionKind = kind;
  let activeVariants = variants.length ? variants : getSectionLayoutVariants(activeKind);
  let selectedVariantId = activeVariants[0]?.id || "";

  const visibleCategories = () =>
    sectionKindOptions.filter((item) => getSectionLayoutVariants(item.kind).length > 0);

  const escapeHtml = (value: string) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const getVariantMeta = (variant: SectionLayoutVariant) => {
    const title = escapeHtml(variant.title);
    const description = escapeHtml(variant.description);
    const badge = escapeHtml(variant.badge || "מבנה");

    const isHeader = variant.kind === "header";
    const features = isHeader
      ? ["לוגו", "עמודים", "כניסה/יציאה", "CTA", "RTL/LTR"]
      : ["טקסט", "תמונה", "כפתורים", "עריכה מלאה"];

    return { title, description, badge, features };
  };

  const buildCategoryButtons = () => {
    if (activeKind === "header") {
      return `
        <div class="biz-layout-category-note">
          <span class="biz-layout-note-icon">▤</span>
          <span>מצב Header — כל התבניות מוצגות יחד, בלי סינונים מיותרים</span>
          <strong>${activeVariants.length}</strong>
        </div>
      `;
    }

    return visibleCategories()
      .map((item) => {
        const count = getSectionLayoutVariants(item.kind).length;
        const active = item.kind === activeKind;

        return `
          <button
            type="button"
            data-section-kind-filter="${item.kind}"
            class="biz-layout-category ${active ? "is-active" : ""}"
          >
            <span class="biz-layout-category-icon">${item.icon}</span>
            <span>${item.label}</span>
            <strong>${count}</strong>
          </button>
        `;
      })
      .join("");
  };

  const buildVariantCard = (variant: SectionLayoutVariant, index: number) => {
    const meta = getVariantMeta(variant);
    const isActive = selectedVariantId === variant.id;
    const isHeader = variant.kind === "header";

    return `
      <article
        data-variant-card="true"
        data-variant-id="${variant.id}"
        class="biz-layout-card ${isActive ? "is-selected" : ""} ${isHeader ? "is-header-card" : ""}"
      >
        <button type="button" class="biz-layout-card-click" aria-label="בחירת ${meta.title}"></button>

        <div class="biz-layout-preview ${isHeader ? "is-header-preview" : ""}">
          <div class="biz-layout-preview-top">
            <span>${meta.badge}</span>
            <strong>${index + 1}/${activeVariants.length}</strong>
          </div>
          ${renderVariantRealPreview(variant)}
        </div>

        <div class="biz-layout-card-body">
          <div class="biz-layout-card-title-row">
            <div>
              <h3>${meta.title}</h3>
              <p>${meta.description}</p>
            </div>
            <span class="biz-layout-selected-mark">✓</span>
          </div>

          <div class="biz-layout-feature-row">
            ${meta.features
              .map((feature) => `<span>${feature}</span>`)
              .join("")}
          </div>

          <div class="biz-layout-card-footer">
            <span>Preview אמיתי</span>
            <button type="button" data-apply-variant="${variant.id}">
              בחרי תבנית
            </button>
          </div>
        </div>
      </article>
    `;
  };

  const buildVariantCards = () =>
    activeVariants.map((variant, index) => buildVariantCard(variant, index)).join("");

  const bindModalEvents = () => {
    content
      .querySelector<HTMLButtonElement>("[data-close-layout-modal]")
      ?.addEventListener("click", () => editor.Modal.close());

    content.querySelectorAll<HTMLButtonElement>("[data-section-kind-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextKind = button.dataset.sectionKindFilter as SectionKind;
        if (!nextKind) return;

        activeKind = nextKind;
        activeVariants = getSectionLayoutVariants(activeKind);
        selectedVariantId = activeVariants[0]?.id || "";
        renderModal();
      });
    });

    content.querySelectorAll<HTMLElement>("[data-variant-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const variantId = card.dataset.variantId;
        if (!variantId) return;
        selectedVariantId = variantId;
        renderModal();
      });
    });

    content.querySelectorAll<HTMLButtonElement>("[data-apply-variant]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const variantId = button.dataset.applyVariant;
        const selectedVariant = activeVariants.find((variant) => variant.id === variantId);
        if (!selectedVariant) return;

        applyLayoutVariantToSection(editor, section, selectedVariant, {
          preserveCurrentContent: false,
        });

        editor.Modal.close();
      });
    });
  };

  const renderModal = () => {
    const activeLabel =
      sectionKindOptions.find((item) => item.kind === activeKind)?.label || kindLabel[activeKind];

    const selectedVariant = activeVariants.find((variant) => variant.id === selectedVariantId) || activeVariants[0];

    content.innerHTML = `
      <style>
        .gjs-mdl-dialog {
          width: min(1540px, 96vw) !important;
          max-width: 1540px !important;
          border-radius: 34px !important;
          overflow: hidden !important;
          background: transparent !important;
          box-shadow: 0 46px 180px rgba(15, 23, 42, .38) !important;
        }

        .gjs-mdl-content {
          padding: 0 !important;
          background: transparent !important;
        }

        .biz-layout-modal {
          min-height: 78vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(236,72,153,.18), transparent 34%),
            radial-gradient(circle at 90% 4%, rgba(124,58,237,.20), transparent 34%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #fff7ed 100%);
        }

        .biz-layout-modal-shell {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          min-height: 78vh;
        }

        .biz-layout-side {
          position: relative;
          padding: 28px;
          background: rgba(255,255,255,.78);
          border-left: 1px solid rgba(226,232,240,.92);
          backdrop-filter: blur(24px);
        }

        .biz-layout-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          background: #020617;
          color: #fff;
          font-size: 12px;
          font-weight: 1000;
          box-shadow: 0 18px 45px rgba(15,23,42,.20);
        }

        .biz-layout-title {
          margin: 22px 0 0;
          color: #020617;
          font-size: 38px;
          line-height: 1.02;
          letter-spacing: -.055em;
          font-weight: 1000;
        }

        .biz-layout-subtitle {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.85;
          font-weight: 800;
        }

        .biz-layout-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 22px;
        }

        .biz-layout-stat {
          border-radius: 24px;
          background: #fff;
          padding: 16px;
          box-shadow: inset 0 0 0 1px #e2e8f0, 0 14px 34px rgba(15,23,42,.06);
        }

        .biz-layout-stat span {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 1000;
        }

        .biz-layout-stat strong {
          display: block;
          margin-top: 6px;
          color: #020617;
          font-size: 26px;
          font-weight: 1000;
        }

        .biz-layout-categories {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .biz-layout-category,
        .biz-layout-category-note {
          border: 0;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 18px;
          padding: 12px 14px;
          background: #fff;
          color: #475569;
          font-size: 12px;
          font-weight: 1000;
          box-shadow: inset 0 0 0 1px #e2e8f0, 0 10px 24px rgba(15,23,42,.05);
        }

        .biz-layout-category { cursor: pointer; }

        .biz-layout-category.is-active {
          background: #7c3aed;
          color: #fff;
          box-shadow: 0 18px 42px rgba(124,58,237,.22);
        }

        .biz-layout-category-icon,
        .biz-layout-note-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 12px;
          background: #f1f5f9;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 1000;
        }

        .biz-layout-category.is-active .biz-layout-category-icon {
          background: rgba(255,255,255,.16);
          color: #fff;
        }

        .biz-layout-category strong,
        .biz-layout-category-note strong {
          border-radius: 999px;
          padding: 4px 8px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 11px;
        }

        .biz-layout-category.is-active strong {
          background: rgba(255,255,255,.16);
          color: #fff;
        }

        .biz-layout-side-preview {
          margin-top: 24px;
          overflow: hidden;
          border-radius: 28px;
          background: #020617;
          box-shadow: 0 28px 80px rgba(15,23,42,.18);
        }

        .biz-layout-side-preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .biz-layout-side-preview-head span {
          font-size: 11px;
          font-weight: 1000;
          color: rgba(255,255,255,.62);
        }

        .biz-layout-side-preview-head strong {
          font-size: 12px;
          font-weight: 1000;
        }

        .biz-layout-side-preview-body {
          height: 180px;
          position: relative;
          overflow: hidden;
          background: #fff;
        }

        .biz-layout-main {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .biz-layout-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 28px;
          background: rgba(255,255,255,.80);
          border-bottom: 1px solid rgba(226,232,240,.92);
          backdrop-filter: blur(24px);
        }

        .biz-layout-tabs-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .biz-layout-tabs-title span {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 18px;
          background: linear-gradient(135deg,#7c3aed,#ec4899);
          color: #fff;
          font-size: 18px;
          font-weight: 1000;
          box-shadow: 0 18px 38px rgba(124,58,237,.22);
        }

        .biz-layout-tabs-title h2 {
          margin: 0;
          color: #020617;
          font-size: 22px;
          font-weight: 1000;
          letter-spacing: -.035em;
        }

        .biz-layout-tabs-title p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
        }

        .biz-layout-close {
          cursor: pointer;
          border: 0;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 18px;
          background: #fff;
          color: #64748b;
          font-size: 26px;
          font-weight: 1000;
          box-shadow: inset 0 0 0 1px #e2e8f0, 0 14px 34px rgba(15,23,42,.08);
        }

        .biz-layout-grid-wrap {
          padding: 26px 28px 34px;
          overflow-y: auto;
          max-height: 68vh;
        }

        .biz-layout-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          align-items: start;
        }

        .biz-layout-card {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          background: rgba(255,255,255,.94);
          border: 2px solid rgba(226,232,240,.95);
          box-shadow: 0 22px 70px rgba(15,23,42,.08);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }

        .biz-layout-card:hover {
          transform: translateY(-6px);
          border-color: #c4b5fd;
          box-shadow: 0 34px 100px rgba(124,58,237,.18);
        }

        .biz-layout-card.is-selected {
          border-color: #7c3aed;
          box-shadow: 0 36px 105px rgba(124,58,237,.24);
        }

        .biz-layout-card-click {
          position: absolute;
          inset: 0;
          z-index: 5;
          cursor: pointer;
          border: 0;
          background: transparent;
        }

        .biz-layout-preview {
          height: 260px;
          position: relative;
          overflow: hidden;
          background: #fff;
          border-bottom: 1px solid #eef2f7;
        }

        .biz-layout-preview.is-header-preview {
          height: 230px;
          background:
            radial-gradient(circle at top right, rgba(124,58,237,.14), transparent 36%),
            linear-gradient(135deg, #ffffff, #f8fafc, #f5f3ff);
        }

        .biz-layout-preview-top {
          position: absolute;
          z-index: 7;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .biz-layout-preview-top span,
        .biz-layout-preview-top strong {
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 1000;
          box-shadow: 0 12px 28px rgba(15,23,42,.10);
        }

        .biz-layout-preview-top span {
          background: rgba(255,255,255,.96);
          color: #7c3aed;
        }

        .biz-layout-preview-top strong {
          background: #020617;
          color: #fff;
        }

        .biz-layout-card-body {
          position: relative;
          z-index: 6;
          padding: 18px;
        }

        .biz-layout-card-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .biz-layout-card-title-row h3 {
          margin: 0;
          color: #020617;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 1000;
          letter-spacing: -.02em;
        }

        .biz-layout-card-title-row p {
          margin: 8px 0 0;
          min-height: 42px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
          font-weight: 800;
        }

        .biz-layout-selected-mark {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 16px;
          background: #f1f5f9;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 1000;
        }

        .biz-layout-card.is-selected .biz-layout-selected-mark {
          background: linear-gradient(135deg,#7c3aed,#ec4899);
          color: #fff;
          box-shadow: 0 14px 30px rgba(124,58,237,.24);
        }

        .biz-layout-feature-row {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .biz-layout-feature-row span {
          border-radius: 999px;
          background: #f8fafc;
          color: #475569;
          padding: 7px 10px;
          font-size: 10px;
          font-weight: 1000;
          box-shadow: inset 0 0 0 1px #e2e8f0;
        }

        .biz-layout-card-footer {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .biz-layout-card-footer span {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 1000;
        }

        .biz-layout-card-footer button {
          position: relative;
          z-index: 10;
          cursor: pointer;
          border: 0;
          border-radius: 16px;
          background: #020617;
          color: #fff;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 1000;
          box-shadow: 0 16px 36px rgba(15,23,42,.16);
        }

        .biz-layout-card.is-selected .biz-layout-card-footer button {
          background: linear-gradient(135deg,#7c3aed,#ec4899);
          box-shadow: 0 16px 38px rgba(124,58,237,.22);
        }

        @media (max-width: 1280px) {
          .biz-layout-modal-shell { grid-template-columns: 320px minmax(0, 1fr); }
          .biz-layout-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 860px) {
          .biz-layout-modal-shell { grid-template-columns: 1fr; }
          .biz-layout-side-preview { display:none; }
          .biz-layout-grid { grid-template-columns: 1fr; }
          .biz-layout-grid-wrap { max-height: 62vh; padding: 18px; }
          .biz-layout-side { padding: 22px; }
          .biz-layout-title { font-size: 30px; }
        }
      </style>

      <div class="biz-layout-modal">
        <div class="biz-layout-modal-shell">
          <aside class="biz-layout-side">
            <div class="biz-layout-brand-pill">
              <span>Bizuply Studio</span>
              <strong>${activeLabel}</strong>
            </div>

            <h1 class="biz-layout-title">
              ${activeKind === "header" ? "בחרי Header מקצועי" : "בחרי מבנה מקצועי"}
            </h1>

            <p class="biz-layout-subtitle">
              ${
                activeKind === "header"
                  ? "כאן רואים ממש את ההידר לפני הבחירה: לוגו, תפריט, התחברות/התנתקות, כפתור פעולה וכיוון RTL/LTR."
                  : "בחרי תבנית מוכנה, יפה וברורה. הבחירה מחליפה מיד את הסקשן באתר."
              }
            </p>

            <div class="biz-layout-stats">
              <div class="biz-layout-stat">
                <span>תבניות</span>
                <strong>${activeVariants.length}</strong>
              </div>
              <div class="biz-layout-stat">
                <span>נבחר</span>
                <strong>${selectedVariant ? activeVariants.indexOf(selectedVariant) + 1 : 1}</strong>
              </div>
            </div>

            <div class="biz-layout-categories">
              ${buildCategoryButtons()}
            </div>

            <div class="biz-layout-side-preview">
              <div class="biz-layout-side-preview-head">
                <span>Preview גדול</span>
                <strong>${selectedVariant ? escapeHtml(selectedVariant.title) : ""}</strong>
              </div>
              <div class="biz-layout-side-preview-body">
                ${selectedVariant ? renderVariantRealPreview(selectedVariant) : ""}
              </div>
            </div>
          </aside>

          <main class="biz-layout-main">
            <div class="biz-layout-topbar">
              <div class="biz-layout-tabs-title">
                <span>${activeKind === "header" ? "▤" : "✦"}</span>
                <div>
                  <h2>${activeKind === "header" ? "תבניות Header" : `תבניות ${activeLabel}`}</h2>
                  <p>לחיצה על כרטיס מסמנת אותו, לחיצה על “בחרי תבנית” מחליפה באתר</p>
                </div>
              </div>

              <button type="button" data-close-layout-modal="true" class="biz-layout-close">×</button>
            </div>

            <div class="biz-layout-grid-wrap">
              <div class="biz-layout-grid">
                ${buildVariantCards()}
              </div>
            </div>
          </main>
        </div>
      </div>
    `;

    bindModalEvents();
  };

  renderModal();

  editor.Modal.open({
    title: "",
    content,
  });
}

function renderVariantRealPreview(variant: SectionLayoutVariant) {
  if (variant.kind === "header") {
    return `
      <div style="
        position:absolute;
        inset:0;
        overflow:hidden;
        background:
          radial-gradient(circle at top right,rgba(124,58,237,.14),transparent 36%),
          linear-gradient(135deg,#ffffff,#f8fafc,#f5f3ff);
      ">
        <style>
          .bizuply-header-preview-${variant.id} header {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;
            margin: 54px auto 0 !important;
            width: calc(100% - 72px) !important;
            max-width: 1180px !important;
            min-width: 0 !important;
          }

          .bizuply-header-preview-${variant.id} a,
          .bizuply-header-preview-${variant.id} button {
            pointer-events: none !important;
          }
        </style>

        <div
          class="bizuply-header-preview-${variant.id}"
          style="
            width:1200px;
            height:300px;
            position:absolute;
            top:0;
            right:50%;
            transform:translateX(50%) scale(.38);
            transform-origin:top center;
            overflow:hidden;
          "
        >
          ${variant.html}
        </div>
      </div>
    `;
  }

  const isCompact =
    variant.kind === "bot" ||
    variant.kind === "social" ||
    variant.kind === "course" ||
    variant.kind === "miniSaas";

  const width = 1240;
  const minHeight = isCompact ? 760 : 960;
  const scale = isCompact ? 0.25 : 0.22;

  return `
    <div style="position:absolute;inset:0;overflow:hidden;background:#ffffff;">
      <div
        style="
          width:${width}px;
          min-height:${minHeight}px;
          transform:scale(${scale});
          transform-origin:top right;
        "
      >
        ${variant.html}
      </div>
    </div>
  `;
}

/* =====================================================
   SHORTCUTS
===================================================== */

function registerKeyboardShortcuts(editor: Editor) {
  editor.Keymaps.add("bizuply:delete", "backspace, delete", (currentEditor) => {
    const selected = currentEditor.getSelected();

    if (!selected) return;

    selected.remove();
  });

  editor.Keymaps.add("bizuply:duplicate", "ctrl+d, cmd+d", (currentEditor) => {
    currentEditor.runCommand("bizuply-duplicate");
  });

  editor.Keymaps.add("bizuply:undo", "ctrl+z, cmd+z", (currentEditor) => {
    currentEditor.UndoManager.undo();
  });

  editor.Keymaps.add(
    "bizuply:redo",
    "ctrl+shift+z, cmd+shift+z",
    (currentEditor) => {
      currentEditor.UndoManager.redo();
    }
  );
}