function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const UPLOAD = {
  signFailed: row("Failed to create the upload signature", "יצירת חתימת העלאה נכשלה", "No se pudo crear la firma de subida", "Falha ao criar a assinatura de envio", "تعذّر إنشاء توقيع الرفع"),
  cannotStart: row("Cannot start the upload right now. Try again.", "לא ניתן להתחיל את ההעלאה כרגע. נסו שוב.", "No se puede iniciar la subida ahora. Inténtalo de nuevo.", "Não é possível iniciar o envio agora. Tente de novo.", "تعذّر بدء الرفع الآن. حاولي مرة أخرى."),
  fileFailed: row("File upload failed. Try again.", "העלאת הקובץ נכשלה. נסו שוב.", "La subida del archivo falló. Inténtalo de nuevo.", "O envio do arquivo falhou. Tente de novo.", "فشل رفع الملف. حاولي مرة أخرى."),
  mediaFailed: row("Media upload failed", "העלאת המדיה נכשלה", "La subida de media falló", "O envio da mídia falhou", "فشل رفع الوسائط"),
  unsavedBeforePublish: row("There are unsaved changes. Try again before publishing.", "יש שינויים שעדיין לא נשמרו. נסי שוב לפני הפרסום.", "Hay cambios sin guardar. Inténtalo de nuevo antes de publicar.", "Há alterações não salvas. Tente de novo antes de publicar.", "هناك تغييرات غير محفوظة. حاولي مرة أخرى قبل النشر."),
};

const DEFAULTS = {
  newText: row("New text", "טקסט חדש", "Texto nuevo", "Texto novo", "نص جديد"),
  newButton: row("New button", "כפתור חדש", "Botón nuevo", "Botão novo", "زر جديد"),
  newImage: row("New image", "תמונה חדשה", "Imagen nueva", "Imagem nova", "صورة جديدة"),
  newVideo: row("New video", "סרטון חדש", "Vídeo nuevo", "Vídeo novo", "فيديو جديد"),
  divider: row("Divider", "קו מפריד", "Separador", "Divisor", "فاصل"),
  newBox: row("New box", "קופסה חדשה", "Caja nueva", "Caixa nova", "صندوق جديد"),
  newElement: row("New element", "אלמנט חדש", "Elemento nuevo", "Elemento novo", "عنصر جديد"),
  newSection: row("New section", "סקשן חדש", "Sección nueva", "Seção nova", "قسم جديد"),
  media: row("Media", "מדיה", "Media", "Mídia", "وسائط"),
  link: row("Link", "קישור", "Enlace", "Link", "رابط"),
  plugin: row("Plugin", "תוסף", "Plugin", "Plugin", "إضافة"),
  section: row("Section", "סקשן", "Sección", "Seção", "قسم"),
  element: row("Element", "אלמנט", "Elemento", "Elemento", "عنصر"),
  copy: row("{{label}} (copy)", "{{label}} (עותק)", "{{label}} (copia)", "{{label}} (cópia)", "{{label}} (نسخة)"),
  fieldN: row("Field {{n}}", "שדה {{n}}", "Campo {{n}}", "Campo {{n}}", "حقل {{n}}"),
  tableLabel: row("{{rows}}×{{cols}} table", "טבלה {{rows}}×{{cols}}", "Tabla {{rows}}×{{cols}}", "Tabela {{rows}}×{{cols}}", "جدول {{rows}}×{{cols}}"),
  crmField: row("Field", "נתון", "Dato", "Dado", "بيان"),
  crmLabel: row("CRM label · {{label}}", "תווית CRM · {{label}}", "Etiqueta CRM · {{label}}", "Rótulo CRM · {{label}}", "تسمية CRM · {{label}}"),
  crmValue: row("CRM field · {{label}}", "נתון CRM · {{label}}", "Dato CRM · {{label}}", "Dado CRM · {{label}}", "بيان CRM · {{label}}"),
  crmValuePlain: row("CRM field", "נתון CRM", "Dato CRM", "Dado CRM", "بيان CRM"),
  clientName: row("Client name", "שם לקוח", "Nombre del cliente", "Nome do cliente", "اسم العميل"),
  clientNameSample: row("[Client name]", "[שם לקוח]", "[Nombre del cliente]", "[Nome do cliente]", "[اسم العميل]"),
  sampleValue: row("[Value from file]", "[ערך מהתיק]", "[Valor del expediente]", "[Valor do arquivo]", "[قيمة من الملف]"),
  samplePerson: row("Jane Doe", "ישראל ישראלי", "Ana Pérez", "Ana Silva", "ليلى أحمد"),
  greeting: row("Hello, {{name}}", "שלום, {{name}}", "Hola, {{name}}", "Olá, {{name}}", "مرحباً، {{name}}"),
  greetingLabel: row("Hello, client name", "שלום, שם לקוח", "Hola, nombre del cliente", "Olá, nome do cliente", "مرحباً، اسم العميل"),
};

const PAGES = {
  home: row("Home page", "דף הבית", "Página de inicio", "Página inicial", "الصفحة الرئيسية"),
  pageN: row("Page {{n}}", "עמוד {{n}}", "Página {{n}}", "Página {{n}}", "صفحة {{n}}"),
};

const SCHEMA = {
  localBusiness: row("Local business", "עסק מקומי", "Negocio local", "Negócio local", "عمل محلي"),
  localBusinessDesc: row("Address, phone, and hours — powers the Google business card.", "כתובת, טלפון ושעות — מפעיל את כרטיס העסק בגוגל.", "Dirección, teléfono y horario — activa la ficha de Google.", "Endereço, telefone e horário — ativa o card do Google.", "العنوان والهاتف والساعات — يفعّل بطاقة العمل في جوجل."),
  service: row("Service", "שירות", "Servicio", "Serviço", "خدمة"),
  serviceDesc: row("A service the business provides, including price and service area.", "שירות שהעסק מספק, כולל מחיר ואזור שירות.", "Un servicio que ofrece el negocio, con precio y área.", "Um serviço que o negócio oferece, com preço e área.", "خدمة يقدمها العمل، مع السعر ومنطقة الخدمة."),
  faq: row("FAQ", "שאלות ותשובות", "Preguntas frecuentes", "Perguntas frequentes", "أسئلة وأجوبة"),
  faqDesc: row("A Q&A block that can appear directly in search results.", "בלוק שו״ת שיכול להופיע ישירות בתוצאות החיפוש.", "Un bloque de preguntas que puede aparecer en los resultados.", "Um bloco de perguntas que pode aparecer nos resultados.", "كتلة أسئلة يمكن أن تظهر في نتائج البحث."),
  product: row("Product", "מוצר", "Producto", "Produto", "منتج"),
  productDesc: row("A product with price and availability — rich results.", "מוצר עם מחיר וזמינות — תוצאות עשירות.", "Producto con precio y disponibilidad — resultados enriquecidos.", "Produto com preço e disponibilidade — resultados ricos.", "منتج بسعر وتوفر — نتائج غنية."),
  organization: row("Organization", "ארגון", "Organización", "Organização", "مؤسسة"),
  organizationDesc: row("Business identity, logo, and links. Recommended at the site level.", "זהות העסק, לוגו וקישורים. מומלץ ברמת האתר.", "Identidad, logo y enlaces. Recomendado a nivel de sitio.", "Identidade, logo e links. Recomendado no nível do site.", "هوية العمل والشعار والروابط. يُفضَّل على مستوى الموقع."),
  website: row("Website", "אתר אינטרנט", "Sitio web", "Site", "موقع"),
  websiteDesc: row("Site name and search box. Recommended at the site level.", "שם האתר ותיבת חיפוש. מומלץ ברמת האתר.", "Nombre del sitio y buscador. Recomendado a nivel de sitio.", "Nome do site e caixa de busca. Recomendado no nível do site.", "اسم الموقع ومربع البحث. يُفضَّل على مستوى الموقع."),
  websiteHint: row("Set WebSite once (on the home page). The site is currently single-language.", "מומלץ להגדיר WebSite פעם אחת (בדף הבית). האתר כרגע חד‑לשוני (he‑IL).", "Define WebSite una vez (en inicio). El sitio es actualmente monolingüe.", "Defina WebSite uma vez (na home). O site é atualmente monolíngue.", "عرّفي WebSite مرة واحدة (في الصفحة الرئيسية). الموقع حالياً أحادي اللغة."),
  breadcrumb: row("Breadcrumbs", "פירורי לחם", "Migas de pan", "Trilha de navegação", "مسار التنقل"),
  breadcrumbDesc: row("Navigation hierarchy that appears in search results.", "היררכיית ניווט שמופיעה בתוצאות החיפוש.", "Jerarquía de navegación en los resultados.", "Hierarquia de navegação nos resultados.", "تسلسل التنقل في نتائج البحث."),
  custom: row("Custom", "מותאם אישית", "Personalizado", "Personalizado", "مخصّص"),
  siteLevel: row("Site level", "רמת אתר", "Nivel de sitio", "Nível do site", "مستوى الموقع"),
  formMode: row("Form mode", "מצב טופס", "Modo formulario", "Modo formulário", "وضع النموذج"),
  manualJson: row("Manual JSON", "JSON ידני", "JSON manual", "JSON manual", "JSON يدوي"),
  internalName: row("Internal name (for identification)", "שם פנימי (לזיהוי)", "Nombre interno (identificación)", "Nome interno (identificação)", "اسم داخلي (للتعريف)"),
  manualEditHint: row("The code was edited manually. The form is hidden so it does not overwrite your changes. You can regenerate from the form below to return to form mode.", "הקוד נערך ידנית. הטופס מוסתר כדי לא לדרוס את השינויים. אפשר \"יצירה מחדש מהטופס\" בעורך למטה כדי לחזור למצב טופס.", "El código se editó a mano. El formulario está oculto para no sobrescribir. Puedes regenerarlo desde el formulario abajo.", "O código foi editado à mão. O formulário está oculto para não sobrescrever. Você pode regenerá-lo pelo formulário abaixo.", "تم تحرير الكود يدوياً. النموذج مخفي حتى لا يُستبدل. يمكنك إعادة إنشائه من النموذج أدناه."),
  customOnly: row("Custom schema — manual JSON editing only.", "Schema מותאם אישית — עריכה ידנית של ה‑JSON בלבד.", "Schema personalizado — solo edición manual de JSON.", "Schema personalizado — apenas edição manual de JSON.", "مخطط مخصّص — تحرير JSON يدوياً فقط."),
  cannotSave: row("Cannot save: {{summary}}", "לא ניתן לשמור: {{summary}}", "No se puede guardar: {{summary}}", "Não é possível salvar: {{summary}}", "تعذّر الحفظ: {{summary}}"),
  recommendedComplete: row("Recommended to complete: {{items}}", "מומלץ להשלים: {{items}}", "Recomendado completar: {{items}}", "Recomendado completar: {{items}}", "يُفضَّل إكمال: {{items}}"),
  saveSchema: row("Save schema", "שמירת Schema", "Guardar schema", "Salvar schema", "حفظ المخطط"),
  testGoogle: row("Test in Google", "בדיקה ב-Google", "Probar en Google", "Testar no Google", "اختبار في Google"),
  savedOnCard: row("Saved on the card — tap “Save” below to publish.", "נשמר בכרטיס — לחצי \"שמירה\" למטה כדי לפרסם.", "Guardado en la tarjeta — pulsa “Guardar” abajo para publicar.", "Salvo no cartão — toque em “Salvar” abaixo para publicar.", "حُفظ في البطاقة — انقري «حفظ» أدناه للنشر."),
  unsavedOnCard: row("There are unsaved changes on the card", "יש שינויים שלא נשמרו בכרטיס", "Hay cambios sin guardar en la tarjeta", "Há alterações não salvas no cartão", "هناك تغييرات غير محفوظة في البطاقة"),
  confirmAdvanced: row("Manual code editing switches to advanced mode. Later form changes may overwrite the manual code.\n\nContinue to advanced editing?", "עריכה ידנית של הקוד תעבור למצב מתקדם. שינויים עתידיים בטופס עלולים לדרוס את הקוד הידני.\n\nלהמשיך לעריכה מתקדמת?", "La edición manual pasa a modo avanzado. Cambios posteriores del formulario pueden sobrescribir el código.\n\n¿Continuar?", "A edição manual passa ao modo avançado. Alterações posteriores no formulário podem sobrescrever o código.\n\nContinuar?", "التحرير اليدوي ينتقل إلى الوضع المتقدم. قد تستبدل تغييرات النموذج لاحقاً الكود اليدوي.\n\nالمتابعة؟"),
  confirmRegenerate: row("This will replace the manual JSON with new code from the form data. Continue?", "הפעולה תחליף את קוד ה‑JSON הידני בקוד חדש לפי נתוני הטופס. להמשיך?", "Esto reemplazará el JSON manual con código nuevo del formulario. ¿Continuar?", "Isso substituirá o JSON manual por código novo do formulário. Continuar?", "سيستبدل هذا JSON اليدوي بكود جديد من بيانات النموذج. المتابعة؟"),
  jsonLdTitle: row("JSON-LD view and advanced editing", "תצוגת JSON-LD ועריכה מתקדמת", "Vista JSON-LD y edición avanzada", "Visualização JSON-LD e edição avançada", "عرض JSON-LD والتحرير المتقدم"),
  editedManually: row("Edited manually", "נערך ידנית", "Editado a mano", "Editado à mão", "حُرّر يدوياً"),
  autoFromForm: row("The code is generated automatically from the form. To edit it manually, tap “Switch to advanced editing”.", "הקוד נוצר אוטומטית מהטופס. כדי לערוך ידנית לחצו \"מעבר לעריכה מתקדמת\".", "El código se genera solo desde el formulario. Para editarlo, pulsa “Pasar a edición avanzada”.", "O código é gerado automaticamente do formulário. Para editar, toque em “Ir para edição avançada”.", "يُنشأ الكود تلقائياً من النموذج. للتحرير اليدوي انقري «الانتقال للتحرير المتقدم»."),
  switchAdvanced: row("Switch to advanced editing", "מעבר לעריכה מתקדמת", "Pasar a edición avanzada", "Ir para edição avançada", "الانتقال للتحرير المتقدم"),
  regenerateFromForm: row("Regenerate from the form", "יצירה מחדש מהטופס", "Regenerar desde el formulario", "Regenerar pelo formulário", "إعادة الإنشاء من النموذج"),
  format: row("Format", "פורמט", "Formato", "Formatar", "تنسيق"),
  copied: row("Copied", "הועתק", "Copiado", "Copiado", "تم النسخ"),
  copy: row("Copy", "העתקה", "Copiar", "Copiar", "نسخ"),
  jsonValid: row("JSON is valid", "JSON תקין", "JSON válido", "JSON válido", "JSON صالح"),
  question: row("Question", "שאלה", "Pregunta", "Pergunta", "سؤال"),
  questionPh: row("The question", "השאלה", "La pregunta", "A pergunta", "السؤال"),
  answerPh: row("The answer", "התשובה", "La respuesta", "A resposta", "الإجابة"),
  moveUp: row("Move up", "הזזה למעלה", "Subir", "Mover para cima", "تحريك لأعلى"),
  moveDown: row("Move down", "הזזה למטה", "Bajar", "Mover para baixo", "تحريك لأسفل"),
  duplicateQuestion: row("Duplicate question — change or delete it.", "שאלה כפולה — שנו או מחקו.", "Pregunta duplicada — cámbiala o elimínala.", "Pergunta duplicada — altere ou exclua.", "سؤال مكرر — غيّريه أو احذفيه."),
  addAtLeastOne: row("Add at least one question.", "הוסיפו לפחות שאלה אחת.", "Añade al menos una pregunta.", "Adicione pelo menos uma pergunta.", "أضيفي سؤالاً واحداً على الأقل."),
  addQuestion: row("Add a question", "הוספת שאלה", "Añadir pregunta", "Adicionar pergunta", "إضافة سؤال"),
  siteName: row("Site name", "שם האתר", "Nombre del sitio", "Nome do site", "اسم الموقع"),
  siteUrl: row("Website URL", "כתובת האתר", "URL del sitio", "URL do site", "رابط الموقع"),
  siteLanguage: row("Site language", "שפת האתר", "Idioma del sitio", "Idioma do site", "لغة الموقع"),
  siteOwner: row("Site owner", "בעל האתר", "Propietario del sitio", "Dono do site", "مالك الموقع"),
  enableSearch: row("Allow a site search box in Google results", "לאפשר תיבת חיפוש באתר בתוצאות גוגל", "Permitir un buscador del sitio en Google", "Permitir uma caixa de busca do site no Google", "السماح بمربع بحث الموقع في نتائج جوجل"),
  searchUrlTemplate: row("Search URL template", "תבנית כתובת חיפוש", "Plantilla de URL de búsqueda", "Modelo de URL de busca", "قالب رابط البحث"),
  searchTermHint: row("Must include {search_term_string}", "חייב להכיל {search_term_string}", "Debe incluir {search_term_string}", "Deve incluir {search_term_string}", "يجب أن يتضمن {search_term_string}"),
  exampleQuestion: row("Example question?", "שאלה לדוגמה?", "¿Pregunta de ejemplo?", "Pergunta de exemplo?", "سؤال تجريبي؟"),
  exampleAnswer: row("Example answer.", "תשובה לדוגמה.", "Respuesta de ejemplo.", "Resposta de exemplo.", "إجابة تجريبية."),
  jsonEmpty: row("JSON is empty", "ה‑JSON ריק", "El JSON está vacío", "O JSON está vazio", "JSON فارغ"),
  empty: row("Empty", "ריק", "Vacío", "Vazio", "فارغ"),
  jsonTooLong: row("JSON is too long", "ה‑JSON ארוך מדי", "El JSON es demasiado largo", "O JSON é longo demais", "JSON طويل جداً"),
  tooLong: row("Too long", "ארוך מדי", "Demasiado largo", "Longo demais", "طويل جداً"),
  invalidJson: row("Invalid JSON", "JSON לא תקין", "JSON no válido", "JSON inválido", "JSON غير صالح"),
  mustBeObject: row("The schema must be an object", "ה‑Schema חייב להיות אובייקט", "El schema debe ser un objeto", "O schema deve ser um objeto", "يجب أن يكون المخطط كائناً"),
  invalidStructure: row("Invalid structure", "מבנה לא תקין", "Estructura no válida", "Estrutura inválida", "هيكل غير صالح"),
  nameRequired: row("name (name)", "name (שם)", "name (nombre)", "name (nome)", "name (الاسم)"),
  productNameRequired: row("name (product name)", "name (שם המוצר)", "name (nombre del producto)", "name (nome do produto)", "name (اسم المنتج)"),
  validPriceInOffers: row("A valid price in offers", "מחיר תקין ב‑offers", "Un precio válido en offers", "Um preço válido em offers", "سعر صالح في offers"),
  atLeastOneQuestion: row("At least one question", "לפחות שאלה אחת", "Al menos una pregunta", "Pelo menos uma pergunta", "سؤال واحد على الأقل"),
  emptyQuestionAnswer: row("There is an empty question/answer", "יש שאלה/תשובה ריקה", "Hay una pregunta/respuesta vacía", "Há uma pergunta/resposta vazia", "هناك سؤال/إجابة فارغة"),
  duplicateQuestions: row("There are duplicate questions", "יש שאלות כפולות", "Hay preguntas duplicadas", "Há perguntas duplicadas", "هناك أسئلة مكررة"),
  atLeastOneItem: row("At least one item", "לפחות פריט אחד", "Al menos un elemento", "Pelo menos um item", "عنصر واحد على الأقل"),
  positionsNotSequential: row("Positions are not sequential", "מיקומים לא רציפים", "Las posiciones no son consecutivas", "As posições não são sequenciais", "المواضع غير متتالية"),
  invalidUrl: row("There is an invalid URL", "יש כתובת URL לא תקינה", "Hay una URL no válida", "Há uma URL inválida", "هناك رابط غير صالح"),
  missing: row("Missing: {{items}}", "חסר: {{items}}", "Falta: {{items}}", "Falta: {{items}}", "ناقص: {{items}}"),
  valid: row("Valid", "תקין", "Válido", "Válido", "صالح"),
};

const FORMS = {
  contactTitle: row("Contact form", "טופס יצירת קשר", "Formulario de contacto", "Formulário de contato", "نموذج تواصل"),
  submit: row("Send message", "שליחת הודעה", "Enviar mensaje", "Enviar mensagem", "إرسال رسالة"),
  success: row("Thank you! We received your inquiry and will get back to you soon.", "תודה! קיבלנו את הפנייה ונחזור אליך בהקדם.", "¡Gracias! Recibimos tu consulta y te responderemos pronto.", "Obrigado! Recebemos sua mensagem e retornaremos em breve.", "شكراً! استلمنا طلبك وسنعود إليك قريباً."),
  fullName: row("Full name", "שם מלא", "Nombre completo", "Nome completo", "الاسم الكامل"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  message: row("Message", "הודעה", "Mensaje", "Mensagem", "رسالة"),
  messagePh: row("How can we help?", "איך אפשר לעזור?", "¿Cómo podemos ayudar?", "Como podemos ajudar?", "كيف يمكننا المساعدة؟"),
  optionN: row("Option {{n}}", "אפשרות {{n}}", "Opción {{n}}", "Opção {{n}}", "خيار {{n}}"),
  chooseOption: row("Choose an option", "בחרו אפשרות", "Elige una opción", "Escolha uma opção", "اختاري خياراً"),
  clickToChooseFile: row("Click to choose a file", "לחצו לבחירת קובץ", "Pulsa para elegir un archivo", "Toque para escolher um arquivo", "انقري لاختيار ملف"),
  upload: row("Upload", "העלאה", "Subir", "Enviar", "رفع"),
  letsTalk: row("Let's talk", "בואו נדבר", "Hablemos", "Vamos conversar", "لنتحدث"),
  formEmpty: row("The form is still empty", "הטופס עדיין ריק", "El formulario aún está vacío", "O formulário ainda está vazio", "النموذج ما زال فارغاً"),
  addFieldsHint: row("Add fields from the form editor", "הוסיפו שדות מתוך עורך הטופס", "Añade campos desde el editor de formularios", "Adicione campos no editor de formulário", "أضيفي حقولاً من محرر النموذج"),
  formBadge: row("Form tag", "תגית טופס", "Etiqueta de formulario", "Etiqueta do formulário", "وسم النموذج"),
  weWouldLove: row("We would love to hear from you", "נשמח לשמוע מכם", "Nos encantará saber de ti", "Adoraríamos ouvir você", "يسعدنا سماعك"),
  formDescription: row("Form description", "תיאור טופס", "Descripción del formulario", "Descrição do formulário", "وصف النموذج"),
  leaveDetails: row("Leave your details and we will get back to you soon.", "השאירו פרטים ונחזור אליכם בהקדם.", "Deja tus datos y te responderemos pronto.", "Deixe seus dados e retornaremos em breve.", "اتركي بياناتك وسنعود إليك قريباً."),
};

const GSC_EXTRA = {
  siteAvailable: row("The public site is available", "האתר הציבורי זמין", "El sitio público está disponible", "O site público está disponível", "الموقع العام متاح"),
  robotsAvailable: row("robots.txt is available", "robots.txt זמין", "robots.txt está disponible", "robots.txt está disponível", "robots.txt متاح"),
  sitemapAvailable: row("sitemap.xml is available", "sitemap.xml זמין", "sitemap.xml está disponible", "sitemap.xml está disponível", "sitemap.xml متاح"),
  metaOnSite: row("The Meta verification code is on the site", "קוד אימות Meta נמצא באתר", "El código Meta está en el sitio", "O código Meta está no site", "رمز تحقق Meta موجود في الموقع"),
  fileOnSite: row("The verification file is available at the site address", "קובץ האימות זמין בכתובת האתר", "El archivo de verificación está en la dirección del sitio", "O arquivo de verificação está no endereço do site", "ملف التحقق متاح على عنوان الموقع"),
  noMetaCode: row("No Meta verification code is set", "לא הוגדר קוד אימות Meta", "No hay código Meta configurado", "Nenhum código Meta definido", "لم يُضبط رمز تحقق Meta"),
  metaInHtml: row("The verification code appears in the site HTML", "קוד האימות מופיע ב־HTML של האתר", "El código aparece en el HTML del sitio", "O código aparece no HTML do site", "رمز التحقق يظهر في HTML الموقع"),
  metaSavedNotLive: row("The code is saved here, but it is not on the public site yet — save and publish", "הקוד נשמר אצלנו, אבל עדיין לא מופיע באתר הציבורי — שמרו ופרסמו", "El código está guardado, pero aún no está en el sitio público — guarda y publica", "O código está salvo, mas ainda não está no site público — salve e publique", "الكود محفوظ لدينا لكنه لم يظهر بعد في الموقع العام — احفظي وانشري"),
  htmlReadFailed: row("We could not read the site HTML", "לא הצלחנו לקרוא את ה־HTML של האתר", "No pudimos leer el HTML del sitio", "Não conseguimos ler o HTML do site", "تعذّر قراءة HTML الموقع"),
  htmlCheckFailed: row("We could not check the site HTML", "לא הצלחנו לבדוק את ה־HTML של האתר", "No pudimos comprobar el HTML del sitio", "Não conseguimos verificar o HTML do site", "تعذّر فحص HTML الموقع"),
  noFileUploaded: row("No verification file was uploaded", "לא הועלה קובץ אימות", "No se subió un archivo de verificación", "Nenhum arquivo de verificação enviado", "لم يُرفع ملف تحقق"),
  fileAtUrl: row("The file is available at the site address ({{status}})", "הקובץ זמין בכתובת האתר ({{status}})", "El archivo está en la dirección del sitio ({{status}})", "O arquivo está no endereço do site ({{status}})", "الملف متاح على عنوان الموقع ({{status}})"),
  fileViaBizuply: row("The file is available through BizUply. If the check at the site address failed because of browser permissions — check the link manually.", "הקובץ זמין דרך BizUply. אם הבדיקה בכתובת האתר נכשלה בגלל הרשאות דפדפן — בדקו ידנית את הקישור.", "El archivo está disponible vía BizUply. Si la comprobación falló por permisos del navegador, revisa el enlace a mano.", "O arquivo está disponível via BizUply. Se a verificação falhou por permissões do navegador, confira o link manualmente.", "الملف متاح عبر BizUply. إذا فشل الفحص على عنوان الموقع بسبب صلاحيات المتصفح — راجعي الرابط يدوياً."),
  siteNotFound: row("The site was not found / is not published", "האתר לא נמצא / לא פורסם", "El sitio no se encontró / no está publicado", "O site não foi encontrado / não está publicado", "الموقع غير موجود / غير منشور"),
  unavailable: row("Unavailable", "לא זמין", "No disponible", "Indisponível", "غير متاح"),
};

const CANVAS = {
  deviceMobile: row("Mobile · {{px}}px", "מובייל · {{px}}px", "Móvil · {{px}}px", "Celular · {{px}}px", "جوال · {{px}}px"),
  deviceTablet: row("Tablet · {{px}}px", "טאבלט · {{px}}px", "Tableta · {{px}}px", "Tablet · {{px}}px", "لوحي · {{px}}px"),
  deviceDesktop: row("Desktop · {{px}}px", "דסקטופ · {{px}}px", "Escritorio · {{px}}px", "Desktop · {{px}}px", "سطح المكتب · {{px}}px"),
  dragElement: row("Drag element", "גרירת אלמנט", "Arrastrar elemento", "Arrastar elemento", "سحب العنصر"),
  missingComponent: row("No component was found for the template", "לא נמצא Component לתבנית", "No se encontró un componente para la plantilla", "Nenhum componente encontrado para o modelo", "لم يتم العثور على مكوّن للقالب"),
  checkRenderer: row("The renderer needs to be checked", "צריך לבדוק את renderer", "Hay que revisar el renderer", "É preciso verificar o renderer", "يلزم فحص العارض"),
};

const SEO_IMAGE = {
  uploadFailed: row("Image upload failed", "העלאת התמונה נכשלה", "La subida de la imagen falló", "O envio da imagem falhou", "فشل رفع الصورة"),
  noImage: row("No image", "אין תמונה", "Sin imagen", "Sem imagem", "لا توجد صورة"),
  uploading: row("Uploading...", "מעלה...", "Subiendo...", "Enviando...", "جارٍ الرفع..."),
  uploadFromComputer: row("Upload from computer", "העלאה מהמחשב", "Subir del ordenador", "Enviar do computador", "رفع من الجهاز"),
  removeImage: row("Remove image", "הסרת תמונה", "Quitar imagen", "Remover imagem", "إزالة الصورة"),
  formats: row("PNG, JPG, WEBP, or ICO", "PNG, JPG, WEBP או ICO", "PNG, JPG, WEBP o ICO", "PNG, JPG, WEBP ou ICO", "PNG أو JPG أو WEBP أو ICO"),
  orPasteUrl: row("Or paste a URL", "או הדביקי כתובת URL", "O pega una URL", "Ou cole uma URL", "أو الصقي رابط URL"),
};

const TEMPLATE_PREVIEW = {
  back: row("Back", "חזרה", "Volver", "Voltar", "رجوع"),
  edit: row("Edit", "עריכה", "Editar", "Editar", "تحرير"),
  useTemplate: row("Use template", "שימוש בתבנית", "Usar plantilla", "Usar modelo", "استخدام القالب"),
  notFound: row("Template not found", "התבנית לא נמצאה", "Plantilla no encontrada", "Modelo não encontrado", "القالب غير موجود"),
  notFoundHint: row("The selected template does not exist or is not registered in the templates folder.", "התבנית שנבחרה לא קיימת או לא רשומה בתיקיית התבניות.", "La plantilla seleccionada no existe o no está registrada.", "O modelo selecionado não existe ou não está registrado.", "القالب المحدد غير موجود أو غير مسجّل في مجلد القوالب."),
  backToTemplates: row("Back to templates", "חזרה לתבניות", "Volver a plantillas", "Voltar aos modelos", "العودة إلى القوالب"),
  noPreview: row("This template has no preview", "אין תצוגה מקדימה לתבנית", "Esta plantilla no tiene vista previa", "Este modelo não tem pré-visualização", "لا توجد معاينة لهذا القالب"),
};

const PLUGIN_STORE = {
  loadFailed: row("Failed to load the plugin store", "טעינת חנות התוספים נכשלה", "No se pudo cargar la tienda de plugins", "Falha ao carregar a loja de plugins", "فشل تحميل متجر الإضافات"),
  checkoutPortalFailed: row("Failed to open personal-area checkout", "פתיחת תשלום לאזור אישי נכשלה", "No se pudo abrir el pago del área personal", "Falha ao abrir o pagamento da área pessoal", "فشل فتح دفع المنطقة الشخصية"),
  checkoutPluginFailed: row("Failed to open plugin checkout", "פתיחת תשלום לתוסף נכשלה", "No se pudo abrir el pago del plugin", "Falha ao abrir o pagamento do plugin", "فشل فتح دفع الإضافة"),
  updateFailed: row("Failed to update the plugin", "עדכון התוסף נכשל", "No se pudo actualizar el plugin", "Falha ao atualizar o plugin", "فشل تحديث الإضافة"),
  title: row("Plugin store", "חנות תוספים", "Tienda de plugins", "Loja de plugins", "متجر الإضافات"),
  subtitle: row("Install plugins directly from the website editor", "התקינו תוספים ישירות מתוך עריכת האתר", "Instala plugins desde el editor del sitio", "Instale plugins direto no editor do site", "ثبّتي الإضافات مباشرة من محرر الموقع"),
  saveFirst: row("Save the site to open the plugin store", "שמרו את האתר כדי לפתוח את חנות התוספים", "Guarda el sitio para abrir la tienda de plugins", "Salve o site para abrir a loja de plugins", "احفظي الموقع لفتح متجر الإضافات"),
  loading: row("Loading plugin store...", "טוען חנות תוספים...", "Cargando la tienda de plugins...", "Carregando a loja de plugins...", "جارٍ تحميل متجر الإضافات..."),
};

const SECTION_LABELS = {
  header: row("Header", "כותרת עליונה", "Cabecera", "Cabeçalho", "ترويسة"),
  footer: row("Footer", "פוטר", "Pie de página", "Rodapé", "تذييل"),
  nav: row("Navigation", "ניווט", "Navegación", "Navegação", "تنقل"),
  hero: row("Opening area", "אזור פתיחה", "Área de apertura", "Área de abertura", "منطقة الافتتاح"),
  contact: row("Contact", "יצירת קשר", "Contacto", "Contato", "تواصل"),
  services: row("Services", "שירותים", "Servicios", "Serviços", "خدمات"),
  about: row("About", "אודות", "Acerca de", "Sobre", "حول"),
  projects: row("Projects", "פרויקטים", "Proyectos", "Projetos", "مشاريع"),
  block: row("Block", "בלוק", "Bloque", "Bloco", "كتلة"),
};

const ADD_LAYERS_EXTRA = {
  greetingPreview: row("Hello, [Client name]", "שלום, [שם לקוח]", "Hola, [Nombre del cliente]", "Olá, [Nome do cliente]", "مرحباً، [اسم العميل]"),
  blankKeyword: row("blank", "ריק", "vacío", "vazio", "فارغ"),
  editKeyword: row("edit", "עריכה", "editar", "editar", "تحرير"),
};

export function extraStudioLeftoverLocaleObject(locale) {
  return {
    studio: {
      upload: pickLocaleMap(UPLOAD, locale),
      defaults: pickLocaleMap(DEFAULTS, locale),
      pages: pickLocaleMap(PAGES, locale),
      schema: pickLocaleMap(SCHEMA, locale),
      forms: pickLocaleMap(FORMS, locale),
      gsc: pickLocaleMap(GSC_EXTRA, locale),
      canvas: pickLocaleMap(CANVAS, locale),
      seoImage: pickLocaleMap(SEO_IMAGE, locale),
      templatePreview: pickLocaleMap(TEMPLATE_PREVIEW, locale),
      pluginStore: pickLocaleMap(PLUGIN_STORE, locale),
      sectionLabels: pickLocaleMap(SECTION_LABELS, locale),
      addLayers: pickLocaleMap(ADD_LAYERS_EXTRA, locale),
    },
  };
}
