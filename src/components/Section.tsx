import Collapsible from "./Collapsible";

// A collapsible CV section in the two-column layout: label on the left, content
// on the right (like the Word CV). `wide` lets the content span both columns,
// for blocks that carry their own label column (experience facts, phases).
export default function Section({
  id,
  title,
  toggleLabel,
  wide = false,
  children,
}: {
  id: string;
  title: string;
  toggleLabel: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible
      as="section"
      className={wide ? "cv-section is-wide" : "cv-section"}
      headingTag="h2"
      headingId={id}
      heading={title}
      bodyClassName="cv-body"
      toggleLabel={toggleLabel}
    >
      {children}
    </Collapsible>
  );
}
