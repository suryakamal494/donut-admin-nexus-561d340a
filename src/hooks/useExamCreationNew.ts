import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ExamPattern,
  ExamSection,
  QuestionType,
  getPatternById,
  allExamPatterns,
} from "@/data/examPatternsData";

// ============================================
// TYPES
// ============================================

export type Intent = "pattern" | "quick_test" | null;
export type CreationMethod = "ai" | "bank" | "pdf";

export interface AddedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  subject: string;
  difficulty: string;
  cognitiveType: string;
  marks: number;
  source: CreationMethod;
  sectionId?: string;
}

export interface SectionProgress {
  sectionId: string;
  sectionName: string;
  subjectId: string | null;
  questionTypes: QuestionType[];
  required: number;
  added: number;
}

export interface AIConfig {
  easy: number;
  medium: number;
  hard: number;
  cognitiveTypes: string[];
}

export interface QuickTestConfig {
  totalQuestions: number;
  duration: number;
  marksPerQuestion: number;
  hasNegativeMarking: boolean;
  negativeMarks: number;
}

export interface ExamCreationNewState {
  // Intent
  intent: Intent;
  
  // Pattern path
  selectedPatternId: string | null;
  selectedPattern: ExamPattern | null;
  
  // Subjects (for generic patterns or quick test)
  selectedSubjects: string[];
  
  // Quick Test config
  quickTestConfig: QuickTestConfig;
  
  // Questions
  activeCreationMethod: CreationMethod;
  addedQuestions: AddedQuestion[];
  sectionProgress: SectionProgress[];
  
  // AI Config
  aiConfig: AIConfig;
  
  // PDF Upload
  uploadedFiles: File[];
  isLargeUpload: boolean;
  
  // Question Bank
  selectedBankQuestionIds: string[];
  
  // Batch Assignment
  selectedBatches: string[];
  scheduleDate: string;
  scheduleTime: string;
  
  // Exam Details
  examName: string;
  
  // Navigation
  currentStep: number;
  isProcessing: boolean;
  isComplete: boolean;
}

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

export const cognitiveTypes = [
  { id: "logical", name: "Logical", color: "bg-blue-100 text-blue-700" },
  { id: "analytical", name: "Analytical", color: "bg-purple-100 text-purple-700" },
  { id: "conceptual", name: "Conceptual", color: "bg-green-100 text-green-700" },
  { id: "numerical", name: "Numerical", color: "bg-orange-100 text-orange-700" },
  { id: "application", name: "Application", color: "bg-pink-100 text-pink-700" },
  { id: "memory", name: "Memory", color: "bg-yellow-100 text-yellow-700" },
];

// ============================================
// HOOK
// ============================================

export function useExamCreationNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Check for pre-selected pattern from URL
  const preselectedPatternId = searchParams.get("patternId");
  const preselectedPattern = preselectedPatternId ? getPatternById(preselectedPatternId) : null;
  
  const [state, setState] = useState<ExamCreationNewState>(() => ({
    intent: preselectedPattern ? "pattern" : null,
    selectedPatternId: preselectedPatternId,
    selectedPattern: preselectedPattern,
    selectedSubjects: preselectedPattern?.hasFixedSubjects ? preselectedPattern.subjects : [],
    quickTestConfig: {
      totalQuestions: 20,
      duration: 60,
      marksPerQuestion: 4,
      hasNegativeMarking: false,
      negativeMarks: 1,
    },
    activeCreationMethod: "bank",
    addedQuestions: [],
    sectionProgress: [],
    aiConfig: {
      easy: 30,
      medium: 50,
      hard: 20,
      cognitiveTypes: ["conceptual", "application"],
    },
    uploadedFiles: [],
    isLargeUpload: false,
    selectedBankQuestionIds: [],
    selectedBatches: [],
    scheduleDate: "",
    scheduleTime: "",
    examName: "",
    currentStep: preselectedPattern ? 2 : 1,
    isProcessing: false,
    isComplete: false,
  }));

  // ============================================
  // COMPUTED: STEP CONFIGURATION
  // ============================================
  
  const steps = useMemo(() => {
    if (state.intent === "pattern") {
      const needsSubjectSelection = state.selectedPattern && !state.selectedPattern.hasFixedSubjects;
      return [
        { number: 1, title: "Choose Type", key: "intent" },
        { number: 2, title: "Select Pattern", key: "pattern" },
        ...(needsSubjectSelection ? [{ number: 3, title: "Subjects", key: "subjects" }] : []),
        { number: needsSubjectSelection ? 4 : 3, title: "Add Questions", key: "questions" },
        { number: needsSubjectSelection ? 5 : 4, title: "Assign", key: "batch" },
      ];
    } else if (state.intent === "quick_test") {
      return [
        { number: 1, title: "Choose Type", key: "intent" },
        { number: 2, title: "Subjects", key: "subjects" },
        { number: 3, title: "Configure", key: "config" },
        { number: 4, title: "Add Questions", key: "questions" },
        { number: 5, title: "Assign", key: "batch" },
      ];
    }
    return [{ number: 1, title: "Choose Type", key: "intent" }];
  }, [state.intent, state.selectedPattern]);

  const totalSteps = steps.length;
  
  const currentStepKey = useMemo(() => {
    return steps.find(s => s.number === state.currentStep)?.key || "intent";
  }, [steps, state.currentStep]);

  // ============================================
  // COMPUTED: SECTION PROGRESS (for pattern mode)
  // ============================================
  
  useEffect(() => {
    if (state.selectedPattern) {
      const progress: SectionProgress[] = state.selectedPattern.sections.map(section => ({
        sectionId: section.id,
        sectionName: section.name,
        subjectId: section.subjectId,
        questionTypes: section.questionTypes,
        required: section.isOptional && section.attemptLimit 
          ? section.attemptLimit 
          : section.questionCount,
        added: state.addedQuestions.filter(q => q.sectionId === section.id).length,
      }));
      setState(prev => ({ ...prev, sectionProgress: progress }));
    } else if (state.intent === "quick_test") {
      // For quick test, simple progress by subject
      const progress: SectionProgress[] = state.selectedSubjects.map(subjectId => ({
        sectionId: subjectId,
        sectionName: availableSubjects.find(s => s.id === subjectId)?.name || subjectId,
        subjectId,
        questionTypes: [],
        required: Math.ceil(state.quickTestConfig.totalQuestions / state.selectedSubjects.length),
        added: state.addedQuestions.filter(q => q.subject === subjectId).length,
      }));
      setState(prev => ({ ...prev, sectionProgress: progress }));
    }
  }, [state.selectedPattern, state.addedQuestions, state.selectedSubjects, state.quickTestConfig.totalQuestions, state.intent]);

  // ============================================
  // COMPUTED: TOTALS
  // ============================================
  
  const totalQuestionsRequired = useMemo(() => {
    if (state.intent === "pattern" && state.selectedPattern) {
      return state.selectedPattern.sections.reduce((total, section) => {
        if (section.isOptional && section.attemptLimit) return total + section.attemptLimit;
        return total + section.questionCount;
      }, 0);
    }
    return state.quickTestConfig.totalQuestions;
  }, [state.intent, state.selectedPattern, state.quickTestConfig.totalQuestions]);

  const totalQuestionsAdded = state.addedQuestions.length;
  const questionsRemaining = totalQuestionsRequired - totalQuestionsAdded;

  // ============================================
  // INTENT ACTIONS
  // ============================================
  
  const setIntent = useCallback((intent: Intent) => {
    setState(prev => ({
      ...prev,
      intent,
      currentStep: 2,
      selectedPatternId: null,
      selectedPattern: null,
      selectedSubjects: [],
      addedQuestions: [],
    }));
  }, []);

  // ============================================
  // PATTERN ACTIONS
  // ============================================
  
  const selectPattern = useCallback((patternId: string) => {
    const pattern = getPatternById(patternId);
    setState(prev => ({
      ...prev,
      selectedPatternId: patternId,
      selectedPattern: pattern || null,
      selectedSubjects: pattern?.hasFixedSubjects ? pattern.subjects : prev.selectedSubjects,
      examName: pattern ? `${pattern.name} - Test` : prev.examName,
    }));
  }, []);

  // ============================================
  // SUBJECT ACTIONS
  // ============================================
  
  const toggleSubject = useCallback((subjectId: string) => {
    setState(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter(s => s !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  }, []);

  // ============================================
  // QUICK TEST CONFIG ACTIONS
  // ============================================
  
  const updateQuickTestConfig = useCallback((updates: Partial<QuickTestConfig>) => {
    setState(prev => ({
      ...prev,
      quickTestConfig: { ...prev.quickTestConfig, ...updates },
    }));
  }, []);

  // ============================================
  // CREATION METHOD ACTIONS
  // ============================================
  
  const setActiveCreationMethod = useCallback((method: CreationMethod) => {
    setState(prev => ({ ...prev, activeCreationMethod: method }));
  }, []);

  // ============================================
  // AI CONFIG ACTIONS
  // ============================================
  
  const updateAIConfig = useCallback((updates: Partial<AIConfig>) => {
    setState(prev => ({
      ...prev,
      aiConfig: { ...prev.aiConfig, ...updates },
    }));
  }, []);

  const adjustDifficulty = useCallback((key: "easy" | "medium" | "hard", value: number) => {
    setState(prev => {
      const newConfig = { ...prev.aiConfig };
      const diff = value - newConfig[key];
      newConfig[key] = value;
      
      // Adjust others proportionally
      const others = (["easy", "medium", "hard"] as const).filter(k => k !== key);
      const othersTotal = others.reduce((sum, k) => sum + newConfig[k], 0);
      
      if (othersTotal > 0) {
        others.forEach(k => {
          newConfig[k] = Math.max(0, Math.round(newConfig[k] - (diff * newConfig[k] / othersTotal)));
        });
      }
      
      // Ensure total is 100
      const total = newConfig.easy + newConfig.medium + newConfig.hard;
      if (total !== 100) {
        const lastKey = others[others.length - 1];
        newConfig[lastKey] += 100 - total;
      }
      
      return { ...prev, aiConfig: newConfig };
    });
  }, []);

  const toggleCognitiveType = useCallback((typeId: string) => {
    setState(prev => ({
      ...prev,
      aiConfig: {
        ...prev.aiConfig,
        cognitiveTypes: prev.aiConfig.cognitiveTypes.includes(typeId)
          ? prev.aiConfig.cognitiveTypes.filter(t => t !== typeId)
          : [...prev.aiConfig.cognitiveTypes, typeId],
      },
    }));
  }, []);

  // ============================================
  // QUESTION ACTIONS
  // ============================================
  
  const addQuestion = useCallback((question: AddedQuestion) => {
    setState(prev => ({
      ...prev,
      addedQuestions: [...prev.addedQuestions, question],
    }));
  }, []);

  const addQuestions = useCallback((questions: AddedQuestion[]) => {
    setState(prev => ({
      ...prev,
      addedQuestions: [...prev.addedQuestions, ...questions],
    }));
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setState(prev => ({
      ...prev,
      addedQuestions: prev.addedQuestions.filter(q => q.id !== questionId),
      selectedBankQuestionIds: prev.selectedBankQuestionIds.filter(id => id !== questionId),
    }));
  }, []);

  const clearAllQuestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      addedQuestions: [],
      selectedBankQuestionIds: [],
    }));
  }, []);

  // Question Bank specific
  const toggleBankQuestion = useCallback((questionId: string, question: AddedQuestion) => {
    setState(prev => {
      const isSelected = prev.selectedBankQuestionIds.includes(questionId);
      if (isSelected) {
        return {
          ...prev,
          selectedBankQuestionIds: prev.selectedBankQuestionIds.filter(id => id !== questionId),
          addedQuestions: prev.addedQuestions.filter(q => q.id !== questionId),
        };
      } else {
        return {
          ...prev,
          selectedBankQuestionIds: [...prev.selectedBankQuestionIds, questionId],
          addedQuestions: [...prev.addedQuestions, question],
        };
      }
    });
  }, []);

  // ============================================
  // PDF ACTIONS
  // ============================================
  
  const handleFileUpload = useCallback((files: File[]) => {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const isLarge = totalSize > 5 * 1024 * 1024 || files.length > 2;
    
    setState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files],
      isLargeUpload: isLarge,
    }));
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.name !== fileName),
    }));
  }, []);

  // ============================================
  // BATCH ACTIONS
  // ============================================
  
  const toggleBatch = useCallback((batchId: string) => {
    setState(prev => ({
      ...prev,
      selectedBatches: prev.selectedBatches.includes(batchId)
        ? prev.selectedBatches.filter(id => id !== batchId)
        : [...prev.selectedBatches, batchId],
    }));
  }, []);

  const setScheduleDate = useCallback((date: string) => {
    setState(prev => ({ ...prev, scheduleDate: date }));
  }, []);

  const setScheduleTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, scheduleTime: time }));
  }, []);

  const setExamName = useCallback((name: string) => {
    setState(prev => ({ ...prev, examName: name }));
  }, []);

  // ============================================
  // NAVIGATION
  // ============================================
  
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
  // VALIDATION
  // ============================================
  
  const canProceedPattern = state.selectedPatternId !== null;
  
  const canProceedSubjects = state.selectedSubjects.length > 0;
  
  const canProceedConfig = state.quickTestConfig.totalQuestions > 0 && 
                           state.quickTestConfig.duration > 0;
  
  const canProceedQuestions = totalQuestionsAdded > 0;

  // ============================================
  // SUBMIT
  // ============================================
  
  const handleCreate = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Exam Created Successfully!",
      description: `"${state.examName || 'New Exam'}" has been created with ${totalQuestionsAdded} questions.`,
    });
    
    setState(prev => ({ ...prev, isProcessing: false, isComplete: true }));
  }, [state.examName, totalQuestionsAdded, toast]);

  const handleCancel = useCallback(() => {
    navigate("/institute/exams-new");
  }, [navigate]);

  const handleBackToExams = useCallback(() => {
    navigate("/institute/exams-new");
  }, [navigate]);

  return {
    // State
    ...state,
    steps,
    totalSteps,
    currentStepKey,
    totalQuestionsRequired,
    totalQuestionsAdded,
    questionsRemaining,
    allPatterns: allExamPatterns,
    
    // Intent actions
    setIntent,
    
    // Pattern actions
    selectPattern,
    
    // Subject actions
    toggleSubject,
    
    // Quick test actions
    updateQuickTestConfig,
    
    // Creation method actions
    setActiveCreationMethod,
    
    // AI config actions
    updateAIConfig,
    adjustDifficulty,
    toggleCognitiveType,
    
    // Question actions
    addQuestion,
    addQuestions,
    removeQuestion,
    clearAllQuestions,
    toggleBankQuestion,
    
    // PDF actions
    handleFileUpload,
    removeFile,
    
    // Batch actions
    toggleBatch,
    setScheduleDate,
    setScheduleTime,
    setExamName,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    
    // Validation
    canProceedPattern,
    canProceedSubjects,
    canProceedConfig,
    canProceedQuestions,
    
    // Submit
    handleCreate,
    handleCancel,
    handleBackToExams,
  };
}
