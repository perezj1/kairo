import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Devuelve el número de tareas PENDIENTES de hoy para TODOS los objetivos del usuario.
 * Muestra un badge en la barra inferior (estilo 12 del mock).
 */
export default function useTodayCounts() {
  const { user } = useAuth();
  const [todayTasksCount, setTodayTasksCount] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setTodayTasksCount(0);
      return;
    }
    const today = new Date().toISOString().split("T")[0];

    const load = async () => {
      // 1) Obtener los objetivos del usuario
      const { data: goals, error: gErr } = await supabase
        .from("goals")
        .select("id")
        .eq("user_id", user.id);

      if (gErr) {
        console.error(gErr);
        setTodayTasksCount(0);
        return;
      }

      const goalIds = (goals ?? []).map((g) => g.id);
      if (goalIds.length === 0) {
        setTodayTasksCount(0);
        return;
      }

      // 2) Contar challenges de hoy pendientes para esos objetivos
      const { count, error: cErr } = await supabase
        .from("challenges")
        .select("id", { count: "exact", head: true })
        .in("goal_id", goalIds)
        .eq("day", today)
        .eq("status", "pending");

      if (cErr) {
        console.error(cErr);
        setTodayTasksCount(0);
        return;
      }

      setTodayTasksCount(count ?? 0);
    };

    load();
  }, [user]);

  return { todayTasksCount };
}
