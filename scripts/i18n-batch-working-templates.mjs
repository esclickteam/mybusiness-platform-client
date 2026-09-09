function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const WORKING = {
  wa_new_lead_welcome: {
    name: row(
      "New lead → WhatsApp opening only",
      "ליד חדש → WhatsApp פתיחה בלבד",
      "Nuevo lead → solo apertura de WhatsApp",
      "Novo lead → só abertura no WhatsApp",
      "عميل محتمل جديد → افتتاح واتساب فقط"
    ),
    description: row(
      "Immediate opening message only (no follow-ups). For opening + reply-based follow-ups, use “New lead → opening + follow-ups by reply”.",
      "הודעת פתיחה מיידית בלבד (ללא פולואפים). למסלול פתיחה + פולואפים לפי תגובה — השתמשו בתבנית «ליד חדש → פתיחה + פולואפים לפי תגובה».",
      "Solo el mensaje de apertura inmediato (sin seguimientos). Para apertura + seguimientos según respuesta, usen “Nuevo lead → apertura + seguimientos según respuesta”.",
      "Só a mensagem de abertura imediata (sem follow-ups). Para abertura + follow-ups por resposta, usem “Novo lead → abertura + follow-ups por resposta”.",
      "رسالة افتتاح فورية فقط (بدون متابعات). لمسار الافتتاح + المتابعات حسب الرد استخدموا «عميل محتمل جديد → افتتاح + متابعات حسب الرد»."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp opening message", "הודעת פתיחה WhatsApp", "Mensaje de apertura de WhatsApp", "Mensagem de abertura no WhatsApp", "رسالة افتتاح واتساب"),
  },
  wa_new_lead_owner_alert: {
    name: row(
      "New lead → WhatsApp alert to the owner",
      "ליד חדש → התראת WhatsApp לבעל העסק",
      "Nuevo lead → aviso de WhatsApp al dueño",
      "Novo lead → alerta de WhatsApp ao dono",
      "عميل محتمل جديد → تنبيه واتساب لصاحب النشاط"
    ),
    description: row(
      "A lead enters the CRM → internal WhatsApp alert to the business owner.",
      "ליד נכנס ל-CRM → התראה פנימית ב-WhatsApp לבעל העסק.",
      "Entra un lead al CRM → aviso interno de WhatsApp al dueño.",
      "Um lead entra no CRM → alerta interno no WhatsApp para o dono.",
      "يدخل عميل محتمل إلى CRM → تنبيه واتساب داخلي لصاحب النشاط."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp alert to the owner", "התראת WhatsApp לבעל העסק", "Aviso de WhatsApp al dueño", "Alerta de WhatsApp ao dono", "تنبيه واتساب لصاحب النشاط"),
  },
  wa_appointment_reminder_1_day: {
    name: row("Appointment reminder — 1 day before", "תזכורת פגישה — יום לפני", "Recordatorio de cita — 1 día antes", "Lembrete de agendamento — 1 dia antes", "تذكير بالموعد — قبل يوم"),
    description: row(
      "One day before the appointment → WhatsApp reminder to the client (enabled immediately).",
      "יום לפני הפגישה → תזכורת WhatsApp ללקוח (מופעל מיד).",
      "Un día antes de la cita → recordatorio de WhatsApp al cliente (se activa al instante).",
      "Um dia antes do agendamento → lembrete no WhatsApp para o cliente (ativado na hora).",
      "قبل يوم من الموعد → تذكير واتساب للعميل (يُفعَّل فورًا)."
    ),
    trigger: row("Upcoming appointment (1 day before)", "פגישה קרובה (יום לפני)", "Cita próxima (1 día antes)", "Agendamento próximo (1 dia antes)", "موعد قادم (قبل يوم)"),
    result1: row("WhatsApp reminder", "תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  wa_appointment_reminder_2_days: {
    name: row("Appointment reminder — 2 days before", "תזכורת פגישה — יומיים לפני", "Recordatorio de cita — 2 días antes", "Lembrete de agendamento — 2 dias antes", "تذكير بالموعد — قبل يومين"),
    description: row(
      "48 hours before the appointment → WhatsApp reminder (enabled immediately).",
      "48 שעות לפני הפגישה → תזכורת WhatsApp (מופעל מיד).",
      "48 horas antes de la cita → recordatorio de WhatsApp (se activa al instante).",
      "48 horas antes do agendamento → lembrete no WhatsApp (ativado na hora).",
      "قبل 48 ساعة من الموعد → تذكير واتساب (يُفعَّل فورًا)."
    ),
    trigger: row("Upcoming appointment (2 days before)", "פגישה קרובה (יומיים לפני)", "Cita próxima (2 días antes)", "Agendamento próximo (2 dias antes)", "موعد قادم (قبل يومين)"),
    result1: row("WhatsApp reminder", "תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  wa_appointment_reminder_3_days: {
    name: row("Appointment reminder — 3 days before", "תזכורת פגישה — 3 ימים לפני", "Recordatorio de cita — 3 días antes", "Lembrete de agendamento — 3 dias antes", "تذكير بالموعد — قبل 3 أيام"),
    description: row(
      "72 hours before the appointment → early WhatsApp reminder (enabled immediately).",
      "72 שעות לפני הפגישה → תזכורת WhatsApp מוקדמת (מופעל מיד).",
      "72 horas antes de la cita → recordatorio temprano de WhatsApp (se activa al instante).",
      "72 horas antes do agendamento → lembrete antecipado no WhatsApp (ativado na hora).",
      "قبل 72 ساعة من الموعد → تذكير واتساب مبكر (يُفعَّل فورًا)."
    ),
    trigger: row("Upcoming appointment (3 days before)", "פגישה קרובה (3 ימים לפני)", "Cita próxima (3 días antes)", "Agendamento próximo (3 dias antes)", "موعد قادم (قبل 3 أيام)"),
    result1: row("WhatsApp reminder", "תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  wa_appointment_reminder_2_hours: {
    name: row("Appointment reminder — 2 hours before", "תזכורת פגישה — שעתיים לפני", "Recordatorio de cita — 2 horas antes", "Lembrete de agendamento — 2 horas antes", "تذكير بالموعد — قبل ساعتين"),
    description: row(
      "Two hours before the appointment → WhatsApp reminder (enabled immediately).",
      "שעתיים לפני הפגישה → תזכורת WhatsApp (מופעל מיד).",
      "Dos horas antes de la cita → recordatorio de WhatsApp (se activa al instante).",
      "Duas horas antes do agendamento → lembrete no WhatsApp (ativado na hora).",
      "قبل ساعتين من الموعد → تذكير واتساب (يُفعَّل فورًا)."
    ),
    trigger: row("Upcoming appointment (2 hours before)", "פגישה קרובה (שעתיים לפני)", "Cita próxima (2 horas antes)", "Agendamento próximo (2 horas antes)", "موعد قادم (قبل ساعتين)"),
    result1: row("WhatsApp reminder", "תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  wa_appointment_reminder_1_hour: {
    name: row("Appointment reminder — 1 hour before", "תזכורת פגישה — שעה לפני", "Recordatorio de cita — 1 hora antes", "Lembrete de agendamento — 1 hora antes", "تذكير بالموعد — قبل ساعة"),
    description: row(
      "One hour before the appointment → last WhatsApp reminder (enabled immediately).",
      "שעה לפני הפגישה → תזכורת WhatsApp אחרונה (מופעל מיד).",
      "Una hora antes de la cita → último recordatorio de WhatsApp (se activa al instante).",
      "Uma hora antes do agendamento → último lembrete no WhatsApp (ativado na hora).",
      "قبل ساعة من الموعد → آخر تذكير واتساب (يُفعَّل فورًا)."
    ),
    trigger: row("Upcoming appointment (1 hour before)", "פגישה קרובה (שעה לפני)", "Cita próxima (1 hora antes)", "Agendamento próximo (1 hora antes)", "موعد قادم (قبل ساعة)"),
    result1: row("WhatsApp reminder", "תזכורת WhatsApp", "Recordatorio de WhatsApp", "Lembrete no WhatsApp", "تذكير واتساب"),
  },
  wa_appointment_thanks: {
    name: row("Thank you after the appointment (WhatsApp)", "תודה אחרי פגישה (WhatsApp)", "Gracias después de la cita (WhatsApp)", "Agradecimento após o agendamento (WhatsApp)", "شكر بعد الموعد (واتساب)"),
    description: row(
      "After the appointment ends → WhatsApp thank-you (timed from the appointment, not from creation).",
      "אחרי סיום הפגישה → הודעת תודה ב-WhatsApp (מתוזמן לפי מועד הפגישה, לא לפי יצירה).",
      "Al terminar la cita → agradecimiento por WhatsApp (según la hora de la cita, no la creación).",
      "Após o fim do agendamento → agradecimento no WhatsApp (pelo horário do agendamento, não pela criação).",
      "بعد انتهاء الموعد → رسالة شكر واتساب (مجدولة حسب الموعد وليس الإنشاء)."
    ),
    trigger: row("Appointment ended", "פגישה הסתיימה", "Cita finalizada", "Agendamento encerrado", "انتهى الموعد"),
    result1: row("Thank-you message", "הודעת תודה", "Mensaje de agradecimiento", "Mensagem de agradecimento", "رسالة شكر"),
  },
  wa_appointment_review: {
    name: row("Review request after the appointment", "בקשת ביקורת אחרי פגישה", "Pedir reseña después de la cita", "Pedir avaliação após o agendamento", "طلب تقييم بعد الموعد"),
    description: row(
      "One day after the appointment ends → WhatsApp review request (timed from the appointment, not from creation).",
      "יום אחרי סיום הפגישה → בקשת ביקורת ב-WhatsApp (מתוזמן לפי מועד הפגישה, לא לפי יצירה).",
      "Un día después de terminar la cita → petición de reseña por WhatsApp (según la hora de la cita).",
      "Um dia após o fim do agendamento → pedido de avaliação no WhatsApp (pelo horário do agendamento).",
      "بعد يوم من انتهاء الموعد → طلب تقييم واتساب (مجدول حسب الموعد وليس الإنشاء)."
    ),
    trigger: row("Appointment ended", "פגישה הסתיימה", "Cita finalizada", "Agendamento encerrado", "انتهى الموعد"),
    result1: row("Review request", "בקשת ביקורת", "Petición de reseña", "Pedido de avaliação", "طلب تقييم"),
  },
  wa_lead_no_response: {
    name: row("Follow-up to a lead who did not reply → WhatsApp", "פולואפ לליד שלא ענה → WhatsApp", "Seguimiento a un lead que no respondió → WhatsApp", "Follow-up para lead que não respondeu → WhatsApp", "متابعة لعميل محتمل لم يرد → واتساب"),
    description: row(
      "Merged into the unified path “New lead → opening + follow-ups by reply”. Not shown as a separate card.",
      "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה». לא מוצג ככרטיס נפרד.",
      "Fusionado en la ruta unificada “Nuevo lead → apertura + seguimientos según respuesta”. No se muestra como tarjeta aparte.",
      "Unido à rota unificada “Novo lead → abertura + follow-ups por resposta”. Não aparece como cartão separado.",
      "دُمج في المسار الموحّد «عميل محتمل جديد → افتتاح + متابعات حسب الرد». لا يُعرض كبطاقة منفصلة."
    ),
    trigger: row("Lead who did not reply on WhatsApp", "ליד שלא ענה ב-WhatsApp", "Lead que no respondió en WhatsApp", "Lead que não respondeu no WhatsApp", "عميل محتمل لم يرد على واتساب"),
    result1: row("WhatsApp follow-up", "פולואפ WhatsApp", "Seguimiento de WhatsApp", "Follow-up no WhatsApp", "متابعة واتساب"),
  },
  wa_lead_followup_2: {
    name: row("Second follow-up to a lead", "פולואפ שני לליד", "Segundo seguimiento al lead", "Segundo follow-up para o lead", "متابعة ثانية للعميل المحتمل"),
    description: row(
      "Merged into the unified path “New lead → opening + follow-ups by reply”. Not shown as a separate card.",
      "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה». לא מוצג ככרטיס נפרד.",
      "Fusionado en la ruta unificada “Nuevo lead → apertura + seguimientos según respuesta”. No se muestra como tarjeta aparte.",
      "Unido à rota unificada “Novo lead → abertura + follow-ups por resposta”. Não aparece como cartão separado.",
      "دُمج في المسار الموحّد «عميل محتمل جديد → افتتاح + متابعات حسب الرد». لا يُعرض كبطاقة منفصلة."
    ),
    trigger: row("Lead without conversion", "ליד ללא המרה", "Lead sin conversión", "Lead sem conversão", "عميل محتمل دون تحويل"),
    result1: row("Second follow-up", "פולואפ שני", "Segundo seguimiento", "Segundo follow-up", "متابعة ثانية"),
  },
  wa_new_client_welcome: {
    name: row("New client → welcome", "לקוח חדש → ברוכים הבאים", "Cliente nuevo → bienvenida", "Novo cliente → boas-vindas", "عميل جديد → ترحيب"),
    description: row(
      "New client in the CRM → WhatsApp opening message (enabled immediately).",
      "לקוח חדש ב-CRM → הודעת פתיחה ב-WhatsApp (מופעל מיד).",
      "Cliente nuevo en el CRM → mensaje de apertura de WhatsApp (se activa al instante).",
      "Novo cliente no CRM → mensagem de abertura no WhatsApp (ativado na hora).",
      "عميل جديد في CRM → رسالة افتتاح واتساب (يُفعَّل فورًا)."
    ),
    trigger: row("New client", "לקוח חדש", "Cliente nuevo", "Novo cliente", "عميل جديد"),
    result1: row("Opening message", "הודעת פתיחה", "Mensaje de apertura", "Mensagem de abertura", "رسالة افتتاح"),
  },
  wa_inactive_client: {
    name: row("Inactive client → check-in", "לקוח לא פעיל → נגיעה", "Cliente inactivo → contacto", "Cliente inativo → contato", "عميل غير نشط → تواصل"),
    description: row(
      "Client with no activity for ~30 days → check-in message (enabled immediately).",
      "לקוח ללא פעילות ~30 יום → הודעת נגיעה (מופעל מיד).",
      "Cliente sin actividad ~30 días → mensaje de contacto (se activa al instante).",
      "Cliente sem atividade há ~30 dias → mensagem de contato (ativado na hora).",
      "عميل بلا نشاط نحو 30 يومًا → رسالة تواصل (يُفعَّل فورًا)."
    ),
    trigger: row("Inactive client", "לקוח לא פעיל", "Cliente inactivo", "Cliente inativo", "عميل غير نشط"),
    result1: row("Check-in message", "הודעת נגיעה", "Mensaje de contacto", "Mensagem de contato", "رسالة تواصل"),
  },
  wf_lead_multi: {
    name: row("New lead → WhatsApp + task + alert", "ליד חדש → WhatsApp + משימה + התראה", "Nuevo lead → WhatsApp + tarea + aviso", "Novo lead → WhatsApp + tarefa + alerta", "عميل محتمل جديد → واتساب + مهمة + تنبيه"),
    description: row(
      "Immediate opening only: WhatsApp + task + alert. No reply-based follow-ups — see “opening + follow-ups by reply” for the full path.",
      "פתיחה מיידית בלבד: WhatsApp + משימה + התראה. לא כולל פולואפים לפי תגובה — למסלול המלא ראו «פתיחה + פולואפים לפי תגובה».",
      "Solo apertura inmediata: WhatsApp + tarea + aviso. Sin seguimientos según respuesta — para la ruta completa vean “apertura + seguimientos según respuesta”.",
      "Só abertura imediata: WhatsApp + tarefa + alerta. Sem follow-ups por resposta — para o caminho completo vejam “abertura + follow-ups por resposta”.",
      "افتتاح فوري فقط: واتساب + مهمة + تنبيه. بدون متابعات حسب الرد — للمسار الكامل انظروا «افتتاح + متابعات حسب الرد»."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
    result2: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
    result3: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_lead_wa_email: {
    name: row("New lead → WhatsApp + email", "ליד חדש → WhatsApp + אימייל", "Nuevo lead → WhatsApp + email", "Novo lead → WhatsApp + e-mail", "عميل محتمل جديد → واتساب + بريد"),
    description: row(
      "Immediate opening only: WhatsApp + email. Does not include WhatsApp follow-ups by reply.",
      "פתיחה מיידית בלבד: WhatsApp + אימייל. לא כולל פולואפים לפי תגובת WhatsApp.",
      "Solo apertura inmediata: WhatsApp + email. Sin seguimientos de WhatsApp según respuesta.",
      "Só abertura imediata: WhatsApp + e-mail. Sem follow-ups de WhatsApp por resposta.",
      "افتتاح فوري فقط: واتساب + بريد. بدون متابعات واتساب حسب الرد."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
    result2: row("Email", "אימייל", "Email", "E-mail", "بريد"),
  },
  wf_lead_full_onboarding: {
    name: row("New lead → WhatsApp + email + task + alert", "ליד חדש → WhatsApp + אימייל + משימה + התראה", "Nuevo lead → WhatsApp + email + tarea + aviso", "Novo lead → WhatsApp + e-mail + tarefa + alerta", "عميل محتمل جديد → واتساب + بريد + مهمة + تنبيه"),
    description: row(
      "Immediate onboarding pack across channels. Does not include WhatsApp follow-ups by reply — see “opening + follow-ups by reply” for the full path.",
      "חבילת קליטה מיידית בכל הערוצים. לא כוללת פולואפי WhatsApp לפי תגובה — למסלול המלא ראו «פתיחה + פולואפים לפי תגובה».",
      "Paquete de incorporación inmediata en todos los canales. Sin seguimientos de WhatsApp según respuesta.",
      "Pacote de onboarding imediato em todos os canais. Sem follow-ups de WhatsApp por resposta.",
      "باقة استقبال فورية عبر كل القنوات. بدون متابعات واتساب حسب الرد."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
    result2: row("Email", "אימייל", "Email", "E-mail", "بريد"),
    result3: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
    result4: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_lead_email_task: {
    name: row("New lead → email + task", "ליד חדש → אימייל + משימה", "Nuevo lead → email + tarea", "Novo lead → e-mail + tarefa", "عميل محتمل جديد → بريد + مهمة"),
    description: row(
      "Without WhatsApp: email via Gmail, Outlook, or business email + a CRM follow-up task.",
      "בלי WhatsApp: אימייל דרך Gmail, Outlook או מייל עסקי + משימת מעקב ב-CRM.",
      "Sin WhatsApp: email por Gmail, Outlook o correo del negocio + tarea de seguimiento en el CRM.",
      "Sem WhatsApp: e-mail pelo Gmail, Outlook ou e-mail comercial + tarefa de acompanhamento no CRM.",
      "بدون واتساب: بريد عبر Gmail أو Outlook أو بريد النشاط + مهمة متابعة في CRM."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("Email", "אימייל", "Email", "E-mail", "بريد"),
    result2: row("Follow-up task", "משימת מעקב", "Tarea de seguimiento", "Tarefa de acompanhamento", "مهمة متابعة"),
  },
  wf_lead_email_only: {
    name: row("New lead → opening email", "ליד חדש → אימייל פתיחה", "Nuevo lead → email de apertura", "Novo lead → e-mail de abertura", "عميل محتمل جديد → بريد افتتاحي"),
    description: row(
      "A new lead receives an opening email via Gmail, Outlook, or business email.",
      "ליד חדש מקבל אימייל פתיחה דרך Gmail, Outlook או מייל עסקי.",
      "Un lead nuevo recibe un email de apertura por Gmail, Outlook o correo del negocio.",
      "Um lead novo recebe um e-mail de abertura pelo Gmail, Outlook ou e-mail comercial.",
      "يحصل العميل المحتمل الجديد على بريد افتتاحي عبر Gmail أو Outlook أو بريد النشاط."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("Email", "אימייל", "Email", "E-mail", "بريد"),
  },
  wf_store_order_confirmation: {
    name: row("Store order confirmation", "אישור הזמנה בחנות", "Confirmación de pedido de la tienda", "Confirmação de pedido da loja", "تأكيد طلب المتجر"),
    description: row(
      "A store order arrived → send a designed confirmation email to the customer.",
      "התקבלה הזמנה בחנות → שליחת מייל אישור מעוצב ללקוח.",
      "Llegó un pedido de la tienda → enviar un email de confirmación diseñado al cliente.",
      "Chegou um pedido da loja → enviar um e-mail de confirmação formatado ao cliente.",
      "وصل طلب من المتجر → إرسال بريد تأكيد مصمَّم للعميل."
    ),
    trigger: row("Store order received", "התקבלה הזמנה בחנות", "Pedido de tienda recibido", "Pedido da loja recebido", "تم استلام طلب المتجر"),
    result1: row("Order confirmation email", "אימייל אישור הזמנה", "Email de confirmación de pedido", "E-mail de confirmação do pedido", "بريد تأكيد الطلب"),
  },
  wf_lead_desk_alert: {
    name: row("New lead → task + team alert", "ליד חדש → משימה + התראה לצוות", "Nuevo lead → tarea + aviso al equipo", "Novo lead → tarefa + alerta à equipe", "عميل محتمل جديد → مهمة + تنبيه للفريق"),
    description: row(
      "No messages to the customer: a task and an internal alert when a lead arrives.",
      "בלי הודעות ללקוח: משימה והתראה פנימית כשנכנס ליד.",
      "Sin mensajes al cliente: tarea y aviso interno cuando entra un lead.",
      "Sem mensagens ao cliente: tarefa e alerta interno quando entra um lead.",
      "بدون رسائل للعميل: مهمة وتنبيه داخلي عند دخول عميل محتمل."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
    result2: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_lead_no_response_pack: {
    name: row("New lead → opening + follow-ups by reply", "ליד חדש → פתיחה + פולואפים לפי תגובה", "Nuevo lead → apertura + seguimientos según respuesta", "Novo lead → abertura + follow-ups por resposta", "عميل محتمل جديد → افتتاح + متابعات حسب الرد"),
    description: row(
      "The opening message is sent immediately. If the lead does not reply, a follow-up is sent after 24 hours and another after 3 days.",
      "הודעת פתיחה נשלחת מיד. אם הליד לא מגיב, נשלח פולואפ לאחר 24 שעות ופולואפ נוסף לאחר 3 ימים.",
      "El mensaje de apertura se envía al instante. Si el lead no responde, se envía un seguimiento a las 24 horas y otro a los 3 días.",
      "A mensagem de abertura é enviada na hora. Se o lead não responder, um follow-up sai após 24 horas e outro após 3 dias.",
      "تُرسل رسالة الافتتاح فورًا. إذا لم يرد العميل المحتمل تُرسل متابعة بعد 24 ساعة وأخرى بعد 3 أيام."
    ),
    trigger: row("New CRM lead", "ליד חדש ב-CRM", "Nuevo lead en el CRM", "Novo lead no CRM", "عميل محتمل جديد في CRM"),
    result1: row("WhatsApp opening", "פתיחה WhatsApp", "Apertura de WhatsApp", "Abertura no WhatsApp", "افتتاح واتساب"),
    result2: row("Follow-up #1", "פולואפ #1", "Seguimiento nº 1", "Follow-up nº 1", "متابعة رقم 1"),
    result3: row("Follow-up #2", "פולואפ #2", "Seguimiento nº 2", "Follow-up nº 2", "متابعة رقم 2"),
  },
  wf_lead_status_sales: {
    name: row("Lead status change → task + alert", "שינוי סטטוס ליד → משימה + התראה", "Cambio de estado del lead → tarea + aviso", "Mudança de status do lead → tarefa + alerta", "تغير حالة العميل المحتمل → مهمة + تنبيه"),
    description: row(
      "When a lead status changes — the team gets a task and an alert.",
      "כשסטטוס ליד משתנה — הצוות מקבל משימה והתראה.",
      "Cuando cambia el estado de un lead, el equipo recibe una tarea y un aviso.",
      "Quando o status de um lead muda, a equipe recebe uma tarefa e um alerta.",
      "عندما تتغير حالة العميل المحتمل يحصل الفريق على مهمة وتنبيه."
    ),
    trigger: row("Lead status changed", "שינוי סטטוס ליד", "Cambio de estado del lead", "Status do lead alterado", "تغيرت حالة العميل المحتمل"),
    result1: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
    result2: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_new_client_pack: {
    name: row("New client → WhatsApp + email + retention task", "לקוח חדש → WhatsApp + אימייל + משימת שימור", "Cliente nuevo → WhatsApp + email + tarea de retención", "Novo cliente → WhatsApp + e-mail + tarefa de retenção", "عميل جديد → واتساب + بريد + مهمة احتفاظ"),
    description: row(
      "New-client intake: opening message, email, and a retention task.",
      "קליטת לקוח חדש: הודעת פתיחה, אימייל ומשימת שימור.",
      "Alta de cliente nuevo: mensaje de apertura, email y tarea de retención.",
      "Entrada de novo cliente: mensagem de abertura, e-mail e tarefa de retenção.",
      "استقبال عميل جديد: رسالة افتتاح وبريد ومهمة احتفاظ."
    ),
    trigger: row("New client", "לקוח חדש", "Cliente nuevo", "Novo cliente", "عميل جديد"),
    result1: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
    result2: row("Email", "אימייל", "Email", "E-mail", "بريد"),
    result3: row("Retention task", "משימת שימור", "Tarea de retención", "Tarefa de retenção", "مهمة احتفاظ"),
  },
  wf_appointment_email: {
    name: row("New appointment → confirmation email", "פגישה חדשה → אימייל אישור", "Cita nueva → email de confirmación", "Novo agendamento → e-mail de confirmação", "موعد جديد → بريد تأكيد"),
    description: row(
      "An appointment is created → confirmation email to the client via Gmail or Outlook.",
      "פגישה נוצרת → אימייל אישור ללקוח דרך Gmail או Outlook.",
      "Se crea una cita → email de confirmación al cliente por Gmail u Outlook.",
      "Um agendamento é criado → e-mail de confirmação ao cliente pelo Gmail ou Outlook.",
      "يُنشأ موعد → بريد تأكيد للعميل عبر Gmail أو Outlook."
    ),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Confirmation email", "אימייל אישור", "Email de confirmación", "E-mail de confirmação", "بريد تأكيد"),
  },
  wf_appointment_email_notify: {
    name: row("New appointment → client email + team alert", "פגישה חדשה → אימייל ללקוח + התראה לצוות", "Cita nueva → email al cliente + aviso al equipo", "Novo agendamento → e-mail ao cliente + alerta à equipe", "موعد جديد → بريد للعميل + تنبيه للفريق"),
    description: row(
      "Confirmation to the client by email + an internal alert to the business owner.",
      "אישור ללקוח במייל + התראה פנימית לבעל העסק.",
      "Confirmación al cliente por email + aviso interno al dueño.",
      "Confirmação ao cliente por e-mail + alerta interno ao dono.",
      "تأكيد للعميل بالبريد + تنبيه داخلي لصاحب النشاط."
    ),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Confirmation email", "אימייל אישור", "Email de confirmación", "E-mail de confirmação", "بريد تأكيد"),
    result2: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_appointment_gcal: {
    name: row("New appointment → Google Calendar", "פגישה חדשה → Google Calendar", "Cita nueva → Google Calendar", "Novo agendamento → Google Agenda", "موعد جديد → تقويم Google"),
    description: row(
      "New appointment → Google Calendar event (requires a connected calendar).",
      "פגישה חדשה → אירוע ביומן Google (דורש חיבור יומן).",
      "Cita nueva → evento de Google Calendar (requiere calendario conectado).",
      "Novo agendamento → evento no Google Agenda (exige calendário conectado).",
      "موعد جديد → حدث في تقويم Google (يتطلب تقويمًا متصلًا)."
    ),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Google Calendar event", "אירוע ביומן Google", "Evento de Google Calendar", "Evento no Google Agenda", "حدث في تقويم Google"),
  },
  wf_appointment_email_gcal: {
    name: row("New appointment → email + Google Calendar", "פגישה חדשה → אימייל + Google Calendar", "Cita nueva → email + Google Calendar", "Novo agendamento → e-mail + Google Agenda", "موعد جديد → بريد + تقويم Google"),
    description: row(
      "Email confirmation + calendar event together.",
      "אישור במייל + יצירת אירוע ביומן יחד.",
      "Confirmación por email + evento de calendario juntos.",
      "Confirmação por e-mail + evento no calendário juntos.",
      "تأكيد بالبريد + إنشاء حدث في التقويم معًا."
    ),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Confirmation email", "אימייל אישור", "Email de confirmación", "E-mail de confirmação", "بريد تأكيد"),
    result2: row("Calendar event", "אירוע ביומן", "Evento de calendario", "Evento no calendário", "حدث في التقويم"),
  },
  wf_appointment_confirm_pack: {
    name: row("New appointment → email + task + alert", "פגישה חדשה → אימייל + משימה + התראה", "Cita nueva → email + tarea + aviso", "Novo agendamento → e-mail + tarefa + alerta", "موعد جديد → بريد + مهمة + تنبيه"),
    description: row(
      "Appointment confirmation pack for the team and the client, without WhatsApp.",
      "חבילת אישור פגישה לצוות וללקוח בלי WhatsApp.",
      "Paquete de confirmación de cita para el equipo y el cliente, sin WhatsApp.",
      "Pacote de confirmação de agendamento para a equipe e o cliente, sem WhatsApp.",
      "باقة تأكيد الموعد للفريق والعميل بدون واتساب."
    ),
    trigger: row("New appointment", "פגישה חדשה", "Cita nueva", "Novo agendamento", "موعد جديد"),
    result1: row("Email", "אימייל", "Email", "E-mail", "بريد"),
    result2: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
    result3: row("Alert", "התראה", "Aviso", "Alerta", "تنبيه"),
  },
  wf_appointment_done_email: {
    name: row("After the appointment → thank-you email", "אחרי פגישה → אימייל תודה", "Después de la cita → email de agradecimiento", "Após o agendamento → e-mail de agradecimento", "بعد الموعد → بريد شكر"),
    description: row(
      "When the appointment ends, a thank-you email is sent to the client.",
      "בסיום פגישה נשלח אימייל תודה ללקוח.",
      "Al terminar la cita se envía un email de agradecimiento al cliente.",
      "Ao encerrar o agendamento é enviado um e-mail de agradecimento ao cliente.",
      "عند انتهاء الموعد يُرسل بريد شكر للعميل."
    ),
    trigger: row("Appointment ended", "פגישה הסתיימה", "Cita finalizada", "Agendamento encerrado", "انتهى الموعد"),
    result1: row("Thank-you email", "אימייל תודה", "Email de agradecimiento", "E-mail de agradecimento", "بريد شكر"),
  },
  wf_appointment_duo: {
    name: row("New appointment → WhatsApp confirmation + reminder + task", "פגישה חדשה → אישור WhatsApp + תזכורת + משימה", "Cita nueva → confirmación WhatsApp + recordatorio + tarea", "Novo agendamento → confirmação WhatsApp + lembrete + tarefa", "موعد جديد → تأكيد واتساب + تذكير + مهمة"),
    description: row(
      "When an appointment is created: WhatsApp confirmation to the client, a prep task, and a reminder before the time (no thank-you after it ends).",
      "כשנוצרת פגישה: אישור WhatsApp ללקוח, משימת הכנה, ותזכורת לפני המועד (ללא הודעת תודה אחרי סיום).",
      "Al crear una cita: confirmación de WhatsApp al cliente, tarea de preparación y recordatorio antes de la hora (sin agradecimiento al terminar).",
      "Ao criar um agendamento: confirmação no WhatsApp ao cliente, tarefa de preparação e lembrete antes do horário (sem agradecimento ao encerrar).",
      "عند إنشاء موعد: تأكيد واتساب للعميل ومهمة تحضير وتذكير قبل الوقت (بدون رسالة شكر بعد الانتهاء)."
    ),
    trigger: row("New appointment / reminder beforehand", "פגישה חדשה / תזכורת לפני", "Cita nueva / recordatorio previo", "Novo agendamento / lembrete antecipado", "موعد جديد / تذكير مسبق"),
    result1: row("WhatsApp confirmation", "אישור WhatsApp", "Confirmación por WhatsApp", "Confirmação no WhatsApp", "تأكيد واتساب"),
    result2: row("Reminder beforehand", "תזכורת לפני", "Recordatorio previo", "Lembrete antecipado", "تذكير مسبق"),
    result3: row("Task", "משימה", "Tarea", "Tarefa", "مهمة"),
  },
};

export function extraWorkingTemplatesLocaleObject(locale) {
  return {
    automations: {
      working: Object.fromEntries(
        Object.entries(WORKING).map(([key, fields]) => [key, pickLocaleMap(fields, locale)])
      ),
    },
  };
}
