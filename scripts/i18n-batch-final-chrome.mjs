function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const PLUGIN_HELP = {
  fallbackDesc: row(
    "This plugin extends the website. After install you can configure it in the management panel.",
    "תוסף זה מרחיב את יכולות האתר. לאחר ההתקנה ניתן להגדיר אותו בפאנל הניהול.",
    "Este complemento amplía el sitio. Tras instalarlo puedes configurarlo en el panel.",
    "Este extra amplia o site. Depois de instalar, configure-o no painel.",
    "هذه الإضافة توسّع الموقع. بعد التثبيت يمكن ضبطها في لوحة الإدارة."
  ),
  closeHelpAria: row("Close plugin help", "סגירת עזרת תוסף", "Cerrar la ayuda del complemento", "Fechar a ajuda do extra", "إغلاق مساعدة الإضافة"),
  close: row("Close", "סגירה", "Cerrar", "Fechar", "إغلاق"),
  backStore: row("Back to store", "חזרה לחנות", "Volver a la tienda", "Voltar à loja", "العودة إلى المتجر"),
  activeSub: row("Active subscription", "מנוי פעיל", "Suscripción activa", "Assinatura ativa", "اشتراك نشط"),
  remove: row("Remove plugin", "הסרת תוסף", "Quitar complemento", "Remover extra", "إزالة الإضافة"),
  install: row("Install", "התקנה", "Instalar", "Instalar", "تثبيت"),
  about: row("About the plugin", "על התוסף", "Sobre el complemento", "Sobre o extra", "عن الإضافة"),
  examples: row("Usage examples", "דוגמאות שימוש", "Ejemplos de uso", "Exemplos de uso", "أمثلة استخدام"),
  details: row("Details", "פרטים", "Detalles", "Detalhes", "التفاصيل"),
  category: row("Category", "קטגוריה", "Categoría", "Categoria", "الفئة"),
  price: row("Price", "מחיר", "Precio", "Preço", "السعر"),
  futurePrice: row("Future price", "מחיר עתידי", "Precio futuro", "Preço futuro", "السعر المستقبلي"),
  afterInstall: row(
    "After install — settings are in the plugin management tab, and you add it to pages from the site editor → Plugins.",
    "לאחר ההתקנה — הגדרות בלשונית הניהול של התוסף, והוספה לעמודים דרך עורך האתר → תוספים.",
    "Tras instalar — ajustes en la pestaña del complemento, y se añade a páginas desde el editor → Complementos.",
    "Após instalar — configurações na aba do extra, e adicione-o às páginas no editor → Extras.",
    "بعد التثبيت — الإعدادات في تبويب إدارة الإضافة، وتُضاف للصفحات من المحرر → الإضافات."
  ),
};

const SITE_PAYMENTS = {
  loadError: row("Could not load payment providers", "שגיאה בטעינת ספקי התשלום", "No se pudieron cargar los proveedores", "Não foi possível carregar os provedores", "تعذّر تحميل مزودي الدفع"),
  connectedOk: row("{{name}} connected successfully", "{{name}} חובר בהצלחה", "{{name}} se conectó correctamente", "{{name}} ligado com sucesso", "تم ربط {{name}} بنجاح"),
  connectError: row("Could not connect the payment provider", "שגיאה בחיבור ספק התשלום", "No se pudo conectar el proveedor", "Não foi possível ligar o provedor", "تعذّر ربط مزود الدفع"),
  disconnectConfirm: row("Disconnect {{name}}?", "לנתק את {{name}}?", "¿Desconectar {{name}}?", "Desligar {{name}}?", "فصل {{name}}؟"),
  disconnectedOk: row("{{name}} disconnected successfully", "{{name}} נותק בהצלחה", "{{name}} se desconectó correctamente", "{{name}} desligado com sucesso", "تم فصل {{name}} بنجاح"),
  disconnectError: row("Could not disconnect the payment provider", "שגיאה בניתוק ספק התשלום", "No se pudo desconectar el proveedor", "Não foi possível desligar o provedor", "تعذّر فصل مزود الدفع"),
  loading: row("Loading payment providers...", "טוען ספקי תשלום...", "Cargando proveedores...", "Carregando provedores...", "جارٍ تحميل مزودي الدفع..."),
  title: row("Payments", "תשלומים", "Pagos", "Pagamentos", "المدفوعات"),
  description: row(
    "Connect checkout providers to the site. The live-site cart uses the connected provider you mark as primary (PayPal, Stripe, and more).",
    "חברו ספקי סליקה לאתר. הקופה באתר החי תשתמש בספק המחובר שסימנתם כראשי (PayPal, Stripe ועוד).",
    "Conecta proveedores de cobro. El carrito del sitio usará el proveedor principal (PayPal, Stripe y más).",
    "Ligue provedores de cobrança. O carrinho do site usará o provedor principal (PayPal, Stripe e mais).",
    "اربط مزودي التحصيل بالموقع. سلة الموقع الحي تستخدم المزود الرئيسي (PayPal وStripe وغيرها)."
  ),
  connectedToSite: row("{{name}} is connected to the site", "{{name}} מחובר לאתר", "{{name}} está conectado al sitio", "{{name}} está ligado ao site", "{{name}} متصل بالموقع"),
  stepAdd: row("1. Add products from the store / template to the live-site cart.", "1. הוסיפו מוצרים מהחנות / התבנית לסל באתר החי.", "1. Añade productos de la tienda / plantilla al carrito.", "1. Adicione produtos da loja / modelo ao carrinho.", "1. أضف منتجات من المتجر / القالب إلى سلة الموقع الحي."),
  stepCheckout: row("2. Click checkout — the cart opens with the connected provider.", "2. לחצו מעבר לתשלום — הקופה נפתחת לפי הספק המחובר.", "2. Pulsa pagar — la caja se abre con el proveedor conectado.", "2. Clique em pagar — a caixa abre com o provedor ligado.", "2. انقر للدفع — تُفتح الصندوق حسب المزود المتصل."),
  stepPay: row("3. The customer pays through {{name}}.", "3. הלקוח משלם דרך {{name}}.", "3. El cliente paga a través de {{name}}.", "3. O cliente paga através de {{name}}.", "3. يدفع العميل عبر {{name}}."),
};

const SITE_BOOKING = {
  title: row("Calendar and appointments", "יומן ותורים", "Calendario y citas", "Agenda e horários", "التقويم والمواعيد"),
  description: row(
    "Set business hours, services, and appointments — customers can book directly from the site.",
    "הגדירו שעות פעילות, שירותים ותורים — הלקוחות יוכלו להזמין תור ישירות מהאתר.",
    "Define horario, servicios y citas — los clientes pueden reservar desde el sitio.",
    "Defina horário, serviços e horários — os clientes podem marcar no site.",
    "حدّد ساعات العمل والخدمات والمواعيد — يمكن للعملاء الحجز من الموقع."
  ),
  board: row("Appointment board", "לוח תורים", "Tablero de citas", "Quadro de horários", "لوحة المواعيد"),
  services: row("Services", "שירותים", "Servicios", "Serviços", "الخدمات"),
  hours: row("Business hours", "שעות פעילות", "Horario", "Horário", "ساعات العمل"),
  hintBefore: row("Set hours and services here — the", "הגדירו כאן שעות ושירותים — סקשן", "Define horario y servicios aquí — la sección", "Defina horário e serviços aqui — a secção", "حدّد الساعات والخدمات هنا — قسم"),
  calendarSection: row("Appointment calendar", "יומן פגישות", "Calendario de citas", "Agenda de horários", "تقويم المواعيد"),
  hintMid: row("in the editor (", "בעורך (", "en el editor (", "no editor (", "في المحرر ("),
  openMonth: row("Open with monthly board", "פתיחה עם לוח חודשי", "Abrir con tablero mensual", "Abrir com quadro mensal", "فتح بلوحة شهرية"),
  hintAfter: row(") connects automatically to the CRM calendar, without a separate plugin.", ") מתחבר אוטומטית ליומן ה-CRM, בלי תוסף נפרד.", ") se conecta solo al calendario del CRM, sin un complemento aparte.", ") liga-se sozinha à agenda do CRM, sem um extra separado.", ") يتصل تلقائياً بتقويم CRM دون إضافة منفصلة."),
};

const SMART_FORMS = {
  loadError: row("Could not load the inbox", "לא ניתן לטעון את תיבת הפניות", "No se pudo cargar la bandeja", "Não foi possível carregar a caixa", "تعذّر تحميل صندوق الرسائل"),
  title: row("Smart Forms Pro", "טפסים חכמים Pro", "Formularios inteligentes Pro", "Formulários inteligentes Pro", "نماذج ذكية Pro"),
  description: row(
    "Inbox by form, including attached files. Basic forms stay in the builder.",
    "תיבת פניות לפי טופס, כולל קבצים שצורפו. הטפסים הבסיסיים נשארים בבילדר.",
    "Bandeja por formulario, con archivos. Los formularios básicos siguen en el editor.",
    "Caixa por formulário, com ficheiros. Os formulários básicos ficam no editor.",
    "صندوق حسب النموذج مع الملفات. النماذج الأساسية تبقى في المحرر."
  ),
  active: row("Plugin is active", "תוסף פעיל", "El complemento está activo", "O extra está ativo", "الإضافة نشطة"),
  trackByForm: row("Track by form", "מעקב לפי טופס", "Seguimiento por formulario", "Acompanhar por formulário", "تتبع حسب النموذج"),
  empty: row("No submissions from this site yet", "עדיין אין שליחות מהאתר הזה", "Aún no hay envíos de este sitio", "Ainda sem envios deste site", "لا توجد إرسالات من هذا الموقع بعد"),
  leadFromSite: row("Lead from the site", "ליד מהאתר", "Lead del sitio", "Lead do site", "عميل محتمل من الموقع"),
  files: row("Files:", "קבצים:", "Archivos:", "Ficheiros:", "ملفات:"),
  openCrm: row("Open in CRM", "פתיחה ב-CRM", "Abrir en CRM", "Abrir no CRM", "فتح في CRM"),
};

const STORE_ORDER = {
  new: row("New", "חדשה", "Nueva", "Nova", "جديدة"),
  pending_payment: row("Pending payment", "ממתינה לתשלום", "Pendiente de pago", "Aguardando pagamento", "بانتظار الدفع"),
  paid: row("Paid", "שולמה", "Pagada", "Paga", "مدفوعة"),
  processing: row("Processing", "בטיפול", "En proceso", "Em tratamento", "قيد المعالجة"),
  shipped: row("Shipped", "נשלחה", "Enviada", "Enviada", "أُرسلت"),
  completed: row("Completed", "הושלמה", "Completada", "Concluída", "مكتملة"),
  cancelled: row("Cancelled", "בוטלה", "Cancelada", "Cancelada", "ملغاة"),
};

const AI_TEMPLATE = {
  ai_lead_scoring: row("Automatic lead scoring", "דירוג לידים אוטומטי", "Puntuación automática de leads", "Pontuação automática de leads", "تقييم تلقائي للعملاء المحتملين"),
  ai_lead_classify: row("Automatic lead classification", "סיווג ליד אוטומטי", "Clasificación automática de leads", "Classificação automática de leads", "تصنيف تلقائي للعملاء المحتملين"),
  ai_lead_auto_tag: row("Automatic lead tagging", "תיוג אוטומטי של לידים", "Etiquetado automático de leads", "Etiquetagem automática de leads", "وسم تلقائي للعملاء المحتملين"),
  ai_hot_lead: row("Hot lead detection", "זיהוי לידים חמים", "Detección de leads calientes", "Deteção de leads quentes", "اكتشاف العملاء المحتملين الساخنين"),
  ai_lead_brief: row("Lead brief before a sales call", "סיכום ליד לפני שיחת מכירה", "Resumen del lead antes de la llamada", "Resumo do lead antes da chamada", "ملخص العميل المحتمل قبل مكالمة البيع"),
  ai_followup_draft: row("Follow-up draft", "ניסוח Follow-up", "Borrador de seguimiento", "Rascunho de follow-up", "مسودة متابعة"),
  ai_email_draft: row("Email draft", "ניסוח מייל", "Borrador de email", "Rascunho de e-mail", "مسودة بريد"),
  ai_next_action: row("Next-action suggestion", "הצעת הפעולה הבאה", "Sugerencia de siguiente acción", "Sugestão da próxima ação", "اقتراح الإجراء التالي"),
  ai_daily_leads_digest: row("Daily leads digest", "תקציר יומי לידים", "Resumen diario de leads", "Resumo diário de leads", "ملخص يومي للعملاء المحتملين"),
  ai_daily_agenda_digest: row("Daily tasks / meetings digest", "תקציר יומי משימות/פגישות", "Resumen diario de tareas/reuniones", "Resumo diário de tarefas/reuniões", "ملخص يومي للمهام/الاجتماعات"),
};

const PUSH_TOGGLE = {
  blocked: row("Blocked in browser / device settings", "חסום בהגדרות הדפדפן/המכשיר", "Bloqueado en el navegador / dispositivo", "Bloqueado no navegador / dispositivo", "محظور في إعدادات المتصفح/الجهاز"),
  onOther: row("Active on an installed device · {{count}} registered device", "פעיל במכשיר מותקן · {{count}} מכשיר רשום", "Activo en un dispositivo instalado · {{count}} dispositivo", "Ativo num dispositivo instalado · {{count}} dispositivo", "نشط على جهاز مثبت · {{count}} جهاز مسجّل"),
  unsupportedIos: row("Cannot enable from here — open Safari from the home-screen icon", "לא ניתן להפעיל מכאן — פתחו מ-Safari דרך האייקון במסך הבית", "No se puede activar aquí — ábrelo en Safari desde el icono de inicio", "Não dá para ativar daqui — abra no Safari pelo ícone na tela inicial", "لا يمكن التفعيل من هنا — افتح Safari من أيقونة الشاشة الرئيسية"),
  unsupported: row("This browser does not support Push", "הדפדפן הזה לא תומך ב-Push", "Este navegador no admite Push", "Este navegador não suporta Push", "هذا المتصفح لا يدعم الإشعارات"),
  onReady: row("On · {{count}} registered device", "מופעל · {{count}} מכשיר רשום", "Activado · {{count}} dispositivo", "Ativado · {{count}} dispositivo", "مفعّل · {{count}} جهاز مسجّل"),
  onUnbound: row("On on this device, but not registered on the server yet — tap Test", "מופעל במכשיר, אבל עדיין לא רשום בשרת — לחץ בדיקה", "Activado en el dispositivo, pero aún no registrado — pulsa Probar", "Ativado no dispositivo, mas ainda não registrado — toque em Testar", "مفعّل على الجهاز لكن غير مسجّل في الخادم — اضغط اختبار"),
  needRebind: row("Permission is granted, but this device is not registered — tap to re-register", "יש הרשאה, אבל אין רישום במכשיר — לחץ לרישום מחדש", "Hay permiso, pero el dispositivo no está registrado — pulsa para registrar de nuevo", "Há permissão, mas o dispositivo não está registrado — toque para registrar de novo", "هناك إذن لكن الجهاز غير مسجّل — اضغط لإعادة التسجيل"),
  off: row("Off — tap to enable phone notifications", "כבוי — לחץ להפעלה לקבלת התראות לטלפון", "Desactivado — pulsa para recibir avisos en el teléfono", "Desligado — toque para ativar avisos no celular", "إيقاف — اضغط للتفعيل واستلام التنبيهات على الهاتف"),
};

const INSTANT_FORM = {
  continue: row("Continue", "המשך", "Continuar", "Continuar", "متابعة"),
  submit: row("Submit", "שלח", "Enviar", "Enviar", "إرسال"),
  answerPh: row("Enter your answer", "הזן את תשובתך", "Escribe tu respuesta", "Escreva a sua resposta", "أدخل إجابتك"),
  contactInfo: row("Contact information", "פרטי התקשרות", "Información de contacto", "Informações de contato", "بيانات التواصل"),
  privacy: row("Privacy policy", "מדיניות פרטיות", "Política de privacidad", "Política de privacidade", "سياسة الخصوصية"),
  privacyShort: row("Privacy", "פרטיות", "Privacidad", "Privacidade", "الخصوصية"),
  privacyBody: row(
    "By continuing, you agree that {{name}} may contact you.",
    "הפרטים שתשלחו ישמשו ליצירת קשר עם {{name}}.",
    "Al continuar, aceptas que {{name}} pueda contactarte.",
    "Ao continuar, você aceita que {{name}} possa contatá-lo.",
    "بالمتابعة توافق أن يتواصل معك {{name}}."
  ),
  businessFallback: row("this business", "העסק", "este negocio", "este negócio", "هذا العمل"),
  thanks: row("Thanks!", "תודה!", "¡Gracias!", "Obrigado!", "شكراً!"),
  thanksBody: row("We’ll be in touch soon.", "ניצור איתכם קשר בהקדם.", "Nos pondremos en contacto pronto.", "Entraremos em contato em breve.", "سنتواصل معكم قريباً."),
  done: row("Done", "סיום", "Listo", "Concluído", "تم"),
  toSite: row("To the site", "לאתר", "Al sitio", "Para o site", "إلى الموقع"),
  quoteCta: row("Send a message to get a quote", "שלחו הודעה לקבלת הצעת מחיר", "Envía un mensaje para recibir presupuesto", "Envie uma mensagem para orçamento", "أرسل رسالة لطلب عرض سعر"),
};

const PLUGIN_GENERIC = {
  priceRange: row("₪{{min}}–{{max}}/month", "₪{{min}}–{{max}}/חודש", "₪{{min}}–{{max}}/mes", "₪{{min}}–{{max}}/mês", "₪{{min}}–{{max}}/شهر"),
  priceMonth: row("₪{{price}}/month", "₪{{price}}/חודש", "₪{{price}}/mes", "₪{{price}}/mês", "₪{{price}}/شهر"),
  included: row("Included in the plan", "כלול בחבילה", "Incluido en el plan", "Incluído no plano", "مشمول في الخطة"),
  installedSoon: row("Plugin installed — editor setup coming soon", "התוסף מותקן — הגדרה בעורך בקרוב", "Complemento instalado — ajustes en el editor pronto", "Extra instalado — definição no editor em breve", "الإضافة مثبتة — الإعداد في المحرر قريباً"),
  openEditor: row("Open in editor", "פתיחה בעורך", "Abrir en el editor", "Abrir no editor", "فتح في المحرر"),
};

const PLUGIN_FRAME = {
  manage: row("Plugin management", "ניהול תוסף", "Gestión del complemento", "Gestão do extra", "إدارة الإضافة"),
  addEditor: row("Add in editor", "הוספה בעורך", "Añadir en el editor", "Adicionar no editor", "إضافة في المحرر"),
  loading: row("Loading settings...", "טוען הגדרות...", "Cargando ajustes...", "Carregando configurações...", "جارٍ تحميل الإعدادات..."),
  savedSitewide: row("Changes are saved for the whole site", "שינויים נשמרים לכל האתר", "Los cambios se guardan en todo el sitio", "As alterações ficam para todo o site", "تُحفظ التغييرات لكل الموقع"),
  save: row("Save settings", "שמירת הגדרות", "Guardar ajustes", "Salvar configurações", "حفظ الإعدادات"),
};

const AI_RECS = {
  load: row("We could not load the recommendations. Try again.", "לא הצלחנו לטעון את ההמלצות. נסו שוב.", "No pudimos cargar las recomendaciones. Inténtalo de nuevo.", "Não foi possível carregar as recomendações. Tente de novo.", "تعذّر تحميل التوصيات. حاول مرة أخرى."),
  approve: row("We could not approve the recommendation. Try again.", "לא הצלחנו לאשר את ההמלצה. נסו שוב.", "No pudimos aprobar la recomendación. Inténtalo de nuevo.", "Não foi possível aprovar a recomendação. Tente de novo.", "تعذّر اعتماد التوصية. حاول مرة أخرى."),
  reject: row("We could not reject the recommendation. Try again.", "לא הצלחנו לדחות את ההמלצה. נסו שוב.", "No pudimos rechazar la recomendación. Inténtalo de nuevo.", "Não foi possível recusar a recomendação. Tente de novo.", "تعذّر رفض التوصية. حاول مرة أخرى."),
  saveDraft: row("We could not save the draft. Try again.", "לא הצלחנו לשמור את הטיוטה. נסו שוב.", "No pudimos guardar el borrador. Inténtalo de nuevo.", "Não foi possível guardar o rascunho. Tente de novo.", "تعذّر حفظ المسودة. حاول مرة أخرى."),
  saveApprove: row("We could not save and approve. Try again.", "לא הצלחנו לשמור ולאשר. נסו שוב.", "No pudimos guardar y aprobar. Inténtalo de nuevo.", "Não foi possível guardar e aprovar. Tente de novo.", "تعذّر الحفظ والاعتماد. حاول مرة أخرى."),
};

const PLUGIN_DEFAULTS = {
  clubName: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"),
  findService: row("Find the right service", "מצאו את השירות המתאים", "Encuentra el servicio adecuado", "Encontre o serviço certo", "اعثر على الخدمة المناسبة"),
  contactCta: row("Contact us", "צרו קשר", "Contactar", "Contactar", "تواصل معنا"),
  offline: row("We’ll get back to you during business hours", "נחזור אליכם בשעות הפעילות", "Te responderemos en horario laboral", "Responderemos no horário de funcionamento", "سنرد عليكم في ساعات العمل"),
};

const PLUGIN_SETTINGS = {
  loadError: row("Could not load settings", "שגיאה בטעינת הגדרות", "No se pudieron cargar los ajustes", "Não foi possível carregar as configurações", "تعذّر تحميل الإعدادات"),
  saved: row("Settings saved", "ההגדרות נשמרו", "Ajustes guardados", "Configurações salvas", "تم حفظ الإعدادات"),
  saveError: row("Could not save", "שגיאה בשמירה", "No se pudo guardar", "Não foi possível guardar", "تعذّر الحفظ"),
};

const AUDIENCE = {
  radiusDrawFail: row(
    "The city was selected, but we could not draw the radius on the map. Try another city or refresh.",
    "העיר נבחרה, אבל לא הצלחנו לצייר את הרדיוס במפה. נסו עיר אחרת או רעננו.",
    "Se eligió la ciudad, pero no pudimos dibujar el radio. Prueba otra o recarga.",
    "A cidade foi escolhida, mas não desenhámos o raio. Tente outra ou atualize.",
    "تم اختيار المدينة لكن تعذّر رسم النطاق على الخريطة. جرّب مدينة أخرى أو حدّث."
  ),
  hintPick: row(
    "Like Facebook: choose a city → add → set a radius only around that city",
    "כמו בפייסבוק: בחרו עיר ← הוסיפו ← הגדירו רדיוס רק סביב העיר הזו",
    "Como en Facebook: elige una ciudad → añade → define un radio solo alrededor",
    "Como no Facebook: escolha uma cidade → adicione → defina um raio só à volta",
    "مثل فيسبوك: اختر مدينة ← أضف ← حدّد نطاقاً حول تلك المدينة فقط"
  ),
  radiusAround: row("Real radius around {{name}}: {{km}} km", "רדיוס אמיתי סביב {{name}}: {{km}} ק״מ", "Radio real alrededor de {{name}}: {{km}} km", "Raio real em torno de {{name}}: {{km}} km", "نطاق حقيقي حول {{name}}: {{km}} كم"),
  addCityFirst: row("First search and add a city — then the radius appears around it on the map", "קודם חפשו והוסיפו עיר — ואז הרדיוס יופיע סביבה במפה", "Primero busca y añade una ciudad — luego verás el radio", "Primeiro pesquise e adicione uma cidade — depois o raio aparece", "ابحث أولاً وأضف مدينة — ثم يظهر النطاق حولها على الخريطة"),
  searchCity: row(
    "Search for a city (for example: Beer Sheva / Haifa) and add it — then set a radius around it",
    "חפשו עיר (לדוגמה: באר שבע / חיפה) והוסיפו — ואז הגדירו רדיוס סביבה",
    "Busca una ciudad (p. ej. Beer Sheva / Haifa) y añádela — luego define el radio",
    "Pesquise uma cidade (ex.: Beer Sheva / Haifa) e adicione — depois defina o raio",
    "ابحث عن مدينة (مثلاً بئر السبع / حيفا) وأضفها — ثم حدّد نطاقاً حولها"
  ),
  radiusExplain: row(
    "Like Facebook: the circle is a real km radius only around the selected city. Map zoom shows what is inside the radius.",
    "כמו בפייסבוק: העיגול הוא רדיוס אמיתי בק״מ רק סביב העיר שנבחרה. זום המפה מציג מה נכלל בתוך הרדיוס.",
    "Como en Facebook: el círculo es un radio real en km solo alrededor de la ciudad. El zoom muestra qué entra.",
    "Como no Facebook: o círculo é um raio real em km só à volta da cidade. O zoom mostra o que entra.",
    "مثل فيسبوك: الدائرة نطاق حقيقي بالكيلومتر حول المدينة المختارة. الزوم يُظهر ما يدخل فيه."
  ),
  noInterests: row("No Meta interests found for “{{query}}”", "לא נמצאו תחומי עניין במטא ל־“{{query}}”", "No hay intereses de Meta para “{{query}}”", "Sem interesses da Meta para “{{query}}”", "لا توجد اهتمامات في ميتا لـ “{{query}}”"),
};

const CHECKOUT_THEME = {
  classic: row("Classic", "קלאסי", "Clásico", "Clássico", "كلاسيكي"),
  violet: row("Brand purple", "סגול מותג", "Morado de marca", "Roxo da marca", "بنفسجي العلامة"),
  luxury: row("Luxury", "יוקרה", "Lujo", "Luxo", "فاخر"),
  emerald: row("Green", "ירוק", "Verde", "Verde", "أخضر"),
  rose: row("Pink", "ורוד", "Rosa", "Rosa", "وردي"),
};

const TEMPLATE_PREVIEW = {
  comingSoon: row("Template photo coming soon", "צילום תבנית בקרוב", "Foto de plantilla pronto", "Foto do modelo em breve", "صورة القالب قريباً"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Pré-visualização", "معاينة"),
  fullShot: row("Full template screenshot", "צילום מסך מלא של התבנית", "Captura completa de la plantilla", "Captura completa do modelo", "لقطة كاملة للقالب"),
  mySite: row("My website", "האתר שלי", "Mi sitio", "O meu site", "موقعي"),
  sitePreview: row("Website preview", "תצוגה מקדימה של האתר", "Vista previa del sitio", "Pré-visualização do site", "معاينة الموقع"),
  pluginPreview: row("{{name}} — preview", "{{name}} — תצוגה מקדימה", "{{name}} — vista previa", "{{name}} — pré-visualização", "{{name}} — معاينة"),
};

const CALENDAR = {
  noBusiness: row("We could not identify the business. Refresh the page.", "לא הצלחנו לזהות את העסק. רעננו את העמוד.", "No identificamos el negocio. Recarga la página.", "Não identificámos o negócio. Atualize a página.", "تعذّر التعرف على العمل. حدّث الصفحة."),
  noBusinessRetry: row("We could not identify the business. Refresh the page and try again.", "לא הצלחנו לזהות את העסק. רעננו את העמוד ונסו שוב.", "No identificamos el negocio. Recarga e inténtalo de nuevo.", "Não identificámos o negócio. Atualize e tente de novo.", "تعذّر التعرف على العمل. حدّث الصفحة وحاول مرة أخرى."),
};

const META_MAP = {
  realRadius: row("<br/>Real radius: {{km}} km around the city", "<br/>רדיוס אמיתי: {{km}} ק״מ סביב העיר", "<br/>Radio real: {{km}} km alrededor de la ciudad", "<br/>Raio real: {{km}} km em torno da cidade", "<br/>نطاق حقيقي: {{km}} كم حول المدينة"),
  wholeCountry: row("<br/>Whole country", "<br/>מדינה שלמה", "<br/>País completo", "<br/>País inteiro", "<br/>البلد بالكامل"),
  tooltip: row("{{name}} · {{km}} km radius", "{{name}} · רדיוס {{km}} ק״מ", "{{name}} · radio {{km}} km", "{{name}} · raio {{km}} km", "{{name}} · نطاق {{km}} كم"),
  aroundScale: row("Real radius around {{name}}: {{km}} km — the circle on the map is geographic scale", "רדיוס אמיתי סביב {{name}}: {{km}} ק״מ — העיגול במפה בקנה מידה גאוגרפי", "Radio real alrededor de {{name}}: {{km}} km — el círculo está a escala", "Raio real em torno de {{name}}: {{km}} km — o círculo está à escala", "نطاق حقيقي حول {{name}}: {{km}} كم — الدائرة على الخريطة بمقياس جغرافي"),
  locating: row("The city was selected, but there is still no point on the map. Looking up coordinates…", "העיר נבחרה, אבל עדיין אין נקודה על המפה. מנסים לאתר קואורדינטות…", "Se eligió la ciudad, pero aún no hay punto. Buscando coordenadas…", "A cidade foi escolhida, mas ainda sem ponto. A localizar coordenadas…", "تم اختيار المدينة لكن لا توجد نقطة بعد. جارٍ تحديد الإحداثيات…"),
};

const PROFILE = {
  loading: row("Loading...", "טוען...", "Cargando...", "Carregando...", "جارٍ التحميل..."),
};

const UPGRADE = {
  title: row("Upgrade subscription", "שדרוג מנוי", "Mejorar suscripción", "Atualizar assinatura", "ترقية الاشتراك"),
};

const ADS_LEAD = {
  failed: row("The action failed. Try again.", "הפעולה נכשלה. נסו שוב.", "La acción falló. Inténtalo de nuevo.", "A ação falhou. Tente de novo.", "فشلت العملية. حاول مرة أخرى."),
};

const WA_INBOX = {
  demoSend: row("Send a demo message — it is not sent to a real customer", "שלחו הודעת הדגמה — לא נשלחת ללקוח אמיתי", "Envía un mensaje de demo — no se envía a un cliente real", "Envie uma mensagem de demo — não vai a um cliente real", "أرسل رسالة تجريبية — لا تُرسل لعميل حقيقي"),
};

const WA_BILLING = {
  loadError: row("We could not load WhatsApp billing data right now.", "לא הצלחנו לטעון את נתוני חיוב וואטסאפ כרגע.", "No pudimos cargar la facturación de WhatsApp ahora.", "Não foi possível carregar o faturamento do WhatsApp agora.", "تعذّر تحميل بيانات فوترة واتساب الآن."),
};

const WA_OTP = {
  body: row("{{1}} is your verification code.", "{{1}} הוא קוד האימות שלכם.", "{{1}} es tu código de verificación.", "{{1}} é o seu código de verificação.", "{{1}} هو رمز التحقق الخاص بكم."),
  footer: row("For security, do not share this code.", "למען האבטחה, אל תשתפו את הקוד הזה.", "Por seguridad, no compartas este código.", "Por segurança, não partilhe este código.", "لأمانكم لا تشاركوا هذا الرمز."),
};

const SESSION_FIELDS = {
  tabDesc: row("Personal values from the fields defined in CRM", "ערכים אישיים לפי השדות שהוגדרו ב-CRM", "Valores personales según los campos del CRM", "Valores pessoais segundo os campos do CRM", "قيم شخصية حسب الحقول المعرّفة في CRM"),
};

const COLLAB_PROFILE = {
  waNotify: row("WhatsApp notification number (E.164)", "מספר התראות WhatsApp (E.164)", "Número de avisos de WhatsApp (E.164)", "Número de avisos WhatsApp (E.164)", "رقم تنبيهات واتساب (E.164)"),
};

const AUTOSAVE = {
  saved: row("Saved", "נשמר", "Guardado", "Salvo", "تم الحفظ"),
  saving: row("Saving...", "שומר...", "Guardando...", "Salvando...", "جارٍ الحفظ..."),
  error: row("Save failed", "השמירה נכשלה", "Error al guardar", "Falha ao salvar", "فشل الحفظ"),
  offline: row("No connection — changes will save when you are back online", "אין חיבור — השינויים יישמרו כשיחזור", "Sin conexión — se guardará al volver", "Sem conexão — será salvo ao voltar", "لا اتصال — سيُحفظ عند العودة"),
  retry: row("Try again", "נסה שוב", "Reintentar", "Tentar de novo", "حاول مرة أخرى"),
};

const STORE_PANEL = {
  closeAria: row("Close store management", "סגירת ניהול חנות", "Cerrar la gestión de la tienda", "Fechar a gestão da loja", "إغلاق إدارة المتجر"),
  title: row("Store management", "ניהול חנות", "Gestión de la tienda", "Gestão da loja", "إدارة المتجر"),
  subtitle: row("Products, inventory, orders, and settings", "מוצרים, מלאי, הזמנות והגדרות", "Productos, stock, pedidos y ajustes", "Produtos, estoque, pedidos e ajustes", "منتجات ومخزون وطلبات وإعدادات"),
  missingBusiness: row("No business ID was found for store management", "לא נמצא מזהה עסק לניהול החנות", "No se encontró el ID del negocio", "Não encontramos o ID do negócio", "لم يُعثر على معرّف العمل"),
  missingHint: row("Refresh the editor or open the site from the dashboard", "רעננו את העורך או פתחו את האתר מתוך לוח הבקרה", "Actualiza el editor o abre el sitio desde el panel", "Atualize o editor ou abra o site pelo painel", "حدّث المحرر أو افتح الموقع من لوحة التحكم"),
};

const APP_ERROR = {
  title: row("A temporary error occurred", "אירעה שגיאה זמנית", "Ocurrió un error temporal", "Ocorreu um erro temporário", "حدث خطأ مؤقت"),
  body: row("We could not load the page. Refresh and try again.", "לא הצלחנו לטעון את העמוד. רעננו ונסו שוב.", "No pudimos cargar la página. Actualiza e inténtalo de nuevo.", "Não foi possível carregar a página. Atualize e tente de novo.", "تعذّر تحميل الصفحة. حدّث وحاول مرة أخرى."),
  refresh: row("Refresh the page", "רענון העמוד", "Actualizar la página", "Atualizar a página", "تحديث الصفحة"),
};

const WA_HISTORY = {
  metaId: row("Meta message ID: {{id}}", "מזהה הודעה במטא: {{id}}", "ID de mensaje de Meta: {{id}}", "ID da mensagem na Meta: {{id}}", "معرّف رسالة ميتا: {{id}}"),
};

export function extraFinalChromeLocaleObject(locale) {
  return {
    leftover: {
      pluginHelp: pickLocaleMap(PLUGIN_HELP, locale),
      sitePayments: pickLocaleMap(SITE_PAYMENTS, locale),
      siteBooking: pickLocaleMap(SITE_BOOKING, locale),
      smartForms: pickLocaleMap(SMART_FORMS, locale),
      storeOrder: pickLocaleMap(STORE_ORDER, locale),
      aiTemplate: pickLocaleMap(AI_TEMPLATE, locale),
      pushToggle: pickLocaleMap(PUSH_TOGGLE, locale),
      instantForm: pickLocaleMap(INSTANT_FORM, locale),
      pluginGeneric: pickLocaleMap(PLUGIN_GENERIC, locale),
      pluginFrame: pickLocaleMap(PLUGIN_FRAME, locale),
      aiRecs: pickLocaleMap(AI_RECS, locale),
      pluginDefaults: pickLocaleMap(PLUGIN_DEFAULTS, locale),
      pluginSettings: pickLocaleMap(PLUGIN_SETTINGS, locale),
      audience: pickLocaleMap(AUDIENCE, locale),
      checkoutTheme: pickLocaleMap(CHECKOUT_THEME, locale),
      templatePreview: pickLocaleMap(TEMPLATE_PREVIEW, locale),
      calendar: pickLocaleMap(CALENDAR, locale),
      metaMap: pickLocaleMap(META_MAP, locale),
      profile: pickLocaleMap(PROFILE, locale),
      upgrade: pickLocaleMap(UPGRADE, locale),
      adsLead: pickLocaleMap(ADS_LEAD, locale),
      waInbox: pickLocaleMap(WA_INBOX, locale),
      waBilling: pickLocaleMap(WA_BILLING, locale),
      waOtp: pickLocaleMap(WA_OTP, locale),
      sessionFields: pickLocaleMap(SESSION_FIELDS, locale),
      collabProfile: pickLocaleMap(COLLAB_PROFILE, locale),
      waHistory: pickLocaleMap(WA_HISTORY, locale),
      autosave: pickLocaleMap(AUTOSAVE, locale),
      storePanel: pickLocaleMap(STORE_PANEL, locale),
      appError: pickLocaleMap(APP_ERROR, locale),
    },
  };
}
