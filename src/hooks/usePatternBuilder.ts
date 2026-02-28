import { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ExamPattern,
  ExamSection,
  QuestionType,
  getPatternById,
} from "@/data/examPatternsData";

// ============================================
// TYPES
// ============================================

export interface SectionDraft {
  id: string;
  name: string;
  subjectId: string | null;
  questionCount: number;
  questionTypes: QuestionType[];
  isOptional: boolean;
  attemptLimit: number | null;
  marksPerQuestion: number;
  negativeMarks: number;
  timeLimit: number | null;
  partialMarkingEnabled: boolean;
  partialMarkingPercent: number;
}

export interface PatternBuilderState {
  // Step 1: Basic Info
  name: string;
  description: string;
  hasFixedSubjects: boolean;
  subjects: string[];
  category: ExamPattern["category"];
  tags: string[];
  
  // Step 2: Duration & Marks
  totalDuration: number;
  hasSectionWiseTime: boolean;
  hasUniformMarking: boolean;
  defaultMarksPerQuestion: number;
  hasNegativeMarking: boolean;
  defaultNegativeMarks: number;
  hasPartialMarking: boolean;
  subjectQuestionCounts: Record<string, number>;
  hasSections: boolean;
  
  // Step 3: Sections (conditional)
  sections: SectionDraft[];
  
  // Navigation
  currentStep: number;
  isEditing: boolean;
  patternId: string | null;
  isProcessing: boolean;
}

const defaultSection: SectionDraft = {
  id: "",
  name: "Section A",
  subjectId: null,
  questionCount: 10,
  questionTypes: ["single_correct"],
  isOptional: false,
  attemptLimit: null,
  marksPerQuestion: 4,
  negativeMarks: 0,
  timeLimit: null,
  partialMarkingEnabled: false,
  partialMarkingPercent: 0,
};

const generateId = () => `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// AVAILABLE SUBJECTS
// ============================================

export const availableSubjects = [
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "mathematics", name: "Mathematics" },
  { id: "biology", name: "Biology" },
  { id: "english", name: "English" },
  { id: "hindi", name: "Hindi" },
  { id: "social_science", name: "Social Science" },
  { id: "computer_science", name: "Computer Science" },
];

// ============================================
// HOOK
// ============================================

export function usePatternBuilder() {
  const navigate = useNavigate();
  const { patternId } = useParams<{ patternId: string }>();
  const { toast } = useToast();
  
  const existingPattern = patternId ? getPatternById(patternId) : null;
  const isEditing = !!existingPattern;
  
  const [state, setState] = useState<PatternBuilderState>(() => {
    if (existingPattern) {
      return {
        name: existingPattern.name,
        description: existingPattern.description,
        hasFixedSubjects: existingPattern.hasFixedSubjects,
        subjects: existingPattern.subjects,
        category: existingPattern.category,
        tags: existingPattern.tags,
        totalDuration: existingPattern.totalDuration,
        hasSectionWiseTime: existingPattern.hasSectionWiseTime,
        sections: existingPattern.sections.map(s => ({ ...s })),
        hasUniformMarking: existingPattern.hasUniformMarking,
        defaultMarksPerQuestion: existingPattern.defaultMarksPerQuestion,
        hasNegativeMarking: existingPattern.hasNegativeMarking,
        defaultNegativeMarks: existingPattern.defaultNegativeMarks,
        hasPartialMarking: existingPattern.hasPartialMarking,
        subjectQuestionCounts: {},
        hasSections: existingPattern.sections.length > 1,
        currentStep: 1,
        isEditing: true,
        patternId: existingPattern.id,
        isProcessing: false,
      };
    }
    
    return {
      name: "",
      description: "",
      hasFixedSubjects: false,
      subjects: [],
      category: "custom",
      tags: [],
      totalDuration: 60,
      hasSectionWiseTime: false,
      sections: [{ ...defaultSection, id: generateId() }],
      hasUniformMarking: true,
      defaultMarksPerQuestion: 4,
      hasNegativeMarking: false,
      defaultNegativeMarks: 1,
      hasPartialMarking: false,
      subjectQuestionCounts: {},
      hasSections: false,
      currentStep: 1,
      isEditing: false,
      patternId: null,
      isProcessing: false,
    };
  });

  // ============================================
  // STEP 1: BASIC INFO
  // ============================================
  
  const setName = useCallback((name: string) => {
    setState(prev => ({ ...prev, name }));
  }, []);
  
  const setDescription = useCallback((description: string) => {
    setState(prev => ({ ...prev, description }));
  }, []);
  
  const setHasFixedSubjects = useCallback((hasFixedSubjects: boolean) => {
    setState(prev => ({ 
      ...prev, 
      hasFixedSubjects,
      subjects: hasFixedSubjects ? prev.subjects : [],
      subjectQuestionCounts: hasFixedSubjects ? prev.subjectQuestionCounts : {},
    }));
  }, []);
  
  const toggleSubject = useCallback((subjectId: string) => {
    setState(prev => {
      const newSubjects = prev.subjects.includes(subjectId)
        ? prev.subjects.filter(s => s !== subjectId)
        : [...prev.subjects, subjectId];
      
      // Clean up question counts for removed subjects
      const newCounts = { ...prev.subjectQuestionCounts };
      if (!newSubjects.includes(subjectId)) {
        delete newCounts[subjectId];
      }
      
      return {
        ...prev,
        subjects: newSubjects,
        subjectQuestionCounts: newCounts,
      };
    });
  }, []);
  
  const setCategory = useCallback((category: ExamPattern["category"]) => {
    setState(prev => ({ ...prev, category }));
  }, []);
  
  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !state.tags.includes(trimmed)) {
      setState(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
  }, [state.tags]);
  
  const removeTag = useCallback((tag: string) => {
    setState(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  // ============================================
  // STEP 2: DURATION & MARKS
  // ============================================
  
  const setTotalDuration = useCallback((totalDuration: number) => {
    setState(prev => ({ ...prev, totalDuration }));
  }, []);
  
  const setHasSectionWiseTime = useCallback((hasSectionWiseTime: boolean) => {
    setState(prev => ({ ...prev, hasSectionWiseTime }));
  }, []);

  const setHasUniformMarking = useCallback((hasUniformMarking: boolean) => {
    setState(prev => ({ ...prev, hasUniformMarking }));
  }, []);
  
  const setDefaultMarksPerQuestion = useCallback((defaultMarksPerQuestion: number) => {
    setState(prev => ({ ...prev, defaultMarksPerQuestion }));
  }, []);
  
  const setHasNegativeMarking = useCallback((hasNegativeMarking: boolean) => {
    setState(prev => ({ ...prev, hasNegativeMarking }));
  }, []);
  
  const setDefaultNegativeMarks = useCallback((defaultNegativeMarks: number) => {
    setState(prev => ({ ...prev, defaultNegativeMarks }));
  }, []);
  
  const setHasPartialMarking = useCallback((hasPartialMarking: boolean) => {
    setState(prev => ({ ...prev, hasPartialMarking }));
  }, []);

  const setSubjectQuestionCount = useCallback((subjectId: string, count: number) => {
    setState(prev => ({
      ...prev,
      subjectQuestionCounts: { ...prev.subjectQuestionCounts, [subjectId]: count },
    }));
  }, []);

  const setHasSections = useCallback((hasSections: boolean) => {
    setState(prev => ({ ...prev, hasSections }));
  }, []);

  // ============================================
  // STEP 3: SECTIONS (conditional)
  // ============================================
  
  const addSection = useCallback(() => {
    const sectionNumber = state.sections.length + 1;
    const sectionLetter = String.fromCharCode(64 + sectionNumber);
    
    setState(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          ...defaultSection,
          id: generateId(),
          name: `Section ${sectionLetter}`,
        },
      ],
    }));
  }, [state.sections.length]);
  
  const removeSection = useCallback((sectionId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
  }, []);
  
  const updateSection = useCallback((sectionId: string, updates: Partial<SectionDraft>) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  }, []);
  
  const reorderSections = useCallback((newSections: SectionDraft[]) => {
    setState(prev => ({ ...prev, sections: newSections }));
  }, []);
  
  const duplicateSection = useCallback((sectionId: string) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      setState(prev => ({
        ...prev,
        sections: [
          ...prev.sections,
          { ...section, id: generateId(), name: `${section.name} (Copy)` },
        ],
      }));
    }
  }, [state.sections]);

  // ============================================
  // NAVIGATION — dynamic steps
  // ============================================
  
  const totalSteps = state.hasSections ? 4 : 3;

  // Map logical step to actual step
  const getActualStep = useCallback((logicalStep: number) => {
    // Steps: 1=BasicInfo, 2=DurationMarks, 3=Sections(if enabled)|Review, 4=Review(if sections)
    return logicalStep;
  }, []);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);
  
  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, totalSteps),
    }));
  }, [totalSteps]);
  
  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Per-subject question count (used when hasFixedSubjects)
  const perSubjectQuestionCount = useMemo(() => {
    if (!state.hasFixedSubjects || state.subjects.length === 0) return 0;
    const firstSubject = state.subjects[0];
    return state.subjectQuestionCounts[firstSubject] || 0;
  }, [state.hasFixedSubjects, state.subjects, state.subjectQuestionCounts]);

  const totalQuestions = useMemo(() => {
    if (state.hasFixedSubjects && state.subjects.length > 0) {
      return state.subjects.reduce((sum, subjectId) => {
        return sum + (state.subjectQuestionCounts[subjectId] || 0);
      }, 0);
    }
    // Fallback: sum from sections
    return state.sections.reduce((total, section) => {
      if (section.isOptional && section.attemptLimit) {
        return total + section.attemptLimit;
      }
      return total + section.questionCount;
    }, 0);
  }, [state.hasFixedSubjects, state.subjects, state.subjectQuestionCounts, state.sections]);
  
  const totalMarks = useMemo(() => {
    if (state.hasFixedSubjects && state.subjects.length > 0 && state.hasUniformMarking) {
      return totalQuestions * state.defaultMarksPerQuestion;
    }
    return state.sections.reduce((total, section) => {
      const marks = state.hasUniformMarking 
        ? state.defaultMarksPerQuestion 
        : section.marksPerQuestion;
      const count = section.isOptional && section.attemptLimit 
        ? section.attemptLimit 
        : section.questionCount;
      return total + (count * marks);
    }, 0);
  }, [totalQuestions, state.hasFixedSubjects, state.subjects, state.hasUniformMarking, state.defaultMarksPerQuestion, state.sections]);

  // ============================================
  // VALIDATION
  // ============================================
  
  const canProceedStep1 = useMemo(() => {
    return state.name.trim().length > 0 && 
           (!state.hasFixedSubjects || state.subjects.length > 0);
  }, [state.name, state.hasFixedSubjects, state.subjects]);
  
  const canProceedStep2 = useMemo(() => {
    if (state.totalDuration <= 0) return false;
    if (state.hasUniformMarking && state.defaultMarksPerQuestion <= 0) return false;
    // If fixed subjects, at least one subject must have question count > 0
    if (state.hasFixedSubjects && state.subjects.length > 0) {
      const hasQuestions = state.subjects.some(s => (state.subjectQuestionCounts[s] || 0) > 0);
      if (!hasQuestions) return false;
    }
    return true;
  }, [state.totalDuration, state.hasUniformMarking, state.defaultMarksPerQuestion, state.hasFixedSubjects, state.subjects, state.subjectQuestionCounts]);
  
  const canProceedStep3 = useMemo(() => {
    if (!state.hasSections) return true;
    
    const sectionsValid = state.sections.length > 0 && 
           state.sections.every(s => 
             s.name.trim().length > 0 && 
             s.questionCount > 0 && 
             s.questionTypes.length > 0
           );
    
    if (!sectionsValid) return false;

    // Validate section question totals against per-subject count
    if (state.hasFixedSubjects && state.subjects.length > 0) {
      const sectionTotal = state.sections.reduce((sum, s) => sum + s.questionCount, 0);
      const targetPerSubject = state.subjectQuestionCounts[state.subjects[0]] || 0;
      if (targetPerSubject > 0 && sectionTotal !== targetPerSubject) return false;
    }

    return true;
  }, [state.hasSections, state.sections, state.hasFixedSubjects, state.subjects, state.subjectQuestionCounts]);

  // ============================================
  // SAVE / SUBMIT
  // ============================================
  
  const handleSave = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: state.isEditing ? "Pattern Updated" : "Pattern Created",
      description: `"${state.name}" has been ${state.isEditing ? 'updated' : 'saved'} successfully.`,
    });
    
    navigate("/institute/exams-new/patterns");
  }, [state.name, state.isEditing, toast, navigate]);
  
  const handleCancel = useCallback(() => {
    navigate("/institute/exams-new/patterns");
  }, [navigate]);

  return {
    // State
    ...state,
    totalSteps,
    totalQuestions,
    totalMarks,
    existingPattern,
    perSubjectQuestionCount,
    
    // Step 1 actions
    setName,
    setDescription,
    setHasFixedSubjects,
    toggleSubject,
    setCategory,
    addTag,
    removeTag,
    
    // Step 2 actions (Duration & Marks)
    setTotalDuration,
    setHasSectionWiseTime,
    setHasUniformMarking,
    setDefaultMarksPerQuestion,
    setHasNegativeMarking,
    setDefaultNegativeMarks,
    setHasPartialMarking,
    setSubjectQuestionCount,
    setHasSections,
    
    // Step 3 actions (Sections)
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    duplicateSection,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    
    // Validation
    canProceedStep1,
    canProceedStep2,
    canProceedStep3,
    
    // Actions
    handleSave,
    handleCancel,
  };
}
