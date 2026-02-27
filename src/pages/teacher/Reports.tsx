import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { batchReports } from "@/data/teacher/reportsData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Reports"
        description="Batch-wise performance overview"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports" },
        ]}
      />

      {/* Batch Cards Grid */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {batchReports.map((batch, i) => {
          const TrendIcon = batch.trend === "up" ? TrendingUp : batch.trend === "down" ? TrendingDown : Minus;
          const trendColor = batch.trend === "up" ? "text-emerald-500" : batch.trend === "down" ? "text-red-500" : "text-muted-foreground";
          const trendDiff = Math.abs(batch.classAverage - batch.previousAverage);

          return (
            <motion.div
              key={batch.batchId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card
                className="card-premium cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden border-0 shadow-md"
                onClick={() => navigate(`/teacher/reports/${batch.batchId}`)}
              >
                {/* Teal gradient header strip */}
                <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500" />
                <CardContent className="p-4 sm:p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{batch.className} — {batch.batchName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{batch.totalStudents} students</span>
                        <span className="text-muted-foreground">·</span>
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                          batch.trend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          batch.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          "bg-muted text-muted-foreground"
                        )}>
                          <TrendIcon className="w-3 h-3" />
                          {trendDiff > 0 ? `${trendDiff}%` : "Stable"}
                        </div>
                      </div>
                    </div>
                    {/* Class average ring */}
                    <div className={cn(
                      "shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm shadow-md",
                      batch.classAverage >= 65 ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                      batch.classAverage >= 40 ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                      "bg-gradient-to-br from-red-500 to-rose-500"
                    )}>
                      {batch.classAverage}%
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-lg p-2.5 text-center ring-1 ring-teal-100 dark:ring-teal-900/30">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-teal-600 dark:text-teal-400" />
                      <p className="text-lg font-bold text-foreground">{batch.totalExamsConducted}</p>
                      <p className="text-[10px] text-muted-foreground">Exams</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-lg p-2.5 text-center ring-1 ring-teal-100 dark:ring-teal-900/30">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-teal-600 dark:text-teal-400" />
                      <p className="text-lg font-bold text-foreground">{batch.classAverage}%</p>
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-2.5 text-center ring-1",
                      batch.atRiskCount > 3
                        ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 ring-red-100 dark:ring-red-900/30"
                        : batch.atRiskCount > 0
                        ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 ring-amber-100 dark:ring-amber-900/30"
                        : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 ring-emerald-100 dark:ring-emerald-900/30"
                    )}>
                      <AlertTriangle className={cn(
                        "w-4 h-4 mx-auto mb-1",
                        batch.atRiskCount > 3 ? "text-red-500" : batch.atRiskCount > 0 ? "text-amber-500" : "text-emerald-500"
                      )} />
                      <p className="text-lg font-bold text-foreground">{batch.atRiskCount}</p>
                      <p className="text-[10px] text-muted-foreground">At Risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {batchReports.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No batches found</h3>
            <p className="text-sm text-muted-foreground">Reports will appear once exams are conducted for your batches.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
