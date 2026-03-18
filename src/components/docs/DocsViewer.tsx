import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-pulse text-muted-foreground">
          Loading documentation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 gap-4", className)}>
        <div className="text-4xl">📄</div>
        <div className="text-muted-foreground text-center">
          <p className="font-medium">Documentation Not Found</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <article className={cn(
      "prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none",
      "px-3 py-4 md:px-8 md:py-8",
      "break-words",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl md:text-3xl font-bold text-foreground border-b border-border pb-3 mb-4 md:mb-6 break-words">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-2xl font-semibold text-foreground mt-6 md:mt-8 mb-3 md:mb-4 break-words">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-xl font-semibold text-foreground mt-4 md:mt-6 mb-2 md:mb-3 break-words">
              {children}
            </h3>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 my-4">
              <table className="min-w-full border border-border rounded-lg overflow-hidden text-xs md:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm font-semibold text-foreground border-b border-border whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 md:px-4 py-2 text-xs md:text-sm text-foreground/80 border-b border-border/50">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-muted px-1 py-0.5 rounded text-xs md:text-sm font-mono text-primary break-all"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "block bg-muted/50 p-3 md:p-4 rounded-lg overflow-x-auto text-xs md:text-sm font-mono",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted/50 rounded-lg overflow-x-auto my-4 -mx-3 md:mx-0">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 md:pl-6 space-y-1 text-foreground/80 my-3 text-sm md:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 md:pl-6 space-y-1 text-foreground/80 my-3 text-sm md:text-base">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-3 md:pl-4 italic text-muted-foreground my-4 text-sm md:text-base">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline break-all"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p className="text-foreground/80 leading-relaxed my-2 md:my-3 text-sm md:text-base">{children}</p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
