// "Good day, Name" with today's date in Lagos time. Rendered on the server, so the date is always current.
export default function Greeting({ name, badge }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Africa/Lagos" });
  return (
    <div className="greet">
      <h3>Good day, {name} 👋</h3>
      <p>Today’s Date: {today}</p>
      {badge && <span className="pill gold">{badge}</span>}
    </div>
  );
}
