import { PageHeader } from "@/components/ui/page-header";

const StudentProfile360 = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Student 360° Profile"
      description="Coming in Phase 7"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Students", href: "/institute/reports/students" },
        { label: "Profile" },
      ]}
    />
  </div>
);

export default StudentProfile360;
