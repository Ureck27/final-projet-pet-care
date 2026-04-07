"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 border rounded-lg bg-destructive/10 text-center flex flex-col items-center justify-center min-h-[200px]">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 text-sm max-w-sm">
            {this.state.error?.message || "An unexpected error occurred in this component."}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
