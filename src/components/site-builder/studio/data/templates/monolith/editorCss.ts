import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const monolithEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="monolith"] .monolith-hero-grid {
  background-image: linear-gradient(#c8a96a22 1px, transparent 1px), linear-gradient(90deg, #c8a96a22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="monolith"] .monolith-accent-bar {
  background: #c8a96a;
}

[data-template-id="monolith"] .monolith-marquee-item {
  border-color: #c8a96a44;
}
`;
