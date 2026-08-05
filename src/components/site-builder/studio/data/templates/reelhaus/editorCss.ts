export const reelhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
[data-template-id="reelhaus"], [data-template-id="reelhaus"] {
  --p: #D4AF37;
  --a: #E11D48;
  --bg: #0C0A09;
  --surface: #1C1917;
  --text: #FFF7ED;
  --muted: #D6D3D1;
  --dark: #050403;
  font-family: "David Libre", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="reelhaus"] .text-center,
[data-template-id="reelhaus"] .text-center { text-align: center; }
[data-template-id="reelhaus"] .ag-display,
[data-template-id="reelhaus"] .ag-display { font-family: "Playfair Display", "David Libre", sans-serif; }
[data-template-id="reelhaus"] .ag-card,
[data-template-id="reelhaus"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="reelhaus"] .ag-card:hover,
[data-template-id="reelhaus"] .ag-card:hover {
  transform: translateY(-16px) rotate(-0.7deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="reelhaus"] .ag-ken,
[data-template-id="reelhaus"] .ag-ken { animation: reelhausKen 26s ease-in-out infinite alternate; }
[data-template-id="reelhaus"] .ag-float,
[data-template-id="reelhaus"] .ag-float { animation: reelhausFloat 5s ease-in-out infinite; }
[data-template-id="reelhaus"] .ag-pulse,
[data-template-id="reelhaus"] .ag-pulse { animation: reelhausPulse 3.1s ease-in-out infinite; }
[data-template-id="reelhaus"] .ag-scan,
[data-template-id="reelhaus"] .ag-scan { animation: reelhausScan 19s linear infinite; }
[data-template-id="reelhaus"] .ag-drift,
[data-template-id="reelhaus"] .ag-drift { animation: reelhausDrift 20s ease-in-out infinite alternate; }
@keyframes reelhausKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.11) translate3d(-14px, 2px, 0); } }
@keyframes reelhausFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
@keyframes reelhausPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 18px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes reelhausScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes reelhausDrift { from { transform: rotate(-4deg) translateY(0); } to { transform: rotate(4deg) translateY(-18px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="reelhaus"] .ag-ken,
  [data-template-id="reelhaus"] .ag-ken,
  [data-template-id="reelhaus"] .ag-float,
  [data-template-id="reelhaus"] .ag-float,
  [data-template-id="reelhaus"] .ag-pulse,
  [data-template-id="reelhaus"] .ag-pulse,
  [data-template-id="reelhaus"] .ag-scan,
  [data-template-id="reelhaus"] .ag-scan,
  [data-template-id="reelhaus"] .ag-drift,
  [data-template-id="reelhaus"] .ag-drift { animation: none; }
}
`;
