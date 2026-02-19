// Results Header Component
// Animated score display with rank and percentile

import { memo, useEffect, useState } from "react";
import { Trophy, Users, TrendingUp, Clock, ArrowLeft, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDuration } from "@/data/student/testResults";

interface ResultsHeaderProps {
  testName: string;
  pattern: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  totalParticipants?: number;
  percentile?: number;
  timeTaken: number;
  ranksPublished?: boolean;
  onBack: () => void;
  onShare?: () => void;
}

const ResultsHeader = memo(function ResultsHeader({
  testName,
  pattern,
  marksObtained,
  totalMarks,
  percentage,
  rank,
  totalParticipants,
  percentile,
  timeTaken,
  ranksPublished = true,
  onBack,
  onShare,
}: ResultsHeaderProps) {
  // Animated counter for score
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = marksObtained / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= marksObtained) {
        setDisplayScore(marksObtained);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [marksObtained]);

  // Determine score grade color
  const getScoreColor = () => {
    if (percentage >= 80) return "from-emerald-500 to-teal-500";
    if (percentage >= 60) return "from-blue-500 to-indigo-500";
    if (percentage >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="bg-white border-b border-border">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        <div className="text-center">
          <h1 className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
            {testName}
          </h1>
          <p className="text-xs text-muted-foreground uppercase">{pattern.replace("_", " ")}</p>
        </div>
        
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}
        {!onShare && <div className="w-16" />}
      </div>
      
      {/* Score Display */}
      <div className="px-4 py-4 sm:py-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Animated Score Circle */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "w-24 h-24 sm:w-36 sm:h-36 mx-auto rounded-full",
              "bg-gradient-to-br shadow-2xl",
              getScoreColor(),
              "flex flex-col items-center justify-center text-white"
            )}
          >
            <motion.span
              key={displayScore}
              className="text-3xl sm:text-5xl font-bold"
            >
              {displayScore}
            </motion.span>
            <span className="text-xs sm:text-base opacity-90">/ {totalMarks}</span>
          </motion.div>
          
          {/* Percentage */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xl sm:text-3xl font-bold text-foreground"
          >
            {percentage}%
          </motion.p>
          
          {/* Stats Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
          >
            {/* Rank */}
            {rank && totalParticipants && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Rank</p>
                  {ranksPublished ? (
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {rank} <span className="text-muted-foreground font-normal">/ {totalParticipants}</span>
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-amber-600 italic">Awaiting Publication</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Percentile */}
            {percentile && ranksPublished && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Percentile</p>
                  <p className="font-bold text-foreground text-sm sm:text-base">{percentile}%</p>
                </div>
              </div>
            )}
            
            {/* Time Taken */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-bold text-foreground text-sm sm:text-base">{formatDuration(timeTaken)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default ResultsHeader;
