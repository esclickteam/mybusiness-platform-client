/**
 * Studio Mobile/Tablet toggles only resize the canvas — Tailwind @media still
 * sees the desktop window. This CSS makes device preview match real responsive
 * behavior for all templates.
 */

function gridForce(device: "mobile" | "tablet", value: string, cols: number[]) {
  const root = `[data-visual-device="${device}"]`;
  return cols
    .map((n) => `${root} .grid-cols-${n}`)
    .join(",\n")
    .concat(` {\n  grid-template-columns: ${value} !important;\n}`);
}

function typeForce(
  device: "mobile" | "tablet",
  map: Record<string, string>,
) {
  const root = `[data-visual-device="${device}"]`;
  return Object.entries(map)
    .map(
      ([cls, size]) =>
        `${root} .${cls} {\n  font-size: ${size} !important;\n  line-height: 1.15 !important;\n}`,
    )
    .join("\n\n");
}

export const templateEditorDevicePreviewCss = `
/* —— Studio device preview ↔ real responsive parity (all templates) —— */

/* ===== MOBILE preview (390px) ===== */
${gridForce("mobile", "minmax(0, 1fr)", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}

${typeForce("mobile", {
  "text-9xl": "clamp(1.75rem, 8vw, 2.5rem)",
  "text-8xl": "clamp(1.7rem, 7.5vw, 2.35rem)",
  "text-7xl": "clamp(1.65rem, 7vw, 2.15rem)",
  "text-6xl": "clamp(1.55rem, 6.5vw, 1.95rem)",
  "text-5xl": "clamp(1.45rem, 6vw, 1.75rem)",
  "text-4xl": "clamp(1.35rem, 5.5vw, 1.55rem)",
  "text-3xl": "clamp(1.25rem, 5vw, 1.4rem)",
})}

/* Desktop nav pattern: hidden md:flex / hidden lg:flex → stay hidden */
[data-visual-device="mobile"] .hidden.md\\:flex,
[data-visual-device="mobile"] .hidden.lg\\:flex,
[data-visual-device="mobile"] .hidden.xl\\:flex,
[data-visual-device="mobile"] .hidden.sm\\:flex,
[data-visual-device="mobile"] .hidden.md\\:grid,
[data-visual-device="mobile"] .hidden.lg\\:grid,
[data-visual-device="mobile"] .hidden.md\\:block,
[data-visual-device="mobile"] .hidden.lg\\:block,
[data-visual-device="mobile"] .hidden.md\\:inline-flex,
[data-visual-device="mobile"] .hidden.lg\\:inline-flex {
  display: none !important;
}

/* Mobile chrome: flex/grid md:hidden → stay visible (hamburgers, icon toggles) */
[data-visual-device="mobile"] .flex.md\\:hidden,
[data-visual-device="mobile"] .flex.lg\\:hidden,
[data-visual-device="mobile"] .flex.xl\\:hidden,
[data-visual-device="mobile"] .flex.sm\\:hidden {
  display: flex !important;
}

[data-visual-device="mobile"] .inline-flex.md\\:hidden,
[data-visual-device="mobile"] .inline-flex.lg\\:hidden,
[data-visual-device="mobile"] .inline-flex.xl\\:hidden,
[data-visual-device="mobile"] .inline-flex.sm\\:hidden {
  display: inline-flex !important;
}

[data-visual-device="mobile"] .block.md\\:hidden,
[data-visual-device="mobile"] .block.lg\\:hidden {
  display: block !important;
}

[data-visual-device="mobile"] .grid.md\\:hidden,
[data-visual-device="mobile"] .grid.lg\\:hidden {
  display: grid !important;
}

/* Stack flex rows that only become rows on desktop */
[data-visual-device="mobile"] .flex-col.md\\:flex-row,
[data-visual-device="mobile"] .flex-col.lg\\:flex-row,
[data-visual-device="mobile"] .flex-col.sm\\:flex-row {
  flex-direction: column !important;
}

/* Compact oversized section padding in mobile preview */
[data-visual-device="mobile"] .px-10,
[data-visual-device="mobile"] .px-12,
[data-visual-device="mobile"] .px-14,
[data-visual-device="mobile"] .px-16,
[data-visual-device="mobile"] .px-20,
[data-visual-device="mobile"] .px-24 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

[data-visual-device="mobile"] .py-20,
[data-visual-device="mobile"] .py-24,
[data-visual-device="mobile"] .py-28,
[data-visual-device="mobile"] .py-32,
[data-visual-device="mobile"] .py-36,
[data-visual-device="mobile"] .py-40 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

/* ===== TABLET preview (820px) ===== */
${gridForce("tablet", "repeat(2, minmax(0, 1fr))", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}

[data-visual-device="tablet"] .grid-cols-1 {
  grid-template-columns: minmax(0, 1fr) !important;
}

[data-visual-device="tablet"] .grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

${typeForce("tablet", {
  "text-9xl": "3.25rem",
  "text-8xl": "2.95rem",
  "text-7xl": "2.65rem",
  "text-6xl": "2.35rem",
})}

/* lg-only desktop chrome stays hidden on tablet */
[data-visual-device="tablet"] .hidden.lg\\:flex,
[data-visual-device="tablet"] .hidden.xl\\:flex,
[data-visual-device="tablet"] .hidden.lg\\:grid,
[data-visual-device="tablet"] .hidden.lg\\:block,
[data-visual-device="tablet"] .hidden.lg\\:inline-flex {
  display: none !important;
}

[data-visual-device="tablet"] .flex.lg\\:hidden,
[data-visual-device="tablet"] .flex.xl\\:hidden {
  display: flex !important;
}

[data-visual-device="tablet"] .inline-flex.lg\\:hidden,
[data-visual-device="tablet"] .inline-flex.xl\\:hidden {
  display: inline-flex !important;
}

[data-visual-device="tablet"] .flex-col.lg\\:flex-row {
  flex-direction: column !important;
}
`.trim();
