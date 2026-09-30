export function exclusiveSelectionBlocked(
  territoryType: string,
  country?: { selectableForExclusive?: boolean } | null
) {
  return territoryType === "exclusive" && country?.selectableForExclusive === false;
}

export const EXCLUSIVITY_NOTICE =
  "Exclusivity becomes effective only after the agreement is signed and the required payment has been completed.";

export function availabilityLabel(value: string) {
  switch (value) {
    case "available":
      return "Available";
    case "agreement_pending":
      return "Agreement pending";
    case "exclusive_active":
      return "Exclusive active";
    case "expiring_soon":
      return "Expiring soon";
    default:
      return value;
  }
}
