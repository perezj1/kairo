// src/lib/taskTemplates.ts
// Generador de tareas paramétricas a partir de categoryId, subCategoryId y formData

export type TimeSlot = 'manana' | 'mediodia' | 'tarde' | 'noche' | 'morning' | 'noon' | 'afternoon' | 'night';
export type RepeatUnit = 'day' | 'week' | 'month';
export type Priority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;                 // stable key (puedes luego reemplazar por uuid en BD)
  title: string;
  description?: string;
  minutes: number;            // duración estimada
  slot?: TimeSlot;            // mejor momento
  repeatEvery?: number;       // 1,2,3...
  repeatUnit?: RepeatUnit;    // day|week|month
  timesPerWeek?: number;      // alternativa a repeatEvery (para “x veces/semana”)
  dayOfWeekHint?: number[];   // 0-6 L-D (si deseas fijar planning o revisión)
  priority?: Priority;
  tags?: string[];
  // Condiciones/controles para KPI y lógica
  kpi?: {
    metric?: string;          // p.ej. 'steps', 'proteins', 'sleep_hours', 'debt_payment'
    target?: number | string; // objetivo por ejecución
    unit?: string;            // 'steps','g','CHF','h','min','items', etc.
    mode?: 'atLeast' | 'equals' | 'atMost';
  };
  // “guards” para no crear tareas si falta información
  requires?: string[];        // nombres de campos de formData requeridos
}

type Builder = (formData: any) => Task[];

const minutesOr = (fd: any, fallback = 15) => Number(fd?.minutes) || fallback;
const slotOr = (fd: any, fallback: TimeSlot = 'manana') => (fd?.bestSlot || fd?.planTime || fallback) as TimeSlot;
const perWeekFromFrequency = (v: any, fb = 3) => Number(v) || fb;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const id = (...parts: (string | number | undefined)[]) =>
  parts.filter(Boolean).join(':').replace(/\s+/g, '_').toLowerCase();

// ========== SALUD ==========
const salud: Record<string, Builder> = {
  bajar_peso: (fd) => {
    const m = minutesOr(fd, 15);
    const w = perWeekFromFrequency(fd.frequency, 4);
    return [
      {
        id: id('salud','bajar_peso','cardio'),
        title: `Cardio ligero ${m} min`,
        description: `Haz caminar/correr suave o bici estática durante ${m} minutos a ritmo conversacional.`,
        minutes: m,
        slot: slotOr(fd, 'tarde'),
        timesPerWeek: w,
        tags: ['cardio','fat-loss'],
        kpi: { metric: 'cardio_minutes', target: m, unit: 'min', mode: 'atLeast' },
      },
      {
        id: id('salud','bajar_peso','fuerza_basica'),
        title: 'Rutina fuerza cuerpo completo (casera)',
        description: '3 rondas: sentadillas x12, flexiones asistidas x10, glute bridge x15, plancha 30s.',
        minutes: clamp(Math.round(m * 0.8), 10, 25),
        slot: slotOr(fd, 'manana'),
        timesPerWeek: Math.max(2, Math.round(w/2)),
        tags: ['strength','fat-loss'],
      },
      {
        id: id('salud','bajar_peso','registro'),
        title: 'Registro de ingesta y peso',
        description: 'Anota comidas del día y tu peso 1x/sem para control de tendencia.',
        minutes: 5,
        timesPerWeek: 7, // registro diario
        slot: 'noche',
        tags: ['tracking'],
        kpi: { metric: 'log_meal', target: 1, unit: 'entry', mode: 'atLeast' },
      },
    ];
  },

  ganar_musculo: (fd) => {
    const m = minutesOr(fd, 25);
    const w = perWeekFromFrequency(fd.frequency, 3);
    const zonas = (fd.targetZones || 'cuerpo completo').toLowerCase();
    return [
      {
        id: id('salud','ganar_musculo','fuerza'),
        title: `Fuerza ${zonas}`,
        description: `Progresión 5x5 o 3x8. Concéntrate en ${zonas}. Aumenta carga cuando completes las repeticiones.`,
        minutes: m,
        timesPerWeek: w,
        slot: slotOr(fd, 'tarde'),
        tags: ['strength','hypertrophy'],
        kpi: { metric: 'workout_done', target: 1, unit: 'session', mode: 'equals' },
      },
      {
        id: id('salud','ganar_musculo','proteinas'),
        title: 'Chequeo proteína del día',
        description: 'Confirma que alcanzaste tu ración objetivo de proteína.',
        minutes: 3,
        timesPerWeek: 7,
        slot: 'noche',
        tags: ['nutrition'],
        kpi: { metric: 'protein_ok', target: 1, unit: 'flag', mode: 'equals' },
      },
    ];
  },

  cardio: (fd) => {
    const m = minutesOr(fd, 20);
    const w = perWeekFromFrequency(fd.frequency, 4);
    const mod = fd.modality || 'correr';
    return [
      {
        id: id('salud','cardio',mod),
        title: `${String(mod).toUpperCase()} ${m} min`,
        description: `Sesión de ${mod} por ${m} min con 5 min de calentamiento y 3 min de vuelta a la calma.`,
        minutes: m,
        timesPerWeek: w,
        slot: slotOr(fd, 'manana'),
        tags: ['cardio','endurance'],
        kpi: { metric: 'cardio_minutes', target: m, unit: 'min', mode: 'atLeast' },
      },
    ];
  },

  movilidad: (fd) => {
    const m = minutesOr(fd, 10);
    const zona = fd.targetZone || 'cadera y espalda';
    const stiff = fd.stiffness || 'media';
    return [
      {
        id: id('salud','movilidad',zona),
        title: `Movilidad ${zona} (${stiff})`,
        description: `Secuencia guiada 10-15 min enfocada en ${zona}. Prioriza respiración nasal y rango cómodo.`,
        minutes: m,
        timesPerWeek: 5,
        slot: slotOr(fd, 'noche'),
        tags: ['mobility','recovery'],
      },
    ];
  },

  mantener_activo: (fd) => {
    const steps = Number(fd.stepsGoal) || 7500;
    const days = Number(fd.activeDays) || 5;
    return [
      {
        id: id('salud','mantener_activo','steps'),
        title: `Meta de pasos: ${steps.toLocaleString()} `,
        description: `Llega a ${steps.toLocaleString()} pasos hoy. Divide en 2-3 paseos.`,
        minutes: 20,
        timesPerWeek: days,
        slot: slotOr(fd, 'tarde'),
        tags: ['steps','habit'],
        kpi: { metric: 'steps', target: steps, unit: 'steps', mode: 'atLeast' },
      },
    ];
  },
};

// ========== ALIMENTACIÓN ==========
const alimentacion: Record<string, Builder> = {
  mas_verduras: (fd) => {
    const meals = Number(fd.mealsPerDay) || 3;
    return [
      {
        id: id('food','mas_verduras','plato'),
        title: `Añade verdura a ${meals} comidas`,
        description: 'Llena 1/2 del plato con verduras o añade una ensalada simple.',
        minutes: 5,
        timesPerWeek: 7,
        slot: 'mediodia',
        tags: ['vegetables','habit'],
        kpi: { metric: 'veg_meals', target: meals, unit: 'meals', mode: 'atLeast' },
      },
    ];
  },
  mas_proteina: (fd) => {
    const servings = Number(fd.servingsPerDay) || 3;
    const fuente = fd.proteinSource || 'mixto';
    return [
      {
        id: id('food','mas_proteina',fuente),
        title: `Asegura ${servings} raciones de proteína`,
        description: `Proteína fuente ${fuente}. Ración ~25-30g.`,
        minutes: 5,
        timesPerWeek: 7,
        slot: 'noche',
        tags: ['protein','habit'],
        kpi: { metric: 'protein_servings', target: servings, unit: 'servings', mode: 'atLeast' },
      },
    ];
  },
  menos_procesados: (fd) => {
    const nivel = fd.strictness || 'gradual';
    const triggers = fd.triggers || [];
    return [
      {
        id: id('food','menos_procesados',nivel),
        title: `Evita ultraprocesados (${nivel})`,
        description: `Plan anti-antojos para: ${triggers.join(', ') || 'situaciones comunes'}.`,
        minutes: 3,
        timesPerWeek: 7,
        slot: 'tarde',
        tags: ['processed','habit'],
      },
    ];
  },
  plan_menus: (fd) => {
    const days = Number(fd.planningDays) || 5;
    const recipes = Number(fd.recipesCount) || 5;
    return [
      {
        id: id('food','plan_menus','plan'),
        title: `Planificar ${days} días (${recipes} recetas)`,
        description: 'Elige recetas, lista de compra y prep básico.',
        minutes: 20,
        timesPerWeek: 1,
        dayOfWeekHint: [0], // domingo
        slot: 'tarde',
        tags: ['planning','grocery'],
      },
    ];
  },
};

// ========== MENTAL ==========
const mental: Record<string, Builder> = {
  reducir_estres: (fd) => {
    const tech = fd.technique || 'respiracion';
    return [
      {
        id: id('mental','estres',tech),
        title: `Técnica anti-estrés: ${tech}`,
        description: '3-5 min de respiración 4-7-8 o paseo corto consciente.',
        minutes: 5,
        timesPerWeek: 7,
        slot: slotOr(fd, 'tarde'),
        tags: ['stress','breathing'],
      },
    ];
  },
  dormir_mejor: (fd) => {
    const hours = Number(fd.sleepHours) || 7;
    const bedtime = fd.bedtime || '22:30';
    const wake = fd.wakeTime || '06:30';
    return [
      {
        id: id('mental','sleep','ritual'),
        title: 'Ritual nocturno',
        description: `Apaga pantallas 60 min antes. A cama ${bedtime}. Despertar ${wake}.`,
        minutes: Number(fd.ritualDuration) || 15,
        timesPerWeek: 7,
        slot: 'noche',
        tags: ['sleep'],
        kpi: { metric: 'sleep_hours', target: hours, unit: 'h', mode: 'atLeast' },
      },
    ];
  },
  mindfulness: (fd) => {
    const freq = Number(fd.frequency) || 5;
    const practice = fd.practice || 'meditacion';
    return [
      {
        id: id('mental','mindfulness',practice),
        title: `Mindfulness (${practice})`,
        description: 'Sesión guiada 5–10 min. Respiración y atención a sensaciones.',
        minutes: 10,
        timesPerWeek: freq,
        slot: slotOr(fd, 'manana'),
        tags: ['mindfulness'],
      },
    ];
  },
  menos_pantalla: (fd) => {
    const limit = Number(fd.dailyLimit) || 1.5;
    return [
      {
        id: id('mental','menos_pantalla','limite'),
        title: `Límite pantalla ${limit}h`,
        description: 'Activa temporizadores en apps objetivo y prepara alternativas rápidas.',
        minutes: 3,
        timesPerWeek: 7,
        slot: 'noche',
        tags: ['screen-time'],
        kpi: { metric: 'screen_hours', target: limit, unit: 'h', mode: 'atMost' },
      },
    ];
  },
};

// ========== FINANZAS ==========
const finanzas: Record<string, Builder> = {
  ahorro: (fd) => {
    const goal = Number(fd.savingsTarget) || 1000;
    const freq = fd.contributionFrequency || 'mensual';
    const chargeDay = Number(fd.chargeDay) || 1;
    return [
      {
        id: id('finanzas','ahorro','aporte'),
        title: `Aporte de ahorro (${freq})`,
        description: `Programa transferencia automática el día ${chargeDay}.`,
        minutes: 5,
        timesPerWeek: freq === 'semanal' ? 1 : 0, // control soft
        tags: ['savings'],
        kpi: { metric: 'savings', target: goal, unit: 'CHF', mode: 'atLeast' },
      },
      {
        id: id('finanzas','ahorro','revisión'),
        title: 'Revisión de gastos fijos',
        minutes: 10,
        timesPerWeek: 1,
        repeatUnit: 'week',
        tags: ['budget'],
      },
    ];
  },
  pagar_deudas: (fd) => {
    const pay = Number(fd.monthlyPayment) || 200;
    const strategy = fd.paymentStrategy || 'avalancha';
    return [
      {
        id: id('finanzas','deudas',strategy),
        title: `Pago deuda (${strategy})`,
        description: `Realiza o verifica el pago programado (${pay} CHF).`,
        minutes: 5,
        timesPerWeek: 4, // chequeo semanal
        tags: ['debt'],
        kpi: { metric: 'debt_payment', target: pay, unit: 'CHF', mode: 'atLeast' },
      },
    ];
  },
  gasto_consciente: (fd) => {
    const weekly = Number(fd.weeklyBudget) || 100;
    const noDays = Number(fd.noSpendDays) || 1;
    return [
      {
        id: id('finanzas','gasto','plan'),
        title: `Plan semanal: ${weekly} CHF`,
        minutes: 6,
        timesPerWeek: 1,
        dayOfWeekHint: [0],
        tags: ['budget'],
      },
      {
        id: id('finanzas','gasto','no_spend'),
        title: `Día sin gastar (${noDays}/sem)`,
        minutes: 2,
        timesPerWeek: noDays,
        tags: ['no-spend'],
      },
    ];
  },
  presupuesto: (fd) => [
    {
      id: id('finanzas','presupuesto','revisión'),
      title: 'Revisión 50/30/20',
      minutes: 10,
      timesPerWeek: (fd.reviewFrequency === 'semanal') ? 1 : 0.5,
      tags: ['budget'],
    },
  ],
};

// ========== RELACIONES ==========
const relaciones: Record<string, Builder> = {
  pareja: (fd) => [
    {
      id: id('rel','pareja','ritual'),
      title: 'Ritual semanal en pareja',
      description: fd.weeklyRitual ? `Plan: ${fd.weeklyRitual}` : 'Cena/paseo y conversación sin pantallas.',
      minutes: 60,
      timesPerWeek: 1,
      dayOfWeekHint: [5,6], // finde
      tags: ['relationship'],
    },
  ],
  amistades: (fd) => {
    const freq = fd.contactFrequency || 'semanal';
    const perWeek = { diario: 5, semanal: 1, quincenal: 0.5, mensual: 0.25 }[freq] ?? 1;
    return [
      {
        id: id('rel','amistades','contacto'),
        title: 'Contacta a tus prioritarios',
        description: `Mensaje/call short a ${fd.priorityPeople || '1-3 amigos'}.`,
        minutes: 5,
        timesPerWeek: perWeek,
        tags: ['friends'],
      },
    ];
  },
  familia: (fd) => [
    {
      id: id('rel','familia','ritual'),
      title: 'Actividad familiar',
      description: `Ritual: ${fd.ritual || 'comida juntos'}.`,
      minutes: Number(fd.sessionDuration) || 60,
      timesPerWeek: (fd.preferredDays === 'entre_semana') ? 1 : 1,
      tags: ['family'],
    },
  ],
  conocer_gente: (fd) => [
    {
      id: id('rel','conocer','actividad'),
      title: 'Asiste a actividad social',
      description: `Formato: ${fd.format || 'evento'}. Intereses: ${fd.interests || 'generales'}.`,
      minutes: 60,
      timesPerWeek: Number(fd.weeklyFrequency) || 1,
      tags: ['networking','social'],
    },
  ],
};

// ========== CARRERA ==========
const carrera: Record<string, Builder> = {
  skill: (fd) => {
    const deep = Number(fd.deepStudyDays) || 3;
    const incTests = !!fd.includeTests;
    return [
      {
        id: id('car','skill','study'),
        title: `Bloque de estudio (${fd.specificSkill || 'Skill'})`,
        description: `Recurso: ${fd.resources || 'curso/plataforma'}.`,
        minutes: minutesOr(fd, 25),
        timesPerWeek: deep,
        slot: slotOr(fd, 'manana'),
        tags: ['study'],
      },
      ...(incTests ? [{
        id: id('car','skill','mock'),
        title: 'Simulacro/Práctica',
        minutes: 30,
        timesPerWeek: 1,
        tags: ['practice'],
      }] as Task[] : []),
    ];
  },
  proyecto: (fd) => [
    {
      id: id('car','proyecto','hitos'),
      title: 'Hito de proyecto',
      description: `Define entregable de esta semana (${fd.weeklyMilestones || 1} hito/s).`,
      minutes: 20,
      timesPerWeek: Number(fd.weeklyMilestones) || 1,
      tags: ['project'],
    },
    {
      id: id('car','proyecto','difusión'),
      title: 'Pequeña publicación del progreso',
      description: fd.publicSharing ? 'Post en LinkedIn/GitHub/foro' : 'Registro privado en tu diario de progreso.',
      minutes: 10,
      timesPerWeek: 1,
      tags: ['build-in-public'],
    },
  ],
  networking: (fd) => [
    {
      id: id('car','networking','reachouts'),
      title: `Contactos: ${fd.weeklyContacts || 3}/sem`,
      description: 'Mensaje breve con propuesta clara y cierre (CTA).',
      minutes: 15,
      timesPerWeek: Number(fd.weeklyContacts) || 3,
      tags: ['networking','outreach'],
    },
    ...(fd.mockInterviews ? [{
      id: id('car','networking','mock'),
      title: 'Simulacro de entrevista',
      minutes: 30,
      timesPerWeek: 1,
      tags: ['interview'],
    }] as Task[] : []),
  ],
  idiomas: (fd) => [
    {
      id: id('car','idiomas','practice'),
      title: `Práctica de ${fd.languageTarget || 'idioma'} (${fd.focus || 'speaking'})`,
      minutes: minutesOr(fd, 15),
      timesPerWeek: Number(fd.conversationDays) || 3,
      tags: ['language'],
    },
  ],
};

// ========== AUTOCUIDADO ==========
const autocuidado: Record<string, Builder> = {
  sueno_energia: (fd) => [
    {
      id: id('auto','sueno','higiene'),
      title: 'Higiene del sueño',
      description: (fd.sleepHygiene || []).join(' · ') || 'Rutina y luz tenue.',
      minutes: 8,
      timesPerWeek: 7,
      slot: 'noche',
      tags: ['sleep'],
    },
  ],
  hobbies_creatividad: (fd) => [
    {
      id: id('auto','hobby','sesion'),
      title: `Hobby: ${fd.hobbyName || 'creatividad'}`,
      minutes: Number(fd.sessionMinutes) || 20,
      timesPerWeek: Number(fd.sessionsPerWeek) || 3,
      tags: ['hobby','creative'],
    },
  ],
  naturaleza_mov_suave: (fd) => [
    {
      id: id('auto','naturaleza','paseo'),
      title: 'Paseo/movimiento suave',
      minutes: minutesOr(fd, 20),
      timesPerWeek: Number(fd.daysPerWeek) || 4,
      tags: ['nature','walk'],
    },
  ],
  micro_placeres: (fd) => [
    {
      id: id('auto','micro','placeres'),
      title: 'Micro-placer del día',
      description: (fd.pleasureIdeas || []).slice(0,3).join(' · ') || 'Té, música, lectura…',
      minutes: 5,
      timesPerWeek: Number(fd.pleasuresPerDay) || 2,
      tags: ['joy'],
    },
  ],
};

// ========== ORGANIZACIÓN ==========
const organizacion: Record<string, Builder> = {
  plan_diario: (fd) => [
    {
      id: id('org','plan','top3'),
      title: `Plan del día (TOP ${fd.dailyTop ?? 3})`,
      minutes: 5,
      timesPerWeek: 7,
      slot: (fd.planTime || 'manana') as TimeSlot,
      tags: ['planning'],
    },
    {
      id: id('org','plan','foco'),
      title: `Bloque de enfoque ${fd.focusBlock || 15} min`,
      minutes: Number(fd.focusBlock) || 15,
      timesPerWeek: 5,
      tags: ['focus'],
    },
  ],
  revision_semanal: () => [
    {
      id: id('org','review','semanal'),
      title: 'Revisión semanal',
      minutes: 20,
      timesPerWeek: 1,
      dayOfWeekHint: [0], // domingo
      tags: ['review'],
    },
  ],
  declutter: (fd) => [
    {
      id: id('org','declutter','zona'),
      title: `Declutter: ${(fd.zones?.[0]) || 'zona pequeña'}`,
      minutes: 15,
      timesPerWeek: 2,
      tags: ['declutter'],
      kpi: { metric: 'items_out', target: Number(fd.itemsPerSession) || 10, unit: 'items', mode: 'atLeast' },
    },
  ],
  inbox_zero: (fd) => [
    {
      id: id('org','inbox','daily'),
      title: 'Bandeja a cero (timebox)',
      minutes: Number(fd.emailMinutes) || 15,
      timesPerWeek: 5,
      tags: ['email'],
    },
  ],
};

// ========== REDUCIR HÁBITOS ==========
const reducir_habitos: Record<string, Builder> = {
  fumar: (fd) => [
    {
      id: id('habitos','fumar','plan'),
      title: 'Plan de reducción',
      description: `Estrategia: ${fd.quitStrategy || 'gradual'}. Disparadores: ${(fd.triggers || []).join(', ')}`,
      minutes: minutesOr(fd, 10),
      timesPerWeek: 7,
      tags: ['smoking'],
      kpi: { metric: 'cigs_per_day', target: Number(fd.cigsPerDay) || 8, unit: 'cigs', mode: 'atMost' },
    },
  ],
  alcohol: (fd) => [
    {
      id: id('habitos','alcohol','regla'),
      title: 'Regla de consumo',
      description: fd.alcoholRule === 'reducir'
        ? `Límite objetivo: ${fd.targetDrinksPerWeek || 4}/sem`
        : `Aplicar: ${fd.alcoholRule || 'L-V'}`,
      minutes: 3,
      timesPerWeek: 7,
      tags: ['alcohol'],
    },
  ],
  azucar: (fd) => [
    {
      id: id('habitos','azucar','foco'),
      title: `Control azúcar (${fd.sugarFocus || 'ambos'})`,
      minutes: 3,
      timesPerWeek: 7,
      tags: ['sugar'],
      kpi: { metric: 'sweet_per_week', target: Number(fd.sweetPerWeek) || 6, unit: 'times', mode: 'atMost' },
    },
  ],
  redes_sociales: (fd) => [
    {
      id: id('habitos','redes','limite'),
      title: `Límite diario redes (${fd.dailyLimitMin || 30} min)`,
      minutes: 2,
      timesPerWeek: 7,
      tags: ['screen-time'],
      kpi: { metric: 'social_minutes', target: Number(fd.dailyLimitMin) || 30, unit: 'min', mode: 'atMost' },
    },
  ],
  otro_habito: (fd) => [
    {
      id: id('habitos','otro',fd.metricName || 'metric'),
      title: `Reducir: ${fd.title || 'hábito'}`,
      minutes: minutesOr(fd, 5),
      timesPerWeek: 7,
      tags: ['habit'],
      kpi: { metric: fd.metricName || 'units_per_day', target: Number(fd.dailyTarget) || 1, unit: 'units', mode: 'atMost' },
      requires: ['title','metricName','dailyTarget'],
    },
  ],
};

// ========== Dispatcher principal ==========

const registry: Record<string, Record<string, Builder>> = {
  salud,
  alimentacion,
  mental,
  finanzas,
  relaciones,
  carrera,
  autocuidado,
  organizacion,
  reducir_habitos,
};

export function buildTasks(categoryId: string, subCategoryId: string, formData: any): Task[] {
  const byCat = registry[categoryId];
  if (!byCat) return [];
  const builder = byCat[subCategoryId];
  if (!builder) return [];
  const tasks = builder(formData);

  // Normalización: asegurar campos y crear ids únicos si faltan
  return tasks.map((t, idx) => ({
    priority: 'normal',
    repeatUnit: t.repeatUnit ?? undefined,
    ...t,
    id: t.id || id(categoryId, subCategoryId, idx),
    minutes: Number(t.minutes) || 10,
  }));
}
