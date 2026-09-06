#!/usr/bin/env python3
"""Build Spanish, Brazilian Portuguese and Arabic UI catalogs from en.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_PATH = ROOT / "src/i18n/locales/en.json"

GLOSSARY = {
    "Login": {"es": "Iniciar sesión", "pt": "Entrar", "ar": "تسجيل الدخول"},
    "Logout": {"es": "Cerrar sesión", "pt": "Sair", "ar": "تسجيل الخروج"},
    "Log out": {"es": "Cerrar sesión", "pt": "Sair", "ar": "تسجيل الخروج"},
    "My Account": {"es": "Mi cuenta", "pt": "Minha conta", "ar": "حسابي"},
    "Contact Us": {"es": "Contáctenos", "pt": "Fale conosco", "ar": "تواصل معنا"},
    "Change language": {"es": "Cambiar idioma", "pt": "Alterar idioma", "ar": "تغيير اللغة"},
    "Open menu": {"es": "Abrir menú", "pt": "Abrir menu", "ar": "فتح القائمة"},
    "Close menu": {"es": "Cerrar menú", "pt": "Fechar menu", "ar": "إغلاق القائمة"},
    "Learn more": {"es": "Más información", "pt": "Saiba mais", "ar": "اعرف المزيد"},
    "Loading...": {"es": "Cargando...", "pt": "Carregando...", "ar": "جارٍ التحميل..."},
    "Retry": {"es": "Reintentar", "pt": "Tentar de novo", "ar": "إعادة المحاولة"},
    "Close": {"es": "Cerrar", "pt": "Fechar", "ar": "إغلاق"},
    "View all": {"es": "Ver todo", "pt": "Ver tudo", "ar": "عرض الكل"},
    "Today": {"es": "Hoy", "pt": "Hoje", "ar": "اليوم"},
    "Week": {"es": "Semana", "pt": "Semana", "ar": "أسبوع"},
    "Month": {"es": "Mes", "pt": "Mês", "ar": "شهر"},
    "Year": {"es": "Año", "pt": "Ano", "ar": "سنة"},
    "Day": {"es": "Día", "pt": "Dia", "ar": "يوم"},
    "Save": {"es": "Guardar", "pt": "Salvar", "ar": "حفظ"},
    "Cancel": {"es": "Cancelar", "pt": "Cancelar", "ar": "إلغاء"},
    "Delete": {"es": "Eliminar", "pt": "Excluir", "ar": "حذف"},
    "Edit": {"es": "Editar", "pt": "Editar", "ar": "تعديل"},
    "Search": {"es": "Buscar", "pt": "Buscar", "ar": "بحث"},
    "Search...": {"es": "Buscar...", "pt": "Buscar...", "ar": "بحث..."},
    "Confirm": {"es": "Confirmar", "pt": "Confirmar", "ar": "تأكيد"},
    "Yes": {"es": "Sí", "pt": "Sim", "ar": "نعم"},
    "No": {"es": "No", "pt": "Não", "ar": "لا"},
    "Back": {"es": "Volver", "pt": "Voltar", "ar": "رجوع"},
    "Next": {"es": "Siguiente", "pt": "Próximo", "ar": "التالي"},
    "Previous": {"es": "Anterior", "pt": "Anterior", "ar": "السابق"},
    "Submit": {"es": "Enviar", "pt": "Enviar", "ar": "إرسال"},
    "Send": {"es": "Enviar", "pt": "Enviar", "ar": "إرسال"},
    "Add": {"es": "Añadir", "pt": "Adicionar", "ar": "إضافة"},
    "Remove": {"es": "Quitar", "pt": "Remover", "ar": "إزالة"},
    "Create": {"es": "Crear", "pt": "Criar", "ar": "إنشاء"},
    "Update": {"es": "Actualizar", "pt": "Atualizar", "ar": "تحديث"},
    "Filter": {"es": "Filtrar", "pt": "Filtrar", "ar": "تصفية"},
    "All": {"es": "Todo", "pt": "Tudo", "ar": "الكل"},
    "None": {"es": "Ninguno", "pt": "Nenhum", "ar": "لا شيء"},
    "Required": {"es": "Obligatorio", "pt": "Obrigatório", "ar": "مطلوب"},
    "Optional": {"es": "Opcional", "pt": "Opcional", "ar": "اختياري"},
    "Error": {"es": "Error", "pt": "Erro", "ar": "خطأ"},
    "Success": {"es": "Listo", "pt": "Sucesso", "ar": "تم بنجاح"},
    "Warning": {"es": "Aviso", "pt": "Aviso", "ar": "تحذير"},
    "Copy": {"es": "Copiar", "pt": "Copiar", "ar": "نسخ"},
    "Copied": {"es": "Copiado", "pt": "Copiado", "ar": "تم النسخ"},
    "Download": {"es": "Descargar", "pt": "Baixar", "ar": "تنزيل"},
    "Upload": {"es": "Subir", "pt": "Enviar arquivo", "ar": "رفع"},
    "Select": {"es": "Seleccionar", "pt": "Selecionar", "ar": "اختيار"},
    "Actions": {"es": "Acciones", "pt": "Ações", "ar": "إجراءات"},
    "Status": {"es": "Estado", "pt": "Status", "ar": "الحالة"},
    "Name": {"es": "Nombre", "pt": "Nome", "ar": "الاسم"},
    "Email": {"es": "Email", "pt": "E-mail", "ar": "البريد الإلكتروني"},
    "Phone": {"es": "Teléfono", "pt": "Telefone", "ar": "الهاتف"},
    "Password": {"es": "Contraseña", "pt": "Senha", "ar": "كلمة المرور"},
    "Continue": {"es": "Continuar", "pt": "Continuar", "ar": "متابعة"},
    "Done": {"es": "Listo", "pt": "Concluído", "ar": "تم"},
    "Apply": {"es": "Aplicar", "pt": "Aplicar", "ar": "تطبيق"},
    "Reset": {"es": "Restablecer", "pt": "Redefinir", "ar": "إعادة ضبط"},
    "Refresh": {"es": "Actualizar", "pt": "Atualizar", "ar": "تحديث"},
    "Details": {"es": "Detalles", "pt": "Detalhes", "ar": "التفاصيل"},
    "Settings": {"es": "Ajustes", "pt": "Configurações", "ar": "الإعدادات"},
    "Help": {"es": "Ayuda", "pt": "Ajuda", "ar": "مساعدة"},
    "No results": {"es": "Sin resultados", "pt": "Nenhum resultado", "ar": "لا توجد نتائج"},
    "Admin": {"es": "Admin", "pt": "Admin", "ar": "المسؤول"},
    "This field is required": {"es": "Este campo es obligatorio", "pt": "Este campo é obrigatório", "ar": "هذا الحقل مطلوب"},
    "Are you sure you want to delete this?": {"es": "¿Seguro que quieres eliminar esto?", "pt": "Tem certeza de que deseja excluir isto?", "ar": "هل أنت متأكد أنك تريد حذف هذا؟"},
    "This action cannot be undone.": {"es": "Esta acción no se puede deshacer.", "pt": "Esta ação não pode ser desfeita.", "ar": "لا يمكن التراجع عن هذا الإجراء."},
    "Features": {"es": "Funciones", "pt": "Recursos", "ar": "الميزات"},
    "Solutions": {"es": "Soluciones", "pt": "Soluções", "ar": "الحلول"},
    "How it works": {"es": "Cómo funciona", "pt": "Como funciona", "ar": "كيف يعمل"},
    "Pricing": {"es": "Precios", "pt": "Preços", "ar": "الأسعار"},
    "About": {"es": "Nosotros", "pt": "Sobre", "ar": "من نحن"},
    "CRM": {"es": "CRM", "pt": "CRM", "ar": "CRM"},
    "Collaborations": {"es": "Colaboraciones", "pt": "Colaborações", "ar": "التعاون"},
    "Website & Store": {"es": "Sitio y tienda", "pt": "Site e loja", "ar": "الموقع والمتجر"},
    "Appointments": {"es": "Citas", "pt": "Agendamentos", "ar": "المواعيد"},
    "Automations": {"es": "Automatizaciones", "pt": "Automações", "ar": "الأتمتة"},
    "Business Agents": {"es": "Agentes de negocio", "pt": "Agentes de negócio", "ar": "وكلاء الأعمال"},
    "Contact": {"es": "Contacto", "pt": "Contato", "ar": "تواصل"},
    "Get Started": {"es": "Empezar", "pt": "Começar", "ar": "ابدأ الآن"},
    "Leads": {"es": "Leads", "pt": "Leads", "ar": "العملاء المحتملون"},
    "Contacts": {"es": "Contactos", "pt": "Contatos", "ar": "جهات الاتصال"},
    "Companies": {"es": "Empresas", "pt": "Empresas", "ar": "الشركات"},
    "Deals": {"es": "Negocios", "pt": "Negócios", "ar": "الصفقات"},
    "Pipelines": {"es": "Pipelines", "pt": "Pipelines", "ar": "مسارات المبيعات"},
    "Tasks": {"es": "Tareas", "pt": "Tarefas", "ar": "المهام"},
    "Notes": {"es": "Notas", "pt": "Notas", "ar": "ملاحظات"},
    "Campaigns": {"es": "Campañas", "pt": "Campanhas", "ar": "الحملات"},
    "WhatsApp": {"es": "WhatsApp", "pt": "WhatsApp", "ar": "واتساب"},
    "Integrations": {"es": "Integraciones", "pt": "Integrações", "ar": "عمليات الربط"},
    "Billing": {"es": "Facturación", "pt": "Faturamento", "ar": "الفوترة"},
    "Team": {"es": "Equipo", "pt": "Equipe", "ar": "الفريق"},
    "Dashboard": {"es": "Panel", "pt": "Painel", "ar": "لوحة التحكم"},
    "Overview": {"es": "Resumen", "pt": "Visão geral", "ar": "نظرة عامة"},
    "Customers": {"es": "Clientes", "pt": "Clientes", "ar": "العملاء"},
    "Clients": {"es": "Clientes", "pt": "Clientes", "ar": "العملاء"},
    "New": {"es": "Nuevo", "pt": "Novo", "ar": "جديد"},
    "Open": {"es": "Abrir", "pt": "Abrir", "ar": "فتح"},
    "Sign in": {"es": "Iniciar sesión", "pt": "Entrar", "ar": "تسجيل الدخول"},
    "Sign up": {"es": "Registrarse", "pt": "Criar conta", "ar": "إنشاء حساب"},
    "Forgot password?": {"es": "¿Olvidaste la contraseña?", "pt": "Esqueceu a senha?", "ar": "هل نسيت كلمة المرور؟"},
    "Remember me": {"es": "Recordarme", "pt": "Lembrar de mim", "ar": "تذكرني"},
    "Create account": {"es": "Crear cuenta", "pt": "Criar conta", "ar": "إنشاء حساب"},
    "Full name": {"es": "Nombre completo", "pt": "Nome completo", "ar": "الاسم الكامل"},
    "Business name": {"es": "Nombre del negocio", "pt": "Nome da empresa", "ar": "اسم النشاط"},
    "Confirm password": {"es": "Confirmar contraseña", "pt": "Confirmar senha", "ar": "تأكيد كلمة المرور"},
    "New password": {"es": "Nueva contraseña", "pt": "Nova senha", "ar": "كلمة المرور الجديدة"},
    "Forgot password": {"es": "Olvidé mi contraseña", "pt": "Esqueci minha senha", "ar": "نسيت كلمة المرور"},
    "Reset password": {"es": "Restablecer contraseña", "pt": "Redefinir senha", "ar": "إعادة تعيين كلمة المرور"},
    "Back to login": {"es": "Volver al inicio de sesión", "pt": "Voltar ao login", "ar": "العودة لتسجيل الدخول"},
    "Partner dashboard": {"es": "Panel de partner", "pt": "Painel do parceiro", "ar": "لوحة الشريك"},
    "Sign out": {"es": "Cerrar sesión", "pt": "Sair", "ar": "تسجيل الخروج"},
    "Custom Range": {"es": "Rango personalizado", "pt": "Intervalo personalizado", "ar": "نطاق مخصص"},
}

PHRASE_REPLACEMENTS = {
    "es": [
        ("Please enter", "Introduce"),
        ("Please fill in all fields", "Completa todos los campos"),
        ("Something went wrong", "Algo salió mal"),
        ("Try again", "Inténtalo de nuevo"),
        ("Loading", "Cargando"),
        ("Save changes", "Guardar cambios"),
        ("Delete forever", "Eliminar definitivamente"),
        ("No results found", "No se encontraron resultados"),
        ("Search leads", "Buscar leads"),
        ("New lead", "Lead nuevo"),
        ("Lead management", "Gestión de leads"),
        ("Website Builder", "Creador de sitios"),
        ("Form Builder", "Creador de formularios"),
        ("Business settings", "Ajustes del negocio"),
        ("Account settings", "Ajustes de la cuenta"),
        ("Are you sure", "¿Seguro"),
        ("successfully", "correctamente"),
        ("Failed to", "No se pudo"),
        ("could not", "no se pudo"),
        ("your business", "tu negocio"),
        ("Your business", "Tu negocio"),
        ("customers", "clientes"),
        ("appointments", "citas"),
        ("messages", "mensajes"),
        ("notifications", "notificaciones"),
        ("settings", "ajustes"),
        ("dashboard", "panel"),
        ("campaign", "campaña"),
        ("template", "plantilla"),
        ("automation", "automatización"),
    ],
    "pt": [
        ("Please enter", "Informe"),
        ("Please fill in all fields", "Preencha todos os campos"),
        ("Something went wrong", "Algo deu errado"),
        ("Try again", "Tente novamente"),
        ("Loading", "Carregando"),
        ("Save changes", "Salvar alterações"),
        ("Delete forever", "Excluir definitivamente"),
        ("No results found", "Nenhum resultado encontrado"),
        ("Search leads", "Buscar leads"),
        ("New lead", "Novo lead"),
        ("Lead management", "Gestão de leads"),
        ("Website Builder", "Criador de sites"),
        ("Form Builder", "Criador de formulários"),
        ("Business settings", "Configurações do negócio"),
        ("Account settings", "Configurações da conta"),
        ("Are you sure", "Tem certeza"),
        ("successfully", "com sucesso"),
        ("Failed to", "Não foi possível"),
        ("could not", "não foi possível"),
        ("your business", "o seu negócio"),
        ("Your business", "O seu negócio"),
        ("customers", "clientes"),
        ("appointments", "agendamentos"),
        ("messages", "mensagens"),
        ("notifications", "notificações"),
        ("settings", "configurações"),
        ("dashboard", "painel"),
        ("campaign", "campanha"),
        ("template", "modelo"),
        ("automation", "automação"),
    ],
    "ar": [
        ("Please enter", "يرجى إدخال"),
        ("Please fill in all fields", "يرجى تعبئة جميع الحقول"),
        ("Something went wrong", "حدث خطأ ما"),
        ("Try again", "حاول مرة أخرى"),
        ("Loading", "جارٍ التحميل"),
        ("Save changes", "حفظ التغييرات"),
        ("Delete forever", "حذف نهائي"),
        ("No results found", "لا توجد نتائج"),
        ("Search leads", "بحث في العملاء المحتملين"),
        ("New lead", "عميل محتمل جديد"),
        ("Lead management", "إدارة العملاء المحتملين"),
        ("Website Builder", "منشئ المواقع"),
        ("Form Builder", "منشئ النماذج"),
        ("Business settings", "إعدادات النشاط"),
        ("Account settings", "إعدادات الحساب"),
        ("Are you sure", "هل أنت متأكد"),
        ("successfully", "بنجاح"),
        ("Failed to", "تعذر"),
        ("could not", "تعذر"),
        ("your business", "نشاطك"),
        ("Your business", "نشاطك"),
        ("customers", "العملاء"),
        ("appointments", "المواعيد"),
        ("messages", "الرسائل"),
        ("notifications", "الإشعارات"),
        ("settings", "الإعدادات"),
        ("dashboard", "لوحة التحكم"),
        ("campaign", "حملة"),
        ("template", "قالب"),
        ("automation", "أتمتة"),
    ],
}


def translate_string(value: str, lang: str) -> str:
    if value in GLOSSARY:
        return GLOSSARY[value][lang]
    if not any(ch.isalpha() for ch in value):
        return value

    translated = value
    for source, target in PHRASE_REPLACEMENTS[lang]:
        translated = translated.replace(source, target)

    if translated != value:
        return translated

    # Keep brand and product names, but still localize surrounding copy when possible.
    return translated


def translate_tree(node, lang: str):
    if isinstance(node, dict):
        return {key: translate_tree(value, lang) for key, value in node.items()}
    if isinstance(node, list):
        return [translate_tree(item, lang) for item in node]
    if isinstance(node, str):
        return translate_string(node, lang)
    return node


def main() -> None:
    en = json.loads(EN_PATH.read_text())
    outputs = {
        "es": ROOT / "src/i18n/locales/es.json",
        "pt": ROOT / "src/i18n/locales/pt-BR.json",
        "ar": ROOT / "src/i18n/locales/ar.json",
    }
    for lang, path in outputs.items():
        data = translate_tree(en, lang)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
