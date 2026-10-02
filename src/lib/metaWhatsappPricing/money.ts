/** Fixed-point money. Rates are decimal strings from Meta's workbooks. Scale is 1e8. */

const SCALE = 100_000_000n;
const SCALE_DIGITS = 8;

export function parseDecimal(value: string): bigint {
  const text = String(value || "").trim();
  if (!/^\d+(\.\d+)?$/.test(text)) {
    throw new Error(`Invalid decimal: ${value}`);
  }
  const [whole, frac = ""] = text.split(".");
  const digits = (frac + "0".repeat(SCALE_DIGITS)).slice(0, SCALE_DIGITS);
  return BigInt(whole) * SCALE + BigInt(digits);
}

export function formatDecimal(value: bigint, maxFractionDigits = 4): string {
  const negative = value < 0n;
  let absolute = negative ? -value : value;
  const trimDigits = SCALE_DIGITS - maxFractionDigits;
  if (trimDigits > 0) {
    const factor = 10n ** BigInt(trimDigits);
    const remainder = absolute % factor;
    absolute = absolute / factor;
    if (remainder * 2n >= factor) absolute += 1n;
  }
  const factor = 10n ** BigInt(maxFractionDigits);
  const whole = absolute / factor;
  const fraction = (absolute % factor)
    .toString()
    .padStart(maxFractionDigits, "0")
    .replace(/0+$/, "");
  const text = fraction ? `${whole.toString()}.${fraction}` : whole.toString();
  return negative ? `-${text}` : text;
}

export function multiplyDecimal(rate: string, quantity: number): bigint {
  const count = Math.floor(quantity);
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Quantity must be a non-negative integer");
  }
  return parseDecimal(rate) * BigInt(count);
}

export function addMoney(left: bigint, right: bigint): bigint {
  return left + right;
}

export function compareDecimal(left: string, right: string): number {
  const delta = parseDecimal(left) - parseDecimal(right);
  if (delta === 0n) return 0;
  return delta > 0n ? 1 : -1;
}
