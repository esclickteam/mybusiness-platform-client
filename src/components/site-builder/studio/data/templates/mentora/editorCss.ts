export const mentoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap');

[data-template-id="mentora"],
[data-template-id="mentora-preview"] {
  --p: #F59E0B;
  --s: #111827;
  --a: #FBBF24;
  --bg: #0F172A;
  --surface: #1E293B;
  --text: #F8FAFC;
  --muted: #94A3B8;
  --dark: #020617;
  font-family: "Source Sans 3", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="mentora"] .t-display,
[data-template-id="mentora-preview"] .t-display {
  font-family: "Fraunces", sans-serif;
}

@keyframes mentora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes mentora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mentora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes mentora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes mentora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes mentora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes mentora-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes mentora-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="mentora"] .t-ken,
[data-template-id="mentora-preview"] .t-ken { animation: mentora-ken 16s ease-in-out infinite alternate; }
[data-template-id="mentora"] .t-anim,
[data-template-id="mentora-preview"] .t-anim { animation: mentora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="mentora"] .t-d1,
[data-template-id="mentora-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="mentora"] .t-d2,
[data-template-id="mentora-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="mentora"] .t-d3,
[data-template-id="mentora-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="mentora"] .t-fade,
[data-template-id="mentora-preview"] .t-fade { animation: mentora-fade 1s ease both; }
[data-template-id="mentora"] .t-marquee,
[data-template-id="mentora-preview"] .t-marquee { animation: mentora-marquee 28s linear infinite; width: max-content; }
[data-template-id="mentora"] .t-float,
[data-template-id="mentora-preview"] .t-float { animation: mentora-float 6.5s ease-in-out infinite; }
[data-template-id="mentora"] .t-pulse,
[data-template-id="mentora-preview"] .t-pulse { animation: mentora-pulse 2.6s ease-in-out infinite; }
[data-template-id="mentora"] .t-wave,
[data-template-id="mentora-preview"] .t-wave { animation: mentora-wave 2.2s ease-in-out infinite; }
[data-template-id="mentora"] .t-hover,
[data-template-id="mentora-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="mentora"] .t-hover:hover,
[data-template-id="mentora-preview"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="mentora"] .t-ken,
  [data-template-id="mentora-preview"] .t-ken,
  [data-template-id="mentora"] .t-anim,
  [data-template-id="mentora-preview"] .t-anim,
  [data-template-id="mentora"] .t-marquee,
  [data-template-id="mentora-preview"] .t-marquee,
  [data-template-id="mentora"] .t-float,
  [data-template-id="mentora-preview"] .t-float,
  [data-template-id="mentora"] .t-pulse,
  [data-template-id="mentora-preview"] .t-pulse,
  [data-template-id="mentora"] .t-wave,
  [data-template-id="mentora-preview"] .t-wave,
  [data-template-id="mentora"] .t-fade,
  [data-template-id="mentora-preview"] .t-fade { animation: none !important; }
}
`;
