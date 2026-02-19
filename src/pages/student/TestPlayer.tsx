// Student Test Player Page
// Full-screen test execution environment
// Mobile-first with no bottom navigation

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTestSessionPersistence } from "@/hooks/useTestSessionPersistence";
import {
  TestPlayerHeader,
  QuestionDisplay,
  QuestionNavigation,
  QuestionPalette,
  TestSubmitDialog,
  TimerWarningOverlay,
  SectionNavigation,
} from "@/components/student/tests/player";
import type { AnswerValue } from "@/components/student/tests/player/QuestionDisplay";
import {
  sampleTestSession,
  getQuestionsBySection,
  formatTimeDisplay,
} from "@/data/student/testSession";
import { jeeAdvancedSession } from "@/data/student/jeeAdvancedSession";
import type { QuestionStatus } from "@/data/student/testQuestions";

const StudentTestPlayer = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const { toast } = useToast();
  const { loadSession, saveSession, clearSession } = useTestSessionPersistence(testId);

  // Track if session has been restored
  const isInitialized = useRef(false);

  // Test session state
  // Select session based on test ID
  const initialSession = testId === "jee-advanced-demo" ? jeeAdvancedSession : sampleTestSession;
  const [session, setSession] = useState(initialSession);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState(
    session.sections[0]?.id || ""
  );
  const [remainingTime, setRemainingTime] = useState(session.remainingTime);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);

  // Alert tracking refs (to prevent duplicate alerts)
  const alertsShown = useRef({
    halfTime: false,
    fiveMinutes: false,
    oneMinute: false,
  });

  // Restore session on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const persistedSession = loadSession();
    if (persistedSession) {
      // Restore answers
      setAnswers(persistedSession.answers);
      
      // Restore question statuses
      setSession((prev) => ({
        ...prev,
        sessionQuestions: prev.sessionQuestions.map((q) => {
          const persisted = persistedSession.sessionQuestions.find((pq) => pq.id === q.id);
          return persisted ? { ...q, status: persisted.status } : q;
        }),
      }));
      
      // Restore navigation state
      setCurrentQuestionIndex(persistedSession.currentQuestionIndex);
      setCurrentSectionId(persistedSession.currentSectionId);
      setRemainingTime(persistedSession.remainingTime);
      
      // Restore alert states
      alertsShown.current = persistedSession.alertsShown;

      toast({
        title: "📝 Session Restored",
        description: "Your previous progress has been restored.",
        duration: 3000,
      });
    }
  }, [loadSession, toast]);

  // Auto-save session on state changes
  useEffect(() => {
    if (!isInitialized.current) return;

    saveSession({
      answers,
      sessionQuestions: session.sessionQuestions,
      remainingTime,
      currentQuestionIndex,
      currentSectionId,
      alertsShown: alertsShown.current,
    });
  }, [answers, session.sessionQuestions, remainingTime, currentQuestionIndex, currentSectionId, saveSession]);

  // Current question
  const currentSessionQuestion = session.sessionQuestions[currentQuestionIndex];
  const currentQuestion = session.questions.find(
    (q) => q.id === currentSessionQuestion?.id
  );

  // Calculate time thresholds
  const totalSeconds = session.totalDuration * 60;
  const halfTimeThreshold = Math.floor(totalSeconds / 2);
  const fiveMinuteThreshold = 5 * 60; // 5 minutes
  const oneMinuteThreshold = 60; // 1 minute

  // Timer effect with warning alerts
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;

        // Half-time warning
        if (newTime === halfTimeThreshold && !alertsShown.current.halfTime) {
          alertsShown.current.halfTime = true;
          toast({
            title: "⏰ Half Time!",
            description: `${formatTimeDisplay(newTime)} remaining. Keep up the pace!`,
            variant: "default",
            duration: 5000,
          });
        }

        // 5 minutes warning
        if (newTime === fiveMinuteThreshold && !alertsShown.current.fiveMinutes) {
          alertsShown.current.fiveMinutes = true;
          toast({
            title: "⚠️ 5 Minutes Left!",
            description: "Review your answers and prepare to submit.",
            variant: "destructive",
            duration: 8000,
          });
        }

        // 1 minute warning
        if (newTime === oneMinuteThreshold && !alertsShown.current.oneMinute) {
          alertsShown.current.oneMinute = true;
          toast({
            title: "🚨 1 Minute Left!",
            description: "Your test will auto-submit when time expires.",
            variant: "destructive",
            duration: 10000,
          });
        }

        // Auto-submit when time expires
        if (newTime <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [halfTimeThreshold, toast]);

  // Auto-submit handler (different from manual submit)
  const handleAutoSubmit = useCallback(() => {
    setIsAutoSubmitting(true);
    clearSession(); // Clear localStorage on submit
    toast({
      title: "⏱️ Time's Up!",
      description: "Your test is being submitted automatically...",
      variant: "destructive",
      duration: 3000,
    });

    // Delay navigation slightly to show the toast, then go to results
    setTimeout(() => {
      console.log("Test auto-submitted!", { answers, sessionQuestions: session.sessionQuestions });
      navigate(`/student/tests/${testId}/results`);
    }, 2000);
  }, [answers, session.sessionQuestions, navigate, toast, clearSession, testId]);

  // Mark current question as visited
  useEffect(() => {
    if (currentSessionQuestion?.status === "not_visited") {
      updateQuestionStatus(currentQuestionIndex, "not_answered");
    }
  }, [currentQuestionIndex]);

  // Update question status
  const updateQuestionStatus = useCallback(
    (index: number, status: QuestionStatus) => {
      setSession((prev) => ({
        ...prev,
        sessionQuestions: prev.sessionQuestions.map((q, i) =>
          i === index ? { ...q, status } : q
        ),
      }));
    },
    []
  );

  // Answer change handler
  const handleAnswerChange = useCallback(
    (questionId: string, answer: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      
      // Update question status to answered
      const questionIndex = session.sessionQuestions.findIndex(
        (q) => q.id === questionId
      );
      if (questionIndex !== -1) {
        const currentStatus = session.sessionQuestions[questionIndex].status;
        if (currentStatus === "not_answered" || currentStatus === "not_visited") {
          updateQuestionStatus(questionIndex, "answered");
        } else if (currentStatus === "marked_review") {
          updateQuestionStatus(questionIndex, "answered_marked");
        }
      }
    },
    [session.sessionQuestions, updateQuestionStatus]
  );

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0 && session.allowBackNavigation) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Update section if needed
      const prevQuestion = session.sessionQuestions[currentQuestionIndex - 1];
      if (prevQuestion && prevQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(prevQuestion.sectionId);
      }
    }
  }, [currentQuestionIndex, session.allowBackNavigation, currentSectionId]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < session.sessionQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Update section if needed
      const nextQuestion = session.sessionQuestions[currentQuestionIndex + 1];
      if (nextQuestion && nextQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(nextQuestion.sectionId);
      }
    }
  }, [currentQuestionIndex, session.sessionQuestions.length, currentSectionId]);

  const handleQuestionSelect = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index);
      const selectedQuestion = session.sessionQuestions[index];
      if (selectedQuestion && selectedQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(selectedQuestion.sectionId);
      }
    },
    [currentSectionId, session.sessionQuestions]
  );

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      setCurrentSectionId(sectionId);
      // Jump to first question of the section
      const sectionQuestions = getQuestionsBySection(
        session.sessionQuestions,
        sectionId
      );
      if (sectionQuestions.length > 0) {
        const firstQuestion = sectionQuestions[0];
        const globalIndex = session.sessionQuestions.findIndex(
          (q) => q.id === firstQuestion.id
        );
        if (globalIndex !== -1) {
          setCurrentQuestionIndex(globalIndex);
        }
      }
    },
    [session.sessionQuestions]
  );

  // Mark for review
  const handleMarkForReview = useCallback(() => {
    const currentStatus = currentSessionQuestion?.status;
    let newStatus: QuestionStatus;

    if (currentStatus === "answered") {
      newStatus = "answered_marked";
    } else if (currentStatus === "answered_marked") {
      newStatus = "answered";
    } else if (currentStatus === "marked_review") {
      newStatus = "not_answered";
    } else {
      newStatus = "marked_review";
    }

    updateQuestionStatus(currentQuestionIndex, newStatus);
  }, [currentQuestionIndex, currentSessionQuestion?.status, updateQuestionStatus]);

  // Clear response - removes answer and updates status
  const handleClearResponse = useCallback(() => {
    if (!currentQuestion) return;
    
    const currentStatus = currentSessionQuestion?.status;
    const hasCurrentAnswer = answers[currentQuestion.id] !== undefined;
    
    if (hasCurrentAnswer || currentStatus === "answered" || currentStatus === "answered_marked") {
      // Remove the answer
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[currentQuestion.id];
        return newAnswers;
      });
      
      // Update status
      updateQuestionStatus(
        currentQuestionIndex,
        currentStatus === "answered_marked" ? "marked_review" : "not_answered"
      );
    }
  }, [currentQuestionIndex, currentSessionQuestion?.status, currentQuestion, answers, updateQuestionStatus]);

  // Submit test (manual)
  const handleSubmitTest = useCallback(() => {
    clearSession(); // Clear localStorage on submit
    toast({
      title: "✅ Test Submitted!",
      description: "Your responses have been recorded successfully.",
      duration: 3000,
    });
    console.log("Test submitted!", { answers, sessionQuestions: session.sessionQuestions });
    navigate(`/student/tests/${testId}/results`);
  }, [navigate, session.sessionQuestions, answers, toast, clearSession, testId]);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Exit test (progress is auto-saved, just navigate)
  const handleExit = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be saved and you can resume later."
      )
    ) {
      navigate("/student/tests");
    }
  }, [navigate]);

  // Check if current question has answer (use actual answers state)
  const hasAnswer = useMemo(() => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    
    // Check based on answer type
    if (answer === undefined || answer === null) return false;
    if (typeof answer === "string" && answer.trim() === "") return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (typeof answer === "object" && !Array.isArray(answer) && Object.keys(answer).length === 0) return false;
    
    return true;
  }, [currentQuestion, answers]);

  // Check if current question is marked
  const isMarked = useMemo(() => {
    const status = currentSessionQuestion?.status;
    return status === "marked_review" || status === "answered_marked";
  }, [currentSessionQuestion?.status]);

  if (!currentQuestion || !currentSessionQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header with Timer & Subject Tabs */}
      <TestPlayerHeader
        testName={session.testName}
        sections={session.sections}
        currentSectionId={currentSectionId}
        sessionQuestions={session.sessionQuestions}
        remainingTime={remainingTime}
        totalDuration={session.totalDuration}
        showCalculator={session.showCalculator}
        isFullscreen={isFullscreen}
        onSectionChange={handleSectionChange}
        onToggleCalculator={() => setIsCalculatorOpen(!isCalculatorOpen)}
        onToggleFullscreen={handleToggleFullscreen}
        onExit={handleExit}
      />

      {/* Main Content: Question + Palette (Desktop) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question area with section nav */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Section Navigation (for multi-section subjects like JEE Advanced) */}
          <SectionNavigation
            sections={session.sections}
            currentSectionId={currentSectionId}
            sessionQuestions={session.sessionQuestions}
            currentSubject={session.sections.find((s) => s.id === currentSectionId)?.subject || ""}
            onSectionChange={handleSectionChange}
          />

          {/* Question Display */}
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentSessionQuestion.questionNumber}
            totalQuestions={session.sessionQuestions.length}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            className="flex-1"
          />
        </div>

        {/* Desktop Palette (always visible) */}
        <QuestionPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          sections={session.sections}
          sessionQuestions={session.sessionQuestions}
          currentQuestionIndex={currentQuestionIndex}
          currentSectionId={currentSectionId}
          onQuestionSelect={handleQuestionSelect}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Navigation Controls */}
      <QuestionNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={session.sessionQuestions.length}
        questionStatus={currentSessionQuestion.status}
        isMarked={isMarked}
        hasAnswer={hasAnswer}
        allowBackNavigation={session.allowBackNavigation}
        allowMarkForReview={session.allowMarkForReview}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onMarkForReview={handleMarkForReview}
        onClearResponse={handleClearResponse}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      {/* Submit Confirmation Dialog */}
      <TestSubmitDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={handleSubmitTest}
        sessionQuestions={session.sessionQuestions}
        testName={session.testName}
      />

      {/* Final countdown overlay (last 30 seconds) */}
      <TimerWarningOverlay
        remainingTime={remainingTime}
        isVisible={!isAutoSubmitting}
      />
    </div>
  );
};

export default StudentTestPlayer;
