import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Eye, FileText } from "lucide-react";

interface CompletionStepProps {
  examName: string;
  totalQuestions: number;
  onBackToExams: () => void;
  onReviewQuestions: () => void;
}

export function CompletionStep({
  examName,
  totalQuestions,
  onBackToExams,
  onReviewQuestions,
}: CompletionStepProps) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Exam Created Successfully!</h2>
        <p className="text-muted-foreground">
          "{examName || "New Exam"}" with {totalQuestions} questions has been created.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <FileText className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div>
              <CheckCircle2 className="w-6 h-6 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">Ready</p>
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onReviewQuestions}>
          <Eye className="w-4 h-4 mr-2" />
          Review Questions
        </Button>
        <Button onClick={onBackToExams}>
          Back to Exams
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
