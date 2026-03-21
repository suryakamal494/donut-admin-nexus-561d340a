import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DocsSidebar } from "./DocsSidebar";
import { DocsSearch } from "./DocsSearch";
import { cn } from "@/lib/utils";
import { docsNavigation } from "@/data/docsNavigation";

function getBreadcrumbs(pathname: string) {
  const path = pathname.replace("/docs/", "").replace("/docs", "");
  if (!path) return [{ label: "Documentation", path: "/docs" }];

  const parts = path.split("/");
  const crumbs = [{ label: "Docs", path: "/docs" }];

  for (const section of docsNavigation) {
    for (const item of section.items) {
      if (item.path === path) {
        crumbs.push({ label: section.title, path: `/docs/${section.items[0].path}` });
        crumbs.push({ label: item.title, path: `/docs/${item.path}` });
        return crumbs;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            crumbs.push({ label: section.title, path: `/docs/${section.items[0].path}` });
            crumbs.push({ label: item.title, path: `/docs/${item.path}` });
            crumbs.push({ label: child.title, path: `/docs/${child.path}` });
            return crumbs;
          }
        }
      }
    }
  }

  let currentPath = "/docs";
  for (const part of parts) {
    currentPath += `/${part}`;
    crumbs.push({
      label: part.replace(/-/g, " ").replace(/^\d+-/, ""),
      path: currentPath,
    });
  }

  return crumbs;
}

export function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        {/* Row 1: menu + title + search */}
        <div className="flex h-12 items-center gap-2 px-3 md:px-6">
          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="font-semibold gradient-text text-sm">Documentation</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DocsSidebar onNavClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo / Title */}
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <Link
              to="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <Link to="/docs" className="font-semibold gradient-text text-sm md:text-lg truncate">
              📚 Docs
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-end min-w-0">
            <DocsSearch className="w-full max-w-xs" />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 px-3 md:px-6 pb-2 overflow-x-auto scrollbar-hide text-xs md:text-sm md:hidden">
          {breadcrumbs.map((crumb, index) => (
            <div key={`mobile-${index}-${crumb.path}`} className="flex items-center gap-1 shrink-0">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
              <Link
                to={crumb.path}
                className={cn(
                  "hover:text-primary transition-colors capitalize whitespace-nowrap",
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </div>
      </header>

      {/* Main content area - flex-1 with min-h-0 to enable child scrolling */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col w-72 border-r border-border shrink-0 min-h-0">
          <DocsSidebar className="flex-1 min-h-0" />
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Desktop breadcrumbs */}
          <div className="hidden lg:flex items-center gap-1 px-6 py-3 border-b border-border text-sm shrink-0">
            {breadcrumbs.map((crumb, index) => (
              <div key={`desktop-${index}-${crumb.path}`} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
                <Link
                  to={crumb.path}
                  className={cn(
                    "hover:text-primary transition-colors capitalize",
                    index === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Page content - this is the scroll container */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
