import { useTranslation } from "react-i18next";
import { getTextDirection, normalizeLanguage } from "../../../../i18n/localeUtils";

export type AdminWhatsAppCopy = {
  conversations: string;
  newMessage: string;
  searchConversations: string;
  searchContacts: string;
  noConversations: string;
  addContact: string;
  editContact: string;
  saveContact: string;
  savedContacts: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  country: string;
  notes: string;
  optional: string;
  cancel: string;
  save: string;
  send: string;
  preview: string;
  retry: string;
  back: string;
  sessionOpen: string;
  templateRequired: string;
  sendingFrom: string;
  replyFrom: string;
  chooseSender: string;
  freeForm: string;
  chooseTemplate: string;
  messagePlaceholder: string;
  templatePlaceholder: string;
  previewTitle: string;
  sendFailed: string;
  contactSavedBanner: string;
  duplicatePhone: string;
  outsideWindow: string;
  templateSendableOutsideWindow: string;
  unsavedHint: string;
  contactDetails: string;
  createRecipient: string;
  selectRecipient: string;
  noContacts: string;
  loading: string;
  sent: string;
  delivered: string;
  read: string;
  failed: string;
  queued: string;
  newMessages: string;
  allConnections: string;
  customerCard: string;
  close: string;
  required: string;
  phoneHint: string;
  ambiguousPhone: string;
  messageSent: string;
  templateSent: string;
};

const en: AdminWhatsAppCopy = {
  conversations: "Conversations",
  newMessage: "New Message",
  searchConversations: "Search company, person or phone",
  searchContacts: "Search by company, person or phone",
  noConversations: "No conversations yet",
  addContact: "Add Contact",
  editContact: "Edit contact",
  saveContact: "Save recipient",
  savedContacts: "Saved recipients",
  companyName: "Company name",
  contactPerson: "Contact person",
  phone: "WhatsApp phone",
  email: "Email",
  country: "Country",
  notes: "Notes",
  optional: "optional",
  cancel: "Cancel",
  save: "Save",
  send: "Send",
  preview: "Preview",
  retry: "Retry",
  back: "Back to conversations",
  sessionOpen: "24-hour window open",
  templateRequired: "Approved template required",
  sendingFrom: "Sending from",
  replyFrom: "Replying from",
  chooseSender: "Sender number",
  freeForm: "Free-form message",
  chooseTemplate: "Choose an approved template",
  messagePlaceholder: "Message",
  templatePlaceholder: "Choose a template to message outside the 24-hour window",
  previewTitle: "Preview",
  sendFailed: "Message failed",
  contactSavedBanner: "Recipient saved",
  duplicatePhone: "A recipient with this phone number is already saved",
  outsideWindow: "Free-form messages are only available inside the 24-hour window. Choose an approved template.",
  templateSendableOutsideWindow: "Approved template — can be sent outside the 24-hour window.",
  unsavedHint: "This number is not saved yet.",
  contactDetails: "Contact",
  createRecipient: "Create recipient",
  selectRecipient: "Select a recipient",
  noContacts: "No saved recipients match this search",
  loading: "Loading conversation…",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
  queued: "Sending",
  newMessages: "new messages",
  allConnections: "All",
  customerCard: "Customer card",
  close: "Close",
  required: "Required",
  phoneHint: "Include the country code, for example +1 415 555 0134",
  ambiguousPhone: "This phone matches more than one CRM record. Open the existing conversation instead of sending a new one.",
  messageSent: "WhatsApp message sent",
  templateSent: "WhatsApp template sent",
};

const he: AdminWhatsAppCopy = {
  ...en,
  conversations: "שיחות",
  newMessage: "הודעה חדשה",
  searchConversations: "חיפוש לפי חברה, איש קשר או טלפון",
  searchContacts: "חיפוש לפי חברה, איש קשר או טלפון",
  noConversations: "אין שיחות עדיין",
  addContact: "הוספת איש קשר",
  editContact: "עריכת איש קשר",
  saveContact: "שמירת נמען",
  savedContacts: "נמענים שמורים",
  companyName: "שם החברה",
  contactPerson: "איש הקשר",
  phone: "טלפון WhatsApp",
  email: "אימייל",
  country: "מדינה",
  notes: "הערות",
  optional: "אופציונלי",
  cancel: "ביטול",
  save: "שמירה",
  send: "שליחה",
  preview: "תצוגה מקדימה",
  retry: "נסו שוב",
  back: "חזרה לשיחות",
  sessionOpen: "חלון 24 שעות פתוח",
  templateRequired: "נדרשת תבנית מאושרת",
  sendingFrom: "שליחה מ",
  replyFrom: "מענה מ",
  chooseSender: "מספר שולח",
  freeForm: "הודעה חופשית",
  chooseTemplate: "בחירת תבנית מאושרת",
  messagePlaceholder: "הודעה",
  templatePlaceholder: "מחוץ לחלון 24 שעות יש לבחור תבנית מאושרת",
  previewTitle: "תצוגה מקדימה",
  sendFailed: "השליחה נכשלה",
  contactSavedBanner: "הנמען נשמר",
  duplicatePhone: "כבר קיים נמען עם מספר הטלפון הזה",
  outsideWindow: "הודעה חופשית אפשרית רק בתוך חלון 24 השעות. בחרו תבנית מאושרת.",
  templateSendableOutsideWindow: "תבנית מאושרת — אפשר לשלוח גם מחוץ לחלון 24 השעות.",
  unsavedHint: "המספר הזה עדיין לא שמור.",
  contactDetails: "איש קשר",
  createRecipient: "יצירת נמען",
  selectRecipient: "בחירת נמען",
  noContacts: "אין נמענים שמורים שתואמים לחיפוש",
  loading: "טוען שיחה…",
  sent: "נשלח",
  delivered: "נמסר",
  read: "נקרא",
  failed: "נכשל",
  queued: "נשלח",
  newMessages: "הודעות חדשות",
  allConnections: "הכל",
  customerCard: "כרטיס לקוח",
  close: "סגירה",
  required: "חובה",
  phoneHint: "כולל קידומת מדינה, למשל ‎+1 415 555 0134",
  ambiguousPhone: "מספר הטלפון משויך ליותר מרשומת CRM אחת. פתחו את השיחה הקיימת.",
  messageSent: "הודעת WhatsApp נשלחה",
  templateSent: "תבנית WhatsApp נשלחה",
};

const es: AdminWhatsAppCopy = {
  ...en,
  conversations: "Conversaciones",
  newMessage: "Mensaje nuevo",
  searchConversations: "Buscar empresa, persona o teléfono",
  searchContacts: "Buscar por empresa, persona o teléfono",
  noConversations: "Todavía no hay conversaciones",
  addContact: "Añadir contacto",
  editContact: "Editar contacto",
  saveContact: "Guardar destinatario",
  savedContacts: "Destinatarios guardados",
  companyName: "Nombre de la empresa",
  contactPerson: "Persona de contacto",
  phone: "Teléfono de WhatsApp",
  email: "Correo",
  country: "País",
  notes: "Notas",
  optional: "opcional",
  cancel: "Cancelar",
  save: "Guardar",
  send: "Enviar",
  preview: "Vista previa",
  retry: "Reintentar",
  back: "Volver a las conversaciones",
  sessionOpen: "Ventana de 24 horas abierta",
  templateRequired: "Se requiere una plantilla aprobada",
  sendingFrom: "Enviando desde",
  replyFrom: "Respondiendo desde",
  chooseSender: "Número remitente",
  freeForm: "Mensaje libre",
  chooseTemplate: "Elegir una plantilla aprobada",
  messagePlaceholder: "Mensaje",
  templatePlaceholder: "Fuera de la ventana de 24 horas hay que elegir una plantilla aprobada",
  previewTitle: "Vista previa",
  sendFailed: "El mensaje falló",
  contactSavedBanner: "Destinatario guardado",
  duplicatePhone: "Ya hay un destinatario con este teléfono",
  outsideWindow: "Los mensajes libres solo se pueden enviar dentro de la ventana de 24 horas. Elige una plantilla aprobada.",
  templateSendableOutsideWindow: "Plantilla aprobada: se puede enviar fuera de la ventana de 24 horas.",
  unsavedHint: "Este número todavía no está guardado.",
  contactDetails: "Contacto",
  createRecipient: "Crear destinatario",
  selectRecipient: "Seleccionar destinatario",
  noContacts: "Ningún destinatario coincide con la búsqueda",
  loading: "Cargando conversación…",
  sent: "Enviado",
  delivered: "Entregado",
  read: "Leído",
  failed: "Fallido",
  queued: "Enviando",
  newMessages: "mensajes nuevos",
  allConnections: "Todas",
  customerCard: "Ficha del cliente",
  close: "Cerrar",
  required: "Obligatorio",
  phoneHint: "Incluye el código de país, por ejemplo +1 415 555 0134",
  ambiguousPhone: "Este teléfono coincide con más de un registro de CRM. Abre la conversación existente.",
  messageSent: "Mensaje de WhatsApp enviado",
  templateSent: "Plantilla de WhatsApp enviada",
};

const ptBR: AdminWhatsAppCopy = {
  ...en,
  conversations: "Conversas",
  newMessage: "Nova mensagem",
  searchConversations: "Buscar empresa, pessoa ou telefone",
  searchContacts: "Buscar por empresa, pessoa ou telefone",
  noConversations: "Ainda não há conversas",
  addContact: "Adicionar contato",
  editContact: "Editar contato",
  saveContact: "Salvar destinatário",
  savedContacts: "Destinatários salvos",
  companyName: "Nome da empresa",
  contactPerson: "Pessoa de contato",
  phone: "Telefone do WhatsApp",
  email: "E-mail",
  country: "País",
  notes: "Notas",
  optional: "opcional",
  cancel: "Cancelar",
  save: "Salvar",
  send: "Enviar",
  preview: "Pré-visualizar",
  retry: "Tentar de novo",
  back: "Voltar às conversas",
  sessionOpen: "Janela de 24 horas aberta",
  templateRequired: "Modelo aprovado obrigatório",
  sendingFrom: "Enviando de",
  replyFrom: "Respondendo de",
  chooseSender: "Número remetente",
  freeForm: "Mensagem livre",
  chooseTemplate: "Escolher um modelo aprovado",
  messagePlaceholder: "Mensagem",
  templatePlaceholder: "Fora da janela de 24 horas, escolha um modelo aprovado",
  previewTitle: "Pré-visualização",
  sendFailed: "A mensagem falhou",
  contactSavedBanner: "Destinatário salvo",
  duplicatePhone: "Já existe um destinatário com este telefone",
  outsideWindow: "Mensagens livres só podem ser enviadas dentro da janela de 24 horas. Escolha um modelo aprovado.",
  templateSendableOutsideWindow: "Modelo aprovado — pode ser enviado fora da janela de 24 horas.",
  unsavedHint: "Este número ainda não foi salvo.",
  contactDetails: "Contato",
  createRecipient: "Criar destinatário",
  selectRecipient: "Selecionar destinatário",
  noContacts: "Nenhum destinatário corresponde à busca",
  loading: "Carregando conversa…",
  sent: "Enviada",
  delivered: "Entregue",
  read: "Lida",
  failed: "Falhou",
  queued: "Enviando",
  newMessages: "mensagens novas",
  allConnections: "Todas",
  customerCard: "Ficha do cliente",
  close: "Fechar",
  required: "Obrigatório",
  phoneHint: "Inclua o código do país, por exemplo +1 415 555 0134",
  ambiguousPhone: "Este telefone corresponde a mais de um registro do CRM. Abra a conversa existente.",
  messageSent: "Mensagem de WhatsApp enviada",
  templateSent: "Modelo de WhatsApp enviado",
};

const ar: AdminWhatsAppCopy = {
  ...en,
  conversations: "المحادثات",
  newMessage: "رسالة جديدة",
  searchConversations: "ابحث عن الشركة أو الشخص أو الهاتف",
  searchContacts: "ابحث بالشركة أو الشخص أو الهاتف",
  noConversations: "لا توجد محادثات بعد",
  addContact: "إضافة جهة اتصال",
  editContact: "تعديل جهة الاتصال",
  saveContact: "حفظ المستلم",
  savedContacts: "المستلمون المحفوظون",
  companyName: "اسم الشركة",
  contactPerson: "الشخص المسؤول",
  phone: "هاتف واتساب",
  email: "البريد الإلكتروني",
  country: "الدولة",
  notes: "ملاحظات",
  optional: "اختياري",
  cancel: "إلغاء",
  save: "حفظ",
  send: "إرسال",
  preview: "معاينة",
  retry: "إعادة المحاولة",
  back: "العودة إلى المحادثات",
  sessionOpen: "نافذة 24 ساعة مفتوحة",
  templateRequired: "يلزم قالب معتمد",
  sendingFrom: "الإرسال من",
  replyFrom: "الرد من",
  chooseSender: "رقم المرسل",
  freeForm: "رسالة حرة",
  chooseTemplate: "اختر قالباً معتمداً",
  messagePlaceholder: "رسالة",
  templatePlaceholder: "خارج نافذة 24 ساعة يجب اختيار قالب معتمد",
  previewTitle: "معاينة",
  sendFailed: "فشل الإرسال",
  contactSavedBanner: "تم حفظ المستلم",
  duplicatePhone: "يوجد مستلم محفوظ بهذا الرقم",
  outsideWindow: "الرسائل الحرة متاحة فقط داخل نافذة 24 ساعة. اختر قالباً معتمداً.",
  templateSendableOutsideWindow: "قالب معتمد — يمكن إرساله خارج نافذة 24 ساعة.",
  unsavedHint: "هذا الرقم غير محفوظ بعد.",
  contactDetails: "جهة الاتصال",
  createRecipient: "إنشاء مستلم",
  selectRecipient: "اختيار مستلم",
  noContacts: "لا يوجد مستلمون مطابقون للبحث",
  loading: "جارٍ تحميل المحادثة…",
  sent: "أُرسلت",
  delivered: "تم التسليم",
  read: "مقروءة",
  failed: "فشلت",
  queued: "جارٍ الإرسال",
  newMessages: "رسائل جديدة",
  allConnections: "الكل",
  customerCard: "بطاقة العميل",
  close: "إغلاق",
  required: "مطلوب",
  phoneHint: "أدخل رمز الدولة، مثلاً ‎+1 415 555 0134",
  ambiguousPhone: "يطابق هذا الرقم أكثر من سجل في نظام العملاء. افتح المحادثة الحالية.",
  messageSent: "تم إرسال رسالة واتساب",
  templateSent: "تم إرسال قالب واتساب",
};

const COPY: Record<string, AdminWhatsAppCopy> = {
  en,
  he,
  es,
  "pt-BR": ptBR,
  ar,
};

export function adminWhatsAppCopy(language?: string | null) {
  const lang = normalizeLanguage(language || "en") || "en";
  return COPY[lang] || en;
}

export function useAdminWhatsAppCopy() {
  const { i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.language) || "en";
  return {
    copy: COPY[lang] || en,
    dir: getTextDirection(lang) as "rtl" | "ltr",
    lang,
  };
}
