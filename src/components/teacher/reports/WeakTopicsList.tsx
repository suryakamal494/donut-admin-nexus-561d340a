import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";

interface WeakTopic {
  topicName: string;
  chapterName: string;
  accuracy: number;
  questionsAsked: number;
}

interface WeakTopicsListProps {
  weakTopics: WeakTopic[];
}

export const WeakTopicsList = ({ weakTopics }: WeakTopicsListProps) => {
  if (weakTopics.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
      <Card className="card-premium border-l-4 border-l-red-500">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Weak Topics ({weakTopics.length})
            <InfoTooltip content="Topics where the student's accuracy is below 50%, aggregated across all exams. Sorted by weakness — lowest accuracy first. These directly feed the 'Generate Homework' action." />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-1.5">
          {weakTopics.slice(0, 10).map((topic) => (
            <div key={`${topic.chapterName}-${topic.topicName}`} className="flex items-center gap-3 p-2 rounded-lg bg-red-50/50 dark:bg-red-950/20">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">{topic.accuracy}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{topic.topicName}</p>
                <p className="text-[10px] text-muted-foreground">{topic.chapterName} · {topic.questionsAsked} Q</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
