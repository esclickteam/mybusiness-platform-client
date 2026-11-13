import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Alert = { level: "warning" | "severe" | "stopped"; message: string };

type Usage = {
  day: string;
  spentUsd: number;
  capUsd: number;
  remainingUsd: number;
  percent: number;
  scansToday: number;
  liveCalls: number;
  cacheHits: number;
  averageUsd: number | null;
  reservedUsd: number;
  level: "ok" | "warning" | "severe" | "stopped";
  resetAt: string;
  measured: boolean;
  alerts: Alert[];
};

type HistoryRow = { day: string; spentUsd: number; liveCalls: number; cacheHits: number };

type Row = {
  id: string;
  requesterName: string | null;
  requesterEmail: string | null;
  createdAt: string;
  url: string;
  host: string;
  status: string;
  score: number | null;
  coverage: number | null;
  ok: number | null;
  action: number | null;
  missing: number | null;
  unverified: number | null;
  purchaseStatus: string;
  plan?: string;
  paid?: boolean;
  guest?: boolean;
  findings?: number | null;
  demo?: boolean;
  consentStatus?: string | null;
  consentAt?: string | null;
  consentId?: string | null;
};

const STATUS: Record<string, string> = {
  queued: "בתור",
  running: "רצה",
  completed: "הושלמה",
  failed: "נכשלה",
};

function stamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function count(value: number | null) {
  return value == null ? "—" : String(value);
}

function money(value: number) {
  return `$${value.toFixed(value >= 1 ? 2 : 4)}`;
}

function resetLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}

const DISCOVERY_COPY = {
  he: { title: "סריקת אזורים פנימיים — בדיקת בעלים", intro: "פתוח רק לחשבון הבעלים. אין חיוב. הסיסמה לא נשמרת בדפדפן.", url: "כתובת האתר", paths: "נתיבים מורשים", language: "שפה", user: "משתמש בדיקה", password: "סיסמה", consent: "אני מאשר שזה אתר בבעלותנו או שיש אישור לסרוק אותו, ושהמשתמש הוא משתמש בדיקה.", discover: "גילוי וספירת עמודים פנימיים", progress: "הגילוי רץ", found: "עמודים שהתגלו", unique: "עמודים ייחודיים", duplicates: "כפילויות", blocked: "לא נגישים", publicPages: "ציבוריים", internalPages: "פנימיים", dynamic: "סוגים דינמיים", note: "המספר הוא מספר העמודים שהתגלו, לא כל העמודים באתר. עמוד בלי קישור עשוי שלא להתגלות.", partial: "הגילוי נעצר לפני שהסתיים, והתוצאה חלקית.", extra: "התגלו יותר מ־100 עמודים לסריקה. החבילה הקיימת מכסה עד 100. אפשר לבחור עד 100, או לבצע סריקה נוספת.", recommend: "המלצה", start: "התחלת הסריקה המלאה", stop: "עצירה", name: "שם", address: "כתובת", type: "סוג", status: "סטטוס", basic: "בסיסית", extended: "מורחבת", advanced: "מתקדמת" },
  en: { title: "Internal area scan — owner check", intro: "Open only to the owner account. Nothing is charged. The password is not kept in the browser.", url: "Site address", paths: "Approved paths", language: "Language", user: "Test user", password: "Password", consent: "I confirm this site is ours or we have permission to scan it, and the user is a test user.", discover: "Discover and count internal pages", progress: "Discovery is running", found: "Pages discovered", unique: "Unique pages", duplicates: "Duplicates", blocked: "Not reachable", publicPages: "Public", internalPages: "Internal", dynamic: "Dynamic types", note: "This is the number of pages discovered, not every page on the site. A page with no link may not be discovered.", partial: "Discovery stopped before it finished, so this result is partial.", extra: "More than 100 pages were found to scan. The current package covers 100. You can choose up to 100, or run another scan.", recommend: "Recommendation", start: "Start the full scan", stop: "Stop", name: "Name", address: "Address", type: "Type", status: "Status", basic: "Basic", extended: "Extended", advanced: "Advanced" },
  es: { title: "Escaneo interno — revisión del propietario", intro: "Abierto solo para la cuenta del propietario. No hay cobro. La contraseña no se guarda en el navegador.", url: "Dirección del sitio", paths: "Rutas permitidas", language: "Idioma", user: "Usuario de prueba", password: "Contraseña", consent: "Confirmo que el sitio es nuestro o tenemos permiso para escanearlo, y que el usuario es de prueba.", discover: "Descubrir y contar páginas internas", progress: "El descubrimiento está en curso", found: "Páginas descubiertas", unique: "Páginas únicas", duplicates: "Duplicados", blocked: "No accesibles", publicPages: "Públicas", internalPages: "Internas", dynamic: "Tipos dinámicos", note: "El número es el de páginas descubiertas, no todas las del sitio. Una página sin enlace puede no descubrirse.", partial: "El descubrimiento se detuvo antes de terminar. El resultado es parcial.", extra: "Hay más de 100 páginas para escanear. El paquete actual cubre 100. Puede elegir hasta 100 o hacer otro escaneo.", recommend: "Recomendación", start: "Iniciar el escaneo completo", stop: "Detener", name: "Nombre", address: "Dirección", type: "Tipo", status: "Estado", basic: "Básica", extended: "Ampliada", advanced: "Avanzada" },
  "pt-BR": { title: "Varredura interna — verificação do proprietário", intro: "Aberto só para a conta do proprietário. Não há cobrança. A senha não fica no navegador.", url: "Endereço do site", paths: "Caminhos permitidos", language: "Idioma", user: "Usuário de teste", password: "Senha", consent: "Confirmo que o site é nosso ou temos permissão para varrê-lo, e que o usuário é de teste.", discover: "Descobrir e contar páginas internas", progress: "A descoberta está em andamento", found: "Páginas descobertas", unique: "Páginas únicas", duplicates: "Duplicadas", blocked: "Inacessíveis", publicPages: "Públicas", internalPages: "Internas", dynamic: "Tipos dinâmicos", note: "O número é o de páginas descobertas, não todas as do site. Uma página sem link pode não ser descoberta.", partial: "A descoberta parou antes do fim. O resultado é parcial.", extra: "Há mais de 100 páginas para varrer. O pacote atual cobre 100. É possível escolher até 100 ou fazer outra varredura.", recommend: "Recomendação", start: "Iniciar a varredura completa", stop: "Parar", name: "Nome", address: "Endereço", type: "Tipo", status: "Status", basic: "Básica", extended: "Ampliada", advanced: "Avançada" },
  ar: { title: "فحص المناطق الداخلية — مراجعة المالك", intro: "متاح فقط لحساب المالك. لا توجد رسوم. لا تُحفظ كلمة المرور في المتصفح.", url: "عنوان الموقع", paths: "المسارات المسموحة", language: "اللغة", user: "مستخدم تجريبي", password: "كلمة المرور", consent: "أؤكد أن الموقع ملكنا أو لدينا إذن بفحصه، وأن المستخدم تجريبي.", discover: "اكتشاف صفحات داخلية وعدّها", progress: "الاكتشاف جارٍ", found: "صفحات مكتشفة", unique: "صفحات فريدة", duplicates: "تكرارات", blocked: "غير متاحة", publicPages: "عامة", internalPages: "داخلية", dynamic: "أنواع ديناميكية", note: "العدد هو الصفحات التي اكتُشفت، وليس كل صفحات الموقع. قد لا تُكتشف صفحة بلا رابط.", partial: "توقف الاكتشاف قبل أن يكتمل، والنتيجة جزئية.", extra: "اكتُشف أكثر من 100 صفحة للفحص. تغطي الحزمة الحالية 100. يمكن اختيار حتى 100 أو إجراء فحص آخر.", recommend: "التوصية", start: "بدء الفحص الكامل", stop: "إيقاف", name: "الاسم", address: "العنوان", type: "النوع", status: "الحالة", basic: "أساسية", extended: "موسعة", advanced: "متقدمة" },
} as const;

const DISCOVERY_OUTCOME = {
  he: { failed: "הגילוי נכשל.", login_failed: "לא הצלחנו להתחבר באמצעות משתמש הבדיקה.", session: "החיבור לאתר הסתיים. יש להתחבר מחדש.", bad_url: "כתובת האתר אינה תקינה. יש להזין כתובת https מלאה.", https_required: "כתובת האתר אינה תקינה. יש להזין כתובת https מלאה.", path_not_allowed: "הגישה נחסמה. אפשר לבדוק רק את האתר שאושר, בלי אזורים מסוכנים או כתובות שאינן מורשות.", host_not_approved: "הגישה נחסמה. אפשר לבדוק רק את האתר שאושר, בלי אזורים מסוכנים או כתובות שאינן מורשות.", start_unreachable: "כתובת ההתחלה אינה נגישה. בדקו שהכתובת נכונה ושהמשתמש יכול לפתוח אותה.", browser_unavailable: "הגילוי נכשל. הדפדפן לבדיקה אינו זמין.", no_pages: "הגילוי נכשל. לא נמצאו עמודים שאפשר לבדוק.", time: "הגילוי נעצר כי הזמן הסתיים. נמצאו עמודים, והתוצאה חלקית.", limit: "הגילוי נעצר כי הגענו למכסת העמודים. נמצאו עמודים, והתוצאה חלקית.", partial: "הגילוי נעצר לפני שהסתיים, והתוצאה חלקית.", coverage: "התגלו אזורי ניווט נוספים שטרם נבדקו. מספר המסכים עשוי להיות גבוה יותר, ולכן אין המלצת חבילה סופית.", login_unconfirmed: "לא הצלחנו לאשר שההתחברות הצליחה. כניסה לכתובת הדשבורד אינה מוכיחה שהמשתמש מחובר." },
  en: { failed: "Discovery failed.", login_failed: "We could not sign in with the test user.", session: "The site connection ended. Sign in again.", bad_url: "The site address is not valid. Enter a full https address.", https_required: "The site address is not valid. Enter a full https address.", path_not_allowed: "Access was blocked. Only the approved site can be checked, without dangerous areas or unapproved addresses.", host_not_approved: "Access was blocked. Only the approved site can be checked, without dangerous areas or unapproved addresses.", start_unreachable: "The starting address is not reachable. Check that it is correct and that the user can open it.", browser_unavailable: "Discovery failed. The check browser is unavailable.", no_pages: "Discovery failed. No pages could be checked.", time: "Discovery stopped because time ran out. Pages were found, and the result is partial.", limit: "Discovery stopped because the page limit was reached. Pages were found, and the result is partial.", partial: "Discovery stopped before it finished, so this result is partial.", coverage: "More navigation areas were found and have not been checked yet. The screen count may be higher, so there is no final package recommendation.", login_unconfirmed: "We could not confirm that sign-in succeeded. Reaching the dashboard address does not prove the user is signed in." },
  es: { failed: "El descubrimiento falló.", login_failed: "No pudimos entrar con el usuario de prueba.", session: "La conexión con el sitio terminó. Hay que entrar de nuevo.", bad_url: "La dirección del sitio no es válida. Introduzca una dirección https completa.", https_required: "La dirección del sitio no es válida. Introduzca una dirección https completa.", path_not_allowed: "El acceso quedó bloqueado. Solo se puede revisar el sitio aprobado, sin zonas peligrosas ni direcciones no autorizadas.", host_not_approved: "El acceso quedó bloqueado. Solo se puede revisar el sitio aprobado, sin zonas peligrosas ni direcciones no autorizadas.", start_unreachable: "La dirección inicial no está disponible. Compruebe que sea correcta y que el usuario pueda abrirla.", browser_unavailable: "El descubrimiento falló. El navegador de la revisión no está disponible.", no_pages: "El descubrimiento falló. No hay páginas que se puedan revisar.", time: "El descubrimiento se detuvo porque se acabó el tiempo. Se encontraron páginas y el resultado es parcial.", limit: "El descubrimiento se detuvo porque se alcanzó el límite de páginas. Se encontraron páginas y el resultado es parcial.", partial: "El descubrimiento se detuvo antes de terminar. El resultado es parcial.", coverage: "El descubrimiento no está completo. Quedaron pantallas o registros sin abrir, así que no hay una recomendación final de paquete.", login_unconfirmed: "No pudimos confirmar que el acceso funcionó. Llegar a la dirección del panel no demuestra que el usuario haya entrado." },
  "pt-BR": { failed: "A descoberta falhou.", login_failed: "Não foi possível entrar com o usuário de teste.", session: "A conexão com o site terminou. É preciso entrar de novo.", bad_url: "O endereço do site não é válido. Informe um endereço https completo.", https_required: "O endereço do site não é válido. Informe um endereço https completo.", path_not_allowed: "O acesso foi bloqueado. Só o site aprovado pode ser verificado, sem áreas perigosas ou endereços não autorizados.", host_not_approved: "O acesso foi bloqueado. Só o site aprovado pode ser verificado, sem áreas perigosas ou endereços não autorizados.", start_unreachable: "O endereço inicial não está acessível. Confira se ele está correto e se o usuário consegue abri-lo.", browser_unavailable: "A descoberta falhou. O navegador da verificação não está disponível.", no_pages: "A descoberta falhou. Não há páginas que possam ser verificadas.", time: "A descoberta parou porque o tempo acabou. Páginas foram encontradas e o resultado é parcial.", limit: "A descoberta parou porque o limite de páginas foi atingido. Páginas foram encontradas e o resultado é parcial.", partial: "A descoberta parou antes do fim. O resultado é parcial.", coverage: "A descoberta não está completa. Restaram telas ou registros sem abrir, então não há uma recomendação final de pacote.", login_unconfirmed: "Não foi possível confirmar que a entrada funcionou. Chegar ao endereço do painel não prova que o usuário entrou." },
  ar: { failed: "فشل الاكتشاف.", login_failed: "تعذر تسجيل الدخول بمستخدم الاختبار.", session: "انتهى الاتصال بالموقع. يجب تسجيل الدخول من جديد.", bad_url: "عنوان الموقع غير صالح. أدخل عنوان https كاملاً.", https_required: "عنوان الموقع غير صالح. أدخل عنوان https كاملاً.", path_not_allowed: "تم منع الوصول. يمكن فحص الموقع الذي تمت الموافقة عليه فقط، دون المناطق الخطرة أو العناوين غير المصرح بها.", host_not_approved: "تم منع الوصول. يمكن فحص الموقع الذي تمت الموافقة عليه فقط، دون المناطق الخطرة أو العناوين غير المصرح بها.", start_unreachable: "عنوان البداية غير متاح. تحقق من صحة العنوان ومن أن المستخدم يستطيع فتحه.", browser_unavailable: "فشل الاكتشاف. متصفح الفحص غير متاح.", no_pages: "فشل الاكتشاف. لم يتم العثور على صفحات يمكن فحصها.", time: "توقف الاكتشاف لأن الوقت انتهى. تم العثور على صفحات والنتيجة جزئية.", limit: "توقف الاكتشاف لأن حد الصفحات اكتمل. تم العثور على صفحات والنتيجة جزئية.", partial: "توقف الاكتشاف قبل أن يكتمل، والنتيجة جزئية.", coverage: "الاكتشاف غير مكتمل. بقيت شاشات أو سجلات لم تُفتح، لذلك لا توجد توصية نهائية للحزمة.", login_unconfirmed: "تعذر تأكيد نجاح تسجيل الدخول. الوصول إلى عنوان لوحة التحكم لا يثبت أن المستخدم متصل." },
} as const;

function discoveryOutcome(discovery: { status?: string; partial?: boolean; partialReason?: string; error?: string; discovered?: number }, locale: keyof typeof DISCOVERY_OUTCOME) {
  const copy = DISCOVERY_OUTCOME[locale] || DISCOVERY_OUTCOME.he;
  const reason = discovery.partialReason || discovery.error || "";
  const failed = discovery.status === "failed" || ((discovery.discovered || 0) === 0 && discovery.status !== "discovered" && discovery.status !== "running");
  if (discovery.status === "running") return "";
  if (failed) return copy[reason as keyof typeof copy] || copy.failed;
  if (discovery.partial) return copy[reason as keyof typeof copy] || copy.partial;
  return "";
}

type DiscoveryPage = { name: string; url: string; parent?: string; type: string; status: string; selectable?: boolean; instances?: number };
type NavTrace = { label: string; kind: string; path?: string; source?: string; attempted?: boolean; opened?: boolean; screen?: boolean; reason?: string };
type Discovery = { id: string; kind?: string; status: string; percent: number; partial?: boolean; partialReason?: string; discovered?: number; unique?: number; duplicates?: number; inaccessible?: number; publicPages?: number; internalPages?: number; dynamicTypes?: number; scanPages?: number; screens?: number; tabsChecked?: number; menusOpened?: number; menusFound?: number; navFound?: number; navChecked?: number; navOpened?: number; navUnopened?: number; navItems?: NavTrace[]; modals?: number; drawers?: number; wizards?: number; resumable?: boolean; needsSelection?: number; certainty?: string; loginConfirmed?: boolean; recommended?: { packageId: string; usd: number; pages: number; extra?: boolean; scanPages?: number } | null; pages?: DiscoveryPage[]; error?: string; reportReady?: boolean; pagesAllowed?: number; findings?: Array<{ title: string; url: string; outcome: string }> };

function screenStatus(status: string, locale: string) {
  const he = locale !== "en" && locale !== "es" && locale !== "pt-BR" && locale !== "ar";
  if (status === "needs_selection") return he ? "דורש בחירת רשומה" : locale === "en" ? "Needs a record" : status;
  if (status === "inaccessible" || status === "session_expired") return he ? "חסום" : locale === "en" ? "Blocked" : status;
  if (status === "duplicate") return he ? "כפילות" : locale === "en" ? "Duplicate" : status;
  return he ? "נגיש" : locale === "en" ? "Open" : status;
}

function navReason(reason: string | undefined, locale: string) {
  const he = locale === "he";
  const copy: Record<string, [string, string]> = {
    needs_record: ["נדרשת רשומת בדיקה שאושרה", "Needs an approved test record"],
    off_host: ["מחוץ לאתר שאושר", "Outside the approved site"],
    missing: ["לא נמצא רכיב לחיץ", "No clickable control was found"],
    missing_name: ["לרכיב אין שם נגיש", "The control has no accessible name"],
    blocked_mutation: ["הפעולה חסומה כי היא עלולה לשנות נתונים", "Blocked because it could change data"],
    permission: ["אין הרשאה", "No permission"],
    content_not_loaded: ["התוכן לא נטען", "The content did not load"],
    navigation_failed: ["הניווט נכשל", "Navigation failed"],
    dialog_not_opened: ["החלונית לא נפתחה", "The dialog did not open"],
    no_effect: ["הלחיצה לא פתחה מסך", "The click did not open a screen"],
    time: ["מגבלת הזמן", "Time limit"],
    limit: ["מגבלת המשאבים", "Resource limit"],
  };
  const row = copy[reason || ""] || copy.no_effect;
  return he ? row[0] : row[1];
}

function ScreenTree({ pages, locale, picked }: { pages: DiscoveryPage[]; locale: string; picked: string[] }) {
  const names = new Set(pages.map((page) => page.name));
  const childrenOf = (parent: string) => pages.filter((page) => page.parent === parent);
  const roots = pages.filter((page) => !page.parent || !names.has(page.parent));
  const renderNodes = (nodes: DiscoveryPage[], depth: number): JSX.Element => (
    <ul>
      {depth > 8 ? null : nodes.map((node, index) => {
        const children = childrenOf(node.name).filter((child) => child !== node);
        let path = "";
        try { path = new URL(node.url).pathname; } catch { path = node.url; }
        const selected = node.selectable && picked.includes(node.url);
        const choice = !node.selectable ? (locale === "en" ? "Not a scan unit" : "לא נספר") : selected ? (locale === "en" ? "Selected" : "נבחר לסריקה") : (locale === "en" ? "Not selected" : "לא נבחר");
        return (
          <li key={`${node.url}|${node.type}|${node.name}|${depth}|${index}`}>
            {node.name} · {node.type} · {path} · {screenStatus(node.status, locale)} · {choice}
            {children.length ? renderNodes(children, depth + 1) : null}
          </li>
        );
      })}
    </ul>
  );
  return renderNodes(roots, 0);
}

function OwnerPilot({ scans = [] }: { scans?: Row[] }) {
  const [offer, setOffer] = useState<{ packages: Array<{ id: string; pages: number; usd: number; available: boolean; reason: string }> } | null>(null);
  const [run, setRun] = useState<Discovery | null>(null);
  const [discovery, setDiscovery] = useState<Discovery | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [exclude, setExclude] = useState("");
  const [step, setStep] = useState(1);
  const [extension, setExtension] = useState<{ eligible?: boolean; reason?: string; charged?: boolean; combined?: { publicScore?: number | null } } | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [packageId, setPackageId] = useState("pages10");
  const [locale, setLocale] = useState<keyof typeof DISCOVERY_COPY>("he");
  const [note, setNote] = useState("");
  const copy = DISCOVERY_COPY[locale];
  const packName = (id: string) => id === "pages30" ? copy.extended : id === "pages100" ? copy.advanced : copy.basic;
  const headers = () => {
    const token = localStorage.getItem("token") || "";
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };
  useEffect(() => {
    fetch("/compliance/api/admin/owner-pilot", { headers: headers(), credentials: "include" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) setNote(data.error || "הפיילוט סגור");
        else setOffer(data);
      })
      .catch(() => setNote("הפיילוט סגור"));
  }, []);
  useEffect(() => {
    const current = discovery?.status === "running" ? discovery : run;
    if (!current || current.status === "failed" || current.status === "cancelled" || current.status === "discovered" || current.status === "partial" || current.reportReady) return undefined;
    const timer = window.setInterval(() => {
      fetch(`/compliance/api/admin/owner-pilot/${current.id}`, { headers: headers(), credentials: "include" })
        .then((response) => response.json())
        .then((data) => {
          if (data.kind === "discovery") applyDiscovery(data);
          else setRun(data);
        })
        .catch(() => undefined);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [discovery?.id, discovery?.status, run?.id, run?.status, run?.reportReady]);
  function applyDiscovery(data: Discovery) {
    setDiscovery(data);
    if (data.status === "running") return;
    if (data.status !== "failed" && data.recommended?.packageId) setPackageId(data.recommended.packageId);
    const cap = data.recommended?.extra ? 100 : data.recommended?.pages || 10;
    if (data.pages) setPicked(data.pages.filter((item) => item.selectable).map((item) => item.url).slice(0, cap));
  }
  async function discoverPages(resumeId = "") {
    setNote("");
    setRun(null);
    let loginUrl = "";
    try { loginUrl = `${new URL(url.startsWith("http") ? url : `https://${url}`).origin}/login`; } catch { setNote(copy.url); return; }
    const response = await fetch("/compliance/api/admin/owner-pilot/discover", {
      method: "POST",
      headers: headers(),
      credentials: "include",
      body: JSON.stringify({ url, scope: "host", exclude: exclude.split(/\s+/).filter(Boolean), username, password, locale, consent, loginUrl, ...(resumeId ? { resumeId } : {}) }),
    });
    const data = await response.json().catch(() => ({}));
    setPassword("");
    if (!response.ok) { setNote(discoveryOutcome({ status: "failed", error: data.error }, locale)); return; }
    applyDiscovery(data);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setNote("");
    let loginUrl = "";
    try { loginUrl = `${new URL(url.startsWith("http") ? url : `https://${url}`).origin}/login`; } catch { setNote(copy.url); return; }
    const response = await fetch("/compliance/api/admin/owner-pilot", {
      method: "POST",
      headers: headers(),
      credentials: "include",
      body: JSON.stringify({ url, scope: "host", exclude: exclude.split(/\s+/).filter(Boolean), packageId, username, password, locale, loginUrl, discoveryId: discovery?.id, selected: picked }),
    });
    const data = await response.json().catch(() => ({}));
    setPassword("");
    if (!response.ok) {
      setNote(data.error || copy.start);
      return;
    }
    setRun(data);
  }
  async function download() {
    if (!run) return;
    const response = await fetch(`/compliance/api/admin/owner-pilot/${run.id}/pdf`, { headers: headers(), credentials: "include" });
    if (!response.ok) return;
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "internal-scan.pdf";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  const steps = locale === "en" ? ["Site", "Access", "Discovery", "Package", "Report"] : locale === "es" ? ["Sitio", "Acceso", "Descubrimiento", "Paquete", "Informe"] : locale === "pt-BR" ? ["Site", "Acesso", "Descoberta", "Pacote", "Relatório"] : locale === "ar" ? ["الموقع", "الدخول", "الاكتشاف", "الحزمة", "التقرير"] : ["אתר", "גישה", "גילוי", "חבילה", "דוח"];
  const excludeLabel = locale === "en" ? "Areas to skip (optional)" : locale === "es" ? "Zonas que no se escanean (opcional)" : locale === "pt-BR" ? "Áreas para não varrer (opcional)" : locale === "ar" ? "مناطق لا تُفحص (اختياري)" : "אזורים שלא לסרוק (אופציונלי)";
  const excludeNote = {
    he: "ברירת המחדל היא סריקת כל העמודים הנגישים למשתמש הבדיקה באתר שאישרת. אם יש אזורים שאינך רוצה שנבדוק, אפשר לציין אותם כאן. אזורים מסוכנים, פעולות שמשנות מידע וכתובות שאינן מורשות יישארו חסומים תמיד.",
    en: "By default every page the test user can open on the approved site is included. List areas to skip. Dangerous actions, data changes and unapproved addresses stay blocked.",
    es: "De forma predeterminada se incluyen las páginas que el usuario de prueba puede abrir en el sitio aprobado. Se pueden excluir zonas. Las acciones peligrosas y las direcciones no autorizadas siguen bloqueadas.",
    "pt-BR": "Por padrão, entram as páginas que o usuário de teste pode abrir no site aprovado. Dá para excluir áreas. Ações perigosas e endereços não autorizados continuam bloqueados.",
    ar: "الافتراضي هو فحص كل الصفحات المتاحة لمستخدم الاختبار في الموقع الذي وافقت عليه. يمكن استثناء مناطق. تبقى الإجراءات الخطرة والعناوين غير المصرح بها ممنوعة.",
  }[locale];
  const selectable = (discovery?.pages || []).filter((item) => item.selectable);
  return (
    <form onSubmit={submit} className="scan-wizard" autoComplete="off" dir={locale === "he" || locale === "ar" ? "rtl" : "ltr"}>
      <h2>{copy.title}</h2>
      <p>{copy.intro}</p>
      <ol className="scan-steps">
        {steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index + 1 ? "step" : undefined} onClick={() => setStep(index + 1)}>{index + 1}. {label}</button></li>)}
      </ol>
      {note ? <p className="compliance-admin__error">{note}</p> : null}
      {step === 1 ? <>
        <label>{copy.url}<input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/account" /></label>
        <label>{locale === "en" ? "Existing report" : "דוח קיים"}
          <select value="" onChange={(event) => {
            const row = scans.find((item) => item.id === event.target.value);
            if (!row) return;
            setUrl(row.url);
            fetch(`/compliance/api/admin/owner-pilot/extensions/${row.id}`, { headers: headers(), credentials: "include" }).then((response) => response.json()).then(setExtension).catch(() => setExtension(null));
          }}>
            <option value="">{locale === "en" ? "New site" : "אתר חדש"}</option>
            {scans.filter((item) => item.status === "completed").slice(0, 20).map((item) => <option key={item.id} value={item.id}>{item.host}</option>)}
          </select>
        </label>
        {extension ? <p>{extension.eligible ? (locale === "en" ? "This report can add an internal scan. The public report is not charged again." : "אפשר להוסיף סריקה פנימית לדוח זה בלי לשלם שוב על הסריקה הציבורית.") : extension.reason} · {extension.charged === false ? "$0" : ""}</p> : null}
        <label>{copy.language}
          <select value={locale} onChange={(event) => setLocale(event.target.value as keyof typeof DISCOVERY_COPY)}>
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt-BR">Português</option>
            <option value="ar">العربية</option>
          </select>
        </label>
      </> : null}
      {step === 2 ? <>
        <label>{copy.user}<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="off" /></label>
        <label>{copy.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>
        <label className="scan-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>{copy.consent}</span></label>
        <label>{excludeLabel}<input value={exclude} onChange={(event) => setExclude(event.target.value)} placeholder="/billing /private" /></label>
        <p>{excludeNote}</p>
      </> : null}
      {step === 3 ? <>
      <button type="button" className="scan-primary" disabled={!consent || !url || !username || !password || discovery?.status === "running"} onClick={discoverPages}>{discovery?.status === "running" ? copy.progress : copy.discover}</button>
      {discovery?.status === "running" ? <p>{copy.progress} · {discovery.percent}%</p> : null}
      {discovery && discovery.status !== "running" ? (
        <div>
          {discoveryOutcome(discovery, locale) ? <p>{discoveryOutcome(discovery, locale)}</p> : null}
          {(discovery.discovered || discovery.unique || discovery.inaccessible || discovery.needsSelection) ? <p>{copy.found}: {discovery.discovered}. {copy.unique}: {discovery.unique}. {copy.duplicates}: {discovery.duplicates}. {copy.blocked}: {discovery.inaccessible}. {copy.publicPages}: {discovery.publicPages}. {copy.internalPages}: {discovery.internalPages}. {copy.dynamic}: {discovery.dynamicTypes}.</p> : null}
          {(discovery.screens || discovery.tabsChecked || discovery.menusOpened || discovery.menusFound || discovery.navFound || discovery.needsSelection || discovery.modals || discovery.drawers || discovery.wizards || discovery.partial) ? <p>{locale === "he" ? "מסכים" : "Screens"}: {discovery.screens || 0}. {locale === "he" ? "לשוניות" : "Tabs"}: {discovery.tabsChecked || 0}. {locale === "he" ? "חלוניות" : "Dialogs"}: {discovery.modals || 0}. {locale === "he" ? "מגירות" : "Drawers"}: {discovery.drawers || 0}. {locale === "he" ? "שלבי אשף" : "Wizard steps"}: {discovery.wizards || 0}. {locale === "he" ? "תפריטים שזוהו" : "Menus found"}: {discovery.menusFound || 0}. {locale === "he" ? "תפריטים שנפתחו" : "Menus opened"}: {discovery.menusOpened || 0}. {locale === "he" ? "פריטי ניווט" : "Navigation items"}: {discovery.navFound || 0}. {locale === "he" ? "נפתחו" : "Opened"}: {discovery.navOpened || 0}. {locale === "he" ? "לא נפתחו" : "Unopened"}: {discovery.navUnopened || 0}. {locale === "he" ? "דורש בחירת רשומה" : "Needs a record"}: {discovery.needsSelection || 0}.</p> : null}
          {discovery.navUnopened ? <p>{locale === "en" ? "More navigation areas were found and have not been opened. The screen count may be higher." : "התגלו אזורי ניווט נוספים שטרם נפתחו. מספר המסכים עשוי להיות גבוה יותר."}</p> : null}
          {discovery.resumable ? <button type="button" onClick={() => discoverPages(discovery.id)} disabled={!password || discovery.status === "running"}>{locale === "en" ? "Continue discovery" : "המשך גילוי"}</button> : null}
          <ScreenTree pages={discovery.pages || []} locale={locale} picked={picked} />
          {(discovery.navItems || []).filter((item) => !item.opened && item.reason !== "skipped_collapse" && item.reason !== "current_screen").length ? (
            <ul>
              {(discovery.navItems || []).filter((item) => !item.opened && item.reason !== "skipped_collapse" && item.reason !== "current_screen").slice(0, 40).map((item, index) => (
                <li key={`${item.label}|${item.path}|${index}`}>{item.source ? `${item.source} / ` : ""}{item.label}{item.path ? ` · ${item.path}` : ""} · {navReason(item.reason, locale)}</li>
              ))}
            </ul>
          ) : null}
          {discovery.status !== "failed" ? <p>{copy.note}</p> : null}
          {discovery.recommended && discovery.status !== "failed" ? <p>{copy.recommend}: {packName(discovery.recommended.packageId)} · ${discovery.recommended.usd} · {discovery.scanPages}</p> : null}
          {discovery.recommended?.extra ? <p>{copy.extra}</p> : null}
          <p>{picked.length} / {selectable.length}</p>
          <button type="button" onClick={() => setPicked(selectable.map((item) => item.url).slice(0, discovery?.recommended?.extra ? 100 : discovery?.recommended?.pages || 100))}>{locale === "en" ? "Select allowed pages" : "בחירת העמודים המותרים"}</button>
          <table className="scan-pages">
            <thead><tr><th></th><th>{copy.name}</th><th>{copy.address}</th><th>{copy.type}</th><th>{copy.status}</th></tr></thead>
            <tbody>
              {(discovery.pages || []).map((item, index) => (
                <tr key={`${item.url}|${item.type}|${item.name}|${index}`}>
                  <td>{item.selectable ? <input type="checkbox" checked={picked.includes(item.url)} onChange={(event) => setPicked((current) => event.target.checked ? [...current, item.url] : current.filter((value) => value !== item.url))} /> : null}</td>
                  <td>{item.parent ? `${item.parent} / ` : ""}{item.name}{item.instances && item.instances > 1 ? ` (${item.instances})` : ""}</td>
                  <td>{item.url}</td>
                  <td>{item.type}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      </> : null}
      {step === 4 ? <>
      <label>{copy.recommend}
        <select value={packageId} onChange={(event) => setPackageId(event.target.value)}>
          {(offer?.packages || [{ id: "pages10", pages: 10, usd: 19, available: true, reason: "" }]).map((item) => (
            <option key={item.id} value={item.id} disabled={!item.available}>{packName(item.id)} · {item.pages} · ${item.usd}{item.available ? "" : " · —"}</option>
          ))}
        </select>
      </label>
      {discovery?.recommended && discovery.status !== "failed" ? <p className="scan-recommend">{copy.recommend}: {packName(discovery.recommended.packageId)} · ${discovery.recommended.usd}</p> : null}
      <button type="submit" className="scan-primary" disabled={!discovery || discovery.status === "running" || !picked.length}>{copy.start}</button>
      </> : null}
      {step === 5 ? (
        <section className="scan-recommend">
          <h3>{locale === "en" ? "Compliance report" : "דוח תאימות"}</h3>
          <p>{locale === "en" ? "Public score stays as stored." : "הציון הציבורי נשאר כפי שנשמר."} {extension?.combined?.publicScore ?? "—"}</p>
          <p>{locale === "en" ? "The internal score is separate. Public, internal and combined PDFs stay separate." : "הציון הפנימי נפרד. אפשר להוריד PDF ציבורי, PDF פנימי ו־PDF משולב."}</p>
        </section>
      ) : null}
      {step === 5 && run ? (
        <div>
          <p>{run.unique} / {run.pagesAllowed} · {run.percent}% · {run.status}</p>
          <button type="button" onClick={() => fetch(`/compliance/api/admin/owner-pilot/${run.id}/cancel`, { method: "POST", headers: headers(), credentials: "include" }).then((response) => response.json()).then(setRun)}>{copy.stop}</button>
          {run.reportReady ? <button type="button" onClick={download}>PDF</button> : null}
          <ul>{(run.findings || []).map((item) => <li key={`${item.url}-${item.title}`}>{item.outcome} · {item.title} · {item.url}</li>)}</ul>
        </div>
      ) : null}
      <div className="scan-nav">
        <button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>{locale === "en" ? "Back" : "חזרה"}</button>
        {step < 5 ? <button type="button" onClick={() => setStep((current) => Math.min(5, current + 1))}>{locale === "en" ? "Next" : "המשך"}</button> : null}
      </div>
    </form>
  );
}

function InternalOrders() {
  const [orders, setOrders] = useState<Array<{ id: string; host: string; packageId: string; paymentStatus: string; consent: boolean; pagesAllowed: number; accessStatus: string; scanStatus: string; pagesChecked: number; error: string; reportId: string }>>([]);
  const [note, setNote] = useState("הגבייה סגורה. אין הזמנות פעילות.");
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/compliance/api/admin/internal-scans", { headers: token ? { Authorization: `Bearer ${token}` } : {}, credentials: "include" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setNote(data.error || "לא ניתן לטעון את הזמנות הסריקה המורחבת");
          return;
        }
        setOrders(data.orders || []);
        setNote(data.enabled ? "השירות פתוח" : "השירות כבוי והגבייה סגורה");
      })
      .catch(() => setNote("לא ניתן לטעון את הזמנות הסריקה המורחבת"));
  }, []);
  return (
    <div className="compliance-admin__table">
      <p>{note}</p>
      <table>
        <thead>
          <tr>
            <th>לקוח ואתר</th>
            <th>חבילה</th>
            <th>תשלום</th>
            <th>אישור</th>
            <th>עמודים שאושרו</th>
            <th>פרטי גישה</th>
            <th>מצב</th>
            <th>עמודים שנבדקו</th>
            <th>תקלה</th>
            <th>דוח</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.host}</td>
              <td>{order.packageId}</td>
              <td>{order.paymentStatus === "not_charged" ? "לא בוצע תשלום" : order.paymentStatus}</td>
              <td>{order.consent ? "נחתם" : "חסר"}</td>
              <td>{order.pagesAllowed}</td>
              <td>{order.accessStatus === "stored" ? "נשמרו מוצפנים" : "לא נמסרו"}</td>
              <td>{order.scanStatus}</td>
              <td>{order.pagesChecked}</td>
              <td>{order.error || "—"}</td>
              <td>{order.reportId || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComplianceScansAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [subscriptions, setSubscriptions] = useState<Array<Record<string, unknown>>>([]);
  const [consent, setConsent] = useState<Record<string, string> | null>(null);
  const [payment, setPayment] = useState("");
  const [audience, setAudience] = useState("");
  const [signature, setSignature] = useState("");
  const [summary, setSummary] = useState<{ total: number; free: number; paid: number; completed: number; failed: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [params, setParams] = useSearchParams();
  const section = params.get("section") === "internal" || params.get("section") === "orders" ? params.get("section") : "scans";
  const pageSize = 25;

  async function load(nextPage = page, event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token") || "";
    const params = new URLSearchParams({ page: String(nextPage), pageSize: String(pageSize) });
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (payment) params.set("payment", payment);
    if (audience) params.set("audience", audience);
    if (signature) params.set("signature", signature);
    try {
      const response = await fetch(`/compliance/api/admin/scans?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLoaded(false);
        setSummary(null);
        setError(data.error || (response.status === 401 ? "נדרשת התחברות מנהל" : `לא ניתן לטעון את רשימת הסריקות (HTTP ${response.status})`));
        return;
      }
      setLoaded(true);
      setRows(data.rows || []);
      setTotal(Number(data.total) || 0);
      setSummary(data.summary || null);
      setPage(Number(data.page) || nextPage);
    } catch {
      setLoaded(false);
      setSummary(null);
      setError("לא ניתן לטעון את רשימת הסריקות. הרשימה לא ריקה בהכרח — הטעינה נכשלה.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsage() {
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch("/compliance/api/admin/ai-usage", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setUsage(null);
        setHistory([]);
        return;
      }
      setUsage(data.today || null);
      setHistory(data.history || []);
    } catch {
      setUsage(null);
    }
  }

  useEffect(() => {
    load(1);
    loadUsage();
    const token = localStorage.getItem("token") || "";
    fetch("/compliance/api/admin/subscriptions", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((response) => response.ok ? response.json() : { rows: [] })
      .then((data) => setSubscriptions(data.rows || []))
      .catch(() => setSubscriptions([]));
    // The first view uses the current filters. Later searches submit the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openConsent(id: string | null | undefined) {
    if (!id) return;
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/admin/consents/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "ההצהרה לא נפתחה"); return; }
    setConsent(data);
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="compliance-admin" dir="rtl">
      <header className="compliance-admin__head">
        <h1>סריקות ודוחות</h1>
        <p>הצפייה כאן שמורה לבעלת המערכת ולמנהלים עם הרשאת compliance.reports. פתיחת דוח אינה רושמת רכישה.</p>
      </header>
      <nav className="scan-tabs" aria-label="סריקות">
        <button type="button" aria-current={section === "scans" ? "page" : undefined} onClick={() => setParams({})}>כל הסריקות</button>
        <button type="button" aria-current={section === "internal" ? "page" : undefined} onClick={() => setParams({ section: "internal" })}>סריקות פנימיות</button>
        <button type="button" aria-current={section === "orders" ? "page" : undefined} onClick={() => setParams({ section: "orders" })}>ניהול הזמנות</button>
      </nav>
      {section === "scans" && usage ? (
        <section className="compliance-admin__usage" aria-label="צריכת AI היום">
          <div>
            <h2>צריכת AI היום</h2>
            <p>הסכום הוא עלות מדודה לפי טוקנים ומחיר המודל. הוא אינו חיוב ללקוח.</p>
          </div>
          {usage.alerts.map((alert) => (
            <p key={alert.level} className={`compliance-admin__alert compliance-admin__alert--${alert.level}`} role="status">
              {alert.message}
            </p>
          ))}
          <div className="compliance-admin__bar" aria-hidden="true">
            <span style={{ width: `${Math.min(100, usage.percent)}%` }} />
          </div>
          <div className="compliance-admin__stats">
            <p><span>עלות היום</span><b>{money(usage.spentUsd)}</b></p>
            <p><span>תקציב יומי</span><b>{money(usage.capUsd)}</b></p>
            <p><span>סריקות היום</span><b>{usage.scansToday}</b></p>
            <p><span>ממוצע לסריקה עם AI</span><b>{usage.averageUsd == null ? "—" : money(usage.averageUsd)}</b></p>
            <p><span>קריאות חיות</span><b>{usage.liveCalls}</b></p>
            <p><span>מטמון, בלי חיוב</span><b>{usage.cacheHits}</b></p>
            <p><span>איפוס הבא</span><b>{resetLabel(usage.resetAt)}</b></p>
          </div>
          {usage.reservedUsd > usage.spentUsd ? <p>יש שמירת תקציב לסריקות שרצות כרגע. השמירה אינה חיוב.</p> : null}
          {history.length ? (
            <div className="compliance-admin__table compliance-admin__history">
              <table>
                <thead>
                  <tr>
                    <th>יום UTC</th>
                    <th>עלות מדודה</th>
                    <th>קריאות חיות</th>
                    <th>מטמון</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.day}>
                      <td>{row.day}</td>
                      <td>{money(row.spentUsd)}</td>
                      <td>{row.liveCalls}</td>
                      <td>{row.cacheHits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
      {section === "internal" ? <OwnerPilot scans={rows} /> : null}
      {section === "orders" ? <>
      <h2>סריקה מורחבת — אזורים פנימיים</h2>
      <p>בסיסית $19 עד 10 עמודים, מורחבת $39 עד 30, מתקדמת $79 עד 100. משתמש בדיקה אחד ותפקיד אחד. השירות כבוי והגבייה סגורה. הרשימה מציגה הזמנות בלי סיסמה. הרחבה לדוח ששולם אינה גובה שוב את מחיר הדוח הציבורי.</p>
      <InternalOrders />
      </> : null}
      {section === "scans" ? <form className="compliance-admin__filters" onSubmit={(event) => load(1, event)}>
        <label>
          <span>שם, אימייל או דומיין</span>
          <input value={q} onChange={(event) => setQ(event.target.value)} />
        </label>
        <label>
          <span>מתאריך</span>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <span>עד תאריך</span>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <label>
          <span>סטטוס</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">הכל</option>
            <option value="completed">הושלמה</option>
            <option value="running">רצה</option>
            <option value="queued">בתור</option>
            <option value="failed">נכשלה</option>
          </select>
        </label>
        <label>
          <span>תשלום</span>
          <select value={payment} onChange={(event) => setPayment(event.target.value)}>
            <option value="">הכל</option>
            <option value="free">חינם</option>
            <option value="paid">בתשלום</option>
          </select>
        </label>
        <label>
          <span>לקוח</span>
          <select value={audience} onChange={(event) => setAudience(event.target.value)}>
            <option value="">הכל</option>
            <option value="guest">אורח</option>
            <option value="registered">רשום</option>
          </select>
        </label>
        <label>
          <span>חתימה</span>
          <select value={signature} onChange={(event) => setSignature(event.target.value)}>
            <option value="">הכל</option>
            <option value="signed">נחתם</option>
            <option value="unsigned">לא נחתם</option>
          </select>
        </label>
        <button type="submit">חיפוש</button>
      </form> : null}
      {section === "scans" && error ? <p className="compliance-admin__error" role="alert">{error}</p> : null}
      {section === "scans" && loaded && summary ? (
        <div className="compliance-admin__counts">
          <p><span>סך כל הסריקות</span><b>{summary.total}</b></p>
          <p><span>חינמיות</span><b>{summary.free}</b></p>
          <p><span>בתשלום</span><b>{summary.paid}</b></p>
          <p><span>הושלמו</span><b>{summary.completed}</b></p>
          <p><span>נכשלו</span><b>{summary.failed}</b></p>
        </div>
      ) : null}
      {section === "scans" ? <p className="compliance-admin__meta">{loading ? "טוען…" : loaded ? `${total} סריקות בסינון הנוכחי` : "הרשימה לא נטענה"}</p> : null}
      {section === "scans" ? <div className="compliance-admin__table">
        <table>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>שם לקוח</th>
              <th>אימייל</th>
              <th>דומיין</th>
              <th>סטטוס</th>
              <th>ציון</th>
              <th>ממצאים</th>
              <th>סוג סריקה</th>
              <th>תשלום</th>
              <th>הצהרה וחתימה</th>
              <th>פרטים</th>
              <th>דוח ראשוני</th>
              <th>דוח מלא</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{stamp(row.createdAt)}</td>
                <td>{row.requesterName || (row.guest ? "אורח" : "לא נשמר")}</td>
                <td>{row.requesterEmail || "—"}</td>
                <td><a href={row.url}>{row.host || row.url}</a></td>
                <td>{STATUS[row.status] || row.status}</td>
                <td>{count(row.score)}</td>
                <td>{count(row.findings ?? row.action)}</td>
                <td>{row.demo ? "בדיקה" : row.plan === "quarterly" ? "רבעוני" : row.plan === "annual" || row.plan === "monitor" || row.plan === "monthly" ? "חודשי" : row.plan === "report" ? "חד־פעמי" : "חינם"}</td>
                <td>{row.paid || row.purchaseStatus === "verified" ? "שולם" : "לא שולם"}</td>
                <td>
                  {row.consentStatus === "signed" ? (
                    <>
                      <b>נחתם</b>
                      <div>{stamp(row.consentAt)}</div>
                      <button type="button" onClick={() => openConsent(row.consentId)}>צפייה בהצהרה</button>
                    </>
                  ) : (
                    <span>סריקה קודמת — לא קיים אישור חתום במערכת</span>
                  )}
                </td>
                <td><a href={`/admin/compliance-scans/${row.id}`}>פרטי הסריקה</a></td>
                <td><a href={`/admin/compliance-scans/${row.id}?tab=free`}>דוח ראשוני</a></td>
                <td><a href={`/admin/compliance-scans/${row.id}?tab=full`}>דוח מלא</a></td>
                <td><a href={`/admin/compliance-scans/${row.id}?tab=pdf`}>PDF</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}
      {section === "orders" ? <h2>מנויים</h2> : null}
      {section === "orders" ? <div className="compliance-admin__table">
        <table>
          <thead>
            <tr>
              <th>מזהה</th><th>דומיין</th><th>מסלול</th><th>הושלמו</th><th>נותרו</th><th>יום</th><th>הבאה</th><th>מצב</th><th>סיום</th><th>חידוש</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((row) => (
              <tr key={`${row.host}-${row.plan}`}>
                <td>{String(row.userId || "—")}</td>
                <td>{String(row.host || "—")}</td>
                <td>{row.plan === "quarterly" ? "רבעוני" : "חודשי"}</td>
                <td>{String(row.completed ?? "—")}</td>
                <td>{String(row.remaining ?? "—")}</td>
                <td>{String(row.scanDay ?? "—")}</td>
                <td>{String(row.nextAt || "—").slice(0, 10)}</td>
                <td>{String(row.nextState || "—")}</td>
                <td>{String(row.periodEnd || "—").slice(0, 10)}</td>
                <td>{row.renew ? "פעיל" : "כבוי"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}
      {section === "scans" ? <div className="compliance-admin__pager">
        <button type="button" disabled={page <= 1} onClick={() => load(page - 1)}>הקודם</button>
        <span>{page} / {pages}</span>
        <button type="button" disabled={page >= pages} onClick={() => load(page + 1)}>הבא</button>
      </div> : null}
      {consent && (
        <div className="compliance-admin__dialog" role="dialog" aria-modal="true">
          <article>
            <h2>פרטי החותם</h2>
            <p>{consent.fullName}</p>
            <p>{consent.email}</p>
            <p>{consent.phone}</p>
            <p>{consent.site}</p>
            <h2>פרטי ההסכמה</h2>
            <p>{stamp(consent.signedAt)}</p>
            <p>{consent.statementText}</p>
            <p>{consent.termsVersion} · {consent.privacyVersion} · {consent.scannerVersion}</p>
            <p>{consent.locale}</p>
            <p>{consent.id}</p>
            <h2>חתימה</h2>
            {consent.signature ? <img src={consent.signature} alt="" /> : null}
            <button type="button" onClick={() => setConsent(null)}>סגירה</button>
          </article>
        </div>
      )}
      <style>{`
        .compliance-admin { display: grid; gap: 16px; color: #1d2433; }
        .compliance-admin__head h1 { margin: 0; font-size: 1.5rem; }
        .compliance-admin__head p, .compliance-admin__meta { margin: 0; color: #5c6578; }
        .compliance-admin__filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; align-items: end; }
        .compliance-admin label { display: grid; gap: 4px; font-size: 0.82rem; font-weight: 700; }
        .compliance-admin input, .compliance-admin select, .compliance-admin button, .compliance-admin a {
          border: 1px solid #d7dce8; border-radius: 0; background: #fff; color: #1d2433; min-height: 40px;
        }
        .compliance-admin button { background: #5b4bdb; color: #fff; padding: 0 14px; cursor: pointer; }
        .compliance-admin button:disabled { opacity: 0.45; }
        .compliance-admin__error { color: #9b2335; margin: 0; }
        .compliance-admin__dialog { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); display: grid; place-items: center; z-index: 80; padding: 1rem; }
        .compliance-admin__dialog article { background: #fff; color: #1a0b33; max-width: 640px; width: 100%; padding: 1rem; display: grid; gap: 0.4rem; max-height: 86vh; overflow: auto; }
        .compliance-admin__dialog img { width: min(100%, 320px); background: #fff; border: 1px solid #e5e7eb; }
        .compliance-admin__table { overflow-x: auto; max-width: 100%; }
        .compliance-admin table { width: 100%; border-collapse: collapse; min-width: 980px; background: #fff; }
        .compliance-admin th, .compliance-admin td { border-bottom: 1px solid #e6eaf2; padding: 8px; text-align: right; vertical-align: top; font-size: 0.86rem; }
        .compliance-admin__actions { display: flex; flex-wrap: wrap; gap: 6px; }
        .compliance-admin__actions a, .compliance-admin__actions button { padding: 6px 8px; text-decoration: none; font-size: 0.8rem; }
        .compliance-admin__pager { display: flex; gap: 12px; align-items: center; }
        .compliance-admin__usage { display: grid; gap: 12px; border: 1px solid #d7dce8; background: #fff; padding: 16px; }
        .compliance-admin__usage h2 { margin: 0; font-size: 1.15rem; }
        .compliance-admin__usage p { margin: 0; }
        .compliance-admin__counts { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
        .compliance-admin__stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .compliance-admin__counts p, .compliance-admin__counts b { margin: 0; }
        .compliance-admin__counts p, .compliance-admin__stats p { display: grid; gap: 4px; }
        .compliance-admin__counts span, .compliance-admin__stats span { color: #5c6578; font-size: 0.78rem; }
        .compliance-admin__bar { height: 10px; background: #eceff6; }
        .compliance-admin__bar > span { display: block; height: 100%; background: #5b4bdb; }
        .compliance-admin__history table { min-width: 0; }
        .compliance-admin__alert { padding: 12px; font-weight: 800; }
        .compliance-admin__alert--warning { background: #fff6d8; color: #6a4b00; }
        .compliance-admin__alert--severe { background: #ffe8d6; color: #8a2e00; }
        .compliance-admin__alert--stopped { background: #fde2e6; color: #8d1d32; }
        .scan-tabs, .scan-steps, .scan-nav { display: flex; flex-wrap: wrap; gap: 8px; }
        .scan-tabs button, .scan-steps button { background: #fff; color: #24315c; }
        .scan-tabs button[aria-current="page"], .scan-steps button[aria-current="step"] { background: #24315c; color: #fff; }
        .scan-wizard { display: grid; gap: 14px; max-width: 720px; background: #fff; border: 1px solid #d7dce8; padding: 20px; }
        .scan-wizard h2 { margin: 0; color: #24315c; }
        .scan-wizard label { max-width: 460px; }
        .scan-wizard input, .scan-wizard select { width: 100%; padding: 0 12px; }
        .scan-check { display: flex !important; grid-template-columns: none; align-items: flex-start; gap: 8px; max-width: 520px; }
        .scan-check input { width: 18px; min-width: 18px; min-height: 18px; margin-top: 3px; }
        .scan-primary { background: #5b4bdb; color: #fff; min-height: 44px; padding: 0 18px; }
        .scan-recommend { background: #eef2ff; padding: 12px; margin: 0; }
        .scan-pages { min-width: 0; }
        .scan-pages input { width: 18px; min-height: 18px; }
        @media (max-width: 800px) {
          .compliance-admin__filters, .compliance-admin__counts, .compliance-admin__stats { grid-template-columns: 1fr; }
          .scan-wizard { max-width: none; padding: 14px; }
          .scan-tabs { overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
