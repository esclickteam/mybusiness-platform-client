export const velmoraEditorCss = `
[data-template-id="velmora"] .opacity-0,
[data-template-id="velmora"] [class*="opacity-0"] {
  opacity: 1 !important;
}

/* Fan product cards */
[data-template-id="velmora"] [data-velmora-fan-card="true"] {
  z-index: var(--velmora-fan-z);
  transform: var(--velmora-fan-transform);
}

[data-template-id="velmora"] [data-velmora-fan-card="true"]:hover {
  z-index: 20 !important;
  transform: translateY(-40px) rotate(0deg) !important;
  box-shadow: 0 38px 100px rgba(0,0,0,0.22) !important;
}

/* Moving galleries */
[data-template-id="velmora"] [data-velmora-moving-gallery-track][data-velmora-reverse="false"] {
  animation: velmoraMarquee 38s linear infinite;
}

[data-template-id="velmora"] [data-velmora-moving-gallery-track][data-velmora-reverse="true"] {
  animation: velmoraMarqueeReverse 38s linear infinite;
}

@keyframes velmoraMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

@keyframes velmoraMarqueeReverse {
  0% { transform: translateX(-33.333%); }
  100% { transform: translateX(0); }
}
`;