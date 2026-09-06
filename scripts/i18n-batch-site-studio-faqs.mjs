/** Extra Business/Partner catalog leaves merged by merge-business-partner-i18n.mjs */
function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

function pickNested(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([id, fields]) => [
      id,
      Object.fromEntries(
        Object.entries(fields).map(([field, value]) => [field, value[locale] || value.en])
      ),
    ])
  );
}

function pickFaq(section, locale) {
  return {
    title: section.title[locale] || section.title.en,
    ...(section.subtitle
      ? { subtitle: section.subtitle[locale] || section.subtitle.en }
      : {}),
    items: pickNested(section.items, locale),
  };
}

const NAV = {
  overview: {
    label: row("Overview", "סקירה", "Resumen", "Visão geral", "نظرة عامة"),
    description: row(
      "A general view of the site and active plugins",
      "מבט כללי על האתר והתוספים הפעילים",
      "Vista general del sitio y los plugins activos",
      "Visão geral do site e dos plugins ativos",
      "نظرة عامة على الموقع والإضافات النشطة"
    ),
  },
  plugins: {
    label: row("Plugin store", "חנות תוספים", "Tienda de plugins", "Loja de plugins", "متجر الإضافات"),
    description: row(
      "Install and remove site plugins",
      "התקנה והסרה של תוספים לאתר",
      "Instala y quita plugins del sitio",
      "Instale e remova plugins do site",
      "تثبيت إزالة إضافات الموقع"
    ),
  },
  portal: {
    label: row("Personal area", "אזור אישי", "Área personal", "Área pessoal", "منطقة شخصية"),
    description: row(
      "Site-customer login plus private pages built in the editor — not a BizUply account",
      "התחברות ללקוחות האתר + עמודים פרטיים שנבנים בעורך — לא קשור לחשבון BizUply",
      "Inicio de sesión de clientes del sitio y páginas privadas del editor — no es una cuenta BizUply",
      "Login de clientes do site e páginas privadas do editor — não é uma conta BizUply",
      "تسجيل دخول عملاء الموقع وصفحات خاصة من المحرر — ليست حساب BizUply"
    ),
  },
  store: {
    label: row("Store management", "ניהול חנות", "Gestión de tienda", "Gestão da loja", "إدارة المتجر"),
    description: row(
      "Products, categories, shipping, and orders",
      "מוצרים, קטגוריות, משלוחים והזמנות",
      "Productos, categorías, envíos y pedidos",
      "Produtos, categorias, envios e pedidos",
      "منتجات وفئات وشحن وطلبات"
    ),
  },
  booking: {
    label: row("Calendar and appointments", "יומן ותורים", "Agenda y citas", "Agenda e horários", "التقويم والمواعيد"),
    description: row(
      "Business hours, services, and appointments",
      "שעות פעילות, שירותים ותורים",
      "Horario, servicios y citas",
      "Horário, serviços e horários",
      "ساعات العمل والخدمات والمواعيد"
    ),
  },
  payments: {
    label: row("Payments", "תשלומים", "Pagos", "Pagamentos", "المدفوعات"),
    description: row(
      "Connect payment providers and checkout methods",
      "חיבור ספקי תשלום ואמצעי סליקה לאתר",
      "Conecta proveedores de pago y métodos de cobro",
      "Conecte provedores de pagamento e meios de cobrança",
      "ربط مزودي الدفع ووسائل التحصيل"
    ),
  },
  invoices: {
    label: row("Morning invoices", "חשבוניות Morning", "Facturas Morning", "Faturas Morning", "فواتير Morning"),
    description: row(
      "Connect Morning and issue invoices automatically",
      "חיבור ל-Morning והפקת חשבוניות אוטומטית",
      "Conecta Morning y emite facturas automáticamente",
      "Conecte o Morning e emita faturas automaticamente",
      "ربط Morning وإصدار الفواتير تلقائياً"
    ),
  },
  leads: {
    label: row("Lead form", "טופס לידים", "Formulario de leads", "Formulário de leads", "نموذج العملاء المحتملين"),
    description: row(
      "Manage customer inquiries",
      "ניהול פניות מלקוחות",
      "Gestiona consultas de clientes",
      "Gerencie consultas de clientes",
      "إدارة استفسارات العملاء"
    ),
  },
  reviews: {
    label: row("Reviews", "ביקורות", "Reseñas", "Avaliações", "المراجعات"),
    description: row(
      "Manage customer reviews",
      "ניהול ביקורות לקוחות",
      "Gestiona reseñas de clientes",
      "Gerencie avaliações de clientes",
      "إدارة مراجعات العملاء"
    ),
  },
  club: {
    label: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"),
    description: row(
      "Customer area and perks",
      "אזור לקוחות והטבות",
      "Área de clientes y beneficios",
      "Área de clientes e benefícios",
      "منطقة العملاء والمزايا"
    ),
  },
  heatmap: {
    label: row("Heatmap", "מפת חום", "Mapa de calor", "Mapa de calor", "خريطة حرارية"),
    description: row("Click and scroll analysis", "ניתוח קליקים וגלילה", "Análisis de clics y desplazamiento", "Análise de cliques e rolagem", "تحليل النقرات والتمرير"),
  },
  "form-abandonment": {
    label: row("Form abandonment", "נטישת טפסים", "Abandono de formularios", "Abandono de formulários", "هجر النماذج"),
    description: row("Analyze unfinished forms", "ניתוח טפסים שלא הושלמו", "Analiza formularios incompletos", "Analise formulários incompletos", "تحليل النماذج غير المكتملة"),
  },
  "journey-recording": {
    label: row("Customer journey", "מסע לקוח", "Viaje del cliente", "Jornada do cliente", "رحلة العميل"),
    description: row("Visitor path recordings", "הקלטות מסלול גולשים", "Grabaciones del recorrido", "Gravações do percurso", "تسجيلات مسار الزوار"),
  },
  countdown: {
    label: row("Countdown", "ספירה לאחור", "Cuenta atrás", "Contagem regressiva", "عد تنازلي"),
    description: row("Dynamic promo timer", "טיימר דינמי למבצעים", "Temporizador de promociones", "Temporizador de promoções", "مؤقت للعروض"),
  },
  "benefits-wheel": {
    label: row("Benefits wheel", "גלגל הטבות", "Ruleta de beneficios", "Roda de benefícios", "عجلة المزايا"),
    description: row("Perk game for conversions", "משחק הטבות להמרות", "Juego de premios para conversiones", "Jogo de benefícios para conversões", "لعبة مزايا للتحويلات"),
  },
  "smart-search": {
    label: row("Smart search", "חיפוש חכם", "Búsqueda inteligente", "Busca inteligente", "بحث ذكي"),
    description: row("Search button with a site search bar", "כפתור חיפוש עם שורת חיפוש באתר", "Botón de búsqueda con barra en el sitio", "Botão de busca com barra no site", "زر بحث مع شريط في الموقع"),
  },
  "smart-bot": {
    label: row("Smart bot", "בוט חכם", "Bot inteligente", "Bot inteligente", "بوت ذكي"),
    description: row("Conversation trees, contact, and a help button", "עצי שיחה, יצירת קשר וכפתור עזרה", "Árboles de conversación, contacto y botón de ayuda", "Árvores de conversa, contato e botão de ajuda", "أشجار محادثة وتواصل وزر مساعدة"),
  },
  "service-finder": {
    label: row("Find a service", "מצא שירות", "Encontrar servicio", "Encontrar serviço", "ابحث عن خدمة"),
    description: row("Matching questionnaire", "שאלון התאמה", "Cuestionario de coincidencia", "Questionário de correspondência", "استبيان مطابقة"),
  },
  accessibility: {
    label: row("Accessibility", "נגישות", "Accesibilidad", "Acessibilidade", "إمكانية الوصول"),
    description: row("Site accessibility tools", "כלי נגישות לאתר", "Herramientas de accesibilidad", "Ferramentas de acessibilidade", "أدوات إمكانية الوصول"),
  },
  "whatsapp-float": {
    label: row("Floating WhatsApp", "WhatsApp צף", "WhatsApp flotante", "WhatsApp flutuante", "واتساب عائم"),
    description: row("WhatsApp chat button", "כפתור שיחה ב-WhatsApp", "Botón de chat de WhatsApp", "Botão de chat do WhatsApp", "زر دردشة واتساب"),
  },
  "exit-popup": {
    label: row("Lead popup", "פופאפ לידים", "Popup de leads", "Popup de leads", "نافذة عملاء محتملين"),
    description: row("Popup with a lead form", "חלון קופץ עם טופס לידים", "Ventana emergente con formulario", "Janela pop-up com formulário", "نافذة منبثقة مع نموذج"),
  },
  "smart-forms": {
    label: row("Smart forms Pro", "טפסים חכמים Pro", "Formularios inteligentes Pro", "Formulários inteligentes Pro", "نماذج ذكية Pro"),
    description: row("Conditional fields, steps, files, and an inbox", "שדות מותנים, שלבים, קבצים ותיבת פניות", "Campos condicionales, pasos y archivos", "Campos condicionais, etapas e arquivos", "حقول مشروطة وخطوات وملفات"),
  },
  "announcement-bar": {
    label: row("Announcement bar", "פס הודעות", "Barra de anuncios", "Barra de avisos", "شريط الإعلانات"),
    description: row("Fixed message at the top of the site", "הודעה קבועה בראש האתר", "Mensaje fijo en la parte superior", "Mensagem fixa no topo do site", "رسالة ثابتة أعلى الموقع"),
  },
  "cookie-banner": {
    label: row("Cookie banner", "באנר עוגיות", "Banner de cookies", "Banner de cookies", "لافتة ملفات تعريف"),
    description: row("Cookie consent and privacy policy", "הסכמה לעוגיות ומדיניות פרטיות", "Consentimiento de cookies y privacidad", "Consentimento de cookies e privacidade", "موافقة ملفات التعريف والخصوصية"),
  },
};

const MANAGEMENT = {
  fallbackSite: row("My site", "האתר שלי", "Mi sitio", "Meu site", "موقعي"),
  siteNotFound: row("The site was not found", "האתר לא נמצא", "No se encontró el sitio", "O site não foi encontrado", "لم يتم العثور على الموقع"),
  loadError: row("Could not load the management panel", "שגיאה בטעינת הפאנל", "No se pudo cargar el panel", "Não foi possível carregar o painel", "تعذّر تحميل اللوحة"),
  checkoutFailed: row("Could not open plugin checkout", "פתיחת תשלום לתוסף נכשלה", "No se pudo abrir el pago del plugin", "Não foi possível abrir o pagamento do plugin", "تعذّر فتح دفع الإضافة"),
  updateFailed: row("Updating the plugin failed — try again", "עדכון התוסף נכשל — נסו שוב", "La actualización del plugin falló — inténtalo de nuevo", "A atualização do plugin falhou — tente novamente", "فشل تحديث الإضافة — حاول مرة أخرى"),
  loading: row("Loading management panel...", "טוען פאנל ניהול...", "Cargando el panel...", "Carregando o painel...", "جارٍ تحميل لوحة الإدارة..."),
  backToSites: row("Back to my sites", "חזרה לאתרים שלי", "Volver a mis sitios", "Voltar aos meus sites", "العودة إلى مواقعي"),
  published: row("Published", "מפורסם", "Publicado", "Publicado", "منشور"),
  draft: row("Draft", "טיוטה", "Borrador", "Rascunho", "مسودة"),
  editor: row("Editor", "עורך", "Editor", "Editor", "المحرر"),
  liveSite: row("Live site", "אתר חי", "Sitio en vivo", "Site ao vivo", "الموقع الحي"),
  activePlugins: row("Active plugins", "תוספים פעילים", "Plugins activos", "Plugins ativos", "الإضافات النشطة"),
  siteStatus: row("Site status", "סטטוס אתר", "Estado del sitio", "Status do site", "حالة الموقع"),
  availableInStore: row("Available in store", "זמין בחנות", "Disponible en la tienda", "Disponível na loja", "متاح في المتجر"),
  quickManage: row("Quick management", "ניהול מהיר", "Gestión rápida", "Gestão rápida", "إدارة سريعة"),
  quickManageHint: row("Quick access to the site plugins and settings", "גישה מהירה לתוספים והגדרות של האתר", "Acceso rápido a plugins y ajustes", "Acesso rápido a plugins e configurações", "وصول سريع إلى الإضافات والإعدادات"),
  pluginStore: row("Plugin store", "חנות תוספים", "Tienda de plugins", "Loja de plugins", "متجر الإضافات"),
  clickToManage: row("Click to manage", "לחצו לניהול", "Clic para gestionar", "Clique para gerenciar", "انقر للإدارة"),
  noPlugins: row("No plugins installed yet", "עדיין לא הותקנו תוספים", "Aún no hay plugins instalados", "Ainda não há plugins instalados", "لم تُثبَّت إضافات بعد"),
  discoverStore: row("Browse the plugin store", "גלו את חנות התוספים", "Explora la tienda de plugins", "Explore a loja de plugins", "تصفح متجر الإضافات"),
};

const SMART_BOT = {
  hexHint: row("HEX code", "קוד HEX", "Código HEX", "Código HEX", "رمز HEX"),
  defaultTrigger: row("Need help?", "צריכים עזרה?", "¿Necesitas ayuda?", "Precisa de ajuda?", "تحتاج مساعدة؟"),
  defaultName: row("Smart bot", "בוט חכם", "Bot inteligente", "Bot inteligente", "بوت ذكي"),
  defaultWelcome: row("Hi! How can we help you today?", "שלום! איך אפשר לעזור לכם היום?", "¡Hola! ¿Cómo podemos ayudarte hoy?", "Olá! Como podemos ajudar hoje?", "مرحباً! كيف يمكننا مساعدتك اليوم؟"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Pré-visualização", "معاينة"),
  previewHint: row("The button as it will appear on the site", "הכפתור כפי שיופיע באתר", "El botón como aparecerá en el sitio", "O botão como aparecerá no site", "الزر كما سيظهر في الموقع"),
  online: row("Online · replies instantly", "אונליין · עונה מיד", "En línea · responde al instante", "Online · responde na hora", "متصل · يرد فوراً"),
  editorTip: row(
    "In the editor: Plugins → drag the bot button to the place you want. On the live site a click opens the chat window using the conversation tree you set.",
    "בעורך: תוספים → גררו את כפתור הבוט למיקום הרצוי. בלחיצה באתר החי נפתח חלון השיחה לפי עץ השיחה שהגדרתם.",
    "En el editor: Plugins → arrastra el botón del bot. En el sitio en vivo, un clic abre el chat según el árbol que definiste.",
    "No editor: Plugins → arraste o botão do bot. No site ao vivo, um clique abre o chat conforme a árvore definida.",
    "في المحرر: الإضافات → اسحب زر البوت إلى المكان المطلوب. في الموقع الحي يفتح النقر نافذة الدردشة حسب شجرة المحادثة."
  ),
  stepN: row("Step {{n}}", "שלב {{n}}", "Paso {{n}}", "Etapa {{n}}", "الخطوة {{n}}"),
  defaultStepMessage: row("Bot message for this step...", "הודעת הבוט בשלב זה...", "Mensaje del bot en este paso...", "Mensagem do bot nesta etapa...", "رسالة البوت في هذه الخطوة..."),
  continue: row("Continue", "המשך", "Continuar", "Continuar", "متابعة"),
  title: row("Smart bot", "בוט חכם", "Bot inteligente", "Bot inteligente", "بوت ذكي"),
  description: row(
    "Conversation trees the business builds, a custom help button, chat-window design, and a contact option.",
    "עצי שיחה שהעסק בונה, כפתור עזרה מותאם, עיצוב חלון השיחה ואפשרות יצירת קשר.",
    "Árboles de conversación, botón de ayuda, diseño del chat y opción de contacto.",
    "Árvores de conversa, botão de ajuda, design do chat e opção de contato.",
    "أشجار محادثة يبنيها العمل وزر مساعدة وتصميم نافذة الدردشة وخيار تواصل."
  ),
  activation: row("Activation", "הפעלה", "Activación", "Ativação", "التفعيل"),
  activationHint: row("Plugin availability on the site", "זמינות התוסף באתר", "Disponibilidad del plugin en el sitio", "Disponibilidade do plugin no site", "توافر الإضافة في الموقع"),
  pluginActive: row("Plugin active on the site", "תוסף פעיל באתר", "Plugin activo en el sitio", "Plugin ativo no site", "الإضافة نشطة في الموقع"),
  botName: row("Bot name", "שם הבוט", "Nombre del bot", "Nome do bot", "اسم البوت"),
  welcome: row("Opening message", "הודעת פתיחה", "Mensaje de apertura", "Mensagem de abertura", "رسالة الافتتاح"),
  trigger: row("Trigger button", "כפתור הפעלה", "Botón de activación", "Botão de ativação", "زر التشغيل"),
  triggerHint: row("How the trigger that opens the bot looks", "איך נראה הטריגר שפותח את הבוט", "Cómo se ve el disparador que abre el bot", "Como é o gatilho que abre o bot", "كيف يبدو الزر الذي يفتح البوت"),
  triggerStyle: row("Button style", "סגנון הכפתור", "Estilo del botón", "Estilo do botão", "نمط الزر"),
  styleIcon: row("Bot icon only", "אייקון בוט בלבד", "Solo icono del bot", "Somente ícone do bot", "أيقونة البوت فقط"),
  styleLabel: row("Label only", "כיתוב בלבד", "Solo texto", "Somente texto", "نص فقط"),
  styleBoth: row("Icon + label", "אייקון + כיתוב", "Icono + texto", "Ícone + texto", "أيقونة + نص"),
  triggerText: row("Button text", "טקסט הכפתור", "Texto del botón", "Texto do botão", "نص الزر"),
  triggerColor: row("Button color", "צבע הכפתור", "Color del botón", "Cor do botão", "لون الزر"),
  textColor: row("Text color", "צבע הטקסט", "Color del texto", "Cor do texto", "لون النص"),
  window: row("Chat window", "חלון השיחה", "Ventana de chat", "Janela do chat", "نافذة الدردشة"),
  windowHint: row("Design of the chat window that opens on the site", "עיצוב חלון הצ׳אט שנפתח באתר", "Diseño de la ventana de chat del sitio", "Design da janela de chat do site", "تصميم نافذة الدردشة في الموقع"),
  headerColor: row("Header color", "צבע כותרת", "Color del encabezado", "Cor do cabeçalho", "لون الترويسة"),
  windowBg: row("Window background", "רקע החלון", "Fondo de la ventana", "Fundo da janela", "خلفية النافذة"),
  botBubble: row("Bot bubble", "בועת הבוט", "Burbuja del bot", "Balão do bot", "فقاعة البوت"),
  botBubbleText: row("Bot bubble text", "טקסט בועת הבוט", "Texto de la burbuja del bot", "Texto do balão do bot", "نص فقاعة البوت"),
  userBubble: row("User bubble", "בועת המשתמש", "Burbuja del usuario", "Balão do usuário", "فقاعة المستخدم"),
  userBubbleText: row("User bubble text", "טקסט בועת המשתמש", "Texto de la burbuja del usuario", "Texto do balão do usuário", "نص فقاعة المستخدم"),
  contact: row("Contact", "יצירת קשר", "Contacto", "Contato", "تواصل"),
  contactHint: row("Allow contact from inside the chat", "אפשרות ליצירת קשר מתוך השיחה", "Permitir contacto desde el chat", "Permitir contato pelo chat", "السماح بالتواصل من داخل الدردشة"),
  showContact: row("Show a contact option", "הצג אפשרות יצירת קשר", "Mostrar opción de contacto", "Mostrar opção de contato", "إظهار خيار التواصل"),
  contactLabel: row("Button label", "תווית הכפתור", "Etiqueta del botón", "Rótulo do botão", "تسمية الزر"),
  defaultContact: row("Contact us", "צרו קשר", "Contáctanos", "Fale conosco", "تواصل معنا"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  whatsappHint: row("International number without +, for example 97250...", "מספר בינלאומי ללא +, למשל 97250...", "Número internacional sin +, por ejemplo 97250...", "Número internacional sem +, por exemplo 97250...", "رقم دولي بدون +، مثلاً 97250..."),
  email: row("Email", "אימייל", "Email", "E-mail", "البريد"),
  trees: row("Conversation trees", "עצי שיחה", "Árboles de conversación", "Árvores de conversa", "أشجار المحادثة"),
  treesHint: row("Build the path — steps, messages, and choice buttons", "בנו את מסלול השיחה — שלבים, הודעות וכפתורי בחירה", "Construye el recorrido — pasos, mensajes y botones", "Monte o percurso — etapas, mensagens e botões", "ابنِ المسار — خطوات ورسائل وأزرار"),
  startStep: row("Start step", "שלב התחלה", "Paso inicial", "Etapa inicial", "خطوة البداية"),
  delete: row("Delete", "מחק", "Eliminar", "Excluir", "حذف"),
  stepTitle: row("Step title", "כותרת השלב", "Título del paso", "Título da etapa", "عنوان الخطوة"),
  botMessage: row("Bot message", "הודעת הבוט", "Mensaje del bot", "Mensagem do bot", "رسالة البوت"),
  optionsHint: row("Choice options — invent replies and what happens next", "אפשרויות בחירה — ממציאים תשובות ומה קורה אחר כך", "Opciones — inventa respuestas y lo que sigue", "Opções — invente respostas e o que acontece depois", "خيارات — اخترع ردوداً وما يحدث بعدها"),
  newOption: row("New option", "אפשרות חדשה", "Nueva opción", "Nova opção", "خيار جديد"),
  defaultReply: row("Write the bot reply here...", "כאן כותבים את תשובת הבוט...", "Escribe aquí la respuesta del bot...", "Escreva aqui a resposta do bot...", "اكتب هنا رد البوت..."),
  addOption: row("Add option", "הוסף אפשרות", "Añadir opción", "Adicionar opção", "إضافة خيار"),
  optionLabel: row("Button text for the visitor", "טקסט הכפתור לגולש", "Texto del botón para el visitante", "Texto do botão para o visitante", "نص الزر للزائر"),
  optionPlaceholder: row("For example: What is the price?", "לדוגמה: מה המחיר?", "Por ejemplo: ¿Cuál es el precio?", "Por exemplo: Qual é o preço?", "مثلاً: ما السعر؟"),
  afterClick: row("What happens after a click", "מה קורה אחרי לחיצה", "Qué ocurre después del clic", "O que acontece após o clique", "ماذا يحدث بعد النقر"),
  deleteOption: row("Delete option", "מחק אפשרות", "Eliminar opción", "Excluir opção", "حذف الخيار"),
  endMessage: row("End message (manual)", "הודעת סיום (ידנית)", "Mensaje final (manual)", "Mensagem final (manual)", "رسالة الإنهاء (يدوية)"),
  manualReply: row("Bot reply (manual)", "תשובת הבוט (ידנית)", "Respuesta del bot (manual)", "Resposta do bot (manual)", "رد البوت (يدوي)"),
  replyPlaceholder: row("Write the reply the bot will show...", "כתבו כאן את התשובה שהבוט יציג...", "Escribe la respuesta que mostrará el bot...", "Escreva a resposta que o bot mostrará...", "اكتب الرد الذي سيعرضه البوت..."),
  askPrompt: row("Question for the visitor before they type", "שאלה לגולש לפני הכתיבה", "Pregunta al visitante antes de escribir", "Pergunta ao visitante antes de escrever", "سؤال للزائر قبل الكتابة"),
  askPlaceholder: row("Write your question or details here:", "כתבו לנו כאן את השאלה או הפרטים:", "Escribe aquí tu pregunta o los detalles:", "Escreva aqui sua pergunta ou os detalhes:", "اكتب هنا سؤالك أو التفاصيل:"),
  afterVisitor: row("Bot reply after the visitor writes", "תשובת הבוט אחרי שהגולש כתב", "Respuesta del bot después de que el visitante escriba", "Resposta do bot depois que o visitante escrever", "رد البوت بعد أن يكتب الزائر"),
  thanksPlaceholder: row("Thanks! We received your message...", "תודה! קיבלנו את ההודעה...", "¡Gracias! Recibimos tu mensaje...", "Obrigado! Recebemos sua mensagem...", "شكراً! تلقينا رسالتك..."),
  linkUrl: row("Link address", "כתובת קישור", "Dirección del enlace", "Endereço do link", "عنوان الرابط"),
  opensContact: row("Opens the contact options defined above", "פותח את אפשרויות יצירת הקשר שהוגדרו למעלה", "Abre las opciones de contacto definidas arriba", "Abre as opções de contato definidas acima", "يفتح خيارات التواصل المعرّفة أعلاه"),
  thenGo: row("Then go to a step (optional)", "ואז לעבור לשלב (אופציונלי)", "Luego ir a un paso (opcional)", "Depois ir para uma etapa (opcional)", "ثم الانتقال إلى خطوة (اختياري)"),
  newStepMessage: row("Bot message in the new step...", "הודעת הבוט בשלב החדש...", "Mensaje del bot en el nuevo paso...", "Mensagem do bot na nova etapa...", "رسالة البوت في الخطوة الجديدة..."),
  noNext: row("No step change", "בלי מעבר לשלב", "Sin cambio de paso", "Sem mudança de etapa", "بدون تغيير الخطوة"),
  createStep: row("+ Create a new step", "+ צור שלב חדש", "+ Crear un paso nuevo", "+ Criar uma nova etapa", "+ إنشاء خطوة جديدة"),
  addStep: row("Add a step to the conversation tree", "הוסף שלב לעץ השיחה", "Añadir un paso al árbol", "Adicionar uma etapa à árvore", "إضافة خطوة إلى شجرة المحادثة"),
  actionNext: row("Go to a step", "מעבר לשלב", "Ir a un paso", "Ir para uma etapa", "الانتقال إلى خطوة"),
  actionReply: row("Manual reply (text)", "תשובה ידנית (טקסט)", "Respuesta manual (texto)", "Resposta manual (texto)", "رد يدوي (نص)"),
  actionAsk: row("Free reply from the visitor", "תשובה חופשית מהגולש", "Respuesta libre del visitante", "Resposta livre do visitante", "رد حر من الزائر"),
  actionContact: row("Contact", "יצירת קשר", "Contacto", "Contato", "تواصل"),
  actionEnd: row("End conversation", "סיום שיחה", "Terminar conversación", "Encerrar conversa", "إنهاء المحادثة"),
  actionLink: row("Open a link", "פתיחת קישור", "Abrir un enlace", "Abrir um link", "فتح رابط"),
};

const LINK_MODAL = {
  defaultLabel: row("Link", "קישור", "Enlace", "Link", "رابط"),
  mapsPreview: row("Google Maps · business address", "Google Maps · כתובת העסק", "Google Maps · dirección del negocio", "Google Maps · endereço do negócio", "Google Maps · عنوان العمل"),
  noLink: row("No link set yet", "לא הוגדר עדיין קישור", "Aún no hay enlace", "Ainda sem link", "لم يُحدَّد رابط بعد"),
  ariaEdit: row("Edit link", "עריכת קישור", "Editar enlace", "Editar link", "تعديل الرابط"),
  title: row("Add a link", "הוספת קישור", "Añadir enlace", "Adicionar link", "إضافة رابط"),
  close: row("Close", "סגירה", "Cerrar", "Fechar", "إغلاق"),
  pickPage: row("Choose a site page", "בחרי עמוד מהאתר", "Elige una página del sitio", "Escolha uma página do site", "اختر صفحة من الموقع"),
  noPages: row("No pages available", "אין עמודים זמינים", "No hay páginas disponibles", "Não há páginas disponíveis", "لا توجد صفحات"),
  pickSection: row("Choose a section", "בחרי סקשן", "Elige una sección", "Escolha uma seção", "اختر قسماً"),
  noSections: row("No sections available", "אין סקשנים זמינים", "No hay secciones disponibles", "Não há seções disponíveis", "لا توجد أقسام"),
  fileUrl: row("File address", "כתובת הקובץ", "Dirección del archivo", "Endereço do arquivo", "عنوان الملف"),
  siteUrl: row("Website address", "כתובת האתר", "Dirección del sitio", "Endereço do site", "عنوان الموقع"),
  urlHint: row("You can paste a full address. If https:// is missing it is added automatically.", "ניתן להדביק כתובת מלאה. אם חסר https:// הוא יתווסף אוטומטית.", "Puedes pegar una dirección completa. Si falta https:// se añade solo.", "Você pode colar um endereço completo. Se faltar https:// ele é adicionado.", "يمكن لصق عنوان كامل. إذا نقص https:// يُضاف تلقائياً."),
  waNumber: row("WhatsApp number", "מספר וואטסאפ", "Número de WhatsApp", "Número do WhatsApp", "رقم واتساب"),
  readyMessage: row("Prepared message", "הודעה מוכנה מראש", "Mensaje preparado", "Mensagem pronta", "رسالة جاهزة"),
  messagePlaceholder: row("Hi, I would like more details...", "שלום, אשמח לקבל פרטים נוספים...", "Hola, me gustaría más detalles...", "Olá, gostaria de mais detalhes...", "مرحباً، أرغب في مزيد من التفاصيل..."),
  emailAddress: row("Email address", "כתובת אימייל", "Dirección de email", "Endereço de e-mail", "عنوان البريد"),
  subject: row("Subject", "נושא", "Asunto", "Assunto", "الموضوع"),
  subjectPlaceholder: row("Email subject", "נושא האימייל", "Asunto del email", "Assunto do e-mail", "موضوع الرسالة"),
  body: row("Message body", "תוכן הודעה", "Cuerpo del mensaje", "Corpo da mensagem", "نص الرسالة"),
  phone: row("Phone number", "מספר טלפון", "Número de teléfono", "Número de telefone", "رقم الهاتף"),
  phoneHint: row("On mobile the number opens directly in the dialer.", "במובייל המספר ייפתח ישירות בחייגן.", "En el móvil el número se abre en el marcador.", "No celular o número abre no discador.", "على الجوال يفتح الرقم مباشرة في الاتصال."),
  address: row("Business address", "כתובת העסק", "Dirección del negocio", "Endereço do negócio", "عنوان العمل"),
  addressPlaceholder: row("Street, city, country", "רחוב, עיר, מדינה", "Calle, ciudad, país", "Rua, cidade, país", "شارع، مدينة، بلد"),
  mapsHint: row("The link will open a Google Maps search.", "הקישור ייפתח בחיפוש Google Maps.", "El enlace abrirá una búsqueda de Google Maps.", "O link abrirá uma busca no Google Maps.", "سيفتح الرابط بحث Google Maps."),
  scrollWhere: row("Where should it scroll?", "לאן לגלול?", "¿Adónde desplazarse?", "Para onde rolar?", "إلى أين يتم التمرير؟"),
  pageTop: row("Top of the page", "ראש העמוד", "Inicio de la página", "Topo da página", "أعلى الصفحة"),
  pageBottom: row("Bottom of the page", "תחתית העמוד", "Final de la página", "Rodapé da página", "أسفل الصفحة"),
  preview: row("Link preview", "תצוגת הקישור", "Vista previa del enlace", "Prévia do link", "معاينة الرابط"),
  remove: row("Remove link", "הסרת קישור", "Quitar enlace", "Remover link", "إزالة الرابط"),
  cancel: row("Cancel", "ביטול", "Cancelar", "Cancelar", "إلغاء"),
  save: row("Save link", "שמירת קישור", "Guardar enlace", "Salvar link", "حفظ الرابط"),
  tabs: {
    web: { label: row("Web", "אינטרנט", "Web", "Web", "ويب"), description: row("Website or URL", "אתר או כתובת URL", "Sitio o URL", "Site ou URL", "موقع أو عنوان URL") },
    whatsapp: { label: row("WhatsApp", "וואטסאפ", "WhatsApp", "WhatsApp", "واتساب"), description: row("Open a direct chat", "פתיחת שיחה ישירה", "Abrir un chat directo", "Abrir um chat direto", "فتح دردشة مباشرة") },
    phone: { label: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"), description: row("Tap to call", "חיוג בלחיצה", "Llamar al tocar", "Toque para ligar", "اتصال بنقرة") },
    email: { label: row("Email", "אימייל", "Email", "E-mail", "بريد"), description: row("Open a new message", "פתיחת הודעה חדשה", "Abrir un mensaje nuevo", "Abrir uma nova mensagem", "فتح رسالة جديدة") },
    page: { label: row("Page", "עמוד", "Página", "Página", "صفحة"), description: row("Another page on the site", "עמוד אחר באתר", "Otra página del sitio", "Outra página do site", "صفحة أخرى في الموقع") },
    section: { label: row("Section", "סקשן", "Sección", "Seção", "قسم"), description: row("Scroll to an area on the page", "גלילה לאזור בעמוד", "Desplazarse a una zona", "Rolar até uma área", "التمرير إلى منطقة في الصفحة") },
    document: { label: row("Document", "מסמך", "Documento", "Documento", "مستند"), description: row("PDF or a file to download", "PDF או קובץ להורדה", "PDF o archivo para descargar", "PDF ou arquivo para baixar", "PDF أو ملف للتنزيل") },
    address: { label: row("Address", "כתובת", "Dirección", "Endereço", "عنوان"), description: row("Open in maps", "פתיחה במפות", "Abrir en mapas", "Abrir nos mapas", "فتح في الخرائط") },
    anchor: { label: row("Top / bottom", "ראש / תחתית", "Inicio / final", "Topo / rodapé", "أعلى / أسفل"), description: row("Quick in-page navigation", "ניווט מהיר בעמוד", "Navegación rápida en la página", "Navegação rápida na página", "تنقل سريع داخل الصفحة") },
  },
};

const LOTTIE = {
  all: row("All", "הכול", "Todo", "Tudo", "الكل"),
  business: row("Business", "עסקים", "Negocios", "Negócios", "أعمال"),
  commerce: row("Stores", "חנויות", "Tiendas", "Lojas", "متاجر"),
  communication: row("Contact", "יצירת קשר", "Contacto", "Contato", "تواصل"),
  success: row("Success", "הצלחה", "Éxito", "Sucesso", "نجاح"),
  decorative: row("Decorative", "דקורטיבי", "Decorativo", "Decorativo", "زخرفي"),
  forward: row("Forward", "קדימה", "Adelante", "Avançar", "للأمام"),
  reverse: row("Reverse", "אחורה", "Atrás", "Voltar", "للخلف"),
  bounce: row("Forward and back", "קדימה ואחורה", "Adelante y atrás", "Vai e volta", "أمام ورجوع"),
  reverseBounce: row("Back and forward", "אחורה וקדימה", "Atrás y adelante", "Volta e vai", "رجوع وأمام"),
  search: row("Search an animation in Hebrew or English...", "חיפוש אנימציה בעברית או באנגלית...", "Busca una animación en hebreo o inglés...", "Busque uma animação em hebraico ou inglês...", "ابحث عن رسوم بالعبرية أو الإنجليزية..."),
  upload: row("Upload JSON / Lottie", "העלאת JSON / Lottie", "Subir JSON / Lottie", "Enviar JSON / Lottie", "رفع JSON / Lottie"),
  addFromUrl: row("Add from URL", "הוספה מקישור", "Añadir desde URL", "Adicionar por URL", "إضافة من رابط"),
  autoplay: row("Autoplay", "הפעלה אוטומטית", "Reproducción automática", "Reprodução automática", "تشغيل تلقائي"),
  loop: row("Loop", "לולאה", "Bucle", "Loop", "تكرار"),
  hover: row("Play on hover", "הפעלה ב־Hover", "Reproducir al pasar", "Reproduzir ao passar", "تشغيل عند التحويم"),
  playback: row("Playback mode", "מצב ניגון", "Modo de reproducción", "Modo de reprodução", "وضع التشغيل"),
  speed: row("Speed: {{value}}×", "מהירות: {{value}}×", "Velocidad: {{value}}×", "Velocidade: {{value}}×", "السرعة: {{value}}×"),
  size: row("Size: {{value}}px", "גודל: {{value}}px", "Tamaño: {{value}}px", "Tamanho: {{value}}px", "الحجم: {{value}}px"),
  subtitle: row("Vector Lottie animations with a transparent background", "אנימציות Lottie וקטוריות עם רקע שקוף", "Animaciones Lottie vectoriales con fondo transparente", "Animações Lottie vetoriais com fundo transparente", "رسوم Lottie متجهة بخلفية شفافة"),
  count: row("{{count}} animations", "{{count}} אנימציות", "{{count}} animaciones", "{{count}} animações", "{{count}} رسوم"),
  uploadBadge: row("Upload", "העלאה", "Subida", "Envio", "رفع"),
  urlBadge: row("Link", "קישור", "Enlace", "Link", "رابط"),
  adding: row("Adding to the page...", "מוסיף לעמוד...", "Añadiendo a la página...", "Adicionando à página...", "جارٍ الإضافة إلى الصفحة..."),
  addToPage: row("Add to page", "הוספה לעמוד", "Añadir a la página", "Adicionar à página", "إضافة إلى الصفحة"),
  empty: row("No animations found", "לא נמצאו אנימציות", "No se encontraron animaciones", "Nenhuma animação encontrada", "لم يتم العثور على رسوم"),
  emptyHint: row("Try another search, switch to All, or upload a JSON / Lottie file", "נסו חיפוש אחר, עברו לקטגוריית הכול או העלו קובץ JSON / Lottie", "Prueba otra búsqueda, ve a Todo o sube un JSON / Lottie", "Tente outra busca, vá para Tudo ou envie um JSON / Lottie", "جرّب بحثاً آخر أو انتقل إلى الكل أو ارفع ملف JSON / Lottie"),
  readFailed: row("Could not read the animation file", "לא ניתן היה לקרוא את קובץ האנימציה", "No se pudo leer el archivo de animación", "Não foi possível ler o arquivo de animação", "تعذّر قراءة ملف الرسوم"),
  noAddHtml: row("The editor has no function to add HTML. Connect onAddHtml or editor.addHtml.", "לא נמצאה בעורך פונקציה להוספת HTML. צריך לחבר onAddHtml או editor.addHtml.", "El editor no tiene función para añadir HTML.", "O editor não tem função para adicionar HTML.", "لا توجد في المحرر دالة لإضافة HTML."),
  htmlFailed: row("Could not create an HTML element on the canvas", "לא ניתן היה ליצור אלמנט HTML בקנבס", "No se pudo crear un elemento HTML en el lienzo", "Não foi possível criar um elemento HTML na tela", "تعذّر إنشاء عنصر HTML على اللوحة"),
  badFile: row("{{name}} is not a valid JSON or Lottie file", "הקובץ {{name}} אינו קובץ JSON או Lottie תקין", "{{name}} no es un JSON o Lottie válido", "{{name}} não é um JSON ou Lottie válido", "{{name}} ليس ملف JSON أو Lottie صالحاً"),
  tooBig: row("{{name}} is too large. The maximum size is 4MB", "הקובץ {{name}} גדול מדי. הגודל המרבי הוא 4MB", "{{name}} es demasiado grande. El máximo es 4MB", "{{name}} é grande demais. O máximo é 4MB", "{{name}} كبير جداً. الحد الأقصى 4MB"),
  badJson: row("The JSON file {{name}} is not valid", "קובץ ה־JSON {{name}} אינו תקין", "El JSON {{name}} no es válido", "O JSON {{name}} não é válido", "ملف JSON {{name}} غير صالح"),
  uploadedDesc: row("Animation uploaded from this computer", "אנימציה שהועלתה מהמחשב", "Animación subida desde este ordenador", "Animação enviada deste computador", "رسوم مرفوعة من هذا الجهاز"),
  uploadedDot: row("dotLottie file uploaded from this computer", "קובץ dotLottie שהועלה מהמחשב", "Archivo dotLottie subido desde este ordenador", "Arquivo dotLottie enviado deste computador", "ملف dotLottie مرفوع من هذا الجهاز"),
  addedLocal: row("{{count}} animations were added to the local library", "{{count}} אנימציות נוספו למאגר המקומי", "Se añadieron {{count}} animaciones a la biblioteca local", "{{count}} animações foram adicionadas à biblioteca local", "أُضيفت {{count}} رسوم إلى المكتبة المحلية"),
  pasteUrl: row("Paste a link to a JSON or Lottie file", "הדביקו קישור לקובץ JSON או Lottie", "Pega un enlace a un JSON o Lottie", "Cole um link para um JSON ou Lottie", "الصق رابطاً لملف JSON أو Lottie"),
  badUrl: row("The link you entered is not valid", "הקישור שהוזן אינו תקין", "El enlace no es válido", "O link não é válido", "الرابط غير صالح"),
  httpOnly: row("Only HTTP or HTTPS links can be added", "אפשר להוסיף רק קישור HTTP או HTTPS", "Solo se pueden añadir enlaces HTTP o HTTPS", "Só é possível adicionar links HTTP ou HTTPS", "يمكن إضافة روابط HTTP أو HTTPS فقط"),
  urlDesc: row("Animation from an external link", "אנימציה מקישור חיצוני", "Animación desde un enlace externo", "Animação de um link externo", "رسوم من رابط خارجي"),
  urlAdded: row("The animation from the link was added to the gallery", "האנימציה מהקישור נוספה לתצוגה", "La animación del enlace se añadió a la galería", "A animação do link foi adicionada à galeria", "أُضيفت الرسوم من الرابط إلى المعرض"),
  noSource: row("No valid animation source was found", "לא נמצא מקור תקין לאנימציה", "No se encontró un origen de animación válido", "Nenhuma origem de animação válida", "لم يتم العثور على مصدر رسوم صالح"),
  addedPage: row("{{title}} was added to the page", "{{title}} נוספה לעמוד", "{{title}} se añadió a la página", "{{title}} foi adicionada à página", "أُضيف {{title}} إلى الصفحة"),
  addFailed: row("Adding the animation failed", "הוספת האנימציה נכשלה", "No se pudo añadir la animación", "Falha ao adicionar a animação", "فشلت إضافة الرسوم"),
};

const PORTAL_VARS = {
  types: {
    text: row("Short text", "טקסט קצר", "Texto corto", "Texto curto", "نص قصير"),
    textarea: row("Long text", "טקסט ארוך", "Texto largo", "Texto longo", "نص طويل"),
    number: row("Number", "מספר", "Número", "Número", "رقم"),
    date: row("Date", "תאריך", "Fecha", "Data", "تاريخ"),
    checkbox: row("Checkbox", "צ׳קבוקס", "Casilla", "Caixa de seleção", "مربع اختيار"),
    checklist: row("Checklist", "רשימת סימון", "Lista de comprobación", "Lista de verificação", "قائمة تحقق"),
    status: row("Status", "סטטוס", "Estado", "Status", "حالة"),
    file: row("File", "קובץ", "Archivo", "Arquivo", "ملف"),
    image: row("Image", "תמונה", "Imagen", "Imagem", "صورة"),
    email: row("Email", "מייל", "Email", "E-mail", "بريد"),
    phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  },
  sources: {
    business_input: row("Filled by the business", "העסק ממלא", "Lo rellena el negocio", "Preenchido pelo negócio", "يملأه العمل"),
    client_input: row("Filled by the customer", "הלקוח ממלא", "Lo rellena el cliente", "Preenchido pelo cliente", "يملأه العميل"),
    crm_client: row("From the customer file", "נמשך מתיק הלקוח", "Desde el expediente del cliente", "Do prontuário do cliente", "من ملف العميل"),
    appointments: row("From appointments", "נמשך מפגישות", "Desde las citas", "Dos agendamentos", "من المواعيد"),
    payments: row("From payments", "נמשך מתשלומים", "Desde los pagos", "Dos pagamentos", "من المدفوعات"),
    tasks: row("From tasks", "נמשך ממשימות", "Desde las tareas", "Das tarefas", "من المهام"),
    files: row("From files", "נמשך מקבצים", "Desde los archivos", "Dos arquivos", "من الملفات"),
    custom: row("Custom", "מותאם אישית", "Personalizado", "Personalizado", "مخصص"),
  },
};

const PLUGIN_ACTIONS = {
  fallback: {
    label: row("Plugin settings", "הגדרות תוסף", "Ajustes del plugin", "Configurações do plugin", "إعدادات الإضافة"),
    description: row("Managed in the panel — not a canvas element", "ניהול בפאנל — לא רכיב שנגרר לעמוד", "Se gestiona en el panel — no es un elemento del lienzo", "Gerenciado no painel — não é um elemento da tela", "يُدار في اللوحة — ليس عنصراً على اللوحة"),
  },
  "benefits-wheel": {
    label: row("Floating benefits wheel", "גלגל הטבות צף", "Ruleta flotante", "Roda flutuante", "عجلة مزايا عائمة"),
    description: row("Modal + floating button — not a page section", "מודאל + כפתור צף — לא סקשן בעמוד", "Modal + botón flotante — no es una sección", "Modal + botão flutuante — não é uma seção", "نافذة + زر عائم — ليس قسماً"),
  },
  "smart-search": {
    label: row("Search button", "כפתור חיפוש", "Botón de búsqueda", "Botão de busca", "زر بحث"),
    description: row("A click opens the site search bar", "לחיצה פותחת שורת חיפוש באתר", "Un clic abre la barra de búsqueda", "Um clique abre a barra de busca", "نقرة تفتح شريط البحث"),
  },
  accessibility: {
    label: row("Accessibility menu", "תפריט נגישות", "Menú de accesibilidad", "Menu de acessibilidade", "قائمة إمكانية الوصول"),
    description: row("Floating button + BizUply accessibility menu — no UserWay", "כפתור צף + תפריט נגישות מקצועי של BizUply — ללא UserWay", "Botón flotante + menú de accesibilidad de BizUply — sin UserWay", "Botão flutuante + menu de acessibilidade da BizUply — sem UserWay", "زر عائم + قائمة إمكانية الوصول من BizUply — بدون UserWay"),
  },
  "smart-bot": {
    label: row("Floating smart bot", "בוט חכם צף", "Bot inteligente flotante", "Bot inteligente flutuante", "بوت ذكي عائم"),
    description: row("Floating button that opens a chat — not an on-page widget", "כפתור צף שפותח חלון שיחה — לא רכיב בעמוד", "Botón flotante que abre un chat — no es un widget de página", "Botão flutuante que abre um chat — não é um widget da página", "زر عائم يفتح دردشة — ليس عنصراً في الصفحة"),
  },
  "whatsapp-float": {
    label: row("Floating WhatsApp button", "כפתור WhatsApp צף", "Botón flotante de WhatsApp", "Botão flutuante do WhatsApp", "زر واتساب عائم"),
    description: row("Fixed green button in the corner — not an on-page widget", "כפתור ירוק קבוע בפינה — לא רכיב בעמוד", "Botón verde fijo en la esquina — no es un widget de página", "Botão verde fixo no canto — não é um widget da página", "زر أخضر ثابت في الزاوية — ليس عنصراً في الصفحة"),
  },
  "announcement-bar": {
    label: row("Announcement bar", "פס הודעות", "Barra de anuncios", "Barra de avisos", "شريط الإعلانات"),
    description: row("Top bar on every page — not a section", "פס עליון בכל האתר — לא סקשן בעמוד", "Barra superior en todo el sitio — no es una sección", "Barra superior em todo o site — não é uma seção", "شريط علوي في كل الموقع — ليس قسماً"),
  },
  "cookie-banner": {
    label: row("Cookie banner", "באנר עוגיות", "Banner de cookies", "Banner de cookies", "لافتة ملفات تعريف"),
    description: row("Consent banner at the bottom — not an on-page widget", "באנר הסכמה בתחתית האתר — לא רכיב בעמוד", "Banner de consentimiento abajo — no es un widget de página", "Banner de consentimento embaixo — não é um widget da página", "لافتة موافقة في الأسفل — ليست عنصراً في الصفحة"),
  },
  "exit-popup": {
    label: row("Exit popup", "פופאפ יציאה", "Popup de salida", "Popup de saída", "نافذة خروج"),
    description: row("Lead window on exit or after a delay — not a section", "חלון לידים ביציאה או אחרי השהיה — לא סקשן בעמוד", "Ventana de leads al salir o tras una espera — no es una sección", "Janela de leads na saída ou após espera — não é uma seção", "نافذة عملاء عند الخروج أو بعد تأخير — ليست قسماً"),
  },
  "multi-language": {
    label: row("Language switcher", "מחליף שפה", "Selector de idioma", "Seletor de idioma", "مبدّل اللغة"),
    description: row("Floating language button — not a canvas element", "כפתור שפה צף בכל האתר — לא רכיב שנגרר לעמוד", "Botón de idioma flotante — no es un elemento del lienzo", "Botão de idioma flutuante — não é um elemento da tela", "زر لغة عائم — ليس عنصراً يُسحب إلى الصفحة"),
  },
  "social-proof": {
    label: row("Social proof", "הוכחה חברתית", "Prueba social", "Prova social", "دليل اجتماعي"),
    description: row("Floating conversion toasts — not a canvas element", "התראות המרה צפות — לא רכיב שנגרר לעמוד", "Avisos de conversión flotantes — no es un elemento del lienzo", "Toasts de conversão flutuantes — não é um elemento da tela", "تنبيهات تحويل عائمة — ليست عنصراً يُسحب إلى الصفحة"),
  },
  "floating-contact-bar": {
    label: row("Contact bar", "סרגל יצירת קשר", "Barra de contacto", "Barra de contato", "شريط التواصل"),
    description: row("Site-wide floating bar — not a canvas element", "סרגל צף בכל האתר — לא רכיב שנגרר לעמוד", "Barra flotante en todo el sitio — no es un elemento del lienzo", "Barra flutuante em todo o site — não é um elemento da tela", "شريط عائم في كل الموقع — ليس عنصراً يُسحب إلى الصفحة"),
  },
  "faq-pro": {
    label: row("FAQ Pro", "FAQ Pro", "FAQ Pro", "FAQ Pro", "FAQ Pro"),
    description: row("FAQ widget from panel settings — not an on-page placeholder", "וידג'ט FAQ לפי הגדרות הפאנל — לא placeholder בעמוד", "Widget FAQ desde el panel — no es un marcador de página", "Widget FAQ do painel — não é um placeholder da página", "ودجة أسئلة شائعة من اللوحة — ليست طابعاً في الصفحة"),
  },
  "analytics-pro": {
    label: row("Analytics Pro", "Analytics Pro", "Analytics Pro", "Analytics Pro", "Analytics Pro"),
    description: row("Analytics settings in the management panel — not an editor element", "הגדרות אנליטיקה בפאנל הניהול — לא אלמנט בעורך", "Ajustes de analítica en el panel — no es un elemento del editor", "Configurações de analytics no painel — não é um elemento do editor", "إعدادات التحليلات في اللوحة — ليست عنصراً في المحرر"),
  },
  "seo-pro": {
    label: row("SEO Pro", "SEO Pro", "SEO Pro", "SEO Pro", "SEO Pro"),
    description: row("SEO audit and settings in the panel — not an editor element", "ביקורת והגדרות SEO בפאנל — לא אלמנט בעורך", "Auditoría y ajustes SEO en el panel — no es un elemento del editor", "Auditoria e ajustes de SEO no painel — não é um elemento do editor", "تدقيق وإعدادات SEO في اللوحة — ليست عنصراً في المحرر"),
  },
  "refer-a-friend": {
    label: row("Refer a friend", "חבר מביא חבר", "Recomienda a un amigo", "Indique um amigo", "إحالة صديق"),
    description: row("Referral campaign in settings — not an editor element", "קמפיין הפניות בהגדרות — לא אלמנט בעורך", "Campaña de referidos en ajustes — no es un elemento del editor", "Campanha de indicação nas configurações — não é um elemento do editor", "حملة إحالات في الإعدادات — ليست عنصراً في المحرر"),
  },
  "birthday-club": {
    label: row("Birthday club", "מועדון יום הולדת", "Club de cumpleaños", "Clube de aniversário", "نادي أعياد الميلاد"),
    description: row("CRM / automation settings in the panel — not an editor element", "הגדרות CRM/אוטומציה בפאנל — לא אלמנט בעורך", "Ajustes de CRM/automatización en el panel — no es un elemento del editor", "Configurações de CRM/automação no painel — não é um elemento do editor", "إعدادات CRM/الأتمتة في اللوحة — ليست عنصراً في المحرر"),
  },
  "form-to-pdf": {
    label: row("Form to PDF", "טופס ל-PDF", "Formulario a PDF", "Formulário para PDF", "نموذج إلى PDF"),
    description: row("PDF generation from settings — not an editor element", "הפקת PDF מהגדרות — לא אלמנט בעורך", "Generación de PDF desde ajustes — no es un elemento del editor", "Geração de PDF nas configurações — não é um elemento do editor", "إنشاء PDF من الإعدادات — ليست عنصراً في المحرر"),
  },
  "smart-forms": {
    label: row("Smart forms Pro", "טפסים חכמים Pro", "Formularios inteligentes Pro", "Formulários inteligentes Pro", "نماذج ذكية Pro"),
    description: row("Form management in the panel — not an on-page placeholder", "ניהול טפסים בפאנל — לא placeholder בעמוד", "Gestión de formularios en el panel — no es un marcador de página", "Gestão de formulários no painel — não é um placeholder da página", "إدارة النماذج في اللوحة — ليست طابعاً في الصفحة"),
  },
  "qr-generator": {
    label: row("QR Generator", "QR Generator", "Generador QR", "Gerador QR", "مولّد QR"),
    description: row("Create QR codes in the management panel — not an on-page placeholder", "יצירת QR בפאנל הניהול — לא placeholder בעמוד", "Crea QR en el panel — no es un marcador de página", "Crie QR no painel — não é um placeholder da página", "إنشاء QR في اللوحة — ليست طابعاً في الصفحة"),
  },
  store: {
    label: row("Products / store page", "עמוד מוצרים / חנות", "Página de productos / tienda", "Página de produtos / loja", "صفحة منتجات / متجر"),
    description: row("Syncs automatically with store products", "מתסנכרן אוטומטית עם מוצרי החנות", "Se sincroniza automáticamente con los productos", "Sincroniza automaticamente com os produtos", "يتزامن تلقائياً مع منتجات المتجر"),
  },
  "client-portal": {
    label: row("Personal area", "אזור אישי", "Área personal", "Área pessoal", "منطقة شخصية"),
    description: row("Adds login, signup, and account pages for site customers", "מוסיף עמודי התחברות, הרשמה וחשבון ללקוחות האתר", "Añade páginas de acceso, registro y cuenta", "Adiciona páginas de login, cadastro e conta", "يضيف صفحات دخول وتسجيل وحساب لعملاء الموقع"),
  },
  "testimonials-carousel": { label: row("Testimonials carousel", "קרוסלת המלצות", "Carrusel de testimonios", "Carrossel de depoimentos", "شريط شهادات") },
  "pricing-table": { label: row("Pricing table", "טבלת מחירים", "Tabla de precios", "Tabela de preços", "جدول أسعار") },
  timeline: { label: row("Timeline", "ציר זמן", "Línea de tiempo", "Linha do tempo", "خط زمني") },
  tabs: { label: row("Tabs / services", "טאבים / שירותים", "Pestañas / servicios", "Abas / serviços", "تبويبات / خدمات") },
  "logo-carousel": { label: row("Logo carousel", "קרוסלת לוגואים", "Carrusel de logos", "Carrossel de logos", "شريط شعارات") },
  "events-calendar": { label: row("Events page", "עמוד אירועים", "Página de eventos", "Página de eventos", "صفحة فعاليات") },
  "whatsapp-catalog": {
    label: row("Product catalog", "קטלוג מוצרים", "Catálogo de productos", "Catálogo de produtos", "كتالوج منتجات"),
    description: row("Order on WhatsApp", "הזמנה ב-WhatsApp", "Pedido por WhatsApp", "Pedido no WhatsApp", "طلب عبر واتساب"),
  },
  "digital-menu": { label: row("Digital menu", "תפריט דיגיטלי", "Menú digital", "Cardápio digital", "قائمة رقمية") },
  "multi-step-form": { label: row("Multi-step form", "טופס רב-שלבי", "Formulario por pasos", "Formulário em etapas", "نموذج متعدد الخطوات") },
  "customer-counter": { label: row("Customer counter", "מונה לקוחות", "Contador de clientes", "Contador de clientes", "عداد العملاء") },
  "google-maps": { label: row("Map + contact", "מפה + יצירת קשר", "Mapa + contacto", "Mapa + contato", "خريطة + تواصل") },
  countdown: {
    label: row("Countdown", "ספירה לאחור", "Cuenta atrás", "Contagem regressiva", "عد تنازלי"),
    description: row("Live timer — add it to the page from Plugins", "טיימר חי — מוסיפים לעמוד דרך תוספים", "Temporizador en vivo — añádelo desde Plugins", "Temporizador ao vivo — adicione em Plugins", "مؤقت حي — أضفه من الإضافات"),
  },
};

const PLUGINS_ADD = {
  noneInstalled: row("No plugins installed", "אין תוספים מותקנים", "No hay plugins instalados", "Nenhum plugin instalado", "لا توجد إضافات مثبتة"),
  installHint: row("Install plugins from the management panel → Plugin store, then come back here", "התקינו תוספים מפאנל הניהול → חנות תוספים, ואז חזרו לכאן", "Instala plugins desde el panel → Tienda de plugins y vuelve aquí", "Instale plugins no painel → Loja de plugins e volte aqui", "ثبّت الإضافات من لوحة الإدارة → متجر الإضافات ثم عد إلى هنا"),
  search: row("Search a plugin...", "חיפוש תוסף...", "Busca un plugin...", "Busque um plugin...", "ابحث عن إضافة..."),
  installedCount: row(
    "{{count}} installed plugins — floating plugins go live immediately; click Add for on-page sections",
    "{{count}} תוספים מותקנים — תוספים צפים פעילים מיד; לחצו «הוספה» לסקשנים בעמוד",
    "{{count}} plugins instalados — los flotantes se activan al instante; pulsa Añadir para secciones",
    "{{count}} plugins instalados — os flutuantes ficam ativos na hora; clique Adicionar para seções",
    "{{count}} إضافات مثبتة — العائمة تعمل فوراً؛ انقر إضافة للأقسام في الصفحة"
  ),
  title: row("Plugins", "תוספים", "Plugins", "Plugins", "إضافات"),
  saveFirst: row("Save the site to add plugins from the editor", "שמרו את האתר כדי להוסיף תוספים מהעורך", "Guarda el sitio para añadir plugins desde el editor", "Salve o site para adicionar plugins pelo editor", "احفظ الموقع لإضافة إضافات من المحرر"),
  loading: row("Loading plugins...", "טוען תוספים...", "Cargando plugins...", "Carregando plugins...", "جارٍ تحميل الإضافات..."),
  activeEditor: row("Active in the editor and on the site", "פעיל בעורך ובאתר", "Activo en el editor y en el sitio", "Ativo no editor e no site", "نشط في المحرر والموقع"),
  waiting: row("Waiting to activate", "ממתין להפעלה", "Esperando activación", "Aguardando ativação", "بانتظار التفعيل"),
  activePage: row("Active on the current page", "פעיל בעמוד הנוכחי", "Activo en la página actual", "Ativo na página atual", "نشط في الصفحة الحالية"),
  addPage: row("Add page", "הוספת עמוד", "Añadir página", "Adicionar página", "إضافة صفحة"),
  addSection: row("Add section to the page", "הוספת סקשן לעמוד", "Añadir sección a la página", "Adicionar seção à página", "إضافة قسم إلى الصفحة"),
  settings: row("Settings in the panel", "הגדרות בפאנל", "Ajustes en el panel", "Configurações no painel", "إعدادات في اللوحة"),
  addWidget: row("Add component", "הוספת רכיב", "Añadir componente", "Adicionar componente", "إضافة عنصر"),
  remove: row("Remove from site", "הסרה מהאתר", "Quitar del sitio", "Remover do site", "إزالة من الموقع"),
  refresh: row("Refresh", "רענון", "Actualizar", "Atualizar", "تحديث"),
  activate: row("Activate in the editor", "הפעלה בעורך", "Activar en el editor", "Ativar no editor", "تفعيل في المحرر"),
  openSettings: row("Open settings", "פתח הגדרות", "Abrir ajustes", "Abrir configurações", "فتح الإعدادات"),
  addAgain: row("Add again", "הוספה שוב", "Añadir de nuevo", "Adicionar de novo", "إضافة مرة أخرى"),
  addAndOpen: row("Add and open in the editor", "הוספה ופתיחה בעורך", "Añadir y abrir en el editor", "Adicionar e abrir no editor", "إضافة وفتح في المحرر"),
  noneFound: row("No plugins match the search", "לא נמצאו תוספים לחיפוש", "Ningún plugin coincide con la búsqueda", "Nenhum plugin corresponde à busca", "لا توجد إضافات مطابقة للبحث"),
  activatedWa: row("«{{name}}» is on — enter a WhatsApp number in the plugin management panel", "«{{name}}» הופעל — הזינו מספר WhatsApp בפאנל הניהול של התוסף", "«{{name}}» está activo — introduce un WhatsApp en el panel", "«{{name}}» está ativo — informe um WhatsApp no painel", "«{{name}}» مفعّل — أدخل رقم واتساب في لوحة الإدارة"),
  activated: row("«{{name}}» is active in the editor and on the site", "«{{name}}» פעיל בעורך ובאתר", "«{{name}}» está activo en el editor y en el sitio", "«{{name}}» está ativo no editor e no site", "«{{name}}» نشط في المحرر والموقع"),
  activateFailed: row("Could not activate {{name}}", "שגיאה בהפעלת {{name}}", "No se pudo activar {{name}}", "Não foi possível ativar {{name}}", "تعذّر تفعيل {{name}}"),
  removeConfirm: row("Remove «{{name}}» from the site completely?\nThe plugin will also be removed from settings and the plugin store.", "להסיר את «{{name}}» מהאתר לגמרי?\nהתוסף יוסר גם מהגדרות ומחנות התוספים.", "¿Quitar «{{name}}» del sitio por completo?\nTambién se quitará de ajustes y de la tienda.", "Remover «{{name}}» do site por completo?\nO plugin também sairá das configurações e da loja.", "إزالة «{{name}}» من الموقع بالكامل؟\nستُزال الإضافة أيضاً من الإعدادات ومتجر الإضافات."),
  removed: row("«{{name}}» was removed from the site", "«{{name}}» הוסר מהאתר", "Se quitó «{{name}}» del sitio", "«{{name}}» foi removido do site", "أُزيل «{{name}}» من الموقع"),
  removeFailed: row("Could not remove {{name}}", "שגיאה בהסרת {{name}}", "No se pudo quitar {{name}}", "Não foi possível remover {{name}}", "تعذّرت إزالة {{name}}"),
  managed: row("«{{name}}» is managed in the panel settings — it is not added as a page component", "«{{name}}» מנוהל בהגדרות הפאנל — לא מתווסף כרכיב לעמוד", "«{{name}}» se gestiona en el panel — no se añade como componente", "«{{name}}» é gerenciado no painel — não é adicionado como componente", "«{{name}}» يُدار في إعدادات اللوحة — لا يُضاف كعنصر صفحة"),
  settingsFailed: row("Could not open settings for {{name}}", "שגיאה בפתיחת הגדרות {{name}}", "No se pudieron abrir los ajustes de {{name}}", "Não foi possível abrir as configurações de {{name}}", "تعذّر فتح إعدادات {{name}}"),
  pagesAdded: row("{{count}} pages were added — {{name}} is active", "נוספו {{count}} עמודים — {{name}} פעיל", "Se añadieron {{count}} páginas — {{name}} está activo", "{{count}} páginas foram adicionadas — {{name}} está ativo", "أُضيفت {{count}} صفحات — {{name}} نشط"),
  pageAdded: row("Page «{{title}}» was added — {{name}} is active", "עמוד «{{title}}» נוסף — {{name}} פעיל", "Se añadió la página «{{title}}» — {{name}} está activo", "A página «{{title}}» foi adicionada — {{name}} está ativo", "أُضيفت الصفحة «{{title}}» — {{name}} نشط"),
  addedBottom: row("«{{name}}» was added at the bottom of the page — scroll to see the section", "«{{name}}» נוסף בתחתית העמוד — גללו לראות את הסקשן", "«{{name}}» se añadió al final — desplázate para verlo", "«{{name}}» foi adicionado no final — role para ver", "أُضيف «{{name}}» أسفل الصفحة — مرّر لرؤية القسم"),
  savedHint: row("«{{name}}» was saved; add it through a matching section", "«{{name}}» — נשמר; הוסיפו דרך סקשן מתאים", "«{{name}}» se guardó; añádelo desde una sección adecuada", "«{{name}}» foi salvo; adicione por uma seção adequada", "حُفظ «{{name}}»؛ أضفه عبر قسم مناسب"),
  addedActive: row("«{{name}}» was added and is active on the page", "«{{name}}» נוסף ופעיל בעמוד", "«{{name}}» se añadió y está activo en la página", "«{{name}}» foi adicionado e está ativo na página", "أُضيف «{{name}}» وهو نشط في الصفحة"),
};

const FAQ_TROUBLE = {
  title: row("Troubleshooting and errors — FAQ", "פתרון תקלות ושגיאות – שאלות נפוצות", "Solución de problemas y errores — FAQ", "Solução de problemas e erros — FAQ", "استكشاف الأخطاء والأعطال — أسئلة شائعة"),
  items: {
    notLoading: {
      question: row("The system does not load — what should I do?", "המערכת לא נטענת — מה לעשות", "El sistema no carga — ¿qué hago?", "O sistema não carrega — o que fazer?", "النظام لا يحمّل — ماذا أفعل؟"),
      answer: row(
        "When the system does not load, follow these steps in order:\n\n1. Check the internet connection: make sure the device is connected and the signal is stable. Try opening another site.\n2. Refresh the page: press F5 (Windows) or Cmd + R (Mac).\n3. Clear the browser cache: Chrome → Settings → Privacy and security → Clear browsing data. Select cached images/files and cookies, then clear.\n4. Sign out and sign back in: wait 2–3 minutes before signing in again.\n5. Try another browser or device: Firefox, Edge, Safari, or a different device.\n6. Disable extensions: temporarily turn off ad blockers or security add-ons.\n\nIf the issue continues, contact support with screenshots and browser/OS details.",
        "כשהמערכת לא נטענת, בצעו את הצעדים הבאים לפי הסדר:\n\n1. בדקו את חיבור האינטרנט: ודאו שהמכשיר מחובר והאות יציב. נסו לפתוח אתר אחר.\n2. רעננו את הדף: לחצו F5 (Windows) או Cmd + R (Mac).\n3. נקו מטמון דפדפן: Chrome: הגדרות → פרטיות ואבטחה → ניקוי נתוני גלישה. סמנו תמונות וקבצים במטמון ועוגיות, ואז נקו.\n4. התנתקו והתחברו מחדש: המתינו 2–3 דקות לפני ההתחברות מחדש.\n5. נסו דפדפן או מכשיר אחר: Firefox, Edge, Safari או מכשיר שונה.\n6. השביתו תוספים: השביתו זמנית חוסמי פרסומות או תוספי אבטחה.\n\nאם הבעיה נמשכת, פנו לתמיכה עם צילומי מסך ופרטי דפדפן/מערכת הפעלה.",
        "Si el sistema no carga, sigue estos pasos en orden:\n\n1. Comprueba la conexión a internet y prueba otro sitio.\n2. Actualiza la página: F5 (Windows) o Cmd + R (Mac).\n3. Borra la caché del navegador (imágenes/archivos en caché y cookies).\n4. Cierra sesión y vuelve a entrar tras 2–3 minutos.\n5. Prueba otro navegador o dispositivo.\n6. Desactiva extensiones de bloqueo o seguridad.\n\nSi continúa, contacta a soporte con capturas y datos del navegador/SO.",
        "Se o sistema não carregar, siga estes passos:\n\n1. Verifique a internet e tente outro site.\n2. Atualize a página: F5 (Windows) ou Cmd + R (Mac).\n3. Limpe o cache do navegador (imagens/arquivos e cookies).\n4. Saia e entre de novo após 2–3 minutos.\n5. Tente outro navegador ou dispositivo.\n6. Desative extensões de bloqueio ou segurança.\n\nSe continuar, fale com o suporte com prints e dados do navegador/SO.",
        "عندما لا يحمّل النظام اتبع هذه الخطوات بالترتيب:\n\n1. تحقق من الاتصال وجرّب موقعاً آخر.\n2. حدّث الصفحة: F5 (Windows) أو Cmd + R (Mac).\n3. امسح ذاكرة المتصفح (الصور/الملفات المخزنة والكوكيز).\n4. سجّل الخروج ثم الدخول بعد 2–3 دقائق.\n5. جرّب متصفحاً أو جهازاً آخر.\n6. عطّل الإضافات الحاجبة أو الأمنية مؤقتاً.\n\nإذا استمرت المشكلة تواصل مع الدعم مع لقطات وتفاصيل المتصفح/نظام التشغيل."
      ),
    },
    server500: {
      question: row("I got a 500 server error — what should I do?", "קיבלתי שגיאת שרת 500 — מה לעשות", "Recibí un error 500 — ¿qué hago?", "Recebi um erro 500 — o que fazer?", "ظهرت خطأ خادم 500 — ماذا أفعل؟"),
      answer: row(
        "A 500 error means a server-side problem. Try:\n\n1. Refresh the page.\n2. Clear cache and cookies.\n3. Wait a few minutes and try again.\n4. Check from another browser or device.\n5. Disable extensions that block content.\n\nIf it continues, contact support with screenshots, the time it happened, and browser/OS details.",
        "שגיאת 500 מציינת בעיה בצד השרת. נסו:\n\n1. רעננו את הדף.\n2. נקו מטמון ועוגיות.\n3. המתינו מספר דקות ונסו שוב.\n4. בדקו מדפדפן או מכשיר אחר.\n5. השביתו תוספים שחוסמים תוכן.\n\nאם השגיאה נמשכת, פנו לתמיכה עם צילומי מסך, שעת ההופעה ופרטי דפדפן/מערכת הפעלה.",
        "Un error 500 indica un problema en el servidor. Prueba actualizar, borrar caché, esperar unos minutos, otro navegador y desactivar extensiones. Si sigue, contacta a soporte con capturas y la hora.",
        "Um erro 500 indica problema no servidor. Atualize, limpe o cache, aguarde alguns minutos, tente outro navegador e desative extensões. Se continuar, fale com o suporte com prints e o horário.",
        "خطأ 500 يعني مشكلة في الخادم. حدّث الصفحة وامسح الذاكرة وانتظر دقائق وجرّب متصفحاً آخر وعطّل الإضافات. إذا استمر تواصل مع الدعم مع لقطات والوقت."
      ),
    },
    cannotLogin: {
      question: row("I cannot sign in — what can I do?", "אני לא מצליח להתחבר לחשבון — מה אפשר לעשות", "No puedo iniciar sesión — ¿qué puedo hacer?", "Não consigo entrar — o que posso fazer?", "لا أستطيع تسجيل الدخول — ماذا يمكنني فعله؟"),
      answer: row(
        "If you cannot sign in:\n\n1. Check the username/password and keyboard language.\n2. Use Forgot password.\n3. Check spam for the reset email.\n4. Wait 15 minutes if the account was locked temporarily.\n5. Try incognito mode or another browser.\n\nIf sign-in still fails, contact support with the account details.",
        "אם לא ניתן להתחבר:\n\n1. ודאו שם משתמש/סיסמה ושפת מקלדת.\n2. השתמשו באפשרות שכחתי סיסמה.\n3. בדקו תיקיית ספאם לדוא\"ל איפוס.\n4. המתינו 15 דקות אם החשבון ננעל זמנית.\n5. נסו מצב incognito או דפדפן אחר.\n\nאם ההתחברות עדיין נכשלת, פנו לתמיכה עם פרטי החשבון.",
        "Si no puedes entrar: revisa usuario/contraseña e idioma del teclado, usa Olvidé la contraseña, revisa spam, espera 15 minutos si hay bloqueo y prueba incógnito u otro navegador. Si sigue fallando, contacta a soporte.",
        "Se não conseguir entrar: confira usuário/senha e o idioma do teclado, use Esqueci a senha, veja o spam, aguarde 15 minutos se houver bloqueio e tente anônimo ou outro navegador. Se falhar, fale com o suporte.",
        "إذا تعذّر الدخول: تحقق من اسم المستخدم/كلمة المرور ولغة لوحة المفاتيح، استخدم نسيت كلمة المرور، راجع البريد غير المرغوب، انتظر 15 دقيقة إذا قُفل الحساب، وجرّب التصفح الخاص أو متصفحاً آخر. إذا استمر الفشل تواصل مع الدعم."
      ),
    },
    filesNotLoading: {
      question: row("Files do not load or display — what should I do?", "קבצים לא נטענים או לא מוצגים — מה לעשות", "Los archivos no cargan — ¿qué hago?", "Os arquivos não carregam — o que fazer?", "الملفات لا تُحمَّل أو لا تظهر — ماذا أفعل؟"),
      answer: row(
        "If files do not load:\n\n1. Confirm a supported format (JPG, PNG, PDF, MP4).\n2. Confirm the file is within the allowed size.\n3. Check that the file is not damaged.\n4. Refresh and try again.\n5. Try another browser or a private window.\n6. Contact support with the error details.",
        "אם קבצים לא נטענים:\n\n1. ודאו פורמט נתמך (JPG, PNG, PDF, MP4).\n2. ודאו שהקובץ בגודל המותר.\n3. בדקו שהקובץ לא פגום.\n4. רעננו את הדף ונסו שוב.\n5. נסו דפדפן אחר או מצב פרטי.\n6. פנו לתמיכה עם פרטי השגיאה.",
        "Si no cargan: confirma un formato compatible, el tamaño permitido, que el archivo no esté dañado, actualiza, prueba otro navegador o ventana privada y contacta a soporte.",
        "Se não carregarem: confirme um formato compatível, o tamanho permitido, que o arquivo não esteja danificado, atualize, tente outro navegador ou janela privada e fale com o suporte.",
        "إذا لم تُحمَّل الملفات: تأكد من صيغة مدعومة والحجم المسموح وأن الملف غير تالف، حدّث الصفحة، جرّب متصفحاً آخر أو نافذة خاصة، ثم تواصل مع الدعم."
      ),
    },
    autoLogout: {
      question: row("The system signs me out automatically — what should I do?", "המערכת מנתקת אותי אוטומטית — מה לעשות", "El sistema me cierra la sesión solo — ¿qué hago?", "O sistema me desconecta sozinho — o que fazer?", "النظام يسجّل خروجي تلقائياً — ماذا أفعل؟"),
      answer: row(
        "Unexpected sign-outs can come from:\n\n1. An unstable internet connection.\n2. Browser cache or extension conflicts.\n3. Power-saving or sleep settings.\n4. VPN or proxy interference.\n\nTry another browser or device and contact support if it continues.",
        "ניתוקים לא צפויים עלולים לנבוע מ:\n\n1. חיבור אינטרנט לא יציב.\n2. סכסוכים במטמון דפדפן או בתוספים.\n3. הגדרות חיסכון באנרגיה או שינה.\n4. הפרעה מ-VPN או proxy.\n\nנסו דפדפן/מכשיר אחר ופנו לתמיכה אם זה נמשך.",
        "Los cierres inesperados pueden deberse a internet inestable, caché o extensiones, ahorro de energía o VPN/proxy. Prueba otro navegador y contacta a soporte si continúa.",
        "Desconexões inesperadas podem vir de internet instável, cache ou extensões, economia de energia ou VPN/proxy. Tente outro navegador e fale com o suporte se continuar.",
        "قد يأتي تسجيل الخروج المفاجئ من اتصال غير مستقر أو تعارض الذاكرة/الإضافات أو توفير الطاقة أو VPN/بروكسي. جرّب متصفحاً آخر وتواصل مع الدعم إذا استمر."
      ),
    },
    reportBugs: {
      question: row("How do I report bugs in the system?", "איך מדווחים על באגים במערכת", "¿Cómo reporto errores del sistema?", "Como reporto bugs no sistema?", "كيف أبلغ عن أخطاء في النظام؟"),
      answer: row(
        "For an effective bug report:\n\n1. Describe the action that caused the issue.\n2. Attach screenshots.\n3. Include device, OS, browser, and version.\n4. Note the date and time.\n5. Send details to support@bizuply.com or open a support ticket.",
        "לדיווח יעיל על באגים:\n\n1. תארו את הפעולה שגרמה לבעיה.\n2. צרפו צילומי מסך.\n3. כללו מכשיר, מערכת הפעלה, דפדפן וגרסה.\n4. ציינו תאריך ושעה.\n5. שלחו פרטים ל-support@bizuply.com או פתחו פניית תמיכה.",
        "Describe la acción, adjunta capturas, incluye dispositivo/SO/navegador/versión, fecha y hora, y envía a support@bizuply.com o abre un ticket.",
        "Descreva a ação, anexe prints, inclua dispositivo/SO/navegador/versão, data e hora, e envie para support@bizuply.com ou abra um ticket.",
        "صف الإجراء وأرفق لقطات واذكر الجهاز ونظام التشغيل والمتصفح والإصدار والتاريخ والوقت، ثم أرسل إلى support@bizuply.com أو افتح تذكرة دعم."
      ),
    },
    accountBlocked: {
      question: row("My account was blocked for no reason — what should I do?", "החשבון שלי נחסם ללא סיבה — מה לעשות", "Mi cuenta se bloqueó sin motivo — ¿qué hago?", "Minha conta foi bloqueada sem motivo — o que fazer?", "حُظر حسابي دون سبب — ماذا أفعل؟"),
      answer: row(
        "If the account is blocked:\n\n1. Confirm the block by trying to sign in.\n2. Check email (including spam).\n3. Contact support with the account details.\n4. Describe the last actions before the block.",
        "אם החשבון נחסם:\n\n1. אשרו את החסימה בניסיון התחברות.\n2. בדקו דוא\"ל (כולל ספאם).\n3. פנו לתמיכה עם פרטי החשבון.\n4. תארו פעולות אחרונות לפני החסימה.",
        "Confirma el bloqueo al iniciar sesión, revisa el email (incluido spam), contacta a soporte con los datos de la cuenta y describe las últimas acciones.",
        "Confirme o bloqueio ao entrar, veja o e-mail (incluindo spam), fale com o suporte com os dados da conta e descreva as últimas ações.",
        "أكد الحظر بمحاولة الدخول، راجع البريد (بما فيه غير المرغوب)، تواصل مع الدعم بتفاصيل الحساب، وصف الإجراءات الأخيرة."
      ),
    },
    blankScreen: {
      question: row("I see a blank page or white screen — how do I fix it?", "אני רואה דף ריק או מסך לבן — איך מתקנים", "Veo una página en blanco — ¿cómo lo arreglo?", "Vejo uma página em branco — como corrigir?", "أرى صفحة فارغة أو شاشة بيضاء — كيف أصلحها؟"),
      answer: row(
        "To fix blank screens:\n\n1. Check the internet connection.\n2. Clear cache and cookies.\n3. Temporarily disable extensions.\n4. Try incognito mode.\n5. Try another browser or device.",
        "לפתרון מסכים ריקים:\n\n1. בדקו חיבור אינטרנט.\n2. נקו מטמון ועוגיות.\n3. השביתו תוספים זמנית.\n4. נסו מצב incognito.\n5. נסו דפדפן או מכשיר אחר.",
        "Comprueba internet, borra caché y cookies, desactiva extensiones, prueba incógnito y otro navegador o dispositivo.",
        "Verifique a internet, limpe cache e cookies, desative extensões, tente anônimo e outro navegador ou dispositivo.",
        "تحقق من الإنترنت وامسح الذاكرة والكوكيز وعطّل الإضافات وجرّب التصفح الخاص ومتصفحاً أو جهازاً آخر."
      ),
    },
    timeout: {
      question: row("Timeout error — the site disconnects or does not respond", "שגיאת timeout — האתר מתנתק או לא מגיב", "Error de timeout — el sitio se desconecta o no responde", "Erro de timeout — o site desconecta ou não responde", "خطأ مهلة — الموقع ينقطع أو لا يستجيب"),
      answer: row(
        "A timeout usually means a slow or interrupted connection.\n\n1. Check internet speed and stability.\n2. Close apps that use a lot of bandwidth.\n3. Refresh and try again.\n4. Try later if servers are busy.\n5. Contact support if it keeps happening.",
        "timeout בדרך כלל מציין חיבור איטי או מופרע.\n\n1. בדקו מהירות ויציבות אינטרנט.\n2. סגרו אפליקציות שצורכות רוחב רב.\n3. רעננו ונסו שוב.\n4. נסו שוב מאוחר יותר אם השרתים עמוסים.\n5. פנו לתמיכה אם זה חוזר על עצמו.",
        "Un timeout suele indicar una conexión lenta o interrumpida. Revisa la red, cierra apps pesadas, actualiza, inténtalo más tarde y contacta a soporte si se repite.",
        "Um timeout costuma indicar conexão lenta ou interrompida. Verifique a rede, feche apps pesadas, atualize, tente mais tarde e fale com o suporte se repetir.",
        "المهلة تعني عادة اتصالاً بطيئاً أو منقطعاً. تحقق من الشبكة وأغلق التطبيقات الثقيلة وحدّث وجرّب لاحقاً وتواصل مع الدعم إذا تكرر."
      ),
    },
  },
};

const FAQ_TECH = {
  title: row("Technical support — FAQ", "תמיכה טכנית – שאלות נפוצות", "Soporte técnico — FAQ", "Suporte técnico — FAQ", "الدعم الفني — أسئلة شائعة"),
  items: {
    getHelp: {
      question: row("How do I get technical help?", "איך מקבלים עזרה טכנית", "¿Cómo obtengo ayuda técnica?", "Como obtenho ajuda técnica?", "كيف أحصل على مساعدة تقنية؟"),
      answer: row(
        "For fast technical help we recommend:\n\n• Help center and FAQ: review guides and common solutions.\n• Support bot: use the built-in bot for routine issues.\n• Self-service: refresh, clear cache, or reset the password.\n• Contact support: email support@bizuply.com and include screenshots, browser, device, and the time of the issue.",
        "לסיוע טכני מהיר ויעיל:\n\n• מרכז עזרה ושאלות נפוצות: עברו על מדריכים ופתרונות שכיחים.\n• בוט תמיכה: השתמשו בבוט המובנה לאבחון מהיר.\n• פתרון עצמי: רעננו, נקו מטמון או אפסו סיסמה.\n• פנייה לתמיכה: support@bizuply.com — צרפו צילומי מסך, דפדפן, מכשיר ושעת התקלה.",
        "Revisa la ayuda y las FAQ, usa el bot de soporte, prueba refrescar/borrar caché/resetear contraseña, o escribe a support@bizuply.com con capturas y datos del dispositivo.",
        "Revise a ajuda e o FAQ, use o bot de suporte, tente atualizar/limpar cache/redefinir senha, ou escreva para support@bizuply.com com prints e dados do dispositivo.",
        "راجع مركز المساعدة والأسئلة الشائعة، استخدم بوت الدعم، جرّب التحديث أو مسح الذاكرة أو إعادة تعيين كلمة المرور، أو راسل support@bizuply.com مع لقطات وتفاصيل الجهاز."
      ),
    },
    resetPassword: {
      question: row("How do I reset a password?", "איך מאפסים סיסמה", "¿Cómo restablezco la contraseña?", "Como redefinir a senha?", "كيف أعيد تعيين كلمة المرور؟"),
      answer: row(
        "To reset a password:\n\n1. Go to the sign-in page.\n2. Click Forgot password.\n3. Enter the account email.\n4. Check inbox and spam.\n5. Open the reset link.\n6. Set and confirm a new password.\n\nIf the email does not arrive, confirm the address and try again or contact support.",
        "לאיפוס סיסמה:\n\n1. עברו לדף ההתחברות.\n2. לחצו על שכחתי סיסמה.\n3. הזינו את כתובת הדוא\"ל של החשבון.\n4. בדקו את תיבת הדואר (כולל ספאם).\n5. פתחו את קישור האיפוס.\n6. הגדירו סיסמה חדשה ואשרו.\n\nאם לא מגיע הדוא\"ל, ודאו את הכתובת ונסו שוב או פנו לתמיכה.",
        "Entra a iniciar sesión, pulsa Olvidé la contraseña, introduce el email, revisa bandeja y spam, abre el enlace y confirma la nueva contraseña. Si no llega, verifica el email o contacta a soporte.",
        "Vá ao login, clique em Esqueci a senha, informe o e-mail, veja a caixa e o spam, abra o link e confirme a nova senha. Se não chegar, confira o e-mail ou fale com o suporte.",
        "اذهب لتسجيل الدخول واضغط نسيت كلمة المرور وأدخل البريد وراجع الوارد وغير المرغوب وافتح الرابط وأكد كلمة المرور الجديدة. إذا لم يصل تحقق من العنوان أو تواصل مع الدعم."
      ),
    },
    notifications: {
      question: row("How do notifications work in the system?", "איך עובדות ההתראות במערכת", "¿Cómo funcionan las notificaciones?", "Como funcionam as notificações?", "كيف تعمل الإشعارات في النظام؟"),
      answer: row(
        "Notifications are sent automatically for key events such as collaborations, appointments, and system updates.\n\nThey appear under the bell icon in the top corner.\n\nNo manual setup is required. Push notifications depend on browser or device permissions.",
        "התראות נשלחות אוטומטית לאירועים מרכזיים כמו שיתופי פעולה, תורים ועדכוני מערכת.\n\nהן מופיעות תחת סמל הפעמון בפינה העליונה.\n\nאין צורך בהגדרה ידנית. התראות push תלויות בהרשאות הדפדפן או המכשיר.",
        "Se envían solas para eventos clave (colaboraciones, citas, actualizaciones) y aparecen en el icono de campana. No hay que configurarlas; el push depende de los permisos.",
        "São enviadas automaticamente para eventos-chave (colaborações, horários, atualizações) e aparecem no sino. Não precisam de configuração; o push depende das permissões.",
        "تُرسل تلقائياً لأحداث مهمة مثل التعاون والمواعيد وتحديثات النظام وتظهر تحت أيقونة الجرس. لا حاجة لإعداد يدوي؛ الإشعارات الفورية تعتمد على صلاحيات المتصفح أو الجهاز."
      ),
    },
    noUpdates: {
      question: row("Why am I not seeing new updates in the system?", "למה אני לא רואה עדכונים חדשים במערכת", "¿Por qué no veo actualizaciones nuevas?", "Por que não vejo atualizações novas?", "لماذا لا أرى تحديثات جديدة في النظام؟"),
      answer: row(
        "• Check that the internet connection is stable.\n• Refresh the page (F5 / Cmd + R).\n• Clear the browser cache.\n• Make sure the browser or app is up to date.\n• Try another browser or device.\n\nIf it continues, contact support with device and browser details.",
        "• בדקו יציבות חיבור האינטרנט.\n• רעננו את הדף (F5 / Cmd + R).\n• נקו מטמון דפדפן.\n• ודאו שהדפדפן או האפליקציה מעודכנים.\n• נסו דפדפן או מכשיר אחר.\n\nאם הבעיה נמשכת, פנו לתמיכה עם פרטי מכשיר ודפדפן.",
        "Revisa internet, actualiza (F5 / Cmd + R), borra caché, actualiza el navegador y prueba otro dispositivo. Si sigue, contacta a soporte.",
        "Verifique a internet, atualize (F5 / Cmd + R), limpe o cache, atualize o navegador e tente outro dispositivo. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت وحدّث الصفحة وامسح الذاكرة وحدّث المتصفح وجرّب جهازاً آخر. إذا استمر تواصل مع الدعم."
      ),
    },
    clearCache: {
      question: row("How do I clear cache and cookies?", "איך מנקים מטמון ועוגיות", "¿Cómo borro caché y cookies?", "Como limpar cache e cookies?", "كيف أمسح الذاكرة والكوكيز؟"),
      answer: row(
        "In Google Chrome:\n\n1. Open the menu → Settings.\n2. Go to Privacy and security.\n3. Choose Clear browsing data.\n4. Select All time.\n5. Check cookies and cached files.\n6. Click Clear data and restart the browser.\n\nThe process is similar in Firefox, Edge, and Safari.",
        "ב-Google Chrome:\n\n1. פתחו תפריט → הגדרות.\n2. עברו לפרטיות ואבטחה.\n3. בחרו ניקוי נתוני גלישה.\n4. בחרו כל הזמן.\n5. סמנו עוגיות וקבצים במטמון.\n6. לחצו נקה נתונים והפעילו מחדש את הדפדפן.\n\nהתהליך דומה ב-Firefox, Edge ו-Safari.",
        "En Chrome: menú → Ajustes → Privacidad → Borrar datos de navegación → Todo el tiempo → cookies y archivos en caché → Borrar. Similar en Firefox, Edge y Safari.",
        "No Chrome: menu → Configurações → Privacidade → Limpar dados → Todo o período → cookies e arquivos em cache → Limpar. Semelhante no Firefox, Edge e Safari.",
        "في Chrome: القائمة → الإعدادات → الخصوصية → محو بيانات التصفح → كل الوقت → الكوكيز والملفات المخزنة → محو. العملية مشابهة في Firefox وEdge وSafari."
      ),
    },
    slowSite: {
      question: row("What should I do if the site is slow or freezes?", "מה לעשות אם האתר איטי או נתקע", "¿Qué hago si el sitio va lento o se traba?", "O que fazer se o site estiver lento ou travar?", "ماذا أفعل إذا كان الموقع بطيئاً أو تجمّد؟"),
      answer: row(
        "• Check internet speed and stability.\n• Close background apps.\n• Clear the browser cache.\n• Try another browser.\n• Make sure the OS and browser are up to date.\n\nIf performance issues continue, contact support with details.",
        "• בדקו מהירות ויציבות חיבור האינטרנט.\n• סגרו אפליקציות ברקע.\n• נקו מטמון דפדפן.\n• נסו דפדפן אחר.\n• ודאו שמערכת ההפעלה והדפדפן מעודכנים.\n\nאם בעיות הביצועים נמשכות, פנו לתמיכה עם מידע מפורט.",
        "Revisa la red, cierra apps en segundo plano, borra caché, prueba otro navegador y actualiza SO/navegador. Si sigue lento, contacta a soporte.",
        "Verifique a rede, feche apps em segundo plano, limpe o cache, tente outro navegador e atualize SO/navegador. Se continuar lento, fale com o suporte.",
        "تحقق من الشبكة وأغلق تطبيقات الخلفية وامسح الذاكرة وجرّب متصفحاً آخر وحدّث النظام والمتصفح. إذا استمر البطء تواصل مع الدعم."
      ),
    },
    myProblemOrSystem: {
      question: row("How do I know if the problem is on my side or in the system?", "איך יודעים אם הבעיה אצלי או במערכת", "¿Cómo sé si el problema es mío o del sistema?", "Como saber se o problema é meu ou do sistema?", "كيف أعرف إن كانت المشكلة عندي أم في النظام؟"),
      answer: row(
        "• Try another device.\n• Try another network.\n• Clear cache and disable extensions.\n• Check firewall or security software.\n\nIf the issue appears everywhere, it is likely on the system side. Contact support with your findings.",
        "• נסו מכשיר אחר.\n• נסו רשת אחרת.\n• נקו מטמון והשביתו תוספים.\n• בדקו חומת אש או תוכנות אבטחה.\n\nאם הבעיה מופיעה בכל מקום, סביר שהיא קשורה למערכת. פנו לתמיכה עם הממצאים שלכם.",
        "Prueba otro dispositivo y otra red, borra caché, desactiva extensiones y revisa el firewall. Si ocurre en todos lados, suele ser del sistema: contacta a soporte.",
        "Tente outro dispositivo e outra rede, limpe o cache, desative extensões e veja o firewall. Se ocorrer em todos os lugares, costuma ser do sistema: fale com o suporte.",
        "جرّب جهازاً آخر وشبكة أخرى وامسح الذاكرة وعطّل الإضافات وتحقق من الجدار الناري. إذا ظهرت المشكلة في كل مكان فالغالب أنها من النظام: تواصل مع الدعم."
      ),
    },
    oldBrowsers: {
      question: row("Does the system support old browsers?", "האם המערכת תומכת בדפדפנים ישנים", "¿El sistema admite navegadores antiguos?", "O sistema oferece suporte a navegadores antigos?", "هل يدعم النظام المتصفحات القديمة؟"),
      answer: row(
        "The system is built for modern browsers to keep performance, security, and stability.\n\nOld browsers can cause display errors, slow performance, or missing features.\n\nWe strongly recommend updating the browser or switching to a supported one.",
        "המערכת מותאמת לדפדפנים מודרניים כדי להבטיח ביצועים, אבטחה ויציבות.\n\nדפדפנים ישנים עלולים לגרום לשגיאות תצוגה, ביצועים איטיים או פונקציונליות חסרה.\n\nאנו ממליצים בחום לעדכן את הדפדפן או לעבור לדפדפן נתמך.",
        "Está pensado para navegadores modernos. Los antiguos pueden fallar en pantalla, ir lentos o perder funciones. Actualiza o cambia a uno compatible.",
        "Foi feito para navegadores modernos. Os antigos podem falhar na tela, ficar lentos ou perder funções. Atualize ou mude para um compatível.",
        "النظام مبني للمتصفحات الحديثة. القديمة قد تسبب أخطاء عرض أو بطئاً أو ميزات ناقصة. نوصي بالتحديث أو الانتقال إلى متصفح مدعوم."
      ),
    },
    accountSecurity: {
      question: row("What should I do if there is an account security problem?", "מה לעשות במקרה של בעיות אבטחת חשבון", "¿Qué hago ante un problema de seguridad de la cuenta?", "O que fazer em um problema de segurança da conta?", "ماذا أفعل عند مشكلة أمن في الحساب؟"),
      answer: row(
        "• Change the password immediately.\n• Review account activity.\n• Disconnect unknown devices.\n• Use strong unique passwords.\n• Run an antivirus check on the device.\n\nIf you cannot access the account, contact support immediately.",
        "• שנו את הסיסמה מיד.\n• עברו על פעילות החשבון.\n• נתקו מכשירים לא מוכרים.\n• השתמשו בסיסמאות חזקות וייחודיות.\n• הפעילו בדיקת אנטי־וירוס במכשיר.\n\nאם אין גישה לחשבון, פנו לתמיכה מיד.",
        "Cambia la contraseña, revisa la actividad, desconecta dispositivos desconocidos, usa contraseñas fuertes y pasa un antivirus. Si no hay acceso, contacta a soporte ya.",
        "Troque a senha, revise a atividade, desconecte dispositivos desconhecidos, use senhas fortes e rode um antivírus. Se não houver acesso, fale com o suporte imediatamente.",
        "غيّر كلمة المرور فوراً وراجع النشاط وافصل الأجهزة غير المعروفة واستخدم كلمات مرور قوية وشغّل فحصاً مضاداً للفيروسات. إذا تعذّر الدخول تواصل مع الدعم فوراً."
      ),
    },
    recoverAccount: {
      question: row("How do I recover an account if I forgot the sign-in details?", "איך משחזרים חשבון אם שכחתי פרטי התחברות", "¿Cómo recupero la cuenta si olvidé el acceso?", "Como recuperar a conta se esqueci o acesso?", "كيف أستعيد الحساب إذا نسيت بيانات الدخول؟"),
      answer: row(
        "• Use Forgot password.\n• Search old emails from the system for username hints.\n• Contact support with identifying details if recovery fails.",
        "• השתמשו באפשרות שכחתי סיסמה.\n• חפשו בדוא\"לים ישנים מהמערכת רמזים לשם משתמש.\n• פנו לתמיכה עם פרטים מזהים אם השחזור נכשל.",
        "Usa Olvidé la contraseña, busca emails antiguos del sistema y contacta a soporte con datos identificativos si no se recupera.",
        "Use Esqueci a senha, busque e-mails antigos do sistema e fale com o suporte com dados identificadores se a recuperação falhar.",
        "استخدم نسيت كلمة المرور وابحث في الرسائل القديمة عن تلميحات لاسم المستخدم وتواصل مع الدعم ببيانات تعريفية إذا فشل الاستعادة."
      ),
    },
  },
};

const FAQ_CRM = {
  title: row("CRM and scheduling — FAQ", "CRM ותזמון – שאלות נפוצות", "CRM y agenda — FAQ", "CRM e agendamento — FAQ", "CRM والجدولة — أسئلة شائعة"),
  items: {
    getLeads: {
      question: row("How do I get leads into the CRM?", "איך לקבל לידים ל-CRM?", "¿Cómo llego leads al CRM?", "Como receber leads no CRM?", "كيف أصل بالعملاء المحتملين إلى CRM؟"),
      answer: row(
        "To get leads into the Bizuply CRM:\n\n1. Go to CRM → Leads.\n2. Make sure a published site has a contact form — site leads enter automatically.\n3. To connect Meta Lead Ads: CRM → Settings → Meta Lead Ads connection.\n4. You can also add a lead manually in the Leads tab.\n\nNew leads appear in the CRM and dashboard, and you can update status (new, in progress, converted, and more).",
        "כדי לקבל לידים ל-CRM ב-Bizuply:\n\n1. עברו ל-CRM → לשונית לידים.\n2. ודאו שיש אתר מפורסם עם טופס יצירת קשר — לידים מהאתר נכנסים אוטומטית.\n3. לחבר Meta Lead Ads: ב-CRM → הגדרות → חיבור Meta Lead Ads.\n4. ניתן גם להוסיף ליד ידנית בלשונית הלידים.\n\nלידים חדשים יופיעו ב-CRM ובדשבורד, ותוכלו לעדכן סטטוס (חדש, בטיפול, הומר וכו').",
        "Ve a CRM → Leads, publica un sitio con formulario, conecta Meta Lead Ads en Ajustes y también puedes añadir leads a mano. Los nuevos aparecen en el CRM y el panel.",
        "Vá em CRM → Leads, publique um site com formulário, conecte Meta Lead Ads em Configurações e também pode adicionar leads manualmente. Os novos aparecem no CRM e no painel.",
        "اذهب إلى CRM → العملاء المحتملون، انشر موقعاً بنموذج تواصل، اربط Meta Lead Ads من الإعدادات ويمكنك أيضاً إضافة عميل يدوياً. يظهر الجدد في CRM ولوحة التحكم."
      ),
    },
    bookAppointment: {
      question: row("How do I book an appointment for a customer?", "איך לקבוע תור ללקוח?", "¿Cómo reservo una cita para un cliente?", "Como agendar um horário para um cliente?", "كيف أحجز موعداً للعميل؟"),
      answer: row(
        "To book an appointment:\n\n1. Go to CRM → Appointments.\n2. Click New appointment (+).\n3. Choose an existing customer — or add a new one.\n4. Choose a service, date, and available time.\n5. Click Save.\n\nThe appointment syncs with the calendar, and you can send a reminder.",
        "כדי לקבוע תור ללקוח:\n\n1. עברו ל-CRM → לשונית תורים.\n2. לחצו על תור חדש (+).\n3. בחרו לקוח קיים — או הוסיפו לקוח חדש.\n4. בחרו שירות, תאריך ושעה פנויה.\n5. לחצו שמור.\n\nהתור יסתנכרן עם היומן, ותוכלו לשלוח תזכורת ללקוח.",
        "Ve a CRM → Citas, pulsa Nueva cita, elige o crea un cliente, elige servicio/fecha/hora y guarda. Se sincroniza con el calendario y puedes enviar un recordatorio.",
        "Vá em CRM → Horários, clique em Novo horário, escolha ou crie um cliente, escolha serviço/data/hora e salve. Sincroniza com a agenda e você pode enviar um lembrete.",
        "اذهب إلى CRM → المواعيد، انقر موعد جديد، اختر عميلاً أو أضفه، اختر الخدمة والتاريخ والوقت ثم احفظ. يتزامن مع التقويم ويمكنك إرسال تذكير."
      ),
    },
    whatIsCrm: {
      question: row("What is a CRM and how does it help run the business?", "מהי מערכת CRM ואיך היא עוזרת לנהל את העסק", "¿Qué es un CRM y cómo ayuda al negocio?", "O que é um CRM e como ele ajuda o negócio?", "ما هو CRM وكيف يساعد في إدارة العمل؟"),
      answer: row(
        "A CRM (customer relationship management) system keeps customer relationships in one place.\n\nIt lets you:\n• Store and organize customer information\n• Track appointments, services, and interactions\n• Improve communication and retention\n• Analyze customer behavior and performance\n• Make data-based business decisions\n\nIn BizUply the CRM is fully integrated with appointments, the dashboard, and analytics.",
        "מערכת CRM (ניהול קשרי לקוחות) היא כלי מרכזי לניהול קשרי לקוחות במקום אחד.\n\nהיא מאפשרת:\n• אחסון וארגון מידע על לקוחות\n• מעקב אחר תורים, שירותים ואינטראקציות\n• שיפור תקשורת ושימור לקוחות\n• ניתוח התנהגות לקוחות וביצועים\n• קבלת החלטות עסקיות מבוססות נתונים\n\nב-BizUply, ה-CRM משולב במלואו עם מערכת התורים, לוח הבקרה וכלי הניתוח.",
        "Un CRM guarda las relaciones con clientes en un solo lugar: datos, citas, comunicación, análisis y decisiones. En BizUply está integrado con agenda, panel y analítica.",
        "Um CRM guarda o relacionamento com clientes em um só lugar: dados, horários, comunicação, análises e decisões. No BizUply está integrado com agenda, painel e analytics.",
        "نظام CRM يحفظ علاقات العملاء في مكان واحد: البيانات والمواعيد والتواصل والتحليل والقرارات. في BizUply هو مدمج مع المواعيد ولوحة التحكم والتحليلات."
      ),
    },
    clientProfile: {
      question: row("What data is in a customer profile and how do I use it?", "אילו נתונים רואים בפרופיל לקוח ואיך משתמשים בהם", "¿Qué datos hay en el perfil del cliente?", "Quais dados há no perfil do cliente?", "ما البيانات في ملف العميل وكيف أستخدمها؟"),
      answer: row(
        "A customer profile includes contact details, service and purchase history, upcoming and past appointments, notes, and an interaction log.\n\nUse it to personalize service, improve retention, spot sales opportunities, reduce no-shows with reminders, and improve internal coordination.",
        "פרופיל לקוח כולל פרטי קשר, היסטוריית שירותים ורכישות, תורים קרובים ועבר, הערות ויומן אינטראקציות.\n\nהשתמשו בנתונים לשירות מותאם, שיפור שימור, זיהוי הזדמנויות מכירה, הפחתת ביטולים עם תזכורות ושיפור תיאום פנימי.",
        "Incluye contacto, historial, citas, notas y un registro. Úsalo para personalizar, retener, vender mejor y coordinar al equipo.",
        "Inclui contato, histórico, horários, notas e um registro. Use para personalizar, reter, vender melhor e coordenar a equipe.",
        "يشمل بيانات التواصل والسجل والمواعيد والملاحظات. استخدمه لتخصيص الخدمة وتحسين الاحتفاظ والبيع والتنسيق الداخلي."
      ),
    },
    scheduling: {
      question: row("How are scheduling and bookings managed in the CRM?", "איך מנוהלים תזמון והזמנות ב-CRM", "¿Cómo se gestionan citas y reservas en el CRM?", "Como horários e reservas são geridos no CRM?", "كيف تُدار الجدولة والحجوزات في CRM؟"),
      answer: row(
        "Scheduling is managed in a dedicated interface that shows all bookings and availability.\n\nFeatures include adding, editing, and cancelling appointments, automatic customer alerts, calendar sync, optional prepayments, and reminder messages.",
        "התזמון מנוהל דרך ממשק ייעודי שמציג את כל ההזמנות והזמינות.\n\nהתכונות כוללות הוספה, עריכה וביטול תורים, התראות אוטומטיות, סנכרון עם היומן, תשלומים מראש אופציונליים והודעות תזכורת.",
        "Hay una vista de reservas y disponibilidad: alta, edición, cancelación, avisos, sincronización, pagos previos y recordatorios.",
        "Há uma vista de reservas e disponibilidade: alta, edição, cancelamento, avisos, sincronização, pagamentos antecipados e lembretes.",
        "توجد واجهة للحجوزات والتوفر: إضافة وتعديل وإلغاء وتنبيهات ومزامنة ودفع مسبق اختياري وتذكيرات."
      ),
    },
    editCancel: {
      question: row("Can I edit or cancel existing bookings, and how does it work?", "האם ניתן לערוך או לבטל הזמנות קיימות ואיך זה עובד", "¿Puedo editar o cancelar reservas existentes?", "Posso editar ou cancelar reservas existentes?", "هل يمكن تعديل أو إلغاء حجوزات قائمة وكيف يعمل ذلك؟"),
      answer: row(
        "Yes. Edit or cancel bookings directly from the scheduling interface.\n\nThe system notifies customers automatically, keeps a full history, and updates availability in real time.\n\nTo reduce cancellations: use reminders, set a clear cancellation policy, and offer flexible rescheduling.",
        "כן. ניתן לערוך או לבטל הזמנות ישירות מממשק התזמון.\n\nהמערכת מודיעה ללקוחות, שומרת יומן היסטוריה ומעדכנת זמינות בזמן אמת.\n\nלהפחתת ביטולים: השתמשו בתזכורות, הגדירו מדיניות ביטול ברורה והציעו אפשרויות דחייה גמישות.",
        "Sí: edita o cancela desde la agenda. Se avisa al cliente, queda historial y se actualiza la disponibilidad. Usa recordatorios y una política clara.",
        "Sim: edite ou cancele na agenda. O cliente é avisado, fica histórico e a disponibilidade atualiza. Use lembretes e uma política clara.",
        "نعم: عدّل أو ألغِ من واجهة الجدولة. يُبلَّغ العميل ويُحفظ السجل ويتحدث التوفر. استخدم تذكيرات وسياسة إلغاء واضحة."
      ),
    },
    services: {
      question: row("How do I add or update services and products in the CRM?", "איך מוסיפים או מעדכנים שירותים ומוצרים ב-CRM", "¿Cómo añado o actualizo servicios y productos?", "Como adicionar ou atualizar serviços e produtos?", "كيف أضيف أو أحدّث الخدمات والمنتجات في CRM؟"),
      answer: row(
        "Services are managed in the Services tab.\n\nYou can set a description, price, duration, and special terms.\n\nAccurate service setup prevents scheduling clashes and improves the customer experience.",
        "שירותים מנוהלים בלשונית השירותים.\n\nניתן להגדיר תיאור, מחיר, משך זמן ותנאים מיוחדים.\n\nהגדרת שירותים מדויקת מונעת התנגשויות בתזמון ומשפרת חוויית לקוח.",
        "En la pestaña Servicios defines descripción, precio, duración y condiciones. Una ficha precisa evita choques de agenda.",
        "Na aba Serviços defina descrição, preço, duração e condições. Uma ficha precisa evita choques de agenda.",
        "في تبويب الخدمات حدّد الوصف والسعر والمدة والشروط. الإعداد الدقيق يمنع تعارض المواعيد."
      ),
    },
    clientList: {
      question: row("How do I manage the customer list and run searches?", "איך מנהלים את רשימת הלקוחות ומבצעים חיפושים", "¿Cómo gestiono la lista de clientes y las búsquedas?", "Como gerencio a lista de clientes e as buscas?", "كيف أدير قائمة العملاء وأبحث فيها؟"),
      answer: row(
        "The Customers tab provides a full list, advanced search and filters, appointment and communication history, notes, and status marks.",
        "לשונית הלקוחות מספקת רשימה מלאה, חיפוש וסינון מתקדם, היסטוריית תורים ותקשורת, הערות וסימוני סטטוס.",
        "La pestaña Clientes tiene lista, búsqueda, filtros, historial, notas y estados.",
        "A aba Clientes tem lista, busca, filtros, histórico, notas e status.",
        "تبويب العملاء يوفر قائمة وبحثاً وفلاتر وسجلاً وملاحظات وحالات."
      ),
    },
    dataNotUpdating: {
      question: row("What should I do if data is not updating or there is a system issue?", "מה לעשות אם הנתונים לא מתעדכנים או שיש בעיה במערכת", "¿Qué hago si los datos no se actualizan?", "O que fazer se os dados não atualizarem?", "ماذا أفعل إذا لم تتحدث البيانات أو ظهرت مشكلة؟"),
      answer: row(
        "Try a hard refresh (Ctrl + F5 / Cmd + Shift + R), check the internet, sign out and back in, clear cache and cookies, try another browser or device, and look for maintenance messages.\n\nIf it continues, contact support with screenshots and details.",
        "נסו רענון מלא (Ctrl + F5 / Cmd + Shift + R), בדקו אינטרנט, התנתקו והתחברו, נקו מטמון ועוגיות, נסו דפדפן או מכשיר אחר ובדקו הודעות תחזוקה.\n\nאם הבעיה נמשכת, פנו לתמיכה עם צילומי מסך ופרטים.",
        "Haz un refresco forzado, revisa internet, cierra sesión, borra caché, prueba otro navegador y busca avisos de mantenimiento. Si sigue, contacta a soporte.",
        "Faça um refresh forçado, verifique a internet, saia e entre, limpe o cache, tente outro navegador e veja avisos de manutenção. Se continuar, fale com o suporte.",
        "نفّذ تحديثاً قسرياً وتحقق من الإنترنت وسجّل الخروج والدخول وامسح الذاكرة وجرّب متصفحاً آخر وراجع رسائل الصيانة. إذا استمر تواصل مع الدعم."
      ),
    },
    analyze: {
      question: row("How do I analyze and improve customer performance with the CRM?", "איך מנתחים ומשפרים ביצועי לקוחות באמצעות ה-CRM", "¿Cómo analizo el rendimiento de clientes con el CRM?", "Como analisar o desempenho dos clientes com o CRM?", "كيف أحلل أداء العملاء وأحسّنه عبر CRM؟"),
      answer: row(
        "CRM analytics help you spot high-value customers, track campaign responses, improve service response times, detect churn risk early, create tailored offers, and set KPIs.",
        "ניתוחי CRM עוזרים לזהות לקוחות בעלי ערך, לעקוב אחר תגובות לקמפיינים, לשפר זמני תגובה, לזהות סיכוני נטישה, ליצור הצעות מותאמות ולהגדיר KPI.",
        "Ayudan a ver clientes de valor, campañas, tiempos de respuesta, riesgo de baja, ofertas a medida y KPI.",
        "Ajudam a ver clientes de valor, campanhas, tempos de resposta, risco de perda, ofertas sob medida e KPI.",
        "تساعد على رصد العملاء ذوي القيمة والحملات وسرعة الرد وخطر المغادرة والعروض المخصصة ومؤشرات الأداء."
      ),
    },
    crmVsBooking: {
      question: row("What is the difference between a CRM and an appointments-only system?", "מה ההבדל בין CRM למערכת תורים בלבד", "¿En qué se diferencia un CRM de solo citas?", "Qual a diferença entre um CRM e só horários?", "ما الفرق بين CRM ونظام مواعيد فقط؟"),
      answer: row(
        "An appointments system focuses only on scheduling and time.\n\nA CRM adds full customer profiles, interaction history, reports, automatic reminders, and marketing/retention tools.\n\nTogether they are a complete business-management solution.",
        "מערכת תורים מתמקדת רק בתזמון וניהול זמן.\n\nCRM מספק פרופילי לקוחות, היסטוריה, ניתוחים, תזכורות אוטומטיות וכלי שיווק ושימור.\n\nיחד הם פתרון ניהול עסקי שלם.",
        "La agenda solo gestiona tiempo. El CRM añade perfiles, historial, informes, recordatorios y marketing. Juntos cubren la gestión del negocio.",
        "A agenda só cuida do tempo. O CRM acrescenta perfis, histórico, relatórios, lembretes e marketing. Juntos cobrem a gestão do negócio.",
        "نظام المواعيد يركز على الوقت فقط. يضيف CRM ملفات وسجلاً وتقارير وتذكيرات وتسويقاً. معاً يغطيان إدارة العمل."
      ),
    },
    errors: {
      question: row("What should I do if I hit errors in the CRM or appointments system?", "מה לעשות אם נתקלתם בשגיאות ב-CRM או במערכת התורים", "¿Qué hago si hay errores en el CRM o las citas?", "O que fazer se houver erros no CRM ou nos horários?", "ماذا أفعل إذا ظهرت أخطاء في CRM أو نظام المواعيد؟"),
      answer: row(
        "Check the internet, refresh, look at maintenance messages, confirm the input is accurate, document the issue with screenshots, and contact support with full details.",
        "בדקו יציבות חיבור, רעננו, עברו על הודעות תחזוקה, ודאו דיוק בקלט, תעדו עם צילומי מסך ופנו לתמיכה עם פרטים מלאים.",
        "Revisa internet, actualiza, mira avisos de mantenimiento, verifica los datos, documenta con capturas y contacta a soporte.",
        "Verifique a internet, atualize, veja avisos de manutenção, confira os dados, documente com prints e fale com o suporte.",
        "تحقق من الإنترنت وحدّث وراجع رسائل الصيانة وتأكد من الإدخال ووثّق بلقطات وتواصل مع الدعم."
      ),
    },
  },
};

const FAQ_DASH = {
  title: row("Detailed help — business dashboard", "מרכז עזרה מפורט – לוח בקרה עסקי", "Ayuda detallada — panel de negocio", "Ajuda detalhada — painel do negócio", "مركز مساعدة مفصّل — لوحة العمل"),
  items: {
    whatShows: {
      question: row("What does my business dashboard show?", "מה מציג לוח הבקרה של העסק שלי", "¿Qué muestra el panel de mi negocio?", "O que o painel do meu negócio mostra?", "ماذا تعرض لوحة عملي؟"),
      answer: row(
        "The dashboard is a real-time control center for business activity.\n\nIt includes appointments by status, review and rating trends, profile views, visual charts, and an interactive calendar.",
        "לוח הבקרה הוא מרכז שליטה בזמן אמת.\n\nהוא כולל תורים לפי סטטוס, מגמות ביקורות, צפיות בפרופיל, גרפים ויומן אינטראקטיבי.",
        "Es un centro en tiempo real: citas por estado, reseñas, vistas de perfil, gráficos y un calendario.",
        "É um centro em tempo real: horários por status, avaliações, visualizações do perfil, gráficos e uma agenda.",
        "مركز تحكم فوري: مواعيد حسب الحالة ومراجعات ومشاهدات الملف ورسوم بيانية وتقويم تفاعلي."
      ),
    },
    viewAppointments: {
      question: row("How do I see all appointments scheduled for the week or month?", "איך רואים את כל התורים המתוזמנים לשבוע או לחודש", "¿Cómo veo todas las citas de la semana o el mes?", "Como ver todos os horários da semana ou do mês?", "كيف أرى كل مواعيد الأسبوع أو الشهر؟"),
      answer: row(
        "In the Appointments section you can use a monthly calendar, daily lists with customer and service details, a sortable table, and Excel/PDF export.",
        "במקטע התורים ניתן לצפות ביומן חודשי, רשימות יומיות, תצוגת טבלה עם מיון וסינון וייצוא ל-Excel או PDF.",
        "En Citas hay calendario mensual, listas diarias, tabla con filtros y exportación a Excel/PDF.",
        "Em Horários há calendário mensal, listas diárias, tabela com filtros e exportação para Excel/PDF.",
        "في المواعيد يوجد تقويم شهري وقوائم يومية وجدول قابل للفرز وتصدير Excel/PDF."
      ),
    },
    notUpdating: {
      question: row("What should I do if appointments or views are not updating on the dashboard?", "מה לעשות אם תורים או צפיות לא מתעדכנים בלוח הבקרה", "¿Qué hago si citas o vistas no se actualizan?", "O que fazer se horários ou visualizações não atualizarem?", "ماذا أفعل إذا لم تتحدث المواعيد أو المشاهدات في اللوحة؟"),
      answer: row(
        "Check the internet, hard-refresh, clear cache and cookies, try another browser or device, sign out and back in, wait 5–10 minutes for sync, and look for maintenance messages. If it continues, contact support.",
        "בדקו אינטרנט, בצעו רענון מלא, נקו מטמון ועוגיות, נסו דפדפן או מכשיר אחר, התנתקו והתחברו, המתינו 5–10 דקות לסנכרון ובדקו הודעות תחזוקה. אם הבעיה נמשכת, פנו לתמיכה.",
        "Revisa internet, refresca, borra caché, prueba otro navegador, cierra sesión, espera 5–10 minutos y mira avisos. Si sigue, contacta a soporte.",
        "Verifique a internet, atualize, limpe o cache, tente outro navegador, saia e entre, aguarde 5–10 minutos e veja avisos. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت وحدّث وامسح الذاكرة وجرّب متصفحاً آخر وسجّل الخروج وانتظر 5–10 دقائق وراجع رسائل الصيانة. إذا استمر تواصل مع الدعم."
      ),
    },
    calendar: {
      question: row("What does the dashboard calendar represent?", "מה מייצג היומן בלוח הבקרה", "¿Qué representa el calendario del panel?", "O que o calendário do painel representa?", "ماذا يمثّل تقويم اللوحة؟"),
      answer: row(
        "The calendar is a visual overview of scheduled appointments. A marked day means at least one appointment. Click a day to see hourly appointments and move between months to plan ahead.",
        "היומן מספק סקירה ויזואלית של תורים. יום מסומן מציין לפחות תור אחד. לחיצה מציגה את התורים לפי שעה, וניתן לנווט בין חודשים.",
        "Es una vista de citas. Un día marcado tiene al menos una. Pulsa el día para verlas por hora y navega entre meses.",
        "É uma vista de horários. Um dia marcado tem pelo menos um. Clique no dia para ver por hora e navegue entre meses.",
        "عرض مرئي للمواعيد. اليوم المعلّم يعني موعداً واحداً على الأقل. انقر لعرض الساعات وتنقّل بين الأشهر."
      ),
    },
    clientsChart: {
      question: row("How do I read the chart of customers who booked by month?", "איך קוראים את גרף הלקוחות שהזמינו לפי חודש", "¿Cómo leo el gráfico de clientes que reservaron por mes?", "Como ler o gráfico de clientes que agendaram por mês?", "كيف أقرأ رسم العملاء الذين حجزوا حسب الشهر؟"),
      answer: row(
        "The chart shows how many customers booked appointments each month. It is available as bars, a line, or a table, and helps spot seasonal peaks for marketing and budgeting.",
        "הגרף מציג כמה לקוחות הזמינו בכל חודש. זמין כעמודות, קווים או טבלה ועוזר לזהות מגמות עונתיות לתכנון שיווק ותקציב.",
        "Muestra cuántos clientes reservaron cada mes, en barras, línea o tabla, y ayuda a ver picos de temporada.",
        "Mostra quantos clientes agendaram em cada mês, em barras, linha ou tabela, e ajuda a ver picos sazonais.",
        "يعرض كم عميلاً حجز في كل شهر كأعمدة أو خط أو جدول ويساعد على رصد الذروات الموسمية."
      ),
    },
    smartTips: {
      question: row("What are the smart action recommendations on the dashboard?", "מהן המלצות הפעולה החכמות בלוח הבקרה", "¿Qué son las recomendaciones inteligentes del panel?", "O que são as recomendações inteligentes do painel?", "ما توصيات الإجراء الذكية في اللوحة؟"),
      answer: row(
        "Smart recommendations are generated from system analytics: promote a service when activity drops, ask for reviews, optimize the schedule, and improve customer engagement. They update in real time from your data.",
        "המלצות חכמות נוצרות מניתוחי המערכת: קידום שירות כשהפעילות יורדת, בקשת ביקורות, אופטימיזציה של לוח הזמנים ושיפור מעורבות. הן מתעדכנות בזמן אמת.",
        "Salen del análisis: promocionar cuando baja la actividad, pedir reseñas, optimizar la agenda y mejorar el engagement. Se actualizan en tiempo real.",
        "Vêm da análise: promover quando a atividade cai, pedir avaliações, otimizar a agenda e melhorar o engajamento. Atualizam em tempo real.",
        "تُولَّد من التحليل: روّج عند انخفاض النشاط واطلب مراجعات وحسّن الجدول والمشاركة. تتحدث فورياً من بياناتك."
      ),
    },
    wrongData: {
      question: row("What should I do if I notice wrong or missing dashboard data?", "מה לעשות אם שמתם לב לנתונים שגויים או חסרים בלוח הבקרה", "¿Qué hago si veo datos incorrectos o faltantes?", "O que fazer se eu vir dados errados ou faltando?", "ماذا أفعل إذا لاحظت بيانات خاطئة أو ناقصة في اللوحة؟"),
      answer: row(
        "Confirm appointments and statuses are correct, check for sync issues, refresh or sign in again, review system messages, and if it continues report with screenshots to support.",
        "ודאו שהתורים והסטטוסים נכונים, בדקו בעיות סנכרון, רעננו או התחברו מחדש, עברו על הודעות מערכת ואם הבעיה נמשכת דווחו עם צילומי מסך לתמיכה.",
        "Confirma citas y estados, revisa la sincronización, refresca o entra de nuevo y, si sigue, informa a soporte con capturas.",
        "Confirme horários e status, veja a sincronização, atualize ou entre de novo e, se continuar, avise o suporte com prints.",
        "أكد صحة المواعيد والحالات وتحقق من المزامنة وحدّث أو أعد الدخول وإذا استمر بلّغ الدعم مع لقطات."
      ),
    },
    summary: {
      question: row("How do I get a weekly or monthly business summary?", "איך מקבלים סיכום עסקי שבועי או חודשי", "¿Cómo obtengo un resumen semanal o mensual?", "Como obter um resumo semanal ou mensal?", "كيف أحصل على ملخص عمل أسبوعي أو شهري؟"),
      answer: row(
        "The dashboard provides summary reports with total appointments, profile-exposure metrics, and a reviews overview. You can view them online, download PDF or Excel, and share with the team.",
        "לוח הבקרה מספק דוחות סיכום עם סך התורים, מדדי חשיפה וסקירת ביקורות. ניתן לצפות אונליין, להוריד PDF או Excel ולשתף עם הצוות.",
        "Hay informes con citas, exposición del perfil y reseñas. Puedes verlos, descargar PDF/Excel y compartirlos.",
        "Há relatórios com horários, exposição do perfil e avaliações. Você pode ver, baixar PDF/Excel e compartilhar.",
        "توفر اللوحة تقارير بالمواعيد والظهور والمراجعات. يمكن عرضها وتنزيل PDF/Excel ومشاركتها مع الفريق."
      ),
    },
    notRealtime: {
      question: row("What if dashboard data is not updating in real time?", "מה אם הנתונים בלוח הבקרה לא מתעדכנים בזמן אמת", "¿Y si los datos del panel no se actualizan en tiempo real?", "E se os dados do painel não atualizarem em tempo real?", "ماذا لو لم تتحدث بيانات اللوحة فورياً؟"),
      answer: row(
        "If data looks stale: check the internet, hard-refresh, clear cache and cookies, try another browser or device, look for maintenance alerts, sign out and back in, and wait a few minutes for sync. Contact support if it continues.",
        "אם הנתונים נראים מיושנים: בדקו אינטרנט, בצעו רענון מלא, נקו מטמון ועוגיות, נסו דפדפן אחר, חפשו התראות תחזוקה, התנתקו והתחברו והמתינו מספר דקות. פנו לתמיכה אם הבעיה נמשכת.",
        "Si se ven viejos: revisa internet, refresca, borra caché, prueba otro navegador, mira mantenimiento, cierra sesión y espera unos minutos. Contacta a soporte si sigue.",
        "Se parecerem antigos: verifique a internet, atualize, limpe o cache, tente outro navegador, veja manutenção, saia e aguarde alguns minutos. Fale com o suporte se continuar.",
        "إذا بدت قديمة: تحقق من الإنترنت وحدّث وامسح الذاكرة وجرّب متصفحاً آخر وراجع الصيانة وسجّل الخروج وانتظر دقائق. تواصل مع الدعم إذا استمر."
      ),
    },
    improve: {
      question: row("How do I improve dashboard metrics and increase business activity?", "איך משפרים את מדדי לוח הבקרה ומגבירים פעילות עסקית", "¿Cómo mejoro las métricas y la actividad?", "Como melhorar as métricas e a atividade?", "كيف أحسّن مؤشرات اللوحة وأزيد نشاط العمل؟"),
      answer: row(
        "Run focused marketing campaigns, keep a current professional profile, add quality photos and videos, manage availability and reduce no-shows, ask customers for reviews, analyze trends, and use CRM and analytics well.",
        "הפעילו קמפיינים ממוקדים, שמרו על פרופיל מעודכן, הוסיפו תמונות וסרטונים, נהלו זמינות, עודדו ביקורות, נתחו מגמות והשתמשו ב-CRM ובכלי הניתוח.",
        "Haz campañas, mantén el perfil al día, añade fotos, gestiona disponibilidad, pide reseñas, analiza tendencias y usa el CRM.",
        "Faça campanhas, mantenha o perfil atual, adicione fotos, gerencie disponibilidade, peça avaliações, analise tendências e use o CRM.",
        "شغّل حملات مركّزة وحدّث الملف وأضف صوراً وأدر التوفر واطلب مراجعات وحلّل الاتجاهات واستخدم CRM والتحليلات."
      ),
    },
  },
};

export function extraLocaleObject(locale) {
  return {
    sitePlugins: {
      nav: pickNested(NAV, locale),
      management: pickLocaleMap(MANAGEMENT, locale),
      smartBot: pickLocaleMap(SMART_BOT, locale),
    },
    studio: {
      linkModal: {
        ...pickLocaleMap(
          Object.fromEntries(Object.entries(LINK_MODAL).filter(([key]) => key !== "tabs")),
          locale
        ),
        tabs: pickNested(LINK_MODAL.tabs, locale),
      },
      lottie: pickLocaleMap(LOTTIE, locale),
      portalVars: {
        types: pickLocaleMap(PORTAL_VARS.types, locale),
        sources: pickLocaleMap(PORTAL_VARS.sources, locale),
      },
      pluginActions: pickNested(PLUGIN_ACTIONS, locale),
      pluginsAdd: pickLocaleMap(PLUGINS_ADD, locale),
    },
    helpFaqs: {
      troubleshooting: pickFaq(FAQ_TROUBLE, locale),
      technical: pickFaq(FAQ_TECH, locale),
      crm: pickFaq(FAQ_CRM, locale),
      dashboard: pickFaq(FAQ_DASH, locale),
    },
  };
}
