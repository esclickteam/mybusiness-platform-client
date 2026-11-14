export type DemoCampaign = {
  id: "winter" | "site";
  leads: number;
  cost: number;
};

export function campaignComparison(current: DemoCampaign, other: DemoCampaign) {
  const leadGap = Math.round(((current.leads - other.leads) / other.leads) * 100);
  const costGap = Math.round(((other.cost - current.cost) / other.cost) * 100);
  return { leadGap, costGap };
}
