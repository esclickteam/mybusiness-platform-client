import { localizeBuiltInText } from "./templateCopy";

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

function localizedFallback(fallback: string) {
  return localizeBuiltInText(fallback);
}

export function studioCategoryLabel(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.library.categories.${key}`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioElementLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.elements.${id}.label`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioElementDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.elements.${id}.description`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioSectionKindLabel(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.kind.${key}`, { defaultValue: localizedFallback(fallback) });
}

export function studioSectionKindHint(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.kindHint.${key}`, { defaultValue: localizedFallback(fallback) });
}

export function studioLibraryItemTitle(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.items.${id}.title`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioLibraryItemDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.items.${id}.description`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioSectionTitle(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.sections.${id}.title`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioSectionDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.sections.${id}.description`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioSectionNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.sectionNav.${id}`, { defaultValue: localizedFallback(fallback) });
}

export function studioPortalSectionNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.portalSectionNav.${id}`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioPageNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.pageNav.${id}`, { defaultValue: localizedFallback(fallback) });
}

export function studioPageTitle(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.pages.${id}.title`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioPageDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.pages.${id}.description`, {
    defaultValue: localizedFallback(fallback),
  });
}

export function studioPortalPageNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.portalPageNav.${id}`, { defaultValue: localizedFallback(fallback) });
}
