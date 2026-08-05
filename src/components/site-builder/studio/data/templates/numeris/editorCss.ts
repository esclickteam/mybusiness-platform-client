export const numerisEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Literata:opsz,wght@7..72,600;7..72,700&display=swap');

[data-template-id="numeris"],
[data-template-id="numeris"] {
  --p: #0F6E56;
  --s: #F3F6F4;
  --a: #158765;
  --bg: #F3F6F4;
  --surface: #FFFFFF;
  --text: #143028;
  --muted: #5E7268;
  --dark: #0B241C;
  font-family: "Figtree", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}

[data-template-id="numeris"] *,
[data-template-id="numeris"] * {
  border-radius: 0 !important;
}

[data-template-id="numeris"] .t-display,
[data-template-id="numeris"] .t-display {
  font-family: "Literata", serif;
}

@keyframes nu-ledger-shift {
  from { background-position: 0 0, 0 0; }
  to { background-position: 40px 40px, 160px 0; }
}

@keyframes nu-tile-glow {
  0%, 100% { box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 18px 42px rgba(15,110,86,.12); }
  50% { box-shadow: inset 0 0 0 1px rgba(255,255,255,.3), 0 28px 60px rgba(15,110,86,.22); }
}

@keyframes nu-rule-scan {
  from { transform: translateX(0); }
  to { transform: translateX(-24px); }
}

[data-template-id="numeris"] .nu-ledger-bg,
[data-template-id="numeris"] .nu-ledger-bg {
  background-image:
    linear-gradient(rgba(15,110,86,.095) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,110,86,.095) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,0));
  background-size: 40px 40px, 40px 40px, 180px 100%;
  animation: nu-ledger-shift 18s linear infinite;
}

[data-template-id="numeris"] .nu-stat-tile,
[data-template-id="numeris"] .nu-stat-tile {
  animation: nu-tile-glow 3.8s ease-in-out infinite;
}

[data-template-id="numeris"] .nu-stat-tile:nth-child(2n),
[data-template-id="numeris"] .nu-stat-tile:nth-child(2n) {
  animation-delay: .5s;
}

[data-template-id="numeris"] table,
[data-template-id="numeris"] table {
  border-collapse: collapse;
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="numeris"] .nu-ledger-bg,
  [data-template-id="numeris"] .nu-ledger-bg,
  [data-template-id="numeris"] .nu-stat-tile,
  [data-template-id="numeris"] .nu-stat-tile {
    animation: none;
  }
}
`;
