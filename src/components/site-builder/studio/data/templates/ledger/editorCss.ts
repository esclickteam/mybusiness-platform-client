import { rectEditorCssBase } from "../shared/rectEditorCssBase";

export const ledgerEditorCss = `
${rectEditorCssBase}

[data-template-id="ledger"] .ledger-hero-grid {
  background-image: linear-gradient(#0d5c4522 1px, transparent 1px), linear-gradient(90deg, #0d5c4522 1px, transparent 1px);
  background-size: 56px 56px;
}

[data-template-id="ledger"] .ledger-accent-bar {
  background: #0d5c45;
}

[data-template-id="ledger"] .ledger-marquee-item {
  border-color: #0d5c4544;
}
`;
