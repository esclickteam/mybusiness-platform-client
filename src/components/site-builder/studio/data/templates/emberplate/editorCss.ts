export const emberplateEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="emberplate"], [data-template-id="emberplate-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #140c08; --tpl-surface: #1f1410; --tpl-text: #f6ebe0;
  --tpl-muted: #b89a82; --tpl-primary: #e85d04; --tpl-primary-text: #140c08;
  --tpl-line: rgba(246,235,224,0.12); --tpl-dark: #0a0604;
}

[data-template-id="emberplate"] .tpl-display,
[data-template-id="emberplate-preview"] .tpl-display {
  font-family: "Bebas Neue", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="emberplate"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes emberplate-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes emberplate-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes emberplate-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes emberplate-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes emberplate-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes emberplate-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="emberplate"] .tpl-ken, [data-template-id="emberplate-preview"] .tpl-ken {
  animation: emberplate-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="emberplate"] .tpl-rise, [data-template-id="emberplate-preview"] .tpl-rise {
  animation: emberplate-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="emberplate"] .tpl-rise-2, [data-template-id="emberplate-preview"] .tpl-rise-2 {
  animation: emberplate-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="emberplate"] .tpl-rise-3, [data-template-id="emberplate-preview"] .tpl-rise-3 {
  animation: emberplate-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="emberplate"] .tpl-marquee-track, [data-template-id="emberplate-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: emberplate-marquee 28s linear infinite;
}
[data-template-id="emberplate"] .tpl-float, [data-template-id="emberplate-preview"] .tpl-float {
  animation: emberplate-float 5s ease-in-out infinite;
}
[data-template-id="emberplate"] .tpl-sweep, [data-template-id="emberplate-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="emberplate"] .tpl-sweep::after, [data-template-id="emberplate-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: emberplate-sweep 4.5s ease-in-out infinite;
}
[data-template-id="emberplate"] .tpl-climb, [data-template-id="emberplate-preview"] .tpl-climb {
  animation: emberplate-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes emberplate-ember-rise { 0% { transform: translateY(0) scale(1); opacity: .9; } 100% { transform: translateY(-110vh) scale(.4); opacity: 0; } }
@keyframes emberplate-ember-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(232,93,4,.55); } 50% { box-shadow: 0 0 28px 6px rgba(232,93,4,.35); } }
@keyframes emberplate-glow-chip { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.35); } }
[data-template-id="emberplate"] .tpl-ember, [data-template-id="emberplate-preview"] .tpl-ember {
  animation: emberplate-ember-rise var(--ember-dur, 7s) linear infinite;
}
[data-template-id="emberplate"] .tpl-ember-pulse, [data-template-id="emberplate-preview"] .tpl-ember-pulse {
  animation: emberplate-ember-pulse 2.4s ease-in-out infinite;
}
[data-template-id="emberplate"] .tpl-glow-chip, [data-template-id="emberplate-preview"] .tpl-glow-chip {
  animation: emberplate-glow-chip 2.8s ease-in-out infinite;
}
[data-template-id="emberplate"] .tpl-meat-line, [data-template-id="emberplate-preview"] .tpl-meat-line {
  position: relative;
}
[data-template-id="emberplate"] .tpl-meat-line::before, [data-template-id="emberplate-preview"] .tpl-meat-line::before {
  content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(180deg, transparent, #e85d04, transparent);
}
`;
