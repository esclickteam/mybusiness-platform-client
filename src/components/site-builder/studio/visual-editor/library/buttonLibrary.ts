import { absoluteLayout, buttonNode } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

const BUTTON_LABELS = [
  "לפרטים נוספים",
  "התחילו עכשיו",
  "צרו קשר",
  "גלו עוד",
  "הזמינו עכשיו",
  "לצפייה",
  "קנו עכשיו",
  "למידע נוסף",
  "הצטרפו אלינו",
  "בואו נדבר",
];

const PALETTES = [
  { bg: "#7c3aed", color: "#ffffff", border: "0", name: "סגול" },
  { bg: "#111827", color: "#ffffff", border: "0", name: "שחור" },
  { bg: "#ffffff", color: "#111827", border: "2px solid #111827", name: "לבן" },
  { bg: "#2563eb", color: "#ffffff", border: "0", name: "כחול" },
  { bg: "#059669", color: "#ffffff", border: "0", name: "ירוק" },
  { bg: "#dc2626", color: "#ffffff", border: "0", name: "אדום" },
  { bg: "#f59e0b", color: "#111827", border: "0", name: "כתום" },
  { bg: "#ec4899", color: "#ffffff", border: "0", name: "ורוד" },
  { bg: "#0891b2", color: "#ffffff", border: "0", name: "טורקיז" },
  { bg: "transparent", color: "#7c3aed", border: "2px solid #7c3aed", name: "מסגרת סגול" },
];

const RADII = [
  { value: "999px", label: "עגול" },
  { value: "18px", label: "רך" },
  { value: "10px", label: "בינוני" },
  { value: "4px", label: "חד" },
  { value: "0px", label: "מרובע" },
];

const GRADIENTS = [
  "linear-gradient(90deg,#ff6a00 0%,#7c3aed 100%)",
  "linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)",
  "linear-gradient(90deg,#ec4899 0%,#f59e0b 100%)",
  "linear-gradient(135deg,#059669 0%,#0891b2 100%)",
  "linear-gradient(90deg,#111827 0%,#4b5563 100%)",
];

function buildButtonStyle(options: {
  bg: string;
  color: string;
  border: string;
  radius: string;
  gradient?: string;
  shadow?: string;
  fontSize?: string;
  padding?: string;
}) {
  const base: Record<string, string> = {
    color: options.color,
    fontSize: options.fontSize || "16px",
    fontWeight: "900",
    borderRadius: options.radius,
    padding: options.padding || "14px 28px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: options.border,
  };

  if (options.gradient) {
    base.backgroundImage = options.gradient;
    base.color = "#ffffff";
    base.border = "0";
  } else if (options.bg === "transparent") {
    base.backgroundColor = "transparent";
  } else if (options.bg.includes("rgba")) {
    base.backgroundColor = options.bg;
    base.backdropFilter = "blur(8px)";
  } else {
    base.backgroundColor = options.bg;
  }

  if (options.shadow) {
    base.boxShadow = options.shadow;
  }

  return base;
}

export const BUTTON_LIBRARY: VisualLibraryElementItem[] = Array.from(
  { length: 100 },
  (_, index) => {
    const palette = PALETTES[index % PALETTES.length];
    const radius = RADII[index % RADII.length];
    const label = BUTTON_LABELS[index % BUTTON_LABELS.length];
    const isGradient = index % 11 === 0;
    const isGlass = index % 13 === 0;
    const isSoft = index % 17 === 0;
    const width = 150 + (index % 5) * 18;

    const style = buildButtonStyle({
      bg: isGlass
        ? "rgba(255,255,255,0.14)"
        : isSoft
          ? `${palette.bg}22`
          : palette.bg,
      color: isSoft ? palette.bg : palette.color,
      border: isGlass
        ? "1px solid rgba(255,255,255,0.42)"
        : isSoft
          ? `2px solid ${palette.bg}`
          : palette.border,
      radius: radius.value,
      gradient: isGradient ? GRADIENTS[index % GRADIENTS.length] : undefined,
      shadow:
        index % 7 === 0
          ? "0 14px 30px rgba(15,23,42,0.18)"
          : index % 9 === 0
            ? "0 8px 20px rgba(124,58,237,0.28)"
            : undefined,
      fontSize: index % 19 === 0 ? "14px" : index % 23 === 0 ? "18px" : "16px",
      padding:
        index % 21 === 0 ? "10px 22px" : index % 25 === 0 ? "16px 34px" : "14px 28px",
    });

    const title = `כפתור ${palette.name} ${radius.label} ${index + 1}`;

    return {
      id: `button-lib-${index + 1}`,
      kind: "element" as const,
      tab: "elements" as const,
      category: "buttons" as const,
      title,
      description: `כפתור ${palette.name} בסגנון ${radius.label}`,
      keywords: ["כפתור", palette.name, radius.label, label],
      previewHtml: `<span style="display:inline-flex;align-items:center;justify-content:center;border-radius:${radius.value};padding:10px 20px;font-weight:800;font-size:13px;background:${isGradient ? GRADIENTS[index % GRADIENTS.length] : palette.bg};color:${palette.color};border:${palette.border}">${label}</span>`,
      nodes: [
        buttonNode(
          "root",
          label,
          style,
          absoluteLayout(40 + (index % 4) * 12, 40 + (index % 3) * 10, `${width}px`, "52px", 20 + (index % 5)),
        ),
      ],
    };
  },
);
