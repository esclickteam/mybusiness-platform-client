import { useState } from "react";
import { Link } from "react-router-dom";
import { CONSENT_UI, SCOPE } from "../../lib/complianceConsentCopy";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";
type Finding = {
  title?: string;
  description?: string;
  explanation?: string;
  evidence?: string;
  evidenceLabel?: string;
  evidenceNote?: string;
  evidenceComplete?: boolean;
  recommendation?: string;
  severity?: string;
  outcome?: string;
  url?: string;
  pageTitle?: string;
  place?: string;
  selector?: string;
  pages?: string[];
  locationVerified?: boolean;
  checkId?: string;
  source?: { name?: string; url?: string } | null;
  obligationLevel?: string;
};

const COPY: Record<Locale, Record<string, string>> = {
  he: {
    newScan: "סריקה חדשה", pdf: "הורדת PDF", site: "האתר שנבדק", address: "כתובת", date: "תאריך", status: "סטטוס",
    score: "ציון הבדיקות", scoreHelp: "הציון מבוסס על הבדיקות שהוכרעו. הוא אינו אישור שהאתר עומד בדרישות הדין.",
    coverage: "היקף הבדיקות שהוכרעו", coverageHelp: "אחוז הבדיקות שהתקבלה עבורן תוצאה, מתוך הבדיקות שאפשר היה להכריע.",
    process: "השלמת תהליך הסריקה", processHelp: "100% כאשר כל בדיקה הגיעה למצב סופי, גם אם חלקן לא הוכרעו.",
    ok: "מה נמצא תקין", todo: "מה דורש טיפול", missing: "מה חסר לפי הראיות", unknown: "מה לא ניתן לבדוק", first: "מה מומלץ לתקן קודם",
    all: "הכול", action: "דורש טיפול", pass: "תקין", unverified: "לא ניתן לאימות", other: "לא רלוונטי",
    checked: "מה נבדק", found: "מה נמצא", why: "למה זה חשוב", fix: "מה מומלץ לעשות", where: "איפה זה נמצא",
    open: "פתחו את העמוד", technical: "פרטים טכניים", quote: "ציטוט מהמקור", more: "הציגו את הציטוט המלא", less: "הציגו פחות",
    severity: "חומרה", certainty: "רמת ודאות", kind: "סוג הממצא", gap: "מה חסר או אינו תקין", law: "מקור", noLaw: "",
    section: "סעיף", noSection: "כותרת הסעיף לא זוהתה", draft: "נוסח מוצע", verify: "איך לוודא שהתיקון בוצע",
    plan: "תוכנית הפעולה לתיקון האתר", unfinished: "בדיקות שלא ניתן היה להשלים", owner: "מסמכים שאינם פתוחים לציבור", tools: "כלי מדידה שזוהו", noTools: "לא זוהה כלי מדידה מוכר בדפים שנקראו. מצבי ההסכמה לא נבדקו.",
    purpose: "המטרה באתר זה לא אומתה", consent: "לפני הסכמה ואחריה: לא נבדק",
    okStatus: "תקין", missingStatus: "חסר", fixStatus: "דורש תיקון", unverifiedStatus: "לא ניתן לאימות", otherStatus: "לא רלוונטי",
    critical: "קריטית", high: "גבוהה", medium: "בינונית", low: "נמוכה", info: "לידיעה",
    highC: "גבוהה", mediumC: "בינונית", lowC: "נמוכה",
    incomplete: "הבדיקה לא הושלמה כי לא נמצא ציטוט שלם.", unknownPlace: "המיקום המדויק לא אומת",
    kindLegal: "דרישה שמופיעה במקור שאומת", kindTechnical: "סיכון טכני", kindAdvice: "המלצה",
    completed: "הושלמה", failed: "לא הושלמה", running: "בתהליך",
    http: "כותרת HTTP", document: "מסמך", form: "טופס", image: "תמונה", page: "תוכן העמוד",
    empty: "אין ממצאים בקבוצה הזו.",
    provenTitle: "ליקויים עם ראיה מהסריקה",
    gapTitle: "חיפושי ניסוח — לא נקבעה הפרה",
    gapNote: "הנושא לא אותר בניסוח שנבדק. זו אינה קביעה שהאתר מפר חוק.",
    missingTitle: "מסמכים שלא אותרו אחרי חיפוש",
    sourceMissing: "",
    technicalNote: "זהו ממצא טכני. אין כאן קביעת הפרה.",
    linkedSource: "מקור מקצועי. הקישור אינו קביעה שהאתר מפר חוק.",
    navAccess: "נגישות", navSecurity: "אבטחה", navPrivacy: "פרטיות", navDocs: "מסמכים", navCookies: "עוגיות וכלי מדידה", navWidgets: "תוספי נגישות", navPlan: "תוכנית פעולה", navOpen: "לא הוכרע",
    blockedTitle: "מסמכים שאינם פתוחים לציבור",
    notFoundTitle: "לא אותר מידע בנושא",
    undecidedTitle: "לא ניתן לקבוע אוטומטית",
    technicalTitle: "בדיקה שלא הושלמה",
    techTitle: "ניתוח טכני והוראות למפתח",
    foundTitle: "מה בדיוק נמצא",
    whyTitle: "למה זה חשוב",
    whereTitle: "היכן נמצא הממצא",
    stepsTitle: "הוראות תיקון",
    exampleTitle: "דוגמת קוד מוצעת",
    verifyTitle: "איך בודקים שהתיקון הצליח",
    limitsTitle: "מגבלות הממצא",
    whoTitle: "מי מתאים לבצע",
    evidenceTitle: "ראיה שנשמרה",
    evidenceOriginal: "ראיה מקורית מהאתר שנבדק",
    internalOffer: "יש באתר אזורים שדורשים התחברות? אפשר להרחיב את הסריקה גם לאזור האישי ולמערכת הפנימית, באמצעות משתמש בדיקה ייעודי. ההרחבה אינה מחליפה את הסריקה הציבורית, והגבייה סגורה.",
    evidenceNote: "הטקסט נשמר כפי שנאסף מהאתר ולא תורגם.",
    pageFromSite: "כותרת העמוד באתר",
    executiveTitle: "סיכום למנהלים",
    siteState: "מה מצב האתר שלך?",
    soundNow: "מה נמצא תקין?",
    needsWork: "מה דורש טיפול?",
    stillCheck: "מה עדיין צריך לבדוק?",
    checksTitle: "בדיקות שבוצעו",
    soundTitle: "תחומים שנבדקו ונמצאו תקינים בבדיקות שבוצעו",
    openTitle: "תחומים שלא ניתן היה לקבוע לגביהם",
    firstTitle: "הפעולות הראשונות",
    actionChapter: "ממצאים שדורשים טיפול",
    verifyChapter: "ממצאים שדורשים אימות",
    passedChapter: "בדיקות שעברו בהצלחה",
    passedNote: "כל שורה היא בדיקה שהכלל שלה התקיים במה שנבדק. אין כאן קביעה שכל האתר תקין.",
    fixQuestion: "מה בדיוק צריך לבדוק או לתקן באתר שלך?",
    certainQuestion: "האם זו בעיה ודאית?",
    observationChapter: "תצפיות שאינן הצלחה",
    observationNote: "אלה דברים שהסריקה ראתה או לא ראתה. היעדר ממצא כאן אינו אומר שהנושא תקין.",
    partialChapter: "בדיקות שלא הושלמו במלואן",
    readChapter: "מסמכים שנפתחו ונקראו",
    passSearch: "חיפוש בבדיקות שעברו",
    passFilter: "תחום",
    techTitleDeveloper: "מידע טכני למפתח",
  },
  en: {
    newScan: "New scan", pdf: "Download PDF", site: "Site checked", address: "Address", date: "Date", status: "Status",
    score: "Check score", scoreHelp: "The score uses the checks that were decided. It is not confirmation that the site meets the law.",
    coverage: "Checks that were decided", coverageHelp: "The share of checks that received a result, out of the checks that could be decided.",
    process: "Scan process complete", processHelp: "100% when every check reached a final state, including checks that were not decided.",
    ok: "What looked sound", todo: "What needs attention", missing: "What the evidence did not show", unknown: "What could not be checked", first: "What to fix first",
    all: "All", action: "Needs attention", pass: "Sound", unverified: "Could not verify", other: "Not applicable",
    checked: "What was checked", found: "What was found", why: "Why it matters", fix: "What to do", where: "Where it is",
    open: "Open the page", technical: "Technical details", quote: "Source quote", more: "Show the full quote", less: "Show less",
    severity: "Severity", certainty: "Certainty", kind: "Type", gap: "What is missing or wrong", law: "Source", noLaw: "",
    section: "Section", noSection: "No section heading was identified", draft: "Suggested wording", verify: "How to confirm the fix",
    plan: "What to fix on the site", unfinished: "Checks that could not be completed", owner: "Documents that are not public", tools: "Measurement tools seen", noTools: "No known measurement tool was seen. Consent states were not checked.",
    purpose: "The purpose on this site was not verified", consent: "Before and after consent: not checked",
    okStatus: "Sound", missingStatus: "Missing", fixStatus: "Needs a fix", unverifiedStatus: "Could not verify", otherStatus: "Not applicable",
    critical: "Critical", high: "High", medium: "Medium", low: "Low", info: "Note",
    highC: "High", mediumC: "Medium", lowC: "Low",
    incomplete: "The check was not finished because a complete quote was not found.", unknownPlace: "The exact location was not verified",
    kindLegal: "A requirement from a verified source", kindTechnical: "Technical risk", kindAdvice: "Recommendation",
    completed: "Completed", failed: "Not completed", running: "Running",
    http: "HTTP header", document: "Document", form: "Form", image: "Image", page: "Page content",
    empty: "No findings in this group.",
    provenTitle: "Findings with evidence from the scan",
    gapTitle: "Wording searches — not a legal finding",
    gapNote: "The topic was not found in the wording that was checked. This is not a finding that the site breaks the law.",
    missingTitle: "Documents the search did not find",
    sourceMissing: "",
    technicalNote: "This is a technical finding. It is not a legal breach.",
    linkedSource: "Professional source. The link is not a finding that the site breaks the law.",
    navAccess: "Accessibility", navSecurity: "Security", navPrivacy: "Privacy", navDocs: "Documents", navCookies: "Cookies and measurement", navWidgets: "Accessibility widgets", navPlan: "Action plan", navOpen: "Not decided",
    blockedTitle: "Documents that are not public",
    notFoundTitle: "No information found on this topic",
    undecidedTitle: "Could not be decided automatically",
    technicalTitle: "Check that did not finish",
    techTitle: "Technical analysis and developer instructions",
    foundTitle: "What was found",
    whyTitle: "Why it matters",
    whereTitle: "Where it was found",
    stepsTitle: "How to fix it",
    exampleTitle: "Proposed code example",
    verifyTitle: "How to confirm the fix",
    limitsTitle: "Limits of this finding",
    whoTitle: "Who should do it",
    evidenceTitle: "Stored evidence",
    evidenceOriginal: "Original evidence from the scanned website",
    internalOffer: "Does the site have areas that require sign-in? The scan can be extended to a personal area and an internal system with a dedicated test user. The extension does not replace the public scan, and billing is closed.",
    evidenceNote: "This text is kept exactly as it was collected and was not translated.",
    pageFromSite: "Page title on the website",
    executiveTitle: "Executive summary",
    siteState: "What is the state of your site?",
    soundNow: "What was sound?",
    needsWork: "What needs action?",
    stillCheck: "What still needs a look?",
    checksTitle: "Checks performed",
    soundTitle: "Areas checked with no defect in the tests that ran",
    openTitle: "Areas that could not be decided",
    firstTitle: "First actions",
    actionChapter: "Findings that need action",
    verifyChapter: "Findings that need verification",
    passedChapter: "Checks that passed",
    passedNote: "Each row is a check whose rule succeeded for what was checked. A pass does not cover the whole site.",
    fixQuestion: "What exactly should be checked or fixed on your site?",
    certainQuestion: "Is this a confirmed problem?",
    observationChapter: "Observations that are not a success",
    observationNote: "These are things the scan saw or did not see. Not finding a problem here does not mean the topic is sound.",
    partialChapter: "Checks that were not completed in full",
    readChapter: "Documents that were opened and read",
    passSearch: "Search passed checks",
    passFilter: "Area",
    techTitleDeveloper: "Technical information for the developer",
  },
  es: {
    newScan: "Nuevo análisis", pdf: "Descargar PDF", site: "Sitio revisado", address: "Dirección", date: "Fecha", status: "Estado",
    critical: "Crítica", high: "Alta", medium: "Media", low: "Baja", info: "Información",
    score: "Puntuación de las pruebas", scoreHelp: "La puntuación usa las pruebas completadas. Las que no se pudieron completar no son fallos, pero limitan el alcance.",
    coverage: "Pruebas decididas", coverageHelp: "Porcentaje de pruebas con resultado, entre las que se podían decidir.",
    process: "Proceso de análisis completo", processHelp: "100% cuando cada prueba llegó a un estado final, aunque algunas no se decidieron.",
    ok: "Lo que se vio correcto", todo: "Lo que requiere atención", missing: "Lo que las pruebas no mostraron", unknown: "Lo que no se pudo comprobar", first: "Qué corregir primero",
    all: "Todo", action: "Requiere atención", pass: "Correcto", unverified: "No verificable", other: "No aplica",
    checked: "Qué se revisó", found: "Qué se encontró", why: "Por qué importa", fix: "Qué hacer", where: "Dónde está",
    open: "Abrir la página", technical: "Detalles técnicos", quote: "Cita de la fuente", more: "Ver la cita completa", less: "Ver menos",
    incomplete: "La prueba no terminó porque no hubo una cita completa.", unknownPlace: "La ubicación exacta no se verificó",
    owner: "Comprobaciones que requieren datos del titular del sitio", unfinished: "Comprobaciones que no se pudieron completar",
    kindLegal: "Requisito de una fuente verificada", kindTechnical: "Riesgo técnico", kindAdvice: "Recomendación",
    completed: "Completado", failed: "No completado", running: "En curso",
    http: "Cabecera HTTP", document: "Documento", form: "Formulario", image: "Imagen", page: "Contenido",
    empty: "No hay hallazgos en este grupo.",
    blockedTitle: "Documentos que no son públicos", notFoundTitle: "No se encontró información sobre el tema", undecidedTitle: "No se pudo decidir automáticamente", technicalTitle: "Comprobación que no terminó",
    techTitle: "Análisis técnico e instrucciones para quien desarrolla",
    foundTitle: "Qué se encontró exactamente", whyTitle: "Por qué importa", whereTitle: "Dónde se encontró",
    stepsTitle: "Cómo corregirlo", exampleTitle: "Ejemplo de código propuesto", verifyTitle: "Cómo comprobar que la corrección funcionó",
    limitsTitle: "Límites del hallazgo", whoTitle: "Quién conviene que lo haga", evidenceTitle: "Evidencia guardada",
    evidenceOriginal: "Evidencia original del sitio analizado",
    internalOffer: "¿El sitio tiene zonas que exigen iniciar sesión? El análisis puede ampliarse al área personal y al sistema interno con un usuario de prueba. La ampliación no sustituye el análisis público, y el cobro está cerrado.",
    evidenceNote: "El texto se guarda tal como se recogió y no se tradujo.",
    pageFromSite: "Título de la página en el sitio",
    executiveTitle: "Resumen para la dirección",
    siteState: "¿Cuál es el estado de su sitio?",
    soundNow: "¿Qué resultó correcto?",
    needsWork: "¿Qué requiere acción?",
    stillCheck: "¿Qué todavía hay que revisar?",
    checksTitle: "Pruebas realizadas",
    soundTitle: "Áreas revisadas sin defecto en las pruebas realizadas", openTitle: "Áreas que no se pudieron decidir", firstTitle: "Primeras acciones",
    actionChapter: "Hallazgos que requieren acción",
    verifyChapter: "Hallazgos que requieren verificación",
    passedChapter: "Pruebas que salieron bien",
    passedNote: "Cada fila es una prueba cuya regla se cumplió en lo revisado. No cubre todo el sitio.",
    fixQuestion: "¿Qué hay que revisar o corregir exactamente en su sitio?",
    certainQuestion: "¿Es un problema confirmado?",
    observationChapter: "Observaciones que no son un éxito",
    observationNote: "Son cosas que el análisis vio o no vio. No encontrar un problema aquí no significa que el tema esté correcto.",
    partialChapter: "Pruebas que no se completaron del todo",
    readChapter: "Documentos que se abrieron y se leyeron",
    passSearch: "Buscar pruebas correctas",
    passFilter: "Área",
    techTitleDeveloper: "Información técnica para quien desarrolla",
  },
  "pt-BR": {
    newScan: "Nova varredura", pdf: "Baixar PDF", site: "Site verificado", address: "Endereço", date: "Data", status: "Status",
    critical: "Crítica", high: "Alta", medium: "Média", low: "Baixa", info: "Informação",
    score: "Pontuação das verificações", scoreHelp: "A pontuação usa as verificações concluídas. As que não puderam ser concluídas não são falhas, mas limitam o escopo.",
    coverage: "Verificações decididas", coverageHelp: "A parte das verificações com resultado, entre as que podiam ser decididas.",
    process: "Processo de varredura concluído", processHelp: "100% quando cada verificação chegou a um estado final, mesmo que algumas não tenham sido decididas.",
    ok: "O que pareceu adequado", todo: "O que precisa de atenção", missing: "O que as evidências não mostraram", unknown: "O que não foi possível verificar", first: "O que corrigir primeiro",
    all: "Tudo", action: "Precisa de atenção", pass: "Adequado", unverified: "Não verificável", other: "Não se aplica",
    checked: "O que foi verificado", found: "O que foi encontrado", why: "Por que importa", fix: "O que fazer", where: "Onde está",
    open: "Abrir a página", technical: "Detalhes técnicos", quote: "Citação da fonte", more: "Mostrar a citação completa", less: "Mostrar menos",
    incomplete: "A verificação não terminou porque não havia uma citação completa.", unknownPlace: "O local exato não foi verificado",
    owner: "Verificações que exigem informação do dono do site", unfinished: "Verificações que não puderam ser concluídas",
    kindLegal: "Exigência de uma fonte verificada", kindTechnical: "Risco técnico", kindAdvice: "Recomendação",
    completed: "Concluída", failed: "Não concluída", running: "Em andamento",
    http: "Cabeçalho HTTP", document: "Documento", form: "Formulário", image: "Imagem", page: "Conteúdo",
    empty: "Não há achados neste grupo.",
    blockedTitle: "Documentos que não são públicos", notFoundTitle: "Não foi encontrada informação sobre o tema", undecidedTitle: "Não foi possível decidir automaticamente", technicalTitle: "Verificação que não terminou",
    techTitle: "Análise técnica e instruções para quem desenvolve",
    foundTitle: "O que foi encontrado", whyTitle: "Por que importa", whereTitle: "Onde foi encontrado",
    stepsTitle: "Como corrigir", exampleTitle: "Exemplo de código proposto", verifyTitle: "Como confirmar que a correção funcionou",
    limitsTitle: "Limites do achado", whoTitle: "Quem deve fazer", evidenceTitle: "Evidência salva",
    evidenceOriginal: "Evidência original do site analisado",
    internalOffer: "O site tem áreas que exigem login? A varredura pode ser ampliada à área pessoal e ao sistema interno com um usuário de teste. A ampliação não substitui a varredura pública, e a cobrança está fechada.",
    evidenceNote: "O texto fica como foi coletado e não foi traduzido.",
    pageFromSite: "Título da página no site",
    executiveTitle: "Resumo para a gestão",
    siteState: "Qual é o estado do seu site?",
    soundNow: "O que estava adequado?",
    needsWork: "O que exige ação?",
    stillCheck: "O que ainda precisa ser revisado?",
    checksTitle: "Verificações feitas",
    soundTitle: "Áreas verificadas sem defeito nos testes executados", openTitle: "Áreas que não puderam ser decididas", firstTitle: "Primeiras ações",
    actionChapter: "Achados que exigem ação",
    verifyChapter: "Achados que exigem verificação",
    passedChapter: "Verificações que passaram",
    passedNote: "Cada linha é uma verificação cuja regra se cumpriu no que foi verificado. Não cobre o site inteiro.",
    fixQuestion: "O que exatamente precisa ser verificado ou corrigido no seu site?",
    certainQuestion: "Este problema está confirmado?",
    observationChapter: "Observações que não são um sucesso",
    observationNote: "São coisas que a varredura viu ou não viu. Não achar um problema aqui não significa que o assunto esteja adequado.",
    partialChapter: "Verificações que não foram concluídas por completo",
    readChapter: "Documentos que foram abertos e lidos",
    passSearch: "Buscar verificações aprovadas",
    passFilter: "Área",
    techTitleDeveloper: "Informação técnica para quem desenvolve",
  },
  ar: {
    newScan: "فحص جديد", pdf: "تنزيل PDF", site: "الموقع الذي فُحص", address: "العنوان", date: "التاريخ", status: "الحالة",
    critical: "حرجة", high: "عالية", medium: "متوسطة", low: "منخفضة", info: "معلومة",
    score: "درجة الفحوصات", scoreHelp: "الدرجة مبنية على الفحوصات المكتملة. الفحوصات التي تعذر إكمالها ليست إخفاقًا، لكنها تحد من النطاق.",
    coverage: "فحوصات تم حسمها", coverageHelp: "نسبة الفحوصات التي صدرت لها نتيجة، من الفحوصات التي أمكن حسمها.",
    process: "اكتمال عملية الفحص", processHelp: "100% عندما وصل كل فحص إلى حالة نهائية، حتى إذا لم يُحسم بعضها.",
    ok: "ما بدا سليمًا", todo: "ما يحتاج معالجة", missing: "ما لم تظهره الأدلة", unknown: "ما تعذر فحصه", first: "ما يُفضَّل إصلاحه أولًا",
    all: "الكل", action: "يحتاج معالجة", pass: "سليم", unverified: "غير قابل للتحقق", other: "غير منطبق",
    checked: "ما تم فحصه", found: "ما وُجد", why: "لماذا هذا مهم", fix: "ماذا يُنصح بفعله", where: "أين وُجد",
    open: "افتحوا الصفحة", technical: "تفاصيل تقنية", quote: "اقتباس من المصدر", more: "اعرضوا الاقتباس كاملًا", less: "اعرضوا أقل",
    incomplete: "لم يكتمل الفحص لأنه لم يُعثر على اقتباس كامل.", unknownPlace: "لم يُتحقق من الموقع الدقيق",
    owner: "فحوصات تتطلب معلومات من صاحب الموقع", unfinished: "فحوصات تعذر إكمالها",
    kindLegal: "متطلب من مصدر تم التحقق منه", kindTechnical: "خطر تقني", kindAdvice: "توصية",
    completed: "اكتمل", failed: "لم يكتمل", running: "قيد التنفيذ",
    http: "ترويسة HTTP", document: "مستند", form: "نموذج", image: "صورة", page: "محتوى الصفحة",
    empty: "لا توجد نتائج في هذه المجموعة.",
    blockedTitle: "مستندات غير متاحة للعموم", notFoundTitle: "لم يُعثر على معلومات في هذا الموضوع", undecidedTitle: "تعذر الحسم تلقائيًا", technicalTitle: "فحص لم يكتمل",
    techTitle: "تحليل تقني وتعليمات للمطوّر",
    foundTitle: "ما الذي وُجد تحديدًا", whyTitle: "لماذا هذا مهم", whereTitle: "أين وُجدت النتيجة",
    stepsTitle: "تعليمات الإصلاح", exampleTitle: "مثال شيفرة مقترح", verifyTitle: "كيف يُفحص نجاح الإصلاح",
    limitsTitle: "حدود النتيجة", whoTitle: "من الأنسب أن ينفّذ", evidenceTitle: "دليل محفوظ",
    evidenceOriginal: "دليل أصلي من الموقع الذي فُحص",
    internalOffer: "هل في الموقع مناطق تتطلب تسجيل الدخول؟ يمكن توسيع الفحص إلى المنطقة الشخصية والنظام الداخلي بمستخدم اختبار. التوسعة لا تستبدل الفحص العام، والتحصيل مغلق.",
    evidenceNote: "يبقى النص كما جُمع من الموقع ولم يُترجَم.",
    pageFromSite: "عنوان الصفحة في الموقع",
    executiveTitle: "ملخص للإدارة",
    siteState: "ما حالة موقعكم؟",
    soundNow: "ما الذي كان سليمًا؟",
    needsWork: "ما الذي يتطلب معالجة؟",
    stillCheck: "ما الذي ما زال يحتاج مراجعة؟",
    checksTitle: "فحوصات نُفذت",
    soundTitle: "مجالات فُحصت ولم يظهر فيها خلل في الاختبارات المنفذة", openTitle: "مجالات تعذر حسمها", firstTitle: "الإجراءات الأولى",
    actionChapter: "نتائج تتطلب معالجة",
    verifyChapter: "نتائج تتطلب تحققًا",
    passedChapter: "فحوصات نجحت",
    passedNote: "كل سطر فحص تحققت قاعدته فيما فُحص. لا يغطي الموقع كله.",
    fixQuestion: "ما الذي يجب فحصه أو إصلاحه تحديدًا في موقعكم؟",
    certainQuestion: "هل هذه مشكلة مؤكدة؟",
    observationChapter: "ملاحظات ليست نجاحًا",
    observationNote: "هذه أشياء رآها الفحص أو لم يرها. عدم العثور على مشكلة هنا لا يعني أن الموضوع سليم.",
    partialChapter: "فحوصات لم تكتمل",
    readChapter: "مستندات فُتحت وقُرئت",
    passSearch: "بحث في الفحوصات الناجحة",
    passFilter: "المجال",
    techTitleDeveloper: "معلومات تقنية للمطوّر",
  },
};

function hostName(url?: string) {
  try { return new URL(String(url || "")).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function detailOf(item: Finding, copy: Record<string, string>) {
  const server = (item as Finding & { detail?: Record<string, unknown> }).detail;
  if (server) return server as Record<string, unknown>;
  const status = item.outcome === "pass" ? "ok" : item.outcome === "incomplete" || item.outcome === "uncertain" ? "unverified" : item.outcome === "finding" ? "fix" : "other";
  return {
    status,
    certainty: item.confidence || "medium",
    found: item.description || "",
    gap: status === "ok" ? "" : (item.description || ""),
    why: item.explanation || item.description || "",
    change: item.recommendation || "",
    proposedText: "",
    verify: item.url ? copy.verify : copy.unknownPlace,
    lawName: item.source?.name || "",
    lawUrl: item.source?.url || "",
    sectionVerified: false,
    needsLegalReview: false,
  };
}

function statusLabel(status: string, copy: Record<string, string>) {
  if (status === "ok") return copy.okStatus;
  if (status === "missing") return copy.missingStatus;
  if (status === "fix") return copy.fixStatus;
  if (status === "unverified") return copy.unverifiedStatus;
  return copy.otherStatus;
}

function kindOf(item: Finding, copy: Record<string, string>) {
  if (String(item.checkId || "").startsWith("security.")) return copy.kindTechnical;
  if (item.obligationLevel === "possible_legal" && item.source?.url) return copy.kindLegal;
  return copy.kindAdvice;
}

const WCAG_URLS: Record<string, string> = {
  "1.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  "1.3.1": "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  "1.4.3": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  "2.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  "3.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
  "3.3.2": "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
};

function formatWhen(value: unknown, locale: Locale) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function officialSource(name: unknown, url: unknown) {
  const stored = String(url || "");
  if (stored) return stored;
  const match = String(name || "").match(/(\d+\.\d+\.\d+)/);
  return match ? WCAG_URLS[match[1]] || "" : "";
}

function bandOf(item: Finding) {
  if (item.outcome === "owner") return "owner";
  if (item.outcome === "gap") return "gap";
  if (item.outcome === "incomplete" || item.outcome === "uncertain") return "unverified";
  if (item.outcome === "pass") return "pass";
  const evidence = String(item.evidence || "");
  if (/לא נמצא ניסוח שמזוהה/.test(evidence)) return "gap";
  if (/החיפוש אחרי/.test(evidence) || /לא אותר/.test(String(item.title || ""))) return "missing";
  if (item.outcome === "finding") return "proven";
  return "unverified";
}

const VIEW_LANGUAGES: { id: Locale; label: string }[] = [
  { id: "he", label: "עברית" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "pt-BR", label: "Português" },
  { id: "ar", label: "العربية" },
];

export function ComplianceReportView({
  locale,
  payload,
  onPdf,
  onLocale,
  audience = "customer",
}: {
  locale: Locale;
  payload: any;
  onLocale?: (locale: Locale) => void;
  onPdf: () => void;
  audience?: "customer" | "admin";
}) {
  const copy = { ...COPY.en, ...(COPY[locale] || {}) };
  const report = payload?.report || {};
  const findings: Finding[] = report.findings || [];
  const [passQuery, setPassQuery] = useState("");
  const [passDomain, setPassDomain] = useState("all");
  const unfinished = findings.filter((item) => ["unverified", "gap", "owner"].includes(bandOf(item)));
  const counts = {
    pass: findings.filter((item) => bandOf(item) === "pass").length,
    action: findings.filter((item) => bandOf(item) === "proven").length,
    unknown: unfinished.length,
  };
  const actions = (report.priorities || []).slice(0, 12);
  const status = payload?.status === "completed" ? copy.completed : payload?.status === "failed" ? copy.failed : copy.running;
  const groupOf = (item: Finding) => {
    const stored = (item as Finding & { brief?: { domain?: string } }).brief?.domain;
    if (stored) return stored;
    const id = String(item.checkId || "");
    if (id === "a11y.widget") return "widgets";
    if (id.startsWith("a11y") || id.startsWith("accessibility")) return "access";
    if (id.startsWith("security")) return "security";
    if (id === "privacy.cookies" || id === "privacy.trackers" || id === "privacy.consent_behavior" || id === "document.cookies") return "cookies";
    if (id.startsWith("document") || bandOf(item) === "missing") return "docs";
    if (id.startsWith("privacy.") || id.startsWith("behavior.")) return "privacy";
    return "other";
  };
  const sections = [
    ["access", copy.navAccess],
    ["security", copy.navSecurity],
    ["privacy", copy.navPrivacy],
    ["docs", copy.navDocs],
    ["cookies", copy.navCookies || "Cookies"],
    ["widgets", copy.navWidgets || "Widgets"],
  ] as const;
  const statusOf = (item: Finding & { brief?: { status?: string } }) => item.brief?.status
    || (item.outcome === "pass" ? "pass" : item.outcome === "finding" ? (item.confidence === "high" ? "action" : "verify") : item.outcome === "gap" ? "missing" : item.outcome === "owner" ? "unread" : "open");
  const statusCounts = report.executive?.statusCounts || {
    pass: findings.filter((item) => statusOf(item) === "pass").length,
    action: findings.filter((item) => statusOf(item) === "action").length,
    verify: findings.filter((item) => statusOf(item) === "verify").length,
    open: findings.filter((item) => statusOf(item) === "open").length,
    missing: findings.filter((item) => statusOf(item) === "missing").length,
    unread: findings.filter((item) => statusOf(item) === "unread").length,
  };
  const passedRows = findings.filter((item) => statusOf(item) === "pass").filter((item) => {
    if (passDomain !== "all" && groupOf(item) !== passDomain) return false;
    const haystack = `${item.title || ""} ${(item as Finding & { brief?: { title?: string; found?: string } }).brief?.title || ""} ${(item as Finding & { brief?: { found?: string } }).brief?.found || ""} ${item.url || ""} ${item.checkId || ""}`.toLowerCase();
    return !passQuery.trim() || haystack.includes(passQuery.trim().toLowerCase());
  });

  const shownScore = (report.scores?.overall?.withheld ? report.scores?.technical?.value : report.scores?.overall?.value) ?? "—";
  const shownCoverage = report.scores?.coverage?.value ?? "—";
  const shownProcess = report.scores?.coverage?.process ?? "—";
  const blocked = findings.filter((item) => bandOf(item) === "owner");
  const notFound = findings.filter((item) => bandOf(item) === "gap");
  const technical = findings.filter((item) => item.checkId === "content.not_performed" || item.checkId === "a11y.axe");
  const undecided = findings.filter((item) => bandOf(item) === "unverified" && !technical.includes(item));
  return (
    <section className="scan-report report-sheet" lang={locale} dir={locale === "he" || locale === "ar" ? "rtl" : "ltr"}>
      <header className="report-sheet__mast">
        <div>
          <p className="report-sheet__kicker">{copy.site}</p>
          <h2>{hostName(report.url) || report.url}</h2>
        </div>
        <div className="report-sheet__actions">
          <button type="button" data-action="pdf" onClick={onPdf}>{copy.pdf}</button>
          {audience === "customer" ? <Link to="/compliance">{copy.newScan}</Link> : null}
        </div>
      </header>
      {onLocale ? (
        <div className="report-lang" role="group" aria-label={copy.site}>
          {VIEW_LANGUAGES.map((item) => (
            <button key={item.id} type="button" aria-pressed={locale === item.id} onClick={() => onLocale(item.id)}>{item.label}</button>
          ))}
        </div>
      ) : null}
      <dl className="report-sheet__meta">
        <div><dt>{copy.address}</dt><dd dir="ltr">{report.url || "—"}</dd></div>
        <div><dt>{copy.date}</dt><dd>{formatWhen(report.scannedAt, locale)}</dd></div>
        <div><dt>{copy.status}</dt><dd>{status}</dd></div>
        <div><dt>{copy.score}</dt><dd>{shownScore}/100</dd></div>
      </dl>
      <div className="report-sheet__score">
        <div>
          <b>{shownScore}<small>/100</small></b>
          <span>{copy.score}</span>
        </div>
        <div>
          <b>{shownProcess}<small>%</small></b>
          <span>{copy.process}</span>
          <p>{copy.processHelp}</p>
        </div>
        <div>
          <b>{shownCoverage}<small>%</small></b>
          <span>{copy.coverage}</span>
          <div className="report-sheet__bar" aria-hidden="true"><span style={{ width: `${Number(shownCoverage) || 0}%` }} /></div>
          <p>{copy.coverageHelp}</p>
        </div>
      </div>
      <p className="report-sheet__scope">{copy.scoreHelp}</p>
      <p className="report-sheet__scope">{copy.unknown}: {counts.unknown}</p>
      <div className="report-sheet__metrics">
        <article><b>{counts.pass}</b><span>{copy.ok}</span></article>
        <article><b>{counts.action}</b><span>{copy.todo}</span></article>
        <article><b>{report.documents?.filter((item: { state?: string }) => item.state === "not_found_after_scan").length || 0}</b><span>{copy.missing}</span></article>
        <article><b>{counts.unknown}</b><span>{copy.unknown}</span></article>
      </div>
      {report.executive ? (
        <section className="report-executive">
          <h2>{copy.executiveTitle}</h2>
          {report.executive.overview?.state ? <><h3>{copy.siteState}</h3><p>{report.executive.overview.state}</p></> : null}
          {report.executive.overview?.sound ? <><h3>{copy.soundNow}</h3><p>{report.executive.overview.sound}</p></> : null}
          {report.executive.overview?.work ? <><h3>{copy.needsWork}</h3><p>{report.executive.overview.work}</p></> : null}
          {report.executive.overview?.check ? <><h3>{copy.stillCheck}</h3><p>{report.executive.overview.check}</p></> : null}
          <p>{report.executive.scoreMeaning}</p>
          <p><strong>{report.executive.score ?? shownScore}/100</strong> · {copy.checksTitle}: {report.executive.checks}</p>
          {report.executive.scoreSplit ? <p>{report.executive.scoreSplit}</p> : null}
          <p>{copy.passedChapter}: {statusCounts.pass} · {copy.actionChapter}: {statusCounts.action} · {copy.verifyChapter}: {statusCounts.verify} · {copy.unfinished}: {statusCounts.open} · {copy.notFoundTitle}: {statusCounts.missing} · {copy.blockedTitle}: {statusCounts.unread}</p>
          {statusCounts.unread > 0 ? <p>{copy.internalOffer}</p> : null}
          <p>{["critical", "high", "medium", "low", "info"].map((key) => `${copy[key] || key} ${report.executive.bySeverity?.[key] || 0}`).join(" · ")}</p>
          {report.executive.storedLabel ? <p className="report-stored">{report.executive.storedLabel}</p> : null}
          {(report.executive.significant || []).length ? <ul>{report.executive.significant.map((title: string) => <li key={title}>{title}</li>)}</ul> : null}
          {(report.executive.soundDomains || []).length ? <p><strong>{copy.soundTitle}. </strong>{report.executive.soundDomains.join(" · ")}</p> : null}
          {(report.executive.openDomains || []).length ? <p><strong>{copy.openTitle}. </strong>{report.executive.openDomains.map((area: { label: string; note: string }) => `${area.label}: ${area.note}`).join(" · ")}</p> : null}
          <h3>{copy.firstTitle}</h3>
          <ol>{(report.executive.firstActions || []).map((step: { order: number; title: string; who: string }) => <li key={step.order}><strong>{step.title}</strong> · {step.who}</li>)}</ol>
        </section>
      ) : null}
      <nav className="report-nav">
        <a href="#report-action">{copy.actionChapter}</a>
        <a href="#report-verify">{copy.verifyChapter}</a>
        <a href="#report-passed">{copy.passedChapter}</a>
        <a href="#report-plan">{copy.navPlan}</a>
        <a href="#report-open">{copy.navOpen}</a>
      </nav>
      {([["action", copy.actionChapter], ["verify", copy.verifyChapter]] as const).map(([id, label]) => {
        const rank = (value?: string) => ({ high: 0, medium: 1, low: 2, info: 3 } as Record<string, number>)[value || "info"] ?? 4;
        const rows = findings.filter((item) => statusOf(item) === id).sort((a, b) => rank(a.severity) - rank(b.severity));
        if (!rows.length) return null;
        return (
          <section key={id} id={`report-${id}`} className="report-findings">
            <h2 className="report-band">{label}</h2>
            {rows.map((item, index) => {
              const detail = detailOf(item, copy);
              const brief = (item as Finding & { brief?: any }).brief;
              const title = String(brief?.title || item.title || "").trim();
              const fix = String(brief?.recommendation || detail.change || item.recommendation || "");
              const located = item.locationVerified === false ? false : Boolean(item.url || brief?.where?.url);
              const pageUrl = brief?.where?.url || item.url;
              const evidence = typeof item.evidence === "string" ? item.evidence : "";
              return (
                <article key={`${item.checkId}-${index}`} className={`report-finding sev-${item.severity || "info"}`}>
                  <header>
                    <p>{copy.severity}: {brief?.severityLabel || copy[item.severity || "info"] || item.severity} · {copy.certainty}: {brief?.certaintyLabel || "—"}</p>
                    {brief?.storedLabel ? <p className="report-stored">{brief.storedLabel}</p> : null}
                    <h3>{title}</h3>
                  </header>
                  {brief?.answer ? <><h4>{copy.fixQuestion}</h4><p>{brief.answer}</p></> : null}
                  {(brief?.subjects || []).length ? <ol>{brief.subjects.map((row: { name?: string; label?: string; missing?: string }) => <li key={row.name || row.label}><strong>{row.label || row.name}</strong>{row.missing ? ` — ${row.missing}` : ""}</li>)}</ol> : null}
                  {brief?.found && brief.found !== brief?.answer ? <><h4>{copy.foundTitle}</h4><p>{brief.found}</p></> : null}
                  {brief?.storedFound ? <p>{brief.storedFound}</p> : null}
                  <h4>{copy.whereTitle}</h4>
                  <p dir="ltr">{located && pageUrl ? <a href={pageUrl} target="_blank" rel="noopener noreferrer">{pageUrl}</a> : copy.unknownPlace}</p>
                  {brief?.where?.pageTitle ? <p><strong>{copy.pageFromSite}. </strong>{brief.where.pageTitle}</p> : null}
                  {brief?.where?.countLabel ? <p>{brief.where.countLabel}</p> : null}
                  <h4>{copy.whyTitle}</h4>
                  <p>{brief?.why || ""}</p>
                  <h4>{copy.stepsTitle}</h4>
                  {(brief?.steps || []).filter((step: string) => step !== brief?.answer).length ? <ol>{brief.steps.filter((step: string) => step !== brief?.answer).map((step: string) => <li key={step}>{step}</li>)}</ol> : (fix && fix !== brief?.answer && fix !== brief?.found ? <p>{fix}</p> : null)}
                  {brief?.whoLabel ? <p><strong>{copy.whoTitle}. </strong>{brief.whoLabel}</p> : null}
                  {brief?.verify ? <p><strong>{copy.verifyTitle}. </strong>{brief.verify}</p> : null}
                  <h4>{copy.certainQuestion}</h4>
                  <p>{brief?.certaintyLabel || "—"}</p>
                  <details className="report-tech">
                    <summary>{copy.techTitleDeveloper || copy.techTitle}</summary>
                    {brief?.technical ? <p>{brief.technical}</p> : null}
                    {brief?.where?.selector ? <p dir="ltr">{brief.where.selector}</p> : null}
                    {brief?.example?.code ? <div><p>{copy.exampleTitle}. {brief.example.note}</p><pre className="report-code" dir="ltr">{brief.example.code}</pre></div> : null}
                    {evidence ? <><p><strong>{copy.evidenceOriginal}. </strong>{copy.evidenceNote}</p><p className="report-finding__evidence" dir="ltr">{evidence}</p></> : null}
                    {(brief?.sources || []).map((source: { name?: string; url?: string }) => source.url ? <p key={source.url} dir="ltr"><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name || source.url}</a></p> : null)}
                    {brief?.limits ? <p><strong>{copy.limitsTitle}. </strong>{brief.limits}</p> : null}
                  </details>
                </article>
              );
            })}
          </section>
        );
      })}
      <section id="report-passed" className="report-sheet__block">
        <h2>{copy.passedChapter}</h2>
        <p>{copy.passedNote}</p>
        <p>{sections.map(([id, label]) => `${label}: ${findings.filter((item) => statusOf(item) === "pass" && groupOf(item) === id).length}`).join(" · ")}</p>
        <div className="report-filter">
          <label>{copy.passFilter}<select value={passDomain} onChange={(event) => setPassDomain(event.target.value)}><option value="all">{copy.all}</option>{sections.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <label>{copy.passSearch}<input value={passQuery} onChange={(event) => setPassQuery(event.target.value)} /></label>
        </div>
        {passedRows.length === 0 ? null : passedRows.map((item, index) => {
          const brief = (item as Finding & { brief?: any }).brief;
          const evidence = typeof item.evidence === "string" ? item.evidence : "";
          return (
            <details key={`pass-${item.checkId}-${index}`} className="report-open">
              <summary>{brief?.title || item.title}</summary>
              <p><strong>{copy.whereTitle}. </strong><span dir="ltr">{item.url || copy.unknownPlace}</span></p>
              <p><strong>{copy.foundTitle}. </strong>{brief?.found || item.description}</p>
              {evidence ? <><p><strong>{copy.evidenceOriginal}. </strong>{copy.evidenceNote}</p><p dir="ltr">{evidence.slice(0, 280)}</p></> : null}
              {brief?.limits ? <p><strong>{copy.limitsTitle}. </strong>{brief.limits}</p> : null}
              <p dir="ltr">{item.checkId}</p>
            </details>
          );
        })}
      </section>
      <section id="report-observed" className="report-sheet__block">
        {findings.some((item) => statusOf(item) === "observation") ? <><h2>{copy.observationChapter}</h2><p>{copy.observationNote}</p></> : null}
        {findings.filter((item) => statusOf(item) === "observation").map((item, index) => {
          const brief = (item as Finding & { brief?: any }).brief;
          return <details key={`obs-${item.checkId}-${index}`} className="report-open"><summary>{brief?.title || item.title}</summary><p dir="ltr">{item.url || copy.unknownPlace}</p><p>{brief?.found || item.description}</p><p>{brief?.limits}</p></details>;
        })}
        {findings.some((item) => statusOf(item) === "partial") ? <h2>{copy.partialChapter}</h2> : null}
        {findings.filter((item) => statusOf(item) === "partial").map((item, index) => {
          const brief = (item as Finding & { brief?: any }).brief;
          return <article key={`part-${item.checkId}-${index}`} className="report-open"><h3>{brief?.title || item.title}</h3><p>{brief?.found || item.description}</p></article>;
        })}
        {findings.some((item) => statusOf(item) === "read") ? <h2>{copy.readChapter}</h2> : null}
        {findings.filter((item) => statusOf(item) === "read").map((item, index) => {
          const brief = (item as Finding & { brief?: any }).brief;
          return <article key={`read-${item.checkId}-${index}`} className="report-open"><h3>{brief?.title || item.title}</h3><p dir="ltr">{item.url}</p><p>{brief?.limits || item.description}</p></article>;
        })}
      </section>
      {(report.trackers || []).length ? <section className="report-sheet__block">
        <h2>{copy.tools}</h2>
        {(report.trackers || []).length === 0 ? null : (
          <ul>
            {(report.trackers || []).map((tool: { name?: string; pageUrl?: string; beforeConsent?: string }) => (
              <li key={`${tool.name}-${tool.pageUrl}`}><strong>{tool.name}</strong><p dir="ltr">{tool.pageUrl}</p><p>{copy.purpose}. {tool.beforeConsent || copy.consent}</p></li>
            ))}
          </ul>
        )}
      </section> : null}
      <section id="report-plan" className="report-sheet__block">
        <h2>{copy.plan}</h2>
        <ol>
          {(report.workPlan || actions).map((item: Finding & { order?: number; change?: string; verify?: string; who?: string; impact?: string; steps?: string[]; storedLabel?: string; priority?: string; component?: string; problem?: string }) => (
            <li key={`${item.order || ""}-${item.checkId}`}>
              {item.storedLabel ? <p className="report-stored">{item.storedLabel}</p> : null}
              <strong>{item.title}</strong>
              {item.priority ? <p>{copy.severity}: {String(item.priority)}</p> : null}
              {item.component ? <p>{String(item.component)}</p> : null}
              {item.problem ? <p>{String(item.problem)}</p> : null}
              {item.who ? <p>{copy.whoTitle}: {item.who}</p> : null}
              {item.impact && item.impact !== item.problem ? <p>{item.impact}</p> : null}
              <p dir="ltr">{item.url || copy.unknownPlace}</p>
              {(item.steps || []).length ? <ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol> : <p>{String(item.change || item.recommendation || "")}</p>}
              {item.verify ? <p><strong>{copy.verifyTitle}. </strong>{String(item.verify)}</p> : null}
            </li>
          ))}
        </ol>
      </section>
      <section id="report-open" className="report-sheet__block">
        {notFound.length ? <h2>{copy.notFoundTitle}</h2> : null}
        {notFound.map((item, index) => (
          <article key={`gap-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
        {undecided.length ? <h2>{copy.undecidedTitle}</h2> : null}
        {undecided.map((item, index) => (
          <article key={`open-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
        {blocked.length ? <h2>{copy.blockedTitle}</h2> : null}
        {blocked.map((item, index) => {
          const brief = (item as Finding & { brief?: { found?: string; title?: string } }).brief;
          return <article key={`blocked-${item.checkId}-${index}`} className="report-open"><h3>{brief?.title || item.title}</h3><p>{brief?.found || item.explanation || item.description}</p><p dir="ltr">{item.url}</p></article>;
        })}
        <h2>{CONSENT_UI[locale].scopeTitle}</h2>
        <p>{SCOPE[locale]}</p>
        {technical.length ? <h2>{copy.technicalTitle}</h2> : null}
        {technical.map((item, index) => (
          <article key={`tech-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
      </section>
    </section>
  );
}
