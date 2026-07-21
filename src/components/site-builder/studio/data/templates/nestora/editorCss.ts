export const nestoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Heebo:wght@400;500;700&display=swap");
[data-template-id="nestora"], [data-template-id="nestora-preview"] {
  direction: rtl; text-align: right; font-family: "Heebo", Heebo, sans-serif;
}
[data-template-id="nestora"] .tpl-display, [data-template-id="nestora-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}
[data-visual-template-canvas="true"] [data-template-id="nestora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}
`;
