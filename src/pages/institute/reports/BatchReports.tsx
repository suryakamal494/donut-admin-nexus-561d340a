import { PageHeader } from "@/components/ui/page-header";

const BatchReports = () => (
  <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
    <PageHeader
      title="Batch Reports"
      description="Coming in Phase 2"
      breadcrumbs={[
        { label: "Institute", href: "/institute" },
        { label: "Reports", href: "/institute/reports" },
        { label: "Batch Reports" },
      ]}
    />
    <p className="text-muted-foreground text-sm">Batch listing will be implemented here.</p>
  </div>
);

export default BatchReports;
