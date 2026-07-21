import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const kineticEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="kinetic"] .kinetic-hero-grid {
  background-image: linear-gradient(#ff2d2d22 1px, transparent 1px), linear-gradient(90deg, #ff2d2d22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="kinetic"] .kinetic-accent-bar {
  background: #ff2d2d;
}

[data-template-id="kinetic"] .kinetic-marquee-item {
  border-color: #ff2d2d44;
}
`;
