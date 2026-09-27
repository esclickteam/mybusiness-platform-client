/**
 * Guided-tour copy for the marketing modules.
 * Resolved by the selected demo language so catalog Hebrew is not shown in other locales.
 */

type StepCopy = { title: string; instruction: string };

const STEPS: Record<string, Record<string, StepCopy>> = {
  en: {
    "wa-overview": {
      title: "Receive and reply to WhatsApp conversations without leaving Bizuply.",
      instruction:
        "Connection status, business number, and usage on this screen are demo data. No live WhatsApp account is connected.",
    },
    "wa-inbox": {
      title: "Inbox",
      instruction:
        "Open a thread to see incoming and outgoing messages, time, and delivered or read status. Sarah Cohen is the same lead in the CRM.",
    },
    "wa-templates": {
      title: "Templates",
      instruction:
        "Welcome, Appointment Reminder, Lead Follow-up, Offer, and Thank You are approved demo templates. A new template is not submitted to Meta.",
    },
    "wa-flow": {
      title: "Follow up automatically using WhatsApp and automations.",
      instruction:
        "New lead, then CRM, then a WhatsApp welcome, a follow-up, and a sales task. Demo messages stay inside Bizuply.",
    },
    "meta-overview": {
      title: "Run and monitor your Meta campaigns.",
      instruction:
        "Spend, leads, cost per lead, and ROAS are demo fixtures for Demo Business Ads. This is not a live Meta account.",
    },
    "meta-list": {
      title: "Ads manager",
      instruction:
        "Open a campaign to see ad sets, ads, creative, audience, budget, and results. Publish stays inside the demo.",
    },
    "meta-lead": {
      title: "Every advertising lead is automatically connected to your CRM.",
      instruction:
        "Open the lead count to see people from the campaign, including Sarah Cohen from the September lead ad.",
    },
    "meta-journey": {
      title: "Track the customer from first click to sale.",
      instruction:
        "Meta campaign, then lead, CRM, WhatsApp, appointment or task, then automation — one Bizuply flow.",
    },
    "crm-open-daniel": {
      title: "Customer card",
      instruction: "Open Daniel Cohen’s card to see contact details, need, status, and history.",
    },
    "leads-open-maya": {
      title: "Open a lead",
      instruction: "Open Maya Levi’s card.",
    },
    "clients-open-yael": {
      title: "Open a client file",
      instruction: "Open Emma Brooks’s file.",
    },
  },
  he: {
    "wa-overview": {
      title: "קבלו והשיבו לשיחות WhatsApp בלי לצאת מ-Bizuply.",
      instruction:
        "סטטוס החיבור, מספר העסק ונתוני השימוש כאן הם נתוני דמו. אין חשבון WhatsApp חי.",
    },
    "wa-inbox": {
      title: "תיבת הודעות",
      instruction:
        "פתחו שיחה כדי לראות הודעות נכנסות ויוצאות, זמן, וסטטוס נמסר או נקרא. שרה כהן היא אותו ליד ב-CRM.",
    },
    "wa-templates": {
      title: "תבניות",
      instruction:
        "ברוכים הבאים, תזכורת פגישה, פולואפ לליד, הצעה ותודה הן תבניות דמו מאושרות. תבנית חדשה לא נשלחת ל-Meta.",
    },
    "wa-flow": {
      title: "המשיכו טיפול אוטומטי ב-WhatsApp ובאוטומציות.",
      instruction:
        "ליד חדש, אחר כך CRM, הודעת פתיחה ב-WhatsApp, פולואפ ומשימת מכירה. הודעות הדמו נשארות בתוך Bizuply.",
    },
    "meta-overview": {
      title: "נהלו ועקבו אחרי קמפיינים ב-Meta.",
      instruction:
        "הוצאה, לידים, עלות לליד ו-ROAS הם נתוני דמו של חשבון מודעות לדוגמה. זה לא חשבון Meta חי.",
    },
    "meta-list": {
      title: "מנהל המודעות",
      instruction:
        "פתחו קמפיין כדי לראות סטים, מודעות, קריאייטיב, קהל, תקציב ותוצאות. פרסום נשאר בתוך הדמו.",
    },
    "meta-lead": {
      title: "כל ליד מפרסום מחובר אוטומטית ל-CRM.",
      instruction:
        "פתחו את מספר הלידים כדי לראות את מי שהגיע מהקמפיין, כולל שרה כהן ממודעת הלידים.",
    },
    "meta-journey": {
      title: "עקבו אחרי הלקוח מהקליק הראשון ועד המכירה.",
      instruction:
        "קמפיין Meta, אחר כך ליד, CRM, WhatsApp, פגישה או משימה, ואז אוטומציה — מסלול אחד ב-Bizuply.",
    },
  },
  es: {
    "wa-overview": {
      title: "Reciba y responda conversaciones de WhatsApp sin salir de Bizuply.",
      instruction:
        "El estado de conexión, el número y el uso son datos demo. No hay una cuenta real de WhatsApp.",
    },
    "wa-inbox": {
      title: "Bandeja",
      instruction:
        "Abra un hilo para ver mensajes, hora y estado entregado o leído. Sarah Cohen es el mismo lead del CRM.",
    },
    "wa-templates": {
      title: "Plantillas",
      instruction:
        "Bienvenida, Recordatorio de cita, Seguimiento de lead, Oferta y Gracias son plantillas demo aprobadas. Una plantilla nueva no se envía a Meta.",
    },
    "wa-flow": {
      title: "Haga seguimiento automático con WhatsApp y automatizaciones.",
      instruction:
        "Lead nuevo, CRM, bienvenida por WhatsApp, seguimiento y tarea de ventas. Los mensajes demo no salen de Bizuply.",
    },
    "meta-overview": {
      title: "Gestione y supervise sus campañas de Meta.",
      instruction:
        "Gasto, leads, coste por lead y ROAS son datos demo de Cuenta publicitaria de demostración. No es una cuenta real de Meta.",
    },
    "meta-list": {
      title: "Administrador de anuncios",
      instruction:
        "Abra una campaña para ver conjuntos, anuncios, creatividades, audiencia, presupuesto y resultados. Publicar queda dentro del demo.",
    },
    "meta-lead": {
      title: "Cada lead de publicidad se conecta automáticamente al CRM.",
      instruction:
        "Abra el número de leads para ver a quienes llegaron de la campaña, incluida Sarah Cohen.",
    },
    "meta-journey": {
      title: "Siga al cliente desde el primer clic hasta la venta.",
      instruction:
        "Campaña de Meta, lead, CRM, WhatsApp, cita o tarea y automatización: un solo flujo en Bizuply.",
    },
    "crm-open-daniel": {
      title: "Ficha del cliente",
      instruction: "Abrir la ficha de Daniel Cohen para ver contacto, necesidad, estado e historial.",
    },
    "leads-open-maya": {
      title: "Abrir un lead",
      instruction: "Abrir la ficha de Maya Levi.",
    },
    "clients-open-yael": {
      title: "Abrir un expediente",
      instruction: "Abrir el expediente de Emma Brooks.",
    },
  },
  "pt-BR": {
    "wa-overview": {
      title: "Receba e responda conversas de WhatsApp sem sair do Bizuply.",
      instruction:
        "Status da conexão, número e uso são dados demo. Não há uma conta real de WhatsApp.",
    },
    "wa-inbox": {
      title: "Caixa de entrada",
      instruction:
        "Abra uma conversa para ver mensagens, horário e status entregue ou lido. Sarah Cohen é o mesmo lead do CRM.",
    },
    "wa-templates": {
      title: "Modelos",
      instruction:
        "Boas-vindas, Lembrete de compromisso, Acompanhamento de lead, Oferta e Obrigado são modelos demo aprovados. Um modelo novo não é enviado à Meta.",
    },
    "wa-flow": {
      title: "Faça o acompanhamento automaticamente com WhatsApp e automações.",
      instruction:
        "Novo lead, CRM, boas-vindas no WhatsApp, acompanhamento e tarefa de vendas. Mensagens demo ficam no Bizuply.",
    },
    "meta-overview": {
      title: "Gerencie e acompanhe suas campanhas da Meta.",
      instruction:
        "Gasto, leads, custo por lead e ROAS são dados demo de Conta de anúncios de demonstração. Não é uma conta real da Meta.",
    },
    "meta-list": {
      title: "Gerenciador de anúncios",
      instruction:
        "Abra uma campanha para ver conjuntos, anúncios, criativo, público, orçamento e resultados. Publicar fica dentro do demo.",
    },
    "meta-lead": {
      title: "Cada lead de anúncio entra automaticamente no CRM.",
      instruction:
        "Abra a contagem de leads para ver quem veio da campanha, incluindo Sarah Cohen.",
    },
    "meta-journey": {
      title: "Acompanhe o cliente do primeiro clique até a venda.",
      instruction:
        "Campanha da Meta, lead, CRM, WhatsApp, compromisso ou tarefa e automação — um fluxo só no Bizuply.",
    },
    "crm-open-daniel": {
      title: "Ficha do cliente",
      instruction: "Abra a ficha de Daniel Cohen para ver contato, necessidade, status e histórico.",
    },
    "leads-open-maya": {
      title: "Abrir um lead",
      instruction: "Abra a ficha de Maya Levi.",
    },
    "clients-open-yael": {
      title: "Abrir um prontuário",
      instruction: "Abra o prontuário de Emma Brooks.",
    },
  },
  ar: {
    "wa-overview": {
      title: "استقبلوا وردوا على محادثات WhatsApp دون مغادرة Bizuply.",
      instruction:
        "حالة الاتصال والرقم والاستخدام هنا بيانات تجريبية. لا يوجد حساب WhatsApp حقيقي.",
    },
    "wa-inbox": {
      title: "صندوق الوارد",
      instruction:
        "افتحوا محادثة لرؤية الرسائل والوقت وحالة التسليم أو القراءة. سارة كوهين هي نفس العميل في CRM.",
    },
    "wa-templates": {
      title: "القوالب",
      instruction:
        "مرحبا، تذكير بالموعد، متابعة عميل محتمل، عرض وشكرا قوالب تجريبية معتمدة. القالب الجديد لا يُرسل إلى Meta.",
    },
    "wa-flow": {
      title: "تابعوا تلقائيا عبر WhatsApp والأتمتة.",
      instruction:
        "عميل جديد ثم CRM ثم ترحيب WhatsApp ثم متابعة ثم مهمة مبيعات. رسائل العرض تبقى داخل Bizuply.",
    },
    "meta-overview": {
      title: "أديروا وراقبوا حملات Meta.",
      instruction:
        "الإنفاق والعملاء وتكلفة العميل وROAS بيانات تجريبية لحساب إعلانات تجريبي. هذا ليس حساب Meta حقيقيا.",
    },
    "meta-list": {
      title: "مدير الإعلانات",
      instruction:
        "افتحوا حملة لرؤية المجموعات والإعلانات والإبداع والجمهور والميزانية والنتائج. النشر يبقى داخل العرض.",
    },
    "meta-lead": {
      title: "كل عميل من الإعلان يتصل تلقائيا بـ CRM.",
      instruction:
        "افتحوا عدد العملاء لرؤية من وصل من الحملة، بمن فيهم سارة كوهين.",
    },
    "meta-journey": {
      title: "تتبعوا العميل من أول نقرة حتى البيع.",
      instruction:
        "حملة Meta ثم عميل ثم CRM ثم WhatsApp ثم موعد أو مهمة ثم أتمتة — مسار واحد في Bizuply.",
    },
    "crm-open-daniel": {
      title: "بطاقة العميل",
      instruction: "افتحوا بطاقة دانيال كوهين لرؤية التواصل والحاجة والحالة والسجل.",
    },
    "leads-open-maya": {
      title: "فتح عميل محتمل",
      instruction: "افتحوا بطاقة مايا ليفي.",
    },
    "clients-open-yael": {
      title: "فتح ملف عميلة",
      instruction: "افتحوا ملف إيما بروكس.",
    },
  },
};

const MODULES: Record<string, Record<string, string>> = {
  en: { whatsapp: "WhatsApp API", "meta-campaigns": "Meta Campaigns" },
  he: { whatsapp: "WhatsApp API", "meta-campaigns": "ניהול קמפיינים" },
  es: { whatsapp: "WhatsApp API", "meta-campaigns": "Campañas de Meta" },
  "pt-BR": { whatsapp: "WhatsApp API", "meta-campaigns": "Campanhas da Meta" },
  ar: { whatsapp: "WhatsApp API", "meta-campaigns": "حملات Meta" },
};

function localeBucket(language?: string) {
  const raw = String(language || "en").toLowerCase();
  if (raw.startsWith("he") || raw.startsWith("iw")) return "he";
  if (raw.startsWith("es")) return "es";
  if (raw.startsWith("pt")) return "pt-BR";
  if (raw.startsWith("ar")) return "ar";
  return "en";
}

export function tourStepText(stepId: string, language?: string) {
  const bucket = localeBucket(language);
  return STEPS[bucket]?.[stepId] || STEPS.en[stepId] || null;
}

export function tourModuleTitle(moduleKey: string, language?: string) {
  const bucket = localeBucket(language);
  return MODULES[bucket]?.[moduleKey] || MODULES.en[moduleKey] || "";
}
