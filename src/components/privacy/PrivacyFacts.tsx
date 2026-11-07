import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Facts = {
  h: string;
  identity: string;
  categories: string;
  purposes: string;
  roles: string;
  rights: string;
  providers: string;
  transfers: string;
  retention: string;
  security: string;
  metaH: string;
  metaP1: string;
  metaP2: string;
  metaP3: string;
  metaP4: string;
  metaP5: string;
  link: string;
};

const FACTS: Record<string, Facts> = {
  en: {
    h: "Privacy request and roles",
    identity: "Bizuply LLC operates the Bizuply platform and the services that belong to it. The company is formed in Delaware, United States. Privacy contact: support@bizuply.com. No street address or file number is stated.",
    categories: "The product can store an account and login, a name, an email, and a phone number when they are given, business details the customer enters, subscription and billing records, support requests, security and use logs, CRM and SaaS records the business customer enters, and WhatsApp or Meta lead data when that connection is turned on. Measurement data is collected only after the measurement choice.",
    purposes: "The purposes found in the product are opening and running an account, providing the subscribed service, billing, support, security and abuse prevention, operating the product, and measurement or marketing only after the applicable choice.",
    roles: "When Bizuply decides the purposes of its own account, billing, and support records, Bizuply is the controller of that information under the law that applies. When a business customer uses Bizuply to keep information about that customer's own customers, Bizuply's role for that information can be processor or holder for that customer, depending on the system, the agreement, and the facts. Not every Bizuply activity is processing for a customer.",
    rights: "A request to see information, to correct it, or to use another right that an applicable law gives can be sent to support@bizuply.com or through the form on this page. More details may be required to verify identity before any information is released or any action is taken. If the request is about information a business customer manages, Bizuply may direct the requester to that customer or help according to Bizuply's role and the applicable law. Sending the form does not delete records and does not itself approve disclosure.",
    providers: "Bizuply uses infrastructure, storage, communication, payment, and measurement providers for the services that are actually turned on. The current list is on the subprocessors page.",
    transfers: "A provider may process information outside the user's country. The repository does not record a storage region, so this page does not say that all information stays in Israel or in the United States.",
    retention: "Information is kept while it is needed to operate the service, to perform a contract, or to meet a legal duty. No single retention period was found. A SaaS tenant record has a retentionDays setting whose default in code is 30. That setting is not a verified deletion job.",
    security: "The public site uses HTTPS. Access to a business customer's records is limited to that customer's accounts, and platform-admin access is separate. WhatsApp connection tokens that were reviewed are stored encrypted and are not returned to the browser. Encryption at rest for the whole database, ISO, SOC 2, and an external audit are not claimed.",
    metaH: "Meta integrations, leads, advertising, and business communication",
    metaP1: "When a business customer connects a Meta account or service to Bizuply, including Facebook, Instagram, Meta ads, or WhatsApp Business, the platform can receive and process information according to the permissions granted and the services that are turned on.",
    metaP2: "That information can include lead details submitted on a connected form, contact details, form answers, campaign and ad identifiers, performance data that the connection returns, business-account identifiers, and business-communication data required to run the connected service. A lead is stored on the customer record, with the form, page, campaign, ad set, and ad identifiers when Meta sends them. Custom-audience membership lists are not stored as a separate database. The public measurement tool is the Meta Pixel, and it loads only after measurement consent. A Conversions API pipeline was not identified as a stored product.",
    metaP3: "Bizuply uses that information to show the data, manage the leads and campaigns the customer connected, run automations, carry business communication, and provide the services the customer turned on.",
    metaP4: "When the information belongs to the business customer's own activity, that customer decides the purposes and remains responsible for the duties that apply to it. Bizuply processes the information according to its role and the applicable agreements.",
    metaP5: "Processing follows the connection permissions, the relevant service terms, and the law that applies. A page access token used for a connected lead form is stored for that connection. WhatsApp access tokens that were reviewed are encrypted. This page does not list a token or a person's lead.",
    link: "Privacy request",
  },
  he: {
    h: "בקשת פרטיות ותפקידים",
    identity: "Bizuply LLC מפעילה את פלטפורמת Bizuply ואת השירותים הנלווים לה. החברה רשומה במדינת דלאוור, ארצות הברית. פרטי יצירת קשר בנושאי פרטיות: support@bizuply.com. אין כאן כתובת פיזית או מספר רישום.",
    categories: "המוצר יכול לשמור חשבון והתחברות, שם, דוא״ל וטלפון כאשר הם נמסרים, פרטי עסק שהלקוח מזין, נתוני מנוי וחיוב, פניות תמיכה, נתוני שימוש ואבטחה, מידע שהלקוח העסקי מזין ל־CRM ולשירותי SaaS, ונתוני WhatsApp או לידים של Meta כאשר החיבור מופעל. נתוני מדידה נאספים רק אחרי בחירת המדידה.",
    purposes: "המטרות שנמצאו במוצר הן פתיחת חשבון וניהולו, אספקת השירות שנרכש, חיוב, תמיכה, אבטחה ומניעת שימוש לרעה, תפעול המוצר, ומדידה או שיווק רק אחרי הבחירה החלה.",
    roles: "כאשר Bizuply קובעת את מטרות השימוש במידע של חשבונותיה, החיוב והתמיכה שלה, היא פועלת כבעלת שליטה במידע בהתאם לדין החל. כאשר לקוח עסקי משתמש במערכות Bizuply לניהול מידע על לקוחותיו, תפקיד Bizuply לגבי המידע הזה עשוי להיות של מעבדת מידע או מחזיקה מטעם אותו לקוח, בהתאם למערכת, להסכמים ולנסיבות. לא כל פעילות של Bizuply היא עיבוד עבור לקוח.",
    rights: "אפשר לפנות בבקשות הנוגעות לעיון במידע, לתיקונו או לזכויות אחרות שהדין החל מעניק, באמצעות support@bizuply.com או טופס בקשות הפרטיות בעמוד זה. ייתכן שיתבקשו פרטים נוספים לצורך אימות זהות לפני מסירת מידע או ביצוע פעולה. כאשר הבקשה מתייחסת למידע שמנוהל בידי לקוח עסקי, ייתכן שהפונה יופנה אל אותו לקוח או שהבקשה תטופל בהתאם לתפקיד Bizuply ולהוראות הדין. שליחת הטופס אינה מוחקת רשומות ואינה מאשרת בעצמה מסירת מידע.",
    providers: "Bizuply נעזרת בספקי תשתית, אחסון, תקשורת, תשלום ומדידה עבור השירותים שמופעלים בפועל. הרשימה המעודכנת נמצאת בעמוד ספקי המשנה.",
    transfers: "ספק עשוי לעבד מידע מחוץ למדינת המשתמש. המאגר אינו מתעד אזור אחסון, ולכן עמוד זה אינו אומר שכל המידע נשמר בישראל או בארצות הברית.",
    retention: "מידע נשמר כל עוד הוא נדרש לתפעול השירות, לקיום חוזה או לחובה לפי דין. לא נמצאה תקופת שמירה אחת. לרשומת לקוח SaaS יש שדה retentionDays שברירת המחדל שלו בקוד היא 30. השדה הזה אינו תהליך מחיקה שאומת.",
    security: "האתר הציבורי פועל ב־HTTPS. הגישה לרשומות של לקוח עסקי מוגבלת לחשבונות של אותו לקוח, וגישת מנהל הפלטפורמה נפרדת. אסימוני חיבור WhatsApp שנבדקו נשמרים מוצפנים ואינם מוחזרים לדפדפן. אין כאן טענה להצפנה במנוחה של כל המסד, ל־ISO, ל־SOC 2 או לביקורת חיצונית.",
    metaH: "אינטגרציות Meta, לידים, פרסום ותקשורת עסקית",
    metaP1: "כאשר לקוח עסקי מחבר לפלטפורמת Bizuply חשבון או שירות של Meta, לרבות \u2066Facebook, Instagram, Meta Ads\u2069 ו-\u2066WhatsApp Business\u2069, הפלטפורמה עשויה לקבל ולעבד מידע בהתאם להרשאות שניתנו ולשירותים שהופעלו.",
    metaP2: "המידע יכול לכלול פרטי ליד שנמסרו בטופס מחובר, פרטי קשר, תשובות לטופס, מזהי קמפיין ומודעה, נתוני ביצועים שהחיבור מחזיר, מזהי חשבון עסקי, ונתוני תקשורת עסקית הנדרשים להפעלת השירות המחובר. ליד נשמר ברשומת הלקוח, יחד עם מזהי הטופס, העמוד, הקמפיין, קבוצת המודעות והמודעה כאשר Meta שולחת אותם. רשימות חברות בקהלים מותאמים אינן נשמרות כמאגר נפרד. כלי המדידה הציבורי הוא Meta Pixel, והוא נטען רק אחרי הסכמה למדידה. לא זוהה כאן צינור Conversions API כמוצר שנשמר.",
    metaP3: "Bizuply משתמשת במידע כדי להציג את הנתונים, לנהל את הלידים ואת הקמפיינים שהלקוח חיבר, להפעיל אוטומציות, לקיים תקשורת עסקית ולספק את השירותים שהלקוח הפעיל.",
    metaP4: "כאשר המידע שייך לפעילות העסקית של הלקוח, הלקוח קובע את מטרות השימוש ונושא בחובות החלות עליו. Bizuply מעבדת את המידע בהתאם לתפקידה ולהסכמים החלים.",
    metaP5: "העיבוד כפוף להרשאות החיבור, לתנאי השירות הרלוונטיים ולדין החל. אסימון גישה לעמוד המשמש טופס לידים מחובר נשמר עבור החיבור הזה. אסימוני הגישה של WhatsApp שנבדקו מוצפנים. עמוד זה אינו מציג אסימון או ליד של אדם.",
    link: "בקשת פרטיות",
  },
  es: {
    h: "Solicitud de privacidad y funciones",
    identity: "Bizuply LLC opera la plataforma Bizuply y los servicios que le pertenecen. La sociedad está constituida en Delaware, Estados Unidos. Contacto de privacidad: support@bizuply.com. No se indica una dirección ni un número de registro.",
    categories: "El producto puede guardar una cuenta y un acceso, un nombre, un correo y un teléfono cuando se facilitan, los datos de negocio que introduce el cliente, registros de suscripción y cobro, solicitudes de soporte, registros de uso y seguridad, la información que el cliente empresarial introduce en el CRM y en los servicios SaaS, y datos de WhatsApp o de leads de Meta cuando esa conexión está activa. Los datos de medición se recogen solo después de la elección de medición.",
    purposes: "Las finalidades encontradas en el producto son abrir y gestionar una cuenta, prestar el servicio contratado, cobrar, dar soporte, proteger la seguridad y evitar abusos, operar el producto, y medir o hacer marketing solo después de la elección aplicable.",
    roles: "Cuando Bizuply decide las finalidades de sus propios registros de cuenta, cobro y soporte, Bizuply es la responsable de esa información según la ley que se aplique. Cuando un cliente empresarial usa Bizuply para guardar información sobre sus propios clientes, la función de Bizuply respecto de esa información puede ser la de encargada o poseedora para ese cliente, según el sistema, el acuerdo y los hechos. No toda actividad de Bizuply es un tratamiento para un cliente.",
    rights: "Una solicitud para consultar información, corregirla o ejercer otro derecho que conceda una ley aplicable puede enviarse a support@bizuply.com o mediante el formulario de esta página. Pueden pedirse más datos para verificar la identidad antes de entregar información o de realizar una acción. Si la solicitud se refiere a información que gestiona un cliente empresarial, Bizuply puede dirigir al solicitante a ese cliente o ayudar según su función y la ley aplicable. Enviar el formulario no borra registros ni aprueba por sí solo una divulgación.",
    providers: "Bizuply utiliza proveedores de infraestructura, almacenamiento, comunicación, pago y medición para los servicios que están realmente activos. La lista actual está en la página de subencargados.",
    transfers: "Un proveedor puede tratar información fuera del país del usuario. El repositorio no registra una región de almacenamiento, así que esta página no dice que toda la información permanezca en Israel o en Estados Unidos.",
    retention: "La información se conserva mientras haga falta para operar el servicio, cumplir un contrato o atender un deber legal. No se encontró un plazo único. Un registro de cliente SaaS tiene un ajuste retentionDays cuyo valor predeterminado en el código es 30. Ese ajuste no es un proceso de supresión verificado.",
    security: "El sitio público usa HTTPS. El acceso a los registros de un cliente empresarial se limita a las cuentas de ese cliente, y el acceso de administrador de la plataforma es distinto. Los tokens de conexión de WhatsApp revisados se guardan cifrados y no se devuelven al navegador. No se afirma cifrado en reposo de toda la base, ISO, SOC 2 ni una auditoría externa.",
    metaH: "Integraciones de Meta, leads, publicidad y comunicación empresarial",
    metaP1: "Cuando un cliente empresarial conecta a Bizuply una cuenta o un servicio de Meta, incluidos Facebook, Instagram, Meta Ads o WhatsApp Business, la plataforma puede recibir y tratar información según los permisos concedidos y los servicios activados.",
    metaP2: "Esa información puede incluir datos de un lead enviado en un formulario conectado, datos de contacto, respuestas del formulario, identificadores de campaña y anuncio, datos de rendimiento que devuelve la conexión, identificadores de la cuenta empresarial y datos de comunicación empresarial necesarios para el servicio conectado. Un lead se guarda en el registro del cliente, con los identificadores de formulario, página, campaña, conjunto de anuncios y anuncio cuando Meta los envía. Las listas de pertenencia a públicos personalizados no se guardan como una base separada. La herramienta pública de medición es el Meta Pixel, y se carga solo después del consentimiento de medición. No se identificó aquí un canal de Conversions API como producto almacenado.",
    metaP3: "Bizuply usa esa información para mostrar los datos, gestionar los leads y las campañas que el cliente conectó, ejecutar automatizaciones, mantener la comunicación empresarial y prestar los servicios que el cliente activó.",
    metaP4: "Cuando la información pertenece a la actividad del cliente empresarial, ese cliente decide las finalidades y sigue siendo responsable de los deberes que le corresponden. Bizuply trata la información según su función y los acuerdos aplicables.",
    metaP5: "El tratamiento sigue los permisos de la conexión, las condiciones del servicio pertinentes y la ley que se aplique. Un token de acceso a la página usado para un formulario de leads conectado se guarda para esa conexión. Los tokens de acceso de WhatsApp revisados están cifrados. Esta página no muestra un token ni el lead de una persona.",
    link: "Solicitud de privacidad",
  },
  pt: {
    h: "Pedido de privacidade e papéis",
    identity: "A Bizuply LLC opera a plataforma Bizuply e os serviços que lhe pertencem. A sociedade é constituída em Delaware, Estados Unidos. Contato de privacidade: support@bizuply.com. Não se indica endereço nem número de registro.",
    categories: "O produto pode guardar uma conta e um acesso, um nome, um e-mail e um telefone quando são informados, dados do negócio que o cliente insere, registros de assinatura e cobrança, pedidos de suporte, registros de uso e segurança, informação que o cliente empresarial insere no CRM e nos serviços SaaS, e dados de WhatsApp ou de leads da Meta quando essa conexão está ativa. Dados de medição são coletados só depois da escolha de medição.",
    purposes: "As finalidades encontradas no produto são abrir e gerir uma conta, prestar o serviço contratado, cobrar, dar suporte, proteger a segurança e evitar abuso, operar o produto, e medir ou fazer marketing só depois da escolha aplicável.",
    roles: "Quando a Bizuply decide as finalidades dos próprios registros de conta, cobrança e suporte, a Bizuply é a controladora dessa informação segundo a lei aplicável. Quando um cliente empresarial usa a Bizuply para guardar informação sobre os próprios clientes, o papel da Bizuply quanto a essa informação pode ser o de operadora ou detentora para esse cliente, conforme o sistema, o contrato e os fatos. Nem toda atividade da Bizuply é tratamento para um cliente.",
    rights: "Um pedido para consultar informação, corrigi-la ou exercer outro direito que uma lei aplicável conceda pode ser enviado para support@bizuply.com ou pelo formulário desta página. Mais dados podem ser pedidos para verificar a identidade antes de qualquer entrega de informação ou de qualquer ação. Se o pedido for sobre informação que um cliente empresarial administra, a Bizuply pode encaminhar o solicitante a esse cliente ou ajudar conforme o seu papel e a lei aplicável. Enviar o formulário não apaga registros e não aprova, por si, uma divulgação.",
    providers: "A Bizuply usa fornecedores de infraestrutura, armazenamento, comunicação, pagamento e medição para os serviços que estão realmente ativos. A lista atual está na página de subprocessadores.",
    transfers: "Um fornecedor pode tratar informação fora do país do usuário. O repositório não registra uma região de armazenamento, então esta página não diz que toda a informação permanece em Israel ou nos Estados Unidos.",
    retention: "A informação é mantida enquanto for necessária para operar o serviço, cumprir um contrato ou atender um dever legal. Não foi encontrado um prazo único. Um registro de cliente SaaS tem um campo retentionDays cujo padrão no código é 30. Esse campo não é um processo de exclusão verificado.",
    security: "O site público usa HTTPS. O acesso aos registros de um cliente empresarial fica limitado às contas desse cliente, e o acesso de administrador da plataforma é separado. Os tokens de conexão do WhatsApp que foram revistos são guardados criptografados e não voltam ao navegador. Não se afirma criptografia em repouso de toda a base, ISO, SOC 2 nem uma auditoria externa.",
    metaH: "Integrações da Meta, leads, publicidade e comunicação empresarial",
    metaP1: "Quando um cliente empresarial conecta à Bizuply uma conta ou um serviço da Meta, incluindo Facebook, Instagram, Meta Ads ou WhatsApp Business, a plataforma pode receber e tratar informação conforme as permissões concedidas e os serviços ativados.",
    metaP2: "Essa informação pode incluir dados de um lead enviado num formulário conectado, dados de contato, respostas do formulário, identificadores de campanha e anúncio, dados de desempenho que a conexão devolve, identificadores da conta empresarial e dados de comunicação empresarial necessários ao serviço conectado. Um lead é guardado no registro do cliente, com os identificadores de formulário, página, campanha, conjunto de anúncios e anúncio quando a Meta os envia. Listas de participação em públicos personalizados não são guardadas como uma base separada. A ferramenta pública de medição é o Meta Pixel, e ela carrega só depois do consentimento de medição. Não foi identificado aqui um fluxo de Conversions API como produto armazenado.",
    metaP3: "A Bizuply usa essa informação para mostrar os dados, gerir os leads e as campanhas que o cliente conectou, executar automações, manter a comunicação empresarial e prestar os serviços que o cliente ativou.",
    metaP4: "Quando a informação pertence à atividade do cliente empresarial, esse cliente decide as finalidades e continua responsável pelos deveres que lhe cabem. A Bizuply trata a informação conforme o seu papel e os contratos aplicáveis.",
    metaP5: "O tratamento segue as permissões da conexão, os termos de serviço pertinentes e a lei aplicável. Um token de acesso à página usado para um formulário de leads conectado é guardado para essa conexão. Os tokens de acesso do WhatsApp que foram revistos estão criptografados. Esta página não mostra um token nem o lead de uma pessoa.",
    link: "Pedido de privacidade",
  },
  ar: {
    h: "طلب الخصوصية والأدوار",
    identity: "تشغّل Bizuply LLC منصة Bizuply والخدمات التابعة لها. الشركة مسجّلة في ولاية ديلاوير في الولايات المتحدة. عنوان التواصل للخصوصية: support@bizuply.com. لا تُذكر هنا عنوان شارع أو رقم تسجيل.",
    categories: "يمكن للمنتج حفظ حساب ودخول، واسم وبريد وهاتف عند تقديمها، وبيانات النشاط التي يُدخلها العميل، وسجلات الاشتراك والفوترة، وطلبات الدعم، وسجلات الاستخدام والأمان، والمعلومات التي يُدخلها العميل التجاري في CRM وخدمات SaaS، وبيانات WhatsApp أو عملاء Meta المحتملين عند تشغيل الربط. لا تُجمع بيانات القياس إلا بعد اختيار القياس.",
    purposes: "الأغراض الموجودة في المنتج هي فتح الحساب وإدارته، وتقديم الخدمة المشتركة، والفوترة، والدعم، والأمان ومنع إساءة الاستخدام، وتشغيل المنتج، والقياس أو التسويق فقط بعد الاختيار الساري.",
    roles: "عندما تقرر Bizuply أغراض استخدام معلومات حساباتها وفوترتها ودعمها، فهي صاحبة السيطرة على تلك المعلومات وفق القانون الساري. عندما يستخدم عميل تجاري أنظمة Bizuply لإدارة معلومات عن زبائنه، قد يكون دور Bizuply بالنسبة إلى تلك المعلومات دور المعالجة أو الحفظ لصالح ذلك العميل، وفق النظام والاتفاق والوقائع. ليست كل أنشطة Bizuply معالجة لصالح عميل.",
    rights: "يمكن إرسال طلب للاطلاع على المعلومات أو تصحيحها أو لممارسة حق آخر يمنحه القانون الساري إلى support@bizuply.com أو عبر نموذج هذه الصفحة. قد تُطلب تفاصيل إضافية للتحقق من الهوية قبل تسليم أي معلومات أو تنفيذ أي إجراء. إذا تعلق الطلب بمعلومات يديرها عميل تجاري، فقد تُحيل Bizuply صاحب الطلب إلى ذلك العميل أو تساعد وفق دورها والقانون الساري. إرسال النموذج لا يحذف السجلات ولا يوافق بذاته على كشف المعلومات.",
    providers: "تستعين Bizuply بمزودي بنية وتخزين واتصال ودفع وقياس للخدمات المشغّلة فعلًا. القائمة الحالية في صفحة المعالجين الفرعيين.",
    transfers: "قد يعالج مزود المعلومات خارج دولة المستخدم. لا يسجّل المستودع منطقة تخزين، لذلك لا تقول هذه الصفحة إن كل المعلومات تبقى في إسرائيل أو في الولايات المتحدة.",
    retention: "تُحفظ المعلومات ما دامت لازمة لتشغيل الخدمة أو لتنفيذ عقد أو لواجب قانوني. لم تُوجد مدة حفظ واحدة. لسجل عميل SaaS حقل retentionDays وقيمته الافتراضية في الكود 30. هذا الحقل ليس عملية حذف تم التحقق منها.",
    security: "يعمل الموقع العام عبر HTTPS. الوصول إلى سجلات عميل تجاري مقصور على حسابات ذلك العميل، ووصول مدير المنصة منفصل. رموز ربط WhatsApp التي فُحصت تُحفظ مشفّرة ولا تُعاد إلى المتصفح. لا تُدّعى هنا تشفير كل القاعدة أثناء التخزين، ولا ISO، ولا SOC 2، ولا تدقيق خارجي.",
    metaH: "تكاملات Meta والعملاء المحتملون والإعلان والتواصل التجاري",
    metaP1: "عندما يربط عميل تجاري بمنصة Bizuply حسابًا أو خدمة من Meta، بما في ذلك \u2066Facebook, Instagram, Meta Ads\u2069 و\u2066WhatsApp Business\u2069، قد تتلقى المنصة المعلومات وتعالجها وفق الأذونات الممنوحة والخدمات التي تم تشغيلها.",
    metaP2: "قد تشمل هذه المعلومات بيانات عميل محتمل أُرسلت في نموذج مربوط، وبيانات اتصال، وإجابات النموذج، ومعرّفات الحملة والإعلان، وبيانات الأداء التي يعيدها الربط، ومعرّفات الحساب التجاري، وبيانات التواصل التجاري اللازمة لتشغيل الخدمة المربوطة. يُحفظ العميل المحتمل في سجل العميل، مع معرّفات النموذج والصفحة والحملة ومجموعة الإعلانات والإعلان عندما ترسلها Meta. لا تُحفظ قوائم العضوية في الجماهير المخصصة كقاعدة منفصلة. أداة القياس العامة هي Meta Pixel، ولا تُحمَّل إلا بعد الموافقة على القياس. لم يُحدَّد هنا مسار Conversions API كمنتج محفوظ.",
    metaP3: "تستخدم Bizuply هذه المعلومات لعرض البيانات وإدارة العملاء المحتملين والحملات التي ربطها العميل وتشغيل الأتمتة وإجراء التواصل التجاري وتقديم الخدمات التي فعّلها العميل.",
    metaP4: "عندما تخص المعلومات نشاط العميل التجاري، فإن ذلك العميل يقرر أغراض الاستخدام ويبقى مسؤولًا عن الواجبات التي تقع عليه. تعالج Bizuply المعلومات وفق دورها والاتفاقات السارية.",
    metaP5: "تخضع المعالجة لأذونات الربط ولشروط الخدمة ذات الصلة وللقانون الساري. يُحفظ رمز الوصول إلى الصفحة المستخدم لنموذج عملاء محتملين مربوط من أجل ذلك الربط. رموز وصول WhatsApp التي فُحصت مشفّرة. لا تعرض هذه الصفحة رمزًا أو بيانات عميل محتمل.",
    link: "طلب خصوصية",
  },
};

export function privacyFacts(language: string): Facts {
  const value = String(language || "en").toLowerCase();
  if (value.startsWith("he")) return FACTS.he;
  if (value.startsWith("es")) return FACTS.es;
  if (value.startsWith("pt")) return FACTS.pt;
  if (value.startsWith("ar")) return FACTS.ar;
  return FACTS.en;
}

export function PrivacyRequestLink({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const facts = privacyFacts(i18n.language);
  return (
    <Link className={className} to="/privacy#privacy-request">
      {facts.link}
    </Link>
  );
}

export default function PrivacyFacts({ className }: { className: string }) {
  const { i18n } = useTranslation();
  const facts = privacyFacts(i18n.language);
  const paragraphs = [
    facts.identity,
    facts.categories,
    facts.purposes,
    facts.roles,
    facts.rights,
    facts.providers,
    facts.transfers,
    facts.retention,
    facts.security,
  ];
  return (
    <>
      <section id="privacy-rights" className={className}>
        <h2 className="mb-5 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl">{facts.h}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mb-4 text-base font-medium leading-8 text-slate-600">{paragraph}</p>
        ))}
        <p className="mb-4 text-base font-medium leading-8 text-slate-600">
          <Link dir="ltr" to="/legal/subprocessors">/legal/subprocessors</Link>
        </p>
      </section>
      <section id="meta-integrations" className={className}>
        <h2 className="mb-5 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl">{facts.metaH}</h2>
        {[facts.metaP1, facts.metaP2, facts.metaP3, facts.metaP4, facts.metaP5].map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mb-4 text-base font-medium leading-8 text-slate-600">{paragraph}</p>
        ))}
      </section>
    </>
  );
}
