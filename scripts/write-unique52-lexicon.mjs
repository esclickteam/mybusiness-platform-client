/**
 * unique52 — leftover Cyclora/Chanel split headlines and remaining body chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and brand names.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  אסטרטגיות: r("Strategies", "Estrategias", "Estratégias", "استراتيجيات"),
  "גלו את": r("Discover", "Descubrid", "Descubram", "اكتشفوا"),
  בפועל: r("in practice", "en la práctica", "na prática", "عملياً"),
  "תוצאות מוכחות": r("Proven results", "Resultados comprobados", "Resultados comprovados", "نتائج مثبتة"),
  "השקה · אנליטיקה": r("Launch · analytics", "Lanzamiento · analítica", "Lançamento · analytics", "إطلاق · تحليلات"),
  "מנוע ניתוח נובה": r("Nova analysis engine", "Motor de análisis Nova", "Motor de análise Nova", "محرك تحليل Nova"),
  "קמפיין השקה": r("Launch campaign", "Campaña de lanzamiento", "Campanha de lançamento", "حملة إطلاق"),
  "אסטרטגיה · מוצר": r("Strategy · product", "Estrategia · producto", "Estratégia · produto", "استراتيجية · منتج"),
  "חזון צמיחה": r("Growth vision", "Visión de crecimiento", "Visão de crescimento", "رؤية نمو"),
  "מיתוג ומוצר": r("Branding and product", "Marca y producto", "Marca e produto", "علامة ومنتج"),
  "אוטומציה · מסחר": r("Automation · commerce", "Automatización · comercio", "Automação · comércio", "أتمتة · تجارة"),
  "זרם מסחר": r("Commerce stream", "Flujo comercial", "Fluxo comercial", "تدفق تجاري"),
  "מסע לקוח": r("Customer journey", "Viaje del cliente", "Jornada do cliente", "رحلة الزبون"),
  "פרסום · ביצועים": r("Ads · performance", "Ads · rendimiento", "Ads · performance", "إعلان · أداء"),
  "פולס שיווק": r("Marketing pulse", "Pulso de marketing", "Pulso de marketing", "نبض تسويق"),
  "קריאייטיב ביצועים": r("Performance creative", "Creativo de rendimiento", "Criativo de performance", "إبداع أداء"),
  "נבחרים על ידי מובילים": r(
    "Chosen by leaders",
    "Elegidos por líderes",
    "Escolhidos por líderes",
    "يختارهم قادة",
  ),
  אומרים: r("say", "dicen", "dizem", "يقولون"),
  מרשים: r("Impressive", "Impresionante", "Impressionante", "مثير"),
  מבריק: r("Brilliant", "Brillante", "Brilhante", "لامع"),
  מדהים: r("Amazing", "Asombroso", "Incrível", "مذهل"),
  אהבתי: r("Loved it", "Me encantó", "Adorei", "أحببته"),
  מצוין: r("Excellent", "Excelente", "Excelente", "ممتاز"),
  "המערכת החדשה הפכה את השיווק שלנו מתהליך מבולגן למנוע צמיחה ברור. בתוך שלושה חודשים קיצרנו זמני טיפול והגדלנו את כמות הפגישות.": r(
    "The new system turned our marketing from a messy process into a clear growth engine. Within three months we shortened handling times and increased meetings.",
    "El sistema nuevo convirtió nuestro marketing de un proceso desordenado en un motor de crecimiento claro. En tres meses acortamos tiempos de gestión y aumentamos las reuniones.",
    "O sistema novo transformou nosso marketing de um processo bagunçado num motor de crescimento claro. Em três meses encurtamos tempos de atendimento e aumentamos as reuniões.",
    "المنظومة الجديدة حوّلت تسويقنا من عملية فوضوية إلى محرك نمو واضح. خلال ثلاثة أشهر قصّرنا أوقات المعالجة وزدنا عدد الاجتماعات.",
  ),
  "שירות אישי": r("Personal service", "Servicio personal", "Serviço pessoal", "خدمة شخصية"),
  "ייעוץ סטיילינג, אריזת מתנה ומשלוח מהיר לכל הארץ.": r(
    "Styling advice, gift wrapping, and fast shipping nationwide.",
    "Asesoría de styling, envoltorio de regalo y envío rápido a todo el país.",
    "Consultoria de styling, embalagem de presente e envio rápido para o país todo.",
    "استشارة تنسيق وتغليف هدية وشحن سريع لكل البلاد.",
  ),
  "הקהילה שלנו": r("Our community", "Nuestra comunidad", "Nossa comunidade", "مجتمعنا"),
  "שמעורר השראה": r("that inspires", "que inspira", "que inspira", "يلهم"),
  "לקוחותינו משתפים את הרגעים שבהם האקססוריז של שאנל הופכים לחלק מהסיפור האישי שלהם.": r(
    "Our clients share the moments when the accessories become part of their personal story.",
    "Nuestros clientes comparten los momentos en que los accesorios pasan a ser parte de su historia personal.",
    "Nossos clientes compartilham os momentos em que os acessórios passam a fazer parte da história pessoal deles.",
    "زبائننا يشاركون اللحظات التي تصبح فيها الإكسسوارات جزءاً من قصتهم الشخصية.",
  ),
  "לוק ערב אלגנטי": r("An elegant evening look", "Un look de noche elegante", "Um look noturno elegante", "إطلالة سهرة أنيقة"),
  "יום עבודה מושלם": r("A perfect workday", "Un día de trabajo perfecto", "Um dia de trabalho perfeito", "يوم عمل مثالي"),
  "קולקציית אביב": r("Spring collection", "Colección de primavera", "Coleção de primavera", "مجموعة ربيع"),
  "אקססוריז יומיומיים": r("Everyday accessories", "Accesorios de cada día", "Acessórios do dia a dia", "إكسسوارات يومية"),
  "מתנה מיוחדת": r("A special gift", "Un regalo especial", "Um presente especial", "هدية خاصة"),
  "סטיילינג אישי": r("Personal styling", "Styling personal", "Styling pessoal", "تنسيق شخصي"),
  אמיתיות: r("real", "reales", "reais", "حقيقية"),
  "התיק שקניתי מחזיק מעמד שנים — האיכות מורגשת בכל תפר. שירות מדהים מההזמנה ועד המשלוח.": r(
    "The bag I bought lasts for years — you feel the quality in every stitch. Amazing service from order to delivery.",
    "El bolso que compré aguanta años — la calidad se nota en cada costura. Un servicio asombroso del pedido al envío.",
    "A bolsa que comprei dura anos — a qualidade se sente em cada costura. Serviço incrível do pedido até a entrega.",
    "الحقيبة التي اشتريتها تصمد سنوات — تُحسّ الجودة في كل غرزة. خدمة مذهلة من الطلب حتى التسليم.",
  ),
  "מסורת שפוגשת חדשנות": r(
    "Tradition that meets innovation",
    "Tradición que encuentra innovación",
    "Tradição que encontra inovação",
    "تقليد يلتقي الابتكار",
  ),
  מסורת: r("Tradition", "Tradición", "Tradição", "تقليد"),
  "שפוגשת חדשנות": r(
    "that meets innovation",
    "que encuentra innovación",
    "que encontra inovação",
    "يلتقي الابتكار",
  ),
  "כל פריט עובר תהליך ייצור מוקפד — מבחירת העור ועד הגימור הסופי. אנו עובדים עם אומנים מנוסים באיטליה.": r(
    "Every piece goes through a careful production process — from choosing the leather to the final finish. We work with experienced artisans in Italy.",
    "Cada pieza pasa por un proceso de fabricación cuidadoso — desde la elección del cuero hasta el acabado final. Trabajamos con artesanos expertos en Italia.",
    "Cada peça passa por um processo de fabricação cuidadoso — da escolha do couro até o acabamento final. Trabalhamos com artesãos experientes na Itália.",
    "كل قطعة تمر بعملية تصنيع دقيقة — من اختيار الجلد حتى التشطيب النهائي. نعمل مع حرفيين متمرسين في إيطاليا.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique52.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique52 rows`);
