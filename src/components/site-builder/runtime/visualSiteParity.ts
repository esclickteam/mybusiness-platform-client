/**
 * BizUply visual site parity contract
 *
 * Editor and public site must render the same document the same way:
 * 1. visual-react always uses template Component + visual data maps
 *    (__content, __insertedSections, __sectionOrder, …) — never HTML snapshot.
 * 2. Library sections mount via [data-visual-insert-host="true"] when there is
 *    no live anchor, so React page swaps cannot wipe them.
 * 3. Templates that navigate between pages must keep page panels mounted
 *    (hidden) instead of unmounting — see Justora keep-alive.
 * 4. Public TemplateComponent key is templateKey only; data updates go through
 *    props + applyAllVisualDataToDom, not full remounts.
 */

export const VISUAL_INSERT_HOST_SELECTOR =
  '[data-visual-insert-host="true"]' as const;

export const VISUAL_PAGE_STACK_SELECTOR =
  '[data-visual-page-stack="true"]' as const;
