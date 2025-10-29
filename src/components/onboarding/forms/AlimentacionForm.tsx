import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 👉 Exporta el union para tipar desde GoalDetailsForm si quieres castear allí
export type AlimentacionSubId =
  | 'mas_verduras'
  | 'mas_proteina'
  | 'menos_procesados'
  | 'plan_menus';

interface AlimentacionFormProps {
  subCategoryId: AlimentacionSubId;
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
  cols?: 2 | 3 | 4;
  itemClass?: string;
}) => {
  const grid = cols === 4 ? 'grid-cols-4' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid ${grid} gap-2 mt-2`}>
      {options.map((o) => (
        <Button
          key={o.id}
          type="button"
          variant={current === o.value ? 'default' : 'outline'}
          onClick={() => onSelect(o.value)}
          className={itemClass}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
};

export const AlimentacionForm = ({
  subCategoryId,
  formData,
  onUpdate,
}: AlimentacionFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- MÁS VERDURAS / CALIDAD ----------
  if (subCategoryId === 'mas_verduras') {
    return (
      <>
        <div>
          <Label>Comidas al día con verduras</Label>
          <ButtonsGrid
            options={[2, 3, 4, 5].map((meals) => ({
              id: String(meals),
              label: String(meals),
              value: meals,
            }))}
            current={formData.mealsPerDay}
            onSelect={(v) => updateField('mealsPerDay', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>Estilo alimenticio</Label>
          <ButtonsGrid
            options={[
              { id: 'omnivoro', label: 'Omnívoro', value: 'omnivoro' },
              { id: 'vegetariano', label: 'Vegetariano', value: 'vegetariano' },
              { id: 'vegano', label: 'Vegano', value: 'vegano' },
              { id: 'flexitariano', label: 'Flexitariano', value: 'flexitariano' },
            ]}
            current={formData.dietStyle}
            onSelect={(v) => updateField('dietStyle', v)}
            cols={2}
          />
        </div>       

      </>
    );
  }

  // ---------- AUMENTAR PROTEÍNA ----------
  if (subCategoryId === 'mas_proteina') {
    return (
      <>
        <div>
          <Label>Fuente preferida</Label>
          <ButtonsGrid
            options={[
              { id: 'animal', label: 'Animal', value: 'animal' },
              { id: 'vegetal', label: 'Vegetal', value: 'vegetal' },
              { id: 'mixto', label: 'Mixto', value: 'mixto' },
            ]}
            current={formData.proteinSource}
            onSelect={(v) => updateField('proteinSource', v)}
          />
        </div>

        <div>
          <Label>Raciones diarias objetivo</Label>
          <ButtonsGrid
            options={[2, 3, 4, 5].map((n) => ({
              id: String(n),
              label: String(n),
              value: n,
            }))}
            current={formData.servingsPerDay}
            onSelect={(v) => updateField('servingsPerDay', v)}
            cols={4}
          />
        </div>

      </>
    );
  }

  // ---------- MENOS ULTRAPROCESADOS / AZÚCAR ----------
  if (subCategoryId === 'menos_procesados') {
    return (
      <>
        <div>
          <Label>Momentos críticos</Label>
          <Input
            value={formData.criticalMoments || ''}
            onChange={(e) => updateField('criticalMoments', e.target.value)}
            placeholder="Ej: Merienda, después de cenar"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Disparadores principales</Label>
          <ButtonsGrid
            options={[
              { id: 'estres', label: 'Estrés', value: 'estres' },
              { id: 'aburrimiento', label: 'Aburrimiento', value: 'aburrimiento' },
              { id: 'social', label: 'Social', value: 'social' },
              { id: 'hambre', label: 'Hambre real', value: 'hambre' },
            ]}
            current={null} // multi-select
            onSelect={(v) => {
              const current: string[] = formData.triggers || [];
              const updated = current.includes(v) ? current.filter((t) => t !== v) : [...current, v];
              updateField('triggers', updated);
            }}
            cols={2}
            itemClass="h-10 text-sm"
          />
          {/* Hint de selección actual (opcional) */}
          {/* <p className="text-xs text-muted-foreground mt-1">{(formData.triggers || []).join(', ')}</p> */}
        </div>

        <div>
          <Label>Nivel de exigencia</Label>
          <ButtonsGrid
            options={[
              { id: 'gradual', label: 'Gradual', value: 'gradual' },
              { id: 'estricto', label: 'Estricto', value: 'estricto' },
            ]}
            current={formData.strictness}
            onSelect={(v) => updateField('strictness', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  // ---------- PLAN DE MENÚS ----------
  if (subCategoryId === 'plan_menus') {
    return (
      <>
        <div>
          <Label>Días a planificar</Label>
          <ButtonsGrid
            options={[3, 5, 7].map((d) => ({
              id: String(d),
              label: `${d} días`,
              value: d,
            }))}
            current={formData.planningDays}
            onSelect={(v) => updateField('planningDays', v)}
          />
        </div>

        <div>
          <Label>Número de recetas</Label>
          <ButtonsGrid
            options={[3, 5, 7, 10].map((n) => ({
              id: String(n),
              label: String(n),
              value: n,
            }))}
            current={formData.recipesCount}
            onSelect={(v) => updateField('recipesCount', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>Preferencias de recetas</Label>
          <ButtonsGrid
            options={[
              { id: 'rapidas', label: 'Rápidas', value: 'rapidas' },
              { id: 'una_olla', label: 'Una olla', value: 'una_olla' },
              { id: 'frias', label: 'Frías', value: 'frias' },
              { id: 'batch', label: 'Batch cooking', value: 'batch' },
            ]}
            current={formData.recipePreference}
            onSelect={(v) => updateField('recipePreference', v)}
            cols={2}
            itemClass="h-10 text-sm"
          />
        </div>

        <div>
          <Label>¿Generar lista de compra?</Label>
          <ButtonsGrid
            options={[
              { id: 'si', label: 'Sí', value: true },
              { id: 'no', label: 'No', value: false },
            ]}
            current={formData.shoppingList}
            onSelect={(v) => updateField('shoppingList', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  return null;
};
