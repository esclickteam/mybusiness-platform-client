import { useState } from "react";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";

const TEXT: Record<Locale, Record<string, string>> = {
  he: {
    plans: "שלוש חבילות",
    priceNote: "המחיר מוצג בשקלים. Lemon Squeezy מחייב בדולר לפי שער ההמרה, לא בשקלים. הסליקה כבויה ולא מתבצע חיוב.",
    free: "חינם",
    report: "דוח מלא",
    monitor: "ניטור חודשי",
    once: "לסריקה",
    month: "לחודש",
    freeLine: "ציון של מה שנבדק, ממצאים חסרים וקטגוריות. בלי ציטוטים, סעיפים או PDF.",
    reportLine: "הדוח שנשמר, כולל מקור, ציטוט, חומרה והמלצה. בלי אישור עמידה בחוק.",
    monitorLine: "דוח מלא, סריקה חודשית לאתר אחד, היסטוריה והתראה רק על מקור שאומת.",
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
    sample: "הצגת מבנה הדוח",
    sampleNote: "המחשה של מבנה הדוח. אלה לא ממצאים של האתר שנסרק.",
    law: "חוק או תקן",
    scope: "מדינה ותחולה",
    source: "מקור",
    seen: "מה נמצא",
    gap: "מה חסר",
    severity: "חומרה",
    manual: "נדרשת בדיקה אנושית",
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
    priceNote: "The price is shown in shekels. Lemon Squeezy charges the USD equivalent, not shekels. Checkout is off and nothing is charged.",
    free: "Free",
    report: "Full report",
    monitor: "Monthly monitoring",
    once: "per scan",
    month: "per month",
    freeLine: "A score of what was checked, missing documents and categories. No quotes, sections or PDF.",
    reportLine: "The stored report, with source, quote, severity and a recommendation. No compliance approval.",
    monitorLine: "A full report, one monthly scan for one site, history, and an alert only for a verified source.",
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
    sample: "Show the report structure",
    sampleNote: "An illustration of the report structure. These are not findings for the scanned site.",
    law: "Law or standard",
    scope: "Country and scope",
    source: "Source",
    seen: "What was found",
    gap: "What is missing",
    severity: "Severity",
    manual: "A person needs to review this",
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
    plans: "Tres planes", priceNote: "El precio se muestra en séqueles. Lemon Squeezy cobra el equivalente en USD, no en séqueles. El cobro está apagado.",
    free: "Gratis", report: "Informe completo", monitor: "Seguimiento mensual", once: "por análisis", month: "al mes",
    freeLine: "Puntuación de lo comprobado, documentos ausentes y categorías. Sin citas, artículos ni PDF.",
    reportLine: "El informe guardado, con fuente, cita, gravedad y recomendación. Sin aprobación legal.",
    monitorLine: "Informe completo, un análisis mensual para un sitio, historial y aviso solo con fuente verificada.",
    checked: "Puntuación de lo comprobado", coverage: "Cobertura", lowCoverage: "La cobertura es baja. La puntuación es parcial.", missing: "Documentos ausentes", critical: "Hallazgos críticos en texto leído",
    other: "Otros hallazgos", incomplete: "Comprobaciones incompletas", categories: "Categorías", accessibility: "Accesibilidad", security: "Seguridad", privacy: "Privacidad", cookies: "Cookies", when: "Fecha y país",
    locked: "El informe completo permanece en el servidor hasta verificar un pago.",
    sample: "Ver la estructura", sampleNote: "Ilustración de la estructura. No son hallazgos del sitio analizado.",
    law: "Ley o norma", scope: "País y alcance", source: "Fuente", seen: "Qué apareció", gap: "Qué falta", severity: "Gravedad", manual: "Hace falta revisión humana",
    mentioned: "El tema aparece. Eso no es cumplimiento.", not_seen_in_read_text: "El tema no apareció en el texto leído.",
    document_not_read: "El documento no se leyó.", not_verifiable: "Un análisis público no puede verificarlo.",
    statement_seen: "Hay una declaración. Una declaración no es conformidad.", needs_human: "La fuente está en el catálogo. La aplicación requiere una persona.",
    not_indicated: "No hubo una señal para esta comprobación.", dashboard: "Seguimiento", day: "Día del mes", last: "Último día del mes",
    email: "Correo para avisos operativos", inactive: "No hay una suscripción activa. No hay seguimiento ni correo comercial.",
    capacity: "El día elegido es una preferencia. La ejecución es una ventana durante el mes, sujeta a la capacidad, y no promete una fecha ni una hora.",
  },
  "pt-BR": {
    plans: "Três planos", priceNote: "O preço aparece em shekels. A Lemon Squeezy cobra o equivalente em USD, não em shekels. A cobrança está desligada.",
    free: "Grátis", report: "Relatório completo", monitor: "Monitoramento mensal", once: "por análise", month: "por mês",
    freeLine: "Pontuação do que foi verificado, documentos ausentes e categorias. Sem citações, artigos ou PDF.",
    reportLine: "O relatório salvo, com fonte, citação, gravidade e recomendação. Sem aprovação legal.",
    monitorLine: "Relatório completo, uma análise mensal para um site, histórico e alerta só com fonte verificada.",
    checked: "Pontuação do que foi verificado", coverage: "Cobertura", lowCoverage: "A cobertura está baixa. A pontuação é parcial.", missing: "Documentos ausentes", critical: "Achados críticos no texto lido",
    other: "Outros achados", incomplete: "Verificações incompletas", categories: "Categorias", accessibility: "Acessibilidade", security: "Segurança", privacy: "Privacidade", cookies: "Cookies", when: "Data e país",
    locked: "O relatório completo fica no servidor até a verificação de um pagamento.",
    sample: "Ver a estrutura", sampleNote: "Ilustração da estrutura. Não são achados do site analisado.",
    law: "Lei ou norma", scope: "País e alcance", source: "Fonte", seen: "O que apareceu", gap: "O que falta", severity: "Gravidade", manual: "Exige revisão humana",
    mentioned: "O tema apareceu. Isso não é conformidade.", not_seen_in_read_text: "O tema não apareceu no texto lido.",
    document_not_read: "O documento não foi lido.", not_verifiable: "Uma análise pública não consegue verificar isto.",
    statement_seen: "Havia uma declaração. Declaração não é conformidade.", needs_human: "A fonte está no catálogo. A aplicação exige uma pessoa.",
    not_indicated: "Nenhum sinal acionou esta verificação.", dashboard: "Monitoramento", day: "Dia do mês", last: "Último dia do mês",
    email: "E-mail para alertas operacionais", inactive: "Não há assinatura ativa. Não há monitoramento nem e-mail comercial.",
    capacity: "O dia escolhido é uma preferência. A execução é uma janela durante o mês, sujeita à capacidade, e não promete data nem hora.",
  },
  ar: {
    plans: "ثلاث باقات", priceNote: "السعر معروض بالشيكل. Lemon Squeezy تخصم ما يعادله بالدولار، وليس بالشيكل. التحصيل متوقف.",
    free: "مجاني", report: "تقرير كامل", monitor: "مراقبة شهرية", once: "لكل فحص", month: "شهريًا",
    freeLine: "درجة ما تم فحصه، والمستندات الناقصة، والفئات. بلا اقتباسات أو مواد أو PDF.",
    reportLine: "التقرير المحفوظ، مع المصدر والاقتباس والشدة والتوصية. بلا اعتماد امتثال.",
    monitorLine: "تقرير كامل، وفحص شهري لموقع واحد، وسجل، وتنبيه فقط لمصدر تم التحقق منه.",
    checked: "درجة الفحوص المكتملة", coverage: "تغطية الفحص", lowCoverage: "التغطية منخفضة. الدرجة جزئية.", missing: "مستندات ناقصة", critical: "نتائج حرجة في نص تمت قراءته",
    other: "نتائج أخرى", incomplete: "فحوص لم تكتمل", categories: "فئات", accessibility: "إتاحة", security: "أمن", privacy: "خصوصية", cookies: "ملفات تعريف الارتباط", when: "التاريخ والدولة",
    locked: "يبقى التقرير الكامل على الخادم إلى أن يتم التحقق من عملية دفع.",
    sample: "عرض بنية التقرير", sampleNote: "رسم توضيحي للبنية. هذه ليست نتائج الموقع الذي فُحص.",
    law: "القانون أو المعيار", scope: "الدولة والنطاق", source: "المصدر", seen: "ما وُجد", gap: "ما ينقص", severity: "الشدة", manual: "يلزم مراجعة بشرية",
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

export function PlanCards({ locale }: { locale: Locale }) {
  const copy = TEXT[locale] || TEXT.en;
  const plans = [
    ["0", copy.free, "", copy.freeLine],
    ["149", copy.report, copy.once, copy.reportLine],
    ["99", copy.monitor, copy.month, copy.monitorLine],
  ];
  return (
    <section className="scan-plans">
      <h2>{copy.plans}</h2>
      <div className="scan-plans__grid">
        {plans.map(([price, name, unit, line]) => (
          <article key={name}>
            <b>{name}</b>
            <strong>{price === "0" ? copy.free : `₪${price}`}</strong>
            <small>{unit}</small>
            <p>{line}</p>
          </article>
        ))}
      </div>
      <p>{copy.priceNote}</p>
      <p>{copy.capacity}</p>
    </section>
  );
}

export function FreeResult({ locale, summary }: { locale: Locale; summary: any }) {
  const copy = TEXT[locale] || TEXT.en;
  const [open, setOpen] = useState(false);
  if (!summary) return <p className="scan-not-legal">{copy.locked}</p>;
  return (
    <section className="scan-free">
      <div className="scan-scores">
        <article><b>{summary.checkedScore ?? "—"}<small>/100</small></b><span>{copy.checked}</span></article>
        <article><b>{summary.coverage ?? "—"}%</b><span>{copy.coverage}</span></article>
        <article><b>{summary.missingDocuments ?? 0}</b><span>{copy.missing}</span></article>
        <article><b>{summary.critical ?? 0}</b><span>{copy.critical}</span></article>
        <article><b>{summary.other ?? 0}</b><span>{copy.other}</span></article>
        <article><b>{summary.incomplete ?? 0}</b><span>{copy.incomplete}</span></article>
      </div>
      <p>{copy.categories}: {(summary.categories || []).map((item: string) => copy[item] || item).join(", ") || "—"}</p>
      <p>{copy.when}: {summary.scannedAt || "—"} · {(summary.countries || []).join(", ") || "—"}</p>
      <p className="scan-not-legal">{summary.checkedScoreLabel || copy.locked}</p>
      {summary.lowCoverage && <p className="scan-error" role="status">{copy.lowCoverage}</p>}
      <p>{copy.locked}</p>
      <button type="button" className="scan-start" onClick={() => setOpen((value) => !value)}>{copy.sample}</button>
      {open && (
        <div className="scan-sample">
          <p>{copy.sampleNote}</p>
          <RequirementTable locale={locale} rows={SAMPLE} />
        </div>
      )}
    </section>
  );
}

export function RequirementTable({ locale, rows }: { locale: Locale; rows: any[] }) {
  const copy = TEXT[locale] || TEXT.en;
  return (
    <div className="scan-requirements">
      {rows.map((row) => (
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
      <label>{copy.day}<input type="number" min={1} max={31} defaultValue={1} /></label>
      <label><input type="checkbox" /> {copy.last}</label>
      <label>{copy.email}<input type="email" dir="ltr" /></label>
    </section>
  );
}

export function commercialLocale(language: string): Locale {
  if (language === "he" || language === "en" || language === "es" || language === "ar" || language === "pt-BR") return language;
  return "en";
}
