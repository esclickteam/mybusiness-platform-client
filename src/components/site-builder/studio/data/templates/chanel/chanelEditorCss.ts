export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: ltr;
  background: #fbf4ee;
  color: #2b1b15;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow: hidden;
}

.chanel-page {
  background:
    radial-gradient(circle at top left, rgba(200,151,122,0.22), transparent 34rem),
    radial-gradient(circle at 80% 15%, rgba(255,255,255,0.8), transparent 26rem),
    linear-gradient(180deg, #fbf4ee 0%, #fffaf7 42%, #fbf4ee 100%);
  min-height: 100vh;
}

.chanel-container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.chanel-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(43,27,21,0.15);
  background: rgba(255,255,255,0.62);
  color: #7b5f52;
  border-radius: 999px;
  padding: 9px 15px;
  font-size: 13px;
  letter-spacing: .05em;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
}

.chanel-pill::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #c8977a;
  box-shadow: 0 0 0 8px rgba(200,151,122,0.18);
}

.chanel-section {
  padding: 105px 0;
  position: relative;
}

.chanel-title {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  line-height: .95;
  letter-spacing: -0.055em;
  color: #2b1b15;
}

.chanel-reveal {
  opacity: 0;
  transform: translateY(34px);
  animation: chanelReveal .95s cubic-bezier(.2,.7,.2,1) forwards;
}

.chanel-delay-1 { animation-delay: .12s; }
.chanel-delay-2 { animation-delay: .24s; }
.chanel-delay-3 { animation-delay: .36s; }

@keyframes chanelReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chanel-float {
  animation: chanelFloat 5.8s ease-in-out infinite;
}

@keyframes chanelFloat {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-18px) rotate(1deg); }
}

.chanel-spin {
  animation: chanelSpin 18s linear infinite;
}

@keyframes chanelSpin {
  to { transform: rotate(360deg); }
}

.chanel-marquee {
  overflow: hidden;
  white-space: nowrap;
  border-top: 1px solid rgba(43,27,21,0.12);
  border-bottom: 1px solid rgba(43,27,21,0.12);
  background: rgba(255,255,255,0.48);
}

.chanel-marquee-track {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  padding: 22px 0;
  animation: chanelMarquee 24s linear infinite;
}

.chanel-marquee:hover .chanel-marquee-track {
  animation-play-state: paused;
}

@keyframes chanelMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.chanel-card {
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(43,27,21,0.12);
  border-radius: 34px;
  box-shadow: 0 24px 80px rgba(43,27,21,0.08);
  backdrop-filter: blur(18px);
  transition: transform .45s cubic-bezier(.2,.7,.2,1), box-shadow .45s ease, border-color .45s ease;
}

.chanel-card:hover {
  transform: translateY(-10px);
  border-color: rgba(200,151,122,0.45);
  box-shadow: 0 34px 100px rgba(43,27,21,0.14);
}

.chanel-image {
  overflow: hidden;
  border-radius: 30px;
  background: #ead9cf;
}

.chanel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .8s cubic-bezier(.2,.7,.2,1), filter .8s ease;
}

.chanel-image:hover img,
.chanel-card:hover .chanel-image img {
  transform: scale(1.08);
  filter: saturate(1.04) contrast(1.04);
}

.chanel-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 999px;
  background: #2b1b15;
  color: #fffaf7;
  border: 1px solid rgba(43,27,21,0.25);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 20px 44px rgba(43,27,21,0.18);
  transition: transform .28s ease, background .28s ease;
}

.chanel-button:hover {
  transform: translateY(-3px);
  background: #c8977a;
}

.chanel-button-light {
  background: rgba(255,255,255,0.7);
  color: #2b1b15;
}

.chanel-button-light:hover {
  background: #2b1b15;
  color: #fff;
}

.chanel-price-row {
  display: grid;
  grid-template-columns: 70px 1fr 110px 130px;
  gap: 22px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(43,27,21,0.14);
  transition: padding-left .35s ease, color .35s ease;
}

.chanel-price-row:hover {
  padding-left: 18px;
  color: #c8977a;
}

.chanel-price-thumb {
  width: 94px;
  height: 94px;
  border-radius: 999px;
  overflow: hidden;
  transform: scale(.95);
  transition: transform .35s ease;
}

.chanel-price-row:hover .chanel-price-thumb {
  transform: scale(1.06) rotate(4deg);
}

.chanel-input,
.chanel-select,
.chanel-textarea {
  width: 100%;
  border: 1px solid rgba(43,27,21,0.13);
  background: rgba(255,255,255,0.7);
  color: #2b1b15;
  border-radius: 18px;
  padding: 16px 18px;
  outline: none;
  font: inherit;
}

.chanel-textarea {
  min-height: 132px;
  resize: vertical;
}

.chanel-input:focus,
.chanel-select:focus,
.chanel-textarea:focus {
  border-color: rgba(200,151,122,0.75);
  box-shadow: 0 0 0 5px rgba(200,151,122,0.14);
}

@media (max-width: 900px) {
  .chanel-section {
    padding: 72px 0;
  }

  .chanel-container {
    width: min(100% - 28px, 1180px);
  }

  .chanel-price-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .chanel-price-thumb {
    width: 82px;
    height: 82px;
  }
}
`;