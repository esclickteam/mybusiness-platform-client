export const socialuxEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Bebas+Neue:wght@400;500;600;700;800;900&display=swap');
[data-template-id="socialux"], [data-template-id="socialux-preview"] {
  --p: #00C2FF;
  --a: #F72585;
  --bg: #08111F;
  --surface: #0E1B2E;
  --text: #F2FBFF;
  --muted: #9BD8EB;
  --dark: #030812;
  font-family: "Rubik", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="socialux"] .text-center,
[data-template-id="socialux-preview"] .text-center { text-align: center; }
[data-template-id="socialux"] .ag-display,
[data-template-id="socialux-preview"] .ag-display { font-family: "Bebas Neue", "Rubik", sans-serif; }
[data-template-id="socialux"] .ag-card,
[data-template-id="socialux-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="socialux"] .ag-card:hover,
[data-template-id="socialux-preview"] .ag-card:hover {
  transform: translateY(-7px) rotate(0.35deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="socialux"] .ag-ken,
[data-template-id="socialux-preview"] .ag-ken { animation: socialuxKen 17s ease-in-out infinite alternate; }
[data-template-id="socialux"] .ag-float,
[data-template-id="socialux-preview"] .ag-float { animation: socialuxFloat 6s ease-in-out infinite; }
[data-template-id="socialux"] .ag-pulse,
[data-template-id="socialux-preview"] .ag-pulse { animation: socialuxPulse 2.8s ease-in-out infinite; }
[data-template-id="socialux"] .ag-scan,
[data-template-id="socialux-preview"] .ag-scan { animation: socialuxScan 10s linear infinite; }
[data-template-id="socialux"] .ag-drift,
[data-template-id="socialux-preview"] .ag-drift { animation: socialuxDrift 11s ease-in-out infinite alternate; }
@keyframes socialuxKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.074) translate3d(5px, 3px, 0); } }
@keyframes socialuxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-11px); } }
@keyframes socialuxPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 9px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes socialuxScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes socialuxDrift { from { transform: rotate(-2.2deg) translateY(0); } to { transform: rotate(2.2deg) translateY(-9px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="socialux"] .ag-ken,
  [data-template-id="socialux-preview"] .ag-ken,
  [data-template-id="socialux"] .ag-float,
  [data-template-id="socialux-preview"] .ag-float,
  [data-template-id="socialux"] .ag-pulse,
  [data-template-id="socialux-preview"] .ag-pulse,
  [data-template-id="socialux"] .ag-scan,
  [data-template-id="socialux-preview"] .ag-scan,
  [data-template-id="socialux"] .ag-drift,
  [data-template-id="socialux-preview"] .ag-drift { animation: none; }
}
`;
