export const uxforgeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Miriam+Libre:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800;900&display=swap');
[data-template-id="uxforge"], [data-template-id="uxforge-preview"] {
  --p: #111827;
  --a: #06B6D4;
  --bg: #F3F4F6;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #4B5563;
  --dark: #030712;
  font-family: "Miriam Libre", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="uxforge"] .text-center,
[data-template-id="uxforge-preview"] .text-center { text-align: center; }
[data-template-id="uxforge"] .ag-display,
[data-template-id="uxforge-preview"] .ag-display { font-family: "Syne", "Miriam Libre", sans-serif; }
[data-template-id="uxforge"] .ag-card,
[data-template-id="uxforge-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="uxforge"] .ag-card:hover,
[data-template-id="uxforge-preview"] .ag-card:hover {
  transform: translateY(-15px) rotate(0.35deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="uxforge"] .ag-ken,
[data-template-id="uxforge-preview"] .ag-ken { animation: uxforgeKen 25s ease-in-out infinite alternate; }
[data-template-id="uxforge"] .ag-float,
[data-template-id="uxforge-preview"] .ag-float { animation: uxforgeFloat 9s ease-in-out infinite; }
[data-template-id="uxforge"] .ag-pulse,
[data-template-id="uxforge-preview"] .ag-pulse { animation: uxforgePulse 2.8s ease-in-out infinite; }
[data-template-id="uxforge"] .ag-scan,
[data-template-id="uxforge-preview"] .ag-scan { animation: uxforgeScan 18s linear infinite; }
[data-template-id="uxforge"] .ag-drift,
[data-template-id="uxforge-preview"] .ag-drift { animation: uxforgeDrift 19s ease-in-out infinite alternate; }
@keyframes uxforgeKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.106) translate3d(13px, 6px, 0); } }
@keyframes uxforgeFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-19px); } }
@keyframes uxforgePulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 17px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes uxforgeScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes uxforgeDrift { from { transform: rotate(-3.8deg) translateY(0); } to { transform: rotate(3.8deg) translateY(-17px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="uxforge"] .ag-ken,
  [data-template-id="uxforge-preview"] .ag-ken,
  [data-template-id="uxforge"] .ag-float,
  [data-template-id="uxforge-preview"] .ag-float,
  [data-template-id="uxforge"] .ag-pulse,
  [data-template-id="uxforge-preview"] .ag-pulse,
  [data-template-id="uxforge"] .ag-scan,
  [data-template-id="uxforge-preview"] .ag-scan,
  [data-template-id="uxforge"] .ag-drift,
  [data-template-id="uxforge-preview"] .ag-drift { animation: none; }
}
`;
