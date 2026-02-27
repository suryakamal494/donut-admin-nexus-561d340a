import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/reportColors";
import type { ChapterMastery } from "@/data/teacher/studentReportData";

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

interface ChapterMasteryCardProps {
  chapter: ChapterMastery;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ChapterMasteryCard = ({ chapter, isExpanded, onToggle }: ChapterMasteryCardProps) => {
  const colors = getStatusColor(chapter.status);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className={cn("flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-muted/40", colors.light)}>
          <div className={cn("shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm", colors.bg)}>
            {chapter.avgSuccessRate}%
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-semibold text-foreground truncate">{chapter.chapterName}</h4>
              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", colors.badge)}>{chapter.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{chapter.examsAppeared} exam{chapter.examsAppeared > 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{chapter.questionsAttempted} Q</span>
              <TrendIcon trend={chapter.trend} />
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-14 pr-3 pb-2 space-y-1 mt-1">
          {chapter.topics.map(topic => {
            const tc = getStatusColor(topic.status);
            return (
              <div key={topic.topicName} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/30">
                <span className="text-xs text-foreground">{topic.topicName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{topic.questionsAsked}Q</span>
                  <span className={cn("text-xs font-semibold", tc.text)}>{topic.accuracy}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
