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
  בעורך — גרירה חופשית של שדות הטופס:
  מכבים grid, מגדירים מיכל יחסי ושדות עם position:absolute + ברירות מחדל לערימה.
  translate/layout מהעורך נשמרים inline ולא נדרסים.
*/
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] [data-visual-edit-id="booking.formBox"],
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] form[data-bizuply-form-builder="true"] {
  position: relative !important;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-fields {
  display: block !important;
  position: relative !important;
  min-height: 520px !important;
  width: 100% !important;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  touch-action: none;
  cursor: grab;
  z-index: 1;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot:active {
  cursor: grabbing;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot input,
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot textarea,
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot select,
[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot button {
  pointer-events: none;
  width: 100% !important;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.name"] {
  top: 0;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.phone"] {
  top: 72px;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.interest"] {
  top: 144px;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.budget"] {
  top: 216px;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.message"] {
  top: 288px;
}

[data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-id="ido"] .ido-form-field-slot[data-visual-edit-id="booking.form.submit"] {
  top: 420px;
}
`;
