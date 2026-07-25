export const lobbyhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700;800&family=Cinzel:wght@400;500;600;700;800;900&display=swap');
[data-template-id="lobbyhaus"], [data-template-id="lobbyhaus-preview"] {
  --p: #1E3A8A;
  --a: #B45309;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #475569;
  --dark: #0B1736;
  font-family: "IBM Plex Sans Hebrew", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="lobbyhaus"] .text-center,
[data-template-id="lobbyhaus-preview"] .text-center { text-align: center; }
[data-template-id="lobbyhaus"] .ag-display,
[data-template-id="lobbyhaus-preview"] .ag-display { font-family: "Cinzel", "IBM Plex Sans Hebrew", sans-serif; }
[data-template-id="lobbyhaus"] .ag-card,
[data-template-id="lobbyhaus-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="lobbyhaus"] .ag-card:hover,
[data-template-id="lobbyhaus-preview"] .ag-card:hover {
  transform: translateY(-19px) rotate(0.35deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="lobbyhaus"] .ag-ken,
[data-template-id="lobbyhaus-preview"] .ag-ken { animation: lobbyhausKen 29s ease-in-out infinite alternate; }
[data-template-id="lobbyhaus"] .ag-float,
[data-template-id="lobbyhaus-preview"] .ag-float { animation: lobbyhausFloat 8s ease-in-out infinite; }
[data-template-id="lobbyhaus"] .ag-pulse,
[data-template-id="lobbyhaus-preview"] .ag-pulse { animation: lobbyhausPulse 2.8s ease-in-out infinite; }
[data-template-id="lobbyhaus"] .ag-scan,
[data-template-id="lobbyhaus-preview"] .ag-scan { animation: lobbyhausScan 22s linear infinite; }
[data-template-id="lobbyhaus"] .ag-drift,
[data-template-id="lobbyhaus-preview"] .ag-drift { animation: lobbyhausDrift 23s ease-in-out infinite alternate; }
@keyframes lobbyhausKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.122) translate3d(17px, 5px, 0); } }
@keyframes lobbyhausFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-23px); } }
@keyframes lobbyhausPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 21px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes lobbyhausScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes lobbyhausDrift { from { transform: rotate(-4.6deg) translateY(0); } to { transform: rotate(4.6deg) translateY(-21px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="lobbyhaus"] .ag-ken,
  [data-template-id="lobbyhaus-preview"] .ag-ken,
  [data-template-id="lobbyhaus"] .ag-float,
  [data-template-id="lobbyhaus-preview"] .ag-float,
  [data-template-id="lobbyhaus"] .ag-pulse,
  [data-template-id="lobbyhaus-preview"] .ag-pulse,
  [data-template-id="lobbyhaus"] .ag-scan,
  [data-template-id="lobbyhaus-preview"] .ag-scan,
  [data-template-id="lobbyhaus"] .ag-drift,
  [data-template-id="lobbyhaus-preview"] .ag-drift { animation: none; }
}
`;
