import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddChallengeFab() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/challenge/new")}
      aria-label="Agregar reto"
      className="fixed z-50 left-1/2 bottom-20 -translate-x-1/2 rounded-full shadow-xl border border-white/10"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="h-14 w-14 flex items-center justify-center text-white">
        <Plus className="h-7 w-7" />
      </div>
    </button>
  );
}
