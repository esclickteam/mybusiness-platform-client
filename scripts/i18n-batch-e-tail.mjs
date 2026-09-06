function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const ERRORS = {
  portalArea: row("Personal area error", "שגיאה באזור האישי", "Error en el área personal", "Erro na área pessoal", "خطأ في المنطقة الشخصية"),
  loadMembers: row("Could not load members", "שגיאה בטעינת חברים", "No se pudieron cargar los miembros", "Não foi possível carregar os membros", "تعذّر تحميل الأعضاء"),
  createMember: row("Could not create the member", "שגיאה ביצירת חבר", "No se pudo crear el miembro", "Não foi possível criar o membro", "تعذّر إنشاء العضو"),
  updateMember: row("Could not update the member", "שגיאה בעדכון חבר", "No se pudo actualizar el miembro", "Não foi possível atualizar o membro", "تعذّر تحديث العضو"),
  deleteMember: row("Could not delete the member", "שגיאה במחיקת חבר", "No se pudo eliminar el miembro", "Não foi possível eliminar o membro", "تعذّر حذف العضو"),
  createInvite: row("Could not create the invitation", "שגיאה ביצירת הזמנה", "No se pudo crear la invitación", "Não foi possível criar o convite", "تعذّر إنشاء الدعوة"),
  siteNotFound: row("The site was not found or is not published yet", "האתר לא נמצא או עדיין לא פורסם", "El sitio no se encontró o aún no está publicado", "O site não foi encontrado ou ainda não foi publicado", "الموقع غير موجود أو لم يُنشر بعد"),
  loadSite: row("Could not load the site", "שגיאה בטעינת האתר", "No se pudo cargar el sitio", "Não foi possível carregar o site", "تعذّر تحميل الموقع"),
  siteUnavailable: row("The site is not available yet", "האתר עדיין לא זמין", "El sitio aún no está disponible", "O site ainda não está disponível", "الموقع غير متاح بعد"),
  siteDomainMissing: row("We could not find a published site for this domain:", "לא מצאנו אתר מפורסם עבור הדומיין:", "No encontramos un sitio publicado para este dominio:", "Não encontrámos um site publicado para este domínio:", "لم نجد موقعاً منشوراً لهذا النطاق:"),
  reauth: row("Please sign in again", "יש להתחבר מחדש", "Vuelve a iniciar sesión", "Inicie sessão novamente", "يرجى تسجيل الدخول مرة أخرى"),
  network: row("Network problem — check your connection", "בעיית רשת — בדקו את החיבור", "Problema de red — revisa la conexión", "Problema de rede — verifique a ligação", "مشكلة شبكة — تحققوا من الاتصال"),
  loadData: row("Could not load the data", "שגיאה בטעינת הנתונים", "No se pudieron cargar los datos", "Não foi possível carregar os dados", "تعذّر تحميل البيانات"),
  connectDomain: row("Domain connection failed", "חיבור הדומיין נכשל", "Falló la conexión del dominio", "A ligação do domínio falhou", "فشل ربط النطاق"),
  disconnectDomain: row("Domain disconnect failed", "ניתוק הדומיין נכשל", "Falló la desconexión del dominio", "A desligação do domínio falhou", "فشل فصل النطاق"),
  previewWrites: row("Automation write actions are blocked in Preview", "פעולות כתיבה באוטומציות חסומות בסביבת Preview", "Las escrituras de automatización están bloqueadas en Preview", "As escritas de automação estão bloqueadas no Preview", "عمليات الكتابة في الأتمتة محظورة في Preview"),
  previewAction: row("This action is not available in Preview", "הפעולה אינה זמינה בסביבת Preview", "Esta acción no está disponible en Preview", "Esta ação não está disponível no Preview", "هذا الإجراء غير متاح في Preview"),
  checkoutUnavailable: row("Could not open the payment screen right now", "לא ניתן לפתוח את מסך התשלום כרגע", "No se pudo abrir el pago ahora", "Não foi possível abrir o pagamento agora", "تعذّر فتح شاشة الدفع الآن"),
  tryAgainSoon: row("Something went wrong. Try again in a moment", "אירעה שגיאה, נסה שוב בעוד רגע", "Algo falló. Inténtalo en un momento", "Algo falhou. Tente daqui a pouco", "حدث خطأ. حاول بعد لحظة"),
  signFail: row("Could not create the upload signature", "יצירת חתימת העלאה נכשלה", "No se pudo crear la firma de subida", "Não foi possível criar a assinatura de envio", "تعذّر إنشاء توقيع الرفع"),
  signMissing: row("Upload signature details are missing", "חסרים פרטי חתימה להעלאה", "Faltan los datos de la firma de subida", "Faltam os dados da assinatura de envio", "بيانات توقيع الرفع ناقصة"),
  uploadRetry: row("The file upload failed. Try again.", "העלאת הקובץ נכשלה. נסו שוב.", "La subida falló. Inténtalo de nuevo.", "O envio falhou. Tente de novo.", "فشل رفع الملف. حاولوا مرة أخرى."),
  uploadFailed: row("The file upload failed", "העלאת הקובץ נכשלה", "La subida del archivo falló", "O envio do ficheiro falhou", "فشل رفع الملف"),
  uploadStart: row("The upload cannot start right now. Try again.", "לא ניתן להתחיל את ההעלאה כרגע. נסו שוב.", "No se puede iniciar la subida ahora. Inténtalo de nuevo.", "Não dá para iniciar o envio agora. Tente de novo.", "لا يمكن بدء الرفع الآن. حاولوا مرة أخرى."),
  mediaUploading: row(
    "An image or video is still uploading. Wait for it to finish and try again.",
    "יש תמונה או וידאו שעדיין לא סיימו לעלות. המתיני לסיום ההעלאה ונסי שוב.",
    "Aún se está subiendo una imagen o un video. Espera y vuelve a intentarlo.",
    "Ainda há uma imagem ou vídeo a enviar. Espere e tente de novo.",
    "ما زالت صورة أو فيديو تُرفع. انتظروا حتى تنتهي ثم حاولوا مرة أخرى."
  ),
  mediaUploadingShort: row(
    "Media is still uploading. Wait for it to finish and try again.",
    "יש מדיה שעדיין עולה. המתיני לסיום ההעלאה ונסי שוב.",
    "Aún se está subiendo media. Espera y vuelve a intentarlo.",
    "Ainda há média a enviar. Espere e tente de novo.",
    "ما زالت الوسائط تُرفع. انتظروا حتى تنتهي ثم حاولوا مرة أخرى."
  ),
  publishFailed: row("Publish failed", "הפרסום נכשל", "La publicación falló", "A publicação falhou", "فشل النشر"),
  saveFailed: row("Save failed", "השמירה נכשלה", "Error al guardar", "Falha ao salvar", "فشل الحفظ"),
  chatConnect: row("We could not connect to chat. Try again.", "לא הצלחנו להתחבר לצ׳אט. נסו שוב.", "No pudimos conectar el chat. Inténtalo de nuevo.", "Não ligámos o chat. Tente de novo.", "تعذّر الاتصال بالدردشة. حاولوا مرة أخرى."),
  emailInvalid: row("Enter a valid email address", "יש להזין כתובת אימייל תקינה", "Introduce un email válido", "Introduza um e-mail válido", "أدخلوا عنوان بريد صالح"),
  newNotification: row("New notification", "התראה חדשה", "Nueva notificación", "Nova notificação", "تنبيه جديد"),
  newPush: row("You have a new notification", "יש לך התראה חדשה", "Tienes una notificación nueva", "Tem uma notificação nova", "لديكم تنبيه جديد"),
  refreshOrSupport: row("Refresh the page. If it continues, contact support.", "נסו לרענן את העמוד. אם הבעיה נמשכת, פנו לתמיכה.", "Actualiza la página. Si sigue, contacta con soporte.", "Atualize a página. Se continuar, contacte o suporte.", "حدّثوا الصفحة. إن استمر الأمر تواصلوا مع الدعم."),
};

const SCHEMA = {
  deleteConfirm: row('Delete the schema "{{name}}"?', 'למחוק את ה‑Schema "{{name}}"?', '¿Eliminar el schema "{{name}}"?', 'Eliminar o schema "{{name}}"?', 'حذف المخطط "{{name}}"؟'),
  copyName: row("{{name}} (copy)", "{{name}} (עותק)", "{{name}} (copia)", "{{name}} (cópia)", "{{name}} (نسخة)"),
  maxReached: row("You reached the maximum number of schemas for this page.", "הגעת למספר המרבי של סכימות לעמוד.", "Llegaste al máximo de schemas de esta página.", "Chegou ao máximo de schemas desta página.", "وصلتم إلى الحد الأقصى من المخططات لهذه الصفحة."),
  singletonConfirm: row(
    'A "{{type}}" schema already exists on this page. One is recommended. Add another anyway?',
    'כבר קיים Schema מסוג "{{type}}" בעמוד. מומלץ אחד בלבד. להוסיף בכל זאת?',
    'Ya hay un schema "{{type}}" en la página. Se recomienda uno. ¿Añadir otro?',
    'Já existe um schema "{{type}}" na página. Recomenda-se um. Adicionar outro?',
    'يوجد بالفعل مخطط "{{type}}" في الصفحة. يُفضّل واحد فقط. إضافة آخر؟'
  ),
  pickType: row("Choose a schema type to add", "בחרו סוג Schema להוספה", "Elige un tipo de schema", "Escolha um tipo de schema", "اختاروا نوع مخطط لإضافته"),
  pageList: row("Schemas on this page ({{count}})", "הסכימות בעמוד ({{count}})", "Schemas en esta página ({{count}})", "Schemas nesta página ({{count}})", "المخططات في هذه الصفحة ({{count}})"),
  empty: row("No schemas yet. Choose a type above — we will build a form and ready JSON-LD.", "אין עדיין סכימות. בחרו סוג למעלה — נבנה עבורכם טופס וקוד JSON-LD מוכן.", "Aún no hay schemas. Elige un tipo arriba — crearemos el formulario y el JSON-LD.", "Ainda sem schemas. Escolha um tipo acima — criamos o formulário e o JSON-LD.", "لا توجد مخططات بعد. اختاروا نوعاً أعلاه — سنبني النموذج وJSON-LD."),
  displayName: row("Display name", "שם התצוגה", "Nombre visible", "Nome de apresentação", "اسم العرض"),
  moveUp: row("Move up", "למעלה", "Subir", "Subir", "أعلى"),
  moveDown: row("Move down", "למטה", "Bajar", "Descer", "أسفل"),
  delete: row("Delete", "מחיקה", "Eliminar", "Eliminar", "حذف"),
  breadcrumbHint: row("Steps were created from the site structure. You can change the name, URL, and order.", "השלבים נוצרו אוטומטית לפי מבנה האתר. אפשר לשנות שם, כתובת וסדר.", "Los pasos se crearon según la estructura. Puedes cambiar nombre, URL y orden.", "Os passos foram criados pela estrutura. Pode alterar nome, URL e ordem.", "أُنشئت الخطوات حسب هيكل الموقع. يمكن تغيير الاسم والرابط والترتيب."),
  addStep: row("Add step", "הוספת שלב", "Añadir paso", "Adicionar passo", "إضافة خطوة"),
  valid: row("Valid", "תקין", "Válido", "Válido", "صالح"),
  missingRecommended: row("Recommended fields are missing", "חסרים שדות מומלצים", "Faltan campos recomendados", "Faltam campos recomendados", "حقول موصى بها ناقصة"),
  needsFix: row("Needs a fix", "לתיקון", "Hay que corregir", "Precisa de correção", "يحتاج تصحيحاً"),
  home: row("Home", "דף הבית", "Inicio", "Início", "الصفحة الرئيسية"),
  page: row("Page", "עמוד", "Página", "Página", "صفحة"),
};

const NAV = {
  home: row("Home", "ראשי", "Inicio", "Início", "الرئيسية"),
  services: row("Services", "שירותים", "Servicios", "Serviços", "الخدمات"),
  gallery: row("Work", "עבודות", "Trabajos", "Trabalhos", "أعمال"),
  pricing: row("Pricing", "מחירים", "Precios", "Preços", "الأسعار"),
  contact: row("Contact", "צור קשר", "Contacto", "Contacto", "تواصل"),
  main: row("Main navigation", "ניווט ראשי", "Navegación principal", "Navegação principal", "التنقل الرئيسي"),
  menu: row("Menu", "תפריט", "Menú", "Menu", "القائمة"),
  page: row("Page", "עמוד", "Página", "Página", "صفحة"),
};

const STUDIO_CHROME = {
  livePreview: row("Live site preview", "תצוגת אתר חיה", "Vista previa en vivo", "Pré-visualização ao vivo", "معاينة الموقع الحي"),
  canvasActive: row("Canvas active", "Canvas פעיל", "Canvas activo", "Canvas ativo", "اللوحة نشطة"),
  freeEdit: row("Free editing", "עריכה חופשית", "Edición libre", "Edição livre", "تحرير حر"),
  font: row("Font", "גופן", "Fuente", "Fonte", "الخط"),
  templateView: row("Template preview", "תצוגת תבנית", "Vista de plantilla", "Vista do modelo", "عرض القالب"),
  sections: row("{{count}} sections", "{{count}} סקשנים", "{{count}} secciones", "{{count}} secções", "{{count}} أقسام"),
  imageVideo: row("Image / video", "תמונה / וידאו", "Imagen / video", "Imagem / vídeo", "صورة / فيديو"),
  noMedia: row("No media", "אין מדיה", "Sin media", "Sem média", "لا وسائط"),
  link: row("Link", "קישור", "Enlace", "Ligação", "رابط"),
  section: row("Section", "סקשן", "Sección", "Secção", "قسم"),
  text: row("Text", "טקסט", "Texto", "Texto", "نص"),
};

const COUNTDOWN = {
  title: row("Countdown", "ספירה לאחור", "Cuenta atrás", "Contagem decrescente", "عدّ تنازلي"),
  plugin: row("Bizuply plugin", "תוסף Bizuply", "Complemento Bizuply", "Extra Bizuply", "إضافة Bizuply"),
  dragHint: row("Drag and resize in the editor", "גררו ושנו גודל בעורך", "Arrastra y cambia el tamaño en el editor", "Arraste e redimensione no editor", "اسحبوا وغيّروا الحجم في المحرر"),
};

const PUSH_BANNER = {
  alreadyActive: row("Notifications are already active from the home-screen icon.", "ההתראות כבר פעילות מהאייקון במסך הבית.", "Las notificaciones ya están activas desde el icono de inicio.", "As notificações já estão ativas pelo ícone no ecrã inicial.", "التنبيهات نشطة بالفعل من أيقونة الشاشة الرئيسية."),
  iosSafari: row(
    "On iPhone, Push works only from Safari after adding to the home screen, then opening from the icon. Chrome/Edge on iPhone are not supported.",
    "באייפון Push עובד רק מ-Safari אחרי הוספה למסך הבית, ואז פתיחה מהאייקון. Chrome/Edge באייפון לא תומכים.",
    "En iPhone, Push solo funciona en Safari tras añadirlo a inicio y abrirlo desde el icono. Chrome/Edge no son compatibles.",
    "No iPhone, o Push só funciona no Safari depois de adicionar ao ecrã inicial e abrir pelo ícone. Chrome/Edge não são suportados.",
    "على آيفون تعمل الإشعارات فقط من Safari بعد الإضافة للشاشة الرئيسية ثم الفتح من الأيقونة. Chrome/Edge غير مدعومين."
  ),
  unsupported: row(
    "This browser does not support Push notifications. Try an updated Chrome / Edge / Firefox.",
    "הדפדפן לא תומך בהתראות Push. נסה/י Chrome / Edge / Firefox מעודכן.",
    "Este navegador no admite Push. Prueba Chrome / Edge / Firefox actualizado.",
    "Este navegador não suporta Push. Tente Chrome / Edge / Firefox atualizado.",
    "هذا المتصفح لا يدعم إشعارات الدفع. جرّبوا Chrome / Edge / Firefox محدّثاً."
  ),
  iosInstall: row(
    "On iPhone you must add BizUply to the home screen (Safari → Share → Add to Home Screen) and then open it from the icon — otherwise phone Push will not work.",
    "באייפון חייבים להתקין את BizUply למסך הבית (Safari → שיתוף → הוסף למסך הבית) ואז לפתוח מהאייקון — אחרת Push לטלפון לא יעבוד.",
    "En iPhone hay que añadir BizUply a inicio (Safari → Compartir → Añadir a pantalla de inicio) y abrirlo desde el icono.",
    "No iPhone deve adicionar o BizUply ao ecrã inicial (Safari → Partilhar → Adicionar ao ecrã inicial) e abrir pelo ícone.",
    "على آيفون يجب تثبيت BizUply على الشاشة الرئيسية (Safari → مشاركة → إضافة إلى الشاشة الرئيسية) ثم الفتح من الأيقونة."
  ),
};

const HOURS = {
  loading: row("Loading...", "טוען...", "Cargando...", "A carregar...", "جارٍ التحميل..."),
  noneSet: row("Hours are not set — add them to book meetings", "לא הוגדרו שעות — הגדר כדי לתאם פגישות", "No hay horario — defínelo para concertar citas", "Sem horário — defina para marcar reuniões", "لم تُحدَّد ساعات — أضيفوها لتنسيق الاجتماعات"),
  openDays: row("{{count}} working days", "{{count}} ימי פעילות", "{{count}} días laborables", "{{count}} dias de atividade", "{{count}} أيام عمل"),
};

const PROFILE = {
  logo: row("Business logo", "לוגו העסק", "Logo del negocio", "Logótipo do negócio", "شعار العمل"),
  businessName: row("Business name", "שם העסק", "Nombre del negocio", "Nome do negócio", "اسم العمل"),
  editProfile: row("Edit profile", "ערוך פרופיל", "Editar perfil", "Editar perfil", "تعديل الملف"),
  myMessages: row("My messages", "ההודעות שלי", "Mis mensajes", "As minhas mensagens", "رسائلي"),
};

const TIME_PICKER = {
  start: row("Start time:", "שעת התחלה:", "Hora de inicio:", "Hora de início:", "وقت البداية:"),
  end: row("End time:", "שעת סיום:", "Hora de fin:", "Hora de fim:", "وقت النهاية:"),
};

const EDITABLE = {
  save: row("Save", "שמור", "Guardar", "Guardar", "حفظ"),
  saved: row("Saved", "נשמר", "Guardado", "Salvo", "تم الحفظ"),
};

const FORM_PRO = {
  previous: row("Previous", "הקודם", "Anterior", "Anterior", "السابق"),
  next: row("Next", "הבא", "Siguiente", "Seguinte", "التالي"),
  stepN: row("Step {{n}}", "שלב {{n}}", "Paso {{n}}", "Passo {{n}}", "الخطوة {{n}}"),
};

const CHAT = {
  openAssistant: row("Open the Bizuply smart assistant", "פתיחת העוזר החכם של Bizuply", "Abrir el asistente inteligente de Bizuply", "Abrir o assistente inteligente da Bizuply", "فتح مساعد Bizuply الذكي"),
};

const WHEEL = {
  title: row("Benefits wheel", "גלגל ההטבות", "Ruleta de beneficios", "Roda de benefícios", "عجلة المزايا"),
  subtitle: row("Spin and see what you won!", "סובבו וגלו מה זכיתם!", "¡Gira y descubre lo que ganaste!", "Gire e veja o que ganhou!", "أديروا واكتشفوا ما ربحتم!"),
  trigger: row("Benefits wheel", "גלגל הטבות", "Ruleta de beneficios", "Roda de benefícios", "عجلة المزايا"),
  sale10: row("10% off", "10% הנחה", "10% de descuento", "10% de desconto", "خصم 10%"),
  freeShip: row("Free shipping", "משלוח חינם", "Envío gratis", "Envio grátis", "شحن مجاني"),
  gift: row("Gift", "מתנה", "Regalo", "Presente", "هدية"),
  sale20: row("20% off", "20% הנחה", "20% de descuento", "20% de desconto", "خصم 20%"),
  upgrade: row("Free upgrade", "שדרוג חינם", "Mejora gratis", "Upgrade grátis", "ترقية مجانية"),
  tryAgain: row("Try again", "נסו שוב", "Inténtalo de nuevo", "Tente de novo", "حاولوا مرة أخرى"),
};

export function extraETailLocaleObject(locale) {
  return {
    leftover: {
      errors: pickLocaleMap(ERRORS, locale),
      schema: pickLocaleMap(SCHEMA, locale),
      nav: pickLocaleMap(NAV, locale),
      studioChrome: pickLocaleMap(STUDIO_CHROME, locale),
      countdown: pickLocaleMap(COUNTDOWN, locale),
      pushBanner: pickLocaleMap(PUSH_BANNER, locale),
      hours: pickLocaleMap(HOURS, locale),
      profile: pickLocaleMap(PROFILE, locale),
      timePicker: pickLocaleMap(TIME_PICKER, locale),
      editable: pickLocaleMap(EDITABLE, locale),
      formPro: pickLocaleMap(FORM_PRO, locale),
      chat: pickLocaleMap(CHAT, locale),
      wheel: pickLocaleMap(WHEEL, locale),
    },
  };
}
