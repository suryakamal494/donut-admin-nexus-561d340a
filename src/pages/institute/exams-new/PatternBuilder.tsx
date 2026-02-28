import { PageHeader } from "@/components/ui/page-header";
import { usePatternBuilder } from "@/hooks/usePatternBuilder";
import { PatternStepper } from "@/components/institute/exams-new/PatternStepper";
import { BasicInfoStep } from "@/components/institute/exams-new/steps/BasicInfoStep";
import { DurationMarksStep } from "@/components/institute/exams-new/steps/DurationMarksStep";
import { SectionsStep } from "@/components/institute/exams-new/steps/SectionsStep";
import { ReviewStep } from "@/components/institute/exams-new/steps/ReviewStep";

const PatternBuilder = () => {
  const builder = usePatternBuilder();

  const isReviewStep = builder.currentStep === builder.totalSteps;
  const isSectionsStep = builder.hasSections && builder.currentStep === 3;

  const getStepContent = () => {
    switch (builder.currentStep) {
      case 1:
        return (
          <BasicInfoStep
            name={builder.name}
            setName={builder.setName}
            description={builder.description}
            setDescription={builder.setDescription}
            hasFixedSubjects={builder.hasFixedSubjects}
            setHasFixedSubjects={builder.setHasFixedSubjects}
            subjects={builder.subjects}
            toggleSubject={builder.toggleSubject}
            category={builder.category}
            setCategory={builder.setCategory}
            tags={builder.tags}
            addTag={builder.addTag}
            removeTag={builder.removeTag}
            canProceed={builder.canProceedStep1}
            onNext={builder.nextStep}
            onCancel={builder.handleCancel}
          />
        );
      case 2:
        return (
          <DurationMarksStep
            totalDuration={builder.totalDuration}
            setTotalDuration={builder.setTotalDuration}
            hasSectionWiseTime={builder.hasSectionWiseTime}
            setHasSectionWiseTime={builder.setHasSectionWiseTime}
            hasUniformMarking={builder.hasUniformMarking}
            setHasUniformMarking={builder.setHasUniformMarking}
            defaultMarksPerQuestion={builder.defaultMarksPerQuestion}
            setDefaultMarksPerQuestion={builder.setDefaultMarksPerQuestion}
            hasNegativeMarking={builder.hasNegativeMarking}
            setHasNegativeMarking={builder.setHasNegativeMarking}
            defaultNegativeMarks={builder.defaultNegativeMarks}
            setDefaultNegativeMarks={builder.setDefaultNegativeMarks}
            hasPartialMarking={builder.hasPartialMarking}
            setHasPartialMarking={builder.setHasPartialMarking}
            hasFixedSubjects={builder.hasFixedSubjects}
            subjects={builder.subjects}
            questionsPerSubject={builder.questionsPerSubject}
            setQuestionsPerSubject={builder.setQuestionsPerSubject}
            totalQuestionCount={builder.totalQuestionCount}
            setTotalQuestionCount={builder.setTotalQuestionCount}
            hasSections={builder.hasSections}
            setHasSections={builder.setHasSections}
            globalQuestionType={builder.globalQuestionType}
            setGlobalQuestionType={builder.setGlobalQuestionType}
            totalQuestions={builder.totalQuestions}
            totalMarks={builder.totalMarks}
            canProceed={builder.canProceedStep2}
            onNext={builder.nextStep}
            onBack={builder.prevStep}
          />
        );
      default:
        break;
    }

    if (isSectionsStep) {
      return (
        <SectionsStep
          sections={builder.sections}
          hasFixedSubjects={builder.hasFixedSubjects}
          subjects={builder.subjects}
          hasSectionWiseTime={builder.hasSectionWiseTime}
          hasUniformMarking={builder.hasUniformMarking}
          perSubjectQuestionCount={builder.perSubjectQuestionCount}
          sectionValidationTarget={builder.sectionValidationTarget}
          defaultMarksPerQuestion={builder.defaultMarksPerQuestion}
          hasNegativeMarking={builder.hasNegativeMarking}
          defaultNegativeMarks={builder.defaultNegativeMarks}
          addSection={builder.addSection}
          removeSection={builder.removeSection}
          updateSection={builder.updateSection}
          duplicateSection={builder.duplicateSection}
          reorderSections={builder.reorderSections}
          canProceed={builder.canProceedStep3}
          onNext={builder.nextStep}
          onBack={builder.prevStep}
        />
      );
    }

    if (isReviewStep) {
      return (
        <ReviewStep
          name={builder.name}
          description={builder.description}
          hasFixedSubjects={builder.hasFixedSubjects}
          subjects={builder.subjects}
          category={builder.category}
          tags={builder.tags}
          totalDuration={builder.totalDuration}
          hasSectionWiseTime={builder.hasSectionWiseTime}
          sections={builder.sections}
          hasSections={builder.hasSections}
          hasUniformMarking={builder.hasUniformMarking}
          defaultMarksPerQuestion={builder.defaultMarksPerQuestion}
          hasNegativeMarking={builder.hasNegativeMarking}
          defaultNegativeMarks={builder.defaultNegativeMarks}
          hasPartialMarking={builder.hasPartialMarking}
          totalQuestions={builder.totalQuestions}
          totalMarks={builder.totalMarks}
          subjectQuestionCounts={builder.subjectQuestionCounts}
          isEditing={builder.isEditing}
          isProcessing={builder.isProcessing}
          goToStep={builder.goToStep}
          onSave={builder.handleSave}
          onBack={builder.prevStep}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20 sm:pb-6">
      <PageHeader
        title={builder.isEditing ? "Edit Pattern" : "Create Pattern"}
        description={builder.isEditing ? "Modify your exam pattern configuration" : "Build a reusable exam pattern template"}
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams New", href: "/institute/exams-new" },
          { label: "Patterns", href: "/institute/exams-new/patterns" },
          { label: builder.isEditing ? "Edit" : "Create" },
        ]}
      />

      <PatternStepper currentStep={builder.currentStep} totalSteps={builder.totalSteps} hasSections={builder.hasSections} />

      <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 shadow-soft border border-border/50 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto">
        {getStepContent()}
      </div>
    </div>
  );
};

export default PatternBuilder;
