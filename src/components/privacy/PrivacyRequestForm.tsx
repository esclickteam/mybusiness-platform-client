import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../api";

type Kind = "access" | "correction" | "deletion" | "other";
type About = "account" | "customer_database";

type Copy = {
  title: string;
  intro: string;
  email: string;
  name: string;
  kind: string;
  about: string;
  details: string;
  submit: string;
  access: string;
  correction: string;
  deletion: string;
  other: string;
  account: string;
  customer: string;
  received: string;
  customerNote: string;
  unavailable: string;
  failed: string;
  code: string;
  verify: string;
  codeSent: string;
  codeMissing: string;
  emailVerified: string;
};

const COPY: Record<string, Copy> = {
  en: {
    title: "Access or correction request",
    intro: "This form records the request. It does not verify identity, it does not show anyone else's information, and it does not delete records.",
    email: "Email",
    name: "Name",
    kind: "Request",
    about: "The information is about",
    details: "What should be reviewed",
    submit: "Send the request",
    access: "A copy of my information",
    correction: "A correction",
    deletion: "Deletion, where the applicable law requires it",
    other: "Another privacy request",
    account: "My Bizuply account, billing, or support record",
    customer: "Information a business customer stored about me",
    received: "The request was recorded. Identity is not verified yet, nothing was disclosed, and nothing was deleted. Reference",
    customerNote: "Bizuply will not release a business customer's database from this form. After the account is matched, the request is routed to that customer.",
    unavailable: "The request was not recorded because this server does not have the request route yet.",
    failed: "The request was not recorded.",
    code: "Email code",
    verify: "Confirm the email code",
    codeSent: "A code was sent to the email address. The code does not prove identity and does not release any information.",
    codeMissing: "The request was recorded, but the email code was not sent because mail is not configured.",
    emailVerified: "The email code matched. Identity is still not confirmed, nothing was disclosed, and nothing was deleted.",
  },
  he: {
    title: "בקשת עיון או תיקון",
    intro: "הטופס מתעד את הבקשה. הוא לא מאמת זהות, לא מציג מידע של אדם אחר, ולא מוחק רשומות.",
    email: "דוא״ל",
    name: "שם",
    kind: "הבקשה",
    about: "המידע נוגע אל",
    details: "מה צריך לבדוק",
    submit: "שליחת הבקשה",
    access: "עותק של המידע שלי",
    correction: "תיקון",
    deletion: "מחיקה, אם הדין החל מחייב אותה",
    other: "בקשת פרטיות אחרת",
    account: "החשבון, החיוב או הפנייה שלי ב־Bizuply",
    customer: "מידע שלקוח עסקי שמר עליי",
    received: "הבקשה נרשמה. הזהות עדיין לא אומתה, לא נמסר מידע, ולא נמחקה רשומה. אסמכתה",
    customerNote: "Bizuply לא מוסרת מטופס זה מאגר של לקוח עסקי. אחרי התאמת החשבון הבקשה מועברת לאותו לקוח.",
    unavailable: "הבקשה לא נרשמה כי השרת הזה עדיין בלי מסלול הבקשות.",
    failed: "הבקשה לא נרשמה.",
    code: "קוד מהדוא״ל",
    verify: "אישור הקוד",
    codeSent: "נשלח קוד לכתובת הדוא״ל. הקוד אינו מוכיח זהות ואינו מוסר מידע.",
    codeMissing: "הבקשה נרשמה, אבל קוד הדוא״ל לא נשלח כי הדואר אינו מוגדר.",
    emailVerified: "הקוד תאם. הזהות עדיין לא אושרה, לא נמסר מידע, ולא נמחקה רשומה.",
  },
  es: {
    title: "Solicitud de acceso o corrección",
    intro: "El formulario registra la solicitud. No verifica la identidad, no muestra información de otra persona y no borra registros.",
    email: "Correo",
    name: "Nombre",
    kind: "Solicitud",
    about: "La información se refiere a",
    details: "Qué hay que revisar",
    submit: "Enviar la solicitud",
    access: "Una copia de mi información",
    correction: "Una corrección",
    deletion: "Supresión, cuando la ley aplicable la exija",
    other: "Otra solicitud de privacidad",
    account: "Mi cuenta, facturación o soporte de Bizuply",
    customer: "Información que un cliente empresarial guardó sobre mí",
    received: "La solicitud quedó registrada. La identidad aún no está verificada, no se divulgó nada y no se borró nada. Referencia",
    customerNote: "Bizuply no entrega desde este formulario la base de un cliente empresarial. Tras identificar la cuenta, la solicitud se envía a ese cliente.",
    unavailable: "La solicitud no se registró porque este servidor aún no tiene la ruta.",
    failed: "La solicitud no se registró.",
    code: "Código del correo",
    verify: "Confirmar el código",
    codeSent: "Se envió un código al correo. El código no prueba la identidad y no entrega información.",
    codeMissing: "La solicitud quedó registrada, pero el código no se envió porque el correo no está configurado.",
    emailVerified: "El código coincide. La identidad aún no está confirmada, no se divulgó nada y no se borró nada.",
  },
  pt: {
    title: "Pedido de acesso ou correção",
    intro: "O formulário registra o pedido. Ele não verifica a identidade, não mostra informação de outra pessoa e não apaga registros.",
    email: "E-mail",
    name: "Nome",
    kind: "Pedido",
    about: "A informação é sobre",
    details: "O que deve ser revisto",
    submit: "Enviar o pedido",
    access: "Uma cópia das minhas informações",
    correction: "Uma correção",
    deletion: "Exclusão, quando a lei aplicável a exigir",
    other: "Outro pedido de privacidade",
    account: "Minha conta, cobrança ou suporte na Bizuply",
    customer: "Informação que um cliente empresarial guardou sobre mim",
    received: "O pedido foi registrado. A identidade ainda não foi verificada, nada foi divulgado e nada foi apagado. Referência",
    customerNote: "A Bizuply não entrega por este formulário a base de um cliente empresarial. Depois de identificar a conta, o pedido segue para esse cliente.",
    unavailable: "O pedido não foi registrado porque este servidor ainda não tem a rota.",
    failed: "O pedido não foi registrado.",
    code: "Código do e-mail",
    verify: "Confirmar o código",
    codeSent: "Um código foi enviado ao e-mail. O código não prova a identidade e não entrega informação.",
    codeMissing: "O pedido foi registrado, mas o código não foi enviado porque o e-mail não está configurado.",
    emailVerified: "O código confere. A identidade ainda não foi confirmada, nada foi divulgado e nada foi apagado.",
  },
  ar: {
    title: "طلب اطلاع أو تصحيح",
    intro: "يسجّل النموذج الطلب. لا يتحقق من الهوية، ولا يعرض معلومات شخص آخر، ولا يحذف السجلات.",
    email: "البريد",
    name: "الاسم",
    kind: "الطلب",
    about: "تتعلق المعلومات بـ",
    details: "ما الذي يجب مراجعته",
    submit: "إرسال الطلب",
    access: "نسخة من معلوماتي",
    correction: "تصحيح",
    deletion: "حذف، إذا كان القانون الساري يوجبه",
    other: "طلب خصوصية آخر",
    account: "حسابي أو الفوترة أو الدعم لدى Bizuply",
    customer: "معلومات حفظها عميل تجاري عني",
    received: "تم تسجيل الطلب. لم يتم التحقق من الهوية بعد، ولم يُكشف شيء، ولم يُحذف شيء. المرجع",
    customerNote: "لا تسلّم Bizuply من هذا النموذج قاعدة عميل تجاري. بعد مطابقة الحساب يُحال الطلب إلى ذلك العميل.",
    unavailable: "لم يُسجل الطلب لأن هذا الخادم لا يملك مسار الطلبات بعد.",
    failed: "لم يُسجل الطلب.",
    code: "رمز البريد",
    verify: "تأكيد الرمز",
    codeSent: "أُرسل رمز إلى البريد. الرمز لا يثبت الهوية ولا يسلّم أي معلومات.",
    codeMissing: "تم تسجيل الطلب، لكن رمز البريد لم يُرسل لأن البريد غير مُعد.",
    emailVerified: "تطابق الرمز. لم يتم تأكيد الهوية بعد، ولم يُكشف شيء، ولم يُحذف شيء.",
  },
};

function copyFor(language: string): Copy {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return COPY.he;
  if (value.startsWith("es")) return COPY.es;
  if (value.startsWith("pt")) return COPY.pt;
  if (value.startsWith("ar")) return COPY.ar;
  return COPY.en;
}

export default function PrivacyRequestForm() {
  const { i18n } = useTranslation();
  const copy = copyFor(i18n.language);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<Kind>("access");
  const [about, setAbout] = useState<About>("account");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [code, setCode] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const { data } = await API.post("/privacy/requests", {
        email,
        name,
        kind,
        about,
        details,
        locale: i18n.language,
        companyFax: "",
      });
      if (data?.success !== true || data?.disclosed !== false || data?.deletionPerformed !== false || data?.identityVerified !== false || !data?.id) {
        throw new Error("request_not_stored");
      }
      setRequestId(String(data.id));
      const note = data.routing === "forward_to_customer" ? ` ${copy.customerNote}` : "";
      const delivery = data.verificationSent ? copy.codeSent : copy.codeMissing;
      setMessage(`${copy.received} ${data.id}. ${delivery}${note}`);
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      setMessage(status === 404 || status === 405 ? copy.unavailable : copy.failed);
    } finally {
      setPending(false);
    }
  }

  async function onVerify() {
    setPending(true);
    try {
      const { data } = await API.post("/privacy/requests/verify-email", {
        id: requestId,
        email,
        code,
      });
      if (data?.emailVerified !== true || data?.disclosed !== false || data?.identityVerified !== false) {
        throw new Error("verification_failed");
      }
      setMessage(copy.emailVerified);
    } catch {
      setMessage(copy.failed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-3xl border border-slate-200 bg-white p-5" aria-labelledby="privacy-request-title">
      <h2 id="privacy-request-title" className="mb-3 text-xl font-semibold text-slate-900">{copy.title}</h2>
      <p className="mb-4 text-sm leading-7 text-slate-600">{copy.intro}</p>
      <label className="mb-3 block text-sm font-medium text-slate-800">
        {copy.email}
        <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="mb-3 block text-sm font-medium text-slate-800">
        {copy.name}
        <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="mb-3 block text-sm font-medium text-slate-800">
        {copy.kind}
        <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={kind} onChange={(event) => setKind(event.target.value as Kind)}>
          <option value="access">{copy.access}</option>
          <option value="correction">{copy.correction}</option>
          <option value="deletion">{copy.deletion}</option>
          <option value="other">{copy.other}</option>
        </select>
      </label>
      <label className="mb-3 block text-sm font-medium text-slate-800">
        {copy.about}
        <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={about} onChange={(event) => setAbout(event.target.value as About)}>
          <option value="account">{copy.account}</option>
          <option value="customer_database">{copy.customer}</option>
        </select>
      </label>
      <label className="mb-4 block text-sm font-medium text-slate-800">
        {copy.details}
        <textarea className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" rows={4} maxLength={2000} value={details} onChange={(event) => setDetails(event.target.value)} />
      </label>
      <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60" disabled={pending}>
        {copy.submit}
      </button>
      {message ? <p role="status" className="mt-4 text-sm leading-7 text-slate-700">{message}</p> : null}
      {requestId ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <label className="mb-3 block text-sm font-medium text-slate-800">
            {copy.code}
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} />
          </label>
          <button type="button" className="rounded-full border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60" disabled={pending || code.trim().length < 6} onClick={onVerify}>
            {copy.verify}
          </button>
        </div>
      ) : null}
    </form>
  );
}
