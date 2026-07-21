import { rectTemplateEditorCssBase } from "../shared/rectTemplateEditorCssBase";

export const horizonEditorCss = `
${rectTemplateEditorCssBase}

[data-template-id="horizon"] .horizon-hero-grid {
  background-image: linear-gradient(#b8956b22 1px, transparent 1px), linear-gradient(90deg, #b8956b22 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="horizon"] .horizon-accent-bar {
  background: #b8956b;
}

[data-template-id="horizon"] .horizon-marquee-item {
  border-color: #b8956b44;
}
`;
