import Shell from "./Shell";
import { CONTACT } from "../lib/legal";

export default function Legal({ title, intro, sections }) {
  return (
    <Shell>
      <article className="prose" style={{ padding: "32px 0 56px" }}>
        <h1 style={{ fontSize: "clamp(32px,5vw,46px)", marginBottom: 8 }}>{title}</h1>
        <p className="m" style={{ color: "var(--mute)" }}>Last updated: {CONTACT.updated}</p>
        <p>{intro}</p>
        {sections.map(([h, paras]) => (
          <div key={h}>
            <h2 style={{ fontSize: 24, margin: "28px 0 8px" }}>{h}</h2>
            {paras.map((p, i) => <p key={i} style={{ fontSize: 17 }}>{p}</p>)}
          </div>
        ))}
        <h2 style={{ fontSize: 24, margin: "28px 0 8px" }}>Contact us</h2>
        <p style={{ fontSize: 17 }}>{CONTACT.name}<br />Email: {CONTACT.email}<br />Phone / WhatsApp: {CONTACT.phone}<br />Address: {CONTACT.address}</p>
      </article>
    </Shell>
  );
}
