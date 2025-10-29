import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** ✅ Tipo de subcategorías para Organización (coincide con CATEGORIES) */
export type OrganizacionSubId = 'plan_diario' | 'revision_semanal' | 'declutter' | 'inbox_zero';

interface OrganizacionFormProps {
  subCategoryId: OrganizacionSubId;
  formData: any;
  onUpdate: (data: any) => void;
}

export const OrganizacionForm = ({ subCategoryId, formData, onUpdate }: OrganizacionFormProps) => {
  const updateField = (field: string, value: any) => onUpdate({ ...formData, [field]: value });

  // --- Plan diario y foco ---
  if (subCategoryId === 'plan_diario') {
    return (
      <>
        
         </>
    );
  }

  // --- Revisión semanal ---
  if (subCategoryId === 'revision_semanal') {
    return (
      <>
        <div>
          <Label>Día de revisión</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => {
              const active = formData.reviewDay === i;
              return (
                <Button
                  type="button"
                  key={d}
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => updateField('reviewDay', i)}
                  className="h-10"
                >
                  {d}
                </Button>
              );
            })}
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
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr: string[] = formData.reviewAreas || [];
                    const next = active ? curr.filter((a) => a !== area) : [...curr, area];
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

  // --- Declutter (hogar) ---
  if (subCategoryId === 'declutter') {
    return (
      <>
        <div>
          <Label>Zonas principales</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Cocina', 'Salón', 'Dormitorio', 'Baño', 'Escritorio'].map((zone) => {
              const active = (formData.zones || []).includes(zone);
              return (
                <Button
                  type="button"
                  key={zone}
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr: string[] = formData.zones || [];
                    const next = active ? curr.filter((z) => z !== zone) : [...curr, zone];
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
            {[5, 10, 15, 20].map((n) => {
              const active = formData.itemsPerSession === n;
              return (
                <Button
                  type="button"
                  key={n}
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => updateField('itemsPerSession', n)}
                  className="h-10"
                >
                  {n}
                </Button>
              );
            })}
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
          <Label>Cuentas principales</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Gmail', 'Outlook', 'Trabajo', 'Personal'].map((acc) => {
              const active = (formData.accounts || []).includes(acc);
              return (
                <Button
                  type="button"
                  key={acc}
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    const curr: string[] = formData.accounts || [];
                    const next = active ? curr.filter((a) => a !== acc) : [...curr, acc];
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
            {[10, 15, 25].map((m) => {
              const active = formData.emailMinutes === m;
              return (
                <Button
                  type="button"
                  key={m}
                  aria-pressed={active}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => updateField('emailMinutes', m)}
                  className="h-10"
                >
                  {m} min
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

export default OrganizacionForm;
