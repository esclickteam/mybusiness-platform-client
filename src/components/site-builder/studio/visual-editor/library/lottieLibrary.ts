import { absoluteLayout } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

const LOTTIE_PLAYER =
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";

export const LOTTIE_LIBRARY: VisualLibraryElementItem[] = [
  {
    id: "lottie-success",
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: "אנימציית הצלחה",
    description: "סימון V ירוק מונפש",
    keywords: ["lottie", "אנימציה", "הצלחה", "וי"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:28px">✓</div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "אנימציית הצלחה",
        tagName: "div",
        content: {
          html: `<script src="${LOTTIE_PLAYER}"></script><lottie-player src="https://assets2.lottiefiles.com/packages/lf20_jbrwj3pe.json" background="transparent" speed="1" style="width:100%;height:100%" loop autoplay></lottie-player>`,
          embedType: "lottie",
        },
        style: {
          width: "180px",
          height: "180px",
          backgroundColor: "transparent",
        },
        layout: absoluteLayout(40, 40, "180px", "180px", 30),
      },
    ],
  },
  {
    id: "lottie-loading",
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: "אנימציית טעינה",
    description: "ספינר עדין לטעינה",
    keywords: ["lottie", "אנימציה", "טעינה", "loader"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:22px">◌</div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "אנימציית טעינה",
        tagName: "div",
        content: {
          html: `<script src="${LOTTIE_PLAYER}"></script><lottie-player src="https://assets9.lottiefiles.com/packages/lf20_usmfx6bp.json" background="transparent" speed="1" style="width:100%;height:100%" loop autoplay></lottie-player>`,
          embedType: "lottie",
        },
        style: {
          width: "120px",
          height: "120px",
          backgroundColor: "transparent",
        },
        layout: absoluteLayout(40, 40, "120px", "120px", 30),
      },
    ],
  },
  {
    id: "lottie-shopping",
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: "אנימציית קניות",
    description: "שקית קניות מונפשת",
    keywords: ["lottie", "אנימציה", "חנות", "קניות"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:22px">🛍</div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "אנימציית קניות",
        tagName: "div",
        content: {
          html: `<script src="${LOTTIE_PLAYER}"></script><lottie-player src="https://assets3.lottiefiles.com/packages/lf20_ydo1amjm.json" background="transparent" speed="1" style="width:100%;height:100%" loop autoplay></lottie-player>`,
          embedType: "lottie",
        },
        style: {
          width: "200px",
          height: "200px",
          backgroundColor: "transparent",
        },
        layout: absoluteLayout(40, 40, "200px", "200px", 30),
      },
    ],
  },
  {
    id: "lottie-heart",
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: "אנימציית לב",
    description: "לב פועם לאהבת מותג",
    keywords: ["lottie", "אנימציה", "לב", "אהבה"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;color:#ef4444">♥</div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "אנימציית לב",
        tagName: "div",
        content: {
          html: `<script src="${LOTTIE_PLAYER}"></script><lottie-player src="https://assets4.lottiefiles.com/packages/lf20_qmfs6c3i.json" background="transparent" speed="1" style="width:100%;height:100%" loop autoplay></lottie-player>`,
          embedType: "lottie",
        },
        style: {
          width: "160px",
          height: "160px",
          backgroundColor: "transparent",
        },
        layout: absoluteLayout(40, 40, "160px", "160px", 30),
      },
    ],
  },
];
