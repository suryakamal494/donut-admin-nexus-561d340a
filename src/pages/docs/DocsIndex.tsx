import { Link } from "react-router-dom";
import { docsNavigation } from "@/data/docsNavigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocsIndex() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            DonutAI Documentation
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Comprehensive documentation for all DonutAI portals, cross-login flows,
            testing scenarios, and technical architecture.
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {docsNavigation.map((section) => (
            <Link
              key={section.title}
              to={`/docs/${section.items[0].path}`}
              className="block group"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{section.icon}</span>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {section.items.length} topics
                    {section.items.some((i) => i.children) && " with sub-sections"}
                  </CardDescription>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {section.items.slice(0, 4).map((item) => (
                      <span
                        key={item.path}
                        className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                      >
                        {item.title}
                      </span>
                    ))}
                    {section.items.length > 4 && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        +{section.items.length - 4} more
                      </span>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 md:mt-12 p-4 md:p-6 bg-muted/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Link
              to="/docs/00-overview/README"
              className="text-sm text-primary hover:underline"
            >
              → Getting Started
            </Link>
            <Link
              to="/docs/05-cross-login-flows/README"
              className="text-sm text-primary hover:underline"
            >
              → Cross-Login Flows
            </Link>
            <Link
              to="/docs/06-testing-scenarios/README"
              className="text-sm text-primary hover:underline"
            >
              → Testing Scenarios
            </Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
