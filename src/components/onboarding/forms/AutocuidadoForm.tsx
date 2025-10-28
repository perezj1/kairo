import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AutocuidadoFormProps {
  subCategoryId: string;
  formData: any;
  onUpdate: (data: any) => void;
}

export const AutocuidadoForm = ({ subCategoryId, formData, onUpdate }: AutocuidadoFormProps) => {
  const updateField = (field: string, value: any) => onUpdate({ ...formData, [field]: value });

  // --- Sueño / energía ---
  if (subCategoryId === 'sueno_energia') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Dormir 8 horas"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Objetivo horas de sueño</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[7, 7.5, 8, 8.5].map((h) => (
                <Button
                  key={h}
                  variant={formData.sleepTarget === h ? 'default' : 'outline'}
                  onClick={() => updateField('sleepTarget', h)}
                  className="h-10"
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Hora de despertar</Label>
            <Input
              type="time"
              value={formData.wakeTime ?? ''}
              onChange={(e) => updateField('wakeTime', e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label>Higiene del sueño</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: 'pantallas', label: 'Sin pantallas 1h antes', value: 'no_screens' },
              { id: 'cafe', label: 'Sin café después de las 15h', value: 'no_coffee_pm' },
              { id: 'luz', label: 'Luz tenue por la noche', value: 'dim_lights' },
              { id: 'rutina', label: 'Rutina de noche', value: 'night_routine' },
            ].map((opt) => {
              const active = (formData.sleepHygiene || []).includes(opt.value);
              return (
                <Button
                  key={opt.id}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.sleepHygiene || [];
                    const next = active ? curr.filter((v: string) => v !== opt.value) : [...curr, opt.value];
                    updateField('sleepHygiene', next);
                  }}
                  className="h-10 text-sm"
                >
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // --- Hobbies / creatividad ---
  if (subCategoryId === 'hobbies_creatividad') {
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
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[2, 3, 4].map((n) => (
                <Button
                  key={n}
                  variant={formData.sessionsPerWeek === n ? 'default' : 'outline'}
                  onClick={() => updateField('sessionsPerWeek', n)}
                  className="h-10"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Minutos por sesión</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[15, 20, 30, 45].map((m) => (
                <Button
                  key={m}
                  variant={formData.sessionMinutes === m ? 'default' : 'outline'}
                  onClick={() => updateField('sessionMinutes', m)}
                  className="h-10"
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Naturaleza / movimiento suave ---
  if (subCategoryId === 'naturaleza_mov_suave') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: 20 min de paseo diario"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Actividades preferidas</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Caminar', 'Estirar', 'Yoga', 'Respirar al aire libre'].map((a) => {
              const active = (formData.softActivities || []).includes(a);
              return (
                <Button
                  key={a}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.softActivities || [];
                    const next = active ? curr.filter((x: string) => x !== a) : [...curr, a];
                    updateField('softActivities', next);
                  }}
                  className="h-10 text-sm"
                >
                  {a}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Días por semana</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                variant={formData.daysPerWeek === n ? 'default' : 'outline'}
                onClick={() => updateField('daysPerWeek', n)}
                className="h-10"
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // --- Micro-placeres ---
  if (subCategoryId === 'micro_placeres') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: 2 micro-placeres al día"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Frecuencia diaria</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3].map((n) => (
              <Button
                key={n}
                variant={formData.pleasuresPerDay === n ? 'default' : 'outline'}
                onClick={() => updateField('pleasuresPerDay', n)}
                className="h-10"
              >
                {n}/día
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Ideas de micro-placeres</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Leer 10 min', 'Té caliente', 'Música favorita', 'Paseo corto', 'Journaling x3 líneas'].map((idea) => {
              const active = (formData.pleasureIdeas || []).includes(idea);
              return (
                <Button
                  key={idea}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.pleasureIdeas || [];
                    const next = active ? curr.filter((i: string) => i !== idea) : [...curr, idea];
                    updateField('pleasureIdeas', next);
                  }}
                  className="h-10 text-sm"
                >
                  {idea}
                </Button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default AutocuidadoForm;
