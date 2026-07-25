export const influencixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Alef:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700;800;900&display=swap');
[data-template-id="influencix"], [data-template-id="influencix-preview"] {
  --p: #FF4D6D;
  --a: #FFD166;
  --bg: #14070C;
  --surface: #241018;
  --text: #FFF5F7;
  --muted: #F7B4C2;
  --dark: #090306;
  font-family: "Alef", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="influencix"] .text-center,
[data-template-id="influencix-preview"] .text-center { text-align: center; }
[data-template-id="influencix"] .ag-display,
[data-template-id="influencix-preview"] .ag-display { font-family: "Cormorant Garamond", "Alef", sans-serif; }
[data-template-id="influencix"] .ag-card,
[data-template-id="influencix-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="influencix"] .ag-card:hover,
[data-template-id="influencix-preview"] .ag-card:hover {
  transform: translateY(-8px) rotate(-0.7deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="influencix"] .ag-ken,
[data-template-id="influencix-preview"] .ag-ken { animation: influencixKen 18s ease-in-out infinite alternate; }
[data-template-id="influencix"] .ag-float,
[data-template-id="influencix-preview"] .ag-float { animation: influencixFloat 7s ease-in-out infinite; }
[data-template-id="influencix"] .ag-pulse,
[data-template-id="influencix-preview"] .ag-pulse { animation: influencixPulse 3.1s ease-in-out infinite; }
[data-template-id="influencix"] .ag-scan,
[data-template-id="influencix-preview"] .ag-scan { animation: influencixScan 11s linear infinite; }
[data-template-id="influencix"] .ag-drift,
[data-template-id="influencix-preview"] .ag-drift { animation: influencixDrift 12s ease-in-out infinite alternate; }
@keyframes influencixKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.078) translate3d(-6px, 4px, 0); } }
@keyframes influencixFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes influencixPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes influencixScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes influencixDrift { from { transform: rotate(-2.4deg) translateY(0); } to { transform: rotate(2.4deg) translateY(-10px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="influencix"] .ag-ken,
  [data-template-id="influencix-preview"] .ag-ken,
  [data-template-id="influencix"] .ag-float,
  [data-template-id="influencix-preview"] .ag-float,
  [data-template-id="influencix"] .ag-pulse,
  [data-template-id="influencix-preview"] .ag-pulse,
  [data-template-id="influencix"] .ag-scan,
  [data-template-id="influencix-preview"] .ag-scan,
  [data-template-id="influencix"] .ag-drift,
  [data-template-id="influencix-preview"] .ag-drift { animation: none; }
}
`;
