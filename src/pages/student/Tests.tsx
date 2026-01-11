// Student Tests Page
// Redesigned with card-based layout matching SubjectCard aesthetic
// Scalable with virtualized lists for 30+ tests per subject

import { useState, useMemo, useCallback } from "react";
import { Trophy, ClipboardList, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SubjectTestCard,
  SubjectTestsSheet,
  GrandTestCard,
  ExamPatternFilter,
  LiveTestsSection,
} from "@/components/student/tests";
import {
  teacherTests,
  grandTests,
  previousYearPapers,
  getTestsBySubject,
  getLiveTestsCount,
} from "@/data/student/tests";
import type { ExamPattern } from "@/data/student/tests";
import { useNavigate } from "react-router-dom";

const StudentTests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-tests");
  const [selectedPattern, setSelectedPattern] = useState<ExamPattern | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Group teacher tests by subject
  const testsBySubject = useMemo(() => getTestsBySubject(teacherTests), []);
  
  // Sort subjects: live tests first, then by count
  const subjectOrder = useMemo(() => {
    return Object.keys(testsBySubject).sort((a, b) => {
      const aLive = getLiveTestsCount(testsBySubject[a]);
      const bLive = getLiveTestsCount(testsBySubject[b]);
      if (aLive !== bLive) return bLive - aLive;
      return testsBySubject[b].length - testsBySubject[a].length;
    });
  }, [testsBySubject]);

  // Combine and filter grand tests + PYPs
  const allGrandTests = useMemo(() => [...grandTests, ...previousYearPapers], []);
  const filteredGrandTests = useMemo(() => {
    if (selectedPattern === "all") return allGrandTests;
    return allGrandTests.filter((test) => test.pattern === selectedPattern);
  }, [allGrandTests, selectedPattern]);

  // Counts
  const liveTeacherTests = getLiveTestsCount(teacherTests);
  const liveGrandTests = getLiveTestsCount(allGrandTests);

  // Sheet handlers
  const handleOpenSheet = useCallback((subject: string) => {
    setSelectedSubject(subject);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedSubject(null);
  }, []);

  // Grand test handlers
  const handleStartTest = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}`);
  }, [navigate]);

  const handleViewTest = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}`);
  }, [navigate]);

  const handleViewResults = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}/results`);
  }, [navigate]);

  return (
    <div className="w-full pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/25">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Tests & Practice</h1>
          <p className="text-xs text-muted-foreground">
            {liveTeacherTests + liveGrandTests > 0
              ? `${liveTeacherTests + liveGrandTests} live now`
              : "All caught up!"}
          </p>
        </div>
      </div>

      {/* Tabs: My Tests | Grand Tests & PYPs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-white/50">
          <TabsTrigger
            value="my-tests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-donut-orange data-[state=active]:to-donut-coral data-[state=active]:text-white rounded-lg text-xs sm:text-sm font-medium"
          >
            <ClipboardList className="w-4 h-4 mr-1.5" />
            My Tests
            {liveTeacherTests > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                {liveTeacherTests}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="grand-tests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-donut-orange data-[state=active]:to-donut-coral data-[state=active]:text-white rounded-lg text-xs sm:text-sm font-medium"
          >
            <GraduationCap className="w-4 h-4 mr-1.5" />
            Grand Tests
            {liveGrandTests > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                {liveGrandTests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* My Tests Tab */}
        <TabsContent value="my-tests" className="mt-0">
          {/* Live Tests Highlight */}
          <LiveTestsSection tests={teacherTests} />

          {/* Subject Cards Grid */}
          {subjectOrder.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjectOrder.map((subject) => (
                <SubjectTestCard
                  key={subject}
                  subject={subject}
                  tests={testsBySubject[subject]}
                  onOpenSheet={handleOpenSheet}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
              <p className="text-muted-foreground">No tests available</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Tests assigned by your teachers will appear here
              </p>
            </div>
          )}
        </TabsContent>

        {/* Grand Tests Tab */}
        <TabsContent value="grand-tests" className="mt-0">
          {/* Live Tests Highlight */}
          <LiveTestsSection tests={allGrandTests} />

          {/* Pattern Filter */}
          <ExamPatternFilter
            selectedPattern={selectedPattern}
            onPatternChange={setSelectedPattern}
            className="mb-4"
          />

          {/* Grand Tests Grid */}
          {filteredGrandTests.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGrandTests.map((test) => (
                <GrandTestCard
                  key={test.id}
                  test={test}
                  onStart={handleStartTest}
                  onView={handleViewTest}
                  onResults={handleViewResults}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
              <p className="text-muted-foreground">No tests for this pattern</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try selecting a different exam pattern
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Subject Tests Sheet */}
      <SubjectTestsSheet
        isOpen={selectedSubject !== null}
        onClose={handleCloseSheet}
        subject={selectedSubject || ""}
        tests={selectedSubject ? testsBySubject[selectedSubject] || [] : []}
      />
    </div>
  );
};

export default StudentTests;
