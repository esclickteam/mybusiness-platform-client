/**
 * unique34 — leftover template/studio chrome after unique33.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "הוספת תמונה / וידאו": r("Add image / video", "Añadir imagen / vídeo", "Adicionar imagem / vídeo", "إضافة صورة / فيديو"),
  "בקשת הצעת מחיר": r("Request a quote", "Pedir presupuesto", "Pedir orçamento", "طلب عرض سعر"),
  "הנהלת חשבונות": r("Bookkeeping", "Contabilidad", "Contabilidade", "محاسبة"),
  "שירות פרימיום": r("Premium service", "Servicio premium", "Serviço premium", "خدمة مميزة"),
  "המלצות לקוחות": r("Customer reviews", "Reseñas de clientes", "Avaliações de clientes", "آراء العملاء"),
  "מוצרים נבחרים": r("Featured products", "Productos destacados", "Produtos em destaque", "منتجات مختارة"),
  "הכירו את כולם": r("Meet everyone", "Conoce a todos", "Conheçam todos", "تعرّفوا على الجميع"),
  "עיצוב אירועים": r("Event design", "Diseño de eventos", "Design de eventos", "تصميم فعاليات"),
  "תמונה + טקסט": r("Image + text", "Imagen + texto", "Imagem + texto", "صورة + نص"),
  "פרטים נוספים": r("More details", "Más detalles", "Mais detalhes", "تفاصيل إضافية"),
  "כל הפרויקטים": r("All projects", "Todos los proyectos", "Todos os projetos", "كل المشاريع"),
  "הצטרפו אלינו": r("Join us", "Únete", "Junte-se a nós", "انضموا إلينا"),
  "חנות אונליין": r("Online store", "Tienda online", "Loja online", "متجر إلكتروني"),
  "שירות לקוחות": r("Customer service", "Atención al cliente", "Atendimento ao cliente", "خدمة العملاء"),
  "הרשמה מוקדמת": r("Early registration", "Inscripción temprana", "Inscrição antecipada", "تسجيل مبكر"),
  "שירותי חשמל": r("Electrical services", "Servicios eléctricos", "Serviços elétricos", "خدمات كهرباء"),
  "לכל העבודות": r("See all work", "Ver todos los trabajos", "Ver todos os trabalhos", "لكل الأعمال"),
  "ייעוץ משפטי": r("Legal advice", "Asesoría legal", "Consultoria jurídica", "استشارة قانونية"),
  "הכירו אותנו": r("Meet us", "Conócenos", "Conheça-nos", "تعرّفوا علينا"),
  "עיצוב פנים": r("Interior design", "Diseño de interiores", "Design de interiores", "تصميم داخلي"),
  "כהה יוקרתי": r("Dark and luxurious", "Oscuro y lujoso", "Escuro e luxuoso", "داكن فاخر"),
  "קבלת קופון": r("Get a coupon", "Recibir cupón", "Receber cupom", "الحصول على قسيمة"),
  "הבלוג שלנו": r("Our blog", "Nuestro blog", "Nosso blog", "مدوّنتنا"),
  "שאלו אותנו": r("Ask us", "Pregúntanos", "Pergunte-nos", "اسألونا"),
  "כתבה ראשית": r("Featured article", "Artículo destacado", "Artigo principal", "مقال رئيسي"),
  "בחרו חבילה": r("Choose a pack", "Elige un pack", "Escolha um pacote", "اختاروا باقة"),
  "ליווי מלא": r("Full support", "Acompañamiento completo", "Acompanhamento completo", "مرافقة كاملة"),
  "מורה פרטי": r("Private tutor", "Profesor particular", "Professor particular", "معلم خصوصي"),
  "בניית אתר": r("Website building", "Creación de web", "Criação de site", "بناء موقع"),
  "תמונת קשר": r("Contact photo", "Foto de contacto", "Foto de contato", "صورة تواصل"),
  "נושא נוסף": r("Another topic", "Otro tema", "Outro tema", "موضوع إضافي"),
  "פורטפוליו": r("Portfolio", "Portafolio", "Portfólio", "معرض أعمال"),
  "נטוורקינג.": r("Networking.", "Networking.", "Networking.", "تواصل مهني."),
  "צ׳ק אין.": r("Check-in.", "Check-in.", "Check-in.", "تسجيل وصول."),
  "עד הבית.": r("To your door.", "A domicilio.", "Até em casa.", "حتى الباب."),
  "״מקצועי״": r("“Professional”", "“Profesional”", "“Profissional”", "«احترافي»"),
  "יום מלא.": r("A full day.", "Un día completo.", "Um dia inteiro.", "يوم كامل."),
  "יום ראשון.": r("Sunday.", "Domingo.", "Domingo.", "الأحد."),
  "מהסטודיו.": r("From the studio.", "Desde el estudio.", "Do estúdio.", "من الاستوديو."),
  "מפתח API": r("API developer", "Desarrollador API", "Desenvolvedor de API", "مطوّر API"),
  "קומפוזיציה בהירה.": r("A bright composition.", "Composición luminosa.", "Composição clara.", "تكوين مضيء."),
  "רשת שיתופי פעולה.": r("A partner network.", "Red de colaboraciones.", "Rede de parcerias.", "شبكة تعاون."),
  "חומרים אמיתיים.": r("Real materials.", "Materiales reales.", "Materiais reais.", "مواد حقيقية."),
  "דרמה מבוקרת.": r("Controlled drama.", "Drama controlado.", "Drama controlado.", "دراما محسوبة."),
  "רגע מדויק.": r("A precise moment.", "Un momento preciso.", "Um momento preciso.", "لحظة دقيقة."),
  "עבודת דגל.": r("A flagship piece.", "Obra insignia.", "Obra de destaque.", "عمل بارز."),
  "הכי נצפה.": r("Most viewed.", "Más visto.", "Mais visto.", "الأكثر مشاهدة."),
  "אוהבים הגזרה": r("They love the cut", "Les encanta el corte", "Amam o caimento", "يعشقون القصة"),
  "אזל מהמלאי": r("Out of stock", "Agotado", "Esgotado", "نفد من المخزون"),
  "בחרו וריאציה לפני הוספה לסל": r(
    "Choose a variant before adding to the cart",
    "Elige una variante antes de añadir al carrito",
    "Escolha uma variação antes de adicionar ao carrinho",
    "اختاروا خياراً قبل الإضافة إلى السلة",
  ),
  "בנינו את העסק סביב אמון – והלקוחות מרגישים את זה בכל מפגש.": r(
    "We built the business around trust — and customers feel it in every meeting.",
    "Construimos el negocio sobre confianza — y los clientes lo sienten en cada encuentro.",
    "Construímos o negócio em torno da confiança — e os clientes sentem isso em cada encontro.",
    "بنينا النشاط حول الثقة — والعملاء يشعرون بذلك في كل لقاء.",
  ),
  "עיצוב טוב מרגישים עוד לפני שמסבירים אותו.": r(
    "Good design is felt before it is explained.",
    "Un buen diseño se siente antes de explicarlo.",
    "Um bom design se sente antes de explicá-lo.",
    "التصميم الجيد يُحس قبل أن يُشرح.",
  ),
  "ליווי מקצועי מותאם למטרות העסק שלכם.": r(
    "Professional support tailored to your business goals.",
    "Acompañamiento profesional adaptado a vuestros objetivos.",
    "Acompanhamento profissional alinhado aos objetivos do seu negócio.",
    "مرافقة مهنية مكيّفة لأهداف نشاطكم.",
  ),
  "עורכים טקסטים, תמונות וצבעים בקלות.": r(
    "Edit texts, images, and colors easily.",
    "Edita textos, imágenes y colores con facilidad.",
    "Edite textos, imagens e cores com facilidade.",
    "حرّروا النصوص والصور والألوان بسهولة.",
  ),
  "זמינות גבוהה וליווי לאורך כל הדרך.": r(
    "High availability and support all the way.",
    "Alta disponibilidad y acompañamiento en todo el camino.",
    "Alta disponibilidade e acompanhamento o tempo todo.",
    "توفّر عالٍ ومرافقة على طول الطريق.",
  ),
  "מחירון נקי ומקצועי שמוביל לפנייה.": r(
    "A clean, professional price list that leads to contact.",
    "Una tarifa limpia y profesional que lleva al contacto.",
    "Uma tabela limpa e profissional que leva ao contato.",
    "قائمة أسعار نظيفة واحترافية تقود إلى التواصل.",
  ),
  "ממשק נקי, ברור ומדויק למותג שלכם.": r(
    "A clean, clear interface that matches your brand.",
    "Una interfaz limpia, clara y fiel a vuestra marca.",
    "Uma interface limpa, clara e fiel à sua marca.",
    "واجهة نظيفة وواضحة ودقيقة لعلامتكم.",
  ),
  "אסטרטגיה שמביאה לידים איכותיים.": r(
    "A strategy that brings quality leads.",
    "Una estrategia que trae leads de calidad.",
    "Uma estratégia que traz leads de qualidade.",
    "استراتيجية تجلب عملاء محتملين بجودة عالية.",
  ),
  "צבעים וטיפוגרפיה שמייצגים אתכם.": r(
    "Colors and typography that represent you.",
    "Colores y tipografía que os representan.",
    "Cores e tipografia que representam vocês.",
    "ألوان وخطوط تمثّلكم.",
  ),
  "מועדון לקוחות שמייצר חזרה לעסק": r(
    "A customer club that brings people back",
    "Un club de clientes que genera repetición",
    "Um clube de clientes que gera retorno",
    "نادي عملاء يعيد الزيارة للنشاط",
  ),
  "אזור פרויקטים, תהליך והוכחות חברתיות.": r(
    "A projects area, process, and social proof.",
    "Zona de proyectos, proceso y prueba social.",
    "Área de projetos, processo e prova social.",
    "منطقة مشاريع وعملية وإثبات اجتماعي.",
  ),
  "תיקונים, התקנות, שדרוגים ותחזוקה — עם מבנה תואם למוקאפ.": r(
    "Repairs, installs, upgrades, and maintenance — in a mockup-ready layout.",
    "Reparaciones, instalaciones, mejoras y mantenimiento — con estructura de mockup.",
    "Reparos, instalações, upgrades e manutenção — com estrutura de mockup.",
    "إصلاحات وتركيب وترقيات وصيانة — ببنية توافق النموذج.",
  ),
  "בקבוקי וינטג'": r("Vintage bottles", "Botellas vintage", "Garrafas vintage", "زجاجات عتيقة"),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique34.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique34 rows`);
