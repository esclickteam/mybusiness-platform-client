import { describe, expect, it } from "vitest";
import { carouselStep, clampCarouselIndex } from "./carouselIndex";

describe("carousel index", () => {
  const length = 9;

  it("advances inside the track", () => {
    expect(carouselStep(1, length)).toEqual({ index: 2, animate: true });
    expect(carouselStep(7, length)).toEqual({ index: 8, animate: true });
  });

  it("snaps the trailing clone back to the real first slide", () => {
    expect(carouselStep(8, length)).toEqual({ index: 1, animate: false });
    expect(carouselStep(20, length).index).toBeLessThan(length);
  });

  it("snaps the leading clone back to the real last slide", () => {
    expect(carouselStep(0, length)).toEqual({ index: 7, animate: false });
    expect(carouselStep(-3, length).index).toBeGreaterThanOrEqual(0);
  });

  it("never returns an index the slide list cannot read", () => {
    for (let index = -5; index < 20; index += 1) {
      const next = carouselStep(index, length).index;
      expect(next).toBeGreaterThanOrEqual(0);
      expect(next).toBeLessThan(length);
    }
    expect(clampCarouselIndex(Number.NaN, length)).toBe(1);
    expect(clampCarouselIndex(4, 0)).toBe(0);
  });
});
