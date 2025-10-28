import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Heart, Trophy, LogOut, Settings, Target } from "lucide-react";
import { toast } from "sonner";
import GoalPillCard from "@/components/home/GoalPillCard";
import DailyTaskItem from "@/components/home/DailyTaskItem";
import { getCategoryIcon } from "@/lib/taskPlanner";

interface Goal {
  id: string;
  title: string;
  category: string;
  xp: number;
  hearts: number;
  streak: number;
  level: number;
  deadline_weeks: number | null;
  active: boolean;
  created_at?: string;
  user_id?: string;
}

interface Challenge {
  id: string;
  goal_id: string;
  day: string;    // YYYY-MM-DD
  text: string;
  minutes: number;
  kind: string;   // accion | educacion | reflexion
  status: string; // pending | done | skipped
  created_at?: string;
}

type TodayStats = Record<string, { done: number; total: number }>;

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [todayTasks, setTodayTasks] = useState<Challenge[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats>({});
  const [loading, setLoading] = useState(true);

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId) || null,
    [goals, selectedGoalId]
  );

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);
  const rewardKey = useCallback(
    (goalId: string) => `kairo.rewarded.${goalId}.${todayISO}`,
    [todayISO]
  );

  // ---------- DATA LOADERS ----------
  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: goalRows, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const list = (goalRows || []) as Goal[];
      setGoals(list);

      if (list.length > 0) {
        const stillExists = list.some((g) => g.id === selectedGoalId);
        setSelectedGoalId(stillExists ? selectedGoalId : list[0].id);
      } else {
        setSelectedGoalId(null);
      }

      if (list.length > 0) {
        await fetchAllTodayStats(list.map((g) => g.id));
      } else {
        setTodayStats({});
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar tus objetivos");
    } finally {
      setLoading(false);
    }
  }, [user, selectedGoalId]);

  const fetchAllTodayStats = useCallback(
    async (goalIds: string[]) => {
      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("id, goal_id, status")
          .in("goal_id", goalIds)
          .eq("day", todayISO);

        if (error) throw error;

        const agg: TodayStats = {};
        (data || []).forEach((row: { goal_id: string; status: string }) => {
          if (!agg[row.goal_id]) agg[row.goal_id] = { done: 0, total: 0 };
          agg[row.goal_id].total += 1;
          if (row.status === "done") agg[row.goal_id].done += 1;
        });

        goalIds.forEach((id) => {
          if (!agg[id]) agg[id] = { done: 0, total: 0 };
        });

        setTodayStats(agg);
      } catch (e) {
        console.error(e);
      }
    },
    [todayISO]
  );

  const fetchTodayTasks = useCallback(
    async (goalId: string) => {
      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("*")
          .eq("goal_id", goalId)
          .eq("day", todayISO)
          .order("created_at", { ascending: true })
          .limit(5);

        if (error) throw error;
        const list = (data || []) as Challenge[];
        setTodayTasks(list);

        const done = list.filter((t) => t.status === "done").length;
        const total = list.length;
        setTodayStats((prev) => ({ ...prev, [goalId]: { done, total } }));
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las tareas de hoy");
      }
    },
    [todayISO]
  );

  const reloadToday = useCallback(async () => {
    if (selectedGoalId) await fetchTodayTasks(selectedGoalId);
  }, [fetchTodayTasks, selectedGoalId]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (user) fetchGoals();
  }, [user, fetchGoals]);

  useEffect(() => {
    if (selectedGoalId) fetchTodayTasks(selectedGoalId);
    else setTodayTasks([]);
  }, [selectedGoalId, fetchTodayTasks]);

  // ---------- DERIVED ----------
  const selectedStats = todayStats[selectedGoalId ?? ""] || { done: 0, total: 0 };
  const doneCount = selectedStats.done;
  const totalCount = selectedStats.total;

  const dayProgress = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((doneCount / totalCount) * 100);
  }, [doneCount, totalCount]);

  // ---------- REWARD WHEN ALL DONE ----------
  const maybeAwardAndCelebrate = useCallback(async () => {
    if (!selectedGoal || totalCount === 0) return;
    const alreadyRewarded = localStorage.getItem(rewardKey(selectedGoal.id));
    if (alreadyRewarded) return;

    const allDone = doneCount === totalCount && totalCount > 0;
    if (!allDone) return;

    try {
      const newXp = (selectedGoal.xp || 0) + 10;
      const newStreak = (selectedGoal.streak || 0) + 1;

      const { error } = await supabase
        .from("goals")
        .update({ xp: newXp, streak: newStreak })
        .eq("id", selectedGoal.id);

      if (error) throw error;

      localStorage.setItem(rewardKey(selectedGoal.id), "1");

      try {
        const mod = await import("canvas-confetti");
        const confetti = mod.default;
        confetti({ particleCount: 160, spread: 75, origin: { y: 0.7 } });
      } catch {}
      toast.success("¡Todo hecho por hoy! +10 XP 🔥 +1 racha");

      fetchGoals();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo aplicar la recompensa");
    }
  }, [selectedGoal, doneCount, totalCount, rewardKey, fetchGoals]);

  useEffect(() => {
    maybeAwardAndCelebrate();
  }, [doneCount, totalCount, selectedGoal?.id, maybeAwardAndCelebrate]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* HERO / header */}
      <div
        className="rounded-b-3xl p-4 pb-6 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hola 👋</h1>
            <p className="text-white/90 text-sm">
              {goals.length > 0 ? "Tus objetivos activos" : "Crea tu primer objetivo"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carrusel horizontal de objetivos */}
        {goals.length > 0 ? (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x">
            {goals.map((g) => {
              const stats = todayStats[g.id] || { done: 0, total: 0 };
              const prog = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
              return (
                <div key={g.id} className="snap-start">
                  <GoalPillCard
                    goal={g}
                    selected={selectedGoalId === g.id}
                    onSelect={() => setSelectedGoalId(g.id)}
                    dayProgress={prog}
                    todayCount={stats.total}
                    doneCount={stats.done}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Button
            className="w-full mt-4 bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/onboarding")}
          >
            <Target className="h-5 w-5 mr-2" />
            Crear objetivo
          </Button>
        )}

        {/* Stats rápidos */}
        {selectedGoal && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 mx-auto mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{selectedGoal.streak}</div>
                <div className="text-xs text-white/80">días</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{selectedGoal.hearts}</div>
                <div className="text-xs text-white/80">vidas</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 mx-auto mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{selectedGoal.xp}</div>
                <div className="text-xs text-white/80">XP</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Contenido inferior: tareas del objetivo seleccionado */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tareas de hoy</h2>
          {selectedGoal && (
            <Badge className="rounded-full">
              {getCategoryIcon(selectedGoal.category)} {selectedGoal.title}
            </Badge>
          )}
        </div>

        {/* Progreso del día */}
        <div className="rounded-xl border border-border/60 p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progreso diario</span>
            <span className="text-muted-foreground">{dayProgress}%</span>
          </div>
          <Progress value={dayProgress} className="h-2" />
          <div className="mt-1 text-xs text-muted-foreground">
            Hoy: {doneCount}/{totalCount} tareas
          </div>
        </div>

        {/* Lista 3–5 tareas */}
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((t) => (
              <DailyTaskItem
                key={t.id}
                task={t}
                onStatusChange={() => reloadToday()}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Aún no hay tareas generadas para hoy en este objetivo.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
