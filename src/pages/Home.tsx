import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Target, ChevronLeft, ChevronRight, Globe, Flame, Trophy, Zap } from "lucide-react";
import { getCategoryIcon, getCategoryColor, getCategoryById } from "@/lib/categories";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useI18n } from "@/contexts/I18nContext";
import { shuffleTasks } from "@/lib/taskShuffler";

interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string | null;
}

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, cycle } = useI18n();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    totalXP: 0,
    currentStreak: 0,
    level: 1,
    username: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadTasks();
    loadUserStats();
  }, [user, navigate]);

  const loadUserStats = async () => {
    try {
      // Load profile info
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user?.id)
        .single();

      // Load completed tasks for XP calculation
      const { data: completedTasks } = await supabase
        .from('completed_tasks')
        .select('completed_at')
        .eq('user_id', user?.id)
        .eq('skipped', false);

      const totalXP = (completedTasks?.length || 0) * 10;
      const level = Math.floor(totalXP / 100) + 1;

      // Calculate current streak
      let currentStreak = 0;
      if (completedTasks && completedTasks.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dates = completedTasks.map(t => {
          const d = new Date(t.completed_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        });

        const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
        
        for (let i = 0; i < uniqueDates.length; i++) {
          const daysDiff = Math.floor((today.getTime() - uniqueDates[i]) / (1000 * 60 * 60 * 24));
          
          if (i === 0 && daysDiff <= 1) {
            currentStreak = 1;
          } else if (i > 0) {
            const prevDaysDiff = Math.floor((today.getTime() - uniqueDates[i-1]) / (1000 * 60 * 60 * 24));
            if (daysDiff === prevDaysDiff + 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }

      setStats({
        totalXP,
        currentStreak,
        level,
        username: profile?.username || user?.email?.split('@')[0] || 'Usuario',
        avatarUrl: profile?.avatar_url || ''
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data: userCategories } = await supabase
        .from("user_categories")
        .select("category")
        .eq("user_id", user?.id)
        .eq("active", true);

      if (!userCategories || userCategories.length === 0) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const activeCategories = userCategories.map((uc) => uc.category);
      const { data: tasksData, error } = await supabase
        .from("tasks")
        .select("*")
        .in("category", activeCategories);

      if (error) throw error;
      
      // Shuffle tasks to avoid consecutive tasks from same category
      const shuffled = shuffleTasks(tasksData || []);
      setTasks(shuffled);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar tus tareas");
    } finally {
      setLoading(false);
    }
  };

  const current = tasks[currentIndex];

  const handleComplete = useCallback(async () => {
    if (!current) return;
    try {
      await supabase.from("completed_tasks").insert({
        user_id: user?.id,
        task_id: current.id,
        completed_at: new Date().toISOString(),
        skipped: false,
      });
      toast.success("¡Tarea completada! 🎉");
      setCurrentIndex((i) => Math.min(i + 1, tasks.length - 1));
    } catch (e) {
      console.error(e);
      toast.error("Error al completar la tarea");
    }
  }, [current, tasks.length, user?.id]);

  const handleSkip = useCallback(async () => {
    if (!current) return;
    try {
      await supabase.from("completed_tasks").insert({
        user_id: user?.id,
        task_id: current.id,
        completed_at: new Date().toISOString(),
        skipped: true,
      });
      toast.info("Tarea omitida");
      setCurrentIndex((i) => Math.min(i + 1, tasks.length - 1));
    } catch (e) {
      console.error(e);
      toast.error("Error al omitir la tarea");
    }
  }, [current, tasks.length, user?.id]);

  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const next = () => setCurrentIndex((i) => Math.min(i + 1, tasks.length - 1));

  // Touch handlers for swipe gestures
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-6 shadow-button">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black">{t("app_name")}</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={cycle}>
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => navigate("/goals")}>
              <Target className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">{t("no_tasks_title")}</h2>
            <p className="text-muted-foreground mb-6">{t("no_tasks_desc")}</p>
            <Button onClick={() => navigate("/settings")}>{t("go_settings")}</Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      {/* Header - Duolingo Style */}
      <div className="bg-gradient-hero text-white p-6 shadow-button">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black">{t("app_name")}</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={cycle}>
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => navigate("/goals")}>
                <Target className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => navigate("/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Stats - Duolingo Style */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-button border-2 border-white/20">
            <div className="flex items-center gap-4 mb-5">
              <Avatar 
                className="h-20 w-20 border-4 border-white cursor-pointer hover:scale-105 transition-all shadow-lg"
                onClick={() => navigate("/profile")}
              >
                <AvatarImage src={stats.avatarUrl} />
                <AvatarFallback className="bg-white text-primary text-2xl font-black">
                  {stats.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-black text-2xl drop-shadow-sm">{stats.username}</p>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Trophy className="h-5 w-5 text-yellow-300 drop-shadow-sm" />
                  <span className="bg-white/30 px-3 py-1 rounded-full font-bold">{t("level")} {stats.level}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/25 transition-all">
                <Zap className="h-8 w-8 text-yellow-300 drop-shadow-md" />
                <div>
                  <p className="text-xs opacity-90 uppercase tracking-wider font-bold">XP</p>
                  <p className="font-black text-2xl drop-shadow-sm">{stats.totalXP}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/25 transition-all">
                <Flame className="h-8 w-8 text-orange-300 drop-shadow-md" />
                <div>
                  <p className="text-xs opacity-90 uppercase tracking-wider font-bold">{t("streak")}</p>
                  <p className="font-black text-2xl drop-shadow-sm">{stats.currentStreak}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Card - Duolingo Style */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card 
            className="w-full shadow-hover" 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <CardContent className="p-10 text-center relative">
              {/* Category color indicator at top */}
              <div 
                className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                style={{ backgroundColor: getCategoryColor(current.category) }}
              />

              <div className="mb-6 mt-2">
                <div className="text-8xl mb-8 animate-scale-in">{current.icon || getCategoryIcon(current.category)}</div>
                <div 
                  className="inline-block px-5 py-2 rounded-full text-white text-sm font-black mb-6 uppercase tracking-wider shadow-button"
                  style={{ backgroundColor: getCategoryColor(current.category) }}
                >
                  {getCategoryById(current.category)?.name || current.category.replace(/_/g, " ")}
                </div>
                <h2 className="text-3xl font-black mb-6 leading-tight text-foreground">{current.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{current.description}</p>
              </div>

              <div className="flex flex-col gap-4 mt-10">
                <Button 
                  className="w-full shadow-button hover:scale-[1.02] transition-transform" 
                  size="lg" 
                  onClick={handleComplete}
                  variant="success"
                >
                  {t("complete")}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full hover:scale-[1.02] transition-transform" 
                  size="lg" 
                  onClick={handleSkip}
                >
                  {t("skip")}
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-base text-muted-foreground">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={prev} 
                  disabled={currentIndex === 0}
                  className="hover:scale-110 transition-transform rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-xl text-primary">{currentIndex + 1}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-lg">{tasks.length}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={next} 
                  disabled={currentIndex >= tasks.length - 1}
                  className="hover:scale-110 transition-transform rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-mint/5 text-center text-xs text-muted-foreground">
        <p>{t("interact_hint")}</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home; 
