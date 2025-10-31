import { NavLink } from "react-router-dom";
import { Home, Target, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

export const BottomNav = () => {
  const { t } = useI18n();
  const base = "flex flex-col items-center justify-center gap-1 text-xs";
  const active = "text-primary";
  const inactive = "text-muted-foreground";

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-background/98 backdrop-blur-lg border-t-2 border-border shadow-card z-50">
      <div className="max-w-2xl mx-auto grid grid-cols-4 py-3">
        <NavLink to="/home" className={({ isActive }) => cn(base, isActive ? active : inactive, "transition-all hover:scale-105")}>
          <Home className="h-6 w-6" />
          <span className="font-bold">{t("home")}</span>
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => cn(base, isActive ? active : inactive, "transition-all hover:scale-105")}>
          <Target className="h-6 w-6" />
          <span className="font-bold">{t("goals")}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => cn(base, isActive ? active : inactive, "transition-all hover:scale-105")}>
          <User className="h-6 w-6" />
          <span className="font-bold">{t("profile")}</span>
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => cn(base, isActive ? active : inactive, "transition-all hover:scale-105")}>
          <TrendingUp className="h-6 w-6" />
          <span className="font-bold">{t("growth")}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;