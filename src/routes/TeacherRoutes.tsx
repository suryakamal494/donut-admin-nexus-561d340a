// ============================================
// TEACHER MODULE ROUTES
// Core pages eager loaded, heavy pages lazy loaded
// ============================================

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";
import TeacherLayout from "@/components/layout/TeacherLayout";

// Core pages - EAGER LOADED for instant navigation
import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherSchedule from "@/pages/teacher/Schedule";
import LessonPlans from "@/pages/teacher/LessonPlans";
import TeacherAcademicProgress from "@/pages/teacher/AcademicProgress";
import TeacherExams from "@/pages/teacher/Exams";
import TeacherHomework from "@/pages/teacher/Homework";
import TeacherContent from "@/pages/teacher/Content";
import TeacherReference from "@/pages/teacher/Reference";
import TeacherProfile from "@/pages/teacher/Profile";

// Heavy pages - LAZY LOADED
const LessonPlanCanvas = lazy(() => import("@/pages/teacher/LessonPlanCanvas"));
const CreateTeacherExam = lazy(() => import("@/pages/teacher/CreateExam"));
const TeacherExamResults = lazy(() => import("@/pages/teacher/ExamResults"));
const EditTeacherExam = lazy(() => import("@/pages/teacher/EditExam"));
const TeacherCreateContent = lazy(() => import("@/pages/teacher/content/CreateContent"));
const TeacherAIContentGenerator = lazy(() => import("@/pages/teacher/content/AIContentGenerator"));

// Suspense wrapper for lazy-loaded pages
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="schedule" element={<TeacherSchedule />} />
        <Route path="lesson-plans" element={<LessonPlans />} />
        <Route path="lesson-plans/new" element={<LazyPage><LessonPlanCanvas /></LazyPage>} />
        <Route path="lesson-plans/:planId" element={<LazyPage><LessonPlanCanvas /></LazyPage>} />
        <Route path="academic-progress" element={<TeacherAcademicProgress />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="exams/create" element={<LazyPage><CreateTeacherExam /></LazyPage>} />
        <Route path="exams/:examId/edit" element={<LazyPage><EditTeacherExam /></LazyPage>} />
        <Route path="exams/:examId/results" element={<LazyPage><TeacherExamResults /></LazyPage>} />
        <Route path="homework" element={<TeacherHomework />} />
        <Route path="content" element={<TeacherContent />} />
        <Route path="content/create" element={<LazyPage><TeacherCreateContent /></LazyPage>} />
        <Route path="content/ai-generate" element={<LazyPage><TeacherAIContentGenerator /></LazyPage>} />
        <Route path="reference" element={<TeacherReference />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>
    </Routes>
  );
}
