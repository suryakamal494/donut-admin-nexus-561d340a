import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SourceTypeSelector } from "@/components/parameters";
import { ContentSourceType } from "@/components/parameters/SourceTypeSelector";
import { getActiveCurriculums, getPublishedCourses, getAllCourseChapters } from "@/data/masterData";
import { classes, subjects } from "@/data/mockData";
import { getChaptersByClassAndSubject } from "@/data/cbseMasterData";

const questionTypes = [
  { id: "mcq", label: "MCQ (Single Correct)" },
  { id: "multiple", label: "Multiple Correct" },
  { id: "numerical", label: "Numerical" },
  { id: "truefalse", label: "True/False" },
  { id: "assertion", label: "Assertion-Reasoning" },
  { id: "fill", label: "Fill in Blanks" },
  { id: "short", label: "Short Answer" },
  { id: "long", label: "Long Answer" },
];

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<"true" | "false" | "">("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Source & Visibility state
  const [sourceType, setSourceType] = useState<ContentSourceType>('curriculum');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const activeCurriculums = getActiveCurriculums();
  const publishedCourses = getPublishedCourses();

  // Get chapters based on source type - now includes ALL course chapters (owned + mapped)
  const availableChapters = sourceType === 'curriculum' && selectedClassId && selectedSubjectId
    ? getChaptersByClassAndSubject(selectedClassId, selectedSubjectId)
    : sourceType === 'course' && selectedCourseId
      ? getAllCourseChapters(selectedCourseId)
      : [];

  const handleSubmit = () => {
    toast({ title: "Question Created!", description: "Question has been added to the bank." });
    navigate("/superadmin/questions");
  };

  const handleSourceTypeChange = (type: ContentSourceType) => {
    setSourceType(type);
    // Reset selections when switching
    setSelectedCurriculumId("");
    setSelectedCourseId("");
    setSelectedClassId("");
    setSelectedSubjectId("");
    setSelectedChapterId("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Question"
        description="Add a new question to the question bank"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Questions", href: "/superadmin/questions" },
          { label: "Create" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Question Details</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Question Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                  {questionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQuestionType(type.id)}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-medium transition-all",
                        questionType === type.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Question Text</Label>
                <Textarea placeholder="Enter your question..." className="min-h-24 sm:min-h-32 text-sm" />
              </div>
              {(questionType === "mcq" || questionType === "multiple") && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm">Options</Label>
                  {options.map((_, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input placeholder={`Option ${index + 1}`} className="flex-1 h-9 text-sm" />
                      <input type={questionType === "multiple" ? "checkbox" : "radio"} name="correct" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  ))}
                </div>
              )}
              {questionType === "numerical" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm">Correct Answer</Label>
                  <Input type="number" placeholder="Enter numerical answer" className="h-9 text-sm" />
                </div>
              )}
              {questionType === "truefalse" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm">Correct Answer</Label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="truefalse" 
                        value="true"
                        checked={trueFalseAnswer === "true"}
                        onChange={(e) => setTrueFalseAnswer(e.target.value as "true" | "false")}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-primary" 
                      />
                      <span className="text-sm font-medium">True</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="truefalse" 
                        value="false"
                        checked={trueFalseAnswer === "false"}
                        onChange={(e) => setTrueFalseAnswer(e.target.value as "true" | "false")}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-primary" 
                      />
                      <span className="text-sm font-medium">False</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Solution (Optional)</Label>
                <Textarea placeholder="Explain the solution..." className="min-h-20 sm:min-h-24 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Hint (Optional)</Label>
                <Input placeholder="Provide a hint for students" className="h-9 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Source Type & Classification */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Classification</h3>
            <div className="space-y-3 sm:space-y-4">
              <SourceTypeSelector 
                value={sourceType} 
                onChange={handleSourceTypeChange} 
              />

              {sourceType === 'curriculum' ? (
                <>
                  <div className="space-y-2">
                    <Label>Curriculum *</Label>
                    <Select value={selectedCurriculumId} onValueChange={setSelectedCurriculumId}>
                      <SelectTrigger><SelectValue placeholder="Select curriculum" /></SelectTrigger>
                      <SelectContent>
                        {activeCurriculums.map((curr) => (
                          <SelectItem key={curr.id} value={curr.id}>{curr.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class *</Label>
                    <Select value={selectedClassId} onValueChange={(v) => { setSelectedClassId(v); setSelectedSubjectId(""); setSelectedChapterId(""); }}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select value={selectedSubjectId} onValueChange={(v) => { setSelectedSubjectId(v); setSelectedChapterId(""); }}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                      <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                      <SelectContent>
                        {availableChapters.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Course *</Label>
                    <Select value={selectedCourseId} onValueChange={(v) => { setSelectedCourseId(v); setSelectedChapterId(""); }}>
                      <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        {publishedCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                      <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                      <SelectContent>
                        {availableChapters.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Marking */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Marking</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Marks</Label>
                <Input type="number" defaultValue="4" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Negative Marks</Label>
                <Input type="number" defaultValue="1" className="h-9 text-sm" />
              </div>
            </div>
          </div>

          <Button className="w-full gradient-button text-sm" onClick={handleSubmit}>Save Question</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
