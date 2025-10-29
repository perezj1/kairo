import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 👉 Exporta para castear en GoalDetailsForm si quieres tipado estricto
export type RelacionesSubId = 'pareja' | 'amistades' | 'familia' | 'conocer_gente';

interface RelacionesFormProps {
  subCategoryId: RelacionesSubId;
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
  multi = false,
}: {
  options: { id: string; label: string; value: any }[];
  current: any;
  onSelect: (v: any) => void;
  cols?: 2 | 3 | 4;
  itemClass?: string;
  multi?: boolean;
}) => {
  const grid = cols === 4 ? 'grid-cols-4' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3';
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

export const RelacionesForm = ({ subCategoryId, formData, onUpdate }: RelacionesFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- PAREJA ----------
  if (subCategoryId === 'pareja') {
    return (
      <>
        <div>
          <Label>Lenguaje del amor principal</Label>
          <ButtonsGrid
            options={[
              { id: 'palabras', label: 'Palabras de afirmación', value: 'palabras' },
              { id: 'tiempo', label: 'Tiempo de calidad', value: 'tiempo' },
              { id: 'regalos', label: 'Regalos', value: 'regalos' },
              { id: 'servicio', label: 'Actos de servicio', value: 'servicio' },
              { id: 'contacto', label: 'Contacto físico', value: 'contacto' },
            ]}
            current={formData.loveLanguage}
            onSelect={(v) => updateField('loveLanguage', v)}
            cols={2}
            itemClass="h-auto py-2 text-xs"
          />
        </div>

        <div>
          <Label>Ritual semanal</Label>
          <Input
            value={formData.weeklyRitual || ''}
            onChange={(e) => updateField('weeklyRitual', e.target.value)}
            placeholder="Ej: Cena romántica, paseo"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Temas a mejorar</Label>
          <Input
            value={formData.improvementAreas || ''}
            onChange={(e) => updateField('improvementAreas', e.target.value)}
            placeholder="Ej: Comunicación, tiempo juntos"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // ---------- AMISTADES ----------
  if (subCategoryId === 'amistades') {
    return (
      <>
        <div>
          <Label>Personas prioritarias (nombres o número)</Label>
          <Input
            value={formData.priorityPeople || ''}
            onChange={(e) => updateField('priorityPeople', e.target.value)}
            placeholder="Ej: María, Juan, Pedro (3 personas)"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Frecuencia de contacto</Label>
          <ButtonsGrid
            options={[
              { id: 'diario', label: 'Mensaje diario', value: 'diario' },
              { id: 'semanal', label: 'Semanal', value: 'semanal' },
              { id: 'quincenal', label: 'Quincenal', value: 'quincenal' },
              { id: 'mensual', label: 'Mensual', value: 'mensual' },
            ]}
            current={formData.contactFrequency}
            onSelect={(v) => updateField('contactFrequency', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Tipo de actividad preferida</Label>
          <Input
            value={formData.activityType || ''}
            onChange={(e) => updateField('activityType', e.target.value)}
            placeholder="Ej: Café, deportes, cine"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Presupuesto mensual (CHF)</Label>
          <Input
            type="number"
            value={formData.monthlyBudget ?? ''}
            onChange={(e) => updateField('monthlyBudget', Number(e.target.value) || 0)}
            placeholder="100"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // ---------- FAMILIA ----------
  if (subCategoryId === 'familia') {
    return (
      <>
        <div>
          <Label>Miembros foco</Label>
          <Input
            value={formData.focusMembers || ''}
            onChange={(e) => updateField('focusMembers', e.target.value)}
            placeholder="Ej: Padres, hijos, abuelos"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Rituales familiares</Label>
          <ButtonsGrid
            options={[
              { id: 'comida', label: 'Comida juntos', value: 'comida' },
              { id: 'paseo', label: 'Paseo/excursión', value: 'paseo' },
              { id: 'juego', label: 'Juegos de mesa', value: 'juego' },
              { id: 'pelicula', label: 'Película', value: 'pelicula' },
            ]}
            current={formData.ritual}
            onSelect={(v) => updateField('ritual', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Duración por sesión (minutos)</Label>
          <ButtonsGrid
            options={[30, 60, 90, 120].map((m) => ({
              id: String(m),
              label: `${m}m`,
              value: m,
            }))}
            current={formData.sessionDuration}
            onSelect={(v) => updateField('sessionDuration', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>Días preferidos</Label>
          <ButtonsGrid
            options={[
              { id: 'entre_semana', label: 'Entre semana', value: 'entre_semana' },
              { id: 'fin_semana', label: 'Fin de semana', value: 'fin_semana' },
            ]}
            current={formData.preferredDays}
            onSelect={(v) => updateField('preferredDays', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  // ---------- CONOCER GENTE ----------
  if (subCategoryId === 'conocer_gente') {
    return (
      <>
        <div>
          <Label>Intereses principales</Label>
          <Input
            value={formData.interests || ''}
            onChange={(e) => updateField('interests', e.target.value)}
            placeholder="Ej: Deportes, arte, tecnología"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Formato preferido</Label>
          <ButtonsGrid
            options={[
              { id: 'clase', label: 'Clase/taller', value: 'clase' },
              { id: 'evento', label: 'Eventos', value: 'evento' },
              { id: 'deporte', label: 'Deporte', value: 'deporte' },
              { id: 'voluntariado', label: 'Voluntariado', value: 'voluntariado' },
            ]}
            current={formData.format}
            onSelect={(v) => updateField('format', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Frecuencia semanal</Label>
          <ButtonsGrid
            options={[1, 2, 3].map((t) => ({
              id: String(t),
              label: `${t}x/sem`,
              value: t,
            }))}
            current={formData.weeklyFrequency}
            onSelect={(v) => updateField('weeklyFrequency', v)}
          />
        </div>

        <div>
          <Label>Nivel de introversión</Label>
          <ButtonsGrid
            options={[
              { id: 'extrovertido', label: 'Extrovertido', value: 'extrovertido' },
              { id: 'ambivertido', label: 'Ambivertido', value: 'ambivertido' },
              { id: 'introvertido', label: 'Introvertido', value: 'introvertido' },
            ]}
            current={formData.socialLevel}
            onSelect={(v) => updateField('socialLevel', v)}
            cols={3}
            itemClass="h-10 text-xs"
          />
        </div>
      </>
    );
  }

  return null;
};
