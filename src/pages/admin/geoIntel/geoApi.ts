import API from "../../../api";

export async function geoGet(path: string, params?: Record<string, unknown>) {
  const { data } = await API.get(`/geo-intel${path}`, { params });
  return data;
}

export async function geoPost(
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, unknown>
) {
  const { data } = await API.post(`/geo-intel${path}`, body || {}, { params });
  return data;
}
