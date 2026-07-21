export const rivaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&family=Heebo:wght@400;500;700&display=swap");
[data-template-id="rivara"], [data-template-id="rivara-preview"] {
  direction: rtl; text-align: right; font-family: "Heebo", Heebo, sans-serif;
}
[data-template-id="rivara"] .tpl-display, [data-template-id="rivara-preview"] .tpl-display {
  font-family: "Frank Ruhl Libre", "Heebo", serif;
}
[data-visual-template-canvas="true"] [data-template-id="rivara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}
`;
