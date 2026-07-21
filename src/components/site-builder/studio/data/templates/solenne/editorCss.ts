export const solenneEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="solenne"],
[data-template-id="solenne-preview"] {
  direction: rtl;
  text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
}

[data-template-id="solenne"] .tpl-display,
[data-template-id="solenne-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="solenne"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
