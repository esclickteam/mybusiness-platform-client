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

const sectionKindOptions: { kind: SectionKind; label: string; icon: string }[] = [
  { kind: "header", label: "הידר", icon: "▤" },
  { kind: "hero", label: "דף הבית", icon: "★" },
  { kind: "about", label: "אודות", icon: "ℹ" },
  { kind: "services", label: "שירותים", icon: "✦" },
  { kind: "gallery", label: "גלריה", icon: "▧" },
  { kind: "store", label: "חנות", icon: "₪" },
  { kind: "booking", label: "יומן", icon: "☷" },
  { kind: "reviews", label: "ביקורות", icon: "★★★★★" },
  { kind: "contact", label: "צור קשר", icon: "@" },
  { kind: "club", label: "מועדון", icon: "♛" },
  { kind: "bot", label: "בוט חכם", icon: "AI" },
  { kind: "social", label: "רשתות", icon: "#" },
  { kind: "course", label: "קורס", icon: "▶" },
  { kind: "miniSaas", label: "Mini SaaS", icon: "S" },
  { kind: "basic", label: "חופשי", icon: "+" },
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
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        max-width: min(620px, calc(100vw - 360px)) !important;
        border-radius: 18px !important;
        overflow: visible !important;
        background: rgba(15,23,42,.96) !important;
        box-shadow: 0 20px 70px rgba(15,23,42,.32) !important;
        padding: 6px !important;
        z-index: 9999 !important;
      }

      .gjs-toolbar-item {
        min-height: 34px !important;
        max-height: 34px !important;
        min-width: 34px !important;
        padding: 0 10px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
        color: #fff !important;
        font-weight: 900 !important;
        font-size: 11px !important;
        line-height: 1 !important;
        border-radius: 12px !important;
        background: transparent !important;
      }

      .gjs-toolbar-item:hover {
        background: rgba(255,255,255,.14) !important;
      }

      .gjs-toolbar-item:first-child {
        background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
      }

      .gjs-toolbar-item svg,
      .gjs-toolbar-item i {
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

  component.addStyle?.({
    "--header-bg": bg,
    "--header-text": text,
    "--header-muted": muted,
    "--header-border": border,
    "--header-button-bg": buttonBg,
    "--header-button-text": buttonText,
    background: "var(--header-bg)",
    color: "var(--header-text)",
    "border-color": "var(--header-border)",
  });
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

function uploadHeaderLogo(editor: Editor) {
  const header = findSelectedHeader(editor);

  if (!header) {
    alert("בחרי את ההידר ואז לחצי לוגו");
    return;
  }

  pickImageFromComputer(editor, (src) => {
    const logoSlots = header.find?.("[data-header-logo-slot]") || [];
    const logoSlot = logoSlots[0];

    if (!logoSlot) {
      alert("לא נמצא אזור לוגו בהידר הזה");
      return;
    }

    logoSlot.components(`
      <img
        src="${src}"
        alt="Logo"
        class="h-full w-full rounded-[inherit] object-cover"
        data-header-logo-image="true"
      />
    `);

    makeAllComponentsEditable(editor);
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

  const attrs = header.getAttributes?.() || {};
  const currentBg = attrs["data-header-bg"] || "rgba(255,255,255,0.94)";
  const bg = window.prompt("צבע רקע Header", currentBg);

  if (!bg) return;

  const currentText = attrs["data-header-text"] || "#0f172a";
  const text = window.prompt("צבע טקסט", currentText) || currentText;

  const currentButton = attrs["data-header-button-bg"] || "#7C3AED";
  const buttonBg = window.prompt("צבע כפתור", currentButton) || currentButton;

  header.addAttributes?.({
    "data-header-bg": bg,
    "data-header-text": text,
    "data-header-button-bg": buttonBg,
  });

  applyHeaderVisualSettings(header);
  editor.select(header);
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
            label: "✨ מבנה",
            attributes: {
              title: "בחירת מבנה Header מקצועי",
            },
            command: "bizuply-change-layout",
          },
          {
            label: "🖼 לוגו",
            attributes: {
              title: "העלאת לוגו להידר",
            },
            command: "bizuply-upload-header-logo",
          },
          {
            label: "🎨 צבעים",
            attributes: {
              title: "שינוי צבע Header, טקסט וכפתור",
            },
            command: "bizuply-header-quick-colors",
          },
          {
            label: "↔ כיוון",
            attributes: {
              title: "RTL / LTR",
            },
            command: "bizuply-toggle-header-direction",
          },
          {
            label: "🎨 עיצוב",
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
            label: "✨ מבנה",
            attributes: {
              title: "בחירת מבנה מקצועי לסקשן",
            },
            command: "bizuply-change-layout",
          },
          {
            label: "🎨 עיצוב",
            attributes: {
              title: "פתיחת עיצוב, צבעים, גדלים וריווחים",
            },
            command: "bizuply-open-design-panel",
          },
          {
            label: "＋ מדיה",
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
            label: "תמונה/וידאו",
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
            label: "🎨 עיצוב",
            attributes: {
              title: "פתיחת עיצוב לאלמנט הנבחר",
            },
            command: "bizuply-open-design-panel",
          },
          {
            label: "תמונה/וידאו",
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
  content.style.cssText =
    "width:100%;background:#f7f8fc;color:#0f172a;font-family:Assistant,Heebo,Arial,sans-serif;";

  const kindLabel: Record<SectionKind, string> = {
    header: "הידר",
    hero: "דף הבית",
    about: "אודות",
    services: "שירותים",
    gallery: "גלריה",
    store: "חנות",
    booking: "תיאום תורים",
    reviews: "ביקורות",
    contact: "יצירת קשר",
    club: "מועדון לקוחות",
    bot: "בוט חכם",
    social: "רשתות חברתיות",
    course: "קורס דיגיטלי",
    miniSaas: "מיני SaaS",
    basic: "סקשן חופשי",
  };

  let activeKind: SectionKind = kind;
  let activeVariants = variants.length
    ? variants
    : getSectionLayoutVariants(activeKind);

  const visibleCategories = () =>
    sectionKindOptions.filter(
      (item) => getSectionLayoutVariants(item.kind).length > 0
    );

  const buildCategoryButtons = () => {
    if (activeKind === "header") {
      return `
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <div style="
            display:inline-flex;
            align-items:center;
            gap:10px;
            border-radius:999px;
            background:#020617;
            color:#fff;
            padding:12px 20px;
            font-size:14px;
            font-weight:1000;
            box-shadow:0 16px 42px rgba(15,23,42,.18);
          ">
            <span style="display:grid;place-items:center;width:24px;height:24px;border-radius:9px;background:rgba(255,255,255,.13);">▤</span>
            <span>הידר</span>
            <span style="border-radius:999px;background:rgba(255,255,255,.14);padding:4px 9px;font-size:11px;">${activeVariants.length}</span>
          </div>

          <div style="
            display:inline-flex;
            align-items:center;
            gap:8px;
            border-radius:999px;
            background:#ecfdf5;
            color:#047857;
            padding:12px 18px;
            font-size:12px;
            font-weight:1000;
          ">
            <span>✓</span>
            <span>כל תבניות ההידר — בלי סינונים</span>
          </div>
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
            style="
              border:0;
              cursor:pointer;
              display:inline-flex;
              align-items:center;
              gap:8px;
              border-radius:18px;
              padding:12px 18px;
              font-size:13px;
              font-weight:1000;
              transition:.18s ease;
              color:${active ? "#fff" : "#475569"};
              background:${active ? "#020617" : "#ffffff"};
              box-shadow:${active ? "0 16px 38px rgba(15,23,42,.16)" : "0 1px 0 rgba(15,23,42,.06), inset 0 0 0 1px #e2e8f0"};
            "
          >
            <span>${item.label}</span>
            <span style="
              border-radius:999px;
              padding:3px 8px;
              font-size:11px;
              color:${active ? "#fff" : "#64748b"};
              background:${active ? "rgba(255,255,255,.14)" : "#f1f5f9"};
            ">${count}</span>
          </button>
        `;
      })
      .join("");
  };

  const buildHeaderCard = (variant: SectionLayoutVariant, index: number) => `
    <button
      type="button"
      data-variant-id="${variant.id}"
      style="
        cursor:pointer;
        border:1px solid #e5e7eb;
        background:#ffffff;
        border-radius:30px;
        overflow:hidden;
        text-align:right;
        padding:0;
        box-shadow:0 18px 55px rgba(15,23,42,.08);
        transition:.18s ease;
      "
      onmouseover="this.style.transform='translateY(-5px)';this.style.boxShadow='0 30px 90px rgba(124,58,237,.18)';this.style.borderColor='#c4b5fd';"
      onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 18px 55px rgba(15,23,42,.08)';this.style.borderColor='#e5e7eb';"
    >
      <div style="
        height:176px;
        position:relative;
        overflow:hidden;
        background:
          radial-gradient(circle at top right,rgba(124,58,237,.12),transparent 32%),
          linear-gradient(135deg,#fbfbff,#ffffff,#f7f3ff);
        border-bottom:1px solid #f1f5f9;
      ">
        <div style="
          position:absolute;
          z-index:10;
          top:14px;
          right:14px;
          border-radius:999px;
          padding:6px 10px;
          background:rgba(255,255,255,.96);
          color:#7c3aed;
          font-size:11px;
          font-weight:1000;
          box-shadow:0 10px 24px rgba(15,23,42,.10);
        ">
          ${variant.badge}
        </div>

        <div style="
          position:absolute;
          z-index:10;
          top:14px;
          left:14px;
          border-radius:999px;
          padding:6px 10px;
          background:#020617;
          color:#fff;
          font-size:11px;
          font-weight:1000;
          box-shadow:0 10px 24px rgba(15,23,42,.12);
        ">
          ${index + 1}/15
        </div>

        ${renderVariantRealPreview(variant)}
      </div>

      <div style="padding:18px 18px 16px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;">
          <div>
            <h3 style="margin:0;color:#020617;font-size:18px;line-height:1.25;font-weight:1000;letter-spacing:-.01em;">
              ${variant.title}
            </h3>
            <p style="margin:8px 0 0;color:#64748b;font-size:12px;line-height:1.75;font-weight:800;min-height:42px;">
              ${variant.description}
            </p>
          </div>

          <span style="
            flex:0 0 auto;
            display:grid;
            place-items:center;
            width:38px;
            height:38px;
            border-radius:16px;
            background:#f3e8ff;
            color:#7c3aed;
            font-size:14px;
            font-weight:1000;
          ">✓</span>
        </div>

        <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <span style="border-radius:999px;background:#f1f5f9;color:#475569;padding:8px 12px;font-size:11px;font-weight:1000;">
            לוגו · צבעים · RTL/LTR
          </span>
          <span style="border-radius:999px;background:#7c3aed;color:#fff;padding:9px 15px;font-size:11px;font-weight:1000;box-shadow:0 12px 26px rgba(124,58,237,.18);">
            בחר מבנה
          </span>
        </div>
      </div>
    </button>
  `;

  const buildRegularCard = (variant: SectionLayoutVariant) => `
    <button
      type="button"
      data-variant-id="${variant.id}"
      style="
        cursor:pointer;
        border:1px solid #e2e8f0;
        background:#ffffff;
        border-radius:28px;
        overflow:hidden;
        text-align:right;
        padding:0;
        box-shadow:0 18px 55px rgba(15,23,42,.08);
        transition:.18s ease;
      "
    >
      <div style="height:250px;position:relative;overflow:hidden;background:#fff;border-bottom:1px solid #f1f5f9;">
        <div style="position:absolute;z-index:5;top:14px;right:14px;border-radius:999px;padding:6px 10px;background:rgba(255,255,255,.95);color:#7c3aed;font-size:11px;font-weight:1000;box-shadow:0 10px 24px rgba(15,23,42,.10);">
          ${variant.badge}
        </div>
        ${renderVariantRealPreview(variant)}
      </div>

      <div style="padding:18px;">
        <h3 style="margin:0;color:#020617;font-size:18px;line-height:1.25;font-weight:1000;">${variant.title}</h3>
        <p style="margin:8px 0 0;color:#64748b;font-size:12px;line-height:1.75;font-weight:800;min-height:42px;">${variant.description}</p>
        <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <span style="border-radius:999px;background:#f1f5f9;color:#475569;padding:8px 12px;font-size:11px;font-weight:1000;">עריכה מלאה</span>
          <span style="border-radius:999px;background:#7c3aed;color:#fff;padding:9px 15px;font-size:11px;font-weight:1000;">בחר מבנה</span>
        </div>
      </div>
    </button>
  `;

  const buildVariantCards = () =>
    activeVariants
      .map((variant, index) =>
        activeKind === "header"
          ? buildHeaderCard(variant, index)
          : buildRegularCard(variant)
      )
      .join("");

  const bindModalEvents = () => {
    content
      .querySelector<HTMLButtonElement>("[data-close-layout-modal]")
      ?.addEventListener("click", () => {
        editor.Modal.close();
      });

    content
      .querySelectorAll<HTMLButtonElement>("[data-section-kind-filter]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const nextKind = button.dataset.sectionKindFilter as SectionKind;
          if (!nextKind) return;

          activeKind = nextKind;
          activeVariants = getSectionLayoutVariants(activeKind);
          renderModal();
        });
      });

    content.querySelectorAll<HTMLButtonElement>("[data-variant-id]").forEach(
      (button) => {
        button.addEventListener("click", () => {
          const variantId = button.dataset.variantId;

          const selectedVariant = activeVariants.find(
            (variant) => variant.id === variantId
          );

          if (!selectedVariant) return;

          applyLayoutVariantToSection(editor, section, selectedVariant, {
            preserveCurrentContent: false,
          });

          editor.Modal.close();
        });
      }
    );
  };

  const renderModal = () => {
    const activeLabel =
      sectionKindOptions.find((item) => item.kind === activeKind)?.label ||
      kindLabel[activeKind];

    content.innerHTML = `
      <div style="
        position:sticky;
        top:0;
        z-index:30;
        background:rgba(255,255,255,.97);
        border-bottom:1px solid #e2e8f0;
        padding:26px 32px 20px;
        backdrop-filter:blur(18px);
      ">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px;">
          <div>
            <div style="margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="display:inline-flex;border-radius:999px;background:#7c3aed;color:#fff;padding:9px 14px;font-size:12px;font-weight:1000;box-shadow:0 12px 28px rgba(124,58,237,.18);">
                ${activeLabel}
              </span>

              <span style="display:inline-flex;border-radius:999px;background:#f1f5f9;color:#475569;padding:9px 14px;font-size:12px;font-weight:1000;">
                ${activeVariants.length} תבניות
              </span>
            </div>

            <h2 style="margin:0;color:#020617;font-size:38px;line-height:1.08;font-weight:1000;letter-spacing:-.04em;">
              ${activeKind === "header" ? "בחרי מבנה Header" : "בחרי מבנה סקשן"}
            </h2>

            <p style="margin:12px 0 0;max-width:980px;color:#64748b;font-size:14px;line-height:1.8;font-weight:800;">
              ${
                activeKind === "header"
                  ? "כל כרטיס מציג את ההידר כמו מוקאפ אמיתי: לוגו, עמודים, התחברות/התנתקות, כפתור פעולה, RTL/LTR וצבעים לעריכה."
                  : "בחרי קטגוריה ואז תבנית. הבחירה מחליפה באתר בדיוק את המבנה שבכרטיס."
              }
            </p>
          </div>

          <button
            type="button"
            data-close-layout-modal="true"
            style="
              cursor:pointer;
              border:0;
              flex:0 0 auto;
              display:grid;
              place-items:center;
              width:48px;
              height:48px;
              border-radius:18px;
              background:#f1f5f9;
              color:#64748b;
              font-size:24px;
              font-weight:1000;
            "
          >
            ×
          </button>
        </div>

        <div style="margin-top:20px;">
          ${buildCategoryButtons()}
        </div>
      </div>

      <div style="max-height:72vh;overflow-y:auto;background:#f7f8fc;padding:24px 28px 32px;">
        <div style="
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:22px;
          align-items:start;
        ">
          ${buildVariantCards()}
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
          radial-gradient(circle at top right,rgba(124,58,237,.14),transparent 34%),
          linear-gradient(135deg,#ffffff,#f8fafc,#f5f3ff);
      ">
        <style>
          .bizuply-header-preview-${variant.id} header {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;
            margin: 22px auto 0 !important;
            width: calc(100% - 52px) !important;
            max-width: 1120px !important;
          }

          .bizuply-header-preview-${variant.id} a,
          .bizuply-header-preview-${variant.id} button {
            pointer-events: none !important;
          }
        </style>

        <div
          class="bizuply-header-preview-${variant.id}"
          style="
            width:1040px;
            height:215px;
            position:absolute;
            top:0;
            right:50%;
            transform:translateX(50%) scale(.48);
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
  const scale = isCompact ? 0.235 : 0.215;

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