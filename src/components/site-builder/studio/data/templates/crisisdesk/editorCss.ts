export const crisisdeskEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700;800;900&display=swap');
[data-template-id="crisisdesk"], [data-template-id="crisisdesk-preview"] {
  --p: #DC2626;
  --a: #FDE047;
  --bg: #111827;
  --surface: #1F2937;
  --text: #F9FAFB;
  --muted: #D1D5DB;
  --dark: #030712;
  font-family: "Tinos", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="crisisdesk"] .text-center,
[data-template-id="crisisdesk-preview"] .text-center { text-align: center; }
[data-template-id="crisisdesk"] .ag-display,
[data-template-id="crisisdesk-preview"] .ag-display { font-family: "Oswald", "Tinos", sans-serif; }
[data-template-id="crisisdesk"] .ag-card,
[data-template-id="crisisdesk-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="crisisdesk"] .ag-card:hover,
[data-template-id="crisisdesk-preview"] .ag-card:hover {
  transform: translateY(-18px) rotate(-0deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="crisisdesk"] .ag-ken,
[data-template-id="crisisdesk-preview"] .ag-ken { animation: crisisdeskKen 28s ease-in-out infinite alternate; }
[data-template-id="crisisdesk"] .ag-float,
[data-template-id="crisisdesk-preview"] .ag-float { animation: crisisdeskFloat 7s ease-in-out infinite; }
[data-template-id="crisisdesk"] .ag-pulse,
[data-template-id="crisisdesk-preview"] .ag-pulse { animation: crisisdeskPulse 2.5s ease-in-out infinite; }
[data-template-id="crisisdesk"] .ag-scan,
[data-template-id="crisisdesk-preview"] .ag-scan { animation: crisisdeskScan 21s linear infinite; }
[data-template-id="crisisdesk"] .ag-drift,
[data-template-id="crisisdesk-preview"] .ag-drift { animation: crisisdeskDrift 22s ease-in-out infinite alternate; }
@keyframes crisisdeskKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.118) translate3d(-16px, 4px, 0); } }
@keyframes crisisdeskFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-22px); } }
@keyframes crisisdeskPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 20px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes crisisdeskScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes crisisdeskDrift { from { transform: rotate(-4.4deg) translateY(0); } to { transform: rotate(4.4deg) translateY(-20px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="crisisdesk"] .ag-ken,
  [data-template-id="crisisdesk-preview"] .ag-ken,
  [data-template-id="crisisdesk"] .ag-float,
  [data-template-id="crisisdesk-preview"] .ag-float,
  [data-template-id="crisisdesk"] .ag-pulse,
  [data-template-id="crisisdesk-preview"] .ag-pulse,
  [data-template-id="crisisdesk"] .ag-scan,
  [data-template-id="crisisdesk-preview"] .ag-scan,
  [data-template-id="crisisdesk"] .ag-drift,
  [data-template-id="crisisdesk-preview"] .ag-drift { animation: none; }
}
`;
