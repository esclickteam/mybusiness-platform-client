import API from "../../../api";

export async function gpGet(path: string, params?: Record<string, unknown>) {
  const { data } = await API.get(`/admin/global-partners${path}`, { params });
  return data;
}

export async function gpPost(
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, unknown>
) {
  const { data } = await API.post(`/admin/global-partners${path}`, body || {}, {
    params,
  });
  return data;
}

export async function gpPatch(
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, unknown>
) {
  const { data } = await API.patch(`/admin/global-partners${path}`, body || {}, {
    params,
  });
  return data;
}
