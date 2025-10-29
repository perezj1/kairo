// Task Planner Engine for KAIRO
// Generates daily micro-tasks based on goal, level, and user preferences

import { buildTasks as buildGoalTasks } from '@/lib/taskTemplates';

export type TaskKind = "accion" | "educacion" | "reflexion";

export interface Task {
  kind: TaskKind;
  minutes: number;
  text: string;
  category: string; // libre / legacy (p.ej. "salud", "idioma", etc.)
  level: number;    // 1..5
  tags: string[];
}

interface TaskHistory {
  kind: TaskKind | string;
  text: string;
}

/* ------------------------------------------------------------------ */
/*                         SEED TASK LIBRARY                           */
/* ------------------------------------------------------------------ */

const TASK_LIBRARY: Task[] = [
  
  // SALUD - Level 1
  { kind: "accion", minutes: 5, text: "Da 300 pasos sin mirar el móvil.", category: "salud", level: 1, tags: ["home", "sin_equipo"] },
  { kind: "accion", minutes: 5, text: "Haz 10 sentadillas lentas y controladas.", category: "salud", level: 1, tags: ["home", "sin_equipo"] },
  { kind: "educacion", minutes: 5, text: "Lee la etiqueta nutricional de 1 alimento que comes hoy.", category: "salud", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 2, text: "Escribe 1 obstáculo que tuviste hoy para moverte y un plan B.", category: "salud", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 3, text: "Bebe un vaso de agua antes de tu próxima comida.", category: "salud", level: 1, tags: ["home"] },

  // SALUD - Level 2
  { kind: "accion", minutes: 10, text: '8 intervalos de 30" marcha rápida + 30" pausa.', category: "salud", level: 2, tags: ["home", "sin_equipo"] },
  { kind: "accion", minutes: 10, text: "3 series de 8 sentadillas + 8 elevaciones de talones.", category: "salud", level: 2, tags: ["home", "sin_equipo"] },
  { kind: "educacion", minutes: 8, text: "Lee un artículo corto sobre proteínas o hidratos.", category: "salud", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 3, text: "¿Qué comida saludable puedes preparar en 10 min?", category: "salud", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 5, text: "Prepara una ensalada simple para acompañar tu comida.", category: "salud", level: 2, tags: ["home"] },

  // SALUD - Level 3-5
  { kind: "accion", minutes: 15, text: '12 min de caminata rápida con 3 sprints de 20".', category: "salud", level: 3, tags: ["sin_equipo"] },
  { kind: "accion", minutes: 15, text: "Circuito: 15 sentadillas + 10 flexiones + 30\" plancha, x3.", category: "salud", level: 3, tags: ["home", "sin_equipo"] },
  { kind: "educacion", minutes: 10, text: "Mira un vídeo de 10 min sobre macronutrientes.", category: "salud", level: 3, tags: ["home"] },
  { kind: "accion", minutes: 20, text: "15 min de cardio + 5 min de estiramientos.", category: "salud", level: 4, tags: ["sin_equipo"] },
  { kind: "accion", minutes: 25, text: "Rutina completa: calentamiento + fuerza + core + estiramientos.", category: "salud", level: 5, tags: ["sin_equipo"] },

  // IDIOMA - Level 1
  { kind: "educacion", minutes: 5, text: "Aprende 5 palabras nuevas de un tema que te guste.", category: "idioma", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 5, text: "Escucha una canción en el idioma y busca 1 palabra.", category: "idioma", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 2, text: "Escribe 1 frase sobre tu día usando 1 palabra nueva.", category: "idioma", level: 1, tags: ["home"] },
  { kind: "educacion", minutes: 5, text: "Mira 5 min de un vídeo infantil en el idioma.", category: "idioma", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 3, text: "Lee en voz alta 5 frases de un libro para niños.", category: "idioma", level: 1, tags: ["home"] },

  // IDIOMA - Level 2
  { kind: "educacion", minutes: 10, text: "Completa una lección de gramática básica.", category: "idioma", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 8, text: "Shadowing: repite 3-5 min de un vídeo que te guste.", category: "idioma", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 3, text: "Escribe 3 frases sobre tu rutina matinal.", category: "idioma", level: 2, tags: ["home"] },
  { kind: "educacion", minutes: 10, text: "Mira un episodio corto con subtítulos en el idioma.", category: "idioma", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 10, text: "Practica pronunciación de 10 palabras difíciles.", category: "idioma", level: 2, tags: ["home"] },

  // IDIOMA - Level 3-5
  { kind: "accion", minutes: 15, text: "Conversación de 15 min con IA o intercambio.", category: "idioma", level: 3, tags: ["home"] },
  { kind: "educacion", minutes: 15, text: "Lee un artículo de noticias y resume en 5 frases.", category: "idioma", level: 3, tags: ["home"] },
  { kind: "reflexion", minutes: 5, text: "Escribe un párrafo sobre un tema que te apasione.", category: "idioma", level: 3, tags: ["home"] },
  { kind: "accion", minutes: 20, text: "Mira un episodio completo sin subtítulos en tu idioma.", category: "idioma", level: 4, tags: ["home"] },
  { kind: "educacion", minutes: 25, text: "Lee un capítulo de un libro y toma notas de vocabulario.", category: "idioma", level: 5, tags: ["home"] },

  // AHORRO - Level 1
  { kind: "accion", minutes: 0, text: "Evita tu gasto evitable elegido hoy (café, snack, etc).", category: "ahorro", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 5, text: "Aparta 3 CHF a tu hucha o cuenta de ahorro.", category: "ahorro", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 2, text: "¿Qué gatillo emocional te hizo querer gastar hoy?", category: "ahorro", level: 1, tags: ["home"] },
  { kind: "educacion", minutes: 5, text: "Lee 1 tip sobre ahorro o finanzas personales.", category: "ahorro", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 3, text: "Revisa tus compras de esta semana y marca las innecesarias.", category: "ahorro", level: 1, tags: ["home"] },

  // AHORRO - Level 2-5
  { kind: "accion", minutes: 10, text: "Aparta 5 CHF y anota en qué NO lo gastaste.", category: "ahorro", level: 2, tags: ["home"] },
  { kind: "educacion", minutes: 10, text: "Mira un vídeo de 10 min sobre presupuesto personal.", category: "ahorro", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 5, text: "Calcula cuánto ahorras al mes evitando tu gasto principal.", category: "ahorro", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 15, text: "Crea un presupuesto semanal simple en una hoja.", category: "ahorro", level: 3, tags: ["home"] },
  { kind: "educacion", minutes: 15, text: "Investiga 1 método de inversión o ahorro automático.", category: "ahorro", level: 3, tags: ["home"] },
  { kind: "accion", minutes: 20, text: "Configura una transferencia automática de ahorro.", category: "ahorro", level: 4, tags: ["home"] },
  { kind: "reflexion", minutes: 10, text: "Revisa tus gastos del mes y establece metas para el próximo.", category: "ahorro", level: 4, tags: ["home"] },

  // ENFOQUE - Level 1
  { kind: "accion", minutes: 10, text: "1 Pomodoro de 10 min, móvil boca abajo, 1 tarea.", category: "enfoque", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 5, text: "Limpia pestañas del navegador, deja máximo 3 abiertas.", category: "enfoque", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 2, text: "Escribe cuál es TU distractor principal hoy.", category: "enfoque", level: 1, tags: ["home"] },
  { kind: "educacion", minutes: 5, text: "Lee 1 artículo corto sobre técnicas de concentración.", category: "enfoque", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 5, text: "Silencia notificaciones de apps durante 30 min.", category: "enfoque", level: 1, tags: ["home"] },

  // ENFOQUE - Level 2-5
  { kind: "accion", minutes: 15, text: "1 Pomodoro de 15 min + 5 min de pausa consciente.", category: "enfoque", level: 2, tags: ["home"] },
  { kind: "educacion", minutes: 10, text: "Mira un vídeo sobre el método Pomodoro o GTD.", category: "enfoque", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 5, text: "Lista las 3 tareas más importantes para mañana.", category: "enfoque", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 20, text: "2 Pomodoros seguidos (2x10 min) con descanso entre ellos.", category: "enfoque", level: 3, tags: ["home"] },
  { kind: "educacion", minutes: 15, text: "Estudia una técnica de productividad y pruébala.", category: "enfoque", level: 3, tags: ["home"] },
  { kind: "accion", minutes: 25, text: "Sesión de Deep Work: 25 min sin interrupciones en tu tarea clave.", category: "enfoque", level: 4, tags: ["home"] },
  { kind: "reflexion", minutes: 10, text: "Revisa tu semana: ¿cuántas horas de enfoque real tuviste?", category: "enfoque", level: 4, tags: ["home"] },

  // OTRO - Genérico
  { kind: "reflexion", minutes: 3, text: "Escribe el micro-paso de hoy hacia tu objetivo (1 frase).", category: "otro", level: 1, tags: ["home"] },
  { kind: "accion", minutes: 10, text: "Haz ahora el micro-paso que escribiste.", category: "otro", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 2, text: "Anota qué pequeño avance lograste o desbloqueaste hoy.", category: "otro", level: 1, tags: ["home"] },
  { kind: "educacion", minutes: 10, text: "Lee o mira contenido relacionado con tu objetivo por 10 min.", category: "otro", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 15, text: "Dedica 15 min a practicar tu habilidad objetivo.", category: "otro", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 5, text: "¿Qué obstáculo te frena? Escribe 2 soluciones posibles.", category: "otro", level: 2, tags: ["home"] },
  { kind: "accion", minutes: 20, text: "Sesión práctica: 20 min enfocado en tu objetivo.", category: "otro", level: 3, tags: ["home"] },
  { kind: "educacion", minutes: 15, text: "Investiga sobre alguien que logró lo que tú buscas.", category: "otro", level: 3, tags: ["home"] },
  { kind: "accion", minutes: 25, text: "Bloque de trabajo intenso en tu objetivo principal.", category: "otro", level: 4, tags: ["home"] },
  { kind: "reflexion", minutes: 10, text: "Evalúa tu progreso semanal y ajusta tu estrategia.", category: "otro", level: 4, tags: ["home"] },
];
// ALIMENTACION - Level 1–3 (ejemplos)
TASK_LIBRARY.push(
  { kind: "accion", minutes: 5, text: "Añade una ración de verdura a tu próxima comida.", category: "alimentacion", level: 1, tags: ["home"] },
  { kind: "educacion", minutes: 5, text: "Mira un video de 5 min sobre cómo leer etiquetas de azúcar.", category: "alimentacion", level: 1, tags: ["home"] },
  { kind: "reflexion", minutes: 3, text: "Escribe 1 snack saludable que te guste y tenlo a mano.", category: "alimentacion", level: 1, tags: ["home"] },

  { kind: "accion", minutes: 10, text: "Prepara una ensalada rápida con 3 colores distintos.", category: "alimentacion", level: 2, tags: ["home"] },
  { kind: "educacion", minutes: 8, text: "Lee un artículo corto sobre fibra y por qué sacia.", category: "alimentacion", level: 2, tags: ["home"] },
  { kind: "reflexion", minutes: 3, text: "¿Qué comida del día es tu punto débil? Anota 1 mejora.", category: "alimentacion", level: 2, tags: ["home"] },

  { kind: "accion", minutes: 15, text: "Batch-prep: lava y corta verduras para 2 comidas.", category: "alimentacion", level: 3, tags: ["home"] },
  { kind: "educacion", minutes: 12, text: "Aprende 3 proteínas vegetales y 1 forma simple de usarlas.", category: "alimentacion", level: 3, tags: ["home"] },
  { kind: "reflexion", minutes: 5, text: "Revisa tus bebidas hoy y marca 1 sustitución por agua o té.", category: "alimentacion", level: 3, tags: ["home"] },
);
/* ------------------------------------------------------------------ */
/*                     UTILIDADES DE SELECCIÓN                         */
/* ------------------------------------------------------------------ */

function avoidRepetition(pool: Task[], history: TaskHistory[]): Task[] {
  const recentKinds = history.slice(-2).map((h) => h.kind as TaskKind);
  let out = pool;
  if (recentKinds.length === 2 && recentKinds[0] === recentKinds[1]) {
    const different = pool.filter((t) => t.kind !== recentKinds[0]);
    if (different.length > 0) out = different;
  }
  const recentTexts = new Set(history.slice(-5).map((h) => h.text));
  const novel = out.filter((t) => !recentTexts.has(t.text));
  return novel.length > 0 ? novel : out;
}

/* ------------------------------------------------------------------ */
/*                         TASK PICKER LEGACY                          */
/* ------------------------------------------------------------------ */

export function pickTodayTask(
  category: string,
  level: number,
  minutesPreferred: number,
  history: TaskHistory[]
): Task | null {
  const eligible = TASK_LIBRARY.filter(
    (task) =>
      task.category === category &&
      Math.abs(task.level - level) <= 1 &&
      Math.abs(task.minutes - minutesPreferred) <= 5
  );
  if (eligible.length === 0) return null;

  const finalPool = avoidRepetition(eligible, history);
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

/* ------------------------------------------------------------------ */
/*                         CATEGORY HELPERS                            */
/* ------------------------------------------------------------------ */

type CategorySlug =
  | "salud_fisica"
  | "alimentacion"
  | "salud_mental"
  | "finanzas"
  | "relaciones"
  | "carrera"
  | "habitos_nocivos"
  | "organizacion"
  | "autocuidado";

function normalizeCategory(raw?: string): CategorySlug {
  const s = (raw || "").toLowerCase().trim();

  if (/(salud y forma física|salud y forma fisica|salud|fitness)/i.test(s)) return "salud_fisica";
  if (/(alimentación|alimentacion|comida|nutrición|nutricion)/i.test(s)) return "alimentacion";
  if (/(salud mental|bienestar|mindfulness|ansiedad|mental)/i.test(s)) return "salud_mental";
  if (/(finanzas|ahorro|dinero|presupuesto)/i.test(s)) return "finanzas";
  if (/(relaciones|familia|pareja|amistad)/i.test(s)) return "relaciones";
  if (/(carrera|aprendizaje|estudios|trabajo|learning)/i.test(s)) return "carrera";
  if (/(reducir hábitos nocivos|habitos nocivos|dejar|tabaco|alcohol|adicción|adiccion|reducir_habitos)/i.test(s)) return "habitos_nocivos";
  if (/(organización|organizacion|productividad|orden|organizacion)/i.test(s)) return "organizacion";
  if (/(autocuidado|estilo de vida|selfcare|otro)/i.test(s)) return "autocuidado";

  // Legacy explícitos
  if (/idioma/.test(s)) return "carrera";       // aprendizaje
  if (/enfoque/.test(s)) return "organizacion"; // productividad

  return "salud_fisica";
}

/** Icono por categoría (compat + slug) */
export function getCategoryIcon(category: string): string {
  const s = category.toLowerCase().trim();
  const legacy: Record<string, string> = {
    salud: "💪",
    alimentacion: "🥗",
    mental: "🧠",
    finanzas: "💰",
    relaciones: "👥",
    carrera: "🎓",
    reducir_habitos: "🚭",
    organizacion: "📅",
    autocuidado: "✨",
    nuevo: "💡",
    idioma: "🗣️",
    ahorro: "💰",
    enfoque: "🎯",
    otro: "✨",
  };
  if (legacy[s]) return legacy[s];

  const slug = normalizeCategory(category);
  const bySlug: Record<CategorySlug, string> = {
    salud_fisica: "💪",
    alimentacion: "🥗",
    salud_mental: "🧠",
    finanzas: "💰",
    relaciones: "👥",
    carrera: "🎓",
    habitos_nocivos: "🚭",
    organizacion: "📅",
    autocuidado: "✨",
  };
  return bySlug[slug] ?? "✨";
}

/** Gradiente por categoría (compat + slug) */
export function getCategoryColor(category: string): string {
  const named: Record<string, string> = {
    mint: "linear-gradient(160deg,#48CFAD 0%,#37BC9B 100%)",
    green: "linear-gradient(160deg,#A0D468 0%,#8CC152 100%)",
    purple: "linear-gradient(160deg,#AC92EC 0%,#967ADC 100%)",
    yellow: "linear-gradient(160deg,#FFCE54 0%,#F6BB42 100%)",
    pink: "linear-gradient(160deg,#EC87C0 0%,#D770AD 100%)",
    blue: "linear-gradient(160deg,#5D9CEC 0%,#4A89DC 100%)",
    red: "linear-gradient(160deg,#FC6E51 0%,#E9573F 100%)",
    teal: "linear-gradient(160deg,#4FC1E9 0%,#3BAFDA 100%)",
    lavender: "linear-gradient(160deg,#AC92EC 0%,#967ADC 100%)",
    orange: "linear-gradient(160deg,#FC6E51 0%,#E9573F 100%)",
    primary: "var(--gradient-hero)",
  };
  if (named[category]) return named[category];

  const slug = normalizeCategory(category);
  const bySlug: Record<CategorySlug, string> = {
    salud_fisica: "linear-gradient(160deg,#5D9CEC 0%,#4A89DC 100%)",
    alimentacion: "linear-gradient(160deg,#A0D468 0%,#8CC152 100%)",
    salud_mental: "linear-gradient(160deg,#48CFAD 0%,#37BC9B 100%)",
    finanzas: "linear-gradient(160deg,#FFCE54 0%,#F6BB42 100%)",
    relaciones: "linear-gradient(160deg,#EC87C0 0%,#D770AD 100%)",
    carrera: "linear-gradient(160deg,#4FC1E9 0%,#3BAFDA 100%)",
    habitos_nocivos: "linear-gradient(160deg,#FC6E51 0%,#E9573F 100%)",
    organizacion: "linear-gradient(160deg,#AC92EC 0%,#967ADC 100%)",
    autocuidado: "linear-gradient(160deg,#ED5565 0%,#DA4453 100%)",
  };

  return bySlug[slug] ?? "var(--gradient-hero)";
}

/* ------------------------------------------------------------------ */
/*           NUEVO: PICKER BASADO EN GOALS (plantillas dinámicas)     */
/* ------------------------------------------------------------------ */

// Adaptamos la plantilla (taskTemplates.ts) al formato de este motor
function adaptTemplateToEngine(t: any, categoryId: string): Task {
  const text = t.description ? `${t.title} — ${t.description}` : t.title;
  // Kind heurístico (podemos mejorarlo por tags si quieres)
  const kind: TaskKind = 'accion';
  return {
    kind,
    minutes: Number(t.minutes) || 10,
    text,
    category: categoryId,    // mantenemos el id de tu categoría
    level: 2,                // neutro; si luego añades “nivel” en BD, lo mapeamos
    tags: Array.isArray(t.tags) ? t.tags : [],
  };
}

/**
 * Genera tareas desde las plantillas del objetivo (categoryId, subCategoryId, formData),
 * las adapta al motor y elige una para hoy. Si no hay plantillas, cae a pickTodayTask.
 */
export function pickTodayTaskFromGoal(
  categoryId: string,
  subCategoryId: string,
  formData: any,
  history: TaskHistory[],
  minutesPreferred?: number,
  level: number = 2
): Task | null {
  const templates = buildGoalTasks(categoryId, subCategoryId, formData);
  if (templates.length === 0) {
    // Fallback a la librería legacy (por compatibilidad)
    const categoryForLegacy = categoryId; // puedes mapear si usas otros slugs
    return pickTodayTask(categoryForLegacy, level, minutesPreferred ?? 10, history);
  }

  const dynamicTasks = templates.map((t) => adaptTemplateToEngine(t, categoryId));

  // Filtrado suave por minutos si viene preferencia
  let pool = dynamicTasks;
  if (typeof minutesPreferred === 'number') {
    const tol = 7; // tolerancia
    const filtered = dynamicTasks.filter(
      (t) => Math.abs(t.minutes - minutesPreferred) <= tol
    );
    if (filtered.length > 0) pool = filtered;
  }

  // Evitar repeticiones como en el motor legacy
  const finalPool = avoidRepetition(pool, history);
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
