import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  ClipboardCheck, 
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Home", path: "/teacher/dashboard" },
  { icon: Calendar, label: "Schedule", path: "/teacher/schedule" },
  { icon: BookOpen, label: "Plans", path: "/teacher/lesson-plans" },
  { icon: ClipboardCheck, label: "Exams", path: "/teacher/exams" },
  { icon: BarChart3, label: "Reports", path: "/teacher/reports" },
];

const TeacherBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/teacher/dashboard") {
      return location.pathname === path || location.pathname === "/teacher";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl bottom-nav-curved safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-200",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                active && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  active && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TeacherBottomNav;
