"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("An unexpected page error occurred.", error);
  }, [error]);

  return (
    <main id="main" className="not-found-page">
      <div>
        <p className="eyebrow">
          <span />
          Something went wrong
        </p>
        <h1>We could not load this page.</h1>
        <p>
          Please try again. If the problem continues, return to the home page
          and start from there.
        </p>
        <div className="not-found-actions">
          <button className="button button-dark" onClick={reset} type="button">
            <RotateCcw aria-hidden="true" size={15} />
            Try again
          </button>
          <Link className="underlined-link" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
