import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export default function AppRoot() {
  return (
    <AuthProvider>
      {/* Todo lo que renderice el router vive DENTRO del Router y tiene acceso a useNavigate */}
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
