export const spalcioEditorCss = `
[data-template-id="spalcio"],
[data-template-id="spalcio"] * {
  box-sizing: border-box;
}

[data-template-id="spalcio"] {
  direction: rtl;
  background: #f7f3ec;
  color: #111827;
  font-family:
    Heebo,
    Assistant,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  text-align: right;
  overflow-x: hidden;
}

[data-template-id="spalcio"] a {
  text-decoration: none;
}

[data-template-id="spalcio"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="spalcio"] input,
[data-template-id="spalcio"] textarea,
[data-template-id="spalcio"] button {
  font-family: inherit;
}

[data-template-id="spalcio"] header,
[data-template-id="spalcio"] section,
[data-template-id="spalcio"] footer {
  direction: rtl;
}

/* כפתור ראשי — צבעוני ולא שחור */
[data-template-id="spalcio"] .spalcio-primary-btn,
[data-template-id="spalcio"] .spalcio-primary-btn *,
[data-template-id="spalcio"] a.spalcio-primary-btn,
[data-template-id="spalcio"] button.spalcio-primary-btn {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

[data-template-id="spalcio"] .spalcio-primary-btn {
  background:
    radial-gradient(circle at 18% 12%, rgba(255,255,255,0.34), transparent 34%),
    linear-gradient(135deg, #2563eb 0%, #3b82f6 48%, #7c3aed 100%) !important;
  border: 1px solid rgba(255,255,255,0.36) !important;
  box-shadow:
    0 18px 45px rgba(37, 99, 235, 0.28),
    inset 0 1px 0 rgba(255,255,255,0.24);
}

[data-template-id="spalcio"] .spalcio-primary-btn:hover {
  transform: translateY(-2px);
  background:
    radial-gradient(circle at 18% 12%, rgba(255,255,255,0.38), transparent 34%),
    linear-gradient(135deg, #1d4ed8 0%, #2563eb 48%, #6d28d9 100%) !important;
  box-shadow:
    0 24px 70px rgba(37, 99, 235, 0.36),
    inset 0 1px 0 rgba(255,255,255,0.26);
}

[data-template-id="spalcio"] .spalcio-secondary-btn,
[data-template-id="spalcio"] a.spalcio-secondary-btn,
[data-template-id="spalcio"] button.spalcio-secondary-btn {
  color: #1e3a8a !important;
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(37, 99, 235, 0.18) !important;
  box-shadow: 0 14px 40px rgba(37, 99, 235, 0.08);
}

[data-template-id="spalcio"] .spalcio-secondary-btn:hover {
  background: #eff6ff !important;
  border-color: rgba(37, 99, 235, 0.3) !important;
  transform: translateY(-2px);
}

/* זכוכית על תמונת ההירו */
[data-template-id="spalcio"] .spalcio-glass {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
}

/* כרטיסים */
[data-template-id="spalcio"] .spalcio-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

[data-template-id="spalcio"] .spalcio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 70px rgba(37, 99, 235, 0.12);
}

[data-template-id="spalcio"] .spalcio-premium-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.91)),
    radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 36%);
  border: 1px solid rgba(37, 99, 235, 0.12);
}

/* אם משתמשים שוב בפאנל כהה — שלא יהיה לבן על לבן */
[data-template-id="spalcio"] .spalcio-dark-panel {
  background:
    radial-gradient(circle at 18% 12%, rgba(59,130,246,0.28), transparent 35%),
    radial-gradient(circle at 88% 82%, rgba(124,58,237,0.2), transparent 34%),
    linear-gradient(135deg, #0f172a 0%, #172554 52%, #1e1b4b 100%) !important;
  color: #ffffff !important;
}

[data-template-id="spalcio"] .spalcio-dark-panel *,
[data-template-id="spalcio"] .spalcio-dark-panel [data-editable="true"] {
  color: inherit;
}

[data-template-id="spalcio"] .spalcio-dark-panel h1,
[data-template-id="spalcio"] .spalcio-dark-panel h2,
[data-template-id="spalcio"] .spalcio-dark-panel h3 {
  color: #ffffff !important;
}

[data-template-id="spalcio"] .spalcio-dark-panel p {
  color: rgba(255, 255, 255, 0.72) !important;
}

/* עריכה */
[data-template-id="spalcio"] .spalcio-editable,
[data-template-id="spalcio"] [data-editable="true"] {
  cursor: text;
}

[data-template-id="spalcio"] [data-editable="true"]:hover {
  outline: 2px dashed rgba(37, 99, 235, 0.45);
  outline-offset: 4px;
}

[data-template-id="spalcio"] [data-section-id] {
  position: relative;
}

[data-template-id="spalcio"] [data-section-id]:hover::after {
  content: attr(data-section-title);
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 20;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.94);
  color: #ffffff;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

/* תמונות */
[data-template-id="spalcio"] .spalcio-hero-image,
[data-template-id="spalcio"] .spalcio-project-image,
[data-template-id="spalcio"] .spalcio-about-image {
  user-select: none;
}

/* טופס */
[data-template-id="spalcio"] .spalcio-form input,
[data-template-id="spalcio"] .spalcio-form textarea {
  direction: rtl;
  text-align: right;
}

[data-template-id="spalcio"] .spalcio-form input::placeholder,
[data-template-id="spalcio"] .spalcio-form textarea::placeholder {
  color: #94a3b8;
}

[data-template-id="spalcio"] .spalcio-form input:focus,
[data-template-id="spalcio"] .spalcio-form textarea:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* תיקון טקסט לבן במקומות כהים */
[data-template-id="spalcio"] .text-white,
[data-template-id="spalcio"] .text-white *,
[data-template-id="spalcio"] [class*="text-white"] {
  color: #ffffff !important;
}

/* תיקון למספרים/אייקונים בכרטיסים */
[data-template-id="spalcio"] .bg-blue-600,
[data-template-id="spalcio"] .bg-slate-950 {
  color: #ffffff !important;
}

[data-template-id="spalcio"] .bg-blue-600 *,
[data-template-id="spalcio"] .bg-slate-950 * {
  color: #ffffff !important;
  stroke: #ffffff !important;
}

@media (max-width: 768px) {
  [data-template-id="spalcio"] {
    overflow-x: hidden;
  }

  [data-template-id="spalcio"] h1 {
    font-size: clamp(2.7rem, 13vw, 4.2rem);
    line-height: 0.98;
  }

  [data-template-id="spalcio"] h2 {
    font-size: clamp(2.15rem, 9vw, 3.2rem);
    line-height: 1.04;
  }

  [data-template-id="spalcio"] [data-section-id]:hover::after {
    display: none;
  }
}
`;

export default spalcioEditorCss;