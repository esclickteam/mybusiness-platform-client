import API from "../api";

export async function saveBenefitsWheelSpin(
  slug: string,
  payload: { prizeLabel: string; segmentIndex: number; visitorId?: string }
) {
  const visitorId =
    payload.visitorId ||
    (typeof localStorage !== "undefined"
      ? localStorage.getItem("bizuply:visitor-id") ||
        (() => {
          const id = `v_${Math.random().toString(36).slice(2, 12)}`;
          localStorage.setItem("bizuply:visitor-id", id);
          return id;
        })()
      : "");

  const { data } = await API.post(
    `/site-builder/public/${encodeURIComponent(slug)}/plugins/benefits-wheel/spin`,
    {
      prizeLabel: payload.prizeLabel,
      segmentIndex: payload.segmentIndex,
      visitorId,
    }
  );
  return data;
}
