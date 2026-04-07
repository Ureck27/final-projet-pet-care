"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified and is looking into the issue.
      </p>
      <div className="flex items-center space-x-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
