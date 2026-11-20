import Shell from "./Shell";

// Shown while the admin panel or student portal loads its data, so the page never looks frozen or blank.
export default function PageLoader({ label }) {
  return (
    <Shell>
      <section className="pageload" role="status" aria-live="polite" aria-label={label}>
<div className="pageload-top">
  <span className="spin big" aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => (
      <i
        key={i}
        style={{
          transform: `rotate(${i * 30}deg) translate(146%)`,
          animationDelay: `calc(var(--duration, 1.2s) / 12 * ${i - 12})`,
        }}
      />
    ))}
  </span>
  <p>{label}</p>
</div>        <div className="portal skel" aria-hidden="true">
          <aside className="skel-side"><i /><i /><i /><i /><i /></aside>
          <main className="skel-main">
            <div className="skel-hero" />
            <div className="skel-row"><div /><div /><div /></div>
            <div className="skel-block" />
            <div className="skel-block short" />
          </main>
        </div>
      </section>
    </Shell>
  );
}
