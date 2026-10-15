import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <div>
        <p className="eyebrow">
          <span />
          404 / Not found
        </p>
        <h1>This page took a different turn.</h1>
        <p>The address may have changed, or the page may no longer be here.</p>
        <div className="not-found-actions">
          <Link className="button button-dark" href="/">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to the home page
          </Link>
          <Link className="underlined-link" href="/contact">
            Need a hand? <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
