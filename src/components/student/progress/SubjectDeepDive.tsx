import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Award, AlertTriangle, BarChart3 } from "lucide-react";
import type { SubjectDetail } from "@/data/student/progressData";
import ChapterMasteryList from "./ChapterMasteryList";
import WeakTopicsAlert from "./WeakTopicsAlert";
import DifficultyBreakdown from "./DifficultyBreakdown";
import ChapterDetailSheet from "./ChapterDetailSheet";
import SubjectBatchStanding from "./SubjectBatchStanding";

interface SubjectDeepDiveProps {
  subjectName: string;
  detail: SubjectDetail;
  onBack: () => void;
}

const SubjectDeepDive = ({ subjectName, detail, onBack }: SubjectDeepDiveProps) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const { profile, rank, totalStudents, percentile, batchAverage } = detail;

  const TrendIcon = profile.trend === "up" ? TrendingUp : profile.trend === "down" ? TrendingDown : Minus;
  const trendColor = profile.trend === "up" ? "text-emerald-500" : profile.trend === "down" ? "text-red-500" : "text-amber-500";

  const selectedChapter = profile.chapterMastery.find(c => c.chapterId === selectedChapterId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 min-h-[44px]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <h2 className="text-lg font-bold text-foreground mb-3">{subjectName}</h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-foreground">{profile.performanceIndex}</p>
            <p className="text-[10px] text-muted-foreground">PI Score</p>
          </div>
          <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-foreground">{profile.overallAccuracy}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-muted/10 rounded-xl px-3 py-2 text-center flex flex-col items-center">
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-lg font-bold">{profile.trend === "up" ? "↑" : profile.trend === "down" ? "↓" : "→"}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Trend</p>
          </div>
          <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-foreground">#{rank}</p>
            <p className="text-[10px] text-muted-foreground">of {totalStudents}</p>
          </div>
        </div>

        {/* Batch context */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>Class avg: {batchAverage}%</span>
          <span>•</span>
          <span>Percentile: {percentile}th</span>
        </div>
      </div>

      {/* Weak Topics Alert */}
      {profile.weakTopics.length > 0 && (
        <WeakTopicsAlert topics={profile.weakTopics.slice(0, 5)} />
      )}

      {/* Chapter Mastery */}
      <ChapterMasteryList
        chapters={profile.chapterMastery}
        onSelectChapter={setSelectedChapterId}
      />

      {/* Difficulty Breakdown */}
      <DifficultyBreakdown data={profile.difficultyBreakdown} />

      {/* Subject Batch Standing */}
      <SubjectBatchStanding
        subjectName={subjectName}
        accuracy={profile.overallAccuracy}
        batchAverage={batchAverage}
        topperAccuracy={batchAverage + 15 > 100 ? 100 : batchAverage + 15}
        rank={rank}
        totalStudents={totalStudents}
        percentile={percentile}
      />

      {/* Chapter Detail Sheet */}
      <AnimatePresence>
        {selectedChapter && (
          <ChapterDetailSheet
            chapter={selectedChapter}
            onClose={() => setSelectedChapterId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectDeepDive;