export const cinderEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="cinder"],
[data-template-id="cinder-preview"] {
  direction: rtl;
  text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
}

[data-template-id="cinder"] .tpl-display,
[data-template-id="cinder-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="cinder"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
