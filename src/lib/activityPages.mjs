/**
 * Public activity pages. Prices match the published catalog.
 * Hidden, and therefore not sold here: paid campaign setup, content creation,
 * a personal CRM manager, and external customer support.
 * The SaaS marketplace stays at /saas and is not added to the sitemap.
 */

import { platformActivity } from "./platformPage.mjs";

function copy(title, description, crumb, h1, lede, sections, faq, links, steps = []) {
  return { title, description, crumb, h1, lede, sections, faq, links, steps, updated: "2026-10-24" };
}

function pack(layout, media, locales) {
  return { layout, media, locales };
}

const PAGES = {
  "/services": pack("split", null, {
    en: copy(
      "Setup we do for you | Bizuply",
      "Expert website build, automation setup, CRM migration and human follow-up. Software subscriptions stay separate. Hidden services are not offered here.",
      "Services",
      "Work we do for the business",
      "These are the setup and human services printed on the pricing page. The CRM, the website builder and the automations editor remain something you can run yourself.",
      [
        ["Published services", ["Expert website build is $399 once, for a site of up to five pages on an existing template, with your content, a lead form, a CRM connection and up to two revision rounds. Automation setup starts at $99 for one simple automation. CRM migration starts at $249. Human follow-up is listed separately."]],
        ["Not on sale from this site", ["Paid campaign setup, content creation, a personal CRM manager and external customer support exist in the catalog as hidden. Their checkout stays closed. This page does not invent a price or a promise for them."]],
      ],
      [["Does buying setup change the software price?", "No. CRM only stays $49 a month. The business plan stays $99 a month or $990 a year. WhatsApp stays $29 a month per number, plus Meta's own fees."]],
      [
        ["/services/website-build", "Expert website"],
        ["/services/automations-setup", "Automation setup"],
        ["/services/crm-migration", "CRM migration"],
        ["/services/human-follow-up", "Human follow-up"],
        ["/pricing", "Pricing"],
      ],
    ),
    he: copy(
      "הקמה שמבצעים עבורכם | ביזאפלי",
      "בניית אתר על ידי מומחה, הקמת אוטומציות, מעבר CRM וליווי אנושי. מנויי התוכנה נפרדים. שירותים מוסתרים לא נמכרים כאן.",
      "שירותים",
      "עבודה שאנחנו עושים עבור העסק",
      "אלה שירותי ההקמה והליווי האנושי שמופיעים במחירון. את ה־CRM, בונה האתרים ועורך האוטומציות אפשר עדיין להפעיל לבד.",
      [
        ["שירותים שמפורסמים", ["בניית אתר על ידי מומחה עולה 399 דולר חד־פעמית, לאתר של עד חמישה עמודים על תבנית קיימת, עם התוכן שלכם, טופס לידים, חיבור ל־CRM ועד שני סבבי תיקונים. הקמת אוטומציה מתחילה ב־99 דולר לאוטומציה פשוטה אחת. מעבר CRM מתחיל ב־249 דולר. ליווי אנושי מפורט בנפרד."]],
        ["לא נמכר מהאתר הזה", ["הקמת קמפיין ממומן, יצירת תוכן, מנהל CRM אישי ותמיכת לקוחות חיצונית מסומנים כמוסתרים. הרכישה שלהם נשארת סגורה. העמוד לא ממציא להם מחיר או הבטחה."]],
      ],
      [["קניית הקמה משנה את מחיר התוכנה?", "לא. CRM בלבד נשאר 49 דולר לחודש. החבילה העסקית נשארת 99 לחודש או 990 לשנה. WhatsApp נשאר 29 דולר לחודש למספר, בנוסף לחיובי Meta."]],
      [
        ["/services/website-build", "אתר מומחה"],
        ["/services/automations-setup", "הקמת אוטומציות"],
        ["/services/crm-migration", "מעבר CRM"],
        ["/services/human-follow-up", "ליווי אנושי"],
        ["/pricing", "מחירון"],
      ],
    ),
    es: copy(
      "Puesta en marcha hecha por nosotros | Bizuply",
      "Sitio de experto, automatizaciones, migración de CRM y seguimiento humano. Las suscripciones de software siguen aparte. Los servicios ocultos no se venden aquí.",
      "Servicios",
      "Trabajo que hacemos por el negocio",
      "Son los servicios de puesta en marcha y de personas que figuran en precios. El CRM, el constructor y el editor de automatizaciones se pueden seguir operando solos.",
      [
        ["Servicios publicados", ["El sitio de experto cuesta 399 dólares una vez: hasta cinco páginas sobre una plantilla existente, con su contenido, formulario de leads, conexión al CRM y hasta dos rondas de cambios. La automatización empieza en 99 dólares por una automatización simple. La migración empieza en 249 dólares."]],
        ["No se vende desde aquí", ["La puesta en marcha de campañas de pago, la creación de contenido, un gestor personal de CRM y el soporte externo están ocultos. Su compra sigue cerrada."]],
      ],
      [["¿Comprar la puesta en marcha cambia el precio del software?", "No. El CRM solo sigue en 49 dólares al mes. El plan de negocio sigue en 99 al mes o 990 al año. WhatsApp sigue en 29 dólares al mes por número, más las tarifas de Meta."]],
      [
        ["/services/website-build", "Sitio de experto"],
        ["/services/automations-setup", "Automatizaciones"],
        ["/services/crm-migration", "Migración de CRM"],
        ["/services/human-follow-up", "Seguimiento humano"],
        ["/pricing", "Precios"],
      ],
    ),
    "pt-BR": copy(
      "Implantação feita por nós | Bizuply",
      "Site de especialista, automações, migração de CRM e acompanhamento humano. As assinaturas do software continuam à parte. Serviços ocultos não são vendidos aqui.",
      "Serviços",
      "Trabalho que fazemos pelo negócio",
      "São os serviços de implantação e de pessoas impressos na página de preços. O CRM, o construtor e o editor de automações continuam podendo ser operados por você.",
      [
        ["Serviços publicados", ["O site de especialista custa 399 dólares uma vez: até cinco páginas em um modelo existente, com o seu conteúdo, formulário de leads, ligação ao CRM e até duas rodadas de ajustes. A automação começa em 99 dólares por uma automação simples. A migração começa em 249 dólares."]],
        ["Não está à venda aqui", ["Implantação de campanha paga, criação de conteúdo, um gestor pessoal de CRM e suporte externo estão ocultos. A compra deles continua fechada."]],
      ],
      [["Comprar a implantação muda o preço do software?", "Não. O CRM sozinho continua 49 dólares por mês. O plano de negócios continua 99 por mês ou 990 por ano. O WhatsApp continua 29 dólares por mês por número, mais as tarifas da Meta."]],
      [
        ["/services/website-build", "Site de especialista"],
        ["/services/automations-setup", "Automações"],
        ["/services/crm-migration", "Migração de CRM"],
        ["/services/human-follow-up", "Acompanhamento humano"],
        ["/pricing", "Preços"],
      ],
    ),
    ar: copy(
      "تهيئة ننفذها لكم | Bizuply",
      "بناء موقع على يد مختص، وتهيئة الأتمتة، ونقل CRM، ومتابعة بشرية. اشتراكات البرنامج تبقى منفصلة. الخدمات المخفية لا تُباع هنا.",
      "الخدمات",
      "عمل نقوم به لصالح النشاط",
      "هذه خدمات التهيئة والمتابعة البشرية المطبوعة في صفحة الأسعار. يمكنكم الاستمرار في تشغيل CRM والمنشئ ومحرر الأتمتة بأنفسكم.",
      [
        ["خدمات منشورة", ["بناء الموقع على يد مختص يكلف 399 دولاراً مرة واحدة: حتى خمس صفحات على قالب موجود، بمحتواكم، ونموذج عملاء محتملين، وربط بـ CRM، وحتى جولتي تعديل. تبدأ الأتمتة من 99 دولاراً لأتمتة بسيطة واحدة. يبدأ النقل من 249 دولاراً."]],
        ["غير معروض للبيع هنا", ["تهيئة حملة مدفوعة، وإنشاء المحتوى، ومدير CRM شخصي، ودعم خارجي مخفية. شراؤها يبقى مغلقاً."]],
      ],
      [["هل شراء التهيئة يغيّر سعر البرنامج؟", "لا. CRM وحده يبقى 49 دولاراً شهرياً. الخطة التجارية تبقى 99 شهرياً أو 990 سنوياً. واتساب يبقى 29 دولاراً شهرياً للرقم، إضافة إلى رسوم Meta."]],
      [
        ["/services/website-build", "موقع مختص"],
        ["/services/automations-setup", "تهيئة الأتمتة"],
        ["/services/crm-migration", "نقل CRM"],
        ["/services/human-follow-up", "متابعة بشرية"],
        ["/pricing", "الأسعار"],
      ],
    ),
  }),
};

const WEBSITE = pack("split", "site", {
  en: copy(
    "Expert website build | Bizuply",
    "A Bizuply expert builds a site of up to five pages from an existing template for $399. The self-serve editor remains available on its own.",
    "Expert website",
    "A site built for you, from the tools you already have",
    "This is not the self-serve website builder. You supply the words and pictures. The build uses an existing template, adapts it for mobile, adds a lead form, connects the CRM and the domain, and includes up to two revision rounds.",
    [
      ["What is included", ["Up to five pages. An extra page is $49. Content writing, if you want it, is $149. A basic store is an extra $399. Advanced custom design is an extra $799. The published site can send form inquiries into the CRM."]],
      ["What you still do in the product", ["After launch you can edit in the visual builder. Automations that react to a new lead belong to the business plan, not to this one-time build."]],
    ],
    [["Is this a custom-coded site?", "No. The published service uses the platform templates and tools. A fully custom design is the separate advanced-design extra, not a different product line."]],
    [["/website-builder", "Self-serve builder"], ["/pricing", "Pricing"], ["/crm", "CRM"]],
  ),
  he: copy(
    "בניית אתר על ידי מומחה | ביזאפלי",
    "מומחה ביזאפלי בונה אתר של עד חמישה עמודים מתבנית קיימת ב־399 דולר. העורך בשירות עצמי נשאר זמין בנפרד.",
    "אתר מומחה",
    "אתר שנבנה עבורכם, מתוך הכלים שכבר קיימים",
    "זה לא בונה האתרים בשירות עצמי. אתם מספקים טקסטים ותמונות. הבנייה משתמשת בתבנית קיימת, מותאמת לנייד, מוסיפה טופס לידים, מחברת CRM ודומיין, וכוללת עד שני סבבי תיקונים.",
    [
      ["מה כלול", ["עד חמישה עמודים. עמוד נוסף עולה 49 דולר. כתיבת תוכן, אם רוצים, עולה 149 דולר. חנות בסיסית היא תוספת של 399 דולר. עיצוב אישי מתקדם הוא תוספת של 799 דולר. טופס באתר שפורסם יכול לפתוח ליד ב־CRM."]],
      ["מה עדיין עושים במוצר", ["אחרי העלייה אפשר לערוך בעורך הוויזואלי. אוטומציה שמגיבה לליד חדש שייכת לחבילה העסקית, לא לבנייה החד־פעמית הזו."]],
    ],
    [["זה אתר בקוד מותאם?", "לא. השירות המפורסם משתמש בתבניות ובכלים של הפלטפורמה. עיצוב מותאם לגמרי הוא התוספת של עיצוב מתקדם, לא קו מוצרים אחר."]],
    [["/website-builder", "בנייה לבד"], ["/pricing", "מחירון"], ["/crm", "CRM"]],
  ),
  es: copy(
    "Sitio web de experto | Bizuply",
    "Un experto de Bizuply construye un sitio de hasta cinco páginas sobre una plantilla existente por 399 dólares. El editor de autoservicio sigue disponible.",
    "Sitio de experto",
    "Un sitio construido para usted, con las herramientas que ya existen",
    "No es el constructor de autoservicio. Usted aporta textos e imágenes. El trabajo usa una plantilla existente, se adapta al móvil, añade un formulario, conecta el CRM y el dominio, e incluye hasta dos rondas de cambios.",
    [
      ["Qué incluye", ["Hasta cinco páginas. Una página extra cuesta 49 dólares. La redacción, si la quiere, cuesta 149 dólares. Una tienda básica suma 399 dólares. El diseño avanzado suma 799 dólares. El formulario puede crear un lead en el CRM."]],
      ["Lo que sigue en el producto", ["Después de publicar puede editar en el constructor visual. Una automatización ante un lead nuevo pertenece al plan de negocio, no a este trabajo único."]],
    ],
    [["¿Es un sitio programado a medida?", "No. El servicio publicado usa las plantillas y herramientas de la plataforma. Un diseño totalmente a medida es el extra de diseño avanzado."]],
    [["/website-builder", "Constructor"], ["/pricing", "Precios"], ["/crm", "CRM"]],
  ),
  "pt-BR": copy(
    "Site feito por especialista | Bizuply",
    "Um especialista da Bizuply monta um site de até cinco páginas em um modelo existente por 399 dólares. O editor de autoatendimento continua disponível.",
    "Site de especialista",
    "Um site feito para você, com as ferramentas que já existem",
    "Não é o construtor de autoatendimento. Você entrega textos e imagens. O trabalho usa um modelo existente, adapta ao celular, acrescenta um formulário, liga o CRM e o domínio, e inclui até duas rodadas de ajustes.",
    [
      ["O que inclui", ["Até cinco páginas. Uma página extra custa 49 dólares. A redação, se quiser, custa 149 dólares. Uma loja básica soma 399 dólares. O design avançado soma 799 dólares. O formulário pode criar um lead no CRM."]],
      ["O que continua no produto", ["Depois da publicação dá para editar no construtor visual. Uma automação para lead novo pertence ao plano de negócios, não a este trabalho único."]],
    ],
    [["É um site programado sob medida?", "Não. O serviço publicado usa os modelos e as ferramentas da plataforma. Um design totalmente sob medida é o extra de design avançado."]],
    [["/website-builder", "Construtor"], ["/pricing", "Preços"], ["/crm", "CRM"]],
  ),
  ar: copy(
    "بناء موقع على يد مختص | Bizuply",
    "يبني مختص من Bizuply موقعاً حتى خمس صفحات على قالب موجود مقابل 399 دولاراً. يبقى المحرر ذاتي الخدمة متاحاً.",
    "موقع مختص",
    "موقع يُبنى لكم بالأدوات الموجودة فعلاً",
    "هذا ليس منشئ المواقع ذاتي الخدمة. تقدّمون النصوص والصور. يستخدم العمل قالباً موجوداً، ويتكيّف مع الجوال، ويضيف نموذجاً، ويربط CRM والنطاق، ويشمل حتى جولتي تعديل.",
    [
      ["ماذا يشمل", ["حتى خمس صفحات. الصفحة الإضافية 49 دولاراً. كتابة المحتوى، إن طُلبت، 149 دولاراً. متجر أساسي إضافة 399 دولاراً. تصميم متقدم إضافة 799 دولاراً. يمكن للنموذج أن ينشئ عميلاً محتملاً في CRM."]],
      ["ما يبقى في المنتج", ["بعد النشر يمكن التحرير في المنشئ المرئي. أتمتة تتفاعل مع عميل محتمل جديد تتبع الخطة التجارية، لا هذا العمل لمرة واحدة."]],
    ],
    [["هل هذا موقع مبرمج حسب الطلب؟", "لا. الخدمة المنشورة تستخدم قوالب المنصة وأدواتها. التصميم المخصص بالكامل هو إضافة التصميم المتقدم."]],
    [["/website-builder", "البناء الذاتي"], ["/pricing", "الأسعار"], ["/crm", "CRM"]],
  ),
});

PAGES["/services/website-build"] = WEBSITE;

PAGES["/services/automations-setup"] = pack("split", "automation", {
  en: copy(
    "Automation setup | Bizuply",
    "We build the automation for you. One simple automation is $99. A pack of three is $249. A pack of six is $399. A complex process is quoted.",
    "Automation setup",
    "An automation built for the way the business already works",
    "You can build automations yourself on the business plan. This service is for when Bizuply sets them up. The demo never sends real messages, and a live automation still respects WhatsApp template approval.",
    [
      ["The published prices", ["One simple automation is $99. Three are $249. Six are $399. A complex process is a custom quote. The software subscription is separate: automations run on the business plan at $99 a month or $990 a year."]],
      ["A typical path", ["A new lead is the trigger. The action can create a task or send a reminder. A WhatsApp message still needs an approved template and a paid number at $29 a month, plus Meta's message fees."]],
    ],
    [["Will the setup send messages during a demo?", "No. In the guided demo the automation is saved without sending real messages."]],
    [["/automations", "Automations product"], ["/pricing", "Pricing"], ["/whatsapp-api", "WhatsApp"]],
  ),
  he: copy(
    "הקמת אוטומציות | ביזאפלי",
    "אנחנו מקימים את האוטומציה. אוטומציה פשוטה אחת עולה 99 דולר. חבילת שלוש עולה 249. חבילת שש עולה 399. תהליך מורכב מקבל הצעה.",
    "הקמת אוטומציות",
    "אוטומציה שנבנית לפי איך שהעסק כבר עובד",
    "אפשר לבנות אוטומציות לבד בחבילה העסקית. השירות הזה מיועד למצב שבו ביזאפלי מקימה אותן. בדמו לא נשלחות הודעות אמיתיות, ואוטומציה חיה עדיין תלויה באישור תבנית WhatsApp.",
    [
      ["המחירים המפורסמים", ["אוטומציה פשוטה אחת: 99 דולר. שלוש: 249 דולר. שש: 399 דולר. תהליך מורכב: הצעה. מנוי התוכנה נפרד: אוטומציות רצות בחבילה העסקית ב־99 דולר לחודש או 990 לשנה."]],
      ["מסלול אופייני", ["ליד חדש הוא הטריגר. הפעולה יכולה ליצור משימה או תזכורת. הודעת WhatsApp עדיין דורשת תבנית מאושרת ומספר בתשלום של 29 דולר לחודש, בנוסף לחיובי Meta."]],
    ],
    [["ההקמה שולחת הודעות בזמן דמו?", "לא. בדמו המונחה האוטומציה נשמרת בלי לשלוח הודעות אמיתיות."]],
    [["/automations", "מוצר האוטומציות"], ["/pricing", "מחירון"], ["/whatsapp-api", "WhatsApp"]],
  ),
  es: copy(
    "Puesta en marcha de automatizaciones | Bizuply",
    "Nosotros montamos la automatización. Una simple cuesta 99 dólares. Tres cuestan 249. Seis cuestan 399. Un proceso complejo se cotiza.",
    "Automatizaciones",
    "Una automatización montada según cómo ya trabaja el negocio",
    "Puede construir automatizaciones en el plan de negocio. Este servicio es cuando Bizuply las configura. La demo no envía mensajes reales, y un envío de WhatsApp sigue exigiendo una plantilla aprobada.",
    [
      ["Precios publicados", ["Una automatización simple: 99 dólares. Tres: 249. Seis: 399. Un proceso complejo: presupuesto. La suscripción es aparte: las automatizaciones corren en el plan de negocio a 99 dólares al mes o 990 al año."]],
      ["Un recorrido habitual", ["Un lead nuevo es el disparador. La acción puede crear una tarea o un recordatorio. WhatsApp sigue pidiendo plantilla aprobada y un número de 29 dólares al mes, más las tarifas de Meta."]],
    ],
    [["¿La puesta en marcha envía mensajes en la demo?", "No. En la demo guiada la automatización se guarda sin enviar mensajes reales."]],
    [["/automations", "Producto"], ["/pricing", "Precios"], ["/whatsapp-api", "WhatsApp"]],
  ),
  "pt-BR": copy(
    "Implantação de automações | Bizuply",
    "Nós montamos a automação. Uma simples custa 99 dólares. Três custam 249. Seis custam 399. Um processo complexo é orçado.",
    "Automações",
    "Uma automação montada do jeito que o negócio já trabalha",
    "Dá para montar automações no plano de negócios. Este serviço é quando a Bizuply configura. A demo não envia mensagens reais, e um WhatsApp continua exigindo modelo aprovado.",
    [
      ["Preços publicados", ["Uma automação simples: 99 dólares. Três: 249. Seis: 399. Processo complexo: orçamento. A assinatura é à parte: as automações rodam no plano de negócios a 99 dólares por mês ou 990 por ano."]],
      ["Um caminho comum", ["Um lead novo é o gatilho. A ação pode criar uma tarefa ou um lembrete. O WhatsApp continua pedindo modelo aprovado e um número de 29 dólares por mês, mais as tarifas da Meta."]],
    ],
    [["A implantação envia mensagens na demo?", "Não. Na demo guiada a automação é salva sem enviar mensagens reais."]],
    [["/automations", "Produto"], ["/pricing", "Preços"], ["/whatsapp-api", "WhatsApp"]],
  ),
  ar: copy(
    "تهيئة الأتمتة | Bizuply",
    "نجهّز الأتمتة لكم. أتمتة بسيطة واحدة 99 دولاراً. ثلاث بـ 249. ست بـ 399. العملية المعقدة تُسعَّر بعرض.",
    "تهيئة الأتمتة",
    "أتمتة تُبنى حسب طريقة عمل النشاط",
    "يمكن بناء الأتمتة في الخطة التجارية. هذه الخدمة حين تجهّزها Bizuply. العرض التجريبي لا يرسل رسائل حقيقية، ورسالة واتساب ما زالت تحتاج قالباً معتمداً.",
    [
      ["الأسعار المنشورة", ["أتمتة بسيطة: 99 دولاراً. ثلاث: 249. ست: 399. عملية معقدة: عرض سعر. الاشتراك منفصل: تعمل الأتمتة في الخطة التجارية بـ 99 دولاراً شهرياً أو 990 سنوياً."]],
      ["مسار معتاد", ["عميل محتمل جديد هو المحفّز. يمكن للإجراء أن ينشئ مهمة أو تذكيراً. واتساب ما زال يطلب قالباً معتمداً ورقماً بـ 29 دولاراً شهرياً، إضافة إلى رسوم Meta."]],
    ],
    [["هل ترسل التهيئة رسائل أثناء العرض؟", "لا. في العرض الموجّه تُحفظ الأتمتة دون إرسال رسائل حقيقية."]],
    [["/automations", "المنتج"], ["/pricing", "الأسعار"], ["/whatsapp-api", "واتساب"]],
  ),
});

PAGES["/services/crm-migration"] = pack("split", "crm", {
  en: copy(
    "CRM migration | Bizuply",
    "Move clients, leads and statuses into Bizuply. Basic migration is $249 once. A large or complex move is quoted separately.",
    "CRM migration",
    "Bring the existing pipeline into Bizuply",
    "The service transfers clients and leads, carries statuses across, maps fields, checks the result and includes training after the move. It does not change the $49 CRM subscription.",
    [
      ["What you prepare", ["An export from the current system and a decision about which statuses match Bizuply's six: New, Contacted, Interested, Converted, Lost and Old lead."]],
      ["What happens after", ["The team works in the Bizuply CRM. Appointments, automations and collaborations still depend on the business plan if you need them."]],
    ],
    [["Is every old system the same price?", "No. The published basic migration is $249. A large volume or a complex system is quoted separately."]],
    [["/crm", "CRM"], ["/pricing", "Pricing"]],
  ),
  he: copy(
    "מעבר מ־CRM אחר | ביזאפלי",
    "מעבירים לקוחות, לידים וסטטוסים לביזאפלי. מעבר בסיסי עולה 249 דולר חד־פעמית. היקף גדול או מערכת מורכבת מקבלים הצעה נפרדת.",
    "מעבר CRM",
    "מביאים את הצינור הקיים אל ביזאפלי",
    "השירות מעביר לקוחות ולידים, מעביר סטטוסים, מתאים שדות, בודק את התוצאה וכולל הדרכה אחרי המעבר. הוא לא משנה את מנוי ה־CRM ב־49 דולר.",
    [
      ["מה מכינים", ["ייצוא מהמערכת הנוכחית והחלטה אילו סטטוסים מתאימים לשישה של ביזאפלי: חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן."]],
      ["מה קורה אחר כך", ["הצוות עובד ב־CRM של ביזאפלי. תורים, אוטומציות ושיתופים עדיין תלויים בחבילה העסקית אם צריך אותם."]],
    ],
    [["כל מערכת ישנה באותו מחיר?", "לא. המעבר הבסיסי המפורסם הוא 249 דולר. היקף גדול או מערכת מורכבת מתומחרים בנפרד."]],
    [["/crm", "CRM"], ["/pricing", "מחירון"]],
  ),
  es: copy(
    "Migración de CRM | Bizuply",
    "Pase clientes, leads y estados a Bizuply. La migración básica cuesta 249 dólares una vez. Un volumen grande se cotiza aparte.",
    "Migración",
    "Traer el pipeline actual a Bizuply",
    "El servicio transfiere clientes y leads, traslada estados, mapea campos, revisa el resultado e incluye formación. No cambia la suscripción de CRM de 49 dólares.",
    [
      ["Qué preparar", ["Una exportación del sistema actual y una decisión sobre qué estados coinciden con los seis de Bizuply: Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo."]],
      ["Después", ["El equipo trabaja en el CRM de Bizuply. Citas, automatizaciones y colaboraciones siguen dependiendo del plan de negocio."]],
    ],
    [["¿Todo sistema antiguo cuesta igual?", "No. La migración básica publicada es de 249 dólares. Un volumen grande o un sistema complejo se cotiza aparte."]],
    [["/crm", "CRM"], ["/pricing", "Precios"]],
  ),
  "pt-BR": copy(
    "Migração de CRM | Bizuply",
    "Traga clientes, leads e status para a Bizuply. A migração básica custa 249 dólares uma vez. Um volume grande é orçado à parte.",
    "Migração",
    "Trazer o pipeline atual para a Bizuply",
    "O serviço transfere clientes e leads, leva os status, mapeia campos, confere o resultado e inclui treinamento. Não muda a assinatura de CRM de 49 dólares.",
    [
      ["O que preparar", ["Uma exportação do sistema atual e uma decisão sobre quais status combinam com os seis da Bizuply: Novo, Contatado, Interessado, Convertido, Perdido e Lead antigo."]],
      ["Depois", ["A equipe trabalha no CRM da Bizuply. Agenda, automações e colaborações continuam dependendo do plano de negócios."]],
    ],
    [["Todo sistema antigo custa igual?", "Não. A migração básica publicada é 249 dólares. Volume grande ou sistema complexo é orçado à parte."]],
    [["/crm", "CRM"], ["/pricing", "Preços"]],
  ),
  ar: copy(
    "الانتقال من CRM آخر | Bizuply",
    "ننقل العملاء والعملاء المحتملين والحالات إلى Bizuply. النقل الأساسي 249 دولاراً مرة واحدة. الحجم الكبير يُسعَّر على حدة.",
    "نقل CRM",
    "إحضار المسار الحالي إلى Bizuply",
    "تنقل الخدمة العملاء والعملاء المحتملين والحالات، وتطابق الحقول، وتفحص النتيجة، وتشمل تدريباً. لا تغيّر اشتراك CRM البالغ 49 دولاراً.",
    [
      ["ماذا تُجهّزون", ["تصدير من النظام الحالي وقرار أي الحالات تطابق الحالات الست في Bizuply: جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم."]],
      ["بعد ذلك", ["يعمل الفريق في CRM لدى Bizuply. المواعيد والأتمتة والتعاون تبقى مرتبطة بالخطة التجارية."]],
    ],
    [["هل كل نظام قديم بالسعر نفسه؟", "لا. النقل الأساسي المنشور 249 دولاراً. الحجم الكبير أو النظام المعقد يُسعَّر على حدة."]],
    [["/crm", "CRM"], ["/pricing", "الأسعار"]],
  ),
});

PAGES["/services/human-follow-up"] = pack("split", null, {
  en: copy(
    "Human follow-up | Bizuply",
    "People, not a chatbot. Initial lead response is $199 a month. A personal sales rep is $499 a month. Old-lead follow-up starts at $149 once.",
    "Human follow-up",
    "A person follows the lead inside the CRM",
    "The agents page is a human service. Initial response covers up to 40 leads a month and up to three call attempts, then updates status and a call summary. A sales rep covers up to 40 hot leads, calls, follow-ups and proposals. Old-lead follow-up handles up to 50 leads that the CRM has already marked old.",
    [
      ["Limits you can read on the price list", ["Initial response is $199 a month. The sales representative is $499 a month. Old-lead follow-up starts at $149 once, with up to two call attempts. None of these promise a number of closed sales."]],
      ["What this is not", ["It is not an AI chatbot. It is not multi-client WhatsApp management. A personal CRM manager and external customer support stay hidden and are not sold here."]],
    ],
    [["Who updates the CRM?", "The person doing the follow-up writes the status and the call summary into the CRM. The business still owns the account."]],
    [["/agents", "Human agents"], ["/pricing", "Pricing"], ["/crm", "CRM"]],
  ),
  he: copy(
    "ליווי אנושי ללידים | ביזאפלי",
    "אנשים, לא צ'אטבוט. מענה ראשוני עולה 199 דולר לחודש. נציג מכירות אישי עולה 499 דולר לחודש. פולואפ ללידים ישנים מתחיל ב־149 דולר.",
    "ליווי אנושי",
    "אדם מטפל בליד בתוך ה־CRM",
    "עמוד הנציגים הוא שירות אנושי. מענה ראשוני מכסה עד 40 לידים בחודש ועד שלושה ניסיונות שיחה, ואז מעדכן סטטוס וסיכום. נציג מכירות מכסה עד 40 לידים חמים, שיחות, פולואפים והצעות. פולואפ לידים ישנים מטפל בעד 50 לידים שה־CRM כבר סימן כישנים.",
    [
      ["גבולות שאפשר לקרוא במחירון", ["מענה ראשוני: 199 דולר לחודש. נציג מכירות: 499 דולר לחודש. פולואפ לידים ישנים מתחיל ב־149 דולר חד־פעמית, עם עד שני ניסיונות שיחה. אף אחד מאלה לא מבטיח מספר עסקאות."]],
      ["מה זה לא", ["זה לא צ'אטבוט. זה לא ניהול WhatsApp של כמה לקוחות ממסך אחד. מנהל CRM אישי ותמיכה חיצונית נשארים מוסתרים ולא נמכרים כאן."]],
    ],
    [["מי מעדכן את ה־CRM?", "מי שמבצע את המעקב כותב את הסטטוס ואת סיכום השיחה ב־CRM. החשבון נשאר של העסק."]],
    [["/agents", "נציגים"], ["/pricing", "מחירון"], ["/crm", "CRM"]],
  ),
  es: copy(
    "Seguimiento humano | Bizuply",
    "Personas, no un chatbot. La respuesta inicial cuesta 199 dólares al mes. Un comercial cuesta 499. El seguimiento de leads antiguos empieza en 149.",
    "Seguimiento humano",
    "Una persona atiende el lead dentro del CRM",
    "La página de agentes es un servicio humano. La respuesta inicial cubre hasta 40 leads al mes y hasta tres intentos de llamada. El comercial cubre hasta 40 leads calientes. El seguimiento de leads antiguos trata hasta 50 leads que el CRM ya marcó como antiguos.",
    [
      ["Límites publicados", ["Respuesta inicial: 199 dólares al mes. Comercial: 499 al mes. Leads antiguos: desde 149 una vez, con hasta dos intentos. Ninguno promete un número de ventas cerradas."]],
      ["Qué no es", ["No es un chatbot. No es gestionar el WhatsApp de varios clientes desde una pantalla. Un gestor personal de CRM y el soporte externo siguen ocultos."]],
    ],
    [["¿Quién actualiza el CRM?", "Quien hace el seguimiento escribe el estado y el resumen de la llamada. La cuenta sigue siendo del negocio."]],
    [["/agents", "Agentes"], ["/pricing", "Precios"], ["/crm", "CRM"]],
  ),
  "pt-BR": copy(
    "Acompanhamento humano | Bizuply",
    "Pessoas, não um chatbot. A resposta inicial custa 199 dólares por mês. Um vendedor custa 499. O follow-up de leads antigos começa em 149.",
    "Acompanhamento humano",
    "Uma pessoa trata o lead dentro do CRM",
    "A página de agentes é um serviço humano. A resposta inicial cobre até 40 leads por mês e até três tentativas de ligação. O vendedor cobre até 40 leads quentes. O follow-up de leads antigos trata até 50 leads que o CRM já marcou como antigos.",
    [
      ["Limites publicados", ["Resposta inicial: 199 dólares por mês. Vendedor: 499 por mês. Leads antigos: a partir de 149 uma vez, com até duas tentativas. Nenhum promete um número de vendas fechadas."]],
      ["O que não é", ["Não é um chatbot. Não é gerir o WhatsApp de vários clientes numa tela. Um gestor pessoal de CRM e o suporte externo continuam ocultos."]],
    ],
    [["Quem atualiza o CRM?", "Quem faz o acompanhamento escreve o status e o resumo da ligação. A conta continua do negócio."]],
    [["/agents", "Agentes"], ["/pricing", "Preços"], ["/crm", "CRM"]],
  ),
  ar: copy(
    "متابعة بشرية | Bizuply",
    "أشخاص، لا روبوت دردشة. الرد الأولي 199 دولاراً شهرياً. مندوب المبيعات 499. متابعة العملاء المحتملين القدامى تبدأ من 149.",
    "متابعة بشرية",
    "شخص يتابع العميل المحتمل داخل CRM",
    "صفحة الوكلاء خدمة بشرية. يغطي الرد الأولي حتى 40 عميلاً محتملاً شهرياً وحتى ثلاث محاولات اتصال. يغطي المندوب حتى 40 عميلاً ساخناً. تعالج متابعة القدامى حتى 50 عميلاً وضعهم CRM بالفعل كقدامى.",
    [
      ["حدود منشورة", ["الرد الأولي: 199 دولاراً شهرياً. المندوب: 499 شهرياً. القدامى: من 149 مرة واحدة، وحتى محاولتي اتصال. لا يعد أي منها بعدد صفقات."]],
      ["ما ليس هذا", ["ليس روبوت دردشة. ليس إدارة واتساب لعدة عملاء من شاشة واحدة. مدير CRM شخصي والدعم الخارجي يبقيان مخفيين."]],
    ],
    [["من يحدّث CRM؟", "من ينفّذ المتابعة يكتب الحالة وملخص المكالمة. يبقى الحساب ملك النشاط."]],
    [["/agents", "الوكلاء"], ["/pricing", "الأسعار"], ["/crm", "CRM"]],
  ),
});

function industry(locales) {
  return pack("industry", "crm", locales);
}

PAGES["/solutions/clinics"] = industry({
  en: copy(
    "Clinics and appointment businesses | Bizuply",
    "A clinic can keep inquiries, a client file and a 15-minute appointment calendar in Bizuply. This is not a medical-records system.",
    "Clinics",
    "Inquiries and appointments for a clinic",
    "The fit is operational: a person asks for a visit, the lead keeps a status, the service has a duration and a price, and the calendar offers open slots in 15-minute steps. Bizuply does not claim to store clinical charts or to meet HIPAA.",
    [
      ["A working day", ["The inquiry arrives from the website form, from Meta Lead Ads or by being added in the CRM. Staff log a call or a note. Booking uses the service catalog and the business hours. The client can book from the public booking page when that page is turned on."]],
      ["What to add only if you need it", ["Automations and collaborations are on the business plan. WhatsApp replies need the separate $29 number and an approved template. An expert website is the $399 build if you do not want to use the editor yourself."]],
    ],
    [["Does this replace clinical software?", "No. It schedules and tracks the relationship. Diagnosis, charts and regulated medical records stay in the system meant for them."]],
    [["/appointments", "Appointments"], ["/crm", "CRM"], ["/website-builder", "Website builder"]],
  ),
  he: copy(
    "קליניקות ועסקים עם תורים | ביזאפלי",
    "קליניקה יכולה לשמור פניות, תיק לקוח ויומן בקפיצות של 15 דקות בביזאפלי. זו לא מערכת רשומות רפואיות.",
    "קליניקות",
    "פניות ותורים לקליניקה",
    "ההתאמה תפעולית: אדם מבקש ביקור, הליד שומר סטטוס, לשירות יש משך ומחיר, והיומן מציע חלונות פנויים בקפיצות של 15 דקות. ביזאפלי לא טוענת שהיא שומרת תיק רפואי או עומדת ב־HIPAA.",
    [
      ["יום עבודה", ["הפנייה מגיעה מטופס באתר, ממודעות לידים של Meta או מהקלדה ב־CRM. הצוות רושם שיחה או הערה. הזימון משתמש בקטלוג השירותים ובשעות הפעילות. הלקוח יכול לקבוע מעמוד הזימון הציבורי כשהעמוד פעיל."]],
      ["מה להוסיף רק אם צריך", ["אוטומציות ושיתופים נמצאים בחבילה העסקית. מענה ב־WhatsApp דורש את המספר הנפרד ב־29 דולר ותבנית מאושרת. אתר מומחה הוא הבנייה ב־399 דולר אם לא רוצים לערוך לבד."]],
    ],
    [["זה מחליף תוכנה קלינית?", "לא. זה מתזמן ועוקב אחרי הקשר. אבחון, תיקים ורשומות רפואיות מפוקחות נשארים במערכת שמיועדת להם."]],
    [["/appointments", "תורים"], ["/crm", "CRM"], ["/website-builder", "בונה אתרים"]],
  ),
  es: copy(
    "Clínicas y negocios con citas | Bizuply",
    "Una clínica puede guardar consultas, un expediente y un calendario de 15 minutos en Bizuply. No es un sistema de historia clínica.",
    "Clínicas",
    "Consultas y citas para una clínica",
    "El encaje es operativo: una persona pide una visita, el lead guarda un estado, el servicio tiene duración y precio, y la agenda ofrece huecos de 15 minutos. Bizuply no afirma guardar historias clínicas ni cumplir HIPAA.",
    [
      ["Un día de trabajo", ["La consulta llega del formulario del sitio, de Lead Ads de Meta o se añade en el CRM. El equipo anota una llamada. La reserva usa el catálogo y el horario. El cliente puede reservar en la página pública cuando está activa."]],
      ["Qué añadir solo si hace falta", ["Las automatizaciones están en el plan de negocio. WhatsApp pide el número de 29 dólares y una plantilla aprobada. El sitio de experto cuesta 399 dólares si no quiere usar el editor."]],
    ],
    [["¿Sustituye al software clínico?", "No. Agenda y sigue la relación. El diagnóstico y la historia clínica se quedan en el sistema pensado para ellos."]],
    [["/appointments", "Citas"], ["/crm", "CRM"], ["/website-builder", "Constructor"]],
  ),
  "pt-BR": copy(
    "Clínicas e negócios com agenda | Bizuply",
    "Uma clínica pode guardar pedidos, um arquivo e uma agenda de 15 minutos na Bizuply. Não é um sistema de prontuário.",
    "Clínicas",
    "Pedidos e horários para uma clínica",
    "O encaixe é operacional: uma pessoa pede uma visita, o lead guarda um status, o serviço tem duração e preço, e a agenda oferece horários de 15 minutos. A Bizuply não afirma guardar prontuário nem cumprir HIPAA.",
    [
      ["Um dia de trabalho", ["O pedido chega do formulário do site, de Lead Ads da Meta ou é lançado no CRM. A equipe anota uma ligação. A reserva usa o catálogo e o horário. O cliente pode marcar na página pública quando ela está ativa."]],
      ["O que acrescentar só se precisar", ["As automações ficam no plano de negócios. O WhatsApp pede o número de 29 dólares e um modelo aprovado. O site de especialista custa 399 dólares se você não quiser usar o editor."]],
    ],
    [["Substitui o software clínico?", "Não. Agenda e acompanha o relacionamento. Diagnóstico e prontuário ficam no sistema feito para isso."]],
    [["/appointments", "Agenda"], ["/crm", "CRM"], ["/website-builder", "Construtor"]],
  ),
  ar: copy(
    "العيادات والأعمال ذات المواعيد | Bizuply",
    "يمكن للعيادة حفظ الطلبات وملف العميل وتقويم بخطوات 15 دقيقة في Bizuply. هذا ليس نظام ملفات طبية.",
    "عيادات",
    "طلبات ومواعيد لعيادة",
    "الملاءمة تشغيلية: يطلب شخص زيارة، ويحفظ العميل المحتمل حالة، وللخدمة مدة وسعر، ويعرض التقويم فترات من 15 دقيقة. لا تدّعي Bizuply حفظ ملف طبي أو الامتثال لـ HIPAA.",
    [
      ["يوم عمل", ["يصل الطلب من نموذج الموقع أو من إعلانات Meta أو يُضاف في CRM. يسجّل الفريق مكالمة. يستخدم الحجز كتالوج الخدمات وساعات العمل. يمكن للعميل الحجز من الصفحة العامة حين تكون مفعّلة."]],
      ["ما يُضاف فقط عند الحاجة", ["الأتمتة في الخطة التجارية. واتساب يطلب الرقم ذا 29 دولاراً وقالباً معتمداً. موقع المختص يكلف 399 دولاراً إذا لم ترغبوا في استخدام المحرر."]],
    ],
    [["هل يحل محل برنامج طبي؟", "لا. هو يجدول ويتابع العلاقة. التشخيص والملف الطبي يبقيان في النظام المخصص لهما."]],
    [["/appointments", "المواعيد"], ["/crm", "CRM"], ["/website-builder", "منشئ المواقع"]],
  ),
});

PAGES["/solutions/beauty"] = industry({
  en: copy(
    "Beauty studios | Bizuply",
    "A salon can publish a site, take a booking and keep the client file in Bizuply. A separate beauty SaaS, if one is public, is listed on the marketplace rather than invented here.",
    "Beauty",
    "Bookings and a client file for a beauty studio",
    "Services, duration and price feed the same 15-minute calendar used by other appointment businesses. The website form can create a lead before the visit is booked. This page does not claim a branded beauty product unless it is currently published on the marketplace.",
    [
      ["Before the visit", ["The studio describes the treatment on the site or in the service catalog. A lead from Meta or from the form is followed in the CRM until a time is chosen."]],
      ["Where a ready system would appear", ["Open the SaaS marketplace to see products the API currently marks as public. If a beauty system is not listed there, it is not offered for sale on this page."]],
    ],
    [["Is there a checkout for a beauty app on this page?", "No. This page sells the Bizuply CRM, appointments and website path. Marketplace products are reviewed on /saas and are not checked out from here."]],
    [["/appointments", "Appointments"], ["/website-builder", "Website builder"], ["/saas", "Marketplace"]],
  ),
  he: copy(
    "מכוני יופי | ביזאפלי",
    "מכון יכול לפרסם אתר, לקבל זימון ולשמור תיק לקוח בביזאפלי. מערכת יופי נפרדת, אם היא ציבורית, מופיעה במרקטפלייס ולא מומצאת כאן.",
    "יופי",
    "זימון ותיק לקוח למכון יופי",
    "שירות, משך ומחיר נכנסים לאותו יומן של 15 דקות. טופס באתר יכול לפתוח ליד לפני שנקבע תור. העמוד לא מציג מוצר יופי ממותג אלא אם הוא מפורסם כרגע במרקטפלייס.",
    [
      ["לפני הביקור", ["המכון מתאר את הטיפול באתר או בקטלוג השירותים. ליד מ־Meta או מהטופס מטופל ב־CRM עד שבוחרים שעה."]],
      ["איפה מופיעה מערכת מוכנה", ["פותחים את מרקטפלייס ה־SaaS ורואים מה ה־API מסמן כציבורי. אם מערכת יופי לא מופיעה שם, היא לא נמכרת מהעמוד הזה."]],
    ],
    [["יש כאן רכישה של אפליקציית יופי?", "לא. העמוד הזה מציג את מסלול ה־CRM, התורים והאתר. מוצרי המרקטפלייס נבדקים ב־/saas ולא נרכשים מכאן."]],
    [["/appointments", "תורים"], ["/website-builder", "בונה אתרים"], ["/saas", "מרקטפלייס"]],
  ),
  es: copy(
    "Estudios de belleza | Bizuply",
    "Un salón puede publicar un sitio, tomar reservas y guardar el expediente en Bizuply. Un SaaS de belleza, si es público, aparece en el marketplace.",
    "Belleza",
    "Reservas y expediente para un estudio de belleza",
    "Servicio, duración y precio alimentan el mismo calendario de 15 minutos. El formulario puede crear un lead antes de reservar. Esta página no anuncia un producto de belleza de marca si no está publicado en el marketplace.",
    [
      ["Antes de la visita", ["El estudio describe el tratamiento en el sitio o en el catálogo. Un lead de Meta o del formulario se sigue en el CRM hasta elegir hora."]],
      ["Dónde aparece un sistema listo", ["Abra el marketplace y vea lo que la API marca como público. Si un sistema de belleza no está ahí, no se vende en esta página."]],
    ],
    [["¿Hay compra de una app de belleza aquí?", "No. Esta página presenta CRM, citas y sitio. Los productos del marketplace se revisan en /saas."]],
    [["/appointments", "Citas"], ["/website-builder", "Constructor"], ["/saas", "Marketplace"]],
  ),
  "pt-BR": copy(
    "Estúdios de beleza | Bizuply",
    "Um salão pode publicar um site, receber reservas e guardar o arquivo na Bizuply. Um SaaS de beleza, se for público, aparece no marketplace.",
    "Beleza",
    "Reservas e arquivo para um estúdio de beleza",
    "Serviço, duração e preço alimentam a mesma agenda de 15 minutos. O formulário pode criar um lead antes da reserva. Esta página não anuncia um produto de beleza de marca se ele não estiver publicado no marketplace.",
    [
      ["Antes da visita", ["O estúdio descreve o tratamento no site ou no catálogo. Um lead da Meta ou do formulário é acompanhado no CRM até escolher o horário."]],
      ["Onde aparece um sistema pronto", ["Abra o marketplace e veja o que a API marca como público. Se um sistema de beleza não estiver lá, não é vendido nesta página."]],
    ],
    [["Há compra de um app de beleza aqui?", "Não. Esta página apresenta CRM, agenda e site. Os produtos do marketplace são vistos em /saas."]],
    [["/appointments", "Agenda"], ["/website-builder", "Construtor"], ["/saas", "Marketplace"]],
  ),
  ar: copy(
    "معاهد التجميل | Bizuply",
    "يمكن للمعهد نشر موقع واستقبال حجز وحفظ ملف العميل في Bizuply. نظام تجميل منفصل، إن كان عاماً، يظهر في السوق وليس هنا.",
    "تجميل",
    "حجوزات وملف عميل لمعهد تجميل",
    "الخدمة والمدة والسعر تغذّي تقويم الخمس عشرة دقيقة نفسه. يمكن للنموذج أن ينشئ عميلاً محتملاً قبل الحجز. لا تعلن هذه الصفحة عن منتج تجميل باسم تجاري إن لم يكن منشوراً في السوق.",
    [
      ["قبل الزيارة", ["يصف المعهد العلاج في الموقع أو في الكتالوج. يُتابَع عميل Meta أو النموذج في CRM حتى اختيار الوقت."]],
      ["أين يظهر نظام جاهز", ["افتحوا سوق SaaS لتروا ما تعلّمه الواجهة كعام. إن لم يظهر نظام تجميل هناك، فهو غير معروض للبيع في هذه الصفحة."]],
    ],
    [["هل هناك شراء لتطبيق تجميل هنا؟", "لا. تعرض الصفحة مسار CRM والمواعيد والموقع. تُراجع منتجات السوق في /saas."]],
    [["/appointments", "المواعيد"], ["/website-builder", "منشئ المواقع"], ["/saas", "السوق"]],
  ),
});

PAGES["/solutions/real-estate"] = industry({
  en: copy(
    "Real estate inquiries | Bizuply",
    "An agency can capture a property inquiry in the CRM and follow it with tasks. A property marketplace product is only offered if the SaaS list currently publishes it.",
    "Real estate",
    "Follow a property inquiry without a separate spreadsheet",
    "Someone asks about a listing from the website or from a Meta lead form. The lead stores the source. Staff change the status, log the call and set a task. Bizuply does not claim an MLS connection on this page.",
    [
      ["The platform path", ["Website form or Lead Ads into the CRM, then the six statuses and a dated task. Appointments can hold a viewing if you use the calendar."]],
      ["A ready property system", ["If a property product is public, it appears on /saas with the description and demo the API returns. This page does not open a purchase for it."]],
    ],
    [["Do leads from Facebook land in the CRM?", "Yes, after the business connects its own Facebook page and approves the permissions. Bizuply is a Meta Tech Provider. It is not described as a Meta Business Partner."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Meta campaigns"], ["/saas", "Marketplace"]],
  ),
  he: copy(
    "פניות נדל״ן | ביזאפלי",
    "סוכנות יכולה לקלוט פנייה על נכס ב־CRM ולעקוב אחריה במשימות. מוצר נדל״ן במרקטפלייס מוצע רק אם הרשימה מפרסמת אותו עכשיו.",
    "נדל״ן",
    "מעקב אחרי פניית נכס בלי גיליון נפרד",
    "מישהו שואל על נכס מהאתר או מטופס לידים של Meta. הליד שומר את המקור. הצוות משנה סטטוס, רושם שיחה וקובע משימה. אין כאן טענה לחיבור MLS.",
    [
      ["מסלול הפלטפורמה", ["טופס באתר או Lead Ads נכנסים ל־CRM, ואז שישה סטטוסים ומשימה עם תאריך. תור יכול לשמש לסיור בנכס אם משתמשים ביומן."]],
      ["מערכת נכסים מוכנה", ["אם מוצר נדל״ן ציבורי, הוא מופיע ב־/saas עם התיאור והדמו שה־API מחזיר. העמוד הזה לא פותח עבורו רכישה."]],
    ],
    [["לידים מפייסבוק נכנסים ל־CRM?", "כן, אחרי שהעסק מחבר את דף הפייסבוק שלו ומאשר הרשאות. ביזאפלי היא Meta Tech Provider. היא לא מתוארת כ־Meta Business Partner."]],
    [["/crm", "CRM"], ["/meta-campaigns", "קמפיינים"], ["/saas", "מרקטפלייס"]],
  ),
  es: copy(
    "Consultas inmobiliarias | Bizuply",
    "Una agencia puede guardar una consulta de inmueble en el CRM y seguirla con tareas. Un producto inmobiliario solo se ofrece si el marketplace lo publica.",
    "Inmobiliario",
    "Seguir una consulta de inmueble sin una hoja aparte",
    "Alguien pregunta por un anuncio desde el sitio o desde un formulario de Meta. El lead guarda el origen. El equipo cambia el estado, anota la llamada y crea una tarea. Esta página no afirma una conexión MLS.",
    [
      ["Ruta de la plataforma", ["Formulario o Lead Ads entran al CRM, luego los seis estados y una tarea con fecha. Una cita puede ser una visita si usa el calendario."]],
      ["Un sistema listo", ["Si un producto inmobiliario es público, aparece en /saas. Esta página no abre una compra."]],
    ],
    [["¿Los leads de Facebook entran al CRM?", "Sí, después de conectar la página de Facebook y aprobar permisos. Bizuply es Meta Tech Provider, no un Meta Business Partner."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Campañas"], ["/saas", "Marketplace"]],
  ),
  "pt-BR": copy(
    "Pedidos imobiliários | Bizuply",
    "Uma imobiliária pode guardar um pedido de imóvel no CRM e acompanhá-lo com tarefas. Um produto imobiliário só é oferecido se o marketplace o publicar.",
    "Imóveis",
    "Acompanhar um pedido de imóvel sem uma planilha à parte",
    "Alguém pergunta sobre um anúncio pelo site ou por um formulário da Meta. O lead guarda a origem. A equipe muda o status, anota a ligação e cria uma tarefa. Esta página não afirma conexão com MLS.",
    [
      ["Caminho da plataforma", ["Formulário ou Lead Ads entram no CRM, depois os seis status e uma tarefa com data. Um compromisso pode ser uma visita se você usar a agenda."]],
      ["Um sistema pronto", ["Se um produto imobiliário for público, ele aparece em /saas. Esta página não abre uma compra."]],
    ],
    [["Leads do Facebook entram no CRM?", "Sim, depois de conectar a página do Facebook e aprovar as permissões. A Bizuply é Meta Tech Provider, não Meta Business Partner."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Campanhas"], ["/saas", "Marketplace"]],
  ),
  ar: copy(
    "استفسارات العقارات | Bizuply",
    "يمكن لوكالة حفظ استفسار عن عقار في CRM ومتابعته بمهام. منتج عقاري يُعرض فقط إذا نشره السوق الآن.",
    "عقارات",
    "متابعة استفسار عن عقار دون جدول منفصل",
    "يسأل شخص عن إعلان من الموقع أو من نموذج Meta. يحفظ العميل المحتمل المصدر. يغيّر الفريق الحالة ويسجّل المكالمة وينشئ مهمة. لا تدّعي هذه الصفحة ربط MLS.",
    [
      ["مسار المنصة", ["يدخل النموذج أو Lead Ads إلى CRM، ثم الحالات الست ومهمة بتاريخ. يمكن أن يكون الموعد زيارة إذا استُخدم التقويم."]],
      ["نظام جاهز", ["إذا كان منتج عقاري عاماً فهو يظهر في /saas. هذه الصفحة لا تفتح شراءً له."]],
    ],
    [["هل تصل عملاء فيسبوك إلى CRM؟", "نعم، بعد ربط صفحة فيسبوك والموافقة على الأذونات. Bizuply هي Meta Tech Provider وليست Meta Business Partner."]],
    [["/crm", "CRM"], ["/meta-campaigns", "الحملات"], ["/saas", "السوق"]],
  ),
});

PAGES["/solutions/restaurants"] = industry({
  en: copy(
    "Restaurants | Bizuply",
    "A restaurant that wants a ready ordering system should look at the SaaS marketplace. Bizuply CRM is for inquiries and follow-up, not a kitchen display.",
    "Restaurants",
    "Inquiries in the CRM, ordering systems on the marketplace",
    "Table service, a QR menu and a kitchen ticket are not features of the CRM calendar. If a restaurant system is public, the marketplace page shows its name, description, demo and whether a purchase is open. This page does not start that purchase.",
    [
      ["When the CRM is the right tool", ["Catering inquiries, private events and partnership requests can be leads with a source, a status and a task. A website form can collect them."]],
      ["When to open the marketplace", ["Ready restaurant software is listed only when the API marks it public. Names that are not on that list are not for sale here."]],
    ],
    [["Can I manage tables from the CRM?", "Not as a floor system. Use a marketplace product if one is published for restaurants. Use the CRM for the inquiries around the business."]],
    [["/saas", "Marketplace"], ["/crm", "CRM"], ["/website-builder", "Website builder"]],
  ),
  he: copy(
    "מסעדות | ביזאפלי",
    "מסעדה שרוצה מערכת הזמנות מוכנה צריכה להסתכל במרקטפלייס. ה־CRM של ביזאפלי מיועד לפניות ולמעקב, לא למסך מטבח.",
    "מסעדות",
    "פניות ב־CRM, מערכות הזמנה במרקטפלייס",
    "שירות שולחן, תפריט QR ופתק למטבח אינם יכולות של יומן ה־CRM. אם מערכת מסעדות ציבורית, עמוד המרקטפלייס מציג שם, תיאור, דמו ואם הרכישה פתוחה. העמוד הזה לא מתחיל את הרכישה.",
    [
      ["מתי ה־CRM הוא הכלי", ["פניות לקייטרינג, אירועים פרטיים ובקשות שיתוף יכולות להיות לידים עם מקור, סטטוס ומשימה. טופס באתר יכול לאסוף אותן."]],
      ["מתי לפתוח את המרקטפלייס", ["תוכנת מסעדות מוכנה מופיעה רק כשה־API מסמן אותה כציבורית. שם שלא ברשימה לא נמכר כאן."]],
    ],
    [["אפשר לנהל שולחנות מה־CRM?", "לא כמערכת רצפה. משתמשים במוצר מרקטפלייס אם פורסם למסעדות. ב־CRM מטפלים בפניות שמסביב לעסק."]],
    [["/saas", "מרקטפלייס"], ["/crm", "CRM"], ["/website-builder", "בונה אתרים"]],
  ),
  es: copy(
    "Restaurantes | Bizuply",
    "Un restaurante que quiere un sistema de pedidos listo debe mirar el marketplace. El CRM de Bizuply es para consultas, no para la cocina.",
    "Restaurantes",
    "Consultas en el CRM, pedidos en el marketplace",
    "El servicio de mesa, un menú QR y un ticket de cocina no son funciones del calendario del CRM. Si un sistema de restaurante es público, /saas muestra su nombre y su demo. Esta página no inicia la compra.",
    [
      ["Cuándo sirve el CRM", ["Consultas de catering, eventos privados y colaboraciones pueden ser leads con origen, estado y tarea."]],
      ["Cuándo abrir el marketplace", ["El software de restaurante aparece solo si la API lo marca público."]],
    ],
    [["¿Puedo gestionar mesas desde el CRM?", "No como plano de sala. Use un producto del marketplace si está publicado. Use el CRM para las consultas."]],
    [["/saas", "Marketplace"], ["/crm", "CRM"], ["/website-builder", "Constructor"]],
  ),
  "pt-BR": copy(
    "Restaurantes | Bizuply",
    "Um restaurante que quer um sistema de pedidos pronto deve olhar o marketplace. O CRM da Bizuply é para pedidos de contato, não para a cozinha.",
    "Restaurantes",
    "Contatos no CRM, pedidos no marketplace",
    "Serviço de mesa, cardápio QR e comanda de cozinha não são funções da agenda do CRM. Se um sistema de restaurante for público, /saas mostra o nome e a demo. Esta página não inicia a compra.",
    [
      ["Quando o CRM serve", ["Pedidos de catering, eventos privados e parcerias podem ser leads com origem, status e tarefa."]],
      ["Quando abrir o marketplace", ["O software de restaurante aparece só se a API o marcar como público."]],
    ],
    [["Posso gerir mesas pelo CRM?", "Não como mapa do salão. Use um produto do marketplace se estiver publicado. Use o CRM para os contatos."]],
    [["/saas", "Marketplace"], ["/crm", "CRM"], ["/website-builder", "Construtor"]],
  ),
  ar: copy(
    "المطاعم | Bizuply",
    "مطعم يريد نظام طلبات جاهزاً ينظر إلى السوق. CRM في Bizuply للاستفسارات والمتابعة، لا لشاشة المطبخ.",
    "مطاعم",
    "استفسارات في CRM، وأنظمة طلب في السوق",
    "خدمة الطاولة وقائمة QR وتذكرة المطبخ ليست وظائف تقويم CRM. إذا كان نظام مطعم عاماً، تعرض /saas اسمه والعرض. هذه الصفحة لا تبدأ الشراء.",
    [
      ["متى يصلح CRM", ["استفسارات التموين والفعاليات الخاصة والتعاون يمكن أن تكون عملاء محتملين بمصدر وحالة ومهمة."]],
      ["متى يُفتح السوق", ["يظهر برنامج المطاعم فقط إذا علّمته الواجهة كعام."]],
    ],
    [["هل أدير الطاولات من CRM؟", "ليس كمخطط صالة. استخدموا منتج السوق إن كان منشوراً. استخدموا CRM للاستفسارات."]],
    [["/saas", "السوق"], ["/crm", "CRM"], ["/website-builder", "منشئ المواقع"]],
  ),
});

PAGES["/solutions/service-businesses"] = industry({
  en: copy(
    "Service businesses | Bizuply",
    "Trades, studios and local services can keep the lead, the visit and the follow-up in one account.",
    "Service businesses",
    "From the first inquiry to the visit",
    "A service business usually needs a page, a way to capture the request, a status, and a time on the calendar. That path is CRM plus the website builder plus appointments. Automations are optional and sit on the business plan.",
    [
      ["A concrete sequence", ["Publish a page, put a form on it, receive the lead with source Website, call the person, set Contacted or Interested, and book a 15-minute slot from the service catalog."]],
      ["Price, without extras", ["CRM only is $49 a month. The business plan, which adds appointments, collaborations and automations, is $99 a month or $990 a year. The website-only yearly price is separate from the CRM and is listed on pricing."]],
    ],
    [["Do I need the business plan to book?", "Appointments are part of the business plan, not of CRM only. CRM only is the pipeline, the client file and the record of the lead."]],
    [["/crm", "CRM"], ["/appointments", "Appointments"], ["/pricing", "Pricing"]],
  ),
  he: copy(
    "נותני שירות | ביזאפלי",
    "בעלי מקצוע, סטודיו ושירותים מקומיים יכולים לשמור את הליד, הביקור והמעקב בחשבון אחד.",
    "נותני שירות",
    "מהפנייה הראשונה ועד הביקור",
    "עסק שירותים צריך בדרך כלל עמוד, דרך לקלוט את הבקשה, סטטוס, ושעה ביומן. המסלול הוא CRM יחד עם בונה האתרים והתורים. אוטומציות הן רשות ונמצאות בחבילה העסקית.",
    [
      ["רצף מוחשי", ["מפרסמים עמוד, שמים עליו טופס, מקבלים ליד עם מקור אתר, מתקשרים, מסמנים נוצר קשר או מעוניין, וקובעים חלון של 15 דקות מתוך קטלוג השירותים."]],
      ["מחיר, בלי תוספות", ["CRM בלבד הוא 49 דולר לחודש. החבילה העסקית, שמוסיפה תורים, שיתופים ואוטומציות, היא 99 לחודש או 990 לשנה. מחיר אתר שנתי בלבד נפרד מה־CRM ומופיע במחירון."]],
    ],
    [["צריך את החבילה העסקית כדי לקבוע תור?", "התורים הם חלק מהחבילה העסקית, לא מ־CRM בלבד. CRM בלבד הוא הצינור, תיק הלקוח ורשומת הליד."]],
    [["/crm", "CRM"], ["/appointments", "תורים"], ["/pricing", "מחירון"]],
  ),
  es: copy(
    "Negocios de servicios | Bizuply",
    "Oficios, estudios y servicios locales pueden guardar el lead, la visita y el seguimiento en una cuenta.",
    "Servicios",
    "De la primera consulta a la visita",
    "Un negocio de servicios suele necesitar una página, una forma de recibir la solicitud, un estado y una hora. Esa ruta es CRM, constructor y citas. Las automatizaciones son opcionales y están en el plan de negocio.",
    [
      ["Una secuencia concreta", ["Publique una página, ponga un formulario, reciba el lead con origen Sitio, llame, marque Contactado o Interesado y reserve un hueco de 15 minutos."]],
      ["Precio", ["CRM solo: 49 dólares al mes. Plan de negocio, con citas, colaboraciones y automatizaciones: 99 al mes o 990 al año. El sitio anual es un precio aparte."]],
    ],
    [["¿Hace falta el plan de negocio para reservar?", "Las citas forman parte del plan de negocio, no del CRM solo."]],
    [["/crm", "CRM"], ["/appointments", "Citas"], ["/pricing", "Precios"]],
  ),
  "pt-BR": copy(
    "Negócios de serviço | Bizuply",
    "Ofícios, estúdios e serviços locais podem guardar o lead, a visita e o acompanhamento numa conta.",
    "Serviços",
    "Do primeiro contato à visita",
    "Um negócio de serviço costuma precisar de uma página, um jeito de receber o pedido, um status e um horário. Esse caminho é CRM, construtor e agenda. Automações são opcionais e ficam no plano de negócios.",
    [
      ["Uma sequência concreta", ["Publique uma página, coloque um formulário, receba o lead com origem Site, ligue, marque Contatado ou Interessado e reserve um horário de 15 minutos."]],
      ["Preço", ["CRM sozinho: 49 dólares por mês. Plano de negócios, com agenda, colaborações e automações: 99 por mês ou 990 por ano. O site anual é um preço à parte."]],
    ],
    [["Preciso do plano de negócios para agendar?", "A agenda faz parte do plano de negócios, não do CRM sozinho."]],
    [["/crm", "CRM"], ["/appointments", "Agenda"], ["/pricing", "Preços"]],
  ),
  ar: copy(
    "أعمال الخدمات | Bizuply",
    "يمكن للحِرف والاستوديوهات والخدمات المحلية حفظ العميل المحتمل والزيارة والمتابعة في حساب واحد.",
    "خدمات",
    "من أول طلب حتى الزيارة",
    "عمل الخدمات يحتاج عادة صفحة، وطريقة لاستقبال الطلب، وحالة، ووقتاً في التقويم. المسار هو CRM ومنشئ المواقع والمواعيد. الأتمتة اختيارية وتقع في الخطة التجارية.",
    [
      ["تسلسل ملموس", ["انشروا صفحة، ضعوا نموذجاً، استقبلوا عميلاً محتملاً بمصدر الموقع، اتصلوا، علّموا تم التواصل أو مهتم، واحجزوا فترة من 15 دقيقة."]],
      ["السعر", ["CRM وحده: 49 دولاراً شهرياً. الخطة التجارية، مع المواعيد والتعاون والأتمتة: 99 شهرياً أو 990 سنوياً. الموقع السنوي سعر منفصل."]],
    ],
    [["هل الخطة التجارية لازمة للحجز؟", "المواعيد جزء من الخطة التجارية، لا من CRM وحده."]],
    [["/crm", "CRM"], ["/appointments", "المواعيد"], ["/pricing", "الأسعار"]],
  ),
});

PAGES["/solutions/agencies"] = industry({
  en: copy(
    "Marketing agencies | Bizuply",
    "An agency can run its own leads, collaborations and human follow-up in Bizuply. One screen does not yet manage several clients' WhatsApp numbers.",
    "Agencies",
    "The agency's own pipeline, not every client's inbox",
    "Collaborations, proposals and a CRM for the agency's sales are in the product. Human agents can follow the agency's leads. Connecting a client's WhatsApp still means that number has its own subscription, key and webhook.",
    [
      ["What an agency can do now", ["Track its own inbound leads, assign tasks, and use the collaborations area. Meta Lead Ads can enter the CRM of the business that connected the page."]],
      ["The limit", ["Multi-client WhatsApp from one screen is not available. Do not plan a client portal on top of a feature that is not shipped."]],
    ],
    [["Can the agency run ads inside Bizuply?", "The connected business can create and edit campaigns, ad sets and ads in the dashboard, and set a budget on the campaign or the ad set. Meta bills the spend. There is no separate campaign price on the Bizuply pricing page."]],
    [["/collaborations", "Collaborations"], ["/meta-campaigns", "Meta campaigns"], ["/crm", "CRM"]],
  ),
  he: copy(
    "סוכנויות שיווק | ביזאפלי",
    "סוכנות יכולה לנהל את הלידים, השיתופים והמעקב האנושי שלה בביזאפלי. מסך אחד עדיין לא מנהל מספרי WhatsApp של כמה לקוחות.",
    "סוכנויות",
    "הצינור של הסוכנות עצמה, לא תיבת הדואר של כל לקוח",
    "שיתופים, הצעות ו־CRM למכירות של הסוכנות נמצאים במוצר. נציגים אנושיים יכולים לטפל בלידים של הסוכנות. חיבור WhatsApp של לקוח עדיין אומר שלמספר יש מנוי, מפתח ו־webhook משלו.",
    [
      ["מה סוכנות יכולה לעשות עכשיו", ["לעקוב אחרי פניות נכנסות שלה, להקצות משימות, ולהשתמש באזור השיתופים. לידים ממודעות Meta נכנסים ל־CRM של העסק שחיבר את הדף."]],
      ["המגבלה", ["ניהול WhatsApp של כמה לקוחות ממסך אחד אינו זמין. לא מתכננים פורטל לקוחות על יכולת שלא נמסרה."]],
    ],
    [["הסוכנות יכולה לנהל מודעות מתוך ביזאפלי?", "העסק המחובר יכול ליצור ולערוך קמפיינים, קבוצות מודעות ומודעות, ולקבוע תקציב בקמפיין או בקבוצה. Meta גובה את ההוצאה. אין מחיר קמפיין נפרד במחירון."]],
    [["/collaborations", "שיתופים"], ["/meta-campaigns", "קמפיינים"], ["/crm", "CRM"]],
  ),
  es: copy(
    "Agencias de marketing | Bizuply",
    "Una agencia puede llevar sus propios leads, colaboraciones y seguimiento humano en Bizuply. Una pantalla aún no gestiona el WhatsApp de varios clientes.",
    "Agencias",
    "El pipeline de la agencia, no la bandeja de cada cliente",
    "Colaboraciones, propuestas y un CRM para las ventas de la agencia están en el producto. Conectar el WhatsApp de un cliente sigue significando una suscripción, una clave y un webhook propios.",
    [
      ["Qué puede hacer ahora", ["Seguir sus consultas, asignar tareas y usar colaboraciones. Los Lead Ads entran al CRM del negocio que conectó la página."]],
      ["El límite", ["Gestionar el WhatsApp de varios clientes desde una pantalla no está disponible."]],
    ],
    [["¿La agencia puede gestionar anuncios en Bizuply?", "El negocio conectado puede crear y editar campañas, conjuntos y anuncios, con presupuesto en la campaña o en el conjunto. Meta cobra el gasto."]],
    [["/collaborations", "Colaboraciones"], ["/meta-campaigns", "Campañas"], ["/crm", "CRM"]],
  ),
  "pt-BR": copy(
    "Agências de marketing | Bizuply",
    "Uma agência pode cuidar dos próprios leads, colaborações e acompanhamento humano na Bizuply. Uma tela ainda não gere o WhatsApp de vários clientes.",
    "Agências",
    "O pipeline da agência, não a caixa de cada cliente",
    "Colaborações, propostas e um CRM para as vendas da agência estão no produto. Ligar o WhatsApp de um cliente continua a significar assinatura, chave e webhook próprios.",
    [
      ["O que dá para fazer agora", ["Acompanhar os próprios contatos, atribuir tarefas e usar colaborações. Lead Ads entram no CRM do negócio que conectou a página."]],
      ["O limite", ["Gerir o WhatsApp de vários clientes numa tela não está disponível."]],
    ],
    [["A agência gere anúncios na Bizuply?", "O negócio conectado pode criar e editar campanhas, conjuntos e anúncios, com orçamento na campanha ou no conjunto. A Meta cobra o gasto."]],
    [["/collaborations", "Colaborações"], ["/meta-campaigns", "Campanhas"], ["/crm", "CRM"]],
  ),
  ar: copy(
    "وكالات التسويق | Bizuply",
    "يمكن للوكالة إدارة عملائها المحتملين وتعاونها والمتابعة البشرية في Bizuply. شاشة واحدة لا تدير بعد أرقام واتساب لعدة عملاء.",
    "وكالات",
    "مسار الوكالة نفسها، لا صندوق كل عميل",
    "التعاون والعروض وCRM لمبيعات الوكالة موجودة في المنتج. ربط واتساب عميل ما زال يعني اشتراكاً ومفتاحاً وwebhook خاصين به.",
    [
      ["ما يمكن فعله الآن", ["متابعة الطلبات الواردة الخاصة بها، وتعيين مهام، واستخدام التعاون. تصل إعلانات العملاء المحتملين إلى CRM الخاص بالنشاط الذي ربط الصفحة."]],
      ["الحد", ["إدارة واتساب لعدة عملاء من شاشة واحدة غير متاحة."]],
    ],
    [["هل تدير الوكالة الإعلانات من Bizuply؟", "يمكن للنشاط المتصل إنشاء وتحرير الحملات والمجموعات والإعلانات، بميزانية على الحملة أو المجموعة. تحصّل Meta الإنفاق."]],
    [["/collaborations", "التعاون"], ["/meta-campaigns", "الحملات"], ["/crm", "CRM"]],
  ),
});

PAGES["/solutions/lead-based"] = industry({
  en: copy(
    "Businesses that live on leads | Bizuply",
    "Meta Lead Ads, a website form and Google Ads lead forms can enter the same pipeline, with a source on each lead.",
    "Lead-based",
    "One pipeline for every place a lead starts",
    "The business connects its own Facebook page. After the permissions, new Lead Ads arrive with a source and the new-lead status. A form on a Bizuply site does the same with source Website. Google Ads lead forms are the third automated source.",
    [
      ["After the lead exists", ["Six statuses: New, Contacted, Interested, Converted, Lost, Old lead. A note, a call or a WhatsApp log sits on the timeline. A task with a date shows up in notifications when it is late."]],
      ["Money", ["CRM only is $49 a month. Follow-up automations need the business plan at $99 a month or $990 a year. Ad spend is billed by Meta, not by this page."]],
    ],
    [["Is Bizuply a Meta Business Partner?", "No. Bizuply is a Meta Tech Provider and the app passed App Review for Lead Ads."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Meta campaigns"], ["/guides/meta-lead-ads-to-crm", "Guide"]],
  ),
  he: copy(
    "עסקים שחיים מלידים | ביזאפלי",
    "מודעות לידים של Meta, טופס באתר וטפסי Google Ads יכולים להיכנס לאותו צינור, עם מקור על כל ליד.",
    "מבוססי לידים",
    "צינור אחד לכל מקום שבו ליד מתחיל",
    "העסק מחבר את דף הפייסבוק שלו. אחרי ההרשאות, לידים חדשים מגיעים עם מקור וסטטוס חדש. טופס באתר ביזאפלי עושה אותו דבר עם מקור אתר. טפסי Google Ads הם המקור האוטומטי השלישי.",
    [
      ["אחרי שהליד קיים", ["שישה סטטוסים: חדש, נוצר קשר, מעוניין, הומר, אבוד, ליד ישן. הערה, שיחה או רישום WhatsApp יושבים על ציר הזמן. משימה עם תאריך מופיעה בהתראות כשהיא מאחרת."]],
      ["כסף", ["CRM בלבד הוא 49 דולר לחודש. אוטומציות מעקב דורשות את החבילה העסקית ב־99 לחודש או 990 לשנה. את הוצאת המודעות גובה Meta."]],
    ],
    [["ביזאפלי היא Meta Business Partner?", "לא. ביזאפלי היא Meta Tech Provider והאפליקציה עברה App Review ל־Lead Ads."]],
    [["/crm", "CRM"], ["/meta-campaigns", "קמפיינים"], ["/guides/meta-lead-ads-to-crm", "מדריך"]],
  ),
  es: copy(
    "Negocios que viven de leads | Bizuply",
    "Lead Ads de Meta, un formulario del sitio y formularios de Google Ads pueden entrar al mismo pipeline, con un origen en cada lead.",
    "Basados en leads",
    "Un pipeline para cada lugar donde nace un lead",
    "El negocio conecta su página de Facebook. Tras los permisos, los Lead Ads llegan con origen y estado nuevo. Un formulario en un sitio de Bizuply hace lo mismo con origen Sitio. Los formularios de Google Ads son la tercera fuente automática.",
    [
      ["Cuando el lead ya existe", ["Seis estados: Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo. Una nota, una llamada o un WhatsApp quedan en la línea de tiempo."]],
      ["Dinero", ["CRM solo: 49 dólares al mes. Las automatizaciones piden el plan de negocio a 99 al mes o 990 al año. La inversión la cobra Meta."]],
    ],
    [["¿Bizuply es Meta Business Partner?", "No. Es Meta Tech Provider y la app pasó App Review para Lead Ads."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Campañas"], ["/guides/meta-lead-ads-to-crm", "Guía"]],
  ),
  "pt-BR": copy(
    "Negócios que vivem de leads | Bizuply",
    "Lead Ads da Meta, um formulário do site e formulários do Google Ads podem entrar no mesmo pipeline, com uma origem em cada lead.",
    "Baseados em leads",
    "Um pipeline para cada lugar onde um lead nasce",
    "O negócio conecta a própria página do Facebook. Depois das permissões, os Lead Ads chegam com origem e status novo. Um formulário num site da Bizuply faz o mesmo com origem Site. Os formulários do Google Ads são a terceira fonte automática.",
    [
      ["Quando o lead já existe", ["Seis status: Novo, Contatado, Interessado, Convertido, Perdido e Lead antigo. Uma nota, uma ligação ou um WhatsApp ficam na linha do tempo."]],
      ["Dinheiro", ["CRM sozinho: 49 dólares por mês. As automações pedem o plano de negócios a 99 por mês ou 990 por ano. O investimento é cobrado pela Meta."]],
    ],
    [["A Bizuply é Meta Business Partner?", "Não. É Meta Tech Provider e o app passou App Review para Lead Ads."]],
    [["/crm", "CRM"], ["/meta-campaigns", "Campanhas"], ["/guides/meta-lead-ads-to-crm", "Guia"]],
  ),
  ar: copy(
    "أعمال تعيش على العملاء المحتملين | Bizuply",
    "يمكن لإعلانات Meta ونموذج الموقع ونماذج Google Ads أن تدخل المسار نفسه، مع مصدر على كل عميل محتمل.",
    "قائم على العملاء",
    "مسار واحد لكل مكان يبدأ فيه عميل محتمل",
    "يربط النشاط صفحة فيسبوك الخاصة به. بعد الأذونات تصل إعلانات العملاء المحتملين بمصدر وحالة جديد. نموذج موقع Bizuply يفعل الشيء نفسه بمصدر الموقع. نماذج Google Ads هي المصدر الآلي الثالث.",
    [
      ["بعد وجود العميل المحتمل", ["ست حالات: جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم. ملاحظة أو مكالمة أو واتساب تبقى على الخط الزمني."]],
      ["المال", ["CRM وحده: 49 دولاراً شهرياً. الأتمتة تطلب الخطة التجارية بـ 99 شهرياً أو 990 سنوياً. تحصّل Meta الإنفاق الإعلاني."]],
    ],
    [["هل Bizuply شريك Meta Business؟", "لا. هي Meta Tech Provider واجتاز التطبيق App Review لإعلانات العملاء المحتملين."]],
    [["/crm", "CRM"], ["/meta-campaigns", "الحملات"], ["/guides/meta-lead-ads-to-crm", "دليل"]],
  ),
});

PAGES["/solutions/ready-systems"] = industry({
  en: copy(
    "A ready SaaS, or software of your own | Bizuply",
    "The marketplace lists systems the API marks as public. Custom development is a conversation, not a checkout on this page. White label is described only on a product that publishes it.",
    "SaaS",
    "See what is actually public before you plan a launch",
    "Bizuply can introduce a ready system or talk about software built around a business. This page does not invent a catalog. Open /saas. The cards there are the public list. A product without a public price does not get a price here.",
    [
      ["How to read the marketplace", ["Each public product can show a name, a description, an audience and a demo when the API provides them. Checkout stays off unless that product's own page enables a real purchase. Do not treat a demo as a sold subscription."]],
      ["Custom work", ["A CRM shaped around one company, a portal, or a subscription product that is not already listed is a scoped conversation from the contact page. There is no published custom-development rate on this page."]],
    ],
    [["Can I buy a named system from this article?", "No. Use /saas for the live list. This article explains the difference between the Bizuply platform, a marketplace product, and work that still needs a quote."]],
    [["/saas", "Open the marketplace"], ["/contact", "Contact"], ["/platform", "The platform"]],
  ),
  he: copy(
    "מערכת SaaS מוכנה, או תוכנה משלכם | ביזאפלי",
    "המרקטפלייס מציג מערכות שה־API מסמן כציבוריות. פיתוח מותאם הוא שיחה, לא רכישה מהעמוד הזה. White label מתואר רק במוצר שמפרסם אותו.",
    "SaaS",
    "רואים מה באמת ציבורי לפני שמתכננים השקה",
    "ביזאפלי יכולה להציג מערכת מוכנה או לדבר על תוכנה שנבנית סביב עסק. העמוד לא ממציא קטלוג. פותחים את /saas. הכרטיסים שם הם הרשימה הציבורית. למוצר בלי מחיר ציבורי אין מחיר כאן.",
    [
      ["איך קוראים את המרקטפלייס", ["מוצר ציבורי יכול להציג שם, תיאור, קהל ודמו כשה־API מספק אותם. הרכישה נשארת סגורה אלא אם עמוד המוצר עצמו פותח רכישה אמיתית. דמו אינו מנוי שנמכר."]],
      ["עבודה מותאמת", ["CRM שמותאם לחברה אחת, פורטל, או מוצר מנויים שאינו ברשימה הם שיחה עם היקף מעמוד יצירת הקשר. אין כאן תעריף פיתוח מפורסם."]],
    ],
    [["אפשר לקנות מערכת בשם מהמאמר הזה?", "לא. משתמשים ב־/saas לרשימה החיה. המאמר מסביר את ההבדל בין פלטפורמת ביזאפלי, מוצר במרקטפלייס, ועבודה שעדיין צריכה הצעה."]],
    [["/saas", "למרקטפלייס"], ["/contact", "יצירת קשר"], ["/platform", "הפלטפורמה"]],
  ),
  es: copy(
    "Un SaaS listo, o software propio | Bizuply",
    "El marketplace muestra los sistemas que la API marca como públicos. El desarrollo a medida es una conversación, no una compra en esta página.",
    "SaaS",
    "Ver qué es público antes de planear un lanzamiento",
    "Bizuply puede presentar un sistema listo o hablar de software construido alrededor de un negocio. Esta página no inventa un catálogo. Abra /saas. Un producto sin precio público no recibe un precio aquí.",
    [
      ["Cómo leer el marketplace", ["Un producto público puede mostrar nombre, descripción, audiencia y demo cuando la API los da. La compra sigue cerrada salvo que la página del producto abra una compra real."]],
      ["Trabajo a medida", ["Un CRM para una sola empresa, un portal o un producto de suscripción que no está en la lista es una conversación desde contacto. No hay una tarifa de desarrollo publicada aquí."]],
    ],
    [["¿Puedo comprar un sistema con nombre desde este artículo?", "No. Use /saas para la lista viva."]],
    [["/saas", "Abrir el marketplace"], ["/contact", "Contacto"], ["/platform", "La plataforma"]],
  ),
  "pt-BR": copy(
    "Um SaaS pronto, ou um software seu | Bizuply",
    "O marketplace mostra os sistemas que a API marca como públicos. Desenvolvimento sob medida é uma conversa, não uma compra nesta página.",
    "SaaS",
    "Ver o que é público antes de planejar um lançamento",
    "A Bizuply pode apresentar um sistema pronto ou falar de software construído em volta de um negócio. Esta página não inventa um catálogo. Abra /saas. Um produto sem preço público não ganha um preço aqui.",
    [
      ["Como ler o marketplace", ["Um produto público pode mostrar nome, descrição, público e demo quando a API os entrega. A compra continua fechada, salvo se a página do produto abrir uma compra real."]],
      ["Trabalho sob medida", ["Um CRM para uma empresa, um portal ou um produto de assinatura que não está na lista é uma conversa a partir do contato. Não há uma tarifa de desenvolvimento publicada aqui."]],
    ],
    [["Posso comprar um sistema pelo nome neste artigo?", "Não. Use /saas para a lista ao vivo."]],
    [["/saas", "Abrir o marketplace"], ["/contact", "Contato"], ["/platform", "A plataforma"]],
  ),
  ar: copy(
    "نظام SaaS جاهز، أو برنامج خاص بكم | Bizuply",
    "يعرض السوق الأنظمة التي تعلّمها الواجهة كعامة. التطوير المخصص محادثة، لا شراء من هذه الصفحة. العلامة البيضاء تُذكر فقط في منتج ينشرها.",
    "SaaS",
    "رؤية ما هو عام فعلاً قبل التخطيط للإطلاق",
    "يمكن لـ Bizuply أن تعرض نظاماً جاهزاً أو أن تتحدث عن برنامج يُبنى حول نشاط. هذه الصفحة لا تخترع كتالوجاً. افتحوا /saas. البطاقات هناك هي القائمة العامة. منتج بلا سعر عام لا يحصل على سعر هنا.",
    [
      ["كيف تُقرأ السوق", ["يمكن لمنتج عام أن يعرض اسماً ووصفاً وجمهوراً وعرضاً حين توفرها الواجهة. يبقى الشراء مغلقاً إلا إذا فتحت صفحة المنتج شراءً حقيقياً."]],
      ["عمل مخصص", ["CRM لشركة واحدة، أو بوابة، أو منتج اشتراك غير موجود في القائمة هو محادثة من صفحة الاتصال. لا يوجد هنا سعر تطوير منشور."]],
    ],
    [["هل أشتري نظاماً بالاسم من هذا المقال؟", "لا. استخدموا /saas للقائمة الحية."]],
    [["/saas", "فتح السوق"], ["/contact", "اتصال"], ["/platform", "المنصة"]],
  ),
});

export function getActivityPage(path, locale) {
  if (path === "/platform") return platformActivity(locale);
  const found = PAGES[path];
  if (!found) return null;
  const language = locale === "pt-BR" || locale === "pt" ? "pt-BR" : locale;
  const copyForLocale = found.locales[language] || found.locales.en;
  return {
    ...copyForLocale,
    layout: found.layout,
    media: found.media,
    path,
    paragraphs: [copyForLocale.lede],
  };
}

export function activityMarketingEntries() {
  const platform = platformActivity("en");
  return [{
    path: "/platform",
    title: platform.title,
    description: platform.description,
    crumb: platform.crumb,
    lastmod: "2026-10-25",
    changefreq: "monthly",
    priority: "0.8",
  }].concat(Object.entries(PAGES).map(([path, page]) => ({
    path,
    title: page.locales.en.title,
    description: page.locales.en.description,
    crumb: page.locales.en.crumb,
    lastmod: "2026-10-24",
    changefreq: "monthly",
    priority: path === "/services" ? "0.8" : "0.64",
  })));
}

export function activityChildLinks(path, locale) {
  const page = getActivityPage(path, locale);
  return page?.links || [];
}

export const ACTIVITY_PATHS = Object.keys(PAGES);
