const STICK = 88;

export function scrubSection(section, pin, count, reduce) {
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  if (!section || !pin || reduce || narrow) {
    if (section) section.style.height = "";
    if (pin) {
      pin.style.position = "";
      pin.style.top = "";
      pin.style.left = "";
      pin.style.right = "";
      pin.style.width = "";
    }
    return null;
  }
  const vh = window.innerHeight || 800;
  const slice = Math.round(vh * 0.42);
  const pinHeight = pin.offsetHeight || Math.round(vh - STICK);
  const nextHeight = pinHeight + Math.max(count - 1, 1) * slice;
  if (section.style.height !== `${nextHeight}px`) section.style.height = `${nextHeight}px`;
  const travel = Math.max(nextHeight - pinHeight, 1);
  const scrolled = STICK - section.getBoundingClientRect().top;
  const p = Math.min(1, Math.max(0, scrolled / travel));
  section.style.position = "relative";
  pin.style.left = "0";
  pin.style.right = "0";
  pin.style.width = "100%";
  pin.style.zIndex = "3";
  if (scrolled <= 0) {
    pin.style.position = "relative";
    pin.style.top = "0";
  } else if (scrolled >= travel) {
    pin.style.position = "absolute";
    pin.style.top = `${travel}px`;
  } else {
    pin.style.position = "fixed";
    pin.style.top = `${STICK}px`;
  }
  return p;
}
