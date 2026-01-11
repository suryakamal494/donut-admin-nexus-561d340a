import { useState } from "react";
import { Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ContentItem } from "@/components/content/ContentCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface TeacherBatch {
  id: string;
  name: string;
  students: number;
  class: string;
}

interface AssignContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentItem | null;
  teacherBatches: TeacherBatch[];
  onAssign?: (contentId: string, batchIds: string[]) => void;
}

export function AssignContentDialog({
  open,
  onOpenChange,
  content,
  teacherBatches,
  onAssign,
}: AssignContentDialogProps) {
  const { toast } = useToast();
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const handleToggleBatch = (batchId: string) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleAssign = () => {
    if (!content || selectedBatches.length === 0) return;

    onAssign?.(content.id, selectedBatches);

    toast({
      title: "Content Shared",
      description: `"${content.title}" has been shared with ${selectedBatches.length} batch${selectedBatches.length > 1 ? "es" : ""}.`,
    });

    setSelectedBatches([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedBatches([]);
    onOpenChange(false);
  };

  const totalStudents = teacherBatches
    .filter((b) => selectedBatches.includes(b.id))
    .reduce((sum, b) => sum + b.students, 0);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title="Share Content with Batches"
      description={content ? `Select batches to share "${content.title}"` : undefined}
      footer={
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedBatches.length === 0}
            className="flex-1 sm:flex-none gap-2"
          >
            <Users className="w-4 h-4" />
            Share with {selectedBatches.length > 0 ? `${selectedBatches.length} Batch${selectedBatches.length > 1 ? "es" : ""}` : "Batches"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Info message */}
        <p className="text-sm text-muted-foreground">
          Select one or more batches to share this content with students.
        </p>

        {/* Batch list */}
        <ScrollArea className="max-h-[300px] sm:max-h-[350px]">
          <div className="space-y-2 pr-2">
            {teacherBatches.map((batch) => {
              const isSelected = selectedBatches.includes(batch.id);
              return (
                <div
                  key={batch.id}
                  onClick={() => handleToggleBatch(batch.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleBatch(batch.id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {batch.students} students • {batch.class}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Selection summary */}
        {selectedBatches.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="font-medium">{selectedBatches.length}</span> batch
            {selectedBatches.length > 1 ? "es" : ""} selected •{" "}
            <span className="font-medium">{totalStudents}</span> total students
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
