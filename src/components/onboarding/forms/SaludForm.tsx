import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FREQUENCY_OPTIONS } from '@/lib/categories';

export type SaludSubId =
  | 'bajar_peso'
  | 'ganar_musculo'
  | 'cardio'
  | 'movilidad'
  | 'mantener_activo';

interface SaludFormProps {
  subCategoryId: SaludSubId;
  formData: Record<string, any>;
  onUpdate: (data: any) => void;
}

/** util para merge */
const mergeUpdate =
  (formData: any, onUpdate: (d: any) => void) =>
  (field: string, value: any) =>
    onUpdate({ ...formData, [field]: value });

/** grid compacto de botones */
const ButtonsGrid = ({
  options,
  current,
  onSelect,
  cols = 3,
  itemClass = 'h-10 text-sm',
}: {
  options: { id: string; label: string; value: any }[];
  current: any;
  onSelect: (v: any) => void;
  cols?: 2 | 3 | 4;
  itemClass?: string;
}) => {
  const grid = cols === 4 ? 'grid-cols-4' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid ${grid} gap-2 mt-2`}>
      {options.map((o) => (
        <Button
          key={o.id}
          variant={current === o.value ? 'default' : 'outline'}
          onClick={() => onSelect(o.value)}
          className={itemClass}
          type="button"
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
};

export const SaludForm = ({ subCategoryId, formData, onUpdate }: SaludFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- BAJAR PESO (mínimo) ----------
  if (subCategoryId === 'bajar_peso') {
    return (
      <>
        <div>
          <Label>Nivel actual</Label>
          <ButtonsGrid
            options={[
              { id: '1', label: 'Principiante', value: 1 },
              { id: '2', label: 'Intermedio', value: 2 },
              { id: '3', label: 'Avanzado', value: 3 },
            ]}
            current={formData.currentLevel}
            onSelect={(v) => updateField('currentLevel', v)}
            cols={3}
          />
        </div>

        <div>
          <Label>Frecuencia semanal</Label>
          <ButtonsGrid
            options={FREQUENCY_OPTIONS.slice(0, 5).map((o) => ({
              id: o.id,
              label: o.label.split('/')[0],
              value: o.value,
            }))}
            current={formData.frequency}
            onSelect={(v) => updateField('frequency', v)}
          />
        </div>
      </>
    );
  }

  // ---------- GANAR MÚSCULO (mínimo) ----------
  if (subCategoryId === 'ganar_musculo') {
    return (
      <>
        <div>
          <Label>Zonas prioritarias (opcional)</Label>
          <Input
            value={formData.targetZones || ''}
            onChange={(e) => updateField('targetZones', e.target.value)}
            placeholder="Ej: Piernas, espalda, core"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Experiencia</Label>
          <ButtonsGrid
            options={[
              { id: 'baja', label: 'Baja', value: 'baja' },
              { id: 'media', label: 'Media', value: 'media' },
              { id: 'alta', label: 'Alta', value: 'alta' },
            ]}
            current={formData.experience}
            onSelect={(v) => updateField('experience', v)}
          />
        </div>

        <div>
          <Label>Frecuencia semanal</Label>
          <ButtonsGrid
            options={FREQUENCY_OPTIONS.slice(0, 5).map((o) => ({
              id: o.id,
              label: o.label.split('/')[0],
              value: o.value,
            }))}
            current={formData.frequency}
            onSelect={(v) => updateField('frequency', v)}
          />
        </div>
      </>
    );
  }

  // ---------- CARDIO / RESISTENCIA (mínimo) ----------
  if (subCategoryId === 'cardio') {
    return (
      <>
        <div>
          <Label>Modalidad preferida</Label>
          <ButtonsGrid
            options={[
              { id: 'caminar', label: 'Caminar', value: 'caminar' },
              { id: 'correr', label: 'Correr', value: 'correr' },
              { id: 'bici', label: 'Bicicleta', value: 'bici' },
              { id: 'hiit', label: 'HIIT', value: 'hiit' },
            ]}
            current={formData.modality}
            onSelect={(v) => updateField('modality', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Frecuencia semanal</Label>
          <ButtonsGrid
            options={FREQUENCY_OPTIONS.slice(0, 5).map((o) => ({
              id: o.id,
              label: o.label.split('/')[0],
              value: o.value,
            }))}
            current={formData.frequency}
            onSelect={(v) => updateField('frequency', v)}
          />
        </div>
      </>
    );
  }

  // ---------- MOVILIDAD (mínimo) ----------
  if (subCategoryId === 'movilidad') {
    return (
      <>
        <div>
          <Label>Zona principal</Label>
          <Input
            value={formData.targetZone || ''}
            onChange={(e) => updateField('targetZone', e.target.value)}
            placeholder="Ej: Espalda baja, cuello, cadera"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Nivel de rigidez</Label>
          <ButtonsGrid
            options={[
              { id: 'baja', label: 'Baja', value: 'baja' },
              { id: 'media', label: 'Media', value: 'media' },
              { id: 'alta', label: 'Alta', value: 'alta' },
            ]}
            current={formData.stiffness}
            onSelect={(v) => updateField('stiffness', v)}
          />
        </div>
      </>
    );
  }

  // ---------- MANTENER ACTIVO (mínimo) ----------
  if (subCategoryId === 'mantener_activo') {
    return (
      <>
        <div>
          <Label>Objetivo de pasos</Label>
          <ButtonsGrid
            options={[
              { id: '5000', label: '5.000', value: 5000 },
              { id: '7500', label: '7.500', value: 7500 },
              { id: '10000', label: '10.000', value: 10000 },
            ]}
            current={formData.stepsGoal}
            onSelect={(v) => updateField('stepsGoal', v)}
            cols={3}
          />
        </div>

        <div>
          <Label>Días activos por semana</Label>
          <ButtonsGrid
            options={[3, 4, 5, 6, 7].map((d) => ({
              id: String(d),
              label: `${d} días`,
              value: d,
            }))}
            current={formData.activeDays}
            onSelect={(v) => updateField('activeDays', v)}
            cols={4}
          />
        </div>
      </>
    );
  }

  return null;
};
