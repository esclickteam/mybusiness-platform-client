export const idoEditorCss = `
[data-template-id="ido"] {
  position: relative;
}

/*
  בעורך, position:fixed בורח מהקנבס ונעלם מאחורי ה-chrome.
  sticky שומר על אותו מראה כמו בתצוגה/באתר בזמן גלילה.
*/
[data-template-id="ido"] > header,
[data-visual-template-canvas="true"] [data-template-id="ido"] > header {
  position: sticky !important;
  top: 0 !important;
  left: auto !important;
  right: auto !important;
  width: 100%;
  z-index: 50 !important;
}
`;
