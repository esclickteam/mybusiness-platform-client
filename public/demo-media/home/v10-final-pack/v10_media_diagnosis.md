# BizUply homepage media diagnosis (V10)

## 1. Source resolutions (live homepage media)

| Asset | Resolution | Notes |
|---|---|---|
| Raw walkthrough `01–05-*.mp4` | **1440×900** | Best available source today |
| Hero desktop films `hero-*.mp4` | **1280×720** | Cropped + zoomed from 1440×900 |
| Mobile films `mobile-*.mp4` | **720×900** | Cropped from desktop sources |
| Process film | **1280×720** | Same crop pipeline |
| Legacy home `crm/whatsapp/*.mp4` | 1280×800 | Older, low bitrate |
| Gallery templates `*.webp` | **960×(2000–7000)** | Full-page tall shots, only 960px wide |
| Website stills | 1280×800 / 1440×900 | Mixed |

## 2. Where upscale / stretch happens

1. **Capture CSS `transform: scale(1.22–1.42)`** during recording — blurs UI into the source.
2. **Post crop → scale to 1280×720 / 720×900** — enlarges a cropped region past native clarity.
3. **ffmpeg `zoompan`** in polish pipeline — additional digital zoom.
4. **CSS `.b2-theater-film { object-fit: cover; animation: b2-film-ken scale 1.05→1.14 }`** — crops and upscales on the page.
5. **Gallery `object-fit: cover`** on 960px-wide tall pages inside ~920px desktop mock (retina needs ~1800px) — soft + crops titles.

## 3. Files that must be re-recorded

- All Hero / WhatsApp / process walkthrough films (`hero-*`, `mobile-*`, `process-full`, raw `01–05`)
- Must be captured **without** CSS scale transforms and **without** crop-zoom polish
- Target: **1920×1080** desktop masters, CRF ≤17, no scale above 1.0 of source pixels

## 4. Media vs CSS

| Issue | Cause |
|---|---|
| Soft / pixelated product demos | Media pipeline (scale/crop/zoom) **and** CSS ken-burns |
| Buttons/text look cut | CSS `object-fit: cover` + crop pipeline |
| Mobile looks like squeezed desktop | Same desktop crop reused as “mobile” |
| Gallery soft / titles cut | 960px sources + `cover` + tall full-page images |

## 5. Display plan (no cropping of controls)

**Desktop:** Full-viewport 1920×1080 recordings inside browser chrome; `object-fit: contain`; aspect-ratio matches source; remove ken-burns.

**Mobile:** Dedicated vertical compositions — either native mobile-viewport recordings, or letterboxed action panels from high-res masters (never stretched, never cover-cropped past controls).

**Gallery:** Prepare top-of-page hero frames at max native width for desktop + separate mobile portrait crops; `object-position: top`; prefer contain-like framing inside mocks.
