import { rectEditorCssBase } from "../shared/rectEditorCssBase";

export const framehausEditorCss = `
${rectEditorCssBase}

[data-template-id="framehaus"] .framehaus-hero-grid {
  background-image: linear-gradient(#ff3b3022 1px, transparent 1px), linear-gradient(90deg, #ff3b3022 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="framehaus"] .framehaus-accent-bar {
  background: #ff3b30;
}

[data-template-id="framehaus"] .framehaus-marquee-item {
  border-color: #ff3b3044;
}
`;
