// src/lib/tasks.ts
import { supabase } from "@/integrations/supabase/client";
import { pickTodayTask } from "@/lib/taskPlanner";

/* ----------------------------------------------------------------------- */
/* Builder de filas: normaliza y devuelve 'any[]' para evitar choque TS     */
/* ----------------------------------------------------------------------- */
function buildChallengeRows(rows: Array<{
  goal_id: string;
  day: string;          // YYYY-MM-DD
  text: string;
  minutes: number;
  kind: "accion" | "educacion" | "reflexion";
  status: "pending" | "done" | "skipped";
}>): any[] {
  return rows.map((r) => ({
    goal_id: r.goal_id,
    day: r.day,
    text: r.text,
    minutes: r.minutes,
    kind: String(r.kind),
    status: String(r.status),
  })) as any[];
}

/* ----------------------- Helpers de normalización ----------------------- */

const CATEGORY_DB_MAP: Record<string, string> = {
  salud: "salud",
  salud_fisica: "salud",
  alimentacion: "alimentacion",
  "alimentación": "alimentacion",
  finanzas: "finanzas",
  ahorro: "finanzas",
  organizacion: "organizacion",
  "organización": "organizacion",
  enfoque: "organizacion",
  carrera: "carrera",
  idioma: "carrera",
  relaciones: "relaciones",
  autocuidado: "autocuidado",
  reducir_habitos: "habitos_nocivos",
  habitos_nocivos: "habitos_nocivos",
  nuevo: "carrera",
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
  if (!a || a.length === 0 || b.length === 0) return true;
  const setB = new Set(b);
  return a.some((t) => setB.has(t));
}

function tagsFromForm(formData: any): string[] {
  const tags = new Set<string>();
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

  // Por defecto añade 'home' si no hay 'gimnasio'
  if (![...tags].some((t) => t === "gimnasio")) tags.add("home");

  return Array.from(tags);
}

function pickLocale(profileLocale?: string | null): { locale: string; fallback: string } {
  const l = (profileLocale || "es").split("-")[0].toLowerCase();
  return { locale: l, fallback: l === "es" ? "en" : "es" };
}

/* ----------------------- Generación diaria desde BD --------------------- */

export async function ensureTodayTasksForGoal(opts: {
  id: string;
  category: string;
  level: number;
  minutes_per_day?: number;
  minutes?: number;
}) {
  const todayISO = new Date().toISOString().split("T")[0];
  const goalId = opts.id;
  const level = Math.max(1, Math.min(5, Number(opts.level) || 1));
  const prefMinutes = Math.max(1, Number(opts.minutes_per_day ?? opts.minutes ?? 10));
  const DESIRED_MIN = 3;
  const DESIRED_MAX = 5;

  // 0) Lee existentes de hoy
  const { data: existingRows, error: existingErr } = await supabase
    .from("challenges")
    .select("id,text")
    .eq("goal_id", goalId)
    .eq("day", todayISO);

  if (existingErr) throw existingErr;

  const existing = existingRows ?? [];
  const existingTexts = new Set(existing.map((r) => r.text));
  if (existing.length >= DESIRED_MIN) return;

  const toFill = Math.min(DESIRED_MIN, DESIRED_MAX) - existing.length;

  // 1) Goal -> user & form
  const { data: goal, error: goalErr } = await (supabase as any)
    .from("goals")
    .select("user_id, form_data")
    .eq("id", goalId)
    .maybeSingle();

  if (goalErr) throw goalErr;

  // 2) Locale usuario
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

  // 3) Tags del formulario
  const userTags = tagsFromForm(goal?.form_data);

  // 4) Filtros principales para plantillas
  const dbCategory = normalizeCategory(opts.category);
  const minMin = Math.max(1, prefMinutes - 5);
  const maxMin = Math.min(60, prefMinutes + 5);

  const { data: rawTpls, error: tplErr } = await (supabase as any)
    .from("task_templates")
    .select("id, category, subcategory, level, kind, minutes, tags, active")
    .eq("category", dbCategory)
    .eq("active", true)
    .gte("level", Math.max(1, level - 1))
    .lte("level", level + 1)
    .gte("minutes", minMin)
    .lte("minutes", maxMin)
    .limit(50);

  if (tplErr) {
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

  // Filtra por tags
  const candidates = shuffle(
    (rawTpls as any[]).filter((t) => overlaps(t.tags as string[] | null, userTags))
  );

  // i18n
  const templateIds = candidates.map((t) => t.id);
  const textByTpl = new Map<string, string>();
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

    (i18nFallback ?? []).forEach((r: any) => textByTpl.set(r.template_id, r.text));
    (i18nPrimary ?? []).forEach((r: any) => textByTpl.set(r.template_id, r.text));
  }

  // Construye nuevas filas evitando textos repetidos
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
    if (existingTexts.has(txt)) continue;

    newRows.push({
      goal_id: goalId,
      day: todayISO,
      text: txt,
      minutes: tpl.minutes as number,
      kind: tpl.kind as "accion" | "educacion" | "reflexion",
      status: "pending",
    });
  }

  // Fallback local si faltan
  if (newRows.length < toFill) {
    const missing = toFill - newRows.length;
    const extra = await generateFromLocalLibrary(
      mapToLibraryCategory(opts.category),
      level,
      prefMinutes,
      existingTexts,
      missing
    );

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

  // ---- UPSERT (con cast amplio para evitar choque de tipos generados) ----
  const rowsToUpsert = buildChallengeRows(newRows);
  const { error: upErr } = await (supabase as any)
    .from("challenges")
    .upsert(rowsToUpsert as any[], {
      onConflict: "goal_id,day,text",
      ignoreDuplicates: true,
      returning: "minimal",
    });

  if (upErr) {
    const msg = String((upErr as any)?.message || "");
    const code = (upErr as any)?.code || (upErr as any)?.status;
    const isDup = code === "409" || /duplicate key|unique constraint/i.test(msg);
    if (!isDup) throw upErr;
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
      carrera: "idioma",
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

  const rowsToUpsert = buildChallengeRows(
    rows.map((r) => ({
      goal_id: args.goalId,
      day: args.todayISO,
      text: r.text,
      minutes: r.minutes,
      kind: r.kind,
      status: r.status,
    }))
  );

  const { error } = await (supabase as any)
    .from("challenges")
    .upsert(rowsToUpsert as any[], {
      onConflict: "goal_id,day,text",
      ignoreDuplicates: true,
      returning: "minimal",
    });

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
    const mins = minutesCandidates[Math.min(out.length, minutesCandidates.length - 1)];
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

  // Si aún faltan, mete reflexiones genéricas
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
