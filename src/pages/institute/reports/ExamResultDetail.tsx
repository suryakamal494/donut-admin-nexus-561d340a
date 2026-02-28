import { PageHeader } from "@/components/ui/page-header";

const ExamResultDetail = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Exam Result"
      description="Coming in Phase 5"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Exams", href: "/institute/reports/exams" },
        { label: "Result" },
      ]}
    />
  </div>
);

export default ExamResultDetail;
