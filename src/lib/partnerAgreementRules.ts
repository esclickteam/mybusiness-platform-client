export function exclusiveSelectionBlocked(
  territoryType: string,
  country?: { selectableForExclusive?: boolean } | null
) {
  return territoryType === "exclusive" && country?.selectableForExclusive === false;
}

export const EXCLUSIVITY_NOTICE =
  "Exclusivity becomes effective only after every required signatory has signed, the required payment has been completed, and the agreement is active.";

export function availabilityLabel(value: string) {
  switch (value) {
    case "available":
      return "Available";
    case "agreement_pending":
      return "Agreement pending";
    case "exclusive_active":
      return "Exclusive active";
    case "renewal_window":
      return "Renewal window";
    case "expiring_soon":
      return "Expiring soon";
    default:
      return value;
  }
}
