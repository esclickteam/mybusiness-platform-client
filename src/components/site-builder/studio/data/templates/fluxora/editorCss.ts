export const fluxoraEditorCss = `
[data-template-id="fluxora"],
[data-template-id="fluxora"] {
  position: relative;
  direction: rtl;
  text-align: right;
}

[data-template-id="fluxora"] input,
[data-template-id="fluxora"] textarea,
[data-template-id="fluxora"] select,
[data-template-id="fluxora"] input,
[data-template-id="fluxora"] textarea,
[data-template-id="fluxora"] select {
  text-align: right;
  direction: rtl;
}

[data-visual-template-canvas="true"] [data-template-id="fluxora"] > header {
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
`;
