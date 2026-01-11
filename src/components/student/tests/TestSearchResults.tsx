// Test Search Results - Shows filtered tests from search query
// Displays compact test rows with subject badges

import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CompactTestRow from "./CompactTestRow";
import type { StudentTest } from "@/data/student/tests";

// Subject color mapping for badges
const subjectColorMap: Record<string, { bg: string; text: string }> = {
  physics: { bg: "bg-violet-50", text: "text-violet-600" },
  chemistry: { bg: "bg-emerald-50", text: "text-emerald-600" },
  mathematics: { bg: "bg-blue-50", text: "text-blue-600" },
  math: { bg: "bg-blue-50", text: "text-blue-600" },
  biology: { bg: "bg-rose-50", text: "text-rose-600" },
  english: { bg: "bg-amber-50", text: "text-amber-600" },
  cs: { bg: "bg-cyan-50", text: "text-cyan-600" },
};

interface TestSearchResultsProps {
  results: StudentTest[];
  query: string;
  onClearSearch: () => void;
  className?: string;
}

const TestSearchResults = memo(function TestSearchResults({
  results,
  query,
  onClearSearch,
  className,
}: TestSearchResultsProps) {
  const navigate = useNavigate();

  const handleStartTest = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}`);
  }, [navigate]);

  const handleViewTest = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}`);
  }, [navigate]);

  const handleViewResults = useCallback((testId: string) => {
    navigate(`/student/tests/${testId}/results`);
  }, [navigate]);

  // Group results by subject for better organization
  const groupedResults = results.reduce((acc, test) => {
    const subject = test.subject || "Other";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(test);
    return acc;
  }, {} as Record<string, StudentTest[]>);

  return (
    <div className={cn("", className)}>
      {/* Search Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
          </span>
        </div>
        <button
          onClick={onClearSearch}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-white/60"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedResults).map(([subject, tests]) => {
            const colors = subjectColorMap[subject.toLowerCase()] || { bg: "bg-gray-50", text: "text-gray-600" };
            const displayName = subject.charAt(0).toUpperCase() + subject.slice(1);

            return (
              <div key={subject}>
                {/* Subject Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", colors.bg, colors.text)}>
                    {displayName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {tests.length} {tests.length === 1 ? "test" : "tests"}
                  </span>
                </div>

                {/* Test List */}
                <div className="space-y-2">
                  {tests.map((test) => (
                    <CompactTestRow
                      key={test.id}
                      test={test}
                      onStart={handleStartTest}
                      onView={handleViewTest}
                      onResults={handleViewResults}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
          <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground">No tests found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
});

export default TestSearchResults;
