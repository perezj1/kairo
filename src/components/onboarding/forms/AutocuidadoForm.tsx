import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AutocuidadoSubId = 'sueno_energia' | 'hobbies' | 'naturaleza' | 'microplaceres';

interface AutocuidadoFormProps {
  subCategoryId: AutocuidadoSubId;
  formData: Record<string, any>;
  onUpdate: (data: any) => void;
}

const mergeUpdate =
  (formData: any, onUpdate: (d: any) => void) =>
  (field: string, value: any) =>
    onUpdate({ ...formData, [field]: value });

/** Grid compacto reutilizable */
const ButtonsGrid = ({
  options,
  current,
  onSelect,
  cols = 3,
  itemClass = 'h-10 text-sm',
  multi = false,
}: {
  options: { id: string; label: string; value: any }[];
  current: any;
  onSelect: (v: any) => void;
  cols?: 2 | 3 | 4 | 5;
  itemClass?: string;
  multi?: boolean;
}) => {
  const grid =
    cols === 5 ? 'grid-cols-5' :
    cols === 4 ? 'grid-cols-4' :
    cols === 2 ? 'grid-cols-2' : 'grid-cols-3';

  const isActive = (val: any) =>
    multi ? Array.isArray(current) && current.includes(val) : current === val;

  return (
    <div className={`grid ${grid} gap-2 mt-2`}>
      {options.map((o) => (
        <Button
          key={o.id}
          type="button"
          variant={isActive(o.value) ? 'default' : 'outline'}
          onClick={() => onSelect(o.value)}
          className={itemClass}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
};

export const AutocuidadoForm = ({ subCategoryId, formData, onUpdate }: AutocuidadoFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // --- Sueño / energía ---
  if (subCategoryId === 'sueno_energia') {
    return (
      <>
        
          <div>
            <Label>Objetivo horas de sueño</Label>
            <ButtonsGrid
              options={[7, 7.5, 8, 8.5].map((h) => ({ id: String(h), label: String(h), value: h }))}
              current={formData.sleepTarget}
              onSelect={(v) => updateField('sleepTarget', v)}
              cols={4}
            />
          </div>        

        <div>
          <Label>Higiene del sueño</Label>
          <ButtonsGrid
            options={[
              { id: 'no_screens',   label: 'Sin pantallas 1h antes', value: 'no_screens' },
              { id: 'no_coffee_pm', label: 'Sin café después de 15h', value: 'no_coffee_pm' },
              { id: 'dim_lights',   label: 'Luz tenue por la noche', value: 'dim_lights' },
              { id: 'night_routine',label: 'Rutina de noche',        value: 'night_routine' },
            ]}
            current={formData.sleepHygiene || []}
            onSelect={(v) => {
              const curr: string[] = formData.sleepHygiene || [];
              const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
              updateField('sleepHygiene', next);
            }}
            cols={2}
            itemClass="h-10 text-sm"
            multi
          />
        </div>
      </>
    );
  }

  // --- Hobbies / creatividad ---
  if (subCategoryId === 'hobbies') {
    return (
      <>
        <div>
          <Label>Hobby principal</Label>
          <Input
            value={formData.hobbyName || ''}
            onChange={(e) => updateField('hobbyName', e.target.value)}
            placeholder="Ej: Dibujo, guitarra, escritura…"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Sesiones por semana</Label>
            <ButtonsGrid
              options={[2, 3, 4].map((n) => ({ id: String(n), label: String(n), value: n }))}
              current={formData.sessionsPerWeek}
              onSelect={(v) => updateField('sessionsPerWeek', v)}
            />
          </div>
          <div>
            <Label>Minutos por sesión</Label>
            <ButtonsGrid
              options={[15, 20, 30, 45].map((m) => ({ id: String(m), label: String(m), value: m }))}
              current={formData.sessionMinutes}
              onSelect={(v) => updateField('sessionMinutes', v)}
              cols={4}
            />
          </div>
        </div>
      </>
    );
  }

  // --- Naturaleza / movimiento suave ---
  if (subCategoryId === 'naturaleza') {
    return (
      <>
        <div>
          <Label>Actividades preferidas</Label>
          <ButtonsGrid
            options={[
              { id: 'Caminar',  label: 'Caminar',  value: 'Caminar' },
              { id: 'Estirar',  label: 'Estirar',  value: 'Estirar' },
              { id: 'Yoga',     label: 'Yoga',     value: 'Yoga' },
              { id: 'Respirar', label: 'Respirar al aire libre', value: 'Respirar al aire libre' },
            ]}
            current={formData.softActivities || []}
            onSelect={(v) => {
              const curr: string[] = formData.softActivities || [];
              const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
              updateField('softActivities', next);
            }}
            cols={2}
            itemClass="h-10 text-sm"
            multi
          />
        </div>

        <div>
          <Label>Días por semana</Label>
          <ButtonsGrid
            options={[2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n), value: n }))}
            current={formData.daysPerWeek}
            onSelect={(v) => updateField('daysPerWeek', v)}
            cols={4}
          />
        </div>
      </>
    );
  }

  // --- Micro-placeres ---
  if (subCategoryId === 'microplaceres') {
    return (
      <>
        <div>
          <Label>Frecuencia diaria</Label>
          <ButtonsGrid
            options={[1, 2, 3].map((n) => ({ id: String(n), label: `${n}/día`, value: n }))}
            current={formData.pleasuresPerDay}
            onSelect={(v) => updateField('pleasuresPerDay', v)}
          />
        </div>

        <div>
          <Label>Ideas de micro-placeres</Label>
          <ButtonsGrid
            options={[
              { id: 'leer',   label: 'Leer 10 min',        value: 'Leer 10 min' },
              { id: 'te',     label: 'Té caliente',        value: 'Té caliente' },
              { id: 'musica', label: 'Música favorita',    value: 'Música favorita' },
              { id: 'paseo',  label: 'Paseo corto',        value: 'Paseo corto' },
              { id: 'journal',label: 'Journaling x3 líneas', value: 'Journaling x3 líneas' },
            ]}
            current={formData.pleasureIdeas || []}
            onSelect={(v) => {
              const curr: string[] = formData.pleasureIdeas || [];
              const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
              updateField('pleasureIdeas', next);
            }}
            cols={2}
            itemClass="h-10 text-sm"
            multi
          />
        </div>
      </>
    );
  }

  return null;
};

export default AutocuidadoForm;
