import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { defaultCanvasCss, defaultWebsiteHtml } from "./canvasTheme";
import { studioElements } from "../data/elementLibrary";

type InitEditorArgs = {
  container: HTMLElement;
  stylesContainer?: HTMLElement | null;
  traitsContainer?: HTMLElement | null;
  layersContainer?: HTMLElement | null;
  onReady?: (editor: Editor) => void;
  onSelect?: () => void;
};

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
            "min-height",
            "max-width",
            "z-index",
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
          properties: ["border-radius", "border", "box-shadow"],
        },
        {
          name: "אפקטים ותנועה",
          open: false,
          properties: ["transform", "transition", "filter", "backdrop-filter"],
        },
      ],
    },

    assetManager: {
      upload: false,
      assets: [
        {
          src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
          name: "Beauty hero",
        },
        {
          src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
          name: "Beauty gallery",
        },
        {
          src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90",
          name: "Spa",
        },
      ],
    },

    deviceManager: {
      devices: [
        { name: "Desktop", width: "" },
        { name: "Tablet", width: "768px", widthMedia: "992px" },
        { name: "Mobile", width: "390px", widthMedia: "480px" },
      ],
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
        outline: 3px solid #8B5CF6 !important;
        outline-offset: 3px !important;
      }
    `);

    onReady?.(editor);
  });

  editor.on("component:selected", () => {
    onSelect?.();
  });

  return editor;
}