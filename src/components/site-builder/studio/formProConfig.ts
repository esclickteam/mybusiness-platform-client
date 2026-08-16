export type BizuplyFormConditionOperator = "equals" | "notEquals" | "contains";

export type BizuplyFormCondition = {
  fieldId: string;
  operator: BizuplyFormConditionOperator;
  value: string;
};

export type BizuplyFormStep = {
  id: string;
  title: string;
};

export function normalizeCondition(
  value: unknown,
): BizuplyFormCondition | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const source = value as Partial<BizuplyFormCondition>;
  const fieldId = String(source.fieldId || "").trim();
  if (!fieldId) return undefined;
  const operator =
    source.operator === "notEquals" || source.operator === "contains"
      ? source.operator
      : "equals";
  return {
    fieldId,
    operator,
    value: String(source.value || ""),
  };
}

export function normalizeSteps(value: unknown): BizuplyFormStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((step, index) => ({
      id: String(step?.id || `step-${index + 1}`),
      title: String(step?.title || `שלב ${index + 1}`),
    }))
    .filter((step) => step.id);
}

export function conditionMatches(
  actual: string,
  condition: BizuplyFormCondition,
): boolean {
  const left = String(actual || "").trim().toLowerCase();
  const right = String(condition.value || "").trim().toLowerCase();
  if (condition.operator === "contains") return left.includes(right);
  if (condition.operator === "notEquals") return left !== right;
  return left === right;
}

export function isSafeRedirectUrl(value: string): boolean {
  const url = String(value || "").trim();
  if (!url) return false;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
