import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const vertexEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="vertex"] .vertex-hero-grid {
  background-image: linear-gradient(#00ff8822 1px, transparent 1px), linear-gradient(90deg, #00ff8822 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="vertex"] .vertex-accent-bar {
  background: #00ff88;
}

[data-template-id="vertex"] .vertex-marquee-item {
  border-color: #00ff8844;
}
`;
