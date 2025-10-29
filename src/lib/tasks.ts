// src/lib/tasks.ts
import { supabase } from "@/integrations/supabase/client";
import { pickTodayTask } from "@/lib/taskPlanner";

/* ----------------------- Helpers de normalización ----------------------- */

const CATEGORY_DB_MAP: Record<string, string> = {
  // mapeo flexible -> slug de BD (task_templates.category)
  salud: "salud",
  salud_fisica: "salud",

  alimentacion: "alimentacion",
  "alimentación": "alimentacion",

  finanzas: "finanzas",
  ahorro: "finanzas", // en BD usamos 'finanzas'

  organizacion: "organizacion",
  "organización": "organizacion",
  enfoque: "organizacion",

  carrera: "carrera",
  idioma: "carrera", // aprendizaje

  relaciones: "relaciones",
  autocuidado: "autocuidado",

  reducir_habitos: "habitos_nocivos",
  habitos_nocivos: "habitos_nocivos",

  nuevo: "carrera", // genérico a aprendizaje
};

function normalizeCategory(raw?: string): string {
  const s = String(raw || "").toLowerCase().trim();
  return CATEGORY_DB_MAP[s] ?? s ?? "salud";
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function overlaps(a: string[] | null | undefined, b: string[]): boolean {
  if (!a || a.length === 0 || b.length === 0) return true; // si no hay tags en plantilla, la aceptamos
  const setB = new Set(b);
  return a.some((t) => setB.has(t));
}

// Lee tags del JSON de formulario del goal (suave: si no existen, devuelve [])
function tagsFromForm(formData: any): string[] {
  const tags = new Set<string>();

  // Lugar/equipo
  if (!formData) return [];

  // Organización
  if (formData.planTime) tags.add(formData.planTime); // 'manana' | 'mediodia' | 'tarde' | 'noche'

  // Salud
  if (formData.equipment === "none") tags.add("sin_equipo");
  if (formData.equipment === "home" || formData.location === "home") tags.add("home");
  if (formData.equipment === "gym" || formData.location === "gym") tags.add("gimnasio");

  // Alimentación
  if (formData.cocina ?? formData.kitchen) tags.add("cocina");

  // Email/productividad
  if (formData.accounts) tags.add("email");

  // Siempre añadimos 'home' por defecto si no hay localización
  if (![...tags].some((t) => t === "gimnasio")) tags.add("home");

  return Array.from(tags);
}

function pickLocale(profileLocale?: string | null): { locale: string; fallback: string } {
  // Priorizamos el idioma del perfil; fallback a 'en' como reserva
  const l = (profileLocale || "es").split("-")[0].toLowerCase();
  return { locale: l, fallback: l === "es" ? "en" : "es" };
}

/* ----------------------- Generación diaria desde BD --------------------- */

/**
 * Garantiza entre 2 y 5 tareas (por defecto 3) para 'today' de un goal.
 * 1) Busca existentes de hoy.
 * 2) Si faltan, intenta elegir plantillas en BD con i18n que casen con:
 *    - categoría normalizada
 *    - nivel +-1 del goal
 *    - minutos ~ preferencia (±5)
 *    - coincidencia de tags (solapamiento)
 * 3) Si no alcanza el mínimo, hace fallback a la librería local (pickTodayTask).
 */
export async function ensureTodayTasksForGoal(opts: {
  id: string;
  category: string;
  level: number;
  minutes_per_day?: number;
  minutes?: number; // compat
}) {
  const todayISO = new Date().toISOString().split("T")[0];
  const goalId = opts.id;
  const level = Math.max(1, Math.min(5, Number(opts.level) || 1));
  const prefMinutes = Math.max(1, Number(opts.minutes_per_day ?? opts.minutes ?? 10));
  const DESIRED_MIN = 3; // puedes subirlo a 5 si quieres
  const DESIRED_MAX = 5;

  /* 0) Lee ya existentes para no duplicar y calcular cuántas faltan */
  const { data: existingRows, error: existingErr } = await supabase
    .from("challenges")
    .select("id,text")
    .eq("goal_id", goalId)
    .eq("day", todayISO);

  if (existingErr) throw existingErr;

  const existing = existingRows ?? [];
  const existingTexts = new Set(existing.map((r) => r.text));
  if (existing.length >= DESIRED_MIN) return; // ya tenemos suficientes

  const toFill = Math.min(DESIRED_MIN, DESIRED_MAX) - existing.length;

  /* 1) Carga datos del goal para user_id + form_data (cast a any por tipado) */
  const { data: goal, error: goalErr } = await (supabase as any)
    .from("goals")
    .select("user_id, form_data")
    .eq("id", goalId)
    .maybeSingle();

  if (goalErr) throw goalErr;

  /* 2) Locale del usuario (profiles.id = user_id) */
  let locale = "es";
  let fallback = "en";
  if (goal?.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("locale")
      .eq("id", goal.user_id as string)
      .maybeSingle();
    const pf = pickLocale(profile?.locale);
    locale = pf.locale;
    fallback = pf.fallback;
  }

  /* 3) Tags derivados del formulario */
  const userTags = tagsFromForm(goal?.form_data);

  /* 4) Filtros principales para plantillas */
  const dbCategory = normalizeCategory(opts.category);
  const minMin = Math.max(1, prefMinutes - 5);
  const maxMin = Math.min(60, prefMinutes + 5);

  // Traemos candidatas (cast a any para evitar complain de tipos hasta regenerar types)
  const { data: rawTpls, error: tplErr } = await (supabase as any)
    .from("task_templates")
    .select("id, category, subcategory, level, kind, minutes, tags, active")
    .eq("category", dbCategory)
    .eq("active", true)
    .gte("level", Math.max(1, level - 1))
    .lte("level", level + 1)
    .gte("minutes", minMin)
    .lte("minutes", maxMin)
    // Traemos bastantes y filtramos/ordenamos en cliente
    .limit(50);

  if (tplErr) {
    // Si falla la consulta de BD, hacemos todo con librería local
    return await fallbackWithLocalLibrary({
      goalId,
      todayISO,
      libCategory: mapToLibraryCategory(opts.category),
      level,
      prefMinutes,
      existingTexts,
      needed: toFill,
    });
  }

  // Filtro por tags en cliente (solapamiento)
  const candidates = shuffle(
    (rawTpls as any[]).filter((t) => overlaps(t.tags as string[] | null, userTags))
  );

  // Recogemos los textos i18n para esas plantillas (primero 'locale', luego rellenamos con fallback)
  const templateIds = candidates.map((t) => t.id);
  let textByTpl = new Map<string, string>();

  if (templateIds.length > 0) {
    const { data: i18nPrimary } = await (supabase as any)
      .from("task_template_i18n")
      .select("template_id, text")
      .in("template_id", templateIds)
      .eq("locale", locale);

    const { data: i18nFallback } = await (supabase as any)
      .from("task_template_i18n")
      .select("template_id, text")
      .in("template_id", templateIds)
      .eq("locale", fallback);

    // Primero fallback...
    (i18nFallback ?? []).forEach((r: any) => textByTpl.set(r.template_id, r.text));
    // ...y sobrescribimos con locale principal si existe
    (i18nPrimary ?? []).forEach((r: any) => textByTpl.set(r.template_id, r.text));
  }

  // Construimos nuevas tareas evitando textos ya usados
  const newRows: Array<{
    goal_id: string;
    day: string;
    text: string;
    minutes: number;
    kind: "accion" | "educacion" | "reflexion";
    status: "pending";
  }> = [];

  for (const tpl of candidates) {
    if (newRows.length >= toFill) break;
    const txt = textByTpl.get(tpl.id);
    if (!txt) continue;
    if (existingTexts.has(txt)) continue; // evita UNIQUE (goal_id,day,text)

    newRows.push({
      goal_id: goalId,
      day: todayISO,
      text: txt,
      minutes: tpl.minutes as number,
      kind: tpl.kind as "accion" | "educacion" | "reflexion",
      status: "pending",
    });
  }

  // Si no alcanzamos el mínimo, rellenamos con librería local
if (newRows.length < toFill) {
  const missing = toFill - newRows.length;
  const extra = await generateFromLocalLibrary(
    mapToLibraryCategory(opts.category),
    level,
    prefMinutes,
    existingTexts,
    missing
  );

  // añade los campos requeridos por la tabla challenges
  newRows.push(
    ...extra.map((r) => ({
      goal_id: goalId,
      day: todayISO,
      text: r.text,
      minutes: r.minutes,
      kind: r.kind,
      status: r.status,
    }))
  );
}

  if (newRows.length === 0) return;

  const { error: insErr } = await supabase.from("challenges").insert(newRows as any[]);
  if (insErr) {
    // Ignoramos conflictos de UNIQUE (multi-click/refresh)
    const msg = String((insErr as any)?.message || "");
    const code = (insErr as any)?.code || (insErr as any)?.status;
    const isDup = code === "409" || /duplicate key|unique constraint/i.test(msg);
    if (!isDup) throw insErr;
  }
}

/* ----------------------- Fallback a librería local ---------------------- */

function mapToLibraryCategory(raw: string): string {
  const s = String(raw || "").toLowerCase().trim();
  return (
    {
      salud: "salud",
      salud_fisica: "salud",
      alimentacion: "alimentacion",
      "alimentación": "alimentacion",
      finanzas: "ahorro",
      organizacion: "enfoque",
      "organización": "enfoque",
      carrera: "idioma", // usamos set de idioma/otro como fallback
      idioma: "idioma",
    }[s] || "otro"
  );
}

async function fallbackWithLocalLibrary(args: {
  goalId: string;
  todayISO: string;
  libCategory: string;
  level: number;
  prefMinutes: number;
  existingTexts: Set<string>;
  needed: number;
}) {
  const rows = await generateFromLocalLibrary(
    args.libCategory,
    args.level,
    args.prefMinutes,
    args.existingTexts,
    args.needed
  );

  if (rows.length === 0) return;

  const { error } = await supabase.from("challenges").insert(
    rows.map((r) => ({ ...r, goal_id: args.goalId, day: args.todayISO }))
  );
  if (error) {
    const msg = String((error as any)?.message || "");
    const code = (error as any)?.code || (error as any)?.status;
    const isDup = code === "409" || /duplicate key|unique constraint/i.test(msg);
    if (!isDup) throw error;
  }
}

async function generateFromLocalLibrary(
  libCategory: string,
  level: number,
  prefMinutes: number,
  existingTexts: Set<string>,
  needed: number
) {
  const out: Array<{
    text: string;
    minutes: number;
    kind: "accion" | "educacion" | "reflexion";
    status: "pending";
  }> = [];

  const minutesCandidates = [prefMinutes, Math.max(5, prefMinutes - 5), prefMinutes + 5];
  const history: { kind: string; text: string }[] = [];
  const picks = new Set<string>();
  let tries = 0;

  while (out.length < needed && tries < 12) {
    tries++;
    const mins =
      minutesCandidates[Math.min(out.length, minutesCandidates.length - 1)];
    const t = pickTodayTask(libCategory, level, mins, history);
    if (!t) break;
    const key = `${t.kind}|${t.text}`;
    if (picks.has(key) || existingTexts.has(t.text)) continue;
    picks.add(key);
    history.push({ kind: t.kind, text: t.text });
    out.push({
      text: t.text,
      minutes: t.minutes,
      kind: t.kind as any,
      status: "pending",
    });
  }

  // Si aún faltan, mete reflexiones genéricas seguras
  while (out.length < needed) {
    const generic = "Escribe el micro-paso de hoy hacia tu objetivo (1 frase).";
    if (!existingTexts.has(generic)) {
      out.push({ text: generic, minutes: 3, kind: "reflexion", status: "pending" });
    } else {
      break;
    }
  }

  return out;
}
