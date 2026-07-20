export const idoEditorCss = `
[data-template-id="ido"] {
  position: relative;
  direction: rtl;
  text-align: right;
}

[data-template-id="ido"] .text-center,
[data-template-id="ido"] [data-ido-align="center"] {
  text-align: center !important;
}

[data-template-id="ido"] input,
[data-template-id="ido"] textarea,
[data-template-id="ido"] select {
  text-align: right;
  direction: rtl;
}

[data-template-id="ido"] input::placeholder,
[data-template-id="ido"] textarea::placeholder {
  text-align: right;
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

/*
  בעורך — מאפשר גרירה/ch positioning של טופס יצירת קשר ושדותיו.
  position:relative על הטופס והקופסה החיצונית; grid נשאר לפריסה רגילה
  אבל translate/layout מהעורך עובד על כל שדה בנפרד.
*/
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] [data-visual-edit-id="booking.formBox"],
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] form[data-bizuply-form-builder="true"] {
  position: relative !important;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] form[data-bizuply-form-builder="true"] [data-visual-edit-id] {
  touch-action: none;
  cursor: grab;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] form[data-bizuply-form-builder="true"] [data-visual-edit-id]:active {
  cursor: grabbing;
}
`;
