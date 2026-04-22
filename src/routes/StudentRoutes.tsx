// ============================================
// STUDENT MODULE ROUTES - Eager loaded internally
// This module is completely isolated from other portals
// ============================================

import { Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "@/components/student/layout";

// All Student pages - EAGER LOADED (no lazy loading per requirement)
import StudentLogin from "@/pages/student/Login";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSubjects from "@/pages/student/Subjects";
import StudentSubjectDetail from "@/pages/student/SubjectDetail";
import StudentChapterView from "@/pages/student/ChapterView";
import StudentBundleDetail from "@/pages/student/BundleDetail";
import StudentContentViewer from "@/pages/student/ContentViewer";
import StudentTests from "@/pages/student/Tests";
import StudentSubjectTests from "@/pages/student/SubjectTests";
import StudentTestPlayer from "@/pages/student/TestPlayer";
import StudentTestResults from "@/pages/student/TestResults";
import StudentProgress from "@/pages/student/Progress";
import StudentNotifications from "@/pages/student/Notifications";
import StudentCopilot from "@/pages/student/Copilot";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Login outside layout */}
      <Route path="login" element={<StudentLogin />} />
      
      {/* STANDALONE full-screen pages (no bottom nav overlap) */}
      <Route path="subjects/:subjectId/:chapterId/:bundleId/:contentId" element={<StudentContentViewer />} />
      <Route path="tests/:testId" element={<StudentTestPlayer />} />
      <Route path="tests/:testId/results" element={<StudentTestResults />} />
      <Route path="copilot" element={<StudentCopilot />} />
      
      {/* Main student routes with layout */}
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="subjects/:subjectId" element={<StudentSubjectDetail />} />
        <Route path="subjects/:subjectId/:chapterId" element={<StudentChapterView />} />
        <Route path="subjects/:subjectId/:chapterId/:bundleId" element={<StudentBundleDetail />} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="tests/subject/:subject" element={<StudentSubjectTests />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>
    </Routes>
  );
}
