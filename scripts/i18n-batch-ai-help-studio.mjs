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

const AI_TAB = {
  title: row("AI automations", "אוטומציות AI", "Automatizaciones IA", "Automações de IA", "أتمتة الذكاء الاصطناعي"),
  subtitle: row("Pick a ready template and adapt it to your business.", "בחרו תבנית מוכנה והתאימו אותה לעסק שלכם.", "Elige una plantilla lista y adáptala a tu negocio.", "Escolha um modelo pronto e adapte ao seu negócio.", "اختر قالباً جاهزاً وكيّفه لعملك."),
  hint: row("The business advisor analyzes and recommends. Here you discover AI templates and review them before turning them on.", "היועץ העסקי מנתח וממליץ; כאן מגלים תבניות AI ועוברים לסקירה לפני הפעלה.", "El asesor analiza y recomienda. Aquí descubres plantillas de IA y las revisas antes de activarlas.", "O consultor analisa e recomenda. Aqui você descobre modelos de IA e revisa antes de ativar.", "المستشار يحلّل ويوصي. هنا تكتشف قوالب الذكاء وتراجعها قبل التشغيل."),
  empty: row("No AI templates are available to view right now. Try again later.", "אין כרגע תבניות AI זמינות לצפייה. נסו שוב בהמשך.", "Ahora no hay plantillas de IA. Inténtalo más tarde.", "Não há modelos de IA agora. Tente mais tarde.", "لا توجد قوالب ذكاء متاحة الآن. حاول لاحقاً."),
  viewTemplate: row("View template", "לצפייה בתבנית", "Ver plantilla", "Ver modelo", "عرض القالب"),
  billing: row("An AI action counts as an automation action in your plan.", "פעולת AI נספרת כפעולת אוטומציה במסגרת החבילה שלך", "Una acción de IA cuenta como una acción de automatización de tu plan.", "Uma ação de IA conta como uma ação de automação do seu plano.", "تُحتسب عملية الذكاء كعملية أتمتة ضمن خطتك."),
};

const AI_TEMPLATES = {
  ai_lead_scoring: {
    title: row("Automatic lead scoring", "דירוג לידים אוטומטי", "Puntuación automática de leads", "Pontuação automática de leads", "تقييم تلقائي للعملاء المحتملين"),
    description: row("Scores new leads by quality and potential.", "מדרג לידים חדשים לפי איכות ופוטנציאל.", "Puntúa leads nuevos por calidad y potencial.", "Pontua leads novos por qualidade e potencial.", "يقيّم العملاء الجدد حسب الجودة والإمكانات."),
  },
  ai_lead_classify: {
    title: row("Automatic lead classification", "סיווג ליד אוטומטי", "Clasificación automática de leads", "Classificação automática de leads", "تصنيف تلقائي للعملاء المحتملين"),
    description: row("Classifies new leads into categories.", "מסווג לידים חדשים לקטגוריות.", "Clasifica leads nuevos en categorías.", "Classifica leads novos em categorias.", "يصنّف العملاء الجدد إلى فئات."),
  },
  ai_lead_auto_tag: {
    title: row("Automatic lead tagging", "תיוג אוטומטי של לידים", "Etiquetado automático de leads", "Marcação automática de leads", "وسم تلقائي للعملاء المحتملين"),
    description: row("Adds relevant tags.", "מוסיף תגיות רלוונטיות.", "Añade etiquetas relevantes.", "Adiciona tags relevantes.", "يضيف وسوماً مناسبة."),
  },
  ai_hot_lead: {
    title: row("Detect hot leads", "זיהוי לידים חמים", "Detectar leads calientes", "Detectar leads quentes", "اكتشاف العملاء الساخنين"),
    description: row("Finds leads that need fast follow-up.", "מזהה לידים הדורשים טיפול מהיר.", "Encuentra leads que necesitan seguimiento rápido.", "Encontra leads que precisam de acompanhamento rápido.", "يجد العملاء الذين يحتاجون متابعة سريعة."),
  },
  ai_lead_brief: {
    title: row("Lead brief before a sales call", "סיכום ליד לפני שיחת מכירה", "Resumen del lead antes de una llamada", "Resumo do lead antes da ligação", "ملخص العميل قبل مكالمة البيع"),
    description: row("Prepares a short lead brief.", "מכין תקציר ליד.", "Prepara un resumen corto.", "Prepara um resumo curto.", "يعدّ ملخصاً قصيراً."),
  },
  ai_followup_draft: {
    title: row("Draft a follow-up", "ניסוח Follow-up", "Redactar un seguimiento", "Redigir um follow-up", "صياغة متابعة"),
    description: row("Drafts a follow-up message only.", "מנסח הודעת המשך לטיוטה בלבד.", "Redacta solo un borrador de seguimiento.", "Redige só um rascunho de follow-up.", "يصوغ مسودة متابعة فقط."),
  },
  ai_email_draft: {
    title: row("Draft an email", "ניסוח מייל", "Redactar un email", "Redigir um e-mail", "صياغة رسالة بريد"),
    description: row("Drafts an email only.", "מנסח מייל לטיוטה בלבד.", "Redacta solo un borrador de email.", "Redige só um rascunho de e-mail.", "يصوغ مسودة بريد فقط."),
  },
  ai_next_action: {
    title: row("Suggest the next action", "הצעת הפעולה הבאה", "Sugerir la siguiente acción", "Sugerir a próxima ação", "اقتراح الخطوة التالية"),
    description: row("Suggests the next step.", "מציע את הצעד הבא.", "Sugiere el siguiente paso.", "Sugere o próximo passo.", "يقترح الخطوة التالية."),
  },
  ai_daily_leads_digest: {
    title: row("Daily leads digest", "תקציר יומי לידים", "Resumen diario de leads", "Resumo diário de leads", "ملخص يومي للعملاء المحتملين"),
    description: row("Summarizes today's leads.", "מסכם לידים מהיום.", "Resume los leads de hoy.", "Resume os leads de hoje.", "يلخّص عملاء اليوم."),
  },
  ai_daily_agenda_digest: {
    title: row("Daily tasks and meetings digest", "תקציר יומי משימות/פגישות", "Resumen diario de tareas y reuniones", "Resumo diário de tarefas e reuniões", "ملخص يومي للمهام والاجتماعات"),
    description: row("Summarizes tasks and meetings.", "מסכם משימות ופגישות.", "Resume tareas y reuniones.", "Resume tarefas e reuniões.", "يلخّص المهام والاجتماعات."),
  },
  ai_summarize_calls: { title: row("Call summaries", "סיכום שיחות", "Resumen de llamadas", "Resumo de chamadas", "ملخص المكالمات") },
  ai_auto_reply: { title: row("Automatic reply", "מענה אוטומטי", "Respuesta automática", "Resposta automática", "رد تلقائي") },
  ai_risk_lead: { title: row("Detect at-risk leads", "זיהוי ליד בסיכון", "Detectar leads en riesgo", "Detectar leads em risco", "اكتشاف عملاء معرضين للخطر") },
  ai_campaign_change: { title: row("Campaign change", "שינוי קמפיין", "Cambio de campaña", "Mudança de campanha", "تغيير الحملة") },
  ai_tasks_from_chat: { title: row("Create tasks from chat", "יצירת משימות מצ'אט", "Crear tareas desde el chat", "Criar tarefas do chat", "إنشاء مهام من الدردشة") },
  ai_intent_detect: { title: row("Detect intent", "זיהוי כוונה", "Detectar intención", "Detectar intenção", "اكتشاف النية") },
  ai_extract_message: { title: row("Extract info from a message", "חילוץ מידע מהודעה", "Extraer datos de un mensaje", "Extrair dados de uma mensagem", "استخراج معلومات من رسالة") },
  ai_objections: { title: row("Detect objections", "זיהוי התנגדויות", "Detectar objeciones", "Detectar objeções", "اكتشاف الاعتراضات") },
  ai_sentiment: { title: row("Sentiment analysis", "ניתוח סנטימנט", "Análisis de sentimiento", "Análise de sentimento", "تحليل المشاعر") },
  ai_crm_cleanup: { title: row("CRM cleanup", "ניקוי CRM", "Limpieza de CRM", "Limpeza de CRM", "تنظيف CRM") },
  ai_task_prioritization: { title: row("Prioritize tasks", "תעדוף משימות", "Priorizar tareas", "Priorizar tarefas", "ترتيب أولوية المهام") },
};

const STUDIO_SECTIONS = {
  "section-hero-business": {
    title: row("Business hero", "Hero עסקי", "Hero de negocio", "Hero de negócio", "بطل العمل"),
    description: row("Headline, paragraph, two buttons, and an image", "כותרת, פסקה, שני כפתורים ותמונה", "Titular, párrafo, dos botones e imagen", "Título, parágrafo, dois botões e imagem", "عنوان وفقرة وزرّان وصورة"),
  },
  "section-hero-beauty": {
    title: row("Beauty hero", "Hero ביוטי", "Hero de belleza", "Hero de beleza", "بطل الجمال"),
    description: row("Soft gradient design with an image", "עיצוב רך עם Gradient ותמונה", "Diseño suave con degradado e imagen", "Design suave com degradê e imagem", "تصميم ناعم مع تدرّج وصورة"),
  },
  "section-about-split": {
    title: row("About — text and image", "אודות – טקסט ותמונה", "Acerca — texto e imagen", "Sobre — texto e imagem", "حول — نص وصورة"),
    description: row("Clean two-column layout", "מבנה דו־טורי נקי", "Diseño de dos columnas", "Layout de duas colunas", "تخطيط عمودين نظيف"),
  },
  "section-services-cards": {
    title: row("Three services", "שלושה שירותים", "Tres servicios", "Três serviços", "ثلاث خدمات"),
    description: row("Headline and three cards", "כותרת ושלושה כרטיסים", "Titular y tres tarjetas", "Título e três cartões", "عنوان وثلاث بطاقات"),
  },
  "section-gallery-grid": {
    title: row("Work gallery", "גלריית עבודות", "Galería de trabajos", "Galeria de trabalhos", "معرض الأعمال"),
    description: row("Six projects with name, category, and description", "שישה פרויקטים עם שם, קטגוריה ותיאור", "Seis proyectos con nombre, categoría y descripción", "Seis projetos com nome, categoria e descrição", "ستة مشاريع مع الاسم والفئة والوصف"),
  },
  "section-testimonials": {
    title: row("Customer testimonials", "המלצות לקוחות", "Testimonios", "Depoimentos", "شهادات العملاء"),
    description: row("Three reviews with ratings", "שלוש המלצות עם דירוג", "Tres reseñas con valoración", "Três avaliações com nota", "ثلاث شهادات مع تقييم"),
  },
  "section-pricing": {
    title: row("Pricing", "מחירון", "Precios", "Preços", "الأسعار"),
    description: row("Three price packages", "שלוש חבילות מחיר", "Tres paquetes de precio", "Três pacotes de preço", "ثلاث باقات أسعار"),
  },
  "section-faq": {
    title: row("FAQ", "שאלות נפוצות", "FAQ", "FAQ", "أسئلة شائعة"),
    description: row("Headline and four questions", "כותרת וארבע שאלות", "Titular y cuatro preguntas", "Título e quatro perguntas", "عنوان وأربعة أسئلة"),
  },
  "section-team": {
    title: row("Team", "צוות", "Equipo", "Equipe", "الفريق"),
    description: row("Three team members with role and bio", "שלושה חברי צוות עם תפקיד וביוגרפיה", "Tres miembros con rol y bio", "Três membros com função e bio", "ثلاثة أعضاء مع الدور والسيرة"),
  },
  "section-stats": {
    title: row("Numbers and stats", "מספרים ונתונים", "Números y datos", "Números e dados", "أرقام وبيانات"),
    description: row("Headline, copy, and four labeled stats", "כותרת, הסבר וארבעה נתונים עם תוויות", "Titular, texto y cuatro datos", "Título, texto e quatro dados", "عنوان ونص وأربعة أرقام"),
  },
  "section-video-text": {
    title: row("Video with caption", "וידאו עם כיתוב", "Video con texto", "Vídeo com texto", "فيديو مع نص"),
    description: row("Full video with text overlay and a button", "וידאו מלא עם שכבות טקסט וכפתור", "Video completo con texto y botón", "Vídeo completo com texto e botão", "فيديو كامل مع نص وزر"),
  },
  "section-contact": {
    title: row("Contact", "צור קשר", "Contacto", "Contato", "تواصل"),
    description: row("Contact details and a form", "פרטי קשר וטופס", "Datos de contacto y formulario", "Dados de contato e formulário", "بيانات التواصل ونموذج"),
  },
  "section-cta-gradient": {
    title: row("Call to action", "קריאה לפעולה", "Llamada a la acción", "Chamada para ação", "دعوة لاتخاذ إجراء"),
    description: row("Gradient, headline, and button", "Gradient, כותרת וכפתור", "Degradado, titular y botón", "Degradê, título e botão", "تدرّج وعنوان وزر"),
  },
  "section-footer": {
    title: row("Full footer", "Footer מלא", "Pie completo", "Rodapé completo", "تذييل كامل"),
    description: row("Logo, navigation, and contact details", "לוגו, ניווט ופרטי קשר", "Logo, navegación y contacto", "Logo, navegação e contato", "شعار وتنقل وتواصل"),
  },
};

const BUILD = {
  title: row("Editing the business page in Bizuply", "עריכת דף העסק ב-Bizuply", "Editar la página del negocio en Bizuply", "Editar a página do negócio na Bizuply", "تعديل صفحة العمل في Bizuply"),
  whyTitle: row("Why editing the business page matters", "עריכת דף העסק: למה זה חשוב", "Por qué importa editar la página", "Por que editar a página importa", "لماذا يهم تعديل صفحة العمل"),
  why1: row("Your Bizuply business page is more than a digital profile — it is your virtual store. With the site builder, ready templates, and AI Studio you can create a professional presence. This is where potential customers form a first impression, understand your services, and decide to contact you or book.", "דף העסק שלך ב-Bizuply הוא יותר מפרופיל דיגיטלי — הוא החנות הווירטואלית שלך. בעזרת בונה האתרים, תבניות מוכנות ו-AI Studio תוכל ליצור נוכחות מקצועית. כאן לקוחות פוטנציאליים יוצרים רושם ראשוני, מבינים את השירותים שלך ומחליטים האם ליצור קשר או לקבוע תור.", "La página del negocio es tu tienda virtual. Con el editor, plantillas e IA creas una presencia profesional donde los clientes deciden contactarte.", "A página do negócio é sua loja virtual. Com o editor, modelos e IA você cria uma presença profissional onde os clientes decidem falar com você.", "صفحة العمل هي متجرك الافتراضي. بالمحرر والقوالب والذكاء تبني حضوراً مهنياً يقرّر منه العملاء التواصل."),
  why2: row("A clear, well-built page builds trust, reduces friction, and increases conversions. Every section helps guide customers to act.", "דף מסודר ובנוי היטב בונה אמון, מפחית חיכוך ומגדיל המרות. כל מקטע בדף תורם להנחיית הלקוחות לפעולה.", "Una página clara genera confianza, reduce fricción y aumenta conversiones.", "Uma página clara gera confiança, reduz atrito e aumenta conversões.", "صفحة واضحة تبني الثقة وتقلّل الاحتكاك وتزيد التحويل."),
  mainTitle: row("Home tab: core business information", "לשונית ראשית: מידע ליבה על העסק", "Pestaña Inicio: información esencial", "Aba Início: informação essencial", "تبويب الرئيسية: معلومات أساسية"),
  nameTitle: row("Business name", "שם העסק", "Nombre del negocio", "Nome do negócio", "اسم العمل"),
  nameBody: row("The name appears in search results, at the top of the page, and wherever the business is shown. Keep it clear, professional, and descriptive.", "שם העסק מופיע בתוצאות חיפוש, בראש הדף ובכל מקום שבו העסק מוצג. חשוב שיהיה ברור, מקצועי ומתאר.", "El nombre aparece en búsquedas y en la cabecera. Que sea claro y profesional.", "O nome aparece nas buscas e no topo. Seja claro e profissional.", "يظهر الاسم في البحث وأعلى الصفحة. ليكن واضحاً ومهنياً."),
  bestPractices: row("Best practices:", "שיטות עבודה מומלצות:", "Buenas prácticas:", "Boas práticas:", "أفضل الممارسات:"),
  nameTip1: row("Use the official business name or your personal brand.", "השתמשו בשם העסק הרשמי או בשם המותג האישי שלכם.", "Usa el nombre oficial o tu marca personal.", "Use o nome oficial ou sua marca pessoal.", "استخدم الاسم الرسمي أو علامتك الشخصية."),
  nameTip2: row("Include the main specialty to improve clarity and search visibility.", "כללו את תחום ההתמחות העיקרי לשיפור הבהירות והנראות בחיפוש.", "Incluye la especialidad principal para más claridad y visibilidad.", "Inclua a especialidade principal para clareza e visibilidade.", "ضمّن التخصص الرئيسي لوضوح وظهور أفضل."),
  examples: row("Examples:", "דוגמאות:", "Ejemplos:", "Exemplos:", "أمثلة:"),
  nameEx1: row("Emily Cohen — natural skin care", "אמילי כהן — טיפוח טבעי לעור", "Emily Cohen — cuidado natural de la piel", "Emily Cohen — cuidados naturais de pele", "إيميلي كوهين — عناية طبيعية بالبشرة"),
  nameEx2: row("Michael Levy — plumbing and emergency service", "מיכאל לוי — אינסטלציה ושירותי חירום", "Michael Levy — fontanería y emergencias", "Michael Levy — encanamento e emergências", "مايكل ليفي — سباكة وطوارئ"),
  descTitle: row("Business description", "תיאור העסק", "Descripción del negocio", "Descrição do negócio", "وصف العمل"),
  descBody: row("Explain who you are, what you offer, and why customers should choose you. This is one of the most influential parts of the page.", "במקטע זה מסבירים מי אתם, מה אתם מציעים ולמה כדאי ללקוחות לבחור בכם. זהו אחד החלקים המשפיעים ביותר בדף.", "Explica quién eres, qué ofreces y por qué elegirte. Es una de las partes más influyentes.", "Explique quem você é, o que oferece e por que escolher você. É uma das partes mais influentes.", "اشرح من أنت وما تقدّم ولماذا يختارونك. هذا من أكثر الأجزاء تأثيراً."),
  include: row("What to include:", "מה כדאי לכלול:", "Qué incluir:", "O que incluir:", "ما الذي تضمّنه:"),
  include1: row("The main service or specialty", "השירות העיקרי או תחום ההתמחות", "El servicio o especialidad principal", "O serviço ou especialidade principal", "الخدمة أو التخصص الرئيسي"),
  include2: row("Years of experience, licenses, or certifications", "שנות ניסיון, רישיונות או הסמכות", "Años de experiencia, licencias o certificaciones", "Anos de experiência, licenças ou certificações", "سنوات الخبرة أو التراخيص أو الشهادات"),
  include3: row("Your professional approach or method", "הגישה המקצועית או השיטה שבה אתם עובדים", "Tu enfoque o método profesional", "Sua abordagem ou método profissional", "نهجك أو طريقتك المهنية"),
  include4: row("What sets you apart from competitors", "מה מבדיל אתכם מהמתחרים", "Qué te diferencia de la competencia", "O que o diferencia da concorrência", "ما يميّزك عن المنافسين"),
  contactTitle: row("Contact details", "פרטי יצירת קשר", "Datos de contacto", "Dados de contato", "بيانات التواصل"),
  contactBody: row("Accurate contact details make it easy for customers to reach you. Double-check phone numbers and emails so you do not miss opportunities.", "פרטי קשר מדויקים מאפשרים ללקוחות להגיע אליכם בקלות. בדקו שוב מספרי טלפון וכתובות אימייל כדי שלא תפספסו הזדמנויות.", "Datos precisos facilitan el contacto. Revisa teléfonos y emails.", "Dados precisos facilitam o contato. Confira telefones e e-mails.", "البيانات الدقيقة تسهّل الوصول. راجع الهواتف والبريد."),
  categoryTitle: row("Business category", "קטגוריית העסק", "Categoría del negocio", "Categoria do negócio", "فئة العمل"),
  categoryBody: row("Choose the category that best represents your main service. If you offer several services, focus on the keyword customers are most likely to search.", "בחרו את הקטגוריה שמייצגת בצורה הטובה ביותר את השירות העיקרי שלכם. גם אם אתם מציעים מספר שירותים, התמקדו במילת המפתח שבה לקוחות סביר שיחפשו.", "Elige la categoría que mejor represente tu servicio principal.", "Escolha a categoria que melhor representa seu serviço principal.", "اختر الفئة التي تمثّل خدمتك الرئيسية."),
  areaTitle: row("Service area or city", "אזור שירות או עיר", "Área de servicio o ciudad", "Área de serviço ou cidade", "منطقة الخدمة أو المدينة"),
  areaBody: row("Choose the main city or service area. If you cover several areas, pick the one where most of the work happens.", "בחרו את העיר או אזור השירות העיקרי. אם אתם משרתים מספר אזורים, בחרו את האזור שבו רוב העבודה מתבצעת.", "Elige la ciudad o zona principal donde más trabajas.", "Escolha a cidade ou área principal onde mais trabalha.", "اختر المدينة أو المنطقة الرئيسية التي تعمل فيها أكثر."),
  galleryTitle: row("Gallery tab: first visual impression", "לשונית התמונות: רושם ויזואלי ראשוני", "Pestaña Galería: primera impresión visual", "Aba Galeria: primeira impressão visual", "تبويب المعرض: الانطباع البصري الأول"),
  galleryBody: row("The gallery lets customers judge your work visually before they contact you. Quality photos and videos raise trust and engagement.", "הגלריה מאפשרת ללקוחות להעריך את העבודה שלכם ויזואלית לפני שהם יוצרים קשר. תמונות וסרטונים איכותיים מגבירים אמון ומעורבות.", "La galería muestra tu trabajo antes del contacto. Fotos y videos de calidad aumentan confianza.", "A galeria mostra seu trabalho antes do contato. Fotos e vídeos de qualidade aumentam confiança.", "المعرض يعرض عملك قبل التواصل. الصور والفيديو الجيدة تزيد الثقة."),
  recommended: row("Recommended content:", "תוכן מומלץ:", "Contenido recomendado:", "Conteúdo recomendado:", "محتوى مستحسن:"),
  rec1: row("Before-and-after results or completed projects", "תוצאות לפני ואחרי או פרויקטים שהושלמו", "Antes/después o proyectos terminados", "Antes/depois ou projetos concluídos", "قبل/بعد أو مشاريع مكتملة"),
  rec2: row("The workspace, tools, or studio", "סביבת העבודה, הכלים או הסטודיו", "El espacio, herramientas o estudio", "O espaço, ferramentas ou estúdio", "مكان العمل أو الأدوات أو الاستوديو"),
  rec3: row("Short videos that show your process or professionalism", "סרטונים קצרים שמדגימים את התהליך או את המקצועיות שלכם", "Videos cortos de tu proceso o profesionalidad", "Vídeos curtos do processo ou profissionalismo", "فيديوهات قصيرة تعرض عمليتك أو احترافيتك"),
  galleryTip1: row("Use high-resolution photos with good lighting.", "השתמשו בתמונות ברזולוציה גבוהה ובתאורה טובה.", "Usa fotos nítidas y bien iluminadas.", "Use fotos nítidas e bem iluminadas.", "استخدم صوراً واضحة بإضاءة جيدة."),
  galleryTip2: row("Quality matters more than quantity.", "איכות חשובה יותר מכמות.", "La calidad importa más que la cantidad.", "Qualidade importa mais que quantidade.", "الجودة أهم من الكمية."),
  galleryTip3: row("Avoid heavy filters so the work stays authentic.", "הימנעו מפילטרים כבדים כדי לשמור על אותנטיות.", "Evita filtros pesados para mantener autenticidad.", "Evite filtros pesados para manter autenticidade.", "تجنّب الفلاتر الثقيلة للحفاظ على الأصالة."),
  reviewsTitle: row("Reviews tab: building trust", "לשונית ביקורות: בניית אמון", "Pestaña Reseñas: generar confianza", "Aba Avaliações: gerar confiança", "تبويب المراجعات: بناء الثقة"),
  reviewsBody: row("Reviews come only from real customers, which keeps them credible. Ratings affect visibility and help new customers decide.", "ביקורות נשלחות רק על ידי לקוחות אמיתיים, מה שמבטיח אמינות. הדירוגים משפיעים על הנראות ועוזרים ללקוחות חדשים להחליט.", "Las reseñas son de clientes reales. Las valoraciones afectan visibilidad y decisiones.", "As avaliações são de clientes reais. As notas afetam visibilidade e decisões.", "المراجعات من عملاء حقيقيين. التقييمات تؤثّر على الظهور والقرار."),
  reviewsWhy: row("Why reviews matter:", "למה ביקורות חשובות:", "Por qué importan:", "Por que importam:", "لماذا تهم:"),
  reviewsWhy1: row("They build social proof and trust.", "הן בונות הוכחה חברתית ואמון.", "Generan prueba social y confianza.", "Geram prova social e confiança.", "تبني دليلاً اجتماعياً وثقة."),
  reviewsWhy2: row("They improve visibility and ranking.", "הן משפרות נראות ודירוג.", "Mejoran visibilidad y ranking.", "Melhoram visibilidade e ranking.", "تحسّن الظهور والترتيب."),
  reviewsWhy3: row("They reduce hesitation for new customers.", "הן מפחיתות היסוס אצל לקוחות חדשים.", "Reducen la duda de clientes nuevos.", "Reduzem a dúvida de novos clientes.", "تقلّل تردد العملاء الجدد."),
  askReviews: row("How to ask for reviews:", "איך לבקש ביקורות:", "Cómo pedir reseñas:", "Como pedir avaliações:", "كيف تطلب مراجعات:"),
  askReviewsBody: row("If you were happy with the service, I would really appreciate a short review on my Bizuply profile. It helps new customers find and trust my work.", "אם הייתם מרוצים מהשירות, אשמח מאוד אם תוכלו להשאיר ביקורת קצרה בפרופיל Bizuply שלי. זה עוזר ללקוחות חדשים למצוא ולסמוך על העבודה שלי.", "Si quedaste contento con el servicio, una reseña corta en mi perfil de Bizuply ayuda a nuevos clientes.", "Se ficou satisfeito, uma avaliação curta no meu perfil Bizuply ajuda novos clientes.", "إذا رضيت عن الخدمة فمراجعة قصيرة على ملفي في Bizuply تساعد عملاء جدد."),
  calendarTitle: row("Calendar tab: online booking", "לשונית יומן: קביעת תורים אונליין", "Pestaña Calendario: reservas online", "Aba Agenda: reservas online", "تبويب التقويم: حجز عبر الإنترنت"),
  calendarBody: row("The calendar lets customers book directly from the page, without phone tag.", "היומן מאפשר ללקוחות לקבוע תורים ישירות מהדף, בלי שיחות טלפון ובלי תיאום מיותר.", "El calendario permite reservar desde la página, sin llamadas.", "A agenda permite reservar na página, sem ligações.", "التقويم يتيح الحجز من الصفحة دون مكالمات."),
  serviceGuide: row("Service setup tips:", "הנחיות להגדרת שירותים:", "Consejos para servicios:", "Dicas para serviços:", "إرشادات إعداد الخدمات:"),
  service1: row("A clear service name", "שם שירות ברור", "Un nombre de servicio claro", "Um nome de serviço claro", "اسم خدمة واضح"),
  service2: row("Estimated duration (minutes)", "משך משוער (בדקות)", "Duración estimada (minutos)", "Duração estimada (minutos)", "المدة التقديرية (دقائق)"),
  service3: row("Price", "מחיר", "Precio", "Preço", "السعر"),
  service4: row("A short description of what is included", "תיאור תמציתי של מה כלול בשירות", "Una descripción breve de lo incluido", "Uma descrição breve do que está incluído", "وصف موجز لما يشمله"),
  faqTitle: row("FAQ tab", "לשונית שאלות נפוצות", "Pestaña FAQ", "Aba FAQ", "تبويب الأسئلة الشائعة"),
  faqBody: row("The FAQ answers repeated questions in advance. That saves time, reduces repeat inquiries, and looks more professional.", "מקטע השאלות הנפוצות מאפשר לענות מראש על שאלות שחוזרות. זה חוסך זמן, מפחית פניות חוזרות ומחזק את המקצועיות.", "El FAQ responde preguntas repetidas de antemano. Ahorra tiempo y se ve más profesional.", "O FAQ responde perguntas repetidas antecipadamente. Poupa tempo e parece mais profissional.", "يجيب قسم الأسئلة مسبقاً على الأسئلة المتكررة. يوفّر الوقت ويبدو أكثر احترافية."),
  qCol: row("Question", "שאלה", "Pregunta", "Pergunta", "سؤال"),
  aCol: row("Answer", "תשובה", "Respuesta", "Resposta", "جواب"),
  q1: row("Do you accept credit cards?", "האם אתם מקבלים כרטיסי אשראי?", "¿Aceptáis tarjetas?", "Vocês aceitam cartão?", "هل تقبلون البطاقات؟"),
  a1: row("Yes. We accept credit cards and popular payment apps.", "כן. אנו מקבלים כרטיסי אשראי ואפליקציות תשלום פופולריות.", "Sí. Aceptamos tarjetas y apps de pago populares.", "Sim. Aceitamos cartões e apps de pagamento populares.", "نعم. نقبل البطاقات وتطبيقات الدفع الشائعة."),
  q2: row("Is there a warranty on the service?", "האם יש אחריות על השירות?", "¿Hay garantía?", "Há garantia?", "هل هناك ضمان على الخدمة؟"),
  a2: row("Yes. One included fix, valid for up to 60 days.", "כן. כלול תיקון אחד, תקף עד 60 יום.", "Sí. Una corrección incluida, válida 60 días.", "Sim. Um reparo incluído, válido por 60 dias.", "نعم. إصلاح واحد مشمول لمدة حتى 60 يوماً."),
  q3: row("Are weekend appointments available?", "האם יש תורים בסופי שבוע?", "¿Hay citas el fin de semana?", "Há horários no fim de semana?", "هل تتوفر مواعيد في عطلة نهاية الأسبوع؟"),
  a3: row("Yes. Weekend bookings are available by prior arrangement.", "כן. קביעת תורים בסופי שבוע זמינה בתיאום מראש.", "Sí. Fines de semana con cita previa.", "Sim. Fim de semana com agendamento prévio.", "نعم. عطلة نهاية الأسبوع بترتيب مسبق."),
  saveTitle: row("Save and review", "שמירה ובדיקה", "Guardar y revisar", "Salvar e revisar", "الحفظ والمراجعة"),
  save1: row("After completing every section, click Save all. Use View profile to see how the page looks to customers.", "לאחר השלמת כל המקטעים, לחצו על \"שמור הכל\". השתמשו באפשרות \"צפייה בפרופיל\" כדי לבדוק איך הדף נראה ללקוחות.", "Tras completar las secciones, pulsa Guardar todo y revisa Ver perfil.", "Após completar as seções, clique Salvar tudo e veja Ver perfil.", "بعد إكمال الأقسام انقر حفظ الكل واستعرض عرض الملف."),
  save2: row("Make sure images load, services are clearly defined, and all information is accurate and easy to understand.", "ודאו שהתמונות נטענות כראוי, שהשירותים מוגדרים בבירור ושכל המידע מדויק וקל להבנה.", "Comprueba que las imágenes cargan, los servicios están claros y la información es precisa.", "Confira se as imagens carregam, os serviços estão claros e as informações são precisas.", "تأكد أن الصور تُحمَّل والخدمات واضحة والمعلومات دقيقة."),
  checklistTitle: row("Final checklist", "רשימת בדיקה סופית", "Lista final", "Lista final", "قائمة التحقق النهائية"),
  check1: row("A clear business name with a defined specialty", "שם עסק ברור עם התמחות מוגדרת", "Nombre claro con especialidad definida", "Nome claro com especialidade definida", "اسم واضح مع تخصص محدد"),
  check2: row("A professional description with a clear value offer", "תיאור מקצועי עם הצעת ערך ברורה", "Descripción profesional con propuesta de valor", "Descrição profissional com proposta de valor", "وصف مهني مع عرض قيمة واضح"),
  check3: row("Quality, authentic photos", "תמונות איכותיות ואותנטיות", "Fotos de calidad y auténticas", "Fotos de qualidade e autênticas", "صور جيدة وأصيلة"),
  check4: row("Well-defined services with prices and durations", "שירותים מוגדרים היטב עם מחירים ומשכים", "Servicios claros con precios y duraciones", "Serviços claros com preços e durações", "خدمات واضحة بأسعار ومدد"),
  check5: row("Answers ready for common questions", "תשובות מראש לשאלות נפוצות", "Respuestas listas a preguntas frecuentes", "Respostas prontas para perguntas frequentes", "إجابات جاهزة للأسئلة الشائعة"),
  check6: row("A prompt for customers to leave reviews", "עידוד לקוחות להשאיר ביקורות", "Una invitación a dejar reseñas", "Um convite para deixar avaliações", "دعوة للعملاء لترك مراجعات"),
};

export function extraAiHelpStudioLocaleObject(locale) {
  return {
    automations: {
      aiTab: pickLocaleMap(AI_TAB, locale),
      aiTemplates: pickNested(AI_TEMPLATES, locale),
    },
    studio: {
      library: {
        sections: pickNested(STUDIO_SECTIONS, locale),
      },
    },
    helpArticles: {
      buildBusiness: pickLocaleMap(BUILD, locale),
    },
  };
}
