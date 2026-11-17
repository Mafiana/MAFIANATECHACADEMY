// Round profile picture. Shows the photo if there is one, otherwise the person's initials.
export default function Avatar({ name = "", src = "", size = 36, className = "" }) {
  const initials = String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
  return (
    <span className={"avatar " + className} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">
      {src ? <img src={src} alt="" width={size} height={size} /> : initials}
    </span>
  );
}
