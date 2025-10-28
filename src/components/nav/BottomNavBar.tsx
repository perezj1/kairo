import { NavLink, useLocation } from "react-router-dom";
import { Home, LineChart, History, User, TargetIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useTodayCounts from "@/hooks/useTodayCounts"; // opcional (para el badge)

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | undefined;
};

export default function BottomNavBar() {
  const { pathname } = useLocation();
  const { todayTasksCount } = useTodayCounts(); // si no lo usas, elimina esta línea y 'badge'

  const items: Item[] = [
    { to: "/", label: "Inicio", icon: Home },
    { to: "/progress", label: "Progreso", icon: LineChart },
    // 👇 Historial ahora abre /goals
    { to: "/goals", label: "Objetivos", icon: TargetIcon, badge: todayTasksCount || 0 },
    { to: "/profile", label: "Perfil", icon: User },
  ];

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <nav
        className={cn(
          "mx-auto max-w-md rounded-t-2xl border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80",
          "shadow-[0_-8px_24px_rgba(0,0,0,0.08)]",
          "border-border/50"
        )}
      >
        <ul className="grid grid-cols-4">
          {items.map(({ to, label, icon: Icon, badge }) => {
            const active = isActive(to);
            return (
              <li key={to} className="relative">
                <NavLink
                  to={to}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center text-[11px] select-none",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {!!badge && badge > 0 && (
                      <span
                        className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] leading-[18px] text-white text-center"
                        style={{ background: "var(--gradient-hero)" }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-1">{label}</span>
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                      active ? "bg-primary" : "bg-transparent"
                    )}
                  />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="h-[calc(env(safe-area-inset-bottom))]" />
    </div>
  );
}
