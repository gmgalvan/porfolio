"use client";

import { useEffect } from "react";

// Opens every collapsed section while printing, then restores them.
export default function PrintButton({ label }: { label: string }) {
  useEffect(() => {
    let closed: HTMLDetailsElement[] = [];
    const before = () => {
      closed = Array.from(document.querySelectorAll<HTMLDetailsElement>("details.collapsible:not([open])"));
      closed.forEach((d) => (d.open = true));
    };
    const after = () => {
      closed.forEach((d) => (d.open = false));
      closed = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <button type="button" className="bar-button" onClick={() => window.print()}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
      </svg>
      {label}
    </button>
  );
}
