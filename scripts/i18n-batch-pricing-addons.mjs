function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(value, locale) {
  return value[locale] || value.en;
}

function listToMap(items, locale) {
  return Object.fromEntries(items.map((item, index) => [String(index), pick(item, locale)]));
}

function tracksToMap(items, locale) {
  return Object.fromEntries(
    items.map((item, index) => [
      String(index),
      { label: pick(item.label, locale), price: pick(item.price, locale) },
    ])
  );
}

const ADDONS = {
  "automations-setup": {
    name: row("Business automations setup", "הקמת אוטומציות לעסק", "Configuración de automatizaciones", "Configuração de automações", "إعداد أتمتة الأعمال"),
    description: row(
      "We build automatic workflows that keep nurturing leads and clients even when you're offline.",
      "אנחנו מקימים עבורכם תהליכים אוטומטיים שפועלים לבד וממשיכים לטפל בלידים ובלקוחות גם כשאתם לא במערכת.",
      "Creamos flujos automáticos que siguen cuidando leads y clientes aunque no estés en el sistema.",
      "Criamos fluxos automáticos que continuam cuidando de leads e clientes mesmo quando você não está no sistema.",
      "نبني مسارات تلقائية تتابع العملاء المحتملين والعملاء حتى عندما لا تكونون في النظام."
    ),
    price: row("From ₪390 one-time", "החל מ־390 ₪ חד־פעמי", "Desde ₪390 único", "A partir de ₪390 único", "من ₪390 لمرة واحدة"),
    details: [
      row("One simple automation: ₪390", "אוטומציה אחת פשוטה: 390 ₪", "Una automatización simple: ₪390", "Uma automação simples: ₪390", "أتمتة واحدة بسيطة: ₪390"),
      row("3-automation pack: ₪890", "חבילת 3 אוטומציות: 890 ₪", "Paquete de 3: ₪890", "Pacote de 3: ₪890", "باقة 3 أتمتات: ₪890"),
      row("6-automation pack: ₪1,490", "חבילת 6 אוטומציות: 1,490 ₪", "Paquete de 6: ₪1,490", "Pacote de 6: ₪1.490", "باقة 6 أتمتات: ₪1,490"),
      row("Complex process: custom quote", "תהליך מורכב: הצעה מותאמת", "Proceso complejo: presupuesto a medida", "Processo complexo: orçamento sob medida", "عملية معقدة: عرض مخصص"),
    ],
    tracks: [
      { label: row("One simple automation", "אוטומציה אחת פשוטה", "Una automatización simple", "Uma automação simples", "أتمتة واحدة بسيطة"), price: row("₪390", "390 ₪", "₪390", "₪390", "₪390") },
      { label: row("3-automation pack", "חבילת 3 אוטומציות", "Paquete de 3 automatizaciones", "Pacote de 3 automações", "باقة 3 أتمتات"), price: row("₪890", "890 ₪", "₪890", "₪890", "₪890") },
      { label: row("6-automation pack", "חבילת 6 אוטומציות", "Paquete de 6 automatizaciones", "Pacote de 6 automações", "باقة 6 أتمتات"), price: row("₪1,490", "1,490 ₪", "₪1,490", "₪1.490", "₪1,490") },
      { label: row("Complex process", "תהליך מורכב", "Proceso complejo", "Processo complexo", "عملية معقدة"), price: row("Custom quote", "הצעה מותאמת", "Presupuesto a medida", "Orçamento sob medida", "عرض مخصص") },
    ],
    examples: [
      row("New lead enters the system", "ליד חדש נכנס למערכת", "Entra un lead nuevo", "Um lead novo entra no sistema", "عميل محتمل جديد يدخل النظام"),
      row("Automatic WhatsApp message", "שליחת הודעת WhatsApp אוטומטית", "Mensaje de WhatsApp automático", "Mensagem automática no WhatsApp", "رسالة واتساب تلقائية"),
      row("Automatic email", "שליחת מייל אוטומטי", "Email automático", "E-mail automático", "بريد تلقائي"),
      row("Open a task for an agent", "פתיחת משימה לנציג", "Abrir una tarea para un agente", "Abrir uma tarefa para um agente", "فتح مهمة لمندوب"),
      row("Reminder if no action was taken", "תזכורת אם לא בוצע טיפול", "Recordatorio si no hubo acción", "Lembrete se não houve ação", "تذكير إن لم يتم التعامل"),
      row("Automatic follow-up after a few days", "פולואפ אוטומטי לאחר מספר ימים", "Seguimiento automático a los pocos días", "Follow-up automático depois de alguns dias", "متابعة تلقائية بعد أيام"),
      row("Status change based on an action", "שינוי סטטוס לפי פעולה", "Cambio de estado según una acción", "Mudança de status conforme uma ação", "تغيير الحالة حسب إجراء"),
      row("Meeting reminder", "תזכורת לפגישה", "Recordatorio de reunión", "Lembrete de reunião", "تذكير بالاجتماع"),
      row("Post-purchase message", "הודעה לאחר רכישה", "Mensaje postcompra", "Mensagem após a compra", "رسالة بعد الشراء"),
      row("Automatic review request", "בקשת ביקורת אוטומטית", "Petición de reseña automática", "Pedido automático de avaliação", "طلب تقييم تلقائي"),
    ],
    note: row(
      "WhatsApp, SMS, email, and third-party messaging costs are not included.",
      "עלויות הודעות WhatsApp, SMS, מייל ושירותי צד שלישי אינן כלולות.",
      "No incluye costes de WhatsApp, SMS, email ni servicios de terceros.",
      "Não inclui custos de WhatsApp, SMS, e-mail nem serviços de terceiros.",
      "لا يشمل تكاليف واتساب وSMS والبريد وخدمات الطرف الثالث."
    ),
  },
  "website-build": {
    name: row("Expert website build", "בניית אתר על ידי מומחה", "Sitio creado por un experto", "Site criado por um especialista", "بناء موقع بواسطة خبير"),
    description: row(
      "A Bizuply expert builds and launches a professional site from the platform templates and tools.",
      "מומחה Bizuply בונה ומעלה עבורכם אתר מקצועי מתוך התבניות והכלים של המערכת.",
      "Un experto de Bizuply crea y publica un sitio profesional con las plantillas y herramientas de la plataforma.",
      "Um especialista da Bizuply cria e publica um site profissional com os modelos e ferramentas da plataforma.",
      "خبير Bizuply يبني وينشر موقعاً احترافياً من قوالب وأدوات المنصة."
    ),
    price: row("From ₪1,490 one-time", "החל מ־1,490 ₪ חד־פעמי", "Desde ₪1,490 único", "A partir de ₪1.490 único", "من ₪1,490 لمرة واحدة"),
    details: [
      row("Site of up to 5 pages", "אתר עד 5 עמודים", "Sitio de hasta 5 páginas", "Site de até 5 páginas", "موقع حتى 5 صفحات"),
      row("Existing template selection", "בחירת תבנית קיימת", "Elección de plantilla existente", "Escolha de modelo existente", "اختيار قالب قائم"),
      row("Content and images provided by the client", "הזנת תוכן ותמונות שהלקוח מספק", "Contenido e imágenes que aporta el cliente", "Conteúdo e imagens que o cliente fornece", "محتوى وصور يقدّمها العميل"),
      row("Mobile adaptation", "התאמה למובייל", "Adaptación a móvil", "Adaptação a celular", "مواءمة للجوال"),
      row("Lead form", "טופס לידים", "Formulario de leads", "Formulário de leads", "نموذج عملاء محتملين"),
      row("CRM connection", "חיבור ל-CRM", "Conexión al CRM", "Conexão ao CRM", "ربط مع CRM"),
      row("Domain connection", "חיבור דומיין", "Conexión de dominio", "Conexão de domínio", "ربط النطاق"),
      row("Up to 2 revision rounds", "עד 2 סבבי תיקונים", "Hasta 2 rondas de correcciones", "Até 2 rodadas de correções", "حتى جولتي تعديلات"),
    ],
    extras: [
      { label: row("Extra page", "עמוד נוסף", "Página extra", "Página extra", "صفحة إضافية"), price: row("₪190", "190 ₪", "₪190", "₪190", "₪190") },
      { label: row("Content writing", "כתיבת תוכן", "Redacción de contenido", "Redação de conteúdo", "كتابة محتوى"), price: row("₪590", "590 ₪", "₪590", "₪590", "₪590") },
      { label: row("Basic store", "חנות בסיסית", "Tienda básica", "Loja básica", "متجر أساسي"), price: row("+ ₪1,490", "תוספת 1,490 ₪", "+ ₪1,490", "+ ₪1.490", "+ ₪1,490") },
      { label: row("Advanced custom design", "עיצוב אישי מתקדם", "Diseño personalizado avanzado", "Design personalizado avançado", "تصميم مخصص متقدم"), price: row("From ₪2,990", "החל מ־2,990 ₪", "Desde ₪2,990", "A partir de ₪2.990", "من ₪2,990") },
    ],
  },
  "crm-migration": {
    name: row("Migration from another CRM", "מעבר ממערכת CRM אחרת", "Migración desde otro CRM", "Migração de outro CRM", "الانتقال من CRM آخر"),
    description: row(
      "Especially valuable for customers switching to you — we migrate clients, leads, and statuses, and map fields so the business keeps running smoothly.",
      "שירות חשוב במיוחד ללקוחות שרוצים לעבור אליכם — מעבירים לקוחות, לידים וסטטוסים ומגדירים את השדות כך שהעסק ימשיך לעבוד בלי בלאגן.",
      "Especialmente útil si el cliente se cambia a ti — migrarmos clientes, leads y estados, y mapeamos campos para que el negocio siga fluido.",
      "Especialmente útil se o cliente muda para você — migramos clientes, leads e status, e mapeamos campos para o negócio seguir fluido.",
      "مهم خاصة للعملاء الذين ينتقلون إليكم — ننقل العملاء والعملاء المحتملين والحالات ونربط الحقول ليواصل العمل بسلاسة."
    ),
    price: row("From ₪790 one-time", "החל מ־790 ₪ חד־פעמי", "Desde ₪790 único", "A partir de ₪790 único", "من ₪790 لمرة واحدة"),
    details: [
      row("Transfer clients and leads", "העברת לקוחות ולידים", "Traslado de clientes y leads", "Transferência de clientes e leads", "نقل العملاء والعملاء المحتملين"),
      row("Transfer statuses", "העברת סטטוסים", "Traslado de estados", "Transferência de status", "نقل الحالات"),
      row("Field mapping", "התאמת שדות", "Mapeo de campos", "Mapeamento de campos", "مواءمة الحقول"),
      row("Validation check", "בדיקת תקינות", "Comprobación de calidad", "Checagem de qualidade", "فحص السلامة"),
      row("Training after migration", "הדרכה לאחר המעבר", "Formación tras la migración", "Treinamento após a migração", "تدريب بعد الانتقال"),
    ],
    tracks: [
      { label: row("Basic migration", "מעבר בסיסי", "Migración básica", "Migração básica", "ترحيل أساسي"), price: row("From ₪790", "החל מ־790 ₪", "Desde ₪790", "A partir de ₪790", "من ₪790") },
    ],
    note: row(
      "Scope and final pricing depend on record volume and the complexity of the existing system.",
      "היקף המעבר ותמחור סופי נקבעים לפי כמות הרשומות ומורכבות המערכת הקיימת.",
      "El alcance y el precio final dependen del volumen de registros y de la complejidad del sistema actual.",
      "O escopo e o preço final dependem do volume de registros e da complexidade do sistema atual.",
      "النطاق والسعر النهائي يعتمدان على حجم السجلات وتعقيد النظام القائم."
    ),
  },
  "store-products-upload": {
    name: row("Store product upload", "העלאת מוצרים לחנות", "Subida de productos a la tienda", "Envio de produtos para a loja", "رفع منتجات للمتجر"),
    description: row(
      "For customers building a store with you — we upload products with images, descriptions, categories, prices, variations, and shipping settings.",
      "ללקוחות שבונים דרככם חנות — אנחנו מעלים את המוצרים עם תמונות, תיאורים, קטגוריות, מחירים, וריאציות והגדרות משלוח.",
      "Para clientes que montan una tienda contigo — subimos productos con imágenes, descripciones, categorías, precios, variantes y envío.",
      "Para clientes que montam uma loja com você — enviamos produtos com imagens, descrições, categorias, preços, variações e envio.",
      "للعملاء الذين يبنون متجراً معكم — نرفع المنتجات مع الصور والأوصاف والفئات والأسعار والتنويعات وإعدادات الشحن."
    ),
    price: row("From ₪490 one-time", "החל מ־490 ₪ חד־פעמי", "Desde ₪490 único", "A partir de ₪490 único", "من ₪490 لمرة واحدة"),
    details: [
      row("Product upload", "העלאת מוצרים", "Subida de productos", "Envio de produtos", "رفع المنتجات"),
      row("Images and descriptions", "תמונות ותיאורים", "Imágenes y descripciones", "Imagens e descrições", "صور وأوصاف"),
      row("Categories", "קטגוריות", "Categorías", "Categorias", "فئات"),
      row("Prices and variations", "מחירים ווריאציות", "Precios y variantes", "Preços e variações", "أسعار وتنويعات"),
      row("Shipping settings", "הגדרות משלוח", "Ajustes de envío", "Configurações de envio", "إعدادات الشحن"),
    ],
    tracks: [
      { label: row("Up to 20 products", "עד 20 מוצרים", "Hasta 20 productos", "Até 20 produtos", "حتى 20 منتجاً"), price: row("₪490", "490 ₪", "₪490", "₪490", "₪490") },
      { label: row("Up to 50 products", "עד 50 מוצרים", "Hasta 50 productos", "Até 50 produtos", "حتى 50 منتجاً"), price: row("₪990", "990 ₪", "₪990", "₪990", "₪990") },
      { label: row("Beyond that", "מעבר לכך", "Más allá", "Além disso", "أكثر من ذلك"), price: row("Custom quote", "הצעה מותאמת", "Presupuesto a medida", "Orçamento sob medida", "عرض مخصص") },
    ],
  },
  "paid-campaign-setup": {
    name: row("Paid campaign setup", "הקמת קמפיין ממומן", "Configuración de campaña de pago", "Configuração de campanha paga", "إعداد حملة مدفوعة"),
    description: row(
      "An expert launches a professional Meta campaign and connects leads straight into Bizuply.",
      "מומחה מקים עבורכם קמפיין מקצועי במטא ומחבר את הלידים ישירות ל-Bizuply.",
      "Un experto lanza una campaña profesional en Meta y conecta los leads directo a Bizuply.",
      "Um especialista lança uma campanha profissional no Meta e conecta os leads direto na Bizuply.",
      "خبير يطلق حملة ميتا احترافية ويربط العملاء المحتملين مباشرة بـ Bizuply."
    ),
    price: row("From ₪690 one-time", "החל מ־690 ₪ חד־פעמי", "Desde ₪690 único", "A partir de ₪690 único", "من ₪690 لمرة واحدة"),
    details: [
      row("Meta campaign setup", "הקמת קמפיין במטא", "Configuración de campaña en Meta", "Configuração de campanha no Meta", "إعداد حملة ميتا"),
      row("Audience definition", "הגדרת קהל יעד", "Definición de audiencia", "Definição de público", "تحديد الجمهور"),
      row("Ad-set creation", "הקמת קבוצת מודעות", "Creación de conjunto de anuncios", "Criação de conjunto de anúncios", "إنشاء مجموعة إعلانات"),
      row("Up to 3 ads", "עד 3 מודעות", "Hasta 3 anuncios", "Até 3 anúncios", "حتى 3 إعلانات"),
      row("Lead form or existing landing page setup", "הגדרת טופס לידים או דף נחיתה קיים", "Formulario de leads o landing existente", "Formulário de leads ou landing existente", "إعداد نموذج عملاء محتملين أو صفحة هبوط قائمة"),
      row("Leads connected to Bizuply", "חיבור הלידים ל-Bizuply", "Leads conectados a Bizuply", "Leads conectados à Bizuply", "ربط العملاء المحتملين بـ Bizuply"),
      row("Basic tracking install", "התקנת מעקב בסיסית", "Instalación de seguimiento básico", "Instalação de rastreamento básico", "تثبيت تتبّع أساسي"),
      row("QA before launch", "בדיקת תקינות לפני עלייה", "Control de calidad antes del lanzamiento", "Checagem antes da publicação", "فحص قبل الإطلاق"),
    ],
    tracks: [
      { label: row("Meta campaign setup", "הקמת קמפיין במטא", "Configuración de campaña en Meta", "Configuração de campanha no Meta", "إعداد حملة ميتا"), price: row("₪690", "690 ₪", "₪690", "₪690", "₪690") },
      { label: row("Advanced Meta campaign setup", "הקמת קמפיין מתקדם במטא", "Campaña avanzada en Meta", "Campanha avançada no Meta", "إعداد حملة ميتا متقدمة"), price: row("₪990", "990 ₪", "₪990", "₪990", "₪990") },
    ],
    note: row(
      "Price covers setup only — ongoing management and ad budget are not included. Currently available for Meta only.",
      "המחיר כולל הקמה בלבד ואינו כולל ניהול שוטף או תקציב פרסום. כרגע השירות זמין למטא בלבד.",
      "El precio cubre solo la configuración — no incluye gestión continua ni presupuesto publicitario. Ahora solo en Meta.",
      "O preço cobre só a configuração — não inclui gestão contínua nem orçamento de anúncios. Por agora só no Meta.",
      "السعر يغطي الإعداد فقط — لا يشمل الإدارة المستمرة أو ميزانية الإعلانات. متاح حالياً لميتا فقط."
    ),
  },
  "content-creation": {
    name: row("Content creation", "יצירת תוכן", "Creación de contenido", "Criação de conteúdo", "إنشاء محتوى"),
    description: row(
      "The Bizuply team creates designed, publish-ready content for Facebook and Instagram.",
      "צוות Bizuply יוצר עבור העסק תוכן מעוצב ומוכן לפרסום בפייסבוק ובאינסטגרם.",
      "El equipo de Bizuply crea contenido diseñado y listo para publicar en Facebook e Instagram.",
      "A equipe da Bizuply cria conteúdo desenhado e pronto para publicar no Facebook e no Instagram.",
      "فريق Bizuply ينشئ محتوى مصمماً وجاهزاً للنشر على فيسبوك وإنستغرام."
    ),
    price: row("From ₪990 / month", "החל מ־990 ₪ לחודש", "Desde ₪990 / mes", "A partir de ₪990 / mês", "من ₪990 / شهر"),
    details: [
      row("8 posts per month", "8 פוסטים בחודש", "8 publicaciones al mes", "8 posts por mês", "8 منشورات شهرياً"),
      row("Copywriting and design", "כתיבה ועיצוב", "Redacción y diseño", "Redação e design", "كتابة وتصميم"),
      row("Facebook and Instagram adaptation", "התאמה לפייסבוק ולאינסטגרם", "Adaptación a Facebook e Instagram", "Adaptação para Facebook e Instagram", "مواءمة لفيسبوك وإنستغرام"),
      row("Monthly content plan", "לוח תוכן חודשי", "Plan de contenido mensual", "Plano de conteúdo mensal", "خطة محتوى شهرية"),
      row("Basic report", "דוח בסיסי", "Informe básico", "Relatório básico", "تقرير أساسي"),
    ],
    tracks: [
      { label: row("8 posts", "8 פוסטים", "8 publicaciones", "8 posts", "8 منشورات"), price: row("₪990 / month", "990 ₪ לחודש", "₪990 / mes", "₪990 / mês", "₪990 / شهر") },
      { label: row("12 posts", "12 פוסטים", "12 publicaciones", "12 posts", "12 منشوراً"), price: row("₪1,390 / month", "1,390 ₪ לחודש", "₪1,390 / mes", "₪1.390 / mês", "₪1,390 / شهر") },
      { label: row("8 posts + 4 videos from client materials", "8 פוסטים ו־4 סרטונים מחומרי הלקוח", "8 publicaciones + 4 vídeos con material del cliente", "8 posts + 4 vídeos com material do cliente", "8 منشورات + 4 فيديوهات من مواد العميل"), price: row("₪1,790 / month", "1,790 ₪ לחודש", "₪1,790 / mes", "₪1.790 / mês", "₪1,790 / شهر") },
    ],
    note: row(
      "Professional photography and publishing scheduling are not included at this time.",
      "צילום מקצועי ותזמון פרסומים אינם כלולים כרגע.",
      "La fotografía profesional y la programación de publicaciones no están incluidas ahora.",
      "Fotografia profissional e agendamento de publicações não estão incluídos agora.",
      "التصوير الاحترافي وجدولة النشر غير مشمولين حالياً."
    ),
  },
  "collab-manager": {
    name: row("Personal collaborations manager", "מנהל שיתופי פעולה אישי", "Gestor personal de colaboraciones", "Gestor pessoal de colaborações", "مدير تعاونات شخصي"),
    description: row(
      "A manager who finds relevant businesses, makes introductions, and guides communication between both sides.",
      "מנהל שמאתר עסקים רלוונטיים, יוצר חיבורים ומלווה את התקשורת בין הצדדים.",
      "Un gestor que encuentra negocios relevantes, presenta a las partes y acompaña la comunicación.",
      "Um gestor que encontra negócios relevantes, apresenta as partes e acompanha a comunicação.",
      "مدير يجد أنشطة ذات صلة ويعرّف الطرفين ويرافق التواصل."
    ),
    price: row("From ₪790 / month", "החל מ־790 ₪ לחודש", "Desde ₪790 / mes", "A partir de ₪790 / mês", "من ₪790 / شهر"),
    details: [
      row("Find up to 10 matching businesses", "איתור עד 10 עסקים מתאימים", "Encontrar hasta 10 negocios encajados", "Encontrar até 10 negócios adequados", "إيجاد حتى 10 أنشطة مناسبة"),
      row("Initial outreach", "פנייה ראשונית", "Primer contacto", "Primeiro contato", "تواصل أولي"),
      row("Collaboration idea proposal", "הצעת רעיון לשיתוף פעולה", "Propuesta de idea de colaboración", "Proposta de ideia de colaboração", "اقتراح فكرة تعاون"),
      row("Connect both sides", "יצירת החיבור בין הצדדים", "Conectar a ambas partes", "Conectar os dois lados", "ربط الطرفين"),
      row("Progress follow-up", "מעקב אחר התקדמות", "Seguimiento del avance", "Acompanhamento do progresso", "متابعة التقدّم"),
      row("Monthly report", "דוח חודשי", "Informe mensual", "Relatório mensal", "تقرير شهري"),
    ],
    tracks: [
      { label: row("Up to 10 businesses", "עד 10 עסקים", "Hasta 10 negocios", "Até 10 negócios", "حتى 10 أنشطة"), price: row("From ₪790 / month", "החל מ־790 ₪ לחודש", "Desde ₪790 / mes", "A partir de ₪790 / mês", "من ₪790 / شهر") },
      { label: row("Extended track up to 25 outreaches", "מסלול מורחב עד 25 פניות", "Itinerario ampliado hasta 25 contactos", "Percurso ampliado até 25 contatos", "مسار موسّع حتى 25 تواصلاً"), price: row("₪1,290 / month", "1,290 ₪ לחודש", "₪1,290 / mes", "₪1.290 / mês", "₪1,290 / شهر") },
    ],
    note: row(
      "The service does not guarantee a specific number of closed collaborations.",
      "השירות אינו מתחייב לסגירת מספר מסוים של שיתופי פעולה.",
      "El servicio no garantiza un número concreto de colaboraciones cerradas.",
      "O serviço não garante um número específico de colaborações fechadas.",
      "الخدمة لا تضمن عدداً محدداً من التعاونات المغلقة."
    ),
  },
  "lead-first-response": {
    name: row("Initial lead response", "מענה ראשוני ללידים", "Primera respuesta a leads", "Primeira resposta a leads", "الرد الأولي على العملاء المحتملين"),
    description: row(
      "A human agent calls new leads back, runs an initial discovery, filters the inquiry, and updates every detail in the CRM.",
      "נציג אנושי חוזר ללידים חדשים, מבצע בירור ראשוני, מסנן את הפנייה ומעדכן את כל הפרטים ב-CRM.",
      "Un agente humano llama a leads nuevos, hace un primer filtro y actualiza cada detalle en el CRM.",
      "Um agente humano liga para leads novos, faz um filtro inicial e atualiza cada detalhe no CRM.",
      "مندوب بشري يتصل بالعملاء المحتملين الجدد ويُجري استبياناً أولياً ويحدّث كل التفاصيل في CRM."
    ),
    price: row("From ₪690 / month", "החל מ־690 ₪ לחודש", "Desde ₪690 / mes", "A partir de ₪690 / mês", "من ₪690 / شهر"),
    details: [
      row("Up to 40 leads per month", "עד 40 לידים בחודש", "Hasta 40 leads al mes", "Até 40 leads por mês", "حتى 40 عميلاً محتملاً شهرياً"),
      row("Up to 3 call attempts per lead", "עד 3 ניסיונות התקשרות לכל ליד", "Hasta 3 intentos de llamada por lead", "Até 3 tentativas de ligação por lead", "حتى 3 محاولات اتصال لكل عميل محتمل"),
      row("Business-tailored discovery questionnaire", "שאלון ראשוני מותאם לעסק", "Cuestionario inicial adaptado al negocio", "Questionário inicial adaptado ao negócio", "استبيان أولي ملائم للنشاط"),
      row("Lead filtering", "סינון לידים", "Filtrado de leads", "Filtro de leads", "تصفية العملاء المحتملين"),
      row("Status update and call summary", "עדכון סטטוס וסיכום שיחה", "Actualización de estado y resumen de llamada", "Atualização de status e resumo da ligação", "تحديث الحالة وملخص المكالمة"),
      row("Monthly activity report", "דוח פעילות חודשי", "Informe mensual de actividad", "Relatório mensal de atividade", "تقرير نشاط شهري"),
      row("Extra lead: ₪15", "ליד נוסף: 15 ₪", "Lead extra: ₪15", "Lead extra: ₪15", "عميل محتمل إضافي: ₪15"),
    ],
  },
  "personal-sales-rep": {
    name: row("Personal sales representative", "נציג מכירות אישי", "Comercial personal", "Representante de vendas pessoal", "مندوب مبيعات شخصي"),
    description: row(
      "A rep who runs sales calls, sends proposals, handles objections, and follows clients through to a decision.",
      "נציג שמבצע שיחות מכירה, שולח הצעות, מטפל בהתנגדויות ועוקב אחר הלקוחות עד לקבלת החלטה.",
      "Un comercial que hace llamadas de venta, envía propuestas, trata objeciones y acompaña hasta la decisión.",
      "Um representante que faz ligações de venda, envia propostas, trata objeções e acompanha até a decisão.",
      "مندوب يجري مكالمات بيع ويرسل عروضاً ويعالج الاعتراضات ويتابع حتى القرار."
    ),
    price: row("₪1,490 / month + 5% success fee", "1,490 ₪ לחודש + 5% הצלחה", "₪1,490 / mes + 5% de éxito", "₪1.490 / mês + 5% de sucesso", "₪1,490 / شهر + 5% نجاح"),
    details: [
      row("Up to 40 hot leads per month", "עד 40 לידים חמים בחודש", "Hasta 40 leads calientes al mes", "Até 40 leads quentes por mês", "حتى 40 عميلاً محتملاً ساخناً شهرياً"),
      row("Sales calls", "שיחות מכירה", "Llamadas de venta", "Ligações de venda", "مكالمات بيع"),
      row("Follow-ups", "פולואפים", "Seguimientos", "Follow-ups", "متابعات"),
      row("Sending ready-made proposals", "שליחת הצעות מחיר מוכנות", "Envío de presupuestos listos", "Envio de propostas prontas", "إرسال عروض جاهزة"),
      row("Results updated in CRM", "עדכון תוצאות ב-CRM", "Resultados actualizados en el CRM", "Resultados atualizados no CRM", "تحديث النتائج في CRM"),
      row("Monthly sales report", "דוח מכירות חודשי", "Informe mensual de ventas", "Relatório mensal de vendas", "تقرير مبيعات شهري"),
      row("Extra lead: ₪25", "ליד נוסף: 25 ₪", "Lead extra: ₪25", "Lead extra: ₪25", "عميل محتمل إضافي: ₪25"),
    ],
  },
  "old-leads-followup": {
    name: row("Old leads follow-up", "פולואפים ללידים ישנים", "Seguimiento de leads antiguos", "Follow-up de leads antigos", "متابعة العملاء المحتملين القدامى"),
    description: row(
      "Re-engage unclosed leads — define what counts as an old lead in the CRM, and they move automatically into a dedicated follow-up tab to verify relevance.",
      "חזרה ללידים שלא נסגרו — ב-CRM מוגדר מה נחשב ליד ישן, והם עוברים אוטומטית לטאב ייעודי לפולואפ ובדיקת רלוונטיות.",
      "Reactivar leads sin cerrar — defines qué es un lead antiguo en el CRM y pasan solos a una pestaña de seguimiento.",
      "Reativar leads não fechados — você define o que é um lead antigo no CRM e eles passam sozinhos para uma aba de follow-up.",
      "إعادة تفعيل العملاء المحتملين غير المغلقين — تُحدَّد من هو العميل القديم في CRM وينتقلون تلقائياً إلى تبويب متابعة."
    ),
    price: row("₪590 one-time", "590 ₪ חד־פעמי", "₪590 único", "₪590 único", "₪590 لمرة واحدة"),
    details: [
      row("Define old leads by days without activity", "הגדרת ליד ישן לפי ימים ללא פעילות", "Definir leads antiguos por días sin actividad", "Definir leads antigos por dias sem atividade", "تعريف العميل المحتمل القديم بأيام دون نشاط"),
      row("Automatic move to the CRM Old Leads tab", "העברה אוטומטית לטאב לידים ישנים ב-CRM", "Paso automático a la pestaña de leads antiguos", "Passagem automática para a aba de leads antigos", "نقل تلقائي إلى تبويب العملاء المحتملين القدامى"),
      row("Handle up to 50 leads", "טיפול בעד 50 לידים", "Tratar hasta 50 leads", "Tratar até 50 leads", "معالجة حتى 50 عميلاً محتملاً"),
      row("Up to 2 call attempts", "עד 2 ניסיונות התקשרות", "Hasta 2 intentos de llamada", "Até 2 tentativas de ligação", "حتى محاولتي اتصال"),
      row("Relevance check and return to the sales process", "בדיקת רלוונטיות והחזרה לתהליך המכירה", "Comprobar relevancia y volver al proceso de venta", "Checar relevância e voltar ao processo de venda", "فحص الصلة والإعادة إلى عملية البيع"),
    ],
    tracks: [
      { label: row("50-lead pack", "חבילת 50 לידים", "Paquete de 50 leads", "Pacote de 50 leads", "باقة 50 عميلاً محتملاً"), price: row("₪590", "590 ₪", "₪590", "₪590", "₪590") },
      { label: row("Up to 100 leads", "עד 100 לידים", "Hasta 100 leads", "Até 100 leads", "حتى 100 عميل محتمل"), price: row("₪990", "990 ₪", "₪990", "₪990", "₪990") },
    ],
  },
  "crm-manager": {
    name: row("Personal CRM manager", "מנהל CRM אישי", "Gestor personal de CRM", "Gestor pessoal de CRM", "مدير CRM شخصي"),
    description: row(
      "A manager who reviews leads, organizes statuses, opens tasks, and makes sure no client is forgotten.",
      "מנהל שעובר על הלידים, מסדר סטטוסים, פותח משימות ודואג שאף לקוח לא יישכח.",
      "Un gestor que revisa leads, ordena estados, abre tareas y evita que se olvide a ningún cliente.",
      "Um gestor que revisa leads, organiza status, abre tarefas e evita que algum cliente seja esquecido.",
      "مدير يراجع العملاء المحتملين ويرتّب الحالات ويفتح مهاماً ويضمن ألا يُنسى أي عميل."
    ),
    price: row("From ₪490 / month", "החל מ־490 ₪ לחודש", "Desde ₪490 / mes", "A partir de ₪490 / mês", "من ₪490 / شهر"),
    details: [
      row("System review twice a week", "בדיקת המערכת פעמיים בשבוע", "Revisión del sistema dos veces por semana", "Revisão do sistema duas vezes por semana", "مراجعة النظام مرتين أسبوعياً"),
      row("Status cleanup", "סידור סטטוסים", "Orden de estados", "Organização de status", "ترتيب الحالات"),
      row("Find untreated leads", "איתור לידים ללא טיפול", "Encontrar leads sin tratar", "Encontrar leads sem tratamento", "إيجاد عملاء محتملين بلا معالجة"),
      row("Open tasks and reminders", "פתיחת משימות ותזכורות", "Abrir tareas y recordatorios", "Abrir tarefas e lembretes", "فتح مهام وتذكيرات"),
      row("Basic duplicate cleanup", "ניקוי כפילויות בסיסי", "Limpieza básica de duplicados", "Limpeza básica de duplicados", "تنظيف التكرارات الأساسي"),
      row("Monthly report", "דוח חודשי", "Informe mensual", "Relatório mensal", "تقرير شهري"),
    ],
    tracks: [
      { label: row("Twice-weekly review", "בדיקה פעמיים בשבוע", "Revisión dos veces por semana", "Revisão duas vezes por semana", "مراجعة مرتين أسبوعياً"), price: row("From ₪490 / month", "החל מ־490 ₪ לחודש", "Desde ₪490 / mes", "A partir de ₪490 / mês", "من ₪490 / شهر") },
      { label: row("Daily review track", "מסלול בדיקה יומית", "Itinerario de revisión diaria", "Percurso de revisão diária", "مسار مراجعة يومية"), price: row("₪890 / month", "890 ₪ לחודש", "₪890 / mes", "₪890 / mês", "₪890 / شهر") },
    ],
  },
  "external-support": {
    name: row("External customer support", "שירות לקוחות חיצוני", "Atención al cliente externa", "Suporte ao cliente externo", "دعم عملاء خارجي"),
    description: row(
      "An agent handles existing-customer inquiries by phone, WhatsApp, or your ticket system.",
      "נציג מטפל בפניות של לקוחות קיימים דרך טלפון, WhatsApp או מערכת הפניות.",
      "Un agente atiende consultas de clientes actuales por teléfono, WhatsApp o tu sistema de tickets.",
      "Um agente trata consultas de clientes atuais por telefone, WhatsApp ou seu sistema de tickets.",
      "مندوب يعالج استفسارات العملاء الحاليين عبر الهاتف أو واتساب أو نظام التذاكر."
    ),
    price: row("From ₪1,290 / month", "החל מ־1,290 ₪ לחודש", "Desde ₪1,290 / mes", "A partir de ₪1.290 / mês", "من ₪1,290 / شهر"),
    details: [
      row("Up to 10 support hours per month", "עד 10 שעות טיפול בחודש", "Hasta 10 horas de atención al mes", "Até 10 horas de atendimento por mês", "حتى 10 ساعات دعم شهرياً"),
      row("Responses according to business procedures", "מענה לפי נהלי העסק", "Respuestas según los procedimientos del negocio", "Respostas conforme os procedimentos do negócio", "ردود وفق إجراءات النشاط"),
      row("Tickets updated in the system", "עדכון הפניות במערכת", "Tickets actualizados en el sistema", "Tickets atualizados no sistema", "تحديث التذاكر في النظام"),
      row("Complex cases escalated to the owner", "העברת מקרים מורכבים לבעל העסק", "Casos complejos derivados al dueño", "Casos complexos encaminhados ao dono", "تصعيد الحالات المعقدة لصاحب النشاط"),
      row("Monthly service report", "דוח שירות חודשי", "Informe mensual de servicio", "Relatório mensal de serviço", "تقرير خدمة شهري"),
      row("Extra hour: ₪75", "שעה נוספת: 75 ₪", "Hora extra: ₪75", "Hora extra: ₪75", "ساعة إضافية: ₪75"),
    ],
  },
};

export function extraPricingAddonsLocaleObject(locale) {
  const addons = {};
  for (const [key, def] of Object.entries(ADDONS)) {
    addons[key] = {
      name: pick(def.name, locale),
      description: pick(def.description, locale),
      price: pick(def.price, locale),
    };
    if (def.details) addons[key].details = listToMap(def.details, locale);
    if (def.tracks) addons[key].tracks = tracksToMap(def.tracks, locale);
    if (def.extras) addons[key].extras = tracksToMap(def.extras, locale);
    if (def.examples) addons[key].examples = listToMap(def.examples, locale);
    if (def.note) addons[key].note = pick(def.note, locale);
  }
  return { pricing: { addons } };
}
