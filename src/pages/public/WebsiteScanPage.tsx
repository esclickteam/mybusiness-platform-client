import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePathCore.mjs";
import "./websiteScan.css";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";

const COPY: Record<Locale, Record<string, string>> = {
  he: {
    h1: "מה האתר שלך חושף בלי שתדע?",
    lead: "סריקת אתר חכמה באמצעות AI שמסייעת לזהות בעיות אפשריות בפרטיות, אבטחה, נגישות ומסמכים משפטיים — ומראה מה כדאי לבדוק ולתקן.",
    primary: "סרקו את האתר בחינם",
    secondary: "גלו מה כולל הדוח",
    note: "מתחילים בבדיקה ראשונית ללא תשלום. דוח מפורט עם ראיות והמלצות זמין ברכישה חד־פעמית.",
    whyTitle: "האתר שלך עובד. אבל האם הוא מוגדר נכון?",
    why: "גם אתר שנראה מקצועי עשוי לכלול הגדרות אבטחה חסרות, בעיות נגישות, רכיבי מעקב שלא תועדו או מסמכים שאינם נגישים למבקרים. Bizuply Compliance AI בודקת את מה שניתן לזהות באתר באופן אוטומטי ומרכזת את התוצאות במקום אחד, כדי שתוכל להבין מה נמצא ומה כדאי לשפר.",
    limit: "הבדיקה אינה מזהה כל הפרה משפטית או כל חולשת אבטחה.",
    cat1: "פרטיות ועוגיות", cat1t: "זיהוי רכיבי מדידה, מנגנוני בחירה ומדיניות.",
    cat2: "אבטחת אתר", cat2t: "בדיקת HTTPS וכותרות אבטחה רלוונטיות.",
    cat3: "נגישות", cat3t: "בדיקות אוטומטיות של רכיבים, מבנה וניגודיות כאשר ניתן למדוד.",
    cat4: "מסמכים משפטיים", cat4t: "איתור וניתוח תוכן ציבורי של מדיניות ותנאים.",
    how: "איך זה עובד?",
    s1: "מזינים שם מלא וכתובת אתר.",
    s2: "המערכת סורקת את העמודים והמסמכים שניתן לגשת אליהם.",
    s3: "מקבלים דוח ראשוני חינמי עם ציון וסיכום.",
    s4: "ניתן לרכוש דוח מלא עם פירוט, ראיות והמלצות.",
    auto: "הסריקה אוטומטית. אין בה אימות אנושי.",
    demo: "נתונים להמחשה בלבד",
    demo1: "תהליך הסריקה",
    demo2: "דוח ראשוני חינמי",
    demo3: "דוח מלא",
    score: "ציון", decided: "היקף בדיקות שהוכרעו", ok: "תקינות", action: "דורשות טיפול", missing: "חסרות", open: "לא הוכרעו",
    finding: "כותרת אבטחה חסרה", severity: "חומרה: בינונית", where: "https://example.com/", evidence: "הראיה לדוגמה: התשובה של example.com לא כללה Content-Security-Policy.",
    fix: "המלצה: להוסיף כותרת אבטחה שמתאימה לאתר.", source: "מקור: MDN, Content-Security-Policy.", check: "בדיקה: לטעון את העמוד ולוודא שהכותרת מופיעה בתשובה.",
    compare: "מתחילים בחינם. מקבלים את התמונה המלאה כשצריך.",
    freeTitle: "דוח ראשוני — חינם",
    freeIn: "כתובת ותאריך, ציון, היקף הבדיקות שהוכרעו, ומספר הבדיקות התקינות, הממצאים, הפריטים החסרים והבדיקות שלא הוכרעו.",
    freeOut: "לא כולל שמות ממצאים, ראיות, כתובות עמודים, המלצות או PDF.",
    freeBtn: "התחילו סריקה בחינם",
    paidTitle: "דוח מפורט — $35 חד־פעמי",
    paidIn: "פירוט לפי קטגוריה וחומרה, ראיות ומיקומים, הסברים, המלצות, מקור כשקיים, תוכנית פעולה, בדיקות שלא הוכרעו וקובץ PDF.",
    annualTitle: "מנוי שנתי — $25 לחודש",
    annualPrice: "$300 לשנה",
    annualNote: "מתחדש אוטומטית מדי שנה. ניתן לבטל את החידוש בכל עת. ביטול החידוש משאיר את הסריקות ששולמו עד סוף התקופה.",
    annualIn: "12 סריקות, אחת בכל חודש, דוח מלא ו־PDF לכל סריקה, ואזור אישי עם היסטוריה.",
    buy: "סרקו בחינם וגלו את התוצאה",
    closed: "הרכישה אינה פעילה כרגע. לא מתבצע חיוב.",
    faqTitle: "שאלות ותשובות",
    accountTitle: "האזור האישי",
    accountBody: "אחרי רכישה מאומתת יופיעו כאן המנוי, הדומיין, מועד הסריקה הבאה והדוחות. כרגע אין מנוי פעיל ואין חיוב.",
    renewal: "ביטול חידוש אוטומטי יישאר זמין באזור הזה אחרי שהרכישה תיפתח. ביטול חידוש אינו מפסיק מיד סריקות שכבר שולמו.",
  },
  en: {
    h1: "What does your website reveal without you knowing?",
    lead: "An AI website scan that helps identify possible issues in privacy, security, accessibility and legal documents, and shows what is worth checking and fixing.",
    primary: "Scan the site for free", secondary: "See what the report includes",
    note: "Start with a free first check. A detailed report with evidence and recommendations is a one-time purchase.",
    whyTitle: "Your site works. Is it set up correctly?",
    why: "A professional-looking site can still have missing security settings, accessibility issues, undocumented measurement components or documents visitors cannot reach. Bizuply Compliance AI checks what can be identified automatically and gathers the results in one place.",
    limit: "The check does not find every legal breach or every security weakness.",
    cat1: "Privacy and cookies", cat1t: "Measurement components, choice controls and policies.",
    cat2: "Site security", cat2t: "HTTPS and relevant security headers.",
    cat3: "Accessibility", cat3t: "Automatic checks of components, structure and contrast when it can be measured.",
    cat4: "Legal documents", cat4t: "Finding and reading public policy and terms content.",
    how: "How it works",
    s1: "Enter a full name and a website address.",
    s2: "The system scans the pages and documents it can reach.",
    s3: "You receive a free summary with a score.",
    s4: "You can buy a full report with detail, evidence and recommendations.",
    auto: "The scan is automatic. It does not include human verification.",
    demo: "Illustration only", demo1: "The scan", demo2: "Free summary", demo3: "Full report",
    score: "Score", decided: "Checks decided", ok: "Passed", action: "Need attention", missing: "Missing", open: "Not decided",
    finding: "A security header is missing", severity: "Severity: medium", where: "https://example.com/",
    evidence: "Sample evidence: the response from example.com did not include Content-Security-Policy.",
    fix: "Recommendation: add a security header that fits the site.", source: "Source: MDN, Content-Security-Policy.",
    check: "Check: load the page and confirm the header is on the response.",
    compare: "Start free. Get the full picture when you need it.",
    freeTitle: "First report — free",
    freeIn: "Address and date, score, decided-check scope, and the counts of passed checks, findings, missing items and checks that were not decided.",
    freeOut: "It does not include finding names, evidence, page addresses, recommendations or a PDF.",
    freeBtn: "Start a free scan",
    paidTitle: "Detailed report — $35 once",
    paidIn: "Findings by category and severity, evidence and locations, explanations, recommendations, a source when one exists, an action plan, undecided checks and a PDF.",
    annualTitle: "Annual plan — $25 a month", annualPrice: "$300 a year",
    annualNote: "Renews automatically each year. Renewal can be cancelled at any time. Cancelling renewal keeps the scans already paid for until the period ends.",
    annualIn: "12 scans, one each month, a full report and PDF for each scan, and a personal area with history.",
    buy: "Scan for free and see the result",
    closed: "Purchase is not open. Nothing is charged.",
    faqTitle: "Questions",
    accountTitle: "Your area",
    accountBody: "After a verified purchase this area shows the plan, domain, next scan and reports. There is no active plan and no charge now.",
    renewal: "Cancelling renewal will be available here after purchase opens. Cancelling renewal does not stop scans that were already paid for.",
  },
  es: {
    h1: "¿Qué revela su sitio sin que lo sepa?",
    lead: "Un escaneo con IA que ayuda a detectar posibles problemas de privacidad, seguridad, accesibilidad y documentos, y muestra qué conviene revisar.",
    primary: "Escanear gratis", secondary: "Ver el informe",
    note: "Se empieza con una revisión gratuita. El informe detallado es una compra única.",
    whyTitle: "Su sitio funciona. ¿Está bien configurado?",
    why: "Un sitio profesional puede tener ajustes de seguridad ausentes, problemas de accesibilidad, medición no documentada o documentos que el visitante no puede abrir. La revisión automática reúne lo que se puede identificar.",
    limit: "No detecta cada infracción legal ni cada debilidad de seguridad.",
    cat1: "Privacidad y cookies", cat1t: "Medición, elección y políticas.",
    cat2: "Seguridad", cat2t: "HTTPS y cabeceras relevantes.",
    cat3: "Accesibilidad", cat3t: "Componentes, estructura y contraste cuando se puede medir.",
    cat4: "Documentos", cat4t: "Contenido público de políticas y condiciones.",
    how: "Cómo funciona", s1: "Nombre completo y dirección.", s2: "Se revisan las páginas y documentos accesibles.", s3: "Resumen gratuito con puntuación.", s4: "Se puede comprar el informe completo.",
    auto: "El escaneo es automático. No incluye revisión humana.",
    demo: "Solo ilustración", demo1: "El escaneo", demo2: "Resumen gratuito", demo3: "Informe completo",
    score: "Puntuación", decided: "Pruebas decididas", ok: "Correctas", action: "Requieren atención", missing: "Ausentes", open: "Sin decidir",
    finding: "Falta una cabecera de seguridad", severity: "Gravedad: media", where: "https://example.com/",
    evidence: "Ejemplo: la respuesta de example.com no incluía Content-Security-Policy.",
    fix: "Recomendación: añadir una cabecera adecuada.", source: "Fuente: MDN, Content-Security-Policy.",
    check: "Comprobación: cargar la página y ver la cabecera.",
    compare: "Empiece gratis. El detalle completo, cuando haga falta.",
    freeTitle: "Informe inicial — gratis", freeIn: "Dirección, fecha, puntuación, alcance decidido y recuentos.",
    freeOut: "No incluye nombres, pruebas, direcciones, recomendaciones ni PDF.",
    freeBtn: "Empezar gratis", paidTitle: "Informe detallado — $35", paidIn: "Detalle, pruebas, recomendaciones, fuentes cuando existen, plan y PDF.",
    annualTitle: "Plan anual — $25 al mes", annualPrice: "$300 al año",
    annualNote: "Se renueva automáticamente cada año. La renovación se puede cancelar. Cancelarla mantiene los escaneos ya pagados hasta el fin del periodo.",
    annualIn: "12 escaneos, uno al mes, informe completo y PDF, y un área personal.",
    buy: "Escanear gratis y ver el resultado", closed: "La compra no está abierta. No hay cobro.",
    faqTitle: "Preguntas", accountTitle: "Su área", accountBody: "Tras un pago verificado aparecerán el plan, el dominio y los informes. Ahora no hay plan ni cobro.",
    renewal: "Cancelar la renovación no detiene de inmediato los escaneos ya pagados.",
  },
  "pt-BR": {
    h1: "O que o seu site revela sem você saber?",
    lead: "Uma varredura com IA que ajuda a identificar possíveis problemas de privacidade, segurança, acessibilidade e documentos.",
    primary: "Varrer grátis", secondary: "Ver o relatório",
    note: "Começa com uma verificação gratuita. O relatório detalhado é uma compra única.",
    whyTitle: "O site funciona. Ele está configurado corretamente?",
    why: "Um site profissional pode ter segurança ausente, problemas de acessibilidade, medição não documentada ou documentos que o visitante não abre. A verificação automática reúne o que pode ser identificado.",
    limit: "Não encontra cada infração legal nem cada falha de segurança.",
    cat1: "Privacidade e cookies", cat1t: "Medição, escolha e políticas.",
    cat2: "Segurança", cat2t: "HTTPS e cabeçalhos relevantes.",
    cat3: "Acessibilidade", cat3t: "Componentes, estrutura e contraste quando é possível medir.",
    cat4: "Documentos", cat4t: "Conteúdo público de políticas e termos.",
    how: "Como funciona", s1: "Nome completo e endereço.", s2: "As páginas e documentos acessíveis são lidos.", s3: "Resumo gratuito com pontuação.", s4: "O relatório completo pode ser comprado.",
    auto: "A varredura é automática. Não inclui revisão humana.",
    demo: "Apenas ilustração", demo1: "A varredura", demo2: "Resumo gratuito", demo3: "Relatório completo",
    score: "Pontuação", decided: "Verificações decididas", ok: "Regulares", action: "Exigem atenção", missing: "Ausentes", open: "Não decididas",
    finding: "Falta um cabeçalho de segurança", severity: "Gravidade: média", where: "https://example.com/",
    evidence: "Exemplo: a resposta de example.com não incluía Content-Security-Policy.",
    fix: "Recomendação: adicionar um cabeçalho adequado.", source: "Fonte: MDN, Content-Security-Policy.",
    check: "Conferência: abrir a página e ver o cabeçalho.",
    compare: "Comece grátis. O quadro completo, quando precisar.",
    freeTitle: "Relatório inicial — grátis", freeIn: "Endereço, data, pontuação, escopo decidido e contagens.",
    freeOut: "Não inclui nomes, evidências, endereços, recomendações nem PDF.",
    freeBtn: "Começar grátis", paidTitle: "Relatório detalhado — $35", paidIn: "Detalhe, evidências, recomendações, fontes quando existem, plano e PDF.",
    annualTitle: "Plano anual — $25 por mês", annualPrice: "$300 por ano",
    annualNote: "Renova automaticamente a cada ano. A renovação pode ser cancelada. Cancelá-la mantém as varreduras já pagas até o fim do período.",
    annualIn: "12 varreduras, uma por mês, relatório completo e PDF, e uma área pessoal.",
    buy: "Varrer grátis e ver o resultado", closed: "A compra não está aberta. Não há cobrança.",
    faqTitle: "Perguntas", accountTitle: "Sua área", accountBody: "Depois de um pagamento verificado aparecem o plano, o domínio e os relatórios. Agora não há plano nem cobrança.",
    renewal: "Cancelar a renovação não interrompe de imediato as varreduras já pagas.",
  },
  ar: {
    h1: "ماذا يكشف موقعك من دون أن تعلم؟",
    lead: "فحص بالذكاء الاصطناعي يساعد على ملاحظة مسائل محتملة في الخصوصية والأمان وإتاحة الوصول والمستندات.",
    primary: "ابدأ فحصًا مجانيًا", secondary: "اطلع على التقرير",
    note: "تبدأ بفحص أولي مجاني. التقرير المفصل عملية شراء واحدة.",
    whyTitle: "موقعك يعمل. هل إعداداته صحيحة؟",
    why: "قد يضم موقع يبدو مهنيًا إعدادات أمان ناقصة أو مشاكل إتاحة أو قياسًا غير موثق أو مستندات لا يصل إليها الزائر. يجمع الفحص التلقائي ما يمكن التعرف عليه.",
    limit: "لا يكتشف كل مخالفة قانونية ولا كل ثغرة أمنية.",
    cat1: "الخصوصية وملفات الارتباط", cat1t: "أدوات القياس وخيارات الموافقة والسياسات.",
    cat2: "أمان الموقع", cat2t: "HTTPS وترويسات الأمان ذات الصلة.",
    cat3: "إتاحة الوصول", cat3t: "فحوصات تلقائية للمكونات والبنية والتباين عندما يمكن قياسه.",
    cat4: "المستندات", cat4t: "العثور على المحتوى العلني للسياسات والشروط وقراءته.",
    how: "كيف يعمل؟", s1: "الاسم الكامل وعنوان الموقع.", s2: "يفحص النظام الصفحات والمستندات المتاحة.", s3: "ملخص مجاني مع درجة.", s4: "يمكن شراء التقرير الكامل.",
    auto: "الفحص تلقائي. لا يشمل مراجعة بشرية.",
    demo: "للتوضيح فقط", demo1: "عملية الفحص", demo2: "الملخص المجاني", demo3: "التقرير الكامل",
    score: "الدرجة", decided: "فحوصات تم حسمها", ok: "سليمة", action: "تحتاج معالجة", missing: "ناقصة", open: "لم تُحسم",
    finding: "ترويسة أمان غير موجودة", severity: "الشدة: متوسطة", where: "https://example.com/",
    evidence: "مثال: رد example.com لم يتضمن Content-Security-Policy.",
    fix: "التوصية: إضافة ترويسة أمان تناسب الموقع.", source: "المصدر: MDN، Content-Security-Policy.",
    check: "التحقق: فتح الصفحة والتأكد من ظهور الترويسة.",
    compare: "ابدأ مجانًا. الصورة الكاملة عندما تحتاج إليها.",
    freeTitle: "تقرير أولي — مجانًا", freeIn: "العنوان والتاريخ والدرجة ونطاق الفحوصات التي حُسمت والعدادات.",
    freeOut: "لا يشمل أسماء النتائج ولا الأدلة ولا العناوين ولا التوصيات ولا PDF.",
    freeBtn: "ابدأ فحصًا مجانيًا", paidTitle: "تقرير مفصل — $35", paidIn: "تفصيل وأدلة وتوصيات ومصدر عند وجوده وخطة وPDF.",
    annualTitle: "اشتراك سنوي — $25 شهريًا", annualPrice: "$300 سنويًا",
    annualNote: "يتجدد تلقائيًا كل سنة. يمكن إلغاء التجديد في أي وقت. إلغاء التجديد يبقي الفحوصات المدفوعة حتى نهاية الفترة.",
    annualIn: "12 فحصًا، واحد كل شهر، وتقرير كامل وPDF، ومنطقة شخصية.",
    buy: "ابدأ مجانًا واطلع على النتيجة", closed: "الشراء غير مفتوح. لا يتم أي تحصيل.",
    faqTitle: "أسئلة", accountTitle: "منطقتك", accountBody: "بعد دفع تم التحقق منه تظهر الخطة والنطاق والتقارير. لا توجد الآن خطة ولا تحصيل.",
    renewal: "إلغاء التجديد لا يوقف فورًا الفحوصات التي دُفعت بالفعل.",
  },
};

const FAQ: Record<Locale, Array<[string, string]>> = {
  he: [
    ["האם הסריקה באמת בחינם?", "כן. ניתן לקבל סיכום ראשוני ללא תשלום. הדוח המפורט מוצע ברכישה נפרדת."],
    ["האם צריך להתקין משהו באתר?", "לא. הבדיקה מתבצעת על בסיס מידע ותוכן שהמערכת יכולה לגשת אליהם דרך האתר."],
    ["כמה זמן נמשכת סריקה?", "משך הבדיקה משתנה בהתאם למבנה האתר, לזמינות העמודים ולהיקף הבדיקות."],
    ["האם הסריקה מבטיחה שהאתר עומד בכל החוקים?", "לא. מדובר בבדיקה אוטומטית שמזהה ממצאים ואינדיקציות על בסיס המידע שנבדק, ולא באישור משפטי או בביקורת אבטחה מקיפה."],
    ["מה ההבדל בין הדוח החינמי לדוח המלא?", "הדוח החינמי מציג תמונת מצב כללית. הדוח המלא מפרט את הממצאים, הראיות והפעולות המומלצות."],
    ["האם אפשר להוריד את הדוח?", "קובץ PDF כלול בדוח המלא לאחר רכישה מאומתת או בהרשאת מנהל מורשה."],
    ["האם יש מנוי חודשי?", "לא. המנוי הוא שנתי: $300 מראש, שמוצג גם כ־$25 לחודש. הוא מתחדש אוטומטית בכל שנה, אלא אם מבטלים את החידוש."],
  ],
  en: [
    ["Is the scan really free?", "Yes. The first summary is free. The detailed report is a separate purchase."],
    ["Do I install anything?", "No. The check uses information and content the system can reach through the site."],
    ["How long does a scan take?", "It depends on the site structure, page availability and the checks."],
    ["Does the scan prove the site meets every law?", "No. It is an automatic check of what was read. It is not a legal approval or a full security audit."],
    ["What is the difference?", "The free report is an overview. The full report lists findings, evidence and recommended actions."],
    ["Can I download the report?", "A PDF is included in the full report after a verified purchase, or for an authorized owner."],
    ["Is there a monthly subscription?", "No. The plan is annual: $300 paid up front, also shown as $25 a month. It renews automatically each year unless renewal is cancelled."],
  ],
  es: [
    ["¿El escaneo es gratis?", "Sí. El resumen inicial es gratis. El informe detallado es una compra aparte."],
    ["¿Hay que instalar algo?", "No. La revisión usa lo que el sistema puede abrir en el sitio."],
    ["¿Cuánto tarda?", "Depende de la estructura, de la disponibilidad y de las pruebas."],
    ["¿Garantiza el cumplimiento legal?", "No. Es una revisión automática, no una aprobación legal ni una auditoría de seguridad."],
    ["¿Cuál es la diferencia?", "El informe gratis es una visión general. El completo detalla hallazgos, pruebas y acciones."],
    ["¿Se puede descargar?", "El PDF está en el informe completo tras un pago verificado o para un administrador autorizado."],
    ["¿Hay suscripción mensual?", "No. El plan es anual: 300 dólares por adelantado, mostrado también como 25 al mes. Se renueva cada año salvo cancelación."],
  ],
  "pt-BR": [
    ["A varredura é grátis?", "Sim. O resumo inicial é grátis. O relatório detalhado é uma compra separada."],
    ["Preciso instalar algo?", "Não. A verificação usa o que o sistema consegue abrir no site."],
    ["Quanto tempo leva?", "Depende da estrutura, da disponibilidade e das verificações."],
    ["Garante o cumprimento da lei?", "Não. É uma verificação automática, não uma aprovação jurídica nem uma auditoria de segurança."],
    ["Qual é a diferença?", "O relatório grátis é uma visão geral. O completo detalha achados, evidências e ações."],
    ["Dá para baixar?", "O PDF faz parte do relatório completo após um pagamento verificado ou para um administrador autorizado."],
    ["Existe assinatura mensal?", "Não. O plano é anual: 300 dólares antecipados, também mostrado como 25 por mês. Renova todo ano, salvo cancelamento."],
  ],
  ar: [
    ["هل الفحص مجاني فعلًا؟", "نعم. الملخص الأولي مجاني. التقرير المفصل عملية شراء منفصلة."],
    ["هل يلزم تثبيت شيء؟", "لا. يعتمد الفحص على ما يستطيع النظام الوصول إليه عبر الموقع."],
    ["كم يستغرق الفحص؟", "تتغير المدة حسب بنية الموقع وتوفر الصفحات ونطاق الفحوصات."],
    ["هل يضمن الامتثال لكل القوانين؟", "لا. هذا فحص تلقائي، وليس اعتمادًا قانونيًا ولا تدقيقًا أمنيًا شاملًا."],
    ["ما الفرق؟", "التقرير المجاني صورة عامة. التقرير الكامل يفصّل النتائج والأدلة والإجراءات."],
    ["هل يمكن تنزيل التقرير؟", "ملف PDF مشمول في التقرير الكامل بعد دفع تم التحقق منه أو لمدير مخوّل."],
    ["هل يوجد اشتراك شهري؟", "لا. الخطة سنوية: 300 دولار مقدمًا، وتُعرض أيضًا كـ25 دولارًا شهريًا. تتجدد كل سنة ما لم يُلغَ التجديد."],
  ],
};

function useCopy(locale: string) {
  const key = (["he", "en", "es", "pt-BR", "ar"].includes(locale) ? locale : "en") as Locale;
  return { copy: { ...COPY.en, ...COPY[key] }, faq: FAQ[key] || FAQ.en, locale: key };
}

export function WebsiteScanPage() {
  const { i18n } = useTranslation();
  const { copy, faq, locale: lang } = useCopy(normalizeMarketingLocale(i18n.language));
  const dir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  const canonical = marketingPublicUrl("/website-scan", normalizeMarketingLocale(lang));
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
  };
  return (
    <article className="scan-product" dir={dir} lang={lang}>
      <Helmet>
        <title>{copy.h1} | Bizuply</title>
        <meta name="description" content={copy.lead} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="scan-product__wrap">
        <header className="scan-hero">
          <div>
            <h1>{copy.h1}</h1>
            <p>{copy.lead}</p>
            <div className="scan-product__actions">
              <Link to="/compliance">{copy.primary}</Link>
              <a href="#report">{copy.secondary}</a>
            </div>
            <p className="scan-note">{copy.note}</p>
          </div>
          <Demo copy={copy} />
        </header>
        <section className="scan-section">
          <h2>{copy.whyTitle}</h2>
          <p>{copy.why}</p>
          <div className="scan-grid">
            {[1, 2, 3, 4].map((n) => (
              <article className="scan-card" key={n}><h3>{copy[`cat${n}`]}</h3><p>{copy[`cat${n}t`]}</p></article>
            ))}
          </div>
          <p className="scan-note">{copy.limit}</p>
        </section>
        <section className="scan-section">
          <h2>{copy.how}</h2>
          <div className="scan-steps">
            {[copy.s1, copy.s2, copy.s3, copy.s4].map((step, index) => (
              <article key={step}><b>{index + 1}</b>{step}</article>
            ))}
          </div>
          <p className="scan-note">{copy.auto}</p>
        </section>
        <section className="scan-section" id="report">
          <h2>{copy.compare}</h2>
          <div className="scan-prices">
            <article className="scan-price">
              <h3>{copy.freeTitle}</h3>
              <strong>$0</strong>
              <p>{copy.freeIn}</p>
              <p>{copy.freeOut}</p>
              <Link to="/compliance">{copy.freeBtn}</Link>
            </article>
            <article className="scan-price">
              <h3>{copy.paidTitle}</h3>
              <strong>$35</strong>
              <p>{copy.paidIn}</p>
              <h3>{copy.annualTitle}</h3>
              <strong>{copy.annualPrice}</strong>
              <em>{copy.annualNote}</em>
              <p>{copy.annualIn}</p>
              <Link to="/compliance">{copy.buy}</Link>
              <p className="scan-note">{copy.closed}</p>
            </article>
          </div>
        </section>
        <section className="scan-section scan-faq">
          <h2>{copy.faqTitle}</h2>
          {faq.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </section>
      </div>
    </article>
  );
}

function Demo({ copy }: { copy: Record<string, string> }) {
  return (
    <div className="scan-demo">
      <span className="scan-demo__flag">{copy.demo}</span>
      <div className="scan-demo__screen">
        <h3>example.com</h3>
        <p>{copy.demo1}</p>
        <div className="scan-counts">
          <span>{copy.cat1}</span><span>{copy.cat2}</span><span>{copy.cat3}</span><span>{copy.cat4}</span>
        </div>
      </div>
      <div className="scan-demo__screen">
        <p>{copy.demo2}</p>
        <div className="scan-meters">
          <div><b>82</b>{copy.score}</div>
          <div><b>94%</b>{copy.decided}</div>
          <div><b>28</b>{copy.ok}</div>
        </div>
        <div className="scan-counts">
          <span>7 {copy.action}</span><span>2 {copy.missing}</span><span>2 {copy.open}</span>
        </div>
      </div>
      <div className="scan-demo__screen">
        <p>{copy.demo3}</p>
        <article className="scan-finding">
          <h3>{copy.finding}</h3>
          <p>{copy.severity}</p>
          <p dir="ltr">{copy.where}</p>
          <p>{copy.evidence}</p>
          <p>{copy.fix}</p>
          <p>{copy.source}</p>
          <p>{copy.check}</p>
        </article>
      </div>
    </div>
  );
}

export function ComplianceAccountPage() {
  const { i18n } = useTranslation();
  const { copy, locale: lang } = useCopy(normalizeMarketingLocale(i18n.language));
  const dir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  return (
    <article className="scan-product" dir={dir}>
      <div className="scan-product__wrap scan-account">
        <h1>{copy.accountTitle}</h1>
        <p>{copy.accountBody}</p>
        <p>{copy.renewal}</p>
        <p className="scan-note">{copy.closed}</p>
        <div className="scan-product__actions">
          <Link to="/website-scan">{copy.secondary}</Link>
          <Link to="/compliance">{copy.primary}</Link>
        </div>
      </div>
    </article>
  );
}
