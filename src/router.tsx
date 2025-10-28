import { createBrowserRouter } from "react-router-dom";
import AppRoot from "@/layouts/AppRoot";
import NavBarLayout from "@/layouts/NavBarLayout";
import RequireAuth from "@/routes/RequireAuth";

// pages
import Home from "@/pages/Home";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import NewChallenge from "@/pages/NewChallenge";
import Challenge from "@/pages/Challenge";
import Onboarding from "@/pages/Onboarding";   // si tienes página pública de inicio/registro
import Auth from "@/pages/Auth";               // si tienes login
import Goals from "./pages/Goals";

export const router = createBrowserRouter([
  {
    element: <AppRoot />,                     // ← AQUÍ va AuthProvider (dentro del Router)
    children: [
      // Rutas públicas (si las tienes)
      { path: "/onboarding", element: <Onboarding /> },
      { path: "/auth", element: <Auth /> },

      // Rutas protegidas con tu barra inferior
      {
        element: (
          <RequireAuth>
            <NavBarLayout />
          </RequireAuth>
        ),
        children: [
          { path: "/", element: <Home /> },
          { path: "/progress", element: <Progress /> },
          { path: "/history", element: <Goals /> },
          { path: "/profile", element: <Profile /> },          
          { path: "*", element: <Home /> },
          { path: "/goals", element: <Goals /> },
        ],
      },
    ],
  },
]);
