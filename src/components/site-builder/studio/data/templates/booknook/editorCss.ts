export const booknookEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Literata:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="booknook"], [data-template-id="booknook-preview"] {
  --p: #1D4ED8;
  --accent: #93C5FD;
  --on-p: #EFF6FF;
  --bg: #F8FAFC;
  --bg-soft: #EFF6FF;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #64748B;
  --dark: #020617;
  --line: rgba(15,23,42,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #1D4ED822, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #93C5FD18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="booknook"] .store-display,
[data-template-id="booknook-preview"] .store-display {
  font-family: "Literata", "Heebo", serif;
}
[data-template-id="booknook"] .store-card,
[data-template-id="booknook-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="booknook"] .store-card:hover,
[data-template-id="booknook-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="booknook"] .store-marquee,
[data-template-id="booknook-preview"] .store-marquee {
  animation: booknook-marquee 22s linear infinite;
}
[data-template-id="booknook"] .store-kenburns,
[data-template-id="booknook-preview"] .store-kenburns {
  animation: booknook-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="booknook"] .store-float-a,
[data-template-id="booknook-preview"] .store-float-a { animation: booknook-float 7s ease-in-out infinite; }
[data-template-id="booknook"] .store-float-b,
[data-template-id="booknook-preview"] .store-float-b { animation: booknook-float 8.5s ease-in-out infinite reverse; }
[data-template-id="booknook"] .store-float-c,
[data-template-id="booknook-preview"] .store-float-c { animation: booknook-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="booknook"] .store-logo,
[data-template-id="booknook-preview"] .store-logo {
  box-shadow: 0 0 0 0 #1D4ED866;
  animation: booknook-pulse 2.8s ease-out infinite;
}
@keyframes booknook-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes booknook-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes booknook-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes booknook-pulse {
  0% { box-shadow: 0 0 0 0 #1D4ED866; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="booknook"] .store-marquee,
  [data-template-id="booknook"] .store-kenburns,
  [data-template-id="booknook"] .store-float-a,
  [data-template-id="booknook"] .store-float-b,
  [data-template-id="booknook"] .store-float-c,
  [data-template-id="booknook"] .store-logo,
  [data-template-id="booknook-preview"] .store-marquee,
  [data-template-id="booknook-preview"] .store-kenburns,
  [data-template-id="booknook-preview"] .store-float-a,
  [data-template-id="booknook-preview"] .store-float-b,
  [data-template-id="booknook-preview"] .store-float-c,
  [data-template-id="booknook-preview"] .store-logo {
    animation: none !important;
  }
}
`;
