import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

// Sub-forms con tipos para evitar TS2322
import { SaludForm, type SaludSubId } from './forms/SaludForm';
import { AlimentacionForm, type AlimentacionSubId } from './forms/AlimentacionForm';
import { MentalForm, type MentalSubId } from './forms/MentalForm';
import { FinanzasForm, type FinanzasSubId } from './forms/FinanzasForm';
import { RelacionesForm, type RelacionesSubId } from './forms/RelacionesForm';
import { CarreraForm, type CarreraSubId } from './forms/CarreraForm';
import { ReducirHabitosForm, type ReducirHabitosSubId } from './forms/ReducirHabitosForm';
import {AutocuidadoForm,  type AutocuidadoSubId } from './forms/AutocuidadoForm';
import { OrganizacionForm, type OrganizacionSubId } from './forms/OrganizacionForm';
import { OtrosForm, type OtrosCategoryId } from './forms/OtrosForm';

import {
  DEADLINE_OPTIONS,
  TIME_OPTIONS,
  TIME_SLOT_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_TARGET_OPTIONS,
  WEIGHT_OPTIONS,
  getGoalName,
} from '@/lib/categories';

interface GoalDetailsFormProps {
  categoryId: string;
  subCategoryId: string;
  formData: any;
  onUpdate: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const GoalDetailsForm = ({
  categoryId,
  subCategoryId,
  formData,
  onUpdate,
  onBack,
  onSubmit,
  loading,
}: GoalDetailsFormProps) => {
  const updateField = (key: string, value: any) => {
    onUpdate({ ...formData, [key]: value });
  };

  // === Nombre del objetivo y autocompletado del título ===
  const goalName = useMemo(
    () => getGoalName(categoryId, subCategoryId),
    [categoryId, subCategoryId]
  );

  const [isTitleDirty, setIsTitleDirty] = useState(false);

  useEffect(() => {
    // Si el usuario no ha tocado el título, sincroniza con el nombre del objetivo
    if (!isTitleDirty) {
      onUpdate({ ...formData, title: goalName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalName]);

  const renderCategoryForm = () => {
    const forms: Record<string, JSX.Element | null> = {
      salud: (
        <SaludForm
          subCategoryId={subCategoryId as SaludSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
      alimentacion: (
        <AlimentacionForm
          subCategoryId={subCategoryId as AlimentacionSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
      mental: (
        <MentalForm
          subCategoryId={subCategoryId as MentalSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
      finanzas: (
        <FinanzasForm
          subCategoryId={subCategoryId as FinanzasSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
      relaciones: (
        <RelacionesForm
          subCategoryId={subCategoryId as RelacionesSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
      carrera: (
        <CarreraForm
          subCategoryId={subCategoryId as CarreraSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),

      // Reducir hábitos: usa 'redes' (no 'redes_sociales') según tus CATEGORIES
      reducir_habitos: (
        <>
          {(['fumar', 'alcohol', 'azucar', 'redes', 'otro_habito'] as const).includes(
            subCategoryId as any
          ) && (
            <ReducirHabitosForm
              subCategoryId={subCategoryId as ReducirHabitosSubId}
              formData={formData}
              onUpdate={onUpdate}
            />
          )}
        </>
      ),

      organizacion: (
  <OrganizacionForm
    subCategoryId={subCategoryId as OrganizacionSubId}
    formData={formData}
    onUpdate={onUpdate}
  />
),

      autocuidado: (
        <AutocuidadoForm
          subCategoryId={subCategoryId as AutocuidadoSubId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),

      nuevo: (
        <OtrosForm
          categoryId={'nuevo' as OtrosCategoryId}
          subCategoryId={subCategoryId}
          formData={formData}
          onUpdate={onUpdate}
        />
      ),
    };

    return forms[categoryId] || null;
  };

  // --- bloques opcionales/legacy (si los usas) ---
  const renderOldForm = () => (
    <>
      <div>
        <Label className="text-sm font-medium">¿Cuántos kilos quieres perder?</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {WEIGHT_OPTIONS.map((option) => (
            <Button
              type="button"
              key={option.id}
              variant={formData.targetWeight === option.value ? 'default' : 'outline'}
              onClick={() => {
                updateField('targetWeight', option.value);
                updateField('title', `Perder ${option.value}kg`);
                setIsTitleDirty(true);
              }}
              className="h-12"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  const renderLanguageForm = () => (
    <>
      <div>
        <Label className="text-sm font-medium">¿Qué idioma?</Label>
        <Input
          value={formData.languageTarget || ''}
          onChange={(e) => updateField('languageTarget', e.target.value)}
          placeholder="Ej: Inglés, Francés..."
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Nivel actual</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {LANGUAGE_LEVEL_OPTIONS.slice(0, 6).map((option) => (
            <Button
              type="button"
              key={option.id}
              variant={formData.currentLevel === option.value ? 'default' : 'outline'}
              onClick={() => updateField('currentLevel', option.value)}
              className="h-12 text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Nivel objetivo</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {LANGUAGE_TARGET_OPTIONS.map((option) => (
            <Button
              type="button"
              key={option.id}
              variant={formData.targetLevel === option.value ? 'default' : 'outline'}
              onClick={() => updateField('targetLevel', option.value)}
              className="h-12 text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  const renderFinanceForm = () => (
    <>
      <div>
        <Label className="text-sm font-medium">Objetivo de ahorro (CHF)</Label>
        <Input
          type="number"
          value={formData.savingsTarget || ''}
          onChange={(e) => updateField('savingsTarget', parseInt(e.target.value))}
          placeholder="Ej: 1000"
          className="mt-2"
        />
      </div>
    </>
  );

  // 💡 Siempre mostramos el título, con default = goalName
  const renderTitleField = () => (
    <div>
      <Label className="text-sm font-medium">Título del objetivo</Label>
      <Input
        value={formData.title ?? goalName}
        onChange={(e) => {
          setIsTitleDirty(true);
          updateField('title', e.target.value);
        }}
        placeholder={goalName}
        className="mt-2"
      />
    </div>
  );

  // --- render principal ---
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          {/* Encabezado = nombre del objetivo */}
          <h2 className="text-2xl font-bold">{goalName}</h2>
          <p className="text-sm text-muted-foreground">Cuanto más específico, mejor</p>
        </div>
      </div>

      <div className="space-y-5">
        {renderTitleField()}

        {renderCategoryForm()}

        {/* Campos comunes */}
        <div>
          <Label className="text-sm font-medium">Fecha límite</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {DEADLINE_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                variant={formData.deadlineWeeks === option.value ? 'default' : 'outline'}
                onClick={() => updateField('deadlineWeeks', option.value)}
                className="h-12 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Minutos diarios</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {TIME_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                variant={formData.minutes === option.value ? 'default' : 'outline'}
                onClick={() => updateField('minutes', option.value)}
                className="h-12"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Mejor momento del día</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {TIME_SLOT_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                variant={formData.bestSlot === option.value ? 'default' : 'outline'}
                onClick={() => updateField('bestSlot', option.value)}
                className="h-12 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.title || !formData.deadlineWeeks || loading}
          className="flex-1"
        >
          {loading ? 'Creando...' : 'Crear objetivo'}
        </Button>
      </div>
    </div>
  );
};
