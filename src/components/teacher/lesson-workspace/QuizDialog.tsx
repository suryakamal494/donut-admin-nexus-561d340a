import { useState, useMemo } from "react";
import { 
  Sparkles, 
  Search,
  Loader2,
  Check,
  CircleDot,
  CheckSquare,
  Calculator,
  Scale,
  FileText,
  Grid3X3,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type LessonPlanBlock } from "./types";
import { 
  mockQuestions, 
  type Question, 
  type QuestionType,
  difficultyConfig,
  questionTypeLabels,
} from "@/data/questionsData";

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
}

// Question type icon mapping
const getQuestionTypeIcon = (type: QuestionType) => {
  switch (type) {
    case 'mcq_single': return CircleDot;
    case 'mcq_multiple': return CheckSquare;
    case 'numerical': return Calculator;
    case 'assertion_reasoning': return Scale;
    case 'paragraph': return FileText;
    case 'matrix_match': return Grid3X3;
    default: return CircleDot;
  }
};

// Question card component
const QuestionItem = ({ 
  question, 
  isSelected, 
  onToggle 
}: { 
  question: Question; 
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const TypeIcon = getQuestionTypeIcon(question.type);
  const difficulty = difficultyConfig[question.difficulty];
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all",
        isSelected 
          ? "bg-primary/5 border-primary/30" 
          : "bg-background border-border/50 hover:border-primary/20"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isSelected} 
          className="mt-1 shrink-0"
          onCheckedChange={onToggle}
        />
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">
              {question.questionId}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 gap-1">
              <TypeIcon className="w-3 h-3" />
              {questionTypeLabels[question.type].replace('MCQ ', '').slice(0, 10)}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("text-[10px] px-1.5 py-0.5 h-5", difficulty.className)}
            >
              {difficulty.label}
            </Badge>
          </div>
          
          {/* Question text */}
          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
            {question.questionText}
          </p>
          
          {/* Options preview for MCQ */}
          {question.options && question.options.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {question.options.slice(0, 4).map((opt, i) => (
                <span 
                  key={opt.id} 
                  className={cn(
                    "text-xs",
                    opt.isCorrect ? "text-success font-medium" : "text-muted-foreground"
                  )}
                >
                  {String.fromCharCode(65 + i)}. {opt.text.slice(0, 20)}{opt.text.length > 20 ? '...' : ''}
                  {opt.isCorrect && ' ✓'}
                </span>
              ))}
            </div>
          )}
          
          {/* Chapter tag */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              {question.subject} › {question.chapter}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuizDialog = ({ 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
}: QuizDialogProps) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'ai'>('bank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  
  // AI generate state
  const [aiPrompt, setAiPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Filter questions
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      const matchesSearch = searchQuery === '' || 
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || q.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      
      // If subject/chapter context is provided, prioritize those
      const matchesContext = !subject || q.subject.toLowerCase() === subject.toLowerCase();
      
      return matchesSearch && matchesType && matchesDifficulty && matchesContext;
    });
  }, [searchQuery, selectedType, selectedDifficulty, subject]);
  
  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };
  
  const handleAddSelected = () => {
    if (selectedQuestions.size === 0) return;
    
    onAddBlock({
      type: 'quiz',
      title: `Quiz: ${selectedQuestions.size} Questions`,
      source: 'library',
      questions: Array.from(selectedQuestions),
      duration: selectedQuestions.size * 2,
    });
    
    setSelectedQuestions(new Set());
    onOpenChange(false);
  };
  
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAddBlock({
      type: 'quiz',
      title: `AI Quiz: ${questionCount} Questions on ${chapter || 'Topic'}`,
      content: aiPrompt,
      source: 'ai',
      questions: Array.from({ length: questionCount }, (_, i) => `ai-q-${i}`),
      duration: questionCount * 2,
      aiGenerated: true,
    });
    
    setIsGenerating(false);
    setAiPrompt('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <DialogTitle className="text-lg">Add Quiz Block</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'bank' 
              ? `${filteredQuestions.length} questions available` 
              : 'Generate questions with AI'}
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'bank' | 'ai')} className="flex flex-col flex-1">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="bank" className="text-xs gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  Question Bank
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generate
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Question Bank Tab */}
            <TabsContent value="bank" className="mt-0 flex-1 flex flex-col min-h-0">
              {/* Filters */}
              <div className="px-4 py-3 space-y-2 border-b shrink-0">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                
                {/* Filter row */}
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <Filter className="w-3.5 h-3.5 mr-1" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all" className="text-xs">All Types</SelectItem>
                      <SelectItem value="mcq_single" className="text-xs">MCQ Single</SelectItem>
                      <SelectItem value="mcq_multiple" className="text-xs">MCQ Multiple</SelectItem>
                      <SelectItem value="numerical" className="text-xs">Numerical</SelectItem>
                      <SelectItem value="assertion_reasoning" className="text-xs">Assertion</SelectItem>
                      <SelectItem value="paragraph" className="text-xs">Paragraph</SelectItem>
                      <SelectItem value="matrix_match" className="text-xs">Matrix Match</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all" className="text-xs">All Levels</SelectItem>
                      <SelectItem value="easy" className="text-xs">Easy</SelectItem>
                      <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                      <SelectItem value="hard" className="text-xs">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Selection summary */}
                {selectedQuestions.size > 0 && (
                  <div className="flex items-center justify-between py-2 px-3 bg-primary/5 rounded-md">
                    <span className="text-sm font-medium text-primary">
                      {selectedQuestions.size} question{selectedQuestions.size > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedQuestions(new Set())}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Question List - with proper scroll container */}
              <ScrollArea className="flex-1 min-h-0 h-[280px]">
                <div className="p-3 space-y-2">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        isSelected={selectedQuestions.has(question.id)}
                        onToggle={() => toggleQuestion(question.id)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Search className="w-10 h-10 mb-3 opacity-50" />
                      <p className="text-sm font-medium">No questions found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Footer with Add button */}
              <div className="p-4 border-t shrink-0">
                <Button
                  className="w-full gradient-button gap-2"
                  onClick={handleAddSelected}
                  disabled={selectedQuestions.size === 0}
                >
                  <Check className="w-4 h-4" />
                  Add {selectedQuestions.size || ''} Question{selectedQuestions.size !== 1 ? 's' : ''} to Quiz
                </Button>
              </div>
            </TabsContent>
            
            {/* AI Generate Tab */}
            <TabsContent value="ai" className="mt-0 p-4 space-y-4">
              {/* Question Count */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  How many questions?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 5, 10, 15].map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? 'default' : 'outline'}
                      size="sm"
                      className={cn("h-9 px-4", questionCount === count && "gradient-button")}
                      onClick={() => setQuestionCount(count)}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Topic Input */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Topic or specific focus (optional)
                </label>
                <Textarea
                  placeholder={`e.g., "Focus on numerical problems about force calculation..."`}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[100px] text-sm resize-none"
                />
              </div>
              
              {chapter && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Context:</span>
                  <Badge variant="secondary" className="text-xs">
                    {subject} • {chapter}
                  </Badge>
                </div>
              )}
              
              <Button
                className="w-full gradient-button gap-2"
                onClick={handleAIGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate {questionCount} Questions
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
