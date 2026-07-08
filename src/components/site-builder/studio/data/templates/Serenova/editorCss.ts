export const serenovaEditorCss = `
[data-template-id="serenova"],
[data-template-id="serenova-preview"] {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: #f7f1e7;
  color: #24352d;
}

.serenova-shell {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 8%, rgba(171, 197, 166, 0.35), transparent 28%),
    radial-gradient(circle at 88% 20%, rgba(210, 188, 153, 0.34), transparent 30%),
    linear-gradient(180deg, #f8f2e8 0%, #f2eadc 48%, #eef3e9 100%);
}

.serenova-reveal {
  opacity: 0;
  transform: translateY(26px);
  animation: serenovaReveal 0.95s cubic-bezier(.2,.75,.2,1) forwards;
}

.serenova-reveal-delay-1 { animation-delay: .12s; }
.serenova-reveal-delay-2 { animation-delay: .22s; }
.serenova-reveal-delay-3 { animation-delay: .34s; }
.serenova-reveal-delay-4 { animation-delay: .46s; }

@keyframes serenovaReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.serenova-float {
  animation: serenovaFloat 6.5s ease-in-out infinite;
}

@keyframes serenovaFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.serenova-marquee {
  display: flex;
  width: max-content;
  animation: serenovaMarquee 26s linear infinite;
}

@keyframes serenovaMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

.serenova-soft-card {
  background: rgba(255,255,255,.62);
  border: 1px solid rgba(36,53,45,.12);
  box-shadow: 0 24px 70px rgba(36,53,45,.10);
  backdrop-filter: blur(16px);
}

.serenova-image-mask {
  clip-path: inset(8% 8% 8% 8% round 34px);
  animation: serenovaMask 1.25s cubic-bezier(.2,.75,.2,1) forwards;
}

@keyframes serenovaMask {
  to { clip-path: inset(0% 0% 0% 0% round 34px); }
}

.serenova-sticky-card {
  position: sticky;
  top: 110px;
}

@media (max-width: 768px) {
  .serenova-sticky-card {
    position: relative;
    top: auto;
  }

  .serenova-marquee {
    animation-duration: 18s;
  }
}
`;