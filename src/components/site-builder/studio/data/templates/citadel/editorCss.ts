import { rectEditorCssBase } from "../shared/rectEditorCssBase";

export const citadelEditorCss = `
${rectEditorCssBase}

[data-template-id="citadel"] .citadel-hero-grid {
  background-image: linear-gradient(#39ff1422 1px, transparent 1px), linear-gradient(90deg, #39ff1422 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="citadel"] .citadel-accent-bar {
  background: #39ff14;
}

[data-template-id="citadel"] .citadel-marquee-item {
  border-color: #39ff1444;
}
`;
