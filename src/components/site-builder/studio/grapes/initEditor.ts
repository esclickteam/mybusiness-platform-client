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
          open: true,
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
          open: true,
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
          open: true,
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
          open: true,
          properties: ["margin", "padding"],
        },
        {
          name: "פינות, גבול וצל",
          open: true,
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
      styles: [],
      scripts: [],
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
            inputPlh: "כתובת תמונה",
            modalTitle: "ניהול מדיה",
            uploadTitle: "גררי תמונות לכאן",
          },
        },
      },
    },
  });

  registerCommands(editor);
  registerKeyboardShortcuts(editor);
  registerCustomComponentTypes(editor);

  editor.on("load", () => {
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
        border-radius: 999px !important;
        overflow: hidden !important;
        background: #0F172A !important;
        box-shadow: 0 20px 70px rgba(15,23,42,.32) !important;
        padding: 4px !important;
      }

      .gjs-toolbar-item {
        min-height: 34px !important;
        padding: 0 12px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #fff !important;
        font-weight: 900 !important;
        font-size: 12px !important;
        border-radius: 999px !important;
        background: transparent !important;
      }

      .gjs-toolbar-item:hover {
        background: rgba(255,255,255,.14) !important;
      }

      .gjs-toolbar-item:first-child {
        background: linear-gradient(135deg,#7C3AED,#EC4899) !important;
      }

      .gjs-resizer-h {
        border-color: #7C3AED !important;
        background: #FFFFFF !important;
        box-shadow: 0 6px 16px rgba(124,58,237,.25) !important;
      }

      .gjs-mdl-dialog {
        width: min(1180px, 92vw) !important;
        max-width: 1180px !important;
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

  return editor;
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

    toolbar: isSection
      ? [
          {
            label: "✨ החלף מבנה",
            attributes: {
              title: "בחירת מבנה מקצועי לסקשן",
            },
            command: "bizuply-change-layout",
          },
          {
            label: "＋ תמונה",
            attributes: {
              title: "הוספת תמונה לסקשן",
            },
            command: "bizuply-add-image-to-section",
          },
          {
            label: "רקע",
            attributes: {
              title: "הגדרת תמונה כרקע לסקשן",
            },
            command: "bizuply-set-section-bg-image",
          },
          {
            label: "החלף",
            attributes: {
              title: "החלפת תמונה בסקשן",
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
            label: "החלף",
            attributes: {
              title: "החלפת תמונה / עריכת מדיה",
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
          label: "כתובת תמונה",
        },
        {
          type: "text",
          name: "alt",
          label: "טקסט חלופי",
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

  const explicit = attrs["data-section-kind"];

  if (explicit) return explicit as SectionKind;

  if (attrs["data-bizuply-block"] === "services") return "services";
  if (attrs["data-bizuply-block"] === "booking") return "booking";
  if (attrs["data-bizuply-block"] === "products") return "store";
  if (attrs["data-bizuply-block"] === "reviews") return "reviews";
  if (attrs["data-bizuply-block"] === "lead-form") return "contact";
  if (attrs["data-bizuply-block"] === "customer-club") return "club";

  if (classes.includes("biz-hero")) return "hero";

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
            label: "כתובת תמונה",
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
}

/* =====================================================
   COMMANDS
===================================================== */

function registerCommands(editor: Editor) {
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

  editor.Commands.add("bizuply-add-image-to-section", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי להוסיף אליו תמונה");
        return;
      }

      const url = window.prompt("הדביקי כתובת תמונה:");
      if (!url) return;

      section.append(`
        <div class="relative mt-8 overflow-hidden rounded-[34px] bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)]" data-editable-image-card="true">
          <img
            src="${url}"
            alt=""
            class="min-h-[320px] w-full rounded-[26px] object-cover"
            data-editable-image="true"
          />
        </div>
      `);

      setTimeout(() => {
        makeAllComponentsEditable(currentEditor);

        const images = section.find("img");
        const lastImage = images[images.length - 1];

        if (lastImage) currentEditor.select(lastImage);
      }, 0);
    },
  });

  editor.Commands.add("bizuply-replace-image", {
    run(currentEditor) {
      const selected = currentEditor.getSelected();

      if (!selected) {
        alert("בחרי תמונה או סקשן שיש בו תמונה");
        return;
      }

      const image = findFirstImage(selected);

      if (!image) {
        alert("לא נמצאה תמונה באלמנט הנבחר");
        return;
      }

      const url = window.prompt("הדביקי כתובת תמונה חדשה:");
      if (!url) return;

      image.addAttributes({
        src: url,
      });

      currentEditor.select(image);
    },
  });

  editor.Commands.add("bizuply-set-section-bg-image", {
    run(currentEditor) {
      const section = findSelectedSection(currentEditor);

      if (!section) {
        alert("בחרי סקשן כדי להגדיר לו תמונת רקע");
        return;
      }

      const url = window.prompt("הדביקי כתובת תמונה לרקע הסקשן:");
      if (!url) return;

      section.addStyle({
        "background-image": `linear-gradient(135deg, rgba(2,6,23,0.58), rgba(2,6,23,0.20)), url("${url}")`,
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
        color: "#ffffff",
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
  content.className = "w-full bg-white text-slate-950";

  const kindLabel: Record<SectionKind, string> = {
    hero: "דף הבית",
    about: "אודות",
    services: "שירותים",
    gallery: "גלריה",
    store: "חנות",
    booking: "תיאום תורים",
    reviews: "ביקורות",
    contact: "יצירת קשר",
    club: "מועדון לקוחות",
    basic: "סקשן חופשי",
  };

  const currentVariantIds = variants.map((variant) => variant.id).join(",");

  content.innerHTML = `
    <div class="flex items-center justify-between gap-6 border-b border-slate-200 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50 px-8 py-7">
      <div>
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <span class="inline-flex rounded-full bg-violet-700 px-4 py-2 text-xs font-black text-white shadow-lg shadow-violet-200">
            ${kindLabel[kind]}
          </span>

          <span class="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
            ${variants.length} מבנים לבחירה
          </span>

          <span class="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
            משתנה מיד בלחיצה
          </span>
        </div>

        <h2 class="text-4xl font-black tracking-[-0.05em] text-slate-950">
          בחרי איך הסקשן ייראה
        </h2>

        <p class="mt-3 max-w-[760px] text-sm font-bold leading-7 text-slate-500">
          כל כרטיסייה מציגה תצוגה אמיתית של המבנה. לחיצה על מבנה מחליפה אותו מיד באתר,
          ואחר כך אפשר לערוך טקסטים, תמונות, צבעים, רקעים, כפתורים וריווחים.
        </p>
      </div>

      <button
        type="button"
        data-close-layout-modal="true"
        class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-xl font-black text-slate-500 shadow-lg transition hover:bg-slate-950 hover:text-white"
      >
        ×
      </button>
    </div>

    <div class="border-b border-slate-200 bg-white px-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <button data-filter-layout="all" class="layout-filter-btn rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black text-white">
            הכל
          </button>
          <button data-filter-layout="מומלץ" class="layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700">
            מומלצים
          </button>
          <button data-filter-layout="רקע" class="layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700">
            תמונת רקע
          </button>
          <button data-filter-layout="תמונה" class="layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700">
            תמונות
          </button>
          <button data-filter-layout="קרוסלה" class="layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700">
            קרוסלה
          </button>
          <button data-filter-layout="מבנה" class="layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700">
            מבנים נוספים
          </button>
        </div>

        <div class="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-black text-slate-500">
          ${currentVariantIds ? "בחרי כרטיסייה והמבנה יוחל מיידית" : "אין מבנים"}
        </div>
      </div>
    </div>

    <div class="max-h-[70vh] overflow-y-auto bg-slate-50 p-6">
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        ${variants
          .map(
            (variant) => `
          <button
            type="button"
            data-variant-id="${variant.id}"
            data-variant-badge="${variant.badge}"
            class="group overflow-hidden rounded-[34px] border border-slate-200 bg-white text-right shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_28px_90px_rgba(124,58,237,0.18)]"
          >
            <div class="relative h-[250px] overflow-hidden border-b border-slate-100 bg-white">
              <div class="absolute right-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black text-violet-700 shadow-lg">
                ${variant.badge}
              </div>

              <div class="absolute left-4 top-4 z-20 rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                לחצי להחלפה
              </div>

              ${renderVariantRealPreview(variant)}
            </div>

            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-xl font-black text-slate-950">
                    ${variant.title}
                  </h3>

                  <p class="mt-2 min-h-[44px] text-xs font-bold leading-6 text-slate-500">
                    ${variant.description}
                  </p>
                </div>

                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-50 text-sm font-black text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
                  ✓
                </span>
              </div>

              <div class="mt-5 flex items-center justify-between gap-3">
                <span class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
                  ניתן לעריכה מלאה
                </span>

                <span class="inline-flex rounded-full bg-violet-700 px-5 py-2 text-xs font-black text-white shadow-lg shadow-violet-100">
                  החל מבנה
                </span>
              </div>
            </div>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  content
    .querySelector<HTMLButtonElement>("[data-close-layout-modal]")
    ?.addEventListener("click", () => {
      editor.Modal.close();
    });

  content.querySelectorAll<HTMLButtonElement>("[data-filter-layout]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filterLayout || "all";

        content.querySelectorAll<HTMLButtonElement>(".layout-filter-btn").forEach(
          (btn) => {
            btn.className =
              "layout-filter-btn rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700";
          }
        );

        button.className =
          "layout-filter-btn rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black text-white";

        content.querySelectorAll<HTMLElement>("[data-variant-id]").forEach(
          (card) => {
            const badge = card.dataset.variantBadge || "";
            const shouldShow = filter === "all" || badge === filter;
            card.style.display = shouldShow ? "block" : "none";
          }
        );
      });
    }
  );

  content.querySelectorAll<HTMLButtonElement>("[data-variant-id]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const variantId = button.dataset.variantId;

        const selectedVariant = variants.find(
          (variant) => variant.id === variantId
        );

        if (!selectedVariant) return;

        const parent = section.parent?.();
        const index = parent ? parent.components().indexOf(section) : -1;

        section.replaceWith(selectedVariant.html);
        editor.Modal.close();

        setTimeout(() => {
          makeAllComponentsEditable(editor);

          const wrapper = editor.getWrapper();
          const allSections = wrapper?.find("section") || [];

          const nextSection =
            index >= 0 && allSections[index]
              ? allSections[index]
              : allSections[allSections.length - 1];

          if (nextSection) {
            editor.select(nextSection);
            nextSection.view?.el?.scrollIntoView?.({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 0);
      });
    }
  );

  editor.Modal.open({
    title: "",
    content,
  });
}

function renderVariantRealPreview(variant: SectionLayoutVariant) {
  return `
    <div class="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <div
        class="origin-top-right scale-[0.22]"
        style="
          width: 1240px;
          min-height: 960px;
          transform-origin: top right;
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