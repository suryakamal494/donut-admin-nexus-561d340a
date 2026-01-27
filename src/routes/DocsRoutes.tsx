import { Routes, Route } from "react-router-dom";
import { DocsLayout } from "@/components/docs/DocsLayout";
import DocsIndex from "@/pages/docs/DocsIndex";
import DocsPage from "@/pages/docs/DocsPage";

export default function DocsRoutes() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<DocsIndex />} />
        <Route path="*" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
