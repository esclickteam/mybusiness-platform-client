/**
 * unique61 — leftover Gridline/Monolith schema chrome, Horizon–Citadel copy,
 * travel set, and brokeria–axispoint preview chrome.
 * Skip personal names, place-only chips, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Gridline / Monolith leftover chrome
  "הירו Gridline": r("Gridline hero", "Hero de Gridline", "Hero do Gridline", "هيرو Gridline"),
  "אודות Gridline": r("About Gridline", "Sobre Gridline", "Sobre o Gridline", "عن Gridline"),
  "הירו Monolith": r("Monolith hero", "Hero de Monolith", "Hero do Monolith", "هيرو Monolith"),
  "אודות Monolith": r("About Monolith", "Sobre Monolith", "Sobre o Monolith", "عن Monolith"),
  "ספרו לנו על השטח, היעד, הלו״ז והאתגר": r(
    "Tell us about the site, the goal, the schedule, and the challenge",
    "Contadnos sobre el terreno, el objetivo, el calendario y el reto",
    "Contem sobre o terreno, o objetivo, o cronograma e o desafio",
    "أخبرونا عن الموقع والهدف والجدول والتحدي",
  ),
  "ספרו לנו על היעד העסקי, המורכבות הארגונית והטיימינג": r(
    "Tell us about the business goal, the organizational complexity, and the timing",
    "Contadnos sobre el objetivo de negocio, la complejidad organizativa y el timing",
    "Contem sobre o objetivo de negócio, a complexidade organizacional e o timing",
    "أخبرونا عن الهدف التجاري والتعقيد التنظيمي والتوقيت",
  ),
  השהייה: r("Delay", "Retraso", "Atraso", "تأخير"),

  // Horizon leftover
  "מרכז עסקים עירוני": r(
    "Urban business center",
    "Centro de negocios urbano",
    "Centro de negócios urbano",
    "مركز أعمال حضري",
  ),
  "מבנה התוכן משלב דפי תדמית, מלאי נכסים ותובנות שוק כדי לייצר חוויית נדל״ן מלאה ולא רק עמוד נחיתה.": r(
    "The content structure combines brand pages, property inventory, and market insight to create a full real-estate experience — not just a landing page.",
    "La estructura de contenido combina páginas de marca, inventario de inmuebles e insights de mercado para una experiencia inmobiliaria completa — no solo una landing.",
    "A estrutura de conteúdo combina páginas de marca, inventário de imóveis e insights de mercado para uma experiência imobiliária completa — não só uma landing.",
    "بنية المحتوى تجمع صفحات هوية ومخزون عقارات ورؤى سوق لتجربة عقارية كاملة — وليس مجرد صفحة هبوط.",
  ),
  "תוכן שמשמש גם ככלי מכירה, גם כחומר עבודה פנימי וגם כהוכחת מומחיות.": r(
    "Content that works as a sales tool, internal working material, and proof of expertise.",
    "Contenido que sirve como herramienta de venta, material de trabajo interno y prueba de expertise.",
    "Conteúdo que serve como ferramenta de venda, material de trabalho interno e prova de especialidade.",
    "محتوى يعمل كأداة بيع ومادة عمل داخلية وإثبات خبرة.",
  ),
  "פגישת היכרות כוללת אפיון מלא, בדיקת שוק וסקיצה ראשונית למסלול ההתקדמות.": r(
    "An intro meeting includes full briefing, a market check, and a first sketch of the path forward.",
    "Una reunión de presentación incluye briefing completo, revisión de mercado y un primer croquis del recorrido.",
    "Uma reunião de apresentação inclui briefing completo, checagem de mercado e um primeiro esboço do caminho.",
    "اجتماع تعارف يشمل توصيفاً كاملاً وفحص سوق ومسودة أولى لمسار التقدم.",
  ),
  "דף שירותים מלא עם רמות ליווי, מהלכי ביצוע ומבנה ברור שמרגיש כמו משרד בוטיק לנכסי יוקרה.": r(
    "A full services page with guidance levels, execution moves, and a clear structure that feels like a boutique luxury-property firm.",
    "Una página de servicios completa con niveles de acompañamiento, movimientos de ejecución y una estructura clara de despacho boutique de lujo.",
    "Uma página de serviços completa com níveis de acompanhamento, movimentos de execução e uma estrutura clara de escritório boutique de luxo.",
    "صفحة خدمات كاملة بمستويات مرافقة وخطوات تنفيذ وبنية واضحة تشبه مكتب بوتيك للعقارات الفاخرة.",
  ),
  "נכסים, פרויקטים ומסלולי עבודה שמודגשים כשילוב של מלאי איכותי, מידע שיווקי וסטוריטלינג מכירתי.": r(
    "Properties, projects, and work paths highlighted as a mix of quality inventory, marketing information, and sales storytelling.",
    "Inmuebles, proyectos y recorridos de trabajo destacados como mezcla de inventario de calidad, información de marketing y storytelling comercial.",
    "Imóveis, projetos e percursos de trabalho destacados como mistura de inventário de qualidade, informação de marketing e storytelling comercial.",
    "عقارات ومشاريع ومسارات عمل تُبرز كمزيج من مخزون جودة ومعلومات تسويق وسرد بيعي.",
  ),

  // Ledger leftover
  "מבנה עמודים שנראה כמו מסמך עבודה ולא רק שיווק.": r(
    "A page structure that looks like a working document, not just marketing.",
    "Una estructura de páginas que parece un documento de trabajo, no solo marketing.",
    "Uma estrutura de páginas que parece um documento de trabalho, não só marketing.",
    "بنية صفحات تبدو كوثيقة عمل وليس تسويقاً فقط.",
  ),
  "הטמפלט בנוי עם יחידות טבלה, שורות בקרה ותאי מידע שמשרתים משרדי כספים, רואי חשבון וייעוץ הנהלה.": r(
    "The template is built with table units, control rows, and info cells that serve finance offices, accountants, and executive advisory.",
    "La plantilla está hecha con unidades de tabla, filas de control y celdas de información para despachos financieros, contables y asesoría de dirección.",
    "O modelo é feito com unidades de tabela, linhas de controle e células de informação para escritórios financeiros, contadores e consultoria de direção.",
    "القالب مبني بوحدات جدول وصفوف تحكم وخلايا معلومات تخدم مكاتب مالية ومحاسبين واستشارة إدارة.",
  ),
  "ספרו לנו מה תרצו למדוד, לייעל או לייצב.": r(
    "Tell us what you want to measure, streamline, or stabilize.",
    "Contadnos qué queréis medir, optimizar o estabilizar.",
    "Contem o que vocês querem medir, otimizar ou estabilizar.",
    "أخبرونا ماذا تريدون قياسه أو تحسينه أو تثبيته.",
  ),
  "שיחת ההתנעה מיועדת למנהלים, בעלי עסקים וגורמי כספים שמבקשים תהליך מסודר ולא רק ייעוץ חד-פעמי.": r(
    "The kickoff call is for managers, business owners, and finance stakeholders who want an ordered process — not a one-off consult.",
    "La llamada de arranque es para gerentes, dueños y responsables financieros que quieren un proceso ordenado, no solo una consulta puntual.",
    "A chamada de partida é para gestores, donos e responsáveis financeiros que querem um processo organizado, não só uma consultoria pontual.",
    "مكالمة الانطلاق مخصّصة لمدراء وأصحاب أعمال وجهات مالية يريدون عملية مرتبة وليس استشارة لمرة واحدة.",
  ),
  "עמוד שירותים שנבנה כמו מסמך Scope: טבלאות, תאי בקרה ותחומי אחריות ברורים לכל שלב.": r(
    "A services page built like a scope document: tables, control cells, and clear ownership for every stage.",
    "Una página de servicios construida como un documento de alcance: tablas, celdas de control y responsabilidades claras en cada etapa.",
    "Uma página de serviços construída como um documento de escopo: tabelas, células de controle e responsabilidades claras em cada etapa.",
    "صفحة خدمات مبنية كوثيقة نطاق: جداول وخلايا تحكم ومسؤوليات واضحة لكل مرحلة.",
  ),
  "פרויקטים מוצגים כלוג עבודה: מה הבעיה, מה בוצע, ומה היה השינוי העסקי אחרי הסגירה.": r(
    "Projects are shown as a work log: what the problem was, what was done, and what business change followed close-out.",
    "Los proyectos se muestran como un registro de trabajo: cuál era el problema, qué se hizo y qué cambio de negocio hubo al cerrar.",
    "Os projetos são mostrados como um registro de trabalho: qual era o problema, o que foi feito e qual mudança de negócio veio após o fechamento.",
    "تُعرض المشاريع كسجل عمل: ما المشكلة، ماذا نُفّذ، وما التغيير التجاري بعد الإغلاق.",
  ),

  // Kinetic leftover
  "אימונים שבנויים למדידה ולא לניחוש.": r(
    "Training built for measurement, not guesswork.",
    "Entrenamientos construidos para medir, no para adivinar.",
    "Treinos construídos para medir, não para adivinhar.",
    "تدريبات مبنية للقياس لا للتخمين.",
  ),
  "שילוב בין טכניקה, עומס וקצב בלי בזבוז זמן.": r(
    "A mix of technique, load, and pace with no wasted time.",
    "Una mezcla de técnica, carga y ritmo sin perder tiempo.",
    "Uma mistura de técnica, carga e ritmo sem perder tempo.",
    "مزيج من تقنية وحمل وإيقاع دون إضاعة وقت.",
  ),
  "שפה חזקה שמתורגמת גם לאתר וגם לרצפת הסטודיו.": r(
    "A strong language that translates both to the site and to the studio floor.",
    "Un lenguaje fuerte que se traduce al sitio y al suelo del estudio.",
    "Uma linguagem forte que se traduz no site e no chão do estúdio.",
    "لغة قوية تُترجم إلى الموقع وإلى أرضية الاستوديو.",
  ),
  "עמודים בנויים להנעה מהירה לפעולה.": r(
    "Pages built to drive fast action.",
    "Páginas construidas para impulsar acción rápida.",
    "Páginas construídas para impulsionar ação rápida.",
    "صفحات مبنية لدفع فعل سريع.",
  ),
  "הטמפלט מחזיק מסלולי אימון, לוח שיעורים, קירות תוצאה ודפי יצירת קשר בלי לאבד את שפת המותג.": r(
    "The template holds training tracks, a class board, result walls, and contact pages without losing the brand voice.",
    "La plantilla sostiene recorridos de entrenamiento, un tablero de clases, muros de resultado y páginas de contacto sin perder la voz de marca.",
    "O modelo sustenta percursos de treino, um quadro de aulas, paredes de resultado e páginas de contato sem perder a voz da marca.",
    "القالب يحمل مسارات تدريب ولوح حصص وجدران نتائج وصفحات تواصل دون فقدان لغة العلامة.",
  ),
  "דף יצירת קשר נבנה כמו מסך המרה קשוח: מעט הסחות, הרבה בהירות, והזמנה ברורה לשיעור ניסיון.": r(
    "The contact page is built like a hard conversion screen: few distractions, lots of clarity, and a clear invite to a trial class.",
    "La página de contacto está hecha como una pantalla de conversión dura: pocas distracciones, mucha claridad y una invitación clara a una clase de prueba.",
    "A página de contato é feita como uma tela de conversão dura: poucas distrações, muita clareza e um convite claro para uma aula experimental.",
    "صفحة التواصل مبنية كشاشة تحويل صارمة: تشتيت قليل ووضوح كثير ودعوة واضحة لحصة تجريبية.",
  ),
  "הצלחות, מסלולי התקדמות ושפה תחרותית שממחישה איך העבודה נראית מבפנים ולא רק איך היא משווקת.": r(
    "Wins, progress tracks, and competitive language that show how the work looks from the inside — not only how it is marketed.",
    "Éxitos, recorridos de progreso y un lenguaje competitivo que muestra cómo se ve el trabajo por dentro, no solo cómo se comercializa.",
    "Vitórias, percursos de progresso e uma linguagem competitiva que mostra como o trabalho parece por dentro, não só como é vendido.",
    "نجاحات ومسارات تقدم ولغة تنافسية تُظهر كيف يبدو العمل من الداخل وليس فقط كيف يُسوَّق.",
  ),

  // Citadel leftover
  "פרויקטים נבחרים עם דגש על חוסן, כיסוי בקרות וזמן תגובה מהיר יותר בסביבות סיכון גבוה.": r(
    "Selected projects with a focus on resilience, control coverage, and faster response time in high-risk environments.",
    "Proyectos seleccionados con foco en resiliencia, cobertura de controles y un tiempo de respuesta más rápido en entornos de alto riesgo.",
    "Projetos selecionados com foco em resiliência, cobertura de controles e um tempo de resposta mais rápido em ambientes de alto risco.",
    "مشاريع مختارة بتركيز على الصمود وتغطية الضوابط وزمن استجابة أسرع في بيئات عالية المخاطر.",
  ),
  "מודל תפעול ממושמע שעובר מגילוי חשיפות לחיזוק, אימות ושיפור מתמשך.": r(
    "A disciplined operating model that moves from exposure discovery to hardening, verification, and ongoing improvement.",
    "Un modelo operativo disciplinado que pasa del descubrimiento de exposiciones al refuerzo, la verificación y la mejora continua.",
    "Um modelo operacional disciplinado que passa da descoberta de exposições ao reforço, à verificação e à melhoria contínua.",
    "نموذج تشغيل منضبط ينتقل من اكتشاف التعرضات إلى التعزيز والتحقق والتحسين المستمر.",
  ),
  "ניתוח מעשי לצוותים שצריכים לתדרך הנהלה, לתעדף תיקון ולהישאר לפני סטייה תפעולית.": r(
    "Practical analysis for teams that need to brief leadership, prioritize fixes, and stay ahead of operational drift.",
    "Análisis práctico para equipos que necesitan informar a dirección, priorizar correcciones y adelantarse a la deriva operativa.",
    "Análise prática para equipes que precisam informar a direção, priorizar correções e ficar à frente da deriva operacional.",
    "تحليل عملي لفرق تحتاج إلى إحاطة الإدارة وترتيب أولوية الإصلاح والبقاء أمام الانحراف التشغيلي.",
  ),

  // Travel leftover
  "וילות על הדיונות": r("Villas on the dunes", "Villas sobre las dunas", "Vilas nas dunas", "فيلات على الكثبان"),
  "נוף לים": r("Sea view", "Vista al mar", "Vista para o mar", "إطلالة على البحر"),
  קונסיירז: r("Concierge", "Concierge", "Concierge", "كونسيرج"),
  "קורסים וצלילות": r("Courses and dives", "Cursos e inmersiones", "Cursos e mergulhos", "دورات وغطسات"),
  שחייה: r("Swimming", "Natación", "Natação", "سباحة"),
  "ציר עומק": r("Depth axis", "Eje de profundidad", "Eixo de profundidade", "محور عمق"),
  "ערבי שקיעה": r("Sunset evenings", "Tardes de atardecer", "Noites de pôr do sol", "أمسيات غروب"),
  "מסילת גלשנים": r("A surfboard rail", "Un raíl de tablas", "Um trilho de pranchas", "سكة ألواح"),
  "תחזית גלים היום": r("Today's wave forecast", "Pronóstico de olas de hoy", "Previsão de ondas de hoje", "توقّع الأمواج اليوم"),
  "אואזיס בין מדבר לים": r(
    "An oasis between desert and sea",
    "Un oasis entre desierto y mar",
    "Um oásis entre deserto e mar",
    "واحة بين صحراء وبحر",
  ),
  "תפריט החוף": r("The beach menu", "El menú de la playa", "O cardápio da praia", "قائمة الشاطئ"),
  "מסלולי הפלגה": r("Sailing routes", "Rutas de navegación", "Rotas de navegação", "مسارات إبحار"),
  "מסאז׳ עם שמנים טרופיים.": r(
    "A massage with tropical oils.",
    "Un masaje con aceites tropicales.",
    "Uma massagem com óleos tropicais.",
    "مساج بزيوت استوائية.",
  ),
  "טיפולים טרופיים": r("Tropical treatments", "Tratamientos tropicales", "Tratamentos tropicais", "علاجات استوائية"),
  "250g · גס": r("250g · coarse", "250g · grueso", "250g · grosso", "250g · خشن"),
  "150g · תערובת": r("150g · blend", "150g · mezcla", "150g · mistura", "150g · خلطة"),
  "מוצרי חוף": r("Shore products", "Productos de costa", "Produtos de costa", "منتجات ساحل"),
  "גלריית חוף": r("A beach gallery", "Una galería de playa", "Uma galeria de praia", "معرض شاطئ"),

  // Real-estate leftover chrome (skip personal names)
  "גלריית נכסים קולנועית": r(
    "A cinematic property gallery",
    "Una galería de inmuebles cinematográfica",
    "Uma galeria de imóveis cinematográfica",
    "معرض عقارات سينمائي",
  ),
  "צוות הפרימיום": r("The premium team", "El equipo premium", "A equipe premium", "فريق البريميوم"),
  "תובנות Ticker": r("Ticker insights", "Insights Ticker", "Insights Ticker", "رؤى Ticker"),
  "סינון נכסים": r("Filter properties", "Filtrar inmuebles", "Filtrar imóveis", "تصفية عقارات"),
  "סגירת עסקה": r("Closing a deal", "Cerrar una operación", "Fechar um negócio", "إغلاق صفقة"),
  "תובנות Bento": r("Bento insights", "Insights Bento", "Insights Bento", "رؤى Bento"),
  "מחשבון משכנתא (הדגמה)": r(
    "Mortgage calculator (demo)",
    "Calculadora hipotecaria (demo)",
    "Calculadora de hipoteca (demo)",
    "حاسبة رهن (عرض)",
  ),
  "סכום: ₪2,400,000": r("Amount: ₪2,400,000", "Importe: ₪2,400,000", "Valor: ₪2,400,000", "المبلغ: ₪2,400,000"),
  "ריבית: 4.8%": r("Rate: 4.8%", "Interés: 4.8%", "Juros: 4.8%", "فائدة: 4.8%"),
  "החזר חודשי: ₪12,640": r(
    "Monthly payment: ₪12,640",
    "Cuota mensual: ₪12,640",
    "Parcela mensal: ₪12,640",
    "قسط شهري: ₪12,640",
  ),
  "תובנות Plan": r("Plan insights", "Insights Plan", "Insights Plan", "رؤى Plan"),
  "ליווי מקצועי מהרגע הראשון.": r(
    "Professional guidance from the first moment.",
    "Acompañamiento profesional desde el primer momento.",
    "Acompanhamento profissional desde o primeiro momento.",
    "مرافقة مهنية من اللحظة الأولى.",
  ),
  "שקיפות מלאה בכל שלב.": r(
    "Full transparency at every stage.",
    "Transparencia total en cada etapa.",
    "Transparência total em cada etapa.",
    "شفافية كاملة في كل مرحلة.",
  ),
  "תובנות Vault": r("Vault insights", "Insights Vault", "Insights Vault", "رؤى Vault"),
  "תובנות Block": r("Block insights", "Insights Block", "Insights Block", "رؤى Block"),
  "גובה שמשנה פרספקטיבה.": r(
    "Height that changes perspective.",
    "Una altura que cambia la perspectiva.",
    "Uma altura que muda a perspectiva.",
    "ارتفاع يغيّر المنظور.",
  ),
  קומה: r("Floor", "Planta", "Andar", "طابق"),
  "תובנות Tower": r("Tower insights", "Insights Tower", "Insights Tower", "رؤى Tower"),
  ערים: r("Cities", "Ciudades", "Cidades", "مدن"),
  "תובנות Pin": r("Pin insights", "Insights Pin", "Insights Pin", "رؤى Pin"),
  "תובנות Panel": r("Panel insights", "Insights Panel", "Insights Panel", "رؤى Panel"),
  "מחירים אמיתיים": r("Real prices", "Precios reales", "Preços reais", "أسعار حقيقية"),
  פוטנציאל: r("Potential", "Potencial", "Potencial", "إمكان"),
  "ראו מה אפשר": r("See what is possible", "Ved lo que es posible", "Veja o que é possível", "شاهدوا ما يمكن"),
  "עד סגירה": r("Until closing", "Hasta el cierre", "Até o fechamento", "حتى الإغلاق"),
  "תובנות Slide": r("Slide insights", "Insights Slide", "Insights Slide", "رؤى Slide"),
  השקעה: r("Investment", "Inversión", "Investimento", "استثمار"),
  משופץ: r("Renovated", "Reformado", "Reformado", "مجدَّد"),
  "משאירים פרטים ומקבלים התאמות.": r(
    "Leave details and get matches.",
    "Dejad datos y recibid encajes.",
    "Deixem dados e recebam combinações.",
    "اتركوا تفاصيل واحصلوا على مطابقات.",
  ),
  "שקוף ומוסכם מראש.": r(
    "Transparent and agreed in advance.",
    "Transparente y acordado de antemano.",
    "Transparente e combinado de antemão.",
    "شفاف ومتفق عليه مسبقاً.",
  ),
  "כמה זמן?": r("How long?", "¿Cuánto tiempo?", "Quanto tempo?", "كم من الوقت؟"),
  "בממוצע 42 ימים.": r("42 days on average.", "42 días de media.", "42 dias em média.", "42 يوماً في المتوسط."),
  "תובנות Counter": r("Counter insights", "Insights Counter", "Insights Counter", "رؤى Counter"),
  סינון: r("Filter", "Filtro", "Filtro", "تصفية"),
  סיור: r("Tour", "Visita", "Tour", "جولة"),
  "נכס השבוע": r("Property of the week", "Inmueble de la semana", "Imóvel da semana", "عقار الأسبوع"),
  "תובנות Signet": r("Signet insights", "Insights Signet", "Insights Signet", "رؤى Signet"),
  "תובנות Axis": r("Axis insights", "Insights Axis", "Insights Axis", "رؤى Axis"),
  "דירת גן נווה צדק": r(
    "Garden apartment, Neve Tzedek",
    "Piso jardín, Neve Tzedek",
    "Apartamento jardim, Neve Tzedek",
    "شقة حديقة، نيفيه تسيدك",
  ),
  "לופט יפו העתיקה": r(
    "Loft in Old Jaffa",
    "Loft en Jaffa antigua",
    "Loft na Jaffa antiga",
    "لوفت في يافا القديمة",
  ),
  "פנטהאוז מגדל צפון": r(
    "North tower penthouse",
    "Ático en torre norte",
    "Cobertura na torre norte",
    "بنتهاوس برج الشمال",
  ),
  "לופט קו רכבת": r("Rail-line loft", "Loft junto a la vía", "Loft na linha do trem", "لوفت على خط القطار"),
  "צי יאכטות": r("Yacht fleet", "Flota de yates", "Frota de iates", "أسطول يخوت"),
  קונסierge: r("Concierge", "Concierge", "Concierge", "كونسيرج"),
  "אasis בין מדבר לים": r(
    "An oasis between desert and sea",
    "Un oasis entre desierto y mar",
    "Um oásis entre deserto e mar",
    "واحة بين صحراء وبحر",
  ),
  "פסטה עם קalmari ושרimp.": r(
    "Pasta with calamari and shrimp.",
    "Pasta con calamar y camarones.",
    "Massa com lula e camarão.",
    "باستا مع كالاماري وروبيان.",
  ),
  "גובה שמשנה פרspektיבה.": r(
    "Height that changes perspective.",
    "Una altura que cambia la perspectiva.",
    "Uma altura que muda a perspectiva.",
    "ارتفاع يغيّر المنظور.",
  ),
  "שטח פרטי, מרina view ועיצוב אדריכלי.": r(
    "Private grounds, marina view, and architectural design.",
    "Terreno privado, vista marina y diseño arquitectónico.",
    "Terreno privado, vista da marina e design arquitetônico.",
    "أرض خاصة وإطلالة مارينا وتصميم معماري.",
  ),
  "פנטהאוז מגדל עזrieli": r(
    "Azrieli tower penthouse",
    "Ático en la torre Azrieli",
    "Cobertura na torre Azrieli",
    "بنتهاوس برج عزريئيلي",
  ),
  "מגדל חדש, בריכה וקונcierge.": r(
    "A new tower, a pool, and concierge.",
    "Una torre nueva, piscina y concierge.",
    "Uma torre nova, piscina e concierge.",
    "برج جديد وبركة وكونسيرج.",
  ),
  "דירת גן כפר סבא": r(
    "Garden apartment, Kfar Saba",
    "Piso jardín, Kfar Saba",
    "Apartamento jardim, Kfar Saba",
    "شقة حديقة، كفار سابا",
  ),
  "שבת 09:30 · כפר סבא": r(
    "Saturday 09:30 · Kfar Saba",
    "Sábado 09:30 · Kfar Saba",
    "Sábado 09:30 · Kfar Saba",
    "السبت 09:30 · كفار سابا",
  ),
  "פenthouse ת״א": r("Penthouse, Tel Aviv", "Ático, Tel Aviv", "Cobertura, Tel Aviv", "بنتهاوس، تل أبيب"),
  "דירת 4 ת״א": r("4-room apartment, Tel Aviv", "Piso de 4, Tel Aviv", "Apartamento de 4, Tel Aviv", "شقة 4 غرف، تل أبيب"),
  "סtudio, מרכז, השקעה.": r(
    "Studio, center, investment.",
    "Studio, centro, inversión.",
    "Studio, centro, investimento.",
    "استوديو، مركز، استثمار.",
  ),
  "מרפסת עוטפת, חדר כושר ונוף פanorami.": r(
    "Wraparound balcony, gym, and panoramic view.",
    "Terraza envolvente, gimnasio y vista panorámica.",
    "Varanda envolvente, academia e vista panorâmica.",
    "شرفة محيطة وصالة رياضة وإطلالة بانورامية.",
  ),
  סalון: r("Living room", "Salón", "Sala", "صالة"),
  "דירה נווה צדק": r("Apartment, Neve Tzedek", "Piso, Neve Tzedek", "Apartamento, Neve Tzedek", "شقة، نيفيه تسيدك"),
  "נווה צדק · 4 חד׳": r("Neve Tzedek · 4 rooms", "Neve Tzedek · 4 hab.", "Neve Tzedek · 4 quartos", "نيفيه تسيدك · 4 غرف"),
  "פlorian · 3 חד׳": r("Florian · 3 rooms", "Florian · 3 hab.", "Florian · 3 quartos", "Florian · 3 غرف"),
  "רamat aviv · 5 חד׳": r("Ramat Aviv · 5 rooms", "Ramat Aviv · 5 hab.", "Ramat Aviv · 5 quartos", "رمات أبيب · 5 غرف"),
  "יפו · 4 חד׳": r("Jaffa · 4 rooms", "Jaffa · 4 hab.", "Jaffa · 4 quartos", "يافا · 4 غرف"),
  הצעד_הבא: r("NEXT_STEP", "SIGUIENTE_PASO", "PROXIMO_PASSO", "الخطوة_التالية"),
  צור_קשר: r("CONTACT", "CONTACTO", "CONTATO", "تواصل"),
  אות: r("Mark", "Marca", "Marca", "علامة"),
  חברה: r("Company", "Empresa", "Empresa", "شركة"),
  נוף: r("View", "Vista", "Vista", "إطلالة"),
  משופץ: r("Renovated", "Reformado", "Reformado", "مجدَّد"),
  "איך מתחילים?": r("How do we start?", "¿Cómo se empieza?", "Como começamos?", "كيف نبدأ؟"),
  "מה העמלה?": r("What is the fee?", "¿Cuál es la comisión?", "Qual é a comissão?", "ما العمولة؟"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique61.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique61 rows`);
