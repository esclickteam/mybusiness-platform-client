/**
 * Deeper public copy for industry and service pages.
 * Limits match the pages already published: clinic pages are not medical records,
 * restaurants are not a POS, real estate is not a property ledger, expert site build
 * is the published $399 service, and human follow-up keeps $199 / $499 / $149.
 */

function page(title, description, crumb, h1, lede, sections, faq, links) {
  return { title, description, crumb, h1, lede, sections, faq, links };
}

const LINKS = {
  clinic: {
    en: [["/appointments", "Appointments"], ["/crm", "CRM"], ["/contact", "Contact"], ["/pricing", "Pricing"]],
    he: [["/appointments", "תורים"], ["/crm", "CRM"], ["/contact", "יצירת קשר"], ["/pricing", "מחירים"]],
    es: [["/appointments", "Citas"], ["/crm", "CRM"], ["/contact", "Contacto"], ["/pricing", "Precios"]],
    "pt-BR": [["/appointments", "Agenda"], ["/crm", "CRM"], ["/contact", "Contato"], ["/pricing", "Preços"]],
    ar: [["/appointments", "المواعيد"], ["/crm", "CRM"], ["/contact", "اتصال"], ["/pricing", "الأسعار"]],
  },
};

function links(kind, locale) {
  return (LINKS[kind] || LINKS.clinic)[locale];
}

const DEPTH = {};

function put(path, locales) {
  DEPTH[path] = locales;
}

put("/solutions/clinics", {
  en: page(
    "Clinic enquiries, clients and appointments | BizUply",
    "Run a clinic's enquiries, appointments and follow-up in BizUply. This is an operations workspace. It is not a medical-records system and it does not claim HIPAA or clinical compliance.",
    "Clinics",
    "A clinic runs more smoothly when the day is in one workspace",
    "A working clinic has new enquiries, people who already come, visits on the calendar and tasks that still need a person. BizUply can hold that operational work. It does not store a chart, a diagnosis or a regulated medical record.",
    [
      ["New enquiries for a visit", ["Someone asks for a time from the website form, from a Meta lead form when that connection is active, or by being added in the CRM. The lead keeps a source and one of six statuses: new, contacted, interested, converted, lost or old lead.", "Staff can write a note and open a dated task. The task is the next call or the next confirmation, not a clinical instruction."]],
      ["The appointment calendar", ["Hours are set for each day. Each service has a duration and a price. The calendar offers openings in steps of 15 minutes. A client can book on the public page when that page is on, and a confirmation email goes to the client and the clinic.", "Appointments belong to the business plan, at $99 per month or $990 per year. CRM only, at $49 per month, does not include the calendar."]],
      ["The relationship, not the chart", ["The client file holds contact details, the source, notes, tasks and the appointment. A payment status on the appointment is a field. It is not an automatic card charge.", "Diagnosis, imaging and any record a regulator expects stay in the clinical system the clinic already uses."]],
      ["More than one person on the same day", ["People who share the account see the same leads and the same calendar. What each person can open follows the roles already set on the account. This page does not add a permission model.", "On the business plan, an automation can create a follow-up task when a lead is new. It does not send a clinical message by itself."]],
    ],
    [
      ["How does a clinic manage appointments here?", "Set the hours and the service catalog. The calendar builds 15-minute openings from those settings. Clients can book on the public page when it is turned on."],
      ["How do new enquiries get tracked?", "A form or a manual entry creates a lead with a source and a status. Notes and dated tasks keep the next step on that lead."],
      ["Can several staff members use it?", "Yes, inside one business account. Access follows the roles already configured. This page does not invent a new role."],
      ["Is client information a medical record?", "No. BizUply keeps the business relationship and the appointment. It is not a medical-records system and it does not claim HIPAA or clinical compliance."],
    ],
    links("clinic", "en"),
  ),
  he: page(
    "מערכת לניהול קליניקה, לקוחות ותורים | BizUply",
    "ניהול פניות, תורים ומעקב של קליניקה ב־BizUply. זו סביבת עבודה תפעולית. היא אינה מערכת רשומות רפואיות ואינה טוענת לעמידה ב־HIPAA או בדרישות קליניות.",
    "קליניקות",
    "ניהול קליניקה מתחיל בסביבת עבודה מסודרת",
    "לקליניקה פעילה יש פניות חדשות, אנשים שכבר מגיעים, ביקורים ביומן ומשימות שעדיין מחכות לאדם. BizUply יכולה להחזיק את העבודה התפעולית הזו. היא לא שומרת גיליון, אבחון או רשומה רפואית מפוקחת.",
    [
      ["פניות חדשות לביקור", ["מישהו מבקש שעה מטופס באתר, מטופס לידים של Meta כשהחיבור פעיל, או בהוספה ידנית ב־CRM. הליד שומר מקור ואחד משישה סטטוסים: חדש, נוצר קשר, מעוניין, הומר, אבוד או ליד ישן.", "הצוות יכול לכתוב הערה ולפתוח משימה עם תאריך. המשימה היא השיחה הבאה או האישור הבא, לא הוראה קלינית."]],
      ["יומן התורים", ["מגדירים שעות לכל יום. לכל שירות יש משך ומחיר. היומן מציע חלונות בקפיצות של 15 דקות. לקוח יכול לקבוע בעמוד הציבורי כשהעמוד פעיל, ואישור נשלח במייל ללקוח ולקליניקה.", "התורים שייכים לחבילה העסקית, ב־99 דולר לחודש או 990 דולר לשנה. CRM בלבד, ב־49 דולר לחודש, לא כולל את היומן."]],
      ["הקשר עם הלקוח, לא התיק הרפואי", ["תיק הלקוח שומר פרטי קשר, מקור, הערות, משימות ותור. סטטוס תשלום על התור הוא שדה. הוא אינו חיוב אוטומטי של כרטיס.", "אבחון, הדמיה וכל רשומה שרגולטור מצפה לה נשארים במערכת הקלינית שהקליניקה כבר משתמשת בה."]],
      ["יותר מאדם אחד באותו יום", ["מי שחולקים את החשבון רואים את אותם לידים ואת אותו יומן. מה שכל אחד יכול לפתוח נקבע לפי התפקידים שכבר הוגדרו. העמוד הזה לא מוסיף מודל הרשאות.", "בחבילה העסקית אוטומציה יכולה ליצור משימת המשך כשליד חדש. היא לא שולחת מסר קליני בעצמה."]],
    ],
    [
      ["איך מנהלים תורים בקליניקה?", "מגדירים שעות וקטלוג שירותים. היומן בונה חלונות של 15 דקות מההגדרות האלה. לקוחות יכולים לקבוע בעמוד הציבורי כשהוא פעיל."],
      ["איך עוקבים אחרי פניות חדשות?", "טופס או הוספה ידנית יוצרים ליד עם מקור וסטטוס. הערות ומשימות עם תאריך שומרות את הצעד הבא על אותו ליד."],
      ["אפשר שכמה אנשי צוות ישתמשו?", "כן, בתוך חשבון עסק אחד. הגישה עוקבת אחרי התפקידים שכבר הוגדרו. העמוד הזה לא ממציא תפקיד חדש."],
      ["האם המידע על הלקוח הוא רשומה רפואית?", "לא. BizUply שומרת את הקשר העסקי ואת התור. היא אינה מערכת רשומות רפואיות ואינה טוענת ל־HIPAA או לעמידה קלינית."],
    ],
    links("clinic", "he"),
  ),
  es: page(
    "Consultas, clientes y citas para una clínica | BizUply",
    "Organice consultas, citas y seguimiento de una clínica en BizUply. Es un espacio operativo. No es un sistema de historia clínica y no afirma cumplir HIPAA ni una norma clínica.",
    "Clínicas",
    "Una clínica trabaja mejor cuando el día está en un solo espacio",
    "Una clínica activa tiene consultas nuevas, personas que ya vienen, visitas en la agenda y tareas que siguen esperando a alguien. BizUply puede guardar ese trabajo operativo. No guarda una ficha clínica, un diagnóstico ni una historia regulada.",
    [
      ["Consultas nuevas para una visita", ["Alguien pide una hora desde el formulario del sitio, desde un formulario de Meta cuando la conexión está activa, o se añade en el CRM. El lead guarda un origen y uno de seis estados: nuevo, contactado, interesado, convertido, perdido o lead antiguo.", "El equipo puede escribir una nota y abrir una tarea con fecha. La tarea es la próxima llamada o la confirmación, no una indicación clínica."]],
      ["La agenda", ["Se definen horarios por día. Cada servicio tiene duración y precio. La agenda ofrece huecos de 15 minutos. El cliente puede reservar en la página pública cuando está activa, y el correo de confirmación llega al cliente y a la clínica.", "Las citas pertenecen al plan de negocio, a 99 dólares al mes o 990 al año. CRM solo, a 49 dólares al mes, no incluye la agenda."]],
      ["La relación, no la historia clínica", ["La ficha guarda contacto, origen, notas, tareas y la cita. Un estado de pago en la cita es un campo. No es un cobro automático de tarjeta.", "El diagnóstico, las imágenes y cualquier registro que espere un regulador se quedan en el sistema clínico que la clínica ya usa."]],
      ["Más de una persona en el mismo día", ["Quienes comparten la cuenta ven los mismos leads y la misma agenda. Lo que cada persona abre sigue los roles ya configurados. Esta página no añade un modelo de permisos.", "En el plan de negocio, una automatización puede crear una tarea cuando el lead es nuevo. No envía un mensaje clínico por su cuenta."]],
    ],
    [
      ["¿Cómo se gestionan las citas?", "Defina horarios y el catálogo. La agenda arma huecos de 15 minutos. Los clientes reservan en la página pública cuando está activa."],
      ["¿Cómo se siguen las consultas nuevas?", "Un formulario o un alta manual crea un lead con origen y estado. Las notas y las tareas con fecha guardan el siguiente paso."],
      ["¿Pueden usarlo varias personas?", "Sí, dentro de una cuenta. El acceso sigue los roles ya configurados. Esta página no inventa un rol."],
      ["¿La información del cliente es una historia clínica?", "No. BizUply guarda la relación comercial y la cita. No es un sistema de historia clínica y no afirma HIPAA ni cumplimiento clínico."],
    ],
    links("clinic", "es"),
  ),
  "pt-BR": page(
    "Consultas, clientes e horários de uma clínica | BizUply",
    "Organize consultas, horários e acompanhamento de uma clínica na BizUply. É um espaço operacional. Não é prontuário e não afirma HIPAA nem conformidade clínica.",
    "Clínicas",
    "A clínica funciona melhor quando o dia está num único espaço",
    "Uma clínica ativa tem consultas novas, pessoas que já vêm, visitas na agenda e tarefas que ainda esperam alguém. A BizUply pode guardar esse trabalho operacional. Ela não guarda ficha clínica, diagnóstico nem registro regulado.",
    [
      ["Consultas novas para uma visita", ["Alguém pede um horário pelo formulário do site, por um formulário da Meta quando a conexão está ativa, ou é lançado no CRM. O lead guarda a origem e um de seis status: novo, contatado, interessado, convertido, perdido ou lead antigo.", "A equipe pode escrever uma nota e abrir uma tarefa com data. A tarefa é a próxima ligação ou a confirmação, não uma orientação clínica."]],
      ["A agenda", ["Definem-se horários por dia. Cada serviço tem duração e preço. A agenda oferece vagas de 15 minutos. O cliente pode reservar na página pública quando ela está ativa, e o e-mail de confirmação vai para o cliente e para a clínica.", "A agenda pertence ao plano de negócios, a 99 dólares por mês ou 990 por ano. O CRM sozinho, a 49 dólares por mês, não inclui a agenda."]],
      ["O relacionamento, não o prontuário", ["A ficha guarda contato, origem, notas, tarefas e o horário. Um status de pagamento no horário é um campo. Não é uma cobrança automática de cartão.", "Diagnóstico, imagens e qualquer registro que um regulador espere ficam no sistema clínico que a clínica já usa."]],
      ["Mais de uma pessoa no mesmo dia", ["Quem compartilha a conta vê os mesmos leads e a mesma agenda. O que cada pessoa abre segue os papéis já configurados. Esta página não acrescenta um modelo de permissões.", "No plano de negócios, uma automação pode criar uma tarefa quando o lead é novo. Ela não envia uma mensagem clínica sozinha."]],
    ],
    [
      ["Como se gerem os horários?", "Defina os horários e o catálogo. A agenda monta vagas de 15 minutos. Os clientes reservam na página pública quando ela está ativa."],
      ["Como se acompanham as consultas novas?", "Um formulário ou um lançamento manual cria um lead com origem e status. Notas e tarefas com data guardam o próximo passo."],
      ["Várias pessoas podem usar?", "Sim, numa conta. O acesso segue os papéis já configurados. Esta página não inventa um papel."],
      ["A informação do cliente é prontuário?", "Não. A BizUply guarda o relacionamento comercial e o horário. Não é prontuário e não afirma HIPAA nem conformidade clínica."],
    ],
    links("clinic", "pt-BR"),
  ),
  ar: page(
    "استفسارات العملاء والمواعيد لعيادة | BizUply",
    "أديروا استفسارات العيادة ومواعيدها ومتابعتها في BizUply. هذه مساحة تشغيل. ليست نظام سجلات طبية ولا تدّعي HIPAA أو امتثالاً سريرياً.",
    "عيادات",
    "إدارة العيادة تبدأ بمساحة عمل مرتبة",
    "للعيادة النشطة استفسارات جديدة، وأشخاص يأتون فعلاً، وزيارات في التقويم، ومهام ما زالت تنتظر شخصاً. تستطيع BizUply حفظ هذا العمل التشغيلي. لا تحفظ ملفاً طبياً أو تشخيصاً أو سجلاً خاضعاً للتنظيم.",
    [
      ["استفسارات جديدة لزيارة", ["يطلب أحد وقتاً من نموذج الموقع، أو من نموذج Meta حين يكون الربط نشطاً، أو يُضاف في CRM. يحتفظ العميل المحتمل بالمصدر وبواحدة من ست حالات: جديد، تم التواصل، مهتم، تم التحويل، مفقود، أو عميل محتمل قديم.", "يستطيع الفريق كتابة ملاحظة وفتح مهمة بتاريخ. المهمة هي الاتصال التالي أو التأكيد، وليست توجيهاً سريرياً."]],
      ["تقويم المواعيد", ["تُضبط ساعات كل يوم. لكل خدمة مدة وسعر. يعرض التقويم فتحات من 15 دقيقة. يمكن للعميل الحجز في الصفحة العامة حين تكون مفعّلة، وتصل رسالة التأكيد إلى العميل وإلى العيادة.", "المواعيد تابعة للخطة التجارية، بسعر 99 دولاراً شهرياً أو 990 سنوياً. CRM وحده، بسعر 49 دولاراً شهرياً، لا يشمل التقويم."]],
      ["العلاقة، لا الملف الطبي", ["يحفظ ملف العميل الاتصال والمصدر والملاحظات والمهام والموعد. حالة الدفع على الموعد حقل. ليست تحصيلاً تلقائياً للبطاقة.", "التشخيص والصور وأي سجل يتوقعه منظّم تبقى في النظام السريري الذي تستخدمه العيادة."]],
      ["أكثر من شخص في اليوم نفسه", ["من يشاركون الحساب يرون العملاء المحتملين والتقويم نفسهما. ما يفتحه كل شخص يتبع الأدوار المضبوطة. لا تضيف هذه الصفحة نموذج صلاحيات.", "في الخطة التجارية يمكن للأتمتة أن تنشئ مهمة حين يكون العميل المحتمل جديداً. لا ترسل رسالة سريرية من تلقاء نفسها."]],
    ],
    [
      ["كيف تُدار المواعيد في العيادة؟", "اضبطوا الساعات وكتالوج الخدمات. يبني التقويم فتحات من 15 دقيقة. يحجز العملاء في الصفحة العامة حين تكون مفعّلة."],
      ["كيف تُتابع الاستفسارات الجديدة؟", "ينشئ النموذج أو الإدخال اليدوي عميلاً محتملاً بمصدر وحالة. تحفظ الملاحظات والمهام المؤرخة الخطوة التالية."],
      ["هل يستطيع عدة أشخاص الاستخدام؟", "نعم، داخل حساب واحد. يتبع الوصول الأدوار المضبوطة. لا تخترع هذه الصفحة دوراً جديداً."],
      ["هل معلومات العميل سجل طبي؟", "لا. تحفظ BizUply العلاقة التجارية والموعد. ليست نظام سجلات طبية ولا تدّعي HIPAA أو امتثالاً سريرياً."],
    ],
    links("clinic", "ar"),
  ),
});

import { DEPTH_REST } from "./activityDepthRest.mjs";
import { DEPTH_MORE } from "./activityDepthMore.mjs";
import { DEPTH_SERVICES } from "./activityDepthServices.mjs";

Object.assign(DEPTH, DEPTH_REST, DEPTH_MORE, DEPTH_SERVICES);

export function getActivityDepth(path, locale) {
  const page = DEPTH[path];
  if (!page) return null;
  const language = locale === "pt" ? "pt-BR" : locale;
  return page[language] || page.en || null;
}
