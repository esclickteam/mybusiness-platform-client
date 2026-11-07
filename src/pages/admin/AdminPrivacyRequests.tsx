import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../api";

type PrivacyRow = {
  id: string;
  reference?: string;
  email: string;
  maskedEmail?: string;
  kind: string;
  about?: string;
  controller: string;
  status: string;
  createdAt?: string;
  assigneeId?: string;
  emailVerified: boolean;
  identityVerified: boolean;
  deadlineAt?: string | null;
  deletionPerformed: boolean;
  disclosed: boolean;
};

type Alerts = {
  open: number;
  emailPending: number;
  deadlineMissing: number;
  overdue: number;
};

const COPY = {
  en: {
    title: "Privacy requests",
    empty: "No requests are recorded.",
    failed: "The request list could not be loaded.",
    note: "Close note",
    deadline: "Deadline",
    confirm: "Confirm identity",
    forward: "Route to customer",
    close: "Close",
    more: "Ask for more information",
    saved: "The action was recorded. No deletion was performed by this screen.",
    blocked: "The action was refused.",
  },
  he: {
    title: "בקשות פרטיות",
    empty: "אין בקשות רשומות.",
    failed: "רשימת הבקשות לא נטענה.",
    note: "הערת סגירה",
    deadline: "מועד טיפול",
    confirm: "אישור זהות",
    forward: "העברה ללקוח",
    close: "סגירה",
    more: "בקשת מידע נוסף",
    saved: "הפעולה נרשמה. המסך הזה לא ביצע מחיקה.",
    blocked: "הפעולה נדחתה.",
  },
  es: {
    title: "Solicitudes de privacidad",
    empty: "No hay solicitudes registradas.",
    failed: "No se pudo cargar la lista.",
    note: "Nota de cierre",
    deadline: "Plazo",
    confirm: "Confirmar identidad",
    forward: "Enviar al cliente",
    close: "Cerrar",
    more: "Pedir más información",
    saved: "La acción quedó registrada. Esta pantalla no borró nada.",
    blocked: "La acción fue rechazada.",
  },
  pt: {
    title: "Pedidos de privacidade",
    empty: "Não há pedidos registrados.",
    failed: "A lista não pôde ser carregada.",
    note: "Nota de encerramento",
    deadline: "Prazo",
    confirm: "Confirmar identidade",
    forward: "Encaminhar ao cliente",
    close: "Encerrar",
    more: "Pedir mais informação",
    saved: "A ação foi registrada. Esta tela não apagou nada.",
    blocked: "A ação foi recusada.",
  },
  ar: {
    title: "طلبات الخصوصية",
    empty: "لا توجد طلبات مسجّلة.",
    failed: "تعذّر تحميل القائمة.",
    note: "ملاحظة الإغلاق",
    deadline: "الموعد",
    confirm: "تأكيد الهوية",
    forward: "إحالة إلى العميل",
    close: "إغلاق",
    more: "طلب معلومات إضافية",
    saved: "تم تسجيل الإجراء. هذه الشاشة لم تحذف شيئًا.",
    blocked: "تم رفض الإجراء.",
  },
} as const;

function copyFor(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return COPY.he;
  if (value.startsWith("es")) return COPY.es;
  if (value.startsWith("pt")) return COPY.pt;
  if (value.startsWith("ar")) return COPY.ar;
  return COPY.en;
}

export default function AdminPrivacyRequests() {
  const { i18n } = useTranslation();
  const copy = copyFor(i18n.language);
  const [rows, setRows] = useState<PrivacyRow[]>([]);
  const [alerts, setAlerts] = useState<Alerts | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState("");

  async function load() {
    try {
      const [list, summary] = await Promise.all([
        API.get("/privacy/requests"),
        API.get("/privacy/requests/alerts"),
      ]);
      setRows(list.data?.requests || []);
      setAlerts(summary.data || null);
    } catch {
      setMessage(copy.failed);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(id: string, action: string, extra: Record<string, string> = {}) {
    setMessage("");
    try {
      const { data } = await API.post(`/privacy/requests/${id}/actions`, { action, note, ...extra });
      if (data?.request?.deletionPerformed !== false) throw new Error("deletion_blocked");
      setMessage(copy.saved);
      await load();
    } catch {
      setMessage(copy.blocked);
    }
  }

  return (
    <section className="p-6" aria-labelledby="privacy-admin-title">
      <h1 id="privacy-admin-title" className="mb-4 text-2xl font-semibold text-slate-900">{copy.title}</h1>
      {alerts ? (
        <p className="mb-4 text-sm text-slate-700">
          {alerts.open} / {alerts.emailPending} / {alerts.deadlineMissing} / {alerts.overdue}
        </p>
      ) : null}
      <label className="mb-3 block text-sm font-medium text-slate-800">
        {copy.note}
        <input className="mt-1 w-full max-w-xl rounded-xl border border-slate-300 px-3 py-2" value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <label className="mb-4 block text-sm font-medium text-slate-800">
        {copy.deadline}
        <input className="mt-1 rounded-xl border border-slate-300 px-3 py-2" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
      </label>
      {rows.length === 0 ? <p>{copy.empty}</p> : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{row.reference || row.id} · {row.kind} · {row.about || row.controller} · {row.status}</p>
              <p className="text-sm text-slate-600">{row.maskedEmail || row.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="rounded-full border border-slate-900 px-3 py-1 text-sm" onClick={() => act(row.id, "confirm_identity")}>{copy.confirm}</button>
                <button type="button" className="rounded-full border border-slate-900 px-3 py-1 text-sm" onClick={() => act(row.id, "waiting_for_info")}>{copy.more}</button>
                <button type="button" className="rounded-full border border-slate-900 px-3 py-1 text-sm" onClick={() => act(row.id, "forward")}>{copy.forward}</button>
                <button type="button" className="rounded-full border border-slate-900 px-3 py-1 text-sm" onClick={() => act(row.id, "set_deadline", { deadlineAt: deadline })}>{copy.deadline}</button>
                <button type="button" className="rounded-full border border-slate-900 px-3 py-1 text-sm" onClick={() => act(row.id, "close")}>{copy.close}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {message ? <p role="status" className="mt-4 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
