import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, getCategoryColor } from "@/lib/taskPlanner";
import { cn } from "@/lib/utils";

interface GoalPillCardProps {
  goal: {
    id: string;
    title: string;
    category: string;
    xp: number;
    hearts: number;
    streak: number;
    level: number;
    deadline_weeks: number | null;
    active: boolean;
  };
  selected: boolean;
  onSelect: () => void;

  // NUEVO: progreso del día y conteo de tareas
  dayProgress?: number;      // 0–100
  todayCount?: number;       // total tareas del día
  doneCount?: number;        // tareas completadas hoy
}

export default function GoalPillCard({
  goal,
  selected,
  onSelect,
  dayProgress = 0,
  todayCount = 0,
  doneCount = 0,
}: GoalPillCardProps) {
  const icon = getCategoryIcon(goal.category);
  const catColor = getCategoryColor(goal.category); // ← gradient según categoría

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "min-w-[270px] rounded-2xl border-0 shadow-lg cursor-pointer transition-all snap-start",
        selected ? "ring-2 ring-primary scale-[1.02]" : "hover:scale-[1.01]"
      )}
      style={{
        background: catColor || "var(--gradient-hero)", // ← único cambio visual
        color: "hsl(var(--primary-foreground))",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="text-2xl leading-none">{icon}</div>
          <Badge
            className="rounded-full text-xs"
            style={{ backgroundColor: "hsla(var(--card-foreground), .12)", color: "white" }}
            variant="secondary"
          >
            {goal.active ? "Activo" : "Pausado"}
          </Badge>
        </div>

        <h3 className="mt-2 text-lg font-semibold">{goal.title}</h3>
        <p className="text-xs opacity-90 mt-0.5 capitalize">{goal.category}</p>

        <div className="mt-3 space-y-2">
          {/* NUEVO: resumen del día */}
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>Hoy: {doneCount}/{todayCount}</span>
            <span>🔥 {goal.streak} • ❤️ {goal.hearts}</span>
          </div>

          {/* NUEVO: barra = progreso diario */}
          <Progress value={dayProgress} className="h-2 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}
