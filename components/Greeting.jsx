// "Good day, Name" with today's date in Lagos time. Rendered on the server, so the date is always current.
import Avatar from "./Avatar";

export default function Greeting({ name, badge, avatar }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Africa/Lagos" });
  return (
    <div className={avatar ? "greet hero-who" : "greet"}>
      {avatar && <Avatar name={name} src={avatar} size={64} />}
      <div>
        <h3>Good day, {name} 👋</h3>
        <p>Today’s Date: {today}</p>
        {badge && <span className="pill gold">{badge}</span>}
      </div>
    </div>
  );
}
