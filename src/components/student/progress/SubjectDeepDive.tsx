import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SubjectDetail } from "@/data/student/progressData";
import ChapterMasteryList from "./ChapterMasteryList";
import WeakTopicsAlert from "./WeakTopicsAlert";
import DifficultyBreakdown from "./DifficultyBreakdown";
import ChapterDetailSheet from "./ChapterDetailSheet";

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
  const trendLabel = profile.trend === "up" ? "Improving" : profile.trend === "down" ? "Declining" : "Steady";

  const selectedChapter = profile.chapterMastery.find(c => c.chapterId === selectedChapterId);

  const deltaFromAvg = profile.overallAccuracy - batchAverage;
  const topperAccuracy = Math.min(100, batchAverage + 15);
  const deltaFromTop = profile.overallAccuracy - topperAccuracy;
  const isAboveAvg = deltaFromAvg > 0;
  const studentPos = Math.min(100, Math.max(0, profile.overallAccuracy));
  const avgPos = Math.min(100, Math.max(0, batchAverage));
  const topPos = Math.min(100, Math.max(0, topperAccuracy));

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

        {/* Visual rank bar */}
        <div className="relative h-3 bg-muted/15 rounded-full mb-6 mt-2">
          <div className="absolute top-0 h-full w-0.5 bg-muted-foreground/40 z-10" style={{ left: `${avgPos}%` }} />
          <div className="absolute -top-5 text-[9px] text-muted-foreground font-medium whitespace-nowrap" style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}>
            Avg {batchAverage}%
          </div>
          <div className="absolute top-0 h-full w-0.5 bg-emerald-400 z-10" style={{ left: `${topPos}%` }} />
          <div className="absolute -bottom-5 text-[9px] text-emerald-600 font-medium whitespace-nowrap" style={{ left: `${topPos}%`, transform: "translateX(-50%)" }}>
            Top {topperAccuracy}%
          </div>
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: `${studentPos}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -top-1 w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] border-2 border-white shadow-lg z-20"
            style={{ transform: "translateX(-50%)" }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          <div className="text-center">
            <p className="text-base font-bold text-foreground">{profile.overallAccuracy}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className={`flex items-center gap-0.5 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-muted-foreground">{trendLabel}</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">#{rank}<span className="text-xs font-normal text-muted-foreground">/{totalStudents}</span></p>
            <p className="text-[10px] text-muted-foreground">Rank</p>
          </div>
          <div className="text-center">
            <p className={`text-base font-bold ${isAboveAvg ? "text-emerald-600" : "text-red-500"}`}>{isAboveAvg ? "+" : ""}{deltaFromAvg}%</p>
            <p className="text-[10px] text-muted-foreground">vs Avg</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-muted-foreground">{deltaFromTop}%</p>
            <p className="text-[10px] text-muted-foreground">vs Top</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>Class avg: {batchAverage}%</span><span>•</span><span>Percentile: {percentile}th</span>
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