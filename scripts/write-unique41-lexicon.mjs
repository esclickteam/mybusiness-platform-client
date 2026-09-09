/**
 * unique41 — leftover gallery-template preview chrome after unique40.
 * Clean indented tx() keys plus Serenova/Wantravel/Lexora hardcoded inner-page,
 * nav, form, and first-screen copy. Skip personal names, streets, cities,
 * Admin/Staff, hybrids, and smash-hazard singles unless they are explicit UI labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,\nCTA עדין והיררכיה שמרגישה פרימיום.":
    r(
      "Services shown with elegance, clarity, and no clutter — with the right split,\na gentle CTA, and hierarchy that feels premium.",
      "Servicios mostrados con elegancia, claridad y sin saturación — con la división correcta,\nun CTA suave y una jerarquía que se siente premium.",
      "Serviços mostrados com elegância, clareza e sem excesso — com a divisão certa,\num CTA suave e uma hierarquia que parece premium.",
      "خدمات تُعرض بأناقة ووضوح دون ازدحام — مع تقسيم صحيح،\nودعوة لطيفة للتواصل وتسلسل يبدو فاخراً.",
    ),
  "זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם\nאחריות מלאה.":
    r(
      "Available for urgent calls, fault repair, installations, and electrical upgrades — with\nfull warranty.",
      "Disponibles para llamadas urgentes, reparación de fallos, instalaciones y mejoras eléctricas — con\ngarantía completa.",
      "Disponíveis para chamadas urgentes, reparo de falhas, instalações e upgrades elétricos — com\ngarantia completa.",
      "متاحون للمكالمات العاجلة وإصلاح الأعطال والتركيب وترقية الكهرباء — مع\nضمان كامل.",
    ),
  "חשמלאים מוסמכים עם תהליך ברור: אבחון, הצעת מחיר מסודרת, ביצוע\nנקי ואחריות בסיום העבודה.":
    r(
      "Licensed electricians with a clear process: diagnosis, an organized quote, clean\nexecution, and a warranty when the work is done.",
      "Electricistas certificados con un proceso claro: diagnóstico, presupuesto ordenado, ejecución\nlimpia y garantía al terminar el trabajo.",
      "Eletricistas certificados com um processo claro: diagnóstico, orçamento organizado, execução\nlimpa e garantia ao terminar o trabalho.",
      "كهربائيون معتمدون بعملية واضحة: تشخيص، عرض سعر مرتّب، تنفيذ\nنظيف وضمان عند انتهاء العمل.",
    ),
  "כל תחום מוצג בצורה ברורה, מסודרת ונגישה — כדי שהלקוח יבין מהר\nהאם המשרד מתאים למקרה שלו וימשיך לפעולה.":
    r(
      "Every practice area is shown clearly, in order, and accessibly — so the client quickly sees\nwhether the firm fits their case and continues to action.",
      "Cada área se muestra de forma clara, ordenada y accesible — para que el cliente entienda rápido\nsi el despacho encaja en su caso y siga a la acción.",
      "Cada área é mostrada de forma clara, organizada e acessível — para que o cliente entenda rápido\nse o escritório serve ao caso dele e siga para a ação.",
      "كل مجال يُعرض بوضوح وترتيب وسهولة وصول — حتى يفهم الزبون بسرعة\nما إذا كان المكتب يناسب قضيته ويكمل إلى الفعل.",
    ),
  "פירוט מקרה לדוגמה שמציג ללקוח את דרך העבודה, החשיבה\nהמשפטית והערך שהמשרד יודע לייצר.":
    r(
      "A sample case write-up that shows the client the working method, the legal\nthinking, and the value the firm knows how to create.",
      "Un detalle de caso de ejemplo que muestra al cliente la forma de trabajo, el pensamiento\njurídico y el valor que el despacho sabe generar.",
      "Um detalhe de caso de exemplo que mostra ao cliente o jeito de trabalhar, o pensamento\njurídico e o valor que o escritório sabe gerar.",
      "تفصيل قضية نموذجية يعرض للزبون طريقة العمل والتفكير\nالقانوني والقيمة التي يعرف المكتب كيف يصنعها.",
    ),
  "פריט פרימיום מתוך הקולקציה החדשה. מתאים ללוק יומיומי, ערב או\nסטיילינג מודרני. העיצוב נקי, התמונה גדולה, והלקוחה מקבלת חוויית\nמוצר מלאה לפני הוספה לסל.":
    r(
      "A premium piece from the new collection. Fits an everyday look, evening, or\nmodern styling. The design is clean, the image is large, and the customer gets a full\nproduct experience before adding to cart.",
      "Una pieza premium de la nueva colección. Encaja en un look diario, de noche o\nestilo moderno. El diseño es limpio, la imagen es grande, y la clienta recibe una experiencia\nde producto completa antes de añadir al carrito.",
      "Uma peça premium da nova coleção. Serve para um look do dia a dia, à noite ou\nestilo moderno. O design é limpo, a imagem é grande, e a cliente recebe uma experiência\nde produto completa antes de adicionar ao carrinho.",
      "قطعة فاخرة من المجموعة الجديدة. تناسب إطلالة يومية أو سهرة أو\nتنسيقاً حديثاً. التصميم نظيف والصورة كبيرة، وتحصل الزبونة على تجربة\nمنتج كاملة قبل الإضافة إلى السلة.",
    ),
  "זה דמו של סל קניות לתבנית. את החיבור לסליקה ולשרת אפשר לחבר\nבהמשך לפי המערכת שלך.":
    r(
      "This is a shopping-cart demo for the template. You can connect checkout and the server\nlater according to your system.",
      "Esto es un demo de carrito para la plantilla. La conexión al cobro y al servidor se puede conectar\nmás adelante según tu sistema.",
      "Isto é um demo de carrinho para o modelo. A ligação à cobrança e ao servidor pode ser conectada\ndepois conforme o seu sistema.",
      "هذا عرض تجريبي لسلة التسوق للقالب. يمكن ربط الدفع والخادم\nلاحقاً حسب نظامك.",
    ),
  מענה: r("Response", "Respuesta", "Resposta", "استجابة"),
  "התאמה אישית": r("Personal fit", "Ajuste personal", "Ajuste pessoal", "ملاءمة شخصية"),
  "לכל לקוח יש מסלול נכון עבורו": r(
    "Every client has the right path for them",
    "Cada cliente tiene el recorrido correcto",
    "Cada cliente tem o percurso certo",
    "لكل زبون مسار مناسب له",
  ),
  "פורמט גמיש": r("Flexible format", "Formato flexible", "Formato flexível", "صيغة مرنة"),
  "קליניקה פרטית / אונליין": r(
    "Private clinic / online",
    "Clínica privada / online",
    "Clínica particular / online",
    "عيادة خاصة / أونلاين",
  ),
  "ברור, אישי ומהיר": r(
    "Clear, personal, and fast",
    "Claro, personal y rápido",
    "Claro, pessoal e rápido",
    "واضح وشخصي وسريع",
  ),
  "מרחב רגוע": r("Calm space", "Espacio sereno", "Espaço sereno", "فضاء هادئ"),
  "תמונה גדולה שמייצרת אווירה": r(
    "A large image that sets the mood",
    "Una imagen grande que crea ambiente",
    "Uma imagem grande que cria atmosfera",
    "صورة كبيرة تصنع أجواء",
  ),
  "פגישה אישית": r("Personal session", "Sesión personal", "Sessão pessoal", "جلسة شخصية"),
  "תחושה אנושית ומזמינה": r(
    "A human, welcoming feel",
    "Una sensación humana y acogedora",
    "Uma sensação humana e acolhedora",
    "شعور إنساني ومرحّب",
  ),
  "שקט ובהירות": r("Quiet and clarity", "Calma y claridad", "Calma e clareza", "هدوء ووضوح"),
  "קומפוזיציה נקייה": r("Clean composition", "Composición limpia", "Composição limpa", "تكوين نظيف"),
  "פרימיום רגוע": r("Calm premium", "Premium sereno", "Premium sereno", "فخامة هادئة"),
  "אזור ויזואלי יותר מיוחד": r(
    "A more distinctive visual area",
    "Un área visual más especial",
    "Uma área visual mais especial",
    "منطقة بصرية أكثر تميزاً",
  ),
  מאמר: r("Article", "Artículo", "Artigo", "مقال"),
  האתגר: r("The challenge", "El reto", "O desafio", "التحدي"),
  הפתרון: r("The solution", "La solución", "A solução", "الحل"),
  התוצאה: r("The result", "El resultado", "O resultado", "النتيجة"),
  תיקים: r("Cases", "Casos", "Casos", "قضايا"),
  יעדים: r("Destinations", "Destinos", "Destinos", "وجهات"),
  "תכנון חופשה": r("Plan a trip", "Planificar viaje", "Planejar viagem", "تخطيط إجازة"),
  "לפרטים נוספים ←": r("More details ←", "Más detalles ←", "Mais detalhes ←", "المزيد من التفاصيل ←"),
  "מענה אישי": r("Personal reply", "Respuesta personal", "Resposta pessoal", "رد شخصي"),
  "התאמה מלאה": r("Full match", "Ajuste completo", "Ajuste completo", "ملاءمة كاملة"),
  "יעד מבוקש": r("Desired destination", "Destino deseado", "Destino desejado", "الوجهة المطلوبة"),
  "למשל: יוון / איטליה / באלי": r(
    "e.g. Greece / Italy / Bali",
    "p. ej. Grecia / Italia / Bali",
    "p. ex. Grécia / Itália / Bali",
    "مثلاً: اليونان / إيطاليا / بالي",
  ),
  "ספרו בקצרה מה אתם מחפשים": r(
    "Briefly tell us what you are looking for",
    "Cuéntanos en breve qué buscas",
    "Contem em breve o que vocês procuram",
    "أخبرونا باختصار عما تبحثون عنه",
  ),
  "חבילות נסיעה": r("Travel packages", "Paquetes de viaje", "Pacotes de viagem", "باقات سفر"),
  "חבילות מדויקות לכל סוג של חופשה": r(
    "Precise packages for every kind of trip",
    "Paquetes precisos para cada tipo de viaje",
    "Pacotes precisos para cada tipo de viagem",
    "باقات دقيقة لكل نوع إجازة",
  ),
  "חבילות זוגיות, משפחתיות ואקזוטיות עם תכנון מלא, נראות יוקרתית\nוחוויית לקוח שמובילה להשארת פרטים.":
    r(
      "Couples, family, and exotic packages with full planning, a luxury look,\nand a customer experience that leads to leaving details.",
      "Paquetes para parejas, familias y destinos exóticos con planificación completa, una imagen de lujo\ny una experiencia de cliente que lleva a dejar datos.",
      "Pacotes para casais, famílias e destinos exóticos com planejamento completo, visual de luxo\ne uma experiência de cliente que leva a deixar dados.",
      "باقات للأزواج والعائلات والوجهات الاستوائية مع تخطيط كامل ومظهر فاخر\nوتجربة زبائن تؤدي إلى ترك التفاصيل.",
    ),
  "לקוחות מרגישים את ההבדל כשהכול מתוכנן נכון": r(
    "Clients feel the difference when everything is planned right",
    "Los clientes sienten la diferencia cuando todo está bien planificado",
    "Os clientes sentem a diferença quando tudo está bem planejado",
    "الزبائن يشعرون بالفرق عندما يُخطَّط كل شيء بشكل صحيح",
  ),
  "עמוד המלצות יוקרתי שמחזק אמון, מציג חוויות אמיתיות ומעודד\nלקוחות חדשים להתחיל תכנון.":
    r(
      "A luxury testimonials page that builds trust, shows real experiences, and encourages\nnew clients to start planning.",
      "Una página de testimonios de lujo que refuerza la confianza, muestra experiencias reales y anima\na nuevos clientes a empezar a planificar.",
      "Uma página de depoimentos de luxo que reforça confiança, mostra experiências reais e incentiva\nnovos clientes a começar o planejamento.",
      "صفحة شهادات فاخرة تعزّز الثقة وتعرض تجارب حقيقية وتشجّع\nزبائن جدداً على بدء التخطيط.",
    ),
  "לקוחות ממליצים": r("Clients recommend", "Clientes recomiendan", "Clientes recomendam", "زبائن يوصون"),
  "תהליך פשוט, ברור ויוקרתי מהשיחה הראשונה עד החופשה": r(
    "A simple, clear, luxury process from the first call to the trip",
    "Un proceso simple, claro y de lujo desde la primera llamada hasta el viaje",
    "Um processo simples, claro e de luxo da primeira chamada até a viagem",
    "عملية بسيطة وواضحة وفاخرة من المكالمة الأولى حتى الإجازة",
  ),
  "העמוד הזה מציג ללקוח איך השירות עובד, מוריד התנגדויות ומסביר\nלמה כדאי להשאיר פרטים.":
    r(
      "This page shows the client how the service works, lowers objections, and explains\nwhy it is worth leaving details.",
      "Esta página muestra al cliente cómo funciona el servicio, baja objeciones y explica\npor qué conviene dejar datos.",
      "Esta página mostra ao cliente como o serviço funciona, reduz objeções e explica\npor que vale deixar dados.",
      "هذه الصفحة تعرض للزبون كيف تعمل الخدمة، تخفّض الاعتراضات وتشرح\nلماذا يستحق ترك التفاصيل.",
    ),
  "שירות אישי": r("Personal service", "Servicio personal", "Serviço pessoal", "خدمة شخصية"),
  "כל לקוח מקבל מסלול שנבנה לפי הסגנון שלו.": r(
    "Every client gets an itinerary built around their style.",
    "Cada cliente recibe un itinerario construido según su estilo.",
    "Cada cliente recebe um roteiro feito conforme o estilo dele.",
    "كل زبون يحصل على مسار يُبنى حسب أسلوبه.",
  ),
  "לא בוחרים תבנית מוכנה. בונים חוויה לפי תקציב, יעד, אופי הטיול\nורמת הליווי שהלקוח צריך.":
    r(
      "We do not pick a ready-made template. We build an experience around budget, destination, trip style,\nand the level of support the client needs.",
      "No elegimos una plantilla lista. Construimos una experiencia según presupuesto, destino, tipo de viaje\ny el nivel de acompañamiento que el cliente necesita.",
      "Não escolhemos um modelo pronto. Construímos uma experiência conforme orçamento, destino, tipo de viagem\ne o nível de acompanhamento que o cliente precisa.",
      "لا نختار قالباً جاهزاً. نبني تجربة حسب الميزانية والوجهة وطبيعة الرحلة\nومستوى المرافقة الذي يحتاجه الزبون.",
    ),
  חופשה: r("Vacation", "Viaje", "Viagem", "إجازة"),
  "תפורה אישית": r("tailored for you", "a tu medida", "sob medida", "مفصّلة لكم"),
  "חופשת בוטיק": r("Boutique trip", "Viaje boutique", "Viagem boutique", "رحلة بوتيك"),
  "יעד נבחר": r("Featured destination", "Destino destacado", "Destino em destaque", "وجهة مختارة"),
  "יעדים בהתאמה": r("Matched destinations", "Destinos a medida", "Destinos sob medida", "وجهات ملائمة"),
  יעד: r("Destination", "Destino", "Destino", "وجهة"),
  "לאן תרצו לטוס?": r("Where do you want to fly?", "¿A dónde quieren volar?", "Para onde vocês querem voar?", "إلى أين تريدون السفر؟"),
  סגנון: r("Style", "Estilo", "Estilo", "أسلوب"),
  "יוקרה / משפחתי / זוגי": r(
    "Luxury / family / couples",
    "Lujo / familiar / en pareja",
    "Luxo / familiar / casal",
    "فخامة / عائلي / للأزواج",
  ),
  תקציב: r("Budget", "Presupuesto", "Orçamento", "ميزانية"),
  "התחילו תכנון": r("Start planning", "Empezar a planificar", "Começar o planejamento", "ابدأوا التخطيط"),
  "חוויה מלאה": r("Full experience", "Experiencia completa", "Experiência completa", "تجربة كاملة"),
  "לא עוד אתר רגיל. נראות של מותג נסיעות פרימיום.": r(
    "Not just another site. The look of a premium travel brand.",
    "Ya no un sitio cualquiera. La imagen de una marca de viajes premium.",
    "Não mais um site qualquer. A cara de uma marca de viagens premium.",
    "ليس مجرد موقع عادي. مظهر علامة سفر فاخرة.",
  ),
  "עמוד בית שמרגיש כמו מגזין תיירות יוקרתי: תמונות גדולות, תנועה\nחלקה, שכבות, עומק, כרטיסים צפים וקריאה ברורה להשארת פרטים.":
    r(
      "A home page that feels like a luxury travel magazine: large images, smooth motion,\nlayers, depth, floating cards, and a clear call to leave details.",
      "Una home que se siente como una revista de turismo de lujo: imágenes grandes, movimiento suave,\ncapas, profundidad, tarjetas flotantes y una llamada clara a dejar datos.",
      "Uma home que parece uma revista de turismo de luxo: imagens grandes, movimento suave,\ncamadas, profundidade, cartões flutuantes e um chamado claro para deixar dados.",
      "صفحة رئيسية تشبه مجلة سياحة فاخرة: صور كبيرة وحركة سلسة\nوطبقات وعمق وبطاقات عائمة ودعوة واضحة لترك التفاصيل.",
    ),
  "נוף הררי": r("Mountain view", "Vista de montaña", "Vista de montanha", "منظر جبلي"),
  "חופשה טרופית": r("Tropical vacation", "Viaje tropical", "Viagem tropical", "إجازة استوائية"),
  לייעוץ: r("For advice", "Consultar", "Consultar", "للاستشارة"),
  "משך טיפול": r("Case duration", "Duración del caso", "Duração do caso", "مدة المعالجة"),
  סטטוס: r("Status", "Estado", "Status", "الحالة"),
  "ייעוץ דומה": r("Similar advice", "Asesoría similar", "Consultoria semelhante", "استشارة مشابهة"),
  "מה חשוב לדעת לפני שמתחילים?": r(
    "What should you know before you start?",
    "¿Qué es importante saber antes de empezar?",
    "O que é importante saber antes de começar?",
    "ما المهم معرفته قبل البدء؟",
  ),
  "סיבת הפנייה": r("Reason for inquiry", "Motivo de la consulta", "Motivo da consulta", "سبب التواصل"),
  "ספרו בקצרה במה צריך עזרה": r(
    "Briefly tell us what you need help with",
    "Cuéntanos en breve en qué necesitas ayuda",
    "Contem em breve em que precisam de ajuda",
    "أخبرونا باختصار بما تحتاجون مساعدة فيه",
  ),
  "שירותים משפטיים": r("Legal services", "Servicios jurídicos", "Serviços jurídicos", "خدمات قانونية"),
  "תחומי התמחות שמייצרים בהירות וביטחון": r(
    "Practice areas that create clarity and confidence",
    "Áreas de especialización que generan claridad y confianza",
    "Áreas de especialização que geram clareza e confiança",
    "مجالات اختصاص تصنع وضوحاً وثقة",
  ),
  "שירותים משפטיים לעסקים, יזמים ולקוחות פרטיים שצריכים ליווי\nמקצועי, מדויק וזמין.":
    r(
      "Legal services for businesses, founders, and private clients who need professional,\nprecise, and available support.",
      "Servicios jurídicos para negocios, emprendedores y clientes particulares que necesitan acompañamiento\nprofesional, preciso y disponible.",
      "Serviços jurídicos para negócios, empreendedores e clientes particulares que precisam de acompanhamento\nprofissional, preciso e disponível.",
      "خدمات قانونية للأعمال وروّاد الأعمال والزبائن الخاصين الذين يحتاجون مرافقة\nمهنية ودقيقة ومتاحة.",
    ),
  "תיקים נבחרים": r("Selected cases", "Casos seleccionados", "Casos selecionados", "قضايا مختارة"),
  "תיקים שטופלו מתוך חשיבה משפטית ואסטרטגית": r(
    "Cases handled with legal and strategic thinking",
    "Casos tratados con pensamiento jurídico y estratégico",
    "Casos tratados com pensamento jurídico e estratégico",
    "قضايا عولجت بتفكير قانوني واستراتيجي",
  ),
  "תצוגה יוקרתית של עבודות, הישגים וסוגי תיקים שהמשרד יודע להוביל.": r(
    "A luxury display of work, results, and case types the firm knows how to lead.",
    "Una muestra de lujo de trabajos, logros y tipos de casos que el despacho sabe liderar.",
    "Uma vitrine de luxo de trabalhos, resultados e tipos de casos que o escritório sabe liderar.",
    "عرض فاخر للأعمال والإنجازات وأنواع القضايا التي يعرف المكتب كيف يقودها.",
  ),
  "תהליך העבודה": r("Work process", "Proceso de trabajo", "Processo de trabalho", "عملية العمل"),
  "כל תיק מתחיל באבחון ברור וממשיך בדרך פעולה מדויקת": r(
    "Every case starts with a clear diagnosis and continues with a precise course of action",
    "Cada caso empieza con un diagnóstico claro y sigue con una vía de acción precisa",
    "Cada caso começa com um diagnóstico claro e segue com um caminho de ação preciso",
    "كل قضية تبدأ بتشخيص واضح وتستمر بمسار عمل دقيق",
  ),
  "תהליך עבודה מסודר שמסביר ללקוח מה קורה בכל שלב ומחזק אמון.": r(
    "An organized work process that explains what happens at each step and builds trust.",
    "Un proceso de trabajo ordenado que explica al cliente qué ocurre en cada etapa y refuerza la confianza.",
    "Um processo de trabalho organizado que explica ao cliente o que acontece em cada etapa e reforça a confiança.",
    "عملية عمل مرتّبة تشرح للزبون ما يحدث في كل مرحلة وتعزّز الثقة.",
  ),
  "קובעים ייעוץ ומקבלים תמונת מצב משפטית ברורה": r(
    "Book a consultation and get a clear legal picture",
    "Reservan una consulta y reciben una imagen jurídica clara",
    "Marcam uma consulta e recebem um panorama jurídico claro",
    "تحددون استشارة وتحصلون على صورة قانونية واضحة",
  ),
  "השאירו פרטים ונחזור אליכם לתיאום שיחה ראשונית עם עורך דין מתאים.": r(
    "Leave your details and we will get back to you to schedule an intro call with the right attorney.",
    "Deja tus datos y te responderemos para coordinar una llamada inicial con un abogado adecuado.",
    "Deixe seus dados e voltaremos para agendar uma conversa inicial com um advogado adequado.",
    "اتركوا التفاصيل وسنعود إليكم لتنسيق مكالمة أولى مع محامٍ مناسب.",
  ),
  "ייעוץ ברור. החלטות מדויקות.": r(
    "Clear advice. Precise decisions.",
    "Asesoría clara. Decisiones precisas.",
    "Consultoria clara. Decisões precisas.",
    "استشارة واضحة. قرارات دقيقة.",
  ),
  "אודות המשרד": r("About the firm", "Sobre el despacho", "Sobre o escritório", "عن المكتب"),
  "להכיר את הצוות": r("Meet the team", "Conocer al equipo", "Conhecer a equipe", "التعرّف على الفريق"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique41.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique41 rows`);
