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
                className="card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                onClick={() => navigate(`/teacher/reports/${batch.batchId}`)}
              >
                <CardContent className="p-4 sm:p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{batch.className} — {batch.batchName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{batch.totalStudents} students</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
                      <TrendIcon className="w-3.5 h-3.5" />
                      {trendDiff > 0 && <span>{trendDiff}%</span>}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-lg font-bold text-foreground">{batch.totalExamsConducted}</p>
                      <p className="text-[10px] text-muted-foreground">Exams</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-lg font-bold text-foreground">{batch.classAverage}%</p>
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-amber-500" />
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
