// Student Test Results Page
// Comprehensive results display with score, analysis, and review

import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Clock, BookOpen, Target, Layers, Brain } from "lucide-react";
import {
  ResultsHeader,
  ScoreBreakdown,
  SectionAnalysis,
  TimeAnalysis,
  QuestionReview,
  PerformanceComparison,
  DifficultyAnalysis,
  CognitiveAnalysis,
  Recommendations,
  CollapsibleCard,
} from "@/components/student/tests/results";
import type { EnhancedQuestionResult } from "@/data/student/testResultsGenerator";
import { generateResultForTest } from "@/data/student/testResultsGenerator";
import { cn } from "@/lib/utils";

const StudentTestResults = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Generate results based on testId
  const result = useMemo(() => generateResultForTest(testId || "gt-1"), [testId]);
  const isMultiSection = result.sections.length > 1;

  // Compute summaries for collapsible cards
  const difficultySummary = useMemo(() => {
    const levels = ["easy", "medium", "hard"] as const;
    return levels.map(level => {
      const qs = (result.questions as EnhancedQuestionResult[]).filter(q => q.difficulty === level);
      const attempted = qs.filter(q => q.isAttempted).length;
      const correct = qs.filter(q => q.isCorrect).length;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      return `${level.charAt(0).toUpperCase() + level.slice(1)}: ${acc}%`;
    }).join(" · ");
  }, [result.questions]);

  const cognitiveSummary = useMemo(() => {
    const types = ["Logical", "Analytical", "Conceptual", "Numerical", "Application", "Memory"];
    const accs = types.map(type => {
      const qs = (result.questions as EnhancedQuestionResult[]).filter(q => q.cognitiveType === type && q.isAttempted);
      const correct = qs.filter(q => q.isCorrect).length;
      return { type, accuracy: qs.length > 0 ? Math.round((correct / qs.length) * 100) : -1, count: qs.length };
    }).filter(d => d.count >= 2);
    if (accs.length === 0) return "No data";
    const best = accs.reduce((a, b) => a.accuracy > b.accuracy ? a : b);
    const worst = accs.reduce((a, b) => a.accuracy < b.accuracy ? a : b);
    return `Best: ${best.type} (${best.accuracy}%) · Weakest: ${worst.type} (${worst.accuracy}%)`;
  }, [result.questions]);

  const sectionSummary = useMemo(() => {
    if (!isMultiSection) return "";
    const best = result.sections.reduce((a, b) => a.accuracy > b.accuracy ? a : b);
    const worst = result.sections.reduce((a, b) => a.accuracy < b.accuracy ? a : b);
    return `Best: ${best.name} (${best.accuracy}%) · Weakest: ${worst.name} (${worst.accuracy}%)`;
  }, [result.sections, isMultiSection]);

  const handleBack = () => {
    navigate("/student/tests");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${result.testName} Results`,
        text: `I scored ${result.percentage}% in ${result.testName}!`,
        url: window.location.href,
      });
    }
  };

  // Mock: grand tests have ranksPublished randomly for demo
  const ranksPublished = isMultiSection ? Math.random() > 0.3 : true;

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
        ranksPublished={ranksPublished}
        onBack={handleBack}
        onShare={handleShare}
      />

      {/* Tabs Navigation - Sticky on mobile */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-none justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="overview" 
              className="flex-1 min-w-[70px] gap-1 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <Target className="w-4 h-4" />
              <span className="text-[10px] sm:text-sm">Overview</span>
            </TabsTrigger>
            {isMultiSection && (
              <TabsTrigger 
                value="sections" 
                className="flex-1 min-w-[70px] gap-1 text-xs sm:text-sm data-[state=active]:bg-white"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] sm:text-sm">Sections</span>
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="time" 
              className="flex-1 min-w-[70px] gap-1 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <Clock className="w-4 h-4" />
              <span className="text-[10px] sm:text-sm">Time</span>
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="flex-1 min-w-[70px] gap-1 text-xs sm:text-sm data-[state=active]:bg-white"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] sm:text-sm">Review</span>
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
              
              {/* Recommendations moved to top for immediate actionability */}
              <Recommendations
                questions={result.questions as EnhancedQuestionResult[]}
                sections={result.sections}
              />

              <PerformanceComparison sections={result.sections} />

              {/* Collapsible analysis cards to reduce scroll */}
              <CollapsibleCard
                icon={<Layers className="w-5 h-5 text-primary" />}
                title="Difficulty Analysis"
                summary={difficultySummary}
              >
                <DifficultyAnalysis
                  questions={result.questions as EnhancedQuestionResult[]}
                  sections={result.sections}
                />
              </CollapsibleCard>

              <CollapsibleCard
                icon={<Brain className="w-5 h-5 text-primary" />}
                title="Cognitive Analysis"
                summary={cognitiveSummary}
              >
                <CognitiveAnalysis
                  questions={result.questions as EnhancedQuestionResult[]}
                  sections={result.sections}
                />
              </CollapsibleCard>

              {isMultiSection && (
                <CollapsibleCard
                  icon={<BarChart3 className="w-5 h-5 text-primary" />}
                  title="Section Analysis"
                  summary={sectionSummary}
                >
                  <SectionAnalysis 
                    sections={result.sections}
                    onSectionClick={(sectionId) => {
                      setActiveTab("review");
                    }}
                  />
                </CollapsibleCard>
              )}
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
