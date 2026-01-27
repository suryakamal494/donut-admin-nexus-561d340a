import { useParams, Navigate } from "react-router-dom";
import { DocsViewer } from "@/components/docs/DocsViewer";

export default function DocsPage() {
  const { "*": docPath } = useParams();

  // If no path or just wildcards/invalid paths, redirect to docs index
  if (!docPath || docPath === "*" || docPath.trim() === "") {
    return <Navigate to="/docs" replace />;
  }

  return <DocsViewer docPath={docPath} className="h-full" />;
}
