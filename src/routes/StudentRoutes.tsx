// ============================================
// STUDENT MODULE ROUTES - Core pages eager, heavy pages lazy
// ============================================

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "@/components/student/layout";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";

// Core pages - EAGER (fast initial load)
import StudentLogin from "@/pages/student/Login";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSubjects from "@/pages/student/Subjects";
import StudentTests from "@/pages/student/Tests";
import StudentTimetable from "@/pages/student/Timetable";
import StudentSubjectDetail from "@/pages/student/SubjectDetail";

// Heavy/infrequent pages - LAZY
const StudentChapterView = lazy(() => import("@/pages/student/ChapterView"));
const StudentBundleDetail = lazy(() => import("@/pages/student/BundleDetail"));
const StudentContentViewer = lazy(() => import("@/pages/student/ContentViewer"));
const StudentSubjectTests = lazy(() => import("@/pages/student/SubjectTests"));
const StudentTestPlayer = lazy(() => import("@/pages/student/TestPlayer"));
const StudentTestResults = lazy(() => import("@/pages/student/TestResults"));
const StudentProgress = lazy(() => import("@/pages/student/Progress"));
const StudentNotifications = lazy(() => import("@/pages/student/Notifications"));
const StudentCopilot = lazy(() => import("@/pages/student/Copilot"));

function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton variant="default" />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Login outside layout */}
      <Route path="login" element={<StudentLogin />} />
      
      {/* STANDALONE full-screen pages (no bottom nav overlap) */}
      <Route path="subjects/:subjectId/:chapterId/:bundleId/:contentId" element={<LazyRoute><StudentContentViewer /></LazyRoute>} />
      <Route path="tests/:testId" element={<LazyRoute><StudentTestPlayer /></LazyRoute>} />
      <Route path="tests/:testId/results" element={<LazyRoute><StudentTestResults /></LazyRoute>} />
      <Route path="copilot" element={<LazyRoute><StudentCopilot /></LazyRoute>} />
      
      {/* Main student routes with layout */}
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="subjects/:subjectId" element={<StudentSubjectDetail />} />
        <Route path="subjects/:subjectId/:chapterId" element={<LazyRoute><StudentChapterView /></LazyRoute>} />
        <Route path="subjects/:subjectId/:chapterId/:bundleId" element={<LazyRoute><StudentBundleDetail /></LazyRoute>} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="tests/subject/:subject" element={<LazyRoute><StudentSubjectTests /></LazyRoute>} />
        <Route path="progress" element={<LazyRoute><StudentProgress /></LazyRoute>} />
        <Route path="notifications" element={<LazyRoute><StudentNotifications /></LazyRoute>} />
      </Route>
    </Routes>
  );
}
