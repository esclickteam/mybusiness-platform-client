export const meridianEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="meridian"],
[data-template-id="meridian-preview"] {
  direction: rtl;
  text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
}

[data-template-id="meridian"] .tpl-display,
[data-template-id="meridian-preview"] .tpl-display {
  font-family: "Frank Ruhl Libre", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="meridian"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
