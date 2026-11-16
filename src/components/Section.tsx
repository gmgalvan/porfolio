// Collapsible section built on native <details>: works without JavaScript,
// keyboard accessible, and opens by default.
export default function Section({
  id,
  title,
  toggleLabel,
  children,
}: {
  id: string;
  title: string;
  toggleLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <details open className="collapsible">
        <summary title={toggleLabel}>
          <h2 id={id}>{title}</h2>
          <span className="chevron" aria-hidden="true" />
        </summary>
        <div className="collapsible-body">{children}</div>
      </details>
    </section>
  );
}
