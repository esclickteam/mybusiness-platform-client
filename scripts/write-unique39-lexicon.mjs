/**
 * unique39 — leftover IDO built-in preview body/FAQ/form chrome after unique38.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles
 * unless they are explicit UI labels (e.g. Impressions).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\nמהיכרות ראשונה ועד פנייה אמיתית.":
    r(
      "We build a clear language for the business, sharp messages, and content that leads the audience\nfrom a first introduction to a real inquiry.",
      "Construimos para el negocio un lenguaje claro, mensajes nítidos y contenido que lleva a la audiencia\ndesde el primer contacto hasta una consulta real.",
      "Construímos para o negócio uma linguagem clara, mensagens nítidas e conteúdo que leva o público\ndo primeiro contato até uma consulta real.",
      "نبني للعمل لغة واضحة ورسائل حادة ومحتوى يقود الجمهور\nمن أول تعارف حتى استفسار حقيقي.",
    ),
  "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\n            מהיכרות ראשונה ועד פנייה אמיתית.":
    r(
      "We build a clear language for the business, sharp messages, and content that leads the audience\nfrom a first introduction to a real inquiry.",
      "Construimos para el negocio un lenguaje claro, mensajes nítidos y contenido que lleva a la audiencia\ndesde el primer contacto hasta una consulta real.",
      "Construímos para o negócio uma linguagem clara, mensagens nítidas e conteúdo que leva o público\ndo primeiro contato até uma consulta real.",
      "نبني للعمل لغة واضحة ورسائل حادة ومحتوى يقود الجمهور\nمن أول تعارف حتى استفسار حقيقي.",
    ),
  "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל": r(
    "We build a clear language for the business, sharp messages, and content that leads the audience",
    "Construimos para el negocio un lenguaje claro, mensajes nítidos y contenido que lleva a la audiencia",
    "Construímos para o negócio uma linguagem clara, mensagens nítidas e conteúdo que leva o público",
    "نبني للعمل لغة واضحة ورسائل حادة ومحتوى يقود الجمهور",
  ),
  "מהיכרות ראשונה ועד פנייה אמיתית.": r(
    "from a first introduction to a real inquiry.",
    "desde el primer contacto hasta una consulta real.",
    "do primeiro contato até uma consulta real.",
    "من أول تعارف حتى استفسار حقيقي.",
  ),
  "ניהול סושיאל, קריאייטיב, קמפיינים, תוכן, דוחות, מסעות לקוח\nושיפור מתמיד של הביצועים — במקום אחד.":
    r(
      "Social management, creative, campaigns, content, reports, customer journeys\nand constant performance improvement — in one place.",
      "Gestión de social, creativo, campañas, contenido, reportes, journeys de cliente\ny mejora constante del rendimiento — en un solo lugar.",
      "Gestão de social, criativo, campanhas, conteúdo, relatórios, jornadas do cliente\ne melhoria constante de desempenho — em um só lugar.",
      "إدارة سوشيال وكرييتيف وحملات ومحتوى وتقارير ومسارات عملاء\nوتحسين مستمر للأداء — في مكان واحد.",
    ),
  "ניהול סושיאל, קריאייטיב, קמפיינים, תוכן, דוחות, מסעות לקוח\n            ושיפור מתמיד של הביצועים — במקום אחד.":
    r(
      "Social management, creative, campaigns, content, reports, customer journeys\nand constant performance improvement — in one place.",
      "Gestión de social, creativo, campañas, contenido, reportes, journeys de cliente\ny mejora constante del rendimiento — en un solo lugar.",
      "Gestão de social, criativo, campanhas, conteúdo, relatórios, jornadas do cliente\ne melhoria constante de desempenho — em um só lugar.",
      "إدارة سوشيال وكرييتيف وحملات ومحتوى وتقارير ومسارات عملاء\nوتحسين مستمر للأداء — في مكان واحد.",
    ),
  "ניהול סושיאל, קריאייטיב, קמפיינים, תוכן, דוחות, מסעות לקוח": r(
    "Social management, creative, campaigns, content, reports, customer journeys",
    "Gestión de social, creativo, campañas, contenido, reportes, journeys de cliente",
    "Gestão de social, criativo, campanhas, conteúdo, relatórios, jornadas do cliente",
    "إدارة سوشيال وكرييتيف وحملات ومحتوى وتقارير ومسارات عملاء",
  ),
  "ושיפור מתמיד של הביצועים — במקום אחד.": r(
    "and constant performance improvement — in one place.",
    "y mejora constante del rendimiento — en un solo lugar.",
    "e melhoria constante de desempenho — em um só lugar.",
    "وتحسين مستمر للأداء — في مكان واحد.",
  ),
  "לא רק תוכן — מערכת צמיחה": r(
    "Not just content — a growth system",
    "No solo contenido — un sistema de crecimiento",
    "Não só conteúdo — um sistema de crescimento",
    "ليس مجرد محتوى — منظومة نمو",
  ),
  "הבלוק הזה מציג את הדרך שבה משווק מקצועי הופך נראות דיגיטלית\nלמערכת שמייצרת אמון, תנועה, לידים ומכירות.":
    r(
      "This block shows how a professional marketer turns digital visibility\ninto a system that creates trust, traffic, leads, and sales.",
      "Este bloque muestra cómo un profesional de marketing convierte visibilidad digital\nen un sistema que genera confianza, tráfico, leads y ventas.",
      "Este bloco mostra como um profissional de marketing transforma visibilidade digital\nem um sistema que gera confiança, tráfego, leads e vendas.",
      "تعرض هذه الكتلة كيف يحوّل مسوّق محترف الظهور الرقمي\nإلى منظومة تولّد ثقة وحركة وعملاء محتملين ومبيعات.",
    ),
  "הבלוק הזה מציג את הדרך שבה משווק מקצועי הופך נראות דיגיטלית\n            למערכת שמייצרת אמון, תנועה, לידים ומכירות.":
    r(
      "This block shows how a professional marketer turns digital visibility\ninto a system that creates trust, traffic, leads, and sales.",
      "Este bloque muestra cómo un profesional de marketing convierte visibilidad digital\nen un sistema que genera confianza, tráfico, leads y ventas.",
      "Este bloco mostra como um profissional de marketing transforma visibilidade digital\nem um sistema que gera confiança, tráfego, leads e vendas.",
      "تعرض هذه الكتلة كيف يحوّل مسوّق محترف الظهور الرقمي\nإلى منظومة تولّد ثقة وحركة وعملاء محتملين ومبيعات.",
    ),
  "הבלוק הזה מציג את הדרך שבה משווק מקצועי הופך נראות דיגיטלית": r(
    "This block shows how a professional marketer turns digital visibility",
    "Este bloque muestra cómo un profesional de marketing convierte visibilidad digital",
    "Este bloco mostra como um profissional de marketing transforma visibilidade digital",
    "تعرض هذه الكتلة كيف يحوّل مسوّق محترف الظهور الرقمي",
  ),
  "למערכת שמייצרת אמון, תנועה, לידים ומכירות.": r(
    "into a system that creates trust, traffic, leads, and sales.",
    "en un sistema que genera confianza, tráfico, leads y ventas.",
    "em um sistema que gera confiança, tráfego, leads e vendas.",
    "إلى منظومة تولّد ثقة وحركة وعملاء محتملين ومبيعات.",
  ),
  "תוכן שמייצר אמון": r(
    "Content that builds trust",
    "Contenido que genera confianza",
    "Conteúdo que gera confiança",
    "محتوى يبني الثقة",
  ),
  "פוסטים, קמפיינים ומסרים שנבנים לפי קהל, שלב במסע ומטרה עסקית.": r(
    "Posts, campaigns, and messages built for the audience, journey stage, and business goal.",
    "Posts, campañas y mensajes construidos según audiencia, etapa del viaje y meta de negocio.",
    "Posts, campanhas e mensagens feitos para o público, etapa da jornada e meta do negócio.",
    "منشورات وحملات ورسائل تُبنى حسب الجمهور ومرحلة المسار والهدف التجاري.",
  ),
  "דאטה שמוביל החלטות": r(
    "Data that drives decisions",
    "Datos que impulsan decisiones",
    "Dados que impulsionam decisões",
    "بيانات تقود القرارات",
  ),
  "מעקב אחרי ביצועים, שיפור קמפיינים והבנה מה באמת מזיז את המספרים.": r(
    "Tracking performance, improving campaigns, and understanding what actually moves the numbers.",
    "Seguimiento de rendimiento, mejora de campañas y entender qué mueve de verdad los números.",
    "Acompanhar desempenho, melhorar campanhas e entender o que realmente move os números.",
    "متابعة الأداء وتحسين الحملات وفهم ما يحرّك الأرقام فعلاً.",
  ),
  "מערכת שמביאה פניות": r(
    "A system that brings inquiries",
    "Un sistema que trae consultas",
    "Um sistema que traz consultas",
    "منظومة تجلب الاستفسارات",
  ),
  "חיבור בין קריאייטיב, הצעה, תוכן, מודעות ולידים במקום אחד ברור.": r(
    "Connecting creative, offer, content, ads, and leads in one clear place.",
    "Conectar creativo, oferta, contenido, anuncios y leads en un lugar claro.",
    "Ligar criativo, oferta, conteúdo, anúncios e leads em um lugar claro.",
    "ربط الكرييتيف والعرض والمحتوى والإعلانات والعملاء المحتملين في مكان واحد واضح.",
  ),
  "מחברים בין קהל, תוכן, דאטה\nוקמפיינים\nלמערכת צמיחה אחת ברורה.": r(
    "We connect audience, content, data\nand campaigns\ninto one clear growth system.",
    "Conectamos audiencia, contenido, datos\ny campañas\nen un sistema de crecimiento claro.",
    "Conectamos público, conteúdo, dados\ne campanhas\nem um sistema de crescimento claro.",
    "نربط الجمهور والمحتوى والبيانات\nوالحملات\nبمنظومة نمو واحدة واضحة.",
  ),
  "מחברים בין קהל, תוכן, דאטה": r(
    "We connect audience, content, data",
    "Conectamos audiencia, contenido, datos",
    "Conectamos público, conteúdo, dados",
    "نربط الجمهور والمحتوى والبيانات",
  ),
  וקמפיינים: r(
    "and campaigns",
    "y campañas",
    "e campanhas",
    "والحملات",
  ),
  "למערכת צמיחה אחת ברורה.": r(
    "into one clear growth system.",
    "en un sistema de crecimiento claro.",
    "em um sistema de crescimento claro.",
    "بمنظومة نمو واحدة واضحة.",
  ),
  "המעגלים מייצגים את מערכת השיווק: חשיפה, מסר, קהל, ליד,\nמכירה ושיפור מתמיד — כל שכבה מתרחבת ומחזקת את הבאה.":
    r(
      "The circles represent the marketing system: reach, message, audience, lead,\nsale and constant improvement — each layer expands and strengthens the next.",
      "Los círculos representan el sistema de marketing: exposición, mensaje, audiencia, lead,\nventa y mejora constante — cada capa se expande y refuerza la siguiente.",
      "Os círculos representam o sistema de marketing: alcance, mensagem, público, lead,\nvenda e melhoria constante — cada camada se expande e reforça a seguinte.",
      "تمثّل الدوائر منظومة التسويق: ظهور، رسالة، جمهور، عميل محتمل،\nبيع وتحسين مستمر — كل طبقة تتوسع وتعزّز التالية.",
    ),
  "המעגלים מייצגים את מערכת השיווק: חשיפה, מסר, קהל, ליד,\n            מכירה ושיפור מתמיד — כל שכבה מתרחבת ומחזקת את הבאה.":
    r(
      "The circles represent the marketing system: reach, message, audience, lead,\nsale and constant improvement — each layer expands and strengthens the next.",
      "Los círculos representan el sistema de marketing: exposición, mensaje, audiencia, lead,\nventa y mejora constante — cada capa se expande y refuerza la siguiente.",
      "Os círculos representam o sistema de marketing: alcance, mensagem, público, lead,\nvenda e melhoria constante — cada camada se expande e reforça a seguinte.",
      "تمثّل الدوائر منظومة التسويق: ظهور، رسالة، جمهور، عميل محتمل،\nبيع وتحسين مستمر — كل طبقة تتوسع وتعزّز التالية.",
    ),
  "המעגלים מייצגים את מערכת השיווק: חשיפה, מסר, קהל, ליד,": r(
    "The circles represent the marketing system: reach, message, audience, lead,",
    "Los círculos representan el sistema de marketing: exposición, mensaje, audiencia, lead,",
    "Os círculos representam o sistema de marketing: alcance, mensagem, público, lead,",
    "تمثّل الدوائر منظومة التسويق: ظهور، رسالة، جمهور، عميل محتمل،",
  ),
  "מכירה ושיפור מתמיד — כל שכבה מתרחבת ומחזקת את הבאה.": r(
    "sale and constant improvement — each layer expands and strengthens the next.",
    "venta y mejora constante — cada capa se expande y refuerza la siguiente.",
    "venda e melhoria constante — cada camada se expande e reforça a seguinte.",
    "بيع وتحسين مستمر — كل طبقة تتوسع وتعزّز التالية.",
  ),
  "בואו נבנה\nתוכנית צמיחה\nלעסק שלך.": r(
    "Let's build\na growth plan\nfor your business.",
    "Construyamos\nun plan de crecimiento\npara tu negocio.",
    "Vamos construir\num plano de crescimento\npara o seu negócio.",
    "دعونا نبني\nخطة نمو\nلعملكم.",
  ),
  "בואו נבנה": r(
    "Let's build",
    "Construyamos",
    "Vamos construir",
    "دعونا نبني",
  ),
  "תוכנית צמיחה": r(
    "a growth plan",
    "un plan de crecimiento",
    "um plano de crescimento",
    "خطة نمو",
  ),
  "לעסק שלך.": r(
    "for your business.",
    "para tu negocio.",
    "para o seu negócio.",
    "لعملكم.",
  ),
  "אזור שמוכן לחיבור ל־CRM, וואטסאפ, יומן או כל מערכת לידים שתוסיף\nבהמשך.":
    r(
      "An area ready to connect to CRM, WhatsApp, a calendar, or any leads system you add\nlater.",
      "Un área lista para conectar a CRM, WhatsApp, calendario o cualquier sistema de leads que añadas\nluego.",
      "Uma área pronta para ligar a CRM, WhatsApp, agenda ou qualquer sistema de leads que você adicionar\ndepois.",
      "منطقة جاهزة للربط بـ CRM وواتساب وتقويم أو أي نظام عملاء محتملين تضيفونه\nلاحقاً.",
    ),
  "אזור שמוכן לחיבור ל־CRM, וואטסאפ, יומן או כל מערכת לידים שתוסיף\n            בהמשך.":
    r(
      "An area ready to connect to CRM, WhatsApp, a calendar, or any leads system you add\nlater.",
      "Un área lista para conectar a CRM, WhatsApp, calendario o cualquier sistema de leads que añadas\nluego.",
      "Uma área pronta para ligar a CRM, WhatsApp, agenda ou qualquer sistema de leads que você adicionar\ndepois.",
      "منطقة جاهزة للربط بـ CRM وواتساب وتقويم أو أي نظام عملاء محتملين تضيفونه\nلاحقاً.",
    ),
  "אזור שמוכן לחיבור ל־CRM, וואטסאפ, יומן או כל מערכת לידים שתוסיף": r(
    "An area ready to connect to CRM, WhatsApp, a calendar, or any leads system you add",
    "Un área lista para conectar a CRM, WhatsApp, calendario o cualquier sistema de leads que añadas",
    "Uma área pronta para ligar a CRM, WhatsApp, agenda ou qualquer sistema de leads que você adicionar",
    "منطقة جاهزة للربط بـ CRM وواتساب وتقويم أو أي نظام عملاء محتملين تضيفونه",
  ),
  "כן. זה בנוי כתבנית רגילה לעורך שלך עם תמונות, טקסטים וכפתורים.": r(
    "Yes. It is built as a regular template for your editor with images, texts, and buttons.",
    "Sí. Está construido como una plantilla normal para tu editor con imágenes, textos y botones.",
    "Sim. Está feito como um modelo normal para o seu editor, com imagens, textos e botões.",
    "نعم. مبني كقالب عادي لمحرركم مع صور ونصوص وأزرار.",
  ),
  "זה מותאם לנייד?": r(
    "Is it mobile-ready?",
    "¿Está adaptado a móvil?",
    "Está adaptado para celular?",
    "هل هو متوافق مع الجوال؟",
  ),
  "כן. המבנה רספונסיבי עם Tailwind בלבד.": r(
    "Yes. The layout is responsive with Tailwind only.",
    "Sí. La estructura es responsive solo con Tailwind.",
    "Sim. O layout é responsivo só com Tailwind.",
    "نعم. الهيكل متجاوب بـ Tailwind فقط.",
  ),
  "אפשר לחבר לוואטסאפ או CRM?": r(
    "Can it connect to WhatsApp or CRM?",
    "¿Se puede conectar a WhatsApp o CRM?",
    "Dá para ligar ao WhatsApp ou CRM?",
    "هل يمكن الربط بواتساب أو CRM؟",
  ),
  "ניהול סושיאל": r(
    "Social management",
    "Gestión de social",
    "Gestão de social",
    "إدارة سوشيال",
  ),
  "קמפיינים ממומנים": r(
    "Paid campaigns",
    "Campañas de pago",
    "Campanhas pagas",
    "حملات ممولة",
  ),
  "אסטרטגיית תוכן": r(
    "Content strategy",
    "Estrategia de contenido",
    "Estratégia de conteúdo",
    "استراتيجية محتوى",
  ),
  "מיתוג דיגיטלי": r(
    "Digital branding",
    "Branding digital",
    "Branding digital",
    "هوية رقمية",
  ),
  "תקציב חודשי משוער": r(
    "Estimated monthly budget",
    "Presupuesto mensual estimado",
    "Orçamento mensal estimado",
    "ميزانية شهرية تقريبية",
  ),
  "ספרו בקצרה על העסק והמטרה": r(
    "Briefly tell us about the business and the goal",
    "Cuéntanos en breve sobre el negocio y el objetivo",
    "Conte em breve sobre o negócio e o objetivo",
    "أخبرونا باختصار عن العمل والهدف",
  ),
  "שליחת בקשה לשיחה": r(
    "Send a call request",
    "Enviar solicitud de llamada",
    "Enviar pedido de chamada",
    "إرسال طلب مكالمة",
  ),
  "שדה בחירת שירות": r(
    "Service selection field",
    "Campo de selección de servicio",
    "Campo de escolha de serviço",
    "حقل اختيار الخدمة",
  ),
  "שדה תקציב": r(
    "Budget field",
    "Campo de presupuesto",
    "Campo de orçamento",
    "حقل الميزانية",
  ),
  "תבנית יוקרתית למשווק, איש סושיאל ואסטרטג דיגיטל": r(
    "A premium template for marketers, social specialists, and digital strategists",
    "Plantilla premium para marketers, especialistas en social y estrategas digitales",
    "Modelo premium para marketers, especialistas em social e estrategistas digitais",
    "قالب فاخر للمسوّقين ومتخصصي السوشيال واستراتيجيي الديجيتال",
  ),
  "שאלות לפני שמתחילים לבנות נוכחות דיגיטלית.": r(
    "Questions before you start building a digital presence.",
    "Preguntas antes de empezar a construir una presencia digital.",
    "Perguntas antes de começar a construir uma presença digital.",
    "أسئلة قبل أن تبدأوا ببناء حضور رقمي.",
  ),
  חשיפות: r(
    "Impressions",
    "Impresiones",
    "Impressões",
    "ظهور",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique39.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique39 rows`);
