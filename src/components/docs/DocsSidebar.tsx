import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { docsNavigation, DocNavItem } from "@/data/docsNavigation";

interface DocsSidebarProps {
  className?: string;
  onNavClick?: () => void;
}

function NavItem({
  item,
  depth = 0,
  onNavClick,
}: {
  item: DocNavItem;
  depth?: number;
  onNavClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === `/docs/${item.path}`;
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(
    hasChildren &&
      item.children?.some((child) =>
        location.pathname.startsWith(`/docs/${child.path}`)
      )
  );

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
              "hover:bg-accent/50 text-foreground/80 hover:text-foreground",
              depth > 0 && "pl-6"
            )}
          >
            <span>{item.title}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-2 border-l border-border pl-2">
            {item.children?.map((child) => (
              <NavItem
                key={child.path}
                item={child}
                depth={depth + 1}
                onNavClick={onNavClick}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <NavLink
      to={`/docs/${item.path}`}
      onClick={onNavClick}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/70 hover:bg-accent/50 hover:text-foreground",
          depth > 0 && "pl-6"
        )
      }
    >
      {item.title}
    </NavLink>
  );
}

export function DocsSidebar({ className, onNavClick }: DocsSidebarProps) {
  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="p-4 space-y-6">
        {docsNavigation.map((section) => (
          <div key={section.title}>
            <h3
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-semibold",
                section.color
              )}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </h3>
            <div className="mt-1 space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} onNavClick={onNavClick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
