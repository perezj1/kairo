import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  WEIGHT_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
  EQUIPMENT_OPTIONS,
  FREQUENCY_OPTIONS,
} from '@/lib/categories';

interface SaludFormProps {
  subCategoryId: string;
  formData: any;
  onUpdate: (data: any) => void;
}

export const SaludForm = ({ subCategoryId, formData, onUpdate }: SaludFormProps) => {
  const updateField = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  /* ─────────────────────────────
   * BAJAR PESO
   * ────────────────────────────*/
  if (subCategoryId === 'bajar_peso') {
    return (
      <>
        {/* ¿Cuántos kilos quieres perder? */}
        <div>
          <Label className="text-sm font-medium">¿Cuántos kilos quieres perder?</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {WEIGHT_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.targetWeight === option.value}
                variant={formData.targetWeight === option.value ? 'default' : 'outline'}
                onClick={() => {
                  updateField('targetWeight', option.value);
                  if (!formData.title) updateField('title', `Perder ${option.value}kg`);
                }}
                className="h-12"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Nivel actual */}
        <div>
          <Label className="text-sm font-medium">Nivel actual</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: '1', label: 'Principiante', value: 1 },
              { id: '2', label: 'Intermedio', value: 2 },
              { id: '3', label: 'Avanzado', value: 3 },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.currentLevel === option.value}
                variant={formData.currentLevel === option.value ? 'default' : 'outline'}
                onClick={() => updateField('currentLevel', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Peso inicial */}
        <div>
          <Label className="text-sm font-medium">Peso inicial (kg)</Label>
          <Input
            inputMode="decimal"
            pattern="[0-9]*"
            value={formData.initialWeight ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              updateField('initialWeight', v === '' ? '' : Number(v));
            }}
            placeholder="70"
            className="mt-2"
          />
        </div>

        {/* Actividad actual */}
        <div>
          <Label className="text-sm font-medium">Actividad actual</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {ACTIVITY_LEVEL_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.activityLevel === option.value}
                variant={formData.activityLevel === option.value ? 'default' : 'outline'}
                onClick={() => updateField('activityLevel', option.value)}
                className="h-auto py-2 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Equipo disponible */}
        <div>
          <Label className="text-sm font-medium">Equipo disponible</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {EQUIPMENT_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.equipment === option.value}
                variant={formData.equipment === option.value ? 'default' : 'outline'}
                onClick={() => updateField('equipment', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Lesiones (opcional) */}
        <div>
          <Label className="text-sm font-medium">¿Tienes lesiones? (opcional)</Label>
          <Input
            value={formData.injuries ?? ''}
            onChange={(e) => updateField('injuries', e.target.value)}
            placeholder="Ej: Rodilla derecha"
            className="mt-2"
          />
        </div>

        {/* Hora de cierre de cocina */}
        <div>
          <Label className="text-sm font-medium">Hora de cierre de cocina</Label>
          <Input
            type="time"
            value={formData.kitchenCloseTime ?? '20:00'}
            onChange={(e) => updateField('kitchenCloseTime', e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Días flexibles por semana */}
        <div>
          <Label className="text-sm font-medium">Días flexibles por semana</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[0, 1, 2].map((days) => (
              <Button
                type="button"
                key={days}
                aria-pressed={formData.flexibleDays === days}
                variant={formData.flexibleDays === days ? 'default' : 'outline'}
                onClick={() => updateField('flexibleDays', days)}
                className="h-10"
              >
                {days} días
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * GANAR MÚSCULO
   * ────────────────────────────*/
  if (subCategoryId === 'ganar_musculo') {
    return (
      <>
        <div>
          <Label className="text-sm font-medium">Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Ganar masa muscular"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Zonas prioritarias</Label>
          <Input
            value={formData.targetZones || ''}
            onChange={(e) => updateField('targetZones', e.target.value)}
            placeholder="Ej: Piernas, brazos, core"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Frecuencia semanal</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {FREQUENCY_OPTIONS.slice(0, 5).map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.frequency === option.value}
                variant={formData.frequency === option.value ? 'default' : 'outline'}
                onClick={() => updateField('frequency', option.value)}
                className="h-10 text-sm"
              >
                {option.label.split('/')[0]}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Equipo disponible</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {EQUIPMENT_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.equipment === option.value}
                variant={formData.equipment === option.value ? 'default' : 'outline'}
                onClick={() => updateField('equipment', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Experiencia técnica</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { id: 'baja', label: 'Baja', value: 'baja' },
              { id: 'media', label: 'Media', value: 'media' },
              { id: 'alta', label: 'Alta', value: 'alta' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.experience === option.value}
                variant={formData.experience === option.value ? 'default' : 'outline'}
                onClick={() => updateField('experience', option.value)}
                className="h-10"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Objetivo secundario</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { id: 'fuerza', label: 'Fuerza', value: 'fuerza' },
              { id: 'estetica', label: 'Estética', value: 'estetica' },
              { id: 'rendimiento', label: 'Rendimiento', value: 'rendimiento' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.secondaryGoal === option.value}
                variant={formData.secondaryGoal === option.value ? 'default' : 'outline'}
                onClick={() => updateField('secondaryGoal', option.value)}
                className="h-10 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * CARDIO
   * ────────────────────────────*/
  if (subCategoryId === 'cardio') {
    return (
      <>
        <div>
          <Label className="text-sm font-medium">Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Mejorar resistencia cardiovascular"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Modalidad preferida</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: 'caminar', label: 'Caminar', value: 'caminar' },
              { id: 'correr', label: 'Correr', value: 'correr' },
              { id: 'bici', label: 'Bicicleta', value: 'bici' },
              { id: 'hiit', label: 'HIIT suave', value: 'hiit' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.modality === option.value}
                variant={formData.modality === option.value ? 'default' : 'outline'}
                onClick={() => updateField('modality', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Frecuencia semanal</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {FREQUENCY_OPTIONS.slice(0, 5).map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.frequency === option.value}
                variant={formData.frequency === option.value ? 'default' : 'outline'}
                onClick={() => updateField('frequency', option.value)}
                className="h-10 text-sm"
              >
                {option.label.split('/')[0]}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Entorno</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: 'exterior', label: 'Exterior', value: 'exterior' },
              { id: 'cinta', label: 'Cinta/Gimnasio', value: 'cinta' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.environment === option.value}
                variant={formData.environment === option.value ? 'default' : 'outline'}
                onClick={() => updateField('environment', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Condición actual</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { id: 'baja', label: 'Baja', value: 'baja' },
              { id: 'media', label: 'Media', value: 'media' },
              { id: 'buena', label: 'Buena', value: 'buena' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.condition === option.value}
                variant={formData.condition === option.value ? 'default' : 'outline'}
                onClick={() => updateField('condition', option.value)}
                className="h-10"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * MOVILIDAD
   * ────────────────────────────*/
  if (subCategoryId === 'movilidad') {
    return (
      <>
        <div>
          <Label className="text-sm font-medium">Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Mejorar movilidad lumbar"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Zona principal</Label>
          <Input
            value={formData.targetZone || ''}
            onChange={(e) => updateField('targetZone', e.target.value)}
            placeholder="Ej: Espalda baja, cuello, cadera"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Situación de dolor</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { id: 'sin_dolor', label: 'Sin dolor', value: 'sin_dolor' },
              { id: 'leve', label: 'Leve', value: 'leve' },
              { id: 'moderado', label: 'Moderado', value: 'moderado' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.painLevel === option.value}
                variant={formData.painLevel === option.value ? 'default' : 'outline'}
                onClick={() => updateField('painLevel', option.value)}
                className="h-10 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Rigidez actual</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { id: 'baja', label: 'Baja', value: 'baja' },
              { id: 'media', label: 'Media', value: 'media' },
              { id: 'alta', label: 'Alta', value: 'alta' },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.stiffness === option.value}
                variant={formData.stiffness === option.value ? 'default' : 'outline'}
                onClick={() => updateField('stiffness', option.value)}
                className="h-10"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * MANTENER ACTIVO
   * ────────────────────────────*/
  if (subCategoryId === 'mantener_activo') {
    return (
      <>
        <div>
          <Label className="text-sm font-medium">Título del objetivo</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Mantenerme activo diariamente"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Objetivo de pasos diarios</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: '5000', label: '5,000 pasos', value: 5000 },
              { id: '7500', label: '7,500 pasos', value: 7500 },
              { id: '10000', label: '10,000 pasos', value: 10000 },
              { id: '12500', label: '12,500 pasos', value: 12500 },
            ].map((option) => (
              <Button
                type="button"
                key={option.id}
                aria-pressed={formData.stepsGoal === option.value}
                variant={formData.stepsGoal === option.value ? 'default' : 'outline'}
                onClick={() => updateField('stepsGoal', option.value)}
                className="h-10 text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Días activos por semana</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[5, 6, 7].map((days) => (
              <Button
                type="button"
                key={days}
                aria-pressed={formData.activeDays === days}
                variant={formData.activeDays === days ? 'default' : 'outline'}
                onClick={() => updateField('activeDays', days)}
                className="h-10"
              >
                {days} días
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }

  return null;
};
