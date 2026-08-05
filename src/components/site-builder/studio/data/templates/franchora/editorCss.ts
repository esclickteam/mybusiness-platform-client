export const franchoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bellefair:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap');
[data-template-id="franchora"], [data-template-id="franchora"] {
  --p: #92400E;
  --a: #10B981;
  --bg: #FFFBEB;
  --surface: #FFFFFF;
  --text: #2B1704;
  --muted: #78350F;
  --dark: #1C0F02;
  font-family: "Bellefair", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="franchora"] .text-center,
[data-template-id="franchora"] .text-center { text-align: center; }
[data-template-id="franchora"] .ag-display,
[data-template-id="franchora"] .ag-display { font-family: "Poppins", "Bellefair", sans-serif; }
[data-template-id="franchora"] .ag-card,
[data-template-id="franchora"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="franchora"] .ag-card:hover,
[data-template-id="franchora"] .ag-card:hover {
  transform: translateY(-20px) rotate(-0.7deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="franchora"] .ag-ken,
[data-template-id="franchora"] .ag-ken { animation: franchoraKen 30s ease-in-out infinite alternate; }
[data-template-id="franchora"] .ag-float,
[data-template-id="franchora"] .ag-float { animation: franchoraFloat 9s ease-in-out infinite; }
[data-template-id="franchora"] .ag-pulse,
[data-template-id="franchora"] .ag-pulse { animation: franchoraPulse 3.1s ease-in-out infinite; }
[data-template-id="franchora"] .ag-scan,
[data-template-id="franchora"] .ag-scan { animation: franchoraScan 23s linear infinite; }
[data-template-id="franchora"] .ag-drift,
[data-template-id="franchora"] .ag-drift { animation: franchoraDrift 24s ease-in-out infinite alternate; }
@keyframes franchoraKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.1260000000000001) translate3d(-18px, 6px, 0); } }
@keyframes franchoraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
@keyframes franchoraPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 22px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes franchoraScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes franchoraDrift { from { transform: rotate(-4.800000000000001deg) translateY(0); } to { transform: rotate(4.800000000000001deg) translateY(-22px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="franchora"] .ag-ken,
  [data-template-id="franchora"] .ag-ken,
  [data-template-id="franchora"] .ag-float,
  [data-template-id="franchora"] .ag-float,
  [data-template-id="franchora"] .ag-pulse,
  [data-template-id="franchora"] .ag-pulse,
  [data-template-id="franchora"] .ag-scan,
  [data-template-id="franchora"] .ag-scan,
  [data-template-id="franchora"] .ag-drift,
  [data-template-id="franchora"] .ag-drift { animation: none; }
}
`;
