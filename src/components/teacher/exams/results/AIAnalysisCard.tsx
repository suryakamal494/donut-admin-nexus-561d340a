import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import type { ExamAnalytics } from "@/data/teacher/examResults";

interface AIAnalysisCardProps {
  analytics: ExamAnalytics;
  examName: string;
}

export const AIAnalysisCard = ({ analytics, examName }: AIAnalysisCardProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-exam-results", {
        body: {
          examName,
          totalStudents: analytics.totalStudents,
          averageScore: analytics.averageScore,
          highestScore: analytics.highestScore,
          lowestScore: analytics.lowestScore,
          passPercentage: analytics.passPercentage,
          scoreDistribution: analytics.scoreDistribution,
          questionAnalysis: analytics.questionAnalysis.map((q) => ({
            questionNumber: q.questionNumber,
            topic: q.topic,
            successRate: q.successRate,
            difficulty: q.difficulty,
            cognitiveType: q.cognitiveType,
            correctAttempts: q.correctAttempts,
            incorrectAttempts: q.incorrectAttempts,
            unattempted: q.unattempted,
          })),
        },
      });

      if (error) throw error;
      setAnalysis(data?.analysis || "No analysis generated.");
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err?.message?.includes("429") || err?.status === 429) {
        toast.error("Too many requests. Please try again in a moment.");
      } else if (err?.message?.includes("402") || err?.status === 402) {
        toast.error("AI credits exhausted. Please add credits in Settings → Usage.");
      } else {
        toast.error("Failed to generate analysis. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-Powered Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground max-w-sm">
              Get a concise summary of what went well, what needs reteaching, and recommended next steps.
            </p>
            <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Analyze Results"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
            <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
