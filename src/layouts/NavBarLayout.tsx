import { Outlet } from "react-router-dom";
import BottomNavBar from "@/components/nav/BottomNavBar";

export default function NavBarLayout() {
  return (
    <div className="min-h-screen pb-24">
      <Outlet />
      <BottomNavBar />
    </div>
  );
}
