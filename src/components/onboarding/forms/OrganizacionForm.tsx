import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrganizacionFormProps {
  subCategoryId: string;
  formData: any;
  onUpdate: (data: any) => void;
}

export const OrganizacionForm = ({ subCategoryId, formData, onUpdate }: OrganizacionFormProps) => {
  const updateField = (field: string, value: any) => onUpdate({ ...formData, [field]: value });

  // --- Plan diario y foco ---y
  if (subCategoryId === 'plan_diario') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Plan diario con TOP 3"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Número de prioridades (TOP)</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1, 2, 3].map((n) => (
                <Button
                  type="button"
                  key={n}
                  // CORRECCIÓN: parentetizar el '??' y comparar con === n
                  variant={(formData.dailyTop ?? 3) === n ? 'default' : 'outline'}
                  onClick={() => updateField('dailyTop', n)}
                  className="h-10"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Bloques de enfoque (min)</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[10, 15, 25].map((m) => (
                <Button
                  type="button"
                  key={m}
                  variant={formData.focusBlock === m ? 'default' : 'outline'}
                  onClick={() => updateField('focusBlock', m)}
                  className="h-10"
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label>Hora preferida de plan</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[
              { id: 'manana', label: 'Mañana', value: 'morning' },
              { id: 'mediodia', label: 'Mediodía', value: 'noon' },
              { id: 'tarde', label: 'Tarde', value: 'afternoon' },
              { id: 'noche', label: 'Noche', value: 'night' },
            ].map((opt) => (
              <Button
                type="button"
                key={opt.id}
                variant={formData.planTime === opt.value ? 'default' : 'outline'}
                onClick={() => updateField('planTime', opt.value)}
                className="h-10 text-sm"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // --- Revisión semanal ---
  if (subCategoryId === 'revision_semanal') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Revisión semanal GTD"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Día de revisión</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
              <Button
                type="button"
                key={d}
                variant={formData.reviewDay === i ? 'default' : 'outline'}
                onClick={() => updateField('reviewDay', i)}
                className="h-10"
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Áreas a revisar</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Trabajo', 'Estudios', 'Casa', 'Finanzas', 'Salud', 'Proyectos'].map((area) => {
              const active = (formData.reviewAreas || []).includes(area);
              return (
                <Button
                  type="button"
                  key={area}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.reviewAreas || [];
                    const next = active ? curr.filter((a: string) => a !== area) : [...curr, area];
                    updateField('reviewAreas', next);
                  }}
                  className="h-10 text-sm"
                >
                  {area}
                </Button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // --- Declutter hogar ---
  if (subCategoryId === 'declutter_hogar') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Declutter del hogar por zonas"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Zonas principales</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Cocina', 'Salón', 'Dormitorio', 'Baño', 'Escritorio'].map((zone) => {
              const active = (formData.zones || []).includes(zone);
              return (
                <Button
                  type="button"
                  key={zone}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.zones || [];
                    const next = active ? curr.filter((z: string) => z !== zone) : [...curr, zone];
                    updateField('zones', next);
                  }}
                  className="h-10 text-sm"
                >
                  {zone}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Ítems por sesión</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[5, 10, 15, 20].map((n) => (
              <Button
                type="button"
                key={n}
                variant={formData.itemsPerSession === n ? 'default' : 'outline'}
                onClick={() => updateField('itemsPerSession', n)}
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

  // --- Inbox-zero ---
  if (subCategoryId === 'inbox_zero') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Inbox-zero en email"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Cuentas principales</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Gmail', 'Outlook', 'Trabajo', 'Personal'].map((acc) => {
              const active = (formData.accounts || []).includes(acc);
              return (
                <Button
                  type="button"
                  key={acc}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr = formData.accounts || [];
                    const next = active ? curr.filter((a: string) => a !== acc) : [...curr, acc];
                    updateField('accounts', next);
                  }}
                  className="h-10 text-sm"
                >
                  {acc}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Tiempo diario de email</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[10, 15, 25].map((m) => (
              <Button
                type="button"
                key={m}
                variant={formData.emailMinutes === m ? 'default' : 'outline'}
                onClick={() => updateField('emailMinutes', m)}
                className="h-10"
              >
                {m} min
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default OrganizacionForm;
