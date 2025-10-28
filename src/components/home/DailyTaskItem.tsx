import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DailyTaskItemProps {
  task: {
    id: string;
    text: string;
    minutes: number;
    kind: string;   // 'accion' | 'educacion' | 'reflexion'
    status: string; // 'pending' | 'done' | 'skipped'
  };
  onStatusChange?: (status: string) => void;
}

export default function DailyTaskItem({ task, onStatusChange }: DailyTaskItemProps) {
  const [status, setStatus] = useState(task.status);

  const fireConfetti = async (mini = false) => {
    try {
      const mod = await import("canvas-confetti");
      const confetti = mod.default;
      confetti({
        particleCount: mini ? 50 : 100,
        spread: mini ? 45 : 70,
        startVelocity: mini ? 35 : 55,
        origin: { y: 0.8 },
      });
    } catch {
      // si no está instalado, silencio
    }
  };

  const update = async (newStatus: "done" | "pending" | "skipped") => {
    const prev = status;
    setStatus(newStatus);

    const { error } = await supabase
      .from("challenges")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      toast.error("Error al actualizar la tarea");
      setStatus(prev);
      return;
    }

    onStatusChange?.(newStatus);

    if (newStatus === "done") {
      toast.success("¡Tarea completada!");
      fireConfetti(true); // confeti pequeño por cada tarea completada
    }
  };

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/60 shadow-sm transition-colors",
        status === "done" ? "bg-emerald-50" : "bg-card"
      )}
    >
      <CardContent className="p-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium leading-tight line-clamp-2">
            {task.text}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {task.kind} • {task.minutes} min
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={status === "done" ? "default" : "outline"}
            size="sm"
            className="rounded-full h-8"
            onClick={() => update(status === "done" ? "pending" : "done")}
          >
            <Check className="h-4 w-4 mr-1" />
            {status === "done" ? "Hecho" : "Completar"}
          </Button>

          {status !== "skipped" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => update("skipped")}
              className="rounded-full h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Omitir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
