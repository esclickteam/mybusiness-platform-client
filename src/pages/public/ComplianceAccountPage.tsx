import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeMarketingLocale } from "../../lib/localePathCore.mjs";
import "./websiteScan.css";
import { CONSENT_UI } from "../../lib/complianceConsentCopy";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";
type Slot = { number: number; dueOn: string; state: string; scanId: string | null; performed: boolean; score?: number | null; coverage?: number | null };
type Subscription = {
  host: string; plan: string; cadence: string; periodStart: string; periodEnd: string; nextBillAt: string | null;
  scanDay: number; timezone: string; renew: boolean; completed: number; total: number; remaining: number;
  nextAt: string | null; nextState: string; slots: Slot[]; scores: { dueOn: string; score: number }[];
};
type Preview = { ok: boolean; dates?: string[]; reason?: string; alternative?: { scanDay: number; dates: string[] } | null; scansStarted?: boolean };

const COPY: Record<Locale, Record<string, string>> = {
  he: {
    title: "האזור האישי",
    intro: "כאן נשמרים המנוי, יום הסריקה והדוחות אחרי אימות תשלום. הרכישה אינה פתוחה, ולכן לא נפתח מנוי ולא רצה סריקה.",
    register: "פתיחת חשבון",
    name: "שם מלא",
    email: "אימייל",
    password: "סיסמה",
    website: "כתובת האתר",
    create: "צרו חשבון",
    login: "התחברות",
    reset: "שחזור סיסמה",
    created: "החשבון נוצר. אפשר להתחבר ולשחזר סיסמה במערכת הקיימת. לא נפתח מנוי ולא רצה סריקה.",
    dayTitle: "באיזה יום בחודש תרצו שהאתר שלכם ייסרק אוטומטית?",
    dayNote: "נבצע את הסריקה באופן אוטומטי ביום שבחרתם, בהתאם לתדירות המסלול שלכם. הדוח המלא יופיע באזור האישי כשהסריקה תסתיים. אין שעת סיום מובטחת.",
    quarter: "מעקב רבעוני — $119 לשנה",
    month: "מעקב חודשי — $300 לשנה",
    preview: "הציגו את המועדים",
    save: "שמרו את היום בחשבון",
    previewFlag: "תצוגה מקדימה. לא בוצעה סריקה.",
    empty: "אין מנוי מאומת. המונה והיומן יציגו סריקות רק אחרי אימות תשלום.",
    done: "סריקות הושלמו",
    left: "סריקות נותרו",
    next: "הסריקה הבאה שלך",
    noneNext: "אין סריקה מתוכננת",
    calendar: "לוח הסריקות שלי",
    history: "היסטוריית סריקות",
    chart: "השוואת ציונים",
    chartEmpty: "הגרף יופיע אחרי הסריקה הראשונה שהושלמה.",
    report: "דוח מלא",
    pdf: "PDF",
    renewalOn: "החידוש האוטומטי פעיל",
    renewalOff: "החידוש האוטומטי כבוי. הסריקות ששולמו נשארות עד סוף התקופה.",
    scheduled: "מתוכננת",
    running: "מתבצעת",
    ready: "הדוח מוכן",
    retry: "נכשלה — ממתינה לניסיון חוזר",
    missed: "המועד עבר בלי תוצאה",
    zone: "אזור הזמן: Asia/Jerusalem",
  },
  en: {
    title: "Your account",
    intro: "The subscription, scan day and reports stay here after payment is verified. Purchase is not open, so no subscription is opened and no scan runs.",
    register: "Create an account",
    name: "Full name",
    email: "Email",
    password: "Password",
    website: "Website address",
    create: "Create account",
    login: "Sign in",
    reset: "Reset password",
    created: "The account was created. Sign in and password reset use the existing sign-in. No subscription was opened and no scan ran.",
    dayTitle: "Which day of the month should your site be scanned?",
    dayNote: "The scan runs automatically on the day you choose, at the frequency of your plan. The full report appears here when it is finished. A finish time is not promised.",
    quarter: "Quarterly monitoring — $119 a year",
    month: "Monthly monitoring — $300 a year",
    preview: "Show the dates",
    save: "Save the day to this account",
    previewFlag: "Preview only. No scan has run.",
    empty: "There is no verified subscription. The counter and calendar show scans only after payment is verified.",
    done: "scans completed",
    left: "scans remaining",
    next: "Your next scan",
    noneNext: "No scan is scheduled",
    calendar: "My scan calendar",
    history: "Scan history",
    chart: "Score comparison",
    chartEmpty: "The chart appears after the first completed scan.",
    report: "Full report",
    pdf: "PDF",
    renewalOn: "Automatic renewal is on",
    renewalOff: "Automatic renewal is off. Paid scans remain until the period ends.",
    scheduled: "Scheduled",
    running: "Running",
    ready: "Report ready",
    retry: "Failed — waiting for a retry",
    missed: "The date passed without a result",
    zone: "Time zone: Asia/Jerusalem",
  },
  es: {
    title: "Su cuenta", intro: "La suscripción, el día y los informes quedan aquí después de verificar el pago. La compra no está abierta: no se abre una suscripción ni corre un escaneo.",
    register: "Crear cuenta", name: "Nombre completo", email: "Correo", password: "Contraseña", website: "Dirección del sitio", create: "Crear cuenta", login: "Entrar", reset: "Restablecer contraseña",
    created: "La cuenta se creó. La entrada y la recuperación usan el acceso existente. No se abrió una suscripción ni corrió un escaneo.",
    dayTitle: "¿Qué día del mes quiere que el sitio se escanee?", dayNote: "El escaneo se hace ese día, según la frecuencia del plan. El informe aparece aquí al terminar. No se promete una hora de cierre.",
    quarter: "Seguimiento trimestral — 119 $ al año", month: "Seguimiento mensual — 300 $ al año", preview: "Ver las fechas", save: "Guardar el día",
    previewFlag: "Vista previa. No se hizo un escaneo.", empty: "No hay una suscripción verificada.",
    done: "escaneos completados", left: "escaneos restantes", next: "Su próximo escaneo", noneNext: "No hay un escaneo previsto",
    calendar: "Mi calendario", history: "Historial", chart: "Comparación de puntuaciones", chartEmpty: "El gráfico aparece tras el primer escaneo completado.",
    report: "Informe completo", pdf: "PDF", renewalOn: "La renovación automática está activa", renewalOff: "La renovación está cancelada. Los escaneos pagados siguen hasta el fin del periodo.",
    scheduled: "Previsto", running: "En curso", ready: "Informe listo", retry: "Falló — espera un nuevo intento", missed: "La fecha pasó sin resultado", zone: "Zona horaria: Asia/Jerusalem",
  },
  "pt-BR": {
    title: "Sua conta", intro: "A assinatura, o dia e os relatórios ficam aqui depois da verificação do pagamento. A compra não está aberta: nenhuma assinatura é aberta e nenhuma varredura começa.",
    register: "Criar conta", name: "Nome completo", email: "E-mail", password: "Senha", website: "Endereço do site", create: "Criar conta", login: "Entrar", reset: "Recuperar senha",
    created: "A conta foi criada. A entrada e a recuperação usam o acesso existente. Nenhuma assinatura foi aberta e nenhuma varredura começou.",
    dayTitle: "Em qual dia do mês o site deve ser varrido?", dayNote: "A varredura acontece nesse dia, na frequência do plano. O relatório aparece aqui ao terminar. Não há hora de término prometida.",
    quarter: "Acompanhamento trimestral — US$ 119 por ano", month: "Acompanhamento mensal — US$ 300 por ano", preview: "Ver as datas", save: "Salvar o dia",
    previewFlag: "Prévia. Nenhuma varredura foi feita.", empty: "Não há uma assinatura verificada.",
    done: "varreduras concluídas", left: "varreduras restantes", next: "Sua próxima varredura", noneNext: "Não há varredura prevista",
    calendar: "Meu calendário", history: "Histórico", chart: "Comparação de pontuações", chartEmpty: "O gráfico aparece depois da primeira varredura concluída.",
    report: "Relatório completo", pdf: "PDF", renewalOn: "A renovação automática está ativa", renewalOff: "A renovação está cancelada. As varreduras pagas continuam até o fim do período.",
    scheduled: "Prevista", running: "Em andamento", ready: "Relatório pronto", retry: "Falhou — aguarda nova tentativa", missed: "A data passou sem resultado", zone: "Fuso: Asia/Jerusalem",
  },
  ar: {
    title: "المنطقة الشخصية", intro: "يُحفظ الاشتراك ويوم الفحص والتقارير هنا بعد التحقق من الدفع. الشراء غير مفتوح، لذلك لا يُفتح اشتراك ولا يبدأ فحص.",
    register: "فتح حساب", name: "الاسم الكامل", email: "البريد", password: "كلمة المرور", website: "عنوان الموقع", create: "إنشاء الحساب", login: "دخول", reset: "استعادة كلمة المرور",
    created: "تم إنشاء الحساب. الدخول والاستعادة يتمان عبر النظام الحالي. لم يُفتح اشتراك ولم يبدأ فحص.",
    dayTitle: "في أي يوم من الشهر تريدون فحص الموقع تلقائيًا؟", dayNote: "يُجرى الفحص في اليوم الذي تختارونه حسب وتيرة الخطة. يظهر التقرير هنا عند انتهائه. لا تُوعد ساعة انتهاء.",
    quarter: "متابعة ربع سنوية — 119 دولارًا للسنة", month: "متابعة شهرية — 300 دولار للسنة", preview: "اعرضوا المواعيد", save: "احفظوا اليوم",
    previewFlag: "معاينة. لم يُجرَ فحص.", empty: "لا يوجد اشتراك مُتحقق منه.",
    done: "فحوص اكتملت", left: "فحوص متبقية", next: "فحصكم التالي", noneNext: "لا يوجد فحص مجدول",
    calendar: "رزنامة الفحوص", history: "السجل", chart: "مقارنة الدرجات", chartEmpty: "يظهر الرسم بعد أول فحص يكتمل.",
    report: "تقرير كامل", pdf: "PDF", renewalOn: "التجديد التلقائي مفعّل", renewalOff: "التجديد ملغى. الفحوصات المدفوعة تبقى حتى نهاية الفترة.",
    scheduled: "مجدول", running: "قيد التنفيذ", ready: "التقرير جاهز", retry: "فشل — بانتظار محاولة أخرى", missed: "مر الموعد بلا نتيجة", zone: "المنطقة الزمنية: Asia/Jerusalem",
  },
};

function authToken() {
  return localStorage.getItem("token") || "";
}

export function ComplianceAccountPage() {
  const { i18n } = useTranslation();
  const locale = (normalizeMarketingLocale(i18n.language) || "en") as Locale;
  const copy = COPY[locale] || COPY.en;
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const [cadence, setCadence] = useState<"quarterly" | "monthly">("quarterly");
  const [scanDay, setScanDay] = useState(15);
  const [website, setWebsite] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [signedIn, setSignedIn] = useState(Boolean(authToken()));

  async function loadAccount() {
    const token = authToken();
    setSignedIn(Boolean(token));
    if (!token) return;
    const response = await fetch("/compliance/api/account", { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return;
    setSubscriptions(data.subscriptions || []);
    if (data.preference?.scanDay) setScanDay(data.preference.scanDay);
    if (data.preference?.cadence === "monthly" || data.preference?.cadence === "quarterly") setCadence(data.preference.cadence);
    if (data.preference?.host) setWebsite(data.preference.host);
  }

  useEffect(() => { loadAccount().catch(() => {}); }, []);

  async function showDates(event?: FormEvent) {
    event?.preventDefault();
    const response = await fetch("/compliance/api/schedule/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cadence, scanDay, timezone: "Asia/Jerusalem" }),
    });
    setPreview(await response.json());
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register-compliance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        website: form.get("website"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? copy.created : (data.error || ""));
  }

  async function saveDay(event: FormEvent) {
    event.preventDefault();
    const token = authToken();
    if (!token) {
      setMessage(copy.login);
      return;
    }
    const response = await fetch("/compliance/api/account/preference", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cadence, scanDay, url: website }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) setPreview({ ok: true, dates: data.preference?.dates || [], scansStarted: false });
    else setMessage(data.error || data.reason || "");
  }

  async function downloadPdf(id: string) {
    const response = await fetch(`/compliance/api/scans/${id}/pdf`, { headers: { Authorization: `Bearer ${authToken()}` } });
    if (!response.ok) return;
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bizuply-website-report.pdf";
    link.click();
  }

  const active = subscriptions[0];
  const dates = preview?.ok ? preview.dates || [] : [];
  const stateLabel = (state: string) => copy[state] || state;

  return (
    <article className="scan-product" dir={dir} lang={locale}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="scan-product__wrap scan-account">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <p><Link to="/terms#compliance-ai">{CONSENT_UI[locale].accountLink}</Link></p>
        {!signedIn && (
          <form className="scan-account__form" onSubmit={register}>
            <h2>{copy.register}</h2>
            <label>{copy.name}<input name="name" required autoComplete="name" /></label>
            <label>{copy.email}<input name="email" type="email" required autoComplete="email" /></label>
            <label>{copy.password}<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
            <label>{copy.website}<input name="website" required placeholder="example.com" /></label>
            <button type="submit">{copy.create}</button>
            <p><Link to="/login">{copy.login}</Link> · <Link to="/forgot-password">{copy.reset}</Link></p>
            {message ? <p>{message}</p> : null}
          </form>
        )}
        <form className="scan-account__form" onSubmit={signedIn ? saveDay : showDates}>
          <h2>{copy.dayTitle}</h2>
          <p>{copy.dayNote}</p>
          <p>{copy.zone}</p>
          <div className="scan-account__choice">
            <label><input type="radio" name="cadence" checked={cadence === "quarterly"} onChange={() => setCadence("quarterly")} /> {copy.quarter}</label>
            <label><input type="radio" name="cadence" checked={cadence === "monthly"} onChange={() => setCadence("monthly")} /> {copy.month}</label>
          </div>
          <label>1–28
            <select aria-label={copy.dayTitle} value={scanDay} onChange={(event) => setScanDay(Number(event.target.value))}>
              {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
          </label>
          {signedIn ? <label>{copy.website}<input value={website} onChange={(event) => setWebsite(event.target.value)} required /></label> : null}
          <button type="submit">{signedIn ? copy.save : copy.preview}</button>
          {signedIn ? <button type="button" onClick={() => showDates()}>{copy.preview}</button> : null}
        </form>
        {preview && !preview.ok ? <p>{preview.reason}{preview.alternative ? `: ${preview.alternative.scanDay}` : ""}</p> : null}
        {dates.length > 0 && (
          <section>
            <p className="scan-demo__flag">{copy.previewFlag}</p>
            <ol className="scan-calendar">{dates.map((date, index) => <li key={date}><b>{index + 1}</b> <span>{date}</span> <em>{copy.scheduled}</em></li>)}</ol>
          </section>
        )}
        {!active ? <p>{copy.empty}</p> : (
          <>
            <section className="scan-account__summary">
              <h2>{active.host}</h2>
              <p>{active.plan === "quarterly" ? copy.quarter : copy.month}</p>
              <p>{active.periodStart.slice(0, 10)} — {active.periodEnd.slice(0, 10)}</p>
              <p>{active.scanDay}</p>
              <p>{active.renew ? copy.renewalOn : copy.renewalOff}</p>
              <strong>{active.completed} / {active.total}</strong>
              <p>{copy.done}</p>
              <p>{active.remaining} {copy.left}</p>
              <div className="scan-progress" aria-hidden="true"><span style={{ width: `${active.total ? (active.completed / active.total) * 100 : 0}%` }} /></div>
              <h3>{copy.next}</h3>
              <p>{active.nextAt ? `${active.nextAt.slice(0, 10)} — ${stateLabel(active.nextState)}` : copy.noneNext}</p>
            </section>
            <section>
              <h2>{copy.calendar}</h2>
              <ol className="scan-calendar">
                {active.slots.map((slot) => (
                  <li key={slot.number}>
                    <b>{slot.number}/{active.total}</b>
                    <span>{slot.dueOn}</span>
                    <em>{stateLabel(slot.state)}</em>
                    {slot.performed && slot.scanId ? <Link to={`/compliance/report/${slot.scanId}`}>{copy.report}</Link> : null}
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2>{copy.history}</h2>
              <ul className="scan-calendar">
                {active.slots.filter((slot) => slot.performed).map((slot) => (
                  <li key={slot.number}>
                    <b>{slot.number}</b>
                    <span>{slot.dueOn}</span>
                    <span>{slot.score == null ? "—" : slot.score}</span>
                    <span>{slot.coverage == null ? "—" : `${slot.coverage}%`}</span>
                    {slot.scanId ? <Link to={`/compliance/report/${slot.scanId}`}>{copy.report}</Link> : null}
                    {slot.scanId ? <button type="button" onClick={() => downloadPdf(slot.scanId || "")}>{copy.pdf}</button> : null}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{copy.chart}</h2>
              {active.scores?.length ? (
                <div className="scan-chart">
                  {active.scores.map((point) => (
                    <div key={point.dueOn}><span style={{ height: `${point.score}%` }} /><small>{point.dueOn.slice(5)} {point.score}</small></div>
                  ))}
                </div>
              ) : <p>{copy.chartEmpty}</p>}
            </section>
          </>
        )}
      </div>
    </article>
  );
}
