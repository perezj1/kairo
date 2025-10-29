import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** ✅ Categorías soportadas por este form (sin reducir_habitos) */
export type OtrosCategoryId = 'organizacion' | 'autocuidado' | 'nuevo';

interface OtrosFormProps {
  categoryId: OtrosCategoryId;
  /** subCategoryId no se usa aquí, pero lo dejamos por compatibilidad */
  subCategoryId?: string;
  formData: any;
  onUpdate: (data: any) => void;
}

export const OtrosForm = ({ categoryId, formData, onUpdate }: OtrosFormProps) => {
  const updateField = (field: string, value: any) =>
    onUpdate({ ...formData, [field]: value });

  // --- Organización y productividad ---
  if (categoryId === 'organizacion') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Plan diario efectivo"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Herramientas preferidas</Label>
          <Input
            value={formData.tools || ''}
            onChange={(e) => updateField('tools', e.target.value)}
            placeholder="Ej: Notion, calendario, papel"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // --- Autocuidado ---
  if (categoryId === 'autocuidado') {
    return (
      <>
        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Rutina de autocuidado"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Actividades preferidas</Label>
          <Input
            value={formData.activities || ''}
            onChange={(e) => updateField('activities', e.target.value)}
            placeholder="Ej: Lectura, baño, música"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // --- Nueva categoría personalizada ---
  if (categoryId === 'nuevo') {
    return (
      <>
        <div>
          <Label>Nombre de tu categoría</Label>
          <Input
            value={formData.customCategory || ''}
            onChange={(e) => updateField('customCategory', e.target.value)}
            placeholder="Ej: Mi podcast"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Lanzar 3 episodios"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Resultado deseado</Label>
          <Input
            value={formData.desiredResult || ''}
            onChange={(e) => updateField('desiredResult', e.target.value)}
            placeholder="Describe qué quieres lograr"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Métrica de éxito</Label>
          <Input
            value={formData.successMetric || ''}
            onChange={(e) => updateField('successMetric', e.target.value)}
            placeholder="¿Cómo medirás el éxito?"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  return null;
};

export default OtrosForm;
