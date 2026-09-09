function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const LOCAL = {
  local_appointment_reminder_1_day: {
    name: row("Appointment reminder — 1 day before", "תזכורת פגישה — יום לפני", "Recordatorio de cita — 1 día antes", "Lembrete de agendamento — 1 dia antes", "تذكير بالموعد — قبل يوم"),
    description: row("Trigger: upcoming appointment 1 day before. Result: WhatsApp reminder.", "טריגר: פגישה קרובה יום לפני. תוצאה: הודעת תזכורת WhatsApp.", "Disparador: cita próxima 1 día antes. Resultado: recordatorio de WhatsApp.", "Gatilho: agendamento próximo 1 dia antes. Resultado: lembrete no WhatsApp.", "المحفّز: موعد قادم قبل يوم. النتيجة: تذكير واتساب."),
    trigger: row("Upcoming appointment (1 day before)", "פגישה קרובה (יום לפני)", "Cita próxima (1 día antes)", "Agendamento próximo (1 dia antes)", "موعد قادم (قبل يوم)"),
    result1: row("WhatsApp reminder", "הודעת תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  local_appointment_reminder_2_days: {
    name: row("Appointment reminder — 2 days before", "תזכורת פגישה — יומיים לפני", "Recordatorio de cita — 2 días antes", "Lembrete de agendamento — 2 dias antes", "تذكير بالموعد — قبل يومين"),
    description: row("Trigger: upcoming appointment 2 days before. Result: WhatsApp reminder.", "טריגר: פגישה קרובה יומיים לפני. תוצאה: הודעת תזכורת WhatsApp.", "Disparador: cita próxima 2 días antes. Resultado: recordatorio de WhatsApp.", "Gatilho: agendamento próximo 2 dias antes. Resultado: lembrete no WhatsApp.", "المحفّز: موعد قادم قبل يومين. النتيجة: تذكير واتساب."),
    trigger: row("Upcoming appointment (2 days before)", "פגישה קרובה (יומיים לפני)", "Cita próxima (2 días antes)", "Agendamento próximo (2 dias antes)", "موعد قادم (قبل يومين)"),
    result1: row("WhatsApp reminder", "הודעת תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  local_appointment_reminder_hours: {
    name: row("Appointment reminder — 2 hours before", "תזכורת פגישה — שעתיים לפני", "Recordatorio de cita — 2 horas antes", "Lembrete de agendamento — 2 horas antes", "تذكير بالموعد — قبل ساعتين"),
    description: row("Trigger: upcoming appointment 2 hours before. Result: WhatsApp reminder. Hours can be changed in the builder.", "טריגר: פגישה קרובה שעתיים לפני. תוצאה: הודעת תזכורת WhatsApp. ניתן לשנות שעות בבונה.", "Disparador: cita próxima 2 horas antes. Resultado: recordatorio de WhatsApp. Las horas se pueden cambiar en el constructor.", "Gatilho: agendamento próximo 2 horas antes. Resultado: lembrete no WhatsApp. As horas podem ser alteradas no construtor.", "المحفّز: موعد قادم قبل ساعتين. النتيجة: تذكير واتساب. يمكن تغيير الساعات في المنشئ."),
    trigger: row("Upcoming appointment (2 hours before)", "פגישה קרובה (שעתיים לפני)", "Cita próxima (2 horas antes)", "Agendamento próximo (2 horas antes)", "موعد قادم (قبل ساعتين)"),
    result1: row("WhatsApp reminder", "הודעת תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  local_appointment_thanks: {
    name: row("Thank-you after an appointment", "תודה אחרי פגישה", "Agradecimiento después de una cita", "Agradecimento depois de um agendamento", "شكر بعد الموعد"),
    description: row("Trigger: new or completed appointment. Result: WhatsApp thank-you.", "טריגר: פגישה חדשה/הסתיימה. תוצאה: הודעת תודה ב-WhatsApp.", "Disparador: cita nueva o terminada. Resultado: agradecimiento por WhatsApp.", "Gatilho: agendamento novo ou encerrado. Resultado: agradecimento no WhatsApp.", "المحفّز: موعد جديد أو منتهٍ. النتيجة: رسالة شكر على واتساب."),
    trigger: row("Appointment", "פגישה", "Cita", "Agendamento", "موعد"),
    result1: row("WhatsApp thank-you", "הודעת תודה WhatsApp", "Agradecimiento de WhatsApp", "Agradecimento no WhatsApp", "شكر واتساب"),
  },
  local_appointment_review: {
    name: row("Review request after an appointment", "בקשת ביקורת אחרי פגישה", "Pedido de reseña después de una cita", "Pedido de avaliação depois de um agendamento", "طلب تقييم بعد الموعد"),
    description: row("Trigger: appointment. Result: WhatsApp review request.", "טריגר: פגישה. תוצאה: בקשת ביקורת ב-WhatsApp.", "Disparador: cita. Resultado: pedido de reseña por WhatsApp.", "Gatilho: agendamento. Resultado: pedido de avaliação no WhatsApp.", "المحفّز: موعد. النتيجة: طلب تقييم على واتساب."),
    trigger: row("Appointment", "פגישה", "Cita", "Agendamento", "موعد"),
    result1: row("WhatsApp review request", "בקשת ביקורת WhatsApp", "Pedido de reseña de WhatsApp", "Pedido de avaliação no WhatsApp", "طلب تقييم واتساب"),
  },
  local_appointment_gcal: {
    name: row("Appointment → Google Calendar", "פגישה → Google Calendar", "Cita → Google Calendar", "Agendamento → Google Calendar", "موعد → تقويم Google"),
    description: row("Trigger: new appointment. Result: create a Google Calendar event (Calendar connection).", "טריגר: פגישה חדשה. תוצאה: יצירת אירוע ביומן Google (חיבור Calendar).", "Disparador: cita nueva. Resultado: crear un evento en Google Calendar (conexión Calendar).", "Gatilho: novo agendamento. Resultado: criar um evento no Google Calendar (conexão Calendar).", "المحفّز: موعد جديد. النتيجة: إنشاء حدث في تقويم Google (ربط Calendar)."),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Google Calendar event", "אירוע ב-Google Calendar", "Evento en Google Calendar", "Evento no Google Calendar", "حدث في تقويم Google"),
  },
  local_appointment_email: {
    name: row("Appointment → confirmation email", "פגישה → אימייל אישור", "Cita → email de confirmación", "Agendamento → e-mail de confirmação", "موعد → بريد تأكيد"),
    description: row("Trigger: new appointment. Result: send a confirmation email to the client.", "טריגר: פגישה חדשה. תוצאה: שליחת אימייל אישור ללקוח.", "Disparador: cita nueva. Resultado: enviar un email de confirmación al cliente.", "Gatilho: novo agendamento. Resultado: enviar um e-mail de confirmação ao cliente.", "المحفّز: موعد جديد. النتيجة: إرسال بريد تأكيد للعميل."),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Confirmation email", "אימייל אישור", "Email de confirmación", "E-mail de confirmação", "بريد تأكيد"),
  },
  local_lead_multi_results: {
    name: row("New lead — several results together", "ליד חדש — כמה תוצאות יחד", "Nuevo lead — varios resultados juntos", "Novo lead — vários resultados juntos", "عميل محتمل جديد — عدة نتائج معًا"),
    description: row("Trigger: new CRM lead. Results together: WhatsApp, a task for the agent, and an owner alert.", "טריגר: ליד חדש ב-CRM. תוצאות יחד: WhatsApp, משימה לנציג והתראה לבעל העסק.", "Disparador: nuevo lead en el CRM. Resultados juntos: WhatsApp, tarea para el agente y aviso al dueño.", "Gatilho: novo lead no CRM. Resultados juntos: WhatsApp, tarefa para o agente e alerta ao dono.", "المحفّز: عميل محتمل جديد في CRM. النتائج معًا: واتساب ومهمة للمندوب وتنبيه لصاحب النشاط."),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("Immediate WhatsApp", "WhatsApp מיידי", "WhatsApp inmediato", "WhatsApp imediato", "واتساب فوري"),
    result2: row("Task for the agent", "משימה לנציג", "Tarea para el agente", "Tarefa para o agente", "مهمة للمندوب"),
    result3: row("Owner alert", "התראה לבעל העסק", "Aviso al dueño", "Alerta ao dono", "تنبيه لصاحب النشاط"),
  },
  local_lead_email_welcome: {
    name: row("New lead → email + task", "ליד חדש → אימייל + משימה", "Nuevo lead → email + tarea", "Novo lead → e-mail + tarefa", "عميل محتمل جديد → بريد + مهمة"),
    description: row("Trigger: new lead. Results: email and a CRM follow-up task.", "טריגר: ליד חדש. תוצאות: אימייל ומשימת מעקב ב-CRM.", "Disparador: nuevo lead. Resultados: email y tarea de seguimiento en el CRM.", "Gatilho: novo lead. Resultados: e-mail e tarefa de acompanhamento no CRM.", "المحفّز: عميل محتمل جديد. النتائج: بريد ومهمة متابعة في CRM."),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("Email", "אימייל", "Email", "E-mail", "بريد"),
    result2: row("Follow-up task", "משימת מעקב", "Tarea de seguimiento", "Tarefa de acompanhamento", "مهمة متابعة"),
  },
  local_lead_no_response: {
    name: row("New lead → opening + follow-ups by reply", "ליד חדש → פתיחה + פולואפים לפי תגובה", "Nuevo lead → apertura + seguimientos según respuesta", "Novo lead → abertura + follow-ups por resposta", "عميل محتمل جديد → افتتاح + متابعات حسب الرد"),
    description: row("Immediate opening; if there is no WhatsApp reply — follow-up after 24h and after 3 days.", "פתיחה מיידית; אם אין תשובת WhatsApp — פולואפ אחרי 24ש׳ ואחרי 3 ימים.", "Apertura inmediata; si no hay respuesta de WhatsApp — seguimiento a las 24 h y a los 3 días.", "Abertura imediata; se não houver resposta no WhatsApp — follow-up após 24h e após 3 dias.", "افتتاح فوري؛ إن لم يرد واتساب — متابعة بعد 24 ساعة وبعد 3 أيام."),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp opening", "פתיחה WhatsApp", "Apertura de WhatsApp", "Abertura no WhatsApp", "افتتاح واتساب"),
    result2: row("Follow-up #1", "פולואפ #1", "Seguimiento #1", "Follow-up #1", "متابعة #1"),
    result3: row("Follow-up #2", "פולואפ #2", "Seguimiento #2", "Follow-up #2", "متابعة #2"),
  },
  local_lead_followup_2: {
    name: row("Second lead follow-up (merged)", "פולואפ שני לליד (מיזוג)", "Segundo seguimiento de lead (fusionado)", "Segundo follow-up de lead (mesclado)", "المتابعة الثانية للعميل المحتمل (مدمجة)"),
    description: row("Merged into the unified path “New lead → opening + follow-ups by reply”.", "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה».", "Fusionado en la ruta unificada “Nuevo lead → apertura + seguimientos según respuesta”.", "Mesclado no caminho unificado “Novo lead → abertura + follow-ups por resposta”.", "دُمج في المسار الموحّد «عميل محتمل جديد → افتتاح + متابعات حسب الرد»."),
    trigger: row("Lead without conversion", "ליד ללא המרה", "Lead sin conversión", "Lead sem conversão", "عميل محتمل بلا تحويل"),
    result1: row("Second WhatsApp follow-up", "WhatsApp פולואפ שני", "Segundo seguimiento de WhatsApp", "Segundo follow-up no WhatsApp", "متابعة واتساب ثانية"),
  },
  local_new_client_welcome: {
    name: row("New client — welcome", "לקוח חדש — ברוכים הבאים", "Cliente nuevo — bienvenida", "Cliente novo — boas-vindas", "عميل جديد — مرحبًا"),
    description: row("Trigger: new client. Results: opening message and a retention task.", "טריגר: לקוח חדש. תוצאות: הודעת פתיחה ומשימת שימור.", "Disparador: cliente nuevo. Resultados: mensaje de apertura y tarea de retención.", "Gatilho: cliente novo. Resultados: mensagem de abertura e tarefa de retenção.", "المحفّز: عميل جديد. النتائج: رسالة افتتاح ومهمة احتفاظ."),
    trigger: row("New client", "לקוח חדש", "Cliente nuevo", "Cliente novo", "عميل جديد"),
    result1: row("Opening message", "הודעת פתיחה", "Mensaje de apertura", "Mensagem de abertura", "رسالة افتتاح"),
    result2: row("Retention task", "משימת שימור", "Tarea de retención", "Tarefa de retenção", "مهمة احتفاظ"),
  },
  local_inactive_client: {
    name: row("Inactive client — a nudge", "לקוח לא פעיל — נגיעה", "Cliente inactivo — un toque", "Cliente inativo — um toque", "عميل غير نشط — لمسة"),
    description: row("Trigger: inactive client. Result: WhatsApp nudge.", "טריגר: לקוח לא פעיל. תוצאה: הודעת נגיעה ב-WhatsApp.", "Disparador: cliente inactivo. Resultado: toque por WhatsApp.", "Gatilho: cliente inativo. Resultado: toque no WhatsApp.", "المحفّز: عميل غير نشط. النتيجة: لمسة واتساب."),
    trigger: row("Inactive client", "לקוח לא פעיל", "Cliente inactivo", "Cliente inativo", "عميل غير نشط"),
    result1: row("WhatsApp nudge", "הודעת נגיעה WhatsApp", "Toque de WhatsApp", "Toque no WhatsApp", "لمسة واتساب"),
  },
};

export function extraLocalTemplatesLocaleObject(locale) {
  return {
    automations: {
      local: Object.fromEntries(
        Object.entries(LOCAL).map(([key, fields]) => [key, pickLocaleMap(fields, locale)])
      ),
    },
  };
}
