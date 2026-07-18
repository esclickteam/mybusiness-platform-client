type ScrollLockSnapshot = {
  bodyOverflow: string;
  scrollerOverflow: string | null;
};

export function lockPageScroll(): () => void {
  const scroller = document.querySelector(
    ".app-scroll-area"
  ) as HTMLElement | null;

  const snapshot: ScrollLockSnapshot = {
    bodyOverflow: document.body.style.overflow,
    scrollerOverflow: scroller?.style.overflow ?? null,
  };

  document.body.style.overflow = "hidden";

  if (scroller) {
    scroller.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = snapshot.bodyOverflow;

    if (scroller) {
      scroller.style.overflow = snapshot.scrollerOverflow ?? "";
    }
  };
}
