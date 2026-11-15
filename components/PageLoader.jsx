import Shell from "./Shell";

// Shown while the admin panel or student portal loads its data, so the page never looks frozen or blank.
export default function PageLoader({ label }) {
  return (
    <Shell>
      <section className="pageload" role="status" aria-live="polite" aria-label={label}>
        <div className="pageload-top"><span className="spin big" aria-hidden="true" /><p>{label}</p></div>
        <div className="portal skel" aria-hidden="true">
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
