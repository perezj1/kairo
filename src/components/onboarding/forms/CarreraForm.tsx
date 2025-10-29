import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LANGUAGE_LEVEL_OPTIONS, LANGUAGE_TARGET_OPTIONS } from '@/lib/categories';

// 👉 Exporta para castear desde GoalDetailsForm
export type CarreraSubId = 'skill' | 'proyecto' | 'networking' | 'idiomas';

interface CarreraFormProps {
  subCategoryId: CarreraSubId;
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

export const CarreraForm = ({ subCategoryId, formData, onUpdate }: CarreraFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- SKILL / CERTIFICACIÓN ----------
  if (subCategoryId === 'skill') {
    return (
      <>
        <div>
          <Label>Skill concreta</Label>
          <Input
            value={formData.specificSkill || ''}
            onChange={(e) => updateField('specificSkill', e.target.value)}
            placeholder="Ej: React, Python, Excel"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Meta específica</Label>
          <ButtonsGrid
            options={[
              { id: 'certificacion', label: 'Certificación', value: 'certificacion' },
              { id: 'curso', label: 'Finalizar curso', value: 'curso' },
              { id: 'proyecto', label: 'Proyecto práctico', value: 'proyecto' },
              { id: 'nivel', label: 'Nivel específico', value: 'nivel' },
            ]}
            current={formData.goalType}
            onSelect={(v) => updateField('goalType', v)}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Recursos preferidos</Label>
          <Input
            value={formData.resources || ''}
            onChange={(e) => updateField('resources', e.target.value)}
            placeholder="Ej: Udemy, YouTube, libros"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Días de estudio profundo por semana</Label>
          <ButtonsGrid
            options={[2, 3, 4, 5].map((d) => ({ id: String(d), label: `${d} días`, value: d }))}
            current={formData.deepStudyDays}
            onSelect={(v) => updateField('deepStudyDays', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>¿Incluir simulacros/prácticas?</Label>
          <ButtonsGrid
            options={[
              { id: 'si', label: 'Sí', value: true },
              { id: 'no', label: 'No', value: false },
            ]}
            current={formData.includeTests}
            onSelect={(v) => updateField('includeTests', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  // ---------- PROYECTO / PORTAFOLIO ----------
  if (subCategoryId === 'proyecto') {
    return (
      <>
        <div>
          <Label>Tipo de proyecto</Label>
          <Input
            value={formData.projectType || ''}
            onChange={(e) => updateField('projectType', e.target.value)}
            placeholder="Ej: App web, diseño, escrito"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Alcance del proyecto</Label>
          <ButtonsGrid
            options={[
              { id: 'pequeno', label: 'Pequeño', value: 'pequeno' },
              { id: 'mediano', label: 'Mediano', value: 'mediano' },
              { id: 'grande', label: 'Grande', value: 'grande' },
            ]}
            current={formData.projectScope}
            onSelect={(v) => updateField('projectScope', v)}
          />
        </div>

        <div>
          <Label>Hitos semanales deseados</Label>
          <ButtonsGrid
            options={[1, 2, 3, 4].map((m) => ({ id: String(m), label: String(m), value: m }))}
            current={formData.weeklyMilestones}
            onSelect={(v) => updateField('weeklyMilestones', v)}
            cols={4}
          />
        </div>

        <div>
          <Label>¿Difusión pública?</Label>
          <ButtonsGrid
            options={[
              { id: 'si', label: 'Sí (LinkedIn/GitHub)', value: true },
              { id: 'no', label: 'No (privado)', value: false },
            ]}
            current={formData.publicSharing}
            onSelect={(v) => updateField('publicSharing', v)}
            cols={2}
            itemClass="h-10 text-sm"
          />
        </div>
      </>
    );
  }

  // ---------- ENTREVISTAS / NETWORKING ----------
  if (subCategoryId === 'networking') {
    return (
      <>
        <div>
          <Label>Objetivo principal</Label>
          <ButtonsGrid
            options={[
              { id: 'entrevistas', label: 'Entrevistas', value: 'entrevistas' },
              { id: 'networking', label: 'Networking', value: 'networking' },
              { id: 'ambos', label: 'Ambos', value: 'ambos' },
            ]}
            current={formData.mainGoal}
            onSelect={(v) => updateField('mainGoal', v)}
            cols={2}
          />
        </div>

        <div>
          <Label>Materiales a preparar</Label>
          <ButtonsGrid
            options={[
              { id: 'cv', label: 'CV', value: 'cv' },
              { id: 'portfolio', label: 'Portfolio', value: 'portfolio' },
              { id: 'pitch', label: 'Pitch personal', value: 'pitch' },
              { id: 'linkedin', label: 'Perfil LinkedIn', value: 'linkedin' },
            ]}
            current={formData.materials || []} // multi-select
            onSelect={(v) => {
              const current: string[] = formData.materials || [];
              const updated = current.includes(v)
                ? current.filter((m) => m !== v)
                : [...current, v];
              updateField('materials', updated);
            }}
            cols={2}
            itemClass="h-10 text-sm"
            multi
          />
        </div>

        <div>
          <Label>Contactos objetivo por semana</Label>
          <ButtonsGrid
            options={[2, 3, 5, 7, 10].map((c) => ({
              id: String(c),
              label: String(c),
              value: c,
            }))}
            current={formData.weeklyContacts}
            onSelect={(v) => updateField('weeklyContacts', v)}
            cols={5}
            itemClass="h-10 text-sm"
          />
        </div>

        <div>
          <Label>¿Simulacros de entrevistas?</Label>
          <ButtonsGrid
            options={[
              { id: 'si', label: 'Sí', value: true },
              { id: 'no', label: 'No', value: false },
            ]}
            current={formData.mockInterviews}
            onSelect={(v) => updateField('mockInterviews', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  // ---------- IDIOMAS ----------
  if (subCategoryId === 'idiomas') {
    return (
      <>
        <div>
          <Label>¿Qué idioma?</Label>
          <Input
            value={formData.languageTarget || ''}
            onChange={(e) => updateField('languageTarget', e.target.value)}
            placeholder="Ej: Inglés, Francés, Alemán"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Nivel actual</Label>
          <ButtonsGrid
            options={LANGUAGE_LEVEL_OPTIONS.map((o) => ({
              id: o.id,
              label: o.label,
              value: o.value,
            }))}
            current={formData.currentLevel}
            onSelect={(v) => updateField('currentLevel', v)}
            cols={3}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Nivel objetivo</Label>
          <ButtonsGrid
            options={LANGUAGE_TARGET_OPTIONS.map((o) => ({
              id: o.id,
              label: o.label,
              value: o.value,
            }))}
            current={formData.targetLevel}
            onSelect={(v) => updateField('targetLevel', v)}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Enfoque principal</Label>
          <ButtonsGrid
            options={[
              { id: 'speaking', label: 'Speaking', value: 'speaking' },
              { id: 'listening', label: 'Listening', value: 'listening' },
              { id: 'reading', label: 'Reading', value: 'reading' },
              { id: 'grammar', label: 'Grammar', value: 'grammar' },
            ]}
            current={formData.focus}
            onSelect={(v) => updateField('focus', v)}
            cols={2}
            itemClass="h-10 text-sm"
          />
        </div>

        <div>
          <Label>Práctica real</Label>
          <ButtonsGrid
            options={[
              { id: 'intercambio', label: 'Intercambio', value: 'intercambio' },
              { id: 'llamadas', label: 'Llamadas', value: 'llamadas' },
              { id: 'app', label: 'App de idiomas', value: 'app' },
              { id: 'clase', label: 'Clase online', value: 'clase' },
            ]}
            current={formData.practice}
            onSelect={(v) => updateField('practice', v)}
            cols={2}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Días de conversación por semana</Label>
          <ButtonsGrid
            options={[2, 3, 5, 7].map((d) => ({
              id: String(d),
              label: `${d} días`,
              value: d,
            }))}
            current={formData.conversationDays}
            onSelect={(v) => updateField('conversationDays', v)}
            cols={4}
          />
        </div>
      </>
    );
  }

  return null;
};
