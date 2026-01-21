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
  
  // Step 2: Duration
  totalDuration: number;
  hasSectionWiseTime: boolean;
  
  // Step 3: Sections
  sections: SectionDraft[];
  
  // Step 4: Marking
  hasUniformMarking: boolean;
  defaultMarksPerQuestion: number;
  hasNegativeMarking: boolean;
  defaultNegativeMarks: number;
  hasPartialMarking: boolean;
  
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
  
  // Check if editing
  const existingPattern = patternId ? getPatternById(patternId) : null;
  const isEditing = !!existingPattern;
  
  // Initialize state
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
    }));
  }, []);
  
  const toggleSubject = useCallback((subjectId: string) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(s => s !== subjectId)
        : [...prev.subjects, subjectId],
    }));
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
  // STEP 2: DURATION
  // ============================================
  
  const setTotalDuration = useCallback((totalDuration: number) => {
    setState(prev => ({ ...prev, totalDuration }));
  }, []);
  
  const setHasSectionWiseTime = useCallback((hasSectionWiseTime: boolean) => {
    setState(prev => ({ ...prev, hasSectionWiseTime }));
  }, []);

  // ============================================
  // STEP 3: SECTIONS
  // ============================================
  
  const addSection = useCallback(() => {
    const sectionNumber = state.sections.length + 1;
    const sectionLetter = String.fromCharCode(64 + sectionNumber); // A, B, C...
    
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
  // STEP 4: MARKING
  // ============================================
  
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

  // ============================================
  // NAVIGATION
  // ============================================
  
  const totalSteps = 5;
  
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);
  
  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, totalSteps),
    }));
  }, []);
  
  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // ============================================
  // VALIDATION
  // ============================================
  
  const canProceedStep1 = useMemo(() => {
    return state.name.trim().length > 0 && 
           (!state.hasFixedSubjects || state.subjects.length > 0);
  }, [state.name, state.hasFixedSubjects, state.subjects]);
  
  const canProceedStep2 = useMemo(() => {
    return state.totalDuration > 0;
  }, [state.totalDuration]);
  
  const canProceedStep3 = useMemo(() => {
    return state.sections.length > 0 && 
           state.sections.every(s => 
             s.name.trim().length > 0 && 
             s.questionCount > 0 && 
             s.questionTypes.length > 0
           );
  }, [state.sections]);
  
  const canProceedStep4 = useMemo(() => {
    if (state.hasUniformMarking) {
      return state.defaultMarksPerQuestion > 0;
    }
    return state.sections.every(s => s.marksPerQuestion > 0);
  }, [state.hasUniformMarking, state.defaultMarksPerQuestion, state.sections]);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const totalQuestions = useMemo(() => {
    return state.sections.reduce((total, section) => {
      if (section.isOptional && section.attemptLimit) {
        return total + section.attemptLimit;
      }
      return total + section.questionCount;
    }, 0);
  }, [state.sections]);
  
  const totalMarks = useMemo(() => {
    return state.sections.reduce((total, section) => {
      const marks = state.hasUniformMarking 
        ? state.defaultMarksPerQuestion 
        : section.marksPerQuestion;
      const count = section.isOptional && section.attemptLimit 
        ? section.attemptLimit 
        : section.questionCount;
      return total + (count * marks);
    }, 0);
  }, [state.sections, state.hasUniformMarking, state.defaultMarksPerQuestion]);

  // ============================================
  // SAVE / SUBMIT
  // ============================================
  
  const handleSave = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    // Simulate save delay
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
    
    // Step 1 actions
    setName,
    setDescription,
    setHasFixedSubjects,
    toggleSubject,
    setCategory,
    addTag,
    removeTag,
    
    // Step 2 actions
    setTotalDuration,
    setHasSectionWiseTime,
    
    // Step 3 actions
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    duplicateSection,
    
    // Step 4 actions
    setHasUniformMarking,
    setDefaultMarksPerQuestion,
    setHasNegativeMarking,
    setDefaultNegativeMarks,
    setHasPartialMarking,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    
    // Validation
    canProceedStep1,
    canProceedStep2,
    canProceedStep3,
    canProceedStep4,
    
    // Actions
    handleSave,
    handleCancel,
  };
}
