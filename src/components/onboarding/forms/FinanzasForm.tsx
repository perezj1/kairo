import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 👉 Exporta el union para poder castear desde GoalDetailsForm
export type FinanzasSubId = 'ahorro' | 'pagar_deudas' | 'gasto_consciente' | 'presupuesto';

interface FinanzasFormProps {
  subCategoryId: FinanzasSubId;
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
  options: { id: string; label: string | number; value: any }[];
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

export const FinanzasForm = ({ subCategoryId, formData, onUpdate }: FinanzasFormProps) => {
  const updateField = mergeUpdate(formData, onUpdate);

  // ---------- AHORRO ----------
  if (subCategoryId === 'ahorro') {
    return (
      <>
        <div>
          <Label>Cantidad objetivo (CHF)</Label>
          <Input
            type="number"
            value={formData.savingsTarget ?? ''}
            onChange={(e) => updateField('savingsTarget', Number(e.target.value) || 0)}
            placeholder="3000"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Ingreso mensual aprox. (CHF)</Label>
          <Input
            type="number"
            value={formData.monthlyIncome ?? ''}
            onChange={(e) => updateField('monthlyIncome', Number(e.target.value) || 0)}
            placeholder="4000"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Gastos fijos mensuales (CHF)</Label>
          <Input
            type="number"
            value={formData.fixedExpenses ?? ''}
            onChange={(e) => updateField('fixedExpenses', Number(e.target.value) || 0)}
            placeholder="2500"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Frecuencia de aporte</Label>
          <ButtonsGrid
            options={[
              { id: 'semanal', label: 'Semanal', value: 'semanal' },
              { id: 'quincenal', label: 'Quincenal', value: 'quincenal' },
              { id: 'mensual', label: 'Mensual', value: 'mensual' },
            ]}
            current={formData.contributionFrequency}
            onSelect={(v) => updateField('contributionFrequency', v)}
            itemClass="h-10 text-xs"
          />
        </div>

        <div>
          <Label>Día de cargo preferido</Label>
          <ButtonsGrid
            options={[1, 5, 15, 25].map((d) => ({ id: String(d), label: `Día ${d}`, value: d }))}
            current={formData.chargeDay}
            onSelect={(v) => updateField('chargeDay', v)}
            cols={4}
          />
        </div>
      </>
    );
  }

  // ---------- PAGAR DEUDAS ----------
  if (subCategoryId === 'pagar_deudas') {
    return (
      <>
        <div>
          <Label>Tipo de deuda</Label>
          <ButtonsGrid
            options={[
              { id: 'tarjeta', label: 'Tarjeta crédito', value: 'tarjeta' },
              { id: 'prestamo', label: 'Préstamo personal', value: 'prestamo' },
              { id: 'auto', label: 'Préstamo auto', value: 'auto' },
              { id: 'otro', label: 'Otro', value: 'otro' },
            ]}
            current={formData.debtType}
            onSelect={(v) => updateField('debtType', v)}
            cols={2}
            itemClass="h-10 text-sm"
          />
        </div>

        <div>
          <Label>Monto total de deuda (CHF)</Label>
          <Input
            type="number"
            value={formData.debtAmount ?? ''}
            onChange={(e) => updateField('debtAmount', Number(e.target.value) || 0)}
            placeholder="5000"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Tasa de interés aprox. (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.interestRate ?? ''}
            onChange={(e) => updateField('interestRate', Number(e.target.value) || 0)}
            placeholder="15.5"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Estrategia de pago</Label>
          <ButtonsGrid
            options={[
              { id: 'avalancha', label: 'Avalancha (mayor interés)', value: 'avalancha' },
              { id: 'bola_nieve', label: 'Bola de nieve (menor deuda)', value: 'bola_nieve' },
            ]}
            current={formData.paymentStrategy}
            onSelect={(v) => updateField('paymentStrategy', v)}
            cols={2}
            itemClass="h-auto py-2 text-xs"
          />
        </div>

        <div>
          <Label>Aporte mensual (CHF)</Label>
          <Input
            type="number"
            value={formData.monthlyPayment ?? ''}
            onChange={(e) => updateField('monthlyPayment', Number(e.target.value) || 0)}
            placeholder="300"
            className="mt-2"
          />
        </div>
      </>
    );
  }

  // ---------- GASTO CONSCIENTE ----------
  if (subCategoryId === 'gasto_consciente') {
    return (
      <>
        <div>
          <Label>Categorías a vigilar</Label>
          <Input
            value={formData.watchCategories ?? ''}
            onChange={(e) => updateField('watchCategories', e.target.value)}
            placeholder="Ej: Comida fuera, ropa, ocio"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Presupuesto semanal por categoría (CHF)</Label>
          <Input
            type="number"
            value={formData.weeklyBudget ?? ''}
            onChange={(e) => updateField('weeklyBudget', Number(e.target.value) || 0)}
            placeholder="100"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Días "no-spend" por semana</Label>
          <ButtonsGrid
            options={[0, 1, 2, 3].map((d) => ({ id: String(d), label: d, value: d }))}
            current={formData.noSpendDays}
            onSelect={(v) => updateField('noSpendDays', v)}
            cols={4}
          />
        </div>
      </>
    );
  }

  // ---------- PRESUPUESTO 50/30/20 ----------
  if (subCategoryId === 'presupuesto') {
    const income = Number(formData.monthlyIncome) || 0;
    const needs = Math.round(income * 0.5);
    const wants = Math.round(income * 0.3);
    const savings = Math.round(income * 0.2);

    return (
      <>
        <div>
          <Label>Ingreso mensual neto (CHF)</Label>
          <Input
            type="number"
            value={formData.monthlyIncome ?? ''}
            onChange={(e) => updateField('monthlyIncome', Number(e.target.value) || 0)}
            placeholder="4000"
            className="mt-2"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>50% Necesidades:</span>
            <span className="font-semibold">{needs} CHF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>30% Deseos:</span>
            <span className="font-semibold">{wants} CHF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>20% Ahorro:</span>
            <span className="font-semibold">{savings} CHF</span>
          </div>
        </div>

        <div>
          <Label>Frecuencia de revisión</Label>
          <ButtonsGrid
            options={[
              { id: 'semanal', label: 'Semanal', value: 'semanal' },
              { id: 'quincenal', label: 'Quincenal', value: 'quincenal' },
            ]}
            current={formData.reviewFrequency}
            onSelect={(v) => updateField('reviewFrequency', v)}
            cols={2}
          />
        </div>
      </>
    );
  }

  return null;
};
