# Homepage first-paint Playwright results

Date: 2026-11-02

## Command

```bash
npm run test:home-first-paint
```

## Result

4 passed (desktop + mobile × EN cold load + HE Slow-4G hard refresh)

Recordings / traces are written under `e2e-results/` (gitignored):

- video.webm per test
- trace.zip per test
- screenshots on failure

## Assertions covered

- No `.home-hero` / legacy dark shell at any sampled frame during load
- Purple `.hx-hero` + `data-home-design="purple"` present from first paint
- Body background is brand purple `#5b21b6`
- Hebrew route keeps Hebrew headline after hard refresh under Slow 4G
- Simulated React takeover never reintroduces the legacy dark hero
