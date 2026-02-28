import { PageHeader } from "@/components/ui/page-header";

const BatchReportDetail = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Batch Detail"
      description="Coming in Phase 2"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Batches", href: "/institute/reports/batches" },
        { label: "Detail" },
      ]}
    />
  </div>
);

export default BatchReportDetail;
