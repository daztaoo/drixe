// lib/i18n.ts

export type Language = 'en' | 'es' | 'ar' | 'tr' | 'ru';

export const TRANSLATIONS = {
  en: {
    title: "Settings",
    subtitle: "Manage your identity and preferences.",
    save: "Save Changes",
    saving: "Saving...",
    
    // Sections
    section_profile: "Profile",
    section_preferences: "Preferences",
    section_connections: "Connections",
    section_security: "Security",
    section_danger: "Danger Zone",

    // Profile Inputs
    label_display_name: "Display Name",
    placeholder_display_name: "e.g. Dark Lord",
    label_username: "Username",
    placeholder_username: "username",
    hint_username: "Only letters, numbers, and underscores.",
    
    // Status
    status_checking: "Checking...",
    status_taken: "Taken",
    status_available: "Available",

    // Language
    label_language: "Language",
    desc_language: "Select your dashboard language.",

    // Connections
    connected: "Connected",
    connect: "Connect",

    // Security
    label_email: "Email Address",
    hint_email: "To change your email, please contact support.",

    // Danger
    btn_delete: "Delete Account",
    
    // Notifications
    success_msg: "Profile updated successfully!",
    error_msg: "Something went wrong."
  },
  es: {
    title: "Ajustes",
    subtitle: "Gestiona tu identidad y preferencias.",
    save: "Guardar Cambios",
    saving: "Guardando...",
    section_profile: "Perfil",
    section_preferences: "Preferencias",
    section_connections: "Conexiones",
    section_security: "Seguridad",
    section_danger: "Zona de Peligro",
    label_display_name: "Nombre Visible",
    placeholder_display_name: "ej. Señor Oscuro",
    label_username: "Usuario",
    placeholder_username: "usuario",
    hint_username: "Solo letras, números y guiones bajos.",
    status_checking: "Comprobando...",
    status_taken: "Ocupado",
    status_available: "Disponible",
    label_language: "Idioma",
    desc_language: "Selecciona el idioma del panel.",
    connected: "Conectado",
    connect: "Conectar",
    label_email: "Correo Electrónico",
    hint_email: "Para cambiar tu correo, contacta soporte.",
    btn_delete: "Eliminar Cuenta",
    success_msg: "¡Perfil actualizado con éxito!",
    error_msg: "Algo salió mal."
  },
  ar: {
    title: "الإعدادات",
    subtitle: "إدارة هويتك وتفضيلاتك.",
    save: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    section_profile: "الملف الشخصي",
    section_preferences: "التفضيلات",
    section_connections: "الروابط",
    section_security: "الأمان",
    section_danger: "منطقة الخطر",
    label_display_name: "الاسم المعروض",
    placeholder_display_name: "مثال: اللورد المظلم",
    label_username: "اسم المستخدم",
    placeholder_username: "اسم المستخدم",
    hint_username: "فقط الحروف والأرقام والشرطات السفلية.",
    status_checking: "جاري التحقق...",
    status_taken: "مأخوذ",
    status_available: "متاح",
    label_language: "اللغة",
    desc_language: "اختر لغة لوحة التحكم.",
    connected: "متصل",
    connect: "اتصال",
    label_email: "البريد الإلكتروني",
    hint_email: "لتغيير بريدك الإلكتروني، اتصل بالدعم.",
    btn_delete: "حذف الحساب",
    success_msg: "تم تحديث الملف الشخصي بنجاح!",
    error_msg: "حدث خطأ ما."
  },
  tr: {
    title: "Ayarlar",
    subtitle: "Kimliğinizi ve tercihlerinizi yönetin.",
    save: "Kaydet",
    saving: "Kaydediliyor...",
    section_profile: "Profil",
    section_preferences: "Tercihler",
    section_connections: "Bağlantılar",
    section_security: "Güvenlik",
    section_danger: "Tehlike Bölgesi",
    label_display_name: "Görünen Ad",
    placeholder_display_name: "ör. Karanlık Lord",
    label_username: "Kullanıcı Adı",
    placeholder_username: "kullaniciadi",
    hint_username: "Sadece harfler, sayılar ve alt çizgiler.",
    status_checking: "Kontrol ediliyor...",
    status_taken: "Alınmış",
    status_available: "Müsait",
    label_language: "Dil",
    desc_language: "Panel dilinizi seçin.",
    connected: "Bağlandı",
    connect: "Bağla",
    label_email: "E-posta Adresi",
    hint_email: "E-postanızı değiştirmek için desteğe başvurun.",
    btn_delete: "Hesabı Sil",
    success_msg: "Profil başarıyla güncellendi!",
    error_msg: "Bir şeyler ters gitti."
  },
  ru: {
    title: "Настройки",
    subtitle: "Управление профилем.",
    save: "Сохранить",
    saving: "Сохранение...",
    section_profile: "Профиль",
    section_preferences: "Настройки",
    section_connections: "Подключения",
    section_security: "Безопасность",
    section_danger: "Опасная зона",
    label_display_name: "Отображаемое имя",
    placeholder_display_name: "напр. Темный Лорд",
    label_username: "Имя пользователя",
    placeholder_username: "имя_пользователя",
    hint_username: "Только буквы, цифры и подчеркивания.",
    status_checking: "Проверка...",
    status_taken: "Занято",
    status_available: "Доступно",
    label_language: "Язык",
    desc_language: "Выберите язык панели.",
    connected: "Подключено",
    connect: "Подключить",
    label_email: "Email адрес",
    hint_email: "Для смены email обратитесь в поддержку.",
    btn_delete: "Удалить аккаунт",
    success_msg: "Профиль обновлен!",
    error_msg: "Что-то пошло не так."
  }
};