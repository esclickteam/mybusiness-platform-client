export const pitchoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
[data-template-id="pitchora"], [data-template-id="pitchora-preview"] {
  --p: #FFB703;
  --a: #FB8500;
  --bg: #05070F;
  --surface: #101522;
  --text: #F8FAFC;
  --muted: #B7C2D6;
  --dark: #02040A;
  font-family: "Assistant", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="pitchora"] .text-center,
[data-template-id="pitchora-preview"] .text-center { text-align: center; }
[data-template-id="pitchora"] .ag-display,
[data-template-id="pitchora-preview"] .ag-display { font-family: "Space Grotesk", "Assistant", sans-serif; }
[data-template-id="pitchora"] .ag-card,
[data-template-id="pitchora-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="pitchora"] .ag-card:hover,
[data-template-id="pitchora-preview"] .ag-card:hover {
  transform: translateY(-6px) rotate(-0deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="pitchora"] .ag-ken,
[data-template-id="pitchora-preview"] .ag-ken { animation: pitchoraKen 16s ease-in-out infinite alternate; }
[data-template-id="pitchora"] .ag-float,
[data-template-id="pitchora-preview"] .ag-float { animation: pitchoraFloat 5s ease-in-out infinite; }
[data-template-id="pitchora"] .ag-pulse,
[data-template-id="pitchora-preview"] .ag-pulse { animation: pitchoraPulse 2.5s ease-in-out infinite; }
[data-template-id="pitchora"] .ag-scan,
[data-template-id="pitchora-preview"] .ag-scan { animation: pitchoraScan 9s linear infinite; }
[data-template-id="pitchora"] .ag-drift,
[data-template-id="pitchora-preview"] .ag-drift { animation: pitchoraDrift 10s ease-in-out infinite alternate; }
@keyframes pitchoraKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.07) translate3d(-4px, 2px, 0); } }
@keyframes pitchoraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes pitchoraPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes pitchoraScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes pitchoraDrift { from { transform: rotate(-2deg) translateY(0); } to { transform: rotate(2deg) translateY(-8px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="pitchora"] .ag-ken,
  [data-template-id="pitchora-preview"] .ag-ken,
  [data-template-id="pitchora"] .ag-float,
  [data-template-id="pitchora-preview"] .ag-float,
  [data-template-id="pitchora"] .ag-pulse,
  [data-template-id="pitchora-preview"] .ag-pulse,
  [data-template-id="pitchora"] .ag-scan,
  [data-template-id="pitchora-preview"] .ag-scan,
  [data-template-id="pitchora"] .ag-drift,
  [data-template-id="pitchora-preview"] .ag-drift { animation: none; }
}
`;
