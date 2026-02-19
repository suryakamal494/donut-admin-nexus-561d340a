// Student Test Results Page
// Comprehensive results display with score, analysis, and review

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Clock, BookOpen, Target } from "lucide-react";
import {
  ResultsHeader,
  ScoreBreakdown,
  SectionAnalysis,
  TimeAnalysis,
  QuestionReview,
} from "@/components/student/tests/results";
import { generateResultForTest } from "@/data/student/testResultsGenerator";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const StudentTestResults = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Generate results based on testId
  const result = useMemo(() => generateResultForTest(testId || "gt-1"), [testId]);

  const handleBack = () => {
    navigate("/student/tests");
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: `${result.testName} Results`,
        text: `I scored ${result.percentage}% in ${result.testName}!`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Results Header with Score */}
      <ResultsHeader
        testName={result.testName}
        pattern={result.pattern}
        marksObtained={result.marksObtained}
        totalMarks={result.totalMarks}
        percentage={result.percentage}
        rank={result.rank}
        totalParticipants={result.totalParticipants}
        percentile={result.percentile}
        timeTaken={result.timeTaken}
        onBack={handleBack}
        onShare={handleShare}
      />

      {/* Tabs Navigation - Sticky on mobile */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-none justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="overview" 
              className="flex-1 min-w-[80px] gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sections" 
              className="flex-1 min-w-[80px] gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger 
              value="time" 
              className="flex-1 min-w-[80px] gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Time</span>
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="flex-1 min-w-[80px] gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Review</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 pb-20 sm:pb-6">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <ScoreBreakdown
                totalQuestions={result.totalQuestions}
                attempted={result.attempted}
                correct={result.correct}
                incorrect={result.incorrect}
                skipped={result.skipped}
                accuracy={result.accuracy}
              />
              <SectionAnalysis 
                sections={result.sections}
                onSectionClick={(sectionId) => {
                  setActiveTab("review");
                }}
              />
            </TabsContent>

            <TabsContent value="sections" className="mt-0">
              <SectionAnalysis 
                sections={result.sections}
                onSectionClick={(sectionId) => {
                  setActiveTab("review");
                }}
              />
            </TabsContent>

            <TabsContent value="time" className="mt-0">
              <TimeAnalysis
                questions={result.questions}
                sections={result.sections}
                totalTime={result.timeTaken}
                totalDuration={result.totalDuration}
              />
            </TabsContent>

            <TabsContent value="review" className="mt-0">
              <QuestionReview
                questions={result.questions}
                sections={result.sections}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentTestResults;
