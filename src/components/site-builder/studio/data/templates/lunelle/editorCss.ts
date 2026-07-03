export const lunelleEditorCss = `
[data-template-id="lunelle"],
[data-template-id="lunelle"] * {
  box-sizing: border-box;
}

[data-template-id="lunelle"] {
  direction: rtl;
  background: #fff7f1;
  color: #2a171c;
  font-family: Inter, Arial, sans-serif;
}

[data-template-id="lunelle"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="lunelle"] a,
[data-template-id="lunelle"] button {
  cursor: pointer;
}

[data-template-id="lunelle"] .lunelle-serif {
  font-family: Georgia, "Times New Roman", serif;
}

[data-template-id="lunelle"] .lunelle-reveal {
  animation: lunelleRevealUp .9s cubic-bezier(.2,.8,.2,1) both;
}

[data-template-id="lunelle"] .lunelle-float {
  animation: lunelleFloat 5.8s ease-in-out infinite;
}

[data-template-id="lunelle"] .lunelle-pulse {
  animation: lunellePulse 4.8s ease-in-out infinite;
}

[data-template-id="lunelle"] .lunelle-marquee {
  animation: lunelleMarquee 34s linear infinite;
}

[data-template-id="lunelle"] .lunelle-image-hover {
  transition: transform .75s cubic-bezier(.2,.8,.2,1), filter .75s ease;
}

[data-template-id="lunelle"] .lunelle-card:hover .lunelle-image-hover {
  transform: scale(1.06);
  filter: saturate(1.08) contrast(1.04);
}

[data-section-kind] {
  scroll-margin-top: 120px;
}

@keyframes lunelleRevealUp {
  from {
    opacity: 0;
    transform: translateY(34px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lunelleFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-16px) rotate(-1.2deg);
  }
}

@keyframes lunellePulse {
  0%, 100% {
    opacity: .55;
    transform: scale(1);
  }
  50% {
    opacity: .95;
    transform: scale(1.08);
  }
}

@keyframes lunelleMarquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}
`;