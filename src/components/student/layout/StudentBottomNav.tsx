// Student Bottom Navigation - 3D depth floating design with pop-up effect
// Completely separate from other portal navigations

import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Bell,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Home", icon: Home, path: "/student/dashboard" },
  { id: "subjects", label: "Subjects", icon: BookOpen, path: "/student/subjects" },
  { id: "tests", label: "Tests", icon: Trophy, path: "/student/tests" },
  { id: "progress", label: "Progress", icon: TrendingUp, path: "/student/progress" },
];

const StudentBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/student/dashboard") {
      return location.pathname === "/student/dashboard" || location.pathname === "/student";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none lg:hidden">
      {/* Floating Navigation Container */}
      <nav className="pointer-events-auto max-w-md mx-auto">
        {/* Shadow layer for 3D depth effect */}
        <div className="absolute inset-x-4 bottom-2 h-16 bg-black/5 rounded-[2rem] blur-xl" />
        
        {/* Main navigation bar */}
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-black/10 border border-white/60 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300",
                    active 
                      ? "bg-gradient-to-b from-donut-coral to-donut-orange -translate-y-3 shadow-lg shadow-donut-coral/30" 
                      : "hover:bg-muted/50"
                  )}
                >
                  {/* Pop-up indicator for active state */}
                  {active && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 rounded-full" />
                  )}
                  
                  {/* Icon */}
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      active ? "text-white" : "text-muted-foreground"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  
                  {/* Label */}
                  <span 
                    className={cn(
                      "text-[10px] font-medium mt-0.5 transition-all duration-300",
                      active ? "text-white" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Notification badge */}
                  {item.badge && item.badge > 0 && (
                    <span 
                      className={cn(
                        "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full px-1 transition-all duration-300",
                        active 
                          ? "bg-white text-donut-coral -top-4 right-0" 
                          : "bg-gradient-to-br from-red-500 to-rose-500 text-white"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default StudentBottomNav;
