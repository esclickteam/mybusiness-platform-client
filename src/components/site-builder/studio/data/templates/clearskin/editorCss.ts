export const clearskinEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@500;600;700&family=IBM+Plex+Sans+Hebrew:wght@400;500;700&display=swap');

[data-template-id="clearskin"],
[data-template-id="clearskin-preview"] {
  --p: #0891B2;
  --s: #ECFEFF;
  --a: #67E8F9;
  --bg: #F3FEFF;
  --surface: #FFFFFF;
  --text: #164E63;
  --muted: #5E8790;
  --dark: #083344;
  font-family: "IBM Plex Sans Hebrew", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="clearskin"] .t-display,
[data-template-id="clearskin-preview"] .t-display {
  font-family: "IBM Plex Serif", serif;
}

@keyframes clearskin-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes clearskin-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes clearskin-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes clearskin-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes clearskin-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes clearskin-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes clearskin-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes clearskin-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes clearskin-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="clearskin"] .t-ken,
[data-template-id="clearskin-preview"] .t-ken { animation: clearskin-ken 18s ease-in-out infinite alternate; }
[data-template-id="clearskin"] .t-anim,
[data-template-id="clearskin-preview"] .t-anim { animation: clearskin-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="clearskin"] .t-d1,
[data-template-id="clearskin-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="clearskin"] .t-d2,
[data-template-id="clearskin-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="clearskin"] .t-d3,
[data-template-id="clearskin-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="clearskin"] .t-fade,
[data-template-id="clearskin-preview"] .t-fade { animation: clearskin-fade 1s ease both; }
[data-template-id="clearskin"] .t-marquee,
[data-template-id="clearskin-preview"] .t-marquee { animation: clearskin-marquee 30s linear infinite; width: max-content; }
[data-template-id="clearskin"] .t-float,
[data-template-id="clearskin-preview"] .t-float { animation: clearskin-float 6s ease-in-out infinite; }
[data-template-id="clearskin"] .t-pulse,
[data-template-id="clearskin-preview"] .t-pulse { animation: clearskin-pulse 2.8s ease-in-out infinite; }
[data-template-id="clearskin"] .t-shimmer,
[data-template-id="clearskin-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: clearskin-shimmer 2.8s linear infinite;
}
[data-template-id="clearskin"] .t-glow,
[data-template-id="clearskin-preview"] .t-glow { animation: clearskin-glow 3.2s ease-in-out infinite; }
[data-template-id="clearskin"] .t-scalein,
[data-template-id="clearskin-preview"] .t-scalein { animation: clearskin-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="clearskin"] .t-hover,
[data-template-id="clearskin-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="clearskin"] .t-hover:hover,
[data-template-id="clearskin-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="clearskin"] .t-ken,
  [data-template-id="clearskin-preview"] .t-ken,
  [data-template-id="clearskin"] .t-anim,
  [data-template-id="clearskin-preview"] .t-anim,
  [data-template-id="clearskin"] .t-marquee,
  [data-template-id="clearskin-preview"] .t-marquee,
  [data-template-id="clearskin"] .t-float,
  [data-template-id="clearskin-preview"] .t-float,
  [data-template-id="clearskin"] .t-pulse,
  [data-template-id="clearskin-preview"] .t-pulse,
  [data-template-id="clearskin"] .t-shimmer,
  [data-template-id="clearskin-preview"] .t-shimmer,
  [data-template-id="clearskin"] .t-glow,
  [data-template-id="clearskin-preview"] .t-glow,
  [data-template-id="clearskin"] .t-scalein,
  [data-template-id="clearskin-preview"] .t-scalein,
  [data-template-id="clearskin"] .t-fade,
  [data-template-id="clearskin-preview"] .t-fade { animation: none !important; }
}
`;
