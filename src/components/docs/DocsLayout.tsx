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

  // Find matching section and item
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

  // Fallback breadcrumb from path
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold gradient-text">Documentation</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DocsSidebar onNavClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/docs" className="font-semibold gradient-text text-lg">
              📚 DonutAI Docs
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-end">
            <DocsSearch className="w-full max-w-xs" />
          </div>
        </div>

        {/* Breadcrumbs - Mobile/Tablet */}
        <div className="flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-hide text-sm lg:hidden">
          {breadcrumbs.map((crumb, index) => (
            <div key={`mobile-${index}-${crumb.path}`} className="flex items-center gap-1 shrink-0">
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
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 border-r border-border shrink-0">
          <DocsSidebar className="sticky top-14 h-[calc(100vh-3.5rem)]" />
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          {/* Desktop breadcrumbs */}
          <div className="hidden lg:flex items-center gap-1 px-6 py-3 border-b border-border text-sm">
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

          {/* Page content */}
          <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-6.5rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
