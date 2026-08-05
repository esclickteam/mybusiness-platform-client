export const partnerlyEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Secular+One:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
[data-template-id="partnerly"], [data-template-id="partnerly"] {
  --p: #16A34A;
  --a: #38BDF8;
  --bg: #F0FDF4;
  --surface: #FFFFFF;
  --text: #052E16;
  --muted: #166534;
  --dark: #052814;
  font-family: "Secular One", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="partnerly"] .text-center,
[data-template-id="partnerly"] .text-center { text-align: center; }
[data-template-id="partnerly"] .ag-display,
[data-template-id="partnerly"] .ag-display { font-family: "Montserrat", "Secular One", sans-serif; }
[data-template-id="partnerly"] .ag-card,
[data-template-id="partnerly"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="partnerly"] .ag-card:hover,
[data-template-id="partnerly"] .ag-card:hover {
  transform: translateY(-13px) rotate(1.0499999999999998deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="partnerly"] .ag-ken,
[data-template-id="partnerly"] .ag-ken { animation: partnerlyKen 23s ease-in-out infinite alternate; }
[data-template-id="partnerly"] .ag-float,
[data-template-id="partnerly"] .ag-float { animation: partnerlyFloat 7s ease-in-out infinite; }
[data-template-id="partnerly"] .ag-pulse,
[data-template-id="partnerly"] .ag-pulse { animation: partnerlyPulse 3.4s ease-in-out infinite; }
[data-template-id="partnerly"] .ag-scan,
[data-template-id="partnerly"] .ag-scan { animation: partnerlyScan 16s linear infinite; }
[data-template-id="partnerly"] .ag-drift,
[data-template-id="partnerly"] .ag-drift { animation: partnerlyDrift 17s ease-in-out infinite alternate; }
@keyframes partnerlyKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.098) translate3d(11px, 4px, 0); } }
@keyframes partnerlyFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-17px); } }
@keyframes partnerlyPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 15px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes partnerlyScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes partnerlyDrift { from { transform: rotate(-3.4000000000000004deg) translateY(0); } to { transform: rotate(3.4000000000000004deg) translateY(-15px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="partnerly"] .ag-ken,
  [data-template-id="partnerly"] .ag-ken,
  [data-template-id="partnerly"] .ag-float,
  [data-template-id="partnerly"] .ag-float,
  [data-template-id="partnerly"] .ag-pulse,
  [data-template-id="partnerly"] .ag-pulse,
  [data-template-id="partnerly"] .ag-scan,
  [data-template-id="partnerly"] .ag-scan,
  [data-template-id="partnerly"] .ag-drift,
  [data-template-id="partnerly"] .ag-drift { animation: none; }
}
`;
