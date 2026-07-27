export type CheckoutAppearance = {
  primaryColor: string;
  buttonTextColor: string;
  accentColor: string;
  panelBackground: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  buttonRadius: number;
  panelRadius: number;
  overlayColor: string;
  title: string;
  buttonLabel: string;
};

export const DEFAULT_CHECKOUT_APPEARANCE: CheckoutAppearance = {
  primaryColor: "#0f172a",
  buttonTextColor: "#ffffff",
  accentColor: "#0f172a",
  panelBackground: "#ffffff",
  textColor: "#0f172a",
  mutedTextColor: "#64748b",
  borderColor: "#e2e8f0",
  buttonRadius: 12,
  panelRadius: 16,
  overlayColor: "rgba(15, 23, 42, 0.42)",
  title: "",
  buttonLabel: "",
};

export const CHECKOUT_APPEARANCE_PRESETS: Array<{
  id: string;
  label: string;
  values: Partial<CheckoutAppearance>;
}> = [
  {
    id: "classic",
    label: "קלאסי",
    values: {
      primaryColor: "#0f172a",
      accentColor: "#0f172a",
      buttonTextColor: "#ffffff",
      panelBackground: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#64748b",
      borderColor: "#e2e8f0",
    },
  },
  {
    id: "violet",
    label: "סגול מותג",
    values: {
      primaryColor: "#6d28d9",
      accentColor: "#7c3aed",
      buttonTextColor: "#ffffff",
      panelBackground: "#ffffff",
      textColor: "#1e1b4b",
      mutedTextColor: "#6b7280",
      borderColor: "#e9d5ff",
    },
  },
  {
    id: "luxury",
    label: "יוקרה",
    values: {
      primaryColor: "#111111",
      accentColor: "#111111",
      buttonTextColor: "#f5f0e8",
      panelBackground: "#faf8f5",
      textColor: "#111111",
      mutedTextColor: "#6b7280",
      borderColor: "#e7e0d6",
    },
  },
  {
    id: "emerald",
    label: "ירוק",
    values: {
      primaryColor: "#047857",
      accentColor: "#059669",
      buttonTextColor: "#ffffff",
      panelBackground: "#ffffff",
      textColor: "#064e3b",
      mutedTextColor: "#64748b",
      borderColor: "#d1fae5",
    },
  },
  {
    id: "rose",
    label: "ורוד",
    values: {
      primaryColor: "#be123c",
      accentColor: "#e11d48",
      buttonTextColor: "#ffffff",
      panelBackground: "#ffffff",
      textColor: "#881337",
      mutedTextColor: "#64748b",
      borderColor: "#fecdd3",
    },
  },
];

function isHexColor(value: unknown) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
    String(value || "").trim(),
  );
}

function isCssColor(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return false;
  if (isHexColor(raw)) return true;
  if (/^rgba?\(/i.test(raw)) return true;
  if (/^hsla?\(/i.test(raw)) return true;
  return false;
}

export function normalizeCheckoutAppearance(
  input?: Partial<CheckoutAppearance> | null,
): CheckoutAppearance {
  const src = input && typeof input === "object" ? input : {};
  const pickColor = (value: unknown, fallback: string) =>
    isCssColor(value) ? String(value).trim() : fallback;

  const buttonRadius = Number(src.buttonRadius);
  const panelRadius = Number(src.panelRadius);

  return {
    primaryColor: pickColor(src.primaryColor, DEFAULT_CHECKOUT_APPEARANCE.primaryColor),
    buttonTextColor: pickColor(
      src.buttonTextColor,
      DEFAULT_CHECKOUT_APPEARANCE.buttonTextColor,
    ),
    accentColor: pickColor(src.accentColor, DEFAULT_CHECKOUT_APPEARANCE.accentColor),
    panelBackground: pickColor(
      src.panelBackground,
      DEFAULT_CHECKOUT_APPEARANCE.panelBackground,
    ),
    textColor: pickColor(src.textColor, DEFAULT_CHECKOUT_APPEARANCE.textColor),
    mutedTextColor: pickColor(
      src.mutedTextColor,
      DEFAULT_CHECKOUT_APPEARANCE.mutedTextColor,
    ),
    borderColor: pickColor(src.borderColor, DEFAULT_CHECKOUT_APPEARANCE.borderColor),
    buttonRadius: Number.isFinite(buttonRadius)
      ? Math.min(28, Math.max(4, Math.round(buttonRadius)))
      : DEFAULT_CHECKOUT_APPEARANCE.buttonRadius,
    panelRadius: Number.isFinite(panelRadius)
      ? Math.min(36, Math.max(8, Math.round(panelRadius)))
      : DEFAULT_CHECKOUT_APPEARANCE.panelRadius,
    overlayColor: pickColor(
      src.overlayColor,
      DEFAULT_CHECKOUT_APPEARANCE.overlayColor,
    ),
    title: String(src.title || "").trim().slice(0, 80),
    buttonLabel: String(src.buttonLabel || "").trim().slice(0, 60),
  };
}
