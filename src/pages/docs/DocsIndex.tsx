import { Link } from "react-router-dom";
import { docsNavigation } from "@/data/docsNavigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DocsIndex() {
  return (
    <div className="p-3 md:p-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold gradient-text mb-2 md:mb-3">
          DonutAI Documentation
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Comprehensive documentation for all DonutAI portals, cross-login flows,
          testing scenarios, and technical architecture.
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {docsNavigation.map((section) => (
          <Link
            key={section.title}
            to={`/docs/${section.items[0].path}`}
            className="block group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
              <CardHeader className="p-3 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                  <span className="text-xl md:text-2xl">{section.icon}</span>
                  <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  {section.items.length} topics
                  {section.items.some((i) => i.children) && " with sub-sections"}
                </CardDescription>
                <div className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-1.5">
                  {section.items.slice(0, 3).map((item) => (
                    <span
                      key={item.path}
                      className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-muted rounded-full text-muted-foreground truncate max-w-[120px]"
                    >
                      {item.title}
                    </span>
                  ))}
                  {section.items.length > 3 && (
                    <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      +{section.items.length - 3} more
                    </span>
                  )}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-6 md:mt-12 p-3 md:p-6 bg-muted/30 rounded-xl">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h2>
        <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Link
            to="/docs/00-overview/README"
            className="text-xs md:text-sm text-primary hover:underline"
          >
            → Getting Started
          </Link>
          <Link
            to="/docs/05-cross-login-flows/README"
            className="text-xs md:text-sm text-primary hover:underline"
          >
            → Cross-Login Flows
          </Link>
          <Link
            to="/docs/06-testing-scenarios/README"
            className="text-xs md:text-sm text-primary hover:underline"
          >
            → Testing Scenarios
          </Link>
        </div>
      </div>
    </div>
  );
}
