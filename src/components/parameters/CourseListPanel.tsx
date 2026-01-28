import { BookOpen, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { courses, getChapterCountForCourse } from "@/data/masterData";
import { Course } from "@/types/masterData";

interface CourseListPanelProps {
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
  onEditCourse?: (course: Course) => void;
}

const courseTypeStyles: Record<string, string> = {
  competitive: "bg-coral-500/10 text-coral-600 dark:text-coral-400",
  foundation: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  olympiad: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export const CourseListPanel = ({ selectedCourseId, onSelectCourse, onEditCourse }: CourseListPanelProps) => {
  return (
    <div className="flex flex-col h-full border-r border-border/50">
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Courses
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{courses.length} courses</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {courses.map((course) => {
            const chapterCount = getChapterCountForCourse(course.id);
            const isSelected = selectedCourseId === course.id;
            
            return (
              <button
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-all",
                  isSelected
                    ? "gradient-button text-white shadow-md"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate",
                      isSelected ? "text-white" : "text-foreground"
                    )}>
                      {course.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-4 border-0",
                          isSelected ? "bg-white/20 text-white" : courseTypeStyles[course.courseType]
                        )}
                      >
                        {course.courseType}
                      </Badge>
                      {course.status === 'draft' && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4 border-0",
                            isSelected ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {onEditCourse && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7",
                          isSelected ? "hover:bg-white/20 text-white" : "hover:bg-muted"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCourse(course);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full min-w-[32px] text-center",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    )}>
                      {chapterCount}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
