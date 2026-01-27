import { useParams } from "react-router-dom";
import { DocsViewer } from "@/components/docs/DocsViewer";

export default function DocsPage() {
  const { "*": docPath } = useParams();

  if (!docPath) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a document from the sidebar</p>
      </div>
    );
  }

  return <DocsViewer docPath={docPath} className="h-full" />;
}
