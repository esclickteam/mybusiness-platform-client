export const arboraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Frank+Ruhl+Libre:wght@500;700&display=swap");

[data-template-id="arbora"],
[data-template-id="arbora-preview"] {
  direction: rtl;
  text-align: right;
  font-family: "Assistant", Heebo, sans-serif;
}

[data-template-id="arbora"] .tpl-display,
[data-template-id="arbora-preview"] .tpl-display {
  font-family: "Assistant", "Assistant", serif;
}

[data-visual-template-canvas="true"] [data-template-id="arbora"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
