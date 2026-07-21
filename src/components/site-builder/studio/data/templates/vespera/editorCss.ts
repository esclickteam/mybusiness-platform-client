export const vesperaEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="vespera"],
[data-template-id="vespera-preview"] {
  direction: rtl;
  text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
}

[data-template-id="vespera"] .tpl-display,
[data-template-id="vespera-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="vespera"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
