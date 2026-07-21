export const parcelEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@500;700&family=Heebo:wght@400;500;700&display=swap");
[data-template-id="parcel"], [data-template-id="parcel-preview"] {
  direction: rtl; text-align: right; font-family: "Heebo", Heebo, sans-serif;
}
[data-template-id="parcel"] .tpl-display, [data-template-id="parcel-preview"] .tpl-display {
  font-family: "Assistant", "Heebo", serif;
}
[data-visual-template-canvas="true"] [data-template-id="parcel"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}
`;
