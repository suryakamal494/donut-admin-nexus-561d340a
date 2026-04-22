// Student Layout - Responsive wrapper with sidebar (desktop) and bottom nav (mobile)
// Completely separate from other portal layouts

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import StudentBottomNav from "./StudentBottomNav";
import StudentCopilotFAB from "../copilot/StudentCopilotFAB";

const StudentLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Auto-collapse sidebar on medium screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-orange-50/30 to-background">
      {/* Desktop Sidebar */}
      <StudentSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-64", // Default expanded sidebar width
          sidebarCollapsed && "lg:ml-20" // Collapsed sidebar width
        )}
      >
        {/* Header */}
        <StudentHeader />

        {/* Page Content */}
        <main className="p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <StudentBottomNav />

      {/* Copilot Floating Action Button */}
      <StudentCopilotFAB />
    </div>
  );
};

export default StudentLayout;
