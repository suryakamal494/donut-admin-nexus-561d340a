import { PageHeader } from "@/components/ui/page-header";

const GrandTestResults = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Grand Test Results"
      description="Coming in Phase 6"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Exams", href: "/institute/reports/exams" },
        { label: "Grand Test" },
      ]}
    />
  </div>
);

export default GrandTestResults;
