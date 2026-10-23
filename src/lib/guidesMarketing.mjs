/**
 * Knowledge-hub articles. Facts match the shipped product:
 * CRM $49, business plan $99/$990, WhatsApp $29 plus Meta fees, no WhatsApp trial,
 * six lead statuses, Meta Tech Provider for Lead Ads, no Business Partner claim.
 * Updated 2026-10-23.
 */

const UPDATED = "2026-10-23";

function guide(title, description, h1, sections, faq) {
  return { title, description, h1, updated: UPDATED, sections, faq };
}

const EN = {
  "what-is-a-crm": guide(
    "What is a CRM for a small business? | Bizuply",
    "A CRM keeps leads, customers, tasks and appointments in one pipeline. Bizuply CRM only is $49 per month.",
    "What is a CRM for a small business?",
    [
      ["The short answer", ["A CRM is the system of record for people who might buy and people who already did. In Bizuply that record is a lead with one of six statuses — New, Contacted, Interested, Converted, Lost or Old lead — plus a client file and an appointment calendar."]],
      ["What Bizuply actually stores", ["Each lead keeps its source. Automated sources today are Meta Lead Ads, Google Ads lead forms, and forms on a site built in Bizuply. The client file can hold notes, calls, WhatsApp logs, tasks, meetings, files and agreements."]],
      ["Price and how to start", ["CRM only is $49 per month and renews monthly. The business plan is $99 per month or $990 per year and adds appointments, collaborations and automations on top of the CRM. Start from the CRM page or the pricing page. There is no separate invented onboarding fee on this page."]],
    ],
    [["Does a CRM replace WhatsApp?", "No. WhatsApp Cloud API is a separate subscription at $29 per month per connected number, plus Meta messaging fees."]],
  ),
  "meta-lead-ads-to-crm": guide(
    "How to connect Meta Lead Ads to a CRM | Bizuply",
    "Connect your own Facebook page. After the approved Bizuply app receives permission, new Lead Ads enter the CRM with a source and a status.",
    "How Meta Lead Ads enter the CRM",
    [
      ["The short answer", ["The business connects its own Facebook page and approves the permissions. Bizuply is a Meta Tech Provider and the app passed Meta App Review for Lead Ads. New leads then enter the pipeline. Bizuply is not described here as a Meta Business Partner."]],
      ["What arrives with the lead", ["The lead is stored with its source next to the contact details. The first status is the new-lead status. Staff can log a note, a call or a WhatsApp and open a dated task."]],
      ["What this does not do", ["Connecting Lead Ads does not pay for the ads. Media spend is billed by Meta. It also does not create a free trial of WhatsApp."]],
    ],
    [["Which CRM price includes this?", "Lead Ads can feed the CRM. CRM only is $49 per month. Automations that continue the follow-up are on the business plan at $99 per month or $990 per year."]],
  ),
  "whatsapp-cloud-api-cost": guide(
    "How much does WhatsApp Cloud API cost? | Bizuply",
    "Bizuply charges $29 per month for one connected WhatsApp number. Meta messaging fees are separate. There is no free trial.",
    "What WhatsApp Cloud API costs in Bizuply",
    [
      ["The short answer", ["$29 per month covers one connected number: the connection, API and webhooks, templates, the dashboard and the docs. Another number needs another subscription. Meta bills messages separately by recipient country and message category."]],
      ["How the connection works", ["The business uses Meta Embedded Signup from the Bizuply dashboard. Meta approves the templates and the number. There is no extra Bizuply approval queue."]],
      ["Limits", ["Managing several client accounts from one agency screen is not available. Each number has its own subscription, key and webhook. The full developer site stays on whatsapp.bizuply.com. This guide does not copy Meta's rate card; Meta publishes those rates."]],
    ],
    [["Is there a free trial?", "No. The subscription starts at $29 per month for one number."]],
  ),
  "business-automation": guide(
    "What is a business automation in Bizuply? | Bizuply",
    "An automation starts with a trigger, such as a new lead, and can create a task, a reminder or a follow-up. It is part of the $99 business plan.",
    "Business automations that stay attached to the CRM",
    [
      ["The short answer", ["An automation is a background rule. A trigger such as a new lead or a status change can create a task, send a reminder or update the follow-up so fewer inquiries sit untouched."]],
      ["Where it lives", ["Automations are part of the business plan at $99 per month or $990 per year, together with CRM, appointments and collaborations. CRM only, at $49, is the pipeline without that bundle."]],
      ["Limits", ["An automation does not approve a WhatsApp template and does not buy Meta ads. Those stay with Meta."]],
    ],
    [["Can an automation send any WhatsApp message?", "Only through the connected WhatsApp Cloud API, using templates Meta has approved, on a paid $29 number subscription."]],
  ),
  "build-a-website-without-code": guide(
    "How do you build a business website without code? | Bizuply",
    "Pick a template, edit it in the visual editor, publish to your domain, and send form inquiries into the CRM.",
    "Build a site without writing the page by hand",
    [
      ["The short answer", ["The website builder is a visual editor. You choose a template from the library, change the content, and publish to your address. This guide does not state a template count, because that count needs a fresh inventory before it is published."]],
      ["What happens to a form", ["A form on the published site can create a lead in the same CRM, with the website as the source, next to Meta and Google Ads leads."]],
      ["Price", ["The website has its own annual price on the pricing page. It is not the $49 CRM product and it is not the $29 WhatsApp subscription."]],
    ],
    [["Do I need a developer to publish?", "Publishing from the editor does not require writing the page. A developer can still add custom head or body markup if the business wants that."]],
  ),
  "manage-meta-campaigns": guide(
    "Can you manage Meta campaigns from another system? | Bizuply",
    "The Bizuply dashboard can create and edit campaigns, ad sets and ads on the business's own Meta ad account, and show performance. Meta still bills the spend.",
    "Meta campaigns inside the Bizuply dashboard",
    [
      ["The short answer", ["Yes, for the workflow that is already in the product. After the business connects its own Meta ad account, the dashboard can create and edit campaigns, ad sets and ads, with a budget on the campaign or on the ad set, and it can show performance for the connected campaigns."]],
      ["Leads", ["Lead Ads forms can enter the CRM with a source and a status. Later follow-up is a CRM task, or an automation on the business plan."]],
      ["What stays outside", ["Meta bills the media spend. This guide does not claim catalog ads, a partner badge, or a separate campaign price. CRM only is $49 per month. The business plan is $99 per month or $990 per year."]],
    ],
    [["Does this replace Meta Ads Manager?", "It is a working path inside Bizuply for the connected account. Meta remains the ads platform and the biller."]],
  ),
  "crm-and-business-platform": guide(
    "What is the difference between a CRM and a business platform? | Bizuply",
    "CRM only is the pipeline, the client file and appointments intake at $49. The business plan adds appointments, collaborations and automations for $99 or $990 a year.",
    "CRM only and the business plan",
    [
      ["The short answer", ["A CRM tracks the relationship. A business platform also runs the surrounding work. In Bizuply, CRM only is $49 per month. The business plan is $99 per month or $990 per year and includes CRM together with appointments, collaborations and automations."]],
      ["What is not included in either label", ["WhatsApp is $29 per month per number plus Meta fees, with no free trial. The website has its own annual price. Meta ad spend is billed by Meta."]],
      ["How to choose", ["Choose CRM only when the job is leads, the client file and the calendar. Choose the business plan when you also need automations and collaborations."]],
    ],
    [["Are the prices negotiable on this page?", "No. These are the published prices. Package settings are not changed from a marketing page."]],
  ),
  "follow-up-on-leads": guide(
    "How do you follow up on a new lead? | Bizuply",
    "A new lead gets a status, a timeline entry and a dated task. Overdue tasks show in the notification center. Automations can add the next step on the business plan.",
    "Follow up without losing the lead",
    [
      ["The short answer", ["Open the lead, set the status, and log what happened: a note, a call or a WhatsApp. Create a task with a date and time. Overdue tasks appear in the notification center, and new leads also raise an alert."]],
      ["A practical sequence", ["Lead arrives from Meta, Google Ads or the website. Status starts as new. Someone contacts the person and moves the status to contacted or interested. A task holds the next step. A booking can be created in 15-minute steps from the service catalog."]],
      ["When to automate", ["If the same next step should happen for every new lead, use an automation on the business plan. The automation does not replace a human agent. The agents page is for people on the team, not a chatbot."]],
    ],
    [["How many statuses are there?", "Six: New, Contacted, Interested, Converted, Lost and Old lead."]],
  ),
};

const ES = {
  "what-is-a-crm": guide(
    "¿Qué es un CRM para un negocio pequeño? | Bizuply",
    "Un CRM guarda leads, clientes, tareas y citas en un pipeline. CRM solo de Bizuply cuesta 49 dólares al mes.",
    "¿Qué es un CRM para un negocio pequeño?",
    [
      ["La respuesta directa", ["Un CRM es el registro de quienes podrían comprar y de quienes ya compraron. En Bizuply ese registro es un lead con uno de seis estados: nuevo, contactado, interesado, convertido, perdido o lead antiguo, más un expediente y un calendario."]],
      ["Qué guarda Bizuply", ["Cada lead conserva su origen. Las fuentes automáticas actuales son Meta Lead Ads, formularios de Google Ads y formularios de un sitio creado en Bizuply."]],
      ["Precio y cómo empezar", ["CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 dólares al mes o 990 al año y añade citas, colaboraciones y automatizaciones. WhatsApp es aparte: 29 dólares al mes por número, sin prueba gratis."]],
    ],
    [["¿El CRM reemplaza WhatsApp?", "No. WhatsApp Cloud API es una suscripción aparte de 29 dólares al mes por número, más las tarifas de Meta."]],
  ),
  "meta-lead-ads-to-crm": guide(
    "Cómo conectar Meta Lead Ads a un CRM | Bizuply",
    "El negocio conecta su página de Facebook. Con el permiso, los Lead Ads nuevos entran al CRM con origen y estado.",
    "Cómo entran los Meta Lead Ads al CRM",
    [
      ["La respuesta directa", ["El negocio conecta su propia página y aprueba los permisos. Bizuply es Meta Tech Provider y la aplicación pasó Meta App Review para Lead Ads. No se presenta como Meta Business Partner."]],
      ["Qué llega con el lead", ["El lead se guarda con su origen. El equipo puede anotar una nota, una llamada o un WhatsApp y abrir una tarea con fecha."]],
      ["Qué no hace", ["Conectar Lead Ads no paga los anuncios. El gasto lo cobra Meta."]],
    ],
    [["¿Qué precio incluye esto?", "Los Lead Ads pueden alimentar el CRM. CRM solo cuesta 49 dólares al mes. Las automatizaciones de seguimiento están en el plan de 99 dólares al mes o 990 al año."]],
  ),
  "whatsapp-cloud-api-cost": guide(
    "¿Cuánto cuesta WhatsApp Cloud API? | Bizuply",
    "Bizuply cobra 29 dólares al mes por un número conectado. Las tarifas de Meta van aparte. No hay prueba gratis.",
    "Cuánto cuesta WhatsApp Cloud API en Bizuply",
    [
      ["La respuesta directa", ["29 dólares al mes cubren un número: conexión, API y webhooks, plantillas, panel y documentación. Otro número necesita otra suscripción. Meta cobra los mensajes aparte."]],
      ["Cómo se conecta", ["Se usa Embedded Signup de Meta desde el panel. Meta aprueba las plantillas y el número. No hay una cola extra de Bizuply."]],
      ["Límites", ["Gestionar varias cuentas de clientes desde una pantalla de agencia no está disponible. Las tarifas oficiales de Meta se consultan en la documentación de Meta, no se copian aquí."]],
    ],
    [["¿Hay prueba gratis?", "No. La suscripción empieza en 29 dólares al mes por un número."]],
  ),
  "business-automation": guide(
    "¿Qué es una automatización de negocio en Bizuply? | Bizuply",
    "Una automatización empieza con un disparador, como un lead nuevo, y puede crear una tarea o un recordatorio. Forma parte del plan de 99 dólares.",
    "Automatizaciones unidas al CRM",
    [
      ["La respuesta directa", ["Es una regla en segundo plano. Un lead nuevo o un cambio de estado puede crear una tarea, enviar un recordatorio o actualizar el seguimiento."]],
      ["Dónde está", ["Forma parte del plan de negocio de 99 dólares al mes o 990 al año, junto con CRM, citas y colaboraciones."]],
      ["Límites", ["No aprueba una plantilla de WhatsApp ni compra anuncios de Meta."]],
    ],
    [["¿Puede enviar cualquier WhatsApp?", "Solo por WhatsApp Cloud API, con plantillas que Meta ya aprobó, en un número de pago de 29 dólares."]],
  ),
  "build-a-website-without-code": guide(
    "¿Cómo crear un sitio de negocio sin código? | Bizuply",
    "Elija una plantilla, edítela en el editor visual, publíquela en su dominio y envíe los formularios al CRM.",
    "Crear un sitio sin escribir la página a mano",
    [
      ["La respuesta directa", ["El constructor es un editor visual. Se elige una plantilla, se cambia el contenido y se publica. Esta guía no da una cifra de plantillas porque esa cifra debe recontarse antes de publicarse."]],
      ["Qué pasa con un formulario", ["Un formulario del sitio publicado puede crear un lead en el mismo CRM, con el sitio como origen."]],
      ["Precio", ["El sitio tiene su precio anual en la página de precios. No es el CRM de 49 dólares ni WhatsApp de 29 dólares."]],
    ],
    [["¿Hace falta un desarrollador para publicar?", "Publicar desde el editor no exige escribir la página. Un desarrollador puede añadir marcado personalizado si el negocio lo quiere."]],
  ),
  "manage-meta-campaigns": guide(
    "¿Se pueden gestionar campañas de Meta desde otro sistema? | Bizuply",
    "El panel de Bizuply puede crear y editar campañas, conjuntos y anuncios en la cuenta de Meta del negocio y mostrar resultados. Meta cobra el gasto.",
    "Campañas de Meta dentro del panel",
    [
      ["La respuesta directa", ["Sí, para el flujo que ya está en el producto. Tras conectar la cuenta de anuncios, el panel crea y edita campañas, conjuntos y anuncios, con presupuesto en la campaña o en el conjunto, y muestra resultados."]],
      ["Leads", ["Los formularios de Lead Ads pueden entrar al CRM con origen y estado. El seguimiento posterior es una tarea o una automatización del plan de negocio."]],
      ["Qué queda fuera", ["Meta cobra el gasto. Esta guía no afirma anuncios de catálogo, una insignia de partner ni un precio aparte de campañas."]],
    ],
    [["¿Reemplaza al Administrador de anuncios?", "Es una vía de trabajo dentro de Bizuply para la cuenta conectada. Meta sigue siendo la plataforma y quien cobra."]],
  ),
  "crm-and-business-platform": guide(
    "¿Qué diferencia hay entre un CRM y una plataforma de negocio? | Bizuply",
    "CRM solo es el pipeline y el expediente por 49 dólares. El plan de negocio añade citas, colaboraciones y automatizaciones por 99 o 990 al año.",
    "CRM solo y el plan de negocio",
    [
      ["La respuesta directa", ["Un CRM sigue la relación. Una plataforma también hace el trabajo de alrededor. CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 al mes o 990 al año e incluye CRM, citas, colaboraciones y automatizaciones."]],
      ["Qué no entra en esas dos etiquetas", ["WhatsApp cuesta 29 dólares al mes por número más tarifas de Meta, sin prueba gratis. El sitio tiene precio anual propio. El gasto publicitario lo cobra Meta."]],
      ["Cómo elegir", ["Elija CRM solo si el trabajo es leads, expediente y calendario. Elija el plan de negocio si también necesita automatizaciones y colaboraciones."]],
    ],
    [["¿Estos precios se negocian aquí?", "No. Son los precios publicados. Una página de marketing no cambia los paquetes."]],
  ),
  "follow-up-on-leads": guide(
    "¿Cómo hacer seguimiento de un lead nuevo? | Bizuply",
    "El lead recibe un estado, una entrada en la línea de tiempo y una tarea con fecha. Las tareas vencidas aparecen en las notificaciones.",
    "Seguir el lead sin perderlo",
    [
      ["La respuesta directa", ["Abra el lead, fije el estado y registre qué pasó: nota, llamada o WhatsApp. Cree una tarea con fecha y hora. Las tareas vencidas aparecen en el centro de notificaciones."]],
      ["Una secuencia práctica", ["El lead llega de Meta, Google Ads o el sitio. El estado empieza en nuevo. Alguien contacta y lo pasa a contactado o interesado. Una tarea guarda el siguiente paso. Una cita puede crearse en pasos de 15 minutos."]],
      ["Cuándo automatizar", ["Si el mismo paso debe ocurrir con cada lead nuevo, use una automatización del plan de negocio. Los agentes de Bizuply son personas del equipo, no un chatbot."]],
    ],
    [["¿Cuántos estados hay?", "Seis: nuevo, contactado, interesado, convertido, perdido y lead antiguo."]],
  ),
};

const PT = {
  "what-is-a-crm": guide(
    "O que é um CRM para uma pequena empresa? | Bizuply",
    "Um CRM guarda leads, clientes, tarefas e compromissos em um pipeline. O CRM sozinho da Bizuply custa 49 dólares por mês.",
    "O que é um CRM para uma pequena empresa?",
    [
      ["A resposta direta", ["Um CRM é o registro de quem pode comprar e de quem já comprou. Na Bizuply esse registro é um lead com um de seis status: novo, contatado, interessado, convertido, perdido ou lead antigo, além de um arquivo e uma agenda."]],
      ["O que a Bizuply guarda", ["Cada lead mantém a origem. As fontes automáticas atuais são Meta Lead Ads, formulários do Google Ads e formulários de um site feito na Bizuply."]],
      ["Preço e como começar", ["CRM sozinho custa 49 dólares por mês. O plano de negócios custa 99 dólares por mês ou 990 por ano e acrescenta agenda, colaborações e automações. WhatsApp é separado: 29 dólares por mês por número, sem teste grátis."]],
    ],
    [["O CRM substitui o WhatsApp?", "Não. A WhatsApp Cloud API é uma assinatura à parte de 29 dólares por mês por número, mais as tarifas da Meta."]],
  ),
  "meta-lead-ads-to-crm": guide(
    "Como conectar Meta Lead Ads a um CRM | Bizuply",
    "O negócio conecta a própria página do Facebook. Com a permissão, novos Lead Ads entram no CRM com origem e status.",
    "Como os Meta Lead Ads entram no CRM",
    [
      ["A resposta direta", ["O negócio conecta a própria página e aprova as permissões. A Bizuply é Meta Tech Provider e o aplicativo passou no Meta App Review para Lead Ads. Não é apresentada como Meta Business Partner."]],
      ["O que chega com o lead", ["O lead é salvo com a origem. A equipe pode registrar nota, ligação ou WhatsApp e abrir uma tarefa com data."]],
      ["O que isso não faz", ["Conectar Lead Ads não paga os anúncios. A mídia é cobrada pela Meta."]],
    ],
    [["Qual preço inclui isso?", "Lead Ads podem alimentar o CRM. CRM sozinho custa 49 dólares por mês. As automações de acompanhamento estão no plano de 99 dólares por mês ou 990 por ano."]],
  ),
  "whatsapp-cloud-api-cost": guide(
    "Quanto custa a WhatsApp Cloud API? | Bizuply",
    "A Bizuply cobra 29 dólares por mês por um número conectado. As tarifas da Meta são à parte. Não há teste grátis.",
    "Quanto a WhatsApp Cloud API custa na Bizuply",
    [
      ["A resposta direta", ["29 dólares por mês cobrem um número: conexão, API e webhooks, modelos, painel e documentação. Outro número precisa de outra assinatura. A Meta cobra as mensagens à parte."]],
      ["Como a conexão funciona", ["Usa-se o Embedded Signup da Meta no painel. A Meta aprova os modelos e o número. Não há uma fila extra da Bizuply."]],
      ["Limites", ["Administrar várias contas de clientes em uma tela de agência não está disponível. As tarifas oficiais da Meta ficam na documentação da Meta."]],
    ],
    [["Existe teste grátis?", "Não. A assinatura começa em 29 dólares por mês para um número."]],
  ),
  "business-automation": guide(
    "O que é uma automação de negócio na Bizuply? | Bizuply",
    "Uma automação começa com um gatilho, como um lead novo, e pode criar uma tarefa ou um lembrete. Faz parte do plano de 99 dólares.",
    "Automações ligadas ao CRM",
    [
      ["A resposta direta", ["É uma regra em segundo plano. Um lead novo ou uma mudança de status pode criar uma tarefa, enviar um lembrete ou atualizar o acompanhamento."]],
      ["Onde fica", ["Faz parte do plano de negócios de 99 dólares por mês ou 990 por ano, junto com CRM, agenda e colaborações."]],
      ["Limites", ["Não aprova um modelo de WhatsApp e não compra anúncios da Meta."]],
    ],
    [["Pode enviar qualquer WhatsApp?", "Só pela WhatsApp Cloud API, com modelos que a Meta já aprovou, em um número pago de 29 dólares."]],
  ),
  "build-a-website-without-code": guide(
    "Como criar um site de negócio sem código? | Bizuply",
    "Escolha um modelo, edite no editor visual, publique no seu domínio e envie os formulários ao CRM.",
    "Criar um site sem escrever a página à mão",
    [
      ["A resposta direta", ["O construtor é um editor visual. Escolhe-se um modelo, altera-se o conteúdo e publica-se. Este guia não informa uma quantidade de modelos porque essa quantidade precisa ser recontada antes de ser publicada."]],
      ["O que acontece com um formulário", ["Um formulário do site publicado pode criar um lead no mesmo CRM, com o site como origem."]],
      ["Preço", ["O site tem o preço anual na página de preços. Não é o CRM de 49 dólares nem o WhatsApp de 29 dólares."]],
    ],
    [["Preciso de um desenvolvedor para publicar?", "Publicar pelo editor não exige escrever a página. Um desenvolvedor ainda pode acrescentar marcação personalizada."]],
  ),
  "manage-meta-campaigns": guide(
    "Dá para gerenciar campanhas da Meta em outro sistema? | Bizuply",
    "O painel da Bizuply pode criar e editar campanhas, conjuntos e anúncios na conta de Meta do negócio e mostrar resultados. A Meta cobra a mídia.",
    "Campanhas da Meta dentro do painel",
    [
      ["A resposta direta", ["Sim, para o fluxo que já existe no produto. Depois de conectar a conta de anúncios, o painel cria e edita campanhas, conjuntos e anúncios, com orçamento na campanha ou no conjunto, e mostra resultados."]],
      ["Leads", ["Formulários de Lead Ads podem entrar no CRM com origem e status. O acompanhamento seguinte é uma tarefa ou uma automação do plano de negócios."]],
      ["O que fica de fora", ["A Meta cobra a mídia. Este guia não afirma anúncios de catálogo, um selo de parceiro nem um preço separado de campanhas."]],
    ],
    [["Isso substitui o Gerenciador de Anúncios?", "É um caminho de trabalho dentro da Bizuply para a conta conectada. A Meta continua sendo a plataforma e quem cobra."]],
  ),
  "crm-and-business-platform": guide(
    "Qual é a diferença entre um CRM e uma plataforma de negócios? | Bizuply",
    "CRM sozinho é o pipeline e o arquivo por 49 dólares. O plano de negócios acrescenta agenda, colaborações e automações por 99 ou 990 por ano.",
    "CRM sozinho e o plano de negócios",
    [
      ["A resposta direta", ["Um CRM acompanha o relacionamento. Uma plataforma também executa o trabalho ao redor. CRM sozinho custa 49 dólares por mês. O plano de negócios custa 99 por mês ou 990 por ano e inclui CRM, agenda, colaborações e automações."]],
      ["O que não entra nesses dois nomes", ["WhatsApp custa 29 dólares por mês por número mais tarifas da Meta, sem teste grátis. O site tem preço anual próprio. A mídia é cobrada pela Meta."]],
      ["Como escolher", ["Escolha CRM sozinho se o trabalho é leads, arquivo e agenda. Escolha o plano de negócios se também precisa de automações e colaborações."]],
    ],
    [["Esses preços são negociáveis nesta página?", "Não. São os preços publicados. Uma página de marketing não altera os pacotes."]],
  ),
  "follow-up-on-leads": guide(
    "Como acompanhar um lead novo? | Bizuply",
    "O lead recebe um status, um registro na linha do tempo e uma tarefa com data. Tarefas atrasadas aparecem nas notificações.",
    "Acompanhar o lead sem perdê-lo",
    [
      ["A resposta direta", ["Abra o lead, defina o status e registre o que aconteceu: nota, ligação ou WhatsApp. Crie uma tarefa com data e hora. Tarefas atrasadas aparecem no centro de notificações."]],
      ["Uma sequência prática", ["O lead chega da Meta, do Google Ads ou do site. O status começa como novo. Alguém entra em contato e muda para contatado ou interessado. Uma tarefa guarda o próximo passo. Um compromisso pode ser criado em passos de 15 minutos."]],
      ["Quando automatizar", ["Se o mesmo passo deve acontecer para cada lead novo, use uma automação do plano de negócios. Os agentes da Bizuply são pessoas da equipe, não um chatbot."]],
    ],
    [["Quantos status existem?", "Seis: novo, contatado, interessado, convertido, perdido e lead antigo."]],
  ),
};

const AR = {
  "what-is-a-crm": guide(
    "ما هو CRM لنشاط صغير؟ | Bizuply",
    "يحفظ CRM العملاء المحتملين والعملاء والمهام والمواعيد في مسار واحد. CRM وحده في Bizuply بـ 49 دولاراً شهرياً.",
    "ما هو CRM لنشاط صغير؟",
    [
      ["الإجابة المباشرة", ["CRM هو سجل من قد يشتري ومن اشترى فعلاً. في Bizuply السجل عميل محتمل بإحدى ست حالات: جديد، تم التواصل، مهتم، تم التحويل، مفقود، أو عميل محتمل قديم، مع ملف عميل وتقويم."]],
      ["ماذا تحفظ Bizuply", ["يحتفظ كل عميل محتمل بمصدره. المصادر التلقائية الحالية هي إعلانات Meta ونماذج Google Ads ونماذج موقع بُني في Bizuply."]],
      ["السعر وكيف تبدأون", ["CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 دولاراً شهرياً أو 990 سنوياً وتضيف المواعيد والتعاون والأتمتة. واتساب منفصل: 29 دولاراً شهرياً لكل رقم، بلا تجربة مجانية."]],
    ],
    [["هل يستبدل CRM واتساب؟", "لا. واجهة واتساب السحابية اشتراك منفصل بـ 29 دولاراً شهرياً لكل رقم، إضافة إلى رسوم Meta."]],
  ),
  "meta-lead-ads-to-crm": guide(
    "كيف تربطون إعلانات Meta للعملاء المحتملين بـ CRM | Bizuply",
    "يربط النشاط صفحته في فيسبوك. بعد الإذن تدخل الإعلانات الجديدة إلى CRM مع المصدر والحالة.",
    "كيف تدخل إعلانات Meta إلى CRM",
    [
      ["الإجابة المباشرة", ["يربط النشاط صفحته ويوافق على الأذونات. Bizuply هي Meta Tech Provider واجتاز التطبيق Meta App Review لإعلانات العملاء المحتملين. لا تُعرض كـ Meta Business Partner."]],
      ["ماذا يصل مع العميل المحتمل", ["يُحفظ مع مصدره. يمكن للفريق تسجيل ملاحظة أو مكالمة أو واتساب وفتح مهمة بتاريخ."]],
      ["ماذا لا يفعل ذلك", ["ربط الإعلانات لا يدفع ثمن الإعلان. تحصّل Meta الإنفاق."]],
    ],
    [["أي سعر يشمل ذلك؟", "يمكن للإعلانات تغذية CRM. CRM وحده 49 دولاراً شهرياً. أتمتة المتابعة في خطة 99 دولاراً شهرياً أو 990 سنوياً."]],
  ),
  "whatsapp-cloud-api-cost": guide(
    "كم تكلف واجهة واتساب السحابية؟ | Bizuply",
    "تتقاضى Bizuply 29 دولاراً شهرياً لرقم واحد متصل. رسوم Meta منفصلة. لا توجد تجربة مجانية.",
    "تكلفة واجهة واتساب السحابية في Bizuply",
    [
      ["الإجابة المباشرة", ["29 دولاراً شهرياً تغطي رقماً واحداً: الربط وواجهة البرمجة وwebhooks والقوالب واللوحة والتوثيق. كل رقم إضافي يحتاج اشتراكاً. تحصّل Meta رسوم الرسائل بشكل منفصل."]],
      ["كيف يتم الربط", ["يُستخدم Embedded Signup من Meta داخل اللوحة. توافق Meta على القوالب والرقم. لا يوجد طابور موافقة إضافي لدى Bizuply."]],
      ["الحدود", ["إدارة عدة حسابات عملاء من شاشة وكالة واحدة غير متاحة. أسعار Meta الرسمية في توثيق Meta."]],
    ],
    [["هل توجد تجربة مجانية؟", "لا. يبدأ الاشتراك من 29 دولاراً شهرياً لرقم واحد."]],
  ),
  "business-automation": guide(
    "ما هي أتمتة الأعمال في Bizuply؟ | Bizuply",
    "تبدأ الأتمتة بمحفّز، مثل عميل محتمل جديد، ويمكن أن تنشئ مهمة أو تذكيراً. هي جزء من خطة 99 دولاراً.",
    "أتمتة مرتبطة بـ CRM",
    [
      ["الإجابة المباشرة", ["هي قاعدة تعمل في الخلفية. عميل محتمل جديد أو تغيير حالة يمكن أن ينشئ مهمة أو يرسل تذكيراً أو يحدّث المتابعة."]],
      ["أين توجد", ["جزء من الخطة التجارية بـ 99 دولاراً شهرياً أو 990 سنوياً، مع CRM والمواعيد والتعاون."]],
      ["الحدود", ["لا توافق على قالب واتساب ولا تشتري إعلانات Meta."]],
    ],
    [["هل ترسل أي رسالة واتساب؟", "فقط عبر واجهة واتساب السحابية بقوالب وافقت عليها Meta، وعلى رقم مدفوع بـ 29 دولاراً."]],
  ),
  "build-a-website-without-code": guide(
    "كيف تبنون موقع نشاط بلا كود؟ | Bizuply",
    "اختاروا قالباً، حرّروه في المحرر المرئي، انشروه على نطاقكم، وأرسلوا النماذج إلى CRM.",
    "بناء موقع دون كتابة الصفحة يدوياً",
    [
      ["الإجابة المباشرة", ["المنشئ محرر مرئي. يُختار قالب ويُغيَّر المحتوى ثم يُنشر. لا يذكر هذا الدليل عدداً للقوالب لأن العدد يحتاج جرداً جديداً قبل نشره."]],
      ["ماذا يحدث للنموذج", ["يمكن لنموذج في الموقع المنشور إنشاء عميل محتمل في CRM نفسه مع الموقع كمصدر."]],
      ["السعر", ["للموقع سعر سنوي في صفحة الأسعار. ليس CRM بـ 49 دولاراً ولا واتساب بـ 29 دولاراً."]],
    ],
    [["هل يلزم مطوّر للنشر؟", "النشر من المحرر لا يتطلب كتابة الصفحة. يمكن لمطوّر إضافة وسم مخصص إذا أراد النشاط ذلك."]],
  ),
  "manage-meta-campaigns": guide(
    "هل يمكن إدارة حملات Meta من نظام آخر؟ | Bizuply",
    "يمكن للوحة Bizuply إنشاء وتحرير الحملات والمجموعات والإعلانات في حساب Meta الخاص بالنشاط وعرض النتائج. تحصّل Meta الإنفاق.",
    "حملات Meta داخل اللوحة",
    [
      ["الإجابة المباشرة", ["نعم، للمسار الموجود فعلاً في المنتج. بعد ربط الحساب الإعلاني تنشئ اللوحة وتحرّر الحملات والمجموعات والإعلانات، بميزانية على الحملة أو المجموعة، وتعرض النتائج."]],
      ["العملاء المحتملون", ["يمكن لنماذج Lead Ads الدخول إلى CRM مع المصدر والحالة. المتابعة اللاحقة مهمة أو أتمتة في الخطة التجارية."]],
      ["ما يبقى خارجاً", ["تحصّل Meta الإنفاق. لا يدّعي هذا الدليل إعلانات كتالوج أو شارة شريك أو سعراً منفصلاً للحملات."]],
    ],
    [["هل يستبدل مدير إعلانات Meta؟", "هو مسار عمل داخل Bizuply للحساب المتصل. تبقى Meta المنصة والجهة التي تحصّل الرسوم."]],
  ),
  "crm-and-business-platform": guide(
    "ما الفرق بين CRM ومنصة إدارة النشاط؟ | Bizuply",
    "CRM وحده هو المسار والملف بـ 49 دولاراً. الخطة التجارية تضيف المواعيد والتعاون والأتمتة بـ 99 أو 990 سنوياً.",
    "CRM وحده والخطة التجارية",
    [
      ["الإجابة المباشرة", ["CRM يتابع العلاقة. المنصة تدير العمل المحيط أيضاً. CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 شهرياً أو 990 سنوياً وتشمل CRM والمواعيد والتعاون والأتمتة."]],
      ["ما لا يدخل في التسميتين", ["واتساب 29 دولاراً شهرياً لكل رقم إضافة إلى رسوم Meta، بلا تجربة مجانية. للموقع سعر سنوي مستقل. إنفاق الإعلانات تحصّله Meta."]],
      ["كيف تختارون", ["اختاروا CRM وحده إذا كان العمل عملاء محتملين وملفاً وتقويماً. اختاروا الخطة التجارية إذا احتجتم أيضاً إلى أتمتة وتعاون."]],
    ],
    [["هل هذه الأسعار قابلة للتفاوض هنا؟", "لا. هذه الأسعار المنشورة. صفحة تسويق لا تغيّر الباقات."]],
  ),
  "follow-up-on-leads": guide(
    "كيف تتابعون عميلاً محتملاً جديداً؟ | Bizuply",
    "يحصل العميل المحتمل على حالة وسجل في الخط الزمني ومهمة بتاريخ. المهام المتأخرة تظهر في التنبيهات.",
    "متابعة العميل المحتمل دون ضياعه",
    [
      ["الإجابة المباشرة", ["افتحوا العميل المحتمل، حدّدوا الحالة، وسجّلوا ما حدث: ملاحظة أو مكالمة أو واتساب. أنشئوا مهمة بتاريخ ووقت. المهام المتأخرة تظهر في مركز التنبيهات."]],
      ["تسلسل عملي", ["يصل من Meta أو Google Ads أو الموقع. تبدأ الحالة جديدة. يتواصل أحد وينقلها إلى تم التواصل أو مهتم. المهمة تحفظ الخطوة التالية. يمكن إنشاء موعد بخطوات 15 دقيقة."]],
      ["متى تؤتمتون", ["إذا كان يجب أن تحدث الخطوة نفسها لكل عميل محتمل جديد، استخدموا أتمتة الخطة التجارية. وكلاء Bizuply أشخاص من الفريق وليسوا روبوت دردشة."]],
    ],
    [["كم عدد الحالات؟", "ست: جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم."]],
  ),
};

const HE = {
  "what-is-a-crm": guide(
    "מהי מערכת CRM לעסק קטן? | ביזאפלי",
    "CRM שומר לידים, לקוחות, משימות ותורים בצינור אחד. CRM בלבד בביזאפלי עולה 49 דולר לחודש.",
    "מהי מערכת CRM לעסק קטן?",
    [
      ["התשובה הקצרה", ["CRM הוא הרשומה של מי שעשוי לקנות ושל מי שכבר קנה. בביזאפלי הרשומה היא ליד עם אחד משישה סטטוסים: חדש, נוצר קשר, מעוניין, הומר, אבוד או ליד ישן, יחד עם תיק לקוח ויומן תורים."]],
      ["מה נשמר", ["לכל ליד נשמר המקור. המקורות האוטומטיים היום הם Meta Lead Ads, טפסי Google Ads, וטפסים באתר שנבנה בביזאפלי."]],
      ["מחיר ואיך מתחילים", ["CRM בלבד עולה 49 דולר לחודש. החבילה העסקית עולה 99 דולר לחודש או 990 דולר לשנה ומוסיפה תורים, שיתופים ואוטומציות. WhatsApp נפרד: 29 דולר לחודש למספר, בלי ניסיון חינם."]],
    ],
    [["האם CRM מחליף את וואטסאפ?", "לא. WhatsApp Cloud API הוא מנוי נפרד של 29 דולר לחודש למספר, ובנוסף חיובי Meta."]],
  ),
  "meta-lead-ads-to-crm": guide(
    "איך מחברים Meta Lead Ads ל־CRM | ביזאפלי",
    "העסק מחבר את דף הפייסבוק שלו. אחרי האישור, לידים חדשים נכנסים ל־CRM עם מקור וסטטוס.",
    "איך לידים ממודעות Meta נכנסים ל־CRM",
    [
      ["התשובה הקצרה", ["העסק מחבר את הדף שלו ומאשר הרשאות. ביזאפלי היא Meta Tech Provider והאפליקציה עברה Meta App Review ל־Lead Ads. לא מוצג כאן שאנחנו Meta Business Partner."]],
      ["מה מגיע עם הליד", ["הליד נשמר עם המקור. אפשר לתעד הערה, שיחה או וואטסאפ ולפתוח משימה עם תאריך."]],
      ["מה זה לא עושה", ["חיבור Lead Ads לא משלם על המודעות. את הוצאת המדיה גובה Meta."]],
    ],
    [["איזה מחיר כולל את זה?", "Lead Ads יכולים להזין את ה־CRM. CRM בלבד עולה 49 דולר לחודש. אוטומציות המשך נמצאות בחבילה של 99 דולר לחודש או 990 לשנה."]],
  ),
  "whatsapp-cloud-api-cost": guide(
    "כמה עולה WhatsApp Cloud API? | ביזאפלי",
    "ביזאפלי גובה 29 דולר לחודש למספר מחובר אחד. חיובי Meta נפרדים. אין ניסיון חינם.",
    "כמה עולה WhatsApp Cloud API בביזאפלי",
    [
      ["התשובה הקצרה", ["29 דולר לחודש מכסים מספר אחד: חיבור, API ו־webhooks, תבניות, לוח בקרה ותיעוד. מספר נוסף דורש מנוי נוסף. Meta מחייבת את ההודעות בנפרד."]],
      ["איך מתחברים", ["משתמשים ב־Embedded Signup של Meta מתוך לוח הבקרה. Meta מאשרת תבניות ומספר. אין תור אישור נפרד של ביזאפלי."]],
      ["מגבלות", ["ניהול כמה לקוחות ממסך סוכנות אחד עדיין לא זמין. תעריפי Meta הרשמיים מתפרסמים אצל Meta ולא מועתקים לכאן."]],
    ],
    [["יש ניסיון חינם?", "אין. המנוי מתחיל ב־29 דולר לחודש למספר אחד."]],
  ),
  "business-automation": guide(
    "מהי אוטומציה עסקית בביזאפלי? | ביזאפלי",
    "אוטומציה מתחילה בטריגר, למשל ליד חדש, ויכולה ליצור משימה או תזכורת. היא חלק מהחבילה של 99 דולר.",
    "אוטומציות שמחוברות ל־CRM",
    [
      ["התשובה הקצרה", ["זו כלל שרץ ברקע. ליד חדש או שינוי סטטוס יכולים ליצור משימה, לשלוח תזכורת או לעדכן מעקב."]],
      ["איפה זה נמצא", ["חלק מהחבילה העסקית ב־99 דולר לחודש או 990 לשנה, יחד עם CRM, תורים ושיתופים."]],
      ["מגבלות", ["אוטומציה לא מאשרת תבנית וואטסאפ ולא קונה מודעות ב־Meta."]],
    ],
    [["אפשר לשלוח כל הודעת וואטסאפ?", "רק דרך WhatsApp Cloud API, בתבניות ש־Meta אישרה, על מספר בתשלום של 29 דולר."]],
  ),
  "build-a-website-without-code": guide(
    "איך בונים אתר לעסק בלי קוד? | ביזאפלי",
    "בוחרים תבנית, עורכים בעורך הוויזואלי, מפרסמים לדומיין, ופניות מהטופס נכנסות ל־CRM.",
    "בניית אתר בלי לכתוב את העמוד ידנית",
    [
      ["התשובה הקצרה", ["בונה האתרים הוא עורך ויזואלי. בוחרים תבנית, משנים תוכן ומפרסמים. המדריך הזה לא מציין מספר תבניות, כי את המספר צריך לספור מחדש לפני שמפרסמים אותו."]],
      ["מה קורה לטופס", ["טופס באתר שפורסם יכול ליצור ליד באותו CRM, עם האתר כמקור."]],
      ["מחיר", ["לאתר יש מחיר שנתי בדף המחירים. זה לא CRM ב־49 דולר ולא וואטסאפ ב־29 דולר."]],
    ],
    [["צריך מפתח כדי לפרסם?", "פרסום מהעורך לא דורש לכתוב את העמוד. מפתח עדיין יכול להוסיף סימון מותאם אם העסק רוצה."]],
  ),
  "manage-meta-campaigns": guide(
    "אפשר לנהל קמפיינים של Meta מתוך מערכת אחרת? | ביזאפלי",
    "לוח הבקרה של ביזאפלי יכול ליצור ולערוך קמפיינים, קבוצות מודעות ומודעות בחשבון Meta של העסק ולהציג ביצועים. את ההוצאה גובה Meta.",
    "קמפיינים של Meta בתוך לוח הבקרה",
    [
      ["התשובה הקצרה", ["כן, למסלול שכבר קיים במוצר. אחרי חיבור חשבון המודעות, הלוח יוצר ועורך קמפיינים, קבוצות מודעות ומודעות, עם תקציב ברמת הקמפיין או הקבוצה, ומציג ביצועים."]],
      ["לידים", ["טפסי Lead Ads יכולים להיכנס ל־CRM עם מקור וסטטוס. ההמשך הוא משימה, או אוטומציה בחבילה העסקית."]],
      ["מה נשאר בחוץ", ["Meta גובה את הוצאת המדיה. המדריך לא טוען לקטלוג מודעות, לתג שותף, או למחיר נפרד לקמפיינים."]],
    ],
    [["זה מחליף את מנהל המודעות?", "זה מסלול עבודה בתוך ביזאפלי לחשבון המחובר. Meta נשארת הפלטפורמה ומי שגובה."]],
  ),
  "crm-and-business-platform": guide(
    "מה ההבדל בין CRM למערכת לניהול עסק? | ביזאפלי",
    "CRM בלבד הוא הצינור והתיק ב־49 דולר. החבילה העסקית מוסיפה תורים, שיתופים ואוטומציות ב־99 או 990 לשנה.",
    "CRM בלבד והחבילה העסקית",
    [
      ["התשובה הקצרה", ["CRM עוקב אחרי הקשר. מערכת לניהול עסק מריצה גם את העבודה מסביב. CRM בלבד עולה 49 דולר לחודש. החבילה העסקית עולה 99 לחודש או 990 לשנה וכוללת CRM יחד עם תורים, שיתופים ואוטומציות."]],
      ["מה לא כלול בשני השמות", ["וואטסאפ עולה 29 דולר לחודש למספר בתוספת חיובי Meta, בלי ניסיון חינם. לאתר יש מחיר שנתי נפרד. הוצאת מודעות נגבית על ידי Meta."]],
      ["איך בוחרים", ["בוחרים CRM בלבד כשהעבודה היא לידים, תיק לקוח ויומן. בוחרים בחבילה העסקית כשצריך גם אוטומציות ושיתופים."]],
    ],
    [["המחירים כאן פתוחים למשא ומתן?", "לא. אלה המחירים המפורסמים. עמוד שיווקי לא משנה חבילות."]],
  ),
  "follow-up-on-leads": guide(
    "איך עושים מעקב על ליד חדש? | ביזאפלי",
    "הליד מקבל סטטוס, רשומה בציר הזמן ומשימה עם תאריך. משימות שעבר זמנן מופיעות בהתראות.",
    "מעקב בלי לאבד את הליד",
    [
      ["התשובה הקצרה", ["פותחים את הליד, קובעים סטטוס, ומתעדים מה קרה: הערה, שיחה או וואטסאפ. יוצרים משימה עם תאריך ושעה. משימות באיחור מופיעות במרכז ההתראות."]],
      ["רצף מעשי", ["הליד מגיע מ־Meta, מגוגל או מהאתר. הסטטוס מתחיל כחדש. מישהו יוצר קשר ומעביר לנוצר קשר או מעוניין. משימה שומרת את הצעד הבא. תור אפשר לקבוע בקפיצות של 15 דקות."]],
      ["מתי להפעיל אוטומציה", ["אם אותו צעד צריך לקרות לכל ליד חדש, משתמשים באוטומציה של החבילה העסקית. עמוד הסוכנים הוא לאנשי צוות, לא לצ'אטבוט."]],
    ],
    [["כמה סטטוסים יש?", "שישה: חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן."]],
  ),
};

export const GUIDE_LOCALES = {
  en: EN,
  he: HE,
  es: ES,
  "pt-BR": PT,
  ar: AR,
};

export const GUIDE_SLUGS = Object.keys(EN);

export function getGuide(slug, locale) {
  const pack = GUIDE_LOCALES[locale] || GUIDE_LOCALES.en;
  return pack[slug] || null;
}

export function guidePath(slug) {
  return `/guides/${slug}`;
}
