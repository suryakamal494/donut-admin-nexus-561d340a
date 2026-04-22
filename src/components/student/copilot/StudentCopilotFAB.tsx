import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentCopilotFAB = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on copilot page itself
  if (location.pathname.startsWith("/student/copilot")) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/student/copilot")}
      aria-label="Open Copilot"
      className={cn(
        "fixed z-40 right-4",
        "bottom-24 lg:bottom-6",
        "flex items-center gap-2 pl-4 pr-5 h-12 rounded-full",
        "bg-gradient-to-r from-donut-coral to-donut-orange text-white",
        "shadow-lg shadow-donut-coral/30 hover:shadow-xl hover:shadow-donut-coral/40",
        "hover:scale-105 active:scale-95 transition-all duration-200",
        "ring-1 ring-white/20"
      )}
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-semibold text-sm">Copilot</span>
    </button>
  );
};

export default StudentCopilotFAB;