import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Users, BookOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getInstituteBatchReports } from "@/data/institute/reportsData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BatchReports = () => {
  const navigate = useNavigate();
  const batches = getInstituteBatchReports();

  // Group by class
  const grouped = batches.reduce<Record<string, typeof batches>>((acc, b) => {
    (acc[b.className] ??= []).push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Batch Reports"
        description="Subject-wise performance analysis per batch"
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Batch Reports" },
        ]}
      />

      {Object.entries(grouped).map(([className, classBatches]) => (
        <div key={className} className="space-y-2">
          {/* Class group label */}
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            {className}
          </h2>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {classBatches.map((batch, i) => {
              const TrendIcon = batch.trend === "up" ? TrendingUp : batch.trend === "down" ? TrendingDown : Minus;
              const trendDiff = Math.abs(batch.overallAverage - batch.previousAverage);

              return (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden border-0 shadow-md"
                    onClick={() => navigate(`/institute/reports/batches/${batch.batchId}`)}
                  >
                    {/* Gradient strip */}
                    <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                    <CardContent className="p-3 sm:p-4">
                      {/* Title row */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                            {batch.className} — {batch.batchName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{batch.totalStudents} students</span>
                            <span className="text-muted-foreground text-xs">·</span>
                            <span className="text-xs text-muted-foreground">{batch.subjectCount} subjects</span>
                            <span className="text-muted-foreground text-xs">·</span>
                            <div className={cn(
                              "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                              batch.trend === "up" ? "bg-emerald-100 text-emerald-700" :
                              batch.trend === "down" ? "bg-red-100 text-red-700" :
                              "bg-muted text-muted-foreground"
                            )}>
                              <TrendIcon className="w-3 h-3" />
                              {trendDiff > 0 ? `${trendDiff}%` : "Stable"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 text-xs border-t border-border/50 pt-2">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          <span className="text-foreground font-semibold">{batch.overallAverage}%</span>
                          <span className="text-muted-foreground">avg</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{batch.totalExams} exams</span>
                        </div>
                        {batch.atRiskCount > 0 && (
                          <div className="flex items-center gap-1 ml-auto">
                            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                            <span className="text-destructive font-semibold">{batch.atRiskCount}</span>
                            <span className="text-muted-foreground">at risk</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatchReports;
