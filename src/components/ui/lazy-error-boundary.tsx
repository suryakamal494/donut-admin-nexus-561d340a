import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
  isRetrying: boolean;
}

const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 2000]; // 1s, then 2s

class LazyErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy loading error:", error, errorInfo);
    
    // Auto-retry if we haven't exceeded max retries
    if (this.state.retryCount < MAX_RETRIES) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  scheduleRetry = () => {
    const delay = RETRY_DELAYS[this.state.retryCount] || 2000;
    this.setState({ isRetrying: true });
    
    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
        isRetrying: false,
      }));
    }, delay);
  };

  handleRetry = () => {
    // Reset retry count and try again
    this.setState({ 
      hasError: false, 
      error: undefined, 
      retryCount: 0,
      isRetrying: false 
    });
  };

  handleHardRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Show retrying state
      if (this.state.isRetrying) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              Retrying... (attempt {this.state.retryCount + 1}/{MAX_RETRIES})
            </p>
          </div>
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      const hasExhaustedRetries = this.state.retryCount >= MAX_RETRIES;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load page
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {hasExhaustedRetries 
              ? "We tried multiple times but couldn't load this page. Please check your connection and try again."
              : "There was a problem loading this page. This might be due to a network issue."
            }
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            {hasExhaustedRetries && (
              <Button onClick={this.handleHardRefresh} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </Button>
            )}
          </div>
        </div>
      );
    }

    // KEY FIX: Use retryCount as key to force complete remount & fresh import
    return (
      <div key={`lazy-boundary-${this.state.retryCount}`}>
        {this.props.children}
      </div>
    );
  }
}

export default LazyErrorBoundary;
