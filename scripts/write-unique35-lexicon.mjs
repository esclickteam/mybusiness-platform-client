/**
 * unique35 — leftover newly-inserted section/element default chrome after unique34.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "השאירו פרטים ונחזור אליכם.": r(
    "Leave your details and we will get back to you.",
    "Dejad vuestros datos y os responderemos.",
    "Deixem os dados e retornaremos o contato.",
    "اتركوا بياناتكم وسنعود إليكم.",
  ),
  "השאירו פרטים ונחזור אליכם": r(
    "Leave your details and we will get back to you",
    "Dejad vuestros datos y os responderemos",
    "Deixem os dados e retornaremos o contato",
    "اتركوا بياناتكم وسنعود إليكم",
  ),
  "נחזור אליכם עם כל הפרטים.": r(
    "We will get back to you with all the details.",
    "Os responderemos con todos los detalles.",
    "Retornaremos com todos os detalhes.",
    "سنعود إليكم بكل التفاصيل.",
  ),
  "מלאו פרטים ונחזור אליכם.": r(
    "Fill in your details and we will get back to you.",
    "Rellenad los datos y os responderemos.",
    "Preencha os dados e retornaremos o contato.",
    "املأوا البيانات وسنعود إليكم.",
  ),
  "נחזור אליכם עם כל המידע.": r(
    "We will get back to you with all the information.",
    "Os responderemos con toda la información.",
    "Retornaremos com todas as informações.",
    "سنعود إليكم بكل المعلومات.",
  ),
  "ללא ספאם. אפשר להסיר הרשמה בכל רגע.": r(
    "No spam. You can unsubscribe at any time.",
    "Sin spam. Podéis daros de baja en cualquier momento.",
    "Sem spam. Dá para cancelar a inscrição a qualquer momento.",
    "بدون رسائل مزعجة. يمكن إلغاء الاشتراك في أي لحظة.",
  ),
  "כותרת חזקה מעל תמונת רקע": r(
    "A strong headline over a background image",
    "Un titular fuerte sobre una imagen de fondo",
    "Um título forte sobre uma imagem de fundo",
    "عنوان قوي فوق صورة خلفية",
  ),
  "אפשר להחליף לסרטון / תמונת קאבר": r(
    "You can switch this to a video / cover image",
    "Podéis cambiarlo a vídeo / imagen de portada",
    "Dá para trocar por vídeo / imagem de capa",
    "يمكن استبداله بفيديو / صورة غلاف",
  ),
  "תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.": r(
    "A short product description, a key benefit, and why it is worth buying.",
    "Una descripción breve del producto, un beneficio clave y por qué conviene comprarlo.",
    "Uma descrição curta do produto, um benefício principal e por que vale a pena comprar.",
    "وصف قصير للمنتج وميزة أساسية ولماذا يستحق الشراء.",
  ),
  "תיאור קצר של המוצר.": r(
    "A short product description.",
    "Una descripción breve del producto.",
    "Uma descrição curta do produto.",
    "وصف قصير للمنتج.",
  ),
  "תיאור קצר של המוצר או הקולקציה.": r(
    "A short description of the product or collection.",
    "Una descripción breve del producto o la colección.",
    "Uma descrição curta do produto ou da coleção.",
    "وصف قصير للمنتج أو المجموعة.",
  ),
  "לחצי כדי להחליף, להוסיף או לערוך מדיה.": r(
    "Click to replace, add, or edit media.",
    "Haced clic para reemplazar, añadir o editar medios.",
    "Clique para trocar, adicionar ou editar mídia.",
    "انقروا لاستبدال الوسائط أو إضافتها أو تعديلها.",
  ),
  "קבלת פרטים": r("Get details", "Recibir datos", "Receber dados", "الحصول على التفاصيل"),
  "מסר מרכזי": r("Key message", "Mensaje clave", "Mensagem principal", "رسالة رئيسية"),
  "איך זה עובד?": r("How it works?", "¿Cómo funciona?", "Como funciona?", "كيف يعمل؟"),
  "אמון במספרים": r("Trust in numbers", "Confianza en cifras", "Confiança em números", "ثقة بالأرقام"),
  "הטבה לנרשמים": r("Offer for subscribers", "Oferta para inscritos", "Oferta para inscritos", "عرض للمسجّلين"),
  "אזור וידאו": r("Video area", "Zona de vídeo", "Área de vídeo", "منطقة فيديو"),
  "אמון מוכח": r("Proven trust", "Confianza demostrada", "Confiança comprovada", "ثقة مثبتة"),
  "שיחה ראשונית קצרה": r("A short intro call", "Una llamada inicial breve", "Uma chamada inicial curta", "مكالمة تعارف قصيرة"),
  "שם מוצר": r("Product name", "Nombre del producto", "Nome do produto", "اسم المنتج"),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique35.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique35 rows`);
