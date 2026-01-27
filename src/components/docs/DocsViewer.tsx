import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DocsViewerProps {
  docPath: string;
  className?: string;
}

// Import all markdown files from docs folder
const markdownModules = import.meta.glob("/docs/**/*.md", {
  query: "?raw",
  import: "default",
});

export function DocsViewer({ docPath, className }: DocsViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMarkdown() {
      setLoading(true);
      setError(null);

      // Try to find the markdown file
      const filePath = `/docs/${docPath}.md`;
      const loader = markdownModules[filePath];

      if (!loader) {
        setError(`Documentation not found: ${docPath}`);
        setLoading(false);
        return;
      }

      try {
        const mdContent = (await loader()) as string;
        setContent(mdContent);
      } catch (err) {
        setError(`Failed to load documentation: ${docPath}`);
        console.error("Error loading markdown:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMarkdown();
  }, [docPath]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="animate-pulse text-muted-foreground">
          Loading documentation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full gap-4", className)}>
        <div className="text-4xl">📄</div>
        <div className="text-muted-foreground text-center">
          <p className="font-medium">Documentation Not Found</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <article className="prose prose-slate dark:prose-invert max-w-none p-4 md:p-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom heading styles
            h1: ({ children }) => (
              <h1 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">
                {children}
              </h3>
            ),
            // Custom table styles
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-muted/50">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 text-sm text-foreground/80 border-b border-border/50">
                {children}
              </td>
            ),
            // Custom code blocks
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code
                  className={cn(
                    "block bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm font-mono",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-muted/50 rounded-lg overflow-x-auto my-4">
                {children}
              </pre>
            ),
            // Custom list styles
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 text-foreground/80 my-3">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 text-foreground/80 my-3">
                {children}
              </ol>
            ),
            // Custom blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            ),
            // Custom links
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-primary hover:underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            ),
            // Paragraphs
            p: ({ children }) => (
              <p className="text-foreground/80 leading-relaxed my-3">{children}</p>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </ScrollArea>
  );
}
