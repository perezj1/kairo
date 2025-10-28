import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // o un spinner
  if (!user) return <Navigate to="/onboarding" state={{ from: location }} replace />;

  return <>{children}</>;
}
