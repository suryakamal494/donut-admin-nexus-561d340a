// ProactiveCards — "What's on your plate today" driven by notifications
import React from "react";
import {
  BookOpen, Target, ClipboardList, BarChart3, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudentNotification } from "./types";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; gradient: string }> = {
  homework: { icon: ClipboardList, gradient: "from-blue-500 to-blue-600" },
  exam_reminder: { icon: Target, gradient: "from-donut-coral to-donut-orange" },
  chapter_today: { icon: BookOpen, gradient: "from-emerald-500 to-emerald-600" },
  debrief_available: { icon: BarChart3, gradient: "from-violet-500 to-violet-600" },
};

interface Props {
  notifications: StudentNotification[];
  onAction: (notif: StudentNotification) => void;
  onDismiss: (notifId: string) => void;
}

const ProactiveCards: React.FC<Props> = ({ notifications, onAction, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
        What's on your plate today
      </p>
      <div className="grid gap-2">
        {notifications.slice(0, 4).map((n) => {
          const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.chapter_today;
          const Icon = cfg.icon;
          return (
            <button
              key={n.id}
              onClick={() => onAction(n)}
              className="flex items-start gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors text-left group min-h-[44px]"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br text-white",
                  cfg.gradient
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{n.title}</p>
                {n.body && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {n.body}
                  </p>
                )}
                {n.subject && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground mt-1 inline-block">
                    {n.subject}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(n.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ProactiveCards);