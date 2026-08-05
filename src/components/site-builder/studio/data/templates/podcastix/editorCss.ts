export const podcastixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
[data-template-id="podcastix"], [data-template-id="podcastix"] {
  --p: #8B5CF6;
  --a: #22D3EE;
  --bg: #0F0A1F;
  --surface: #1D1235;
  --text: #F5F3FF;
  --muted: #C4B5FD;
  --dark: #070313;
  font-family: "Arimo", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="podcastix"] .text-center,
[data-template-id="podcastix"] .text-center { text-align: center; }
[data-template-id="podcastix"] .ag-display,
[data-template-id="podcastix"] .ag-display { font-family: "DM Sans", "Arimo", sans-serif; }
[data-template-id="podcastix"] .ag-card,
[data-template-id="podcastix"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="podcastix"] .ag-card:hover,
[data-template-id="podcastix"] .ag-card:hover {
  transform: translateY(-17px) rotate(1.0499999999999998deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="podcastix"] .ag-ken,
[data-template-id="podcastix"] .ag-ken { animation: podcastixKen 27s ease-in-out infinite alternate; }
[data-template-id="podcastix"] .ag-float,
[data-template-id="podcastix"] .ag-float { animation: podcastixFloat 6s ease-in-out infinite; }
[data-template-id="podcastix"] .ag-pulse,
[data-template-id="podcastix"] .ag-pulse { animation: podcastixPulse 3.4s ease-in-out infinite; }
[data-template-id="podcastix"] .ag-scan,
[data-template-id="podcastix"] .ag-scan { animation: podcastixScan 20s linear infinite; }
[data-template-id="podcastix"] .ag-drift,
[data-template-id="podcastix"] .ag-drift { animation: podcastixDrift 21s ease-in-out infinite alternate; }
@keyframes podcastixKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.114) translate3d(15px, 3px, 0); } }
@keyframes podcastixFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-21px); } }
@keyframes podcastixPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 19px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes podcastixScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes podcastixDrift { from { transform: rotate(-4.2deg) translateY(0); } to { transform: rotate(4.2deg) translateY(-19px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="podcastix"] .ag-ken,
  [data-template-id="podcastix"] .ag-ken,
  [data-template-id="podcastix"] .ag-float,
  [data-template-id="podcastix"] .ag-float,
  [data-template-id="podcastix"] .ag-pulse,
  [data-template-id="podcastix"] .ag-pulse,
  [data-template-id="podcastix"] .ag-scan,
  [data-template-id="podcastix"] .ag-scan,
  [data-template-id="podcastix"] .ag-drift,
  [data-template-id="podcastix"] .ag-drift { animation: none; }
}
`;
