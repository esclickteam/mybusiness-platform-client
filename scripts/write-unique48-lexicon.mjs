/**
 * unique48 — leftover Adion/Serenova/Justora body chrome after unique47 wraps.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and quotation-only marks.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Adion services
  עריכה: r("Editing", "Edición", "Edição", "مونتاج"),
  "משלב הרעיון ועד יום הצילום — אנחנו מנהלים את התהליך עם כיוון ויזואלי ברור ותקשורת מקצועית.": r(
    "From the idea to shoot day — we run the process with a clear visual direction and professional communication.",
    "Desde la idea hasta el día de rodaje — gestionamos el proceso con una dirección visual clara y comunicación profesional.",
    "Da ideia ao dia de filmagem — conduzimos o processo com direção visual clara e comunicação profissional.",
    "من الفكرة حتى يوم التصوير — ندير العملية بتوجيه بصري واضح وتواصل مهني.",
  ),
  "אנחנו מגדירים את האווירה, התנועה, הפריימים והקצב כדי שכל סצנה תרגיש מדויקת.": r(
    "We define the mood, motion, frames, and pace so every scene feels precise.",
    "Definimos el ambiente, el movimiento, los encuadres y el ritmo para que cada escena se sienta precisa.",
    "Definimos o clima, o movimento, os enquadramentos e o ritmo para que cada cena pareça precisa.",
    "نحدّد الأجواء والحركة والإطارات والإيقاع حتى تشعر كل لقطة بالدقة.",
  ),
  "חיתוך מדויק, צבע, סאונד וקצב הופכים חומר גלם לקמפיין מלוטש ומרשים.": r(
    "Precise cutting, color, sound, and pace turn raw footage into a polished, striking campaign.",
    "Un corte preciso, color, sonido y ritmo convierten el material en una campaña pulida e impactante.",
    "Corte preciso, cor, som e ritmo transformam o material bruto numa campanha polida e marcante.",
    "قصّ دقيق ولون وصوت وإيقاع يحوّلون المادة الخام إلى حملة مصقولة ومؤثّرة.",
  ),
  "סרט מותג": r("Brand film", "Película de marca", "Filme de marca", "فيلم علامة"),
  "צילום עריכתי": r("Editorial photography", "Fotografía editorial", "Fotografia editorial", "تصوير تحريري"),
  קמפיין: r("Campaign", "Campaña", "Campanha", "حملة"),
  "הקמפיין שלנו סוף סוף נראה קולנועי, יוקרתי וברור. הסרטון הסופי עזר לנו להשיק את המותג בביטחון.": r(
    "Our campaign finally looks cinematic, luxurious, and clear. The final film helped us launch the brand with confidence.",
    "Nuestra campaña por fin se ve cinematográfica, lujosa y clara. El vídeo final nos ayudó a lanzar la marca con confianza.",
    "Nossa campanha finalmente parece cinematográfica, luxuosa e clara. O filme final nos ajudou a lançar a marca com confiança.",
    "حملتنا أخيراً تبدو سينمائية وفاخرة وواضحة. الفيلم النهائي ساعدنا على إطلاق العلامة بثقة.",
  ),
  "התהליך היה מסודר, יצירתי ומהיר. כל פריים הרגיש מדויק ומחובר למותג שלנו.": r(
    "The process was organized, creative, and fast. Every frame felt precise and connected to our brand.",
    "El proceso fue ordenado, creativo y rápido. Cada fotograma se sentía preciso y conectado a nuestra marca.",
    "O processo foi organizado, criativo e rápido. Cada frame parecia preciso e ligado à nossa marca.",
    "كانت العملية منظّمة وإبداعية وسريعة. كل إطار بدا دقيقاً ومتصلاً بعلامتنا.",
  ),
  "הם הפכו את הסיפור שלנו לתוכן שנראה יקר, חד ומלא רגש.": r(
    "They turned our story into content that looks expensive, sharp, and full of emotion.",
    "Convirtieron nuestra historia en un contenido que se ve caro, nítido y lleno de emoción.",
    "Transformaram nossa história em conteúdo que parece caro, nítido e cheio de emoção.",
    "حوّلوا قصتنا إلى محتوى يبدو ثميناً وحاداً ومليئاً بالمشاعر.",
  ),
  "מנהלת קריאייטיב": r("Creative director", "Directora creativa", "Diretora criativa", "مديرة إبداع"),
  "מנהל שיווק": r("Marketing manager", "Director de marketing", "Gerente de marketing", "مدير تسويق"),
  "מנהלת מוצר": r("Product manager", "Directora de producto", "Gerente de produto", "مديرة منتج"),

  // Serenova experience strip
  התאמה: r("Matching", "Encaje", "Adequação", "ملاءمة"),
  "מורידים חשש ומסבירים איך זה עובד.": r(
    "We lower the worry and explain how it works.",
    "Bajamos la preocupación y explicamos cómo funciona.",
    "Diminuímos a preocupação e explicamos como funciona.",
    "نخفض القلق ونشرح كيف تعمل العملية.",
  ),
  "עוזרים לבחור שירות או מסלול מתאים.": r(
    "We help choose a fitting service or path.",
    "Ayudamos a elegir un servicio o itinerario adecuado.",
    "Ajudamos a escolher um serviço ou percurso adequado.",
    "نساعد على اختيار خدمة أو مسار مناسب.",
  ),
  "CTA ברור שמוביל להשארת פרטים.": r(
    "A clear CTA that leads to leaving details.",
    "Un CTA claro que lleva a dejar datos.",
    "Um CTA claro que leva a deixar dados.",
    "دعوة واضحة تؤدي إلى ترك التفاصيل.",
  ),

  // Justora fallbacks + leftover body
  "משרד עורכי דין שמעניק ייעוץ, אסטרטגיה וייצוג מקצועי לכל צורך משפטי — בדיסקרטיות, בהירות וזמינות.": r(
    "A law firm that provides advice, strategy, and professional representation for every legal need — with discretion, clarity, and availability.",
    "Un despacho que ofrece asesoría, estrategia y representación profesional para cada necesidad jurídica — con discreción, claridad y disponibilidad.",
    "Um escritório que oferece consultoria, estratégia e representação profissional para cada necessidade jurídica — com discrição, clareza e disponibilidade.",
    "مكتب محاماة يقدّم استشارة واستراتيجية وتمثيلاً مهنياً لكل حاجة قانونية — بتكتم ووضوح وتوافر.",
  ),
  "ייעוץ וליווי בסכסוכי עבודה, חוזים, פיטורין, זכויות עובדים ומעסיקים.": r(
    "Advice and support in labor disputes, contracts, dismissals, and employee and employer rights.",
    "Asesoría y acompañamiento en conflictos laborales, contratos, despidos y derechos de empleados y empleadores.",
    "Consultoria e acompanhamento em conflitos trabalhistas, contratos, demissões e direitos de empregados e empregadores.",
    "استشارة ومرافقة في نزاعات العمل والعقود والفصل وحقوق الموظفين وأصحاب العمل.",
  ),
  "ייצוג וליווי בתביעות נזיקין, תאונות, רשלנות ופגיעות משמעותיות.": r(
    "Representation and support in tort claims, accidents, negligence, and significant injuries.",
    "Representación y acompañamiento en reclamaciones de daños, accidentes, negligencia y lesiones graves.",
    "Representação e acompanhamento em ações de responsabilidade, acidentes, negligência e lesões graves.",
    "تمثيل ومرافقة في دعاوى الضرر والحوادث والإهمال والإصابات الجسيمة.",
  ),
  "נזקי גוף": r("Personal injury", "Lesiones corporales", "Danos corporais", "أضرار جسدية"),
  נזיקין: r("Torts", "Daños", "Responsabilidade civil", "أضرار"),
  חוזים: r("Contracts", "Contratos", "Contratos", "عقود"),
  "ניהול מחלוקת משפחתית רגישה שכללה אינטרסים אישיים, כלכליים ומשפטיים.": r(
    "Managing a sensitive family dispute that included personal, financial, and legal interests.",
    "Gestión de un conflicto familiar delicado que incluía intereses personales, económicos y jurídicos.",
    "Gestão de um conflito familiar delicado que incluía interesses pessoais, financeiros e jurídicos.",
    "إدارة خلاف عائلي حسّاس شمل مصالح شخصية ومالية وقانونية.",
  ),
  "בניית אסטרטגיית משא ומתן, ניסוח הסכם יציב והובלת הצדדים לפתרון שמגן על שני הצדדים.": r(
    "Building a negotiation strategy, drafting a stable agreement, and leading the parties to a solution that protects both sides.",
    "Construir una estrategia de negociación, redactar un acuerdo estable y llevar a las partes a una solución que proteja a ambos lados.",
    "Construir uma estratégia de negociação, redigir um acordo estável e levar as partes a uma solução que proteja os dois lados.",
    "بناء استراتيجية تفاوض وصياغة اتفاق ثابت وقيادة الطرفين إلى حل يحمي الجانبين.",
  ),
  "הושג הסכם ברור, יציב ומכבד, תוך צמצום משמעותי של זמן ההליך והפחתת מתחים.": r(
    "A clear, stable, and respectful agreement was reached, while significantly shortening the process and reducing tension.",
    "Se alcanzó un acuerdo claro, estable y respetuoso, acortando de forma notable el procedimiento y reduciendo tensiones.",
    "Foi alcançado um acordo claro, estável e respeitoso, encurtando de forma significativa o processo e reduzindo tensões.",
    "تم التوصل إلى اتفاق واضح وثابت ومحترم، مع تقليص ملحوظ لمدة الإجراء وخفض التوتر.",
  ),
  "סכסוך עסקי שכלל חשיפה כספית גבוהה, חוזים מורכבים ולחץ לסגירת ההליך במהירות.": r(
    "A business dispute that included high financial exposure, complex contracts, and pressure to close the matter quickly.",
    "Un conflicto empresarial con alta exposición económica, contratos complejos y presión para cerrar el procedimiento con rapidez.",
    "Um conflito empresarial com alta exposição financeira, contratos complexos e pressão para encerrar o processo com rapidez.",
    "نزاع تجاري شمل تعرّضاً مالياً عالياً وعقوداً معقّدة وضغطاً لإغلاق الإجراء بسرعة.",
  ),
  "ניתוח מסמכים, זיהוי נקודות סיכון, בניית קו משפטי וניהול משא ומתן ממוקד.": r(
    "Document analysis, identifying risk points, building a legal line, and running focused negotiation.",
    "Análisis de documentos, identificación de puntos de riesgo, construcción de una línea jurídica y negociación enfocada.",
    "Análise de documentos, identificação de pontos de risco, construção de uma linha jurídica e negociação focada.",
    "تحليل مستندات وتحديد نقاط الخطر وبناء خط قانوني وإدارة تفاوض مركّز.",
  ),
  "החשיפה הכספית צומצמה, ההליך נסגר בצורה מבוקרת והלקוח קיבל ודאות עסקית.": r(
    "Financial exposure was reduced, the matter closed in a controlled way, and the client gained business certainty.",
    "Se redujo la exposición económica, el procedimiento se cerró de forma controlada y el cliente obtuvo certeza empresarial.",
    "A exposição financeira foi reduzida, o processo foi encerrado de forma controlada e o cliente ganhou certeza empresarial.",
    "قُلّص التعرّض المالي وأُغلق الإجراء بشكل مضبوط وحصل الزبون على يقين تجاري.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique48.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique48 rows`);
