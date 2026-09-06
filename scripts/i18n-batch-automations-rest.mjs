function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const RUNS_DETAIL = {
  title: row("Run details", "פרטי הרצה", "Detalles de la ejecución", "Detalhes da execução", "تفاصيل التشغيل"),
  loadError: row("Could not load run details", "לא ניתן לטעון את פרטי ההרצה", "No se pudieron cargar los detalles", "Não foi possível carregar os detalhes", "تعذّر تحميل تفاصيل التشغيل"),
  loading: row("Loading run details...", "טוען פרטי הרצה...", "Cargando detalles...", "Carregando detalhes...", "جارٍ تحميل التفاصيل..."),
  loadFailed: row("Could not load the run", "לא ניתן לטעון את ההרצה", "No se pudo cargar la ejecución", "Não foi possível carregar a execução", "تعذّر تحميل التشغيل"),
  notFound: row("The run was not found.", "ההרצה לא נמצאה.", "No se encontró la ejecución.", "A execução não foi encontrada.", "لم يُعثر على التشغيل."),
  ended: row("Ended", "סיום", "Fin", "Término", "الانتهاء"),
  mode: row("Mode", "מצב", "Modo", "Modo", "الوضع"),
  modeTest: row("Test", "בדיקה", "Prueba", "Teste", "اختبار"),
  modeLive: row("Live", "חי", "En vivo", "Ao vivo", "مباشر"),
  failure: row("Failure", "כשלון", "Fallo", "Falha", "فشل"),
  failedStep: row("Step: {{label}}", "שלב: {{label}}", "Paso: {{label}}", "Etapa: {{label}}", "الخطوة: {{label}}"),
  runFailed: row("The run failed", "ההרצה נכשלה", "La ejecución falló", "A execução falhou", "فشل التشغيل"),
  noErrorDetails: row("No error details", "אין פרטי שגיאה", "Sin detalles del error", "Sem detalhes do erro", "لا تفاصيل للخطأ"),
  openAutomation: row("Open automation", "פתח אוטומציה", "Abrir automatización", "Abrir automação", "فتح الأتمتة"),
  flowTitle: row("Run timeline", "מהלך ההרצה", "Recorrido de la ejecución", "Percurso da execução", "مسار التشغيل"),
  flowHint: row(
    "Read-only view — you cannot edit the automation from here",
    "תצוגה לקריאה בלבד — לא ניתן לערוך את האוטומציה מכאן",
    "Solo lectura — no se puede editar desde aquí",
    "Somente leitura — não é possível editar daqui",
    "عرض للقراءة فقط — لا يمكن التعديل من هنا"
  ),
  noSteps: row("No steps are available for this run.", "אין שלבים זמינים עבור הרצה זו.", "No hay pasos para esta ejecución.", "Não há etapas para esta execução.", "لا خطوات لهذا التشغيل."),
  stepDetails: row("Step details", "פרטי שלב", "Detalles del paso", "Detalhes da etapa", "تفاصيل الخطوة"),
  clearSelection: row("Clear selection", "נקה בחירה", "Quitar selección", "Limpar seleção", "مسح التحديد"),
  name: row("Name", "שם", "Nombre", "Nome", "الاسم"),
  stepError: row("Step error", "שגיאת שלב", "Error del paso", "Erro da etapa", "خطأ الخطوة"),
  input: row("Input", "Input", "Entrada", "Entrada", "إدخال"),
  output: row("Output", "Output", "Salida", "Saída", "إخراج"),
};

const SCHEDULE = {
  frequency: row("Frequency", "תדירות", "Frecuencia", "Frequência", "التكرار"),
  everyMinutes: row("Every X minutes", "כל X דקות", "Cada X minutos", "A cada X minutos", "كل X دقائق"),
  everyHours: row("Every X hours", "כל X שעות", "Cada X horas", "A cada X horas", "كل X ساعات"),
  daily: row("Daily", "יומי", "Diario", "Diário", "يومي"),
  weekly: row("Weekly", "שבועי", "Semanal", "Semanal", "أسبوعي"),
  everyNMinutes: row("Every how many minutes", "כל כמה דקות", "Cada cuántos minutos", "A cada quantos minutos", "كل كم دقيقة"),
  minMinutes: row("Minimum {{count}} minutes", "מינימום {{count}} דקות", "Mínimo {{count}} minutos", "Mínimo {{count}} minutos", "الحد الأدنى {{count}} دقائق"),
  everyNHours: row("Every how many hours", "כל כמה שעות", "Cada cuántas horas", "A cada quantas horas", "كل كم ساعة"),
  timeOfDay: row("Run time", "שעת הפעלה", "Hora de ejecución", "Horário de execução", "وقت التشغيل"),
  weekdays: row("Days of the week", "ימים בשבוע", "Días de la semana", "Dias da semana", "أيام الأسبوع"),
  activeDaysOptional: row("Active days (optional)", "ימי פעילות (אופציונלי)", "Días activos (opcional)", "Dias ativos (opcional)", "أيام النشاط (اختياري)"),
  limitHours: row("Limit active hours", "הגבלת שעות פעילות", "Limitar horas activas", "Limitar horas ativas", "تقييد ساعات النشاط"),
  from: row("From", "מ־", "Desde", "De", "من"),
  until: row("Until", "עד", "Hasta", "Até", "حتى"),
  timezone: row("Time zone", "אזור זמן", "Zona horaria", "Fuso horário", "المنطقة الزمنية"),
  timezoneIsrael: row("Asia/Jerusalem (Israel)", "Asia/Jerusalem (ישראל)", "Asia/Jerusalem (Israel)", "Asia/Jerusalem (Israel)", "آسيا/القدس (إسرائيل)"),
  day0: row("Sun", "א׳", "Dom", "Dom", "أحد"),
  day1: row("Mon", "ב׳", "Lun", "Seg", "اثن"),
  day2: row("Tue", "ג׳", "Mar", "Ter", "ثلث"),
  day3: row("Wed", "ד׳", "Mié", "Qua", "أرب"),
  day4: row("Thu", "ה׳", "Jue", "Qui", "خمي"),
  day5: row("Fri", "ו׳", "Vie", "Sex", "جمع"),
  day6: row("Sat", "ש׳", "Sáb", "Sáb", "سبت"),
};

const AI_RESULTS = {
  subtitle: row(
    "AI automation result history for the business — kept even after notifications are deleted.",
    "היסטוריית תוצאות אוטומציות AI לעסק — נשמרות גם אחרי מחיקת התראות.",
    "Historial de resultados de IA — se conserva aunque se borren avisos.",
    "Histórico de resultados de IA — mantido mesmo após apagar avisos.",
    "سجل نتائج أتمتة الذكاء — يُحفظ حتى بعد حذف الإشعارات."
  ),
  filterLeads: row("Leads", "לידים", "Leads", "Leads", "العملاء المحتملون"),
  filterDrafts: row("Drafts", "טיוטות", "Borradores", "Rascunhos", "مسودات"),
  filterDigests: row("Digests", "תקצירים", "Resúmenes", "Resumos", "ملخصات"),
  filterTasks: row("Tasks", "משימות", "Tareas", "Tarefas", "مهام"),
  searchPlaceholder: row("Search by lead, template, or text", "חיפוש לפי ליד, תבנית או טקסט", "Buscar por lead, plantilla o texto", "Buscar por lead, modelo ou texto", "بحث بالعميل أو القالب أو النص"),
  loading: row("Loading results...", "טוען תוצאות...", "Cargando resultados...", "Carregando resultados...", "جارٍ تحميل النتائج..."),
  empty: row("No AI results to show yet.", "אין עדיין תוצאות AI להצגה.", "Aún no hay resultados de IA.", "Ainda não há resultados de IA.", "لا نتائج ذكاء بعد."),
  completed: row("Completed", "הושלם", "Completado", "Concluído", "اكتمل"),
  lead: row("Lead: {{name}}", "ליד: {{name}}", "Lead: {{name}}", "Lead: {{name}}", "عميل محتمل: {{name}}"),
  linkedTask: row("Linked task", "משימה מקושרת", "Tarea vinculada", "Tarefa vinculada", "مهمة مرتبطة"),
  openTarget: row("Open target", "פתח יעד", "Abrir destino", "Abrir destino", "فتح الهدف"),
};

const FLOW = {
  billedAction: row("⚡ 1 action", "⚡ 1 פעולה", "⚡ 1 acción", "⚡ 1 ação", "⚡ إجراء واحد"),
  aiAction: row("Automation action", "פעולת אוטומציה", "Acción de automatización", "Ação de automação", "إجراء أتمتة"),
  waCostTitle: row("₪0.20 per WhatsApp message", "0.20 ₪ להודעת WhatsApp", "₪0.20 por mensaje de WhatsApp", "₪0,20 por mensagem de WhatsApp", "0.20 ₪ لكل رسالة واتساب"),
  waCost: row("💬 ₪0.20", "💬 0.20 ₪", "💬 ₪0.20", "💬 R$ 0,20", "💬 0.20 ₪"),
};

const EMAIL_FIELDS = {
  availableVars: row("Available variables", "משתנים זמינים", "Variables disponibles", "Variáveis disponíveis", "المتغيرات المتاحة"),
  varsHint: row(
    "Click to insert into the focused field (subject, HTML, or text)",
    "לחצו כדי להוסיף לשדה המסומן (נושא, HTML או טקסט)",
    "Clic para insertar en el campo activo (asunto, HTML o texto)",
    "Clique para inserir no campo ativo (assunto, HTML ou texto)",
    "انقر للإدراج في الحقل المحدد (الموضوع أو HTML أو النص)"
  ),
  subject: row("Subject", "נושא", "Asunto", "Assunto", "الموضوع"),
  html: row("Content (HTML)", "תוכן (HTML)", "Contenido (HTML)", "Conteúdo (HTML)", "المحتوى (HTML)"),
  plainText: row("Plain text (optional)", "טקסט פשוט (אופציונלי)", "Texto plano (opcional)", "Texto simples (opcional)", "نص عادي (اختياري)"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Pré-visualização", "معاينة"),
  fromLine: row("From: {{value}}", "מ: {{value}}", "De: {{value}}", "De: {{value}}", "من: {{value}}"),
  toLine: row("To: {{value}}", "אל: {{value}}", "Para: {{value}}", "Para: {{value}}", "إلى: {{value}}"),
  subjectLine: row("Subject: {{value}}", "נושא: {{value}}", "Asunto: {{value}}", "Assunto: {{value}}", "الموضوع: {{value}}"),
  emptyPreview: row("No content to preview yet", "אין עדיין תוכן להצגה", "Aún no hay contenido", "Ainda não há conteúdo", "لا محتوى للمعاينة بعد"),
  subjectPh: row("Message from {{token}}", "הודעה מ{{token}}", "Mensaje de {{token}}", "Mensagem de {{token}}", "رسالة من {{token}}"),
  htmlPh: row('<div dir="rtl"><p>Hello {{token}}</p></div>', '<div dir="rtl"><p>שלום {{token}}</p></div>', '<div dir="rtl"><p>Hola {{token}}</p></div>', '<div dir="rtl"><p>Olá {{token}}</p></div>', '<div dir="rtl"><p>مرحباً {{token}}</p></div>'),
  textPh: row("Plain-text version without HTML", "גרסת טקסט ללא HTML", "Versión de texto sin HTML", "Versão em texto sem HTML", "نسخة نصية بدون HTML"),
  varDuration: row("Appointment duration", "משך הפגישה", "Duración de la cita", "Duração do horário", "مدة الموعد"),
  varLocation: row("Location", "מיקום", "Ubicación", "Local", "الموقع"),
  varNotes: row("Notes", "הערות", "Notas", "Notas", "ملاحظات"),
  varFirstName: row("First name", "שם פרטי", "Nombre", "Primeiro nome", "الاسم الأول"),
  varOrderNumber: row("Order number", "מספר הזמנה", "Número de pedido", "Número do pedido", "رقم الطلب"),
  varOrderTotal: row("Total", "סה״כ", "Total", "Total", "الإجمالي"),
  varOrderItems: row("Items", "פריטים", "Artículos", "Itens", "عناصر"),
  varShippingAddress: row("Shipping address", "כתובת משלוח", "Dirección de envío", "Endereço de entrega", "عنوان الشحن"),
  varStoreName: row("Store name", "שם החנות", "Nombre de la tienda", "Nome da loja", "اسم المتجر"),
  varCustomerEmail: row("Customer email", "אימייל לקוח", "Email del cliente", "E-mail do cliente", "بريد العميل"),
  varCustomerPhone: row("Customer phone", "טלפון לקוח", "Teléfono del cliente", "Telefone do cliente", "هاتف العميل"),
  varProductName: row("Product name", "שם מוצר", "Nombre del producto", "Nome do produto", "اسم المنتج"),
  varVariant: row("Variant", "וריאנט", "Variante", "Variante", "المتغير"),
  varQuantity: row("Quantity", "כמות", "Cantidad", "Quantidade", "الكمية"),
  varSubtotal: row("Subtotal", "סכום ביניים", "Subtotal", "Subtotal", "المجموع الفرعي"),
  varDiscount: row("Discount", "הנחה", "Descuento", "Desconto", "خصم"),
  varShipping: row("Shipping", "משלוח", "Envío", "Frete", "الشحن"),
  varTax: row("Tax", "מס", "Impuesto", "Imposto", "ضريبة"),
  varOrderUrl: row("Order link", "קישור הזמנה", "Enlace del pedido", "Link do pedido", "رابط الطلب"),
};

const LIST = {
  actionsAria: row("Actions", "פעולות", "Acciones", "Ações", "إجراءات"),
  edit: row("Edit", "עריכה", "Editar", "Editar", "تعديل"),
  duplicate: row("Duplicate", "שכפול", "Duplicar", "Duplicar", "تكرار"),
  delete: row("Delete", "מחיקה", "Eliminar", "Excluir", "حذف"),
  name: row("Automation name", "שם האוטומציה", "Nombre de la automatización", "Nome da automação", "اسم الأتمتة"),
  lastRun: row("Last run", "הרצה אחרונה", "Última ejecución", "Última execução", "آخر تشغيل"),
  lastResult: row("Last result", "תוצאה אחרונה", "Último resultado", "Último resultado", "آخر نتيجة"),
  unnamed: row("Untitled automation", "אוטומציה ללא שם", "Automatización sin nombre", "Automação sem nome", "أتمتة بلا اسم"),
  statusFailed: row("Error", "שגיאה", "Error", "Erro", "خطأ"),
  statusArchived: row("Archived", "ארכיון", "Archivada", "Arquivada", "مؤرشفة"),
  resultNone: row("None yet", "אין עדיין", "Aún no", "Ainda não", "لا يوجد بعد"),
  resultRunning: row("Running", "רצה", "En curso", "Em execução", "قيد التشغيل"),
};

const EDITOR_PAGE = {
  unidentified: row("We could not identify the business. Refresh the page.", "לא הצלחנו לזהות את העסק. רעננו את העמוד.", "No pudimos identificar el negocio. Actualiza la página.", "Não foi possível identificar o negócio. Atualize a página.", "تعذّر التعرف على العمل. حدّث الصفحة."),
  loading: row("Loading automation...", "טוען אוטומציה...", "Cargando automatización...", "Carregando automação...", "جارٍ تحميل الأتمتة..."),
  notFound: row("Automation not found", "לא נמצאה אוטומציה", "Automatización no encontrada", "Automação não encontrada", "لم يُعثر على الأتمتة"),
  notFoundHint: row("The automation may have been deleted or you do not have permission to view it.", "ייתכן שהאוטומציה נמחקה או שאין הרשאה לצפייה.", "Puede haberse eliminado o no tienes permiso.", "Pode ter sido excluída ou você não tem permissão.", "ربما حُذفت أو ليست لديك صلاحية العرض."),
  backToList: row("Back to the list", "חזרה לרשימה", "Volver a la lista", "Voltar à lista", "العودة إلى القائمة"),
  loadError: row("Could not load the automation", "לא ניתן לטעון את האוטומציה", "No se pudo cargar la automatización", "Não foi possível carregar a automação", "تعذّر تحميل الأتمتة"),
};

const ESTIMATE = {
  title: row("Monthly usage estimate", "הערכת שימוש חודשי", "Estimación de uso mensual", "Estimativa de uso mensal", "تقدير الاستخدام الشهري"),
  line: row(
    "Up to {{actions}} actions per run · ≈ {{runs}} runs per month",
    "עד {{actions}} פעולות להרצה · ≈ {{runs}} הרצות בחודש",
    "Hasta {{actions}} acciones por ejecución · ≈ {{runs}} al mes",
    "Até {{actions}} ações por execução · ≈ {{runs}} por mês",
    "حتى {{actions}} إجراءً لكل تشغيل · ≈ {{runs}} تشغيلاً شهرياً"
  ),
  total: row("Estimate: {{count}} actions per month", "הערכה: {{count}} פעולות בחודש", "Estimación: {{count}} acciones al mes", "Estimativa: {{count}} ações por mês", "التقدير: {{count}} إجراءً شهرياً"),
  ofLimit: row(" of {{limit}}", " מתוך {{limit}}", " de {{limit}}", " de {{limit}}", " من {{limit}}"),
  ofLimitNamed: row(" of {{limit}} ({{plan}})", " מתוך {{limit}} ({{plan}})", " de {{limit}} ({{plan}})", " de {{limit}} ({{plan}})", " من {{limit}} ({{plan}})"),
  overPlan: row("The estimate exceeds the current plan quota", "ההערכה חורגת ממכסת החבילה הנוכחית", "La estimación supera la cuota del plan", "A estimativa ultrapassa a cota do plano", "التقدير يتجاوز حصة الخطة الحالية"),
  considerHigher: row("Consider a higher plan", "מומלץ לשקול חבילה גבוהה יותר", "Conviene un plan superior", "Considere um plano maior", "يُفضّل خطة أعلى"),
  recommended: row(
    "Recommended: {{plan}} · {{count}} actions per month",
    "מומלץ: {{plan}} · {{count}} פעולות בחודש",
    "Recomendado: {{plan}} · {{count}} acciones al mes",
    "Recomendado: {{plan}} · {{count}} ações por mês",
    "موصى به: {{plan}} · {{count}} إجراءً شهرياً"
  ),
  exceedsAll: row(
    "The estimate is higher than every available plan — consider lowering the frequency.",
    "ההערכה גבוהה מכל החבילות הזמינות — כדאי להקטין את התדירות.",
    "Supera todos los planes — baja la frecuencia.",
    "É maior que todos os planos — reduza a frequência.",
    "أعلى من كل الخطط المتاحة — خفّض التكرار."
  ),
  viewPlans: row("View plans", "צפייה בחבילות", "Ver planes", "Ver planos", "عرض الخطط"),
  estimateOnlyNoUpgrade: row("This is an estimate only — there is no automatic upgrade.", "זו הערכה בלבד — אין שדרוג אוטומטי.", "Solo es una estimación — no hay mejora automática.", "É só uma estimativa — não há upgrade automático.", "هذا تقدير فقط — لا ترقية تلقائية."),
  estimateNote: row(
    "Estimate only, based on the most expensive path and the selected frequency.",
    "הערכה בלבד לפי המסלול היקר ביותר והתדירות שנבחרה.",
    "Solo estimación según la ruta más cara y la frecuencia.",
    "Só estimativa pelo caminho mais caro e a frequência.",
    "تقدير فقط حسب المسار الأعلى تكلفة والتكرار المحدد."
  ),
};

const BILLING_CANCEL = {
  stayActive: row(
    "The plan stays active until the end of the current billing period.",
    "החבילה תישאר פעילה עד סוף תקופת החיוב הנוכחית.",
    "El plan sigue activo hasta el final del período actual.",
    "O plano permanece ativo até o fim do período atual.",
    "تبقى الخطة نشطة حتى نهاية فترة الفوترة الحالية."
  ),
  afterCancel: row(
    "After that, automations will not be able to start new actions until a new plan is chosen.",
    "לאחר מכן אוטומציות לא יוכלו להתחיל פעולות חדשות עד לבחירת חבילה חדשה.",
    "Después no podrán iniciar acciones nuevas hasta elegir un plan.",
    "Depois não poderão iniciar novas ações até escolher um plano.",
    "بعد ذلك لن تبدأ الأتمتة إجراءات جديدة حتى اختيار خطة جديدة."
  ),
  periodEnd: row("End of period: {{date}}", "סוף התקופה: {{date}}", "Fin del período: {{date}}", "Fim do período: {{date}}", "نهاية الفترة: {{date}}"),
  confirm: row("Cancel the plan", "ביטול החבילה", "Cancelar el plan", "Cancelar o plano", "إلغاء الخطة"),
  toastWithDate: row(
    "The plan will cancel at the end of the billing period ({{date}})",
    "החבילה תבוטל בסוף תקופת החיוב ({{date}})",
    "Se cancelará al final del período ({{date}})",
    "Será cancelado no fim do período ({{date}})",
    "ستُلغى الخطة في نهاية فترة الفوترة ({{date}})"
  ),
  toast: row(
    "The plan will cancel at the end of the billing period",
    "החבילה תבוטל בסוף תקופת החיוב",
    "Se cancelará al final del período",
    "Será cancelado no fim do período",
    "ستُلغى الخطة في نهاية فترة الفوترة"
  ),
  error: row(
    "We could not cancel the plan right now. Try again.",
    "לא הצלחנו לבטל את החבילה כרגע. נסו שוב.",
    "No pudimos cancelar el plan. Inténtalo de nuevo.",
    "Não foi possível cancelar o plano. Tente de novo.",
    "تعذّر إلغاء الخطة الآن. حاول مرة أخرى."
  ),
};

const BILLING_CHECKOUT = {
  received: row("Payment received", "התשלום התקבל", "Pago recibido", "Pagamento recebido", "تم استلام الدفع"),
  updating: row("Updating the automations plan...", "מעדכנים את חבילת האוטומציות...", "Actualizando el plan...", "Atualizando o plano...", "جارٍ تحديث خطة الأتمتة..."),
  activated: row(
    "{{plan}} plan was activated successfully",
    "חבילת {{plan}} הופעלה בהצלחה",
    "El plan {{plan}} se activó correctamente",
    "O plano {{plan}} foi ativado com sucesso",
    "تم تفعيل خطة {{plan}} بنجاح"
  ),
  continueHint: row(
    "You can go back and keep working with automations.",
    "אפשר לחזור ולהמשיך לעבוד עם האוטומציות.",
    "Puedes volver y seguir con las automatizaciones.",
    "Você pode voltar e continuar com as automações.",
    "يمكنك العودة ومتابعة العمل مع الأتمتة."
  ),
  timeoutTitle: row(
    "Payment received and the update is still in progress.",
    "התשלום התקבל והעדכון עדיין מתבצע.",
    "Pago recibido y la actualización sigue en curso.",
    "Pagamento recebido e a atualização ainda está em andamento.",
    "تم استلام الدفع وما زال التحديث جارياً."
  ),
  timeoutHint: row(
    "Most updates finish shortly.",
    "רוב העדכונים מסתיימים תוך זמן קצר.",
    "La mayoría termina enseguida.",
    "A maioria termina em pouco tempo.",
    "تنتهي معظم التحديثات خلال وقت قصير."
  ),
};

const WA_SHELL = {
  demoSend: row(
    "Send a demo message — not sent to a real customer",
    "שלחו הודעת הדגמה — לא נשלחת ללקוח אמיתי",
    "Enviar un mensaje de prueba — no se envía a un cliente real",
    "Enviar uma mensagem de demonstração — não vai para um cliente real",
    "إرسال رسالة تجريبية — لا تُرسل إلى عميل حقيقي"
  ),
};

const WA_CHECKOUT = {
  received: row("Payment received", "התשלום התקבל", "Pago recibido", "Pagamento recebido", "تم استلام الدفع"),
  updating: row("Updating WhatsApp billing...", "מעדכנים את חיוב וואטסאפ...", "Actualizando la facturación de WhatsApp...", "Atualizando a cobrança do WhatsApp...", "جارٍ تحديث فوترة واتساب..."),
  activated: row(
    "WhatsApp billing was activated successfully",
    "חיוב וואטסאפ הופעל בהצלחה",
    "La facturación de WhatsApp se activó",
    "A cobrança do WhatsApp foi ativada",
    "تم تفعيل فوترة واتساب بنجاح"
  ),
  continueHint: row(
    "You can go back and send messages — billing is based on actual usage.",
    "אפשר לחזור ולשלוח הודעות — החיוב לפי השימוש בפועל.",
    "Puedes volver y enviar — se cobra por uso real.",
    "Você pode voltar e enviar — a cobrança é pelo uso real.",
    "يمكنك العودة وإرسال الرسائل — الفوترة حسب الاستخدام الفعلي."
  ),
  continue: row("Continue", "המשך", "Continuar", "Continuar", "متابعة"),
  timeoutTitle: row(
    "Payment received and the update is still in progress.",
    "התשלום התקבל והעדכון עדיין מתבצע.",
    "Pago recibido y la actualización sigue en curso.",
    "Pagamento recebido e a atualização ainda está em andamento.",
    "تم استلام الدفع وما زال التحديث جارياً."
  ),
  timeoutHint: row(
    "Most updates finish shortly.",
    "רוב העדכונים מסתיימים תוך זמן קצר.",
    "La mayoría termina enseguida.",
    "A maioria termina em pouco tempo.",
    "تنتهي معظم التحديثات خلال وقت قصير."
  ),
};

export function extraAutomationsRestLocaleObject(locale) {
  return {
    automations: {
      runsDetail: pickLocaleMap(RUNS_DETAIL, locale),
      schedule: pickLocaleMap(SCHEDULE, locale),
      aiResults: pickLocaleMap(AI_RESULTS, locale),
      flow: pickLocaleMap(FLOW, locale),
      emailFields: pickLocaleMap(EMAIL_FIELDS, locale),
      list: pickLocaleMap(LIST, locale),
      editorPage: pickLocaleMap(EDITOR_PAGE, locale),
      estimate: pickLocaleMap(ESTIMATE, locale),
      billing: {
        cancel: pickLocaleMap(BILLING_CANCEL, locale),
        checkout: pickLocaleMap(BILLING_CHECKOUT, locale),
      },
    },
    whatsapp: {
      shell: pickLocaleMap(WA_SHELL, locale),
      checkout: pickLocaleMap(WA_CHECKOUT, locale),
    },
  };
}
