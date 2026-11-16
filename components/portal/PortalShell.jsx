const NAV = [
  ["home", "/portal", "Dashboard", "🏠"],
  ["courses", "/portal/courses", "My courses", "📚"],
  ["lessons", "/portal/lessons", "Lessons", "▶️"],
  ["quizzes", "/portal/quizzes", "Quizzes", "❓"],
  ["payments", "/portal/payments", "Payments", "💰"],
  ["attendance", "/portal/attendance", "Attendance", "📅"],
  ["profile", "/portal/profile", "Profile", "👤"],
];

// inside the map:
{NAV.map(([k, href, label, icon]) => (
  <Link key={k} href={href} className={k === active ? "on" : ""}>
    <span className="side-icon" aria-hidden="true">{icon}</span> {label}
  </Link>
))}