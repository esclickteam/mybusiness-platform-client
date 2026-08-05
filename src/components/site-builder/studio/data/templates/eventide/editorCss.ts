export const eventideEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="eventide"], [data-template-id="eventide"] {
  --p: #7C3AED;
  --accent: #C4B5FD;
  --bg: #0F0A1A;
  --surface: #1A1030;
  --text: #F5F3FF;
  --muted: #C4B5FD;
  --dark: #07040E;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="eventide"] .text-center,
[data-template-id="eventide"] .text-center { text-align: center; }
[data-template-id="eventide"] .ag-display,
[data-template-id="eventide"] .ag-display {
  font-family: "Space Grotesk", "Heebo", sans-serif;
}
[data-template-id="eventide"] .ag-float,
[data-template-id="eventide"] .ag-float {
  animation: eventideFloat 7s ease-in-out infinite;
}
[data-template-id="eventide"] .ag-pulse,
[data-template-id="eventide"] .ag-pulse {
  animation: eventidePulse 2.8s ease-in-out infinite;
}
[data-template-id="eventide"] .ag-card,
[data-template-id="eventide"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="eventide"] .ag-card:hover,
[data-template-id="eventide"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="eventide"] .ag-ken,
[data-template-id="eventide"] .ag-ken {
  animation: eventideKen 18s ease-in-out infinite alternate;
}
@keyframes eventideFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes eventidePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes eventideKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
    [data-template-id="eventide"] .ag-float,
  [data-template-id="eventide"] .ag-float,
  [data-template-id="eventide"] .ag-ken,
  [data-template-id="eventide"] .ag-ken,
  [data-template-id="eventide"] .ag-pulse,
  [data-template-id="eventide"] .ag-pulse { animation: none; }
}
`;
