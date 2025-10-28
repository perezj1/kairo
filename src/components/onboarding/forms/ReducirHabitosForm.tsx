import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";

/** Subcategorías soportadas */
export type ReducirHabitosSubId =
  | "fumar"
  | "alcohol"
  | "azucar"
  | "redes_sociales"
  | "otro_habito";

interface ReducirHabitosFormProps {
  subCategoryId: ReducirHabitosSubId;
  formData: any;
  onUpdate: (data: any) => void;
  /** Si el padre ya muestra minutos/dates, mantenlos en false para evitar duplicados */
  showMinutes?: boolean;
  showDeadline?: boolean;
}

/* ───────────────────────────── Helpers ────────────────────────────*/
const MINUTES_OPTIONS = [5, 10, 15, 20, 30] as const;
const DEADLINE_OPTIONS = [
  { id: "1w", label: "1 semana" },
  { id: "2w", label: "2 semanas" },
  { id: "1m", label: "1 mes" },
  { id: "3m", label: "3 meses" },
] as const;

function toIntOrEmpty(v: string, fallback?: number) {
  if (v === "" || v === undefined || v === null) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : (fallback ?? "");
}

function ButtonGroup<T extends string | number | boolean>({
  value,
  options,
  onChange,
  buttonClass = "h-10",
}: {
  value: T | undefined;
  options: ReadonlyArray<{ id: T; label: string }>;
  onChange: (val: T) => void;
  buttonClass?: string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
      {options.map((o) => (
        <Button
          type="button"
          key={String(o.id)}
          aria-pressed={value === o.id}
          variant={value === o.id ? "default" : "outline"}
          onClick={() => onChange(o.id)}
          className={buttonClass}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}

function MultiButtonGroup({
  selected,
  options,
  onToggle,
  buttonClass = "h-10 text-sm",
}: {
  selected?: string[];
  options: ReadonlyArray<{ id: string; label: string }>;
  onToggle: (id: string) => void;
  buttonClass?: string;
}) {
  const setSel = useMemo(() => new Set(selected ?? []), [selected]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
      {options.map((o) => {
        const active = setSel.has(o.id);
        return (
          <Button
            type="button"
            key={o.id}
            aria-pressed={active}
            variant={active ? "default" : "outline"}
            onClick={() => onToggle(o.id)}
            className={buttonClass}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Form ────────────────────────────*/
export const ReducirHabitosForm = ({
  subCategoryId,
  formData,
  onUpdate,
  showMinutes = false,
  showDeadline = false,
}: ReducirHabitosFormProps) => {
  const updateField = (key: string, value: any) =>
    onUpdate({ ...formData, [key]: value });

  const MinutesPicker = showMinutes ? (
    <div>
      <Label className="text-sm font-medium">Minutos diarios</Label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {MINUTES_OPTIONS.map((m) => (
          <Button
            type="button"
            key={m}
            aria-pressed={formData.minutes === m}
            variant={formData.minutes === m ? "default" : "outline"}
            onClick={() => updateField("minutes", m)}
            className="h-10"
          >
            {m}
          </Button>
        ))}
      </div>
    </div>
  ) : null;

  const DeadlinePicker = showDeadline ? (
    <div>
      <Label className="text-sm font-medium">Fecha límite</Label>
      <ButtonGroup
        value={formData.deadlinePreset}
        options={DEADLINE_OPTIONS}
        onChange={(v) => updateField("deadlinePreset", v)}
      />
    </div>
  ) : null;

 
  

  /* ─────────────── FUMAR ─────────────── */
  if (subCategoryId === "fumar") {
    return (
      <>
      <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Crear portafolio web"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Cigarrillos/día (actual)</Label>
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            max={100}
            value={formData.cigsPerDay ?? ""}
            onChange={(e) => updateField("cigsPerDay", toIntOrEmpty(e.target.value, 0))}
            placeholder="Ej: 8"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Estrategia</Label>
          <ButtonGroup
            value={formData.quitStrategy}
            options={[
              { id: "gradual", label: "Gradual" },
              { id: "abrupto", label: "De golpe" },
            ]}
            onChange={(v) => updateField("quitStrategy", v)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Disparadores (elige)</Label>
          <MultiButtonGroup
            selected={formData.triggers}
            options={[
              { id: "estres", label: "Estrés" },
              { id: "cafe", label: "Café" },
              { id: "social", label: "Social" },
              { id: "despues_comer", label: "Después de comer" },
              { id: "conduciendo", label: "Conduciendo" },
            ]}
            onToggle={(id) =>
              updateField(
                "triggers",
                (Array.isArray(formData.triggers) ? formData.triggers : []).includes(id)
                  ? formData.triggers.filter((x: string) => x !== id)
                  : [...(formData.triggers ?? []), id]
              )
            }
          />
        </div>

        
        {DeadlinePicker}
        {MinutesPicker}
      </>
    );
  }

  /* ─────────────── ALCOHOL ─────────────── */
  if (subCategoryId === "alcohol") {
    return (
      <>
      <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Crear portafolio web"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Copas/semana (actual)</Label>
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            max={60}
            value={formData.drinksPerWeek ?? ""}
            onChange={(e) => updateField("drinksPerWeek", toIntOrEmpty(e.target.value, 0))}
            placeholder="Ej: 6"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Regla</Label>
          <ButtonGroup
            value={formData.alcoholRule}
            options={[
              { id: "L-V", label: "Sólo L–V" },
              { id: "S-D", label: "Sólo S–D" },
              { id: "reducir", label: "Reducir a X/sem" },
            ]}
            onChange={(v) => updateField("alcoholRule", v)}
          />
        </div>

        {formData.alcoholRule === "reducir" && (
          <div>
            <Label className="text-sm font-medium">Límite objetivo / semana</Label>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={60}
              value={formData.targetDrinksPerWeek ?? ""}
              onChange={(e) =>
                updateField("targetDrinksPerWeek", toIntOrEmpty(e.target.value, 4))
              }
              placeholder="Ej: 4"
              className="mt-2"
            />
          </div>
        )}

        
        {DeadlinePicker}
        {MinutesPicker}
      </>
    );
  }

  /* ─────────────── AZÚCAR ─────────────── */
  if (subCategoryId === "azucar") {
    return (
      <>
      <div>
                <Label>Título del objetivo</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ej: Crear portafolio web"
                  className="mt-2"
                />
              </div>
        <div>
          <Label className="text-sm font-medium">Foco principal</Label>
          <ButtonGroup
            value={formData.sugarFocus}
            options={[
              { id: "bebidas", label: "Bebidas" },
              { id: "snacks", label: "Snacks" },
              { id: "ambos", label: "Ambos" },
            ]}
            onChange={(v) => updateField("sugarFocus", v)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Consumos dulces/semana</Label>
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            max={50}
            value={formData.sweetPerWeek ?? ""}
            onChange={(e) => updateField("sweetPerWeek", toIntOrEmpty(e.target.value, 0))}
            placeholder="Ej: 6"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Regla (1 línea)</Label>
          <Input
            value={formData.sugarRule ?? ""}
            onChange={(e) => updateField("sugarRule", e.target.value)}
            placeholder="Ej: Sin refrescos L–V"
            className="mt-2"
          />
        </div>

        
        {DeadlinePicker}
        {MinutesPicker}
      </>
    );
  }

  /* ─────────────── REDES SOCIALES ─────────────── */
  if (subCategoryId === "redes_sociales") {
    return (
      <>
      <div>
                <Label>Título del objetivo</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ej: Crear portafolio web"
                  className="mt-2"
                />
              </div>
        <div>
          <Label className="text-sm font-medium">Límite diario (min)</Label>
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={5}
            max={180}
            value={formData.dailyLimitMin ?? ""}
            onChange={(e) =>
              updateField("dailyLimitMin", toIntOrEmpty(e.target.value, 30))
            }
            placeholder="Ej: 30"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Ventana sin redes</Label>
          <ButtonGroup
            value={formData.blockWindow}
            options={[
              { id: "mañana", label: "Mañana" },
              { id: "tarde", label: "Tarde" },
              { id: "noche", label: "Noche" },
              { id: "ninguna", label: "Ninguna" },
            ]}
            onChange={(v) => updateField("blockWindow", v)}
          />
        </div>

        
        {DeadlinePicker}
        {MinutesPicker}
      </>
    );
  }

  /* ─────────────── OTRO HÁBITO ─────────────── */
  if (subCategoryId === "otro_habito") {
    return (
      <>
      <div>
                <Label>Título del objetivo</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ej: Crear portafolio web"
                  className="mt-2"
                />
              </div>
        <div>
          <Label className="text-sm font-medium">Hábito a reducir</Label>
          <Input
            value={formData.title ?? ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Ej: Snacks nocturnos"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Label className="text-sm font-medium">Métrica</Label>
            <Input
              value={formData.metricName ?? ""}
              onChange={(e) => updateField("metricName", e.target.value)}
              placeholder="Ej: unidades/día"
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Objetivo diario</Label>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              value={formData.dailyTarget ?? ""}
              onChange={(e) =>
                updateField("dailyTarget", toIntOrEmpty(e.target.value, 1))
              }
              placeholder="Ej: 1"
              className="mt-2"
            />
          </div>
        </div>

        
        {DeadlinePicker}
        {MinutesPicker}
      </>
    );
  }

  return null;
};

export default ReducirHabitosForm;
