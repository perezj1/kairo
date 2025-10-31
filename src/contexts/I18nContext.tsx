import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "es" | "en" | "de";

const DICTIONARY = {
  es: {
    app_name: "KAIRO",
    home: "Inicio",
    goals: "Objetivos",
    profile: "Perfil",
    growth: "Crecimiento",
    complete: "Completar",
    skip: "Omitir",
    no_tasks_title: "No hay tareas",
    no_tasks_desc: "Activa tus objetivos para comenzar",
    go_settings: "Ir a Configuración",
    interact_hint: "Desliza izquierda/derecha para navegar entre tareas",
    my_goals: "Mis Objetivos",
    manage_goals: "Gestiona tus Objetivos",
    manage_goals_desc: "Activa o desactiva los objetivos que quieres trabajar",
    my_progress: "Mi Progreso",
    total_xp: "XP Total",
    max_streak: "Racha Máxima",
    completed_challenges: "Tareas Completadas",
    active_goals: "Objetivos Activos",
    completion_rate: "Tasa de Finalización",
    categories: "Categorías",
    user_info: "Información del usuario",
    username: "Nombre de usuario",
    enter_username: "Ingresa tu nombre de usuario",
    email: "Correo electrónico",
    member_since: "Miembro desde",
    save_changes: "Guardar cambios",
    saving: "Guardando...",
    profile_updated: "Perfil actualizado correctamente",
    error_loading_profile: "Error al cargar el perfil",
    error_updating_profile: "Error al actualizar el perfil",
    account_actions: "Acciones de cuenta",
    logout: "Cerrar sesión",
    overall_progress: "Progreso general",
    progress_by_category: "Progreso por categoría",
    of: "de",
    settings: "Configuración",
    notifications: "Notificaciones",
    notifications_desc: "Gestiona tus preferencias de notificaciones",
    daily_reminders: "Recordatorios diarios",
    daily_reminders_desc: "Recibe 2-3 notificaciones al día para completar tareas",
    notifications_enabled: "Notificaciones activadas",
    notifications_disabled: "Notificaciones desactivadas",
    error_loading_settings: "Error al cargar configuración",
    error_updating_settings: "Error al actualizar configuración",
    active_categories: "Categorías activas",
    active_categories_desc: "Selecciona las categorías que quieres ver",
    language: "Idioma",
    level: "Nivel",
    streak: "Racha",
    hearts: "Corazones",
    days: "días",
    share_app: "Compartir App",
    share_message: "¡Únete a mí en KAIRO! Una app que te ayuda a alcanzar tus objetivos con gamificación. 🎯",
    rewards_unlocked: "Recompensas desbloqueadas",
    achievements: "Logros"
  },
  en: {
    app_name: "KAIRO",
    home: "Home",
    goals: "Goals",
    profile: "Profile",
    growth: "Growth",
    complete: "Complete",
    skip: "Skip",
    no_tasks_title: "No tasks",
    no_tasks_desc: "Activate your goals to get started",
    go_settings: "Go to Settings",
    interact_hint: "Swipe left/right to navigate between tasks",
    my_goals: "My Goals",
    manage_goals: "Manage Your Goals",
    manage_goals_desc: "Enable or disable the goals you want to work on",
    my_progress: "My Progress",
    total_xp: "Total XP",
    max_streak: "Max Streak",
    completed_challenges: "Completed Tasks",
    active_goals: "Active Goals",
    completion_rate: "Completion Rate",
    categories: "Categories",
    user_info: "User Information",
    username: "Username",
    enter_username: "Enter your username",
    email: "Email",
    member_since: "Member since",
    save_changes: "Save changes",
    saving: "Saving...",
    profile_updated: "Profile updated successfully",
    error_loading_profile: "Error loading profile",
    error_updating_profile: "Error updating profile",
    account_actions: "Account Actions",
    logout: "Logout",
    overall_progress: "Overall Progress",
    progress_by_category: "Progress by category",
    of: "of",
    settings: "Settings",
    notifications: "Notifications",
    notifications_desc: "Manage your notification preferences",
    daily_reminders: "Daily reminders",
    daily_reminders_desc: "Receive 2-3 notifications per day to complete tasks",
    notifications_enabled: "Notifications enabled",
    notifications_disabled: "Notifications disabled",
    error_loading_settings: "Error loading settings",
    error_updating_settings: "Error updating settings",
    active_categories: "Active categories",
    active_categories_desc: "Select the categories you want to see",
    language: "Language",
    level: "Level",
    streak: "Streak",
    hearts: "Hearts",
    days: "days",
    share_app: "Share App",
    share_message: "Join me on KAIRO! An app that helps you achieve your goals with gamification. 🎯",
    rewards_unlocked: "Rewards unlocked",
    achievements: "Achievements"
  },
  de: {
    app_name: "KAIRO",
    home: "Startseite",
    goals: "Ziele",
    profile: "Profil",
    growth: "Wachstum",
    complete: "Abschließen",
    skip: "Überspringen",
    no_tasks_title: "Keine Aufgaben",
    no_tasks_desc: "Aktiviere deine Ziele, um zu beginnen",
    go_settings: "Zu Einstellungen",
    interact_hint: "Wischen Sie links/rechts, um zwischen Aufgaben zu navigieren",
    my_goals: "Meine Ziele",
    manage_goals: "Verwalte Deine Ziele",
    manage_goals_desc: "Aktiviere oder deaktiviere die Ziele, an denen du arbeiten möchtest",
    my_progress: "Mein Fortschritt",
    total_xp: "Gesamt XP",
    max_streak: "Maximale Serie",
    completed_challenges: "Abgeschlossene Aufgaben",
    active_goals: "Aktive Ziele",
    completion_rate: "Abschlussrate",
    categories: "Kategorien",
    user_info: "Benutzerinformationen",
    username: "Benutzername",
    enter_username: "Geben Sie Ihren Benutzernamen ein",
    email: "E-Mail",
    member_since: "Mitglied seit",
    save_changes: "Änderungen speichern",
    saving: "Speichern...",
    profile_updated: "Profil erfolgreich aktualisiert",
    error_loading_profile: "Fehler beim Laden des Profils",
    error_updating_profile: "Fehler beim Aktualisieren des Profils",
    account_actions: "Kontoaktionen",
    logout: "Abmelden",
    overall_progress: "Gesamtfortschritt",
    progress_by_category: "Fortschritt nach Kategorie",
    of: "von",
    settings: "Einstellungen",
    notifications: "Benachrichtigungen",
    notifications_desc: "Verwalten Sie Ihre Benachrichtigungseinstellungen",
    daily_reminders: "Tägliche Erinnerungen",
    daily_reminders_desc: "Erhalten Sie 2-3 Benachrichtigungen pro Tag",
    notifications_enabled: "Benachrichtigungen aktiviert",
    notifications_disabled: "Benachrichtigungen deaktiviert",
    error_loading_settings: "Fehler beim Laden der Einstellungen",
    error_updating_settings: "Fehler beim Aktualisieren der Einstellungen",
    active_categories: "Aktive Kategorien",
    active_categories_desc: "Wählen Sie die Kategorien, die Sie sehen möchten",
    language: "Sprache",
    level: "Stufe",
    streak: "Serie",
    hearts: "Herzen",
    days: "Tage",
    share_app: "App teilen",
    share_message: "Komm zu mir bei KAIRO! Eine App, die dir hilft, deine Ziele mit Gamification zu erreichen. 🎯",
    rewards_unlocked: "Belohnungen freigeschaltet",
    achievements: "Erfolge"
  }
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  cycle: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved) setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  const t = useMemo(() => {
    return (key: string) => (DICTIONARY[locale] as Record<string, string>)[key] ?? key;
  }, [locale]);

  const cycle = () => {
    const order: Locale[] = ["es", "en", "de"];
    const idx = order.indexOf(locale);
    setLocale(order[(idx + 1) % order.length]);
  };

  const value = useMemo(() => ({ locale, setLocale, t, cycle }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
