export const verdantEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

[data-template-id="verdant"],
[data-template-id="verdant-preview"] {
  --v-bg: #0e1210;
  --v-surface: #161c19;
  --v-moss: #7a9a78;
  --v-moss-deep: #5c7a5e;
  --v-stone: #c8c2b6;
  --v-text: #f2efe8;
  --v-muted: #9a958c;
  font-family: "DM Sans", sans-serif;
  color: var(--v-text);
  background: var(--v-bg);
}

[data-template-id="verdant"] .v-display,
[data-template-id="verdant-preview"] .v-display {
  font-family: "Cormorant Garamond", serif;
}

@keyframes v-fade-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes v-kenburns {
  from { transform: scale(1.06); }
  to { transform: scale(1); }
}
@keyframes v-line {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

[data-template-id="verdant"] .v-anim,
[data-template-id="verdant-preview"] .v-anim {
  animation: v-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
[data-template-id="verdant"] .v-anim-d1,
[data-template-id="verdant-preview"] .v-anim-d1 { animation-delay: 0.12s; }
[data-template-id="verdant"] .v-anim-d2,
[data-template-id="verdant-preview"] .v-anim-d2 { animation-delay: 0.24s; }
[data-template-id="verdant"] .v-kenburns,
[data-template-id="verdant-preview"] .v-kenburns {
  animation: v-kenburns 12s ease-out both;
}
[data-template-id="verdant"] .v-underline,
[data-template-id="verdant-preview"] .v-underline {
  transform-origin: right center;
  animation: v-line 1s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
`;
