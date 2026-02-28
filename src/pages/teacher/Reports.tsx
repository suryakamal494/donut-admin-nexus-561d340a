import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { batchReports } from "@/data/teacher/reportsData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Reports"
        description="Batch-wise performance overview"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports" },
        ]}
      />

      {/* Batch Cards Grid */}
      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <CardContent className="p-3 sm:p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{batch.className} — {batch.batchName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
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
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm",
                      batch.classAverage >= 65 ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                      batch.classAverage >= 40 ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                      "bg-gradient-to-br from-red-500 to-rose-500"
                    )}>
                      {batch.classAverage}%
                    </div>
                  </div>

                  {/* Inline stats row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span><span className="font-semibold text-foreground">{batch.totalExamsConducted}</span> exams</span>
                    <span>·</span>
                    <span><span className="font-semibold text-foreground">{batch.classAverage}%</span> avg</span>
                    <span>·</span>
                    <span className={cn(
                      "font-semibold",
                      batch.atRiskCount > 3 ? "text-red-600 dark:text-red-400" :
                      batch.atRiskCount > 0 ? "text-amber-600 dark:text-amber-400" :
                      "text-emerald-600 dark:text-emerald-400"
                    )}>{batch.atRiskCount}</span>
                    <span>at risk</span>
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
