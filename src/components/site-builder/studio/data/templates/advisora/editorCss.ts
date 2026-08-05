export const advisoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Sora:wght@400;500;600;700;800&display=swap');

[data-template-id="advisora"],
[data-template-id="advisora"] {
  --p: #C9A227;
  --s: #0B1F3A;
  --a: #E6C65C;
  --bg: #0B1F3A;
  --surface: #132B4D;
  --text: #F4F1E8;
  --muted: #B9C2D0;
  --dark: #071428;
  font-family: "Sora", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="advisora"] *,
[data-template-id="advisora"] * {
  border-radius: 0 !important;
}

[data-template-id="advisora"] .t-display,
[data-template-id="advisora"] .t-display {
  font-family: "Fraunces", serif;
}

@keyframes advisora-ken-burns {
  0% { transform: scale(1.15) translate3d(2%, -2%, 0); }
  100% { transform: scale(1.02) translate3d(-2%, 2%, 0); }
}

@keyframes advisora-hero-rise {
  from { opacity: 0; transform: translateY(26px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes advisora-service-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

[data-template-id="advisora"] .a-ken,
[data-template-id="advisora"] .a-ken {
  animation: advisora-ken-burns 18s ease-out both;
  transform-origin: center;
}

[data-template-id="advisora"] .a-hero-in,
[data-template-id="advisora"] .a-hero-in {
  animation: advisora-hero-rise .9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="advisora"] .a-d1,
[data-template-id="advisora"] .a-d1 { animation-delay: .12s; }
[data-template-id="advisora"] .a-d2,
[data-template-id="advisora"] .a-d2 { animation-delay: .24s; }
[data-template-id="advisora"] .a-d3,
[data-template-id="advisora"] .a-d3 { animation-delay: .36s; }

[data-template-id="advisora"] .a-nav-link,
[data-template-id="advisora"] .a-nav-link {
  position: relative;
  padding-block: .35rem;
  transition: color .25s ease;
}

[data-template-id="advisora"] .a-nav-link::after,
[data-template-id="advisora"] .a-nav-link::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  content: "";
  background: var(--p);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform .35s cubic-bezier(0.22, 1, 0.36, 1);
}

[data-template-id="advisora"] .a-nav-link:hover,
[data-template-id="advisora"] .a-nav-link:hover {
  color: var(--p);
}

[data-template-id="advisora"] .a-nav-link:hover::after,
[data-template-id="advisora"] .a-nav-link:hover::after {
  transform: scaleX(1);
}

[data-template-id="advisora"] .a-service-viewport,
[data-template-id="advisora"] .a-service-viewport {
  margin-inline: -1.25rem;
  overflow-x: auto;
  scrollbar-width: none;
}

@media (min-width: 1024px) {
  [data-template-id="advisora"] .a-service-viewport,
  [data-template-id="advisora"] .a-service-viewport {
    margin-inline: -2rem;
  }
}

[data-template-id="advisora"] .a-service-viewport::-webkit-scrollbar,
[data-template-id="advisora"] .a-service-viewport::-webkit-scrollbar {
  display: none;
}

[data-template-id="advisora"] .a-service-track,
[data-template-id="advisora"] .a-service-track {
  display: flex;
  width: max-content;
  gap: 1rem;
  padding-inline: max(1.25rem, calc((100vw - 80rem) / 2));
  animation: advisora-service-marquee 34s linear infinite;
}

[data-template-id="advisora"] .a-service-track:hover,
[data-template-id="advisora"] .a-service-track:hover {
  animation-play-state: paused;
}

[data-template-id="advisora"] .a-service-panel,
[data-template-id="advisora"] .a-service-panel {
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}

[data-template-id="advisora"] .a-service-panel:hover,
[data-template-id="advisora"] .a-service-panel:hover {
  border-color: var(--p);
  background: #17345e;
  transform: translateY(-8px);
}

[data-template-id="advisora"] .a-image-frame img,
[data-template-id="advisora"] .a-image-frame img {
  transition: transform .8s cubic-bezier(0.22, 1, 0.36, 1), filter .5s ease;
}

[data-template-id="advisora"] .a-case-card:hover .a-image-frame img,
[data-template-id="advisora"] .a-case-card:hover .a-image-frame img {
  filter: saturate(1.08);
  transform: scale(1.08);
}

[data-template-id="advisora"] .a-timeline-item span,
[data-template-id="advisora"] .a-timeline-item span {
  box-shadow: 0 0 0 0 rgba(201, 162, 39, .45);
  transition: box-shadow .35s ease, transform .35s ease;
}

[data-template-id="advisora"] .a-timeline-item:hover span,
[data-template-id="advisora"] .a-timeline-item:hover span {
  box-shadow: 0 0 0 10px rgba(201, 162, 39, .12);
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="advisora"] .a-ken,
  [data-template-id="advisora"] .a-ken,
  [data-template-id="advisora"] .a-hero-in,
  [data-template-id="advisora"] .a-hero-in,
  [data-template-id="advisora"] .a-service-track,
  [data-template-id="advisora"] .a-service-track {
    animation: none;
  }
}
`;
