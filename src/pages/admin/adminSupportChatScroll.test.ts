import { describe, expect, it } from "vitest";
import {
  isNearBottom,
  isNearTop,
  preserveScrollAfterPrepend,
  previewWhatsAppTemplateBody,
  scrollScrollerToBottom,
} from "./adminSupportChatScroll";

function fakeScroller(partial: {
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

describe("adminSupportChatScroll", () => {
  it("detects near-bottom vs reading history", () => {
    expect(
      isNearBottom({ scrollHeight: 2000, scrollTop: 1880, clientHeight: 80 })
    ).toBe(true);
    expect(
      isNearBottom({ scrollHeight: 2000, scrollTop: 200, clientHeight: 80 })
    ).toBe(false);
    expect(isNearTop({ scrollTop: 10 })).toBe(true);
    expect(isNearTop({ scrollTop: 400 })).toBe(false);
  });

  it("scrolls the conversation scroller to its own bottom", () => {
    const el = fakeScroller({
      scrollHeight: 2400,
      scrollTop: 0,
      clientHeight: 400,
    });
    scrollScrollerToBottom(el, false);
    expect(el.scrollTop).toBe(2400);
  });

  it("preserves reading position after older messages prepend", () => {
    const el = fakeScroller({
      scrollHeight: 1800,
      scrollTop: 40,
      clientHeight: 400,
    });
    preserveScrollAfterPrepend(el, 900, 40);
    expect(el.scrollTop).toBe(940);
  });

  it("fills template preview variables", () => {
    expect(
      previewWhatsAppTemplateBody("Hi {{1}}, see {{2}}", {
        "1": "Alex",
        "2": "the agreement",
      })
    ).toBe("Hi Alex, see the agreement");
  });
});
