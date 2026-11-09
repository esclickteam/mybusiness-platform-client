import { useEffect, useState } from "react";
import { SCOPE } from "../../lib/complianceConsentCopy";
import { Link } from "react-router-dom";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";

const TEXT: Record<Locale, Record<string, string>> = {
  he: {
    plans: "שלוש חבילות",
    priceNote: "הרכישה אינה פעילה כרגע ולא מתבצע חיוב. המנוי השנתי מחויב $300 מראש ומתחדש אוטומטית מדי שנה. ביטול החידוש משאיר את הסריקות עד סוף התקופה ששולמה.",
    free: "חינם",
    report: "דוח מלא",
    monitor: "מנוי שנתי",
    once: "חד־פעמי",
    month: "לשנה · $25 לחודש",
    freeLine: "ציון של מה שנבדק, ממצאים חסרים וקטגוריות. בלי ציטוטים, סעיפים או PDF.",
    reportLine: "הדוח שנשמר, כולל מקור, ציטוט, חומרה והמלצה. בלי אישור עמידה בחוק.",
    monitorLine: "12 סריקות, אחת בכל חודש, דוח מלא ו־PDF לכל סריקה. הסריקה שלא נוצלה אינה עוברת לחודש הבא.",
    checked: "ציון הבדיקות שהושלמו",
    coverage: "כיסוי בדיקות",
    lowCoverage: "הכיסוי נמוך. הציון חלקי ואינו מייצג בדיקות שלא הושלמו.",
    missing: "מסמכים חסרים",
    critical: "ממצאים קריטיים בתוכן שנקרא",
    other: "ליקויים נוספים",
    incomplete: "בדיקות שלא הושלמו",
    categories: "קטגוריות", accessibility: "נגישות", security: "אבטחה", privacy: "פרטיות", cookies: "עוגיות",
    when: "תאריך ומדינה",
    locked: "הדוח המלא נשאר בשרת עד אימות עסקה.",
    buy: "רכישת דוח מפורט — $35",
    buyNote: "הרכישה פותחת את פירוט הממצאים, הראיות, הצעות התיקון ותוכנית הפעולה, וגם הורדת PDF. הפירוט עצמו לא מוצג לפני אימות התשלום.",
    okCount: "בדיקות תקינות",
    actionCount: "ממצאים שדורשים טיפול",
    missingCount: "חוסרים",
    unverifiedCount: "לא ניתן לקבוע אוטומטית",
    site: "האתר שנבדק",
    scanStatus: "סטטוס הסריקה",
    sample: "הצגת מבנה הדוח",
    sampleNote: "המחשה של מבנה הדוח. אלה לא ממצאים של האתר שנסרק.",
    law: "חוק או תקן",
    scope: "מדינה ותחולה",
    source: "מקור",
    seen: "מה נמצא",
    gap: "מה חסר",
    severity: "חומרה",
    manual: "לא ניתן לקבוע אוטומטית",
    mentioned: "הנושא אוזכר. זו אינה עמידה בדרישה.",
    not_seen_in_read_text: "הנושא לא הופיע במסמך שנקרא. זו אינה הפרה.",
    document_not_read: "המסמך לא נקרא, ולכן אין ניתוח.",
    not_verifiable: "אי אפשר לאמת את זה בסריקה פומבית.",
    statement_seen: "נראתה הצהרה. הצהרה אינה עמידה בתקן.",
    needs_human: "המקור בקטלוג. התחולה דורשת אדם.",
    not_indicated: "לא נראה אות שמפעיל את הבדיקה.",
    dashboard: "ניטור",
    day: "יום בחודש",
    last: "היום האחרון בחודש",
    email: "דוא״ל להתראות תפעוליות",
    inactive: "אין מנוי פעיל. ניטור לא ירוץ ולא יישלח דיוור שיווקי.",
    capacity: "היום שנבחר הוא העדפה. הביצוע הוא חלון במהלך החודש, בכפוף למכסה, ולא הבטחה לתאריך או לשעה.",
  },
  en: {
    plans: "Three plans",
    priceNote: "Purchase is not open and nothing is charged. The annual plan is $300 paid up front and renews each year. Cancelling renewal keeps the scans until the paid period ends.",
    free: "Free",
    report: "Full report",
    monitor: "Annual plan",
    once: "one time",
    month: "per year · $25 a month",
    freeLine: "A score of what was checked, missing documents and categories. No quotes, sections or PDF.",
    reportLine: "The stored report, with source, quote, severity and a recommendation. No compliance approval.",
    monitorLine: "12 scans, one each month, with a full report and PDF for each scan. An unused scan does not roll into the next month.",
    checked: "Score of completed checks",
    coverage: "Check coverage",
    lowCoverage: "Coverage is low. The score is partial and does not represent unfinished checks.",
    missing: "Missing documents",
    critical: "Critical findings in text that was read",
    other: "Other issues",
    incomplete: "Checks that could not be finished",
    categories: "Categories",
    accessibility: "Accessibility",
    security: "Security",
    privacy: "Privacy",
    cookies: "Cookies",
    when: "Date and country",
    locked: "The full report stays on the server until a payment is verified.",
    buy: "Buy the detailed report — $35",
    buyNote: "The purchase opens the findings, evidence, fixes, action plan, and the PDF. None of that detail is shown before payment is verified.",
    okCount: "Checks that passed",
    actionCount: "Findings that need action",
    missingCount: "Gaps",
    unverifiedCount: "Checks that could not be verified",
    site: "Site checked",
    scanStatus: "Scan status",
    sample: "Show the report structure",
    sampleNote: "An illustration of the report structure. These are not findings for the scanned site.",
    law: "Law or standard",
    scope: "Country and scope",
    source: "Source",
    seen: "What was found",
    gap: "What is missing",
    severity: "Severity",
    manual: "Cannot be decided automatically",
    mentioned: "The topic was mentioned. That is not compliance.",
    not_seen_in_read_text: "The topic did not appear in the text that was read.",
    document_not_read: "The document was not read, so there is no analysis.",
    not_verifiable: "A public scan cannot verify this.",
    statement_seen: "A statement was seen. A statement is not conformity.",
    needs_human: "The source is in the catalog. Applicability needs a person.",
    not_indicated: "No signal triggered this check.",
    dashboard: "Monitoring",
    day: "Day of the month",
    last: "Last day of the month",
    email: "Email for operational alerts",
    inactive: "No active subscription. Monitoring will not run and no marketing mail is sent.",
    capacity: "The chosen day is a preference. The scan runs in a window during the month, subject to capacity, and is not promised for a date or time.",
  },
  es: {
    plans: "Tres planes", priceNote: "La compra no está abierta y no hay cobro. El plan anual son 300 dólares por adelantado y se renueva cada año. Cancelar la renovación mantiene los análisis hasta el final del período pagado.",
    free: "Gratis", report: "Informe completo", monitor: "Plan anual", once: "pago único", month: "al año · 25 al mes",
    freeLine: "Puntuación de lo comprobado, documentos ausentes y categorías. Sin citas, artículos ni PDF.",
    reportLine: "El informe guardado, con fuente, cita, gravedad y recomendación. Sin aprobación legal.",
    monitorLine: "12 análisis, uno cada mes, con informe completo y PDF. Un análisis no usado no pasa al mes siguiente.",
    checked: "Puntuación de lo comprobado", coverage: "Cobertura", lowCoverage: "La cobertura es baja. La puntuación es parcial.", missing: "Documentos ausentes", critical: "Hallazgos críticos en texto leído",
    other: "Otros hallazgos", incomplete: "Comprobaciones incompletas", categories: "Categorías", accessibility: "Accesibilidad", security: "Seguridad", privacy: "Privacidad", cookies: "Cookies", when: "Fecha y país",
    locked: "El informe completo permanece en el servidor hasta verificar un pago.",
    sample: "Ver la estructura", sampleNote: "Ilustración de la estructura. No son hallazgos del sitio analizado.",
    law: "Ley o norma", scope: "País y alcance", source: "Fuente", seen: "Qué apareció", gap: "Qué falta", severity: "Gravedad", manual: "No se puede decidir automáticamente",
    mentioned: "El tema aparece. Eso no es cumplimiento.", not_seen_in_read_text: "El tema no apareció en el texto leído.",
    document_not_read: "El documento no se leyó.", not_verifiable: "Un análisis público no puede verificarlo.",
    statement_seen: "Hay una declaración. Una declaración no es conformidad.", needs_human: "La fuente está en el catálogo. La aplicación requiere una persona.",
    not_indicated: "No hubo una señal para esta comprobación.", dashboard: "Seguimiento", day: "Día del mes", last: "Último día del mes",
    email: "Correo para avisos operativos", inactive: "No hay una suscripción activa. No hay seguimiento ni correo comercial.",
    capacity: "El día elegido es una preferencia. La ejecución es una ventana durante el mes, sujeta a la capacidad, y no promete una fecha ni una hora.",
  },
  "pt-BR": {
    plans: "Três planos", priceNote: "A compra não está aberta e nada é cobrado. O plano anual é de 300 dólares antecipados e renova todo ano. Cancelar a renovação mantém as análises até o fim do período pago.",
    free: "Grátis", report: "Relatório completo", monitor: "Plano anual", once: "pagamento único", month: "por ano · 25 por mês",
    freeLine: "Pontuação do que foi verificado, documentos ausentes e categorias. Sem citações, artigos ou PDF.",
    reportLine: "O relatório salvo, com fonte, citação, gravidade e recomendação. Sem aprovação legal.",
    monitorLine: "12 análises, uma por mês, com relatório completo e PDF. Uma análise não usada não passa para o mês seguinte.",
    checked: "Pontuação do que foi verificado", coverage: "Cobertura", lowCoverage: "A cobertura está baixa. A pontuação é parcial.", missing: "Documentos ausentes", critical: "Achados críticos no texto lido",
    other: "Outros achados", incomplete: "Verificações incompletas", categories: "Categorias", accessibility: "Acessibilidade", security: "Segurança", privacy: "Privacidade", cookies: "Cookies", when: "Data e país",
    locked: "O relatório completo fica no servidor até a verificação de um pagamento.",
    sample: "Ver a estrutura", sampleNote: "Ilustração da estrutura. Não são achados do site analisado.",
    law: "Lei ou norma", scope: "País e alcance", source: "Fonte", seen: "O que apareceu", gap: "O que falta", severity: "Gravidade", manual: "Não é possível decidir automaticamente",
    mentioned: "O tema apareceu. Isso não é conformidade.", not_seen_in_read_text: "O tema não apareceu no texto lido.",
    document_not_read: "O documento não foi lido.", not_verifiable: "Uma análise pública não consegue verificar isto.",
    statement_seen: "Havia uma declaração. Declaração não é conformidade.", needs_human: "A fonte está no catálogo. A aplicação exige uma pessoa.",
    not_indicated: "Nenhum sinal acionou esta verificação.", dashboard: "Monitoramento", day: "Dia do mês", last: "Último dia do mês",
    email: "E-mail para alertas operacionais", inactive: "Não há assinatura ativa. Não há monitoramento nem e-mail comercial.",
    capacity: "O dia escolhido é uma preferência. A execução é uma janela durante o mês, sujeita à capacidade, e não promete data nem hora.",
  },
  ar: {
    plans: "ثلاث باقات", priceNote: "الشراء غير مفتوح الآن ولا يتم أي تحصيل. الاشتراك السنوي 300 دولار مقدمًا ويتجدد كل سنة. إلغاء التجديد يبقي الفحوصات حتى نهاية الفترة المدفوعة.",
    free: "مجاني", report: "تقرير كامل", monitor: "اشتراك سنوي", once: "دفعة واحدة", month: "سنويًا · 25 شهريًا",
    freeLine: "درجة ما تم فحصه، والمستندات الناقصة، والفئات. بلا اقتباسات أو مواد أو PDF.",
    reportLine: "التقرير المحفوظ، مع المصدر والاقتباس والشدة والتوصية. بلا اعتماد امتثال.",
    monitorLine: "12 فحصًا، فحص واحد كل شهر، مع تقرير كامل وPDF. الفحص غير المستخدم لا ينتقل إلى الشهر التالي.",
    checked: "درجة الفحوص المكتملة", coverage: "تغطية الفحص", lowCoverage: "التغطية منخفضة. الدرجة جزئية.", missing: "مستندات ناقصة", critical: "نتائج حرجة في نص تمت قراءته",
    other: "نتائج أخرى", incomplete: "فحوص لم تكتمل", categories: "فئات", accessibility: "إتاحة", security: "أمن", privacy: "خصوصية", cookies: "ملفات تعريف الارتباط", when: "التاريخ والدولة",
    locked: "يبقى التقرير الكامل على الخادم إلى أن يتم التحقق من عملية دفع.",
    sample: "عرض بنية التقرير", sampleNote: "رسم توضيحي للبنية. هذه ليست نتائج الموقع الذي فُحص.",
    law: "القانون أو المعيار", scope: "الدولة والنطاق", source: "المصدر", seen: "ما وُجد", gap: "ما ينقص", severity: "الشدة", manual: "يتعذر الحسم تلقائيًا",
    mentioned: "ذُكر الموضوع. هذا ليس امتثالًا.", not_seen_in_read_text: "لم يظهر الموضوع في النص الذي قُرئ.",
    document_not_read: "لم يُقرأ المستند.", not_verifiable: "لا يمكن التحقق من هذا بفحص علني.",
    statement_seen: "ظهرت تصريح. التصريح ليس مطابقة للمعيار.", needs_human: "المصدر موجود في الفهرس. السريان يحتاج إلى شخص.",
    not_indicated: "لم تظهر إشارة تشغّل هذا الفحص.", dashboard: "المراقبة", day: "يوم من الشهر", last: "آخر يوم في الشهر",
    email: "بريد للتنبيهات التشغيلية", inactive: "لا يوجد اشتراك نشط. لن تعمل المراقبة ولن تُرسل رسائل تسويقية.",
    capacity: "اليوم المختار تفضيل. التنفيذ نافذة خلال الشهر حسب السعة، وليس وعدًا بتاريخ أو ساعة.",
  },
};

const SAMPLE = [
  { law: "Amendment 13, section 11", country: "IL", status: "mentioned", severity: "medium", manual: true },
  { law: "Data Security Regulations", country: "IL", status: "not_verifiable", severity: "info", manual: true },
  { law: "IS 5568 / WCAG 2.0 AA", country: "IL", status: "statement_seen", severity: "medium", manual: true },
];

const PRICE: Record<Locale, {
  heading: string; lede: string; note: string; best: string; yearly: string; once: string; freeCta: string; scanCta: string; dayCta: string;
  free: string[]; report: string[]; quarter: string[]; month: string[];
}> = {
  he: {
    heading: "בחרו את רמת הבדיקה שמתאימה לאתר שלכם",
    lede: "מתחילים בסריקה חינמית, ממשיכים לדוח מפורט או בוחרים מעקב אוטומטי לאורך השנה.",
    note: "המעקב הרבעוני הוא תשלום שנתי אחד של $119, לא $119 בכל רבעון. המעקב החודשי הוא תשלום שנתי אחד של $300. ביטול החידוש משאיר את הסריקות ששולמו. הרכישה אינה פתוחה, ולא רצה סריקת מנוי לפני אימות תשלום.",
    best: "הכי משתלם לסריקה",
    yearly: "חיוב שנתי מראש",
    once: "תשלום חד־פעמי",
    freeCta: "התחילו סריקה בחינם",
    scanCta: "לטופס הסריקה",
    dayCta: "בחרו יום סריקה",
    free: ["סריקה ראשונית", "ציון האתר", "היקף הבדיקות שהוכרעו", "סיכום ממצאים לפי מצב", "בלי פירוט ממצאים והמלצות", "בלי PDF מלא"],
    report: ["סריקה אחת", "דוח מפורט", "ממצאים וראיות", "המלצות תיקון", "סדר עדיפויות", "PDF מלא להורדה", "בלי מנוי ובלי חידוש"],
    quarter: ["ארבע סריקות מלאות בשנה", "סריקה אוטומטית אחת בכל שלושה חודשים", "דוח מפורט ו־PDF בכל סריקה", "אזור אישי והיסטוריית דוחות", "השוואת תוצאות בין סריקות", "חידוש אוטומטי אחת לשנה, ואפשר לבטל אותו"],
    month: ["12 סריקות מלאות בשנה", "סריקה אוטומטית אחת בכל חודש", "דוח מפורט ו־PDF בכל סריקה", "אזור אישי והיסטוריית דוחות", "השוואת תוצאות", "חידוש אוטומטי אחת לשנה, ואפשר לבטל אותו"],
  },
  en: {
    heading: "Choose how closely to check the site",
    lede: "Start with a free scan, continue to a detailed report, or choose automatic checks through the year.",
    note: "Quarterly monitoring is one yearly payment of $119, not $119 each quarter. Monthly monitoring is one yearly payment of $300. Cancelling renewal keeps the scans already paid for. Purchase is not open, and a monitoring scan does not run before payment is verified.",
    best: "Best value per scan",
    yearly: "Billed yearly in advance",
    once: "One-time payment",
    freeCta: "Start a free scan",
    scanCta: "Go to the scan form",
    dayCta: "Choose a scan day",
    free: ["First scan", "Site score", "Share of checks decided", "Finding counts by status", "No finding details or recommendations", "No full PDF"],
    report: ["One scan", "Detailed report", "Findings and evidence", "Fix recommendations", "Priority order", "Full PDF download", "No subscription and no renewal"],
    quarter: ["Four full scans a year", "One automatic scan every three months", "Detailed report and PDF each scan", "Personal area and report history", "Comparison between scans", "Renews once a year, and renewal can be cancelled"],
    month: ["12 full scans a year", "One automatic scan each month", "Detailed report and PDF each scan", "Personal area and report history", "Result comparison", "Renews once a year, and renewal can be cancelled"],
  },
  es: {
    heading: "Elija el nivel de revisión del sitio",
    lede: "Empiece con un escaneo gratis, siga con un informe detallado o elija un seguimiento automático durante el año.",
    note: "El seguimiento trimestral es un pago anual de 119 dólares, no 119 cada trimestre. El mensual es un pago anual de 300 dólares. Cancelar la renovación conserva los escaneos pagados. La compra no está abierta y no hay un escaneo de seguimiento antes de verificar el pago.",
    best: "Mejor valor por escaneo",
    yearly: "Cobro anual por adelantado",
    once: "Pago único",
    freeCta: "Empezar gratis",
    scanCta: "Ir al formulario",
    dayCta: "Elegir el día",
    free: ["Escaneo inicial", "Puntuación", "Alcance decidido", "Conteos por estado", "Sin detalle ni recomendaciones", "Sin PDF completo"],
    report: ["Un escaneo", "Informe detallado", "Hallazgos y pruebas", "Recomendaciones", "Orden de prioridad", "PDF completo", "Sin suscripción ni renovación"],
    quarter: ["Cuatro escaneos al año", "Uno automático cada tres meses", "Informe y PDF en cada uno", "Área personal e historial", "Comparación entre escaneos", "Renovación anual que se puede cancelar"],
    month: ["12 escaneos al año", "Uno automático cada mes", "Informe y PDF en cada uno", "Área personal e historial", "Comparación de resultados", "Renovación anual que se puede cancelar"],
  },
  "pt-BR": {
    heading: "Escolha o nível de verificação do site",
    lede: "Comece com uma varredura grátis, siga para um relatório detalhado ou escolha o acompanhamento automático ao longo do ano.",
    note: "O acompanhamento trimestral é um pagamento anual de 119 dólares, não 119 a cada trimestre. O mensal é um pagamento anual de 300 dólares. Cancelar a renovação mantém as varreduras pagas. A compra não está aberta e nenhuma varredura de acompanhamento começa antes da verificação do pagamento.",
    best: "Melhor valor por varredura",
    yearly: "Cobrança anual antecipada",
    once: "Pagamento único",
    freeCta: "Começar grátis",
    scanCta: "Ir ao formulário",
    dayCta: "Escolher o dia",
    free: ["Varredura inicial", "Pontuação", "Alcance decidido", "Contagens por estado", "Sem detalhes nem recomendações", "Sem PDF completo"],
    report: ["Uma varredura", "Relatório detalhado", "Achados e evidências", "Recomendações", "Ordem de prioridade", "PDF completo", "Sem assinatura e sem renovação"],
    quarter: ["Quatro varreduras por ano", "Uma automática a cada três meses", "Relatório e PDF em cada uma", "Área pessoal e histórico", "Comparação entre varreduras", "Renovação anual que pode ser cancelada"],
    month: ["12 varreduras por ano", "Uma automática por mês", "Relatório e PDF em cada uma", "Área pessoal e histórico", "Comparação de resultados", "Renovação anual que pode ser cancelada"],
  },
  ar: {
    heading: "اختاروا مستوى الفحص المناسب لموقعكم",
    lede: "ابدأوا بفحص مجاني، ثم تقرير مفصل، أو متابعة تلقائية على مدار السنة.",
    note: "المتابعة الربع سنوية دفعة سنوية واحدة قدرها 119 دولارًا، وليست 119 كل ربع. المتابعة الشهرية دفعة سنوية واحدة قدرها 300 دولار. إلغاء التجديد يبقي الفحوصات المدفوعة. الشراء غير مفتوح، ولا يبدأ فحص متابعة قبل التحقق من الدفع.",
    best: "الأوفر لكل فحص",
    yearly: "فاتورة سنوية مقدمًا",
    once: "دفعة واحدة",
    freeCta: "ابدأوا فحصًا مجانيًا",
    scanCta: "إلى نموذج الفحص",
    dayCta: "اختاروا يوم الفحص",
    free: ["فحص أولي", "درجة الموقع", "نطاق ما حُسم", "ملخص النتائج حسب الحالة", "بلا تفاصيل أو توصيات", "بلا PDF كامل"],
    report: ["فحص واحد", "تقرير مفصل", "نتائج وأدلة", "توصيات إصلاح", "ترتيب أولويات", "PDF كامل", "بلا اشتراك وبلا تجديد"],
    quarter: ["أربعة فحوص كاملة في السنة", "فحص تلقائي كل ثلاثة أشهر", "تقرير وPDF في كل فحص", "منطقة شخصية وسجل تقارير", "مقارنة بين الفحوص", "تجديد سنوي يمكن إلغاؤه"],
    month: ["12 فحصًا كاملًا في السنة", "فحص تلقائي كل شهر", "تقرير وPDF في كل فحص", "منطقة شخصية وسجل تقارير", "مقارنة النتائج", "تجديد سنوي يمكن إلغاؤه"],
  },
};

const BLURB: Record<Locale, Record<"free" | "report" | "quarter" | "month", string>> = {
  he: { free: "סריקה ראשונית עם ציון וסיכום ממצאים.", report: "סריקה מלאה אחת, ממצאים, ראיות, המלצות ו־PDF.", quarter: "ארבע סריקות מלאות, אחת בכל שלושה חודשים.", month: "12 סריקות מלאות, אחת בכל חודש." },
  en: { free: "A first scan with a score and a finding summary.", report: "One full scan, with findings, evidence, recommendations and a PDF.", quarter: "Four full scans, one every three months.", month: "12 full scans, one each month." },
  es: { free: "Un escaneo inicial con puntuación y resumen de hallazgos.", report: "Un escaneo completo, con hallazgos, pruebas, recomendaciones y PDF.", quarter: "Cuatro escaneos completos, uno cada tres meses.", month: "12 escaneos completos, uno cada mes." },
  "pt-BR": { free: "Uma varredura inicial com nota e resumo dos achados.", report: "Uma varredura completa, com achados, evidências, recomendações e PDF.", quarter: "Quatro varreduras completas, uma a cada três meses.", month: "12 varreduras completas, uma por mês." },
  ar: { free: "فحص أولي مع درجة وملخص للنتائج.", report: "فحص كامل واحد، مع النتائج والأدلة والتوصيات وPDF.", quarter: "أربعة فحوص كاملة، واحد كل ثلاثة أشهر.", month: "12 فحصًا كاملًا، واحد كل شهر." },
};

export function PriceBoard({ locale, showHeading = true }: { locale: Locale; showHeading?: boolean }) {
  const copy = PRICE[locale] || PRICE.en;
  const blurb = BLURB[locale] || BLURB.en;
  const cards = [
    { key: "free" as const, name: locale === "he" ? "חינם" : locale === "es" ? "Gratis" : locale === "pt-BR" ? "Grátis" : locale === "ar" ? "مجاني" : "Free", price: "$0", unit: "", items: copy.free.slice(0, 4), href: "/compliance", cta: copy.freeCta, featured: false },
    { key: "report" as const, name: locale === "he" ? "חד־פעמי" : locale === "es" ? "Único" : locale === "pt-BR" ? "Avulso" : locale === "ar" ? "لمرة واحدة" : "One-time", price: "$35", unit: copy.once, items: copy.report.slice(0, 4), href: "/compliance", cta: copy.scanCta, featured: false },
    { key: "quarter" as const, name: locale === "he" ? "מעקב רבעוני" : locale === "es" ? "Seguimiento trimestral" : locale === "pt-BR" ? "Acompanhamento trimestral" : locale === "ar" ? "متابعة ربع سنوية" : "Quarterly monitoring", price: "$119", unit: copy.yearly, items: copy.quarter.slice(0, 4), href: "/compliance/account", cta: copy.dayCta, featured: false },
    { key: "month" as const, name: locale === "he" ? "מעקב חודשי" : locale === "es" ? "Seguimiento mensual" : locale === "pt-BR" ? "Acompanhamento mensal" : locale === "ar" ? "متابعة شهرية" : "Monthly monitoring", price: "$300", unit: copy.yearly, items: copy.month.slice(0, 4), href: "/compliance/account", cta: copy.dayCta, featured: true },
  ];
  return (
    <section className="scan-plans" id="scan-prices">
      {showHeading ? <h2>{copy.heading}</h2> : null}
      {showHeading ? <p>{copy.lede}</p> : null}
      <div className="scan-plans__grid scan-prices">
        {cards.map((card) => (
          <article className={card.featured ? "is-featured" : undefined} key={card.key}>
            {card.featured ? <em className="scan-price__badge">{copy.best}</em> : null}
            <b>{card.name}</b>
            <strong>{card.price}</strong>
            {card.unit ? <small>{card.unit}</small> : null}
            <p>{blurb[card.key]}</p>
            <ul>{card.items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
            <Link to={card.href}>{card.cta}</Link>
          </article>
        ))}
      </div>
      <p className="scan-price__note">{copy.note}</p>
    </section>
  );
}

export function PlanCards({ locale }: { locale: Locale }) {
  return <PriceBoard locale={locale} />;
}

const FREE: Record<Locale, Record<string, string>> = {
  he: {
    kicker: "דוח סריקה",
    domain: "דומיין",
    address: "כתובת האתר",
    when: "תאריך הסריקה",
    status: "סטטוס",
    completed: "הושלמה",
    running: "בתהליך",
    queued: "ממתינה",
    failed: "לא הושלמה",
    score: "ציון",
    scoreOf: "מתוך 100",
    scoreHelp: "הציון מבוסס על הבדיקות שהוכרעו. הוא אינו אישור שהאתר עומד בדרישות הדין.",
    coverage: "היקף הבדיקות שהוכרעו",
    coverageHelp: "אחוז הבדיקות שהתקבלה עבורן תוצאה. בדיקות שלא ניתן לקבוע אינן נספרות כתקינות.",
    process: "השלמת תהליך הסריקה",
    lowCoverage: "הכיסוי נמוך. הציון חלקי ואינו מייצג בדיקות שלא הושלמו.",
    ok: "תקין",
    okHelp: "בדיקות שהסתיימו בלי ליקוי מאומת.",
    action: "דורש טיפול",
    actionHelp: "ליקויים עם ראיה מהסריקה. מסמך שלא אותר נספר בכרטיס הנפרד.",
    missing: "חסר",
    missingHelp: "מסמכים פומביים שהחיפוש לא מצא.",
    unverified: "לא ניתן לקבוע אוטומטית",
    unverifiedHelp: "בדיקות שהסתיימו בלי תוצאה מבוססת. הן אינן כשל ואינן מעלות את היקף הבדיקות שהוכרעו.",
    newScan: "סריקה חדשה",
    offer: "הדוח המלא",
    once: "חד־פעמי",
    includes: "מה נפתח אחרי הרכישה",
    inc1: "ליקויים עם ראיה, כתובת עמוד והוראות תיקון",
    inc2: "מקור רשמי כשיש קריטריון או תקן מתאים",
    inc3: "תוכנית עבודה לפי סדר עדיפות, וקובץ PDF",
    offerBody: "הרכישה פותחת את פירוט הממצאים, הראיות, ההמלצות ותוכנית התיקון, וגם קובץ PDF. אף אחד מהפרטים האלה לא מופיע כאן.",
    unavailable: "הסליקה אינה זמינה כרגע. לא מתבצע חיוב, והדוח המלא נשאר סגור.",
    check: "סרקו בחינם וגלו את התוצאה",
  },
  en: {
    kicker: "Scan report",
    domain: "Domain",
    address: "Website address",
    when: "Scan date",
    status: "Status",
    completed: "Completed",
    running: "Running",
    queued: "Queued",
    failed: "Not completed",
    score: "Score",
    scoreOf: "out of 100",
    scoreHelp: "The score uses the checks that were decided. It is not confirmation that the site meets the law.",
    coverage: "Checks that were decided",
    coverageHelp: "The share of checks that received a result. Checks that could not be decided are not counted as passed.",
    process: "Scan process complete",
    lowCoverage: "Coverage is low. The score is partial and does not represent unfinished checks.",
    ok: "Passed",
    okHelp: "Checks that finished without a verified defect.",
    action: "Needs action",
    actionHelp: "Defects with evidence from the scan. A document the search missed is counted separately.",
    missing: "Missing",
    missingHelp: "Public documents the search did not find.",
    unverified: "Could not be decided",
    unverifiedHelp: "Checks that ended without an evidence-based result. They are not failures and do not raise the decided share.",
    newScan: "New scan",
    offer: "Full report",
    once: "One time",
    includes: "What the purchase opens",
    inc1: "Findings with evidence, the page address, and a fix",
    inc2: "An official source when a criterion or standard applies",
    inc3: "A prioritized work plan, and the PDF",
    offerBody: "The purchase opens the findings, evidence, recommendations, action plan, and the PDF. None of that detail is shown here.",
    unavailable: "Checkout is temporarily unavailable. Nothing is charged, and the full report stays closed.",
    check: "Scan for free and see the result",
  },
  es: {
    kicker: "Informe de análisis",
    domain: "Dominio",
    address: "Dirección del sitio",
    when: "Fecha del análisis",
    status: "Estado",
    completed: "Completado",
    running: "En curso",
    queued: "En espera",
    failed: "No completado",
    score: "Puntuación",
    scoreOf: "de 100",
    coverage: "Pruebas decididas",
    scoreHelp: "La puntuación usa las pruebas decididas. No confirma que el sitio cumple la ley.",
    process: "Proceso de análisis completo",
    coverageHelp: "Porcentaje de pruebas con resultado. Las que no se pudieron decidir no cuentan como correctas.",
    lowCoverage: "La cobertura es baja. La puntuación es parcial y no representa las pruebas sin terminar.",
    ok: "Correcto",
    okHelp: "Pruebas que terminaron sin un defecto verificado.",
    action: "Requiere acción",
    actionHelp: "Defectos con evidencia del escaneo. Un documento no hallado se cuenta aparte.",
    missing: "Ausente",
    missingHelp: "Documentos públicos que la búsqueda no encontró.",
    unverified: "No decidido",
    unverifiedHelp: "Pruebas que terminaron sin un resultado basado en pruebas. No son fallos.",
    newScan: "Nuevo análisis",
    offer: "Informe completo",
    once: "Pago único",
    includes: "Qué abre la compra",
    inc1: "Hallazgos con evidencia, la página y la corrección",
    inc2: "Una fuente oficial cuando hay un criterio o norma",
    inc3: "Un plan de trabajo por prioridad, y el PDF",
    offerBody: "La compra abre los hallazgos, las pruebas, las recomendaciones, el plan de acción y el PDF. Ninguno de esos detalles aparece aquí.",
    unavailable: "El cobro no está disponible por ahora. No se realiza ningún cargo y el informe completo sigue cerrado.",
    check: "Escanear gratis y ver el resultado",
  },
  "pt-BR": {
    kicker: "Relatório da análise",
    domain: "Domínio",
    address: "Endereço do site",
    when: "Data da análise",
    status: "Status",
    completed: "Concluída",
    running: "Em andamento",
    queued: "Na fila",
    failed: "Não concluída",
    score: "Pontuação",
    scoreOf: "de 100",
    coverage: "Verificações decididas",
    scoreHelp: "A pontuação usa as verificações decididas. Não confirma que o site cumpre a lei.",
    process: "Processo de varredura concluído",
    coverageHelp: "A parte das verificações com resultado. As que não puderam ser decididas não contam como adequadas.",
    lowCoverage: "A cobertura está baixa. A pontuação é parcial e não representa verificações inacabadas.",
    ok: "Regular",
    okHelp: "Verificações concluídas sem um defeito confirmado.",
    action: "Exige ação",
    actionHelp: "Defeitos com evidência da varredura. Um documento não encontrado é contado à parte.",
    missing: "Ausente",
    missingHelp: "Documentos públicos que a busca não encontrou.",
    unverified: "Não decidido",
    unverifiedHelp: "Verificações que terminaram sem um resultado baseado em evidência. Não são falhas.",
    newScan: "Nova análise",
    offer: "Relatório completo",
    once: "Pagamento único",
    includes: "O que a compra abre",
    inc1: "Achados com evidência, o endereço da página e a correção",
    inc2: "Uma fonte oficial quando há critério ou norma",
    inc3: "Um plano de trabalho por prioridade, e o PDF",
    offerBody: "A compra abre os achados, as evidências, as recomendações, o plano de ação e o PDF. Nenhum desses detalhes aparece aqui.",
    unavailable: "A cobrança está indisponível no momento. Nada é cobrado e o relatório completo continua fechado.",
    check: "Varrer grátis e ver o resultado",
  },
  ar: {
    kicker: "تقرير الفحص",
    domain: "النطاق",
    address: "عنوان الموقع",
    when: "تاريخ الفحص",
    status: "الحالة",
    completed: "اكتمل",
    running: "قيد التنفيذ",
    queued: "بالانتظار",
    failed: "لم يكتمل",
    score: "الدرجة",
    scoreOf: "من 100",
    coverage: "فحوصات تم حسمها",
    scoreHelp: "الدرجة مبنية على الفحوصات التي حُسمت. ليست تأكيدًا أن الموقع يستوفي القانون.",
    process: "اكتمال عملية الفحص",
    coverageHelp: "نسبة الفحوصات التي صدرت لها نتيجة. الفحوصات التي تعذر حسمها لا تُحتسب سليمة.",
    lowCoverage: "التغطية منخفضة. الدرجة جزئية ولا تمثل الفحوصات التي لم تكتمل.",
    ok: "سليم",
    okHelp: "فحوصات انتهت دون خلل مؤكد.",
    action: "يحتاج معالجة",
    actionHelp: "عيوب معها دليل من الفحص. المستند الذي لم يُعثر عليه يُحسب على حدة.",
    missing: "ناقص",
    missingHelp: "مستندات علنية لم يعثر عليها البحث.",
    unverified: "لم يُحسم",
    unverifiedHelp: "فحوصات انتهت بلا نتيجة مبنية على دليل. ليست إخفاقًا.",
    newScan: "فحص جديد",
    offer: "التقرير الكامل",
    once: "مرة واحدة",
    includes: "ما يفتحه الشراء",
    inc1: "نتائج مع دليل، وعنوان الصفحة، وتعليمات الإصلاح",
    inc2: "مصدر رسمي عندما ينطبق معيار أو مواصفة",
    inc3: "خطة عمل حسب الأولوية، وملف PDF",
    offerBody: "يفتح الشراء تفاصيل النتائج والأدلة والتوصيات وخطة الإصلاح وملف PDF. لا تظهر أي من هذه التفاصيل هنا.",
    unavailable: "التحصيل غير متاح حاليًا. لا يتم أي خصم، ويبقى التقرير الكامل مغلقًا.",
    check: "ابدأ مجانًا واطلع على النتيجة",
  },
};

function meter(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

function formatWhen(value: unknown, locale: Locale) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function FreeResult({ locale, summary, status, scanId }: { locale: Locale; summary: any; status?: string; scanId?: string }) {
  const copy = FREE[locale] || FREE.en;
  const [purchaseNote, setPurchaseNote] = useState(copy.unavailable);
  useEffect(() => { setPurchaseNote(copy.unavailable); }, [copy.unavailable]);
  if (!summary) return null;
  const coverage = meter(summary.coverage);
  const statusLabel = copy[status || ""] || status || "—";
  async function checkPurchase() {
    const token = localStorage.getItem("bizuplyComplianceTenant") || "";
    const response = await fetch("/compliance/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantToken: token, plan: "report", scanId }),
    });
    await response.json().catch(() => ({}));
    setPurchaseNote(copy.unavailable);
  }
  return (
    <section className="report-sheet">
      <header className="report-sheet__mast">
        <p className="report-sheet__kicker">{copy.kicker}</p>
        <h1>{summary.host || "—"}</h1>
      </header>
      <dl className="report-sheet__meta">
        <div><dt>{copy.domain}</dt><dd>{summary.host || "—"}</dd></div>
        <div><dt>{copy.address}</dt><dd dir="ltr">{summary.url || "—"}</dd></div>
        <div><dt>{copy.when}</dt><dd>{formatWhen(summary.scannedAt, locale)}</dd></div>
        <div><dt>{copy.status}</dt><dd>{statusLabel}</dd></div>
      </dl>
      <div className="report-sheet__score">
        <div>
          <b>{summary.checkedScore ?? "—"}<small>/100</small></b>
          <span>{copy.score}</span>
        </div>
        <div>
          <b>{summary.process ?? "—"}<small>%</small></b>
          <span>{copy.process || copy.coverage}</span>
        </div>
        <div>
          <b>{summary.coverage ?? "—"}<small>%</small></b>
          <span>{copy.coverage}</span>
          <div className="report-sheet__bar" aria-hidden="true"><span style={{ width: `${coverage}%` }} /></div>
        </div>
      </div>
      <p className="report-sheet__scope">{copy.scoreHelp}</p>
      <p className="report-sheet__scope">{copy.unverified}: {summary.unverified ?? 0}</p>
      <div className="report-sheet__metrics">
        <article><b>{summary.ok ?? 0}</b><span>{copy.ok}</span></article>
        <article><b>{summary.action ?? 0}</b><span>{copy.action}</span></article>
        <article><b>{summary.missing ?? 0}</b><span>{copy.missing}</span></article>
        <article><b>{summary.unverified ?? 0}</b><span>{copy.unverified}</span></article>
      </div>
      <aside className="report-sheet__buy">
        <div>
          <h2>{copy.includes}</h2>
          <ul>
            <li>{copy.inc1}</li>
            <li>{copy.inc2}</li>
            <li>{copy.inc3}</li>
          </ul>
          <p>{copy.offerBody}</p>
        </div>
        <div>
          <p>{copy.offer}</p>
          <strong>$35</strong>
          <em>{copy.once}</em>
          <button type="button" onClick={checkPurchase}>{copy.check}</button>
          <small role="status">{purchaseNote}</small>
        </div>
      </aside>
      <p className="report-sheet__scope">{SCOPE[locale]}</p>
      <p className="report-sheet__foot"><Link to="/compliance">{copy.newScan}</Link></p>
    </section>
  );
}

export function RequirementTable({ locale, rows }: { locale: Locale; rows: any[] }) {
  const copy = TEXT[locale] || TEXT.en;
  const shown = rows.filter((row) => row.url);
  return (
    <div className="scan-requirements">
      {shown.length < rows.length ? <p>{copy.unverifiedSource || copy.manual}</p> : null}
      {shown.map((row) => (
        <article key={row.id || row.law}>
          <h3>{row.law || row.section || row.id}</h3>
          <p>{copy.scope}: {row.country || "—"} {row.section || ""}</p>
          <p>{copy.seen}: {copy[row.status] || row.status}</p>
          <p>{copy.gap}: {row.cannotCheck || copy[row.status]}</p>
          <p>{copy.severity}: {row.severity}</p>
          {row.manual && <p>{copy.manual}</p>}
          {row.url && <p dir="ltr"><a href={row.url}>{copy.source}</a></p>}
        </article>
      ))}
    </div>
  );
}

export function MonitorBoard({ locale }: { locale: Locale }) {
  const copy = TEXT[locale] || TEXT.en;
  return (
    <section className="scan-monitor">
      <h2>{copy.dashboard}</h2>
      <p>{copy.inactive}</p>
    </section>
  );
}

export function commercialLocale(language: string): Locale {
  if (language === "he" || language === "en" || language === "es" || language === "ar" || language === "pt-BR") return language;
  return "en";
}
