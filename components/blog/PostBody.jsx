import { slugify } from "../../lib/posts";

// Renders the blocks of a post (see lib/posts.js).
export default function PostBody({ body }) {
  return (
    <>
      {body.map((b, i) => {
        if (typeof b === "string") return <p key={i}>{b}</p>;
        if (b.h) return <h2 key={i} id={slugify(b.h)}>{b.h}</h2>;
        if (b.ul) return <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
        if (b.ol) return <ol key={i}>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
        if (b.tip) return <aside key={i} className="bl-tip"><b>Tip</b><span>{b.tip}</span></aside>;
        if (b.code) return <pre key={i} className="bl-code"><code>{b.code}</code></pre>;
        return null;
      })}
    </>
  );
}
