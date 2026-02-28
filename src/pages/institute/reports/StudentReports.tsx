import { PageHeader } from "@/components/ui/page-header";

const StudentReports = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Student Reports"
      description="Coming in Phase 7"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Student Reports" },
      ]}
    />
  </div>
);

export default StudentReports;
