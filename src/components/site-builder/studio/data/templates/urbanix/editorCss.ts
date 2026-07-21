export const urbanixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@600;800&family=Heebo:wght@400;500;700&display=swap");
[data-template-id="urbanix"], [data-template-id="urbanix-preview"] {
  direction: rtl; text-align: right; font-family: "Heebo", Heebo, sans-serif;
}
[data-template-id="urbanix"] .tpl-display, [data-template-id="urbanix-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", serif;
}
[data-visual-template-canvas="true"] [data-template-id="urbanix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}
`;
