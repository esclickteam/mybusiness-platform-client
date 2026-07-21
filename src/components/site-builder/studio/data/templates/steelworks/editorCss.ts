import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const steelworksEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="steelworks"] .steelworks-hero-grid {
  background-image: linear-gradient(#ff6b2c22 1px, transparent 1px), linear-gradient(90deg, #ff6b2c22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="steelworks"] .steelworks-accent-bar {
  background: #ff6b2c;
}

[data-template-id="steelworks"] .steelworks-marquee-item {
  border-color: #ff6b2c44;
}
`;
