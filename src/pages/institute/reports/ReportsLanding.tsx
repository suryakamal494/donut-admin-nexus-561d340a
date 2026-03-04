import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { motion } from "framer-motion";
import { Layers, ClipboardList, Users, ChevronRight, TrendingUp, FileText, UserCheck } from "lucide-react";
import { getInstituteBatchReports, getInstituteExams } from "@/data/institute/reportsData";
import InstituteSubjectHealth from "@/components/institute/reports/InstituteSubjectHealth";

const reportSections = [
  {
    id: "batches",
    title: "Batch Reports",
    description: "Subject-wise performance analysis per batch",
    icon: Layers,
    href: "/institute/reports/batches",
    color: "210 90% 56%",
    statLabel: "batches",
    getCount: () => getInstituteBatchReports().length,
  },
  {
    id: "exams",
    title: "Exam Reports",
    description: "All examinations across batches and types",
    icon: ClipboardList,
    href: "/institute/reports/exams",
    color: "145 65% 42%",
    statLabel: "exams",
    getCount: () => getInstituteExams().length,
  },
  {
    id: "students",
    title: "Student Reports",
    description: "360° student profiles across all subjects",
    icon: Users,
    href: "/institute/reports/students",
    color: "35 95% 55%",
    statLabel: "batches",
    getCount: () => getInstituteBatchReports().length,
  },
];

const ReportsLanding = () => {
  const navigate = useNavigate();
  const batches = getInstituteBatchReports();
  
  // Quick aggregate stats
  const totalStudents = batches.reduce((s, b) => s + b.totalStudents, 0);
  const overallAvg = Math.round(batches.reduce((s, b) => s + b.overallAverage, 0) / batches.length);
  const totalAtRisk = batches.reduce((s, b) => s + b.atRiskCount, 0);

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-6">
      <PageHeader
        title="Reports"
        description="Academic performance insights across your institute"
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports" },
        ]}
      />

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Total Students", value: totalStudents, icon: UserCheck, color: "text-primary" },
          { label: "Overall Avg", value: `${overallAvg}%`, icon: TrendingUp, color: "text-emerald-600" },
          { label: "At Risk", value: totalAtRisk, icon: FileText, color: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-3 flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Institute-Wide Subject Health */}
      <InstituteSubjectHealth />

      {/* Report Section Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {reportSections.map((section, i) => {
          const Icon = section.icon;
          const count = section.getCount();
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden border-0 shadow-md group"
                onClick={() => navigate(section.href)}
              >
                {/* Color strip */}
                <div
                  className="h-1.5"
                  style={{ background: `linear-gradient(90deg, hsl(${section.color}), hsl(${section.color} / 0.6))` }}
                />
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${section.color} / 0.12)` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: `hsl(${section.color})` }} />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground">{section.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {count} {section.statLabel} tracked
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsLanding;
