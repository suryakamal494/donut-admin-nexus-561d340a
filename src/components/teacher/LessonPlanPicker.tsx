import { useState, useMemo } from "react";
import { 
  Search, 
  BookOpen, 
  Check,
  Clock,
  CheckCircle2,
  FileEdit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { teacherLessonPlans } from "@/data/teacher/lessonPlans";

export interface LessonPlanItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  batchName: string;
  status: 'draft' | 'ready' | 'used';
  topics?: string[];
  description?: string;
  totalDuration?: number;
}

const statusConfig: Record<LessonPlanItem['status'], { icon: typeof Clock; color: string; bgColor: string; label: string }> = {
  draft: { icon: FileEdit, color: "text-amber-600", bgColor: "bg-amber-50", label: "Draft" },
  ready: { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", label: "Ready" },
  used: { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", label: "Used" },
};

interface LessonPlanPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (plan: LessonPlanItem) => void;
}

export const LessonPlanPicker = ({
  open,
  onOpenChange,
  onSelect,
}: LessonPlanPickerProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<LessonPlanItem['status'] | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<LessonPlanItem | null>(null);

  // Convert teacher lesson plans to picker format
  const lessonPlanItems: LessonPlanItem[] = useMemo(() => {
    return teacherLessonPlans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      subject: plan.subject,
      chapter: plan.chapter,
      batchName: plan.batchName,
      status: plan.status as LessonPlanItem['status'],
      topics: plan.topics,
      totalDuration: plan.totalDuration,
    }));
  }, []);

  const filteredPlans = useMemo(() => {
    return lessonPlanItems.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus, lessonPlanItems]);

  // Group by batch
  const groupedPlans = useMemo(() => {
    const groups: Record<string, LessonPlanItem[]> = {};
    filteredPlans.forEach((plan) => {
      if (!groups[plan.batchName]) {
        groups[plan.batchName] = [];
      }
      groups[plan.batchName].push(plan);
    });
    return groups;
  }, [filteredPlans]);

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
      setSearchQuery("");
    }
  };

  const PickerContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lesson plans..."
          className="pl-10 h-10"
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setSelectedStatus('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors",
            selectedStatus === 'all'
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          All
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as LessonPlanItem['status'])}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors",
                selectedStatus === status
                  ? `${config.bgColor} ${config.color}`
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Lesson Plans List - Grouped by Batch */}
      <ScrollArea className={cn(isMobile ? "h-[45vh]" : "h-[40vh]")}>
        <div className="space-y-4 pr-2">
          {Object.keys(groupedPlans).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No lesson plans found
            </div>
          ) : (
            Object.entries(groupedPlans).map(([batchName, plans]) => (
              <div key={batchName}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    {batchName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {plans.length} plan{plans.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {plans.map((item) => {
                    const config = statusConfig[item.status];
                    const StatusIcon = config.icon;
                    const isSelected = selectedItem?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          config.bgColor
                        )}>
                          <BookOpen className={cn("w-5 h-5", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium text-foreground line-clamp-1">
                              {item.title}
                            </h4>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.chapter} • {item.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs py-0", config.bgColor, config.color)}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            {item.totalDuration && (
                              <span className="text-xs text-muted-foreground">
                                {item.totalDuration} mins
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Selected Topics Preview */}
      {selectedItem?.topics && selectedItem.topics.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground mb-1.5">Topics covered:</p>
          <div className="flex flex-wrap gap-1">
            {selectedItem.topics.slice(0, 3).map((topic, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0">
                {topic}
              </Badge>
            ))}
            {selectedItem.topics.length > 3 && (
              <Badge variant="outline" className="text-xs py-0">
                +{selectedItem.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-10"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSelect}
          disabled={!selectedItem}
          className="flex-1 h-10"
        >
          Select Lesson Plan
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2 border-b">
            <DrawerTitle>Select Lesson Plan</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <PickerContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Select Lesson Plan</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">
          <PickerContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};
