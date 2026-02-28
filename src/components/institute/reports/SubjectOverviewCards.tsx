import { TrendingUp, TrendingDown, Minus, AlertTriangle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SubjectSummary } from "@/data/institute/reportsData";

interface SubjectOverviewCardsProps {
  subjects: SubjectSummary[];
  onSubjectClick: (subjectId: string) => void;
}

const SubjectOverviewCards = ({ subjects, onSubjectClick }: SubjectOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {subjects.map((subject, i) => {
        const TrendIcon = subject.trend === "up" ? TrendingUp : subject.trend === "down" ? TrendingDown : Minus;
        const trendDiff = Math.abs(subject.classAverage - subject.previousAverage);

        return (
          <motion.div
            key={subject.subjectId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98] overflow-hidden border-0 shadow-sm h-full"
              onClick={() => onSubjectClick(subject.subjectId)}
            >
              {/* Subject color strip */}
              <div
                className="h-1"
                style={{ background: `hsl(${subject.subjectColor})` }}
              />
              <CardContent className="p-2.5 sm:p-3">
                {/* Subject name + trend */}
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground leading-tight truncate">
                    {subject.subjectName}
                  </h4>
                  <div className={cn(
                    "flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0",
                    subject.trend === "up" ? "bg-emerald-100 text-emerald-700" :
                    subject.trend === "down" ? "bg-red-100 text-red-700" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <TrendIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {trendDiff > 0 ? `${trendDiff}%` : "—"}
                  </div>
                </div>

                {/* Teacher */}
                <div className="flex items-center gap-1 mb-2">
                  <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{subject.teacherName}</span>
                </div>

                {/* Average + At Risk row */}
                <div className="flex items-center justify-between border-t border-border/40 pt-1.5">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-foreground">{subject.classAverage}%</span>
                    <span className="text-[10px] text-muted-foreground ml-1">avg</span>
                  </div>
                  {subject.atRiskCount > 0 && (
                    <div className="flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3 text-destructive" />
                      <span className="text-[10px] sm:text-xs font-semibold text-destructive">{subject.atRiskCount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SubjectOverviewCards;
