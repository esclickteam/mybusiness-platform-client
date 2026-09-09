/**
 * unique42 — built-in Wantravel/Lexora seed copy for fresh preview.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, and place-only labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "חופשות בוטיק בהתאמה אישית": r(
    "Boutique trips, tailored for you",
    "Viajes boutique a tu medida",
    "Viagens boutique sob medida",
    "رحلات بوتيك مفصلة لكم",
  ),
  "חופשה שמרגישה כאילו נתפרה רק בשבילך": r(
    "A trip that feels tailored just for you",
    "Un viaje que se siente hecho solo para ti",
    "Uma viagem que parece feita só para você",
    "إجازة تشعر كأنها فُصّلت لكم وحدكم",
  ),
  "תכנון נסיעות יוקרתי, חכם ומדויק — מטיסות ומלונות ועד מסלולים, חוויות, אטרקציות וליווי אישי.":
    r(
      "Luxury, smart, precise travel planning — from flights and hotels to itineraries, experiences, attractions, and personal support.",
      "Planificación de viajes de lujo, inteligente y precisa — de vuelos y hoteles a itinerarios, experiencias, atracciones y acompañamiento personal.",
      "Planejamento de viagens de luxo, inteligente e preciso — de voos e hotéis a roteiros, experiências, atrações e acompanhamento pessoal.",
      "تخطيط سفر فاخر وذكي ودقيق — من الطيران والفنادق حتى المسارات والتجارب والمعالم والمرافقة الشخصية.",
    ),
  "בואו נבנה מסלול": r("Let's build an itinerary", "Construyamos un itinerario", "Vamos montar um roteiro", "لنبنِ مساراً"),
  "לראות יעדים": r("See destinations", "Ver destinos", "Ver destinos", "رؤية الوجهات"),
  "נסיעות שמתחילות ברעיון ומסתיימות בחוויה בלתי נשכחת": r(
    "Trips that start as an idea and end as an unforgettable experience",
    "Viajes que empiezan como una idea y terminan en una experiencia inolvidable",
    "Viagens que começam como ideia e terminam em uma experiência inesquecível",
    "رحلات تبدأ كفكرة وتنتهي كتجربة لا تُنسى",
  ),
  "חבילות נבחרות, יעדים טרנדיים, שירות אישי ונראות יוקרתית שמתאימה לסוכנות נסיעות מודרנית.":
    r(
      "Selected packages, trending destinations, personal service, and a luxury look that fits a modern travel agency.",
      "Paquetes seleccionados, destinos de tendencia, servicio personal y una imagen de lujo que encaja en una agencia moderna.",
      "Pacotes selecionados, destinos em alta, serviço pessoal e um visual de luxo que cabe em uma agência moderna.",
      "باقات مختارة ووجهات رائجة وخدمة شخصية ومظهر فاخر يناسب وكالة سفر حديثة.",
    ),
  "יעדים בעולם": r("Destinations worldwide", "Destinos en el mundo", "Destinos no mundo", "وجهات حول العالم"),
  "מטיילים מרוצים": r("Happy travelers", "Viajeros satisfechos", "Viajantes satisfeitos", "مسافرون راضون"),
  "חופשות פרימיום": r("Premium trips", "Viajes premium", "Viagens premium", "رحلات فاخرة"),
  "ירח דבש": r("Honeymoon", "Luna de miel", "Lua de mel", "شهر عسل"),
  "טיולים משפחתיים": r("Family trips", "Viajes familiares", "Viagens em família", "رحلات عائلية"),
  "יעדים אקזוטיים": r("Exotic destinations", "Destinos exóticos", "Destinos exóticos", "وجهات استوائية"),
  "מסלולים מותאמים אישית": r("Custom itineraries", "Itinerarios a medida", "Roteiros sob medida", "مسارات مفصلة"),
  "יעדים נבחרים": r("Selected destinations", "Destinos seleccionados", "Destinos selecionados", "وجهات مختارة"),
  "מקומות שמתחילים בתמונה ומסתיימים בזיכרון": r(
    "Places that start as a photo and end as a memory",
    "Lugares que empiezan en una foto y terminan en un recuerdo",
    "Lugares que começam numa foto e terminam numa memória",
    "أماكن تبدأ بصورة وتنتهي كذكرى",
  ),
  "מבחר יעדים אהובים במיוחד עם התאמה לזוגות, משפחות, חופשות יוקרה, נופש רגוע או חוויה מלאה באקשן.":
    r(
      "A mix of especially loved destinations, matched for couples, families, luxury trips, a calm getaway, or a full action experience.",
      "Una selección de destinos especialmente queridos, adaptada a parejas, familias, viajes de lujo, un descanso sereno o una experiencia llena de acción.",
      "Uma seleção de destinos especialmente queridos, adaptada a casais, famílias, viagens de luxo, um descanso sereno ou uma experiência cheia de ação.",
      "مجموعة وجهات محبوبة جداً مع ملاءمة للأزواج والعائلات ورحلات الفخامة واستجمام هادئ أو تجربة مليئة بالحركة.",
    ),
  רומנטי: r("Romantic", "Romántico", "Romântico", "رومانسي"),
  טרופי: r("Tropical", "Tropical", "Tropical", "استوائي"),
  "חבילות מומלצות": r("Recommended packages", "Paquetes recomendados", "Pacotes recomendados", "باقات موصى بها"),
  "תכנון חכם. חוויה מלאה.": r(
    "Smart planning. Full experience.",
    "Planificación inteligente. Experiencia completa.",
    "Planejamento inteligente. Experiência completa.",
    "تخطيط ذكي. تجربة كاملة.",
  ),
  "חבילות לדוגמה שממחישות את איכות השירות, רמת התכנון והנראות המקצועית של סוכנות הנסיעות שלך.":
    r(
      "Sample packages that show the service quality, planning level, and professional look of your travel agency.",
      "Paquetes de ejemplo que muestran la calidad del servicio, el nivel de planificación y la imagen profesional de tu agencia.",
      "Pacotes de exemplo que mostram a qualidade do serviço, o nível de planejamento e a imagem profissional da sua agência.",
      "باقات نموذجية توضح جودة الخدمة ومستوى التخطيط والمظهر المهني لوكالة السفر الخاصة بك.",
    ),
  "חופשה זוגית חלומית": r("Dream couples trip", "Viaje de pareja soñado", "Viagem de casal dos sonhos", "إجازة زوجية حالمة"),
  "מלונות בוטיק": r("Boutique hotels", "Hoteles boutique", "Hotéis boutique", "فنادق بوتيك"),
  "מסלול מותאם אישית": r("Custom itinerary", "Itinerario a medida", "Roteiro sob medida", "مسار مفصل"),
  "ליווי לפני הטיסה": r("Pre-flight support", "Acompañamiento antes del vuelo", "Acompanhamento antes do voo", "مرافقة قبل الرحلة"),
  "טיול משפחתי מאורגן": r("Organized family trip", "Viaje familiar organizado", "Viagem familiar organizada", "رحلة عائلية منظمة"),
  "אטרקציות לילדים": r("Attractions for kids", "Atracciones para niños", "Atrações para crianças", "معالم للأطفال"),
  "טיסות ומלונות": r("Flights and hotels", "Vuelos y hoteles", "Voos e hotéis", "طيران وفنادق"),
  "תכנון מלא": r("Full planning", "Planificación completa", "Planejamento completo", "تخطيط كامل"),
  "מסע אקזוטי": r("Exotic journey", "Viaje exótico", "Jornada exótica", "رحلة استوائية"),
  "חופים פרטיים": r("Private beaches", "Playas privadas", "Praias privativas", "شواطئ خاصة"),
  "חוויות מקומיות": r("Local experiences", "Experiencias locales", "Experiências locais", "تجارب محلية"),
  "העברות ונציגות": r("Transfers and local desk", "Traslados y representación", "Transfers e representação", "تنقلات وتمثيل محلي"),
  "תהליך פשוט שנראה ומרגיש פרימיום": r(
    "A simple process that looks and feels premium",
    "Un proceso simple que se ve y se siente premium",
    "Um processo simples que parece e se sente premium",
    "عملية بسيطة تبدو وتشعر بالفخامة",
  ),
  "המטרה היא לתת לעסק תבנית יוקרתית ומקצועית, שנראית מעולה ומובילה לפניות, השארת פרטים ותכנון חופשה.":
    r(
      "The goal is to give the business a luxury, professional template that looks excellent and leads to inquiries, details, and trip planning.",
      "El objetivo es dar al negocio una plantilla de lujo y profesional, que se vea excelente y lleve a consultas, datos y planificación de viaje.",
      "O objetivo é dar ao negócio um modelo de luxo e profissional, que pareça excelente e leve a consultas, dados e planejamento de viagem.",
      "الهدف إعطاء العمل قالباً فاخراً ومهنياً يبدو ممتازاً ويؤدي إلى استفسارات وترك تفاصيل وتخطيط إجازة.",
    ),
  "שיחת התאמה": r("Fit call", "Llamada de encaje", "Chamada de encaixe", "مكالمة ملاءمة"),
  "מבינים את התקציב, הסגנון, היעד והחוויה שהלקוח רוצה לקבל.": r(
    "We understand the budget, style, destination, and experience the client wants.",
    "Entendemos el presupuesto, el estilo, el destino y la experiencia que el cliente quiere.",
    "Entendemos o orçamento, o estilo, o destino e a experiência que o cliente quer.",
    "نفهم الميزانية والأسلوب والوجهة والتجربة التي يريدها الزبون.",
  ),
  "בניית מסלול": r("Build the itinerary", "Construir el itinerario", "Montar o roteiro", "بناء المسار"),
  "יוצרים תכנון חכם עם מלונות, טיסות, יעדים, המלצות וחוויות.": r(
    "We create smart planning with hotels, flights, destinations, recommendations, and experiences.",
    "Creamos una planificación inteligente con hoteles, vuelos, destinos, recomendaciones y experiencias.",
    "Criamos um planejamento inteligente com hotéis, voos, destinos, recomendações e experiências.",
    "نصنع تخطيطاً ذكياً مع فنادق وطيران ووجهات وتوصيات وتجارب.",
  ),
  "סגירה וליווי": r("Close and support", "Cierre y acompañamiento", "Fechamento e acompanhamento", "إغلاق ومرافقة"),
  "מרכזים את כל הפרטים במקום אחד ומלווים את הלקוח עד החזרה.": r(
    "We gather every detail in one place and support the client until they return.",
    "Reunimos todos los detalles en un lugar y acompañamos al cliente hasta el regreso.",
    "Reunimos todos os detalhes em um lugar e acompanhamos o cliente até a volta.",
    "نجمع كل التفاصيل في مكان واحد ونرافق الزبون حتى العودة.",
  ),
  "לקוחות אוהבים חוויות שמרגישות מדויקות": r(
    "Clients love experiences that feel precise",
    "Los clientes aman experiencias que se sienten precisas",
    "Os clientes amam experiências que parecem precisas",
    "الزبائن يحبون تجارب تشعر بالدقة",
  ),
  "הכול היה מתוקתק, רגוע ומדויק. הרגשנו שמישהו באמת תכנן לנו את החופשה כאילו זו החופשה שלו.":
    r(
      "Everything was tight, calm, and precise. We felt someone really planned the trip as if it were their own.",
      "Todo estuvo ordenado, sereno y preciso. Sentimos que alguien realmente planificó el viaje como si fuera el suyo.",
      "Tudo esteve arrumado, sereno e preciso. Sentimos que alguém realmente planejou a viagem como se fosse a dele.",
      "كان كل شيء مرتباً وهادئاً ودقيقاً. شعرنا أن أحداً خطط الإجازة حقاً وكأنها إجازته.",
    ),
  "פעם ראשונה שלא היינו צריכים לרדוף אחרי מלונות, טיסות ואטרקציות. הכול היה במקום אחד.":
    r(
      "The first time we did not have to chase hotels, flights, and attractions. Everything was in one place.",
      "La primera vez que no tuvimos que perseguir hoteles, vuelos y atracciones. Todo estaba en un lugar.",
      "A primeira vez que não precisamos correr atrás de hotéis, voos e atrações. Tudo estava em um lugar.",
      "أول مرة لم نحتج فيها لملاحقة الفنادق والطيران والمعالم. كان كل شيء في مكان واحد.",
    ),
  "מתחילים מכאן": r("Start here", "Empieza aquí", "Comece aqui", "ابدأوا من هنا"),
  "בואו נתכנן את החופשה הבאה שלכם": r(
    "Let's plan your next trip",
    "Planifiquemos tu próximo viaje",
    "Vamos planejar a próxima viagem de vocês",
    "لنخطط إجازتكم القادمة",
  ),
  "אזור השארת פרטים שמתאים להמרה — עם מקום לשם, טלפון, יעד מבוקש והודעה חופשית.":
    r(
      "A details area built for conversion — with room for name, phone, desired destination, and a free message.",
      "Un área de datos pensada para convertir — con espacio para nombre, teléfono, destino deseado y un mensaje libre.",
      "Uma área de dados pensada para converter — com espaço para nome, telefone, destino desejado e uma mensagem livre.",
      "منطقة لترك التفاصيل مناسبة للتحويل — مع مكان للاسم والهاتف والوجهة المطلوبة ورسالة حرّة.",
    ),
  "ליווי לפני, במהלך ואחרי": r(
    "Support before, during, and after",
    "Acompañamiento antes, durante y después",
    "Acompanhamento antes, durante e depois",
    "مرافقة قبل وأثناء وبعد",
  ),
  "התאמה לפי תקציב, סגנון ויעד": r(
    "Matched by budget, style, and destination",
    "Ajuste según presupuesto, estilo y destino",
    "Ajuste conforme orçamento, estilo e destino",
    "ملاءمة حسب الميزانية والأسلوب والوجهة",
  ),
  "תבנית תיירות יוקרתית לביזאפלי": r(
    "A luxury travel template for BizUply",
    "Una plantilla de turismo de lujo para BizUply",
    "Um modelo de turismo de luxo para o BizUply",
    "قالب سياحة فاخر لبيزابلي",
  ),
  "משרד עורכי דין": r("Law firm", "Despacho de abogados", "Escritório de advocacia", "مكتب محاماة"),
  "ייעוץ משפטי אסטרטגי": r(
    "Strategic legal advice",
    "Asesoría jurídica estratégica",
    "Consultoria jurídica estratégica",
    "استشارة قانونية استراتيجية",
  ),
  "סטנדרט גבוה יותר לליווי משפטי": r(
    "A higher standard of legal support",
    "Un estándar más alto de acompañamiento jurídico",
    "Um padrão mais alto de acompanhamento jurídico",
    "معيار أعلى للمرافقة القانونية",
  ),
  "משרד עורכי דין מודרני המשלב דיוק משפטי, חשיבה עסקית וליווי אישי בתיקים מסחריים, מקרקעין, חוזים וליטיגציה.":
    r(
      "A modern law firm that combines legal precision, business thinking, and personal support in commercial cases, real estate, contracts, and litigation.",
      "Un despacho moderno que combina precisión jurídica, pensamiento de negocio y acompañamiento personal en casos comerciales, inmobiliario, contratos y litigación.",
      "Um escritório moderno que combina precisão jurídica, pensamento de negócio e acompanhamento pessoal em casos comerciais, imóveis, contratos e litigância.",
      "مكتب محاماة حديث يجمع الدقة القانونية والتفكير التجاري والمرافقة الشخصية في القضايا التجارية والعقارات والعقود والتقاضي.",
    ),
  "קביעת ייעוץ": r("Book a consultation", "Reservar una consulta", "Marcar uma consulta", "حجز استشارة"),
  "תיקים שטופלו": r("Cases handled", "Casos tratados", "Casos tratados", "قضايا عولجت"),
  "משפט, אסטרטגיה ודיוק עסקי תחת קורת גג אחת": r(
    "Law, strategy, and business precision under one roof",
    "Derecho, estrategia y precisión de negocio bajo un mismo techo",
    "Direito, estratégia e precisão de negócio sob o mesmo teto",
    "قانون واستراتيجية ودقة أعمال تحت سقف واحد",
  ),
  "אנחנו מלווים לקוחות פרטיים, חברות ויזמים בהחלטות משפטיות מורכבות — מהשלב הראשוני ועד סגירת ההליך בצורה ברורה, מסודרת ומקצועית.":
    r(
      "We support private clients, companies, and founders through complex legal decisions — from the first step to closing the matter clearly, in order, and professionally.",
      "Acompañamos a clientes particulares, empresas y emprendedores en decisiones jurídicas complejas — desde el primer paso hasta el cierre del procedimiento de forma clara, ordenada y profesional.",
      "Acompanhamos clientes particulares, empresas e empreendedores em decisões jurídicas complexas — do primeiro passo até o fechamento do processo de forma clara, organizada e profissional.",
      "نرافق الزبائن الخاصين والشركات وروّاد الأعمال في قرارات قانونية معقّدة — من المرحلة الأولى حتى إغلاق الإجراء بوضوح وترتيب ومهنية.",
    ),
  "שירותים משפטיים לעולם עסקי משתנה": r(
    "Legal services for a changing business world",
    "Servicios jurídicos para un mundo de negocios que cambia",
    "Serviços jurídicos para um mundo de negócios em mudança",
    "خدمات قانونية لعالم أعمال متغيّر",
  ),
  "ייעוץ וליווי משפטי ללקוחות שצריכים בהירות, זמינות, אחריות ופתרונות מעשיים.":
    r(
      "Legal advice and support for clients who need clarity, availability, responsibility, and practical solutions.",
      "Asesoría y acompañamiento jurídico para clientes que necesitan claridad, disponibilidad, responsabilidad y soluciones prácticas.",
      "Consultoria e acompanhamento jurídico para clientes que precisam de clareza, disponibilidade, responsabilidade e soluções práticas.",
      "استشارة ومرافقة قانونية لزبائن يحتاجون وضوحاً وتوفراً ومسؤولية وحلولاً عملية.",
    ),
  "משפט מסחרי וחוזים": r(
    "Commercial law and contracts",
    "Derecho comercial y contratos",
    "Direito comercial e contratos",
    "قانون تجاري وعقود",
  ),
  "ניסוח, בדיקה וניהול משא ומתן בהסכמים מסחריים, שותפויות, ספקים ולקוחות.":
    r(
      "Drafting, review, and negotiation of commercial agreements, partnerships, suppliers, and clients.",
      "Redacción, revisión y negociación de acuerdos comerciales, sociedades, proveedores y clientes.",
      "Redação, revisão e negociação de acordos comerciais, sociedades, fornecedores e clientes.",
      "صياغة ومراجعة وإدارة تفاوض في اتفاقيات تجارية وشراكات ومورّدين وزبائن.",
    ),
  "160+ הסכמים": r("160+ agreements", "160+ acuerdos", "160+ acordos", "160+ اتفاقية"),
  "מקרקעין ונדל״ן": r("Real estate", "Inmobiliario", "Imóveis", "عقارات"),
  "ליווי עסקאות רכישה, מכירה, שכירות, בדיקות משפטיות וניהול סיכונים.":
    r(
      "Support for purchase, sale, and lease deals, legal checks, and risk management.",
      "Acompañamiento en compras, ventas, alquileres, revisiones jurídicas y gestión de riesgos.",
      "Acompanhamento em compras, vendas, locações, revisões jurídicas e gestão de riscos.",
      "مرافقة صفقات شراء وبيع وإيجار وفحوصات قانونية وإدارة مخاطر.",
    ),
  "90+ עסקאות": r("90+ deals", "90+ operaciones", "90+ negócios", "90+ صفقة"),
  "ליטיגציה ויישוב סכסוכים": r(
    "Litigation and dispute resolution",
    "Litigación y resolución de conflictos",
    "Litigância e resolução de conflitos",
    "تقاضي وتسوية نزاعات",
  ),
  "ייצוג בהליכים משפטיים, מכתבי התראה, משא ומתן והסכמי פשרה.": r(
    "Representation in legal proceedings, demand letters, negotiation, and settlement agreements.",
    "Representación en procedimientos, cartas de requerimiento, negociación y acuerdos de conciliación.",
    "Representação em procedimentos, cartas de notificação, negociação e acordos de conciliação.",
    "تمثيل في إجراءات قانونية ورسائل إنذار وتفاوض واتفاقيات تسوية.",
  ),
  "120+ הליכים": r("120+ matters", "120+ procedimientos", "120+ processos", "120+ إجراء"),
  "ליווי חברות ויזמים": r(
    "Support for companies and founders",
    "Acompañamiento a empresas y emprendedores",
    "Acompanhamento a empresas e empreendedores",
    "مرافقة شركات وروّاد أعمال",
  ),
  "ייעוץ שוטף לחברות, הקמה, מסמכי מדיניות, שותפויות והסכמי השקעה.":
    r(
      "Ongoing advice for companies, formation, policy documents, partnerships, and investment agreements.",
      "Asesoría continua a empresas, constitución, documentos de política, sociedades y acuerdos de inversión.",
      "Consultoria contínua a empresas, constituição, documentos de política, sociedades e acordos de investimento.",
      "استشارة مستمرة للشركات والتأسيس ووثائق السياسة والشراكات واتفاقيات الاستثمار.",
    ),
  "75+ חברות": r("75+ companies", "75+ empresas", "75+ empresas", "75+ شركة"),
  "תוצאות שנבנו מתוך אסטרטגיה משפטית מדויקת": r(
    "Results built from a precise legal strategy",
    "Resultados construidos desde una estrategia jurídica precisa",
    "Resultados construídos a partir de uma estratégia jurídica precisa",
    "نتائج بُنيت من استراتيجية قانونية دقيقة",
  ),
  "דוגמאות לתחומי טיפול, תהליכים ותוצאות שממחישים את אופי העבודה של המשרד.":
    r(
      "Examples of practice areas, processes, and results that show how the firm works.",
      "Ejemplos de áreas de tratamiento, procesos y resultados que muestran el carácter del despacho.",
      "Exemplos de áreas de atuação, processos e resultados que mostram o jeito do escritório.",
      "أمثلة لمجالات المعالجة والعمليات والنتائج التي توضح طبيعة عمل المكتب.",
    ),
  "ליווי עסקת נדל״ן מורכבת": r(
    "Support on a complex real-estate deal",
    "Acompañamiento de una operación inmobiliaria compleja",
    "Acompanhamento de um negócio imobiliário complexo",
    "مرافقة صفقة عقارية معقّدة",
  ),
  מקרקעין: r("Real estate", "Inmobiliario", "Imóveis", "عقارات"),
  "11 שבועות": r("11 weeks", "11 semanas", "11 semanas", "11 أسبوعاً"),
  "העסקה הושלמה": r("Deal completed", "Operación completada", "Negócio concluído", "أُنجزت الصفقة"),
  "בדיקות משפטיות, ניהול משא ומתן והשלמת עסקה מסחרית תחת לוחות זמנים צפופים.":
    r(
      "Legal checks, negotiation, and completing a commercial deal under tight timelines.",
      "Revisiones jurídicas, negociación y cierre de una operación comercial bajo plazos ajustados.",
      "Revisões jurídicas, negociação e conclusão de um negócio comercial sob prazos apertados.",
      "فحوصات قانونية وإدارة تفاوض وإتمام صفقة تجارية تحت جداول زمنية ضيقة.",
    ),
  "הסכם שותפים לחברת שירותים": r(
    "A partners agreement for a services company",
    "Un acuerdo de socios para una empresa de servicios",
    "Um acordo de sócios para uma empresa de serviços",
    "اتفاق شركاء لشركة خدمات",
  ),
  מסחרי: r("Commercial", "Comercial", "Comercial", "تجاري"),
  "4 שבועות": r("4 weeks", "4 semanas", "4 semanas", "4 أسابيع"),
  "הסכם נחתם": r("Agreement signed", "Acuerdo firmado", "Acordo assinado", "وُقّع الاتفاق"),
  "בניית מנגנוני הגנה, חלוקת אחריות, סודיות, יציאה מהשותפות ומניעת מחלוקות עתידיות.":
    r(
      "Building protection mechanisms, splitting responsibility, confidentiality, exit terms, and preventing future disputes.",
      "Construir mecanismos de protección, reparto de responsabilidad, confidencialidad, salida de la sociedad y prevención de conflictos futuros.",
      "Construir mecanismos de proteção, divisão de responsabilidade, confidencialidade, saída da sociedade e prevenção de conflitos futuros.",
      "بناء آليات حماية وتقسيم مسؤولية وسرية وخروج من الشراكة ومنع خلافات مستقبلية.",
    ),
  "סכסוך עסקי שהסתיים בפשרה": r(
    "A business dispute that ended in settlement",
    "Un conflicto empresarial que terminó en conciliación",
    "Um conflito empresarial que terminou em acordo",
    "نزاع تجاري انتهى بتسوية",
  ),
  ליטיגציה: r("Litigation", "Litigación", "Litigância", "تقاضي"),
  "8 שבועות": r("8 weeks", "8 semanas", "8 semanas", "8 أسابيع"),
  "פשרה מאושרת": r("Settlement approved", "Conciliación aprobada", "Acordo aprovado", "تسوية معتمدة"),
  "ניתוח משפטי, בניית טקטיקת משא ומתן והגעה לפתרון שחסך הליך ממושך.":
    r(
      "Legal analysis, a negotiation tactic, and reaching a solution that avoided a long proceeding.",
      "Análisis jurídico, una táctica de negociación y llegar a una solución que evitó un procedimiento largo.",
      "Análise jurídica, uma tática de negociação e chegar a uma solução que evitou um processo longo.",
      "تحليل قانوني وبناء تكتيك تفاوض والوصول إلى حل وفّر إجراءً طويلاً.",
    ),
  "בהירות, סדר ואסטרטגיה מהרגע הראשון": r(
    "Clarity, order, and strategy from the first moment",
    "Claridad, orden y estrategia desde el primer momento",
    "Clareza, ordem e estratégia desde o primeiro momento",
    "وضوح وترتيب واستراتيجية من اللحظة الأولى",
  ),
  "כל תיק מתחיל באבחון משפטי ברור, ממשיך בתכנון מסודר ומסתיים בפעולה מדויקת מול הצד השני, הרשות או בית המשפט.":
    r(
      "Every case starts with a clear legal diagnosis, continues with organized planning, and ends in precise action toward the other party, the authority, or the court.",
      "Cada caso empieza con un diagnóstico jurídico claro, sigue con planificación ordenada y termina en una acción precisa frente a la otra parte, la autoridad o el tribunal.",
      "Cada caso começa com um diagnóstico jurídico claro, segue com planejamento organizado e termina em uma ação precisa diante da outra parte, da autoridade ou do tribunal.",
      "كل قضية تبدأ بتشخيص قانوني واضح، تستمر بتخطيط مرتّب وتنتهي بفعل دقيق أمام الطرف الآخر أو السلطة أو المحكمة.",
    ),
  "אבחון משפטי": r("Legal diagnosis", "Diagnóstico jurídico", "Diagnóstico jurídico", "تشخيص قانوني"),
  "מבינים את המצב, המסמכים, הסיכונים והיעד הרצוי.": r(
    "We understand the situation, the documents, the risks, and the desired outcome.",
    "Entendemos la situación, los documentos, los riesgos y el objetivo deseado.",
    "Entendemos a situação, os documentos, os riscos e o objetivo desejado.",
    "نفهم الوضع والمستندات والمخاطر والهدف المطلوب.",
  ),
  "בניית אסטרטגיה": r("Build the strategy", "Construir la estrategia", "Construir a estratégia", "بناء الاستراتيجية"),
  "מגדירים דרך פעולה, לוחות זמנים, חלופות משפטיות וסיכויי הצלחה.": r(
    "We define a course of action, timelines, legal alternatives, and chances of success.",
    "Definimos una vía de acción, plazos, alternativas jurídicas y chances de éxito.",
    "Definimos um caminho de ação, prazos, alternativas jurídicas e chances de sucesso.",
    "نحدد مسار عمل وجداول زمنية وبدائل قانونية وفرص نجاح.",
  ),
  "ביצוע וליווי": r("Execution and support", "Ejecución y acompañamiento", "Execução e acompanhamento", "تنفيذ ومرافقة"),
  "מטפלים בהתכתבויות, חוזים, משא ומתן או ייצוג — עם עדכונים שוטפים.": r(
    "We handle correspondence, contracts, negotiation, or representation — with ongoing updates.",
    "Tratamos correspondencia, contratos, negociación o representación — con actualizaciones constantes.",
    "Cuidamos de correspondência, contratos, negociação ou representação — com atualizações contínuas.",
    "نعالج المراسلات والعقود والتفاوض أو التمثيل — مع تحديثات مستمرة.",
  ),
  הצוות: r("The team", "El equipo", "A equipe", "الفريق"),
  "אנשי מקצוע שמדברים משפטית וחושבים עסקית": r(
    "Professionals who speak legally and think commercially",
    "Profesionales que hablan en jurídico y piensan en negocio",
    "Profissionais que falam juridicamente e pensam em negócio",
    "محترفون يتحدثون قانونياً ويفكرون تجارياً",
  ),
  "הגישה שלנו משלבת מקצועיות משפטית, זמינות גבוהה ויכולת להסביר ללקוח את המצב בצורה פשוטה וברורה.":
    r(
      "Our approach combines legal professionalism, high availability, and the ability to explain the situation to the client in a simple, clear way.",
      "Nuestra aproximación combina profesionalidad jurídica, alta disponibilidad y la capacidad de explicar al cliente la situación de forma simple y clara.",
      "Nossa abordagem combina profissionalismo jurídico, alta disponibilidade e a capacidade de explicar ao cliente a situação de forma simples e clara.",
      "نهجنا يجمع المهنية القانونية والتوفر العالي والقدرة على شرح الوضع للزبون بشكل بسيط وواضح.",
    ),
  "שותף מייסד": r("Founding partner", "Socio fundador", "Sócio fundador", "شريك مؤسس"),
  "איך מתחילים טיפול משפטי?": r(
    "How do you start a legal matter?",
    "¿Cómo se empieza un asunto jurídico?",
    "Como se começa um assunto jurídico?",
    "كيف تبدأون معالجة قانونية؟",
  ),
  "מתחילים בפגישת ייעוץ שבה בודקים את המסמכים, מגדירים את הבעיה ומחליטים על דרך פעולה.":
    r(
      "We start with a consultation where we review the documents, define the problem, and decide on a course of action.",
      "Empezamos con una reunión de consulta en la que revisamos los documentos, definimos el problema y decidimos una vía de acción.",
      "Começamos com uma reunião de consulta em que revisamos os documentos, definimos o problema e decidimos um caminho de ação.",
      "نبدأ بجلسة استشارة نراجع فيها المستندات ونحدّد المشكلة ونقرر مسار العمل.",
    ),
  "האם ניתן לקבל ליווי שוטף לעסק?": r(
    "Can a business get ongoing support?",
    "¿Se puede recibir acompañamiento continuo para el negocio?",
    "Dá para receber acompanhamento contínuo para o negócio?",
    "هل يمكن الحصول على مرافقة مستمرة للعمل؟",
  ),
  "כן. המשרד מעניק ליווי משפטי שוטף לחברות, עצמאים ויזמים לפי צורך חודשי או לפי פרויקט.":
    r(
      "Yes. The firm provides ongoing legal support for companies, independents, and founders on a monthly or project basis.",
      "Sí. El despacho ofrece acompañamiento jurídico continuo a empresas, autónomos y emprendedores según necesidad mensual o por proyecto.",
      "Sim. O escritório oferece acompanhamento jurídico contínuo a empresas, autônomos e empreendedores conforme necessidade mensal ou por projeto.",
      "نعم. يقدّم المكتب مرافقة قانونية مستمرة للشركات والمستقلين وروّاد الأعمال حسب حاجة شهرية أو حسب مشروع.",
    ),
  "כמה זמן נמשך תהליך משפטי?": r(
    "How long does a legal process take?",
    "¿Cuánto dura un proceso jurídico?",
    "Quanto tempo dura um processo jurídico?",
    "كم يستغرق إجراء قانوني؟",
  ),
  "זה תלוי בתחום ובמורכבות. לאחר אבחון ראשוני ניתן לקבל הערכת זמן ריאלית וברורה.":
    r(
      "It depends on the area and the complexity. After an initial diagnosis you can get a realistic, clear time estimate.",
      "Depende del área y de la complejidad. Tras un diagnóstico inicial se puede obtener una estimación de tiempo realista y clara.",
      "Depende da área e da complexidade. Após um diagnóstico inicial dá para obter uma estimativa de tempo realista e clara.",
      "يعتمد على المجال والتعقيد. بعد تشخيص أولي يمكن الحصول على تقدير زمني واقعي وواضح.",
    ),
  "האם הפגישה הראשונית מחייבת?": r(
    "Is the first meeting binding?",
    "¿La primera reunión es vinculante?",
    "A primeira reunião é vinculante?",
    "هل الاجتماع الأول مُلزم؟",
  ),
  "לא. מטרת הפגישה היא להבין את המצב, להסביר אפשרויות ולתת כיוון ראשוני.":
    r(
      "No. The meeting is meant to understand the situation, explain options, and give an initial direction.",
      "No. El objetivo de la reunión es entender la situación, explicar opciones y dar una dirección inicial.",
      "Não. O objetivo da reunião é entender a situação, explicar opções e dar uma direção inicial.",
      "لا. هدف الاجتماع فهم الوضع وشرح الخيارات وإعطاء اتجاه أولي.",
    ),
  "ייעוץ ראשוני": r("Initial consultation", "Consulta inicial", "Consulta inicial", "استشارة أولية"),
  "צריכים החלטה משפטית ברורה?": r(
    "Need a clear legal decision?",
    "¿Necesitas una decisión jurídica clara?",
    "Precisa de uma decisão jurídica clara?",
    "تحتاجون قراراً قانونياً واضحاً؟",
  ),
  "השאירו פרטים ונחזור אליכם לתיאום פגישת ייעוץ עם עורך דין מתאים מהמשרד.":
    r(
      "Leave your details and we will get back to you to book a consultation with the right attorney from the firm.",
      "Deja tus datos y te responderemos para coordinar una reunión de consulta con un abogado adecuado del despacho.",
      "Deixe seus dados e voltaremos para agendar uma reunião de consulta com um advogado adequado do escritório.",
      "اتركوا التفاصيل وسنعود إليكم لتنسيق اجتماع استشارة مع محامٍ مناسب من المكتب.",
    ),
  "תבנית משפטית יוקרתית בעברית לביזאפלי": r(
    "A luxury legal template for BizUply",
    "Una plantilla jurídica de lujo para BizUply",
    "Um modelo jurídico de luxo para o BizUply",
    "قالب قانوني فاخر لبيزابلي",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique42.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique42 rows`);
