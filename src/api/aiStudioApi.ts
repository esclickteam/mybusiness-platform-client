import API from "../api";

export type AiStudioStatus = {
  success: boolean;
  enabled: boolean;
  flagOn: boolean;
  allowlisted: boolean;
  publishEnabled: boolean;
  freeCodePocEnabled: boolean;
  provider?: {
    openaiConfigured?: boolean;
    model?: string;
  };
  credits?: {
    balance: number;
    grantDefault: number;
    perTurn: number;
    billingEnabled: boolean;
  };
  responsesProbe?: {
    ok: boolean;
    reason?: string;
  };
};

export async function getAiStudioStatus(probe = false) {
  const { data } = await API.get("/ai-studio/status", {
    params: probe ? { probe: 1 } : undefined,
  });
  return data as AiStudioStatus;
}

export async function createAiStudioProject(body: {
  title?: string;
  templateKey?: string;
  track?: "visual_json" | "free_code";
}) {
  const { data } = await API.post("/ai-studio/projects", body);
  return data;
}

export async function getAiStudioProject(projectId: string) {
  const { data } = await API.get(`/ai-studio/projects/${projectId}`);
  return data;
}

export async function listAiStudioProjects() {
  const { data } = await API.get("/ai-studio/projects");
  return data;
}

export async function chatAiStudioProject(projectId: string, message: string) {
  const { data } = await API.post(`/ai-studio/projects/${projectId}/chat`, {
    message,
  });
  return data;
}

export async function restoreAiStudioVersion(projectId: string, versionId: string) {
  const { data } = await API.post(
    `/ai-studio/projects/${projectId}/versions/${versionId}/restore`
  );
  return data;
}

export async function linkAiStudioSite(projectId: string, siteId: string) {
  const { data } = await API.post(`/ai-studio/projects/${projectId}/link-site`, {
    siteId,
  });
  return data;
}

export async function requestAiStudioPublish(projectId: string) {
  const { data } = await API.post(
    `/ai-studio/projects/${projectId}/request-publish`
  );
  return data;
}

export async function confirmAiStudioPublish(projectId: string) {
  const { data } = await API.post(
    `/ai-studio/projects/${projectId}/confirm-publish`,
    { confirm: true }
  );
  return data;
}
