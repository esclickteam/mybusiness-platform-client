import { DEMO_PAYLOAD } from "./complianceDemoFixture";

export type DemoLocale = "he" | "en" | "es" | "pt-BR" | "ar";

export function demoLocale(value: string | null | undefined): DemoLocale {
  const raw = String(value || "he").toLowerCase();
  if (raw.startsWith("pt")) return "pt-BR";
  if (raw === "en" || raw === "es" || raw === "ar" || raw === "he") return raw;
  return "he";
}

type Phrase = { title: string; description?: string; explanation?: string; evidence?: string; recommendation?: string; change?: string; verify?: string };

const EN: Record<string, Phrase | string | string[]> = {
  docs: ["Privacy policy", "Terms of use", "Accessibility statement"],
  tracker: "It was not checked whether the component loads before a choice.",
  "security.csp": {
    title: "Content-Security-Policy header was missing on the checked response",
    description: "The sample site did not return a Content-Security-Policy header on the home page.",
    explanation: "A CSP can help limit some risks from loading resources and running content in the browser.",
    evidence: "The response from https://example.com/ did not include a Content-Security-Policy header.",
    recommendation: "Review a CSP that matches the resources and scripts the site actually needs, test it, and confirm it does not break normal use.",
  },
  "security.hsts": {
    title: "Strict-Transport-Security header was missing on the checked response",
    description: "The sample response did not tell the browser to stay on a secure connection.",
    explanation: "An HSTS header asks the browser to use HTTPS on later visits to the same site.",
    evidence: "The response from https://example.com/ did not include Strict-Transport-Security.",
    recommendation: "Check whether HSTS fits after every page loads over HTTPS.",
  },
  "privacy.cookies": {
    title: "No cookie choice was shown on the checked page",
    description: "The sample home page did not show a control for cookie choices.",
    explanation: "When measurement tools are present, visitors need a way to see what loads and to choose when a choice is required.",
    evidence: "No choice control was found on https://example.com/. A script named Example Analytics was seen.",
    recommendation: "Show a clear choice before loading measurement tools that are not required, and keep that choice.",
  },
  "privacy.policy-detail": {
    title: "The sample privacy policy does not describe how long information is kept",
    description: "The public sample document was found, but no wording about a retention period was identified.",
    explanation: "Missing wording in a document that was read is not a finding that the site breaks a law.",
    evidence: "No retention wording was identified at https://example.com/privacy.",
    recommendation: "Add an explanation of the kinds of information and how long it is kept, if that information is collected.",
  },
  "a11y.contrast": {
    title: "Low contrast in the sample text",
    description: "Light gray text on a white background was measured.",
    explanation: "Low contrast makes reading harder. An automatic measurement does not cover every accessibility requirement.",
    evidence: "The color #8696a0 on white at https://example.com/ measured below a 4.5:1 ratio.",
    recommendation: "Darken the text color and measure the contrast again.",
  },
  "a11y.name": {
    title: "A sample button has no accessible name",
    description: "An icon button on the sample home page has no text and no label.",
    explanation: "Without a name, a screen reader does not say what the button does.",
    evidence: "A button with no text and no aria-label was found at https://example.com/.",
    recommendation: "Add a visible name or a label, and check the button with a keyboard.",
  },
  "document.terms": {
    title: "Terms of use were not found on the checked paths",
    description: "The search of the sample public paths did not find the terms of use.",
    explanation: "The document may exist somewhere else. The check reports only what could be opened.",
    evidence: "https://example.com/terms returned a page that was not found.",
    recommendation: "Publish the terms at an address that can be reached from the site pages.",
  },
  "privacy.retention": {
    title: "A retention period was not decided",
    description: "The words found in the document are not enough to decide this point.",
    explanation: "The check was not decided. That is not a finding that the topic is missing, and it is not a finding that it is fine.",
  },
  "a11y.axe": {
    title: "Some contrast checks were not decided",
    description: "Colors were not saved for every component, so they could not all be measured.",
    explanation: "A check that was not decided stays out of the score. It is not counted as passed.",
  },
  "plan.a11y.name": { title: "Name the sample button", change: "Add a label to the icon button.", verify: "Reach the button with a keyboard and a screen reader." },
  "plan.security.csp": { title: "Review Content-Security-Policy", change: "Set a policy that matches the site resources and test it before publishing.", verify: "Load the page and confirm the header is in the response." },
  "plan.privacy.cookies": { title: "Add a cookie choice", change: "Show a choice before Example Analytics loads.", verify: "Refresh the page and confirm the measurement tool does not load before the choice." },
};

const ES: Record<string, Phrase | string | string[]> = {
  docs: ["Política de privacidad", "Condiciones de uso", "Declaración de accesibilidad"],
  tracker: "No se comprobó si el componente se carga antes de una elección.",
  "security.csp": {
    title: "Faltó la cabecera Content-Security-Policy en la respuesta revisada",
    description: "El sitio de ejemplo no devolvió la cabecera Content-Security-Policy en la página de inicio.",
    explanation: "Una CSP puede ayudar a limitar algunos riesgos al cargar recursos y ejecutar contenido.",
    evidence: "La respuesta de https://example.com/ no incluyó la cabecera Content-Security-Policy.",
    recommendation: "Revisar una CSP acorde a los recursos reales, probarla y confirmar que no interrumpe el uso normal.",
  },
  "security.hsts": {
    title: "Faltó la cabecera Strict-Transport-Security en la respuesta revisada",
    description: "La respuesta de ejemplo no pidió al navegador mantener una conexión segura.",
    explanation: "HSTS pide al navegador usar HTTPS en visitas posteriores al mismo sitio.",
    evidence: "La respuesta de https://example.com/ no incluyó Strict-Transport-Security.",
    recommendation: "Comprobar si HSTS encaja cuando todas las páginas cargan por HTTPS.",
  },
  "privacy.cookies": {
    title: "No se mostró una elección de cookies en la página revisada",
    description: "La página de inicio de ejemplo no mostró un control para elegir cookies.",
    explanation: "Si hay herramientas de medición, el visitante necesita ver qué se carga y elegir cuando hace falta.",
    evidence: "No se encontró un control de elección en https://example.com/. Se vio un script llamado Example Analytics.",
    recommendation: "Mostrar una elección clara antes de cargar mediciones no necesarias, y conservar esa elección.",
  },
  "privacy.policy-detail": {
    title: "La política de privacidad de ejemplo no describe cuánto tiempo se conserva la información",
    description: "El documento público de ejemplo se encontró, pero no se identificó un texto sobre el plazo de conservación.",
    explanation: "La falta de una frase en un documento leído no es una conclusión de que el sitio infringe una ley.",
    evidence: "En https://example.com/privacy no se identificó un texto sobre conservación.",
    recommendation: "Añadir qué información se recoge y durante cuánto tiempo, si esa información se recoge.",
  },
  "a11y.contrast": {
    title: "Contraste bajo en el texto de ejemplo",
    description: "Se midió texto gris claro sobre fondo blanco.",
    explanation: "Un contraste bajo dificulta la lectura. Una medición automática no cubre todos los requisitos de accesibilidad.",
    evidence: "El color #8696a0 sobre blanco en https://example.com/ quedó por debajo de 4,5:1.",
    recommendation: "Oscurecer el texto y volver a medir el contraste.",
  },
  "a11y.name": {
    title: "Un botón de ejemplo no tiene nombre accesible",
    description: "Un botón de icono en la página de ejemplo no tiene texto ni etiqueta.",
    explanation: "Sin nombre, un lector de pantalla no dice qué hace el botón.",
    evidence: "En https://example.com/ se encontró un botón sin texto y sin aria-label.",
    recommendation: "Añadir un nombre visible o una etiqueta, y comprobar el botón con el teclado.",
  },
  "document.terms": {
    title: "No se encontraron las condiciones de uso en las rutas revisadas",
    description: "La búsqueda en las rutas públicas de ejemplo no encontró las condiciones.",
    explanation: "El documento puede estar en otro lugar. La revisión informa solo lo que se pudo abrir.",
    evidence: "https://example.com/terms devolvió una página no encontrada.",
    recommendation: "Publicar las condiciones en una dirección alcanzable desde las páginas del sitio.",
  },
  "privacy.retention": {
    title: "No se decidió un plazo de conservación",
    description: "Las palabras encontradas no bastan para decidir este punto.",
    explanation: "La revisión no se decidió. No significa que el tema falte ni que esté correcto.",
  },
  "a11y.axe": {
    title: "Parte de las pruebas de contraste no se decidió",
    description: "No se guardaron colores de todos los componentes, así que no se pudieron medir todos.",
    explanation: "Una prueba no decidida queda fuera de la puntuación. No se cuenta como superada.",
  },
  "plan.a11y.name": { title: "Dar nombre al botón de ejemplo", change: "Añadir una etiqueta al botón de icono.", verify: "Llegar al botón con el teclado y un lector de pantalla." },
  "plan.security.csp": { title: "Revisar Content-Security-Policy", change: "Definir una política acorde a los recursos y probarla antes de publicarla.", verify: "Cargar la página y confirmar que la cabecera está en la respuesta." },
  "plan.privacy.cookies": { title: "Añadir una elección de cookies", change: "Mostrar una elección antes de cargar Example Analytics.", verify: "Actualizar la página y confirmar que la medición no carga antes de la elección." },
};

const PT: Record<string, Phrase | string | string[]> = {
  docs: ["Política de privacidade", "Termos de uso", "Declaração de acessibilidade"],
  tracker: "Não foi verificado se o componente carrega antes de uma escolha.",
  "security.csp": {
    title: "O cabeçalho Content-Security-Policy faltou na resposta verificada",
    description: "O site de exemplo não devolveu o cabeçalho Content-Security-Policy na página inicial.",
    explanation: "Uma CSP pode ajudar a limitar alguns riscos ao carregar recursos e executar conteúdo.",
    evidence: "A resposta de https://example.com/ não incluiu o cabeçalho Content-Security-Policy.",
    recommendation: "Revisar uma CSP alinhada aos recursos reais, testá-la e confirmar que o uso normal continua.",
  },
  "security.hsts": {
    title: "O cabeçalho Strict-Transport-Security faltou na resposta verificada",
    description: "A resposta de exemplo não pediu ao navegador para manter uma conexão segura.",
    explanation: "O HSTS pede ao navegador para usar HTTPS nas próximas visitas ao mesmo site.",
    evidence: "A resposta de https://example.com/ não incluiu Strict-Transport-Security.",
    recommendation: "Verificar se o HSTS cabe depois que todas as páginas carregam em HTTPS.",
  },
  "privacy.cookies": {
    title: "Nenhuma escolha de cookies apareceu na página verificada",
    description: "A página inicial de exemplo não mostrou um controle para escolher cookies.",
    explanation: "Quando há ferramentas de medição, o visitante precisa ver o que carrega e escolher quando a escolha é necessária.",
    evidence: "Nenhum controle de escolha foi encontrado em https://example.com/. Um script chamado Example Analytics foi visto.",
    recommendation: "Mostrar uma escolha clara antes de carregar medições que não são necessárias, e guardar essa escolha.",
  },
  "privacy.policy-detail": {
    title: "A política de privacidade de exemplo não descreve por quanto tempo a informação fica guardada",
    description: "O documento público de exemplo foi encontrado, mas não havia texto sobre o prazo de guarda.",
    explanation: "A falta de uma frase em um documento lido não é uma conclusão de que o site descumpre uma lei.",
    evidence: "Em https://example.com/privacy não foi identificado texto sobre guarda.",
    recommendation: "Acrescentar quais informações são coletadas e por quanto tempo, se essa coleta existe.",
  },
  "a11y.contrast": {
    title: "Contraste baixo no texto de exemplo",
    description: "Foi medido texto cinza claro sobre fundo branco.",
    explanation: "Contraste baixo dificulta a leitura. Uma medição automática não cobre todos os requisitos de acessibilidade.",
    evidence: "A cor #8696a0 sobre branco em https://example.com/ ficou abaixo de 4,5:1.",
    recommendation: "Escurecer o texto e medir o contraste de novo.",
  },
  "a11y.name": {
    title: "Um botão de exemplo não tem nome acessível",
    description: "Um botão de ícone na página de exemplo não tem texto nem rótulo.",
    explanation: "Sem nome, um leitor de tela não diz o que o botão faz.",
    evidence: "Em https://example.com/ foi encontrado um botão sem texto e sem aria-label.",
    recommendation: "Adicionar um nome visível ou um rótulo, e testar o botão com o teclado.",
  },
  "document.terms": {
    title: "Os termos de uso não foram encontrados nos caminhos verificados",
    description: "A busca nos caminhos públicos de exemplo não encontrou os termos.",
    explanation: "O documento pode estar em outro lugar. A verificação informa só o que foi possível abrir.",
    evidence: "https://example.com/terms devolveu uma página não encontrada.",
    recommendation: "Publicar os termos em um endereço que se alcance a partir das páginas do site.",
  },
  "privacy.retention": {
    title: "Um prazo de guarda não foi decidido",
    description: "As palavras encontradas não bastam para decidir este ponto.",
    explanation: "A verificação não foi decidida. Isso não significa que o tema falte nem que esteja correto.",
  },
  "a11y.axe": {
    title: "Parte dos testes de contraste não foi decidida",
    description: "Não foram salvas cores de todos os componentes, então nem todos puderam ser medidos.",
    explanation: "Um teste não decidido fica fora da nota. Ele não é contado como aprovado.",
  },
  "plan.a11y.name": { title: "Dar nome ao botão de exemplo", change: "Adicionar um rótulo ao botão de ícone.", verify: "Chegar ao botão com o teclado e um leitor de tela." },
  "plan.security.csp": { title: "Revisar Content-Security-Policy", change: "Definir uma política alinhada aos recursos e testá-la antes de publicar.", verify: "Carregar a página e confirmar que o cabeçalho está na resposta." },
  "plan.privacy.cookies": { title: "Adicionar uma escolha de cookies", change: "Mostrar uma escolha antes de carregar o Example Analytics.", verify: "Atualizar a página e confirmar que a medição não carrega antes da escolha." },
};

const AR: Record<string, Phrase | string | string[]> = {
  docs: ["سياسة الخصوصية", "شروط الاستخدام", "بيان الإتاحة"],
  tracker: "لم يُفحص إن كان المكوّن يُحمَّل قبل الاختيار.",
  "security.csp": {
    title: "ترويسة Content-Security-Policy غير موجودة في الاستجابة التي فُحصت",
    description: "موقع المثال لم يُرجع ترويسة Content-Security-Policy في الصفحة الرئيسية.",
    explanation: "يمكن لسياسة CSP أن تساعد في الحد من بعض المخاطر عند تحميل الموارد وتشغيل المحتوى.",
    evidence: "استجابة https://example.com/ لم تتضمّن ترويسة Content-Security-Policy.",
    recommendation: "مراجعة سياسة تناسب الموارد والنصوص التي يحتاجها الموقع، وتجربتها، والتأكد أنها لا تعطل الاستخدام العادي.",
  },
  "security.hsts": {
    title: "ترويسة Strict-Transport-Security غير موجودة في الاستجابة التي فُحصت",
    description: "استجابة المثال لم تطلب من المتصفح البقاء على اتصال آمن.",
    explanation: "ترويسة HSTS تطلب من المتصفح استخدام HTTPS في الزيارات التالية للموقع نفسه.",
    evidence: "استجابة https://example.com/ لم تتضمّن Strict-Transport-Security.",
    recommendation: "فحص إن كان HSTS مناسبًا بعد أن تُحمَّل كل الصفحات عبر HTTPS.",
  },
  "privacy.cookies": {
    title: "لم يُعرض اختيار لملفات تعريف الارتباط في الصفحة التي فُحصت",
    description: "الصفحة الرئيسية للمثال لم تعرض عنصر اختيار لملفات تعريف الارتباط.",
    explanation: "عند وجود أدوات قياس، يحتاج الزائر إلى معرفة ما يُحمَّل وإلى الاختيار عندما يكون الاختيار مطلوبًا.",
    evidence: "لم يُعثر على عنصر اختيار في https://example.com/. ظهر سكربت باسم Example Analytics.",
    recommendation: "عرض اختيار واضح قبل تحميل أدوات القياس غير الضرورية، والاحتفاظ بهذا الاختيار.",
  },
  "privacy.policy-detail": {
    title: "سياسة الخصوصية في المثال لا توضح مدة الاحتفاظ بالمعلومات",
    description: "وُجد المستند العلني في المثال، ولم يُرصد فيه نص عن مدة الاحتفاظ.",
    explanation: "غياب عبارة في مستند قُرئ ليس حكمًا بأن الموقع يخالف قانونًا.",
    evidence: "في https://example.com/privacy لم يُرصد نص عن مدة الاحتفاظ.",
    recommendation: "إضافة شرح لأنواع المعلومات ومدة الاحتفاظ بها، إذا كانت هذه المعلومات تُجمع.",
  },
  "a11y.contrast": {
    title: "تباين منخفض في نص المثال",
    description: "قِيس نص رمادي فاتح على خلفية بيضاء.",
    explanation: "التباين المنخفض يصعّب القراءة. القياس التلقائي لا يغطي كل متطلبات الإتاحة.",
    evidence: "اللون #8696a0 على خلفية بيضاء في https://example.com/ جاء دون نسبة 4.5:1.",
    recommendation: "تغميق لون النص وقياس التباين مرة أخرى.",
  },
  "a11y.name": {
    title: "زر في المثال بلا اسم متاح",
    description: "زر أيقونة في الصفحة الرئيسية للمثال بلا نص وبلا تسمية.",
    explanation: "بلا اسم، لا يسمع مستخدم قارئ الشاشة ما يفعله الزر.",
    evidence: "في https://example.com/ وُجد زر بلا نص وبلا aria-label.",
    recommendation: "إضافة اسم ظاهر أو تسمية، وفحص الزر بواسطة لوحة المفاتيح.",
  },
  "document.terms": {
    title: "شروط الاستخدام لم تُوجد في المسارات التي فُحصت",
    description: "البحث في المسارات العلنية للمثال لم يجد شروط الاستخدام.",
    explanation: "قد يكون المستند في مكان آخر. الفحص يبلّغ فقط عمّا أمكن فتحه.",
    evidence: "العنوان https://example.com/terms أعاد صفحة غير موجودة.",
    recommendation: "نشر الشروط على عنوان يمكن الوصول إليه من صفحات الموقع.",
  },
  "privacy.retention": {
    title: "مدة الاحتفاظ لم تُحسم",
    description: "الكلمات التي وُجدت في المستند لا تكفي لحسم هذه النقطة.",
    explanation: "الفحص لم يُحسم. هذا ليس حكمًا بأن الموضوع ناقص وليس حكمًا بأنه سليم.",
  },
  "a11y.axe": {
    title: "بعض فحوص التباين لم تُحسم",
    description: "لم تُحفظ ألوان كل المكوّنات، لذلك تعذّر قياسها كلها.",
    explanation: "الفحص الذي لم يُحسم يبقى خارج الدرجة. ولا يُحتسب ناجحًا.",
  },
  "plan.a11y.name": { title: "تسمية زر المثال", change: "إضافة تسمية لزر الأيقونة.", verify: "الوصول إلى الزر بلوحة المفاتيح وقارئ الشاشة." },
  "plan.security.csp": { title: "مراجعة Content-Security-Policy", change: "ضبط سياسة تناسب موارد الموقع وتجربتها قبل النشر.", verify: "تحميل الصفحة والتأكد أن الترويسة موجودة في الاستجابة." },
  "plan.privacy.cookies": { title: "إضافة اختيار لملفات تعريف الارتباط", change: "عرض اختيار قبل تحميل Example Analytics.", verify: "تحديث الصفحة والتأكد أن أداة القياس لا تُحمَّل قبل الاختيار." },
};

const MAPS: Record<Exclude<DemoLocale, "he">, Record<string, Phrase | string | string[]>> = { en: EN, es: ES, "pt-BR": PT, ar: AR };

export function localizedDemoPayload(locale: DemoLocale) {
  const payload = JSON.parse(JSON.stringify(DEMO_PAYLOAD));
  const map = locale === "he" ? null : MAPS[locale];
  if (!map) return payload;
  for (const item of payload.report.findings) {
    const phrase = map[item.checkId];
    if (phrase && typeof phrase === "object" && !Array.isArray(phrase)) Object.assign(item, phrase);
  }
  for (const item of payload.report.priorities) {
    const phrase = map[`plan.${item.checkId}`];
    if (phrase && typeof phrase === "object" && !Array.isArray(phrase)) Object.assign(item, phrase);
  }
  const docs = map.docs as string[];
  payload.report.documents = payload.report.documents.map((doc: { title: string }, index: number) => ({ ...doc, title: docs[index] || doc.title }));
  const tracker = map.tracker as string;
  payload.report.trackers = payload.report.trackers.map((tool: { beforeConsent?: string }) => ({ ...tool, beforeConsent: tracker }));
  return payload;
}

export const DEMO_UI: Record<DemoLocale, {
  title: string; banner: string; flag: string; name: string; url: string; start: string; note: string; notice: string;
  results: string; full: string; freeFlag: string; reportFlag: string;
  liveTitle: string; liveChecks: string; liveDocs: string; liveDone: string; now: string; doneOf: string;
  cats: [string, string, string, string]; waiting: string; checking: string; done: string; finished: string;
  pdfTitle: string; pdfMeta: string; pdfFinding: string; pdfSeverity: string; pdfEvidence: string; pdfFix: string; pdfSource: string; pdfCheck: string; pdfFoot: string;
}> = {
  he: {
    title: "הדגמת סריקה | Bizuply",
    banner: "הדגמה עם נתונים להמחשה. לא מתבצעת סריקה ולא נשמר דוח.",
    flag: "הדגמה עם נתונים להמחשה",
    name: "שם מלא", url: "כתובת האתר", start: "התחילו סריקה",
    note: "השם בהדגמה אינו נשמר.",
    notice: "הבדיקה אוטומטית. היא אינה ייעוץ משפטי, חוות דעת או אישור עמידה בחוק.",
    results: "פתחו את הדוח הראשוני", full: "הדגמת הדוח המלא",
    freeFlag: "הדגמה עם נתונים להמחשה. הדוח החינמי אינו מציג את פירוט הממצאים.",
    reportFlag: "הדגמה עם נתונים להמחשה. זה אינו דוח של אתר אמיתי ולא בוצעה רכישה.",
    liveTitle: "אנחנו בודקים את האתר שלך",
    liveChecks: "מריצים בדיקות אבטחה, פרטיות ונגישות",
    liveDocs: "קוראים מסמכים משפטיים",
    liveDone: "הסריקה לדוגמה הסתיימה",
    now: "עכשיו: {name}", doneOf: "הושלמו {done} מתוך {total}",
    cats: ["פרטיות ועוגיות", "אבטחת אתר", "נגישות", "מסמכים ותנאים"],
    waiting: "ממתין", checking: "בבדיקה", done: "הושלם", finished: "הסריקה לדוגמה הסתיימה",
    pdfTitle: "דוח סריקה לדוגמה",
    pdfMeta: "ציון 82/100 · היקף בדיקות שהוכרעו 94% · 28 תקינות · 7 דורשות טיפול · 2 חסרות · 2 לא הוכרעו",
    pdfFinding: "כותרת Content-Security-Policy חסרה בתגובה שנבדקה",
    pdfSeverity: "חומרה: בינונית",
    pdfEvidence: "ראיה: התשובה לא כללה את הכותרת Content-Security-Policy.",
    pdfFix: "המלצה: להגדיר מדיניות שמתאימה למשאבים של האתר ולבדוק אותה לפני פרסום.",
    pdfSource: "מקור: MDN, Content-Security-Policy.",
    pdfCheck: "בדיקה: לטעון את העמוד ולוודא שהכותרת מופיעה בתשובה.",
    pdfFoot: "תצוגה מקדימה של PDF להמחשה. לא נוצר קובץ של סריקה אמיתית.",
  },
  en: {
    title: "Scan demo | Bizuply",
    banner: "Demo with sample data. No scan runs and no report is saved.",
    flag: "Demo with sample data",
    name: "Full name", url: "Website address", start: "Start scan",
    note: "The name in this demo is not saved.",
    notice: "The check is automatic. It is not legal advice, an opinion, or proof of compliance.",
    results: "Open the first report", full: "Show the full sample report",
    freeFlag: "Demo with sample data. The free report does not show finding details.",
    reportFlag: "Demo with sample data. This is not a report of a real site and nothing was purchased.",
    liveTitle: "Checking the site",
    liveChecks: "Running security, privacy and accessibility checks",
    liveDocs: "Reading public documents",
    liveDone: "The sample scan is finished",
    now: "Now: {name}", doneOf: "{done} of {total} complete",
    cats: ["Privacy and cookies", "Site security", "Accessibility", "Documents and terms"],
    waiting: "Waiting", checking: "Checking", done: "Done", finished: "The sample scan is finished",
    pdfTitle: "Sample scan report",
    pdfMeta: "Score 82/100 · 94% of checks decided · 28 passed · 7 need attention · 2 missing · 2 not decided",
    pdfFinding: "Content-Security-Policy header was missing on the checked response",
    pdfSeverity: "Severity: medium",
    pdfEvidence: "Evidence: the response did not include a Content-Security-Policy header.",
    pdfFix: "Recommendation: set a policy that matches the site resources and test it before publishing.",
    pdfSource: "Source: MDN, Content-Security-Policy.",
    pdfCheck: "Check: load the page and confirm the header is in the response.",
    pdfFoot: "Sample PDF preview. No file from a real scan was created.",
  },
  es: {
    title: "Demostración de escaneo | Bizuply",
    banner: "Demostración con datos de ejemplo. No se ejecuta un escaneo y no se guarda un informe.",
    flag: "Demostración con datos de ejemplo",
    name: "Nombre completo", url: "Dirección del sitio", start: "Empezar escaneo",
    note: "El nombre de esta demostración no se guarda.",
    notice: "La revisión es automática. No es asesoría legal, un dictamen ni una prueba de cumplimiento.",
    results: "Abrir el informe inicial", full: "Ver el informe completo de ejemplo",
    freeFlag: "Demostración con datos de ejemplo. El informe gratis no muestra el detalle de los hallazgos.",
    reportFlag: "Demostración con datos de ejemplo. No es un informe de un sitio real y no hubo una compra.",
    liveTitle: "Revisando el sitio",
    liveChecks: "Ejecutando pruebas de seguridad, privacidad y accesibilidad",
    liveDocs: "Leyendo documentos públicos",
    liveDone: "El escaneo de ejemplo terminó",
    now: "Ahora: {name}", doneOf: "{done} de {total} completadas",
    cats: ["Privacidad y cookies", "Seguridad del sitio", "Accesibilidad", "Documentos y condiciones"],
    waiting: "En espera", checking: "En revisión", done: "Listo", finished: "El escaneo de ejemplo terminó",
    pdfTitle: "Informe de escaneo de ejemplo",
    pdfMeta: "Puntuación 82/100 · 94% de pruebas decididas · 28 correctas · 7 por atender · 2 ausentes · 2 sin decidir",
    pdfFinding: "Faltó la cabecera Content-Security-Policy en la respuesta revisada",
    pdfSeverity: "Gravedad: media",
    pdfEvidence: "Prueba: la respuesta no incluyó la cabecera Content-Security-Policy.",
    pdfFix: "Recomendación: definir una política acorde a los recursos del sitio y probarla antes de publicarla.",
    pdfSource: "Fuente: MDN, Content-Security-Policy.",
    pdfCheck: "Comprobación: cargar la página y confirmar que la cabecera está en la respuesta.",
    pdfFoot: "Vista previa de un PDF de ejemplo. No se creó un archivo de un escaneo real.",
  },
  "pt-BR": {
    title: "Demonstração da varredura | Bizuply",
    banner: "Demonstração com dados de exemplo. Nenhuma varredura é executada e nenhum relatório é salvo.",
    flag: "Demonstração com dados de exemplo",
    name: "Nome completo", url: "Endereço do site", start: "Iniciar varredura",
    note: "O nome desta demonstração não é salvo.",
    notice: "A verificação é automática. Não é aconselhamento jurídico, um parecer nem prova de conformidade.",
    results: "Abrir o relatório inicial", full: "Ver o relatório completo de exemplo",
    freeFlag: "Demonstração com dados de exemplo. O relatório grátis não mostra o detalhe dos achados.",
    reportFlag: "Demonstração com dados de exemplo. Não é um relatório de um site real e não houve compra.",
    liveTitle: "Verificando o site",
    liveChecks: "Executando testes de segurança, privacidade e acessibilidade",
    liveDocs: "Lendo documentos públicos",
    liveDone: "A varredura de exemplo terminou",
    now: "Agora: {name}", doneOf: "{done} de {total} concluídas",
    cats: ["Privacidade e cookies", "Segurança do site", "Acessibilidade", "Documentos e termos"],
    waiting: "Aguardando", checking: "Verificando", done: "Concluído", finished: "A varredura de exemplo terminou",
    pdfTitle: "Relatório de varredura de exemplo",
    pdfMeta: "Nota 82/100 · 94% dos testes decididos · 28 corretos · 7 a tratar · 2 ausentes · 2 sem decisão",
    pdfFinding: "O cabeçalho Content-Security-Policy faltou na resposta verificada",
    pdfSeverity: "Gravidade: média",
    pdfEvidence: "Evidência: a resposta não incluiu o cabeçalho Content-Security-Policy.",
    pdfFix: "Recomendação: definir uma política alinhada aos recursos do site e testá-la antes de publicar.",
    pdfSource: "Fonte: MDN, Content-Security-Policy.",
    pdfCheck: "Conferência: carregar a página e confirmar que o cabeçalho está na resposta.",
    pdfFoot: "Prévia de um PDF de exemplo. Nenhum arquivo de uma varredura real foi criado.",
  },
  ar: {
    title: "عرض الفحص | Bizuply",
    banner: "عرض ببيانات للتوضيح. لا يُنفَّذ فحص ولا يُحفظ تقرير.",
    flag: "عرض ببيانات للتوضيح",
    name: "الاسم الكامل", url: "عنوان الموقع", start: "ابدأوا الفحص",
    note: "الاسم في هذا العرض لا يُحفظ.",
    notice: "الفحص تلقائي. ليس استشارة قانونية ولا رأيًا ولا إثبات امتثال.",
    results: "افتحوا التقرير الأولي", full: "عرض التقرير الكامل للعرض",
    freeFlag: "عرض ببيانات للتوضيح. التقرير المجاني لا يعرض تفاصيل النتائج.",
    reportFlag: "عرض ببيانات للتوضيح. هذا ليس تقرير موقع حقيقي ولم تُجرَ عملية شراء.",
    liveTitle: "نفحص الموقع",
    liveChecks: "تشغيل فحوص الأمن والخصوصية والإتاحة",
    liveDocs: "قراءة المستندات العلنية",
    liveDone: "انتهى فحص العرض",
    now: "الآن: {name}", doneOf: "اكتمل {done} من {total}",
    cats: ["الخصوصية وملفات تعريف الارتباط", "أمن الموقع", "الإتاحة", "المستندات والشروط"],
    waiting: "بالانتظار", checking: "قيد الفحص", done: "اكتمل", finished: "انتهى فحص العرض",
    pdfTitle: "تقرير فحص للعرض",
    pdfMeta: "الدرجة 82/100 · حُسم 94% من الفحوص · 28 سليمة · 7 تحتاج معالجة · 2 ناقصة · 2 لم تُحسم",
    pdfFinding: "ترويسة Content-Security-Policy غير موجودة في الاستجابة التي فُحصت",
    pdfSeverity: "الشدة: متوسطة",
    pdfEvidence: "دليل: الاستجابة لم تتضمّن ترويسة Content-Security-Policy.",
    pdfFix: "توصية: ضبط سياسة تناسب موارد الموقع وتجربتها قبل النشر.",
    pdfSource: "مصدر: MDN, Content-Security-Policy.",
    pdfCheck: "تحقق: تحميل الصفحة والتأكد أن الترويسة تظهر في الاستجابة.",
    pdfFoot: "معاينة PDF للتوضيح. لم يُنشأ ملف من فحص حقيقي.",
  },
};
