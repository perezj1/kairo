import { getCategoryIcon, getCategoryColor } from "@/lib/taskPlanner";
import { cn } from "@/lib/utils";

type Props = {
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

// 9 categorías + opción neutra para proponer
const CATEGORIES: { id: string; label: string }[] = [
  { id: "salud",            label: "Salud y forma física" },
  { id: "alimentacion",     label: "Alimentación saludable" },
  { id: "mental",           label: "Salud mental y bienestar" },
  { id: "finanzas",         label: "Finanzas personales" },
  { id: "relaciones",       label: "Relaciones y familia" },
  { id: "carrera",          label: "Carrera y aprendizaje" },
  { id: "reducir_habitos",  label: "Reducir hábitos nocivos" },
  { id: "organizacion",     label: "Organización y productividad" },
  { id: "autocuidado",      label: "Autocuidado y estilo de vida" },
  { id: "nuevo",            label: "Proponer nueva categoría" }, // neutro
];

export function CategorySelector({ selectedCategory, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Elige una o más categorías</h2>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(({ id, label }) => {
          const icon = getCategoryIcon(id);

          // Fondo por categoría; para "nuevo" usamos un neutro suave
          const bg =
            id === "nuevo"
              ? "linear-gradient(160deg,#F5F7FA 0%,#EEF1F5 100%)"
              : getCategoryColor(id);

          const isNeutral = id === "nuevo";
          const isSelected = selectedCategory === id;

          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                "rounded-2xl border shadow-sm transition-transform focus:outline-none",
                "flex flex-col items-center justify-center text-center",
                "min-h-[120px] p-4", // mantiene tamaño/espacio
                isSelected ? "ring-2 ring-primary" : "hover:scale-[1.01] active:scale-[0.99]"
              )}
              style={{
                background: bg,
                borderColor: isNeutral ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.22)",
                color: isNeutral ? "inherit" : "white",
              }}
              aria-label={label}
            >
              <div className="text-3xl leading-none select-none">{icon}</div>
              <div className="mt-3 text-sm font-semibold leading-tight">{label}</div>
              {/* Eliminado el chip “Seleccionar/Sugerir”; altura conservada con min-h */}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySelector;
