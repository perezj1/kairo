// src/lib/categoryTheme.ts
export type CategoryKey =
  | "salud_fisica"
  | "alimentacion"
  | "salud_mental"
  | "finanzas"
  | "relaciones"
  | "carrera"
  | "habitos_nocivos"
  | "organizacion"
  | "autocuidado";

/** Normaliza etiquetas que pueden venir de onboarding o BBDD */
export function slugifyCategory(raw?: string): CategoryKey {
  const s = (raw || "").toLowerCase().trim();

  if (/(salud y forma física|salud y forma fisica|salud|fitness)/i.test(s)) return "salud_fisica";
  if (/(alimentación|alimentacion|comida|nutrición|nutricion)/i.test(s)) return "alimentacion";
  if (/(salud mental|bienestar|mindfulness|ansiedad)/i.test(s)) return "salud_mental";
  if (/(finanzas|ahorro|dinero|presupuesto)/i.test(s)) return "finanzas";
  if (/(relaciones|familia|pareja|amistad)/i.test(s)) return "relaciones";
  if (/(carrera|aprendizaje|estudios|trabajo|learning)/i.test(s)) return "carrera";
  if (/(reducir hábitos nocivos|habitos nocivos|dejar|tabaco|alcohol|adicción|adiccion)/i.test(s)) return "habitos_nocivos";
  if (/(organización|organizacion|productividad|orden)/i.test(s)) return "organizacion";
  if (/(autocuidado|estilo de vida|selfcare)/i.test(s)) return "autocuidado";

  // fallback razonable (mismo hero)
  return "salud_fisica";
}

/**
 * Paleta fija por categoría (9) basada en tu imagen:
 * - GRAPEFRUIT  : #ED5565 → #DA4453
 * - BITTERSWEET : #FC6E51 → #E9573F
 * - SUNFLOWER   : #FFCE54 → #F6BB42
 * - GRASS       : #A0D468 → #8CC152
 * - MINT        : #48CFAD → #37BC9B
 * - AQUA        : #4FC1E9 → #3BAFDA
 * - BLUE JEANS  : #5D9CEC → #4A89DC
 * - LAVANDER    : #AC92EC → #967ADC
 * - PINK ROSE   : #EC87C0 → #D770AD
 *
 * (LIGHT GRAY se descarta porque no necesitamos una 10ª categoría.)
 * Mantén texto blanco en las tarjetas para contraste.
 */
export const CATEGORY_THEME: Record<
  CategoryKey,
  { gradient: string; ring: string }
> = {
  // Sugerencias de mapeo semántico (ajústalo si prefieres otras asociaciones):
  salud_fisica: {
    // BLUE JEANS
    gradient: "linear-gradient(160deg,#5D9CEC 0%,#4A89DC 100%)",
    ring: "rgba(93,156,236,0.32)",
  },
  alimentacion: {
    // GRASS
    gradient: "linear-gradient(160deg,#A0D468 0%,#8CC152 100%)",
    ring: "rgba(160,212,104,0.32)",
  },
  salud_mental: {
    // MINT
    gradient: "linear-gradient(160deg,#48CFAD 0%,#37BC9B 100%)",
    ring: "rgba(72,207,173,0.32)",
  },
  finanzas: {
    // SUNFLOWER (dorado)
    gradient: "linear-gradient(160deg,#FFCE54 0%,#F6BB42 100%)",
    ring: "rgba(255,206,84,0.32)",
  },
  relaciones: {
    // PINK ROSE
    gradient: "linear-gradient(160deg,#EC87C0 0%,#D770AD 100%)",
    ring: "rgba(236,135,192,0.32)",
  },
  carrera: {
    // AQUA
    gradient: "linear-gradient(160deg,#4FC1E9 0%,#3BAFDA 100%)",
    ring: "rgba(79,193,233,0.32)",
  },
  habitos_nocivos: {
    // BITTERSWEET (alerta)
    gradient: "linear-gradient(160deg,#FC6E51 0%,#E9573F 100%)",
    ring: "rgba(252,110,81,0.32)",
  },
  organizacion: {
    // LAVANDER
    gradient: "linear-gradient(160deg,#AC92EC 0%,#967ADC 100%)",
    ring: "rgba(172,146,236,0.32)",
  },
  autocuidado: {
    // GRAPEFRUIT
    gradient: "linear-gradient(160deg,#ED5565 0%,#DA4453 100%)",
    ring: "rgba(237,85,101,0.32)",
  },
};

/** Devuelve gradient + ring según categoría (con fallback a tu hero) */
export function getCategoryTheme(category?: string) {
  const key = slugifyCategory(category);
  const theme = CATEGORY_THEME[key];
  return theme ?? { gradient: "var(--gradient-hero)", ring: "rgba(0,0,0,0.18)" };
}
