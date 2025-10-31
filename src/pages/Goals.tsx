import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useI18n } from "@/contexts/I18nContext";

const Goals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🚫 Importante: todos los hooks ANTES de cualquier return condicional
  const { t } = useI18n();

  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadActiveCategories = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("user_categories")
        .select("category")
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) throw error;
      setActiveCategories((data ?? []).map((d) => d.category));
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error(t("error_loading_categories") || "Error al cargar objetivos");
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    // Redirige si no hay sesión
    if (!user) {
      navigate("/auth");
      return;
    }
    // Carga datos cuando hay sesión
    loadActiveCategories();
  }, [user, navigate, loadActiveCategories]);

  const toggleCategory = async (categoryId: string) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const isActive = activeCategories.includes(categoryId);

      if (isActive) {
        // Desactivar
        const { error } = await supabase
          .from("user_categories")
          .update({ active: false })
          .eq("user_id", user.id)
          .eq("category", categoryId);

        if (error) throw error;

        setActiveCategories((prev) => prev.filter((c) => c !== categoryId));
        toast.success(t("goal_deactivated") || "Objetivo desactivado");
      } else {
        // Activar (insertar o actualizar)
        const { error } = await supabase
          .from("user_categories")
          .upsert(
            {
              user_id: user.id,
              category: categoryId,
              active: true,
            },
            {
              onConflict: "user_id,category",
            }
          );

        if (error) throw error;

        setActiveCategories((prev) =>
          prev.includes(categoryId) ? prev : [...prev, categoryId]
        );
        toast.success(t("goal_activated") || "Objetivo activado");
      }
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error(t("error_updating_goal") || "Error al actualizar el objetivo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header - Duolingo Style */}
      <div className="bg-gradient-hero text-white p-6 shadow-button">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-black">{t("my_goals")}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-hover">
          <CardHeader>
            <CardTitle className="text-3xl font-black">
              {t("manage_goals")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("manage_goals_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {CATEGORIES.map((category) => {
              const isActive = activeCategories.includes(category.id);
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-5 rounded-2xl border-l-[6px] transition-all hover:shadow-button shadow-soft hover:scale-[1.02]"
                  style={{
                    borderLeftColor: category.color,
                    background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}25 100%)`,
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-4xl drop-shadow-sm">
                      {category.icon}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleCategory(category.id)}
                    disabled={saving}
                    className="scale-110"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Goals;
