export const toolhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="toolhaus"], [data-template-id="toolhaus-preview"] {
  --p: #CA8A04;
  --accent: #FACC15;
  --on-p: #1C1917;
  --bg: #111827;
  --bg-soft: #1F2937;
  --surface: #243044;
  --text: #F8FAFC;
  --muted: #94A3B8;
  --dark: #030712;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #CA8A0422, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #FACC1518, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="toolhaus"] .store-display,
[data-template-id="toolhaus-preview"] .store-display {
  font-family: "IBM Plex Sans", "Heebo", serif;
}
[data-template-id="toolhaus"] .store-card,
[data-template-id="toolhaus-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="toolhaus"] .store-card:hover,
[data-template-id="toolhaus-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="toolhaus"] .store-marquee,
[data-template-id="toolhaus-preview"] .store-marquee {
  animation: toolhaus-marquee 22s linear infinite;
}
[data-template-id="toolhaus"] .store-kenburns,
[data-template-id="toolhaus-preview"] .store-kenburns {
  animation: toolhaus-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="toolhaus"] .store-float-a,
[data-template-id="toolhaus-preview"] .store-float-a { animation: toolhaus-float 7s ease-in-out infinite; }
[data-template-id="toolhaus"] .store-float-b,
[data-template-id="toolhaus-preview"] .store-float-b { animation: toolhaus-float 8.5s ease-in-out infinite reverse; }
[data-template-id="toolhaus"] .store-float-c,
[data-template-id="toolhaus-preview"] .store-float-c { animation: toolhaus-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="toolhaus"] .store-logo,
[data-template-id="toolhaus-preview"] .store-logo {
  box-shadow: 0 0 0 0 #CA8A0466;
  animation: toolhaus-pulse 2.8s ease-out infinite;
}
@keyframes toolhaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes toolhaus-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes toolhaus-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes toolhaus-pulse {
  0% { box-shadow: 0 0 0 0 #CA8A0466; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="toolhaus"] .store-marquee,
  [data-template-id="toolhaus"] .store-kenburns,
  [data-template-id="toolhaus"] .store-float-a,
  [data-template-id="toolhaus"] .store-float-b,
  [data-template-id="toolhaus"] .store-float-c,
  [data-template-id="toolhaus"] .store-logo,
  [data-template-id="toolhaus-preview"] .store-marquee,
  [data-template-id="toolhaus-preview"] .store-kenburns,
  [data-template-id="toolhaus-preview"] .store-float-a,
  [data-template-id="toolhaus-preview"] .store-float-b,
  [data-template-id="toolhaus-preview"] .store-float-c,
  [data-template-id="toolhaus-preview"] .store-logo {
    animation: none !important;
  }
}
`;
