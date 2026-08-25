import { describe, expect, it } from "vitest";
import {
  isNearBottom,
  preserveScrollerOnResize,
  scrollScrollerToBottom,
} from "./whatsAppWebScroll";

function fakeScroller(partial: Partial<HTMLElement> & {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}) {
  return {
    scrollTo: (opts: { top: number }) => {
      partial.scrollTop = opts.top;
    },
    ...partial,
  } as HTMLElement;
}

describe("whatsAppWebScroll", () => {
  it("treats a scroller as near bottom only within the threshold", () => {
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 940, clientHeight: 80 })
    ).toBe(true);
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 200, clientHeight: 80 })
    ).toBe(false);
  });

  it("scrolls only the given scroller to its own bottom", () => {
    const el = fakeScroller({
      scrollHeight: 800,
      scrollTop: 10,
      clientHeight: 200,
    });
    scrollScrollerToBottom(el, false);
    expect(el.scrollTop).toBe(800);
  });

  it("keeps history position if a resize reset scrollTop to 0", () => {
    const el = fakeScroller({
      scrollHeight: 800,
      scrollTop: 0,
      clientHeight: 200,
    });
    preserveScrollerOnResize(el, {
      wasNearBottom: false,
      previousScrollTop: 340,
    });
    expect(el.scrollTop).toBe(340);
  });

  it("pins to the bottom after a resize only when already near bottom", () => {
    const el = fakeScroller({
      scrollHeight: 800,
      scrollTop: 100,
      clientHeight: 200,
    });
    preserveScrollerOnResize(el, {
      wasNearBottom: true,
      previousScrollTop: 100,
    });
    expect(el.scrollTop).toBe(800);
  });
});
