/**
 * unique53 — leftover Cyclora pricing/FAQ/testimonials/CTA and Chanel
 * craft/journal/newsletter body chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff.
 * Hebrew brand names in source keys are translated with Latin brand names
 * in values so isUsableTranslation stays true.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Cyclora pricing heading (split + concatenated)
  "השקעה בצמיחה": r(
    "An investment in growth",
    "Una inversión en crecimiento",
    "Um investimento em crescimento",
    "استثمار في النمو",
  ),
  "תוכניות שנבנו": r("Plans built", "Planes hechos", "Planos feitos", "خطط بُنيت"),
  "כדי לגדול": r("to grow", "para crecer", "para crescer", "لكي تنمو"),
  "תוכניות שנבנו כדי לגדול": r(
    "Plans built to grow",
    "Planes hechos para crecer",
    "Planos feitos para crescer",
    "خطط بُنيت لكي تنمو",
  ),
  "/ חודש": r("/ month", "/ mes", "/ mês", "/ شهر"),
  "מעטפת ממוקדת לעסק שרוצה לבנות בסיס שיווקי ברור ולהתחיל לגדול באופן עקבי.": r(
    "A focused wrap for a business that wants a clear marketing base and steady growth.",
    "Una envoltura centrada para un negocio que quiere una base de marketing clara y crecer de forma constante.",
    "Uma envoltória focada para um negócio que quer uma base de marketing clara e crescer de forma constante.",
    "غلاف مركّز لعمل يريد قاعدة تسويق واضحة والنمو بثبات.",
  ),
  "אסטרטגיית שיווק ומסרים": r(
    "Marketing and messaging strategy",
    "Estrategia de marketing y mensajes",
    "Estratégia de marketing e mensagens",
    "استراتيجية تسويق ورسائل",
  ),
  "ניהול קמפיין מרכזי": r(
    "Core campaign management",
    "Gestión de campaña central",
    "Gestão de campanha central",
    "إدارة حملة مركزية",
  ),
  "אוטומציית לידים בסיסית": r(
    "Basic lead automation",
    "Automatización básica de leads",
    "Automação básica de leads",
    "أتمتة أساسية للعملاء المحتملين",
  ),
  "דוח ביצועים חודשי": r(
    "Monthly performance report",
    "Informe mensual de rendimiento",
    "Relatório mensal de desempenho",
    "تقرير أداء شهري",
  ),
  "פגישת מיטוב": r("Optimization meeting", "Reunión de mejora", "Reunião de melhoria", "اجتماع تحسين"),
  "פתרון מתקדם למותגים שרוצים לגדול בכמה ערוצים עם נתונים, קריאייטיב ואוטומציה.": r(
    "An advanced solution for brands that want to grow across channels with data, creative, and automation.",
    "Una solución avanzada para marcas que quieren crecer en varios canales con datos, creativo y automatización.",
    "Uma solução avançada para marcas que querem crescer em vários canais com dados, criativo e automação.",
    "حل متقدم لعلامات تريد النمو عبر قنوات مع بيانات وإبداع وأتمتة.",
  ),
  "אסטרטגיית צמיחה רב־ערוצית": r(
    "Multi-channel growth strategy",
    "Estrategia de crecimiento multicanal",
    "Estratégia de crescimento multicanal",
    "استراتيجية نمو متعددة القنوات",
  ),
  "ניהול קמפיינים מלא": r(
    "Full campaign management",
    "Gestión completa de campañas",
    "Gestão completa de campanhas",
    "إدارة حملات كاملة",
  ),
  "מערכי ניהול לקוחות ואוטומציה": r(
    "Client-management systems and automation",
    "Sistemas de gestión de clientes y automatización",
    "Sistemas de gestão de clientes e automação",
    "منظومات إدارة زبائن وأتمتة",
  ),
  "קריאייטיב שוטף": r("Ongoing creative", "Creativo continuo", "Criativo contínuo", "إبداع مستمر"),
  "לוח בקרת נתונים": r("Data control board", "Panel de control de datos", "Painel de controle de dados", "لوحة تحكم بيانات"),
  "ליווי שבועי": r("Weekly guidance", "Acompañamiento semanal", "Acompanhamento semanal", "مرافقة أسبوعية"),
  "בונים צמיחה": r("Build growth", "Construid crecimiento", "Construam crescimento", "ابنوا نمواً"),
  "כולל:": r("Includes:", "Incluye:", "Inclui:", "يشمل:"),

  // Cyclora remaining testimonials (skip personal names)
  "יוצא דופן": r("Outstanding", "Excepcional", "Fora do comum", "استثنائي"),
  "עברנו מניחושים להחלטות מבוססות נתונים. השילוב בין אסטרטגיה, אוטומציה וקריאייטיב נתן לנו תוצאות מהירות ומדידות.": r(
    "We moved from guesses to data-based decisions. The mix of strategy, automation, and creative gave us fast, measurable results.",
    "Pasamos de conjeturas a decisiones basadas en datos. La mezcla de estrategia, automatización y creativo nos dio resultados rápidos y medibles.",
    "Passamos de palpites para decisões baseadas em dados. A mistura de estratégia, automação e criativo nos deu resultados rápidos e mensuráveis.",
    "انتقلنا من التخمين إلى قرارات مبنية على البيانات. مزيج الاستراتيجية والأتمتة والإبداع أعطانا نتائج سريعة وقابلة للقياس.",
  ),
  "מנהלת צמיחה": r("Growth director", "Directora de crecimiento", "Diretora de crescimento", "مديرة نمو"),
  "הצוות הצליח לפשט מוצר מורכב ולבנות מסע שמרגיש מדויק בכל נקודת מגע. גם המספרים וגם חוויית המותג השתפרו.": r(
    "The team simplified a complex product and built a journey that feels precise at every touchpoint. Both the numbers and the brand experience improved.",
    "El equipo simplificó un producto complejo y construyó un viaje que se siente preciso en cada punto de contacto. Mejoraron los números y la experiencia de marca.",
    "A equipe simplificou um produto complexo e construiu uma jornada que parece precisa em cada ponto de contato. Melhoraram os números e a experiência da marca.",
    "الفريق بسّط منتجاً معقداً وبنى رحلة دقيقة في كل نقطة تواصل. تحسّنت الأرقام وتجربة العلامة معاً.",
  ),
  "מנהל אסטרטגיה": r("Strategy director", "Director de estrategia", "Diretor de estratégia", "مدير استراتيجية"),
  "צוות חושב קדימה. האנליטיקה החיזויית נתנה לנו בהירות וביטחון בכל החלטה.": r(
    "A team that thinks ahead. Predictive analytics gave us clarity and confidence in every decision.",
    "Un equipo que piensa hacia delante. La analítica predictiva nos dio claridad y confianza en cada decisión.",
    "Uma equipe que pensa à frente. A analytics preditiva nos deu clareza e confiança em cada decisão.",
    "فريق يفكر إلى الأمام. التحليلات التنبؤية منحتنا وضوحاً وثقة في كل قرار.",
  ),
  "סמנכ״לית שיווק": r("VP of marketing", "Vicepresidenta de marketing", "VP de marketing", "نائبة رئيس التسويق"),
  "רמת התובנות שיושמו עזרה לנו להוריד עלויות ולהגדיל ביצועים בכל קמפיין.": r(
    "The level of insight they applied helped us cut costs and raise performance in every campaign.",
    "El nivel de insights que aplicaron nos ayudó a bajar costes y subir el rendimiento en cada campaña.",
    "O nível de insights que aplicaram nos ajudou a baixar custos e subir o desempenho em cada campanha.",
    "مستوى الرؤى التي طُبّقت ساعدنا على خفض التكاليف ورفع الأداء في كل حملة.",
  ),
  "אסטרטגית מותג": r("Brand strategist", "Estratega de marca", "Estrategista de marca", "استراتيجية علامة"),
  "שיעורי ההמרה עלו משמעותית אחרי יישום הגישה החכמה שלהם לפרסונליזציה.": r(
    "Conversion rates rose significantly after we applied their smart approach to personalization.",
    "Las tasas de conversión subieron bastante después de aplicar su enfoque inteligente a la personalización.",
    "As taxas de conversão subiram bastante depois de aplicar a abordagem inteligente deles à personalização.",
    "ارتفعت نسب التحويل بشكل واضح بعد تطبيق نهجهم الذكي في التخصيص.",
  ),
  "ראש דיגיטל": r("Head of digital", "Responsable de digital", "Head de digital", "رئيس الرقمي"),

  // Cyclora FAQ + CTA
  "שכבר ענינו": r("we already answered", "que ya respondimos", "que já respondemos", "أجبنا عنها"),
  "במה הגישה שלכם שונה מסוכנות רגילה?": r(
    "How is your approach different from a regular agency?",
    "¿En qué se diferencia vuestro enfoque de una agencia normal?",
    "Em que a abordagem de vocês é diferente de uma agência comum?",
    "بماذا يختلف نهجكم عن وكالة عادية؟",
  ),
  "אנחנו מחברים אסטרטגיה, קריאייטיב, מדיה, ניהול לקוחות ואוטומציות למערכת אחת. כך כל פעולה משרתת את אותה מטרת צמיחה.": r(
    "We connect strategy, creative, media, client management, and automations into one system. Every action then serves the same growth goal.",
    "Conectamos estrategia, creativo, medios, gestión de clientes y automatizaciones en un sistema. Así cada acción sirve al mismo objetivo de crecimiento.",
    "Conectamos estratégia, criativo, mídia, gestão de clientes e automações num sistema. Assim cada ação serve o mesmo objetivo de crescimento.",
    "نربط الاستراتيجية والإبداع والوسائط وإدارة الزبائن والأتمتة في منظومة واحدة. بذلك تخدم كل خطوة هدف النمو نفسه.",
  ),
  "איך בינה מלאכותית משפרת את ביצועי הקמפיינים?": r(
    "How does AI improve campaign performance?",
    "¿Cómo mejora la IA el rendimiento de las campañas?",
    "Como a IA melhora o desempenho das campanhas?",
    "كيف يحسّن الذكاء الاصطناعي أداء الحملات؟",
  ),
  "בינה מלאכותית עוזרת לנתח התנהגות, לזהות דפוסים, לייצר וריאציות ולתעדף פעולות. ההחלטות המרכזיות נשארות תחת בקרה אנושית.": r(
    "AI helps analyze behavior, find patterns, create variations, and prioritize actions. The core decisions stay under human control.",
    "La IA ayuda a analizar conducta, detectar patrones, crear variaciones y priorizar acciones. Las decisiones centrales siguen bajo control humano.",
    "A IA ajuda a analisar comportamento, achar padrões, criar variações e priorizar ações. As decisões centrais continuam sob controle humano.",
    "الذكاء الاصطناعي يساعد على تحليل السلوك واكتشاف الأنماط وإنتاج تنويعات وترتيب الأولويات. القرارات الأساسية تبقى تحت رقابة بشرية.",
  ),
  "האם השירות מתאים גם לעסק קטן?": r(
    "Does the service also fit a small business?",
    "¿El servicio también encaja en un negocio pequeño?",
    "O serviço também serve para um negócio pequeno?",
    "هل الخدمة تناسب عملاً صغيراً أيضاً؟",
  ),
  "כן. אנחנו מתאימים את היקף העבודה, הערוצים והתהליך לשלב שבו העסק נמצא ולתקציב הקיים.": r(
    "Yes. We fit the scope, channels, and process to the stage the business is in and to the current budget.",
    "Sí. Adaptamos el alcance, los canales y el proceso a la etapa del negocio y al presupuesto actual.",
    "Sim. Ajustamos o alcance, os canais e o processo ao estágio do negócio e ao orçamento atual.",
    "نعم. نلائم نطاق العمل والقنوات والعملية مع مرحلة العمل والميزانية الحالية.",
  ),
  "תוך כמה זמן רואים תוצאות?": r(
    "How soon do you see results?",
    "¿En cuánto tiempo se ven resultados?",
    "Em quanto tempo se veem resultados?",
    "خلال كم من الوقت تظهر النتائج؟",
  ),
  "שיפורים ראשונים נראים לרוב בשבועות הראשונים, אבל בניית מנוע צמיחה יציב היא תהליך של מדידה, למידה ואופטימיזציה.": r(
    "First improvements usually show in the first weeks, but building a stable growth engine is a process of measurement, learning, and optimization.",
    "Las primeras mejoras suelen verse en las primeras semanas, pero construir un motor de crecimiento estable es un proceso de medición, aprendizaje y optimización.",
    "As primeiras melhoras costumam aparecer nas primeiras semanas, mas construir um motor de crescimento estável é um processo de medição, aprendizado e otimização.",
    "التحسينات الأولى تظهر غالباً في الأسابيع الأولى، لكن بناء محرك نمو ثابت عملية قياس وتعلّم وتحسين.",
  ),
  "האם אתם עובדים עם חברות חדשות וגם עם עסקים ותיקים?": r(
    "Do you work with new companies and also with established businesses?",
    "¿Trabajáis con empresas nuevas y también con negocios consolidados?",
    "Vocês trabalham com empresas novas e também com negócios estabelecidos?",
    "هل تعملون مع شركات جديدة وأيضاً مع أعمال قائمة؟",
  ),
  "כן. אנחנו עובדים עם חברות בשלבי השקה, צמיחה והתרחבות, ומתאימים את המערכת למורכבות וליעדים של כל עסק.": r(
    "Yes. We work with companies in launch, growth, and expansion stages, and fit the system to each business's complexity and goals.",
    "Sí. Trabajamos con empresas en etapas de lanzamiento, crecimiento y expansión, y adaptamos el sistema a la complejidad y los objetivos de cada negocio.",
    "Sim. Trabalhamos com empresas em estágios de lançamento, crescimento e expansão, e ajustamos o sistema à complexidade e aos objetivos de cada negócio.",
    "نعم. نعمل مع شركات في مراحل الإطلاق والنمو والتوسع، ونلائم المنظومة لتعقيد وأهداف كل عمل.",
  ),
  "איך מודדים הצלחה?": r(
    "How do you measure success?",
    "¿Cómo medís el éxito?",
    "Como vocês medem o sucesso?",
    "كيف تقيسون النجاح؟",
  ),
  "מגדירים מראש מדדי הצלחה עסקיים: עלות ליד, שיעור המרה, הכנסה, מהירות טיפול, ערך לקוח ועוד.": r(
    "We define business success metrics up front: cost per lead, conversion rate, revenue, handling speed, customer value, and more.",
    "Definimos de antemano métricas de éxito: coste por lead, tasa de conversión, ingresos, velocidad de gestión, valor de cliente y más.",
    "Definimos de antemão métricas de sucesso: custo por lead, taxa de conversão, receita, velocidade de atendimento, valor do cliente e mais.",
    "نحدد مسبقاً مؤشرات نجاح عمل: تكلفة العميل المحتمل، نسبة التحويل، الإيراد، سرعة المعالجة، قيمة الزبون والمزيد.",
  ),
  "מתחילים עכשיו": r("Start now", "Empezad ahora", "Comecem agora", "ابدأوا الآن"),
  "בואו נניע": r("Let's set", "Pongamos", "Vamos pôr", "لنحرّك"),
  "מערכת שיווק חכמה, מותאמת לעסק שלכם ונבנית כדי להפוך תשומת לב לתוצאות.": r(
    "A smart marketing system, fitted to your business and built to turn attention into results.",
    "Un sistema de marketing inteligente, adaptado a vuestro negocio y hecho para convertir atención en resultados.",
    "Um sistema de marketing inteligente, ajustado ao negócio de vocês e feito para transformar atenção em resultados.",
    "منظومة تسويق ذكية ملائمة لعملكم ومبنية لتحويل الانتباه إلى نتائج.",
  ),
  "קובעים שיחת היכרות": r(
    "Book an intro call",
    "Reservad una llamada de presentación",
    "Marquem uma chamada de apresentação",
    "حددوا مكالمة تعارف",
  ),
  "שיווק חכם לצמיחה מדידה.": r(
    "Smart marketing for measurable growth.",
    "Marketing inteligente para un crecimiento medible.",
    "Marketing inteligente para crescimento mensurável.",
    "تسويق ذكي لنمو قابل للقياس.",
  ),
  "© 2026 סיקלורה. כל הזכויות שמורות.": r(
    "© 2026 Cyclora. All rights reserved.",
    "© 2026 Cyclora. Todos los derechos reservados.",
    "© 2026 Cyclora. Todos os direitos reservados.",
    "© 2026 Cyclora. جميع الحقوق محفوظة.",
  ),

  // Chanel craft (full source string — unique52 was truncated)
  "כל פריט עובר תהליך ייצור מוקפד — מבחירת העור ועד הגימור הסופי. אנו עובדים עם אומנים מנוסים באיטליה וצרפת כדי להבטיח שכל מוצר יישאר יפה לאורך שנים.": r(
    "Every piece goes through a careful production process — from choosing the leather to the final finish. We work with experienced artisans in Italy and France to keep every product beautiful for years.",
    "Cada pieza pasa por un proceso de fabricación cuidadoso — desde la elección del cuero hasta el acabado final. Trabajamos con artesanos expertos en Italia y Francia para que cada producto siga bello durante años.",
    "Cada peça passa por um processo de fabricação cuidadoso — da escolha do couro até o acabamento final. Trabalhamos com artesãos experientes na Itália e na França para que cada produto continue bonito por anos.",
    "كل قطعة تمر بعملية تصنيع دقيقة — من اختيار الجلد حتى التشطيب النهائي. نعمل مع حرفيين متمرسين في إيطاليا وفرنسا ليبقى كل منتج جميلاً لسنوات.",
  ),
  "שנות מסורת": r("years of tradition", "años de tradición", "anos de tradição", "سنوات من التقليد"),
  "עור איטלקי": r("Italian leather", "Cuero italiano", "Couro italiano", "جلد إيطالي"),
  "קראו את הסיפור": r("Read the story", "Leed la historia", "Leiam a história", "اقرأوا القصة"),
  היומן: r("The journal", "El diario", "O diário", "اليوميات"),
  וסטייל: r("and style", "y estilo", "e estilo", "وأسلوب"),
  "השראה וסטייל": r("Inspiration and style", "Inspiración y estilo", "Inspiração e estilo", "إلهام وأسلوب"),
  "איך לבחור תיק עור מושלם": r(
    "How to choose a perfect leather bag",
    "Cómo elegir un bolso de cuero perfecto",
    "Como escolher uma bolsa de couro perfeita",
    "كيف تختارون حقيبة جلد مثالية",
  ),
  "מדריך לבחירת התיק שמתאים לסגנון החיים שלכם — מגודל ועד גימור.": r(
    "A guide to choosing the bag that fits your lifestyle — from size to finish.",
    "Una guía para elegir el bolso que encaja con vuestro estilo de vida — del tamaño al acabado.",
    "Um guia para escolher a bolsa que combina com o estilo de vida de vocês — do tamanho ao acabamento.",
    "دليل لاختيار الحقيبة التي تناسب أسلوب حياتكم — من الحجم حتى التشطيب.",
  ),
  "מרץ 2026": r("March 2026", "Marzo 2026", "Março 2026", "مارس 2026"),
  "טרנדים באקססוריז לאביב 2026": r(
    "Accessory trends for spring 2026",
    "Tendencias de accesorios para primavera 2026",
    "Tendências de acessórios para a primavera 2026",
    "اتجاهات الإكسسوارات لربيع 2026",
  ),
  "הצבעים, החומרים והצורות שמגדירים את העונה הקרובה.": r(
    "The colors, materials, and shapes that define the coming season.",
    "Los colores, materiales y formas que definen la próxima temporada.",
    "As cores, os materiais e as formas que definem a temporada que vem.",
    "الألوان والخامات والأشكال التي تعرّف الموسم القادم.",
  ),
  "פברואר 2026": r("February 2026", "Febrero 2026", "Fevereiro 2026", "فبراير 2026"),
  "מאחורי הקלעים: בית הייצור שלנו": r(
    "Behind the scenes: our atelier",
    "Entre bastidores: nuestro taller",
    "Nos bastidores: nosso ateliê",
    "خلف الكواليس: بيت التصنيع لدينا",
  ),
  "מסע אל האומנים שיוצרים כל פריט ביד — מעור גולמי למוצר מוגמר.": r(
    "A journey to the artisans who make every piece by hand — from raw leather to a finished product.",
    "Un viaje a los artesanos que crean cada pieza a mano — del cuero crudo al producto terminado.",
    "Uma jornada até os artesãos que criam cada peça à mão — do couro cru ao produto pronto.",
    "رحلة إلى الحرفيين الذين يصنعون كل قطعة يدوياً — من الجلد الخام إلى المنتج النهائي.",
  ),
  "ינואר 2026": r("January 2026", "Enero 2026", "Janeiro 2026", "يناير 2026"),
  "הצטרפו לעולם שאנל": r(
    "Join the Chanel world",
    "Entrad en el mundo Chanel",
    "Entrem no mundo Chanel",
    "انضموا إلى عالم Chanel",
  ),
  "קבלו גישה מוקדמת לקולקציות חדשות, טיפים לסטיילינג והטבות בלעדיות.": r(
    "Get early access to new collections, styling tips, and exclusive offers.",
    "Obtened acceso anticipado a colecciones nuevas, consejos de styling y ofertas exclusivas.",
    "Recebam acesso antecipado a coleções novas, dicas de styling e ofertas exclusivas.",
    "احصلوا على وصول مبكر لمجموعات جديدة ونصائح تنسيق وعروض حصرية.",
  ),
  "כתובת האימייל שלכם": r(
    "Your email address",
    "Vuestra dirección de email",
    "O e-mail de vocês",
    "عنوان بريدكم",
  ),
  "בהרשמה אתם מסכימים לקבל עדכונים. ניתן לבטל בכל עת.": r(
    "By signing up you agree to receive updates. You can cancel at any time.",
    "Al registraros aceptáis recibir actualizaciones. Podéis cancelar en cualquier momento.",
    "Ao se registrar vocês concordam em receber atualizações. Dá para cancelar a qualquer momento.",
    "بالتسجيل توافقون على تلقي التحديثات. يمكن الإلغاء في أي وقت.",
  ),
  "התכשיטים נראים עוד יותר יפים בחיים. האריזה הייתה מושלמת — מתנה שממש הרשימה.": r(
    "The jewelry looks even more beautiful in real life. The packaging was perfect — a gift that truly impressed.",
    "Las joyas se ven todavía más hermosas en la vida real. El empaque fue perfecto — un regalo que realmente impresionó.",
    "As joias ficam ainda mais bonitas na vida real. A embalagem foi perfeita — um presente que realmente impressionou.",
    "المجوهرات تبدو أجمل في الحياة. التغليف كان مثالياً — هدية أثارت الإعجاب حقاً.",
  ),
  "סוף סוף מצאתי מותג שמשלב יוקרה עם שירות אישי. הצעיף הוא הפריט האהוב עליי בכל ארון.": r(
    "I finally found a brand that combines luxury with personal service. The scarf is my favorite piece in the whole closet.",
    "Por fin encontré una marca que combina lujo con servicio personal. El pañuelo es mi pieza favorita de todo el armario.",
    "Finalmente achei uma marca que mistura luxo com serviço pessoal. O lenço é a peça favorita no guarda-roupa todo.",
    "أخيراً وجدت علامة تمزج الفخامة مع خدمة شخصية. الوشاح هو قطعتي المفضلة في الخزانة كلها.",
  ),
  "השעון שקניתי לבעלי הפך לפריט קבוע בכל אירוע. מומלץ בחום לכל מי שמחפש איכות אמיתית.": r(
    "The watch I bought for my husband became a staple at every event. Highly recommended for anyone looking for real quality.",
    "El reloj que compré para mi marido se volvió un básico en cada evento. Muy recomendable para quien busca calidad de verdad.",
    "O relógio que comprei para meu marido virou peça fixa em cada evento. Super recomendado para quem busca qualidade de verdade.",
    "الساعة التي اشتريتها لزوجي صارت قطعة ثابتة في كل مناسبة. أنصح بها بشدة لكل من يبحث عن جودة حقيقية.",
  ),
  "אקססוריז יוקרה בעיצוב נצחי — מיוצרים באהבה, נשלחים אליכם בקפידה.": r(
    "Luxury accessories in timeless design — made with care, sent to you with precision.",
    "Accesorios de lujo con diseño eterno — hechos con cariño, enviados con cuidado.",
    "Acessórios de luxo com design atemporal — feitos com carinho, enviados com cuidado.",
    "إكسسوارات فاخرة بتصميم خالد — تُصنع بحب وتُرسل إليكم بعناية.",
  ),
  "© 2026 שאנל. כל הזכויות שמורות.": r(
    "© 2026 Chanel. All rights reserved.",
    "© 2026 Chanel. Todos los derechos reservados.",
    "© 2026 Chanel. Todos os direitos reservados.",
    "© 2026 Chanel. جميع الحقوق محفوظة.",
  ),
  "הקולקציה המלאה": r("The full collection", "La colección completa", "A coleção completa", "المجموعة الكاملة"),
  המוצרים: r("products", "productos", "produtos", "المنتجات"),
  "גלו את כל פריטי היוקרה של שאנל — מעור איטלקי, תכשיטים נבחרים ואקססוריז מעוצבים.": r(
    "Discover every Chanel luxury piece — Italian leather, selected jewelry, and designed accessories.",
    "Descubrid cada pieza de lujo Chanel — cuero italiano, joyas seleccionadas y accesorios diseñados.",
    "Descubram cada peça de luxo Chanel — couro italiano, joias escolhidas e acessórios desenhados.",
    "اكتشفوا كل قطع Chanel الفاخرة — جلد إيطالي ومجوهرات مختارة وإكسسوارات مصمّمة.",
  ),
  "תיק עור איטלקי מלאכת יד עם גימור פנימי מוקפד, רצועת כתף מתכווננת וסגירה מגנטית. פריט יומיומי שנראה כמו יצירת אומנות.": r(
    "A handcrafted Italian leather bag with a careful inner finish, an adjustable shoulder strap, and a magnetic close. An everyday piece that looks like a work of art.",
    "Un bolso de cuero italiano hecho a mano con acabado interior cuidadoso, correa de hombro ajustable y cierre magnético. Una pieza diaria que parece una obra de arte.",
    "Uma bolsa de couro italiano feita à mão com acabamento interno cuidadoso, alça de ombro ajustável e fechamento magnético. Uma peça do dia a dia que parece obra de arte.",
    "حقيبة جلد إيطالي مصنوعة يدوياً مع تشطيب داخلي دقيق وحزام كتف قابل للضبط وإغلاق مغناطيسي. قطعة يومية تبدو كعمل فني.",
  ),
  "עור עגל איטלקי מלאכת יד": r(
    "Handcrafted Italian calf leather",
    "Cuero de ternera italiano hecho a mano",
    "Couro de bezerro italiano feito à mão",
    "جلد عجل إيطالي مصنوع يدوياً",
  ),
  "ריפוד פנימי מבד פרימיום": r(
    "Premium fabric inner lining",
    "Forro interior de tela premium",
    "Forro interno de tecido premium",
    "بطانة داخلية من قماش فاخر",
  ),
  "משלוח חינם מעל ₪500": r(
    "Free shipping over ₪500",
    "Envío gratis por encima de ₪500",
    "Frete grátis acima de ₪500",
    "شحن مجاني فوق ₪500",
  ),
  "אחריות לשנה על תפרים וגימור": r(
    "One-year warranty on stitching and finish",
    "Garantía de un año en costuras y acabado",
    "Garantia de um ano em costuras e acabamento",
    "ضمان سنة على الغرز والتشطيب",
  ),
  "הוספה לעגלה": r("Add to cart", "Añadir al carrito", "Adicionar à sacola", "إضافة إلى السلة"),
  "המשך קניות": r("Continue shopping", "Seguid comprando", "Continuem comprando", "تابعوا التسوق"),
  "העגלה שלכם": r("Your cart", "Vuestro carrito", "A sacola de vocês", "سلتكم"),
  סיכום: r("Summary", "Resumen", "Resumo", "ملخص"),
  הזמנה: r("order", "pedido", "pedido", "طلب"),
  "העגלה ריקה כרגע — גלו את הקולקציה ומצאו את הפריט המושלם.": r(
    "The cart is empty for now — discover the collection and find the perfect piece.",
    "El carrito está vacío ahora — descubrid la colección y encontrad la pieza perfecta.",
    "A sacola está vazia agora — descubram a coleção e achem a peça perfeita.",
    "السلة فارغة الآن — اكتشفوا المجموعة وابحثوا عن القطعة المثالية.",
  ),
  "סכום ביניים": r("Subtotal", "Subtotal", "Subtotal", "المجموع الفرعي"),
  "לתשלום מאובטח": r("Secure checkout", "Pago seguro", "Pagamento seguro", "دفع آمن"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique53.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique53 rows`);
