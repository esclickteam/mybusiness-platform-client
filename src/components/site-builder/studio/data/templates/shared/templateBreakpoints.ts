/**
 * Single source of truth for template responsive breakpoints.
 * Aligned with Tailwind defaults: md=768, lg=1024.
 */
export const TEMPLATE_BREAKPOINTS = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1023,
  desktopMin: 1024,
  editorFrame: {
    mobile: 390,
    tablet: 820,
    desktop: 1280,
  },
} as const;

export const TEMPLATE_MEDIA = {
  mobile: `(max-width: ${TEMPLATE_BREAKPOINTS.mobileMax}px)`,
  tablet: `(min-width: ${TEMPLATE_BREAKPOINTS.tabletMin}px) and (max-width: ${TEMPLATE_BREAKPOINTS.tabletMax}px)`,
  desktop: `(min-width: ${TEMPLATE_BREAKPOINTS.desktopMin}px)`,
} as const;

export const TEMPLATE_CONTAINER = "bizuply-template";

export function detectDeviceModeFromWidth(width: number) {
  if (width <= TEMPLATE_BREAKPOINTS.mobileMax) return "mobile" as const;
  if (width <= TEMPLATE_BREAKPOINTS.tabletMax) return "tablet" as const;
  return "desktop" as const;
}
