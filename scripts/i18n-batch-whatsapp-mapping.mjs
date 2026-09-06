function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(value, locale) {
  return value[locale] || value.en;
}

function pickMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, pick(value, locale)]),
  );
}

const SOURCES = {
  manual: row("Manual value", "ערך ידני", "Valor manual", "Valor manual", "قيمة يدوية"),
  constant: row("Fixed value", "ערך קבוע", "Valor fijo", "Valor fixo", "قيمة ثابتة"),
  contact: row("Client / contact", "לקוח / איש קשר", "Cliente / contacto", "Cliente / contato", "عميل / جهة اتصال"),
  lead: row("Lead", "ליד", "Lead", "Lead", "عميل محتمل"),
  meta_lead: row("Meta lead", "ליד מ־Meta", "Lead de Meta", "Lead do Meta", "عميل محتمل من Meta"),
  google_lead: row("Google Ads lead", "ליד מ־Google Ads", "Lead de Google Ads", "Lead do Google Ads", "عميل محتمل من Google Ads"),
  form: row("Form", "טופס", "Formulario", "Formulário", "نموذج"),
  appointment: row("Appointment", "פגישה", "Cita", "Agendamento", "موعد"),
  business: row("Business", "עסק", "Negocio", "Negócio", "نشاط"),
  system: row("System values", "ערכי מערכת", "Valores del sistema", "Valores do sistema", "قيم النظام"),
};

const FIELDS = {
  firstName: row("First name", "שם פרטי", "Nombre", "Nome", "الاسم الأول"),
  fullName: row("Full name", "שם מלא", "Nombre completo", "Nome completo", "الاسم الكامل"),
  name: row("Name", "שם", "Nombre", "Nome", "الاسم"),
  clientName: row("Client name", "שם הלקוח", "Nombre del cliente", "Nome do cliente", "اسم العميل"),
  clientSnapshot_name: row("Full name", "שם מלא", "Nombre completo", "Nome completo", "الاسم الكامل"),
  clientSnapshot_phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  clientSnapshot_email: row("Email", "אימייל", "Email", "E-mail", "بريد"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  email: row("Email", "אימייל", "Email", "E-mail", "بريد"),
  address: row("Address", "כתובת", "Dirección", "Endereço", "العنوان"),
  tags: row("Tags", "תגיות", "Etiquetas", "Tags", "وسوم"),
  notes: row("Notes", "הערות", "Notas", "Observações", "ملاحظات"),
  lastInteraction: row("Last contact date", "תאריך יצירת קשר אחרון", "Último contacto", "Último contato", "آخر تواصل"),
  createdAt: row("Created date", "תאריך יצירה", "Fecha de creación", "Data de criação", "تاريخ الإنشاء"),
  updatedAt: row("Updated date", "תאריך עדכון", "Fecha de actualización", "Data de atualização", "تاريخ التحديث"),
  message: row("Message", "הודעה", "Mensaje", "Mensagem", "رسالة"),
  source: row("Lead source", "מקור הליד", "Origen del lead", "Origem do lead", "مصدر العميل المحتمل"),
  provider: row("Provider", "ספק", "Proveedor", "Provedor", "المزود"),
  status: row("Status", "סטטוס", "Estado", "Status", "الحالة"),
  date: row("Date", "תאריך", "Fecha", "Data", "التاريخ"),
  time: row("Time", "שעה", "Hora", "Hora", "الوقت"),
  dateTime: row("Date and time", "תאריך ושעה", "Fecha y hora", "Data e hora", "التاريخ والوقت"),
  duration: row("Duration", "משך הפגישה", "Duración", "Duração", "المدة"),
  serviceName: row("Service name", "שם השירות", "Nombre del servicio", "Nome do serviço", "اسم الخدمة"),
  isConfirmed: row("Confirmed", "אושרה", "Confirmada", "Confirmado", "مؤكد"),
  note: row("Notes", "הערות", "Notas", "Observações", "ملاحظات"),
  price: row("Price", "מחיר", "Precio", "Preço", "السعر"),
  paid: row("Paid", "שולם", "Pagado", "Pago", "مدفوع"),
  paymentMethod: row("Payment method", "אמצעי תשלום", "Método de pago", "Forma de pagamento", "طريقة الدفع"),
  businessName: row("Business name", "שם העסק", "Nombre del negocio", "Nome do negócio", "اسم النشاط"),
  contact: row("Contact person", "איש קשר", "Persona de contacto", "Pessoa de contato", "جهة الاتصال"),
  address_city: row("City", "עיר", "Ciudad", "Cidade", "المدينة"),
  area: row("Area", "אזור", "Zona", "Área", "المنطقة"),
  description: row("Business description", "תיאור העסק", "Descripción del negocio", "Descrição do negócio", "وصف النشاط"),
  category: row("Category", "קטגוריה", "Categoría", "Categoria", "الفئة"),
  websiteUrl: row("Website", "אתר", "Sitio web", "Site", "الموقع"),
  whatsappUrl: row("WhatsApp link", "קישור וואטסאפ", "Enlace de WhatsApp", "Link do WhatsApp", "رابط واتساب"),
  schedule: row("Opening hours", "שעות פעילות", "Horario", "Horário de funcionamento", "ساعات العمل"),
  ownerName: row("Owner name", "שם הבעלים", "Nombre del dueño", "Nome do dono", "اسم المالك"),
  ownerEmail: row("Owner email", "אימייל הבעלים", "Email del dueño", "E-mail do dono", "بريد المالك"),
  currentDate: row("Current date", "תאריך נוכחי", "Fecha actual", "Data atual", "التاريخ الحالي"),
  currentTime: row("Current time", "שעה נוכחית", "Hora actual", "Hora atual", "الوقت الحالي"),
  currentDateTime: row("Current date and time", "תאריך ושעה נוכחיים", "Fecha y hora actuales", "Data e hora atuais", "التاريخ والوقت الحاليان"),
  currentYear: row("Current year", "שנה נוכחית", "Año actual", "Ano atual", "السنة الحالية"),
  currentMonth: row("Current month", "חודש נוכחי", "Mes actual", "Mês atual", "الشهر الحالي"),
  currentDay: row("Current day", "יום נוכחי", "Día actual", "Dia atual", "اليوم الحالي"),
  uniqueId: row("Unique ID", "מזהה ייחודי", "ID único", "ID exclusivo", "معرّف فريد"),
  relativeTime: row("Time until appointment", "זמן יחסי עד לפגישה", "Tiempo hasta la cita", "Tempo até o agendamento", "الوقت حتى الموعد"),
  externalFormId: row("Form ID", "מזהה טופס", "ID del formulario", "ID do formulário", "معرّف النموذج"),
  facebook_leadId: row("Lead ID", "מזהה ליד", "ID del lead", "ID do lead", "معرّف العميل المحتمل"),
  facebook_formId: row("Form ID", "מזהה טופס", "ID del formulario", "ID do formulário", "معرّف النموذج"),
  facebook_formName: row("Form name", "שם הטופס", "Nombre del formulario", "Nome do formulário", "اسم النموذج"),
  facebook_pageId: row("Page ID", "מזהה עמוד", "ID de la página", "ID da página", "معرّف الصفحة"),
  facebook_pageName: row("Page name", "שם העמוד", "Nombre de la página", "Nome da página", "اسم الصفحة"),
  facebook_createdTime: row("Created time", "זמן יצירה", "Hora de creación", "Hora de criação", "وقت الإنشاء"),
  google_customerId: row("Google Ads account ID", "מזהה חשבון Google Ads", "ID de cuenta de Google Ads", "ID da conta do Google Ads", "معرّف حساب Google Ads"),
  google_campaignId: row("Campaign ID", "מזהה קמפיין", "ID de campaña", "ID da campanha", "معرّف الحملة"),
  google_campaignName: row("Campaign name", "שם הקמפיין", "Nombre de campaña", "Nome da campanha", "اسم الحملة"),
  google_formId: row("Form ID", "מזהה טופס", "ID del formulario", "ID do formulário", "معرّف النموذج"),
  google_formName: row("Form name", "שם הטופס", "Nombre del formulario", "Nome do formulário", "اسم النموذج"),
  google_leadId: row("Submission ID", "מזהה שליחה", "ID de envío", "ID do envio", "معرّف الإرسال"),
  google_gclId: row("Google click ID", "מזהה לחיצה של Google", "ID de clic de Google", "ID de clique do Google", "معرّف نقرة Google"),
  google_createdTime: row("Submission date", "תאריך שליחה", "Fecha de envío", "Data de envio", "تاريخ الإرسال"),
  google_leadStage: row("Lead stage", "שלב הליד", "Etapa del lead", "Etapa do lead", "مرحلة العميل المحتمل"),
  google_adgroupId: row("Ad group ID", "מזהה קבוצת מודעות", "ID del grupo de anuncios", "ID do grupo de anúncios", "معرّف مجموعة الإعلانات"),
  google_creativeId: row("Ad ID", "מזהה מודעה", "ID del anuncio", "ID do anúncio", "معرّف الإعلان"),
};

const FIELD_BY_SOURCE = {
  lead: {
    name: row("Lead name", "שם הליד", "Nombre del lead", "Nome do lead", "اسم العميل المحتمل"),
    status: row("Lead status", "סטטוס הליד", "Estado del lead", "Status do lead", "حالة العميل المحتمل"),
  },
  form: {
    name: row("Contact name", "שם איש הקשר", "Nombre del contacto", "Nome do contato", "اسم جهة الاتصال"),
    createdAt: row("Submission date", "תאריך שליחה", "Fecha de envío", "Data de envio", "تاريخ الإرسال"),
  },
  meta_lead: {
    name: row("Lead name", "שם הליד", "Nombre del lead", "Nome do lead", "اسم العميل المحتمل"),
  },
  google_lead: {
    name: row("Lead name", "שם הליד", "Nombre del lead", "Nome do lead", "اسم العميل المحتمل"),
  },
  appointment: {
    date: row("Appointment date", "תאריך הפגישה", "Fecha de la cita", "Data do agendamento", "تاريخ الموعد"),
    time: row("Appointment time", "שעת הפגישה", "Hora de la cita", "Hora do agendamento", "وقت الموعد"),
    dateTime: row(
      "Appointment date and time",
      "תאריך ושעת הפגישה",
      "Fecha y hora de la cita",
      "Data e hora do agendamento",
      "تاريخ ووقت الموعد",
    ),
    status: row("Appointment status", "סטטוס הפגישה", "Estado de la cita", "Status do agendamento", "حالة الموعد"),
    address: row("Address / location", "כתובת / מיקום", "Dirección / ubicación", "Endereço / local", "العنوان / الموقع"),
  },
  business: {
    name: row("Business name", "שם העסק", "Nombre del negocio", "Nome do negócio", "اسم النشاط"),
    phone: row("Business phone", "טלפון העסק", "Teléfono del negocio", "Telefone do negócio", "هاتف النشاط"),
    email: row("Business email", "אימייל העסק", "Email del negocio", "E-mail do negócio", "بريد النشاط"),
  },
};

const FORMATS = {
  date_dmy: row("Day/month/year", "יום/חודש/שנה", "Día/mes/año", "Dia/mês/ano", "يوم/شهر/سنة"),
  date_mdy: row("Month/day/year", "חודש/יום/שנה", "Mes/día/año", "Mês/dia/ano", "شهر/يوم/سنة"),
  date_ymd: row("Year-month-day", "שנה-חודש-יום", "Año-mes-día", "Ano-mês-dia", "سنة-شهر-يوم"),
  date_dmy_dot: row("Day.month.year", "יום.חודש.שנה", "Día.mes.año", "Dia.mês.ano", "يوم.شهر.سنة"),
  time_24: row("24-hour", "24 שעות", "24 horas", "24 horas", "24 ساعة"),
  time_12: row("12-hour with AM/PM", "12 שעות עם AM/PM", "12 horas con AM/PM", "12 horas com AM/PM", "12 ساعة مع AM/PM"),
  datetime_long: row(
    "August 5, 2026 at 10:00",
    "5 באוגוסט 2026 בשעה 10:00",
    "5 de agosto de 2026 a las 10:00",
    "5 de agosto de 2026 às 10:00",
    "5 أغسطس 2026 الساعة 10:00",
  ),
  datetime_dmy_24: row("05/08/2026 10:00", "05/08/2026 10:00", "05/08/2026 10:00", "05/08/2026 10:00", "05/08/2026 10:00"),
  datetime_mdy_12: row("08/05/2026 10:00 AM", "08/05/2026 10:00 AM", "08/05/2026 10:00 AM", "08/05/2026 10:00 AM", "08/05/2026 10:00 AM"),
  datetime_ymd_24: row("2026-08-05 10:00", "2026-08-05 10:00", "2026-08-05 10:00", "2026-08-05 10:00", "2026-08-05 10:00"),
  integer: row("Whole number", "מספר שלם", "Número entero", "Número inteiro", "رقم صحيح"),
  decimal: row("Decimal", "עשרוני", "Decimal", "Decimal", "عشري"),
  currency: row("Currency", "מטבע", "Moneda", "Moeda", "عملة"),
  percent: row("Percent", "אחוזים", "Porcentaje", "Porcentagem", "نسبة"),
  original: row("As received", "כפי שהתקבל", "Tal como se recibió", "Como recebido", "كما ورد"),
  upper: row("Uppercase", "אותיות גדולות", "Mayúsculas", "Maiúsculas", "أحرف كبيرة"),
  lower: row("Lowercase", "אותיות קטנות", "Minúsculas", "Minúsculas", "أحرف صغيرة"),
  capitalize: row("Capitalize first letter", "אות ראשונה גדולה", "Primera letra mayúscula", "Primeira letra maiúscula", "حرف أول كبير"),
  trim: row("Trim extra spaces", "הסרת רווחים מיותרים", "Quitar espacios extra", "Remover espaços extras", "إزالة المسافات الزائدة"),
  international: row("International format", "פורמט בינלאומי", "Formato internacional", "Formato internacional", "تنسيق دولي"),
  local: row("Local format", "פורמט מקומי", "Formato local", "Formato local", "تنسيق محلي"),
  masked: row("Partially masked", "פורמט מוסתר חלקית", "Parcialmente oculto", "Parcialmente oculto", "مخفي جزئياً"),
};

const EXTRA_META_STATUS = {
  pendingDeletion: row("Pending deletion", "ממתינה למחיקה", "Pendiente de eliminación", "Pendente de exclusão", "بانتظار الحذف"),
  deleted: row("Deleted", "נמחקה", "Eliminada", "Excluída", "محذوفة"),
  limitExceeded: row("Paused (rate limit)", "מושהית (מגבלת קצב)", "Pausada (límite de ritmo)", "Pausada (limite de ritmo)", "متوقفة (حد المعدل)"),
};

export function extraWhatsappMappingLocaleObject(locale) {
  const fieldBySource = {};
  for (const [sourceId, fields] of Object.entries(FIELD_BY_SOURCE)) {
    fieldBySource[sourceId] = pickMap(fields, locale);
  }
  return {
    whatsapp: {
      templates: {
        metaStatus: pickMap(EXTRA_META_STATUS, locale),
      },
      mapping: {
        sources: pickMap(SOURCES, locale),
        fields: pickMap(FIELDS, locale),
        fieldBySource,
        formats: pickMap(FORMATS, locale),
      },
    },
  };
}
