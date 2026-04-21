import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { TopicDetail } from "@/data/student/progressData";

interface WeakTopicsAlertProps {
  topics: TopicDetail[];
}

const WeakTopicsAlert = ({ topics }: WeakTopicsAlertProps) => {
  if (topics.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-xl rounded-2xl p-5 border border-red-200/50 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h3 className="text-sm font-semibold text-red-700">Focus Areas</h3>
      </div>
      <p className="text-xs text-red-600/70 mb-3">These topics need your attention — practice them to boost your score!</p>

      <div className="space-y-2">
        {topics.map((topic, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-foreground truncate">{topic.topicName}</span>
                <span className="text-[10px] font-bold text-red-600 ml-2">{topic.accuracy}%</span>
              </div>
              <div className="h-1 bg-red-200/40 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${topic.accuracy}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">from {topics[0]?.chapterName || "various chapters"}</p>
    </motion.div>
  );
};

export default WeakTopicsAlert;