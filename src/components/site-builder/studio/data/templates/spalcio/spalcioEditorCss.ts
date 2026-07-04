export const spalcioEditorCss = `
[data-template-id="spalcio"],
[data-template-id="spalcio"] * {
  box-sizing: border-box;
}

[data-template-id="spalcio"] {
  direction: rtl;
  background: #ffffff;
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

[data-template-id="spalcio"] header {
  direction: rtl;
}

[data-template-id="spalcio"] section {
  direction: rtl;
}

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
  background: rgba(15, 23, 42, 0.92);
  color: #ffffff;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

[data-template-id="spalcio"] .spalcio-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

[data-template-id="spalcio"] .spalcio-card:hover {
  transform: translateY(-4px);
}

[data-template-id="spalcio"] .spalcio-hero-image,
[data-template-id="spalcio"] .spalcio-project-image,
[data-template-id="spalcio"] .spalcio-about-image {
  user-select: none;
}

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
  border-color: #111827;
}

@media (max-width: 768px) {
  [data-template-id="spalcio"] {
    overflow-x: hidden;
  }

  [data-template-id="spalcio"] h1 {
    font-size: clamp(3rem, 14vw, 4.5rem);
    line-height: 0.98;
  }

  [data-template-id="spalcio"] h2 {
    font-size: clamp(2.35rem, 10vw, 3.5rem);
    line-height: 1.02;
  }

  [data-template-id="spalcio"] [data-section-id]:hover::after {
    display: none;
  }
}
`;

export default spalcioEditorCss;