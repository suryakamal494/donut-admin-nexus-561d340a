import { CheckCircle, AlertTriangle, XCircle, BarChart3, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import type { ChapterTopicAnalysis } from "@/data/teacher/reportsData";

interface TopicHeatmapGridProps {
  topics: ChapterTopicAnalysis[];
}

export const TopicHeatmapGrid = ({ topics }: TopicHeatmapGridProps) => (
  <Card className="card-premium">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        Topic Heatmap
        <InfoTooltip content="Each percentage shows the average success rate — the % of students who answered questions on this topic correctly across all exams." />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {topics.map((topic, i) => {
          const colors = getPerformanceColor(topic.avgSuccessRate);
          const StatusIcon = topic.avgSuccessRate >= 75 ? CheckCircle :
            topic.avgSuccessRate >= 50 ? AlertCircle :
            topic.avgSuccessRate >= 35 ? AlertTriangle : XCircle;

          return (
            <motion.div
              key={topic.topicId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={cn("rounded-xl border p-3 flex flex-col items-center text-center gap-1.5", colors.light, colors.border.replace('border-l-', 'border-'))}
            >
              <StatusIcon className={cn("w-5 h-5", colors.text)} />
              <p className={cn("text-xs font-semibold leading-tight", colors.text)}>{topic.topicName}</p>
              <p className={cn("text-lg font-bold", colors.text)}>{topic.avgSuccessRate}%</p>
              <p className="text-[10px] text-muted-foreground">{topic.questionsAsked} Qs · {topic.examsAppeared} exam{topic.examsAppeared > 1 ? "s" : ""}</p>
            </motion.div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
