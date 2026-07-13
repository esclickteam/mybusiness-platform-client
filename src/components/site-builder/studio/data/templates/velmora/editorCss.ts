export const velmoraEditorCss = `
/*
  Velmora editor CSS
  נטען עבור Velmora בתוך העורך.
  המטרה: לשמור על אותו עיצוב כמו צפייה, ולמנוע מצב שתמונות מופיעות לשנייה ואז נעלמות.
*/

[data-template-id="velmora"] {
  direction: rtl;
  background: #f6f2ea;
  color: #27231f;
}

[data-template-id="velmora"],
[data-template-id="velmora"] * {
  box-sizing: border-box;
}

[data-template-id="velmora"] img,
[data-template-id="velmora"] video {
  display: block !important;
  max-width: 100%;
}

[data-template-id="velmora"] img {
  opacity: 1 !important;
  visibility: visible !important;
  object-fit: cover;
  object-position: center;
}

[data-template-id="velmora"] picture,
[data-template-id="velmora"] picture img {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

[data-template-id="velmora"] [class*="opacity-0"] img,
[data-template-id="velmora"] [class*="opacity-0"] picture,
[data-template-id="velmora"] [style*="opacity: 0"] img,
[data-template-id="velmora"] [style*="opacity:0"] img {
  opacity: 1 !important;
  visibility: visible !important;
}

[data-template-id="velmora"] [style*="visibility:hidden"],
[data-template-id="velmora"] [style*="visibility: hidden"] {
  visibility: visible !important;
}

[data-template-id="velmora"] button,
[data-template-id="velmora"] a {
  cursor: pointer;
}

[data-template-id="velmora"] .serif-title,
[data-template-id="velmora"] [class*="Georgia"],
[data-template-id="velmora"] [class*="Times_New_Roman"] {
  font-family: Georgia, 'Times New Roman', serif;
}

/* Reveal static fix */
[data-template-id="velmora"] .transition-all.ease-out.opacity-0,
[data-template-id="velmora"] [class*="transition-all"][class*="ease-out"][class*="opacity-0"] {
  opacity: 1 !important;
}

[data-template-id="velmora"] .transition-all.ease-out.translate-y-10,
[data-template-id="velmora"] .transition-all.ease-out.translate-y-12,
[data-template-id="velmora"] [class*="transition-all"][class*="ease-out"][class*="translate-y-10"],
[data-template-id="velmora"] [class*="transition-all"][class*="ease-out"][class*="translate-y-12"] {
  transform: translateY(0) !important;
}

[data-template-id="velmora"] [class*="transition-all"][class*="ease-out"] img {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/*
  תיקון מרכזי:
  כל תמונה חשובה נמצאת גם כ-img וגם כרקע CSS.
  זה מונע מה-Visual Editor להעלים את התמונה אחרי טעינה.
*/
[data-template-id="velmora"] [data-velmora-fan-card="true"],
[data-template-id="velmora"] [data-velmora-safe-image-box="true"],
[data-template-id="velmora"] [data-velmora-hard-image="true"] {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;

  background-color: #f6f2ea !important;
  background-image: var(--velmora-hard-bg, var(--velmora-card-bg)) !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"] {
  z-index: var(--velmora-fan-z) !important;
  transform: var(--velmora-fan-transform) !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"]::before,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"]::before,
[data-template-id="velmora"] [data-velmora-hard-image="true"]::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;

  display: block !important;

  background-image: var(--velmora-hard-bg, var(--velmora-card-bg)) !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;

  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: none !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"] > img,
[data-template-id="velmora"] [data-velmora-fan-card="true"] > video,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] > img,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] > video,
[data-template-id="velmora"] [data-velmora-hard-image="true"] > img,
[data-template-id="velmora"] [data-velmora-hard-image="true"] > video {
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;

  display: block !important;

  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  max-width: none !important;

  object-fit: cover !important;
  object-position: center !important;

  opacity: 1 !important;
  visibility: visible !important;

  pointer-events: none !important;

  transform: translateZ(0) !important;
  transition: transform 700ms ease !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"] > div:nth-of-type(1) {
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"] > div:nth-of-type(2) {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 3 !important;

  transform: translateY(100%) !important;
  transition: transform 500ms ease !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"]:hover > div:nth-of-type(2) {
  transform: translateY(0) !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"]:hover {
  z-index: 20 !important;
  transform: translateY(-40px) rotate(0deg) !important;
  box-shadow: 0 38px 100px rgba(0, 0, 0, 0.22) !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"]:hover > img,
[data-template-id="velmora"] [data-velmora-fan-card="true"]:hover > video,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"]:hover > img,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"]:hover > video {
  transform: scale(1.05) translateZ(0) !important;
}

[data-template-id="velmora"] [data-velmora-fan-card="true"] img[style],
[data-template-id="velmora"] [data-velmora-fan-card="true"] video[style],
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] img[style],
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] video[style] {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Product fan cards - fallback for old Tailwind classes */
[data-template-id="velmora"] .rotate-\\[-7deg\\] {
  transform: translateY(32px) rotate(-7deg);
  z-index: 1;
}

[data-template-id="velmora"] .rotate-\\[-4deg\\] {
  transform: translateY(12px) rotate(-4deg);
  z-index: 2;
}

[data-template-id="velmora"] .rotate-\\[-2deg\\] {
  transform: translateY(-12px) rotate(-2deg);
  z-index: 3;
}

[data-template-id="velmora"] .rotate-\\[2deg\\] {
  transform: translateY(-8px) rotate(2deg);
  z-index: 4;
}

[data-template-id="velmora"] .rotate-\\[5deg\\] {
  transform: translateY(16px) rotate(5deg);
  z-index: 3;
}

[data-template-id="velmora"] .rotate-\\[8deg\\] {
  transform: translateY(32px) rotate(8deg);
  z-index: 2;
}

/* Moving galleries */
[data-template-id="velmora"] [data-velmora-moving-gallery="home"],
[data-template-id="velmora"] [data-velmora-moving-gallery-track] {
  visibility: visible !important;
}

[data-template-id="velmora"] [data-velmora-moving-gallery-track] img,
[data-template-id="velmora"] [data-velmora-moving-gallery-track] video {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  object-fit: cover !important;
}

[data-template-id="velmora"] [data-velmora-moving-gallery-track][data-velmora-reverse="false"] {
  animation: velmoraMarquee 38s linear infinite;
}

[data-template-id="velmora"] [data-velmora-moving-gallery-track][data-velmora-reverse="true"] {
  animation: velmoraMarqueeReverse 38s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraMarquee_38s_linear_infinite\\] {
  animation: velmoraMarquee 38s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraMarqueeReverse_38s_linear_infinite\\] {
  animation: velmoraMarqueeReverse 38s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraCollectionsMarquee_42s_linear_infinite\\] {
  animation: velmoraCollectionsMarquee 42s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraCollectionsReverse_42s_linear_infinite\\] {
  animation: velmoraCollectionsReverse 42s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraCustomMarquee_40s_linear_infinite\\] {
  animation: velmoraCustomMarquee 40s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraCustomReverse_40s_linear_infinite\\] {
  animation: velmoraCustomReverse 40s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraContactMarquee_42s_linear_infinite\\] {
  animation: velmoraContactMarquee 42s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraContactReverse_42s_linear_infinite\\] {
  animation: velmoraContactReverse 42s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraProductMarquee_42s_linear_infinite\\] {
  animation: velmoraProductMarquee 42s linear infinite;
}

[data-template-id="velmora"] .animate-\\[velmoraProductReverse_42s_linear_infinite\\] {
  animation: velmoraProductReverse 42s linear infinite;
}

[data-template-id="velmora"] .bg-cover,
[data-template-id="velmora"] [style*="background-image"] {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

/* Hover overlays */
[data-template-id="velmora"] .group:hover .group-hover\\:scale-105 {
  transform: scale(1.05);
}

[data-template-id="velmora"] .group:hover .group-hover\\:opacity-60 {
  opacity: 0.6;
}

[data-template-id="velmora"] .group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

[data-template-id="velmora"] .group:hover .group-hover\\:translate-y-0 {
  transform: translateY(0);
}

[data-template-id="velmora"] .group:hover .group-hover\\:-translate-y-2 {
  transform: translateY(-8px);
}

[data-template-id="velmora"] .group:hover .group-hover\\:-translate-y-10 {
  transform: translateY(-40px);
}

/* Keyframes - Home */
@keyframes velmoraMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes velmoraMarqueeReverse {
  0% {
    transform: translateX(-33.333%);
  }

  100% {
    transform: translateX(0);
  }
}

/* Keyframes - Projects */
@keyframes velmoraCollectionsMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes velmoraCollectionsReverse {
  0% {
    transform: translateX(-33.333%);
  }

  100% {
    transform: translateX(0);
  }
}

/* Keyframes - Custom */
@keyframes velmoraCustomMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes velmoraCustomReverse {
  0% {
    transform: translateX(-33.333%);
  }

  100% {
    transform: translateX(0);
  }
}

/* Keyframes - Contact */
@keyframes velmoraContactMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes velmoraContactReverse {
  0% {
    transform: translateX(-33.333%);
  }

  100% {
    transform: translateX(0);
  }
}

/* Keyframes - Product */
@keyframes velmoraProductMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes velmoraProductReverse {
  0% {
    transform: translateX(-33.333%);
  }

  100% {
    transform: translateX(0);
  }
}

/* Extra template animations */
@keyframes velmoraFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-14px);
  }
}

@keyframes velmoraSoftPulse {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.035);
  }
}


/* HARD IMAGE FINAL OVERRIDE - keeps collection/product images visible even if the editor hides img nodes */
[data-template-id="velmora"] [data-velmora-hard-image="true"],
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
  background-color: #f6f2ea !important;
  background-image: var(--velmora-hard-bg, var(--velmora-card-bg)) !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

[data-template-id="velmora"] [data-velmora-hard-image="true"]::before,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"]::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  display: block !important;
  background-image: var(--velmora-hard-bg, var(--velmora-card-bg)) !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: none !important;
}

[data-template-id="velmora"] [data-velmora-hard-image="true"] > img,
[data-template-id="velmora"] [data-velmora-hard-image="true"] > video,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] > img,
[data-template-id="velmora"] [data-velmora-safe-image-box="true"] > video {
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  max-width: none !important;
  object-fit: cover !important;
  object-position: center !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: none !important;
}

/* Section selection spacing */
[data-template-id="velmora"] [data-section-kind] {
  scroll-margin-top: 120px;
}
`;
