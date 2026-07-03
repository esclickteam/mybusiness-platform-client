export const aelineEditorCss = `
[data-template-id="aeline"],
[data-template-id="aeline"] * {
  box-sizing: border-box;
}

[data-template-id="aeline"] {
  background: #f4f1e9;
  color: #111111;
  font-family: Inter, Arial, sans-serif;
}

[data-template-id="aeline"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="aeline"] button,
[data-template-id="aeline"] a {
  cursor: pointer;
}

[data-template-id="aeline"] [data-section-kind] {
  scroll-margin-top: 120px;
}

[data-template-id="aeline"] .aeline-orb {
  animation: aelineFloat 5.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-orb-delay {
  animation: aelineFloat 6.5s ease-in-out infinite;
  animation-delay: 0.8s;
}

[data-template-id="aeline"] .aeline-marquee-track {
  animation: aelineMarquee 34s linear infinite;
}

[data-template-id="aeline"] [data-visual-editable="true"] {
  outline-offset: 3px;
}

[data-template-id="aeline"] [data-visual-editable="true"][data-visual-hovered="true"] {
  outline: 1px dashed rgba(0, 0, 0, 0.38) !important;
  outline-offset: 4px !important;
}

[data-template-id="aeline"] [data-visual-editable="true"][data-visual-selected="true"] {
  outline: none !important;
  box-shadow: none !important;
}

@keyframes aelineFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-18px) rotate(-1deg);
  }
}

@keyframes aelineMarquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes aelineRevealUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aelineSoftZoom {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes aelinePulseSoft {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.82;
    transform: scale(1.025);
  }
}
`;