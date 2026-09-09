/**
 * unique49 — leftover Adion pricing/FAQ, Serenova services, and Justora body chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and quotation-only marks.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Adion pricing
  "₪8,900 לפרויקט": r(
    "₪8,900 per project",
    "₪8,900 por proyecto",
    "₪8,900 por projeto",
    "₪8,900 لكل مشروع",
  ),
  "₪23,900 לפרויקט": r(
    "₪23,900 per project",
    "₪23,900 por proyecto",
    "₪23,900 por projeto",
    "₪23,900 لكل مشروع",
  ),
  "למותגים שצריכים צילום נקי, פרימיום ותהליך הפקה יעיל.": r(
    "For brands that need clean, premium photography and an efficient production process.",
    "Para marcas que necesitan foto limpia y premium y un proceso de producción eficiente.",
    "Para marcas que precisam de foto limpa e premium e um processo de produção eficiente.",
    "للعلامات التي تحتاج تصويراً نظيفاً وفاخراً وعملية إنتاج فعّالة.",
  ),
  "קונספט קריאייטיבי": r("Creative concept", "Concepto creativo", "Conceito criativo", "مفهوم إبداعي"),
  "יום צילום מקצועי": r("A professional shoot day", "Un día de rodaje profesional", "Um dia de filmagem profissional", "يوم تصوير مهني"),
  "עריכה קולנועית": r("Cinematic editing", "Edición cinematográfica", "Edição cinematográfica", "مونتاج سينمائي"),
  "ייצוא באיכות גבוהה": r("High-quality export", "Exportación de alta calidad", "Exportação de alta qualidade", "تصدير بجودة عالية"),
  "ליווי ותקשורת שוטפת": r(
    "Ongoing support and communication",
    "Acompañamiento y comunicación continua",
    "Acompanhamento e comunicação contínua",
    "مرافقة وتواصل مستمر",
  ),
  "לקמפיינים שצריכים כיוון ויזואלי מלא, צוות הפקה ופוסט-פרודקשן מתקדם.": r(
    "For campaigns that need a full visual direction, a production crew, and advanced post-production.",
    "Para campañas que necesitan dirección visual completa, equipo de producción y postproducción avanzada.",
    "Para campanhas que precisam de direção visual completa, equipe de produção e pós-produção avançada.",
    "للحملات التي تحتاج توجيهاً بصرياً كاملاً وطاقم إنتاج وما بعد إنتاج متقدّم.",
  ),
  "אסטרטגיה ותכנון": r("Strategy and planning", "Estrategia y planificación", "Estratégia e planejamento", "استراتيجية وتخطيط"),
  "בימוי קריאייטיבי מלא": r("Full creative direction", "Dirección creativa completa", "Direção criativa completa", "إخراج إبداعي كامل"),
  "צוות הפקה": r("Production crew", "Equipo de producción", "Equipe de produção", "طاقم إنتاج"),
  "תיקון צבע מתקדם": r("Advanced color grading", "Corrección de color avanzada", "Correção de cor avançada", "تصحيح لون متقدّم"),
  "פורמטים לכל הפלטפורמות": r(
    "Formats for every platform",
    "Formatos para todas las plataformas",
    "Formatos para todas as plataformas",
    "صيغ لكل المنصات",
  ),
  "איזה סוגי תוכן אתם מפיקים?": r(
    "What kinds of content do you produce?",
    "¿Qué tipos de contenido producís?",
    "Que tipos de conteúdo vocês produzem?",
    "أي أنواع محتوى تنتجون؟",
  ),
  "סרטוני מותג, קמפיינים, תוכן לסושיאל, פורטרטים, סרטוני אירועים, צילום סטודיו וסרטוני השקה.": r(
    "Brand films, campaigns, social content, portraits, event films, studio photography, and launch films.",
    "Películas de marca, campañas, contenido social, retratos, vídeos de eventos, foto de estudio y vídeos de lanzamiento.",
    "Filmes de marca, campanhas, conteúdo social, retratos, filmes de eventos, foto de estúdio e filmes de lançamento.",
    "أفلام علامة وحملات ومحتوى سوشيال وصور شخصية وأفلام مناسبات وتصوير استوديو وأفلام إطلاق.",
  ),
  "כמה זמן לוקח פרויקט?": r(
    "How long does a project take?",
    "¿Cuánto tarda un proyecto?",
    "Quanto tempo leva um projeto?",
    "كم يستغرق المشروع؟",
  ),
  "רוב הפרויקטים מסתיימים בתוך שבועיים עד ארבעה שבועות, בהתאם להיקף, לוקיישנים וצרכי עריכה.": r(
    "Most projects wrap in two to four weeks, depending on scope, locations, and editing needs.",
    "La mayoría de proyectos se cierran en dos a cuatro semanas, según el alcance, las localizaciones y la edición.",
    "A maioria dos projetos fecha em duas a quatro semanas, conforme o escopo, os locais e a edição.",
    "معظم المشاريع تُنجز خلال أسبوعين إلى أربعة أسابيع حسب النطاق والمواقع واحتياج المونتاج.",
  ),
  "אתם מטפלים בכל התהליך?": r(
    "Do you handle the whole process?",
    "¿Os ocupáis de todo el proceso?",
    "Vocês cuidam de todo o processo?",
    "هل تتولون العملية كاملة؟",
  ),
  "כן. אנחנו יכולים לנהל קונספט, תכנון, צילום, עריכה, צבע, סאונד והכנת הקבצים הסופיים.": r(
    "Yes. We can manage concept, planning, shooting, editing, color, sound, and final file delivery.",
    "Sí. Podemos gestionar concepto, planificación, rodaje, edición, color, sonido y entrega de archivos finales.",
    "Sim. Podemos gerir conceito, planejamento, filmagem, edição, cor, som e entrega dos arquivos finais.",
    "نعم. يمكننا إدارة المفهوم والتخطيط والتصوير والمونتاج واللون والصوت وتسليم الملفات النهائية.",
  ),
  "אפשר לקבל עזרה גם בקונספט?": r(
    "Can we also get help with the concept?",
    "¿También podéis ayudar con el concepto?",
    "Dá para receber ajuda também no conceito?",
    "هل يمكن الحصول على مساعدة في المفهوم أيضاً؟",
  ),
  "כן. אנחנו עוזרים לבנות את הסיפור, האווירה, הכיוון הוויזואלי ורשימת הצילומים לפני תחילת ההפקה.": r(
    "Yes. We help build the story, mood, visual direction, and shot list before production starts.",
    "Sí. Ayudamos a construir la historia, el ambiente, la dirección visual y la lista de planos antes de empezar la producción.",
    "Sim. Ajudamos a construir a história, o clima, a direção visual e a lista de tomadas antes de começar a produção.",
    "نعم. نساعد على بناء القصة والأجواء والتوجيه البصري وقائمة اللقطات قبل بدء الإنتاج.",
  ),

  // Serenova about + services
  "מבנה שמוביל את הלקוח בלי עומס": r(
    "A structure that leads the client without overload",
    "Una estructura que guía al cliente sin sobrecarga",
    "Uma estrutura que conduz o cliente sem sobrecarga",
    "بنية تقود الزبون بلا إثقال",
  ),
  "תחושה רגועה אבל עדיין פרימיום": r(
    "A calm feeling that is still premium",
    "Una sensación calmada que sigue siendo premium",
    "Uma sensação calma que ainda é premium",
    "شعور هادئ يبقى فاخرًا",
  ),
  "שכבות תמונה שיוצרות עומק": r(
    "Image layers that create depth",
    "Capas de imagen que crean profundidad",
    "Camadas de imagem que criam profundidade",
    "طبقات صور تصنع عمقاً",
  ),
  "כרטיסים חיים עם Hover עדין": r(
    "Living cards with a gentle Hover",
    "Tarjetas vivas con Hover suave",
    "Cartões vivos com Hover suave",
    "بطاقات حيّة مع Hover لطيف",
  ),
  זוגיות: r("Couples", "Pareja", "Casal", "علاقة زوجية"),
  סדנאות: r("Workshops", "Talleres", "Oficinas", "ورش"),
  "פגישות 1:1": r("1:1 sessions", "Sesiones 1:1", "Sessões 1:1", "جلسات 1:1"),
  "מרחב בטוח": r("A safe space", "Un espacio seguro", "Um espaço seguro", "مساحة آمنة"),
  "ליווי מותאם": r("Tailored guidance", "Acompañamiento a medida", "Acompanhamento sob medida", "مرافقة مخصّصة"),
  "אונליין / פרונטלי": r("Online / in person", "Online / presencial", "Online / presencial", "أونلاين / حضوري"),
  "שיפור תקשורת": r("Better communication", "Mejor comunicación", "Melhor comunicação", "تحسين التواصل"),
  הקשבה: r("Listening", "Escucha", "Escuta", "إنصات"),
  "כלים מעשיים": r("Practical tools", "Herramientas prácticas", "Ferramentas práticas", "أدوات عملية"),
  "תהליך משותף": r("A shared process", "Un proceso compartido", "Um processo compartilhado", "عملية مشتركة"),
  "מיקוד רגשי": r("Emotional focus", "Enfoque emocional", "Foco emocional", "تركيز عاطفي"),
  "הפחתת עומס": r("Reducing overload", "Reducir la sobrecarga", "Reduzir a sobrecarga", "تخفيف العبء"),
  בהירות: r("Clarity", "Claridad", "Clareza", "وضوح"),
  "מותאם לצורך": r("Fitted to the need", "Ajustado a la necesidad", "Ajustado à necessidade", "ملائم للحاجة"),
  לקבוצות: r("For groups", "Para grupos", "Para grupos", "للمجموعات"),
  ארגונים: r("Organizations", "Organizaciones", "Organizações", "مؤسسات"),
  "תוכן ברור": r("Clear content", "Contenido claro", "Conteúdo claro", "محتوى واضح"),
  "קבוצות / ארגונים": r("Groups / organizations", "Grupos / organizaciones", "Grupos / organizações", "مجموعات / مؤسسات"),

  // Justora leftover body
  "הצוות המשפטי": r("The legal team", "El equipo jurídico", "A equipe jurídica", "الفريق القانوني"),
  "תיקים והצלחות": r("Cases and successes", "Expedientes y éxitos", "Processos e sucessos", "ملفات ونجاحات"),
  "לקוחות מספרים": r("Clients share", "Los clientes cuentan", "Clientes contam", "العملاء يروون"),
  "גלריית משרד": r("Office gallery", "Galería del despacho", "Galeria do escritório", "معرض المكتب"),
  "בניית אסטרטגיה משפטית כבר מהשיחה הראשונה.": r(
    "Building a legal strategy from the first conversation.",
    "Construir una estrategia jurídica ya desde la primera conversación.",
    "Construir uma estratégia jurídica já na primeira conversa.",
    "بناء استراتيجية قانونية منذ المكالمة الأولى.",
  ),
  "ניהול מסמכים, ראיות ולוחות זמנים בצורה מסודרת.": r(
    "Managing documents, evidence, and timelines in an orderly way.",
    "Gestionar documentos, pruebas y plazos de forma ordenada.",
    "Gerir documentos, provas e prazos de forma organizada.",
    "إدارة المستندات والأدلة والجداول الزمنية بشكل منظّم.",
  ),
  "עדכונים ברורים ושקיפות לאורך כל הדרך.": r(
    "Clear updates and transparency all the way through.",
    "Actualizaciones claras y transparencia en todo el camino.",
    "Atualizações claras e transparência ao longo de todo o caminho.",
    "تحديثات واضحة وشفافية على طول الطريق.",
  ),
  "שמירה על דיסקרטיות מלאה ויחס אישי.": r(
    "Keeping full discretion and a personal approach.",
    "Mantener discreción total y un trato personal.",
    "Manter discrição total e um trato pessoal.",
    "الحفاظ على تكتم كامل وتعامل شخصي.",
  ),
  "חשיבה משפטית שמחברת בין סיכון, זמן ותוצאה.": r(
    "Legal thinking that connects risk, time, and outcome.",
    "Pensamiento jurídico que conecta riesgo, tiempo y resultado.",
    "Pensamento jurídico que liga risco, tempo e resultado.",
    "تفكير قانوني يربط بين الخطر والوقت والنتيجة.",
  ),
  "מקצועיים ומסורים": r("Professional and dedicated", "Profesionales y entregados", "Profissionais e dedicados", "مهنيون ومتفانون"),
  "שירות יוצא דופן": r("Outstanding service", "Un servicio excepcional", "Um serviço excepcional", "خدمة استثنائية"),
  "ממליצים מאוד": r("Highly recommend", "Lo recomendamos mucho", "Recomendamos muito", "نوصي بقوة"),
  "בדיקת סיכונים": r("Risk review", "Revisión de riesgos", "Revisão de riscos", "فحص المخاطر"),
  "איסוף פרטים": r("Gathering details", "Recogida de datos", "Coleta de dados", "جمع التفاصيل"),
  "כיוון פעולה": r("A course of action", "Una línea de acción", "Um rumo de ação", "اتجاه عمل"),
  "הערכת המשך טיפול": r("Assessing next steps", "Valorar el siguiente tratamiento", "Avaliar o tratamento seguinte", "تقييم متابعة العلاج"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique49.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique49 rows`);
