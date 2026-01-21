import { PageHeader } from "@/components/ui/page-header";
import { usePatternBuilder } from "@/hooks/usePatternBuilder";
import { PatternStepper } from "@/components/institute/exams-new/PatternStepper";
import { BasicInfoStep } from "@/components/institute/exams-new/steps/BasicInfoStep";
import { DurationStep } from "@/components/institute/exams-new/steps/DurationStep";
import { SectionsStep } from "@/components/institute/exams-new/steps/SectionsStep";
import { MarkingStep } from "@/components/institute/exams-new/steps/MarkingStep";
import { ReviewStep } from "@/components/institute/exams-new/steps/ReviewStep";

const PatternBuilder = () => {
  const builder = usePatternBuilder();

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
          <DurationStep
            totalDuration={builder.totalDuration}
            setTotalDuration={builder.setTotalDuration}
            hasSectionWiseTime={builder.hasSectionWiseTime}
            setHasSectionWiseTime={builder.setHasSectionWiseTime}
            canProceed={builder.canProceedStep2}
            onNext={builder.nextStep}
            onBack={builder.prevStep}
          />
        );
      case 3:
        return (
          <SectionsStep
            sections={builder.sections}
            hasFixedSubjects={builder.hasFixedSubjects}
            subjects={builder.subjects}
            hasSectionWiseTime={builder.hasSectionWiseTime}
            hasUniformMarking={builder.hasUniformMarking}
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
      case 4:
        return (
          <MarkingStep
            sections={builder.sections}
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
            canProceed={builder.canProceedStep4}
            onNext={builder.nextStep}
            onBack={builder.prevStep}
          />
        );
      case 5:
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
            hasUniformMarking={builder.hasUniformMarking}
            defaultMarksPerQuestion={builder.defaultMarksPerQuestion}
            hasNegativeMarking={builder.hasNegativeMarking}
            defaultNegativeMarks={builder.defaultNegativeMarks}
            hasPartialMarking={builder.hasPartialMarking}
            totalQuestions={builder.totalQuestions}
            totalMarks={builder.totalMarks}
            isEditing={builder.isEditing}
            isProcessing={builder.isProcessing}
            goToStep={builder.goToStep}
            onSave={builder.handleSave}
            onBack={builder.prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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

      <PatternStepper currentStep={builder.currentStep} totalSteps={builder.totalSteps} />

      <div className="bg-card rounded-2xl p-4 sm:p-8 shadow-soft border border-border/50 max-w-2xl mx-auto">
        {getStepContent()}
      </div>
    </div>
  );
};

export default PatternBuilder;
