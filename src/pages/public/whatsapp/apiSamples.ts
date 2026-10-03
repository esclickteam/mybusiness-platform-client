/**
 * Code samples for the Bizuply External WhatsApp API.
 * Request/response shapes mirror the server OpenAPI document served at
 * /api/v1/whatsapp/openapi.json; keep them in sync when the API changes.
 */
import type { CodeSample } from "./ui";

const BASE = "https://api.bizuply.com/api/v1/whatsapp";

export const SEND_BODY = `{
  "to": "+15551234567",
  "template": "order_update",
  "language": "en",
  "variables": ["Avery", "1042"],
  "externalId": "order_1042"
}`;

export const SEND_RESPONSE = `{
  "success": true,
  "messageId": "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c",
  "metaMessageId": "wamid.HBgLMTU1NTEyMzQ1NjcVAgARGBI...",
  "status": "accepted",
  "externalId": "order_1042"
}`;

export const SEND_REPLAY_RESPONSE = `{
  "success": true,
  "messageId": "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c",
  "metaMessageId": "wamid.HBgLMTU1NTEyMzQ1NjcVAgARGBI...",
  "status": "delivered",
  "externalId": "order_1042",
  "idempotent": true
}`;

export const SEND_SAMPLES: CodeSample[] = [
  {
    label: "cURL",
    language: "bash",
    code: `curl -X POST "${BASE}/messages/template" \\
  -H "Authorization: Bearer $BIZUPLY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: order-1042-confirmation" \\
  -d '{
    "to": "+15551234567",
    "template": "order_update",
    "language": "en",
    "variables": ["Avery", "1042"],
    "externalId": "order_1042"
  }'`,
  },
  {
    label: "JavaScript",
    language: "js",
    code: `const res = await fetch("${BASE}/messages/template", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": "order-1042-confirmation",
  },
  body: JSON.stringify({
    to: "+15551234567",
    template: "order_update",
    language: "en",
    variables: ["Avery", "1042"],
    externalId: "order_1042",
  }),
});

const data = await res.json();
if (!res.ok) throw new Error(\`\${data.error.code}: \${data.error.message}\`);
console.log(data.messageId, data.status);`,
  },
  {
    label: "Python",
    language: "python",
    code: `import os
import requests

res = requests.post(
    "${BASE}/messages/template",
    headers={
        "Authorization": f"Bearer {os.environ['BIZUPLY_API_KEY']}",
        "Idempotency-Key": "order-1042-confirmation",
    },
    json={
        "to": "+15551234567",
        "template": "order_update",
        "language": "en",
        "variables": ["Avery", "1042"],
        "externalId": "order_1042",
    },
    timeout=30,
)
data = res.json()
if not res.ok:
    raise RuntimeError(f"{data['error']['code']}: {data['error']['message']}")
print(data["messageId"], data["status"])`,
  },
];

export const LIST_TEMPLATES_SAMPLES: CodeSample[] = [
  {
    label: "cURL",
    language: "bash",
    code: `curl "${BASE}/templates" \\
  -H "Authorization: Bearer $BIZUPLY_API_KEY"`,
  },
  {
    label: "JavaScript",
    language: "js",
    code: `const res = await fetch("${BASE}/templates", {
  headers: { Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\` },
});
const { data } = await res.json();
console.log(data.map((t) => \`\${t.name} (\${t.language})\`));`,
  },
  {
    label: "Python",
    language: "python",
    code: `import os
import requests

res = requests.get(
    "${BASE}/templates",
    headers={"Authorization": f"Bearer {os.environ['BIZUPLY_API_KEY']}"},
    timeout=30,
)
for template in res.json()["data"]:
    print(template["name"], template["language"], template["parameterCount"])`,
  },
];

export const LIST_TEMPLATES_RESPONSE = `{
  "data": [
    {
      "name": "order_update",
      "language": "en",
      "status": "APPROVED",
      "category": "UTILITY",
      "parameterCount": 2
    }
  ]
}`;

export const GET_TEMPLATE_SAMPLES: CodeSample[] = [
  {
    label: "cURL",
    language: "bash",
    code: `curl "${BASE}/templates/order_update?language=en" \\
  -H "Authorization: Bearer $BIZUPLY_API_KEY"`,
  },
  {
    label: "JavaScript",
    language: "js",
    code: `const res = await fetch(
  "${BASE}/templates/order_update?language=en",
  { headers: { Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\` } },
);
const template = await res.json();
console.log(template.body.parameterCount, template.variables.body);`,
  },
  {
    label: "Python",
    language: "python",
    code: `import os
import requests

res = requests.get(
    "${BASE}/templates/order_update",
    params={"language": "en"},
    headers={"Authorization": f"Bearer {os.environ['BIZUPLY_API_KEY']}"},
    timeout=30,
)
template = res.json()
print(template["body"]["parameterCount"], template["variables"]["body"])`,
  },
];

export const GET_TEMPLATE_RESPONSE = `{
  "name": "order_update",
  "key": "order_update",
  "language": "en",
  "status": "APPROVED",
  "category": "UTILITY",
  "header": { "type": "none", "text": "", "variables": [], "mediaRequired": false },
  "body": {
    "text": "Hi {{1}}, order {{2}} is confirmed and on its way.",
    "variables": ["1", "2"],
    "parameterCount": 2
  },
  "footer": "",
  "buttons": [],
  "variables": {
    "body": [
      { "placeholder": "{{1}}", "key": "1" },
      { "placeholder": "{{2}}", "key": "2" }
    ],
    "header": [],
    "buttons": []
  }
}`;

export const GET_MESSAGE_SAMPLES: CodeSample[] = [
  {
    label: "cURL",
    language: "bash",
    code: `curl "${BASE}/messages/bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c" \\
  -H "Authorization: Bearer $BIZUPLY_API_KEY"`,
  },
  {
    label: "JavaScript",
    language: "js",
    code: `const id = "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c";
const res = await fetch(\`${BASE}/messages/\${id}\`, {
  headers: { Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\` },
});
const message = await res.json();
console.log(message.status, message.deliveredAt);`,
  },
  {
    label: "Python",
    language: "python",
    code: `import os
import requests

message_id = "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c"
res = requests.get(
    f"${BASE}/messages/{message_id}",
    headers={"Authorization": f"Bearer {os.environ['BIZUPLY_API_KEY']}"},
    timeout=30,
)
message = res.json()
print(message["status"], message["deliveredAt"])`,
  },
];

export const GET_MESSAGE_RESPONSE = `{
  "id": "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c",
  "externalId": "order_1042",
  "to": "15551234567",
  "template": "order_update",
  "language": "en",
  "status": "read",
  "sentAt": "2026-10-03T09:14:02.118Z",
  "deliveredAt": "2026-10-03T09:14:04.530Z",
  "readAt": "2026-10-03T09:16:41.007Z",
  "failedAt": null,
  "error": null,
  "metaMessageId": "wamid.HBgLMTU1NTEyMzQ1NjcVAgARGBI..."
}`;

export const ERROR_RESPONSE = `{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_APPROVED",
    "message": "The selected WhatsApp template is not approved.",
    "requestId": "req_5d2e8f1a9c3b7e4f6a0d1c2b"
  }
}`;

export const WEBHOOK_HEADERS = `POST /your/webhook HTTP/1.1
Content-Type: application/json
User-Agent: Bizuply-Webhooks/1.0
X-Bizuply-Event: whatsapp.message.delivered
X-Bizuply-Timestamp: 1791018844
X-Bizuply-Delivery-Id: <unique delivery id>
X-Bizuply-Signature: sha256=<hex HMAC of "{timestamp}.{rawBody}">`;

export const WEBHOOK_PAYLOAD = `{
  "event": "whatsapp.message.delivered",
  "messageId": "bizmsg_3f9a1c0e7b2d4a58b6c1e9f04d7a2b6c",
  "externalId": "order_1042",
  "recipient": "15551234567",
  "status": "delivered",
  "timestamp": "2026-10-03T09:14:04.530Z"
}`;

export const VERIFY_SAMPLES: CodeSample[] = [
  {
    label: "cURL",
    language: "bash",
    code: `# Webhooks are sent by Bizuply to your endpoint.
# Use the dashboard "Send test webhook" button to trigger
# a signed whatsapp.webhook.test event, then verify it with
# the JavaScript or Python example.`,
  },
  {
    label: "JavaScript",
    language: "js",
    code: `import crypto from "node:crypto";
import express from "express";

const app = express();
const SECRET = process.env.BIZUPLY_WEBHOOK_SECRET;
const MAX_SKEW_SECONDS = 300;

// Keep the raw body: the signature is computed over the exact bytes sent.
app.post("/webhooks/bizuply", express.raw({ type: "application/json" }), (req, res) => {
  const timestamp = req.get("X-Bizuply-Timestamp") || "";
  const signature = req.get("X-Bizuply-Signature") || "";
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!timestamp || !Number.isFinite(age) || age > MAX_SKEW_SECONDS) return res.sendStatus(400);

  const expected = "sha256=" + crypto
    .createHmac("sha256", SECRET)
    .update(\`\${timestamp}.\${req.body.toString("utf8")}\`)
    .digest("hex");
  const valid = signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return res.sendStatus(401);

  const event = JSON.parse(req.body.toString("utf8"));
  // Deduplicate on X-Bizuply-Delivery-Id before processing.
  console.log(event.event, event.messageId, event.status);
  res.sendStatus(200);
});`,
  },
  {
    label: "Python",
    language: "python",
    code: `import hashlib
import hmac
import os
import time

from flask import Flask, abort, request

app = Flask(__name__)
SECRET = os.environ["BIZUPLY_WEBHOOK_SECRET"].encode()
MAX_SKEW_SECONDS = 300

@app.post("/webhooks/bizuply")
def bizuply_webhook():
    timestamp = request.headers.get("X-Bizuply-Timestamp", "")
    signature = request.headers.get("X-Bizuply-Signature", "")
    if not timestamp.isdigit() or abs(time.time() - int(timestamp)) > MAX_SKEW_SECONDS:
        abort(400)

    raw = request.get_data()  # exact bytes, before JSON parsing
    digest = hmac.new(SECRET, f"{timestamp}.".encode() + raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, f"sha256={digest}"):
        abort(401)

    event = request.get_json()
    # Deduplicate on X-Bizuply-Delivery-Id before processing.
    print(event["event"], event["messageId"], event["status"])
    return "", 200`,
  },
];

export const WEBHOOK_EVENTS: Array<{ event: string; meaning: string }> = [
  { event: "whatsapp.message.accepted", meaning: "Meta accepted the send request from Bizuply." },
  { event: "whatsapp.message.sent", meaning: "WhatsApp reports the message as sent." },
  { event: "whatsapp.message.delivered", meaning: "The message reached the recipient's device." },
  { event: "whatsapp.message.read", meaning: "The recipient opened the message (when read receipts are on)." },
  { event: "whatsapp.message.failed", meaning: "Delivery failed. The payload includes an error string." },
  { event: "whatsapp.webhook.test", meaning: "Test event sent from the dashboard to check your endpoint." },
];
