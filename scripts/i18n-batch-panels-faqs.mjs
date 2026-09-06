function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

function pickNested(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([id, fields]) => [
      id,
      Object.fromEntries(
        Object.entries(fields).map(([field, value]) => [field, value[locale] || value.en])
      ),
    ])
  );
}

function pickFaq(section, locale) {
  return {
    title: section.title[locale] || section.title.en,
    items: pickNested(section.items, locale),
  };
}

const FAQ_PROFILE = {
  title: row("FAQ — Business profile", "שאלות נפוצות – פרופיל עסקי", "FAQ — Perfil de negocio", "FAQ — Perfil do negócio", "أسئلة شائعة — ملف العمل"),
  items: {
    tabs: {
      question: row("How do I use the tabs on the business page?", "איך משתמשים בלשוניות השונות בדף העסק", "¿Cómo uso las pestañas de la página del negocio?", "Como uso as abas da página do negócio?", "كيف أستخدم تبويبات صفحة العمل؟"),
      answer: row(
        "The BizUply business page is a site you build and manage in the website builder. Tabs keep the information organized.\n\nHome: overview — name, description, and contact.\nGallery: photos and videos.\nReviews: customer ratings and performance.\nFAQ: common questions answered by the owner.\nCalendar: appointments and service bookings.\n\nEach tab gives visitors and the owner a focused, easy view.",
        "דף העסק ב-BizUply הוא אתר עסקי שאתם בונים ומנהלים דרך מערכת בניית האתרים. הוא מחולק ללשוניות שמאפשרות ניהול ותצוגה מסודרים.\n\nראשי: סקירה — שם, תיאור ופרטי קשר.\nגלריה: תמונות וסרטונים.\nביקורות: דירוגים ומעקב ביצועים.\nשאלות ותשובות: שאלות נפוצות מבעל העסק.\nיומן: תורים והזמנות שירות.\n\nכל לשונית מספקת מידע ממוקד.",
        "La página del negocio se construye en el editor. Las pestañas organizan: Inicio, Galería, Reseñas, FAQ y Calendario.",
        "A página do negócio é construída no editor. As abas organizam: Início, Galeria, Avaliações, FAQ e Agenda.",
        "صفحة العمل تُبنى في المحرر. التبويبات تنظّم: الرئيسية والمعرض والمراجعات والأسئلة والتقويم."
      ),
    },
    changesNotShowing: {
      question: row("What if my changes do not appear on the business page?", "מה לעשות אם השינויים שביצעתי לא מופיעים בדף העסק", "¿Qué hago si no veo mis cambios?", "O que fazer se as alterações não aparecerem?", "ماذا أفعل إذا لم تظهر تغييراتي؟"),
      answer: row(
        "After saving, try a hard refresh (Ctrl + F5 / Cmd + Shift + R), clear cache and cookies, check the internet, try another browser or device, wait 5–10 minutes, then sign out and back in. If it continues, contact support with screenshots.",
        "אם השינויים לא מופיעים לאחר שמירה: רענון מלא, ניקוי מטמון, בדיקת אינטרנט, דפדפן אחר, המתנה 5–10 דקות, התנתקות והתחברות. אם נמשך — פנו לתמיכה עם צילומי מסך.",
        "Tras guardar: refresco forzado, borra caché, revisa internet, prueba otro navegador, espera 5–10 minutos y cierra sesión. Si sigue, contacta a soporte.",
        "Após salvar: refresh forçado, limpe o cache, verifique a internet, tente outro navegador, aguarde 5–10 minutos e saia. Se continuar, fale com o suporte.",
        "بعد الحفظ: حدّث قسرياً وامسح الذاكرة وتحقق من الإنترنت وجرّب متصفحاً آخر وانتظر 5–10 دقائق ثم سجّل الخروج. إذا استمر تواصل مع الدعم."
      ),
    },
    editDetails: {
      question: row("How do I add or edit business details?", "איך מוסיפים או עורכים את פרטי העסק", "¿Cómo edito los datos del negocio?", "Como editar os dados do negócio?", "كيف أضيف أو أعدّل بيانات العمل؟"),
      answer: row(
        "Open the business page editor from the dashboard. You can update the name, description, phone, email, city, category, logo, and gallery. Click Save changes to apply.",
        "עברו ללוח הבקרה ופתחו את עורך דף העסק. ניתן לעדכן שם, תיאור, טלפון, דוא\"ל, עיר, קטגוריה, לוגו וגלריה. לחצו שמירת שינויים.",
        "Abre el editor desde el panel y actualiza nombre, descripción, contacto, ciudad, categoría, logo y galería. Pulsa Guardar.",
        "Abra o editor no painel e atualize nome, descrição, contato, cidade, categoria, logo e galeria. Clique Salvar.",
        "افتح المحرر من اللوحة وحدّث الاسم والوصف والتواصل والمدينة والفئة والشعار والمعرض. انقر حفظ."
      ),
    },
    gallery: {
      question: row("How do I manage the business photo gallery?", "איך מנהלים את גלריית התמונות של העסק", "¿Cómo gestiono la galería?", "Como gerencio a galeria?", "كيف أدير معرض صور العمل؟"),
      answer: row(
        "Main gallery: up to 5 primary photos on the profile.\nExtended gallery: more photos and videos under the Gallery tab.\nUse quality images and keep the content current.",
        "גלריה ראשית: עד 5 תמונות עיקריות.\nגלריה מורחבת: תמונות וסרטונים נוספים בלשונית הגלריה.\nהשתמשו בתמונות איכותיות ושמרו על תוכן מעודכן.",
        "Galería principal: hasta 5 fotos. Galería extendida: más fotos y videos. Usa imágenes de calidad.",
        "Galeria principal: até 5 fotos. Galeria estendida: mais fotos e vídeos. Use imagens de qualidade.",
        "المعرض الرئيسي: حتى 5 صور. الموسّع: مزيد من الصور والفيديو. استخدم صوراً جيدة."
      ),
    },
    categoryLocation: {
      question: row("Why do the business category and location matter?", "למה חשוב להגדיר נכון את קטגוריית העסק והמיקום", "¿Por qué importan categoría y ubicación?", "Por que categoria e localização importam?", "لماذا تهم فئة العمل والموقع؟"),
      answer: row(
        "Accurate category and location improve visibility and relevance: more exposure, more inquiries, better conversion, and better collaboration matches. Wrong settings can hide the business.",
        "קטגוריה ומיקום מדויקים משפרים נראות ורלוונטיות: יותר חשיפה, פניות, המרות ושיתופי פעולה. הגדרות שגויות מפחיתות נראות.",
        "Una categoría y ubicación precisas mejoran visibilidad, consultas, conversión y colaboraciones.",
        "Categoria e localização precisas melhoram visibilidade, consultas, conversão e colaborações.",
        "الفئة والموقع الدقيقان يحسّنان الظهور والاستفسارات والتحويل والتعاون."
      ),
    },
    accessIssue: {
      question: row("What if I cannot access the business page or the system?", "מה לעשות אם יש בעיה בגישה לדף העסק או למערכת", "¿Qué hago si no puedo acceder?", "O que fazer se eu não conseguir acessar?", "ماذا أفعل إذا تعذّر الوصول؟"),
      answer: row(
        "Check the internet, try another browser, clear cache and cookies, hard-refresh, and try another device or network. If it continues, contact support with screenshots.",
        "בדקו אינטרנט, נסו דפדפן אחר, נקו מטמון, רעננו במלואו ונסו מכשיר או רשת אחרת. אם נמשך — פנו לתמיכה עם צילומי מסך.",
        "Revisa internet, prueba otro navegador, borra caché, refresca y prueba otra red. Si sigue, contacta a soporte.",
        "Verifique a internet, tente outro navegador, limpe o cache, atualize e tente outra rede. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت وجرّب متصفحاً آخر وامسح الذاكرة وحدّث وجرّب شبكة أخرى. إذا استمر تواصل مع الدعم."
      ),
    },
    videos: {
      question: row("How do I add videos to the business page, and why?", "איך מוסיפים סרטונים לדף העסק ומה היתרונות", "¿Cómo añado videos y por qué?", "Como adicionar vídeos e por quê?", "كيف أضيف فيديوهات ولماذا؟"),
      answer: row(
        "Add videos in the Gallery tab. They show services visually, build trust, and raise engagement. Use MP4 and stay within the size limit.",
        "ניתן להוסיף סרטונים בלשונית הגלריה. יתרונות: הצגת שירותים, אמון ומעורבות. ודאו MP4 ובגודל המותר.",
        "Añádelos en Galería. Muestran servicios, generan confianza y engagement. Usa MP4 y el tamaño permitido.",
        "Adicione na Galeria. Mostram serviços, geram confiança e engajamento. Use MP4 e o tamanho permitido.",
        "أضفها في المعرض. تعرض الخدمات وتبني الثقة والمشاركة. استخدم MP4 وبالحجم المسموح."
      ),
    },
    services: {
      question: row("How do I add services or service categories?", "איך מוסיפים שירותים או קטגוריות שירות לדף העסק", "¿Cómo añado servicios?", "Como adicionar serviços?", "كيف أضيف خدمات أو فئات خدمات؟"),
      answer: row(
        "Services and categories are managed from the Calendar tab and the CRM. That improves booking, organization, marketing, and conversions.",
        "שירותים וקטגוריות מנוהלים דרך לשונית היומן וה-CRM. זה משפר תורים, ארגון, שיווק והמרות.",
        "Se gestionan en Calendario y CRM. Mejora reservas, organización, marketing y conversión.",
        "São geridos na Agenda e no CRM. Melhoram horários, organização, marketing e conversão.",
        "تُدار من التقويم وCRM. يحسّن ذلك المواعيد والتنظيم والتسويق والتحويل."
      ),
    },
    contactDetails: {
      question: row("How do I manage and customize contact details?", "איך מנהלים ומותאמים אישית את פרטי הקשר בדף העסק", "¿Cómo personalizo los datos de contacto?", "Como personalizar os dados de contato?", "كيف أدير بيانات التواصل وأخصّصها؟"),
      answer: row(
        "Contact details are managed in the dashboard and site editor. You can update phone, email, and address, add social links, and control what the public sees.",
        "פרטי הקשר מנוהלים בלוח הבקרה ובעורך. ניתן לעדכן טלפון, דוא\"ל וכתובת, להוסיף רשתות ולשלוט במה שמוצג לציבור.",
        "En el panel y el editor: teléfono, email, dirección, redes y qué se muestra al público.",
        "No painel e no editor: telefone, e-mail, endereço, redes e o que o público vê.",
        "في اللوحة والمحرر: الهاتف والبريد والعنوان والشبكات وما يظهر للعامة."
      ),
    },
    uploadSave: {
      question: row("What if image uploads or saving changes fail?", "איך מתמודדים עם בעיות בהעלאת תמונות או בשמירת שינויים", "¿Qué hago si falla la subida o el guardado?", "O que fazer se o envio ou o salvamento falhar?", "ماذا أفعل إذا فشل رفع الصور أو الحفظ؟"),
      answer: row(
        "Check file format (JPG/PNG, MP4), size limits, hard-refresh, cache, internet, another browser, and that you clicked Save. If it continues, contact support with screenshots.",
        "בדקו פורמט (JPG/PNG, MP4), גודל, רענון מלא, מטמון, אינטרנט, דפדפן אחר ולחיצה על שמירה. אם נמשך — פנו לתמיכה עם צילומי מסך.",
        "Revisa formato, tamaño, refresco, caché, internet, otro navegador y que pulsaste Guardar. Si sigue, contacta a soporte.",
        "Confira formato, tamanho, refresh, cache, internet, outro navegador e se clicou Salvar. Se continuar, fale com o suporte.",
        "تحقق من الصيغة والحجم والتحديث والذاكرة والإنترنت ومتصفح آخر وأنك ضغطت حفظ. إذا استمر تواصل مع الدعم."
      ),
    },
  },
};

const FAQ_COLLAB = {
  title: row("Business collaborations — FAQ", "שיתופי פעולה עסקיים – שאלות נפוצות", "Colaboraciones — FAQ", "Colaborações — FAQ", "التعاون التجاري — أسئلة شائعة"),
  items: {
    whatIs: {
      question: row("What is a business collaboration and how can it grow the business?", "מהו שיתוף פעולה עסקי ואיך הוא יכול לצמוח את העסק", "¿Qué es una colaboración y cómo crece el negocio?", "O que é uma colaboração e como ela cresce o negócio?", "ما هو التعاون التجاري وكيف ينمّي العمل؟"),
      answer: row(
        "A collaboration is two or more businesses working together on marketing, sales, or services.\n\nBenefits: wider reach, shared marketing cost, new audiences, more trust, and a better customer experience.\n\nChoose partners with matching values and goals.",
        "שיתוף פעולה הוא שותפות בין עסקים לשיווק, מכירות או שירותים.\n\nיתרונות: טווח הגעה, חלוקת עלויות, קהלים חדשים, אמון וחוויית לקוח.\n\nבחרו שותפים עם ערכים ומטרות תואמים.",
        "Es una alianza para marketing, ventas o servicios. Amplía alcance, comparte costes y genera confianza. Elige socios alineados.",
        "É uma aliança para marketing, vendas ou serviços. Amplia alcance, divide custos e gera confiança. Escolha parceiros alinhados.",
        "شراكة للتسويق أو المبيعات أو الخدمات. توسّع الوصول وتقاسم التكاليف وتبني الثقة. اختر شركاء متوافقين."
      ),
    },
    publish: {
      question: row("How do I publish a new collaboration offer on BizUply?", "איך מפרסמים הצעת שיתוף פעולה חדשה ב-BizUply", "¿Cómo publico una oferta de colaboración?", "Como publicar uma oferta de colaboração?", "كيف أنشر عرض تعاون في BizUply؟"),
      answer: row(
        "Fill the collaboration form with a clear title and description, what you offer and expect, plus contact, budget, and an expiry date. Offers are then matched to relevant businesses by category, location, and type.",
        "מלאו טופס עם כותרת ותיאור, מה אתם מציעים ומצפים, פרטי קשר, תקציב ותפוגה. ההצעות מופצות לפי קטגוריה, מיקום וסוג.",
        "Completa título, descripción, oferta/expectativa, contacto, presupuesto y caducidad. Se envía a negocios relevantes.",
        "Preencha título, descrição, oferta/expectativa, contato, orçamento e validade. É enviada a negócios relevantes.",
        "املأ العنوان والوصف وما تقدّم وتتوقع والتواصل والميزانية والانتهاء. يُوزَّع على أعمال ذات صلة."
      ),
    },
    choosePartner: {
      question: row("How do I find and choose the right collaboration partner?", "איך מזהים ובוחרים שותף שיתוף פעולה מתאים", "¿Cómo elijo al socio adecuado?", "Como escolher o parceiro certo?", "كيف أختار شريك التعاون المناسب؟"),
      answer: row(
        "Match values and goals, complementary audiences, reputation, added value, and a kickoff meeting for roles. Track KPIs so the collaboration stays on course.",
        "ודאו ערכים ומטרות, קהלים משלימים, מוניטין, ערך מוסף ופגישת היכרות. עקבו אחר KPI.",
        "Alinea valores, audiencias, reputación y una reunión de roles. Sigue KPI.",
        "Alinhe valores, públicos, reputação e uma reunião de papéis. Acompanhe KPI.",
        "وافق القيم والجمهور والسمعة واجتماع الأدوار. تابع مؤشرات الأداء."
      ),
    },
    manageWell: {
      question: row("What are the best ways to manage collaborations?", "מהן הדרכים הטובות ביותר לנהל שיתופי פעולה ביעילות", "¿Cómo gestiono colaboraciones bien?", "Como gerir colaborações bem?", "ما أفضل طرق إدارة التعاون؟"),
      answer: row(
        "Set goals and KPIs, assign roles, agree timelines, keep records, communicate clearly, track results, and handle issues early. BizUply has tools for structured collaboration.",
        "הגדירו מטרות ו-KPI, תפקידים, לוחות זמנים, רשומות, תקשורת, מעקב וטיפול מוקדם בסכסוכים. BizUply מספקת כלים לכך.",
        "Define metas, roles, plazos, registros, comunicación y seguimiento. BizUply da herramientas.",
        "Defina metas, papéis, prazos, registros, comunicação e acompanhamento. A BizUply dá ferramentas.",
        "حدّد أهدافاً وأدواراً وجداول وسجلات وتواصلاً ومتابعة. BizUply يوفّر أدوات لذلك."
      ),
    },
    received: {
      question: row("How do I view and manage incoming collaboration offers?", "איך צופים ומנהלים הצעות שיתוף פעולה שהתקבלו", "¿Cómo gestiono ofertas recibidas?", "Como gerir ofertas recebidas?", "كيف أدير عروض التعاون الواردة؟"),
      answer: row(
        "In Received offers you can view, filter, and search incoming proposals, judge fit, budget, and timeline, then approve or decline. Fast professional replies raise success.",
        "ב«הצעות שהתקבלו» ניתן לצפות, לסנן, להעריך התאמה ולאשר או לדחות. תגובה מהירה מגבירה הצלחה.",
        "En Recibidas puedes ver, filtrar, valorar e aprobar o rechazar. Responde rápido.",
        "Em Recebidas você vê, filtra, avalia e aprova ou recusa. Responda rápido.",
        "في الواردة يمكنك العرض والفلترة والتقييم ثم القبول أو الرفض. الرد السريع يزيد النجاح."
      ),
    },
    sent: {
      question: row("What are Sent offers and how do I manage them?", "מה פירוש «הצעות שנשלחו» ואיך מנהלים אותן", "¿Qué son las ofertas enviadas?", "O que são as ofertas enviadas?", "ما عروض «المُرسلة» وكيف أديرها؟"),
      answer: row(
        "Sent offers are the proposals you sent to other businesses. Track replies, keep notes, set follow-up reminders, and stay proactive in negotiation.",
        "«הצעות שנשלחו» הן מה ששלחתם. עקבו אחר תגובות, תעדו, הגדירו תזכורות ונהלו משא ומתן.",
        "Son las que enviaste. Sigue respuestas, anota, recuerda y negocia.",
        "São as que você enviou. Acompanhe respostas, anote, lembre e negocie.",
        "هي ما أرسلته. تابع الردود ووثّق وضَع تذكيرات وتفاوض."
      ),
    },
    expiry: {
      question: row("Do collaboration offers expire?", "האם יש תקופת תפוגה להצעת שיתוף פעולה", "¿Caducan las ofertas?", "As ofertas expiram?", "هل لعروض التعاون تاريخ انتهاء؟"),
      answer: row(
        "Yes. You can set an expiry and optional start/end dates. That keeps offers controlled, professional, and flexible. BizUply also supports digital agreements and e-signatures.",
        "כן. ניתן להגדיר תפוגה ותאריכי התחלה/סיום. זה שומר על שליטה ומקצועיות. BizUply תומכת גם בהסכמים דיגיטליים.",
        "Sí: caducidad y fechas opcionales. BizUply también admite acuerdos digitales.",
        "Sim: validade e datas opcionais. A BizUply também admite acordos digitais.",
        "نعم: يمكن تحديد انتهاء وتواريخ اختيارية. يدعم BizUply أيضاً الاتفاقيات الرقمية."
      ),
    },
    cannotSend: {
      question: row("What if I cannot send or publish a collaboration?", "מה לעשות אם לא ניתן לשלוח או לפרסם שיתוף פעולה", "¿Qué hago si no puedo publicar?", "O que fazer se eu não puder publicar?", "ماذا أفعل إذا تعذّر الإرسال أو النشر؟"),
      answer: row(
        "Fill required fields, check the internet, hard-refresh, try another browser, confirm permissions, and look for maintenance messages. Contact support if it continues.",
        "מלאו שדות נדרשים, בדקו אינטרנט, רעננו, נסו דפדפן אחר, ודאו הרשאות ובדקו תחזוקה. פנו לתמיכה אם נמשך.",
        "Completa campos, revisa internet, refresca, prueba otro navegador y permisos. Si sigue, contacta a soporte.",
        "Preencha campos, verifique a internet, atualize, tente outro navegador e permissões. Se continuar, fale com o suporte.",
        "أملأ الحقول وتحقق من الإنترنت وحدّث وجرّب متصفحاً آخر والصلاحيات. إذا استمر تواصل مع الدعم."
      ),
    },
    communicate: {
      question: row("How do I communicate with a potential partner?", "איך מתקשרים עם שותף שיתוף פעולה פוטנציאלי", "¿Cómo hablo con un socio potencial?", "Como falo com um parceiro potencial?", "كيف أتواصل مع شريك محتمل؟"),
      answer: row(
        "Use the contact details on the offer, BizUply messaging, meetings as needed, and keep written notes of agreements. Clear, professional communication is essential.",
        "השתמשו בפרטי הקשר שבהצעה, בהודעות BizUply, בפגישות ובתיעוד הסכמות. תקשורת ברורה חיונית.",
        "Usa el contacto de la oferta, mensajes de BizUply, reuniones y notas. La claridad es clave.",
        "Use o contato da oferta, mensagens da BizUply, reuniões e notas. Clareza é essencial.",
        "استخدم بيانات العرض ورسائل BizUply والاجتماعات والتوثيق. الوضوح ضروري."
      ),
    },
    disputes: {
      question: row("How should I handle disputes in collaborations?", "איך יש לטפל בסכסוכים או בבעיות בשיתופי פעולה", "¿Cómo gestiono conflictos?", "Como lidar com conflitos?", "كيف أتعامل مع النزاعات في التعاون؟"),
      answer: row(
        "Stay transparent, keep written agreements, set ground rules early, track expectations, mediate if needed, and hold review meetings. BizUply tools help track and resolve issues.",
        "שמרו על שקיפות, רשומות, כללי בסיס, מעקב, גישור ופגישות סקירה. BizUply מספקת כלים ליישוב ומעקב.",
        "Sé transparente, guarda acuerdos, define reglas, sigue expectativas y reúnete. BizUply ayuda a resolver.",
        "Seja transparente, guarde acordos, defina regras, acompanhe e reúna-se. A BizUply ajuda a resolver.",
        "كن شفافاً واحفظ الاتفاقات وضع قواعد وتابع التوقعات وعقد اجتماعات. أدوات BizUply تساعد على الحل."
      ),
    },
  },
};

const FAQ_ADVISOR = {
  title: row("FAQ — Business advisor", "שאלות נפוצות – היועץ העסקי", "FAQ — Asesor de negocio", "FAQ — Consultor do negócio", "أسئلة شائعة — المستشار"),
  items: {
    whatIs: {
      question: row("What is the business advisor and how can it help me?", "מהו היועץ העסקי ואיך הוא יכול לעזור לי", "¿Qué es el asesor y cómo me ayuda?", "O que é o consultor e como ele ajuda?", "ما هو المستشار وكيف يساعدني؟"),
      answer: row(
        "The BizUply advisor is AI business and marketing guidance from your real data: analysis, tailored recommendations, copy-ready wording, and planning.\n\nIt does not run actions. Build those in Automations / AI Automations.",
        "היועץ הוא ייעוץ עסקי ושיווקי מבוסס AI על נתוני העסק: ניתוח, המלצות, נוסחים ותכנון.\n\nהוא לא מבצע פעולות. פעולות נבנות באוטומציות AI.",
        "Es guía de IA con tus datos: análisis, recomendaciones y textos. No ejecuta; eso va en Automatizaciones.",
        "É orientação de IA com seus dados: análise, recomendações e textos. Não executa; isso fica em Automações.",
        "إرشاد ذكي من بياناتك: تحليل وتوصيات ونصوص. لا ينفّذ الإجراءات؛ ابنِها في الأتمتة."
      ),
    },
    whereAutomations: {
      question: row("Where do I build AI automations?", "איפה בונים אוטומציות AI?", "¿Dónde construyo automatizaciones IA?", "Onde construo automações de IA?", "أين أبني أتمتة الذكاء الاصطناعي؟"),
      answer: row(
        "Build them in the existing automation builder:\n\n1. Open the AI Automations tab inside the advisor.\n2. Pick an AI recipe (for example lead scoring or call summaries).\n3. The builder opens with the recipe ready to edit.\n\nThe advisor recommends. Automations execute.",
        "בונים בבונה האוטומציות:\n\n1. טאב אוטומציות AI בתוך היועץ.\n2. בחרו מתכון AI.\n3. נפתח הבונה לעריכה.\n\nהיועץ ממליץ. האוטומציות מבצעות.",
        "En Automatizaciones IA dentro del asesor: elige una receta y edítala. El asesor recomienda; las automatizaciones ejecutan.",
        "Em Automações IA no consultor: escolha uma receita e edite. O consultor recomenda; as automações executam.",
        "في تبويب أتمتة الذكاء داخل المستشار: اختر وصفة وعدّلها. المستشار يوصي والأتمتة تنفّذ."
      ),
    },
    readyOrFree: {
      question: row("How do I pick a ready question or ask a free question?", "איך בוחרים שאלה מוכנה או שואלים שאלה חופשית", "¿Pregunta lista o libre?", "Pergunta pronta ou livre?", "سؤال جاهز أم حر؟"),
      answer: row(
        "Ready questions give fast focused tips (what to do today, leads to handle, follow-up copy).\nFree questions get a tailored answer and next-step ideas — without running automations.\nFor automatic execution, go to AI Automations.",
        "שאלות מוכנות: המלצות מהירות.\nשאלות חופשיות: תשובה מותאמת בלי ביצוע.\nליישום אוטומטי — אוטומציות AI.",
        "Listas: tips rápidos. Libres: respuesta a medida sin ejecutar. Para ejecutar, ve a Automatizaciones.",
        "Prontas: dicas rápidas. Livres: resposta sob medida sem executar. Para executar, vá a Automações.",
        "الجاهزة: نصائح سريعة. الحرة: جواب مخصص دون تنفيذ. للتنفيذ اذهب إلى الأتمتة."
      ),
    },
    allBusinesses: {
      question: row("Do the answers fit every type of business?", "האם התשובות מתאימות לכל סוגי העסקים", "¿Las respuestas valen para cualquier negocio?", "As respostas servem para qualquer negócio?", "هل تناسب الإجابات كل أنواع الأعمال؟"),
      answer: row(
        "The advisor uses AI plus your real business data: profile, performance history, current activity, and goals. Complex legal or financial topics may still need a human expert.",
        "היועץ משלב AI עם נתוני העסק: פרופיל, היסטוריה, פעילות ומטרות. נושאים משפטיים או פיננסיים מורכבים עשויים לדרוש מומחה אנושי.",
        "Usa IA y tus datos reales. Temas legales o financieros complejos pueden requerir un experto.",
        "Usa IA e seus dados reais. Temas jurídicos ou financeiros complexos podem exigir um especialista.",
        "يستخدم الذكاء وبياناتك الحقيقية. المواضيع القانونية أو المالية المعقّدة قد تحتاج خبيراً بشرياً."
      ),
    },
    notInList: {
      question: row("What if my question is not in the list?", "מה אם השאלה שלי לא מופיעה ברשימה", "¿Y si mi pregunta no está en la lista?", "E se minha pergunta não estiver na lista?", "ماذا لو لم يظهر سؤالي في القائمة؟"),
      answer: row(
        "Ask anything in the free input. The advisor analyzes it in real time, answers, and suggests next steps you can do manually or turn into an automation.",
        "שאלו בשדה החופשי. היועץ מנתח בזמן אמת, עונה ומציע צעדים ידניים או כאוטומציה.",
        "Pregunta en el campo libre. Analiza, responde y sugiere pasos o una automatización.",
        "Pergunte no campo livre. Analisa, responde e sugere passos ou uma automação.",
        "اسأل في الحقل الحر. يحلّل ويجيب ويقترح خطوات أو أتمتة."
      ),
    },
    available247: {
      question: row("Is the service available 24/7?", "האם השירות זמין 24/7", "¿Está disponible 24/7?", "O serviço fica 24/7?", "هل الخدمة متاحة على مدار الساعة؟"),
      answer: row(
        "Yes. The advisor is available 24/7 for guidance, so you can decide faster at any hour.",
        "כן. היועץ זמין 24/7 לייעוץ והמלצות בכל שעה.",
        "Sí, 24/7 para orientación en cualquier momento.",
        "Sim, 24/7 para orientação a qualquer hora.",
        "نعم، على مدار الساعة للإرشاد في أي وقت."
      ),
    },
    maximize: {
      question: row("How do I get the most from the business advisor?", "איך ממקסמים את הערך מהיועץ העסקי", "¿Cómo saco más del asesor?", "Como aproveitar melhor o consultor?", "كيف أستفيد أكثر من المستشار؟"),
      answer: row(
        "Apply recommendations daily, build AI automations for repeat work, track results, and ask follow-up questions. The advisor advises. Automations execute.",
        "יישמו המלצות, בנו אוטומציות לפעולות חוזרות, עקבו אחר תוצאות ושאלו המשך. היועץ לייעוץ. האוטומציות לביצוע.",
        "Aplica consejos, crea automatizaciones, sigue resultados y pregunta más. El asesor guía; las automatizaciones ejecutan.",
        "Aplique dicas, crie automações, acompanhe resultados e pergunte mais. O consultor orienta; as automações executam.",
        "طبّق التوصيات وابنِ أتمتة للعمل المتكرر وتابع النتائج واسأل المزيد. المستشار يرشد والأتمتة تنفّذ."
      ),
    },
  },
};

const FAQ_CUSTOMER = {
  title: row("FAQs — Client messages", "שאלות נפוצות – הודעות לקוחות", "FAQ — Mensajes de clientes", "FAQ — Mensagens de clientes", "أسئلة شائعة — رسائل العملاء"),
  items: {
    viewMessages: {
      question: row("How can I view messages with clients?", "איך צופים בהודעות עם לקוחות", "¿Cómo veo los mensajes con clientes?", "Como ver mensagens com clientes?", "كيف أعرض الرسائل مع العملاء؟"),
      answer: row(
        "In Client Messages you can see every client with an active conversation.\n\n• Chats are ordered by most recent activity\n• Messages update in real time\n• Click a client to open the full history\n• Conversations are saved for later review",
        "בלשונית הודעות לקוחות מוצגת רשימת כל הלקוחות עם שיחה פעילה.\n\n• השיחות מסודרות לפי פעילות אחרונה\n• ההודעות מתעדכנות בזמן אמת\n• לחיצה על לקוח פותחת את כל ההיסטוריה\n• השיחות נשמרות לסקירה",
        "En Mensajes de clientes ves cada conversación activa, ordenada por actividad reciente y actualizada en tiempo real.",
        "Em Mensagens de clientes você vê cada conversa ativa, ordenada pela atividade recente e atualizada em tempo real.",
        "في رسائل العملاء ترى كل محادثة نشطة مرتبة حسب آخر نشاط وتُحدَّث فوراً."
      ),
    },
    sendNew: {
      question: row("How do I send a new message to a client?", "איך שולחים הודעה חדשה ללקוח", "¿Cómo envío un mensaje nuevo?", "Como enviar uma nova mensagem?", "كيف أرسل رسالة جديدة لعميل؟"),
      answer: row(
        "Select the client, type in the input, then click Send or press Enter. Messages are delivered instantly. You can also attach files, images, and links.",
        "בחרו לקוח, הקלידו בשדה, לחצו שליחה או Enter. ההודעות נשלחות מיידית. אפשר לצרף קבצים, תמונות וקישורים.",
        "Elige el cliente, escribe y pulsa Enviar o Enter. También puedes adjuntar archivos, imágenes y enlaces.",
        "Selecione o cliente, escreva e clique Enviar ou Enter. Também pode anexar arquivos, imagens e links.",
        "اختر العميل واكتب ثم أرسل. يمكن أيضاً إرفاق ملفات وصور وروابط."
      ),
    },
    notSent: {
      question: row("What should I do if a message is not sent?", "מה לעשות אם הודעה לא נשלחת", "¿Qué hago si no se envía el mensaje?", "O que fazer se a mensagem não for enviada?", "ماذا أفعل إذا لم تُرسل الرسالة؟"),
      answer: row(
        "Check the internet, hard-refresh, look for maintenance notices, try another browser, and confirm attachments meet size and format limits. Contact support if it continues.",
        "בדקו אינטרנט, רענון מלא, הודעות תחזוקה, דפדפן אחר ומגבלות קבצים. פנו לתמיכה אם נמשך.",
        "Revisa internet, refresca, avisos de mantenimiento, otro navegador y límites de archivos. Si sigue, contacta a soporte.",
        "Verifique a internet, atualize, avisos de manutenção, outro navegador e limites de arquivo. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت والتحديث والصيانة ومتصفح آخر وحدود الملفات. إذا استمر تواصل مع الدعم."
      ),
    },
    readReceipt: {
      question: row("How will I know if the client has read my message?", "איך אדע אם הלקוח קרא את ההודעה", "¿Cómo sé si el cliente leyó el mensaje?", "Como sei se o cliente leu a mensagem?", "كيف أعرف أن العميل قرأ رسالتي؟"),
      answer: row(
        "The system does not show read receipts. Chats update in real time and you can see when the client replies or starts typing. If confirmation is critical, ask directly or use another channel.",
        "אין אישורי קריאה. השיחות מתעדכנות בזמן אמת ורואים כשהלקוח משיב או מקליד. לאישור קריטי — בקשו ישירות או השתמשו בערוץ אחר.",
        "No hay confirmación de lectura. El chat se actualiza en vivo. Si es crítico, pídelo o usa otro canal.",
        "Não há confirmação de leitura. O chat atualiza ao vivo. Se for crítico, peça ou use outro canal.",
        "لا توجد إيصالات قراءة. الدردشة تتحدث فوراً. إن لزم التأكيد اطلبه مباشرة أو استخدم قناة أخرى."
      ),
    },
    historical: {
      question: row("Can I view historical messages with clients?", "האם אפשר לצפות בהודעות היסטוריות", "¿Puedo ver el historial?", "Posso ver o histórico?", "هل يمكنني رؤية سجل الرسائل؟"),
      answer: row(
        "Yes. All messages are stored. Scroll older chats, search by keyword or date, and keep continuity with each client.",
        "כן. כל ההודעות נשמרות. ניתן לגלול שיחות ישנות, לחפש לפי מילה או תאריך ולשמור רצף מול כל לקוח.",
        "Sí. Todo se guarda. Desplázate, busca por palabra o fecha y mantén continuidad.",
        "Sim. Tudo é guardado. Role, busque por palavra ou data e mantenha continuidade.",
        "نعم. تُحفظ كل الرسائل. مرّر وابحث بالكلمة أو التاريخ واحفظ الاستمرارية."
      ),
    },
    notUpdating: {
      question: row("What if client messages are not updating in real time?", "מה לעשות אם ההודעות לא מתעדכנות בזמן אמת", "¿Y si no se actualizan en tiempo real?", "E se não atualizar em tempo real?", "ماذا لو لم تتحدث الرسائل فوراً؟"),
      answer: row(
        "Check the internet, refresh, clear cache and cookies, try another browser or device, and look for maintenance. Contact support with screenshots if it continues.",
        "בדקו אינטרנט, רעננו, נקו מטמון, נסו דפדפן או מכשיר אחר ובדקו תחזוקה. פנו לתמיכה עם צילומים אם נמשך.",
        "Revisa internet, refresca, borra caché, prueba otro navegador y mantenimiento. Si sigue, contacta a soporte.",
        "Verifique a internet, atualize, limpe o cache, tente outro navegador e manutenção. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت وحدّث وامسح الذاكرة وجرّب متصفحاً آخر والصيانة. إذا استمر تواصل مع الدعم."
      ),
    },
    sendFiles: {
      question: row("Can I send files or links in messages?", "האם אפשר לשלוח קבצים או קישורים", "¿Puedo enviar archivos o enlaces?", "Posso enviar arquivos ou links?", "هل يمكن إرسال ملفات أو روابط؟"),
      answer: row(
        "Yes: documents (PDF, DOC), images (JPG, PNG), and external links. Stay within the size limit (usually up to 5MB) and supported formats.",
        "כן: מסמכים (PDF, DOC), תמונות (JPG, PNG) וקישורים. עמדו במגבלת הגודל (בדרך כלל עד 5MB) ובפורמטים נתמכים.",
        "Sí: documentos, imágenes y enlaces. Respeta el tamaño (hasta 5MB) y los formatos.",
        "Sim: documentos, imagens e links. Respeite o tamanho (até 5MB) e os formatos.",
        "نعم: مستندات وصور وروابط. التزم بالحد (عادة حتى 5MB) والصيغ المدعومة."
      ),
    },
    mistaken: {
      question: row("How do I handle incorrect or duplicate messages sent by mistake?", "איך מטפלים בהודעות שגויות או כפולות", "¿Qué hago con un mensaje enviado por error?", "O que fazer com uma mensagem enviada por engano?", "ماذا أفعل برسالة أُرسلت بالخطأ؟"),
      answer: row(
        "Messages cannot be edited or deleted after sending. Send a clarification, apologize if needed, and review carefully before the next send.",
        "לא ניתן לערוך או למחוק אחרי שליחה. שלחו הבהרה, התנצלו במידת הצורך ובדקו לפני השליחה הבאה.",
        "No se puede editar ni borrar. Envía una aclaración, discúlpate si hace falta y revisa antes de enviar.",
        "Não dá para editar nem apagar. Envie um esclarecimento, peça desculpas se preciso e revise antes de enviar.",
        "لا يمكن التعديل أو الحذف بعد الإرسال. أرسل توضيحاً واعتذر عند الحاجة وراجع قبل الإرسال التالي."
      ),
    },
    listNotLoad: {
      question: row("What if the chat or client list does not load?", "מה לעשות אם הצ'אט או רשימת הלקוחות לא נטענים", "¿Y si no carga el chat o la lista?", "E se o chat ou a lista não carregar?", "ماذا لو لم تُحمَّل الدردشة أو القائمة؟"),
      answer: row(
        "Check the internet, refresh, clear cache and cookies, try another browser or device, and look at system status. Contact support with screenshots and timing if it continues.",
        "בדקו אינטרנט, רעננו, נקו מטמון, נסו דפדפן או מכשיר אחר וסטטוס מערכת. פנו לתמיכה עם צילומים ושעה אם נמשך.",
        "Revisa internet, refresca, borra caché, prueba otro navegador y el estado del sistema. Si sigue, contacta a soporte.",
        "Verifique a internet, atualize, limpe o cache, tente outro navegador e o status do sistema. Se continuar, fale com o suporte.",
        "تحقق من الإنترنت وحدّث وامسح الذاكرة وجرّب متصفحاً آخر وحالة النظام. إذا استمر تواصل مع الدعم."
      ),
    },
    multiple: {
      question: row("Can I manage multiple client conversations at the same time?", "האם אפשר לנהל כמה שיחות במקביל", "¿Puedo gestionar varias conversaciones?", "Posso gerir várias conversas?", "هل يمكن إدارة عدة محادثات معاً؟"),
      answer: row(
        "Yes. Switch from the side list, get new-message notifications, and keep chats open. That improves response speed.",
        "כן. אפשר לעבור מרשימת הצד, לקבל התראות ולהשאיר שיחות פתוחות. זה משפר מהירות מענה.",
        "Sí. Cambia desde la lista, recibe avisos y deja chats abiertos. Mejora la velocidad de respuesta.",
        "Sim. Troque pela lista, receba avisos e mantenha chats abertos. Melhora a velocidade de resposta.",
        "نعم. انتقل من القائمة واستلم التنبيهات وأبقِ الدردشات مفتوحة. يحسّن ذلك سرعة الرد."
      ),
    },
  },
};

const MORNING = {
  loadError: row("Could not load Morning settings", "שגיאה בטעינת הגדרות Morning", "No se pudieron cargar los ajustes de Morning", "Não foi possível carregar as configurações do Morning", "تعذّر تحميل إعدادات Morning"),
  saved: row("Settings saved successfully", "ההגדרות נשמרו בהצלחה", "Ajustes guardados", "Configurações salvas", "تم حفظ الإعدادات"),
  saveError: row("Could not save", "שגיאה בשמירה", "No se pudo guardar", "Não foi possível salvar", "تعذّر الحفظ"),
  testOk: row("Connection succeeded{{suffix}}", "החיבור הצליח{{suffix}}", "Conexión correcta{{suffix}}", "Conexão ok{{suffix}}", "نجح الاتصال{{suffix}}"),
  testFail: row("Connection test failed", "בדיקת החיבור נכשלה", "Falló la prueba de conexión", "O teste de conexão falhou", "فشل اختبار الاتصال"),
  loading: row("Loading Morning settings...", "טוען הגדרות Morning...", "Cargando ajustes de Morning...", "Carregando configurações do Morning...", "جارٍ تحميل إعدادات Morning..."),
  title: row("Morning — Green Invoice", "Morning — חשבונית ירוקה", "Morning — factura verde", "Morning — fatura verde", "Morning — فاتورة خضراء"),
  description: row(
    "Connect the Morning API to issue tax invoices / receipts automatically on paid store orders. Requires a Morning Best plan or higher.",
    "חיבור ל-API של Morning להפקת חשבוניות מס/קבלה אוטומטית על הזמנות מהחנות. דורש מנוי Best ומעלה ב-Morning.",
    "Conecta Morning para emitir facturas automáticamente en pedidos pagados. Requiere plan Best o superior.",
    "Conecte o Morning para emitir faturas automaticamente em pedidos pagos. Exige plano Best ou superior.",
    "اربط Morning لإصدار الفواتير تلقائياً للطلبات المدفوعة. يتطلب خطة Best أو أعلى."
  ),
  guideTitle: row("Connection guide — 4 steps", "מדריך חיבור — 4 שלבים", "Guía de conexión — 4 pasos", "Guia de conexão — 4 etapas", "دليل الربط — 4 خطوات"),
  step1Title: row("1. Best+ plan", "1. מנוי Best+", "1. Plan Best+", "1. Plano Best+", "1. خطة Best+"),
  step1Body: row("Make sure you have a Morning Best plan or higher. For tests you can use a sandbox account:", "ודאו שיש לכם מנוי Best ומעלה ב-Morning. לבדיקות אפשר חשבון בדיקות:", "Asegúrate de tener plan Best o superior. Para pruebas usa una cuenta sandbox:", "Tenha um plano Best ou superior. Para testes use uma conta sandbox:", "تأكد من خطة Best أو أعلى. للاختبار يمكن حساب تجريبي:"),
  sandboxSignup: row("Sign up for a test account", "הרשמה לחשבון בדיקות", "Crear cuenta de prueba", "Criar conta de teste", "التسجيل لحساب تجريبي"),
  step2Title: row("2. Create an API key", "2. יצירת מפתח API", "2. Crear clave API", "2. Criar chave de API", "2. إنشاء مفتاح API"),
  step2Body: row("In Morning: Personal area → Developer tools → API keys → Save. You get a Key ID + Secret (shown only once).", "ב-Morning: אזור אישי → כלים למפתחים → מפתחות API → שמירה. תקבלו מזהה מפתח + מפתח סודי (מוצג פעם אחת).", "En Morning: área personal → herramientas de desarrollador → claves API. Recibes ID + secreto (una sola vez).", "No Morning: área pessoal → ferramentas de desenvolvedor → chaves API. Você recebe ID + segredo (uma vez).", "في Morning: المنطقة الشخصية → أدوات المطوّر → مفاتيح API. ستحصل على المعرّف والسر (مرة واحدة)."),
  step3Title: row("3. Paste here", "3. הדבקה כאן", "3. Pega aquí", "3. Cole aqui", "3. الصق هنا"),
  step3Body: row("Enter both values below, click Test connection, then Save.", "הזינו את שני הערכים למטה, לחצו בדיקת חיבור, ואז שמירה.", "Introduce ambos valores, pulsa Probar conexión y luego Guardar.", "Informe os dois valores, clique Testar conexão e depois Salvar.", "أدخل القيمتين، انقر اختبار الاتصال ثم حفظ."),
  step4Title: row("4. Automatic issue", "4. הפקה אוטומטית", "4. Emisión automática", "4. Emissão automática", "4. إصدار تلقائي"),
  step4Body: row("When an order is marked Paid, Morning issues an invoice automatically.", "כשהזמנה מסומנת כשולמה, תופק חשבונית אוטומטית ב-Morning.", "Cuando un pedido está Pagado, Morning emite la factura sola.", "Quando um pedido está Pago, o Morning emite a fatura sozinho.", "عندما يُعلَّم الطلب كمدفوع يصدر Morning فاتورة تلقائياً."),
  secretHint: row("The secret is stored encrypted on the BizUply server and is not shown again. If you lost it, create a new key in Morning.", "המפתח הסודי נשמר מוצפן בשרת BizUply ולא מוצג שוב. אם איבדתם אותו — צרו מפתח חדש ב-Morning.", "El secreto se guarda cifrado y no se vuelve a mostrar. Si lo perdiste, crea una clave nueva.", "O segredo é guardado criptografado e não aparece de novo. Se perdeu, crie uma nova chave.", "يُحفظ السر مشفّراً ولا يظهر مرة أخرى. إذا فقدته أنشئ مفتاحاً جديداً."),
  connectionSettings: row("Connection settings", "הגדרות חיבור", "Ajustes de conexión", "Configurações de conexão", "إعدادات الاتصال"),
  connected: row("Connected", "מחובר", "Conectado", "Conectado", "متصل"),
  connectError: row("Connection error", "שגיאת חיבור", "Error de conexión", "Erro de conexão", "خطأ اتصال"),
  notConnected: row("Not connected", "לא מחובר", "No conectado", "Não conectado", "غير متصل"),
  environment: row("Environment", "סביבה", "Entorno", "Ambiente", "البيئة"),
  liveAccount: row("Live account", "חשבון חי", "Cuenta real", "Conta real", "حساب حي"),
  testAccount: row("Test account", "חשבון בדיקות", "Cuenta de prueba", "Conta de teste", "حساب تجريبي"),
  enable: row("Enable Morning for this business", "הפעלת Morning לעסק", "Activar Morning en este negocio", "Ativar Morning neste negócio", "تفعيل Morning لهذا العمل"),
  keyId: row("Key ID (API Key ID)", "מזהה מפתח (API Key ID)", "ID de clave (API Key ID)", "ID da chave (API Key ID)", "معرّف المفتاح (API Key ID)"),
  keyIdPlaceholder: row("Paste the key ID from Morning", "הדביקו את מזהה המפתח מ-Morning", "Pega el ID de clave de Morning", "Cole o ID da chave do Morning", "الصق معرّف المفتاح من Morning"),
  secret: row("Secret (API Secret)", "מפתח סודי (API Secret)", "Secreto (API Secret)", "Segredo (API Secret)", "السر (API Secret)"),
  secretSaved: row("— saved ({{preview}})", "— שמור ({{preview}})", "— guardado ({{preview}})", "— salvo ({{preview}})", "— محفوظ ({{preview}})"),
  secretKeep: row("Leave empty to keep the current secret, or paste a new one", "השאירו ריק כדי לשמור את הקיים, או הדביקו מפתח חדש", "Déjalo vacío para conservar el actual o pega uno nuevo", "Deixe vazio para manter o atual ou cole um novo", "اتركه فارغاً للإبقاء على الحالي أو الصق جديداً"),
  secretPaste: row("Paste the secret (shown only once)", "הדביקו את המפתח הסודי (מוצג פעם אחת בלבד)", "Pega el secreto (se muestra una sola vez)", "Cole o segredo (aparece só uma vez)", "الصق السر (يظهر مرة واحدة فقط)"),
  documentType: row("Document type", "סוג מסמך", "Tipo de documento", "Tipo de documento", "نوع المستند"),
  paymentType: row("Payment type", "סוג תשלום", "Tipo de pago", "Tipo de pagamento", "نوع الدفع"),
  vat: row("VAT", "מע״מ", "IVA", "IVA", "ضريبة"),
  autoIssue: row("Issue automatically when an order is paid", "הפקה אוטומטית כשהזמנה שולמה", "Emitir automáticamente al pagar el pedido", "Emitir automaticamente quando o pedido for pago", "إصدار تلقائي عند دفع الطلب"),
  save: row("Save", "שמירה", "Guardar", "Salvar", "حفظ"),
  test: row("Test connection", "בדיקת חיבור", "Probar conexión", "Testar conexão", "اختبار الاتصال"),
  doc320: row("Tax invoice / receipt (320)", "חשבונית מס / קבלה (320)", "Factura / recibo (320)", "Fatura / recibo (320)", "فاتورة / إيصال (320)"),
  doc305: row("Tax invoice (305)", "חשבונית מס (305)", "Factura (305)", "Fatura (305)", "فاتورة (305)"),
  doc400: row("Receipt (400)", "קבלה (400)", "Recibo (400)", "Recibo (400)", "إيصال (400)"),
  payCard: row("Credit card (3)", "כרטיס אשראי (3)", "Tarjeta (3)", "Cartão (3)", "بطاقة (3)"),
  payCash: row("Cash (1)", "מזומן (1)", "Efectivo (1)", "Dinheiro (1)", "نقداً (1)"),
  payBank: row("Bank transfer (4)", "העברה בנקאית (4)", "Transferencia (4)", "Transferência (4)", "تحويل بنكي (4)"),
  payOther: row("Other (11)", "אחר (11)", "Otro (11)", "Outro (11)", "أخرى (11)"),
  vatIncl: row("Including VAT", "כולל מע״מ", "Con IVA", "Com IVA", "شامل الضريبة"),
  vatExcl: row("Before VAT", "לפני מע״מ", "Antes de IVA", "Antes do IVA", "قبل الضريبة"),
  vatExempt: row("VAT exempt", "פטור ממע״מ", "Exento de IVA", "Isento de IVA", "معفى من الضريبة"),
};

const DYNAMIC = {
  fallbackPage: row("Page", "עמוד", "Página", "Página", "صفحة"),
  fallbackDescription: row("Plugin settings and connection to site pages", "הגדרות התוסף וחיבור לעמודים באתר", "Ajustes del plugin y conexión a páginas", "Configurações do plugin e conexão com páginas", "إعدادات الإضافة وربط صفحات الموقع"),
  openEditor: row("Open editor", "פתיחת עורך", "Abrir editor", "Abrir editor", "فتح المحرر"),
  addInEditor: row("Add in editor", "הוספה בעורך", "Añadir en el editor", "Adicionar no editor", "إضافة في المحرر"),
  overlayHint: row("Floating plugin: after saving it appears automatically on the site and in the editor — no need to add a page component.", "תוסף צף: אחרי שמירה הוא מופיע אוטומטית באתר ובעורך — אין צורך להוסיף רכיב לעמוד.", "Plugin flotante: tras guardar aparece solo en el sitio y el editor.", "Plugin flutuante: após salvar aparece sozinho no site e no editor.", "إضافة عائمة: بعد الحفظ تظهر تلقائياً في الموقع والمحرر."),
  sectionHint: row("On-page section: install keeps the plugin here. To show a calendar / reviews / lead form on a page, click Add in editor.", "סקשן בעמוד: ההתקנה שומרת כאן. כדי לראות יומן / ביקורות / טופס לידים בעמוד — לחצו הוספה בעורך.", "Sección de página: la instalación lo guarda aquí. Para verlo en una página, pulsa Añadir en el editor.", "Seção da página: a instalação guarda aqui. Para ver na página, clique Adicionar no editor.", "قسم صفحة: التثبيت يحفظه هنا. لإظهاره في صفحة انقر إضافة في المحرر."),
  activation: row("Activation", "הפעלה", "Activación", "Ativação", "التفعيل"),
  pluginActive: row("Plugin active on the site", "תוסף פעיל באתר", "Plugin activo en el sitio", "Plugin ativo no site", "الإضافة نشطة في الموقع"),
  display: row("Display", "הצגה", "Visualización", "Exibição", "العرض"),
  displayHint: row("Where the plugin appears on the site", "היכן התוסף יופיע באתר", "Dónde aparece el plugin", "Onde o plugin aparece", "أين تظهر الإضافة"),
  siteWide: row("Entire site", "בכל האתר", "En todo el sitio", "Em todo o site", "في كل الموقع"),
  selectedPages: row("Selected pages", "בעמודים נבחרים", "Páginas seleccionadas", "Páginas selecionadas", "صفحات مختارة"),
  sitePages: row("Site pages", "עמודים באתר", "Páginas del sitio", "Páginas do site", "صفحات الموقع"),
  noPages: row("No pages yet — create pages in the site editor.", "אין עמודים עדיין — צרו עמודים בעורך האתר.", "Aún no hay páginas — créalas en el editor.", "Ainda não há páginas — crie-as no editor.", "لا توجد صفحات بعد — أنشئها في المحرر."),
  waNumber: row("WhatsApp number", "מספר WhatsApp", "Número de WhatsApp", "Número do WhatsApp", "رقم واتساب"),
  waHint: row("Required for the button to work. Use 0501234567 or 972501234567", "חובה כדי שהכפתור יעבוד. אפשר 0501234567 או 972501234567", "Obligatorio. Usa 0501234567 o 972501234567", "Obrigatório. Use 0501234567 ou 972501234567", "مطلوب لعمل الزر. استخدم 0501234567 أو 972501234567"),
  startMessage: row("Opening message", "הודעה התחלתית", "Mensaje inicial", "Mensagem inicial", "رسالة الافتتاح"),
  defaultHello: row("Hi, I would like details", "שלום, אשמח לפרטים", "Hola, quiero más detalles", "Olá, quero mais detalhes", "مرحباً، أرغب في التفاصيل"),
  showMobile: row("Also show on mobile", "הצגה גם במובייל", "Mostrar también en móvil", "Mostrar também no celular", "الإظهار أيضاً على الجوال"),
  xPos: row("Horizontal position (%)", "מיקום אופקי (%)", "Posición horizontal (%)", "Posição horizontal (%)", "الموضع الأفقي (%)"),
  xHint: row("From the right · 5–95. You can also drag the button in the editor", "מימין · 5–95. אפשר גם לגרור את הכפתור בעורך", "Desde la derecha · 5–95. También puedes arrastrar el botón", "Da direita · 5–95. Você também pode arrastar o botão", "من اليمين · 5–95. يمكن أيضاً سحب الزر في المحرر"),
  yPos: row("Vertical position (%)", "מיקום אנכי (%)", "Posición vertical (%)", "Posição vertical (%)", "الموضع العمودي (%)"),
  yHint: row("From the top · 5–95", "מלמעלה · 5–95", "Desde arriba · 5–95", "De cima · 5–95", "من الأعلى · 5–95"),
  barContent: row("Bar content", "תוכן הפס", "Contenido de la barra", "Conteúdo da barra", "محتوى الشريط"),
  message: row("Message", "הודעה", "Mensaje", "Mensagem", "رسالة"),
  messagePlaceholder: row("Free shipping until Thursday", "משלוח חינם עד חמישי", "Envío gratis hasta el jueves", "Frete grátis até quinta", "شحن مجاني حتى الخميس"),
  linkOptional: row("Link (optional)", "קישור (אופציונלי)", "Enlace (opcional)", "Link (opcional)", "رابط (اختياري)"),
  linkText: row("Link text", "טקסט קישור", "Texto del enlace", "Texto do link", "نص الرابط"),
  details: row("Details", "לפרטים", "Detalles", "Detalhes", "للتفاصيل"),
  dismissible: row("Can be dismissed", "ניתן לסגירה", "Se puede cerrar", "Pode ser fechado", "يمكن إغلاقه"),
  cookieBanner: row("Cookie banner", "באנר עוגיות", "Banner de cookies", "Banner de cookies", "لافتة ملفات تعريف"),
  accept: row("Accept label", "טקסט אישור", "Texto de aceptar", "Texto de aceitar", "نص الموافقة"),
  acceptDefault: row("I agree", "אני מסכים/ה", "Acepto", "Concordo", "أوافق"),
  decline: row("Decline label", "טקסט דחייה", "Texto de rechazo", "Texto de recusar", "نص الرفض"),
  declineDefault: row("Decline", "דחייה", "Rechazar", "Recusar", "رفض"),
  policyUrl: row("Privacy policy link", "קישור למדיניות פרטיות", "Enlace de privacidad", "Link da política de privacidade", "رابط سياسة الخصوصية"),
  popup: row("Lead popup", "פופאפ לידים", "Popup de leads", "Popup de leads", "نافذة عملاء محتملين"),
  headline: row("Title", "כותרת", "Título", "Título", "العنوان"),
  subheadline: row("Subtitle", "תת־כותרת", "Subtítulo", "Subtítulo", "العنوان الفرعي"),
  cta: row("Button text", "טקסט כפתור", "Texto del botón", "Texto do botão", "نص الزر"),
  delay: row("Delay in seconds (if relevant)", "השהייה בשניות (אם רלוונטי)", "Retraso en segundos", "Atraso em segundos", "التأخير بالثواني"),
  trigger: row("Trigger", "טריגר", "Disparador", "Gatilho", "المشغّل"),
  showEvery: row("Show again every N days", "הצגה חוזרת כל כמה ימים", "Mostrar de nuevo cada N días", "Mostrar de novo a cada N dias", "الإظهار مرة أخرى كل N أيام"),
  success: row("Success message", "הודעת הצלחה", "Mensaje de éxito", "Mensagem de sucesso", "رسالة النجاح"),
  requirePhone: row("Phone required", "טלפון חובה", "Teléfono obligatorio", "Telefone obrigatório", "الهاتف مطلوب"),
  sync: row("Sync", "סנכרון", "Sincronización", "Sincronização", "المزامنة"),
  syncStore: row("Sync with store products", "סנכרון עם מוצרי החנות", "Sincronizar con productos de la tienda", "Sincronizar com produtos da loja", "المزامنة مع منتجات المتجر"),
};

const PAYMENTS_UI = {
  title: row("Connect payment methods", "חיבור אמצעי תשלום", "Conectar métodos de pago", "Conectar meios de pagamento", "ربط وسائل الدفع"),
  subtitle: row("Choose how to take payments from customers for your business in {{country}}", "בחרו איך לקבל תשלומים מלקוחות עבור העסק שלכם ב־{{country}}", "Elige cómo cobrar a tus clientes en {{country}}", "Escolha como receber pagamentos no {{country}}", "اختر كيف تتلقى المدفوعات من العملاء في {{country}}"),
  israel: row("Israel", "ישראל", "Israel", "Israel", "إسرائيل"),
  connected: row("Connected", "מחובר", "Conectado", "Conectado", "متصل"),
  fees: row("Fees vary by business location and provider.", "העמלות משתנות בהתאם למיקום העסק ולספק.", "Las comisiones varían según ubicación y proveedor.", "As taxas variam conforme o local e o provedor.", "تختلف الرسوم حسب موقع العمل والمزود."),
  manage: row("Manage", "ניהול", "Gestionar", "Gerenciar", "إدارة"),
  connect: row("Connect", "חיבור", "Conectar", "Conectar", "ربط"),
  back: row("Back to providers", "חזרה לרשימת הספקים", "Volver a proveedores", "Voltar aos provedores", "العودة إلى المزودين"),
  connectTitle: row("Connect {{name}}", "חיבור {{name}}", "Conectar {{name}}", "Conectar {{name}}", "ربط {{name}}"),
  instructions: row("Connection instructions", "הוראות חיבור", "Instrucciones de conexión", "Instruções de conexão", "تعليمات الربط"),
  contact: row("Contact {{name}}", "יצירת קשר עם {{name}}", "Contactar {{name}}", "Falar com {{name}}", "التواصل مع {{name}}"),
  createAccount: row("Create a {{name}} account", "יצירת חשבון {{name}}", "Crear cuenta de {{name}}", "Criar conta {{name}}", "إنشاء حساب {{name}}"),
  currencyNote: row("Important: the site currency must match the provider account currency. ILS (₪) is recommended for businesses in Israel.", "חשוב: המטבע באתר חייב להיות זהה למטבע בחשבון הספק. מומלץ להשתמש ב־ILS (₪) לעסקים בישראל.", "Importante: la moneda del sitio debe coincidir con la del proveedor. Se recomienda ILS (₪) en Israel.", "Importante: a moeda do site deve coincidir com a do provedor. Recomenda-se ILS (₪) em Israel.", "مهم: يجب أن تطابق عملة الموقع عملة حساب المزود. يُفضَّل ILS (₪) للأعمال في إسرائيل."),
  accountDetails: row("Account details", "פרטי חשבון", "Datos de la cuenta", "Dados da conta", "بيانات الحساب"),
  mode: row("Mode", "מצב", "Modo", "Modo", "الوضع"),
  liveMode: row("Live", "פעיל (Live)", "Real (Live)", "Real (Live)", "حي (Live)"),
  testMode: row("Test", "בדיקות (Test)", "Prueba (Test)", "Teste (Test)", "اختبار (Test)"),
  installments: row("Installments", "תשלומים", "Cuotas", "Parcelas", "أقساط"),
  installmentsHint: row("Let customers pay in installments", "אפשר ללקוחות לשלם בתשלומים", "Permite pagar a plazos", "Permita pagar em parcelas", "اسمح للعملاء بالدفع على أقساط"),
  availableMethods: row("Payment methods available with {{name}}", "אמצעי תשלום זמינים עם {{name}}", "Métodos disponibles con {{name}}", "Meios disponíveis com {{name}}", "وسائل الدفع المتاحة مع {{name}}"),
  availableHint: row("Credit and debit cards per the provider. After connecting, live checkout uses this provider.", "כרטיסי אשראי וחיוב לפי התמיכה של הספק. אחרי חיבור, הקופה באתר החי תשתמש בספק זה.", "Tarjetas según el proveedor. Tras conectar, el checkout en vivo lo usará.", "Cartões conforme o provedor. Após conectar, o checkout ao vivo o usará.", "البطاقات حسب المزود. بعد الربط يستخدمه الدفع الحي."),
  cancel: row("Cancel", "ביטול", "Cancelar", "Cancelar", "إلغاء"),
  disconnect: row("Disconnect", "ניתוק", "Desconectar", "Desconectar", "قطع الاتصال"),
  show: row("Show", "הצג", "Mostrar", "Mostrar", "إظهار"),
  hide: row("Hide", "הסתר", "Ocultar", "Ocultar", "إخفاء"),
};

const PAYMENTS_FIELDS = {
  publicKey: row("Publishable key", "Publishable key", "Publishable key", "Publishable key", "Publishable key"),
  apiSecret: row("Secret key", "Secret key", "Secret key", "Secret key", "Secret key"),
  webhookSecret: row("Webhook secret (optional)", "Webhook secret (אופציונלי)", "Webhook secret (opcional)", "Webhook secret (opcional)", "Webhook secret (اختياري)"),
  terminalNumber: row("Terminal / Masof", "מסוף / Masof", "Terminal / Masof", "Terminal / Masof", "طرفية / Masof"),
  apiKey: row("API Key", "API Key", "API Key", "API Key", "API Key"),
  accountId: row("Email", "אימייל", "Correo", "E-mail", "البريد"),
  merchantId: row("Licensed business", "עסק מורשה", "Negocio autorizado", "Negócio licenciado", "عمل مرخّص"),
  pageCode: row("Payment page / max installments", "דף תשלום / מקסימום תשלומים", "Página de pago / cuotas máx.", "Página de pagamento / parcelas máx.", "صفحة الدفع / أقصى أقساط"),
  keepSecret: row("Leave empty to keep the current secret", "השאירו ריק כדי לשמור על הסוד הקיים", "Déjalo vacío para conservar el secreto", "Deixe vazio para manter o segredo", "اتركه فارغاً للإبقاء على السر"),
};

const PAYMENT_PROVIDERS = {
  stripe: {
    description: row("Take card payments through Stripe — secure international checkout.", "קבלו תשלומים בכרטיס אשראי דרך Stripe — סליקה בינלאומית מאובטחת.", "Cobra con tarjeta vía Stripe — cobro internacional seguro.", "Receba no cartão via Stripe — cobrança internacional segura.", "استلم دفعات البطاقة عبر Stripe — تحصيل دولي آمن."),
    badgeRecurring: row("Supports recurring charges", "תומך בהוראות קבע", "Admite cargos recurrentes", "Suporta cobranças recorrentes", "يدعم الرسوم المتكررة"),
    badgeIntl: row("International", "בינלאומי", "Internacional", "Internacional", "دولي"),
    step1: row("Open the Stripe Dashboard and copy the Publishable key and Secret key.", "היכנסו ל-Stripe Dashboard והעתיקו את Publishable key ואת Secret key.", "Abre el Dashboard de Stripe y copia Publishable key y Secret key.", "Abra o Dashboard da Stripe e copie Publishable key e Secret key.", "افتح لوحة Stripe وانسخ Publishable key وSecret key."),
    step2: row("Paste the keys in the form and click Connect.", "הזינו את המפתחות בטופס ולחצו חיבור.", "Pega las claves y pulsa Conectar.", "Cole as chaves e clique Conectar.", "الصق المفاتيح وانقر ربط."),
    step3: row("Optional: set a Stripe webhook to api.bizuply.com/api/store/stripe/webhook/{businessId} and paste the webhook secret.", "אופציונלי: הגדירו Webhook ב-Stripe לכתובת api.bizuply.com/api/store/stripe/webhook/{businessId} והדביקו את ה-Webhook secret.", "Opcional: webhook en Stripe a api.bizuply.com/api/store/stripe/webhook/{businessId}.", "Opcional: webhook na Stripe em api.bizuply.com/api/store/stripe/webhook/{businessId}.", "اختياري: عيّن ويب هوك Stripe على api.bizuply.com/api/store/stripe/webhook/{businessId}."),
  },
  hyp: {
    description: row("Take card or debit payments through Max.", "קבלו תשלומים בכרטיס אשראי או חיוב דרך Max.", "Cobra con tarjeta o débito vía Max.", "Receba no cartão ou débito via Max.", "استلم دفعات البطاقة أو الخصم عبر Max."),
    badgePayments: row("Supports payments", "תומך בתשלומים", "Admite pagos", "Suporta pagamentos", "يدعم المدفوعات"),
    badgeRecurring: row("Supports recurring charges", "תומך בהוראות קבע", "Admite cargos recurrentes", "Suporta cobranças recorrentes", "يدعم الرسوم المتكررة"),
    step1: row("Enter the Masof terminal number and API key from the Max by Hyp account.", "הזינו את מספר המסוף (Masof) ואת מפתח ה-API מחשבון Max by Hyp.", "Introduce el Masof y la clave API de Max by Hyp.", "Informe o Masof e a chave de API da Max by Hyp.", "أدخل رقم Masof ومفتاح API من حساب Max by Hyp."),
    step2: row("Click Connect to save the details on the site.", "לחצו חיבור כדי לשמור את הפרטים באתר.", "Pulsa Conectar para guardar los datos.", "Clique Conectar para salvar os dados.", "انقر ربط لحفظ البيانات في الموقع."),
    step3: row("Make sure the site currency matches the Max account (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון Max (מומלץ ₪).", "La moneda del sitio debe coincidir con Max (se recomienda ₪).", "A moeda do site deve coincidir com a Max (recomendado ₪).", "تأكد أن عملة الموقع تطابق حساب Max (يُفضَّل ₪)."),
  },
  paypal: {
    description: row("Take payments through PayPal.", "קבלו תשלומים דרך PayPal.", "Cobra a través de PayPal.", "Receba via PayPal.", "استلم عبر PayPal."),
    step1: row("Enter the business PayPal email.", "הזינו את כתובת האימייל של חשבון PayPal העסקי.", "Introduce el email de PayPal Business.", "Informe o e-mail do PayPal Business.", "أدخل بريد حساب PayPal للأعمال."),
    step2: row("Click Connect. You can complete the PayPal redirect later.", "לחצו חיבור. בהמשך ניתן יהיה להשלים הפניה ל-PayPal.", "Pulsa Conectar. Luego puedes completar la redirección a PayPal.", "Clique Conectar. Depois você completa o redirecionamento ao PayPal.", "انقر ربط. يمكن لاحقاً إكمال توجيه PayPal."),
    step3: row("Make sure the site currency matches the PayPal account.", "ודאו שמטבע האתר תואם למטבע בחשבון PayPal.", "La moneda del sitio debe coincidir con PayPal.", "A moeda do site deve coincidir com o PayPal.", "تأكد أن عملة الموقع تطابق حساب PayPal."),
  },
  payme: {
    description: row("Take card and bit app payments.", "קבלו תשלומים בכרטיס ובאפליקציית bit.", "Cobra con tarjeta y la app bit.", "Receba no cartão e no app bit.", "استلم بالبطاقة وتطبيق bit."),
    subtitle: row("Provider: Isracard powered by PayMe", "ספק תשלום: Isracard powered by PayMe", "Proveedor: Isracard powered by PayMe", "Provedor: Isracard powered by PayMe", "المزود: Isracard powered by PayMe"),
    step1: row("Enter the API key and email from the PayMe account.", "הזינו את מפתח ה-API ואת האימייל מחשבון PayMe.", "Introduce la clave API y el email de PayMe.", "Informe a chave de API e o e-mail da PayMe.", "أدخل مفتاح API وبريد حساب PayMe."),
    step2: row("Click Connect to link the bit account to the site.", "לחצו חיבור כדי לקשר את חשבון bit לאתר.", "Pulsa Conectar para vincular bit al sitio.", "Clique Conectar para ligar o bit ao site.", "انقر ربط لربط حساب bit بالموقع."),
    step3: row("Make sure the site currency matches PayMe (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון PayMe (מומלץ ₪).", "La moneda del sitio debe coincidir con PayMe (se recomienda ₪).", "A moeda do site deve coincidir com a PayMe (recomendado ₪).", "تأكد أن عملة الموقع تطابق PayMe (يُفضَّل ₪)."),
  },
  grow: {
    description: row("Take payments through Grow (Meshulam).", "קבלו תשלומים דרך Grow (משולם).", "Cobra a través de Grow (Meshulam).", "Receba via Grow (Meshulam).", "استلم عبر Grow (Meshulam)."),
    step1: row("Enter the licensed business ID and password from Grow.", "הזינו את פרטי העסק המורשה ואת הסיסמה מחשבון Grow.", "Introduce el negocio autorizado y la contraseña de Grow.", "Informe o negócio licenciado e a senha da Grow.", "أدخل معرّف العمل المرخّص وكلمة مرور Grow."),
    step2: row("Click Connect to link the account to the site.", "לחצו חיבור כדי לקשר את החשבון לאתר.", "Pulsa Conectar para vincular la cuenta.", "Clique Conectar para ligar a conta.", "انقر ربط لربط الحساب بالموقع."),
    step3: row("Make sure the site currency matches Grow (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון Grow (מומלץ ₪).", "La moneda del sitio debe coincidir con Grow (se recomienda ₪).", "A moeda do site deve coincidir com a Grow (recomendado ₪).", "تأكد أن عملة الموقع تطابق Grow (يُفضَّل ₪)."),
  },
  payplus: {
    description: row("Take card payments through PayPlus.", "קבלו תשלומים בכרטיס אשראי דרך PayPlus.", "Cobra con tarjeta vía PayPlus.", "Receba no cartão via PayPlus.", "استلم بالبطاقة عبر PayPlus."),
    step1: row("Enter the API key and Payment Page UID.", "הזינו את מפתח ה-API ואת מזהה דף התשלום (Payment Page UID).", "Introduce la clave API y el Payment Page UID.", "Informe a chave de API e o Payment Page UID.", "أدخل مفتاح API ومعرّف صفحة الدفع."),
    step2: row("Click Connect to link PayPlus to the site.", "לחצו חיבור כדי לקשר את חשבון PayPlus לאתר.", "Pulsa Conectar para vincular PayPlus.", "Clique Conectar para ligar o PayPlus.", "انقر ربط لربط PayPlus بالموقع."),
    step3: row("Make sure the site currency matches PayPlus (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון PayPlus (מומלץ ₪).", "La moneda del sitio debe coincidir con PayPlus (se recomienda ₪).", "A moeda do site deve coincidir com o PayPlus (recomendado ₪).", "تأكد أن عملة الموقع تطابق PayPlus (يُفضَّل ₪)."),
  },
  tranzila: {
    description: row("Take card payments through Tranzila.", "קבלו תשלומים בכרטיס אשראי דרך Tranzila.", "Cobra con tarjeta vía Tranzila.", "Receba no cartão via Tranzila.", "استلم بالبطاقة عبر Tranzila."),
    step1: row("Enter the terminal number and registered email from Tranzila.", "הזינו את מספר הטרמינל ואת האימייל הרשום בחשבון Tranzila.", "Introduce el terminal y el email de Tranzila.", "Informe o terminal e o e-mail da Tranzila.", "أدخل رقم الطرفية والبريد المسجّل في Tranzila."),
    step2: row("Click Connect to link the account to the site.", "לחצו חיבור כדי לקשר את החשבون לאתר.", "Pulsa Conectar para vincular la cuenta.", "Clique Conectar para ligar a conta.", "انقر ربط لربط الحساب بالموقع."),
    step3: row("Make sure the site currency matches Tranzila (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון Tranzila (מומלץ ₪).", "La moneda del sitio debe coincidir con Tranzila (se recomienda ₪).", "A moeda do site deve coincidir com a Tranzila (recomendado ₪).", "تأكد أن عملة الموقع تطابق Tranzila (يُفضَّل ₪)."),
  },
  cal: {
    description: row("Take card payments through Cal.", "קבלו תשלומים בכרטיס אשראי דרך Cal.", "Cobra con tarjeta vía Cal.", "Receba no cartão via Cal.", "استلم بالبطاقة عبر Cal."),
    step1: row("Enter the API key and email from the Cal account.", "הזינו את מפתח ה-API ואת האימייל מחשבון Cal.", "Introduce la clave API y el email de Cal.", "Informe a chave de API e o e-mail da Cal.", "أدخل مفتاح API وبريد حساب Cal."),
    step2: row("Click Connect to link Cal to the site.", "לחצו חיבור כדי לקשר את חשבון Cal לאתר.", "Pulsa Conectar para vincular Cal.", "Clique Conectar para ligar a Cal.", "انقر ربط لربط Cal بالموقع."),
    step3: row("Make sure the site currency matches Cal (₪ recommended).", "ודאו שמטבע האתר תואם למטבע בחשבון Cal (מומלץ ₪).", "La moneda del sitio debe coincidir con Cal (se recomienda ₪).", "A moeda do site deve coincidir com a Cal (recomendado ₪).", "تأكد أن عملة الموقع تطابق Cal (يُفضَّل ₪)."),
  },
};

const WA_LABELS = {
  wabaName: row("WhatsApp Business account name", "שם חשבון WhatsApp Business", "Nombre de la cuenta WhatsApp Business", "Nome da conta WhatsApp Business", "اسم حساب واتساب للأعمال"),
  wabaId: row("WABA ID", "מזהה WABA", "ID de WABA", "ID da WABA", "معرّف WABA"),
  displayPhoneNumber: row("Connected phone number", "מספר טלפון מחובר", "Número conectado", "Número conectado", "رقم الهاتف المتصل"),
  phoneNumberId: row("Phone number ID", "מזהה מספר הטלפון", "ID del número", "ID do número", "معرّف رقم الهاتف"),
  verifiedName: row("Verified name", "שם מאומת", "Nombre verificado", "Nome verificado", "الاسم الموثَّق"),
  connectionStatus: row("Connection status", "סטטוס חיבור", "Estado de conexión", "Status da conexão", "حالة الاتصال"),
  qualityRating: row("Quality rating", "דירוג איכות", "Calificación de calidad", "Classificação de qualidade", "تقييم الجودة"),
  messagingLimitTier: row("Messaging limit", "מגבלת התכתבות", "Límite de mensajería", "Limite de mensagens", "حد المراسلة"),
  accountReviewStatus: row("Account status", "סטטוס החשבון", "Estado de la cuenta", "Status da conta", "حالة الحساب"),
  sent7d: row("Messages sent in the last 7 days", "הודעות שנשלחו ב־7 הימים האחרונים", "Mensajes enviados en 7 días", "Mensagens enviadas em 7 dias", "رسائل أُرسلت في 7 أيام"),
  delivered7d: row("Messages delivered in the last 7 days", "הודעות שנמסרו ב־7 הימים האחרונים", "Mensajes entregados en 7 días", "Mensagens entregues em 7 dias", "رسائل وُصِلت في 7 أيام"),
  read7d: row("Messages read in the last 7 days", "הודעות שנקראו ב־7 הימים האחרונים", "Mensajes leídos en 7 días", "Mensagens lidas em 7 dias", "رسائل قُرئت في 7 أيام"),
  failed7d: row("Messages failed in the last 7 days", "הודעות שנכשלו ב־7 הימים האחרונים", "Mensajes fallidos en 7 días", "Mensagens com falha em 7 dias", "رسائل فشلت في 7 أيام"),
  uniqueRecipients7d: row("Unique recipients", "נמענים ייחודיים", "Destinatarios únicos", "Destinatários únicos", "مستلمون فريدون"),
  inbound7d: row("Inbound messages", "הודעות נכנסות", "Mensajes entrantes", "Mensagens recebidas", "رسائل واردة"),
  outbound7d: row("Outbound messages", "הודעות יוצאות", "Mensajes salientes", "Mensagens enviadas", "رسائل صادرة"),
  deliveryRate: row("Delivery rate", "שיעור מסירה", "Tasa de entrega", "Taxa de entrega", "معدل التسليم"),
  readRate: row("Read rate", "שיעור קריאה", "Tasa de lectura", "Taxa de leitura", "معدل القراءة"),
  failRate: row("Fail rate", "שיעור כשל", "Tasa de fallo", "Taxa de falha", "معدل الفشل"),
  templatesApproved: row("Approved templates", "תבניות מאושרות", "Plantillas aprobadas", "Modelos aprovados", "قوالب موافَق عليها"),
  templatesPending: row("Templates in review", "תבניות בבדיקה", "Plantillas en revisión", "Modelos em análise", "قوالب قيد المراجعة"),
  templatesRejected: row("Rejected templates", "תבניות שנדחו", "Plantillas rechazadas", "Modelos recusados", "قوالب مرفوضة"),
  templatesPaused: row("Paused templates", "תבניות מושהות", "Plantillas en pausa", "Modelos pausados", "قوالب موقوفة"),
  templatesDisabled: row("Disabled templates", "תבניות מושבתות", "Plantillas desactivadas", "Modelos desativados", "قوالب معطّلة"),
  lastMetaSyncAt: row("Last Meta sync", "סנכרון אחרון ממטא", "Última sincronización de Meta", "Última sincronização da Meta", "آخر مزامنة من ميتا"),
  lastWebhookAt: row("Last webhook", "וובהוק אחרון", "Último webhook", "Último webhook", "آخر ويب هوك"),
  webhookHealth: row("Webhook status", "סטטוס וובהוק", "Estado del webhook", "Status do webhook", "حالة الويب هوك"),
  lastSuccessfulMessageAt: row("Last successful message", "הודעה אחרונה שהצליחה", "Último mensaje correcto", "Última mensagem bem-sucedida", "آخر رسالة ناجحة"),
  lastFailedMessageAt: row("Last failed message", "הודעה אחרונה שנכשלה", "Último mensaje fallido", "Última mensagem com falha", "آخر رسالة فاشلة"),
  rateLimitErrors: row("Rate-limit errors", "שגיאות מגבלת קצב", "Errores de límite de ritmo", "Erros de limite de taxa", "أخطاء حد المعدل"),
  metaErrorCodes: row("Meta error codes", "קודי שגיאה של מטא", "Códigos de error de Meta", "Códigos de erro da Meta", "رموز خطأ ميتا"),
};

const WA_SOURCES = {
  Meta: row("Meta", "מטא", "Meta", "Meta", "ميتا"),
  Webhook: row("Webhook", "וובהוק", "Webhook", "Webhook", "ويب هوك"),
  history: row("BizUply message history", "היסטוריית ההודעות של BizUply", "Historial de mensajes de BizUply", "Histórico de mensagens da BizUply", "سجل رسائل BizUply"),
};

const WA_VALUES = {
  Connected: row("Connected", "מחובר", "Conectado", "Conectado", "متصل"),
  Disconnected: row("Disconnected", "מנותק", "Desconectado", "Desconectado", "غير متصل"),
  Error: row("Error", "שגיאה", "Error", "Erro", "خطأ"),
  Green: row("Green", "ירוק", "Verde", "Verde", "أخضر"),
  Yellow: row("Yellow", "צהוב", "Amarillo", "Amarelo", "أصفر"),
  Red: row("Red", "אדום", "Rojo", "Vermelho", "أحمر"),
  Unknown: row("Unknown", "לא ידוע", "Desconocido", "Desconhecido", "غير معروف"),
  Unlimited: row("Unlimited", "ללא הגבלה", "Ilimitado", "Ilimitado", "بلا حد"),
  Active: row("Active", "פעיל", "Activo", "Ativo", "نشط"),
  inactive: row("Inactive recently", "לא פעיל לאחרונה", "Inactivo recientemente", "Inativo recentemente", "غير نشط مؤخراً"),
  waiting: row("Waiting for events", "ממתין לאירועים", "Esperando eventos", "Aguardando eventos", "بانتظار الأحداث"),
  Approved: row("Approved", "מאושר", "Aprobado", "Aprovado", "موافق عليه"),
  brand: row("WhatsApp", "וואטסאפ", "WhatsApp", "WhatsApp", "واتساب"),
};

const WHEEL = {
  pill: row("Pill", "גלולה", "Pastilla", "Pílula", "حبة"),
  rounded: row("Rounded square", "מרובע", "Cuadrado", "Quadrado", "مربع"),
  circle: row("Circle", "עיגול", "Círculo", "Círculo", "دائرة"),
  defaultTitle: row("Benefits wheel", "גלגל הטבות", "Ruleta de beneficios", "Roda de benefícios", "عجلة المزايا"),
  defaultModal: row("The benefits wheel", "גלגל ההטבות", "La ruleta de beneficios", "A roda de benefícios", "عجلة المزايا"),
  defaultSubtitle: row("Spin and see what you won!", "סובבו וגלו מה זכיתם!", "¡Gira y mira qué ganaste!", "Gire e veja o que ganhou!", "أدر وشاهد ما ربحت!"),
  removeConfirm: row("Remove the benefits wheel from the site? The plugin will be fully removed from the plugin list and settings.", "להסיר את גלגל ההטבות מהאתר? התוסף יוסר לגמרי מרשימת התוספים וההגדרות.", "¿Quitar la ruleta del sitio? Se eliminará de la lista y los ajustes.", "Remover a roda do site? Ela sairá da lista e das configurações.", "إزالة عجلة المزايا من الموقع؟ ستُحذف من القائمة والإعدادات."),
  removeFailed: row("Could not remove the plugin. Try again.", "שגיאה בהסרת התוסף. נסו שוב.", "No se pudo quitar el plugin. Inténtalo de nuevo.", "Não foi possível remover o plugin. Tente de novo.", "تعذّرت إزالة الإضافة. حاول مرة أخرى."),
  title: row("Benefits wheel", "גלגל הטבות", "Ruleta de beneficios", "Roda de benefícios", "عجلة المزايا"),
  description: row("A spinning wheel in a modal — opens on the first site visit. Drag the floating button in the editor.", "גלגל מסתובב במודאל — נפתח בכניסה ראשונה לאתר. גררו את הכפתור הצף בעורך.", "Ruleta en un modal — se abre en la primera visita. Arrastra el botón flotante en el editor.", "Roda em um modal — abre na primeira visita. Arraste o botão flutuante no editor.", "عجلة في نافذة — تُفتح في أول زيارة. اسحب الزر العائم في المحرر."),
  activation: row("Activation", "הפעלה", "Activación", "Ativação", "التفعيل"),
  activationHint: row("When the plugin appears on the site", "מתי התוסף יופיע באתר", "Cuándo aparece el plugin", "Quando o plugin aparece", "متى تظهر الإضافة"),
  pluginActive: row("Plugin active on the site", "תוסף פעיל באתר", "Plugin activo en el sitio", "Plugin ativo no site", "الإضافة نشطة في الموقع"),
  autoOpen: row("Open automatically on first visit", "פתיחה אוטומטית בכניסה ראשונה", "Abrir solo en la primera visita", "Abrir automaticamente na primeira visita", "فتح تلقائي في أول زيارة"),
  showTrigger: row("Show floating button", "הצג כפתור צף", "Mostrar botón flotante", "Mostrar botão flutuante", "إظهار الزر العائم"),
  trigger: row("Floating button", "כפתור צף", "Botón flotante", "Botão flutuante", "زر عائم"),
  triggerHint: row("Text, icon, colors, and shape", "טקסט, אייקון, צבעים וצורה", "Texto, icono, colores y forma", "Texto, ícone, cores e forma", "نص وأيقونة وألوان وشكل"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Pré-visualização", "معاينة"),
  buttonText: row("Text on the button", "טקסט על הכפתור", "Texto del botón", "Texto do botão", "النص على الزر"),
  showIcon: row("Show an icon next to the text", "הצג אייקון ליד הטקסט", "Mostrar icono junto al texto", "Mostrar ícone ao lado do texto", "إظهار أيقونة بجانب النص"),
  icon: row("Icon", "אייקון", "Icono", "Ícone", "أيقونة"),
  none: row("None", "ללא", "Ninguno", "Nenhum", "بدون"),
  shape: row("Button shape", "צורת הכפתור", "Forma del botón", "Forma do botão", "شكل الزر"),
  circleHint: row("On a circle only the icon is shown", "בעיגול — מוצג אייקון בלבד", "En círculo solo se ve el icono", "No círculo só o ícone aparece", "في الدائرة تظهر الأيقونة فقط"),
  primary: row("Primary color", "צבע ראשי", "Color principal", "Cor principal", "اللون الرئيسي"),
  secondary: row("Secondary color", "צבע משני", "Color secundario", "Cor secundária", "اللون الثانوي"),
  textColor: row("Text color", "צבע טקסט", "Color del texto", "Cor do texto", "لون النص"),
  modal: row("Modal content", "תוכן המודאל", "Contenido del modal", "Conteúdo do modal", "محتوى النافذة"),
  modalHint: row("Title, description, and spin limit", "כותרת, תיאור ומגבלת סיבובים", "Título, descripción y límite de giros", "Título, descrição e limite de giros", "العنوان والوصف وحد الدورات"),
  modalTitle: row("Modal title", "כותרת המודאל", "Título del modal", "Título do modal", "عنوان النافذة"),
  subtitle: row("Subtitle", "תת-כותרת", "Subtítulo", "Subtítulo", "العنوان الفرعي"),
  spins: row("Spins per visitor", "סיבובים לכל מבקר", "Giros por visitante", "Giros por visitante", "دورات لكل زائر"),
  segments: row("Wheel slices", "חלקי הגלגל", "Porciones de la ruleta", "Fatias da roda", "شرائح العجلة"),
  segmentsHint: row("Benefits, colors, and coupon codes", "הטבות, צבעים וקודי קופון", "Premios, colores y cupones", "Prêmios, cores e cupons", "مزايا وألوان ورموز كوبون"),
  sliceCount: row("{{count}} slices on the wheel", "{{count}} חלקים בגלגל", "{{count}} porciones en la ruleta", "{{count}} fatias na roda", "{{count}} شرائح في العجلة"),
  add: row("Add", "הוסף", "Añadir", "Adicionar", "إضافة"),
  perkN: row("Perk {{n}}", "הטבה {{n}}", "Premio {{n}}", "Prêmio {{n}}", "ميزة {{n}}"),
  remove: row("Remove", "הסרה", "Quitar", "Remover", "إزالة"),
  colorN: row("Color {{n}}", "צבע {{n}}", "Color {{n}}", "Cor {{n}}", "لون {{n}}"),
  perkCode: row("Perk code", "קוד הטבה", "Código del premio", "Código do prêmio", "رمز الميزة"),
  editorTip: row("In the editor: Add → Plugins → Benefits wheel. Drag the floating button. To remove it from the page use Remove in the plugins panel.", "בעורך: הוספה → תוספים → גלגל הטבות. גררו את הכפתור הצף. להסרה מהעמוד — הסרה בלוח התוספים.", "En el editor: Añadir → Plugins → Ruleta. Arrastra el botón. Para quitarlo usa Quitar en el panel.", "No editor: Adicionar → Plugins → Roda. Arraste o botão. Para remover use Remover no painel.", "في المحرر: إضافة → إضافات → عجلة المزايا. اسحب الزر. للإزالة استخدم إزالة في اللوحة."),
  removeTitle: row("Remove the plugin from the site", "הסרת התוסף מהאתר", "Quitar el plugin del sitio", "Remover o plugin do site", "إزالة الإضافة من الموقع"),
  removeHint: row("Fully removes the benefits wheel from the active plugins list.", "מסיר את גלגל ההטבות לגמרי מרשימת התוספים הפעילים.", "Quita la ruleta por completo de los plugins activos.", "Remove a roda por completo dos plugins ativos.", "يزيل العجلة بالكامل من الإضافات النشطة."),
  removing: row("Removing...", "מסיר...", "Quitando...", "Removendo...", "جارٍ الإزالة..."),
  removeCta: row("Remove plugin from site", "הסרת התוסף מהאתר", "Quitar plugin del sitio", "Remover plugin do site", "إزالة الإضافة من الموقع"),
  winsTitle: row("Saved wins ({{count}})", "הטבות שנשמרו ({{count}})", "Premios guardados ({{count}})", "Prêmios salvos ({{count}})", "مكاسب محفوظة ({{count}})"),
  winsHint: row("Visitor win list", "רשימת זכיות מבקרים", "Lista de premios de visitantes", "Lista de prêmios dos visitantes", "قائمة مكاسب الزوار"),
  iconFerris: row("Wheel", "גלגל", "Ruleta", "Roda", "عجلة"),
  iconGift: row("Gift", "מתנה", "Regalo", "Presente", "هدية"),
  iconSparkles: row("Sparkles", "ניצוצות", "Destellos", "Brilhos", "ومضات"),
  iconTag: row("Tag", "תגית", "Etiqueta", "Tag", "وسم"),
  iconPercent: row("Discount", "הנחה", "Descuento", "Desconto", "خصم"),
  iconStar: row("Star", "כוכב", "Estrella", "Estrela", "نجمة"),
  iconTrophy: row("Trophy", "גביע", "Trofeo", "Troféu", "كأس"),
};

export function extraPanelsLocaleObject(locale) {
  return {
    helpFaqs: {
      profile: pickFaq(FAQ_PROFILE, locale),
      collaborations: pickFaq(FAQ_COLLAB, locale),
      advisor: pickFaq(FAQ_ADVISOR, locale),
      customerMessages: pickFaq(FAQ_CUSTOMER, locale),
    },
    sitePlugins: {
      morning: pickLocaleMap(MORNING, locale),
      dynamic: pickLocaleMap(DYNAMIC, locale),
      benefitsWheel: pickLocaleMap(WHEEL, locale),
    },
    payments: {
      gallery: pickLocaleMap(PAYMENTS_UI, locale),
      fields: pickLocaleMap(PAYMENTS_FIELDS, locale),
      providers: pickNested(PAYMENT_PROVIDERS, locale),
    },
    whatsapp: {
      health: {
        labels: pickLocaleMap(WA_LABELS, locale),
        sources: pickLocaleMap(WA_SOURCES, locale),
        values: pickLocaleMap(WA_VALUES, locale),
      },
    },
  };
}
