type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

export function studioCategoryLabel(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.library.categories.${key}`, { defaultValue: fallback });
}

export function studioElementLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.elements.${id}.label`, { defaultValue: fallback });
}

export function studioElementDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.elements.${id}.description`, {
    defaultValue: fallback,
  });
}

export function studioSectionKindLabel(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.kind.${key}`, { defaultValue: fallback });
}

export function studioSectionKindHint(
  t: TranslateFn,
  key: string,
  fallback: string
) {
  return t(`studio.kindHint.${key}`, { defaultValue: fallback });
}

export function studioLibraryItemTitle(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.items.${id}.title`, { defaultValue: fallback });
}

export function studioLibraryItemDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.items.${id}.description`, { defaultValue: fallback });
}

export function studioSectionTitle(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.sections.${id}.title`, { defaultValue: fallback });
}

export function studioSectionDescription(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.library.sections.${id}.description`, {
    defaultValue: fallback,
  });
}

export function studioSectionNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.sectionNav.${id}`, { defaultValue: fallback });
}

export function studioPortalSectionNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.portalSectionNav.${id}`, { defaultValue: fallback });
}

export function studioPageNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.pageNav.${id}`, { defaultValue: fallback });
}

export function studioPortalPageNavLabel(
  t: TranslateFn,
  id: string,
  fallback: string
) {
  return t(`studio.portalPageNav.${id}`, { defaultValue: fallback });
}
