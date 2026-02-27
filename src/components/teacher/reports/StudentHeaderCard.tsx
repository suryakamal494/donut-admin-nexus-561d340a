import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { StudentBatchProfile } from "@/data/teacher/studentReportData";

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const tagLabels: Record<string, string> = {
  improving: "Improving", declining: "Declining", plateaued: "Plateaued",
  inconsistent: "Inconsistent", "speed-issue": "Speed Issue", "low-attempt": "Low Attempt",
};

interface StudentHeaderCardProps {
  profile: StudentBatchProfile;
  batchClassName: string;
  batchName: string;
  onGenerateHomework: () => void;
}

export const StudentHeaderCard = ({ profile, batchClassName, batchName, onGenerateHomework }: StudentHeaderCardProps) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <Card className="card-premium">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-lg font-bold text-foreground">{profile.studentName}</h2>
              <Badge variant="outline" className="text-[10px]">{profile.rollNumber}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {batchClassName} — {batchName} · {profile.totalExams} exams
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-foreground">{profile.overallAccuracy}%</span>
                <TrendIcon trend={profile.trend} />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {profile.secondaryTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {tagLabels[tag] || tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button size="sm" onClick={onGenerateHomework} className="shrink-0 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Homework</span>
            <span className="sm:hidden">Assign</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <p className="text-sm font-bold text-foreground">{profile.consistency}%</p>
            <p className="text-[10px] text-muted-foreground">Consistency</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <p className="text-sm font-bold text-foreground">{profile.totalQuestions}</p>
            <p className="text-[10px] text-muted-foreground">Questions</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <p className="text-sm font-bold text-foreground">{profile.chapterMastery.filter(c => c.status === "weak").length}</p>
            <p className="text-[10px] text-muted-foreground">Weak Chapters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
