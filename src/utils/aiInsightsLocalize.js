/**
 * Localize an AI insight card. Prefer server-provided copy when i18n
 * interpolation would wipe meaningful values (e.g. empty site name).
 */
export function localizeInsight(insight, t) {
  if (!insight?.id) return insight;

  const base = `aiInsights.cards.${insight.id}`;
  const title = t(`${base}.title`, { defaultValue: insight.title });

  const siteName = String(insight?.meta?.siteName || "").trim();
  const descriptionOpts = {
    defaultValue: insight.description,
    days: 7,
  };

  let description;
  if (insight.id === "missing_seo") {
    if (siteName) {
      description = t(`${base}.description`, {
        ...descriptionOpts,
        name: siteName,
      });
    } else if (insight.description) {
      // Server already interpolated the real site name; do not overwrite with "".
      description = insight.description;
    } else {
      description = t(`${base}.description`, {
        ...descriptionOpts,
        name: "",
      });
    }
  } else {
    description = t(`${base}.description`, {
      ...descriptionOpts,
      name: siteName,
    });
  }

  const actionLabel = t(`${base}.actionLabel`, {
    defaultValue: insight.actionLabel || insight?.cta?.label || "",
  });

  let metric = insight.metric;
  if (metric && typeof metric.value === "number") {
    const metricKey =
      metric.value === 1 ? `${base}.metricOne` : `${base}.metricOther`;
    metric = {
      ...metric,
      label: t(metricKey, { defaultValue: metric.label }),
    };
  }

  return {
    ...insight,
    title,
    description,
    actionLabel,
    metric,
  };
}
