import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle } from "lucide-react";

type Goal = { id: string; title: string; active: boolean };

type DraftTask = { text: string; minutes: number; kind: "accion" | "educacion" | "reflexion" };

const defaultDrafts: DraftTask[] = [
  { text: "", minutes: 10, kind: "accion" },
  { text: "", minutes: 10, kind: "educacion" },
  { text: "", minutes: 10, kind: "reflexion" },
];

export default function ChallengeNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalId, setGoalId] = useState<string>("");
  const [drafts, setDrafts] = useState<DraftTask[]>(defaultDrafts);
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const loadGoals = async () => {
      const { data, error } = await supabase.from("goals").select("id,title,active").eq("user_id", user?.id).eq("active", true);
      if (error) {
        toast.error("No se pudieron cargar tus objetivos");
        return;
      }
      setGoals((data as Goal[]) || []);
      if (data?.length) setGoalId(data[0].id);
    };
    loadGoals();
  }, [user]);

  const setDraft = (i: number, patch: Partial<DraftTask>) => {
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const addDraft = () => {
    if (drafts.length >= 5) return toast.message("Máximo 5 tareas por día");
    setDrafts((prev) => [...prev, { text: "", minutes: 10, kind: "accion" }]);
  };

  const save = async () => {
    if (!goalId) return toast.error("Elige un objetivo");
    const rows = drafts
      .filter((d) => d.text.trim().length > 0)
      .map((d) => ({ goal_id: goalId, day: today, text: d.text.trim(), minutes: d.minutes, kind: d.kind, status: "pending" }));

    if (rows.length === 0) return toast.error("Añade al menos una tarea");

    setSaving(true);
    const { error } = await supabase.from("challenges").insert(rows);
    setSaving(false);

    if (error) {
      toast.error("No se pudieron crear las tareas");
      return;
    }
    toast.success("Tareas de hoy creadas");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Volver
      </Button>

      <Card className="shadow-card">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Agregar reto (tareas de hoy)</h1>

          <div className="grid gap-3">
            <Label>Objetivo</Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger><SelectValue placeholder="Selecciona objetivo" /></SelectTrigger>
              <SelectContent>
                {goals.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {drafts.map((d, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="p-4 grid gap-3">
                  <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Input
                      placeholder="Ej: Caminar 15 minutos"
                      value={d.text}
                      onChange={(e) => setDraft(i, { text: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Minutos</Label>
                      <Input
                        type="number"
                        min={5}
                        max={90}
                        value={d.minutes}
                        onChange={(e) => setDraft(i, { minutes: Math.max(1, Number(e.target.value || 0)) })}
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={d.kind} onValueChange={(v: any) => setDraft(i, { kind: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accion">Acción</SelectItem>
                          <SelectItem value="educacion">Educación</SelectItem>
                          <SelectItem value="reflexion">Reflexión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={addDraft} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Añadir tarea
            </Button>
          </div>

          <Button onClick={save} disabled={saving} className="w-full h-12">
            Guardar tareas de hoy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
