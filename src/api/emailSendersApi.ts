import API from "../api";

export type EmailSenderType = "bizuply_smtp" | "gmail" | "outlook";
export type EmailSenderStatus = "pending" | "verified" | "failed" | "revoked";

export type EmailSenderDnsRecord = {
  type?: string;
  name?: string;
  value?: string;
  priority?: string;
};

export type EmailSender = {
  senderId: string;
  businessId: string;
  displayName: string;
  email: string;
  domain?: string;
  type: EmailSenderType;
  verificationStatus: EmailSenderStatus;
  verifiedAt: string | null;
  isDefault: boolean;
  replyTo?: string;
  fromLabel: string;
  domainVerification?: {
    status?: string;
    records?: EmailSenderDnsRecord[];
  };
};

export async function listEmailSenders() {
  const { data } = await API.get<{ success: boolean; senders: EmailSender[] }>(
    "/email-senders"
  );
  return (data.senders || []).filter((row) => row.type === "bizuply_smtp");
}

export async function listVerifiedEmailSenders() {
  const { data } = await API.get<{ success: boolean; senders: EmailSender[] }>(
    "/email-senders/verified"
  );
  return (data.senders || []).filter(
    (row) => row.type === "bizuply_smtp" && row.verificationStatus === "verified"
  );
}

export async function createEmailSender(body: {
  displayName: string;
  email: string;
  replyTo?: string;
}) {
  const { data } = await API.post<{ success?: boolean; sender: EmailSender }>(
    "/email-senders",
    body
  );
  return data.sender;
}

export async function refreshEmailSender(senderId: string) {
  const { data } = await API.post<{
    sender: EmailSender;
    domainInfo?: { records?: EmailSenderDnsRecord[]; verified?: boolean };
  }>(`/email-senders/${senderId}/refresh`);
  return data;
}

export async function setDefaultEmailSender(senderId: string) {
  const { data } = await API.post<{ sender: EmailSender }>(
    `/email-senders/${senderId}/default`
  );
  return data.sender;
}

export async function renameEmailSender(senderId: string, displayName: string) {
  const { data } = await API.patch<{ sender: EmailSender }>(
    `/email-senders/${senderId}`,
    { displayName }
  );
  return data.sender;
}

export async function deleteEmailSender(senderId: string) {
  await API.delete(`/email-senders/${senderId}`);
}
