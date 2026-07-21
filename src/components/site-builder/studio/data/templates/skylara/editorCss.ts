export const skylaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&family=Heebo:wght@400;500;700&display=swap");
[data-template-id="skylara"], [data-template-id="skylara-preview"] {
  direction: rtl; text-align: right; font-family: "Heebo", Heebo, sans-serif;
}
[data-template-id="skylara"] .tpl-display, [data-template-id="skylara-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", serif;
}
[data-visual-template-canvas="true"] [data-template-id="skylara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}
`;
