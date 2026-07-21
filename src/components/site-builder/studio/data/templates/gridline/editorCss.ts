import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const gridlineEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="gridline"] .gridline-hero-grid {
  background-image: linear-gradient(#11111122 1px, transparent 1px), linear-gradient(90deg, #11111122 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="gridline"] .gridline-accent-bar {
  background: #111111;
}

[data-template-id="gridline"] .gridline-marquee-item {
  border-color: #11111144;
}
`;
