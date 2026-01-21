import { PageHeader } from "@/components/ui/page-header";
import { useExamCreationNew } from "@/hooks/useExamCreationNew";
import { ExamNewStepper } from "@/components/institute/exams-new/ExamNewStepper";
import { IntentStep } from "@/components/institute/exams-new/create-steps/IntentStep";
import { PatternSelectStep } from "@/components/institute/exams-new/create-steps/PatternSelectStep";
import { SubjectSelectStep } from "@/components/institute/exams-new/create-steps/SubjectSelectStep";
import { QuickConfigStep } from "@/components/institute/exams-new/create-steps/QuickConfigStep";
import { QuestionAdditionStep } from "@/components/institute/exams-new/create-steps/QuestionAdditionStep";
import { BatchAssignStep } from "@/components/institute/exams-new/create-steps/BatchAssignStep";
import { CompletionStep } from "@/components/institute/exams-new/create-steps/CompletionStep";
import { cn } from "@/lib/utils";

const CreateExamNew = () => {
  const exam = useExamCreationNew();

  const getStepContent = () => {
    // Completion
    if (exam.isComplete) {
      return (
        <CompletionStep
          examName={exam.examName}
          totalQuestions={exam.totalQuestionsAdded}
          onBackToExams={exam.handleBackToExams}
          onReviewQuestions={() => {}}
        />
      );
    }

    // Intent selection (step 1)
    if (exam.currentStepKey === "intent") {
      return (
        <IntentStep
          onSelectIntent={exam.setIntent}
          onCancel={exam.handleCancel}
        />
      );
    }

    // Pattern selection (pattern path, step 2)
    if (exam.currentStepKey === "pattern") {
      return (
        <PatternSelectStep
          selectedPatternId={exam.selectedPatternId}
          selectedPattern={exam.selectedPattern}
          onSelectPattern={exam.selectPattern}
          canProceed={exam.canProceedPattern}
          onNext={exam.nextStep}
          onBack={exam.prevStep}
        />
      );
    }

    // Subject selection (both paths)
    if (exam.currentStepKey === "subjects") {
      return (
        <SubjectSelectStep
          selectedSubjects={exam.selectedSubjects}
          toggleSubject={exam.toggleSubject}
          isQuickTest={exam.intent === "quick_test"}
          canProceed={exam.canProceedSubjects}
          onNext={exam.nextStep}
          onBack={exam.prevStep}
        />
      );
    }

    // Quick test config (quick test path only)
    if (exam.currentStepKey === "config") {
      return (
        <QuickConfigStep
          config={exam.quickTestConfig}
          selectedSubjects={exam.selectedSubjects}
          updateConfig={exam.updateQuickTestConfig}
          canProceed={exam.canProceedConfig}
          onNext={exam.nextStep}
          onBack={exam.prevStep}
        />
      );
    }

    // Question addition (both paths)
    if (exam.currentStepKey === "questions") {
      return (
        <QuestionAdditionStep
          selectedPattern={exam.selectedPattern}
          selectedSubjects={exam.selectedSubjects}
          activeMethod={exam.activeCreationMethod}
          setActiveMethod={exam.setActiveCreationMethod}
          aiConfig={exam.aiConfig}
          adjustDifficulty={exam.adjustDifficulty}
          toggleCognitiveType={exam.toggleCognitiveType}
          addedQuestions={exam.addedQuestions}
          selectedBankQuestionIds={exam.selectedBankQuestionIds}
          toggleBankQuestion={exam.toggleBankQuestion}
          addQuestions={exam.addQuestions}
          removeQuestion={exam.removeQuestion}
          uploadedFiles={exam.uploadedFiles}
          handleFileUpload={exam.handleFileUpload}
          removeFile={exam.removeFile}
          isLargeUpload={exam.isLargeUpload}
          sectionProgress={exam.sectionProgress}
          totalQuestionsRequired={exam.totalQuestionsRequired}
          totalQuestionsAdded={exam.totalQuestionsAdded}
          isQuickTest={exam.intent === "quick_test"}
          canProceed={exam.canProceedQuestions}
          onNext={exam.nextStep}
          onBack={exam.prevStep}
        />
      );
    }

    // Batch assignment (both paths)
    if (exam.currentStepKey === "batch") {
      return (
        <BatchAssignStep
          examName={exam.examName}
          setExamName={exam.setExamName}
          selectedBatches={exam.selectedBatches}
          toggleBatch={exam.toggleBatch}
          scheduleDate={exam.scheduleDate}
          setScheduleDate={exam.setScheduleDate}
          scheduleTime={exam.scheduleTime}
          setScheduleTime={exam.setScheduleTime}
          isProcessing={exam.isProcessing}
          onCreate={exam.handleCreate}
          onBack={exam.prevStep}
        />
      );
    }

    return null;
  };

  // Determine container width based on step
  const isWideStep = exam.currentStepKey === "questions";

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20 sm:pb-6">
      <PageHeader
        title="Create Exam"
        description="Create a new exam for your students"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams New", href: "/institute/exams-new" },
          { label: "Create Exam" },
        ]}
      />

      {/* Stepper */}
      {!exam.isComplete && exam.intent && (
        <ExamNewStepper steps={exam.steps} currentStep={exam.currentStep} />
      )}

      {/* Step Content */}
      <div className={cn(
        "bg-card rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 shadow-soft border border-border/50 mx-auto transition-all",
        isWideStep ? "max-w-full lg:max-w-5xl" : "max-w-xl sm:max-w-2xl"
      )}>
        {getStepContent()}
      </div>
    </div>
  );
};

export default CreateExamNew;
