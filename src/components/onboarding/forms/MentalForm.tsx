import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 👉 Exporta el union para poder castear desde GoalDetailsForm si quieres
export type MentalSubId =
  | 'reducir_estres'
  | 'dormir_mejor'
  | 'mindfulness'
  | 'menos_pantalla';

interface MentalFormProps {
  subCategoryId: MentalSubId;
  formData: Record<string, any>;
  onUpdate: (data: any) => void;
}

const mergeUpdate =
  (formData: any, onUpdate: (d: any) => void) =>
  (field: string, value: any) =>
    onUpdate({ ...formData, [field]: value });

/** Grid compacto de botones */
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
  cols?: 2 | 3 | 4 | 5;
  itemClass?: string;
}) => {
  const grid =
    cols === 5 ? 'grid-cols-5' :
    cols === 4 ? 'grid-cols-4' :
    cols === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`grid ${grid} gap-2 mt-2`}>
      {options.map((o) => (
        <Button
          key={o.id}
          type="button"
          variant={Array.isArray(current) ? current.includes(o.value) ? 'default' : 'outline'
                                            : current === o.value ? 'default' : 'outline'}
          onClick={() => onSelect(o.value)}
          className={itemClass}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
};

export const MentalForm = ({ subCategoryId, formData, onUpdate }: MentalFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- REDUCIR ESTRÉS ----------
  if (subCategoryId === 'reducir_estres') {
    return (
      <>
        <div>
          <Label>Nivel actual de estrés</Label>
          <ButtonsGrid
            options={[
              { id: 'bajo', label: 'Bajo', value: 'bajo' },
              { id: 'moderado', label: 'Moderado', value: 'moderado' },
              { id: 'alto', label: 'Alto', value: 'alto' },
            ]}
            current={formData.stressLevel}
            onSelect={(v) => updateField('stressLevel', v)}
          />
        </div>

        <div>
          <Label>Disparadores principales</Label>
          <Input
            value={formData.triggers || ''}
            onChange={(e) => updateField('triggers', e.target.value)}
            placeholder="Ej: Trabajo, tráfico, familia"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Técnicas preferidas</Label>
          <ButtonsGrid
            options={[
              { id: 'respiracion', label: 'Respiración', value: 'respiracion' },
              { id: 'pausas', label: 'Pausas activas', value: 'pausas' },
              { id: 'caminatas', label: 'Caminatas', value: 'caminatas' },
              { id: 'meditacion', label: 'Meditación', value: 'meditacion' },
            ]}
            current={formData.technique}
            onSelect={(v) => updateField('technique', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Horarios críticos</Label>
          <Input
            value={formData.criticalTimes || ''}
            onChange={(e) => updateField('criticalTimes', e.target.value)}
            placeholder="Ej: 9-11am, 3-5pm"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // ---------- DORMIR MEJOR ----------
  if (subCategoryId === 'dormir_mejor') {
    return (
      <>
        <div>
          <Label>Hora deseada de dormir</Label>
          <Input
            type="time"
            value={formData.bedtime || '22:30'}
            onChange={(e) => updateField('bedtime', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Hora deseada de despertar</Label>
          <Input
            type="time"
            value={formData.wakeTime || '06:30'}
            onChange={(e) => updateField('wakeTime', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Horas objetivo de sueño</Label>
          <ButtonsGrid
            options={[6, 7, 8, 9].map((h) => ({
              id: String(h),
              label: `${h}h`,
              value: h,
            }))}
            current={formData.sleepHours}
            onSelect={(v) => updateField('sleepHours', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>Problema principal</Label>
          <ButtonsGrid
            options={[
              { id: 'conciliar', label: 'Conciliar sueño', value: 'conciliar' },
              { id: 'despertar', label: 'Despertares', value: 'despertar' },
              { id: 'temprano', label: 'Despertar temprano', value: 'temprano' },
              { id: 'calidad', label: 'Calidad', value: 'calidad' },
            ]}
            current={formData.sleepProblem}
            onSelect={(v) => updateField('sleepProblem', v)}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Duración ritual nocturno (minutos)</Label>
          <ButtonsGrid
            options={[10, 15, 20, 30].map((m) => ({
              id: String(m),
              label: `${m}m`,
              value: m,
            }))}
            current={formData.ritualDuration}
            onSelect={(v) => updateField('ritualDuration', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>¿Cafeína en la tarde?</Label>
          <ButtonsGrid
            options={[
              { id: 'si', label: 'Sí', value: true },
              { id: 'no', label: 'No', value: false },
            ]}
            current={formData.afternoonCaffeine}
            onSelect={(v) => updateField('afternoonCaffeine', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  // ---------- MINDFULNESS / JOURNALING ----------
  if (subCategoryId === 'mindfulness') {
    return (
      <>
        <div>
          <Label>Práctica preferida</Label>
          <ButtonsGrid
            options={[
              { id: 'meditacion', label: 'Meditación', value: 'meditacion' },
              { id: 'respiracion', label: 'Respiración', value: 'respiracion' },
              { id: 'diario', label: 'Diario/Journaling', value: 'diario' },
              { id: 'gratitud', label: 'Gratitud', value: 'gratitud' },
            ]}
            current={formData.practice}
            onSelect={(v) => updateField('practice', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Frecuencia objetivo</Label>
          <ButtonsGrid
            options={[
              { id: 'diaria', label: 'Diaria', value: 7 },
              { id: '5x', label: '5x semana', value: 5 },
              { id: '3x', label: '3x semana', value: 3 },
            ]}
            current={formData.frequency}
            onSelect={(v) => updateField('frequency', v)}
          />
        </div>

        <div>
          <Label>Temas de enfoque</Label>
          <ButtonsGrid
            options={[
              { id: 'gratitud', label: 'Gratitud', value: 'gratitud' },
              { id: 'claridad', label: 'Claridad mental', value: 'claridad' },
              { id: 'autodialogo', label: 'Autodiálogo', value: 'autodialogo' },
              { id: 'emociones', label: 'Emociones', value: 'emociones' },
            ]}
            current={formData.focusTopic}
            onSelect={(v) => updateField('focusTopic', v)}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>
      </>
    );
  }

  // ---------- MENOS PANTALLA ----------
  if (subCategoryId === 'menos_pantalla') {
    return (
      <>
        <div>
          <Label>Apps objetivo a reducir</Label>
          <Input
            value={formData.targetApps || ''}
            onChange={(e) => updateField('targetApps', e.target.value)}
            placeholder="Ej: Instagram, TikTok, YouTube"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Límite diario (horas)</Label>
          <ButtonsGrid
            options={[0.5, 1, 1.5, 2, 3].map((h) => ({
              id: String(h),
              label: `${h}h`,
              value: h,
            }))}
            current={formData.dailyLimit}
            onSelect={(v) => updateField('dailyLimit', v)}
            cols={5}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Franjas de veto</Label>
          <ButtonsGrid
            options={[
              { id: 'manana', label: 'Primera hora', value: 'manana' },
              { id: 'comidas', label: 'Durante comidas', value: 'comidas' },
              { id: 'noche', label: '1h antes dormir', value: 'noche' },
              { id: 'trabajo', label: 'En trabajo', value: 'trabajo' },
            ]}
            current={formData.vetoSlots || []} // multi-select
            onSelect={(v) => {
              const current: string[] = formData.vetoSlots || [];
              const updated = current.includes(v) ? current.filter((s) => s !== v) : [...current, v];
              updateField('vetoSlots', updated);
            }}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Alternativas rápidas</Label>
          <Input
            value={formData.alternatives || ''}
            onChange={(e) => updateField('alternatives', e.target.value)}
            placeholder="Ej: Leer, caminar, estirar"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  return null;
};
