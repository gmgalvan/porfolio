"use client";

import { useId, useState } from "react";

// Disclosure block: the heading holds a button that shows/hides the body.
// Renders open (also without JavaScript); print always shows the body (CSS).
export default function Collapsible({
  as: Tag = "div",
  className,
  headingTag: Heading,
  headingId,
  headingClassName,
  heading,
  aside,
  bodyClassName,
  toggleLabel,
  children,
}: {
  as?: "section" | "li" | "div";
  className: string;
  headingTag: "h2" | "h3" | "h4";
  headingId?: string;
  headingClassName?: string;
  heading: React.ReactNode;
  /** Extra content next to the heading (e.g. the employer period). */
  aside?: React.ReactNode;
  bodyClassName: string;
  toggleLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();

  const head = (
    <Heading id={headingId} className={headingClassName}>
      <button
        type="button"
        className="collapse-btn"
        aria-expanded={open}
        aria-controls={bodyId}
        title={toggleLabel}
        onClick={() => setOpen(!open)}
      >
        <span>{heading}</span>
        <span className="chevron" aria-hidden="true" />
      </button>
    </Heading>
  );

  return (
    <Tag
      className={`${className}${open ? "" : " is-collapsed"}`}
      aria-labelledby={Tag === "section" ? headingId : undefined}
    >
      {aside ? (
        <header className="collapse-head">
          {head}
          {aside}
        </header>
      ) : (
        head
      )}
      <div id={bodyId} className={`collapse-body ${bodyClassName}`}>
        {children}
      </div>
    </Tag>
  );
}
