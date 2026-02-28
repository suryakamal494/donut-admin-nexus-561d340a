import { PageHeader } from "@/components/ui/page-header";

const SubjectDetail = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Subject Detail"
      description="Coming in Phase 4"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Batches", href: "/institute/reports/batches" },
        { label: "Subject" },
      ]}
    />
  </div>
);

export default SubjectDetail;
