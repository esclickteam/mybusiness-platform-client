#!/usr/bin/env bash
# Local gate to run before git push.
# GitHub Actions stays required. Do not bypass it with a commit trailer or a bracketed ci marker.
set -euo pipefail
cd "$(dirname "$0")/.."
section() { printf "\n== %s\n" "$*"; }
section "Install"
if [ ! -d node_modules ]; then npm ci; fi
section "Lint"
npm run lint
section "TypeScript"
npm run typecheck
section "Unit tests"
npm test
section "Builder safety"
node --test scripts/saas-bridge-ui.test.mjs
section "Build"
npm run build

if [ "$#" -gt 0 ]; then
  section "Focused command"
  "$@"
fi
