/** The track is [clone of the last slide, ...slides, clone of the first slide]. */

export function clampCarouselIndex(index: number, length: number) {
  if (length <= 0) return 0;
  if (!Number.isFinite(index)) return Math.min(1, length - 1);
  return Math.min(length - 1, Math.max(0, Math.trunc(index)));
}

/**
 * Move one step. The cloned ends snap back onto the real slide they duplicate
 * instead of advancing past the track.
 */
export function carouselStep(index: number, length: number): { index: number; animate: boolean } {
  if (length <= 1) return { index: 0, animate: false };
  const safe = clampCarouselIndex(index, length);
  const last = length - 1;
  if (safe <= 0) return { index: Math.max(1, length - 2), animate: false };
  if (safe >= last) return { index: 1, animate: false };
  return { index: safe + 1, animate: true };
}
