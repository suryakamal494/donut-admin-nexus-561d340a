import { Timer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GeneratedHomework, getBatchDisplayName } from "./types";

interface AIHomeworkPreviewProps {
  generatedHomework: GeneratedHomework;
  title: string;
  batchId: string;
  subject: string;
  dueDate: string;
  isMobile?: boolean;
}

export function AIHomeworkPreview({
  generatedHomework,
  title,
  batchId,
  subject,
  dueDate,
  isMobile = false,
}: AIHomeworkPreviewProps) {
  return (
    <ScrollArea className={cn("pr-2", isMobile ? "max-h-[60vh]" : "max-h-[55vh]")}>
      <div className="space-y-4 pb-4">
        {/* Generated Title & Description */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-1">
            {generatedHomework.title || title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {generatedHomework.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {generatedHomework.estimatedTime && (
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {generatedHomework.estimatedTime} mins
              </span>
            )}
            {generatedHomework.totalMarks && (
              <span>Total: {generatedHomework.totalMarks} marks</span>
            )}
          </div>
        </div>

        {/* Instructions */}
        {generatedHomework.instructions?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Instructions</Label>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              {generatedHomework.instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-medium">{idx + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tasks */}
        {generatedHomework.tasks?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tasks ({generatedHomework.tasks.length})</Label>
            <div className="space-y-2">
              {generatedHomework.tasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="p-3 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground">{task.content}</p>
                    {task.marks && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {task.marks}m
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-2">
                    {task.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Assign to:</span>
            <Badge variant="outline">{getBatchDisplayName(batchId)}</Badge>
            <Badge variant="outline">{subject}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">Due: {dueDate}</span>
        </div>
      </div>
    </ScrollArea>
  );
}
