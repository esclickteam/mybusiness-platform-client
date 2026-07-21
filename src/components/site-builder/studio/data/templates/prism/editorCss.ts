import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const prismEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="prism"] .prism-hero-grid {
  background-image: linear-gradient(#0057ff22 1px, transparent 1px), linear-gradient(90deg, #0057ff22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="prism"] .prism-accent-bar {
  background: #0057ff;
}

[data-template-id="prism"] .prism-marquee-item {
  border-color: #0057ff44;
}
`;
