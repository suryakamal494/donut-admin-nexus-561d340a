// Classroom Mode - Displays lesson bundles with integrated homework

import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { BookOpen, ClipboardList } from "lucide-react";
import { LessonBundleCard } from "./LessonBundleCard";
import { VirtualizedList } from "./VirtualizedList";
import { HomeworkSubmissionSheet } from "@/components/student/homework";
import { useToast } from "@/hooks/use-toast";
import type { LessonBundle, HomeworkItem } from "@/data/student/lessonBundles";

interface ClassroomModeProps {
  lessonBundles: LessonBundle[];
  homeworkItems: HomeworkItem[];
}

// Haptic feedback helper
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

export function ClassroomMode({ lessonBundles, homeworkItems }: ClassroomModeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  
  // Homework submission sheet state
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [submissionSheetOpen, setSubmissionSheetOpen] = useState(false);

  // Group homework by linked session ID
  const homeworkByBundle = useMemo(() => {
    const map = new Map<string, HomeworkItem[]>();
    homeworkItems.forEach(hw => {
      if (hw.linkedSessionId) {
        const existing = map.get(hw.linkedSessionId) || [];
        existing.push(hw);
        map.set(hw.linkedSessionId, existing);
      }
    });
    return map;
  }, [homeworkItems]);

  // Standalone homework (not linked to any session)
  const standaloneHomework = useMemo(() => {
    return homeworkItems.filter(hw => !hw.linkedSessionId);
  }, [homeworkItems]);

  // Memoize handlers
  const handleBundleClick = useCallback((bundleId: string) => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}`);
  }, [navigate, subjectId, chapterId]);

  const handleHomeworkClick = useCallback((homeworkId: string) => {
    triggerHaptic();
    const homework = homeworkItems.find(hw => hw.id === homeworkId);
    
    if (homework) {
      if (homework.homeworkType === 'test') {
        // Navigate directly to test player for test-type homework
        const testId = homework.testId || homework.id;
        navigate(`/student/tests/${testId}`);
      } else {
        // Open submission sheet for practice/project
        setSelectedHomework(homework);
        setSubmissionSheetOpen(true);
      }
    }
  }, [homeworkItems, navigate]);

  // Render function for virtualized list
  const renderBundle = useCallback((bundle: LessonBundle) => {
    const linkedHomework = homeworkByBundle.get(bundle.id) || [];
    return (
      <LessonBundleCard
        bundle={bundle}
        linkedHomework={linkedHomework}
        onClick={() => handleBundleClick(bundle.id)}
        onHomeworkClick={handleHomeworkClick}
      />
    );
  }, [handleBundleClick, handleHomeworkClick, homeworkByBundle]);

  const getBundleKey = useCallback((bundle: LessonBundle) => bundle.id, []);

  return (
    <div className="space-y-4">
      {/* Lesson Bundles Section Header */}
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-600" />
        <h2 className="text-xs md:text-sm font-semibold text-foreground">CLASS SESSIONS</h2>
        <span className="text-xs text-muted-foreground">({lessonBundles.length})</span>
      </div>

      {/* Virtualized lesson bundles with integrated homework */}
      <VirtualizedList
        items={lessonBundles}
        renderItem={renderBundle}
        getItemKey={getBundleKey}
        estimatedItemHeight={90}
        emptyMessage="No class sessions yet for this chapter"
        emptyIcon={<BookOpen className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/40 mx-auto" />}
      />

      {/* Standalone Homework Section (not linked to any session) */}
      {standaloneHomework.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 px-1">
            <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
            <h2 className="text-xs md:text-sm font-semibold text-foreground">ASSIGNMENTS</h2>
            <span className="text-xs text-muted-foreground">({standaloneHomework.length})</span>
          </div>

          <div className="space-y-2">
            {standaloneHomework.map(hw => (
              <StandaloneHomeworkCard
                key={hw.id}
                homework={hw}
                onClick={() => handleHomeworkClick(hw.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Homework Submission Sheet */}
      <HomeworkSubmissionSheet
        homework={selectedHomework}
        open={submissionSheetOpen}
        onOpenChange={setSubmissionSheetOpen}
      />
    </div>
  );
}

// Standalone Homework Card Component
import { memo } from "react";
import { format, parseISO, isPast, differenceInDays } from "date-fns";
import { ChevronRight, AlertCircle, CheckCircle2, FileText, PlayCircle, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface StandaloneHomeworkCardProps {
  homework: HomeworkItem;
  onClick: () => void;
}

const homeworkTypeConfig = {
  practice: {
    icon: FileText,
    label: "Practice",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  test: {
    icon: PlayCircle,
    label: "Online Test",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  project: {
    icon: FolderOpen,
    label: "Project",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

const StandaloneHomeworkCard = memo(function StandaloneHomeworkCard({
  homework,
  onClick,
}: StandaloneHomeworkCardProps) {
  const dueDate = parseISO(homework.dueDate);
  const isOverdue = isPast(dueDate) && !homework.isCompleted;
  const daysUntilDue = differenceInDays(dueDate, new Date());
  const isUrgent = daysUntilDue <= 1 && daysUntilDue >= 0;
  
  const typeConfig = homeworkTypeConfig[homework.homeworkType];
  const TypeIcon = typeConfig.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-xl border",
        "p-3 shadow-sm hover:shadow-md transition-all duration-300",
        "active:scale-[0.98]",
        isOverdue && "border-red-300 bg-red-50/50",
        isUrgent && !isOverdue && "border-amber-300 bg-amber-50/50",
        !isOverdue && !isUrgent && "border-white/50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={cn(
          "p-2 rounded-lg",
          typeConfig.bgColor
        )}>
          <TypeIcon className={cn("w-4 h-4", typeConfig.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "text-xs font-medium",
              typeConfig.color
            )}>
              {typeConfig.label}
            </span>
            {homework.isCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>
          
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
            {homework.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {isOverdue ? (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            ) : isUrgent ? (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                Due today
              </span>
            ) : (
              <span>Due {format(dueDate, "MMM d")}</span>
            )}
            
            {homework.questionsCount > 0 && (
              <>
                <span>•</span>
                <span>{homework.questionsCount} questions</span>
              </>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors flex-shrink-0" />
      </div>
    </button>
  );
});

export default ClassroomMode;
