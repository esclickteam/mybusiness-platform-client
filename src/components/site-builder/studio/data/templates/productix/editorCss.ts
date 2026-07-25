export const productixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800;900&display=swap');
[data-template-id="productix"], [data-template-id="productix-preview"] {
  --p: #2563EB;
  --a: #F97316;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #475569;
  --dark: #0B1120;
  font-family: "Noto Sans Hebrew", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="productix"] .text-center,
[data-template-id="productix-preview"] .text-center { text-align: center; }
[data-template-id="productix"] .ag-display,
[data-template-id="productix-preview"] .ag-display { font-family: "Sora", "Noto Sans Hebrew", sans-serif; }
[data-template-id="productix"] .ag-card,
[data-template-id="productix-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="productix"] .ag-card:hover,
[data-template-id="productix-preview"] .ag-card:hover {
  transform: translateY(-11px) rotate(0.35deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="productix"] .ag-ken,
[data-template-id="productix-preview"] .ag-ken { animation: productixKen 21s ease-in-out infinite alternate; }
[data-template-id="productix"] .ag-float,
[data-template-id="productix-preview"] .ag-float { animation: productixFloat 5s ease-in-out infinite; }
[data-template-id="productix"] .ag-pulse,
[data-template-id="productix-preview"] .ag-pulse { animation: productixPulse 2.8s ease-in-out infinite; }
[data-template-id="productix"] .ag-scan,
[data-template-id="productix-preview"] .ag-scan { animation: productixScan 14s linear infinite; }
[data-template-id="productix"] .ag-drift,
[data-template-id="productix-preview"] .ag-drift { animation: productixDrift 15s ease-in-out infinite alternate; }
@keyframes productixKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.09) translate3d(9px, 2px, 0); } }
@keyframes productixFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes productixPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 13px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes productixScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes productixDrift { from { transform: rotate(-3deg) translateY(0); } to { transform: rotate(3deg) translateY(-13px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="productix"] .ag-ken,
  [data-template-id="productix-preview"] .ag-ken,
  [data-template-id="productix"] .ag-float,
  [data-template-id="productix-preview"] .ag-float,
  [data-template-id="productix"] .ag-pulse,
  [data-template-id="productix-preview"] .ag-pulse,
  [data-template-id="productix"] .ag-scan,
  [data-template-id="productix-preview"] .ag-scan,
  [data-template-id="productix"] .ag-drift,
  [data-template-id="productix-preview"] .ag-drift { animation: none; }
}
`;
